from django.urls import path
from .views import MessageHistoryView, SendMessageView, LongPollingMessageView

urlpatterns = [
    path("<int:contract_id>/", MessageHistoryView.as_view(), name="message-history"),
    path('<int:contract_id>/long/', LongPollingMessageView.as_view()),
    path("<int:contract_id>/send/", SendMessageView.as_view(), name="message-send"),
]
