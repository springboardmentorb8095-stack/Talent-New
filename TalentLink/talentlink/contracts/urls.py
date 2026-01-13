from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContractViewSet, ContractFromProposalView

router = DefaultRouter()
router.register(r'contracts', ContractViewSet, basename='contract')

urlpatterns = [
    path('', include(router.urls)),
    path('proposals/<int:proposal_id>/create-contract/', ContractFromProposalView.as_view(), name='create-contract-from-proposal'),
]