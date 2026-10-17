from decimal import Decimal, ROUND_HALF_UP
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from django.db.models import Sum, Q

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
    Notification,
    AuditLog,
    ClickTracker,
)


class NotificationService:
    """Service interface for dispatching notifications across channels."""

    @classmethod
    def send(cls, recipient, title, message, channel='IN_APP', metadata=None):
        # 1. Create in-app notification
        notification = Notification.objects.create(
            recipient=recipient,
            title=title,
            message=message,
            channel=channel
        )

        # 2. Pluggable channel dispatch (Email / WhatsApp)
        # WhatsApp or Email providers can be plugged in here.
        if channel == 'WHATSAPP':
            # WhatsApp provider hook
            pass
        elif channel == 'EMAIL':
            # Email provider hook
            pass

        return notification


class CommissionEngine:
    """
    Core engine handling rate resolution, enrollment snapshotting,
    installment commission accrual, ledger clearance, and reversals.
    """

    @classmethod
    def resolve_commission_rate(cls, affiliate: Affiliate, course_name: str = "") -> Decimal:
        """
        Resolution Order:
        1. Per-affiliate + per-course override
        2. Per-affiliate override (either override record or affiliate.custom_rate_active)
        3. Per-course override
        4. Global default rate (settings)
        """
        clean_course = (course_name or "").strip()

        # 1. Per-affiliate + per-course override
        if clean_course:
            override_aff_course = CommissionOverride.objects.filter(
                affiliate=affiliate,
                course_name__iexact=clean_course,
                active=True
            ).first()
            if override_aff_course:
                return override_aff_course.commission_rate

        # 2. Per-affiliate override
        override_aff_general = CommissionOverride.objects.filter(
            affiliate=affiliate,
            course_name="",
            active=True
        ).first()
        if override_aff_general:
            return override_aff_general.commission_rate

        if affiliate.custom_rate_active and affiliate.commission_rate > 0:
            return affiliate.commission_rate

        # 3. Per-course override (global course override)
        if clean_course:
            override_course = CommissionOverride.objects.filter(
                affiliate__isnull=True,
                course_name__iexact=clean_course,
                active=True
            ).first()
            if override_course:
                return override_course.commission_rate

        # 4. Global default rate
        settings_obj = CommissionSettings.get_settings()
        return settings_obj.global_default_rate

    @classmethod
    def calculate_commission_paise(cls, amount_paise: int, rate: Decimal) -> int:
        """Calculates commission integer paise using exact Decimal arithmetic and half-up rounding."""
        if amount_paise <= 0 or rate <= 0:
            return 0
        rate_decimal = rate / Decimal('100')
        raw = Decimal(amount_paise) * rate_decimal
        return int(raw.quantize(Decimal('1'), rounding=ROUND_HALF_UP))

    @classmethod
    @transaction.atomic
    def create_enrollment(
        cls,
        student,
        course_name: str,
        gross_fee_paise: int,
        discount_percent: int = 0,
        course_id: str = "",
        actor=None
    ) -> Enrollment:
        """
        Creates an enrollment, checks for an active student referral,
        resolves and snapshots the commission rate, and updates referral stage.
        """
        referral = Referral.objects.filter(student=student).first()
        applied_rate = Decimal('0.00')

        # If student came through an active affiliate referral, resolve the snapshot rate
        if referral and referral.affiliate and referral.affiliate.status == 'active':
            applied_rate = cls.resolve_commission_rate(referral.affiliate, course_name)
            if discount_percent == 0 and referral.scholarship_percent > 0:
                discount_percent = referral.scholarship_percent

        discount_paise = int(
            (Decimal(gross_fee_paise) * Decimal(discount_percent) / Decimal('100')).quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        )
        net_fee_paise = max(0, gross_fee_paise - discount_paise)

        enrollment = Enrollment.objects.create(
            student=student,
            referral=referral,
            course_name=course_name,
            course_id=course_id,
            gross_fee_paise=gross_fee_paise,
            discount_percent=discount_percent,
            discount_paise=discount_paise,
            net_fee_paise=net_fee_paise,
            applied_commission_rate=applied_rate,
            fee_collected_paise=0,
            status='ENROLLED'
        )

        if referral:
            old_stage = referral.current_stage
            referral.current_stage = 'ENROLLED'
            referral.save(update_fields=['current_stage', 'updated_at'])

            ReferralEvent.objects.create(
                referral=referral,
                event_type='ENROLLED',
                from_stage=old_stage,
                to_stage='ENROLLED',
                actor=actor,
                metadata={
                    'course_name': course_name,
                    'gross_fee_paise': gross_fee_paise,
                    'net_fee_paise': net_fee_paise,
                    'applied_commission_rate': str(applied_rate),
                }
            )

            # Notify affiliate
            if referral.affiliate.user:
                NotificationService.send(
                    recipient=referral.affiliate.user,
                    title="Student Enrolled! 🎉",
                    message=f"A referred student has enrolled in {course_name}. Expected commission: {applied_rate}% on fee collections.",
                    channel='IN_APP'
                )

        return enrollment

    @classmethod
    @transaction.atomic
    def record_payment_and_accrue_commission(
        cls,
        enrollment: Enrollment,
        amount_paise: int,
        payment_method: str = 'UPI',
        transaction_reference: str = '',
        receipt_number: str = '',
        actor=None,
        notes: str = ''
    ) -> tuple[EnrollmentPayment, CommissionEntry | None]:
        """
        Records an installment payment and idempotently accrues proportional commission in the ledger.
        """
        if not receipt_number:
            receipt_number = f"RCPT-{timezone.now().strftime('%Y%m%d')}-{timezone.now().microsecond}"

        # 1. Create Payment Record
        payment = EnrollmentPayment.objects.create(
            enrollment=enrollment,
            amount_paise=amount_paise,
            payment_method=payment_method,
            transaction_reference=transaction_reference,
            receipt_number=receipt_number,
            status='SUCCESS',
            collected_by=actor,
            notes=notes
        )

        enrollment.fee_collected_paise += amount_paise
        enrollment.save(update_fields=['fee_collected_paise', 'updated_at'])

        commission_entry = None
        referral = enrollment.referral

        # 2. Accrue commission if referred by an active affiliate
        if referral and referral.affiliate and enrollment.applied_commission_rate > 0:
            affiliate = referral.affiliate
            settings_obj = CommissionSettings.get_settings()

            raw_commission = cls.calculate_commission_paise(
                amount_paise=amount_paise,
                rate=enrollment.applied_commission_rate
            )

            # Check optional max commission cap per enrollment
            if settings_obj.max_commission_cap_paise is not None:
                already_accrued = CommissionEntry.objects.filter(
                    enrollment=enrollment,
                    status__in=['PENDING', 'APPROVED', 'PAID']
                ).aggregate(total=Sum('commission_amount_paise'))['total'] or 0

                remaining_cap = max(0, settings_obj.max_commission_cap_paise - already_accrued)
                commission_amount = min(raw_commission, remaining_cap)
            else:
                commission_amount = raw_commission

            if commission_amount > 0:
                clearance_due = timezone.now() + timedelta(days=settings_obj.clearance_days)

                commission_entry = CommissionEntry.objects.create(
                    affiliate=affiliate,
                    enrollment=enrollment,
                    payment=payment,
                    rate_applied=enrollment.applied_commission_rate,
                    collected_amount_paise=amount_paise,
                    commission_amount_paise=commission_amount,
                    status='PENDING',
                    clearance_due_date=clearance_due
                )

                ReferralEvent.objects.create(
                    referral=referral,
                    event_type='FEE_COLLECTED',
                    actor=actor,
                    metadata={
                        'receipt_number': receipt_number,
                        'collected_amount_paise': amount_paise,
                        'commission_amount_paise': commission_amount,
                        'rate_applied': str(enrollment.applied_commission_rate),
                        'clearance_days': settings_obj.clearance_days,
                    }
                )

                if affiliate.user:
                    NotificationService.send(
                        recipient=affiliate.user,
                        title="Commission Accrued! 💰",
                        message=f"₹{commission_amount / 100:.2f} commission accrued on student fee installment (in clearance for {settings_obj.clearance_days} days).",
                        channel='IN_APP'
                    )

        return payment, commission_entry

    @classmethod
    @transaction.atomic
    def process_refund(cls, payment: EnrollmentPayment, reason: str = "", actor=None) -> bool:
        """
        Reverses a fee payment and reverses any linked commission entries in the ledger.
        """
        if payment.status == 'REFUNDED':
            return False

        payment.status = 'REFUNDED'
        payment.refunded_at = timezone.now()
        payment.notes = f"{payment.notes}\nRefunded: {reason}".strip()
        payment.save(update_fields=['status', 'refunded_at', 'notes'])

        enrollment = payment.enrollment
        enrollment.fee_collected_paise = max(0, enrollment.fee_collected_paise - payment.amount_paise)
        enrollment.save(update_fields=['fee_collected_paise', 'updated_at'])

        # Reverse commission entries
        entries = CommissionEntry.objects.filter(payment=payment, status__in=['PENDING', 'APPROVED'])
        for entry in entries:
            entry.status = 'REVERSED'
            entry.reversed_at = timezone.now()
            entry.reversal_reason = reason
            entry.save(update_fields=['status', 'reversed_at', 'reversal_reason'])

            if enrollment.referral:
                ReferralEvent.objects.create(
                    referral=enrollment.referral,
                    event_type='COMMISSION_REVERSED',
                    actor=actor,
                    metadata={
                        'receipt_number': payment.receipt_number,
                        'reversed_paise': entry.commission_amount_paise,
                        'reason': reason
                    }
                )

                if entry.affiliate.user:
                    NotificationService.send(
                        recipient=entry.affiliate.user,
                        title="Commission Reversed",
                        message=f"A commission entry of ₹{entry.commission_amount_paise / 100:.2f} was reversed due to student fee refund.",
                        channel='IN_APP'
                    )

        return True

    @classmethod
    @transaction.atomic
    def auto_approve_cleared_commissions(cls) -> int:
        """Auto-approves pending commission entries whose clearance holding period has passed."""
        now = timezone.now()
        pending_entries = CommissionEntry.objects.filter(
            status='PENDING',
            clearance_due_date__lte=now
        )
        count = 0
        for entry in pending_entries:
            entry.status = 'APPROVED'
            entry.approved_at = now
            entry.save(update_fields=['status', 'approved_at'])
            count += 1

            if entry.enrollment and entry.enrollment.referral:
                ReferralEvent.objects.create(
                    referral=entry.enrollment.referral,
                    event_type='COMMISSION_APPROVED',
                    metadata={'amount_paise': entry.commission_amount_paise}
                )

            if entry.affiliate.user:
                NotificationService.send(
                    recipient=entry.affiliate.user,
                    title="Commission Cleared! 💵",
                    message=f"₹{entry.commission_amount_paise / 100:.2f} has cleared and is now available for withdrawal.",
                    channel='IN_APP'
                )
        return count


