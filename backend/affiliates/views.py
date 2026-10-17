from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum
from decimal import Decimal

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
    Notification,
    AuditLog,
    ClickTracker,
)
from .serializers import (
    AffiliatePreviewSerializer,
    DemoBookingSerializer,
    ReferralListSerializer,
    CommissionEntrySerializer,
    PayoutRequestSerializer,
    NotificationSerializer,
)
from .services import CommissionEngine, AttributionEngine, NotificationService


# =============================================================================
# 1. PUBLIC ATTRIBUTION & TRACKING
# =============================================================================

class TrackClickAPIView(APIView):
    """Logs referral link clicks and short link hits."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ref_code = request.data.get('ref_code', '').strip()
        if not ref_code:
            return Response({'error': 'ref_code is required'}, status=status.HTTP_400_BAD_REQUEST)

        ip = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip() or request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        referer = request.META.get('HTTP_REFERER', '')

        affiliate = AttributionEngine.record_click(
            ref_code=ref_code,
            ip_address=ip,
            user_agent=user_agent,
            referer=referer
        )

        return Response({
            'success': True,
            'tracked': affiliate is not None,
            'affiliate_code': affiliate.affiliate_code if affiliate else None
        }, status=status.HTTP_200_OK)


class AffiliatePreviewAPIView(APIView):
    """Provides public preview of an affiliate code for registration page banners."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        ref_code = request.query_params.get('ref', '').strip()
        if not ref_code:
            return Response({'valid': False}, status=status.HTTP_200_OK)

        affiliate = Affiliate.objects.filter(affiliate_code__iexact=ref_code, status='active').first()
        if not affiliate:
            return Response({'valid': False}, status=status.HTTP_200_OK)

        settings_obj = CommissionSettings.get_settings()
        first_name = affiliate.name.split()[0] if affiliate.name else "Partner"

        return Response({
            'valid': True,
            'affiliate_code': affiliate.affiliate_code,
            'affiliate_name': affiliate.name,
            'first_name': first_name,
            'scholarship_percent': settings_obj.student_scholarship_percent
        }, status=status.HTTP_200_OK)


from superadmin.models import Student as SuperadminStudent


