from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    sender_name = serializers.CharField(source="sender.username", read_only=True)
    avatar = serializers.SerializerMethodField()

    file_url = serializers.SerializerMethodField()

    def get_file_url(self, obj):
        if not obj.file:
            return None

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.file.url)

        # Fall back to relative path in case no request context
        return obj.file.url
    # def get_file_url(self, obj):
    #     if obj.file:
    #         return obj.file.url
    #     return None

    def get_avatar(self, obj):
        profile = getattr(obj.sender, "profile", None)
        request = self.context.get("request")

        if profile and profile.avatar:
            # If request exists, return absolute URL
            if request:
                return request.build_absolute_uri(profile.avatar.url)
            return profile.avatar.url  # fallback relative

        # Default avatar from static
        default_path = "/static/images/default-avatar.png"
        if request:
            return request.build_absolute_uri(default_path)
        return default_path
    # def get_avatar(self, obj):
    #     profile = getattr(obj.sender, "profile", None)
    #     request = self.context.get("request")

    #     if profile and profile.avatar:
    #         return (profile.avatar.url)
    #     return "/static/images/default-avatar.png"  # fallback
    
    class Meta:
        model = Message
        fields = [
            "id", "sender", "sender_name", "file_url",
            "text", "file", "message_type", "created_at", "avatar",
        ]


# class MessageSerializer(serializers.ModelSerializer):
#     sender_name = serializers.CharField(source="sender.username", read_only=True)
#     # avatar = serializers.SerializerMethodField()

#     class Meta:
#         model = Message
#         fields = [
#             "id",
#             "sender",
#             "sender_name",
#             "text",
#             "file",
#             "message_type",
#             "created_at",
#             # "avatar",
#         ]
#     def get_avatar(self, obj):
#         profile = getattr(obj.sender, "profile", None)
#         if profile and profile.avatar:
#             return profile.avatar.url
#         return "/static/images/default-avatar.png"