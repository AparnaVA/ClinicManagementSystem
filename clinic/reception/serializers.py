from rest_framework import serializers
from .models import Reception


class ReceptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reception

        fields = '__all__'