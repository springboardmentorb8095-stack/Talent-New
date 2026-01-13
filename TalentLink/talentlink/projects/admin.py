from django.contrib import admin
from .models import Project, Proposal

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'client', 'budget', 'status', 'created_at')
    list_filter = ('status', 'budget', 'duration', 'skills_required')
    search_fields = ('title', 'client__username')
    filter_horizontal = ('skills_required',)

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'freelancer', 'bid_amount', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('project__title', 'freelancer__username')
