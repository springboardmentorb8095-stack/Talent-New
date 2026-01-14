

from .models import Contract
from review.models import Review  # import Review from the review app
from users.serializers import UserSerializer
from rest_framework import serializers
class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment', 'reviewer']

class ContractSerializer(serializers.ModelSerializer):
    proposal_id = serializers.IntegerField(source='proposal.id', read_only=True)
    project_title = serializers.CharField(source='proposal.project.title', read_only=True)
    freelancer_username = serializers.CharField(source='proposal.freelancer.username', read_only=True)
    review = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = [
            'id',
            'proposal_id',
            'project_title',
            'freelancer_username',
            'start_date',
            'end_date',
            'status',
            'review',
        ]

    def get_review(self, obj):
        try:
            return ReviewSerializer(obj.review).data
        except Review.DoesNotExist:
            return None
