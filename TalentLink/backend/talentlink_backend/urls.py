

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # user & auth
    path("api/auth/", include("accounts.urls")),
    path("api/", include("profiles.urls")), 
    path("api/", include("userprofiles.urls")),

    # 🔥 IMPORTANT: proposals BEFORE projects
    path("api/", include("proposals.urls")),
    path("api/", include("projects.urls")),
    path("api/", include("contracts.urls")),
    path("api/", include("messages_app.urls")),
    path("api/notifications/", include("Notification.urls")),

    # path("api/", include("accounts.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


