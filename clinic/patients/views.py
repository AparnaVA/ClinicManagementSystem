from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from .models import Patient
from .serializers import PatientSerializer
from django.db.models import Q

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_patient(request):

    serializer = PatientSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_list(request):

    patients = Patient.objects.all().order_by('-id')

    serializer = PatientSerializer(
        patients,
        many=True
    )

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_detail(request, id):

    try:
        patient = Patient.objects.get(id=id)

    except Patient.DoesNotExist:

        return Response(
            {"error": "Patient not found"},
            status=404
        )

    serializer = PatientSerializer(patient)

    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_patient(request, id):

    try:
        patient = Patient.objects.get(id=id)

    except Patient.DoesNotExist:

        return Response(
            {"error": "Patient not found"},
            status=404
        )

    serializer = PatientSerializer(
        patient,
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
@permission_classes([IsAuthenticated])
def delete_patient(request, id):

    try:
        patient = Patient.objects.get(id=id)

    except Patient.DoesNotExist:

        return Response(
            {"error": "Patient not found"},
            status=404
        )

    patient.delete()

    return Response({
        "message": "Patient deleted successfully"
    })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_patient(request):

    keyword = request.GET.get('search')

    patients = Patient.objects.filter(
        Q(name__icontains=keyword) |
        Q(phone__icontains=keyword) |
        Q(email__icontains=keyword)
    )

    serializer = PatientSerializer(
        patients,
        many=True
    )

    return Response(serializer.data)