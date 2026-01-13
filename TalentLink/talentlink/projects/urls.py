from django.urls import path
from .views import (
    ProjectListCreateView,
    ProjectDetailView,
    ClientProjectListView,
    ProposalListCreateView,
    ProposalDetailView
)

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='project-list-create'),
    path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('my/', ClientProjectListView.as_view(), name='client-projects'),
    path('<int:project_id>/proposals/', ProposalListCreateView.as_view(), name='project-proposals'),
    path('proposals/', ProposalListCreateView.as_view(), name='proposal-list'),
    path('proposals/<int:pk>/', ProposalDetailView.as_view(), name='proposal-detail'),
]