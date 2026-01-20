from django.db import models
from users.models import User

class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    # Shared
    full_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(max_length=3000, blank=True)
    location = models.CharField(max_length=60, blank=True)

    avatar = models.ImageField(
        upload_to="avatars/",
        null=True,
        blank=True
    )

    # Freelancer-specific
    skills = models.CharField(max_length=300, blank=True)
    hourly_rate = models.PositiveIntegerField(null=True, blank=True)

    AVAILABILITY_CHOICES = [
        ("full_time", "Full Time"),
        ("part_time", "Part Time"),
        ("freelance", "Freelance"),
    ]
    availability = models.CharField(
        max_length=20,
        choices=AVAILABILITY_CHOICES,
        blank=True
    )

    # Client-specific
    company_name = models.CharField(max_length=150, blank=True)
    company_website = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
