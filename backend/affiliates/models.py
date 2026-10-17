from django.db import models
from django.conf import settings
from decimal import Decimal
from django.utils import timezone


class CommissionSettings(models.Model):
    """Global configuration settings for commission and referrals."""
    global_default_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal('15.00'),
        help_text="Global default commission rate percentage (e.g. 15.00%)"
    )
    student_scholarship_percent = models.PositiveIntegerField(
        default=10,
        help_text="Discount percentage for referred students (e.g. 10%, 0 disables)"
    )
    clearance_days = models.PositiveIntegerField(
        default=7,
        help_text="Clearance period in days before commission becomes approved"
    )
    min_payout_paise = models.BigIntegerField(
        default=50000,
        help_text="Minimum withdrawal amount in integer paise (50000 paise = Rs 500)"
    )
    max_commission_cap_paise = models.BigIntegerField(
        null=True, blank=True,
        help_text="Optional max commission cap per enrollment in paise (null means OFF)"
    )
    followup_no_demo_hours = models.PositiveIntegerField(
        default=24,
        help_text="Hours after registration with no demo booked to flag in follow-up queue"
    )
    followup_no_enroll_hours = models.PositiveIntegerField(
        default=48,
        help_text="Hours after demo completed without enrolling to flag in follow-up queue"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Commission Settings'
        verbose_name_plural = 'Commission Settings'

    def __str__(self):
        return f"Commission Settings (Default: {self.global_default_rate}%, Scholarship: {self.student_scholarship_percent}%)"

    @classmethod
    def get_settings(cls):
        settings_obj, _ = cls.objects.get_or_create(id=1)
        return settings_obj


class Affiliate(models.Model):
    """Affiliate partner profile linked to a CustomUser."""
    STATUS_CHOICES = (
        ('active', 'Active Partner'),
        ('pending', 'Under Review'),
        ('suspended', 'Suspended'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='affiliate_profile'
    )
    name = models.CharField(max_length=150)
    affiliate_code = models.CharField(
        max_length=40, unique=True, db_index=True,
        help_text="Unique affiliate code, e.g. AFF-SUMIT10"
    )
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    commission_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal('15.00'),
        help_text="Per-affiliate base commission percentage"
    )
    custom_rate_active = models.BooleanField(
        default=False,
        help_text="True if this affiliate has a specific custom override rate enabled"
    )
    payout_upi = models.CharField(
        max_length=255, blank=True,
        help_text="UPI ID for commission transfers, e.g. name@okaxis"
    )
    pan_number = models.CharField(
        max_length=20, blank=True,
        help_text="Permanent Account Number (PAN) for tax deduction"
    )
    upi_verified = models.BooleanField(default=True)
    upi_last_changed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Affiliate Partner'
        verbose_name_plural = 'Affiliate Partners'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.affiliate_code})"

    # Computed financial properties from the append-only ledger (integer paise)
    @property
    def total_earnings_paise(self) -> int:
        """Total lifetime approved and paid commission earned in paise."""
        entries = self.commission_entries.filter(status__in=['APPROVED', 'PAID'])
        return sum(e.commission_amount_paise for e in entries)

    @property
    def total_earnings_inr(self) -> float:
        return self.total_earnings_paise / 100.0

    @property
    def paid_out_paise(self) -> int:
        """Total settled payouts in paise."""
        settled = self.payout_requests.filter(status='PAID')
        return sum(p.amount_paise for p in settled)

    @property
    def available_balance_paise(self) -> int:
        """Available for withdrawal = APPROVED entries minus active pending payout requests."""
        approved_total = sum(
            e.commission_amount_paise for e in self.commission_entries.filter(status='APPROVED')
        )
        active_requests = sum(
            p.amount_paise for p in self.payout_requests.filter(status__in=['REQUESTED', 'APPROVED'])
        )
        return max(0, approved_total - active_requests)

    @property
    def available_balance_inr(self) -> float:
        return self.available_balance_paise / 100.0

    @property
    def pending_clearance_paise(self) -> int:
        """Commission currently in clearance holding period."""
        entries = self.commission_entries.filter(status='PENDING')
        return sum(e.commission_amount_paise for e in entries)

    @property
    def pending_clearance_inr(self) -> float:
        return self.pending_clearance_paise / 100.0

    @property
    def total_referrals_count(self) -> int:
        return self.referrals.count()

    @property
    def conversions_count(self) -> int:
        return self.referrals.filter(current_stage='ENROLLED').count()


