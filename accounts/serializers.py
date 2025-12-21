from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=[('client', 'Client'), ('freelancer', 'Freelancer')],
        write_only=True
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        role = validated_data.pop('role')
        skills = self.initial_data.get('skills', "")
        portfolio = self.initial_data.get('portfolio', "")
        hourly_rate = self.initial_data.get('hourly_rate', 0.00)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )

        Profile.objects.create(user=user, role=role, skills=skills, portfolio=portfolio, hourly_rate=hourly_rate)
        return user

