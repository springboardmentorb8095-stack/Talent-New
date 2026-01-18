from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Project
from .serializers import ProjectSerializer
from .permissions import IsClient
from contracts.models import Contract


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsClient()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    def get_queryset(self):
        user = self.request.user

        # ---------------- CLIENT ----------------
        # Client sees ALL their projects
        if user.role == "client":
            queryset = Project.objects.filter(client=user)

        # ---------------- FREELANCER ----------------
        # Freelancer sees ONLY projects WITHOUT contracts (OPEN projects)
        else:
            locked_project_ids = Contract.objects.values_list(
                "project_id", flat=True
            )
            queryset = Project.objects.exclude(id__in=locked_project_ids)

        queryset = queryset.order_by("-created_at")

        # ---------------- FILTERS ----------------
        skill = self.request.query_params.get("skill")
        min_budget = self.request.query_params.get("min_budget")
        max_budget = self.request.query_params.get("max_budget")

        if skill:
            queryset = queryset.filter(required_skills__icontains=skill)

        if min_budget:
            try:
                queryset = queryset.filter(budget__gte=float(min_budget))
            except ValueError:
                pass

        if max_budget:
            try:
                queryset = queryset.filter(budget__lte=float(max_budget))
            except ValueError:
                pass

        return queryset


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()

    def get_object(self):
        project = super().get_object()
        user = self.request.user

        # If project has a contract → LOCKED
        try:
            contract = project.contract
        except Contract.DoesNotExist:
            contract = None

        if contract:
            # Only client or hired freelancer can view
            if user not in [contract.client, contract.freelancer]:
                raise PermissionDenied(
                    "This project is no longer available."
                )

        return project

    def perform_update(self, serializer):
        serializer.save(client=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()
