from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import ListCreateAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.utils import timezone
from django.db import transaction

from .models import (
    Profile,
    EmailOTP,
    Project,
    Proposal,
    Contract,
    Message,
    Review,
    Notification,
)

from .serializers import (
    ProfileSerializer,
    ProjectSerializer,
    ProposalSerializer,
    ContractSerializer,
    MessageSerializer,
    ReviewSerializer,
    NotificationSerializer,
)

User = get_user_model()

# =====================================================
# =================== AUTH ============================
# =====================================================

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")

        if not all([email, username, password, role]):
            return Response({"error": "All fields required"}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            is_active=False,
        )

        otp = EmailOTP.objects.create(user=user)

        send_mail(
            "TalentLink Email Verification",
            f"Your OTP is {otp.otp}",
            None,
            [email],
        )

        return Response({"message": "OTP sent"}, status=201)


class VerifyOTPAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_object_or_404(User, email=request.data.get("email"))
        otp_obj = get_object_or_404(
            EmailOTP,
            user=user,
            otp=request.data.get("otp"),
            is_verified=False,
        )

        if otp_obj.is_expired():
            return Response({"error": "OTP expired"}, status=400)

        otp_obj.is_verified = True
        otp_obj.save()

        user.is_active = True
        user.save()

        Profile.objects.get_or_create(user=user)
        return Response({"message": "Account verified"})


class ForgotPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = User.objects.filter(email=request.data.get("email")).first()
        if not user:
            return Response({"error": "Email not found"}, status=404)

        token = default_token_generator.make_token(user)
        link = f"http://localhost:3000/reset-password/{token}"

        send_mail("Password Reset", link, None, [user.email])
        return Response({"message": "Reset link sent"})


class UpdateUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        user.username = request.data.get("username", user.username)
        user.email = request.data.get("email", user.email)

        if request.data.get("password"):
            user.set_password(request.data["password"])

        user.save()
        return Response({"message": "User updated"})


# =====================================================
# =================== PROFILE =========================
# =====================================================

class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return Response(ProfileSerializer(profile).data)

    def put(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(profile_completed=True)
        return Response(serializer.data)


# =====================================================
# =================== PROJECTS ========================
# =====================================================

class ProjectListCreateAPIView(ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "budget_min"]

    def get_queryset(self):
        user = self.request.user
        if user.role == "CLIENT":
            return Project.objects.filter(client=user)
        return Project.objects.filter(status="OPEN")

    def perform_create(self, serializer):
        if self.request.user.role != "CLIENT":
            raise PermissionDenied("Only clients can create projects")
        serializer.save(client=self.request.user)


class ProjectDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        return Response(ProjectSerializer(project).data)

    def put(self, request, pk):
        project = get_object_or_404(Project, pk=pk, client=request.user)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        project = get_object_or_404(Project, pk=pk, client=request.user)
        project.delete()
        return Response({"message": "Project deleted"})


# =====================================================
# =================== PROPOSALS =======================
# =====================================================

class ProposalCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "FREELANCER":
            return Response({"error": "Only freelancers can apply"}, status=403)

        serializer = ProposalSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        proposal = serializer.save(freelancer=request.user)

        Notification.objects.create(
            user=proposal.project.client,
            title="New Proposal",
            message=f"New proposal for '{proposal.project.title}'",
        )

        return Response(serializer.data, status=201)


class MyProposalsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        proposals = Proposal.objects.filter(freelancer=request.user)
        return Response(ProposalSerializer(proposals, many=True).data)


class ProposalStatusUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, proposal_id):
        proposal = get_object_or_404(Proposal, id=proposal_id)

        if proposal.project.client != request.user:
            return Response({"error": "Not allowed"}, status=403)

        status_value = request.data.get("status")

        if status_value not in ["ACCEPTED", "REJECTED"]:
            return Response({"error": "Invalid status"}, status=400)

        if status_value == "ACCEPTED" and Contract.objects.filter(
            project=proposal.project
        ).exists():
            return Response(
                {"error": "Contract already exists"},
                status=400
            )

        with transaction.atomic():
            proposal.status = status_value
            proposal.save()

            if status_value == "ACCEPTED":
                Contract.objects.create(
                    project=proposal.project,
                    proposal=proposal,
                    client=proposal.project.client,
                    freelancer=proposal.freelancer,
                    terms="Default contract terms",
                )
                proposal.project.status = "IN_PROGRESS"
                proposal.project.save()

        return Response({"message": "Proposal updated"}, status=200)


