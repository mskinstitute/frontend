from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404
from decimal import Decimal
from datetime import timedelta

from .models import (
    Affiliate,
    CommissionSettings,
    CommissionOverride,
    Referral,
    ReferralEvent,
    DemoBooking,
    Enrollment,
    EnrollmentPayment,
    CommissionEntry,
    PayoutRequest,
    AuditLog,
)
from .serializers import (
    DemoBookingSerializer,
    CommissionEntrySerializer,
    PayoutRequestSerializer,
)
from .services import CommissionEngine, NotificationService
from django.contrib.auth import get_user_model

User = get_user_model()


class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            role = getattr(request.user, 'role', '')
            return request.user.is_staff or request.user.is_superuser or role == 'admin'
        return False


# =============================================================================
# 1. ADMIN DEMO MANAGEMENT
# =============================================================================

class AdminDemosAPIView(APIView):
    """View and manage booked free 2-day demo classes."""
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        qs = DemoBooking.objects.select_related('student', 'referral__affiliate').all().order_by('-created_at')

        status_param = request.query_params.get('status')
        mode_param = request.query_params.get('mode')
        search = request.query_params.get('search')

        if status_param:
            qs = qs.filter(status=status_param)
        if mode_param:
            qs = qs.filter(learning_mode=mode_param)
        if search:
            qs = qs.filter(
                student__first_name__icontains=search
            ) | qs.filter(student__email__icontains=search) | qs.filter(course_name__icontains=search)

        results = []
        for d in qs[:100]:
            results.append({
                'id': d.id,
                'student_name': d.student.get_full_name(),
                'student_email': d.student.email,
                'student_phone': d.student.phone,
                'course_name': d.course_name,
                'learning_mode': d.learning_mode,
                'preferred_slot': d.preferred_slot,
                'scheduled_date': str(d.scheduled_date) if d.scheduled_date else None,
                'day1_attended': d.day1_attended,
                'day1_attended_at': d.day1_attended_at,
                'day2_attended': d.day2_attended,
                'day2_attended_at': d.day2_attended_at,
                'status': d.status,
                'referral_affiliate': d.referral.affiliate.name if d.referral else None,
                'created_at': d.created_at,
            })

        return Response(results, status=status.HTTP_200_OK)

    def patch(self, request, pk=None):
        demo = get_object_or_404(DemoBooking, pk=pk)
        action = request.data.get('action')  # 'mark_day1', 'mark_day2', 'complete', 'no_show', 'reschedule'

        with transaction.atomic():
            old_status = demo.status
            now = timezone.now()

            if action == 'mark_day1':
                demo.day1_attended = True
                demo.day1_attended_at = now
                if demo.status == 'SCHEDULED':
                    demo.status = 'DAY1_DONE'
                if demo.referral:
                    ReferralEvent.objects.create(
                        referral=demo.referral,
                        event_type='DEMO_ATTENDED_DAY1',
                        actor=request.user,
                        metadata={'demo_id': demo.id}
                    )

            elif action == 'mark_day2':
                demo.day2_attended = True
                demo.day2_attended_at = now
                # Both days attended -> Demo completed!
                demo.status = 'COMPLETED'
                if demo.referral:
                    demo.referral.current_stage = 'DEMO_COMPLETED'
                    demo.referral.save(update_fields=['current_stage', 'updated_at'])
                    ReferralEvent.objects.create(
                        referral=demo.referral,
                        event_type='DEMO_COMPLETED',
                        from_stage=demo.referral.current_stage,
                        to_stage='DEMO_COMPLETED',
                        actor=request.user,
                        metadata={'demo_id': demo.id}
                    )
                    if demo.referral.affiliate.user:
                        first_initial = f"{demo.student.first_name} {demo.student.last_name[:1]}." if demo.student.last_name else demo.student.first_name
                        NotificationService.send(
                            recipient=demo.referral.affiliate.user,
                            title="Demo Completed! 🎓",
                            message=f"{first_initial} has completed their 2-day demo for {demo.course_name} and is ready for enrollment.",
                            channel='IN_APP'
                        )

            elif action == 'no_show':
                demo.status = 'NO_SHOW'
                if demo.referral:
                    demo.referral.current_stage = 'DEMO_NO_SHOW'
                    demo.referral.save(update_fields=['current_stage', 'updated_at'])
                    ReferralEvent.objects.create(
                        referral=demo.referral,
                        event_type='DEMO_NO_SHOW',
                        actor=request.user,
                        metadata={'demo_id': demo.id}
                    )

            elif action == 'reschedule':
                new_date = request.data.get('scheduled_date')
                demo.scheduled_date = new_date
                demo.status = 'RESCHEDULED'
                if demo.referral:
                    ReferralEvent.objects.create(
                        referral=demo.referral,
                        event_type='DEMO_RESCHEDULED',
                        actor=request.user,
                        metadata={'demo_id': demo.id, 'new_date': new_date}
                    )

            elif action == 'complete':
                demo.day1_attended = True
                demo.day2_attended = True
                demo.status = 'COMPLETED'
                if demo.referral:
                    demo.referral.current_stage = 'DEMO_COMPLETED'
                    demo.referral.save(update_fields=['current_stage', 'updated_at'])
                    ReferralEvent.objects.create(
                        referral=demo.referral,
                        event_type='DEMO_COMPLETED',
                        actor=request.user,
                        metadata={'demo_id': demo.id}
                    )

            demo.save()

        return Response({
            'success': True,
            'demo': DemoBookingSerializer(demo).data
        }, status=status.HTTP_200_OK)


