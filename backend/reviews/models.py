from django.db import models
from django.contrib.auth.models import User
from contracts.models import Contract

class Review(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Review"
        verbose_name_plural = "Reviews"

    def __str__(self):
        return f"Review for {self.contract.project_title} ({self.rating})"
