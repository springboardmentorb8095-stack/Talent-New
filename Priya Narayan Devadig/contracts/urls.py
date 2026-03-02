from django.urls import path
from . import views

urlpatterns = [
    # Contract CRUD
    path('', views.ContractListView.as_view(), name='contract-list'),
    path('<int:pk>/', views.ContractDetailView.as_view(), name='contract-detail'),
    path('create/<int:proposal_id>/', views.create_contract_from_proposal, name='contract-create'),
    
    # Contract actions
    path('<int:pk>/complete/', views.complete_contract, name='contract-complete'),
    path('<int:pk>/terminate/', views.terminate_contract, name='contract-terminate'),
    path('<int:pk>/progress/', views.update_contract_progress, name='contract-progress'),
    
    # Milestones
    path('<int:pk>/milestones/', views.add_milestone, name='contract-add-milestone'),
    path('<int:pk>/milestones/<int:milestone_id>/complete/', views.complete_milestone, name='contract-complete-milestone'),
    
    # Review-related
    path('pending-review/', views.get_contracts_pending_review, name='contracts-pending-review'),
    path('<int:pk>/request-completion/', views.request_completion, name='contract-request-completion'),
    
    # Statistics
    path('statistics/', views.contract_statistics, name='contract-statistics'),
]