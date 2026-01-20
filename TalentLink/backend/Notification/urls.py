from django.urls import path
from .views import (
    NotificationListView,
    MarkAllReadView,
    MarkNotificationReadView,
)

urlpatterns = [
    path("", NotificationListView.as_view(), name="notifications"),
    path("mark-read/", MarkAllReadView.as_view()),
    path("mark-read/<int:pk>/", MarkNotificationReadView.as_view()),  # ✅ NEW
]
