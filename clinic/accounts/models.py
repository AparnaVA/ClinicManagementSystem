from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        RECEPTIONIST = "RECEPTIONIST", "Receptionist"

    role = models.CharField(
        max_length=20,
        choices=Role.choices
    )

    created_at = models.DateTimeField(auto_now_add=True)
    
    password_reset_token = models.CharField(
    max_length=255,
    blank=True,
    null=True
)

    password_reset_expiry = models.DateTimeField(
        blank=True,
        null=True
    )

    def __str__(self):
        return self.username