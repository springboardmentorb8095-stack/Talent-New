from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from .models import Profile, EmailOTP
from .serializers import ProfileSerializer

User = get_user_model()


# =================== REGISTER API =================== #
# Creates inactive user + sends OTP to email

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")

        # Validation
        if not email or not username or not password or not role:
            return Response(
                {"error": "email, username, password and role are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if role not in ["CLIENT", "FREELANCER"]:
            return Response(
                {"error": "Invalid role"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create inactive user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            is_active=False
        )

        # Create OTP
        otp_obj = EmailOTP.objects.create(user=user)

        # Send OTP email (console backend for dev)
        send_mail(
            subject="TalentLink Email Verification",
            message=f"Your OTP is {otp_obj.otp}",
            from_email=None,
            recipient_list=[email],
        )

        return Response(
            {"message": "OTP sent to email"},
            status=status.HTTP_201_CREATED
        )

# =================== FORGOT PASSWORD =================== #

class ForgotPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"error": "Email not registered"}, status=404)

        token = default_token_generator.make_token(user)

        reset_link = f"http://localhost:3000/reset-password/{token}"

        send_mail(
            "Password Reset",
            f"Reset your password: {reset_link}",
            None,
            [email]
        )

        return Response({"message": "Password reset email sent"})


# =================== VERIFY OTP API =================== #
# Activates user after OTP verification

class VerifyOTPAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response(
                {"error": "email and otp are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, email=email)
        otp_obj = get_object_or_404(
            EmailOTP,
            user=user,
            otp=otp,
            is_verified=False
        )

        if otp_obj.is_expired():
            return Response(
                {"error": "OTP expired"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify OTP
        otp_obj.is_verified = True
        otp_obj.save()

        # Activate user
        user.is_active = True
        user.save()

        # Create profile
        Profile.objects.get_or_create(user=user)

        return Response(
            {"message": "Account verified successfully"},
            status=status.HTTP_200_OK
        )


# =================== PROFILE API =================== #

class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # READ profile
    def get(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # UPDATE profile
    def put(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

