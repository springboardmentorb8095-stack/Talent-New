# profiles/admin.py
from django.contrib import admin
from .models import Profile

# profiles/admin.py
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'location', 'hourly_rate', 'portfolio')  # added
    search_fields = ('user__username', 'user__email', 'full_name')
    list_filter = ('hourly_rate', 'location')

