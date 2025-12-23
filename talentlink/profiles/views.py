# from django.shortcuts import render
#  # profiles/views.py
# from rest_framework import generics, permissions
# from .serializers import ProfileSerializer
# from .models import Profile

# class ProfileListCreateView(generics.ListCreateAPIView):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)
# class ProfileRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer
#     permission_classes = [permissions.IsAuthenticated]
# profiles/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import ProfileSerializer
from .models import Profile


class ProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update the profile of the currently authenticated user.
    """
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Get or create profile for current user (safe way)
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


# Optional: If you still want a list view (but no create)
class ProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]