# =====================================================
# ========== PROJECT → PROPOSALS (CLIENT VIEW) =========
# =====================================================

class ProjectProposalsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        if project.client != request.user:
            return Response({"error": "Not allowed"}, status=403)

        proposals = Proposal.objects.filter(project=project)

        serializer = ProposalSerializer(
            proposals,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data, status=200)


# =====================================================
# =================== CONTRACTS =======================
# =====================================================

class ContractListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        contracts = Contract.objects.filter(
            Q(client=request.user) | Q(freelancer=request.user)
        )
        return Response(ContractSerializer(contracts, many=True).data)


class ContractStatusUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, contract_id):
        contract = get_object_or_404(Contract, id=contract_id)

        if request.user not in [contract.client, contract.freelancer]:
            return Response({"error": "Not allowed"}, status=403)

        status_value = request.data.get("status")

        if status_value not in ["ACTIVE", "COMPLETED", "CANCELLED"]:
            return Response({"error": "Invalid status"}, status=400)

        contract.status = status_value
        contract.save()

        return Response({"message": "Contract updated"})


# =====================================================
# =================== CHAT LIST =======================
# =====================================================

class ChatContractListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        contracts = Contract.objects.filter(
            Q(client=request.user) | Q(freelancer=request.user),
            status="ACTIVE"
        )

        serializer = ContractSerializer(
            contracts,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data, status=200)


# =====================================================
# =================== MESSAGES ========================
# =====================================================

class MessageListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        contract_id = request.query_params.get("contract")

        messages = Message.objects.filter(
            Q(contract__client=request.user) |
            Q(contract__freelancer=request.user)
        )

        if contract_id:
            messages = messages.filter(contract_id=contract_id)

        serializer = MessageSerializer(
            messages.order_by("sent_at"),
            many=True,
            context={"request": request}
        )
        return Response(serializer.data, status=200)

    def post(self, request):
        contract = get_object_or_404(Contract, id=request.data.get("contract"))

        if request.user not in [contract.client, contract.freelancer]:
            return Response({"error": "Not allowed"}, status=403)

        # 🔒 CORE FIX: Freelancer cannot message first
        if request.user == contract.freelancer:
            client_has_messaged = Message.objects.filter(
                contract=contract,
                sender=contract.client
            ).exists()

            if not client_has_messaged:
                return Response(
                    {
                        "error": "Client must send the first message before freelancer can reply"
                    },
                    status=403
                )

        receiver = (
            contract.freelancer
            if request.user == contract.client
            else contract.client
        )

        message = Message.objects.create(
            sender=request.user,
            receiver=receiver,
            contract=contract,
            content=request.data.get("content"),
        )

        Notification.objects.create(
            user=receiver,
            title="New Message",
            message="You received a new message",
        )

        return Response(
            MessageSerializer(message, context={"request": request}).data,
            status=201
        )

# =====================================================
# =================== REVIEWS =========================
# =====================================================

class ReviewCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ReviewSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        contract = serializer.validated_data["contract"]

        if request.user not in [contract.client, contract.freelancer]:
            return Response({"error": "Not allowed"}, status=403)

        review = serializer.save(
            reviewer=request.user,
            reviewee=(
                contract.freelancer
                if request.user == contract.client
                else contract.client
            ),
        )

        return Response(serializer.data, status=201)


# =====================================================
# =================== NOTIFICATIONS ===================
# =====================================================

class NotificationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        return Response(NotificationSerializer(notifications, many=True).data)


class NotificationReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, notification_id):
        notification = get_object_or_404(
            Notification,
            id=notification_id,
            user=request.user,
        )
        notification.is_read = True
        notification.save()
        return Response({"message": "Marked as read"})
