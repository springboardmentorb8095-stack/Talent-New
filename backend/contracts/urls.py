from django.urls import path
from .views import ContractListView, ContractUpdateView

urlpatterns = [
    path("", ContractListView.as_view()),
    path("<int:pk>/", ContractUpdateView.as_view()),
]