class CommissionOverride(models.Model):
    """Per-course or per-affiliate+course commission rate overrides."""
    affiliate = models.ForeignKey(
        Affiliate, on_delete=models.CASCADE, null=True, blank=True,
        related_name='course_overrides'
    )
    course_name = models.CharField(
        max_length=200, blank=True,
        help_text="Course title or blank for all courses"
    )
    commission_rate = models.DecimalField(
        max_digits=5, decimal_places=2,
        help_text="Override commission percentage (e.g. 20.00%)"
    )
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Commission Override'
        verbose_name_plural = 'Commission Overrides'

    def __str__(self):
        aff_str = self.affiliate.name if self.affiliate else "All Affiliates"
        course_str = self.course_name or "All Courses"
        return f"{aff_str} | {course_str} -> {self.commission_rate}%"


class Referral(models.Model):
    """Referral attribution link between an affiliate and a registered student."""
    STAGE_CHOICES = (
        ('REGISTERED', 'Registered'),
        ('DEMO_BOOKED', 'Demo Booked'),
        ('DEMO_COMPLETED', 'Demo Completed'),
        ('ENROLLED', 'Enrolled'),
        ('DEMO_NO_SHOW', 'Demo No-Show'),
        ('LOST', 'Lost'),
    )

    affiliate = models.ForeignKey(
        Affiliate, on_delete=models.CASCADE, related_name='referrals'
    )
    student = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='referral_record'
    )
    course_interest = models.CharField(max_length=200, blank=True)
    current_stage = models.CharField(
        max_length=30, choices=STAGE_CHOICES, default='REGISTERED', db_index=True
    )
    scholarship_percent = models.PositiveIntegerField(
        default=10,
        help_text="Student scholarship percentage locked at time of referral"
    )
    attribution_type = models.CharField(
        max_length=50, default='link_click',
        help_text="Source of attribution: link_click, cookie, manual_code"
    )
    ref_code_used = models.CharField(max_length=50)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Student Referral'
        verbose_name_plural = 'Student Referrals'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.get_full_name()} via {self.affiliate.affiliate_code} ({self.current_stage})"


class ReferralEvent(models.Model):
    """Append-only lifecycle event ledger for referrals and timeline auditing."""
    EVENT_TYPES = (
        ('CLICK', 'Link Clicked'),
        ('REGISTERED', 'Student Registered'),
        ('DEMO_BOOKED', 'Free Demo Booked'),
        ('DEMO_ATTENDED_DAY1', 'Attended Demo Day 1'),
        ('DEMO_ATTENDED_DAY2', 'Attended Demo Day 2'),
        ('DEMO_COMPLETED', 'Demo Completed'),
        ('DEMO_NO_SHOW', 'Demo No-Show'),
        ('DEMO_RESCHEDULED', 'Demo Rescheduled'),
        ('ENROLLED', 'Enrolled in Course'),
        ('FEE_COLLECTED', 'Fee Installment Collected'),
        ('COMMISSION_ACCRUED', 'Commission Accrued'),
        ('COMMISSION_APPROVED', 'Commission Cleared & Approved'),
        ('COMMISSION_PAID', 'Commission Paid'),
        ('COMMISSION_REVERSED', 'Commission Reversed'),
        ('STAGE_CHANGED', 'Stage Transitioned'),
    )

    referral = models.ForeignKey(
        Referral, on_delete=models.CASCADE, related_name='events'
    )
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES, db_index=True)
    from_stage = models.CharField(max_length=30, blank=True, null=True)
    to_stage = models.CharField(max_length=30, blank=True, null=True)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Referral Event'
        verbose_name_plural = 'Referral Events'
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {self.referral.id} - {self.event_type}"


