from django.db import models
from django.conf import settings
from django.utils import timezone


class Contract(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('terminated', 'Terminated'),
    ]
    
    project = models.OneToOneField('projects.Project', on_delete=models.CASCADE, related_name='contract')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_contracts')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='freelancer_contracts')
    proposal = models.OneToOneField('proposals.Proposal', on_delete=models.CASCADE, related_name='contract')
    agreed_budget = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    terms_and_conditions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Contract: {self.project.title}"