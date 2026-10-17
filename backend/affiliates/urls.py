from django.urls import path
from .views import (
    TrackClickAPIView,
    AffiliatePreviewAPIView,
    StudentJourneyAPIView,
    BookDemoAPIView,
    AffiliateMeAPIView,
    AffiliateReferralsAPIView,
    AffiliatePayoutsAPIView,
    AffiliateSettingsAPIView,
    AffiliateNotificationsAPIView,
)
from .admin_views import (
    AdminDemosAPIView,
    AdminEnrollmentsAPIView,
    AdminRecordPaymentAPIView,
    AdminRefundPaymentAPIView,
    AdminCommissionSettingsAPIView,
    AdminAffiliateRateOverrideAPIView,
    AdminPayoutQueueAPIView,
    AdminFollowupQueueAPIView,
    AdminAuditLogAPIView,
)

app_name = 'affiliates'

urlpatterns = [
    # Public & Tracking
    path('track-click/', TrackClickAPIView.as_view(), name='track_click'),
    path('preview/', AffiliatePreviewAPIView.as_view(), name='affiliate_preview'),

    # Student Endpoints
    path('student-journey/', StudentJourneyAPIView.as_view(), name='student_journey'),
    path('book-demo/', BookDemoAPIView.as_view(), name='book_demo'),

    # Affiliate Portal Endpoints
    path('me/', AffiliateMeAPIView.as_view(), name='affiliate_me'),
    path('referrals/', AffiliateReferralsAPIView.as_view(), name='affiliate_referrals'),
    path('payouts/', AffiliatePayoutsAPIView.as_view(), name='affiliate_payouts'),
    path('settings/', AffiliateSettingsAPIView.as_view(), name='affiliate_settings'),
    path('notifications/', AffiliateNotificationsAPIView.as_view(), name='affiliate_notifications'),

    # Admin Management Endpoints
    path('admin/demos/', AdminDemosAPIView.as_view(), name='admin_demos'),
    path('admin/demos/<int:pk>/', AdminDemosAPIView.as_view(), name='admin_demo_action'),
    path('admin/enrollments/', AdminEnrollmentsAPIView.as_view(), name='admin_enrollments'),
    path('admin/enrollments/<int:pk>/record-payment/', AdminRecordPaymentAPIView.as_view(), name='admin_record_payment'),
    path('admin/enrollments/payments/<int:pk>/refund/', AdminRefundPaymentAPIView.as_view(), name='admin_refund_payment'),
    path('admin/settings/commission/', AdminCommissionSettingsAPIView.as_view(), name='admin_commission_settings'),
    path('admin/affiliates/<int:pk>/rate/', AdminAffiliateRateOverrideAPIView.as_view(), name='admin_affiliate_rate_override'),
    path('admin/payouts/', AdminPayoutQueueAPIView.as_view(), name='admin_payout_queue'),
    path('admin/payouts/<int:pk>/', AdminPayoutQueueAPIView.as_view(), name='admin_payout_action'),
    path('admin/pipeline/follow-up/', AdminFollowupQueueAPIView.as_view(), name='admin_followup_queue'),
    path('admin/audit-logs/', AdminAuditLogAPIView.as_view(), name='admin_audit_logs'),
]
