from django.urls import path
from .views import ReviewCreateView, FreelancerReviewsView

urlpatterns = [
    path("create/", ReviewCreateView.as_view(), name="review-create"),
    path(
        "freelancer/<int:freelancer_id>/",
        FreelancerReviewsView.as_view(),
        name="freelancer-reviews"
    ),
]
