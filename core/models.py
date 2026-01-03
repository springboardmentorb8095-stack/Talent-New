from django.db import models

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


# ---------------------------
# PROFILE
# ---------------------------
class Profile(models.Model):
    ROLE_CHOICES = (
        ("client", "Client"),
        ("freelancer", "Freelancer"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    bio = models.TextField(blank=True)
    skills = models.CharField(max_length=255, blank=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    portfolio = models.URLField(blank=True) 
 
    availability = models.BooleanField(default=True)   

    def __str__(self):
        return f"{self.user.username} - {self.role}"


# ---------------------------
# PROJECT
# ---------------------------
class Project(models.Model):
    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="projects"
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# ---------------------------
# PROPOSAL
# ---------------------------
class Proposal(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    )

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="proposals"
    )
    freelancer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="proposals"
    )
    cover_letter = models.TextField()
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    is_approved = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.freelancer} → {self.project}"


# ---------------------------
# CONTRACT
# ---------------------------
class Contract(models.Model):
    STATUS_CHOICES = (
        ("active", "Active"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )

    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)
    agreed_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Contract for {self.project}"


# ---------------------------
# REVIEW
# ---------------------------
class Review(models.Model):
    contract = models.OneToOneField(Contract, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.reviewer}"


# ---------------------------
# MESSAGE
# ---------------------------
class Message(models.Model):
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_messages"
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} → {self.receiver}"
    


