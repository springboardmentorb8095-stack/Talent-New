# projects/admin.py
from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'budget', 'duration', 'created_at')
    list_filter = ('created_at', 'budget')
    search_fields = ('title', 'description', 'client__username')
    readonly_fields = ('created_at',)
