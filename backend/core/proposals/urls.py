from django.urls import path
from .views import (
    ProposalCreateView,
    FreelancerProposalListView,
    ClientProposalListView, ProposalStatusUpdateView, ProjectProposalsView
)

urlpatterns = [
    path("create/", ProposalCreateView.as_view()),
    path("my/", FreelancerProposalListView.as_view()),
    path("for-my-projects/", ClientProposalListView.as_view()),
    path("update-status/<int:pk>/", ProposalStatusUpdateView.as_view()),
    # path("<int:project_id>/proposals/", ProjectProposalsView.as_view()),
]