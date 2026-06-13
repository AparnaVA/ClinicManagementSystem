from django.urls import path
from rest_framework_simplejwt.views import ( TokenObtainPairView, TokenRefreshView )
from accounts import views

urlpatterns = [
    path(
        'login/',
        TokenObtainPairView.as_view(),
        name='login'
    ),

    path(
        'refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
    path(
        'me/',
        views.current_user,
        name='current_user'
    ),
    path(
        'change-password/',
        views.change_password,
        name='change-password'
    ),
    path(
        'forgot-password/',
        views.forgot_password,
        name='forgot_password'
    ),
    path(
        'logout/',
        views.logout_user,
        name='logout'
),
]   