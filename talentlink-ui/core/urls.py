from django.urls import path
from .views import (
    # AUTH
    RegisterAPIView,
    VerifyOTPAPIView,
    ForgotPasswordAPIView,
    UpdateUserAPIView,

    # PROFILE
    ProfileAPIView,

    # PROJECTS
    ProjectListCreateAPIView,
    ProjectDetailAPIView,

    # PROPOSALS
    ProposalCreateAPIView,
    MyProposalsAPIView,
    ProposalStatusUpdateAPIView,
    ProjectProposalsAPIView,

    # CONTRACTS
    ContractListAPIView,
    ContractStatusUpdateAPIView,

    # MESSAGES
    MessageListCreateAPIView,
    ChatContractListAPIView,   # ✅ ADDED (SAFE)

    # REVIEWS
    ReviewCreateAPIView,

    # NOTIFICATIONS
    NotificationListAPIView,
    NotificationReadAPIView,
)

urlpatterns = [

    # ================= AUTH =================
    path("auth/register/", RegisterAPIView.as_view()),
    path("auth/verify-otp/", VerifyOTPAPIView.as_view()),
    path("auth/forgot-password/", ForgotPasswordAPIView.as_view()),
    path("auth/update-user/", UpdateUserAPIView.as_view()),

    # ================= PROFILE =================
    path("profile/", ProfileAPIView.as_view()),

    # ================= PROJECTS =================
    path("projects/", ProjectListCreateAPIView.as_view()),
    path("projects/<int:pk>/", ProjectDetailAPIView.as_view()),

    # ================= PROPOSALS =================
    path("proposals/", ProposalCreateAPIView.as_view()),
    path("my-proposals/", MyProposalsAPIView.as_view()),
    path(
        "proposals/<int:proposal_id>/status/",
        ProposalStatusUpdateAPIView.as_view(),
    ),

    # ✅ CLIENT: View proposals for a project
    path(
        "projects/<int:project_id>/proposals/",
        ProjectProposalsAPIView.as_view(),
    ),

    # ================= CONTRACTS =================
    path("contracts/", ContractListAPIView.as_view()),
    path(
        "contracts/<int:contract_id>/status/",
        ContractStatusUpdateAPIView.as_view(),
    ),

    # ================= MESSAGES =================
    path("messages/", MessageListCreateAPIView.as_view()),

    # ✅ NEW: list active chat contracts
    path("chats/", ChatContractListAPIView.as_view()),

    # ================= REVIEWS =================
    path("reviews/", ReviewCreateAPIView.as_view()),

    # ================= NOTIFICATIONS =================
    path("notifications/", NotificationListAPIView.as_view()),
    path(
        "notifications/<int:notification_id>/read/",
        NotificationReadAPIView.as_view(),
    ),
]
