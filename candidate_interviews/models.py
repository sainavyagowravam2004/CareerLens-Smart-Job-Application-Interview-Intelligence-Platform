from django.db import models
from applications.models import Application


class Interview(models.Model):

    STATUS_CHOICES = [
        ("Scheduled", "Scheduled"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
        ("Pending", "Pending"),
    ]

    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="interviews"
    )

    round_name = models.CharField(max_length=100)

    scheduled_date = models.DateTimeField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    feedback = models.TextField(blank=True)

    def __str__(self):
        return f"{self.round_name} - {self.application.job.title}"


class InterviewQuestion(models.Model):

    DIFFICULTY_CHOICES = [
        ("Easy", "Easy"),
        ("Medium", "Medium"),
        ("Hard", "Hard"),
    ]

    interview = models.ForeignKey(
        Interview,
        on_delete=models.CASCADE,
        related_name="questions"
    )

    question = models.TextField()

    topic = models.CharField(max_length=100)

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default="Medium"
    )

    answer = models.TextField(blank=True)

    def __str__(self):
        return self.question[:50]