from rest_framework import serializers
from .models import Contract, ContractStatusHistory
from projects.serializers import ProposalSerializer

class ContractSerializer(serializers.ModelSerializer):
    proposal_details = ProposalSerializer(source='proposal', read_only=True)
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.get_full_name', read_only=True)
    is_fully_signed = serializers.ReadOnlyField()
    can_activate = serializers.ReadOnlyField()
    
    class Meta:
        model = Contract
        fields = [
            'id', 'proposal', 'proposal_details', 'client', 'freelancer',
            'client_name', 'freelancer_name', 'title', 'description',
            'start_date', 'end_date', 'agreed_amount', 'deliverables',
            'milestones', 'payment_schedule', 'payment_method',
            'status', 'progress', 'progress_updated_at', 'created_at', 
            'updated_at', 'client_signed_at', 'freelancer_signed_at', 
            'is_fully_signed', 'can_activate'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'client', 'freelancer']

class ContractCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = [
            'title', 'description', 'start_date', 'end_date',
            'deliverables', 'milestones', 'payment_schedule', 'payment_method'
        ]
        extra_kwargs = {
            'title': {'required': False, 'read_only': True},
            'description': {'required': False, 'read_only': True}
        }

class ContractStatusUpdateSerializer(serializers.ModelSerializer):
    reason = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Contract
        fields = ['status', 'reason']

class ContractSignSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['sign', 'reject'])
    reason = serializers.CharField(required=False, allow_blank=True)

class ContractStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = ContractStatusHistory
        fields = ['old_status', 'new_status', 'changed_by', 'changed_by_name', 'reason', 'created_at']

class ContractProgressUpdateSerializer(serializers.Serializer):
    progress = serializers.IntegerField(min_value=0, max_value=100, help_text="Progress percentage (0-100)")
    
    def validate_progress(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Progress must be between 0 and 100")
        return value