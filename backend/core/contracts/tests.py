from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, timedelta
from projects.models import Project
from proposals.models import Proposal
from .models import Contract

User = get_user_model()


class ContractTests(TestCase):
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
        self.proposal = Proposal.objects.create(
            project=self.project,
            freelancer=self.freelancer_user,
            cover_letter='Test',
            proposed_price=900.00,
            status='accepted'
        )
        self.contract = Contract.objects.create(
            proposal=self.proposal,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
            status='active'
        )

    def test_list_contracts_as_client(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get('/contracts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_contracts_as_freelancer(self):
        self.client.force_authenticate(user=self.freelancer_user)
        response = self.client.get('/contracts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_contract_detail(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(f'/contracts/{self.contract.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_contract_status(self):
        self.client.force_authenticate(user=self.freelancer_user)
        data = {'status': 'submitted', 'progress': 100}
        response = self.client.patch(f'/contracts/{self.contract.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
