from rest_framework import serializers
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
)


class AffiliatePreviewSerializer(serializers.Serializer):
    valid = serializers.BooleanField()
    affiliate_code = serializers.CharField()
    affiliate_name = serializers.CharField()
    first_name = serializers.CharField()
    scholarship_percent = serializers.IntegerField()


class DemoBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemoBooking
        fields = [
            'id',
            'course_name',
            'learning_mode',
            'preferred_slot',
            'scheduled_date',
            'day1_attended',
            'day1_attended_at',
            'day2_attended',
            'day2_attended_at',
            'day3_attended',
            'day3_attended_at',
            'status',
            'notes',
            'created_at',
        ]
        read_only_fields = ['id', 'day1_attended', 'day1_attended_at', 'day2_attended', 'day2_attended_at', 'day3_attended', 'day3_attended_at', 'created_at']


class StudentJourneySerializer(serializers.Serializer):
    current_stage = serializers.CharField()
    has_referral = serializers.BooleanField()
    affiliate_first_name = serializers.CharField(allow_blank=True)
    scholarship_percent = serializers.IntegerField()
    demo_booking = DemoBookingSerializer(allow_null=True)
    enrollment = serializers.DictField(allow_null=True)


class ReferralEventSerializer(serializers.ModelSerializer):
    actor_name = serializers.SerializerMethodField()

    class Meta:
        model = ReferralEvent
        fields = [
            'id',
            'event_type',
            'from_stage',
            'to_stage',
            'actor_name',
            'metadata',
            'created_at',
        ]

    def get_actor_name(self, obj):
        if obj.actor:
            return obj.actor.get_full_name() or obj.actor.username
        return "System"


class ReferralListSerializer(serializers.ModelSerializer):
    student_display_name = serializers.SerializerMethodField()
    events = ReferralEventSerializer(many=True, read_only=True)
    commission_earned_inr = serializers.SerializerMethodField()
    commission_status = serializers.SerializerMethodField()
    expected_commission_inr = serializers.SerializerMethodField()
    fee_collected_inr = serializers.SerializerMethodField()

    class Meta:
        model = Referral
        fields = [
            'id',
            'student_display_name',
            'course_interest',
            'current_stage',
            'scholarship_percent',
            'created_at',
            'events',
            'commission_earned_inr',
            'commission_status',
            'expected_commission_inr',
            'fee_collected_inr',
        ]

    def get_student_display_name(self, obj):
        # Privacy requirement: Display as "Pooja S." only!
        first = obj.student.first_name.strip() if obj.student else "Student"
        last = obj.student.last_name.strip() if obj.student and obj.student.last_name else ""
        if last:
            return f"{first} {last[:1]}."
        return first

    def get_commission_earned_inr(self, obj):
        enrollment = obj.enrollments.first()
        if not enrollment:
            return 0.0
        entries = enrollment.commission_entries.filter(status__in=['APPROVED', 'PAID', 'PENDING'])
        return sum(e.commission_amount_paise for e in entries) / 100.0

    def get_commission_status(self, obj):
        enrollment = obj.enrollments.first()
        if not enrollment:
            return 'EXPECTED'
        entry = enrollment.commission_entries.first()
        if entry:
            return entry.status
        return 'EXPECTED'

    def get_expected_commission_inr(self, obj):
        enrollment = obj.enrollments.first()
        if enrollment:
            # Expected on entire net fee
            rate = enrollment.applied_commission_rate / 100
            return float(round((enrollment.net_fee_paise * rate) / 100, 2))
        return 0.0

    def get_fee_collected_inr(self, obj):
        enrollment = obj.enrollments.first()
        if enrollment:
            return enrollment.fee_collected_paise / 100.0
        return 0.0


class CommissionEntrySerializer(serializers.ModelSerializer):
    amount_inr = serializers.SerializerMethodField()
    collected_fee_inr = serializers.SerializerMethodField()

    class Meta:
        model = CommissionEntry
        fields = [
            'id',
            'amount_inr',
            'collected_fee_inr',
            'rate_applied',
            'status',
            'clearance_due_date',
            'approved_at',
            'paid_at',
            'reversed_at',
            'reversal_reason',
            'created_at',
        ]

    def get_amount_inr(self, obj):
        return obj.commission_amount_paise / 100.0

    def get_collected_fee_inr(self, obj):
        return obj.collected_amount_paise / 100.0


class PayoutRequestSerializer(serializers.ModelSerializer):
    amount_inr = serializers.SerializerMethodField()

    class Meta:
        model = PayoutRequest
        fields = [
            'id',
            'amount_inr',
            'upi_destination',
            'status',
            'utr_reference',
            'requested_at',
            'processed_at',
            'admin_notes',
        ]
        read_only_fields = ['id', 'status', 'utr_reference', 'requested_at', 'processed_at', 'admin_notes']

    def get_amount_inr(self, obj):
        return obj.amount_paise / 100.0


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'channel', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']


class AffiliateDashboardSerializer(serializers.Serializer):
    partner_name = serializers.CharField()
    affiliate_code = serializers.CharField()
    email = serializers.EmailField()
    commission_rate = serializers.FloatField()
    total_earnings_inr = serializers.FloatField()
    available_balance_inr = serializers.FloatField()
    pending_clearance_inr = serializers.FloatField()
    paid_out_inr = serializers.FloatField()
    payout_upi = serializers.CharField()
    pan_number = serializers.CharField()
    total_referrals = serializers.IntegerField()
    conversions_count = serializers.IntegerField()
    # Computed Funnel:
    funnel = serializers.DictField()
