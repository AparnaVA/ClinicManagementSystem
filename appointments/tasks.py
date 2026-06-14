from celery import shared_task

from django.core.mail import send_mail

from appointments.models import Appointment

@shared_task
def send_appointment_created_email( appointment_id):

    appointment = (
        Appointment.objects.get(
            id=appointment_id
        )
    )

    send_mail(

        subject='Appointment Booked',

        message=f'''
Dear {appointment.patient.name},

Your appointment has been booked.

Doctor:
{appointment.doctor.name}

Date:
{appointment.appointment_date}

Time:
{appointment.appointment_time}
''',

        from_email=None,

        recipient_list=[
            appointment.patient.email
        ]
    )
    

@shared_task
def send_appointment_cancelled_email(
    appointment_id
):

    appointment = (
        Appointment.objects.get(
            id=appointment_id
        )
    )

    send_mail(

        subject='Appointment Cancelled',

        message=f'''
Dear {appointment.patient.name},

Your appointment has been cancelled.
''',

        from_email=None,

        recipient_list=[
            appointment.patient.email
        ]
    )