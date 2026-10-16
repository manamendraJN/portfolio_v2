from django.conf import settings


def site(request):
    """Optional personal details. Empty values mean the matching UI is not rendered."""
    base = settings.SITE_URL or request.build_absolute_uri("/").rstrip("/")
    return {
        "contact_email": settings.CONTACT_EMAIL,
        "cv_url": settings.CV_URL,
        "graduation_date": settings.GRADUATION_DATE,
        "site_base_url": base,
    }
