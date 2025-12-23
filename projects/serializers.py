from rest_framework import serializers
from .models import Project
from skills.models import Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class ProjectSerializer(serializers.ModelSerializer):
    skills_required = SkillSerializer(many=True, read_only=True)
    skills_required_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        many=True,
        write_only=True,
        source='skills_required'
    )

    class Meta:
        model = Project
        fields = ['id', 'client', 'title', 'description', 'budget', 'skills_required', 'skills_required_ids', 'created_at']
        read_only_fields = ['client', 'created_at']
