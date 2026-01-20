from django.db import models
from proposals.models import Proposal

class Contract(models.Model):
    proposal = models.OneToOneField(
        Proposal,
        on_delete=models.CASCADE,
        related_name="contract"
    )

    start_date = models.DateField()
    end_date = models.DateField()

    STATUS_CHOICES = [
        ("active", "Active"),          # ongoing work
        ("submitted", "Submitted"),    # freelancer submitted work
        ("completed", "Completed"),    # client approved
        ("cancelled", "Cancelled"),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active"
    )

    progress = models.FloatField(default=0)  # 0–100 percentage
    work_submitted_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    @property
    def remaining_days(self):
        from datetime import date
        if not self.end_date:
            return None
        diff = (self.end_date - date.today()).days
        return diff if diff >= 0 else 0

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contract #{self.id} (Proposal {self.proposal.id})"
