from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Review
from .serializers import ReviewSerializer
from contracts.models import Contract

class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, contract_id):
        try:
            contract = Contract.objects.get(id=contract_id)
        except Contract.DoesNotExist:
            return Response({"error": "Contract not found"}, status=404)

        user = request.user

        # Must be contract owner (client)
        if contract.proposal.project.client != user:
            return Response({"error": "Only client can review"}, status=403)

        # Must be completed
        if contract.status != "completed":
            return Response({"error": "Contract must be completed"}, status=400)

        # Prevent duplicate reviews
        if hasattr(contract, "review"):
            return Response({"error": "Review already exists"}, status=400)

        data = request.data.copy()
        data["contract"] = contract.id
        data["reviewer"] = user.id
        data["freelancer"] = contract.proposal.freelancer.id

        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save(
                reviewer=user,
                freelancer=contract.proposal.freelancer
            )
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

class GetReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, contract_id):
        try:
            contract = Contract.objects.get(id=contract_id)
        except Contract.DoesNotExist:
            return Response({"error": "Contract not found"}, status=404)

        # Ensure that either client or freelancer related to the contract can view
        user = request.user
        if user != contract.proposal.project.client and user != contract.proposal.freelancer:
            return Response({"error": "Access denied"}, status=403)

        try:
            review = Review.objects.get(contract=contract)
        except Review.DoesNotExist:
            return Response({"error": "No review found for this contract"}, status=404)

        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=200)