class DemoBooking(models.Model):
    """2-day free trial demo booking by a prospective student."""
    STATUS_CHOICES = (
        ('SCHEDULED', 'Scheduled'),
        ('DAY1_DONE', 'Day 1 Done'),
        ('COMPLETED', 'Demo Completed'),
        ('NO_SHOW', 'No Show'),
        ('RESCHEDULED', 'Rescheduled'),
        ('CANCELLED', 'Cancelled'),
    )
    MODE_CHOICES = (
        ('OFFLINE', 'Offline Lab (Shikohabad)'),
        ('ONLINE', 'Online Live'),
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='demo_bookings'
    )
    referral = models.ForeignKey(
        Referral, on_delete=models.SET_NULL, null=True, blank=True, related_name='demo_bookings'
    )
    course_name = models.CharField(max_length=200)
    learning_mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='OFFLINE')
    preferred_slot = models.CharField(max_length=100, default='09:00 AM - 11:00 AM')
    scheduled_date = models.DateField(null=True, blank=True)
    day1_attended = models.BooleanField(default=False)
    day1_attended_at = models.DateTimeField(null=True, blank=True)
    day2_attended = models.BooleanField(default=False)
    day2_attended_at = models.DateTimeField(null=True, blank=True)
    day3_attended = models.BooleanField(default=False)
    day3_attended_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='SCHEDULED', db_index=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Demo Booking'
        verbose_name_plural = 'Demo Bookings'
        ordering = ['-created_at']

    def __str__(self):
        return f"Demo: {self.student.get_full_name()} - {self.course_name} ({self.status})"


class Enrollment(models.Model):
    """Course enrollment record with snapshotted commission rate."""
    STATUS_CHOICES = (
        ('ENROLLED', 'Enrolled'),
        ('ACTIVE', 'Active Course'),
        ('COMPLETED', 'Completed'),
        ('DROPPED', 'Dropped Out'),
        ('REFUNDED', 'Refunded'),
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='affiliate_enrollments'
    )
    referral = models.ForeignKey(
        Referral, on_delete=models.SET_NULL, null=True, blank=True, related_name='enrollments'
    )
    course_name = models.CharField(max_length=200)
    course_id = models.CharField(max_length=100, blank=True)
    gross_fee_paise = models.BigIntegerField(
        help_text="Standard course fee in paise (e.g. 750000 = Rs 7,500)"
    )
    discount_percent = models.PositiveIntegerField(
        default=0,
        help_text="Scholarship percentage applied (e.g. 10%)"
    )
    discount_paise = models.BigIntegerField(
        default=0,
        help_text="Discount amount in paise"
    )
    net_fee_paise = models.BigIntegerField(
        help_text="Net fee payable after student discount in paise"
    )
    applied_commission_rate = models.DecimalField(
        max_digits=5, decimal_places=2,
        help_text="Snapshotted commission rate resolved at enrollment creation"
    )
    fee_collected_paise = models.BigIntegerField(
        default=0,
        help_text="Total fee collected so far across installments in paise"
    )
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='ENROLLED')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Course Enrollment'
        verbose_name_plural = 'Course Enrollments'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.course_name} (Net: Rs {self.net_fee_paise / 100:.2f})"


