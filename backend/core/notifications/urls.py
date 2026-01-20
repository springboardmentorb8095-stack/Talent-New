from django.urls import path
from .views import (
    MyNotificationsView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView
)

urlpatterns = [
    path("my/", MyNotificationsView.as_view(), name="my-notifications"),
    path("<int:pk>/read/", MarkNotificationReadView.as_view(), name="notification-read"),
    path("mark-all-read/", MarkAllNotificationsReadView.as_view(), name="notification-mark-all-read"),
]
