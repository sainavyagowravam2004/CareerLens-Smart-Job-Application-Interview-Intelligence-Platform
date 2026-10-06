from django.db import models
from django.contrib.auth.models import User
from jobs.models import Job


class Application(models.Model):

    STATUS_CHOICES = [
        ("Saved", "Saved"),
        ("Applied", "Applied"),
        ("Shortlisted", "Shortlisted"),
        ("Assessment", "Assessment"),
        ("Technical Interview", "Technical Interview"),
        ("HR Interview", "HR Interview"),
        ("Selected", "Selected"),
        ("Rejected", "Rejected"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Saved"
    )

    applied_date = models.DateField(
        null=True,
        blank=True
    )

    notes = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.job.title}"