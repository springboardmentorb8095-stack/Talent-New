
# # from django.contrib import admin
# # from django.contrib.auth.admin import UserAdmin
# # from .models import User, Profile

# # class CustomUserAdmin(UserAdmin):
# #     model = User
# #     list_display = ('id', 'name', 'email', 'role', 'is_staff', 'is_superuser')
# #     list_filter = ('role', 'is_staff', 'is_superuser')
# #     search_fields = ('email', 'name')

# #     ordering = ('id',)

# #     fieldsets = (
# #         (None, {'fields': ('email', 'password', 'name', 'role')}),
# #         ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
# #     )

# #     add_fieldsets = (
# #         (None, {
# #             'classes': ('wide',),
# #             'fields': ('email', 'name', 'role', 'password1', 'password2'),
# #         }),
# #     )

# # admin.site.register(User, CustomUserAdmin)
# # admin.site.register(Profile)


# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from django import forms
# from .models import User, Profile


# # =========================
# # PROFILE ADMIN FORM
# # =========================
# class ProfileAdminForm(forms.ModelForm):
#     class Meta:
#         model = Profile
#         fields = "__all__"


# # =========================
# # CUSTOM USER ADMIN
# # =========================
# class CustomUserAdmin(UserAdmin):
#     model = User

#     list_display = ('id', 'name', 'email', 'role', 'is_staff', 'is_superuser')
#     ordering = ('id',)

#     fieldsets = (
#         (None, {'fields': ('email', 'password', 'name', 'role')}),
#         ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
#     )

# admin.site.register(User, CustomUserAdmin)


# # =========================
# # PROFILE ADMIN (FORCED REBUILD)
# # =========================

# @admin.register(Profile)
# class ProfileAdmin(admin.ModelAdmin):
#     fields = (
#         'user',
#         'bio',
#         'hourly_rate',
#         'location',
#         'avatar',
#         'portfolio',
#         'availability',
#         'skills',
#     )

#     filter_horizontal = ('skills',)


from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from .models import User, Profile


# =========================
# PROFILE ADMIN FORM
# =========================
class ProfileAdminForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = "__all__"


# =========================
# CUSTOM USER ADMIN
# =========================
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = ("id", "name", "email", "role", "is_staff", "is_superuser")
    ordering = ("id",)
    search_fields = ("email", "name")

    # ❌ REMOVE username
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("name", "role")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser")}),
    )

    # ✅ VERY IMPORTANT (this fixes the admin add-user crash)
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "name",
                "role",
                "password1",
                "password2",
                "is_staff",
                "is_superuser",
            ),
        }),
    )

    ordering = ("email",)


admin.site.register(User, CustomUserAdmin)


# =========================
# PROFILE ADMIN
# =========================
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    form = ProfileAdminForm

    fields = (
        "user",
        "bio",
        "hourly_rate",
        "location",
        "avatar",
        "portfolio",
        "availability",
        "skills",
    )

    filter_horizontal = ("skills",)






