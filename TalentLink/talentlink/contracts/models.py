from django.db import models
from django.conf import settings
from projects.models import Proposal

class Contract(models.Model):
    STATUS_DRAFT = 'draft'
    STATUS_ACTIVE = 'active'
    STATUS_COMPLETED = 'completed'
    STATUS_TERMINATED = 'terminated'
    STATUS_DISPUTED = 'disputed'
    STATUS_CHOICES = [
        (STATUS_DRAFT, 'Draft'),
        (STATUS_ACTIVE, 'Active'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_TERMINATED, 'Terminated'),
        (STATUS_DISPUTED, 'Disputed'),
    ]

    proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE, related_name='contract')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_contracts')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='freelancer_contracts')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    agreed_amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Contract terms and deliverables
    deliverables = models.TextField(help_text="Detailed description of deliverables")
    milestones = models.JSONField(default=list, blank=True, help_text="Project milestones with dates and amounts")
    
    # Payment terms
    payment_schedule = models.TextField(help_text="Payment schedule and terms")
    payment_method = models.CharField(max_length=50, choices=[
        ('fixed', 'Fixed Price'),
        ('hourly', 'Hourly'),
        ('milestone', 'Milestone Based'),
    ], default='fixed')
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    
    # Progress tracking
    progress = models.IntegerField(default=0, help_text="Progress percentage (0-100)")
    progress_updated_at = models.DateTimeField(null=True, blank=True, help_text="Last time progress was updated")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Signatures
    client_signed_at = models.DateTimeField(null=True, blank=True)
    freelancer_signed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Contract #{self.id}: {self.title}"
    
    @property
    def is_fully_signed(self):
        return self.client_signed_at is not None and self.freelancer_signed_at is not None
    
    @property
    def can_activate(self):
        return self.status == self.STATUS_DRAFT and self.is_fully_signed

class ContractStatusHistory(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='status_history')
    old_status = models.CharField(max_length=20, choices=Contract.STATUS_CHOICES)
    new_status = models.CharField(max_length=20, choices=Contract.STATUS_CHOICES)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.contract} - {self.old_status} → {self.new_status}"
