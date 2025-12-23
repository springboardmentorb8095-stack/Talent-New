import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
class TestAuthenticationAPI:
    """Test cases for authentication endpoints"""
    
    def setup_method(self):
        """Set up test client and test data"""
        self.client = APIClient()
        self.register_url = '/api/accounts/register/'
        self.login_url = '/api/accounts/login/'
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        response = self.client.post(self.register_url, self.user_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert User.objects.filter(username='testuser').exists()
    
    def test_registration_password_mismatch(self):
        """Test registration with mismatched passwords"""
        data = self.user_data.copy()
        data['password2'] = 'differentpass'
        response = self.client.post(self.register_url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_registration_duplicate_username(self):
        """Test registration with existing username"""
        User.objects.create_user(
            username='testuser',
            email='existing@example.com',
            password='testpass123'
        )
        response = self.client.post(self.register_url, self.user_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_user_login(self):
        """Test user login endpoint"""
        # Create user first
        User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Attempt login
        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, login_data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            'username': 'nonexistent',
            'password': 'wrongpass'
        }
        response = self.client.post(self.login_url, login_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestProfileAPI:
    """Test cases for profile endpoints"""
    
    def setup_method(self):
        """Set up test client and test user"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.profile_url = '/api/accounts/profile/'
    
    def test_get_profile_authenticated(self):
        """Test retrieving profile when authenticated"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.profile_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == 'testuser'
    
    def test_get_profile_unauthenticated(self):
        """Test retrieving profile when not authenticated"""
        response = self.client.get(self.profile_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_update_profile(self):
        """Test updating profile"""
        self.client.force_authenticate(user=self.user)
        update_data = {
            'bio': 'Updated bio',
            'skills': 'Python, Django',
            'hourly_rate': 75.00
        }
        response = self.client.patch(self.profile_url, update_data)
        assert response.status_code == status.HTTP_200_OK
        
        self.user.profile.refresh_from_db()
        assert self.user.profile.bio == 'Updated bio'
        assert self.user.profile.skills == 'Python, Django'
