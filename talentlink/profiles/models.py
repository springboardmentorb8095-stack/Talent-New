from django.db import models
from django.contrib.auth.models import User
class Profile(models.Model):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="Client")

    # Freelancer fields
    full_name = models.CharField(max_length=100)
    skills = models.TextField(blank=True)
    portfolio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    availability = models.CharField(max_length=50, blank=True)

    # Client fields
    company_name = models.CharField(max_length=100, blank=True)
    organization_type = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"
# from django.db import models
# from django.contrib.auth.models import User

# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     full_name = models.CharField(max_length=100)
#     bio = models.TextField(blank=True)
#     skills = models.TextField(blank=True)
#     hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
#     location = models.CharField(max_length=100, blank=True)

#     def __str__(self):
#         return self.user.username