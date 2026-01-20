from rest_framework import serializers
from .models import Contract
from .models import Contract, Milestone



class ContractSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(
        source="project.title",
        read_only=True
    )
    client_username = serializers.CharField(
        source="client.username",
        read_only=True
    )
    freelancer_username = serializers.CharField(
        source="freelancer.username",
        read_only=True
    )

    class Meta:
        model = Contract
        fields = [
            "id",
            "project_title",
            "client_username",
            "freelancer_username",
            "status",
            "created_at",
        ]

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = "__all__"
