#!/usr/bin/env python
"""
Script to fix the conversation migration issue
"""

print("🔧 Fixing Conversation Migration Issue")
print("=" * 50)

print("\n📋 The issue:")
print("- The messaging_conversation table doesn't exist in the database")
print("- This means the Conversation model migration wasn't applied properly")

print("\n🛠️ Solution steps:")
print("1. Stop the Django server (Ctrl+C)")
print("2. Run the following commands in order:")
print()
print("   # Check current migration status")
print("   python manage.py showmigrations messaging")
print()
print("   # Create a fresh migration for the Conversation model")
print("   python manage.py makemigrations messaging --name add_conversation_model")
print()
print("   # Apply the migration")
print("   python manage.py migrate messaging")
print()
print("   # Verify all migrations are applied")
print("   python manage.py migrate")

print("\n🔍 If migrations fail:")
print("Option 1 - Reset messaging migrations:")
print("   python manage.py migrate messaging zero")
print("   python manage.py makemigrations messaging")
print("   python manage.py migrate messaging")

print("\nOption 2 - Force create tables:")
print("   python manage.py migrate --fake-initial")
print("   python manage.py migrate")

print("\n✅ After migration succeeds:")
print("   python manage.py runserver")
print("   # Then test the Messages page")

print("\n" + "=" * 50)
print("Run these commands in your terminal to fix the issue!")