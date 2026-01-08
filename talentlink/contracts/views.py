


from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import Contract
from .serializers import ContractSerializer
from proposals.models import Proposal


class CreateContractFromProposalView(generics.CreateAPIView):
    """
    Create a contract from an accepted proposal.
    Only proposals with status 'accepted' can create a contract.
    """
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, proposal_id):
        proposal = get_object_or_404(Proposal, id=proposal_id)

        if proposal.status != 'accepted':
            return Response(
                {"error": "Only accepted proposals can create contracts."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if hasattr(proposal, 'contract'):
            return Response(
                {"error": "Contract already exists for this proposal."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create contract linking to the proposal
        contract = Contract.objects.create(
            proposal=proposal,
            user=proposal.freelancer
        )

        serializer = self.serializer_class(contract)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MyContractsView(generics.ListAPIView):
    """
    List contracts for the logged-in user (freelancer or client)
    """
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Return contracts where user is client or freelancer
        return Contract.objects.filter(
            proposal__freelancer=user
        ) | Contract.objects.filter(
            proposal__project__client=user
        )


class ContractStatusUpdateView(generics.UpdateAPIView):
    """
    Update contract status (active, completed, cancelled)
    """
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        # Allow updating contracts where user is client or freelancer
        return Contract.objects.filter(
            proposal__freelancer=user
        ) | Contract.objects.filter(
            proposal__project__client=user
        )

    def patch(self, request, id):
        contract = get_object_or_404(self.get_queryset(), id=id)
        new_status = request.data.get('status')

        if new_status not in ['active', 'completed', 'cancelled']:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        contract.status = new_status

        # If marking completed, set end_date if missing
        if new_status == "completed" and not contract.end_date:
            contract.end_date = timezone.now()

        contract.save()

        serializer = self.serializer_class(contract)
        return Response(serializer.data, status=status.HTTP_200_OK)
