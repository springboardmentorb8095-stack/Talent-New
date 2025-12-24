from rest_framework import serializers
from django.conf import settings
from .models import Project, Proposal
from accounts.models import Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'skill_name']

class ProjectSerializer(serializers.ModelSerializer):
    client = serializers.StringRelatedField(read_only=True)
    skills_required = SkillSerializer(many=True, read_only=True)
    skills_required_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Project
        fields = ['id', 'client', 'title', 'description', 'budget', 'duration', 'skills_required', 'skills_required_ids', 'status', 'created_at']
        read_only_fields = ['id', 'client', 'status', 'created_at']

    def create(self, validated_data):
        skills_ids = validated_data.pop('skills_required_ids', [])
        project = Project.objects.create(**validated_data)
        if skills_ids:
            project.skills_required.set(skills_ids)
        return project

    def update(self, instance, validated_data):
        skills_ids = validated_data.pop('skills_required_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if skills_ids is not None:
            instance.skills_required.set(skills_ids)
        return instance

class ProposalSerializer(serializers.ModelSerializer):
    freelancer = serializers.StringRelatedField(read_only=True)
    project = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Proposal
        fields = ['id', 'project', 'freelancer', 'bid_amount', 'message', 'status', 'created_at']
        read_only_fields = ['id', 'freelancer', 'status', 'created_at']