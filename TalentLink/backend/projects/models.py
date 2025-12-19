from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_projects')
    title = models.CharField(max_length=200)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.title
