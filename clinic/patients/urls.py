from django.urls import path
from patients import views

urlpatterns = [

    path('create/', views.create_patient ),

    path( 'list/', views.patient_list),

    path('<int:id>/',views.patient_detail),

    path('update/<int:id>/', views.update_patient),

    path('delete/<int:id>/', views.delete_patient),

    path('search/', views.search_patient),
]