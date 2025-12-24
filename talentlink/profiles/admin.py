from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'full_name', 'skills', 'hourly_rate', 'location', 'availability')
    list_filter = ('role',)