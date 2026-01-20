from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import Contract
from .serializers import ContractSerializer
from .permissions import IsContractParty, CanCompleteContract
from notifications.models import Notification
from users.permissions import IsClient, IsFreelancer

# ----------------------------
# My Contracts
# ----------------------------
class MyContractsView(ListAPIView):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "client":
            return Contract.objects.filter(proposal__project__client=user)
        if user.role == "freelancer":
            return Contract.objects.filter(proposal__freelancer=user)
        return Contract.objects.none()


# ----------------------------
# Contract Details
# ----------------------------
class ContractDetailView(RetrieveAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated, IsContractParty]


# ----------------------------
# Update Contract Status (Completed / Cancelled)
# ----------------------------
class ContractStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsContractParty]

    def patch(self, request, pk):
        contract = get_object_or_404(Contract, pk=pk)
        self.check_object_permissions(request, contract)

        new_status = request.data.get("status")
        if contract.status != "active":
            return Response({"error": "Contract is not active"}, status=status.HTTP_400_BAD_REQUEST)

        elif new_status == "completed":
            if not CanCompleteContract().has_object_permission(request, self, contract):
                return Response({"error": "Only client can complete"}, status=status.HTTP_403_FORBIDDEN)
            contract.status = "completed"
            contract.completed_at = timezone.now()
            contract.save()

            # Notify freelancer
            Notification.objects.create(
                recipient=contract.proposal.freelancer,
                message=f"Client marked contract '{contract.proposal.project.title}' as completed."
            )

        elif new_status == "cancelled":
            contract.status = "cancelled"
            contract.save()

            # Notify freelancer
            Notification.objects.create(
                recipient=contract.proposal.freelancer,
                message=f"Client cancelled contract '{contract.proposal.project.title}'."
            )
        else:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"status": contract.status})


# ----------------------------
# Submit Work (Freelancer)
# ----------------------------
class SubmitWorkView(APIView):
    permission_classes = [IsAuthenticated, IsFreelancer, IsContractParty]

    def patch(self, request, pk):
        contract = get_object_or_404(Contract, pk=pk)
        self.check_object_permissions(request, contract)

        if contract.status != "active":
            return Response({"error": "Only active contracts can be submitted"}, status=400)

        contract.status = "submitted"
        contract.work_submitted_at = timezone.now()
        contract.progress = 100
        contract.save()

        # Notify client
        Notification.objects.create(
            recipient=contract.proposal.project.client,
            message=f"Freelancer submitted work for contract '{contract.proposal.project.title}'."
        )

        return Response({"status": "submitted"})


# ----------------------------
# Complete Work (Client)
# ----------------------------
class CompleteWorkView(APIView):
    permission_classes = [IsAuthenticated, IsClient, IsContractParty]

    def patch(self, request, pk):
        contract = get_object_or_404(Contract, pk=pk)
        self.check_object_permissions(request, contract)

        if contract.status != "submitted":
            return Response({"error": "Contract must be submitted first"}, status=400)

        contract.status = "completed"
        contract.completed_at = timezone.now()
        contract.save()

        # Notify freelancer
        Notification.objects.create(
            recipient=contract.proposal.freelancer,
            message=f"Client confirmed completion of contract '{contract.proposal.project.title}'."
        )

        return Response({"status": "completed"})