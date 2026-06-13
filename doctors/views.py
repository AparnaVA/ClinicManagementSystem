from rest_framework.decorators import (api_view, permission_classes)

from rest_framework.permissions import (IsAuthenticated)

from rest_framework.response import Response

from django.db.models import Q

from .models import Doctor
from .serializers import DoctorSerializer

from accounts.permissions import IsAdmin

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