from django.urls import path
from .views import ProfileListCreateView, ProfileRetrieveUpdateDeleteView

urlpatterns = [
    path('', ProfileListCreateView.as_view(), name='profile_list_create'),
    path('<int:pk>/', ProfileRetrieveUpdateDeleteView.as_view(), name='profile_rud'),
]
