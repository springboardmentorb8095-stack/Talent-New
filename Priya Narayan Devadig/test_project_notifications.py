#!/usr/bin/env python3
"""
Test project posting notifications
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freelance_marketplace.settings')
django.setup()

from django.contrib.auth import get_user_model
from projects.models import Project
from accounts.models import Skill, UserSkill, Notification
from accounts.notifications import notify_project_posted

User = get_user_model()

def test_project_notifications():
    """Test that freelancers get notified when a new project is posted"""
    
    print("🚀 Testing Project Posting Notifications")
    print("=" * 50)
    
    # Get test users
    try:
        client = User.objects.get(email="client@gmail.com")
        freelancer = User.objects.get(email="freelancer@test.com")
        print(f"✓ Using test users: {client.email} and {freelancer.email}")
    except User.DoesNotExist:
        print("❌ Test users not found. Please run create_test_user.py first")
        return
    
    # Create a test project
    print("\n1. Creating a test project...")
    project = Project.objects.create(
        title="Test Project for Notifications",
        description="This is a test project to verify notification system works",
        client=client,
        budget_min=500,
        budget_max=1500,
        duration_weeks=4,
        estimated_duration=30,
        status='open'
    )
    print(f"✓ Created project: {project.title}")
    
    # Count notifications before
    notifications_before = Notification.objects.filter(recipient=freelancer).count()
    print(f"Freelancer notifications before: {notifications_before}")
    
    # Test the notification function
    print("\n2. Testing project notification...")
    notify_project_posted(project)
    
    # Count notifications after
    notifications_after = Notification.objects.filter(recipient=freelancer).count()
    print(f"Freelancer notifications after: {notifications_after}")
    
    if notifications_after > notifications_before:
        print("✅ Freelancer received notification about new project!")
        
        # Show the latest notification
        latest_notification = Notification.objects.filter(recipient=freelancer).first()
        print(f"  📩 Title: {latest_notification.title}")
        print(f"  📝 Message: {latest_notification.message}")
        print(f"  🔗 Action URL: {latest_notification.action_url}")
    else:
        print("❌ No notification was created for freelancer")
    
    # Test with skills matching
    print("\n3. Testing skill-based notifications...")
    
    # Create a skill and assign it to freelancer
    skill, created = Skill.objects.get_or_create(
        name="Python",
        defaults={'category': 'programming', 'description': 'Python programming language'}
    )
    
    # Add skill to freelancer if not already added
    user_skill, created = UserSkill.objects.get_or_create(
        user=freelancer,
        skill=skill,
        defaults={'proficiency_level': 'expert'}
    )
    
    # Create project with required skills
    skilled_project = Project.objects.create(
        title="Python Development Project",
        description="Need a Python expert for this project",
        client=client,
        budget_min=1000,
        budget_max=3000,
        duration_weeks=6,
        estimated_duration=45,
        status='open'
    )
    skilled_project.required_skills.add(skill)
    
    print(f"✓ Created project with Python skill requirement: {skilled_project.title}")
    
    # Count notifications before skill-based notification
    notifications_before_skill = Notification.objects.filter(recipient=freelancer).count()
    
    # Test skill-based notification
    notify_project_posted(skilled_project)
    
    # Count notifications after
    notifications_after_skill = Notification.objects.filter(recipient=freelancer).count()
    
    if notifications_after_skill > notifications_before_skill:
        print("✅ Skill-based notification sent successfully!")
        
        # Show the latest notification
        latest_notification = Notification.objects.filter(recipient=freelancer).first()
        print(f"  📩 Title: {latest_notification.title}")
        print(f"  📝 Message: {latest_notification.message}")
    else:
        print("❌ Skill-based notification failed")
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Summary:")
    total_notifications = Notification.objects.filter(recipient=freelancer).count()
    print(f"  - Total freelancer notifications: {total_notifications}")
    print(f"  - Projects created: 2")
    print(f"  - Notifications should have increased by 2")
    
    if total_notifications >= notifications_before + 2:
        print("✅ Project notification system is working!")
    else:
        print("❌ Some notifications may have failed")

if __name__ == "__main__":
    test_project_notifications()