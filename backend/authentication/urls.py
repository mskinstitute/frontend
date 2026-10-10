from django.urls import path
from .views import (
    RegisterAPIView,
    LoginAPIView,
    LogoutView,
    CustomTokenRefreshView,
    UserProfileView,
    ForgotPasswordView,
    ResetPasswordConfirmView,
)

app_name = 'authentication'

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordConfirmView.as_view(), name='reset_password_confirm'),
]
