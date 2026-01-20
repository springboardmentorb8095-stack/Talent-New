from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, UserMeView
# from .views import ClientOnlyView, FreelancerOnlyView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('me/', UserMeView.as_view(), name='user-me'),
]

# urlpatterns += [
#     path("client-only/", ClientOnlyView.as_view()),
#     path("freelancer-only/", FreelancerOnlyView.as_view()),
# ]