from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile, Notification, Skill

User = get_user_model()

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'skill_name']
        read_only_fields = ['id']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']
        extra_kwargs = {'password': {'write_only': True}}

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'name', 'bio', 'hourly_rate', 'experience', 'portfolio', 'skills', 'availability', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['name', 'bio', 'hourly_rate', 'experience', 'portfolio', 'skills', 'availability']
        extra_kwargs = {
            'hourly_rate': {'required': False, 'allow_null': True},
            'experience': {'required': False, 'allow_null': True},
            'skills': {'required': False},
            'availability': {'required': False, 'allow_null': True}
        }

class NotificationSerializer(serializers.ModelSerializer):
    related_project_title = serializers.CharField(source='related_project.title', read_only=True)
    related_proposal_id = serializers.IntegerField(source='related_proposal.id', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'title', 'message', 'is_read', 'related_project', 'related_project_title', 'related_proposal', 'related_proposal_id', 'created_at']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': False}
        }