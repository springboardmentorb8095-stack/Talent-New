from rest_framework.permissions import BasePermission

class IsContractParty(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return (
            obj.proposal.freelancer == user
            or obj.proposal.project.client == user
        )

class CanCompleteContract(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.proposal.project.client == request.user
