from datetime import date

from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework.response import Response

from patients.models import Patient
from doctors.models import Doctor
from appointments.models import Appointment

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):

    total_patients = Patient.objects.count()

    total_doctors = Doctor.objects.count()

    today_appointments = Appointment.objects.filter(
        appointment_date=date.today()
    ).count()

    completed_appointments = Appointment.objects.filter(
        status='COMPLETED'
    ).count()

    cancelled_appointments = Appointment.objects.filter(
        status='CANCELLED'
    ).count()

    no_show_appointments = Appointment.objects.filter(
        status='NO_SHOW'
    ).count()

    upcoming_appointments = (
        Appointment.objects.filter(
            appointment_date__gte=date.today(),
            status='SCHEDULED'
        )
        .order_by(
            'appointment_date',
            'appointment_time'
        )[:5]
    )

    upcoming_data = []

    for appointment in upcoming_appointments:

        upcoming_data.append({

            "appointment_id":
            appointment.id,

            "patient":
            appointment.patient.name,

            "doctor":
            appointment.doctor.name,

            "date":
            appointment.appointment_date,

            "time":
            appointment.appointment_time,

            "status":
            appointment.status
        })

    return Response({

        "total_patients":
        total_patients,

        "total_doctors":
        total_doctors,

        "today_appointments":
        today_appointments,

        "completed_appointments":
        completed_appointments,

        "cancelled_appointments":
        cancelled_appointments,

        "no_show_appointments":
        no_show_appointments,

        "upcoming_appointments":
        upcoming_data
    })