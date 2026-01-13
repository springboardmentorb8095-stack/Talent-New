from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet, MessageViewSet, MessagePollView
from .file_upload import upload_chat_file

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('conversations/<int:conversation_id>/poll/', MessagePollView.as_view(), name='message-poll'),
    path('upload-file/', upload_chat_file, name='upload-chat-file'),
]