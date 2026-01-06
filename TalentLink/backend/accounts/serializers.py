from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

from userprofiles.models import UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=[("client", "Client"), ("freelancer", "Freelancer")],
        write_only=True
    )

    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]

    def create(self, validated_data):
        role = validated_data.pop("role")

        # Create user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        UserProfile.objects.filter(user=user).update(role=role)

        return user



class EmailOrUsernameTokenSerializer(TokenObtainPairSerializer):
    """
    Allows login using:
    - username + password
    - email + password
    """

    username_field = "username"

    def validate(self, attrs):
        login_value = attrs.get("username")
        password = attrs.get("password")


        if "@" in login_value:
            try:
                user = User.objects.get(email=login_value)
                attrs["username"] = user.username
            except User.DoesNotExist:
                raise AuthenticationFailed("Invalid credentials")

        return super().validate(attrs)
