from rest_framework import serializers
from .models import Contract
from projects.serializers import ProjectSerializer
from django.utils import timezone


class ContractSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.get_full_name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    project_details = ProjectSerializer(source='project', read_only=True)
    
    # Computed fields
    is_overdue = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    payment_percentage = serializers.ReadOnlyField()
    
    # Status display
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = Contract
        fields = [
            'id', 'project', 'client', 'freelancer', 'proposal',
            'client_name', 'freelancer_name', 'project_title', 'project_details',
            'agreed_budget', 'paid_amount', 'payment_status', 'payment_status_display', 'payment_percentage',
            'start_date', 'end_date', 'actual_completion_date',
            'status', 'status_display', 'terms_and_conditions',
            'milestones', 'deliverables', 'progress_percentage', 'last_activity',
            'is_overdue', 'days_remaining',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('client', 'freelancer', 'project', 'proposal', 'created_at', 'updated_at', 'last_activity')


class ContractCreateSerializer(serializers.ModelSerializer):
    milestones = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        help_text="List of milestone objects with title, description, due_date, amount"
    )

    class Meta:
        model = Contract
        fields = ['end_date', 'terms_and_conditions', 'deliverables', 'milestones']

    def validate_end_date(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("End date must be in the future")
        return value
    
    def validate_milestones(self, value):
        """Validate milestone structure"""
        for milestone in value:
            if not milestone.get('title'):
                raise serializers.ValidationError("Each milestone must have a title")
            if not milestone.get('due_date'):
                raise serializers.ValidationError("Each milestone must have a due_date")
        return value


class ContractUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = [
            'status', 'progress_percentage', 'payment_status', 'paid_amount',
            'terms_and_conditions', 'deliverables', 'milestones'
        ]
    
    def validate_progress_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Progress must be between 0 and 100")
        return value
    
    def validate_paid_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Paid amount cannot be negative")
        return value


class MilestoneSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=200)
    description = serializers.CharField(required=False, allow_blank=True)
    due_date = serializers.DateTimeField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    completed = serializers.BooleanField(default=False)
    completed_date = serializers.DateTimeField(required=False, allow_null=True)


class ContractSummarySerializer(serializers.ModelSerializer):
    """Lightweight serializer for contract summaries"""
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.get_full_name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_overdue = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()

    class Meta:
        model = Contract
        fields = [
            'id', 'project_title', 'client_name', 'freelancer_name',
            'agreed_budget', 'status', 'status_display', 'progress_percentage',
            'start_date', 'end_date', 'is_overdue', 'days_remaining', 'created_at'
        ]