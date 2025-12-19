from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import UserProfile
from .serializers import UserProfileSerializer
from django.contrib.auth.models import User


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # GET → Read logged-in user's profile
    def get(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # PUT / PATCH → Update logged-in user's profile
    def put(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = UserProfileSerializer(
            profile, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE → Delete logged-in user's profile
    def delete(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        profile.delete()
        return Response(
            {"message": "User profile deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
    



class ResetPasswordView(APIView):
    def post(self, request):
        username = request.data.get("username")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not username or not new_password or not confirm_password:
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
            return Response(
                {"error": "Passwords do not match"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(username=username)
            user.set_password(new_password)
            user.save()

            return Response(
                {"message": "Password updated successfully"},
                status=status.HTTP_200_OK
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
