from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'status', 'budget_min', 'budget_max', 'deadline', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'client__email', 'client__first_name', 'client__last_name')
    filter_horizontal = ('required_skills',)