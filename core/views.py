from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view

from .models import Profile, Project, Proposal, Contract, Review, Message
from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    ProjectSerializer,
    ProposalSerializer,
    ContractSerializer,
    ReviewSerializer,
    MessageSerializer,
)

User = get_user_model()


# ---------------------------
# API ROOT
# ---------------------------
@api_view(['GET'])
def api_root(request):
    return Response({
        "register": "/api/register/",
        "profiles": "/api/profiles/",
        "projects": "/api/projects/",
        "proposals": "/api/proposals/",
        "token": "/api/token/",
        "token_refresh": "/api/token/refresh/",
    })


# ---------------------------
# REGISTER with Role & Profile
# ---------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # Save the user
        user = serializer.save()
        # Get role from request or default to client
        role = self.request.data.get("role", "client")
        # Create profile automatically
        Profile.objects.create(user=user, role=role)


# ---------------------------
# PROFILE
# ---------------------------
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            role = profile.role
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "username": request.user.username,  # ✅ fixed
            "role": profile.role
        })

# ---------------------------
# CLIENT DASHBOARD
# ---------------------------
class ClientDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            if profile.role != "client":
                return Response({"error": "Access denied"}, status=403)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=400)

        projects = Project.objects.filter(client=request.user)
        proposals = Proposal.objects.filter(project__client=request.user)

        return Response({
            "projects": ProjectSerializer(projects, many=True).data,
            "proposals": ProposalSerializer(proposals, many=True).data
        })


# ---------------------------
# FREELANCER DASHBOARD
# ---------------------------
class FreelancerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            if profile.role != "freelancer":
                return Response({"error": "Access denied"}, status=403)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=400)

        proposals = Proposal.objects.filter(freelancer=request.user)
        data = []
        for p in proposals:
            data.append({
                "id": p.id,
                "project_id": p.project.id,
                "project_title": p.project.title,
                "bid_amount": p.bid_amount,
                "cover_letter": p.cover_letter,
                "status": p.status
            })

        return Response({"proposals": data}, status=200)


# ---------------------------
# PROJECT
# ---------------------------
class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Project.objects.all()
        budget = self.request.query_params.get("budget")
        duration = self.request.query_params.get("duration")
        skill = self.request.query_params.get("skill")

        if skill:
            queryset = queryset.filter(client__profile__skills__icontains=skill)
        if budget:
            queryset = queryset.filter(budget__lte=budget)
        if duration:
            queryset = queryset.filter(duration_days__lte=duration)

        return queryset

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class ProjectRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(client=self.request.user)


class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]


# ---------------------------
# PROPOSALS
# ---------------------------
class ProposalListCreateView(generics.ListCreateAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Proposal.objects.filter(freelancer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)


class ProposalByProjectView(generics.ListAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs["project_id"]
        return Proposal.objects.filter(
            project_id=project_id,
            project__client=self.request.user
        )


class ProposalStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, proposal_id):
        try:
            proposal = Proposal.objects.get(id=proposal_id)
            if proposal.project.client != request.user:
                raise PermissionDenied("Not allowed")
        except Proposal.DoesNotExist:
            return Response({"error": "Proposal not found"}, status=404)

        status_val = request.data.get("status")
        if status_val not in ["accepted", "rejected"]:
            return Response({"error": "Invalid status"}, status=400)

        proposal.status = status_val
        proposal.save()
        return Response({"message": f"Proposal {status_val}"})


# ---------------------------
# CONTRACT, REVIEW, MESSAGE (same as before)
# ---------------------------
class ContractListCreateView(generics.ListCreateAPIView):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Contract.objects.filter(
            Q(project__client=self.request.user) | Q(freelancer=self.request.user)
        )


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

