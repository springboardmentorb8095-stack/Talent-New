from django.urls import path
from .views import (
    ContractMessageListView,
    ContractMessageCreateView,
)

urlpatterns = [
    # List messages for a contract
    path("<int:contract_id>/", ContractMessageListView.as_view(), name="chat-list"),

    # Send message for a contract
    path("<int:contract_id>/send/", ContractMessageCreateView.as_view(), name="chat-send"),
]
