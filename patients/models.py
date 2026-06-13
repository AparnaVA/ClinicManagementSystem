from django.db import models


class Patient(models.Model):

    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )

    patient_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True
    )

    name = models.CharField(
        max_length=100
    )

    age = models.PositiveIntegerField()

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )

    phone = models.CharField(
        max_length=15
    )

    email = models.EmailField()

    address = models.TextField()

    emergency_contact = models.CharField(
        max_length=15
    )

    registration_date = models.DateField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.patient_id} - {self.name}"
    
    def save(self, *args, **kwargs):

        if not self.patient_id:

            last_patient = Patient.objects.order_by(
                '-id'
            ).first()

            if last_patient:

                last_id = int(
                    last_patient.patient_id[3:]
                )

                new_id = last_id + 1

            else:
                new_id = 1

            self.patient_id = (
                f'PAT{new_id:04d}'
            )

        super().save(*args, **kwargs)