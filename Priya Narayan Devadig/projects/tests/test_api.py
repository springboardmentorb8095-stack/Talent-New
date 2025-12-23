import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from projects.models import Project, Category

User = get_user_model()


@pytest.mark.django_db
class TestProjectAPI:
    """Test cases for project endpoints"""
    
    def setup_method(self):
        """Set up test client and test data"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='client',
            email='client@example.com',
            password='testpass123'
        )
        self.freelancer = User.objects.create_user(
            username='freelancer',
            email='freelancer@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(name='Web Development')
        self.projects_url = '/api/projects/'
    
    def test_list_projects(self):
        """Test listing all projects"""
        Project.objects.create(
            title='Project 1',
            description='Description 1',
            client=self.user,
            category=self.category,
            budget=1000.00
        )
        Project.objects.create(
            title='Project 2',
            description='Description 2',
            client=self.user,
            category=self.category,
            budget=2000.00
        )
        
        response = self.client.get(self.projects_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
    
    def test_create_project_authenticated(self):
        """Test creating a project when authenticated"""
        self.client.force_authenticate(user=self.user)
        project_data = {
            'title': 'New Project',
            'description': 'Project description',
            'category': self.category.id,
            'budget': 1500.00,
            'deadline': '2024-12-31'
        }
        response = self.client.post(self.projects_url, project_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Project.objects.filter(title='New Project').exists()
    
    def test_create_project_unauthenticated(self):
        """Test creating a project when not authenticated"""
        project_data = {
            'title': 'New Project',
            'description': 'Project description',
            'category': self.category.id,
            'budget': 1500.00
        }
        response = self.client.post(self.projects_url, project_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_retrieve_project(self):
        """Test retrieving a single project"""
        project = Project.objects.create(
            title='Test Project',
            description='Test description',
            client=self.user,
            category=self.category,
            budget=1000.00
        )
        
        url = f'{self.projects_url}{project.id}/'
        response = self.client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Test Project'
    
    def test_update_own_project(self):
        """Test updating own project"""
        self.client.force_authenticate(user=self.user)
        project = Project.objects.create(
            title='Test Project',
            description='Test description',
            client=self.user,
            category=self.category,
            budget=1000.00
        )
        
        url = f'{self.projects_url}{project.id}/'
        update_data = {'title': 'Updated Project'}
        response = self.client.patch(url, update_data)
        assert response.status_code == status.HTTP_200_OK
        
        project.refresh_from_db()
        assert project.title == 'Updated Project'
    
    def test_delete_own_project(self):
        """Test deleting own project"""
        self.client.force_authenticate(user=self.user)
        project = Project.objects.create(
            title='Test Project',
            description='Test description',
            client=self.user,
            category=self.category,
            budget=1000.00
        )
        
        url = f'{self.projects_url}{project.id}/'
        response = self.client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Project.objects.filter(id=project.id).exists()
