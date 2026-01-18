from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone
import random


# =====================================================
# =================== USER =============================
# =====================================================

class User(AbstractUser):
    class Roles(models.TextChoices):
        CLIENT = "CLIENT", "Client"
        FREELANCER = "FREELANCER", "Freelancer"

    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.CLIENT,
        db_index=True,
    )

    def __str__(self):
        return f"{self.username} ({self.role})"


# =====================================================
# =================== EMAIL OTP ========================
# =====================================================

class EmailOTP(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_otps",
    )
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.otp:
            self.otp = str(random.randint(100000, 999999))
        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.created_at + timezone.timedelta(minutes=10)

    def __str__(self):
        return f"{self.user.email} - {self.otp}"


# =====================================================
# =================== SKILL ============================
# =====================================================

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True)

    def __str__(self):
        return self.name


# =====================================================
# =================== PROFILE ==========================
# =====================================================

class Profile(models.Model):

    class Availability(models.TextChoices):
        FULL_TIME = "FULL_TIME", "Full Time"
        PART_TIME = "PART_TIME", "Part Time"
        HOURLY = "HOURLY", "Hourly"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    title = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)

    hourly_rate = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
    )

    skills = models.ManyToManyField(
        Skill,
        blank=True,
        related_name="profiles",
    )

    availability = models.CharField(
        max_length=20,
        choices=Availability.choices,
        blank=True,
        db_index=True,
    )

    company_name = models.CharField(max_length=255, blank=True)
    company_website = models.URLField(blank=True)

    profile_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


# =====================================================
# =================== PORTFOLIO ========================
# =====================================================

class Portfolio(models.Model):
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="portfolio_items",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# =====================================================
# =================== PROJECT ==========================
# =====================================================

class Project(models.Model):

    class Status(models.TextChoices):
        OPEN = "OPEN", "Open"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    class Duration(models.TextChoices):
        SHORT = "SHORT", "Less than 1 month"
        MEDIUM = "MEDIUM", "1–3 months"
        LONG = "LONG", "More than 3 months"

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="projects",
    )

    title = models.CharField(max_length=255)
    description = models.TextField()

    required_skills = models.ManyToManyField(
        Skill,
        blank=True,
        related_name="projects",
    )

    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    duration = models.CharField(
        max_length=20,
        choices=Duration.choices,
        blank=True,
        db_index=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
        db_index=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# =====================================================
# =================== PROPOSAL =========================
# =====================================================

class Proposal(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ACCEPTED = "ACCEPTED", "Accepted"
        REJECTED = "REJECTED", "Rejected"

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="proposals",
    )

    freelancer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submitted_proposals",
    )

    cover_letter = models.TextField()
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "freelancer")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.freelancer.username} → {self.project.title}"


# =====================================================
# =================== CONTRACT =========================
# =====================================================

class Contract(models.Model):

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    project = models.OneToOneField(
        Project,
        on_delete=models.CASCADE,
        related_name="contract",
    )

    proposal = models.OneToOneField(
        Proposal,
        on_delete=models.CASCADE,
        related_name="contract",
    )

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="client_contracts",
    )

    freelancer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="freelancer_contracts",
    )

    terms = models.TextField()
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contract: {self.project.title}"


# =====================================================
# =================== MESSAGE ==========================
# =====================================================

class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_messages",
    )

    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_messages",
    )

    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    content = models.TextField()
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sent_at"]

    def __str__(self):
        return f"Message from {self.sender.username}"


# =====================================================
# =================== REVIEW ===========================
# =====================================================

class Review(models.Model):
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="given_reviews",
    )

    reviewee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_reviews",
    )

    contract = models.OneToOneField(
        Contract,
        on_delete=models.CASCADE,
        related_name="review",
    )

    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rating} ★ Review"


# =====================================================
# =================== NOTIFICATION =====================
# =====================================================

class Notification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notification for {self.user.username}"
