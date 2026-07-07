from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from .models import Reception
from .serializers import ReceptionSerializer
from django.db.models import Q

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reception(request):

    serializer = ReceptionSerializer(data=request.data)

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
def reception_list(request):

    reception = Reception.objects.all().order_by('-id')

    serializer = Reception(
        reception,
        many=True
    )

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reception_detail(request, id):

    try:
        reception = Reception.objects.get(id=id)

    except Reception.DoesNotExist:

        return Response(
            {"error": "Reception not found"},
            status=404
        )

    serializer = ReceptionSerializer(reception)

    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_reception(request, id):

    try:
        reception = Reception.objects.get(id=id)

    except Reception.DoesNotExist:

        return Response(
            {"error": "Patient not found"},
            status=404
        )

    serializer = ReceptionSerializer(
        reception,
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
def delete_reception(request, id):

    try:
        reception = Reception.objects.get(id=id)

    except Reception.DoesNotExist:

        return Response(
            {"error": "Reception not found"},
            status=404
        )

    reception.delete()

    return Response({
        "message": "Reception deleted successfully"
    })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_reception(request):

    keyword = request.GET.get('search')

    reception = Reception.objects.filter(
        Q(name__icontains=keyword) |
        Q(phone__icontains=keyword) |
        Q(email__icontains=keyword)
    )

    serializer = ReceptionSerializer(
        reception,
        many=True
    )

    return Response(serializer.data)