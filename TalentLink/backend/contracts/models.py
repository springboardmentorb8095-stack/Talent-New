from django.db import models
from django.contrib.auth.models import User
from projects.models import Project
from django.utils import timezone

class Contract(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("active", "Active"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="project_contracts"
    )

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="client_contracts_contracts"
    )

    freelancer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="freelancer_contracts_contracts"
    )

    freelancers = models.ManyToManyField(
    User,
    related_name="team_contracts"
)


    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Contract - {self.project.title}"
class Milestone(models.Model):
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name="milestones"
    )
    title = models.CharField(max_length=200)
    progress = models.PositiveIntegerField(default=0)  # 0–100
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.progress}%"

