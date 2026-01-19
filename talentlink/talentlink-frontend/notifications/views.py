# from django.shortcuts import render

# # Create your views here.
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from .models import Notification
# from .serializers import NotificationSerializer

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def my_notifications(request):
#     notifications = Notification.objects.filter(
#         user=request.user
#     ).order_by("-created_at")
#     return Response(NotificationSerializer(notifications, many=True).data)

# @api_view(["PATCH"])
# @permission_classes([IsAuthenticated])
# def mark_as_read(request, pk):
#     notification = Notification.objects.get(id=pk, user=request.user)
#     notification.is_read = True
#     notification.save()
#     return Response({"message": "Marked as read"})


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Notification
from .serializers import NotificationSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_notifications(request):
    notifications = Notification.objects.filter(
        user=request.user
    ).order_by("-created_at")
    return Response(NotificationSerializer(notifications, many=True).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def unread_count(request):
    count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).count()
    return Response({"count": count})

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_as_read(request, pk):
    notification = get_object_or_404(Notification, id=pk, user=request.user)
    notification.is_read = True
    notification.save()
    return Response({"message": "Marked as read"})

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_notification(request, pk):
    notification = get_object_or_404(Notification, id=pk, user=request.user)
    notification.delete()
    return Response({"message": "Notification deleted"})
