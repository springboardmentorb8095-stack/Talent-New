#!/usr/bin/env python3
"""
Test the comprehensive notification system
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freelance_marketplace.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import Notification, NotificationPreference
from accounts.notifications import (
    create_notification, notify_message_received, notify_proposal_received,
    notify_contract_completed, notify_review_received, notify_review_reminder
)
from projects.models import Project
from contracts.models import Contract
from reviews.models import Review
from messaging.models import Message, Conversation

User = get_user_model()

def test_notification_system():
    """Test the notification system functionality"""
    
    print("🔔 Testing Notification System")
    print("=" * 50)
    
    # Get test users
    try:
        client = User.objects.get(email="client@gmail.com")
        freelancer = User.objects.get(email="freelancer@test.com")
        print(f"✓ Using test users: {client.email} and {freelancer.email}")
    except User.DoesNotExist:
        print("❌ Test users not found. Please run create_test_user.py first")
        return
    
    # Test 1: Create in-app notification
    print("\n1. Testing in-app notifications...")
    notification = create_notification(
        recipient=client,
        notification_type='system',
        title='Test Notification',
        message='This is a test notification for the system.',
        action_url='/test'
    )
    print(f"✓ Created notification: {notification.title}")
    
    # Test 2: Test notification preferences
    print("\n2. Testing notification preferences...")
    preferences, created = NotificationPreference.objects.get_or_create(user=client)
    if created:
        print("✓ Created default notification preferences")
    else:
        print("✓ Using existing notification preferences")
    
    print(f"  - Email notifications: {preferences.email_system}")
    print(f"  - In-app notifications: {preferences.inapp_system}")
    
    # Test 3: Test message notification
    print("\n3. Testing message notifications...")
    try:
        # Create a conversation and message
        conversation = Conversation.objects.create()
        conversation.participants.add(client, freelancer)
        
        message = Message.objects.create(
            conversation=conversation,
            sender=freelancer,
            recipient=client,
            content="Hello! This is a test message for notifications."
        )
        
        notify_message_received(client, message)
        print("✓ Message notification sent")
    except Exception as e:
        print(f"❌ Message notification failed: {e}")
    
    # Test 4: Test contract completion notification
    print("\n4. Testing contract completion notifications...")
    try:
        # Find or create a test project and contract
        project = Project.objects.filter(client=client).first()
        if not project:
            project = Project.objects.create(
                title="Test Project for Notifications",
                client=client,
                description='Test project for notification system',
                budget_min=500,
                budget_max=1500,
                duration_weeks=4,
                status='active'
            )
        
        contract = Contract.objects.filter(project=project).first()
        if not contract:
            contract = Contract.objects.create(
                project=project,
                client=client,
                freelancer=freelancer,
                agreed_budget=1000,
                status='completed',
                terms_and_conditions='Test contract terms'
            )
        
        notify_contract_completed(client, freelancer, contract)
        print("✓ Contract completion notifications sent")
        
        # Test review reminder
        notify_review_reminder(client, contract)
        notify_review_reminder(freelancer, contract)
        print("✓ Review reminder notifications sent")
        
    except Exception as e:
        print(f"❌ Contract notification failed: {e}")
    
    # Test 5: Check notification counts
    print("\n5. Checking notification counts...")
    client_notifications = Notification.objects.filter(recipient=client)
    freelancer_notifications = Notification.objects.filter(recipient=freelancer)
    
    print(f"✓ Client notifications: {client_notifications.count()}")
    print(f"✓ Freelancer notifications: {freelancer_notifications.count()}")
    
    # Show recent notifications
    print("\n6. Recent notifications:")
    recent_notifications = Notification.objects.all().order_by('-created_at')[:5]
    for notif in recent_notifications:
        status = "📩" if not notif.is_read else "📧"
        print(f"  {status} {notif.recipient.get_full_name()}: {notif.title}")
    
    # Test 7: Mark notifications as read
    print("\n7. Testing mark as read...")
    unread_count_before = client_notifications.filter(is_read=False).count()
    
    # Mark first notification as read
    if client_notifications.exists():
        first_notification = client_notifications.first()
        first_notification.mark_as_read()
        print(f"✓ Marked notification as read: {first_notification.title}")
    
    unread_count_after = client_notifications.filter(is_read=False).count()
    print(f"  Unread count: {unread_count_before} → {unread_count_after}")
    
    print("\n" + "=" * 50)
    print("✅ Notification system test completed!")
    
    # Summary
    print(f"\n📊 Summary:")
    print(f"  - Total notifications: {Notification.objects.count()}")
    print(f"  - Unread notifications: {Notification.objects.filter(is_read=False).count()}")
    print(f"  - Users with preferences: {NotificationPreference.objects.count()}")


if __name__ == "__main__":
    test_notification_system()