from django.urls import path
from .views import register, login, me, logout

urlpatterns = [
    path("register/", register),
    path("login/", login),
    path("me/", me),
    path("logout/", logout),
]