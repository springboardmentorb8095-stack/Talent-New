from rest_framework import serializers
from .models import Message, Conversation
from accounts.serializers import UserSerializer


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    other_participant = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    project_title = serializers.CharField(source='project.title', read_only=True)
    contract_id = serializers.IntegerField(source='contract.id', read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'other_participant', 'last_message', 'unread_count', 
                 'project_title', 'contract_id', 'created_at', 'updated_at']

    def get_other_participant(self, obj):
        request = self.context.get('request')
        if request and request.user:
            other_user = obj.get_other_participant(request.user)
            return UserSerializer(other_user).data if other_user else None
        return None

    def get_last_message(self, obj):
        last_message = obj.get_last_message()
        return MessageSerializer(last_message).data if last_message else None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.get_unread_count(request.user)
        return 0


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'recipient', 'sender_name', 'recipient_name', 
                 'content', 'is_read', 'sent_at']
        read_only_fields = ['sender', 'sent_at']


class MessageCreateSerializer(serializers.ModelSerializer):
    recipient_id = serializers.IntegerField(write_only=True)
    project_id = serializers.IntegerField(write_only=True, required=False)
    contract_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Message
        fields = ['recipient_id', 'content', 'project_id', 'contract_id']

    def create(self, validated_data):
        recipient_id = validated_data.pop('recipient_id')
        project_id = validated_data.pop('project_id', None)
        contract_id = validated_data.pop('contract_id', None)
        
        sender = self.context['request'].user
        
        # Get or create conversation
        from django.contrib.auth import get_user_model
        User = get_user_model()
        recipient = User.objects.get(id=recipient_id)
        
        # Find existing conversation between these users
        conversation = Conversation.objects.filter(
            participants=sender
        ).filter(
            participants=recipient
        ).first()
        
        if not conversation:
            conversation = Conversation.objects.create()
            conversation.participants.add(sender, recipient)
            
            # Link to project or contract if provided
            if project_id:
                from projects.models import Project
                conversation.project = Project.objects.get(id=project_id)
            if contract_id:
                from contracts.models import Contract
                conversation.contract = Contract.objects.get(id=contract_id)
            conversation.save()
        
        # Create message
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            recipient=recipient,
            content=validated_data['content']
        )
        
        return message