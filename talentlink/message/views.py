
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db import models

from .models import Message
from .serializers import MessageSerializer
from proposals.models import Proposal

# 🔔 notifications
from notifications.models import Notification

User = get_user_model()


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            sender=self.request.user
        ) | Message.objects.filter(
            receiver=self.request.user
        )

    @action(detail=False, methods=["get"])
    def conversations(self, request):
        sent_to = Message.objects.filter(
            sender=request.user
        ).values_list("receiver", flat=True)

        received_from = Message.objects.filter(
            receiver=request.user
        ).values_list("sender", flat=True)

        user_ids = set(sent_to) | set(received_from)

        accepted = Proposal.objects.filter(
            status="accepted"
        ).filter(
            models.Q(project__client=request.user) |
            models.Q(freelancer=request.user)
        )

        for p in accepted:
            user_ids.add(
                p.freelancer.id if p.project.client == request.user else p.project.client.id
            )

        users = User.objects.filter(id__in=user_ids).exclude(id=request.user.id)

        return Response([
            {
                "id": u.id,
                "username": u.username,
                "email": u.email
            } for u in users
        ])

    @action(detail=False, methods=["get", "post"])
    def chat(self, request):
        other_user_id = request.query_params.get("user_id") or request.data.get("receiver")
        other_user = get_object_or_404(User, id=other_user_id)

        if request.method == "GET":
            messages = Message.objects.filter(
                (models.Q(sender=request.user) & models.Q(receiver=other_user)) |
                (models.Q(sender=other_user) & models.Q(receiver=request.user))
            ).order_by("timestamp")

            return Response(MessageSerializer(messages, many=True).data)

        if request.method == "POST":
            content = request.data.get("content")

            message = Message.objects.create(
                sender=request.user,
                receiver=other_user,
                content=content
            )

            
            # 🔔 Notify receiver
            Notification.objects.create(
                user=other_user,
                title="New Message",
                message=f"You received a new message from {request.user.username}.",
                link="/messages"
            )

          
            return Response(
                MessageSerializer(message).data,
                status=status.HTTP_201_CREATED
            )
