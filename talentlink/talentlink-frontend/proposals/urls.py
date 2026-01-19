from django.urls import path
from .views import (
    ProposalCreateView,
    MyProposalsView,
    ProjectProposalsView,
    ProposalStatusUpdateView
)

urlpatterns = [
    path('create/', ProposalCreateView.as_view()),
    path('my/', MyProposalsView.as_view()),
    path('projects/<int:project_id>/proposals/', ProjectProposalsView.as_view()),
    path('<int:proposal_id>/status/', ProposalStatusUpdateView.as_view()),
    
]

