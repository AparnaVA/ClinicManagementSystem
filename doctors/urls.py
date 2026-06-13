from django.urls import path
from doctors import views

urlpatterns = [

    path('create/', views.create_doctor),

    path('list/', views.doctor_list),

    path('<int:id>/', views.doctor_detail),

    path('update/<int:id>/', views.update_doctor),

    path('delete/<int:id>/', views.delete_doctor),

    path('search/', views.search_doctor),
]