from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import UpdateAPIView, ListAPIView
from datetime import date, timedelta

from .models import Proposal
from .serializers import ProposalSerializer, ProposalStatusUpdateSerializer
from contracts.models import Contract
from notifications.models import Notification
from users.permissions import IsFreelancer, IsClient

# ----------------------------
# Proposal Creation (Freelancer)
# ----------------------------
class ProposalCreateView(generics.CreateAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def perform_create(self, serializer):
        proposal = serializer.save(freelancer=self.request.user)

        # Notify the client
        Notification.objects.create(
            recipient=proposal.project.client,
            message=f"You received a proposal for your project '{proposal.project.title}'."
        )


# ----------------------------
# Freelancer Proposals List
# ----------------------------
class FreelancerProposalListView(generics.ListAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def get_queryset(self):
        return Proposal.objects.filter(freelancer=self.request.user)


# ----------------------------
# Client Proposals List
# ----------------------------
class ClientProposalListView(generics.ListAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated, IsClient]

    def get_queryset(self):
        return Proposal.objects.filter(project__client=self.request.user)


# ----------------------------
# Proposal Status Update (Client Accept/Reject)
# ----------------------------
class ProposalStatusUpdateView(UpdateAPIView):
    serializer_class = ProposalStatusUpdateSerializer
    permission_classes = [IsAuthenticated, IsClient]
    queryset = Proposal.objects.all()

    def get_object(self):
        proposal = super().get_object()

        if proposal.project.client != self.request.user:
            raise PermissionDenied("Not your project")

        if proposal.status != "pending":
            raise PermissionDenied("Proposal already processed")

        return proposal

    def perform_update(self, serializer):
        proposal = self.get_object()
        serializer.save()

        # Notify freelancer if proposal accepted
        if serializer.validated_data["status"] == "accepted":
            project_duration_days = proposal.project.duration or 30
            Contract.objects.create(
                proposal=proposal,
                start_date=date.today(),
                end_date=date.today() + timedelta(days=project_duration_days),
            )
            proposal.project.is_active = False
            proposal.project.save()

            Notification.objects.create(
                recipient=proposal.freelancer,
                message=f"Your proposal for '{proposal.project.title}' was accepted!"
            )
        elif serializer.validated_data["status"] == "rejected":
            Notification.objects.create(
                recipient=proposal.freelancer,
                message=f"Your proposal for '{proposal.project.title}' was rejected."
            )



# ----------------------------
# View Proposals for a Project (Client)
# ----------------------------
class ProjectProposalsView(ListAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated, IsClient]

    def get_queryset(self):
        project_id = self.kwargs["project_id"]
        return Proposal.objects.filter(project_id=project_id, project__client=self.request.user)
