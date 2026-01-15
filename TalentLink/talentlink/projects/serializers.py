from rest_framework import serializers
from django.conf import settings
from .models import Project, Proposal
from accounts.models import Skill
from accounts.serializers import SkillSerializer, ProfileSerializer, UserSerializer

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'skill_name']

class ProjectSerializer(serializers.ModelSerializer):
    client = serializers.StringRelatedField(read_only=True)
    client_details = serializers.SerializerMethodField()
    skills_required = SkillSerializer(many=True, read_only=True)
    skills_required_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Project
        fields = ['id', 'client', 'client_details', 'title', 'description', 'budget', 'duration', 'skills_required', 'skills_required_ids', 'status', 'created_at']
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

    def get_client_details(self, obj):
        """Get detailed client information including profile"""
        try:
            profile = obj.client.profile
            return {
                'id': obj.client.id,
                'username': obj.client.username,
                'first_name': obj.client.first_name,
                'last_name': obj.client.last_name,
                'email': obj.client.email,
                'profile': {
                    'name': profile.name,
                    'bio': profile.bio,
                    'hourly_rate': str(profile.hourly_rate) if profile.hourly_rate else None,
                    'experience': profile.experience,
                    'portfolio': profile.portfolio,
                    'skills': [skill.name for skill in profile.skills.all()],
                    'availability': profile.availability,
                    'avatar': profile.avatar.url if profile.avatar else None
                }
            }
        except AttributeError:
            return {
                'id': obj.client.id,
                'username': obj.client.username,
                'first_name': obj.client.first_name,
                'last_name': obj.client.last_name,
                'email': obj.client.email,
                'profile': None
            }

class ProposalSerializer(serializers.ModelSerializer):
    freelancer = serializers.StringRelatedField(read_only=True)
    freelancer_details = serializers.SerializerMethodField()
    project = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Proposal
        fields = ['id', 'project', 'freelancer', 'freelancer_details', 'bid_amount', 'message', 'status', 'created_at']
        read_only_fields = ['id', 'freelancer', 'status', 'created_at']
    
    def get_freelancer_details(self, obj):
        """Get detailed freelancer information including profile"""
        try:
            profile = obj.freelancer.profile
            return {
                'id': obj.freelancer.id,
                'username': obj.freelancer.username,
                'first_name': obj.freelancer.first_name,
                'last_name': obj.freelancer.last_name,
                'email': obj.freelancer.email,
                'profile': {
                    'name': profile.name,
                    'bio': profile.bio,
                    'hourly_rate': str(profile.hourly_rate) if profile.hourly_rate else None,
                    'experience': profile.experience,
                    'portfolio': profile.portfolio,
                    'skills': [skill.name for skill in profile.skills.all()],
                    'availability': profile.availability,
                    'avatar': profile.avatar.url if profile.avatar else None
                }
            }
        except AttributeError:
            # Handle case where freelancer doesn't have a profile
            return {
                'id': obj.freelancer.id,
                'username': obj.freelancer.username,
                'first_name': obj.freelancer.first_name,
                'last_name': obj.freelancer.last_name,
                'email': obj.freelancer.email,
                'profile': None
            }

class ProposalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = ['status']