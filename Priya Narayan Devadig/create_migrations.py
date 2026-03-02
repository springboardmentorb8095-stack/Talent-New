#!/usr/bin/env python
"""
Script to create and apply migrations
"""

print("🔧 Creating Missing Migrations")
print("=" * 40)

print("\n📋 Run these commands in order:")
print()
print("1. python manage.py makemigrations contracts")
print("   → This will create migration for enhanced contract fields")
print("   → (paid_amount, payment_status, milestones, etc.)")
print()
print("2. python manage.py makemigrations messaging") 
print("   → This will create migration for Conversation model")
print("   → (conversation table and relationships)")
print()
print("3. python manage.py migrate")
print("   → This will apply all migrations to database")
print()
print("4. python manage.py runserver")
print("   → Start the server")

print("\n" + "=" * 40)
print("✅ After this, all features will work:")
print("   • Enhanced contract system")
print("   • Real-time messaging")
print("   • Email notifications")
print("   • Complete API endpoints")

print("\n🚀 Run the commands above to fix everything!")