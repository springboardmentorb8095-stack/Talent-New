from rest_framework import serializers
from .models import User, Profile


# =======================
# REGISTER SERIALIZER
# =======================
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'role']
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")   # Remove password
        user = User(**validated_data)               # Create user without password
        user.set_password(password)                 # Hash password
        user.save()
        return user


# =======================
# LOGIN SERIALIZER
# =======================
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


# =======================
# PROFILE SERIALIZER
# =======================
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'hourly_rate', 'location', 'avatar','skills', 'portfolio', 'availability']
