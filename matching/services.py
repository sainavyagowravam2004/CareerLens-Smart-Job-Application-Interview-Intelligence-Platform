from .models import Skill, JobSkill, SkillMatch
from jobs.models import Job


def detect_skills_from_text(text):
    from .skill_extractor import SKILLS

    text = (text or "").lower()

    return [
        skill
        for skill in SKILLS
        if skill.lower() in text
    ]


def ensure_job_skills(job):
    detected = detect_skills_from_text(
        job.description
    )

    for skill_name in detected:
        skill, _ = Skill.objects.get_or_create(
            name=skill_name
        )

        JobSkill.objects.get_or_create(
            job=job,
            skill=skill,
            defaults={
                "is_required": True
            }
        )

    return detected


def calculate_skill_match(resume, job):

    # Make sure job skills exist
    ensure_job_skills(job)

    resume_skills = {
        name.lower(): name
        for name in resume.skills.values_list(
            "skill__name",
            flat=True
        )
    }

    job_skills = {
        name.lower(): name
        for name in job.skills.values_list(
            "skill__name",
            flat=True
        )
    }

    if not job_skills:
        return 0, [], []

    matched_keys = (
        set(resume_skills)
        & set(job_skills)
    )

    missing_keys = (
        set(job_skills)
        - set(resume_skills)
    )

    matched = [
        resume_skills[key]
        for key in matched_keys
    ]

    missing = [
        job_skills[key]
        for key in missing_keys
    ]

    percentage = (
        len(matched) / len(job_skills)
    ) * 100

    return (
        round(percentage, 2),
        sorted(matched),
        sorted(missing)
    )


def save_skill_match(resume, job):

    percentage, matched, missing = (
        calculate_skill_match(
            resume,
            job
        )
    )

    match, _ = SkillMatch.objects.update_or_create(
        resume=resume,
        job=job,
        defaults={
            "match_percentage": percentage,
            "matched_skills": ", ".join(matched),
            "missing_skills": ", ".join(missing),
        }
    )

    return match


def update_all_job_matches(resume):

    jobs = Job.objects.all()

    for job in jobs:
        save_skill_match(
            resume,
            job
        )