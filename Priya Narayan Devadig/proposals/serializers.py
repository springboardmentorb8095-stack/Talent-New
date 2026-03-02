from rest_framework import serializers
from .models import Proposal
from projects.models import Project


class ProposalSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.CharField(source='freelancer.get_full_name', read_only=True)
    freelancer_email = serializers.EmailField(source='freelancer.email', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    project_budget = serializers.SerializerMethodField()

    class Meta:
        model = Proposal
        fields = '__all__'
        read_only_fields = ('freelancer', 'submitted_at')

    def get_project_budget(self, obj):
        return {
            'min': float(obj.project.budget_min),
            'max': float(obj.project.budget_max)
        }


class ProposalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = ['project', 'cover_letter', 'proposed_budget', 'estimated_duration']

    def validate_project(self, value):
        # Check if project is open
        if value.status != 'open':
            raise serializers.ValidationError("This project is not accepting proposals")
        
        # Check if user already submitted a proposal
        user = self.context['request'].user
        if Proposal.objects.filter(project=value, freelancer=user).exists():
            raise serializers.ValidationError("You have already submitted a proposal for this project")
        
        return value

    def validate_proposed_budget(self, value):
        if value <= 0:
            raise serializers.ValidationError("Budget must be greater than 0")
        return value