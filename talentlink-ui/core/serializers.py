from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile, Skill

User = get_user_model()


# ------------------- USER SERIALIZER ------------------- #

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]


# ------------------- SKILL SERIALIZER ------------------- #

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]


# ------------------- PROFILE SERIALIZER ------------------- #

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "title",
            "bio",
            "hourly_rate",
            "location",
            "skills",
        ]
