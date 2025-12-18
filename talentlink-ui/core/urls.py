from django.urls import path
from .views import (
    RegisterAPIView,
    VerifyOTPAPIView,
    ForgotPasswordAPIView,
    ProfileAPIView,
)

urlpatterns = [
    # Authentication
    path("auth/register/", RegisterAPIView.as_view(), name="register"),
    path("auth/verify-otp/", VerifyOTPAPIView.as_view(), name="verify-otp"),
    path("auth/forgot-password/", ForgotPasswordAPIView.as_view(), name="Forgot-password"),

    # User profile
    path("profile/", ProfileAPIView.as_view(), name="profile"),
]
