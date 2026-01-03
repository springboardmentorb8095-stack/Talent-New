from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

urlpatterns = [
    # ---------------------------
    # API ROOT
    # ---------------------------
    path('', views.api_root, name='api-root'),

    # ---------------------------
    # AUTH
    # ---------------------------
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),

    # JWT
    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # ---------------------------
    # PROJECTS
    # ---------------------------
    path('projects/', views.ProjectListCreateView.as_view(), name='projects'),
    path('projects/<int:pk>/', views.ProjectRetrieveUpdateDeleteView.as_view(), name='project-detail'),

    # ---------------------------
    # PROPOSALS
    # ---------------------------
    path('proposals/', views.ProposalListCreateView.as_view(), name='proposals'),

    path(
        'projects/<int:project_id>/proposals/',
        views.ProposalByProjectView.as_view(),
        name='project-proposals'
    ),

    path(
        'proposals/<int:proposal_id>/status/',
        views.ProposalStatusUpdateView.as_view(),
        name='proposal-status'
    ),

    # ---------------------------
    # DASHBOARDS
    # ---------------------------
    path(
        'dashboard/client/',
        views.ClientDashboardView.as_view(),
        name='client-dashboard'
    ),
    path(
        'dashboard/freelancer/',
        views.FreelancerDashboardView.as_view(),
        name='freelancer-dashboard'
    ),

    # ---------------------------
    # CONTRACTS
    # ---------------------------
    path('contracts/', views.ContractListCreateView.as_view(), name='contracts'),

    # ---------------------------
    # REVIEWS
    # ---------------------------
    path('reviews/', views.ReviewCreateView.as_view(), name='reviews'),

    # ---------------------------
    # MESSAGES
    # ---------------------------
    path('messages/', views.MessageListCreateView.as_view(), name='messages'),
]



