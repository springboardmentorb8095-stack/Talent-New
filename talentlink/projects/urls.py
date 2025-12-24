from django.urls import path
from django.urls import path
from .views import ProjectListCreateView, ProjectDetailView

urlpatterns = [
    path('', ProjectListCreateView.as_view()),
    path('<int:pk>/', ProjectDetailView.as_view()),
]
# from . import views

# urlpatterns = [
#     path('', views.index, name='accounts-index'),
# ]
