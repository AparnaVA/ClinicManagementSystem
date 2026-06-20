from rest_framework import serializers
from .models import Doctor, DoctorAvailability, DoctorLeave


class DoctorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Doctor
        fields = '__all__'
        

class DoctorAvailabilitySerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(
        source='doctor.name',
        read_only=True
    )
    
    class Meta:
        model = DoctorAvailability
        fields = '__all__'
        
        
class DoctorLeaveSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(
        source='doctor.name',
        read_only=True
    )

    class Meta:
        model = DoctorLeave
        fields = '__all__'