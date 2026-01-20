from django.urls import path
from .views import (
    ProjectListCreateView,
    ProjectDetailView,
    ProjectFilterView,
    MyProjectsView,
)

urlpatterns = [
    path("projects/", ProjectListCreateView.as_view(), name="project-list-create"),
    path("projects/filter/", ProjectFilterView.as_view(), name="project-filter"),
    path("projects/<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),

    # ✅ CLIENT DASHBOARD
    path("projects/my/", MyProjectsView.as_view(), name="my-projects"),
]
