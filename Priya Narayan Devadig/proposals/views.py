from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Proposal
from .serializers import ProposalSerializer, ProposalCreateSerializer


class ProposalListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProposalCreateSerializer
        return ProposalSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Proposal.objects.select_related('project', 'freelancer').all()
        
        # Filter by project
        project_id = self.request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        # Filter by status
        proposal_status = self.request.query_params.get('status', None)
        if proposal_status:
            queryset = queryset.filter(status=proposal_status)
        
        # Show only user's proposals if freelancer
        if user.user_type == 'freelancer':
            my_proposals = self.request.query_params.get('my_proposals', 'true')
            if my_proposals == 'true':
                queryset = queryset.filter(freelancer=user)
        
        # Show only proposals for user's projects if client
        if user.user_type == 'client':
            queryset = queryset.filter(project__client=user)
        
        return queryset.order_by('-submitted_at')

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)


class ProposalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Proposal.objects.select_related('project', 'freelancer').all()
        
        # Freelancers can only access their own proposals
        if user.user_type == 'freelancer':
            queryset = queryset.filter(freelancer=user)
        # Clients can access proposals for their projects
        elif user.user_type == 'client':
            queryset = queryset.filter(project__client=user)
        
        return queryset


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_proposal(request, pk):
    """Client accepts a proposal"""
    try:
        proposal = Proposal.objects.get(pk=pk, project__client=request.user)
        
        if proposal.status != 'pending':
            return Response(
                {'error': 'Only pending proposals can be accepted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Accept this proposal
        proposal.status = 'accepted'
        proposal.save()
        
        # Reject other proposals for the same project
        Proposal.objects.filter(
            project=proposal.project
        ).exclude(pk=pk).update(status='rejected')
        
        # Update project status
        proposal.project.status = 'in_progress'
        proposal.project.save()
        
        return Response(ProposalSerializer(proposal).data)
    
    except Proposal.DoesNotExist:
        return Response(
            {'error': 'Proposal not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_proposal(request, pk):
    """Client rejects a proposal"""
    try:
        proposal = Proposal.objects.get(pk=pk, project__client=request.user)
        
        if proposal.status != 'pending':
            return Response(
                {'error': 'Only pending proposals can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        proposal.status = 'rejected'
        proposal.save()
        
        return Response(ProposalSerializer(proposal).data)
    
    except Proposal.DoesNotExist:
        return Response(
            {'error': 'Proposal not found'},
            status=status.HTTP_404_NOT_FOUND
        )