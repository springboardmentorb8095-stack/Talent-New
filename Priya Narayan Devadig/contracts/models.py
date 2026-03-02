from django.db import models
from django.conf import settings
from django.utils import timezone


class Contract(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('terminated', 'Terminated'),
        ('disputed', 'Disputed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    ]
    
    project = models.OneToOneField('projects.Project', on_delete=models.CASCADE, related_name='contract')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_contracts')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='freelancer_contracts')
    proposal = models.OneToOneField('proposals.Proposal', on_delete=models.CASCADE, related_name='contract')
    
    # Financial details
    agreed_budget = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # Timeline
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    actual_completion_date = models.DateTimeField(null=True, blank=True)
    
    # Status and terms
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    terms_and_conditions = models.TextField(blank=True)
    
    # Milestones and deliverables
    milestones = models.JSONField(default=list, blank=True)  # List of milestone objects
    deliverables = models.TextField(blank=True)
    
    # Tracking
    progress_percentage = models.IntegerField(default=0)
    last_activity = models.DateTimeField(auto_now=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Contract: {self.project.title} - {self.status}"
    
    @property
    def is_overdue(self):
        """Check if contract is overdue"""
        if self.status in ['completed', 'terminated', 'cancelled']:
            return False
        return timezone.now() > self.end_date
    
    @property
    def days_remaining(self):
        """Calculate days remaining until deadline"""
        if self.status in ['completed', 'terminated', 'cancelled']:
            return 0
        delta = self.end_date - timezone.now()
        return max(0, delta.days)
    
    @property
    def payment_percentage(self):
        """Calculate payment completion percentage"""
        if self.agreed_budget == 0:
            return 0
        return min(100, (self.paid_amount / self.agreed_budget) * 100)
    
    def update_progress(self, percentage):
        """Update contract progress"""
        self.progress_percentage = min(100, max(0, percentage))
        self.last_activity = timezone.now()
        self.save()
    
    def mark_completed(self):
        """Mark contract as completed"""
        self.status = 'completed'
        self.progress_percentage = 100
        self.actual_completion_date = timezone.now()
        self.project.status = 'completed'
        self.save()
        self.project.save()
    
    def add_milestone(self, title, description, due_date, amount=0):
        """Add a milestone to the contract"""
        milestone = {
            'id': len(self.milestones) + 1,
            'title': title,
            'description': description,
            'due_date': due_date.isoformat() if hasattr(due_date, 'isoformat') else str(due_date),
            'amount': float(amount),
            'completed': False,
            'completed_date': None
        }
        self.milestones.append(milestone)
        self.save()
        return milestone