from django.conf import settings
from django.shortcuts import render

import content

SECTIONS = (
    ("work", "Work"),
    ("skills", "Skills"),
    ("about", "About"),
    ("experience", "Experience"),
    ("education", "Education"),
    ("research", "Research"),
    ("certificates", "Certificates"),
    ("contact", "Contact"),
)


def home(request):
    context = {
        "person": content.PERSON,
        "profile_image_path": settings.PROFILE_IMAGE_PATH or content.PERSON.image_path,
        "hero": content.HERO,
        "projects": content.PROJECTS,
        "skill_groups": content.SKILL_GROUPS,
        "about": content.ABOUT,
        "focus_cards": content.FOCUS_CARDS,
        "experience": content.EXPERIENCE,
        "education": content.EDUCATION,
        "research": content.RESEARCH,
        "certificates": content.CERTIFICATES,
        "contact_headline": content.CONTACT_HEADLINE,
        "sections": [(i + 1, slug, label) for i, (slug, label) in enumerate(SECTIONS)],
    }
    return render(request, "home.html", context)


def not_found(request, exception=None):
    return render(request, "404.html", status=404)
