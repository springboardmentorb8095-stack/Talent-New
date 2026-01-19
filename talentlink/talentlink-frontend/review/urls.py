
from django.urls import path
from .views import AddReviewView

urlpatterns = [
    path('reviews/add/<int:contract_id>/', AddReviewView.as_view(), name='add-review'),
]
