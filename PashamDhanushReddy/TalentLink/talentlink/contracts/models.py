from django.db import models
from projects.models import Proposal

class Contract(models.Model):
    STATUS_ACTIVE = 'active'
    STATUS_COMPLETED = 'completed'
    STATUS_TERMINATED = 'terminated'
    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Active'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_TERMINATED, 'Terminated'),
    ]

    proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE, related_name='contract')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    agreed_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contract #{self.id}"
