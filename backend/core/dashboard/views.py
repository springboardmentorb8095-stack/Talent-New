from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Avg

from projects.models import Project
from proposals.models import Proposal
from contracts.models import Contract
from users.models import User
from reviews.models import Review  # optional, only if reviews exist


# ----------------------------
# Client Dashboard
# ----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def client_dashboard(request):
    user = request.user

    # Stats
    active_projects = Project.objects.filter(client=user, is_active=True).count()
    completed_contracts = Contract.objects.filter(
        proposal__project__client=user,
        status="completed"
    ).count()
    # Unique freelancers hired across all contracts
    freelancers_hired = Contract.objects.filter(
        proposal__project__client=user
    ).values("proposal__freelancer").distinct().count()

    # Recent Contracts (last 5)
    recent_contracts_qs = Contract.objects.filter(
        proposal__project__client=user
    ).order_by("-created_at")[:5]

    recent_contracts = [
        {
            "id": c.id,
            "project_title": c.proposal.project.title,
            "freelancer": c.proposal.freelancer.username,
            "status": c.status
        } for c in recent_contracts_qs
    ]

    return Response({
        "stats": {
            "activeProjects": active_projects,
            "completedContracts": completed_contracts,
            "freelancersHired": freelancers_hired,
        },
        "recent_contracts": recent_contracts
    })


# ----------------------------
# Freelancer Dashboard
# ----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def freelancer_dashboard(request):
    user = request.user

    # Stats
    active_contracts = Contract.objects.filter(
        proposal__freelancer=user,
        status="active"
    ).count()
    completed_contracts = Contract.objects.filter(
        proposal__freelancer=user,
        status="completed"
    ).count()
    # Average rating (optional: default 0 if no reviews)
    avg_rating = Review.objects.filter(freelancer=user).aggregate(
        avg=Avg("rating")
    )["avg"] or 0

    # Recent Reviews (last 5)
    recent_reviews_qs = Review.objects.filter(
        freelancer=user
    ).order_by("-created_at")[:5]

    recent_reviews = [
        {
            "id": r.id,
            "rating": r.rating,
            "comment": r.comment,
            "reviewer": r.reviewer.username if hasattr(r, "reviewer") else "Client"
        } for r in recent_reviews_qs
    ]

    return Response({
        "stats": {
            "activeContracts": active_contracts,
            "completedContracts": completed_contracts,
            "avgRating": round(avg_rating, 1),
        },
        "recent_reviews": recent_reviews
    })
