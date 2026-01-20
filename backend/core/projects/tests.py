from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Project

User = get_user_model()


class ProjectTests(TestCase):
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

    def test_create_project_as_client(self):
        self.client.force_authenticate(user=self.client_user)
        data = {
            'title': 'New Project',
            'description': 'Project Description',
            'budget': 2000.00,
            'duration': 45,
            'skills_required': 'React, Node.js'
        }
        response = self.client.post('/projects/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_project_as_freelancer(self):
        self.client.force_authenticate(user=self.freelancer_user)
        data = {
            'title': 'New Project',
            'description': 'Project Description',
            'budget': 2000.00,
            'duration': 45,
            'skills_required': 'React, Node.js'
        }
        response = self.client.post('/projects/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_projects(self):
        response = self.client.get('/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_get_project_detail(self):
        response = self.client.get(f'/projects/{self.project.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Project')

    def test_update_project_as_owner(self):
        self.client.force_authenticate(user=self.client_user)
        data = {'title': 'Updated Title'}
        response = self.client.patch(f'/projects/{self.project.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_project_as_non_owner(self):
        self.client.force_authenticate(user=self.freelancer_user)
        data = {'title': 'Updated Title'}
        response = self.client.patch(f'/projects/{self.project.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
