from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class UserRegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_client(self):
        data = {
            'username': 'testclient',
            'email': 'client@test.com',
            'password': 'testpass123',
            'role': 'client'
        }
        response = self.client.post('/users/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testclient').exists())

    def test_register_freelancer(self):
        data = {
            'username': 'testfreelancer',
            'email': 'freelancer@test.com',
            'password': 'testpass123',
            'role': 'freelancer'
        }
        response = self.client.post('/users/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_invalid_role(self):
        data = {
            'username': 'testuser',
            'email': 'user@test.com',
            'password': 'testpass123',
            'role': 'invalid'
        }
        response = self.client.post('/users/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='testpass123',
            role='client'
        )

    def test_get_current_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/users/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_get_current_user_unauthenticated(self):
        response = self.client.get('/users/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