class EnrollmentPayment(models.Model):
    """Fee payment installment collected offline or online."""
    PAYMENT_METHODS = (
        ('CASH', 'Cash'),
        ('UPI', 'UPI Transfer'),
        ('BANK_TRANSFER', 'Bank Transfer / NEFT'),
        ('GATEWAY', 'Online Payment Gateway'),
    )
    STATUS_CHOICES = (
        ('SUCCESS', 'Successful'),
        ('REFUNDED', 'Refunded'),
    )

    enrollment = models.ForeignKey(
        Enrollment, on_delete=models.CASCADE, related_name='payments'
    )
    amount_paise = models.BigIntegerField(
        help_text="Payment amount in paise (e.g. 250000 = Rs 2,500)"
    )
    payment_method = models.CharField(max_length=30, choices=PAYMENT_METHODS, default='UPI')
    transaction_reference = models.CharField(
        max_length=150, blank=True,
        help_text="UTR / Reference / Cash Receipt number"
    )
    receipt_number = models.CharField(max_length=100, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SUCCESS')
    collected_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    collected_at = models.DateTimeField(auto_now_add=True)
    refunded_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Enrollment Payment'
        verbose_name_plural = 'Enrollment Payments'
        ordering = ['-collected_at']

    def __str__(self):
        return f"Payment {self.receipt_number}: Rs {self.amount_paise / 100:.2f} ({self.status})"


class CommissionEntry(models.Model):
    """Append-only commission ledger entry created proportionally per fee collection."""
    STATUS_CHOICES = (
        ('PENDING', 'In Clearance'),
        ('APPROVED', 'Approved'),
        ('PAID', 'Paid Out'),
        ('REVERSED', 'Reversed'),
    )

    affiliate = models.ForeignKey(
        Affiliate, on_delete=models.CASCADE, related_name='commission_entries'
    )
    enrollment = models.ForeignKey(
        Enrollment, on_delete=models.CASCADE, related_name='commission_entries'
    )
    payment = models.ForeignKey(
        EnrollmentPayment, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='commission_entries'
    )
    rate_applied = models.DecimalField(
        max_digits=5, decimal_places=2,
        help_text="Rate percentage snapshotted from enrollment"
    )
    collected_amount_paise = models.BigIntegerField(
        help_text="Collected fee installment in paise"
    )
    commission_amount_paise = models.BigIntegerField(
        help_text="Accrued commission in paise (rate% x collected fee)"
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True
    )
    clearance_due_date = models.DateTimeField(
        help_text="Date after which this entry is eligible for auto-approval"
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    reversed_at = models.DateTimeField(null=True, blank=True)
    reversal_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Commission Entry'
        verbose_name_plural = 'Commission Ledger Entries'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.affiliate.affiliate_code} - Rs {self.commission_amount_paise / 100:.2f} ({self.status})"


class PayoutRequest(models.Model):
    """Commission withdrawal request by an affiliate partner."""
    STATUS_CHOICES = (
        ('REQUESTED', 'Requested'),
        ('APPROVED', 'Approved by Admin'),
        ('REJECTED', 'Rejected'),
        ('PAID', 'Settled & Paid'),
    )

    affiliate = models.ForeignKey(
        Affiliate, on_delete=models.CASCADE, related_name='payout_requests'
    )
    amount_paise = models.BigIntegerField()
    upi_destination = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REQUESTED', db_index=True)
    utr_reference = models.CharField(
        max_length=150, blank=True,
        help_text="Bank UTR reference upon payment"
    )
    admin_notes = models.TextField(blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='processed_payouts'
    )

    class Meta:
        verbose_name = 'Payout Request'
        verbose_name_plural = 'Payout Requests'
        ordering = ['-requested_at']

    def __str__(self):
        return f"Payout {self.id}: {self.affiliate.name} - Rs {self.amount_paise / 100:.2f} ({self.status})"


class Notification(models.Model):
    """In-app or email/whatsapp notification queue."""
    CHANNEL_CHOICES = (
        ('IN_APP', 'In-App'),
        ('EMAIL', 'Email'),
        ('WHATSAPP', 'WhatsApp'),
    )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='affiliate_notifications'
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default='IN_APP')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification to {self.recipient.email}: {self.title}"


class AuditLog(models.Model):
    """Audit log capturing all commission rate changes, setting edits, and admin actions."""
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=100)
    old_value = models.JSONField(null=True, blank=True)
    new_value = models.JSONField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Audit Log'
        verbose_name_plural = 'Audit Logs'
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M')}] {self.action} on {self.entity_type} {self.entity_id}"


class ClickTracker(models.Model):
    """Tracks referral link hits and short-link redirects."""
    affiliate = models.ForeignKey(
        Affiliate, on_delete=models.CASCADE, related_name='clicks'
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referer = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Click Event'
        verbose_name_plural = 'Click Events'
        ordering = ['-created_at']
