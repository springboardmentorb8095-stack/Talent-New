#   from rest_framework import serializers
#   from .models import Profile

#   class ProfileSerializer(serializers.ModelSerializer):
#       class Meta:
#           model = Profile
#           fields = ['id', 'user', 'full_name', 'bio']
#           read_only_fields = ['user']
from rest_framework import serializers
from .models import Profile
# profiles/serializers.py
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
# Alternative perform_create (if you insist on keeping POST)


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
            'portfolio',  # ← Added field here
        ]
        read_only_fields = ['user']
