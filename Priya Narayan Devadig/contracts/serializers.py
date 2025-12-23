from rest_framework import serializers
from .models import Contract
from projects.serializers import ProjectSerializer


class ContractSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.get_full_name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    project_details = ProjectSerializer(source='project', read_only=True)

    class Meta:
        model = Contract
        fields = '__all__'
        read_only_fields = ('client', 'freelancer', 'project', 'proposal', 'created_at', 'updated_at')


class ContractCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['end_date', 'terms_and_conditions']

    def validate_end_date(self, value):
        from django.utils import timezone
        if value <= timezone.now():
            raise serializers.ValidationError("End date must be in the future")
        return value