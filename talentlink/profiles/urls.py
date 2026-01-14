
from django.urls import path
from .views import ProfileDetailView, ProfileListView

app_name = 'profiles'  # optional but recommended


# profiles/urls.py
urlpatterns = [
    path('profile/', ProfileDetailView.as_view(), name='profile_detail'),      # /api/auth/profile/
    path('profile/list/', ProfileListView.as_view(), name='profile_list'),     # /api/auth/profile/list/
    path('profile/<int:pk>/', ProfileDetailView.as_view(), name='profile_by_id'),  # /api/auth/profile/50/
]