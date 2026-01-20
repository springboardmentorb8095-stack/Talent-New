from rest_framework import serializers
from .models import Project
from proposals.models import Proposal
from reviews.models import Review
from django.db.models import Avg


class ProjectSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(
        source="client.username",
        read_only=True
    )

    bid_count = serializers.SerializerMethodField()
    average_bid = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "budget",
            "currency",
            "duration",
            "required_skills",
            "client_username",
            "created_at",
            "bid_count",
            "average_bid",
            "average_rating",
        ]

    def get_bid_count(self, obj):
        return Proposal.objects.filter(project=obj).count()

    def get_average_bid(self, obj):
        avg = Proposal.objects.filter(project=obj).aggregate(
            Avg("proposed_price")
        )["proposed_price__avg"]
        return round(avg, 2) if avg else None

    def get_average_rating(self, obj):
        avg = Review.objects.filter(
            contract__project=obj
        ).aggregate(Avg("rating"))["rating__avg"]
        return round(avg, 1) if avg else None
