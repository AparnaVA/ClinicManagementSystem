from django.contrib import admin
from .models import Doctor, DoctorAvailability, DoctorLeave


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
    
    
@admin.register(DoctorAvailability)
class DoctorAvailabilityAdmin(admin.ModelAdmin):

    list_display = (
        'doctor',
        'working_day',
        'start_time',
        'end_time'
    )


@admin.register(DoctorLeave)
class DoctorLeaveAdmin(admin.ModelAdmin):

    list_display = (
        'doctor',
        'leave_date',
        'reason'
    )