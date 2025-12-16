from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from .serializers import ProfileSerializer

# Create / Update Profile
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile saved", "profile": serializer.data})
        return Response(serializer.errors, status=400)


# View Profile Details
class ProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = ProfileSerializer(profile)
            return Response({"profile": serializer.data})
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)
