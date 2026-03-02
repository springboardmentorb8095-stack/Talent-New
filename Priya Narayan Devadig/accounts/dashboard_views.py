"""
Dashboard views for clients and freelancers
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta

from projects.models import Project
from proposals.models import Proposal
from contracts.models import Contract
from reviews.models import Review
from messaging.models import Message


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    """Get dashboard statistics based on user type"""
    user = request.user
    
    if user.user_type == 'client':
        return Response(get_client_dashboard_stats(user))
    else:
        return Response(get_freelancer_dashboard_stats(user))


def get_client_dashboard_stats(user):
    """Get statistics for client dashboard"""
    
    # Projects statistics
    total_projects = Project.objects.filter(client=user).count()
    active_projects = Project.objects.filter(client=user, status='open').count()
    completed_projects = Project.objects.filter(client=user, status='completed').count()
    
    # Proposals statistics
    total_proposals = Proposal.objects.filter(project__client=user).count()
    pending_proposals = Proposal.objects.filter(
        project__client=user, 
        status='pending'
    ).count()
    
    # Contracts statistics
    active_contracts = Contract.objects.filter(
        client=user,
        status__in=['active', 'in_progress']
    ).count()
    completed_contracts = Contract.objects.filter(
        client=user,
        status='completed'
    ).count()
    
    # Financial statistics
    total_spent = Contract.objects.filter(
        client=user,
        status='completed'
    ).aggregate(total=Sum('agreed_budget'))['total'] or 0
    
    # Recent activity
    recent_projects = Project.objects.filter(client=user).order_by('-created_at')[:5]
    recent_proposals = Proposal.objects.filter(
        project__client=user
    ).select_related('freelancer', 'project').order_by('-created_at')[:5]
    
    # Unread messages
    unread_messages = Message.objects.filter(
        recipient=user,
        is_read=False
    ).count()
    
    # Reviews statistics
    avg_rating_given = Review.objects.filter(reviewer=user).aggregate(
        avg=Avg('rating')
    )['avg'] or 0
    
    return {
        'user_type': 'client',
        'projects': {
            'total': total_projects,
            'active': active_projects,
            'completed': completed_projects,
        },
        'proposals': {
            'total': total_proposals,
            'pending': pending_proposals,
        },
        'contracts': {
            'active': active_contracts,
            'completed': completed_contracts,
        },
        'financial': {
            'total_spent': float(total_spent),
        },
        'activity': {
            'unread_messages': unread_messages,
            'avg_rating_given': round(float(avg_rating_given), 2),
        },
        'recent_projects': [
            {
                'id': p.id,
                'title': p.title,
                'status': p.status,
                'budget_range': f"${p.budget_min}-${p.budget_max}",
                'created_at': p.created_at,
                'proposals_count': p.proposals.count(),
            }
            for p in recent_projects
        ],
        'recent_proposals': [
            {
                'id': p.id,
                'project_title': p.project.title,
                'freelancer_name': p.freelancer.get_full_name(),
                'status': p.status,
                'proposed_budget': float(p.proposed_budget),
                'created_at': p.created_at,
            }
            for p in recent_proposals
        ],
    }


def get_freelancer_dashboard_stats(user):
    """Get statistics for freelancer dashboard"""
    
    # Proposals statistics
    total_proposals = Proposal.objects.filter(freelancer=user).count()
    pending_proposals = Proposal.objects.filter(
        freelancer=user,
        status='pending'
    ).count()
    accepted_proposals = Proposal.objects.filter(
        freelancer=user,
        status='accepted'
    ).count()
    
    # Contracts statistics
    active_contracts = Contract.objects.filter(
        freelancer=user,
        status__in=['active', 'in_progress']
    ).count()
    completed_contracts = Contract.objects.filter(
        freelancer=user,
        status='completed'
    ).count()
    
    # Financial statistics
    total_earned = Contract.objects.filter(
        freelancer=user,
        status='completed'
    ).aggregate(total=Sum('agreed_budget'))['total'] or 0
    
    # Available projects
    available_projects = Project.objects.filter(status='open').count()
    
    # Recent activity
    recent_proposals = Proposal.objects.filter(
        freelancer=user
    ).select_related('project').order_by('-created_at')[:5]
    
    recent_contracts = Contract.objects.filter(
        freelancer=user
    ).select_related('project', 'client').order_by('-created_at')[:5]
    
    # Unread messages
    unread_messages = Message.objects.filter(
        recipient=user,
        is_read=False
    ).count()
    
    # Reviews statistics
    reviews = Review.objects.filter(reviewee=user)
    avg_rating = reviews.aggregate(avg=Avg('rating'))['avg'] or 0
    total_reviews = reviews.count()
    
    # Success rate
    if total_proposals > 0:
        success_rate = (accepted_proposals / total_proposals) * 100
    else:
        success_rate = 0
    
    return {
        'user_type': 'freelancer',
        'proposals': {
            'total': total_proposals,
            'pending': pending_proposals,
            'accepted': accepted_proposals,
            'success_rate': round(success_rate, 1),
        },
        'contracts': {
            'active': active_contracts,
            'completed': completed_contracts,
        },
        'financial': {
            'total_earned': float(total_earned),
        },
        'activity': {
            'available_projects': available_projects,
            'unread_messages': unread_messages,
        },
        'reputation': {
            'avg_rating': round(float(avg_rating), 2),
            'total_reviews': total_reviews,
        },
        'recent_proposals': [
            {
                'id': p.id,
                'project_title': p.project.title,
                'status': p.status,
                'proposed_budget': float(p.proposed_budget),
                'created_at': p.created_at,
            }
            for p in recent_proposals
        ],
        'recent_contracts': [
            {
                'id': c.id,
                'project_title': c.project.title,
                'client_name': c.client.get_full_name(),
                'status': c.status,
                'budget': float(c.agreed_budget),
                'created_at': c.created_at,
            }
            for c in recent_contracts
        ],
    }


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_activity_feed(request):
    """Get recent activity feed for dashboard"""
    user = request.user
    activities = []
    
    # Get recent proposals
    if user.user_type == 'client':
        proposals = Proposal.objects.filter(
            project__client=user
        ).select_related('freelancer', 'project').order_by('-created_at')[:10]
        
        for proposal in proposals:
            activities.append({
                'type': 'proposal',
                'action': 'received',
                'title': f'New proposal from {proposal.freelancer.get_full_name()}',
                'description': f'For project: {proposal.project.title}',
                'timestamp': proposal.created_at,
                'link': f'/projects/{proposal.project.id}',
            })
    else:
        proposals = Proposal.objects.filter(
            freelancer=user
        ).select_related('project').order_by('-created_at')[:10]
        
        for proposal in proposals:
            activities.append({
                'type': 'proposal',
                'action': 'submitted',
                'title': f'Proposal {proposal.status}',
                'description': f'For project: {proposal.project.title}',
                'timestamp': proposal.created_at,
                'link': f'/projects/{proposal.project.id}',
            })
    
    # Get recent contracts
    contracts = Contract.objects.filter(
        Q(client=user) | Q(freelancer=user)
    ).select_related('project').order_by('-created_at')[:10]
    
    for contract in contracts:
        activities.append({
            'type': 'contract',
            'action': contract.status,
            'title': f'Contract {contract.status}',
            'description': f'Project: {contract.project.title}',
            'timestamp': contract.created_at,
            'link': f'/contracts/{contract.id}',
        })
    
    # Sort by timestamp
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    
    return Response(activities[:20])
