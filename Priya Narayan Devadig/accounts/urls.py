from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views, notification_views, dashboard_views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/skills/', views.UserSkillsView.as_view(), name='user-skills'),
    path('skills/', views.SkillListView.as_view(), name='skills'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    
    # Dashboard endpoints
    path('dashboard/stats/', dashboard_views.get_dashboard_stats, name='dashboard-stats'),
    path('dashboard/activity/', dashboard_views.get_activity_feed, name='dashboard-activity'),
    
    # Notification endpoints
    path('notifications/', notification_views.NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:notification_id>/read/', notification_views.mark_notification_read, name='mark-notification-read'),
    path('notifications/mark-all-read/', notification_views.mark_all_notifications_read, name='mark-all-notifications-read'),
    path('notifications/<int:notification_id>/delete/', notification_views.delete_notification, name='delete-notification'),
    path('notifications/unread-count/', notification_views.get_unread_count, name='unread-count'),
    path('notifications/summary/', notification_views.get_notification_summary, name='notification-summary'),
    path('notifications/preferences/', notification_views.NotificationPreferenceView.as_view(), name='notification-preferences'),
]