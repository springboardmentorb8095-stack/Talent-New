from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Proposal
from .serializers import ProposalSerializer
from projects.models import Project
from userprofiles.models import UserProfile



class ProposalCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):

        print("USERNAME:", request.user.username)
        print("AUTH USER:", request.user.is_authenticated)

        if hasattr(request.user, "userprofile"):
            print("ROLE:", request.user.userprofile.role)
        else:
            print("NO USERPROFILE FOUND")

        if not hasattr(request.user, "userprofile") or request.user.userprofile.role != "freelancer":
            return Response(
                {"error": "Only freelancers can submit proposals"},
                status=status.HTTP_403_FORBIDDEN
            )

        project = get_object_or_404(Project, id=project_id)

        if Proposal.objects.filter(project=project, freelancer=request.user).exists():
            return Response(
                {"error": "You have already submitted a proposal for this project"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProposalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project, freelancer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProjectProposalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        
        if project.client != request.user:
            return Response(
                {"error": "You are not allowed to view proposals for this project"},
                status=status.HTTP_403_FORBIDDEN
            )

        proposals = project.proposals.all()
        serializer = ProposalSerializer(proposals, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ProposalAcceptView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, proposal_id):
        proposal = get_object_or_404(Proposal, id=proposal_id)

      
        if proposal.project.client != request.user:
            return Response(
                {"error": "You are not allowed to accept this proposal"},
                status=status.HTTP_403_FORBIDDEN
            )

        proposal.status = "accepted"
        proposal.save()

        serializer = ProposalSerializer(proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)



class ProposalRejectView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, proposal_id):
        proposal = get_object_or_404(Proposal, id=proposal_id)

       
        if proposal.project.client != request.user:
            return Response(
                {"error": "You are not allowed to reject this proposal"},
                status=status.HTTP_403_FORBIDDEN
            )

        proposal.status = "rejected"
        proposal.save()

        serializer = ProposalSerializer(proposal)
        return Response(serializer.data, status=status.HTTP_200_OK)



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
