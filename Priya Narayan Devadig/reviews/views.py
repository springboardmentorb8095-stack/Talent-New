from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db import models
from django.db.models import Avg
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer


class ReviewListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReviewCreateSerializer
        return ReviewSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Review.objects.select_related('reviewer', 'reviewee', 'contract').all()
        
        # Filter by reviewee (to see reviews for a specific user)
        reviewee_id = self.request.query_params.get('reviewee', None)
        if reviewee_id:
            queryset = queryset.filter(reviewee_id=reviewee_id)
        
        # Filter by reviewer (to see reviews given by a user)
        reviewer_id = self.request.query_params.get('reviewer', None)
        if reviewer_id:
            queryset = queryset.filter(reviewer_id=reviewer_id)
        
        # Filter by contract
        contract_id = self.request.query_params.get('contract', None)
        if contract_id:
            queryset = queryset.filter(contract_id=contract_id)
        
        # Show only reviews involving the user
        my_reviews = self.request.query_params.get('my_reviews', None)
        if my_reviews == 'true':
            queryset = queryset.filter(
                models.Q(reviewer=user) | models.Q(reviewee=user)
            )
        
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        contract = serializer.validated_data['contract']
        
        # Determine reviewee (the other party in the contract)
        if self.request.user == contract.client:
            reviewee = contract.freelancer
        else:
            reviewee = contract.client
        
        serializer.save(reviewer=self.request.user, reviewee=reviewee)


class ReviewDetailView(generics.RetrieveAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_rating(request, user_id):
    """Get average rating and review count for a user"""
    reviews = Review.objects.filter(reviewee_id=user_id)
    
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
    review_count = reviews.count()
    
    # Rating distribution
    rating_distribution = {
        '5': reviews.filter(rating=5).count(),
        '4': reviews.filter(rating=4).count(),
        '3': reviews.filter(rating=3).count(),
        '2': reviews.filter(rating=2).count(),
        '1': reviews.filter(rating=1).count(),
    }
    
    return Response({
        'average_rating': round(avg_rating, 2) if avg_rating else 0,
        'review_count': review_count,
        'rating_distribution': rating_distribution
    })