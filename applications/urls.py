from django.urls import path
from .views import ApplicationViewSet


application_list = ApplicationViewSet.as_view({
    "get": "list",
    "post": "create",
})

application_detail = ApplicationViewSet.as_view({
    "get": "retrieve",
    "put": "update",
    "patch": "partial_update",
    "delete": "destroy",
})


urlpatterns = [
    path("", application_list),
    path("<int:pk>/", application_detail),
]