from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # ------------------------
    # Django Admin
    # ------------------------
    path("admin/", admin.site.urls),

    # ------------------------
    # Authentication & Users
    # ------------------------
    path("api/auth/", include("users.urls")),

    # ------------------------
    # Profiles
    # ------------------------
    path("api/profiles/", include("profiles.urls")),

    # ------------------------
    # Projects
    # ------------------------
    path("api/projects/", include("projects.urls")),

    # ------------------------
    # Proposals
    # ------------------------
    path("api/proposals/", include("proposals.urls")),

    # ------------------------
    # Contracts
    # ------------------------
    path("api/contracts/", include("contracts.urls")),

    # ------------------------
    # Chat / Messaging
    # ------------------------
    path("api/chat/", include("chat.urls")),

    # ------------------------
    # Reviews & Ratings
    # ------------------------
    path("api/reviews/", include("reviews.urls")),

    # ------------------------
    # Notifications
    # ------------------------
    path("api/notifications/", include("notifications.urls")),

    # ------------------------
    # Dashboard (NEW)
    # ------------------------
    path("api/dashboard/", include("dashboard.urls")),  # ✅ ADD THIS
]
