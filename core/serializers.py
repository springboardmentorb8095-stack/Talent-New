from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Profile,
    Project,
    Proposal,
    Contract,
    Review,
    Message
)

User = get_user_model()


# ---------------------------
# USER REGISTER
# ---------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user


# ---------------------------
# PROFILE
# ---------------------------
class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'


# ---------------------------
# PROJECT
# ---------------------------
class ProjectSerializer(serializers.ModelSerializer):
    client = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'


# ---------------------------
# PROPOSAL ✅
# ---------------------------
class ProposalSerializer(serializers.ModelSerializer):
    freelancer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Proposal
        fields = '__all__'
        read_only_fields = ['freelancer', 'created_at']


# ---------------------------
# CONTRACT
# ---------------------------
class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'


# ---------------------------
# REVIEW
# ---------------------------
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


# ---------------------------
# MESSAGE
# ---------------------------
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


