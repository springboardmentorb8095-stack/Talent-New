from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework import serializers
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, Proposal
from .serializers import ProjectSerializer, ProposalSerializer, ProposalStatusSerializer
from accounts.models import Notification
from utils.email_service import (
    send_proposal_submitted_email,
    send_proposal_accepted_email,
    send_proposal_rejected_email
)

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
        if self.request.user.role != 'client':
            raise PermissionDenied("Only clients can post projects.")
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
        user = self.request.user
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                return Proposal.objects.none()

            if project.client == user:
                return Proposal.objects.filter(project=project)
            else:
                return Proposal.objects.filter(project=project, freelancer=user)
        
        if user.role == 'client':
            return Proposal.objects.filter(project__client=user)
        return Proposal.objects.filter(freelancer=user)

    def perform_create(self, serializer):
        if self.request.user.role != 'freelancer':
            raise PermissionDenied("Only freelancers can send proposals.")
        
        project_id = self.kwargs.get('project_id')
        if project_id:
            project = Project.objects.get(id=project_id)
            if project.client == self.request.user:
                raise serializers.ValidationError("Clients cannot submit proposals to their own projects.")
            
            proposal = serializer.save(freelancer=self.request.user, project=project)
            
            Notification.objects.create(
                recipient=project.client,
                notification_type='proposal_submitted',
                title=f'New Proposal on "{project.title}"',
                message=f'{self.request.user.username} has submitted a proposal for your project "{project.title}".',
                related_project=project,
                related_proposal=proposal
            )
            
            if project.client.email:
                send_proposal_submitted_email(
                    project.client.email,
                    project.title,
                    self.request.user.username
                )
        else:
            raise serializers.ValidationError("Project ID is required.")

class ProposalDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Proposal.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            pass
        return ProposalSerializer

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if obj.freelancer != user and obj.project.client != user:
            self.permission_denied(self.request, message="You do not have permission to access this proposal.")
        return obj

    def update(self, request, *args, **kwargs):
        proposal = self.get_object()
        user = request.user
        
        if user == proposal.project.client:
            serializer = ProposalStatusSerializer(proposal, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            
            old_status = proposal.status
            new_status = serializer.validated_data.get('status')
            
            self.perform_update(serializer)
            
            if old_status != new_status:
                if new_status == 'accepted':
                    Notification.objects.create(
                        recipient=proposal.freelancer,
                        notification_type='proposal_accepted',
                        title=f'Proposal Accepted for "{proposal.project.title}"',
                        message=f'Your proposal for "{proposal.project.title}" has been accepted!',
                        related_project=proposal.project,
                        related_proposal=proposal
                    )
                    if proposal.freelancer.email:
                        send_proposal_accepted_email(
                            proposal.freelancer.email,
                            proposal.project.title
                        )
                elif new_status == 'rejected':
                    Notification.objects.create(
                        recipient=proposal.freelancer,
                        notification_type='proposal_rejected',
                        title=f'Proposal Rejected for "{proposal.project.title}"',
                        message=f'Your proposal for "{proposal.project.title}" has been rejected.',
                        related_project=proposal.project,
                        related_proposal=proposal
                    )
                    if proposal.freelancer.email:
                        send_proposal_rejected_email(
                            proposal.freelancer.email,
                            proposal.project.title
                        )
            
            return Response(serializer.data)
        
        elif user == proposal.freelancer:
            if proposal.status != 'pending':
                return Response({"error": "Cannot edit proposal after it has been processed."}, status=status.HTTP_400_BAD_REQUEST)
            return super().update(request, *args, **kwargs)
        
        else:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)