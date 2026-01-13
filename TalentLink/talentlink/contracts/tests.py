from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from .models import Contract, ContractStatusHistory
from projects.models import Project, Proposal

User = get_user_model()


class ContractProgressCompletionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.client_user = User.objects.create_user(
            username='client_user',
            email='client@test.com',
            password='testpass123',
            first_name='Test',
            last_name='Client',
            role='client'
        )
        
        self.freelancer_user = User.objects.create_user(
            username='freelancer_user',
            email='freelancer@test.com',
            password='testpass123',
            first_name='Test',
            last_name='Freelancer',
            role='freelancer'
        )
        
        # Create a project
        self.project = Project.objects.create(
            title='Test Project',
            description='Test project description',
            client=self.client_user,
            budget=1000,
            duration='30 days'
        )
        # Add required skills (many-to-many relationship requires the project to be saved first)
        from accounts.models import Skill
        skill = Skill.objects.create(skill_name='Test Skill')
        self.project.skills_required.add(skill)
        
        # Create a proposal
        self.proposal = Proposal.objects.create(
            project=self.project,
            freelancer=self.freelancer_user,
            bid_amount=800,
            message='Test proposal message',
            status='accepted'
        )
        
        # Create a contract
        self.contract = Contract.objects.create(
            proposal=self.proposal,
            client=self.client_user,
            freelancer=self.freelancer_user,
            title='Test Contract',
            description='Test contract description',
            start_date=timezone.now().date(),
            agreed_amount=800,
            deliverables='Test deliverables',
            status='active',
            progress=50
        )
    
    def test_automatic_completion_at_100_percent(self):
        """Test that contract is automatically marked as completed when progress reaches 100%"""
        self.client.force_authenticate(user=self.freelancer_user)
        
        # Update progress to 100%
        response = self.client.post(
            f'/api/contracts/contracts/{self.contract.id}/update_progress/',
            {'progress': 100},
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh contract from database
        self.contract.refresh_from_db()
        
        # Verify contract status is now completed
        self.assertEqual(self.contract.status, 'completed')
        self.assertEqual(self.contract.progress, 100)
        self.assertIsNotNone(self.contract.end_date)
        
        # Verify status history was created
        status_history = ContractStatusHistory.objects.filter(
            contract=self.contract,
            old_status='active',
            new_status='completed'
        )
        self.assertEqual(status_history.count(), 1)
        self.assertEqual(
            status_history.first().reason,
            "Automatically completed - progress reached 100%"
        )
        
        # Refresh contract from database
        self.contract.refresh_from_db()
        
        # Verify contract status is now completed
        self.assertEqual(self.contract.status, 'completed')
        self.assertEqual(self.contract.progress, 100)
        self.assertIsNotNone(self.contract.end_date)
        
        # Verify status history was created
        status_history = ContractStatusHistory.objects.filter(
            contract=self.contract,
            old_status='active',
            new_status='completed'
        )
        self.assertEqual(status_history.count(), 1)
        self.assertEqual(
            status_history.first().reason,
            "Automatically completed - progress reached 100%"
        )
    
    def test_no_completion_below_100_percent(self):
        """Test that contract is not completed when progress is below 100%"""
        self.client.force_authenticate(user=self.freelancer_user)
        
        # Update progress to 99%
        response = self.client.post(
            f'/api/contracts/contracts/{self.contract.id}/update_progress/',
            {'progress': 99},
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh contract from database
        self.contract.refresh_from_db()
        
        # Verify contract status is still active
        self.assertEqual(self.contract.status, 'active')
        self.assertEqual(self.contract.progress, 99)
        self.assertIsNone(self.contract.end_date)
        
        # Verify no status history was created
        status_history = ContractStatusHistory.objects.filter(contract=self.contract)
        self.assertEqual(status_history.count(), 0)
    
    def test_only_freelancer_can_update_progress(self):
        """Test that only the freelancer can update progress"""
        self.client.force_authenticate(user=self.client_user)
        
        response = self.client.post(
            f'/api/contracts/contracts/{self.contract.id}/update_progress/',
            {'progress': 100},
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['error'], "Only the freelancer can update progress")
    
    def test_progress_update_for_non_active_contract(self):
        """Test that progress cannot be updated for non-active contracts"""
        # Change contract status to completed
        self.contract.status = 'completed'
        self.contract.save()
        
        self.client.force_authenticate(user=self.freelancer_user)
        
        response = self.client.post(
            f'/api/contracts/contracts/{self.contract.id}/update_progress/',
            {'progress': 75},
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Progress can only be updated for active, signed, or draft contracts", 
                     response.data['error'])