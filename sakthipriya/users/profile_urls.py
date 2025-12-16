
from django.urls import path
from .profile_views import ProfileView, ProfileDetailView

urlpatterns = [
    path('', ProfileView.as_view()),            # POST/GET profile
    path('<int:pk>/', ProfileDetailView.as_view()),  # PUT/DELETE profile
]
