from django.urls import path
from .views import UserProfileView, ResetPasswordView

urlpatterns = [
    path("profile/me/", UserProfileView.as_view(), name="user-profile"),
    path("auth/reset-password/", ResetPasswordView.as_view(), name="reset-password"),
]
