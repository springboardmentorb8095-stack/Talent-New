from rest_framework import serializers
from .models import Proposal

class ProposalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = ['project', 'cover_letter', 'proposed_rate', 'status']  # ← Add 'status'

    def create(self, validated_data):
        validated_data['freelancer'] = self.context['request'].user
        return super().create(validated_data)

class ProposalListSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    project_id = serializers.IntegerField(source='project.id', read_only=True)
    freelancer_username = serializers.CharField(source='freelancer.username', read_only=True)

    class Meta:
        model = Proposal
        fields = [
            'id',
            'project_id',
            'project_title',
            'freelancer_username',
            'cover_letter',
            'proposed_rate',
            'status',
            'created_at'
        ]
