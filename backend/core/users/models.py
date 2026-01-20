from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    role_choices = [
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    ]
    role = models.CharField(choices=role_choices, max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
