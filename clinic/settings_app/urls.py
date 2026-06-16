from django.urls import path

from settings_app import views

urlpatterns = [

    path(
        'create/',
        views.create_settings
    ),

    path(
        'view/',
        views.clinic_settings
    ),

    path(
        'update/',
        views.update_settings
    ),
]