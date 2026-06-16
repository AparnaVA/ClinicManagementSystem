from datetime import date

from django.db.models import Count, Sum

from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import  IsAuthenticated

from rest_framework.response import Response

from appointments.models import Appointment
from patients.models import Patient
from doctors.models import Doctor

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_report(request):

    today = date.today()

    appointments_booked = Appointment.objects.filter(
        appointment_date=today
    ).count()

    completed = Appointment.objects.filter(
        appointment_date=today,
        status='COMPLETED'
    ).count()

    cancelled = Appointment.objects.filter(
        appointment_date=today,
        status='CANCELLED'
    ).count()

    no_show = Appointment.objects.filter(
        appointment_date=today,
        status='NO_SHOW'
    ).count()

    return Response({

        "date": today,

        "appointments_booked":
        appointments_booked,

        "completed":
        completed,

        "cancelled":
        cancelled,

        "no_show":
        no_show
    })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_report(request):

    today = date.today()

    appointments = Appointment.objects.filter(
        appointment_date__year=today.year,
        appointment_date__month=today.month
    )
    most_visited = (
        appointments
        .values(
            'doctor__name'
        )
        .annotate(
            total=Count('id')
        )
        .order_by('-total')
        .first()
    )
    revenue = (
        appointments.filter(
            status='COMPLETED'
        )
        .aggregate(
            total=Sum(
                'consultation_fee'
            )
        )
    )
    return Response({

        "month":
        today.strftime('%B'),

        "appointments":
        appointments.count(),

        "most_visited_doctor":
        most_visited,

        "total_revenue":
        revenue['total'] or 0
    })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_report(request, id):

    try:

        patient = Patient.objects.get(
            id=id
        )

    except Patient.DoesNotExist:

        return Response(
            {
                "error":
                "Patient not found"
            },
            status=404
        )
    appointments = Appointment.objects.filter(
        patient=patient
    ).order_by(
        '-appointment_date'
    )
    last_visit = appointments.first()
    
    history = []

    for appointment in appointments:

        history.append({

            "doctor":
            appointment.doctor.name,

            "date":
            appointment.appointment_date,

            "status":
            appointment.status,

            "fee":
            appointment.consultation_fee
        })
        
    return Response({

        "patient":
        patient.name,

        "total_visits":
        appointments.count(),

        "last_visit":
        (
            last_visit.appointment_date
            if last_visit else None
        ),

        "appointment_history":
        history
    })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_report(request, id):

    try:

        doctor = Doctor.objects.get(
            id=id
        )

    except Doctor.DoesNotExist:

        return Response(
            {
                "error":
                "Doctor not found"
            },
            status=404
        )
    
    appointments = Appointment.objects.filter(
        doctor=doctor
    )
    
    completed = appointments.filter(
        status='COMPLETED'
    ).count()
    
    revenue = appointments.filter(
        status='COMPLETED'
    ).aggregate(
        total=Sum(
            'consultation_fee'
        )
    )
    
    return Response({

        "doctor":
        doctor.name,

        "appointments":
        appointments.count(),

        "completed_consultations":
        completed,

        "revenue_generated":
        revenue['total'] or 0
    })