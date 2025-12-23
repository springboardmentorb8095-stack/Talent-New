# projects/models.py
from django.db import models
from django.conf import settings

class Project(models.Model):
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    duration = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    skills = models.JSONField()
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # ✅ REQUIRED

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'projects'
        managed = False
