from rest_framework import serializers
from .models import Review
from contracts.serializers import ContractSerializer
from accounts.serializers import UserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    contract_details = ContractSerializer(source='contract', read_only=True)
    reviewer_details = UserSerializer(source='reviewer', read_only=True)
    reviewer_name = serializers.SerializerMethodField()
    reviewer_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'contract', 'contract_details', 'reviewer', 'reviewer_details',
            'reviewer_name', 'reviewer_avatar', 'rating', 'comments', 'review_date'
        ]
        read_only_fields = ['id', 'review_date', 'reviewer']
    
    def get_reviewer_name(self, obj):
        return obj.reviewer.get_full_name() or obj.reviewer.username
    
    def get_reviewer_avatar(self, obj):
        return None
    
    def validate(self, data):
        user = self.context['request'].user
        contract = data.get('contract')
        
        if contract.client != user and contract.freelancer != user:
            raise serializers.ValidationError("You can only review contracts you're involved in.")
        
        if contract.status != 'completed':
            raise serializers.ValidationError("You can only review completed contracts.")
        
        if Review.objects.filter(contract=contract, reviewer=user).exists():
            raise serializers.ValidationError("You have already reviewed this contract.")
        
        return data
    
    def create(self, validated_data):
        validated_data['reviewer'] = self.context['request'].user
        return super().create(validated_data)

class ReviewStatsSerializer(serializers.Serializer):
    average_rating = serializers.FloatField()
    total_reviews = serializers.IntegerField()
    rating_distribution = serializers.DictField()

class ReviewableContractSerializer(serializers.Serializer):
    contract_id = serializers.IntegerField()
    contract_title = serializers.CharField()
    other_party_name = serializers.CharField()
    other_party_avatar = serializers.CharField(allow_null=True)
    can_review = serializers.BooleanField()
    existing_review = ReviewSerializer(allow_null=True)