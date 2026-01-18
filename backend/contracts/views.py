from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone

from .models import Contract
from .serializers import ContractSerializer
from notifications.models import Notification


class ContractListView(generics.ListAPIView):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "client":
            return Contract.objects.filter(
                client=user
            ).order_by("-start_date")

        if user.role == "freelancer":
            return Contract.objects.filter(
                freelancer=user
            ).order_by("-start_date")

        return Contract.objects.none()


class ContractUpdateView(generics.UpdateAPIView):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]
    queryset = Contract.objects.all()

    def patch(self, request, *args, **kwargs):
        contract = self.get_object()
        user = request.user
        action = request.data.get("action")

        # 🔒 Security: only participants
        if user not in [contract.client, contract.freelancer]:
            raise PermissionDenied("You are not part of this contract")

        # ❌ CANCEL CONTRACT (CLIENT OR FREELANCER)
        if action == "cancel":
            if not contract.is_active:
                return Response(
                    {"detail": "Contract already closed"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            contract.is_active = False
            contract.end_date = timezone.now()
            contract.save()

            other_user = (
                contract.freelancer
                if user == contract.client
                else contract.client
            )

            Notification.objects.create(
                user=other_user,
                message=(
                    f"The contract for '{contract.project.title}' "
                    f"was cancelled."
                )
            )

            return Response(
                {"detail": "Contract cancelled"},
                status=status.HTTP_200_OK
            )

        # ✅ UPDATE PROGRESS (FREELANCER ONLY)
        if action == "progress":
            if user != contract.freelancer:
                raise PermissionDenied(
                    "Only freelancer can update progress"
                )

            if not contract.is_active:
                return Response(
                    {"detail": "Cannot update a closed contract"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            progress = request.data.get("progress")

            try:
                progress = int(progress)
            except (TypeError, ValueError):
                return Response(
                    {"detail": "Progress must be a number"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not 0 <= progress <= 100:
                return Response(
                    {"detail": "Progress must be between 0 and 100"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            contract.progress = progress
            contract.save()

            Notification.objects.create(
                user=contract.client,
                message=(
                    f"Progress updated to {progress}% "
                    f"for '{contract.project.title}'."
                )
            )

            return Response(
                {"detail": "Progress updated"},
                status=status.HTTP_200_OK
            )

        # 🟢 COMPLETE CONTRACT (CLIENT ONLY)
        if action == "complete":
            if user != contract.client:
                raise PermissionDenied(
                    "Only client can complete contract"
                )

            if not contract.is_active:
                return Response(
                    {"detail": "Contract already closed"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if contract.progress < 100:
                return Response(
                    {
                        "detail":
                        "Project must be 100% completed before closing"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            contract.is_active = False
            contract.end_date = timezone.now()
            contract.save()

            Notification.objects.create(
                user=contract.freelancer,
                message=(
                    f"The contract for '{contract.project.title}' "
                    f"has been completed. "
                    f"Earnings credited: ₹{contract.bid_amount}"
                )
            )

            return Response(
                {"detail": "Contract marked as completed"},
                status=status.HTTP_200_OK
            )

        return Response(
            {
                "detail":
                "Invalid action. Use 'cancel', 'progress' or 'complete'"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
