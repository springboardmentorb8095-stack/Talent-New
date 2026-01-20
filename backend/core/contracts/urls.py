from django.urls import path
from .views import MyContractsView, ContractStatusUpdateView, ContractDetailView, SubmitWorkView, CompleteWorkView

urlpatterns = [
    path("my-contracts/", MyContractsView.as_view(), name="my-contracts"),
    path("<int:pk>/", ContractDetailView.as_view(), name="contract-detail"),
    path("<int:pk>/status/", ContractStatusUpdateView.as_view(), name="contract-status-update"),
    path('<int:pk>/submit/', SubmitWorkView.as_view(), name='contract-submit'),
    path('<int:pk>/complete/', CompleteWorkView.as_view(), name='contract-complete'),
]