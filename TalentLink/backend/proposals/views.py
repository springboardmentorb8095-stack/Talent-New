from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Proposal
from .serializers import ProposalSerializer
from projects.models import Project
from contracts.models import Contract


# ==============================
# FREELANCER → CREATE PROPOSAL
# ==============================
class ProposalCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        if not hasattr(request.user, "userprofile") or request.user.userprofile.role != "freelancer":
            return Response(
                {"error": "Only freelancers can submit proposals"},
                status=status.HTTP_403_FORBIDDEN
            )

        project = get_object_or_404(Project, id=project_id)

        if Proposal.objects.filter(project=project, freelancer=request.user).exists():
            return Response(
                {"error": "You have already submitted a proposal"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProposalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project, freelancer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==============================
# CLIENT → VIEW PROJECT PROPOSALS
# ==============================
class ProjectProposalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        if project.client != request.user:
            return Response(
                {"error": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        proposals = project.proposals.all()
        serializer = ProposalSerializer(proposals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ==============================
# CLIENT → ACCEPT PROPOSAL (WEEK 5 CORE)
# ==============================
class ProposalAcceptView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, proposal_id):
        proposal = get_object_or_404(Proposal, id=proposal_id)

        if proposal.project.client != request.user:
            return Response(
                {"error": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Prevent duplicate contracts
        if Contract.objects.filter(project=proposal.project).exists():
            return Response(
                {"error": "Contract already exists for this project"},
                status=status.HTTP_400_BAD_REQUEST
            )

        proposal.status = "accepted"
        proposal.save()

        # ✅ AUTO CREATE CONTRACT
        Contract.objects.create(
            project=proposal.project,
            client=proposal.project.client,
            freelancer=proposal.freelancer,
            status="active"
        )

        serializer = ProposalSerializer(proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ==============================
# CLIENT → REJECT PROPOSAL
# ==============================
class ProposalRejectView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, proposal_id):
        proposal = get_object_or_404(Proposal, id=proposal_id)

        if proposal.project.client != request.user:
            return Response(
                {"error": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        proposal.status = "rejected"
        proposal.save()

        serializer = ProposalSerializer(proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ==============================
# FREELANCER → VIEW PROPOSAL FOR A PROJECT
# ==============================
class MyProposalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            proposal = Proposal.objects.get(
                project_id=project_id,
                freelancer=request.user
            )
            serializer = ProposalSerializer(proposal)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Proposal.DoesNotExist:
            return Response(
                {"detail": "No proposal found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ==============================
# ✅ FREELANCER → MY PROPOSALS (DASHBOARD)
# ==============================
class MyProposalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        proposals = Proposal.objects.filter(freelancer=request.user)
        serializer = ProposalSerializer(proposals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)





