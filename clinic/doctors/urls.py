from django.urls import path
from doctors import views

urlpatterns = [

    path('create/', views.create_doctor),

    path('list/', views.doctor_list),

    path('<int:id>/', views.doctor_detail),

    path('update/<int:id>/', views.update_doctor),

    path('delete/<int:id>/', views.delete_doctor),

    path('search/', views.search_doctor),
    
    path('availability/create/',views.create_availability),

    path('availability/list/',views.availability_list),
    
    path('availability/delete/<int:id>/', views.delete_availability),

    path('leave/create/',views.create_leave),

    path('leave/list/',views.leave_list),
    
    path('leave/delete/<int:id>/', views.delete_leave ),
    
    path('dropdown/', views.doctor_dropdown ),
]