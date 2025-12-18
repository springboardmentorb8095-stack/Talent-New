from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def home(request):
    return HttpResponse(
        "<h1>TalentLink Backend Running</h1>"
        "<p>Admin: <b>/admin/</b></p>"
        "<p>API available at <b>/api/</b></p>"
        "<p>Login: <b>/api/auth/login/</b></p>"
        "<p>Register: <b>/api/auth/register/</b></p>"
        "<p>Profile: <b>/api/profile/</b></p>"
    )

urlpatterns = [
    path("", home),                          # http://127.0.0.1:8000/
    path("admin/", admin.site.urls),         # Admin panel
    path("api/", include("core.urls")),      # App APIs

    # JWT Authentication
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
