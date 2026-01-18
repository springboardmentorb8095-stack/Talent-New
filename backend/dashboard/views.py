from django.db.models import Sum, Avg
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from contracts.models import Contract
from proposals.models import Proposal
from reviews.models import Review


# ===============================
# CLIENT DASHBOARD
# ===============================
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from projects.models import Project
from contracts.models import Contract
from proposals.models import Proposal


class ClientDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "client":
            raise PermissionDenied("Only clients can access this dashboard")

        # ---------------- PROJECTS ----------------
        client_projects = Project.objects.filter(client=user)

        # ---------------- CONTRACTS ----------------
        active_projects = Contract.objects.filter(
            client=user,
            is_active=True
        ).count()

        completed_projects = Contract.objects.filter(
            client=user,
            is_active=False
        ).count()

        # ---------------- PAYMENTS ----------------
        total_spent = (
            Contract.objects.filter(
                client=user,
                is_active=False
            ).aggregate(total=Sum("bid_amount"))["total"]
            or 0
        )

        # ---------------- PROPOSALS ----------------
        pending_proposals = Proposal.objects.filter(
            project__client=user,
            status="pending"
        ).count()

        return Response({
            "total_projects": client_projects.count(),   # 🔥 NEW (optional)
            "active_projects": active_projects,
            "completed_projects": completed_projects,
            "total_spent": float(total_spent),
            "pending_proposals": pending_proposals,
        })



# ===============================
# FREELANCER DASHBOARD
# ===============================
class FreelancerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "freelancer":
            raise PermissionDenied("Only freelancers can access this dashboard")

        active_contracts = Contract.objects.filter(
            freelancer=user,
            is_active=True
        ).count()

        completed_contracts = Contract.objects.filter(
            freelancer=user,
            is_active=False
        ).count()

        total_earnings = (
            Contract.objects.filter(
                freelancer=user,
                is_active=False
            )
            .aggregate(total=Sum("bid_amount"))["total"]
            or 0
        )

        proposals = Proposal.objects.filter(freelancer=user)

        avg_rating = (
            Review.objects.filter(freelancer=user)
            .aggregate(avg=Avg("rating"))["avg"]
            or 0
        )

        return Response({
            "active_contracts": active_contracts,
            "completed_contracts": completed_contracts,
            "total_earnings": float(total_earnings),
            "average_rating": round(avg_rating, 1),
            "total_proposals": proposals.count(),
            "pending_proposals": proposals.filter(status="pending").count(),
            "accepted_proposals": proposals.filter(status="accepted").count(),
            "rejected_proposals": proposals.filter(status="rejected").count(),
        })
