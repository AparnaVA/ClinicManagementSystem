from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import uuid
from django.core.mail import send_mail
from django.conf import settings
from .models import User
from django.utils import timezone
from datetime import timedelta

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