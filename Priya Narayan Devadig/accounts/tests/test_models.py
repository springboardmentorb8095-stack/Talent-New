import pytest
from django.contrib.auth import get_user_model
from accounts.models import Profile

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    """Test cases for User model"""
    
    def test_create_user(self):
        """Test creating a regular user"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        assert user.username == 'testuser'
        assert user.email == 'test@example.com'
        assert user.check_password('testpass123')
        assert user.is_active
        assert not user.is_staff
        assert not user.is_superuser
    
    def test_create_superuser(self):
        """Test creating a superuser"""
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        assert admin.is_staff
        assert admin.is_superuser
        assert admin.is_active


@pytest.mark.django_db
class TestProfileModel:
    """Test cases for Profile model"""
    
    def test_profile_created_on_user_creation(self):
        """Test that profile is automatically created when user is created"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        assert hasattr(user, 'profile')
        assert isinstance(user.profile, Profile)
    
    def test_profile_str_method(self):
        """Test profile string representation"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        assert str(user.profile) == 'testuser - Profile'
    
    def test_profile_user_type_choices(self):
        """Test profile user type field"""
        user = User.objects.create_user(
            username='freelancer',
            email='freelancer@example.com',
            password='testpass123'
        )
        profile = user.profile
        profile.user_type = 'freelancer'
        profile.save()
        assert profile.user_type == 'freelancer'
        
        profile.user_type = 'client'
        profile.save()
        assert profile.user_type == 'client'
    
    def test_profile_optional_fields(self):
        """Test profile optional fields"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        profile = user.profile
        profile.bio = 'Test bio'
        profile.skills = 'Python, Django, React'
        profile.hourly_rate = 50.00
        profile.location = 'New York'
        profile.save()
        
        assert profile.bio == 'Test bio'
        assert profile.skills == 'Python, Django, React'
        assert profile.hourly_rate == 50.00
        assert profile.location == 'New York'
