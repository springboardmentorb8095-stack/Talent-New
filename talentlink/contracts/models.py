from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone
from users.models import User

class Contract(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    proposal = models.OneToOneField(
        'proposals.Proposal',        # ← Correct reference
        on_delete=models.CASCADE,
        related_name='contract'
    )
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    def __str__(self):
        return f"Contract #{self.id} - {self.proposal.project.title}"
    class Meta:
        db_table = 'contracts'
        managed = False 

