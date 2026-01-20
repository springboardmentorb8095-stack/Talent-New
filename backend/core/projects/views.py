from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from .models import Project
from .serializers import ProjectSerializer
from users.permissions import IsClient, IsFreelancer

class ClientProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsClient]

    def get_queryset(self):
        return Project.objects.filter(client=self.request.user)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

class FreelancerProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def get_queryset(self):
        return Project.objects.all().order_by("-created_at")
    
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ProjectFilter

class FreelancerProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = []  # Public, or IsAuthenticated if needed
    queryset = Project.objects.all()

    # Add filtering and search
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filterset_fields = ['budget']  # numeric filters, can extend
    filterset_class = ProjectFilter
    search_fields = ['title', 'description', 'skills_required']  # text search

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx