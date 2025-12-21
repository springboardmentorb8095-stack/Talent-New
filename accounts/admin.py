from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import Project, Proposal, Contract, Message, Review, Skill, Profile


admin.site.register(Project)
admin.site.register(Proposal)
admin.site.register(Contract)
admin.site.register(Message)
admin.site.register(Review)
admin.site.register(Skill)


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    # This creates a separate "Profiles" section in Admin
    list_display = ('user', 'role', 'hourly_rate', 'availability')
    list_filter = ('role', 'availability')
    search_fields = ('user__username', 'skills')


class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline,)


# Safe unregister
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

admin.site.register(User, CustomUserAdmin)
