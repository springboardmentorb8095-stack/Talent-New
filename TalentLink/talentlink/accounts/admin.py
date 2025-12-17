from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Skill, Profile

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role', {'fields': ('role',)}),
    )

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill_name')
    search_fields = ('skill_name',)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'hourly_rate', 'experience')
    search_fields = ('name', 'user__username')
    list_filter = ('hourly_rate', 'experience')
