from django.db import models
from resumes.models import Resume
from jobs.models import Job


class Skill(models.Model):

    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


class ResumeSkill(models.Model):

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="skills"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="resume_skills"
    )

    confidence = models.FloatField(
        default=1.0
    )

    def __str__(self):
        return f"{self.resume} - {self.skill}"


class JobSkill(models.Model):

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="skills"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="job_skills"
    )

    is_required = models.BooleanField(
        default=True
    )

    def __str__(self):
        return f"{self.job} - {self.skill}"


class SkillMatch(models.Model):

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="matches"
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="resume_matches"
    )

    match_percentage = models.FloatField(
        default=0.0
    )

    matched_skills = models.TextField(
        blank=True
    )

    missing_skills = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.resume} → {self.job} ({self.match_percentage}%)"