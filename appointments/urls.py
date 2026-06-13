from django.urls import path

from appointments import views

urlpatterns = [

    path(
        'create/',
        views.create_appointment
    ),

    path(
        'list/',
        views.appointment_list
    ),

    path(
        'status/<int:id>/',
        views.update_appointment_status
    ),
    path(
        'available-slots/',
        views.available_slots
),
]