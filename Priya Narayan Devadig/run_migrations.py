#!/usr/bin/env python
"""
Script to run migrations in the correct order
"""

import os
import sys

print("🔧 Running Migrations for Complete System")
print("=" * 50)

commands = [
    "python manage.py migrate messaging",
    "python manage.py migrate contracts", 
    "python manage.py migrate",
    "python manage.py runserver"
]

print("\n📋 Commands to run:")
for i, cmd in enumerate(commands, 1):
    print(f"{i}. {cmd}")

print("\n🚀 Run these commands one by one:")
print("If any migration fails, try:")
print("  python manage.py migrate --fake-initial")
print("  python manage.py migrate")

print("\n" + "=" * 50)
print("After migrations complete, the system will be ready!")