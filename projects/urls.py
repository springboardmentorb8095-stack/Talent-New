# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import ProjectViewSet

# router = DefaultRouter()
# router.register(r'projects', ProjectViewSet, basename='project')

# urlpatterns = [
#     path('', include(router.urls)),
# ]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet

router = DefaultRouter()
router.register(r'', ProjectViewSet, basename='project')  # <-- remove 'projects'

urlpatterns = [
    path('', include(router.urls)),
]