def get_related_courses(course_name: str):
    """Returns curated courses related to a booked demo course or interested topic."""
    lower = (course_name or '').lower()

    if 'python' in lower or 'data' in lower or 'ai' in lower:
        return [
            {
                'id': 'course-python-for-beginners',
                'title': 'Python Programming Masterclass',
                'category': 'Programming & AI',
                'duration': '3 Months',
                'level': 'Beginner to Advanced',
                'slug': 'python-for-beginners',
                'description': 'Master Python syntax, object-oriented programming, data structures, and real-world scripts.',
                'badge': 'Highly Recommended'
            },
            {
                'id': 'course-data-analysis',
                'title': 'Data Analysis & Python Mastery',
                'category': 'Data Science',
                'duration': '4 Months',
                'level': 'Intermediate',
                'slug': 'data-analysis--advanced-pandas--ml-basics',
                'description': 'Hands-on Pandas, NumPy, statistical visualization with Matplotlib, and ML fundamentals.',
                'badge': 'Trending Career'
            },
            {
                'id': 'course-web-dev',
                'title': 'Full-Stack Web Development Bootcamp',
                'category': 'Web Engineering',
                'duration': '6 Months',
                'level': 'Job-Ready',
                'slug': 'full-stack-web-dev-bootcamp',
                'description': 'Build production-ready web apps with Python Django REST Framework and React Next.js.',
                'badge': '100% Placement Support'
            }
        ]
    elif 'web' in lower or 'mern' in lower or 'react' in lower or 'frontend' in lower:
        return [
            {
                'id': 'course-web-dev',
                'title': 'Full-Stack Web Development Bootcamp (MERN)',
                'category': 'Web Engineering',
                'duration': '6 Months',
                'level': 'Beginner to Pro',
                'slug': 'full-stack-web-dev-bootcamp',
                'description': 'Full hands-on React, Next.js, Node.js, Express, MongoDB, and AWS deployment.',
                'badge': 'Flagship Course'
            },
            {
                'id': 'course-backend-node',
                'title': 'Backend Engineering with Node.js & Databases',
                'category': 'Backend Systems',
                'duration': '3 Months',
                'level': 'Intermediate',
                'slug': 'backend-engineering-nodejs-databases',
                'description': 'Master RESTful API design, PostgreSQL & MongoDB database modeling, and authentication.',
                'badge': 'High Demand'
            },
            {
                'id': 'course-python-for-beginners',
                'title': 'Python with Django & Microservices',
                'category': 'Programming',
                'duration': '4 Months',
                'level': 'All Levels',
                'slug': 'python-for-beginners',
                'description': 'Learn backend automation, Django ORM, and high-performance server architectures.',
                'badge': 'Popular Pair'
            }
        ]
    elif 'adca' in lower or 'dca' in lower:
        return [
            {
                'id': 'course-adca',
                'title': 'ADCA - Advance Diploma in Computer Applications (1-Year Diploma)',
                'category': 'Diploma & Govt Jobs',
                'duration': '12 Months',
                'level': 'Complete Foundation',
                'slug': 'adca',
                'description': 'Government-certified 1-year comprehensive diploma covering MS Office, DTP, Tally, and Web Basics.',
                'badge': 'Govt Job Recognized'
            },
            {
                'id': 'course-ccc-nielit',
                'title': 'NIELIT CCC (Basic Computer Course)',
                'category': 'National Certification',
                'duration': '3 Months',
                'level': 'Essential',
                'slug': 'ccc',
                'description': 'Official NIELIT syllabus with mock test simulators, computer concepts, and exam prep.',
                'badge': 'Mandatory for UP Govt Exams'
            },
            {
                'id': 'course-tally-prime',
                'title': 'Tally Prime + GST & Financial Accounting',
                'category': 'Accounting & Commerce',
                'duration': '3 Months',
                'level': 'Professional',
                'slug': 'tally-prime',
                'description': 'Complete GST filing, inventory management, TDS computation, and automated balance sheets.',
                'badge': 'Quick Job Ready'
            }
        ]
    elif 'ccc' in lower or 'basic' in lower or 'office' in lower:
        return [
            {
                'id': 'course-ccc-nielit',
                'title': 'NIELIT CCC (Basic Computer Course)',
                'category': 'National Certification',
                'duration': '3 Months',
                'level': 'Essential',
                'slug': 'ccc',
                'description': 'Official NIELIT syllabus with mock test simulators, computer concepts, and exam prep.',
                'badge': 'Govt Certified'
            },
            {
                'id': 'course-adca',
                'title': 'ADCA (1-Year Advanced Computer Diploma)',
                'category': 'Full Diploma',
                'duration': '12 Months',
                'level': 'Comprehensive',
                'slug': 'adca',
                'description': 'Upgrade from basic computer to complete IT diploma including graphic design, accounting, and typing.',
                'badge': 'Top Value'
            },
            {
                'id': 'course-python-for-beginners',
                'title': 'Python for Absolute Beginners',
                'category': 'Coding Starter',
                'duration': '3 Months',
                'level': 'No Coding Prior Needed',
                'slug': 'python-for-beginners',
                'description': 'Step into coding effortlessly with simple English-like Python syntax and fun lab assignments.',
                'badge': 'Next Career Step'
            }
        ]
    else:
        return [
            {
                'id': 'course-web-dev',
                'title': 'Full-Stack Web Development Bootcamp',
                'category': 'Web Engineering',
                'duration': '6 Months',
                'level': 'Beginner to Pro',
                'slug': 'full-stack-web-dev-bootcamp',
                'description': 'Master modern React, Next.js, Node.js, and databases with verified portfolio projects.',
                'badge': 'Most Popular'
            },
            {
                'id': 'course-python-for-beginners',
                'title': 'Python Programming Masterclass',
                'category': 'Programming & AI',
                'duration': '3 Months',
                'level': 'Beginner to Advanced',
                'slug': 'python-for-beginners',
                'description': 'Hands-on practical coding lab sessions with Er. Sumit Kumar in Shikohabad or online live.',
                'badge': 'Bestseller'
            },
            {
                'id': 'course-adca',
                'title': 'ADCA (1-Year Advanced Computer Diploma)',
                'category': 'Diploma & Govt Jobs',
                'duration': '12 Months',
                'level': 'Comprehensive',
                'slug': 'adca',
                'description': '1-year ISO certified diploma for computer operators, accounting specialists, and office administrators.',
                'badge': 'Govt Job Verified'
            }
        ]


