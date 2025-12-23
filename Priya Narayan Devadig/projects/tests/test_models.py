import pytest
from django.contrib.auth import get_user_model
from projects.models import Project, Category

User = get_user_model()


@pytest.mark.django_db
class TestCategoryModel:
    """Test cases for Category model"""
    
    def test_create_category(self):
        """Test creating a category"""
        category = Category.objects.create(
            name='Web Development',
            description='Web development projects'
        )
        assert category.name == 'Web Development'
        assert str(category) == 'Web Development'


@pytest.mark.django_db
class TestProjectModel:
    """Test cases for Project model"""
    
    def setup_method(self):
        """Set up test data"""
        self.client = User.objects.create_user(
            username='client',
            email='client@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(
            name='Web Development'
        )
    
    def test_create_project(self):
        """Test creating a project"""
        project = Project.objects.create(
            title='Build a Website',
            description='Need a professional website',
            client=self.client,
            category=self.category,
            budget=1000.00,
            deadline='2024-12-31'
        )
        assert project.title == 'Build a Website'
        assert project.client == self.client
        assert project.status == 'open'
        assert str(project) == 'Build a Website'
    
    def test_project_status_choices(self):
        """Test project status field"""
        project = Project.objects.create(
            title='Test Project',
            description='Test description',
            client=self.client,
            category=self.category,
            budget=500.00
        )
        
        assert project.status == 'open'
        
        project.status = 'in_progress'
        project.save()
        assert project.status == 'in_progress'
        
        project.status = 'completed'
        project.save()
        assert project.status == 'completed'
    
    def test_project_timestamps(self):
        """Test project created_at and updated_at fields"""
        project = Project.objects.create(
            title='Test Project',
            description='Test description',
            client=self.client,
            category=self.category,
            budget=500.00
        )
        
        assert project.created_at is not None
        assert project.updated_at is not None
        
        original_updated = project.updated_at
        project.title = 'Updated Title'
        project.save()
        
        assert project.updated_at > original_updated
