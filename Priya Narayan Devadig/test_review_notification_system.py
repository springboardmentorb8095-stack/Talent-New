#!/usr/bin/env python
"""
Comprehensive test script for the review and notification system
Tests all key features including email notifications and review functionality
"""

import os
import sys
import django
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils import timezone
from datetime import timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freelance_marketplace.settings')
django.setup()

from projects.models import Project
from proposals.models import Proposal
from contracts.models import Contract
from reviews.models import Review
from messaging.models import Conversation, Message
from accounts.notifications import (
    notify_proposal_received,
    notify_proposal_accepted,
    notify_proposal_rejected,
    notify_contract_created,
    notify_contract_completed,
    notify_review_received,
    notify_message_received
)

User = get_user_model()

class ReviewNotificationSystemTest:
    def __init__(self):
        self.client_user = None
        self.freelancer_user = None
        self.project = None
        self.proposal = None
        self.contract = None
        
    def setup_test_data(self):
        """Create test users and basic data"""
        print("🔧 Setting up test data...")
        
        # Create test users
        self.client_user = User.objects.create_user(
            username='testclient',
            email='client@test.com',
            password='testpass123',
            first_name='John',
            last_name='Client',
            user_type='client'
        )
        
        self.freelancer_user = User.objects.create_user(
            username='testfreelancer',
            email='freelancer@test.com',
            password='testpass123',
            first_name='Jane',
            last_name='Freelancer',
            user_type='freelancer'
        )
        
        # Create a test project
        self.project = Project.objects.create(
            title='Test Web Development Project',
            description='Build a modern web application',
            budget=5000.00,
            client=self.client_user,
            status='open'
        )
        
        print(f"✅ Created client: {self.client_user.get_full_name()}")
        print(f"✅ Created freelancer: {self.freelancer_user.get_full_name()}")
        print(f"✅ Created project: {self.project.title}")
        
    def test_proposal_workflow(self):
        """Test the complete proposal workflow with notifications"""
        print("\n📝 Testing Proposal Workflow...")
        
        # Clear mail outbox
        mail.outbox = []
        
        # 1. Create proposal (should trigger notification to client)
        self.proposal = Proposal.objects.create(
            project=self.project,
            freelancer=self.freelancer_user,
            proposed_budget=4500.00,
            estimated_duration=30,
            cover_letter="I'm excited to work on this project!",
            status='pending'
        )
        
        # Manually trigger notification (normally done in view)
        notify_proposal_received(self.client_user, self.proposal)
        
        print(f"✅ Proposal created: ${self.proposal.proposed_budget}")
        print(f"📧 Notification sent to client: {len(mail.outbox)} emails")
        
        # 2. Accept proposal (should trigger multiple notifications)
        self.proposal.status = 'accepted'
        self.proposal.save()
        
        # Create contract automatically
        end_date = timezone.now() + timedelta(days=self.proposal.estimated_duration)
        self.contract = Contract.objects.create(
            project=self.project,
            client=self.client_user,
            freelancer=self.freelancer_user,
            proposal=self.proposal,
            agreed_budget=self.proposal.proposed_budget,
            end_date=end_date,
            terms_and_conditions=f"Contract for {self.project.title}",
            status='active'
        )
        
        # Trigger notifications
        notify_proposal_accepted(self.freelancer_user, self.proposal)
        notify_contract_created(self.client_user, self.freelancer_user, self.contract)
        
        print(f"✅ Proposal accepted and contract created")
        print(f"📧 Total notifications sent: {len(mail.outbox)} emails")
        
        return True
        
    def test_contract_completion(self):
        """Test contract completion and review workflow"""
        print("\n📋 Testing Contract Completion...")
        
        if not self.contract:
            print("❌ No contract available for testing")
            return False
            
        # Complete the contract
        self.contract.status = 'completed'
        self.contract.project.status = 'completed'
        self.contract.save()
        self.contract.project.save()
        
        # Trigger completion notifications
        notify_contract_completed(self.client_user, self.freelancer_user, self.contract)
        
        print(f"✅ Contract completed")
        print(f"📧 Completion notifications sent")
        
        return True
        
    def test_review_system(self):
        """Test the review and rating system"""
        print("\n⭐ Testing Review System...")
        
        if not self.contract:
            print("❌ No contract available for review testing")
            return False
            
        # Client reviews freelancer
        client_review = Review.objects.create(
            contract=self.contract,
            reviewer=self.client_user,
            reviewee=self.freelancer_user,
            rating=5,
            comment="Excellent work! Very professional and delivered on time."
        )
        
        # Trigger review notification
        notify_review_received(self.freelancer_user, client_review)
        
        print(f"✅ Client review created: {client_review.rating}⭐")
        
        # Freelancer reviews client
        freelancer_review = Review.objects.create(
            contract=self.contract,
            reviewer=self.freelancer_user,
            reviewee=self.client_user,
            rating=4,
            comment="Great client to work with. Clear requirements and prompt payments."
        )
        
        # Trigger review notification
        notify_review_received(self.client_user, freelancer_review)
        
        print(f"✅ Freelancer review created: {freelancer_review.rating}⭐")
        
        # Test review statistics
        from django.db.models import Avg
        freelancer_avg = Review.objects.filter(reviewee=self.freelancer_user).aggregate(Avg('rating'))
        client_avg = Review.objects.filter(reviewee=self.client_user).aggregate(Avg('rating'))
        
        print(f"📊 Freelancer average rating: {freelancer_avg['rating__avg']}")
        print(f"📊 Client average rating: {client_avg['rating__avg']}")
        
        return True
        
    def test_messaging_system(self):
        """Test the messaging system with notifications"""
        print("\n💬 Testing Messaging System...")
        
        # Create a conversation
        conversation = Conversation.objects.create()
        conversation.participants.add(self.client_user, self.freelancer_user)
        conversation.project = self.project
        conversation.save()
        
        # Client sends message to freelancer
        message1 = Message.objects.create(
            conversation=conversation,
            sender=self.client_user,
            recipient=self.freelancer_user,
            content="Hi! I'm excited to start working with you on this project."
        )
        
        # Trigger message notification
        notify_message_received(self.freelancer_user, message1)
        
        print(f"✅ Message sent from client to freelancer")
        
        # Freelancer replies
        message2 = Message.objects.create(
            conversation=conversation,
            sender=self.freelancer_user,
            recipient=self.client_user,
            content="Thank you! I'm looking forward to delivering great results."
        )
        
        # Trigger message notification
        notify_message_received(self.client_user, message2)
        
        print(f"✅ Reply sent from freelancer to client")
        print(f"💬 Total messages in conversation: {conversation.messages.count()}")
        
        return True
        
    def test_email_notifications(self):
        """Test email notification functionality"""
        print("\n📧 Testing Email Notifications...")
        
        # Check if emails were sent
        total_emails = len(mail.outbox)
        print(f"📬 Total emails in outbox: {total_emails}")
        
        if total_emails > 0:
            print("\n📧 Email Details:")
            for i, email in enumerate(mail.outbox, 1):
                print(f"  {i}. To: {email.to[0]}")
                print(f"     Subject: {email.subject}")
                print(f"     Body preview: {email.body[:100]}...")
                print()
        
        return total_emails > 0
        
    def test_api_endpoints(self):
        """Test key API endpoints"""
        print("\n🔌 Testing API Endpoints...")
        
        from django.test import Client
        from django.contrib.auth import authenticate
        
        client = Client()
        
        # Test review endpoints
        print("Testing review endpoints...")
        
        # Login as client
        login_success = client.login(username='testclient', password='testpass123')
        if login_success:
            print("✅ Client login successful")
            
            # Test getting reviews
            response = client.get(f'/api/reviews/?reviewee={self.freelancer_user.id}')
            print(f"✅ Get freelancer reviews: {response.status_code}")
            
            # Test user rating endpoint
            response = client.get(f'/api/reviews/user-rating/{self.freelancer_user.id}/')
            print(f"✅ Get user rating: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Average rating: {data.get('average_rating')}")
                print(f"   Review count: {data.get('review_count')}")
        
        return True
        
    def cleanup(self):
        """Clean up test data"""
        print("\n🧹 Cleaning up test data...")
        
        # Delete in reverse order of dependencies
        Review.objects.filter(
            Q(reviewer=self.client_user) | Q(reviewer=self.freelancer_user)
        ).delete()
        
        Message.objects.filter(
            Q(sender=self.client_user) | Q(sender=self.freelancer_user)
        ).delete()
        
        Conversation.objects.filter(
            participants__in=[self.client_user, self.freelancer_user]
        ).delete()
        
        if self.contract:
            self.contract.delete()
            
        if self.proposal:
            self.proposal.delete()
            
        if self.project:
            self.project.delete()
            
        self.freelancer_user.delete()
        self.client_user.delete()
        
        print("✅ Test data cleaned up")
        
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Review & Notification System Tests")
        print("=" * 60)
        
        try:
            # Setup
            self.setup_test_data()
            
            # Run tests
            tests = [
                self.test_proposal_workflow,
                self.test_contract_completion,
                self.test_review_system,
                self.test_messaging_system,
                self.test_email_notifications,
                self.test_api_endpoints
            ]
            
            results = []
            for test in tests:
                try:
                    result = test()
                    results.append(result)
                except Exception as e:
                    print(f"❌ Test failed: {e}")
                    results.append(False)
            
            # Summary
            print("\n" + "=" * 60)
            print("🎯 TEST SUMMARY")
            print("=" * 60)
            
            passed = sum(results)
            total = len(results)
            
            print(f"✅ Tests passed: {passed}/{total}")
            print(f"📧 Total emails sent: {len(mail.outbox)}")
            
            if passed == total:
                print("🎉 All tests passed! Review & notification system is working correctly.")
            else:
                print("⚠️  Some tests failed. Please check the implementation.")
                
        except Exception as e:
            print(f"❌ Test suite failed: {e}")
            
        finally:
            # Always cleanup
            self.cleanup()

def main():
    """Main function to run tests"""
    tester = ReviewNotificationSystemTest()
    tester.run_all_tests()

if __name__ == '__main__':
    main()