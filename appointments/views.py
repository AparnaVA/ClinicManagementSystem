from datetime import date

from rest_framework.decorators import ( api_view, permission_classes)

from rest_framework.permissions import (IsAuthenticated)

from rest_framework.response import Response

from .models import Appointment
from .serializers import AppointmentSerializer

from doctors.models import Doctor, DoctorAvailability, DoctorLeave

from datetime import datetime, timedelta

from settings_app.models import ClinicSettings

from .tasks import send_appointment_created_email, send_appointment_cancelled_email

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment(request):

    serializer = AppointmentSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=400
        )

    doctor = serializer.validated_data['doctor']

    appointment_date = serializer.validated_data['appointment_date' ]

    appointment_time =  serializer.validated_data[ 'appointment_time']
    
    if appointment_date < date.today():

        return Response(
            {
                "error":
                "Past dates are not allowed"
            },
            status=400
        )
        
    if doctor.status != "ACTIVE":

        return Response(
            {
                "error":
                "Doctor is inactive"
            },
            status=400
        )
    
    weekday = (appointment_date
        .strftime('%A')
        .upper()
    )
    
    
    availability = (
        DoctorAvailability.objects.filter(
            doctor=doctor,
            working_day=weekday
        ).first()
    )

    if not availability:

        return Response(
            {
                "error":
                "Doctor not available "
                "on this day"
            },
            status=400
        )
        
    leave_exists = (
        DoctorLeave.objects.filter(
            doctor=doctor,
            leave_date=appointment_date
        ).exists()
    )

    if leave_exists:

        return Response(
            {
                "error":
                "Doctor is on leave"
            },
            status=400
        )
        
    if (
        appointment_time <
        availability.start_time
        or
        appointment_time >=
        availability.end_time
    ):

        return Response(
            {
                "error":
                "Doctor not available at this time"
            },
            status=400
        )

    clinic_settings = ClinicSettings.objects.first()

    if not clinic_settings:

        return Response(
            {
                "error":
                "Clinic settings not configured"
            },
            status=400
        )

    slot_duration = clinic_settings.slot_duration

    start_datetime = datetime.combine(
        appointment_date,
        availability.start_time
    )

    end_datetime = datetime.combine(
        appointment_date,
        availability.end_time
    )

    valid_slots = []

    current_time = start_datetime

    while current_time < end_datetime:

        valid_slots.append(
            current_time.strftime('%H:%M')
        )

        current_time += timedelta(
            minutes=slot_duration
        )

    selected_time = appointment_time.strftime(
        '%H:%M'
    )

    if selected_time not in valid_slots:

        return Response(
            {
                "error":
                "Invalid appointment slot"
            },
            status=400
        )
        
    appointment_exists = (
        Appointment.objects.filter(
            doctor=doctor,
            appointment_date=appointment_date,
            appointment_time=appointment_time
        ).exists()
    )

    if appointment_exists:

        return Response(
            {
                "error":
                "Slot already booked"
            },
            status=400
        )
        
    appointment = serializer.save(
    consultation_fee=doctor.consultation_fee
)
    send_appointment_created_email.delay(
    appointment.id
)

    return Response(
        serializer.data,
        status=201
    )
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def appointment_list(request):

    appointments = (
        Appointment.objects.all()
        .order_by(
            'appointment_date',
            'appointment_time'
        )
    )

    serializer = AppointmentSerializer(
        appointments,
        many=True
    )

    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_appointment_status( request, id ):

    try:

        appointment = (
            Appointment.objects.get(id=id)
        )

    except Appointment.DoesNotExist:

        return Response(
            {
                "error":
                "Appointment not found"
            },
            status=404
        )

    status_value = (
        request.data.get('status')
    )

    appointment.status = status_value

    appointment.save()
    
    if status_value == 'CANCELLED':

        send_appointment_cancelled_email.delay(
        appointment.id
    )

    return Response(
        {
            "message":
            "Status updated"
        }
    )
    

from datetime import datetime, timedelta

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_slots(request):

    doctor_id = request.GET.get('doctor_id')
    appointment_date = request.GET.get('appointment_date')

    try:
        doctor = Doctor.objects.get(id=doctor_id)

    except Doctor.DoesNotExist:

        return Response(
            {"error": "Doctor not found"},
            status=404
        )

    appointment_date_obj = datetime.strptime(
        appointment_date,
        "%Y-%m-%d"
    ).date()

    weekday = (
        appointment_date_obj
        .strftime('%A')
        .upper()
    )

    availability = DoctorAvailability.objects.filter(
        doctor=doctor,
        working_day=weekday
    ).first()

    if not availability:

        return Response(
            {"error": "Doctor unavailable"},
            status=400
        )

    leave_exists = DoctorLeave.objects.filter(
        doctor=doctor,
        leave_date=appointment_date_obj
    ).exists()

    if leave_exists:

        return Response(
            {"error": "Doctor is on leave"},
            status=400
        )

    clinic_settings = ClinicSettings.objects.first()

    slot_duration = clinic_settings.slot_duration

    start_datetime = datetime.combine(
        appointment_date_obj,
        availability.start_time
    )

    end_datetime = datetime.combine(
        appointment_date_obj,
        availability.end_time
    )

    slots = []

    current_time = start_datetime

    while current_time < end_datetime:

        slots.append(
            current_time.strftime('%H:%M')
        )

        current_time += timedelta(
            minutes=slot_duration
        )

    booked_slots = Appointment.objects.filter(
        doctor=doctor,
        appointment_date=appointment_date_obj
    ).values_list(
        'appointment_time',
        flat=True
    )

    booked_slots = [
        slot.strftime('%H:%M')
        for slot in booked_slots
    ]

    available_slots = [
        slot
        for slot in slots
        if slot not in booked_slots
    ]

    return Response({
        "doctor": doctor.name,
        "date": appointment_date,
        "available_slots": available_slots
    })
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_appointments(request):
        appointment_date = request.GET.get(
        'appointment_date'
    )

        doctor = request.GET.get(
        'doctor'
    )

        patient = request.GET.get(
        'patient'
    )

        status = request.GET.get(
        'status'
    )
        appointments = (
        Appointment.objects.all()
    )
        if appointment_date:

            appointments = (
                appointments.filter(
                    appointment_date = appointment_date
            )
        )
        if doctor:

            appointments = (
                appointments.filter(
                    doctor_id=doctor
            )
        )
        if patient:

            appointments = (
                appointments.filter(
                    patient_id=patient
            )
        )
        if status:

            appointments = (
                appointments.filter(
                    status=status
            )
        )
        serializer = (
        AppointmentSerializer(
            appointments,
            many=True
        )
    )

        return Response(
            serializer.data
    )