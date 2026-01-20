from rest_framework import generics
from .serializers import RegisterSerializer
from .models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import UserMeSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # Allow anyone to register


class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserMeSerializer(request.user)
        return Response(serializer.data)
    
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from .permissions import IsClient, IsFreelancer

# class ClientOnlyView(APIView):
#     permission_classes = [IsAuthenticated, IsClient]

#     def get(self, request):
#         return Response({
#             "message": "Hello Client 👋",
#             "user": request.user.username
#         })

# class FreelancerOnlyView(APIView):
#     permission_classes = [IsAuthenticated, IsFreelancer]

#     def get(self, request):
#         return Response({
#             "message": "Hello Freelancer 👋",
#             "user": request.user.username
#         })
