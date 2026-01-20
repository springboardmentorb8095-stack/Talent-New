from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="advanced_profile"   # ✅ DIFFERENT
    )

    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    experience = models.TextField(blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    certifications = models.TextField(blank=True, null=True)

    def completion_percentage(self):
        fields = [
            self.avatar,
            self.experience,
            self.education,
            self.certifications,
        ]
        filled = sum(bool(f) for f in fields)
        return int((filled / len(fields)) * 100)

    def __str__(self):
        return self.user.username
