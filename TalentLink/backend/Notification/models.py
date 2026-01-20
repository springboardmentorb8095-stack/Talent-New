from django.db import models
from django.contrib.auth.models import User
from django.utils.timesince import timesince

class Notification(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # ✅ ADD THESE
    project_id = models.IntegerField(null=True, blank=True)
    proposal_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.message}"


    def time_ago(self):
        return timesince(self.created_at) + " ago"