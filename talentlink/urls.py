# from django.contrib import admin
# from django.urls import path, include
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# print("🔥 USING talentlink/urls.py 🔥")
# urlpatterns = [
#     path('admin/', admin.site.urls),

#     # Users API
#     path('api/users/', include('users.urls')),

#     # Profile API
#     path('api/profile/', include('users.profile_urls')),

#     # JWT Token endpoints
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

#     # Projects API
#     path('api/projects/', include('projects.urls')),

#     #proposals
#     path("api/proposals/", include("proposals.urls")),
#     path("api/skills/", include("skills.urls")),

#     #contarcts
#     path("api/contracts/", include("contracts.urls")),

#     #messages
#     path("api/messages/", include("messages_app.urls")),

#     #notifications
#     # path("api/", include("notifications.urls")),
#     path("api/notifications/", include("notifications.urls")),


#     #reviews 
#     # path("api/", include("reviews.urls")),

#     path("api/reviews/", include("reviews.urls")),




# ]


from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse

print("🔥 USING talentlink/urls.py 🔥")

def health_check(request):
    return JsonResponse({"status": "healthy"})

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Health check endpoint
    path('health/', health_check, name='health_check'),

    # Users API
    path('api/users/', include('users.urls')),

    # Profile API
    path('api/profile/', include('users.profile_urls')),

    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Projects API
    path('api/projects/', include('projects.urls')),

    #proposals
    path("api/proposals/", include("proposals.urls")),
    path("api/skills/", include("skills.urls")),

    #contarcts
    path("api/contracts/", include("contracts.urls")),

    #messages
    path("api/messages/", include("messages_app.urls")),

    #notifications
    # path("api/", include("notifications.urls")),
    path("api/notifications/", include("notifications.urls")),


    #reviews 
    # path("api/", include("reviews.urls")),

    path("api/reviews/", include("reviews.urls")),

]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Catch-all route to serve React app (must be last)
urlpatterns += [
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]