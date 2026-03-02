from rest_framework import serializers
from .models import Project
from accounts.serializers import SkillSerializer


class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    client_email = serializers.EmailField(source='client.email', read_only=True)
    required_skills = SkillSerializer(many=True, read_only=True)
    proposal_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('client',)

    def get_proposal_count(self, obj):
        return obj.proposals.count()


class ProjectCreateSerializer(serializers.ModelSerializer):
    required_skills = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=__import__('accounts.models', fromlist=['Skill']).Skill.objects.all()
    )

    class Meta:
        model = Project
        fields = ['title', 'description', 'budget_min', 'budget_max', 'deadline', 'estimated_duration', 'required_skills']

    def create(self, validated_data):
        required_skills = validated_data.pop('required_skills', [])
        project = Project.objects.create(**validated_data)
        project.required_skills.set(required_skills)
        return project