#!/usr/bin/env python
"""Test database connection"""
import os
import sys
import django
from django.conf import settings

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freelance_marketplace.settings')
django.setup()

from django.db import connection

def test_connection():
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            if result:
                print("✅ Database connection successful!")
                print(f"Connected to: {settings.DATABASES['default']['NAME']}")
                return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()