# =============================================================================
# 2. ADMIN ENROLLMENTS, PAYMENTS & REFUNDS
# =============================================================================

class AdminEnrollmentsAPIView(APIView):
    """Enroll student, collect fee installments, and reverse on refund."""
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        enrollments = Enrollment.objects.select_related('student', 'referral__affiliate').all().order_by('-created_at')
        results = []
        for e in enrollments[:100]:
            results.append({
                'id': e.id,
                'student_id': e.student.id,
                'student_name': e.student.get_full_name(),
                'student_email': e.student.email,
                'student_phone': e.student.phone,
                'course_name': e.course_name,
                'gross_fee_inr': e.gross_fee_paise / 100.0,
                'discount_percent': e.discount_percent,
                'discount_inr': e.discount_paise / 100.0,
                'net_fee_inr': e.net_fee_paise / 100.0,
                'fee_collected_inr': e.fee_collected_paise / 100.0,
                'balance_due_inr': max(0.0, (e.net_fee_paise - e.fee_collected_paise) / 100.0),
                'applied_commission_rate': float(e.applied_commission_rate),
                'status': e.status,
                'referral_affiliate': e.referral.affiliate.name if e.referral else None,
                'enrolled_at': e.enrolled_at,
            })
        return Response(results, status=status.HTTP_200_OK)

    def post(self, request):
        student_id = request.data.get('student_id')
        course_name = request.data.get('course_name')
        gross_fee_inr = float(request.data.get('gross_fee_inr', 0))
        discount_percent = int(request.data.get('discount_percent', 0))

        student = get_object_or_404(User, pk=student_id)
        gross_fee_paise = int(round(gross_fee_inr * 100))

        enrollment = CommissionEngine.create_enrollment(
            student=student,
            course_name=course_name,
            gross_fee_paise=gross_fee_paise,
            discount_percent=discount_percent,
            actor=request.user
        )

        return Response({
            'success': True,
            'enrollment_id': enrollment.id,
            'applied_commission_rate': float(enrollment.applied_commission_rate),
            'net_fee_inr': enrollment.net_fee_paise / 100.0,
        }, status=status.HTTP_201_CREATED)


