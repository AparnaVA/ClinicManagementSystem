from django.urls import path

from reports import views


urlpatterns = [

    path( 'daily/', views.daily_report ),

    path('monthly/', views.monthly_report ),

    path('patient/<int:id>/', views.patient_report ),

    path('doctor/<int:id>/',views.doctor_report),
]