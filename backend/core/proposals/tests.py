from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from projects.models import Project
from .models import Proposal

User = get_user_model()


class ProposalTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.client_user = User.objects.create_user(
            username='client',
            email='client@test.com',
            password='testpass123',
            role='client'
        )
        self.freelancer_user = User.objects.create_user(
            username='freelancer',
            email='freelancer@test.com',
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

    def test_create_proposal_as_freelancer(self):
        self.client.force_authenticate(user=self.freelancer_user)
        data = {
            'project': self.project.id,
            'cover_letter': 'I am interested in this project',
            'proposed_price': 900.00
        }
        response = self.client.post('/proposals/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_proposal_as_client(self):
        self.client.force_authenticate(user=self.client_user)
        data = {
            'project': self.project.id,
            'cover_letter': 'I am interested',
            'proposed_price': 900.00
        }
        response = self.client.post('/proposals/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_freelancer_proposals(self):
        proposal = Proposal.objects.create(
            project=self.project,
            freelancer=self.freelancer_user,
            cover_letter='Test',
            proposed_price=900.00
        )
        self.client.force_authenticate(user=self.freelancer_user)
        response = self.client.get('/proposals/my-proposals/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_update_proposal_status(self):
        proposal = Proposal.objects.create(
            project=self.project,
            freelancer=self.freelancer_user,
            cover_letter='Test',
            proposed_price=900.00,
            status='pending'
        )
        self.client.force_authenticate(user=self.client_user)
        data = {'status': 'accepted'}
        response = self.client.patch(f'/proposals/{proposal.id}/status/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        proposal.refresh_from_db()
        self.assertEqual(proposal.status, 'accepted')
