from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction

from .models import Contract, ContractStatusHistory
from .serializers import (
    ContractSerializer, ContractCreateSerializer, 
    ContractStatusUpdateSerializer, ContractSignSerializer,
    ContractStatusHistorySerializer, ContractProgressUpdateSerializer
)
from projects.models import Proposal, Project

class ContractViewSet(ModelViewSet):
    queryset = Contract.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'status']
    ordering_fields = ['created_at', 'updated_at', 'start_date']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ContractCreateSerializer
        elif self.action in ['update_status', 'partial_update']:
            return ContractStatusUpdateSerializer
        elif self.action == 'sign':
            return ContractSignSerializer
        elif self.action == 'update_progress':
            return ContractProgressUpdateSerializer
        return ContractSerializer
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        old_status = instance.status
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        self.perform_update(serializer)
        
        if old_status != 'completed' and instance.status == 'completed':
            project = instance.proposal.project
            project.status = Project.STATUS_COMPLETED
            project.save()
            
            ContractStatusHistory.objects.create(
                contract=instance,
                old_status=old_status,
                new_status='completed',
                changed_by=request.user,
                reason="Contract manually marked as completed"
            )
        
        return Response(serializer.data)
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'client':
            return Contract.objects.filter(client=user)
        elif user.role == 'freelancer':
            return Contract.objects.filter(freelancer=user)
        return Contract.objects.none()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        proposal_id = request.data.get('proposal_id')
        if not proposal_id:
            return Response(
                {"error": "proposal_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            proposal = Proposal.objects.get(id=proposal_id, status='accepted')
        except Proposal.DoesNotExist:
            return Response(
                {"error": "Accepted proposal not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if hasattr(proposal, 'contract'):
            return Response(
                {"error": "Contract already exists for this proposal"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if request.user != proposal.project.client:
            return Response(
                {"error": "Only the client can create a contract"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        with transaction.atomic():
            contract = Contract.objects.create(
                proposal=proposal,
                client=proposal.project.client,
                freelancer=proposal.freelancer,
                title=proposal.project.title,
                description=proposal.project.description,
                agreed_amount=proposal.bid_amount,
                **serializer.validated_data
            )
            
            project = proposal.project
            old_project_status = project.status
            project.status = Project.STATUS_IN_PROGRESS
            project.save()
            
            ContractStatusHistory.objects.create(
                contract=contract,
                old_status='',
                new_status=contract.status,
                changed_by=request.user,
                reason="Contract created from accepted proposal"
            )
        
        serializer = ContractSerializer(contract)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def sign(self, request, pk=None):
        contract = self.get_object()
        serializer = ContractSignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action = serializer.validated_data['action']
        reason = serializer.validated_data.get('reason', '')
        
        if request.user not in [contract.client, contract.freelancer]:
            return Response(
                {"error": "Only contract parties can sign"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if contract.status != 'draft':
            return Response(
                {"error": "Contract must be in draft status"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = contract.status
        
        if action == 'sign':
            if request.user == contract.client:
                contract.client_signed_at = timezone.now()
            else:
                contract.freelancer_signed_at = timezone.now()
            
            if contract.is_fully_signed:
                contract.status = 'active'
                contract.save()
                
                contract.proposal.status = 'accepted'
                contract.proposal.save()
                
                ContractStatusHistory.objects.create(
                    contract=contract,
                    old_status=old_status,
                    new_status='active',
                    changed_by=request.user,
                    reason="Both parties signed the contract"
                )
        
        elif action == 'reject':
            contract.status = 'terminated'
            contract.save()
            
            contract.proposal.status = 'rejected'
            contract.proposal.save()
            
            ContractStatusHistory.objects.create(
                contract=contract,
                old_status=old_status,
                new_status='terminated',
                changed_by=request.user,
                reason=f"Contract rejected: {reason}"
            )
        
        contract.save()
        serializer = ContractSerializer(contract)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def status_history(self, request, pk=None):
        contract = self.get_object()
        history = contract.status_history.all()
        serializer = ContractStatusHistorySerializer(history, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        active_contracts = self.get_queryset().filter(status='active')
        serializer = ContractSerializer(active_contracts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        contract = self.get_object()
        serializer = ContractProgressUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if request.user != contract.freelancer:
            return Response(
                {"error": "Only the freelancer can update progress"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if contract.status not in ['active', 'signed', 'draft']:
            return Response(
                {"error": "Progress can only be updated for active, signed, or draft contracts"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        new_progress = serializer.validated_data['progress']
        
        contract.progress = new_progress
        contract.progress_updated_at = timezone.now()
        
        if new_progress == 100 and contract.status != 'completed':
            ContractStatusHistory.objects.create(
                contract=contract,
                old_status=contract.status,
                new_status='completed',
                changed_by=request.user,
                reason="Automatically completed - progress reached 100%"
            )
            contract.status = 'completed'
            contract.end_date = timezone.now().date()
            
            project = contract.proposal.project
            project.status = Project.STATUS_COMPLETED
            project.save()
        
        contract.save()
        
        contract_serializer = ContractSerializer(contract)
        return Response(contract_serializer.data, status=status.HTTP_200_OK)

class ContractFromProposalView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ContractCreateSerializer
    
    def create(self, request, *args, **kwargs):
        proposal_id = kwargs.get('proposal_id')
        
        try:
            proposal = Proposal.objects.get(id=proposal_id, status='accepted')
        except Proposal.DoesNotExist:
            return Response(
                {"error": "Accepted proposal not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if request.user != proposal.project.client:
            return Response(
                {"error": "Only the client can create a contract"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if hasattr(proposal, 'contract'):
            return Response(
                {"error": "Contract already exists for this proposal"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            contract = Contract.objects.create(
                proposal=proposal,
                client=proposal.project.client,
                freelancer=proposal.freelancer,
                title=proposal.project.title,
                description=proposal.project.description,
                agreed_amount=proposal.bid_amount,
                **serializer.validated_data
            )
            
            project = proposal.project
            old_project_status = project.status
            project.status = Project.STATUS_IN_PROGRESS
            project.save()
            
            ContractStatusHistory.objects.create(
                contract=contract,
                old_status='',
                new_status=contract.status,
                changed_by=request.user,
                reason="Contract created from accepted proposal"
            )
        
        serializer = ContractSerializer(contract)
        return Response(serializer.data, status=status.HTTP_201_CREATED)