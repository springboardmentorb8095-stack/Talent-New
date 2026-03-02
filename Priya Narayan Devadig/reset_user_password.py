#!/usr/bin/env python3
"""
Reset password for existing user
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freelance_marketplace.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def reset_password():
    """Reset password for existing user"""
    
    email = "client@gmail.com"
    new_password = "testpass123"
    
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        print(f"✓ Password reset for {email}")
        print(f"New credentials: {email} / {new_password}")
        return True
    except User.DoesNotExist:
        print(f"✗ User {email} not found")
        return False

if __name__ == "__main__":
    print("Resetting user password...")
    print("=" * 50)
    
    if reset_password():
        print("✓ Password reset successful")
    else:
        print("✗ Password reset failed")