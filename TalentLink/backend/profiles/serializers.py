from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    role = serializers.CharField(source="user.legacy_profile.role", read_only=True)
    completion = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "username",
            "email",
            "role",
            "avatar",
            "experience",
            "education",
            "certifications",
            "completion",
        ]

    def get_completion(self, obj):
        return obj.completion_percentage()
