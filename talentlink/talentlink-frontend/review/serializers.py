
from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.StringRelatedField(read_only=True)
    contract = serializers.PrimaryKeyRelatedField(read_only=True)  # read-only, set in view
    
    class Meta:
        model = Review
        fields = ['id', 'contract', 'reviewer', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'reviewer', 'created_at', 'contract']

