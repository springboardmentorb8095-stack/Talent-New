

# # Create your views here.

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer
from contracts.models import Contract



class AddReviewView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, contract_id):
        try:
            contract = Contract.objects.get(id=contract_id)
        except Contract.DoesNotExist:
            return Response({"error": "Contract not found"}, status=status.HTTP_404_NOT_FOUND)

        # Only completed contracts can be reviewed
        if contract.status != 'completed':
            return Response({"error": "Cannot review an incomplete contract"}, status=status.HTTP_400_BAD_REQUEST)

        # Only one review per contract
        if hasattr(contract, 'review'):
            return Response({"error": "Review already exists for this contract"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(contract=contract, reviewer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



