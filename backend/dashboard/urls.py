from django.urls import path
from .views import ClientDashboardView, FreelancerDashboardView

urlpatterns = [
    path("client/", ClientDashboardView.as_view()),
    path("freelancer/", FreelancerDashboardView.as_view()),
]
