from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin
import uuid
from django.core.mail import send_mail
from django.conf import settings
from .models import User
from django.utils import timezone
from datetime import timedelta
from .serializers import ReceptionistSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):

    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "role": request.user.role
    })
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):

    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not request.user.check_password(old_password):
        return Response(
            {"error": "Old password is incorrect"},
            status=400
        )

    request.user.set_password(new_password)
    request.user.save()

    return Response(
        {"message": "Password changed successfully"}
    )
    
@api_view(['POST'])
def forgot_password(request):

    email = request.data.get('email')

    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:

        return Response(
            {"error": "Email not found"},
            status=404
        )

    token = str(uuid.uuid4())

    user.password_reset_token = token

    user.password_reset_expiry = (
        timezone.now() + timedelta(hours=1)
    )

    user.save()

    reset_link = (
        f"http://localhost:3000/reset-password/{token}"
    )

    email_body = f"""
Hello {user.username},

Click below link to reset password:

{reset_link}

This link expires in 1 hour.
"""

    send_mail(
        subject="Reset Password",
        message=email_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email]
    )

    return Response({
        "message": "Password reset link sent successfully"
    })
    
@api_view(['POST'])
def logout_user(request):

    return Response({
        "message": "Logout successful"
    })
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def create_receptionist(request):

    serializer = ReceptionistSerializer(
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
def receptionist_list(request):

    receptionists = User.objects.filter(
        role='RECEPTIONIST'
    )

    serializer = ReceptionistSerializer(
        receptionists,
        many=True
    )

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def receptionist_detail(request, id):

    try:

        receptionist = User.objects.get(
            id=id,
            role='RECEPTIONIST'
        )

    except User.DoesNotExist:

        return Response(
            {"error": "Receptionist not found"},
            status=404
        )

    serializer = ReceptionistSerializer(
        receptionist
    )

    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdmin])
def update_receptionist(request, id):

    try:

        receptionist = User.objects.get(
            id=id,
            role='RECEPTIONIST'
        )

    except User.DoesNotExist:

        return Response(
            {"error": "Receptionist not found"},
            status=404
        )

    receptionist.username = request.data.get(
        'username',
        receptionist.username
    )

    receptionist.email = request.data.get(
        'email',
        receptionist.email
    )

    receptionist.save()

    return Response({
        "message": "Receptionist updated successfully"
    })
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdmin])
def delete_receptionist(request, id):

    try:

        receptionist = User.objects.get(
            id=id,
            role='RECEPTIONIST'
        )

    except User.DoesNotExist:

        return Response(
            {"error": "Receptionist not found"},
            status=404
        )

    receptionist.delete()

    return Response({
        "message": "Receptionist deleted successfully"
    })