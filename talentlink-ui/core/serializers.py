from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Profile,
    Skill,
    Portfolio,
    Project,
    Proposal,
    Contract,
    Message,
    Review,
    Notification,
)

User = get_user_model()

# =================== USER =================== #

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]


# =================== SKILL =================== #

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]


# =================== PORTFOLIO =================== #

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ["id", "title", "description", "link", "created_at"]


# =================== PROFILE =================== #

from django.db.models import Avg

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    # READ
    skills = SkillSerializer(many=True, read_only=True)
    portfolio_items = PortfolioSerializer(many=True, read_only=True)

    # RATINGS
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    # WRITE
    skill_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        many=True,
        write_only=True,
        required=False
    )

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "title",
            "bio",
            "location",
            "hourly_rate",
            "availability",
            "company_name",
            "company_website",
            "skills",
            "skill_ids",
            "portfolio_items",
            "profile_completed",
            "average_rating",
            "reviews_count",
        ]

    def get_average_rating(self, obj):
        avg = obj.user.received_reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(avg, 1) if avg else 0.0

    def get_reviews_count(self, obj):
        return obj.user.received_reviews.count()

    def update(self, instance, validated_data):
        skill_ids = validated_data.pop("skill_ids", None)
        instance = super().update(instance, validated_data)

        if skill_ids is not None:
            instance.skills.set(skill_ids)

        instance.profile_completed = True
        instance.save()
        return instance


# =================== PROJECT =================== #

class ProjectSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    required_skills = SkillSerializer(many=True, read_only=True)

    proposals_count = serializers.IntegerField(
        source="proposals.count",
        read_only=True
    )

    required_skill_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        many=True,
        write_only=True,
        required=False
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "client",
            "title",
            "description",
            "required_skills",
            "required_skill_ids",
            "budget_min",
            "budget_max",
            "duration",
            "status",
            "created_at",
            "proposals_count",
        ]
        read_only_fields = ["client", "status", "created_at"]

    # ✅ FIXED: client is NOT set here anymore
    def create(self, validated_data):
        skill_ids = validated_data.pop("required_skill_ids", [])
        project = super().create(validated_data)
        project.required_skills.set(skill_ids)
        return project

    def update(self, instance, validated_data):
        skill_ids = validated_data.pop("required_skill_ids", None)
        instance = super().update(instance, validated_data)

        if skill_ids is not None:
            instance.required_skills.set(skill_ids)

        return instance


# =================== PROPOSAL =================== #

class ProposalSerializer(serializers.ModelSerializer):
    freelancer = UserSerializer(read_only=True)
    project_title = serializers.CharField(
        source="project.title",
        read_only=True
    )

    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all()
    )

    class Meta:
        model = Proposal
        fields = [
            "id",
            "project",
            "project_title",
            "freelancer",
            "cover_letter",
            "bid_amount",
            "status",
            "created_at",
        ]
        read_only_fields = ["freelancer", "status", "created_at"]

    def create(self, validated_data):
        request = self.context["request"]

        if request.user.role != "FREELANCER":
            raise serializers.ValidationError(
                "Only freelancers can submit proposals"
            )

        validated_data["freelancer"] = request.user
        return super().create(validated_data)


# =================== CONTRACT =================== #

class ContractSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    client = UserSerializer(read_only=True)
    freelancer = UserSerializer(read_only=True)

    class Meta:
        model = Contract
        fields = [
            "id",
            "project",
            "client",
            "freelancer",
            "proposal",
            "terms",
            "start_date",
            "end_date",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "project",
            "client",
            "freelancer",
            "proposal",
            "status",
            "created_at",
        ]


# =================== MESSAGE =================== #

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "sender",
            "receiver",
            "contract",
            "content",
            "sent_at",
            "is_read",
        ]
        read_only_fields = ["sender", "sent_at", "is_read"]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["sender"] = request.user
        return super().create(validated_data)


# =================== REVIEW =================== #

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    reviewee = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "reviewer",
            "reviewee",
            "contract",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["reviewer", "reviewee", "created_at"]

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5"
            )
        return value


# =================== NOTIFICATION =================== #

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "title",
            "message",
            "is_read",
            "created_at",
        ]
