from rest_framework.permissions import BasePermission


class IsClientReviewer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "client"
