# contracts/serializers.py
from rest_framework import serializers
from .models import Contract
from proposals.serializers import ProposalSerializer

class ContractSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source="proposal.project.title", read_only=True)
    client = serializers.CharField(source="proposal.project.client.username", read_only=True)
    freelancer = serializers.CharField(source="proposal.freelancer.username", read_only=True)

    proposal = ProposalSerializer(read_only=True)

    remaining_days = serializers.ReadOnlyField()

    has_review = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        # fields = "__all__"
        fields = [
            "id",
            "proposal",
            "project_title",
            "client",
            "freelancer",
            "start_date",
            "end_date",
            "status",
            "progress",
            "remaining_days",
            "created_at",
            "has_review",
        ]

    def get_has_review(self, obj):
        return hasattr(obj, "review")