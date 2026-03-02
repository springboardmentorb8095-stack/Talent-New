from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from .models import Notification, NotificationPreference
from .serializers import NotificationSerializer, NotificationPreferenceSerializer


class NotificationListView(generics.ListAPIView):
    """Get user's notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(recipient=user)
        
        # Filter by read status
        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        
        # Filter by notification type
        notification_type = self.request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        return queryset.order_by('-created_at')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    """Mark a specific notification as read"""
    try:
        notification = Notification.objects.get(
            id=notification_id,
            recipient=request.user
        )
        notification.mark_as_read()
        return Response({'status': 'Notification marked as read'})
    except Notification.DoesNotExist:
        return Response(
            {'error': 'Notification not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    """Mark all notifications as read for the current user"""
    updated_count = Notification.objects.filter(
        recipient=request.user,
        is_read=False
    ).update(is_read=True)
    
    return Response({
        'status': 'All notifications marked as read',
        'updated_count': updated_count
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_count(request):
    """Get count of unread notifications"""
    unread_count = Notification.objects.filter(
        recipient=request.user,
        is_read=False
    ).count()
    
    return Response({'unread_count': unread_count})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):
    """Delete a specific notification"""
    try:
        notification = Notification.objects.get(
            id=notification_id,
            recipient=request.user
        )
        notification.delete()
        return Response({'status': 'Notification deleted'})
    except Notification.DoesNotExist:
        return Response(
            {'error': 'Notification not found'},
            status=status.HTTP_404_NOT_FOUND
        )


class NotificationPreferenceView(generics.RetrieveUpdateAPIView):
    """Get and update user's notification preferences"""
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        preferences, created = NotificationPreference.objects.get_or_create(
            user=self.request.user
        )
        return preferences


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notification_summary(request):
    """Get notification summary with counts by type"""
    user = request.user
    
    summary = {
        'total_unread': Notification.objects.filter(recipient=user, is_read=False).count(),
        'by_type': {}
    }
    
    # Count by notification type
    notification_types = Notification.NOTIFICATION_TYPES
    for type_code, type_name in notification_types:
        count = Notification.objects.filter(
            recipient=user,
            notification_type=type_code,
            is_read=False
        ).count()
        if count > 0:
            summary['by_type'][type_code] = {
                'name': type_name,
                'count': count
            }
    
    return Response(summary)