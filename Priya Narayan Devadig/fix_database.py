#!/usr/bin/env python
"""
Emergency database fix script
"""

print("🚨 EMERGENCY DATABASE FIX")
print("=" * 40)

print("\n🔧 STEP 1: Stop the server (Ctrl+C)")
print("\n🔧 STEP 2: Run these commands:")

commands = [
    "# Reset migrations",
    "python manage.py migrate messaging zero",
    "python manage.py migrate contracts zero",
    "",
    "# Create fresh migrations", 
    "python manage.py makemigrations messaging",
    "python manage.py makemigrations contracts",
    "",
    "# Apply all migrations",
    "python manage.py migrate",
    "",
    "# Start server",
    "python manage.py runserver"
]

for cmd in commands:
    if cmd.startswith("#"):
        print(f"\n{cmd}")
    elif cmd == "":
        print()
    else:
        print(f"  {cmd}")

print("\n" + "=" * 40)
print("🎯 This will fix all database issues!")
print("⚠️  WARNING: This may delete existing messages and contracts")
print("💡 Run these commands in your terminal")