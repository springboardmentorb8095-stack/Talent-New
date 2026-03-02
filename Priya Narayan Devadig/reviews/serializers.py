from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)
    reviewee_name = serializers.CharField(source='reviewee.get_full_name', read_only=True)
    project_title = serializers.CharField(source='contract.project.title', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('reviewer', 'reviewee', 'created_at')


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['contract', 'rating', 'comment']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

    def validate_contract(self, value):
        # Check if contract is completed
        if value.status != 'completed':
            raise serializers.ValidationError("Can only review completed contracts")
        
        # Check if user is part of the contract
        request = self.context.get('request')
        if request and request.user not in [value.client, value.freelancer]:
            raise serializers.ValidationError("You are not part of this contract")
        
        # Check if user already reviewed
        if Review.objects.filter(contract=value, reviewer=request.user).exists():
            raise serializers.ValidationError("You have already reviewed this contract")
        
        return value