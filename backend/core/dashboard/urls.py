from django.urls import path
from .views import client_dashboard, freelancer_dashboard

urlpatterns = [
    path("client/", client_dashboard),
    path("freelancer/", freelancer_dashboard),
]
