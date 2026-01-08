# contracts/serializers.py
from rest_framework import serializers
from .models import Contract

class ContractSerializer(serializers.ModelSerializer):
    proposal_id = serializers.IntegerField(source='proposal.id', read_only=True)
    project_title = serializers.CharField(source='proposal.project.title', read_only=True)
    freelancer_username = serializers.CharField(source='proposal.freelancer.username', read_only=True)

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
        ]
