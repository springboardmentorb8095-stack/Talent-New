from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProposalListCreateView.as_view(), name='proposal-list-create'),
    path('<int:pk>/', views.ProposalDetailView.as_view(), name='proposal-detail'),
    path('<int:pk>/accept/', views.accept_proposal, name='proposal-accept'),
    path('<int:pk>/reject/', views.reject_proposal, name='proposal-reject'),
]