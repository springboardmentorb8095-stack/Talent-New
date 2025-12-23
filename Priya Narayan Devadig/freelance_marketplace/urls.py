"""
URL configuration for freelance_marketplace project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'Freelance Marketplace API',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'projects': '/api/projects/',
            'proposals': '/api/proposals/',
            'contracts': '/api/contracts/',
            'messages': '/api/messages/',
            'reviews': '/api/reviews/',
            'admin': '/admin/'
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/proposals/', include('proposals.urls')),
    path('api/contracts/', include('contracts.urls')),
    path('api/messages/', include('messaging.urls')),
    path('api/reviews/', include('reviews.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)