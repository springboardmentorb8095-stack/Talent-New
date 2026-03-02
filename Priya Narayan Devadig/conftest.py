"""
Pytest configuration and fixtures for the entire test suite
"""
import pytest
from django.contrib.auth import get_user_model
from projects.models import Project, Category
from proposals.models import Proposal
from contracts.models import Contract

User = get_user_model()


@pytest.fixture
def api_client():
    """Fixture for API client"""
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def create_user():
    """Fixture to create a user"""
    def make_user(**kwargs):
        defaults = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        defaults.update(kwargs)
        return User.objects.create_user(**defaults)
    return make_user


@pytest.fixture
def client_user(create_user):
    """Fixture for a client user"""
    user = create_user(username='client', email='client@example.com')
    user.profile.user_type = 'client'
    user.profile.save()
    return user


@pytest.fixture
def freelancer_user(create_user):
    """Fixture for a freelancer user"""
    user = create_user(username='freelancer', email='freelancer@example.com')
    user.profile.user_type = 'freelancer'
    user.profile.save()
    return user


@pytest.fixture
def category():
    """Fixture for a project category"""
    return Category.objects.create(
        name='Web Development',
        description='Web development projects'
    )


@pytest.fixture
def project(client_user, category):
    """Fixture for a project"""
    return Project.objects.create(
        title='Test Project',
        description='Test project description',
        client=client_user,
        category=category,
        budget=1000.00,
        deadline='2024-12-31'
    )


@pytest.fixture
def proposal(freelancer_user, project):
    """Fixture for a proposal"""
    return Proposal.objects.create(
        project=project,
        freelancer=freelancer_user,
        cover_letter='Test cover letter',
        proposed_amount=900.00,
        estimated_duration=14
    )


@pytest.fixture
def contract(client_user, freelancer_user, project):
    """Fixture for a contract"""
    return Contract.objects.create(
        project=project,
        client=client_user,
        freelancer=freelancer_user,
        amount=1000.00,
        start_date='2024-01-01',
        end_date='2024-12-31',
        terms='Test contract terms'
    )
