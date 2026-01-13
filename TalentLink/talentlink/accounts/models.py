from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CLIENT = 'client'
    ROLE_FREELANCER = 'freelancer'
    ROLE_CHOICES = [
        (ROLE_CLIENT, 'Client'),
        (ROLE_FREELANCER, 'Freelancer'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

class Skill(models.Model):
    skill_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.skill_name

class Profile(models.Model):
    AVAILABILITY_AVAILABLE = 'available'
    AVAILABILITY_BUSY = 'busy'
    AVAILABILITY_UNAVAILABLE = 'unavailable'
    AVAILABILITY_CHOICES = [
        (AVAILABILITY_AVAILABLE, 'Available'),
        (AVAILABILITY_BUSY, 'Busy'),
        (AVAILABILITY_UNAVAILABLE, 'Unavailable'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    experience = models.PositiveIntegerField(null=True, blank=True)
    portfolio = models.TextField(blank=True)
    skills = models.ManyToManyField(Skill, related_name='profiles', blank=True)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default=AVAILABILITY_AVAILABLE, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('proposal_submitted', 'New Proposal Submitted'),
        ('proposal_accepted', 'Proposal Accepted'),
        ('proposal_rejected', 'Proposal Rejected'),
        ('new_message', 'New Message'),
    ]
    
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, null=True, blank=True)
    related_proposal = models.ForeignKey('projects.Proposal', on_delete=models.CASCADE, null=True, blank=True)
    related_conversation = models.ForeignKey('chat.Conversation', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.recipient.username}"

    def mark_as_read(self):
        self.is_read = True
        self.save()