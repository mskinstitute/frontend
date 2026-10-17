from django.contrib import admin
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


@admin.register(CommissionSettings)
class CommissionSettingsAdmin(admin.ModelAdmin):
    list_display = ('global_default_rate', 'student_scholarship_percent', 'clearance_days', 'min_payout_paise', 'updated_at')


@admin.register(Affiliate)
class AffiliateAdmin(admin.ModelAdmin):
    list_display = ('name', 'affiliate_code', 'email', 'phone', 'commission_rate', 'status', 'created_at')
    search_fields = ('name', 'affiliate_code', 'email', 'phone')
    list_filter = ('status', 'custom_rate_active')


@admin.register(CommissionOverride)
class CommissionOverrideAdmin(admin.ModelAdmin):
    list_display = ('affiliate', 'course_name', 'commission_rate', 'active')
    list_filter = ('active',)


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ('student', 'affiliate', 'course_interest', 'current_stage', 'created_at')
    list_filter = ('current_stage', 'attribution_type')
    search_fields = ('student__first_name', 'student__email', 'affiliate__name', 'affiliate__affiliate_code')


@admin.register(ReferralEvent)
class ReferralEventAdmin(admin.ModelAdmin):
    list_display = ('referral', 'event_type', 'from_stage', 'to_stage', 'actor', 'created_at')
    list_filter = ('event_type',)


@admin.register(DemoBooking)
class DemoBookingAdmin(admin.ModelAdmin):
    list_display = ('student', 'course_name', 'learning_mode', 'scheduled_date', 'day1_attended', 'day2_attended', 'status')
    list_filter = ('status', 'learning_mode')


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course_name', 'net_fee_paise', 'applied_commission_rate', 'fee_collected_paise', 'status')
    list_filter = ('status',)


@admin.register(EnrollmentPayment)
class EnrollmentPaymentAdmin(admin.ModelAdmin):
    list_display = ('receipt_number', 'enrollment', 'amount_paise', 'payment_method', 'status', 'collected_at')
    list_filter = ('payment_method', 'status')


@admin.register(CommissionEntry)
class CommissionEntryAdmin(admin.ModelAdmin):
    list_display = ('affiliate', 'commission_amount_paise', 'rate_applied', 'status', 'clearance_due_date', 'created_at')
    list_filter = ('status',)


@admin.register(PayoutRequest)
class PayoutRequestAdmin(admin.ModelAdmin):
    list_display = ('affiliate', 'amount_paise', 'upi_destination', 'status', 'requested_at', 'processed_at')
    list_filter = ('status',)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'title', 'channel', 'is_read', 'created_at')
    list_filter = ('channel', 'is_read')


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'entity_type', 'entity_id', 'actor', 'timestamp')
    list_filter = ('entity_type',)


@admin.register(ClickTracker)
class ClickTrackerAdmin(admin.ModelAdmin):
    list_display = ('affiliate', 'ip_address', 'created_at')
