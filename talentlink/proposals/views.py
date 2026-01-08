
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Proposal
from .serializers import ProposalCreateSerializer, ProposalListSerializer
from .permissions import IsAuthenticatedUser, IsFreelancer
from projects.models import Project

from rest_framework import generics
from django.shortcuts import get_object_or_404
from .models import Proposal
from .serializers import ProposalListSerializer
from projects.models import Project

class ProjectProposalsView(generics.ListAPIView):
    serializer_class = ProposalListSerializer

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        project = get_object_or_404(Project, id=project_id)

        user = self.request.user
        # Client sees all proposals
        if project.client == user:
            return Proposal.objects.filter(project=project)
        # Freelancer sees only their own proposal
        return Proposal.objects.filter(project=project, freelancer=user)

# -------------------------------
# Create a Proposal (Freelancer)
# -------------------------------
class ProposalCreateView(generics.CreateAPIView):
    serializer_class = ProposalCreateSerializer
    permission_classes = [IsAuthenticatedUser, IsFreelancer]

    def perform_create(self, serializer):
        # automatically assign the logged-in user as the freelancer
        serializer.save(freelancer=self.request.user)


# -------------------------------
# List My Proposals (Freelancer)
# -------------------------------
class MyProposalsView(generics.ListAPIView):
    serializer_class = ProposalListSerializer
    permission_classes = [IsAuthenticatedUser]

    def get_queryset(self):
        return Proposal.objects.filter(freelancer=self.request.user).order_by('-created_at')



# -------------------------------
# Update Proposal Status (Client)
# -------------------------------
class ProposalStatusUpdateView(APIView):
    permission_classes = [IsAuthenticatedUser]

    def patch(self, request, proposal_id):
        # Get the proposal for the client
        proposal = get_object_or_404(
            Proposal,
            id=proposal_id,
            project__client=request.user
        )

        new_status = request.data.get('status')

        # Validate the new status
        if new_status not in ['accepted', 'rejected']:
            return Response(
                {"error": "Invalid status. Allowed: 'accepted' or 'rejected'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update and save
        proposal.status = new_status
        proposal.save()

        return Response(
            {"message": f"Proposal {new_status} successfully."},
            status=status.HTTP_200_OK
        )
