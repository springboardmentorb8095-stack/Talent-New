from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError

from .models import Review
from .serializers import ReviewSerializer
from .permissions import IsClientReviewer
from contracts.models import Contract
from notifications.models import Notification


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsClientReviewer]

    def perform_create(self, serializer):
        contract_id = self.request.data.get("contract")

        try:
            contract = Contract.objects.get(id=contract_id)
        except Contract.DoesNotExist:
            raise ValidationError("Invalid contract")

        if contract.client != self.request.user:
            raise PermissionDenied("You are not allowed to review this contract")

        if contract.is_active:
            raise ValidationError("Contract must be completed before review")

        if hasattr(contract, "review"):
            raise ValidationError("Review already exists for this contract")

        serializer.save(
            contract=contract,
            client=contract.client,
            freelancer=contract.freelancer
        )

        # 🔔 NOTIFICATION
        Notification.objects.create(
            user=contract.freelancer,
            message=f"You received a new review for '{contract.project.title}'."
        )


class FreelancerReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        freelancer_id = self.kwargs.get("freelancer_id")
        return Review.objects.filter(
            freelancer_id=freelancer_id
        ).order_by("-created_at")
