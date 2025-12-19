from django.db import models
from django.contrib.auth.models import User

# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     bio = models.TextField(blank=True, null=True)
#     role = models.CharField(
#         max_length=20,
#         choices=[('client', 'Client'), ('freelancer', 'Freelancer')],
#         default='client'
#     )


#     def __str__(self):
#         return self.user.username

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    bio = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.user.username

