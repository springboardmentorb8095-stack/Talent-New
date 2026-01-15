from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
import socket
import os
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import Profile, Notification, Skill
from .serializers import UserRegistrationSerializer, UserSerializer, ProfileSerializer, ProfileUpdateSerializer, UserUpdateSerializer, NotificationSerializer, SkillSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        from django.contrib.auth import authenticate
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user.profile
        except Profile.DoesNotExist:
            Profile.objects.create(user=self.request.user, name=self.request.user.username)
            return self.request.user.profile

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user.profile
        except Profile.DoesNotExist:
            Profile.objects.create(user=self.request.user, name=self.request.user.username)
            return self.request.user.profile

    def update(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            response = super().update(request, *args, **kwargs)
            return response
        except Exception as e:
            raise

class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)
            return response
        except Exception as e:
            raise

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserByUsernameView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'username'
    
    def get_object(self):
        return generics.get_object_or_404(User, username=self.kwargs['username'])

class PublicProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        user_id = self.kwargs.get('user_id')
        try:
            return Profile.objects.get(user_id=user_id)
        except Profile.DoesNotExist:
            user = generics.get_object_or_404(User, id=user_id)
            return Profile.objects.create(user=user, name=user.username)

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

class NotificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

class NotificationMarkAsReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    def patch(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'message': 'Notification marked as read'}, status=status.HTTP_200_OK)

class UnreadNotificationCountView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        return Response({'unread_count': count}, status=status.HTTP_200_OK)

class SkillListView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

class DebugEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({"error": "Please provide 'email' query param"}, status=status.HTTP_400_BAD_REQUEST)

        report = {
            "config": {
                "EMAIL_BACKEND": getattr(settings, 'EMAIL_BACKEND', 'Not Set'),
                "EMAIL_HOST": getattr(settings, 'EMAIL_HOST', 'Not Set'),
                "EMAIL_PORT": getattr(settings, 'EMAIL_PORT', 'Not Set'),
                "EMAIL_USE_TLS": getattr(settings, 'EMAIL_USE_TLS', 'Not Set'),
                "EMAIL_USE_SSL": getattr(settings, 'EMAIL_USE_SSL', 'Not Set'),
                "EMAIL_HOST_USER": getattr(settings, 'EMAIL_HOST_USER', 'Not Set'),
                "DEFAULT_FROM_EMAIL": getattr(settings, 'DEFAULT_FROM_EMAIL', 'Not Set'),
            },
            "dns": {},
            "connectivity": {},
            "send_result": None
        }

        host = getattr(settings, 'EMAIL_HOST', 'smtp.gmail.com')
        port = int(getattr(settings, 'EMAIL_PORT', 587))

        try:
            addr_info = socket.getaddrinfo(host, port, proto=socket.IPPROTO_TCP)
            ips = [x[4][0] for x in addr_info]
            report["dns"]["resolved_ips"] = ips
            report["dns"]["status"] = "success"
        except Exception as e:
            report["dns"]["status"] = "failed"
            report["dns"]["error"] = str(e)

        email_backend = getattr(settings, 'EMAIL_BACKEND', '')
        if 'SmartGmailBackend' in email_backend:
            report["connectivity"]["status"] = "success"
            report["connectivity"]["message"] = "SmartGmailBackend - NO NETWORK CALLS (Instant Success)"
        elif 'RealGmailBackend' in email_backend or 'WorkingGmailBackend' in email_backend:
            report["connectivity"]["status"] = "success"
            report["connectivity"]["message"] = "Real Gmail backend uses SMTP relay via HTTPS"
        else:
            try:
                ipv4_info = socket.getaddrinfo(host, port, family=socket.AF_INET, proto=socket.IPPROTO_TCP)
                ipv4_host = ipv4_info[0][4][0]
                
                sock = socket.create_connection((ipv4_host, port), timeout=5)
                sock.close()
                report["connectivity"]["status"] = "success"
                report["connectivity"]["message"] = f"Connected to {host} ({ipv4_host}:{port}) via IPv4"
            except Exception as e:
                report["connectivity"]["status"] = "failed"
                report["connectivity"]["error"] = f"IPv4 Connection failed: {str(e)}"
                return Response(report, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            if 'SmartGmailBackend' in email_backend:
                print(f"🧪 DEBUG VIEW: Testing SmartGmailBackend with email to {email}")
                result = send_mail(
                    subject='Test Email from TalentLink Debug',
                    message='This is a test email from DebugEmailView.',
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com'),
                    recipient_list=[email],
                    fail_silently=False,
                )
                report["send_result"] = "success"
                report["send_message"] = f"SmartGmailBackend: Email sent (result: {result})"
                print(f"✅ DEBUG VIEW: SmartGmailBackend returned result: {result}")
            else:
                send_mail(
                    subject='Test Email from TalentLink Debug',
                    message='This is a test email.',
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com'),
                    recipient_list=[email],
                    fail_silently=False,
                )
                report["send_result"] = "success"
        except Exception as e:
            report["send_result"] = "failed"
            report["error"] = str(e)
            print(f"❌ DEBUG VIEW: SmartGmailBackend failed: {str(e)}")
        
        return Response(report)

class SmartGmailDebugView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        try:
            from utils.smart_gmail_backend import SmartGmailBackend
            backend = SmartGmailBackend()
            
            is_production = backend._is_production_environment()
            env_info = backend.get_environment_info()
            
            email_backend = getattr(settings, 'EMAIL_BACKEND', '')
            debug = getattr(settings, 'DEBUG', None)
            
            return Response({
                "smart_gmail_backend": {
                    "is_production": is_production,
                    "environment_info": env_info,
                    "email_backend_setting": email_backend,
                    "debug_setting": debug
                },
                "environment_variables": {
                    "RENDER": os.environ.get('RENDER'),
                    "DATABASE_URL": bool(os.environ.get('DATABASE_URL')),
                    "HOST": os.environ.get('HOST', ''),
                    "EMAIL_BACKEND": os.environ.get('EMAIL_BACKEND')
                },
                "production_indicators": {
                    "render_detected": bool(os.environ.get('RENDER')),
                    "database_url_detected": bool(os.environ.get('DATABASE_URL')),
                    "render_in_host": 'render.com' in os.environ.get('HOST', ''),
                    "debug_false_no_gitignore": (debug is False and not os.path.exists('.gitignore'))
                }
            })
        except Exception as e:
            return Response({
                "error": str(e),
                "traceback": str(__import__('traceback').format_exc())
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangePasswordView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        from django.contrib.auth import authenticate
        
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response({
                'error': 'Both current_password and new_password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_password) < 8:
            return Response({
                'error': 'New password must be at least 8 characters long'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify current password
        user = authenticate(username=request.user.username, password=current_password)
        if not user:
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Change the password
        request.user.set_password(new_password)
        request.user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)