from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    ]
    
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    is_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'user_type']


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    availability_status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()}'s Profile"


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('programming', 'Programming'),
        ('design', 'Design'),
        ('writing', 'Writing'),
        ('marketing', 'Marketing'),
        ('business', 'Business'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class UserSkill(models.Model):
    PROFICIENCY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('expert', 'Expert'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    proficiency_level = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES)

    class Meta:
        unique_together = ['user', 'skill']

    def __str__(self):
        return f"{self.user.username} - {self.skill.name} ({self.proficiency_level})"


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('message', 'New Message'),
        ('proposal_received', 'Proposal Received'),
        ('proposal_accepted', 'Proposal Accepted'),
        ('proposal_rejected', 'Proposal Rejected'),
        ('contract_created', 'Contract Created'),
        ('contract_completed', 'Contract Completed'),
        ('review_received', 'Review Received'),
        ('payment_received', 'Payment Received'),
        ('system', 'System Notification'),
    ]
    
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional related objects
    related_project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, null=True, blank=True)
    related_proposal = models.ForeignKey('proposals.Proposal', on_delete=models.CASCADE, null=True, blank=True)
    related_contract = models.ForeignKey('contracts.Contract', on_delete=models.CASCADE, null=True, blank=True)
    related_message = models.ForeignKey('messaging.Message', on_delete=models.CASCADE, null=True, blank=True)
    related_review = models.ForeignKey('reviews.Review', on_delete=models.CASCADE, null=True, blank=True)
    
    # Action URL for frontend navigation
    action_url = models.CharField(max_length=500, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.recipient.get_full_name()}"
    
    def mark_as_read(self):
        self.is_read = True
        self.save()


class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Email notifications
    email_messages = models.BooleanField(default=True)
    email_proposals = models.BooleanField(default=True)
    email_contracts = models.BooleanField(default=True)
    email_reviews = models.BooleanField(default=True)
    email_payments = models.BooleanField(default=True)
    email_system = models.BooleanField(default=True)
    
    # In-app notifications
    inapp_messages = models.BooleanField(default=True)
    inapp_proposals = models.BooleanField(default=True)
    inapp_contracts = models.BooleanField(default=True)
    inapp_reviews = models.BooleanField(default=True)
    inapp_payments = models.BooleanField(default=True)
    inapp_system = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()}'s Notification Preferences"