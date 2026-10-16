from django.urls import path

from portfolio import views

urlpatterns = [
    path("", views.home, name="home"),
]
handler404 = "portfolio.views.not_found"
