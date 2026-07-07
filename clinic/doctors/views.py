from rest_framework.decorators import (api_view, permission_classes)

from rest_framework.permissions import (IsAuthenticated)

from rest_framework.response import Response

from django.db.models import Q

from .models import Doctor, DoctorAvailability, DoctorLeave
from .serializers import DoctorSerializer, DoctorAvailabilitySerializer, DoctorLeaveSerializer

from accounts.permissions import IsAdmin, IsReceptionist

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def create_doctor(request):

    serializer = DoctorSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=201
        )

    return Response(
        serializer.errors,
        status=400
    )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def doctor_list(request):

    doctors = Doctor.objects.all().order_by('-id')

    serializer = DoctorSerializer(
        doctors,
        many=True
    )

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_dropdown(request):

    doctors = Doctor.objects.filter(
        status='ACTIVE'
    )

    serializer = DoctorSerializer(
        doctors,
        many=True
    )

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def doctor_detail(request, id):

    try:

        doctor = Doctor.objects.get(id=id)

    except Doctor.DoesNotExist:

        return Response(
            {"error": "Doctor not found"},
            status=404
        )

    serializer = DoctorSerializer(doctor)

    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdmin])
def update_doctor(request, id):

    try:

        doctor = Doctor.objects.get(id=id)

    except Doctor.DoesNotExist:

        return Response(
            {"error": "Doctor not found"},
            status=404
        )

    serializer = DoctorSerializer(
        doctor,
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=400
    )
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdmin])
def delete_doctor(request, id):

    try:

        doctor = Doctor.objects.get(id=id)

    except Doctor.DoesNotExist:

        return Response(
            {"error": "Doctor not found"},
            status=404
        )

    doctor.delete()

    return Response({
        "message": "Doctor deleted successfully"
    })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def search_doctor(request):

    keyword = request.GET.get('search')

    doctors = Doctor.objects.filter(
        Q(name__icontains=keyword) |
        Q(specialization__icontains=keyword)
    )

    serializer = DoctorSerializer(
        doctors,
        many=True
    )

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def create_availability(request):
    
    doctor = request.data.get('doctor')

    working_day = request.data.get(
        'working_day'
    )

    availability_exists = (
        DoctorAvailability.objects.filter(
            doctor_id=doctor,
            working_day=working_day
        ).exists()
    )

    if availability_exists:

        return Response(
            {
                "error":
                "Availability already exists for this day"
            },
            status=400
        )
    
    start_time = request.data.get(
    'start_time'
    )

    end_time = request.data.get(
    'end_time'
    )

    if start_time >= end_time:

        return Response(
            {
                "error":
                "End time must be greater than start time"
            },
            status=400
        )

    serializer = DoctorAvailabilitySerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=201
        )

    return Response(
        serializer.errors,
        status=400
    )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def availability_list(request):

    availabilities = (
        DoctorAvailability.objects.all()
    )

    serializer = (
        DoctorAvailabilitySerializer(
            availabilities,
            many=True
        )
    )

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_availability(request, id):

    try:

        availability = (
            DoctorAvailability.objects.get(
                id=id
            )
        )

    except DoctorAvailability.DoesNotExist:

        return Response(
            {
                "error":
                "Availability not found"
            },
            status=404
        )

    availability.delete()

    return Response(
        {
            "message":
            "Availability deleted"
        }
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def create_leave(request):
    
    doctor = request.data.get('doctor')
    
    leave_date = request.data.get('leave_date')
    
    leave_exists = (DoctorLeave.objects.filter( doctor_id=doctor, leave_date=leave_date).exists())
    
    if leave_exists:
        return Response(
            {
                "error":
                "Leave already exists for this date"
            },
            status=400
        )

    serializer = DoctorLeaveSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=201
        )

    return Response(
        serializer.errors,
        status=400
    )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leave_list(request):

    leaves = DoctorLeave.objects.all()

    serializer = DoctorLeaveSerializer(
        leaves,
        many=True
    )

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_leave(request, id):

    try:

        leave = (
            DoctorLeave.objects.get(
                id=id
            )
        )

    except DoctorLeave.DoesNotExist:

        return Response(
            {
                "error":
                "Leave not found"
            },
            status=404
        )

    leave.delete()

    return Response(
        {
            "message":
            "Leave deleted"
        }
    )