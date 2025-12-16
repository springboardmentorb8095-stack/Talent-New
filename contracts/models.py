from django.db import models
from users.models import User
from projects.models import Project
from proposals.models import Proposal

class Contract(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="client_contracts")
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="freelancer_contracts")
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('completed', 'Completed'),
            ('cancelled', 'Cancelled'),
        ],
        default='active'
    )

    def __str__(self):
        return f"Contract for {self.project.title}"
