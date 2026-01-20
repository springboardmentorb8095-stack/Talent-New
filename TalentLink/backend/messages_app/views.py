from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q
from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from .models import Message
from .serializers import MessageSerializer


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receiver_id = request.data.get("receiver_id")
        content = request.data.get("content")

        if not receiver_id or not content:
            return Response(
                {"error": "receiver_id and content are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        receiver = get_object_or_404(User, id=receiver_id)

        message = Message.objects.create(
            sender=request.user,
            receiver=receiver,
            content=content
        )

        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        other_user = get_object_or_404(User, id=user_id)

        messages = Message.objects.filter(
            Q(sender=request.user, receiver=other_user) |
            Q(sender=other_user, receiver=request.user)
        ).order_by("timestamp")

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        messages = Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by("-timestamp")

        chats = {}
        for msg in messages:
            other = msg.receiver if msg.sender == user else msg.sender
            if other.id not in chats:
                chats[other.id] = {
                    "user_id": other.id,
                    "username": other.username,
                    "last_message": msg.content,
                }

        return Response(list(chats.values()))


class ChatDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        messages = Message.objects.filter(
            Q(sender=request.user, receiver_id=user_id) |
            Q(sender_id=user_id, receiver=request.user)
        ).order_by("timestamp")

        return Response([
            {
                "sender": msg.sender.username,
                "content": msg.content,
                "timestamp": msg.timestamp,
            }
            for msg in messages
        ])


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receiver = User.objects.get(id=request.data["receiver_id"])
        content = request.data.get("content")

        Message.objects.create(
            sender=request.user,
            receiver=receiver,
            content=content,
        )

        return Response({"message": "Message sent"})