class AdminRecordPaymentAPIView(APIView):
    """Records offline cash or UPI payment and accrues commission proportionally."""
    permission_classes = [IsAdminOrStaff]

    def post(self, request, pk=None):
        enrollment = get_object_or_404(Enrollment, pk=pk)
        amount_inr = float(request.data.get('amount_inr', 0))
        payment_method = request.data.get('payment_method', 'UPI')
        transaction_ref = request.data.get('transaction_reference', '')
        notes = request.data.get('notes', '')

        if amount_inr <= 0:
            return Response({'error': 'Amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

        amount_paise = int(round(amount_inr * 100))
        payment, comm = CommissionEngine.record_payment_and_accrue_commission(
            enrollment=enrollment,
            amount_paise=amount_paise,
            payment_method=payment_method,
            transaction_reference=transaction_ref,
            actor=request.user,
            notes=notes
        )

        return Response({
            'success': True,
            'payment_id': payment.id,
            'receipt_number': payment.receipt_number,
            'commission_accrued_inr': (comm.commission_amount_paise / 100.0) if comm else 0.0,
            'commission_status': comm.status if comm else None,
        }, status=status.HTTP_201_CREATED)


class AdminRefundPaymentAPIView(APIView):
    """Refunds payment installment and atomically reverses related commission."""
    permission_classes = [IsAdminOrStaff]

    def post(self, request, pk=None):
        payment = get_object_or_404(EnrollmentPayment, pk=pk)
        reason = request.data.get('reason', 'Administrative refund')

        success = CommissionEngine.process_refund(
            payment=payment,
            reason=reason,
            actor=request.user
        )

        return Response({
            'success': success,
            'message': 'Payment refunded and linked commission reversed successfully.'
        }, status=status.HTTP_200_OK)


# =============================================================================
# 3. ADMIN SETTINGS & AUDIT LOG
# =============================================================================

class AdminCommissionSettingsAPIView(APIView):
    """View and update global commission settings with mandatory audit logging."""
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        settings_obj = CommissionSettings.get_settings()
        return Response({
            'global_default_rate': float(settings_obj.global_default_rate),
            'student_scholarship_percent': settings_obj.student_scholarship_percent,
            'clearance_days': settings_obj.clearance_days,
            'min_payout_inr': settings_obj.min_payout_paise / 100.0,
            'max_commission_cap_inr': (settings_obj.max_commission_cap_paise / 100.0) if settings_obj.max_commission_cap_paise is not None else None,
            'followup_no_demo_hours': settings_obj.followup_no_demo_hours,
            'followup_no_enroll_hours': settings_obj.followup_no_enroll_hours,
        }, status=status.HTTP_200_OK)

    def patch(self, request):
        settings_obj = CommissionSettings.get_settings()
        old_data = {
            'global_default_rate': float(settings_obj.global_default_rate),
            'student_scholarship_percent': settings_obj.student_scholarship_percent,
            'clearance_days': settings_obj.clearance_days,
            'min_payout_paise': settings_obj.min_payout_paise,
        }

        if 'global_default_rate' in request.data:
            settings_obj.global_default_rate = Decimal(str(request.data['global_default_rate']))
        if 'student_scholarship_percent' in request.data:
            settings_obj.student_scholarship_percent = int(request.data['student_scholarship_percent'])
        if 'clearance_days' in request.data:
            settings_obj.clearance_days = int(request.data['clearance_days'])
        if 'min_payout_inr' in request.data:
            settings_obj.min_payout_paise = int(round(float(request.data['min_payout_inr']) * 100))
        if 'max_commission_cap_inr' in request.data:
            cap_val = request.data['max_commission_cap_inr']
            settings_obj.max_commission_cap_paise = int(round(float(cap_val) * 100)) if cap_val is not None else None

        settings_obj.save()

        new_data = {
            'global_default_rate': float(settings_obj.global_default_rate),
            'student_scholarship_percent': settings_obj.student_scholarship_percent,
            'clearance_days': settings_obj.clearance_days,
            'min_payout_paise': settings_obj.min_payout_paise,
        }

        # Write to audit log
        AuditLog.objects.create(
            actor=request.user,
            action='COMMISSION_SETTINGS_UPDATED',
            entity_type='CommissionSettings',
            entity_id=str(settings_obj.id),
            old_value=old_data,
            new_value=new_data
        )

        return Response({
            'success': True,
            'message': 'Settings updated successfully.',
            'settings': {
                'global_default_rate': float(settings_obj.global_default_rate),
                'student_scholarship_percent': settings_obj.student_scholarship_percent,
                'clearance_days': settings_obj.clearance_days,
                'min_payout_inr': settings_obj.min_payout_paise / 100.0,
            }
        }, status=status.HTTP_200_OK)


class AdminAffiliateRateOverrideAPIView(APIView):
    """Set custom commission rate for an affiliate with confirmation audit logging."""
    permission_classes = [IsAdminOrStaff]

    def post(self, request, pk=None):
        affiliate = get_object_or_404(Affiliate, pk=pk)
        new_rate = Decimal(str(request.data.get('commission_rate')))
        course_name = request.data.get('course_name', '').strip()

        old_rate = float(affiliate.commission_rate)

        with transaction.atomic():
            if course_name:
                override, _ = CommissionOverride.objects.update_or_create(
                    affiliate=affiliate,
                    course_name=course_name,
                    defaults={'commission_rate': new_rate, 'active': True}
                )
            else:
                affiliate.commission_rate = new_rate
                affiliate.custom_rate_active = True
                affiliate.save(update_fields=['commission_rate', 'custom_rate_active', 'updated_at'])

            AuditLog.objects.create(
                actor=request.user,
                action='AFFILIATE_RATE_OVERRIDE',
                entity_type='Affiliate',
                entity_id=str(affiliate.id),
                old_value={'rate': old_rate},
                new_value={'rate': float(new_rate), 'course_name': course_name}
            )

        return Response({
            'success': True,
            'message': f"Commission rate for {affiliate.name} set to {new_rate}%.",
            'commission_rate': float(new_rate)
        }, status=status.HTTP_200_OK)


# =============================================================================
# 4. ADMIN PAYOUT QUEUE
# =============================================================================

class AdminPayoutQueueAPIView(APIView):
    """Manage affiliate payout requests: approve, or mark paid with UTR reference."""
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        payouts = PayoutRequest.objects.select_related('affiliate').all().order_by('-requested_at')
        results = []
        for p in payouts:
            results.append({
                'id': p.id,
                'affiliate_id': p.affiliate.id,
                'affiliate_name': p.affiliate.name,
                'affiliate_code': p.affiliate.affiliate_code,
                'amount_inr': p.amount_paise / 100.0,
                'upi_destination': p.upi_destination,
                'pan_number': p.affiliate.pan_number,
                'status': p.status,
                'utr_reference': p.utr_reference,
                'requested_at': p.requested_at,
                'processed_at': p.processed_at,
                'admin_notes': p.admin_notes,
            })
        return Response(results, status=status.HTTP_200_OK)

    def patch(self, request, pk=None):
        payout = get_object_or_404(PayoutRequest, pk=pk)
        action = request.data.get('action')  # 'approve', 'mark_paid', 'reject'
        utr = request.data.get('utr_reference', '').strip()
        notes = request.data.get('admin_notes', '')

        with transaction.atomic():
            if action == 'approve':
                payout.status = 'APPROVED'
            elif action == 'mark_paid':
                if not utr:
                    return Response({'error': 'UTR reference is required when marking payout paid.'}, status=status.HTTP_400_BAD_REQUEST)
                payout.status = 'PAID'
                payout.utr_reference = utr
                payout.processed_at = timezone.now()
                payout.processed_by = request.user

                # Mark corresponding approved commission entries as PAID
                approved_entries = CommissionEntry.objects.filter(
                    affiliate=payout.affiliate,
                    status='APPROVED'
                ).order_by('created_at')

                remaining_to_pay = payout.amount_paise
                for entry in approved_entries:
                    if remaining_to_pay <= 0:
                        break
                    entry.status = 'PAID'
                    entry.paid_at = timezone.now()
                    entry.save(update_fields=['status', 'paid_at'])
                    remaining_to_pay -= entry.commission_amount_paise

                if payout.affiliate.user:
                    NotificationService.send(
                        recipient=payout.affiliate.user,
                        title="Payout Transferred! 🏦",
                        message=f"₹{payout.amount_paise / 100:.2f} has been transferred to {payout.upi_destination} (UTR: {utr}).",
                        channel='IN_APP'
                    )

            elif action == 'reject':
                payout.status = 'REJECTED'

            if notes:
                payout.admin_notes = notes
            payout.save()

            AuditLog.objects.create(
                actor=request.user,
                action=f'PAYOUT_{payout.status}',
                entity_type='PayoutRequest',
                entity_id=str(payout.id),
                new_value={'status': payout.status, 'utr': payout.utr_reference}
            )

        return Response({
            'success': True,
            'status': payout.status,
            'utr_reference': payout.utr_reference
        }, status=status.HTTP_200_OK)


# =============================================================================
# 5. ADMIN FOLLOW-UP QUEUE & AUDIT LOGS
# =============================================================================

class AdminFollowupQueueAPIView(APIView):
    """Students stuck at stage for staff call/WhatsApp outreach."""
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        settings_obj = CommissionSettings.get_settings()
        now = timezone.now()

        # 1. Registered > 24 hours without demo booked
        no_demo_cutoff = now - timedelta(hours=settings_obj.followup_no_demo_hours)
        stuck_registered = Referral.objects.filter(
            current_stage='REGISTERED',
            created_at__lte=no_demo_cutoff
        ).select_related('student', 'affiliate')

        # 2. Demo completed > 48 hours without enrolling
        no_enroll_cutoff = now - timedelta(hours=settings_obj.followup_no_enroll_hours)
        stuck_completed_demos = Referral.objects.filter(
            current_stage='DEMO_COMPLETED',
            events__event_type='DEMO_COMPLETED',
            events__created_at__lte=no_enroll_cutoff
        ).distinct().select_related('student', 'affiliate')

        results = []
        for r in stuck_registered:
            results.append({
                'id': f"reg-{r.id}",
                'referral_id': r.id,
                'student_name': r.student.get_full_name(),
                'phone': r.student.phone,
                'email': r.student.email,
                'course_interest': r.course_interest,
                'reason': f"Registered > {settings_obj.followup_no_demo_hours}h ago with no demo booked",
                'affiliate_name': r.affiliate.name,
                'stage': 'REGISTERED',
                'created_at': r.created_at,
            })

        for r in stuck_completed_demos:
            results.append({
                'id': f"demo-{r.id}",
                'referral_id': r.id,
                'student_name': r.student.get_full_name(),
                'phone': r.student.phone,
                'email': r.student.email,
                'course_interest': r.course_interest,
                'reason': f"Demo Completed > {settings_obj.followup_no_enroll_hours}h ago without enrolling",
                'affiliate_name': r.affiliate.name,
                'stage': 'DEMO_COMPLETED',
                'created_at': r.created_at,
            })

        return Response(results, status=status.HTTP_200_OK)


class AdminAuditLogAPIView(APIView):
    """View system audit logs."""
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        logs = AuditLog.objects.select_related('actor').all().order_by('-timestamp')[:100]
        results = []
        for l in logs:
            results.append({
                'id': l.id,
                'actor_name': l.actor.get_full_name() if l.actor else "System",
                'action': l.action,
                'entity_type': l.entity_type,
                'entity_id': l.entity_id,
                'old_value': l.old_value,
                'new_value': l.new_value,
                'timestamp': l.timestamp,
            })
        return Response(results, status=status.HTTP_200_OK)
