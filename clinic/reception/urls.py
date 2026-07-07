from django.urls import path
from reception import views

urlpatterns = [

    path('create/', views.create_reception ),

    path( 'list/', views.reception_list),

    path('<int:id>/',views.reception_detail),

    path('update/<int:id>/', views.update_reception),

    path('delete/<int:id>/', views.delete_reception),

    path('search/', views.search_reception),
]