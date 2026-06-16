from rest_framework.decorators import ( api_view, permission_classes)

from rest_framework.permissions import (IsAuthenticated)

from rest_framework.response import Response

from .models import ClinicSettings
from .serializers import ( ClinicSettingsSerializer )

from accounts.permissions import IsAdmin

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def create_settings(request):

    if ClinicSettings.objects.exists():

        return Response({
            "error":
            "Settings already exist"
        }, status=400)

    serializer = (
        ClinicSettingsSerializer(
            data=request.data
        )
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
def clinic_settings(request):

    settings = (
        ClinicSettings.objects.first()
    )

    serializer = (
        ClinicSettingsSerializer(
            settings
        )
    )

    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdmin])
def update_settings(request):

    settings = (
        ClinicSettings.objects.first()
    )

    serializer = (
        ClinicSettingsSerializer(
            settings,
            data=request.data
        )
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data
        )

    return Response(
        serializer.errors,
        status=400
    )
    
