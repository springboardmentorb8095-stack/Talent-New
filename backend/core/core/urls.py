from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('users/', include('users.urls')),
    path("projects/", include("projects.urls")),
    path("proposals/", include("proposals.urls")),
    path("contracts/", include("contracts.urls")), 
    path("profiles/", include("profiles.urls")),
    path("api/messages/", include("messages.urls")),
    path("reviews/", include("reviews.urls")),
    path("notifications/", include("notifications.urls")),
    path("dashboard/", include("dashboard.urls")),
    path('admin/', admin.site.urls),
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)