from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Proposal
from .serializers import ProposalSerializer, ProposalCreateSerializer
from accounts.notifications import (
    notify_proposal_received, 
    notify_proposal_accepted, 
    notify_proposal_rejected,
    notify_contract_created
)


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
        if project_id and project_id != 'undefined':
            try:
                project_id = int(project_id)
                queryset = queryset.filter(project_id=project_id)
            except (ValueError, TypeError):
                # Invalid project ID, return empty queryset
                return queryset.none()
        
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
        proposal = serializer.save(freelancer=self.request.user)
        
        # Notify the client about the new proposal
        notify_proposal_received(proposal.project.client, proposal)


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
    """Client accepts a proposal and automatically creates a contract"""
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
        
        # Notify freelancer about acceptance
        notify_proposal_accepted(proposal.freelancer, proposal)
        
        # Reject other proposals for the same project and notify freelancers
        other_proposals = Proposal.objects.filter(
            project=proposal.project,
            status='pending'
        ).exclude(pk=pk)
        
        for other_proposal in other_proposals:
            other_proposal.status = 'rejected'
            other_proposal.save()
            notify_proposal_rejected(other_proposal.freelancer, other_proposal)
        
        # Update project status
        proposal.project.status = 'in_progress'
        proposal.project.save()
        
        # Automatically create contract
        from contracts.models import Contract
        from datetime import timedelta
        from django.utils import timezone
        
        # Calculate end date based on proposal duration
        end_date = timezone.now() + timedelta(days=proposal.estimated_duration)
        
        contract = Contract.objects.create(
            project=proposal.project,
            client=request.user,
            freelancer=proposal.freelancer,
            proposal=proposal,
            agreed_budget=proposal.proposed_budget,
            end_date=end_date,
            terms_and_conditions=f"Contract for project: {proposal.project.title}\n"
                                f"Agreed budget: ${proposal.proposed_budget}\n"
                                f"Duration: {proposal.estimated_duration} days\n"
                                f"Freelancer: {proposal.freelancer.get_full_name()}\n"
                                f"Client: {request.user.get_full_name()}",
            status='active'
        )
        
        # Notify both parties about contract creation
        notify_contract_created(request.user, proposal.freelancer, contract)
        
        # Return proposal data with contract info
        response_data = ProposalSerializer(proposal).data
        response_data['contract_created'] = True
        response_data['contract_id'] = contract.id
        
        return Response(response_data)
    
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
        
        # Notify freelancer about rejection
        notify_proposal_rejected(proposal.freelancer, proposal)
        
        return Response(ProposalSerializer(proposal).data)
    
    except Proposal.DoesNotExist:
        return Response(
            {'error': 'Proposal not found'},
            status=status.HTTP_404_NOT_FOUND
        )