from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile, Skill, UserSkill


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'user_type', 'is_verified', 'is_active')
    list_filter = ('user_type', 'is_verified', 'is_active', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'is_verified')}),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'hourly_rate', 'availability_status', 'created_at')
    list_filter = ('availability_status', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'location')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)
    search_fields = ('name',)


@admin.register(UserSkill)
class UserSkillAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'proficiency_level')
    list_filter = ('proficiency_level', 'skill__category')
    search_fields = ('user__email', 'skill__name')