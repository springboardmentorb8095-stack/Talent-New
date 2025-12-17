#   from rest_framework import serializers
#   from .models import Profile

#   class ProfileSerializer(serializers.ModelSerializer):
#       class Meta:
#           model = Profile
#           fields = ['id', 'user', 'full_name', 'bio']
#           read_only_fields = ['user']
from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id',
            'user',
            'username',
            'email',
            'role',
            'full_name',
            'bio',
        ]
        read_only_fields = ['user']
