from rest_framework import generics, permissions
from .models import Project
from .serializers import ProjectSerializer
from .permissions import IsClient

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [IsClient]

    def get_queryset(self):
        queryset = Project.objects.all()

        skill = self.request.query_params.get('skill')
        budget = self.request.query_params.get('budget')
        duration = self.request.query_params.get('duration')

        if skill:
            queryset = queryset.filter(skills_required__icontains=skill)

        if budget:
            queryset = queryset.filter(budget__lte=budget)

        if duration:
            queryset = queryset.filter(duration__icontains=duration)

        return queryset


    def perform_create(self, serializer):
        serializer.save(client=self.request.user)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(client=self.request.user)
