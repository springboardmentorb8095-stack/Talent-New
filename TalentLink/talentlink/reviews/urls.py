from django.urls import path
from .views import (
    ReviewCreateView,
    ReviewListView,
    UserReviewListView,
    ReviewDetailView,
    ReviewStatsView,
    ReviewableContractsView,
    ContractReviewDetailView
)

urlpatterns = [
    path('reviews/', ReviewListView.as_view(), name='review-list'),
    path('reviews/create/', ReviewCreateView.as_view(), name='review-create'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('reviews/user/<int:user_id>/', UserReviewListView.as_view(), name='user-reviews'),
    path('reviews/user/<int:user_id>/stats/', ReviewStatsView.as_view(), name='user-review-stats'),
    path('reviews/reviewable-contracts/', ReviewableContractsView.as_view(), name='reviewable-contracts'),
    path('reviews/contract/<int:contract_id>/', ContractReviewDetailView.as_view(), name='contract-review'),
]