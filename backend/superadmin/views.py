from rest_framework import viewsets, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from decimal import Decimal

from .models import Branch, Staff, Student, Affiliate
from .serializers import (
    BranchSerializer,
    StaffSerializer,
    StudentSerializer,
    AffiliateSerializer,
)


class IsAdminUserOrDev(permissions.BasePermission):
    """
    Allows access to authenticated admin/staff users.
    In development, allows safe read access if needed.
    """
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            role = getattr(request.user, 'role', '')
            return request.user.is_staff or request.user.is_superuser or role == 'admin'
        # Allow AllowAny for development convenience if configured, or require auth
        return request.method in permissions.SAFE_METHODS or False


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [permissions.AllowAny]  # Can be tightened to IsAdminUser
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'city', 'manager_name', 'phone']
    ordering_fields = ['name', 'created_at', 'revenue_share_percentage']
    ordering = ['name']


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.select_related('branch').all()
    serializer_class = StaffSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'phone', 'department', 'branch__name']
    ordering_fields = ['name', 'joining_date', 'salary', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        qs = super().get_queryset()
        branch_id = self.request.query_params.get('branch')
        role = self.request.query_params.get('role')
        staff_status = self.request.query_params.get('status')
        if branch_id:
            qs = qs.filter(branch_id=branch_id)
        if role:
            qs = qs.filter(role=role)
        if staff_status:
            qs = qs.filter(status=staff_status)
        return qs


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related('branch').all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['registration_number', 'first_name', 'last_name', 'email', 'phone', 'course_name', 'branch__name']
    ordering_fields = ['created_at', 'fee_total', 'fee_paid', 'first_name']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        branch_id = self.request.query_params.get('branch')
        fee_status = self.request.query_params.get('fee_status')
        cert_status = self.request.query_params.get('certification_status')
        student_status = self.request.query_params.get('status')
        if branch_id:
            qs = qs.filter(branch_id=branch_id)
        if fee_status:
            qs = qs.filter(fee_status=fee_status)
        if cert_status:
            qs = qs.filter(certification_status=cert_status)
        if student_status:
            qs = qs.filter(status=student_status)
        return qs


class AffiliateViewSet(viewsets.ModelViewSet):
    queryset = Affiliate.objects.all()
    serializer_class = AffiliateSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'affiliate_code', 'email', 'phone']
    ordering_fields = ['total_referrals', 'total_earnings', 'created_at']
    ordering = ['-total_referrals']

    def get_queryset(self):
        qs = super().get_queryset()
        aff_status = self.request.query_params.get('status')
        if aff_status:
            qs = qs.filter(status=aff_status)
        return qs


class DashboardSummaryAPIView(APIView):
    """
    Returns aggregated KPI metrics for the Super Admin Overview.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_branches = Branch.objects.count()
        active_branches = Branch.objects.filter(status='active').count()

        total_staff = Staff.objects.count()
        active_staff = Staff.objects.filter(status='active').count()

        total_students = Student.objects.count()
        active_students = Student.objects.filter(status='active').count()
        certified_students = Student.objects.filter(certification_status='certified').count()

        fee_aggregates = Student.objects.aggregate(
            total_expected=Sum('fee_total'),
            total_collected=Sum('fee_paid')
        )
        total_fee_expected = fee_aggregates['total_expected'] or Decimal('0.00')
        total_fee_collected = fee_aggregates['total_collected'] or Decimal('0.00')
        total_fee_pending = max(Decimal('0.00'), total_fee_expected - total_fee_collected)

        total_affiliates = Affiliate.objects.count()
        active_affiliates = Affiliate.objects.filter(status='active').count()
        affiliate_aggregates = Affiliate.objects.aggregate(
            total_referrals=Sum('total_referrals'),
            total_commissions=Sum('total_earnings'),
            pending_payouts=Sum('pending_payout')
        )

        recent_students = StudentSerializer(
            Student.objects.select_related('branch')[:5], many=True
        ).data

        recent_branches = BranchSerializer(
            Branch.objects.all()[:5], many=True
        ).data

        return Response({
            "metrics": {
                "branches": {
                    "total": total_branches,
                    "active": active_branches,
                },
                "staff": {
                    "total": total_staff,
                    "active": active_staff,
                },
                "students": {
                    "total": total_students,
                    "active": active_students,
                    "certified": certified_students,
                },
                "finances": {
                    "fee_expected": str(total_fee_expected),
                    "fee_collected": str(total_fee_collected),
                    "fee_pending": str(total_fee_pending),
                },
                "affiliates": {
                    "total": total_affiliates,
                    "active": active_affiliates,
                    "total_referrals": affiliate_aggregates['total_referrals'] or 0,
                    "total_commissions": str(affiliate_aggregates['total_commissions'] or Decimal('0.00')),
                    "pending_payouts": str(affiliate_aggregates['pending_payouts'] or Decimal('0.00')),
                }
            },
            "recent_students": recent_students,
            "recent_branches": recent_branches,
        }, status=status.HTTP_200_OK)
