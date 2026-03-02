from django.urls import path
from . import views

urlpatterns = [
    # Conversation management
    path('conversations/', views.get_conversations, name='conversations'),
    path('conversations/<int:conversation_id>/', views.get_conversation_messages, name='conversation-messages'),
    path('conversations/<int:conversation_id>/read/', views.mark_conversation_read, name='mark-conversation-read'),
    path('conversations/<int:conversation_id>/clear/', views.clear_conversation, name='clear-conversation'),
    
    # Message sending
    path('', views.send_message, name='send-message'),
    path('start-conversation/', views.start_conversation, name='start-conversation'),
    
    # Real-time features
    path('long-poll/<int:conversation_id>/', views.long_poll_messages, name='long-poll-messages'),
    path('unread-count/', views.get_unread_count, name='unread-count'),
    
    # Additional features
    path('typing/<int:conversation_id>/', views.typing_indicator, name='typing-indicator'),
    path('search/', views.search_messages, name='search-messages'),
]