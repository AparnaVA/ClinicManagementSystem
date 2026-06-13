from django.contrib import admin
from .models import Doctor


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):

    list_display = (
        'doctor_id',
        'name',
        'specialization',
        'phone',
        'status'
    )

    search_fields = (
        'doctor_id',
        'name',
        'specialization'
    )