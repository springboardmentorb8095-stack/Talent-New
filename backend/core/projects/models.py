from django.db import models
from users.models import User

class Project(models.Model):
    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="projects"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField()
    skills_required = models.TextField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)


    def __str__(self):
        return f"{self.title} ({self.client.username})"
