# projects/models.py
#from django.db import models
#from django.contrib.auth import get_user_model
#from django.utils import timezone

#User = get_user_model()

#class Project(models.Model):
    #client = models.ForeignKey(
        #User,
        #on_delete=models.CASCADE,
        #related_name='posted_projects'
    #)
   # title = models.CharField(max_length=200)
   # description = models.TextField()
    #budget = models.DecimalField(max_digits=10, decimal_places=2)
    #duration = models.CharField(max_length=100)  # e.g., "2-4 weeks"
    #skills_required = models.TextField(blank=True)  # or use ManyToMany later
    #created_at = models.DateTimeField(default=timezone.now)

    #def __str__(self):
        #return self.title

    #class Meta:
        #db_table = 'projects'
        #ordering = ['-created_at']
       # managed = False 
# projects/models.py
from django.db import models  # ← Import custom user model (lowercase 'user')
from django.utils import timezone
from django.conf import settings

class Project(models.Model):
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posted_projects'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=100)
    skills_required = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title
    class Meta:
        managed = False
        db_table = 'projects'
   
