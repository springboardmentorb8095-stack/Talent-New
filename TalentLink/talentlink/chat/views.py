from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction

from .models import Conversation, Message, MessageReadReceipt
from .serializers import (
    ConversationSerializer, MessageSerializer, 
    MessageCreateSerializer, MessageReadReceiptSerializer
)
from contracts.models import Contract
from accounts.models import Notification
from utils.email_service import send_new_message_email

class ConversationViewSet(ModelViewSet):
    queryset = Conversation.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['contract__title']
    ordering_fields = ['updated_at', 'created_at']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(participants=user, is_active=True)
    
    def create(self, request, *args, **kwargs):
        contract_id = request.data.get('contract_id')
        if not contract_id:
            return Response(
                {"error": "contract_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            contract = Contract.objects.get(id=contract_id)
        except Contract.DoesNotExist:
            return Response(
                {"error": "Contract not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user is a party to the contract
        if request.user not in [contract.client, contract.freelancer]:
            return Response(
                {"error": "You are not a party to this contract"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if hasattr(contract, 'conversation'):
            serializer = ConversationSerializer(contract.conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        with transaction.atomic():
            conversation = Conversation.objects.create(contract=contract)
            conversation.participants.add(contract.client, contract.freelancer)
            
            Message.objects.create(
                conversation=conversation,
                sender=request.user,
                message_type='system',
                text=f"Contract conversation started for '{contract.title}'"
            )
        
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        
        if request.user not in conversation.participants.all():
            return Response(
                {"error": "You are not a participant in this conversation"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        messages = conversation.messages.all().order_by('created_at')
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        
        unread_messages = messages.filter(is_read=False).exclude(sender=request.user)
        for message in unread_messages:
            message.mark_as_read()
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message in a conversation"""
        conversation = self.get_object()
        
        # Check if user is a participant
        if request.user not in conversation.participants.all():
            return Response(
                {"error": "You are not a participant in this conversation"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = MessageCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        message = serializer.save(conversation=conversation, sender=request.user)
        
        conversation.save()
        
        print(f"📤 Message {message.id} sent by {request.user.username} in conversation {conversation.id}")
        
        import threading

        def notify_participants(conversation_id, sender_username, message_text, message_type, file_name, sender_id):
            try:
                from .models import Conversation
                from accounts.models import Notification
                
                conversation = Conversation.objects.get(id=conversation_id)
                other_participants = conversation.participants.exclude(id=sender_id)
                
                print(f"📧 [Async] Notifying {other_participants.count()} other participants")
                
                for participant in other_participants:
                    # Create in-app notification
                    Notification.objects.create(
                        recipient=participant,
                        notification_type='new_message',
                        title=f'New Message from {sender_username}',
                        message=f'You have a new message in conversation for "{conversation.contract.title}"',
                        related_conversation=conversation
                    )
                    
                    # Send email notification
                    if participant.email:
                        print(f"📧 [Async] Sending email notification to {participant.email}")
                        try:
                            send_new_message_email(
                                participant.email,
                                sender_username,
                                message_text,
                                has_file=message_type == 'file',
                                file_name=file_name
                            )
                        except Exception as e:
                            print(f"❌ [Async] Error sending email to {participant.email}: {str(e)}")
                    else:
                        print(f"⚠️ [Async] Participant {participant.username} has no email address")
            except Exception as e:
                print(f"❌ [Async] Error in notify_participants: {str(e)}")

        thread = threading.Thread(
            target=notify_participants,
            args=(
                conversation.id,
                request.user.username,
                message.text,
                message.message_type,
                message.file_name,
                request.user.id
            )
        )
        thread.start()

        serializer = MessageSerializer(message, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def clear_chat(self, request, pk=None):
        conversation = self.get_object()
        
        if request.user not in conversation.participants.all():
            return Response(
                {"error": "You are not a participant in this conversation"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        conversation.messages.all().delete()
        
        return Response(
            {"message": "Chat cleared successfully"}, 
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark all messages in a conversation as read"""
        conversation = self.get_object()
        
        # Check if user is a participant
        if request.user not in conversation.participants.all():
            return Response(
                {"error": "You are not a participant in this conversation"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        unread_messages = conversation.messages.filter(is_read=False).exclude(sender=request.user)
        count = unread_messages.count()
        
        for message in unread_messages:
            message.mark_as_read()
        
        return Response(
            {"message": f"Marked {count} messages as read"}, 
            status=status.HTTP_200_OK
        )

class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['text', 'sender__username', 'sender__first_name', 'sender__last_name']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(conversation__participants=user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a specific message as read"""
        message = self.get_object()
        
        # Check if user is a participant in the conversation
        if request.user not in message.conversation.participants.all():
            return Response(
                {"error": "You are not a participant in this conversation"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Don't mark own messages as read
        if message.sender == request.user:
            return Response(
                {"error": "Cannot mark your own message as read"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        message.mark_as_read()
        
        # Create read receipt
        MessageReadReceipt.objects.get_or_create(
            message=message,
            user=request.user
        )
        
        return Response(
            {"message": "Message marked as read"}, 
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread messages for the current user"""
        unread_messages = self.get_queryset().filter(
            is_read=False
        ).exclude(sender=request.user)
        
        serializer = MessageSerializer(unread_messages, many=True, context={'request': request})
        return Response(serializer.data)

class MessagePollView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get(self, request, *args, **kwargs):
        conversation_id = kwargs.get('conversation_id')
        last_message_id = request.query_params.get('last_message_id', 0)
        
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response(
                {"error": "Conversation not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if request.user not in conversation.participants.all():
            return Response(
                {"error": "You are not a participant in this conversation"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        import time
        timeout = 30
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            # Get all new messages (including user's own messages)
            new_messages = conversation.messages.filter(
                id__gt=last_message_id
            )
            
            if new_messages.exists():
                serializer = MessageSerializer(new_messages, many=True, context={'request': request})
                
                # Mark other users' messages as read
                for message in new_messages.exclude(sender=request.user):
                    message.mark_as_read()
                
                return Response(serializer.data)
            
            time.sleep(1)  # Check every second
        
        return Response([], status=status.HTTP_200_OK)  # Return empty if no new messages