from django.urls import path
from .views import (
    RegisterView, LoginView, ProfileView, ProfileUpdateView, UserUpdateView, UserListView, UserDetailView,
    UserByUsernameView, NotificationListView, NotificationDetailView, NotificationMarkAsReadView, UnreadNotificationCountView,
    SkillListView, PublicProfileView, DebugEmailView, SmartGmailDebugView
)

urlpatterns = [
    path('debug-email/', DebugEmailView.as_view(), name='debug-email'),
    path('debug-smart-gmail/', SmartGmailDebugView.as_view(), name='debug-smart-gmail'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/<int:user_id>/', PublicProfileView.as_view(), name='public-profile'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
    path('user/update/', UserUpdateView.as_view(), name='user-update'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/<str:username>/', UserByUsernameView.as_view(), name='user-by-username'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('notifications/<int:pk>/mark-as-read/', NotificationMarkAsReadView.as_view(), name='notification-mark-as-read'),
    path('notifications/unread-count/', UnreadNotificationCountView.as_view(), name='unread-notification-count'),
    path('skills/', SkillListView.as_view(), name='skill-list'),
]