from django.db import models


class Reception(models.Model):

    reception_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True
    )

    name = models.CharField(
        max_length=100
    )

    email = models.EmailField()

    registration_date = models.DateField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.patient_id} - {self.name}"
    
    def save(self, *args, **kwargs):

        if not self.patient_id:

            last_reception = Reception.objects.order_by(
                '-id'
            ).first()

            if last_reception:

                last_id = int(
                    last_reception.patient_id[3:]
                )

                new_id = last_id + 1

            else:
                new_id = 1

            self.patient_id = (
                f'RECP{new_id:04d}'
            )

        super().save(*args, **kwargs)