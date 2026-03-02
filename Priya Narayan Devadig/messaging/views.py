from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db import models
from django.db.models import Q, Max
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone
import time
import json
from .models import Message, Conversation
from .serializers import MessageSerializer, MessageCreateSerializer, ConversationSerializer
from accounts.notifications import notify_message_received

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    """Get list of conversations for the current user"""
    user = request.user
    
    # Get conversations where user is a participant
    conversations = Conversation.objects.filter(
        participants=user
    ).prefetch_related('participants', 'messages').annotate(
        last_message_time=Max('messages__sent_at')
    ).order_by('-last_message_time')
    
    conversation_list = []
    for conv in conversations:
        # Get the other participant(s)
        other_participants = conv.participants.exclude(id=user.id)
        if other_participants.exists():
            other_user = other_participants.first()
            
            # Get unread count
            unread_count = conv.messages.filter(
                recipient=user,
                is_read=False
            ).count()
            
            # Get last message
            last_message = conv.messages.order_by('-sent_at').first()
            
            conversation_list.append({
                'id': conv.id,
                'other_user_id': other_user.id,
                'other_user_name': other_user.get_full_name() or other_user.username,
                'other_user_type': other_user.user_type,
                'project_title': conv.project.title if conv.project else None,
                'contract_id': conv.contract.id if conv.contract else None,
                'unread_count': unread_count,
                'last_message_time': last_message.sent_at if last_message else conv.created_at,
                'last_message_preview': last_message.content[:50] + '...' if last_message and len(last_message.content) > 50 else last_message.content if last_message else 'No messages yet',
                'last_message_sender': last_message.sender.get_full_name() if last_message else None
            })
    
    return Response(conversation_list)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversation_messages(request, conversation_id):
    """Get messages for a specific conversation"""
    try:
        conversation = get_object_or_404(
            Conversation.objects.prefetch_related('messages__sender', 'messages__recipient'),
            id=conversation_id,
            participants=request.user
        )
        
        # Get messages with pagination
        page_size = int(request.GET.get('page_size', 50))
        offset = int(request.GET.get('offset', 0))
        
        messages = conversation.messages.select_related('sender', 'recipient').order_by('-sent_at')[offset:offset + page_size]
        
        # Mark messages as read
        conversation.messages.filter(
            recipient=request.user,
            is_read=False
        ).update(is_read=True)
        
        serializer = MessageSerializer(messages, many=True)
        return Response({
            'messages': serializer.data,
            'has_more': conversation.messages.count() > offset + page_size,
            'total_count': conversation.messages.count()
        })
        
    except Conversation.DoesNotExist:
        return Response(
            {'error': 'Conversation not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """Send a message in a conversation"""
    conversation_id = request.data.get('conversation_id')
    content = request.data.get('content')
    
    if not conversation_id or not content:
        return Response(
            {'error': 'conversation_id and content are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
            participants=request.user
        )
        
        # Get the other participant
        other_participant = conversation.participants.exclude(id=request.user.id).first()
        
        if not other_participant:
            return Response(
                {'error': 'No other participant found'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create message
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            recipient=other_participant,
            content=content.strip()
        )
        
        # Update conversation timestamp
        conversation.updated_at = timezone.now()
        conversation.save()
        
        # Send notification
        notify_message_received(other_participant, message)
        
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Conversation.DoesNotExist:
        return Response(
            {'error': 'Conversation not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_conversation(request):
    """Start a new conversation with another user"""
    recipient_id = request.data.get('recipient_id')
    project_id = request.data.get('project_id')
    contract_id = request.data.get('contract_id')
    message_content = request.data.get('message')
    
    if not recipient_id or not message_content:
        return Response(
            {'error': 'recipient_id and message are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        recipient = get_object_or_404(User, id=recipient_id)
        
        if recipient == request.user:
            return Response(
                {'error': 'Cannot start conversation with yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if conversation already exists between these users
        existing_conversation = Conversation.objects.filter(
            participants=request.user
        ).filter(
            participants=recipient
        ).first()
        
        if existing_conversation:
            conversation = existing_conversation
        else:
            # Create new conversation
            conversation = Conversation.objects.create()
            conversation.participants.add(request.user, recipient)
            
            # Link to project or contract if provided
            if project_id:
                from projects.models import Project
                try:
                    project = Project.objects.get(id=project_id)
                    conversation.project = project
                    conversation.save()
                except Project.DoesNotExist:
                    pass
            
            if contract_id:
                from contracts.models import Contract
                try:
                    contract = Contract.objects.get(id=contract_id)
                    conversation.contract = contract
                    conversation.save()
                except Contract.DoesNotExist:
                    pass
        
        # Create the first message
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            recipient=recipient,
            content=message_content.strip()
        )
        
        # Send notification
        notify_message_received(recipient, message)
        
        return Response({
            'conversation_id': conversation.id,
            'message': MessageSerializer(message).data
        }, status=status.HTTP_201_CREATED)
        
    except User.DoesNotExist:
        return Response(
            {'error': 'Recipient not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def long_poll_messages(request, conversation_id):
    """Long-polling endpoint for real-time message updates"""
    try:
        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
            participants=request.user
        )
        
        # Get timestamp from query params
        last_message_time = request.GET.get('last_message_time')
        if last_message_time:
            from django.utils.dateparse import parse_datetime
            last_message_time = parse_datetime(last_message_time)
        else:
            last_message_time = timezone.now()
        
        # Poll for new messages (max 30 seconds)
        timeout = 30
        start_time = time.time()
        poll_interval = 1  # Check every second
        
        while time.time() - start_time < timeout:
            new_messages = conversation.messages.filter(
                sent_at__gt=last_message_time
            ).select_related('sender', 'recipient').order_by('sent_at')
            
            if new_messages.exists():
                # Mark messages as read if user is recipient
                new_messages.filter(
                    recipient=request.user,
                    is_read=False
                ).update(is_read=True)
                
                serializer = MessageSerializer(new_messages, many=True)
                return Response({
                    'messages': serializer.data,
                    'has_new_messages': True,
                    'last_message_time': new_messages.last().sent_at.isoformat()
                })
            
            time.sleep(poll_interval)
        
        # Timeout reached, no new messages
        return Response({
            'messages': [],
            'has_new_messages': False,
            'last_message_time': last_message_time.isoformat() if last_message_time else None
        })
        
    except Conversation.DoesNotExist:
        return Response(
            {'error': 'Conversation not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_conversation_read(request, conversation_id):
    """Mark all messages in a conversation as read"""
    try:
        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
            participants=request.user
        )
        
        updated_count = conversation.messages.filter(
            recipient=request.user,
            is_read=False
        ).update(is_read=True)
        
        return Response({
            'status': 'Conversation marked as read',
            'messages_marked': updated_count
        })
        
    except Conversation.DoesNotExist:
        return Response(
            {'error': 'Conversation not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_count(request):
    """Get total unread message count for user"""
    unread_count = Message.objects.filter(
        recipient=request.user,
        is_read=False
    ).count()
    
    return Response({'unread_count': unread_count})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def typing_indicator(request, conversation_id):
    """Handle typing indicators (for future WebSocket implementation)"""
    try:
        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
            participants=request.user
        )
        
        is_typing = request.data.get('is_typing', False)
        
        # For now, just return success
        # In a WebSocket implementation, this would broadcast to other participants
        return Response({
            'status': 'Typing indicator updated',
            'is_typing': is_typing
        })
        
    except Conversation.DoesNotExist:
        return Response(
            {'error': 'Conversation not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_messages(request):
    """Search messages across all conversations"""
    query = request.GET.get('q', '').strip()
    if not query:
        return Response({'error': 'Search query is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Search in messages where user is sender or recipient
    messages = Message.objects.filter(
        Q(sender=request.user) | Q(recipient=request.user),
        content__icontains=query
    ).select_related('sender', 'recipient', 'conversation').order_by('-sent_at')[:50]
    
    serializer = MessageSerializer(messages, many=True)
    return Response({
        'messages': serializer.data,
        'query': query,
        'count': messages.count()
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_conversation(request, conversation_id):
    """Clear all messages in a conversation"""
    try:
        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
            participants=request.user
        )
        
        # Delete all messages in the conversation
        deleted_count = conversation.messages.all().delete()[0]
        
        return Response({
            'status': 'Chat cleared successfully',
            'messages_deleted': deleted_count
        }, status=status.HTTP_200_OK)
        
    except Conversation.DoesNotExist:
        return Response(
            {'error': 'Conversation not found'},
            status=status.HTTP_404_NOT_FOUND
        )