class AttributionEngine:
    """Handles referral link click logging, student registration attribution, and fraud checks."""

    @classmethod
    def record_click(cls, ref_code: str, ip_address: str = None, user_agent: str = "", referer: str = "") -> Affiliate | None:
        """Records a click on an affiliate's link or short code."""
        affiliate = Affiliate.objects.filter(affiliate_code__iexact=ref_code.strip(), status='active').first()
        if affiliate:
            ClickTracker.objects.create(
                affiliate=affiliate,
                ip_address=ip_address,
                user_agent=user_agent,
                referer=referer
            )
        return affiliate

    @classmethod
    def check_self_referral(cls, affiliate: Affiliate, email: str, phone: str, upi: str = "") -> bool:
        """Anti-fraud: Checks if registering user belongs to the affiliate themselves."""
        norm_email = (email or "").strip().lower()
        norm_phone = (phone or "").strip().replace(" ", "").replace("-", "").replace("+91", "")
        norm_upi = (upi or "").strip().lower()

        aff_email = affiliate.email.strip().lower()
        aff_phone = affiliate.phone.strip().replace(" ", "").replace("-", "").replace("+91", "")
        aff_upi = affiliate.payout_upi.strip().lower() if affiliate.payout_upi else ""

        if norm_email and norm_email == aff_email:
            return True
        if norm_phone and norm_phone == aff_phone:
            return True
        if norm_upi and aff_upi and norm_upi == aff_upi:
            return True
        return False

    @classmethod
    @transaction.atomic
    def attribute_student_registration(
        cls,
        student,
        ref_code: str,
        course_interest: str = "",
        attribution_type: str = "link_click",
        ip_address: str = None,
        user_agent: str = ""
    ) -> Referral | None:
        """
        Attributes a new student to an affiliate.
        Guarantees:
        - Self-referral rejection
        - First-touch lock: if student already attributed, never overwrite!
        - Logs initial REGISTERED event
        - Dispatches notification
        """
        if not ref_code or not ref_code.strip():
            return None

        clean_code = ref_code.strip()
        affiliate = Affiliate.objects.filter(affiliate_code__iexact=clean_code, status='active').first()
        if not affiliate:
            return None

        # Anti-fraud 1: Block self-referral
        if cls.check_self_referral(affiliate, student.email, student.phone):
            return None

        # Anti-fraud 2: Existing attribution lock
        existing_referral = Referral.objects.filter(student=student).first()
        if existing_referral:
            return existing_referral  # Do not overwrite!

        settings_obj = CommissionSettings.get_settings()
        scholarship_percent = settings_obj.student_scholarship_percent

        referral = Referral.objects.create(
            affiliate=affiliate,
            student=student,
            course_interest=course_interest,
            current_stage='REGISTERED',
            scholarship_percent=scholarship_percent,
            attribution_type=attribution_type,
            ref_code_used=clean_code,
            ip_address=ip_address,
            user_agent=user_agent
        )

        ReferralEvent.objects.create(
            referral=referral,
            event_type='REGISTERED',
            to_stage='REGISTERED',
            actor=student,
            metadata={
                'ref_code': clean_code,
                'course_interest': course_interest,
                'scholarship_percent': scholarship_percent,
            }
        )

        # Notify affiliate
        if affiliate.user:
            # Privacy: student first name + last initial only!
            student_initial = f"{student.first_name} {student.last_name[:1]}." if student.last_name else student.first_name
            NotificationService.send(
                recipient=affiliate.user,
                title="New Student Registered! 🎓",
                message=f"{student_initial} just signed up via your referral link for {course_interest or 'MSK Courses'}.",
                channel='IN_APP'
            )

        return referral
