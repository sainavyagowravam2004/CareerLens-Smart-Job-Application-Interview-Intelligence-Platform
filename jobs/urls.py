from django.urls import path
from .views import JobViewSet


job_list = JobViewSet.as_view({
    "get": "list",
    "post": "create",
})

job_detail = JobViewSet.as_view({
    "get": "retrieve",
    "put": "update",
    "patch": "partial_update",
    "delete": "destroy",
})


urlpatterns = [
    path("", job_list),
    path("<int:pk>/", job_detail),
]