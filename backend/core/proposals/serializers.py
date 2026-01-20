from rest_framework import serializers
from projects.models import Project
from users.serializers import MiniUserSerializer
from .models import Proposal

class MiniProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ("id", "title", "budget", "skills_required", "duration")


class ProposalSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        write_only=True
    )

    project_data = MiniProjectSerializer(source="project", read_only=True)
    freelancer_data = MiniUserSerializer(source="freelancer", read_only=True)

    project_title = serializers.CharField(source="project.title", read_only=True)
    freelancer_username = serializers.CharField(source="freelancer.username", read_only=True)

    class Meta:
        model = Proposal
        fields = [
            "id",

            # Returned descriptive fields
            "project_data",
            "freelancer_data",
            "project_title",
            "freelancer_username",

            # Core data
            "cover_letter",
            "proposed_price",
            "status",
            "created_at",

            # For creating proposal
            "project",  # write-only
        ]
        read_only_fields = (
            "freelancer",
            "status",
            "created_at",
        )

    def validate(self, attrs):
        request = self.context.get("request")
        if not request or not request.user:
            raise serializers.ValidationError("Authentication required")
        
        user = request.user
        project = attrs.get("project")

        if Proposal.objects.filter(project=project, freelancer=user).exists():
            raise serializers.ValidationError(
                "You have already submitted a proposal for this project."
            )
        return attrs


class ProposalStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = ("status",)

    def validate_status(self, value):
        if value not in ["accepted", "rejected"]:
            raise serializers.ValidationError("Invalid status")
        return value
