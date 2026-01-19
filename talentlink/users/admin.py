

# # # from django.contrib import admin
# # # from .models import User

# # # admin.site.register(User)


# # from django.contrib import admin
# # from django.contrib.auth.admin import UserAdmin
# # from .models import User

# # # Only this one line – nothing else for User
# # admin.site.register(User, UserAdmin)




# # users/admin.py

# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from .models import User
# from users.models import User

# User.objects.filter(email="").update(email=None)


# @admin.register(User)
# class UserAdmin(BaseUserAdmin):
#     # Add 'role' column to the users list view
#     list_display = BaseUserAdmin.list_display + ("role",)

#     # Optional: Allow filtering and searching by role
#     list_filter = BaseUserAdmin.list_filter + ("role",)
#     search_fields = BaseUserAdmin.search_fields + ("role",)

#     # Add 'role' to the edit user form
#     fieldsets = BaseUserAdmin.fieldsets + (
#         ("Additional Information", {"fields": ("role",)}),
#     )

#     # Add 'role' to the "Add User" form
#     add_fieldsets = BaseUserAdmin.add_fieldsets + (
#         ("Additional Information", {"fields": ("role",)}),
#     )


from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from django.db import ProgrammingError, OperationalError, connection

# Only run this if table exists
try:
    if "users_user" in connection.introspection.table_names():
        User.objects.filter(email="").update(email=None)
except (ProgrammingError, OperationalError):
    pass


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Add 'role' column to the users list view
    list_display = BaseUserAdmin.list_display + ("role",)

    # Optional: Allow filtering and searching by role
    list_filter = BaseUserAdmin.list_filter + ("role",)
    search_fields = BaseUserAdmin.search_fields + ("role",)

    # Add 'role' to the edit user form
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Additional Information", {"fields": ("role",)}),
    )

    # Add 'role' to the "Add User" form
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Additional Information", {"fields": ("role",)}),
    )
