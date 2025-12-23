from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db import models
from django.db.models import Q, Max
from .models import Message
from .serializers import MessageSerializer, MessageCreateSerializer


class MessageListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MessageCreateSerializer
        return MessageSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Message.objects.select_related('sender', 'recipient', 'contract', 'project').filter(
            Q(sender=user) | Q(recipient=user)
        )
        
        # Filter by conversation partner
        partner_id = self.request.query_params.get('partner', None)
        if partner_id:
            queryset = queryset.filter(
                Q(sender=user, recipient_id=partner_id) |
                Q(sender_id=partner_id, recipient=user)
            )
        
        # Filter by contract
        contract_id = self.request.query_params.get('contract', None)
        if contract_id:
            queryset = queryset.filter(contract_id=contract_id)
        
        # Filter by project
        project_id = self.request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        # Filter unread messages
        unread_only = self.request.query_params.get('unread', None)
        if unread_only == 'true':
            queryset = queryset.filter(recipient=user, is_read=False)
        
        return queryset.order_by('-sent_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class MessageDetailView(generics.RetrieveAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(recipient=user)
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Mark as read if user is recipient
        if instance.recipient == request.user and not instance.is_read:
            instance.is_read = True
            instance.save()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    """Get list of users with whom the current user has conversations"""
    user = request.user
    
    # Get all users who have sent or received messages from current user
    conversations = Message.objects.filter(
        Q(sender=user) | Q(recipient=user)
    ).values(
        'sender', 'recipient'
    ).annotate(
        last_message_time=Max('sent_at')
    ).order_by('-last_message_time')
    
    # Extract unique conversation partners
    partners = set()
    for conv in conversations:
        if conv['sender'] != user.id:
            partners.add(conv['sender'])
        if conv['recipient'] != user.id:
            partners.add(conv['recipient'])
    
    # Get partner details with unread count
    from accounts.models import User
    partner_list = []
    for partner_id in partners:
        partner = User.objects.get(id=partner_id)
        unread_count = Message.objects.filter(
            sender_id=partner_id,
            recipient=user,
            is_read=False
        ).count()
        
        last_message = Message.objects.filter(
            Q(sender=user, recipient_id=partner_id) |
            Q(sender_id=partner_id, recipient=user)
        ).order_by('-sent_at').first()
        
        partner_list.append({
            'id': partner.id,
            'name': partner.get_full_name(),
            'email': partner.email,
            'user_type': partner.user_type,
            'unread_count': unread_count,
            'last_message_time': last_message.sent_at if last_message else None,
            'last_message_preview': last_message.content[:50] + '...' if last_message and len(last_message.content) > 50 else last_message.content if last_message else ''
        })
    
    # Sort by last message time
    partner_list.sort(key=lambda x: x['last_message_time'] or '', reverse=True)
    
    return Response(partner_list)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_as_read(request, pk):
    """Mark a message as read"""
    try:
        message = Message.objects.get(pk=pk, recipient=request.user)
        message.is_read = True
        message.save()
        return Response({'status': 'Message marked as read'})
    except Message.DoesNotExist:
        return Response(
            {'error': 'Message not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_conversation_as_read(request, partner_id):
    """Mark all messages from a partner as read"""
    Message.objects.filter(
        sender_id=partner_id,
        recipient=request.user,
        is_read=False
    ).update(is_read=True)
    
    return Response({'status': 'Conversation marked as read'})