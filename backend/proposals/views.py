from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction

from .models import Proposal
from .serializers import ProposalSerializer
from .permissions import IsFreelancer
from projects.models import Project
from contracts.models import Contract
from notifications.models import Notification


# -------------------------------------------------
# CREATE PROPOSAL (FREELANCER)
# -------------------------------------------------
class ProposalCreateView(generics.CreateAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]

        # Do not allow proposals if contract already exists
        if Contract.objects.filter(project=project).exists():
            raise PermissionDenied(
                "This project is no longer accepting proposals."
            )

        serializer.save(freelancer=self.request.user)


# -------------------------------------------------
# MY PROPOSALS (FREELANCER)
# -------------------------------------------------
class MyProposalsView(generics.ListAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def get_queryset(self):
        return Proposal.objects.filter(
            freelancer=self.request.user
        ).order_by("-created_at")


# -------------------------------------------------
# PROJECT PROPOSALS (CLIENT)
# -------------------------------------------------
class ProjectProposalsView(generics.ListAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get("project_id")

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise PermissionDenied("Project not found")

        if project.client != self.request.user:
            raise PermissionDenied(
                "You do not have permission to view proposals for this project"
            )

        return Proposal.objects.filter(
            project=project
        ).order_by("-created_at")


# -------------------------------------------------
# ACCEPT / REJECT PROPOSAL (CLIENT)
# -------------------------------------------------
class ProposalDecisionView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, proposal_id):
        try:
            proposal = Proposal.objects.select_for_update().select_related(
                "project", "freelancer"
            ).get(id=proposal_id)
        except Proposal.DoesNotExist:
            return Response(
                {"detail": "Proposal not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        project = proposal.project

        # 🔒 Only project owner can decide
        if project.client != request.user:
            return Response(
                {"detail": "You are not allowed to perform this action"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Already processed
        if proposal.status != "pending":
            return Response(
                {"detail": "This proposal is already processed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        action = request.data.get("action")

        # ================= ACCEPT =================
        if action == "accept":

            # Prevent duplicate contracts
            if Contract.objects.filter(project=project).exists():
                return Response(
                    {"detail": "Contract already exists for this project"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Accept selected proposal
            proposal.status = "accepted"
            proposal.save()

            # Reject all others
            Proposal.objects.filter(
                project=project
            ).exclude(id=proposal.id).update(status="rejected")

            # ✅ CREATE CONTRACT (FIXED)
            contract = Contract.objects.create(
                project=project,
                proposal=proposal,
                client=project.client,
                freelancer=proposal.freelancer,
                bid_amount=proposal.bid_amount,  # 🔥 IMPORTANT
                progress=0,
                is_active=True
            )

            # 🔔 Notifications
            Notification.objects.create(
                user=proposal.freelancer,
                message=f"Your proposal for '{project.title}' was accepted."
            )

            Notification.objects.create(
                user=project.client,
                message=f"Contract created for '{project.title}'."
            )

            return Response(
                {
                    "detail": "Proposal accepted and contract created",
                    "contract_id": contract.id
                },
                status=status.HTTP_200_OK
            )

        # ================= REJECT =================
        if action == "reject":
            proposal.status = "rejected"
            proposal.save()

            Notification.objects.create(
                user=proposal.freelancer,
                message=f"Your proposal for '{project.title}' was rejected."
            )

            return Response(
                {"detail": "Proposal rejected"},
                status=status.HTTP_200_OK
            )

        return Response(
            {"detail": "Invalid action. Use 'accept' or 'reject'"},
            status=status.HTTP_400_BAD_REQUEST
        )
