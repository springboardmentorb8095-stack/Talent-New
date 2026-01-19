# from django.urls import path
# from .views import my_notifications, mark_as_read

# urlpatterns = [
#     path("", my_notifications),
#     path("<int:pk>/read/", mark_as_read),
# ]


from django.urls import path
from .views import (
    my_notifications,
    mark_as_read,
    delete_notification,
    unread_count
)

urlpatterns = [
    path("", my_notifications),
    path("count/", unread_count),
    path("<int:pk>/read/", mark_as_read),
    path("<int:pk>/delete/", delete_notification),
]
