from rest_framework import viewsets
from .models import Interview, InterviewQuestion
from .serializers import (
    InterviewSerializer,
    InterviewQuestionSerializer
)


class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer


class InterviewQuestionViewSet(viewsets.ModelViewSet):
    queryset = InterviewQuestion.objects.all()
    serializer_class = InterviewQuestionSerializer