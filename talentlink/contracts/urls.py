# contracts/urls.py
from django.urls import path
from .views import CreateContractFromProposalView, MyContractsView, ContractStatusUpdateView

urlpatterns = [
    path('create/<int:proposal_id>/', CreateContractFromProposalView.as_view(), name='create-contract'),
    path('my/', MyContractsView.as_view(), name='my-contracts'),
    path('<int:id>/status/', ContractStatusUpdateView.as_view(), name='update-contract-status'),
    
]
