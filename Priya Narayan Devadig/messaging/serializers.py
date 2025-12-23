from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    sender_email = serializers.EmailField(source='sender.email', read_only=True)
    recipient_email = serializers.EmailField(source='recipient.email', read_only=True)

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ('sender', 'sent_at', 'is_read')


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['recipient', 'subject', 'content', 'contract', 'project']

    def validate(self, attrs):
        request = self.context.get('request')
        recipient = attrs.get('recipient')
        
        # Prevent sending message to self
        if request and recipient == request.user:
            raise serializers.ValidationError("You cannot send a message to yourself")
        
        return attrs