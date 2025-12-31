from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Proposal
from .serializers import ProposalCreateSerializer, ProposalListSerializer
from .permissions import IsAuthenticatedUser , IsFreelancer
from projects.models import Project

class ProposalCreateView(generics.CreateAPIView):
    serializer_class = ProposalCreateSerializer
    permission_classes = [IsAuthenticatedUser, IsFreelancer]


class MyProposalsView(generics.ListAPIView):
    serializer_class = ProposalListSerializer
    permission_classes = [IsAuthenticatedUser]


    def get_queryset(self):
        return Proposal.objects.filter(freelancer=self.request.user)

class ProjectProposalsView(generics.ListAPIView):
    serializer_class = ProposalListSerializer
    permission_classes = [IsAuthenticatedUser]


    def get_queryset(self):
        project = get_object_or_404(
            Project,
            id=self.kwargs['project_id'],
            client=self.request.user
        )
        return Proposal.objects.filter(project=project)

class ProposalStatusUpdateView(APIView):
   
    permission_classes = [IsAuthenticatedUser]
    def patch(self, request, proposal_id):
        proposal = get_object_or_404(
            Proposal,
            id=proposal_id,
            project__client=request.user
        )

        new_status = request.data.get('status')
        if new_status not in ['accepted', 'rejected']:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        proposal.status = new_status
        proposal.save()

        return Response(
            {"message": f"Proposal {new_status} successfully"},
            status=status.HTTP_200_OK
        )