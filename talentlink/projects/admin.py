from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'budget', 'duration', 'created_at')
    search_fields = ('title', 'skills_required')
    list_filter = ('duration',)
