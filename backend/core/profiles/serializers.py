from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    def get_avatar_url(self, obj):
        request = self.context.get("request")

        if obj.avatar:
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url  # fallback

        default_path = "/static/images/default-avatar.png"
        if request:
            return request.build_absolute_uri(default_path)
        return default_path
    
    def validate(self, data):
        user = self.context["request"].user
        role = user.role

        freelancer_fields = {"skills", "hourly_rate", "availability"}
        client_fields = {"company_name", "company_website"}

        if role == "freelancer":
            forbidden = client_fields & data.keys()
            if forbidden:
                raise serializers.ValidationError(
                    f"Clients fields not allowed for freelancers: {forbidden}"
                )

        if role == "client":
            forbidden = freelancer_fields & data.keys()
            if forbidden:
                raise serializers.ValidationError(
                    f"Freelancer fields not allowed for clients: {forbidden}"
                )

        return data
    
    class Meta:
        model = Profile
        exclude = ("user",)
