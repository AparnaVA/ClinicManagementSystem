from django.db import models


class ClinicSettings(models.Model):

    SLOT_CHOICES = (
        (15, '15 Minutes'),
        (30, '30 Minutes'),
        (45, '45 Minutes'),
    )

    clinic_name = models.CharField(
        max_length=200
    )

    address = models.TextField()

    phone = models.CharField(
        max_length=15
    )

    slot_duration = models.IntegerField(
        choices=SLOT_CHOICES,
        default=30
    )

    def __str__(self):
        return self.clinic_name