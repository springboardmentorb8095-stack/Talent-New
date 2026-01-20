from django.urls import path
from .views import (
    ProposalCreateView,
    ProjectProposalsView,
    ProposalAcceptView,
    ProposalRejectView,
    MyProposalView,
    MyProposalsView,
)

urlpatterns = [
    # Freelancer submits proposal
    path(
        "projects/<int:project_id>/proposals/create/",
        ProposalCreateView.as_view()
    ),

    # Client views proposals for a project
    path(
        "projects/<int:project_id>/proposals/list/",
        ProjectProposalsView.as_view()
    ),

    # Client actions
    path(
        "proposals/<int:proposal_id>/accept/",
        ProposalAcceptView.as_view()
    ),
    path(
        "proposals/<int:proposal_id>/reject/",
        ProposalRejectView.as_view()
    ),

    # Freelancer views proposal for a project
    path(
        "proposals/my-proposal/<int:project_id>/",
        MyProposalView.as_view()
    ),

    # ✅ FREELANCER DASHBOARD (THIS FIXES YOUR ERROR)
    path(
        "proposals/my/",
        MyProposalsView.as_view()
    ),
]
