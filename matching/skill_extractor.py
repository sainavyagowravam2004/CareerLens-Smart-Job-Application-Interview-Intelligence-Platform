from .models import Skill, ResumeSkill


SKILLS = [
    "Python",
    "Django",
    "Flask",
    "SQL",
    "MySQL",
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "REST API",
    "Git",
    "GitHub",
    "Machine Learning",
    "Artificial Intelligence",
    "Cyber Security",
    "Linux",
]


def extract_skills(resume):
    text = resume.extracted_text.lower()

    found_skills = []

    for skill_name in SKILLS:
        if skill_name.lower() in text:
            skill, _ = Skill.objects.get_or_create(
                name=skill_name
            )

            ResumeSkill.objects.get_or_create(
                resume=resume,
                skill=skill
            )

            found_skills.append(skill_name)

    return found_skills