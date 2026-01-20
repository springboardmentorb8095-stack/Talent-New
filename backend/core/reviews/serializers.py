from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.CharField(source="reviewer.username", read_only=True)
    freelancer = serializers.CharField(source="freelancer.username", read_only=True)
    project = serializers.CharField(source="contract.proposal.project.title", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "project",
            "contract",
            "reviewer",
            "freelancer",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["reviewer", "freelancer", "created_at", "project"]
