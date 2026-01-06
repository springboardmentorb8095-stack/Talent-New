from django.urls import path
from .views import (
    ProposalCreateView,
    ProjectProposalsView,
    ProposalAcceptView,
    ProposalRejectView,
    MyProposalView,
)

urlpatterns = [
    path("projects/<int:project_id>/proposals/create/", ProposalCreateView.as_view()),
    path("projects/<int:project_id>/proposals/list/", ProjectProposalsView.as_view()),
    path("proposals/<int:proposal_id>/accept/", ProposalAcceptView.as_view()),
    path("proposals/<int:proposal_id>/reject/", ProposalRejectView.as_view()),
    path("proposals/my-proposal/<int:project_id>/", MyProposalView.as_view()),
]
