from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Message
from .serializers import MessageSerializer
from contracts.models import Contract
from notifications.models import Notification   # 🔔 NEW IMPORT


# -------------------------------------------------
# List messages for a contract
# -------------------------------------------------
class ContractMessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        contract_id = self.kwargs.get("contract_id")
        user = self.request.user

        # Ensure contract exists
        try:
            contract = Contract.objects.get(id=contract_id)
        except Contract.DoesNotExist:
            raise PermissionDenied("Contract not found")

        # Only client or freelancer can view messages
        if user not in [contract.client, contract.freelancer]:
            raise PermissionDenied("You are not allowed to view these messages")

        return Message.objects.filter(
            contract=contract
        ).order_by("created_at")


# -------------------------------------------------
# Send message for a contract
# -------------------------------------------------
class ContractMessageCreateView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        contract_id = self.kwargs.get("contract_id")
        user = request.user
        content = request.data.get("content")

        if not content:
            return Response(
                {"detail": "Message content is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure contract exists
        try:
            contract = Contract.objects.get(id=contract_id)
        except Contract.DoesNotExist:
            return Response(
                {"detail": "Contract not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Only contract participants can send messages
        if user not in [contract.client, contract.freelancer]:
            raise PermissionDenied("You are not allowed to send messages")

        # Decide receiver
        receiver = (
            contract.freelancer
            if user == contract.client
            else contract.client
        )

        message = Message.objects.create(
            sender=user,
            receiver=receiver,
            contract=contract,
            content=content
        )

        # 🔔 CHAT NOTIFICATION (NEW)
        Notification.objects.create(
            user=receiver,
            message=f"New message received for contract '{contract.project.title}'."
        )

        serializer = self.get_serializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
