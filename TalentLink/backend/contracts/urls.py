from django.urls import path
from .views import (
    MyContractsView,
    ContractStatusUpdateView,
    ongoing_contracts,
    create_milestone,
    update_milestone_progress,
)



urlpatterns = [
    path("contracts/my/", MyContractsView.as_view(), name="my-contracts"),
    path(
        "contracts/<int:contract_id>/update-status/",
        ContractStatusUpdateView.as_view(),
        name="contract-update-status",
    ),
    path("ongoing/", ongoing_contracts),
    path("milestones/create/", create_milestone),
    path(
    "milestones/<int:milestone_id>/update/",
    update_milestone_progress,
),

]