# =============================================================================
# 2. STUDENT JOURNEY & DEMO BOOKING
# =============================================================================

class StudentJourneyAPIView(APIView):
    """Returns the authenticated student's 3-step journey state and dynamic course suggestions."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        referral = Referral.objects.filter(student=user).first()
        demo = DemoBooking.objects.filter(student=user).order_by('-created_at').first()
        enrollment = Enrollment.objects.filter(student=user).order_by('-created_at').first()
        sa_student = SuperadminStudent.objects.filter(email=user.email).first()

        current_stage = 'REGISTERED'
        if enrollment or sa_student:
            current_stage = 'ENROLLED'
        elif demo:
            if demo.status == 'COMPLETED':
                current_stage = 'DEMO_COMPLETED'
            elif demo.status in ['SCHEDULED', 'DAY1_DONE', 'DAY2_DONE']:
                current_stage = 'DEMO_BOOKED'
            elif demo.status == 'NO_SHOW':
                current_stage = 'DEMO_NO_SHOW'

        affiliate_first_name = ""
        scholarship_percent = 0
        if referral:
            affiliate_first_name = referral.affiliate.name.split()[0] if referral.affiliate.name else "Partner"
            scholarship_percent = referral.scholarship_percent

        demo_data = DemoBookingSerializer(demo).data if demo else None
        
        enrollment_data = None
        if enrollment:
            enrollment_data = {
                'id': enrollment.id,
                'course_name': enrollment.course_name,
                'net_fee_inr': enrollment.net_fee_paise / 100.0,
                'fee_collected_inr': enrollment.fee_collected_paise / 100.0,
                'status': enrollment.status,
                'registration_number': getattr(sa_student, 'registration_number', '') if sa_student else '',
                'batch_timing': getattr(sa_student, 'batch_timing', '09:00 AM - 11:00 AM') if sa_student else '09:00 AM - 11:00 AM',
                'branch_name': sa_student.branch.name if (sa_student and sa_student.branch) else 'MSK Shikohabad Main Campus',
                'fee_status': getattr(sa_student, 'fee_status', 'pending') if sa_student else ('paid' if enrollment.fee_collected_paise >= enrollment.net_fee_paise else 'pending'),
                'certification_status': getattr(sa_student, 'certification_status', 'in_progress') if sa_student else 'in_progress',
            }
        elif sa_student:
            enrollment_data = {
                'id': sa_student.id,
                'course_name': sa_student.course_name,
                'net_fee_inr': float(sa_student.fee_total),
                'fee_collected_inr': float(sa_student.fee_paid),
                'status': sa_student.status,
                'registration_number': sa_student.registration_number,
                'batch_timing': sa_student.batch_timing,
                'branch_name': sa_student.branch.name if sa_student.branch else 'MSK Shikohabad Main Campus',
                'fee_status': sa_student.fee_status,
                'certification_status': sa_student.certification_status,
            }

        # Suggested courses dynamically matched to booked demo course
        suggested_seed = demo.course_name if demo else (referral.course_interest if referral else '')
        suggested_courses = get_related_courses(suggested_seed)

        return Response({
            'current_stage': current_stage,
            'is_enrolled': current_stage == 'ENROLLED',
            'has_referral': referral is not None,
            'affiliate_first_name': affiliate_first_name,
            'scholarship_percent': scholarship_percent,
            'demo_booking': demo_data,
            'enrollment': enrollment_data,
            'suggested_courses': suggested_courses,
        }, status=status.HTTP_200_OK)


class BookDemoAPIView(APIView):
    """Allows an authenticated student to book a free 2-day demo class."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        course_name = request.data.get('course_name', '').strip()
        learning_mode = request.data.get('learning_mode', 'OFFLINE')
        preferred_slot = request.data.get('preferred_slot', '09:00 AM - 11:00 AM')
        scheduled_date = request.data.get('scheduled_date', None)
        notes = request.data.get('notes', '')

        if not course_name:
            return Response({'error': 'course_name is required'}, status=status.HTTP_400_BAD_REQUEST)

        # If student already booked a demo, they can book another demo only after completing the previous one
        active_demo = DemoBooking.objects.filter(
            student=user,
            status__in=['SCHEDULED', 'DAY1_DONE', 'DAY2_DONE']
        ).first()
        if active_demo:
            return Response(
                {
                    'error': f"You already have an active demo class reserved for '{active_demo.course_name}' ({active_demo.status}). You can book another demo class once your current 3-day demo sessions are completed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        referral = Referral.objects.filter(student=user).first()

        with transaction.atomic():
            demo = DemoBooking.objects.create(
                student=user,
                referral=referral,
                course_name=course_name,
                learning_mode=learning_mode,
                preferred_slot=preferred_slot,
                scheduled_date=scheduled_date or timezone.now().date(),
                status='SCHEDULED',
                notes=notes
            )

            if referral:
                old_stage = referral.current_stage
                referral.current_stage = 'DEMO_BOOKED'
                referral.save(update_fields=['current_stage', 'updated_at'])

                ReferralEvent.objects.create(
                    referral=referral,
                    event_type='DEMO_BOOKED',
                    from_stage=old_stage,
                    to_stage='DEMO_BOOKED',
                    actor=user,
                    metadata={
                        'demo_id': demo.id,
                        'course_name': course_name,
                        'learning_mode': learning_mode,
                        'preferred_slot': preferred_slot,
                    }
                )

                if referral.affiliate and referral.affiliate.user:
                    first_initial = f"{user.first_name} {user.last_name[:1]}." if user.last_name else user.first_name
                    NotificationService.send(
                        recipient=referral.affiliate.user,
                        title="Demo Class Booked! 📅",
                        message=f"{first_initial} booked a free 2-day demo for {course_name} ({learning_mode}).",
                        channel='IN_APP'
                    )

        return Response({
            'success': True,
            'message': 'Free 2-day demo class reserved successfully!',
            'demo': DemoBookingSerializer(demo).data
        }, status=status.HTTP_201_CREATED)


# =============================================================================
# 3. AFFILIATE PORTAL (AUTHENTICATED PARTNER)
# =============================================================================

class AffiliateMeAPIView(APIView):
    """Returns authenticated partner's profile and live computed funnel metrics."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        affiliate = getattr(request.user, 'affiliate_profile', None)
        if not affiliate:
            # Check by email fallback or create default active profile
            affiliate = Affiliate.objects.filter(email__iexact=request.user.email).first()
            if affiliate and not affiliate.user:
                affiliate.user = request.user
                affiliate.save(update_fields=['user'])

        if not affiliate:
            # Auto-provision affiliate profile for users with role 'affiliate'
            if getattr(request.user, 'role', '') == 'affiliate':
                rand_code = f"AFF-{request.user.first_name.upper()[:4]}-{request.user.id}"
                affiliate = Affiliate.objects.create(
                    user=request.user,
                    name=request.user.get_full_name() or "Affiliate Partner",
                    affiliate_code=rand_code,
                    email=request.user.email,
                    phone=request.user.phone or "9999900000",
                    payout_upi=f"{request.user.username}@okaxis",
                    status='active'
                )
            else:
                return Response({'error': 'You do not have an active affiliate profile.'}, status=status.HTTP_403_FORBIDDEN)

        # Compute funnel from real Referral & Event counts
        total_clicks = affiliate.clicks.count()
        total_referrals = affiliate.referrals.count()

        demos_booked = ReferralEvent.objects.filter(
            referral__affiliate=affiliate,
            event_type='DEMO_BOOKED'
        ).values('referral_id').distinct().count()

        demos_completed = ReferralEvent.objects.filter(
            referral__affiliate=affiliate,
            event_type='DEMO_COMPLETED'
        ).values('referral_id').distinct().count()

        enrolled_count = affiliate.referrals.filter(current_stage='ENROLLED').count()

        # Funnel conversion %
        click_to_reg_pct = round((total_referrals / total_clicks * 100), 1) if total_clicks > 0 else 0.0
        reg_to_demo_pct = round((demos_booked / total_referrals * 100), 1) if total_referrals > 0 else 0.0
        demo_to_done_pct = round((demos_completed / demos_booked * 100), 1) if demos_booked > 0 else 0.0
        done_to_enroll_pct = round((enrolled_count / demos_completed * 100), 1) if demos_completed > 0 else 0.0

        overall_conv_rate = round((enrolled_count / total_referrals * 100), 1) if total_referrals > 0 else 0.0

        return Response({
            'partner_name': affiliate.name,
            'affiliate_code': affiliate.affiliate_code,
            'email': affiliate.email,
            'commission_rate': float(affiliate.commission_rate),
            'total_earnings_inr': affiliate.total_earnings_inr,
            'available_balance_inr': affiliate.available_balance_inr,
            'pending_clearance_inr': affiliate.pending_clearance_inr,
            'paid_out_inr': float(affiliate.paid_out_paise / 100.0),
            'payout_upi': affiliate.payout_upi,
            'pan_number': affiliate.pan_number,
            'upi_verified': affiliate.upi_verified,
            'total_referrals': total_referrals,
            'conversions_count': enrolled_count,
            'conversion_rate': overall_conv_rate,
            'funnel': {
                'clicks': total_clicks,
                'registrations': total_referrals,
                'demos_booked': demos_booked,
                'demos_completed': demos_completed,
                'enrolled': enrolled_count,
                'rates': {
                    'click_to_reg_pct': click_to_reg_pct,
                    'reg_to_demo_pct': reg_to_demo_pct,
                    'demo_to_done_pct': demo_to_done_pct,
                    'done_to_enroll_pct': done_to_enroll_pct,
                }
            }
        }, status=status.HTTP_200_OK)


class AffiliateReferralsAPIView(APIView):
    """Returns referred students list with stage progress bar and detailed event timeline."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        affiliate = getattr(request.user, 'affiliate_profile', None) or Affiliate.objects.filter(email__iexact=request.user.email).first()
        if not affiliate:
            return Response({'error': 'No affiliate profile found'}, status=status.HTTP_404_NOT_FOUND)

        referrals = affiliate.referrals.prefetch_related('events', 'enrollments__commission_entries').order_by('-created_at')
        serializer = ReferralListSerializer(referrals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AffiliatePayoutsAPIView(APIView):
    """View payout history and submit withdrawal requests."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        affiliate = getattr(request.user, 'affiliate_profile', None) or Affiliate.objects.filter(email__iexact=request.user.email).first()
        if not affiliate:
            return Response({'error': 'No affiliate profile found'}, status=status.HTTP_404_NOT_FOUND)

        payouts = affiliate.payout_requests.all().order_by('-requested_at')
        entries = affiliate.commission_entries.all().order_by('-created_at')

        return Response({
            'available_balance_inr': affiliate.available_balance_inr,
            'settled_inr': float(affiliate.paid_out_paise / 100.0),
            'payout_upi': affiliate.payout_upi,
            'payouts_history': PayoutRequestSerializer(payouts, many=True).data,
            'ledger_entries': CommissionEntrySerializer(entries, many=True).data,
        }, status=status.HTTP_200_OK)

    def post(self, request):
        affiliate = getattr(request.user, 'affiliate_profile', None) or Affiliate.objects.filter(email__iexact=request.user.email).first()
        if not affiliate:
            return Response({'error': 'No affiliate profile found'}, status=status.HTTP_404_NOT_FOUND)

        settings_obj = CommissionSettings.get_settings()
        min_payout_inr = settings_obj.min_payout_paise / 100.0

        if affiliate.available_balance_inr < min_payout_inr:
            return Response({
                'error': f'Minimum withdrawal balance is ₹{min_payout_inr:.2f}. Your available balance is ₹{affiliate.available_balance_inr:.2f}.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not affiliate.payout_upi:
            return Response({'error': 'Please provide a valid UPI ID in Payment Settings.'}, status=status.HTTP_400_BAD_REQUEST)

        # 24h payout hold check if UPI was changed recently
        if affiliate.upi_last_changed_at and (timezone.now() - affiliate.upi_last_changed_at).total_seconds() < 86400:
            return Response({
                'error': 'Security hold active: Payouts are paused for 24 hours after changing your UPI ID.'
            }, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            amount_paise = affiliate.available_balance_paise
            payout = PayoutRequest.objects.create(
                affiliate=affiliate,
                amount_paise=amount_paise,
                upi_destination=affiliate.payout_upi,
                status='REQUESTED'
            )

        return Response({
            'success': True,
            'message': f'Withdrawal request for ₹{amount_paise / 100:.2f} submitted to admin queue!',
            'payout': PayoutRequestSerializer(payout).data
        }, status=status.HTTP_201_CREATED)


class AffiliateSettingsAPIView(APIView):
    """View and update payout settings. Affiliate referral code is strictly read-only!"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        affiliate = getattr(request.user, 'affiliate_profile', None) or Affiliate.objects.filter(email__iexact=request.user.email).first()
        if not affiliate:
            return Response({'error': 'No affiliate profile found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'name': affiliate.name,
            'email': affiliate.email,
            'affiliate_code': affiliate.affiliate_code,
            'commission_rate': float(affiliate.commission_rate),
            'payout_upi': affiliate.payout_upi,
            'pan_number': affiliate.pan_number,
            'upi_verified': affiliate.upi_verified,
        }, status=status.HTTP_200_OK)

    def patch(self, request):
        affiliate = getattr(request.user, 'affiliate_profile', None) or Affiliate.objects.filter(email__iexact=request.user.email).first()
        if not affiliate:
            return Response({'error': 'No affiliate profile found'}, status=status.HTTP_404_NOT_FOUND)

        payout_upi = request.data.get('payout_upi')
        pan_number = request.data.get('pan_number')

        if payout_upi is not None and payout_upi.strip() != affiliate.payout_upi:
            affiliate.payout_upi = payout_upi.strip()
            affiliate.upi_last_changed_at = timezone.now()
            affiliate.upi_verified = False  # Triggers 24h verification hold

        if pan_number is not None:
            affiliate.pan_number = pan_number.strip().upper()

        affiliate.save(update_fields=['payout_upi', 'pan_number', 'upi_last_changed_at', 'upi_verified', 'updated_at'])

        return Response({
            'success': True,
            'message': 'Payment settings updated successfully.',
            'payout_upi': affiliate.payout_upi,
            'pan_number': affiliate.pan_number,
            'hold_active': not affiliate.upi_verified,
        }, status=status.HTTP_200_OK)


class AffiliateNotificationsAPIView(APIView):
    """In-app notifications list and mark read action."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user).order_by('-created_at')[:20]
        unread_count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        return Response({
            'unread_count': unread_count,
            'notifications': NotificationSerializer(notifications, many=True).data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'success': True}, status=status.HTTP_200_OK)
