from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')

    bio = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    portfolio = models.URLField(blank=True, null=True)

    skills = models.TextField(blank=True, null=True)  # ✅ FIX

    hourly_rate = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True
    )

    availability = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        default="available"   # ✅ SAFE
    )

    def __str__(self):
        return self.user.username
