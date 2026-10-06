from rest_framework import serializers

from .models import (
    Skill,
    ResumeSkill,
    JobSkill,
    SkillMatch,
)


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


class ResumeSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeSkill
        fields = "__all__"


class JobSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSkill
        fields = "__all__"


class SkillMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillMatch
        fields = "__all__"