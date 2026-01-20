# profiles/urls.py
from django.urls import path
from .views import MyProfileView, AvatarUploadView

urlpatterns = [
    path("me/", MyProfileView.as_view(), name="my-profile"),
    path("avatar/", AvatarUploadView.as_view(), name="my-avatar"),
]
