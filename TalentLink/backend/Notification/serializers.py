from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    time_ago = serializers.SerializerMethodField()

    def get_time_ago(self, obj):
        return obj.time_ago()

    class Meta:
        model = Notification
        fields = [
    "id",
    "message",
    "is_read",
    "created_at",
    "username",
    "time_ago",
    "project_id",  # ✅ ADD
    "proposal_id"
]

