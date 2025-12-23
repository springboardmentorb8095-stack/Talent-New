from django.urls import path
from . import views

urlpatterns = [
    path('', views.ContractListView.as_view(), name='contract-list'),
    path('<int:pk>/', views.ContractDetailView.as_view(), name='contract-detail'),
    path('create/<int:proposal_id>/', views.create_contract_from_proposal, name='contract-create'),
    path('<int:pk>/complete/', views.complete_contract, name='contract-complete'),
    path('<int:pk>/terminate/', views.terminate_contract, name='contract-terminate'),
]