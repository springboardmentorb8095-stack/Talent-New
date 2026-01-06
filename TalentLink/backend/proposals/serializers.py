from rest_framework import serializers
from .models import Proposal


class ProposalSerializer(serializers.ModelSerializer):
    freelancer_username = serializers.CharField(
        source="freelancer.username",
        read_only=True
    )

    class Meta:
        model = Proposal
        fields = [
            "id",
            "freelancer_username",
            "message",
            "proposed_price",
            "delivery_time",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]
