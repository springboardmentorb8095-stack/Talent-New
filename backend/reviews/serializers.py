from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(
        source="client.username", read_only=True
    )
    freelancer_username = serializers.CharField(
        source="freelancer.username", read_only=True
    )

    class Meta:
        model = Review
        fields = [
            "id",
            "contract",
            "client",
            "freelancer",
            "client_username",
            "freelancer_username",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = [
            "client",
            "freelancer",
            "created_at",
        ]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5"
            )
        return value
