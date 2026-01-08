
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db import models

# 🔹 ADD THIS IMPORT
from proposals.models import Proposal   # adjust app name if needed

User = get_user_model()


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # User can only see messages they sent or received
        return Message.objects.filter(
            sender=self.request.user
        ) | Message.objects.filter(
            receiver=self.request.user
        ).order_by('-timestamp')

    @action(detail=False, methods=['get'])
    def conversations(self, request):
        """
        Get list of people the user has messaged
        OR users connected via ACCEPTED proposals
        """

        # 🔹 EXISTING: users from messages
        sent_to = Message.objects.filter(
            sender=request.user
        ).values_list('receiver', flat=True).distinct()

        received_from = Message.objects.filter(
            receiver=request.user
        ).values_list('sender', flat=True).distinct()

        user_ids = set(list(sent_to) + list(received_from))

        # 🔹 NEW: users from ACCEPTED proposals
        accepted_proposals = Proposal.objects.filter(
            status="accepted"
        ).filter(
            models.Q(project__client=request.user) |
            models.Q(freelancer=request.user)
        )

        for proposal in accepted_proposals:
            if proposal.project.client == request.user:
                user_ids.add(proposal.freelancer.id)
            else:
                user_ids.add(proposal.project.client.id)

        # 🔹 Final users list
        users = User.objects.filter(
            id__in=user_ids
        ).exclude(id=request.user.id)

        data = [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'last_message': self.get_last_message(request.user, user)
        } for user in users]

        return Response(data)

    def get_last_message(self, current_user, other_user):
        msg = Message.objects.filter(
            (models.Q(sender=current_user) & models.Q(receiver=other_user)) |
            (models.Q(sender=other_user) & models.Q(receiver=current_user))
        ).order_by('-timestamp').first()

        if msg:
            return {
                'content': msg.content[:50] + "..." if len(msg.content) > 50 else msg.content,
                'timestamp': msg.timestamp,
                'is_sent': msg.sender == current_user
            }
        return None

    @action(detail=False, methods=['get', 'post'])
    def chat(self, request):
        """
        GET: Get chat history with a specific user
        POST: Send message
        """

        other_user_id = request.query_params.get('user_id') or request.data.get('receiver')
        if not other_user_id:
            return Response({"error": "user_id or receiver required"}, status=400)

        other_user = get_object_or_404(User, id=other_user_id)

        if request.method == 'GET':
            messages = Message.objects.filter(
                (models.Q(sender=request.user) & models.Q(receiver=other_user)) |
                (models.Q(sender=other_user) & models.Q(receiver=request.user))
            ).order_by('timestamp')

            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            content = request.data.get('content')
            if not content:
                return Response({"error": "content required"}, status=400)

            message = Message.objects.create(
                sender=request.user,
                receiver=other_user,
                content=content
            )

            return Response(
                MessageSerializer(message).data,
                status=status.HTTP_201_CREATED
            )
