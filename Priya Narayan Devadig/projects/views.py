from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from .models import Project
from .serializers import ProjectSerializer, ProjectCreateSerializer


class ProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]  # Added SessionAuthentication
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'budget_min', 'deadline']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateSerializer
        return ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.select_related('client').prefetch_related('required_skills')
        
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by budget range
        min_budget = self.request.query_params.get('min_budget', None)
        max_budget = self.request.query_params.get('max_budget', None)
        if min_budget:
            queryset = queryset.filter(budget_max__gte=min_budget)
        if max_budget:
            queryset = queryset.filter(budget_min__lte=max_budget)
        
        # Filter by duration range
        min_duration = self.request.query_params.get('min_duration', None)
        max_duration = self.request.query_params.get('max_duration', None)
        if min_duration:
            queryset = queryset.filter(estimated_duration__gte=min_duration)
        if max_duration:
            queryset = queryset.filter(estimated_duration__lte=max_duration)
        
        # Filter by skills
        skills = self.request.query_params.get('skills', None)
        if skills:
            skill_ids = [int(s) for s in skills.split(',') if s.isdigit()]
            queryset = queryset.filter(required_skills__id__in=skill_ids).distinct()
        
        # Filter by client (for client's own projects)
        my_projects = self.request.query_params.get('my_projects', None)
        if my_projects == 'true':
            queryset = queryset.filter(client=self.request.user)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]  # Added SessionAuthentication

    def get_queryset(self):
        return Project.objects.select_related('client').prefetch_related('required_skills', 'proposals')


class PublicProjectListView(generics.ListAPIView):
    """Public endpoint for browsing open projects"""
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering = ['-created_at']

    def get_queryset(self):
        return Project.objects.filter(status='open').select_related('client').prefetch_related('required_skills')