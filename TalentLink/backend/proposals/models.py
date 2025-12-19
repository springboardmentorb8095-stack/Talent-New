from django.db import models
from django.contrib.auth.models import User
from projects.models import Project

class Proposal(models.Model):
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='freelancer_proposals')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_proposals')
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Proposal"
        verbose_name_plural = "Proposals"

    def __str__(self):
        return f"{self.freelancer.username} -> {self.project.title} ({self.bid_amount})"
