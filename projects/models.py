from django.db import models
from users.models import User
from skills.models import Skill

class Project(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_projects')
    title = models.CharField(max_length=255)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField(default=30,  help_text="Duration in days")
    skills_required = models.ManyToManyField(Skill)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
