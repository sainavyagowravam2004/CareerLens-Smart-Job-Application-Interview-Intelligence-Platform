from django.urls import path
from .views import InterviewViewSet, InterviewQuestionViewSet


interview_list = InterviewViewSet.as_view({
    "get": "list",
    "post": "create",
})

interview_detail = InterviewViewSet.as_view({
    "get": "retrieve",
    "put": "update",
    "patch": "partial_update",
    "delete": "destroy",
})


question_list = InterviewQuestionViewSet.as_view({
    "get": "list",
    "post": "create",
})

question_detail = InterviewQuestionViewSet.as_view({
    "get": "retrieve",
    "put": "update",
    "patch": "partial_update",
    "delete": "destroy",
})


urlpatterns = [
    path("", interview_list),
    path("<int:pk>/", interview_detail),

    path("questions/", question_list),
    path("questions/<int:pk>/", question_detail),
]