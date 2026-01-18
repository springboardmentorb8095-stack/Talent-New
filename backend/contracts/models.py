from django.db import models
from users.models import User
from projects.models import Project
from proposals.models import Proposal


class Contract(models.Model):
    project = models.OneToOneField(
        Project,
        on_delete=models.CASCADE,
        related_name="contract"
    )

    proposal = models.OneToOneField(
        Proposal,
        on_delete=models.CASCADE,
        related_name="contract"
    )

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="contracts_as_client"
    )

    freelancer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="contracts_as_freelancer"
    )

    # ✅ Fixed amount copied from proposal
    bid_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)

    is_active = models.BooleanField(default=True)

    # ✅ Freelancer controlled progress
    progress = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Contract for {self.project.title}"
