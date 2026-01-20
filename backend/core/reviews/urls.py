from django.urls import path
from .views import CreateReviewView, GetReviewView

urlpatterns = [
    path("<int:contract_id>/", CreateReviewView.as_view(), name="create-review"),
    path("<int:contract_id>/view/", GetReviewView.as_view(), name="get-review"),
]
    