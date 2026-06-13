from django.contrib import admin
from .models import ClinicSettings


@admin.register(ClinicSettings)
class ClinicSettingsAdmin(admin.ModelAdmin):

    list_display = (
        'clinic_name',
        'phone',
        'slot_duration'
    )