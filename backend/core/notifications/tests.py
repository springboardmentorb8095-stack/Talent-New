from django.test import TestCase
from django.contrib.auth import get_user_model
from projects.models import Project
from proposals.models import Proposal
from contracts.models import Contract
from .models import Notification

User = get_user_model()


class NotificationTestCase(TestCase):
    def setUp(self):
        self.client_user = User.objects.create_user(
            username='client',
            password='testpass123',
            role='client'
        )
        self.freelancer_user = User.objects.create_user(
            username='freelancer',
            password='testpass123',
            role='freelancer'
        )
        self.project = Project.objects.create(
            client=self.client_user,
            title='Test Project',
            description='Test Description',
            budget=1000.00,
            duration=30,
            skills_required='Python, Django'
        )

    def test_notification_creation(self):
        notification = Notification.objects.create(
            user=self.client_user,
            notification_type='proposal_received',
            title='Test Notification',
            message='Test message'
        )
        self.assertEqual(notification.user, self.client_user)
        self.assertFalse(notification.is_read)

    def test_notification_ordering(self):
        Notification.objects.create(
            user=self.client_user,
            notification_type='proposal_received',
            title='First',
            message='First message'
        )
        Notification.objects.create(
            user=self.client_user,
            notification_type='proposal_received',
            title='Second',
            message='Second message'
        )
        notifications = Notification.objects.filter(user=self.client_user)
        self.assertEqual(notifications[0].title, 'Second')
