from django.urls import path
from . import views

urlpatterns = [
    path('', views.MessageListView.as_view(), name='message-list-create'),
    path('<int:pk>/', views.MessageDetailView.as_view(), name='message-detail'),
    path('conversations/', views.get_conversations, name='conversations'),
    path('<int:pk>/read/', views.mark_as_read, name='mark-as-read'),
    path('conversation/<int:partner_id>/read/', views.mark_conversation_as_read, name='mark-conversation-read'),
]