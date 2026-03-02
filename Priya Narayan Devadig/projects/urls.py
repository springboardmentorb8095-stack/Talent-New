from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProjectListCreateView.as_view(), name='project-list-create'),
    path('public/', views.PublicProjectListView.as_view(), name='project-public-list'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='project-detail'),
]