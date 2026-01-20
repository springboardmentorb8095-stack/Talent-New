from rest_framework import serializers
from .models import Proposal


class ProposalSerializer(serializers.ModelSerializer):
    freelancer_username = serializers.CharField(
        source="freelancer.username",
        read_only=True
    )
    freelancer_id = serializers.IntegerField(
        source="freelancer.id",
        read_only=True
    )

    # ✅ ADD THESE TWO FIELDS
    project = serializers.IntegerField(
        source="project.id",
        read_only=True
    )
    project_title = serializers.CharField(
        source="project.title",
        read_only=True
    )

    class Meta:
        model = Proposal
        fields = [
            "id",
            "project",          # ✅ project id
            "project_title",    # ✅ project name
            "freelancer_id",
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
