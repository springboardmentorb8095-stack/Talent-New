from django.db import models
from django.contrib.auth.models import User

CURRENCY_CHOICES = (
    ("INR", "Rupees"),
    ("USD", "Dollars"),
)
class Project(models.Model):
    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="client_projects"  
    )

    # REQUIRED
    title = models.CharField(max_length=200)
    description = models.TextField()

    # OPTIONAL
    budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default="INR"
    )

    duration = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Example: 1 month, 2 weeks"
    )

    required_skills = models.TextField(
        null=True,
        blank=True,
        help_text="Comma separated skills"
    )

    location = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    education = models.CharField(
        max_length=200,
        null=True,
        blank=True
    )

    responsibilities = models.TextField(
        null=True,
        blank=True
    )

    experience_level = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
