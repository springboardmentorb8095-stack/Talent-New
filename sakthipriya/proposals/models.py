from django.db import models
from users.models import User
from projects.models import Project

class Proposal(models.Model):
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="proposals")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="proposals")
    cover_letter = models.TextField()
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_days = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('accepted', 'Accepted'),
            ('rejected', 'Rejected')
        ],
        default='pending'
    )

    def __str__(self):
        return f"{self.freelancer.username} → {self.project.title}"
