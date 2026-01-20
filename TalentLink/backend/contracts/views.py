from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Contract
from .serializers import ContractSerializer
from rest_framework.decorators import api_view
from .models import Contract 
from .models import Milestone
from .serializers import ContractSerializer, MilestoneSerializer



class MyContractsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        List contracts for logged-in user
        (client OR freelancer)
        """
        contracts = Contract.objects.filter(client=request.user) | Contract.objects.filter(
            freelancer=request.user
        )

        serializer = ContractSerializer(contracts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ContractStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, contract_id):
        contract = get_object_or_404(Contract, id=contract_id)

        # Only client or freelancer can update
        # if request.user not in [contract.client, contract.freelancer]:
        #     return Response(
        #         {"error": "Not authorized"},
        #         status=status.HTTP_403_FORBIDDEN
        #     )

        if request.user != contract.client:
            return Response(
            {"error": "Only client can update contract status"},
            status=status.HTTP_403_FORBIDDEN
    )


        new_status = request.data.get("status")

        if new_status not in ["completed", "cancelled"]:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        contract.status = new_status
        contract.save()

        serializer = ContractSerializer(contract)
        return Response(serializer.data, status=status.HTTP_200_OK)

        
@api_view(["GET"])
def ongoing_contracts(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    contracts = (
        Contract.objects.filter(
            status="active",
            client=request.user
        ) |
        Contract.objects.filter(
            status="active",
            freelancer=request.user
        )
    )

    serializer = ContractSerializer(contracts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def create_milestone(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    contract_id = request.data.get("contract")
    contract = get_object_or_404(Contract, id=contract_id)

    if request.user != contract.client:
        return Response(
            {"error": "Only client can create milestones"},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = MilestoneSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["PATCH"])
def update_milestone_progress(request, milestone_id):
    milestone = get_object_or_404(Milestone, id=milestone_id)

    if request.user != milestone.contract.client:
        return Response(
            {"error": "Only client can update progress"},
            status=status.HTTP_403_FORBIDDEN
        )

    progress = request.data.get("progress")

    if not (0 <= int(progress) <= 100):
        return Response({"error": "Invalid progress"}, status=400)

    milestone.progress = progress
    milestone.save()

    return Response(
        {"message": "Progress updated", "progress": milestone.progress}
    )
