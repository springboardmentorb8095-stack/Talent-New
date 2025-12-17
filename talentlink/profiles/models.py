# profiles/models.py
#from django.db import models
#from django.contrib.auth import get_user_model

# This gets your custom User (with role) safely
#User = get_user_model()

#class Profile(models.Model):
   # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    #full_name = models.CharField(max_length=100, blank=True, null=True)
   # bio = models.TextField(blank=True, null=True)
   # hourly_rate = models.IntegerField(blank=True, null=True)
    #location = models.CharField(max_length=100, blank=True, null=True)
    #availability = models.CharField(max_length=100, blank=True, null=True)
    #skills = models.TextField(blank=True, null=True)  # e.g., "Python, Django, React"

    # Removed ImageField to avoid Pillow error
    # profile_picture = models.ImageField(...)  ← COMMENTED OUT

    #def __str__(self):
       # return f"{self.full_name or self.user.username}'s Profile"
   # class Meta:
        #managed = False  # Add this if missing
        #db_table = 'profiles' 
# profiles/models.py
from django.db import models
from django.conf import settings


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,  # ← Now points to custom users table
        on_delete=models.CASCADE,
        related_name='profile'
    )
    full_name = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    hourly_rate = models.IntegerField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    availability = models.CharField(max_length=100, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.full_name or self.user.username}'s Profile"

    class Meta:
        managed = False
        db_table = 'profiles'
