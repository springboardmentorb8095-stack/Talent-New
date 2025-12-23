
# profiles/models.py
from django.db import models
from django.conf import settings

# profiles/models.py
class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    full_name = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    hourly_rate = models.IntegerField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    availability = models.CharField(max_length=100, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    portfolio = models.TextField(blank=True, null=True)  # ← Added field

    def __str__(self):
        return f"{self.full_name or self.user.username}'s Profile"

    class Meta:
        managed = False
        db_table = 'profiles'
