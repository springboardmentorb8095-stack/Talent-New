# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth import authenticate

# from .serializers import RegisterSerializer, LoginSerializer
# from .models import User


# # ================== REGISTER USER ==================
# class RegisterView(APIView):
#     def post(self, request):
#         email = request.data.get("email")

#         # 🔴 Check if user already exists
#         if User.objects.filter(email=email).exists():
#             return Response(
#                 {"error": "User already registered. Please login."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         serializer = RegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 {"message": "Registration successful. Please login."},
#                 status=status.HTTP_201_CREATED
#             )

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # ================== LOGIN USER ==================
# class LoginView(APIView):
#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)

#         if serializer.is_valid():
#             email = serializer.validated_data["email"]
#             password = serializer.validated_data["password"]

#             # Authenticate user
#             user = authenticate(request, email=email, password=password)

#             if user is None:
#                 return Response(
#                     {"error": "Invalid email or password"},
#                     status=status.HTTP_401_UNAUTHORIZED
#                 )

#             refresh = RefreshToken.for_user(user)

#             return Response(
#                 {
#                     "message": "Login successful",
#                     "access": str(refresh.access_token),
#                     "refresh": str(refresh),
#                     "user": {
#                         "id": user.id,
#                         "name": user.name,
#                         "email": user.email,
#                         "role": user.role,
#                     }
#                 },
#                 status=status.HTTP_200_OK
#             )

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # ================== LOGOUT USER ==================
# class LogoutView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             refresh_token = request.data.get("refresh")
#             token = RefreshToken(refresh_token)
#             token.blacklist()

#             return Response(
#                 {"message": "Logout successful"},
#                 status=status.HTTP_200_OK
#             )
#         except Exception:
#             return Response(
#                 {"error": "Invalid token"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .serializers import RegisterSerializer, LoginSerializer
from .models import User


# ================== REGISTER USER ==================
class RegisterView(APIView):
    permission_classes = [AllowAny]   # ✅ ADD THIS

    def post(self, request):
        email = request.data.get("email")

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {"message": "User already registered. Please login."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Registration successful. Please login."},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ================== LOGIN USER ==================
class LoginView(APIView):
    permission_classes = [AllowAny]   # ✅ ADD THIS

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            user = authenticate(request, email=email, password=password)

            if user is None:
                return Response(
                    {"message": "Invalid email or password"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "role": user.role,
                    }
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ================== LOGOUT USER ==================
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Logout successful"},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"message": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST
            )
