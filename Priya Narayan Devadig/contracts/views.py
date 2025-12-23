from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db import models
from django.utils import timezone
from .models import Contract
from .serializers import ContractSerializer, ContractCreateSerializer
from proposals.models import Proposal


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
        
        return queryset


class ContractDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(
            models.Q(client=user) | models.Q(freelancer=user)
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_contract_from_proposal(request, proposal_id):
    """Create a contract from an accepted proposal"""
    try:
        proposal = Proposal.objects.select_related('project', 'freelancer').get(
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
        
        # Create contract
        serializer = ContractCreateSerializer(data=request.data)
        if serializer.is_valid():
            contract = Contract.objects.create(
                project=proposal.project,
                client=request.user,
                freelancer=proposal.freelancer,
                proposal=proposal,
                agreed_budget=proposal.proposed_budget,
                end_date=serializer.validated_data['end_date'],
                terms_and_conditions=serializer.validated_data.get('terms_and_conditions', ''),
                status='active'
            )
            
            return Response(
                ContractSerializer(contract).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Proposal.DoesNotExist:
        return Response(
            {'error': 'Proposal not found or not accepted'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_contract(request, pk):
    """Mark contract as completed"""
    try:
        contract = Contract.objects.filter(
            models.Q(client=request.user) | models.Q(freelancer=request.user)
        ).get(pk=pk)
        
        if contract.status != 'active':
            return Response(
                {'error': 'Only active contracts can be completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        contract.status = 'completed'
        contract.project.status = 'completed'
        contract.save()
        contract.project.save()
        
        return Response(ContractSerializer(contract).data)
    
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
        contract = Contract.objects.get(
            pk=pk,
            client=request.user  # Only client can terminate
        )
        
        if contract.status != 'active':
            return Response(
                {'error': 'Only active contracts can be terminated'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        contract.status = 'terminated'
        contract.project.status = 'cancelled'
        contract.save()
        contract.project.save()
        
        return Response(ContractSerializer(contract).data)
    
    except Contract.DoesNotExist:
        return Response(
            {'error': 'Contract not found or you do not have permission'},
            status=status.HTTP_404_NOT_FOUND
        )