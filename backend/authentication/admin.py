from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserSession


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'phone', 'first_name', 'last_name', 'gender', 'role', 'is_staff')
    list_filter = ('role', 'gender', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email', 'phone', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'gender', 'role', 'picture')}),
        ('Password Reset', {'fields': ('reset_otp', 'reset_otp_expires')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('first_name', 'last_name', 'email', 'phone', 'gender', 'role')}),
    )


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'refresh_jti', 'access_jti', 'updated_at', 'created_at')
    search_fields = ('user__username', 'user__email', 'user__phone', 'refresh_jti')
    readonly_fields = ('created_at', 'updated_at')
