from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Avg, Count, Q
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer, ReviewStatsSerializer, ReviewableContractSerializer
from contracts.models import Contract
from accounts.models import Notification

class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        contract_id = request.data.get('contract')
        if not contract_id:
            return Response(
                {'error': 'Contract ID is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            contract = Contract.objects.get(id=contract_id)
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if request.user != contract.client:
            return Response(
                {'error': 'Only clients can review freelancers'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if contract.status != 'completed':
            return Response(
                {'error': 'Can only review completed contracts'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if Review.objects.filter(contract=contract).exists():
            return Response(
                {'error': 'A review already exists for this contract'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(reviewer=request.user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Review.objects.filter(
            Q(contract__client=user) | Q(contract__freelancer=user)
        ).select_related('contract', 'reviewer').order_by('-review_date')

class UserReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Review.objects.filter(
            contract__freelancer_id=user_id
        ).select_related('contract', 'reviewer').order_by('-review_date')

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        obj = super().get_object()
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if obj.reviewer != self.request.user:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("You can only modify your own reviews.")
        return obj

class ReviewStatsView(generics.RetrieveAPIView):
    serializer_class = ReviewStatsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        user_id = self.kwargs.get('user_id')
        
        # Only show reviews where the user is the freelancer (since only clients can review freelancers)
        reviews = Review.objects.filter(
            contract__freelancer_id=user_id
        )
        
        stats = reviews.aggregate(
            average_rating=Avg('rating'),
            total_reviews=Count('id')
        )
        
        rating_distribution = {}
        for rating in range(1, 6):
            count = reviews.filter(rating=rating).count()
            rating_distribution[str(rating)] = count
        
        return {
            'average_rating': stats['average_rating'] or 0,
            'total_reviews': stats['total_reviews'],
            'rating_distribution': rating_distribution
        }

class ReviewableContractsView(generics.ListAPIView):
    serializer_class = ReviewableContractSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        completed_contracts = Contract.objects.filter(
            status='completed',
            client=user
        ).select_related('client', 'freelancer')
        
        reviewable_contracts = []
        for contract in completed_contracts:
            existing_review = Review.objects.filter(
                contract=contract,
                reviewer=user
            ).first()
            
            other_party = contract.freelancer
            
            reviewable_contracts.append({
                'contract_id': contract.id,
                'contract_title': contract.title,
                'other_party_name': other_party.get_full_name() or other_party.username,
                'other_party_avatar': None,  # Profile model doesn't have avatar field
                'can_review': existing_review is None,
                'existing_review': existing_review
            })
        
        return reviewable_contracts

class ContractReviewDetailView(generics.RetrieveAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        contract_id = self.kwargs.get('contract_id')
        contract = get_object_or_404(Contract, id=contract_id)
        
        if self.request.user not in [contract.client, contract.freelancer]:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only view reviews for contracts you're involved in.")
        
        review = Review.objects.filter(
            contract=contract,
            reviewer=self.request.user
        ).first()
        
        if not review:
            from rest_framework.exceptions import NotFound
            raise NotFound("No review found for this contract.")
        
        return review