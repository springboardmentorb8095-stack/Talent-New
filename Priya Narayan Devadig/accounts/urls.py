from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/skills/', views.UserSkillsView.as_view(), name='user-skills'),
    path('skills/', views.SkillListView.as_view(), name='skills'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
]