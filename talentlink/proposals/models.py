# proposals/models.py

#from django.db import models
#from django.contrib.auth import get_user_model
#from django.utils import timezone

#User = get_user_model()

#class Proposal(models.Model):
   # STATUS_CHOICES = (
       # ('pending', 'Pending'),
       # ('accepted', 'Accepted'),
       # ('rejected', 'Rejected'),
    #)

    #project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='proposals')
    #freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_proposals')
    #cover_letter = models.TextField()
    #proposed_rate = models.DecimalField(max_digits=10, decimal_places=2)
    #status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    #created_at = models.DateTimeField(default=timezone.now)

    #class Meta:
        #unique_together = ('project', 'freelancer')
       # ordering = ['-created_at']
        #managed = False  
        #db_table = 'proposals' 

    #def __str__(self):
        #return f"{self.freelancer} → {self.project.title}"
# proposals/models.py
from django.db import models
from django.utils import timezone
from django.conf import settings
from projects.models import Project  # ← Direct import for Project

class Proposal(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='proposals'
    )
    freelancer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_proposals'
    )
    cover_letter = models.TextField()
  
    proposed_rate = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ], default='pending')
    created_at = models.DateTimeField(default=timezone.now)

    #class Meta:
        #unique_together = ('project', 'freelancer')
        #ordering = ['-created_at']
        #managed = False
        #db_table = 'proposals'

    class Meta:
        db_table = 'proposals'
        ordering = ['-created_at']
        managed = False  

    def __str__(self):
       return f"{self.freelancer} → {self.project.title}"
