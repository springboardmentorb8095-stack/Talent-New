
from django.urls import path
from .views import ProfileDetailView, ProfileListView

urlpatterns = [
    path('', ProfileDetailView.as_view(), name='profile_detail'),         # GET/PATCH current user profile
    path('list/', ProfileListView.as_view(), name='profile_list'),       # optional: all profiles
    # Remove the old create endpoint
    # path('', ProfileListCreateView.as_view(), name='profile_list_create'),  ← remove or comment
    # path('<int:pk>/', ProfileRetrieveUpdateDeleteView.as_view(), name='profile_rud'),  ← remove
]