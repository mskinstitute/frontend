from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BranchViewSet,
    StaffViewSet,
    StudentViewSet,
    AffiliateViewSet,
    DashboardSummaryAPIView,
)

app_name = 'superadmin'

router = DefaultRouter()
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'affiliates', AffiliateViewSet, basename='affiliate')

urlpatterns = [
    path('dashboard/', DashboardSummaryAPIView.as_view(), name='dashboard_summary'),
    path('', include(router.urls)),
]
