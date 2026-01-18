from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.db import transaction
from .models import (
    User,
    Profile,
    Skill,
    Portfolio,
    Project,
    Proposal,
    Contract,
    Message,
    Review,
)

# ================= USER ================= #

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Role Information", {"fields": ("role",)}),
    )

    list_display = ("username", "email", "role", "is_active", "is_staff")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("username", "email")


# ================= PROFILE ================= #

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "location", "availability")
    list_filter = ("availability",)
    search_fields = ("user__username", "title", "location")


# ================= SKILL ================= #

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    search_fields = ("name",)
    ordering = ("name",)


# ================= PORTFOLIO ================= #

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ("title", "profile", "created_at")
    search_fields = ("title", "profile__user__username")
    date_hierarchy = "created_at"


# ================= PROJECT ================= #

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "client",
        "status",
        "duration",
        "budget_min",
        "budget_max",
        "created_at",
    )

    list_filter = (
        "status",
        "duration",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "client__username",
    )

    date_hierarchy = "created_at"

    # Enables delete/edit directly from admin list
    actions = ["mark_cancelled"]

    @admin.action(description="Mark selected projects as CANCELLED")
    def mark_cancelled(self, request, queryset):
        queryset.update(status="CANCELLED")


# ================= PROPOSAL ================= #

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = (
        "project",
        "freelancer",
        "bid_amount",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "project__title",
        "freelancer__username",
    )

    date_hierarchy = "created_at"

    actions = ["accept_proposals", "reject_proposals"]

    @admin.action(description="Accept selected proposals")
    def accept_proposals(self, request, queryset):
        queryset.update(status="ACCEPTED")

    @admin.action(description="Reject selected proposals")
    def reject_proposals(self, request, queryset):
        queryset.update(status="REJECTED")


# ================= CONTRACT ================= #

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ("project", "client", "freelancer", "status")
    list_filter = ("status",)
    search_fields = ("project__title", "client__username", "freelancer__username")


# ================= MESSAGE ================= #

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("sender", "receiver", "sent_at", "is_read")
    list_filter = ("is_read", "sent_at")
    search_fields = ("sender__username", "receiver__username")
    date_hierarchy = "sent_at"


# ================= REVIEW ================= #

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("reviewer", "reviewee", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("reviewer__username", "reviewee__username")
    date_hierarchy = "created_at"
