from django.contrib import admin
from .models import Branch, Staff, Student, Affiliate


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'city', 'manager_name', 'phone', 'revenue_share_percentage', 'status')
    list_filter = ('status', 'city')
    search_fields = ('name', 'code', 'city', 'manager_name')


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'department', 'branch', 'email', 'phone', 'status')
    list_filter = ('role', 'department', 'status', 'branch')
    search_fields = ('name', 'email', 'phone')


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'registration_number', 'first_name', 'last_name', 'course_name', 'branch',
        'fee_status', 'certification_status', 'status'
    )
    list_filter = ('fee_status', 'certification_status', 'status', 'branch', 'course_name')
    search_fields = ('registration_number', 'first_name', 'last_name', 'email', 'phone')


@admin.register(Affiliate)
class AffiliateAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'affiliate_code', 'email', 'phone', 'commission_rate',
        'total_referrals', 'total_earnings', 'pending_payout', 'status'
    )
    list_filter = ('status',)
    search_fields = ('name', 'affiliate_code', 'email', 'phone')
