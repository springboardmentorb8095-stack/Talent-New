# from django.db import models
# from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

# # ======================
# # USER MODEL
# # ======================
# class User(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(unique=True)
#     name = models.CharField(max_length=100)
#     role = models.CharField(max_length=20)

#     USERNAME_FIELD = 'email'

#     def __str__(self):
#         return self.email


# # ======================
# # PROFILE MODEL  ✅ THIS MUST EXIST
# # ======================
# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)

#     bio = models.TextField(blank=True)
#     portfolio = models.CharField(max_length=200, blank=True)
#     skills = models.TextField(blank=True)

#     #availability = models.CharField(max_length=50, blank=True)
#     availability = models.CharField(max_length=50, default="Full-time")


#     hourly_rate = models.DecimalField(
#         max_digits=10,
#         decimal_places=2,
#         null=True,
#         blank=True
#     )

#     location = models.CharField(max_length=255, blank=True)

#     avatar = models.ImageField(
#         upload_to='avatars/',
#         null=True,
#         blank=True
#     )

#     def __str__(self):
#         return f"{self.user.email} Profile"
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from skills.models import Skill   # IMPORTANT: import Skill model


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
        extra_fields.setdefault("role", "client")
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

    username = None

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.name} ({self.role})"


# ============================
# PROFILE MODEL
# ============================
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    bio = models.TextField(blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    skills = models.ManyToManyField("skills.Skill", blank=True)
    portfolio = models.URLField(blank=True, null=True)
    availability = models.CharField(
        max_length=50,
        choices=[
            ("available", "Available"),
            ("busy", "Busy"),
            ("not_available", "Not Available"),
        ],
        default="available",
        blank=True,
        null=True,
    )

    def __str__(self):
        return str(self.user)

