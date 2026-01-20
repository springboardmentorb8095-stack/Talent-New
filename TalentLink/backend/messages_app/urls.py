from django.urls import path
from .views import ChatListView, ChatDetailView, SendMessageView

urlpatterns = [
    path("chat/list/", ChatListView.as_view(), name="chat-list"),
    path("chat/<int:user_id>/", ChatDetailView.as_view(), name="chat-detail"),
    path("chat/send/", SendMessageView.as_view(), name="chat-send"),
]
