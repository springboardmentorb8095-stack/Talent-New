from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    submitted = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = "__all__"  # includes submitted automatically
        read_only_fields = ("client", "created_at")

    def get_submitted(self, obj):
        user = self.context["request"].user
        if not user.is_authenticated or not hasattr(user, "proposals"):
            return False
        return obj.proposals.filter(freelancer=user).exists()