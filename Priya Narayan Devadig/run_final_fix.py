#!/usr/bin/env python
"""
Final fix script - run this to fix all issues
"""

print("🚨 FINAL FIX SCRIPT")
print("=" * 40)

print("\n🔧 STEP 1: Stop the Django server (Ctrl+C)")
print("\n🔧 STEP 2: Run these commands:")

commands = [
    "python manage.py migrate messaging",
    "python manage.py migrate contracts", 
    "python manage.py migrate",
    "python manage.py runserver"
]

for i, cmd in enumerate(commands, 1):
    print(f"{i}. {cmd}")

print("\n🎯 This should fix:")
print("✅ Create messaging_conversation table")
print("✅ Add conversation field to messages")
print("✅ Update contract model")
print("✅ Fix all API endpoints")

print("\n🧪 After server starts, test:")
print("• Go to Messages page")
print("• Try starting a conversation")
print("• Try accepting a proposal")
print("• Try creating a review")

print("\n" + "=" * 40)
print("🚀 Run the commands above to fix everything!")