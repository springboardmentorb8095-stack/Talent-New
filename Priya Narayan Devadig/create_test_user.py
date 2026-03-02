#!/usr/bin/env python3
"""
Create a test user for API testing
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freelance_marketplace.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import Skill

User = get_user_model()

def create_test_users():
    """Create test users if they don't exist"""
    
    # Create test client
    client_email = "client@test.com"
    try:
        if not User.objects.filter(email=client_email).exists():
            client = User.objects.create_user(
                username="testclient",
                email=client_email,
                password="testpass123",
                first_name="Test",
                last_name="Client",
                user_type="client"
            )
            print(f"✓ Created client: {client_email}")
        else:
            client = User.objects.get(email=client_email)
            print(f"✓ Client exists: {client_email}")
    except Exception as e:
        print(f"Client creation error: {e}")
        # Try to get existing user
        try:
            client = User.objects.get(email=client_email)
            print(f"✓ Found existing client: {client_email}")
        except:
            client = None
    
    # Create test freelancer
    freelancer_email = "freelancer@test.com"
    try:
        if not User.objects.filter(email=freelancer_email).exists():
            freelancer = User.objects.create_user(
                username="testfreelancer",
                email=freelancer_email,
                password="testpass123",
                first_name="Test",
                last_name="Freelancer",
                user_type="freelancer"
            )
            print(f"✓ Created freelancer: {freelancer_email}")
        else:
            freelancer = User.objects.get(email=freelancer_email)
            print(f"✓ Freelancer exists: {freelancer_email}")
    except Exception as e:
        print(f"Freelancer creation error: {e}")
        # Try to get existing user
        try:
            freelancer = User.objects.get(email=freelancer_email)
            print(f"✓ Found existing freelancer: {freelancer_email}")
        except:
            freelancer = None
    
    # List all users
    print("\nAll users in database:")
    for user in User.objects.all():
        print(f"  - {user.email} ({user.user_type}) - {user.first_name} {user.last_name}")
    
    return client, freelancer

if __name__ == "__main__":
    print("Creating test users...")
    print("=" * 50)
    
    try:
        client, freelancer = create_test_users()
        print("\n" + "=" * 50)
        print("Test users ready!")
        print(f"Client: client@test.com / testpass123")
        print(f"Freelancer: freelancer@test.com / testpass123")
    except Exception as e:
        print(f"Error: {e}")