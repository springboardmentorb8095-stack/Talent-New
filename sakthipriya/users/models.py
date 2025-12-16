from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


# ============================
# CUSTOM USER MANAGER
# ============================
class UserManager(BaseUserManager):

    def create_user(self, email, password=None, name=None, role=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)

        user = self.model(email=email, name=name, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "client")  # admin role default
        extra_fields.setdefault("name", "Admin")

        return self.create_user(email=email, password=password, **extra_fields)


# ============================
# CUSTOM USER MODEL
# ============================
class User(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    )

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    username = None  # remove username

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # superuser will only ask for email + password

    objects = UserManager()

    def __str__(self):
        return f"{self.name} ({self.role})"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    def __str__(self):
        return f"Profile of {self.user.name}"
