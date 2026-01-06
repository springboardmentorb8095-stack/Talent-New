from django.urls import path
from .views import RegisterView, EmailOrUsernameLoginView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", EmailOrUsernameLoginView.as_view(), name="login"),
]
