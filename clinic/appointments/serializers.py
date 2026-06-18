from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(
    serializers.ModelSerializer
):

    patient_name = serializers.ReadOnlyField(
        source='patient.name'
    )

    doctor_name = serializers.ReadOnlyField(
        source='doctor.name'
    )

    class Meta:

        model = Appointment

        fields = [
            'id',
            'patient',
            'doctor',
            'patient_name',
            'doctor_name',
            'appointment_date',
            'appointment_time',
            'reason',
            'status'
        ]