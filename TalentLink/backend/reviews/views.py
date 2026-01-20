from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Review
from contracts.models import Contract


@api_view(["POST"])
def submit_review(request):
    contract_id = request.data.get("contract")
    rating = request.data.get("rating")
    comment = request.data.get("comment", "")

    contract = get_object_or_404(Contract, id=contract_id)

    # Only freelancer can review
    if request.user != contract.freelancer:
        return Response(
            {"error": "Only freelancer can review"},
            status=status.HTTP_403_FORBIDDEN
        )

    if contract.status != "completed":
        return Response(
            {"error": "Project not completed"},
            status=status.HTTP_400_BAD_REQUEST
        )

    Review.objects.create(
        contract=contract,
        reviewer=request.user,
        rating=rating,
        comment=comment,
    )

    return Response(
        {"message": "Review submitted successfully"},
        status=status.HTTP_201_CREATED
    )
