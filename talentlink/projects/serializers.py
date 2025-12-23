from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'skills',
            'budget',
            'duration',
            'client',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['client', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)
