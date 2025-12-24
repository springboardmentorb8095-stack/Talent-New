from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, Proposal
from .serializers import ProjectSerializer, ProposalSerializer

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'budget', 'duration']
    search_fields = ['title', 'description', 'skills_required__skill_name']
    ordering_fields = ['budget', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Project.objects.all()
        
        skills = self.request.query_params.getlist('skills')
        if skills:
            queryset = queryset.filter(skills_required__skill_name__in=skills).distinct()
        
        min_budget = self.request.query_params.get('min_budget')
        max_budget = self.request.query_params.get('max_budget')
        if min_budget:
            queryset = queryset.filter(budget__gte=min_budget)
        if max_budget:
            queryset = queryset.filter(budget__lte=max_budget)
        
        duration = self.request.query_params.get('duration')
        if duration:
            queryset = queryset.filter(duration__icontains=duration)
        
        availability = self.request.query_params.get('availability')
        if availability:
            queryset = queryset.filter(client__profile__availability=availability)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        project = self.get_object()
        if project.client != request.user:
            return Response(
                {"error": "You can only update your own projects"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        project = self.get_object()
        if project.client != request.user:
            return Response(
                {"error": "You can only delete your own projects"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

class ClientProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(client=self.request.user)

class ProposalListCreateView(generics.ListCreateAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        if project_id:
            return Proposal.objects.filter(project_id=project_id)
        return Proposal.objects.filter(freelancer=self.request.user)

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        if project_id:
            project = Project.objects.get(id=project_id)
            serializer.save(freelancer=self.request.user, project=project)
        else:
            serializer.save(freelancer=self.request.user)