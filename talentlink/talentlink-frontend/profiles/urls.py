
# from django.urls import path
# from .views import ProfileDetailView, ProfileListView

# urlpatterns = [
#     path('', ProfileDetailView.as_view(), name='profile_detail'),         # GET/PATCH current user profile
#     path('list/', ProfileListView.as_view(), name='profile_list'),   
#     path('<int:pk>/', ProfileDetailView.as_view(), name='profile_by_id'),    # optional: all profiles
#     # Remove the old create endpoint
#     # path('', ProfileListCreateView.as_view(), name='profile_list_create'),  ← remove or comment
#     # path('<int:pk>/', ProfileRetrieveUpdateDeleteView.as_view(), name='profile_rud'),  ← remove
# ]

# profiles/urls.py
from django.urls import path
from .views import ProfileDetailView, ProfileListView

app_name = 'profiles'  # optional but recommended

# urlpatterns = [
#     # Current user's profile (GET/PATCH own profile)
#     path('', ProfileDetailView.as_view(), name='profile_detail'),

#     # List of all profiles (GET only)
#     path('list/', ProfileListView.as_view(), name='profile_list'),

#     # ← Add this line: individual profile by ID (GET only)
#     path('<int:pk>/', ProfileDetailView.as_view(), name='profile_by_id'),
# ]

# profiles/urls.py
urlpatterns = [
    path('profile/', ProfileDetailView.as_view(), name='profile_detail'),      # /api/auth/profile/
    path('profile/list/', ProfileListView.as_view(), name='profile_list'),     # /api/auth/profile/list/
    path('profile/<int:pk>/', ProfileDetailView.as_view(), name='profile_by_id'),  # /api/auth/profile/50/
]