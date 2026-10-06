from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentication
    path(
        "api/auth/",
        include("users.urls")
    ),

    # Jobs
    path(
        "api/jobs/",
        include("jobs.urls")
    ),

    # Resumes
    path(
        "api/resumes/",
        include("resumes.urls")
    ),

    # Applications
    path(
        "api/applications/",
        include("applications.urls")
    ),

    # Interviews
    path(
        "api/interviews/",
        include("candidate_interviews.urls")
    ),

    # Skill Matching
    path(
        "api/matching/",
        include("matching.urls")
    ),
]


urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)