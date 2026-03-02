from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db import models
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Contract
from .serializers import ContractSerializer, ContractCreateSerializer, ContractUpdateSerializer
from proposals.models import Proposal
from accounts.notifications import notify_contract_completed, notify_contract_created
import json


class ContractListView(generics.ListAPIView):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Contract.objects.select_related('project', 'client', 'freelancer', 'proposal').filter(
            models.Q(client=user) | models.Q(freelancer=user)
        )
        
        # Filter by status
        contract_status = self.request.query_params.get('status', None)
        if contract_status:
            queryset = queryset.filter(status=contract_status)
        
        # Filter by payment status
        payment_status = self.request.query_params.get('payment_status', None)
        if payment_status:
            queryset = queryset.filter(payment_status=payment_status)
        
        # Filter overdue contracts
        overdue = self.request.query_params.get('overdue', None)
        if overdue == 'true':
            queryset = queryset.filter(
                end_date__lt=timezone.now(),
                status__in=['active', 'in_progress']
            )
        
        return queryset.order_by('-created_at')


class ContractDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(
            models.Q(client=user) | models.Q(freelancer=user)
        )
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ContractUpdateSerializer
        return ContractSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_contract_from_proposal(request, proposal_id):
    """Create a contract from an accepted proposal (automatic process)"""
    try:
        proposal = get_object_or_404(
            Proposal.objects.select_related('project', 'freelancer'),
            pk=proposal_id,
            project__client=request.user,
            status='accepted'
        )
        
        # Check if contract already exists
        if hasattr(proposal, 'contract'):
            return Response(
                {'error': 'Contract already exists for this proposal'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create contract with enhanced details
        from datetime import timedelta
        
        contract_data = {
            'project': proposal.project,
            'client': request.user,
            'freelancer': proposal.freelancer,
            'proposal': proposal,
            'agreed_budget': proposal.proposed_budget,
            'end_date': timezone.now() + timedelta(days=proposal.estimated_duration),
            'terms_and_conditions': request.data.get('terms_and_conditions', 
                f"Contract for project: {proposal.project.title}\n"
                f"Agreed budget: ${proposal.proposed_budget}\n"
                f"Duration: {proposal.estimated_duration} days\n"
                f"Freelancer: {proposal.freelancer.get_full_name()}\n"
                f"Client: {request.user.get_full_name()}"
            ),
            'deliverables': request.data.get('deliverables', proposal.project.description),
            'status': 'active'
        }
        
        contract = Contract.objects.create(**contract_data)
        
        # Add milestones if provided
        milestones = request.data.get('milestones', [])
        for milestone_data in milestones:
            contract.add_milestone(
                title=milestone_data.get('title'),
                description=milestone_data.get('description'),
                due_date=milestone_data.get('due_date'),
                amount=milestone_data.get('amount', 0)
            )
        
        # Send notifications
        notify_contract_created(request.user, proposal.freelancer, contract)
        
        return Response(
            ContractSerializer(contract).data,
            status=status.HTTP_201_CREATED
        )
    
    except Proposal.DoesNotExist:
        return Response(
            {'error': 'Proposal not found or not accepted'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_contract_progress(request, pk):
    """Update contract progress percentage"""
    try:
        contract = get_object_or_404(
            Contract.objects.filter(
                models.Q(client=request.user) | models.Q(freelancer=request.user)
            ),
            pk=pk
        )
        
        progress = request.data.get('progress', 0)
        if not isinstance(progress, (int, float)) or progress < 0 or progress > 100:
            return Response(
                {'error': 'Progress must be a number between 0 and 100'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        contract.update_progress(progress)
        
        return Response({
            'message': 'Progress updated successfully',
            'progress': contract.progress_percentage
        })
    
    except Contract.DoesNotExist:
        return Response(
            {'error': 'Contract not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_contract(request, pk):
    """Mark contract as completed"""
    try:
        contract = get_object_or_404(
            Contract.objects.filter(
                models.Q(client=request.user) | models.Q(freelancer=request.user)
            ),
            pk=pk
        )
        
        if contract.status not in ['active', 'in_progress']:
            return Response(
                {'error': 'Only active contracts can be completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark as completed
        contract.mark_completed()
        
        # Send notifications
        notify_contract_completed(contract.client, contract.freelancer, contract)
        
        # Send review reminders
        from accounts.notifications import notify_review_reminder
        notify_review_reminder(contract.client, contract)
        notify_review_reminder(contract.freelancer, contract)
        
        return Response({
            'message': 'Contract completed successfully',
            'contract': ContractSerializer(contract).data
        })
    
    except Contract.DoesNotExist:
        return Response(
            {'error': 'Contract not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_milestone(request, pk):
    """Add a milestone to a contract"""
    try:
        contract = get_object_or_404(
            Contract.objects.filter(
                models.Q(client=request.user) | models.Q(freelancer=request.user)
            ),
            pk=pk
        )
        
        title = request.data.get('title')
        description = request.data.get('description', '')
        due_date = request.data.get('due_date')
        amount = request.data.get('amount', 0)
        
        if not title or not due_date:
            return Response(
                {'error': 'Title and due_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        milestone = contract.add_milestone(title, description, due_date, amount)
        
        return Response({
            'message': 'Milestone added successfully',
            'milestone': milestone
        })
    
    except Contract.DoesNotExist:
        return Response(
            {'error': 'Contract not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_milestone(request, pk, milestone_id):
    """Mark a milestone as completed"""
    try:
        contract = get_object_or_404(
            Contract.objects.filter(
                models.Q(client=request.user) | models.Q(freelancer=request.user)
            ),
            pk=pk
        )
        
        # Find and update milestone
        milestone_found = False
        for milestone in contract.milestones:
            if milestone.get('id') == int(milestone_id):
                milestone['completed'] = True
                milestone['completed_date'] = timezone.now().isoformat()
                milestone_found = True
                break
        
        if not milestone_found:
            return Response(
                {'error': 'Milestone not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        contract.save()
        
        # Update overall progress based on completed milestones
        completed_milestones = sum(1 for m in contract.milestones if m.get('completed'))
        total_milestones = len(contract.milestones)
        if total_milestones > 0:
            progress = (completed_milestones / total_milestones) * 100
            contract.update_progress(progress)
        
        return Response({
            'message': 'Milestone completed successfully',
            'milestones': contract.milestones
        })
    
    except Contract.DoesNotExist:
        return Response(
            {'error': 'Contract not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def terminate_contract(request, pk):
    """Terminate a contract"""
    try:
        contract = get_object_or_404(
            Contract.objects.get(
                pk=pk,
                client=request.user  # Only client can terminate
            )
        )
        
        if contract.status not in ['active', 'in_progress']:
            return Response(
                {'error': 'Only active contracts can be terminated'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reason = request.data.get('reason', 'Contract terminated by client')
        
        contract.status = 'terminated'
        contract.project.status = 'cancelled'
        contract.terms_and_conditions += f"\n\nTermination reason: {reason}\nTerminated on: {timezone.now()}"
        contract.save()
        contract.project.save()
        
        return Response({
            'message': 'Contract terminated successfully',
            'contract': ContractSerializer(contract).data
        })
    
    except Contract.DoesNotExist:
        return Response(
            {'error': 'Contract not found or you do not have permission'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contract_statistics(request):
    """Get contract statistics for the user"""
    user = request.user
    contracts = Contract.objects.filter(
        models.Q(client=user) | models.Q(freelancer=user)
    )
    
    stats = {
        'total_contracts': contracts.count(),
        'active_contracts': contracts.filter(status__in=['active', 'in_progress']).count(),
        'completed_contracts': contracts.filter(status='completed').count(),
        'overdue_contracts': contracts.filter(
            end_date__lt=timezone.now(),
            status__in=['active', 'in_progress']
        ).count(),
        'total_earned': contracts.filter(
            freelancer=user,
            status='completed'
        ).aggregate(total=models.Sum('agreed_budget'))['total'] or 0,
        'total_spent': contracts.filter(
            client=user,
            status='completed'
        ).aggregate(total=models.Sum('agreed_budget'))['total'] or 0,
        'average_project_duration': contracts.filter(
            status='completed'
        ).aggregate(
            avg_duration=models.Avg(
                models.F('actual_completion_date') - models.F('start_date')
            )
        )['avg_duration']
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_contracts_pending_review(request):
    """Get completed contracts that haven't been reviewed yet"""
    user = request.user
    
    # Get completed contracts involving the user
    completed_contracts = Contract.objects.filter(
        models.Q(client=user) | models.Q(freelancer=user),
        status='completed'
    ).select_related('client', 'freelancer', 'project')
    
    # Filter out contracts that already have reviews from this user
    contracts_pending_review = []
    for contract in completed_contracts:
        # Check if user has already reviewed this contract
        from reviews.models import Review
        existing_review = Review.objects.filter(
            contract=contract,
            reviewer=user
        ).exists()
        
        if not existing_review:
            contracts_pending_review.append(contract)
    
    serializer = ContractSerializer(contracts_pending_review, many=True)
    return Response({
        'contracts': serializer.data,
        'count': len(contracts_pending_review)
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_completion(request, pk):
    """Freelancer requests contract completion"""
    try:
        contract = get_object_or_404(
            Contract.objects.filter(freelancer=request.user),
            pk=pk
        )
        
        if contract.status == 'completed':
            return Response(
                {'error': 'Contract is already completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update status to pending completion
        contract.status = 'pending_completion'
        contract.save()
        
        # Notify client about completion request
        from accounts.notifications import create_notification
        create_notification(
            recipient=contract.client,
            notification_type='system',
            title=f'Completion requested for "{contract.project.title}"',
            message=f'{contract.freelancer.get_full_name()} has requested completion for the project "{contract.project.title}". Please review and approve.',
            related_contract=contract,
            related_project=contract.project,
            action_url=f'/contracts/{contract.id}'
        )
        
        serializer = ContractSerializer(contract)
        return Response({
            'message': 'Completion request sent to client',
            'contract': serializer.data
        })
        
    except Contract.DoesNotExist:
        return Response(
            {'error': 'Contract not found or you do not have permission'},
            status=status.HTTP_404_NOT_FOUND
        )