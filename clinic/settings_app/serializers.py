from rest_framework import serializers
from .models import ClinicSettings


class ClinicSettingsSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = ClinicSettings
        fields = '__all__'