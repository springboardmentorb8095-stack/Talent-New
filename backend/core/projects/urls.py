from django.urls import path
from .views import ClientProjectListCreateView, FreelancerProjectListView
from proposals.views import ProjectProposalsView

urlpatterns = [
    path("my-projects/", ClientProjectListCreateView.as_view()),
    path("browse/", FreelancerProjectListView.as_view()),
    path("<int:project_id>/proposals/", ProjectProposalsView.as_view()),
]
