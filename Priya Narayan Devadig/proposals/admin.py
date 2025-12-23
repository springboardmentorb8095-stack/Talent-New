from django.contrib import admin
from .models import Proposal


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ('project', 'freelancer', 'proposed_budget', 'status', 'submitted_at')
    list_filter = ('status', 'submitted_at')
    search_fields = ('project__title', 'freelancer__email', 'freelancer__first_name', 'freelancer__last_name')
    readonly_fields = ('submitted_at',)