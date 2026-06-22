from django.db import models


class Doctor(models.Model):

    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    )

    doctor_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True
    )

    name = models.CharField(
        max_length=100
    )

    specialization = models.CharField(
        max_length=100
    )

    phone = models.CharField(
        max_length=15
    )

    email = models.EmailField()

    qualification = models.CharField(
        max_length=200
    )

    consultation_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    joining_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE'
    )

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):

        if not self.doctor_id:

            last_doctor = Doctor.objects.order_by(
                '-id'
            ).first()

            if last_doctor:

                last_id = int(
                    last_doctor.doctor_id[3:]
                )

                new_id = last_id + 1

            else:

                new_id = 1

            self.doctor_id = (
                f'DOC{new_id:04d}'
            )

        super().save(*args, **kwargs)
        
    
class DoctorAvailability(models.Model):

    DAY_CHOICES = (
        ('MONDAY', 'Monday'),
        ('TUESDAY', 'Tuesday'),
        ('WEDNESDAY', 'Wednesday'),
        ('THURSDAY', 'Thursday'),
        ('FRIDAY', 'Friday'),
        ('SATURDAY', 'Saturday'),
        ('SUNDAY', 'Sunday'),
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='availabilities'
    )

    working_day = models.CharField(
        max_length=20,
        choices=DAY_CHOICES
    )

    start_time = models.TimeField()

    end_time = models.TimeField()
    
    class Meta:

        unique_together = (
            'doctor',
            'working_day'
        )

    def __str__(self):
        return f"{self.doctor.name} - {self.working_day}"
    
    
class DoctorLeave(models.Model):

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='leaves'
    )

    leave_date = models.DateField()

    reason = models.TextField()
    
    class Meta:

        unique_together = (
            'doctor',
            'leave_date'
        )

    def __str__(self):
        return (
            f"{self.doctor.name} - {self.leave_date}"
        )