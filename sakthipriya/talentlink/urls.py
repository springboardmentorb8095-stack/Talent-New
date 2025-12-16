"""
URL configuration for talentlink project.

The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView  # Token Refresh API

urlpatterns = [
    path('admin/', admin.site.urls),

    # User Authentication Routes
    path('api/users/', include('users.urls')),

    # Profile CRUD Routes (Protected)
    path('api/profile/', include('users.profile_urls')),

    # Token Refresh Route
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]




