from functools import lru_cache
from pathlib import Path

from django import template
from django.conf import settings
from django.utils.html import format_html
from django.utils.safestring import mark_safe

register = template.Library()

ICON_DIR = Path(settings.BASE_DIR) / "static" / "icons"


@lru_cache(maxsize=None)
def _read_icon(name: str) -> str:
    path = ICON_DIR / f"{name}.svg"
    if not path.is_file():
        return ""
    svg = path.read_text(encoding="utf-8")
    # Strip the Lucide licence comment and fixed size so CSS controls it.
    start = svg.find("<svg")
    svg = svg[start:] if start >= 0 else svg
    svg = svg.replace('width="24"', "", 1).replace('height="24"', "", 1)
    svg = svg.replace("<svg", '<svg class="icon" aria-hidden="true" focusable="false"', 1)
    return svg


@register.simple_tag
def icon(name: str):
    """Inline a static Lucide SVG: {% icon "arrow-up-right" %}."""
    return mark_safe(_read_icon(name))


@register.simple_tag
def imagekit_url(path: str):
    endpoint = settings.IMAGEKIT_URL_ENDPOINT.rstrip("/")
    if not (endpoint and path):
        return ""
    return f"{endpoint}/{path.lstrip('/')}"


@register.inclusion_tag("partials/section_heading.html")
def section_heading(number, label, title, emphasis="", tail="", heading_id=""):
    return {"number": number, "label": label, "title": title, "emphasis": emphasis,
            "tail": tail, "heading_id": heading_id}


@register.inclusion_tag("partials/project_card.html")
def project_card(project, total):
    return {"project": project, "total": total}


@register.inclusion_tag("partials/certificate_card.html")
def certificate_card(cert, number):
    return {"cert": cert, "number": number, "image_url": imagekit_url(cert.image_path)}


@register.simple_tag
def external_attrs():
    return format_html('target="_blank" rel="noopener noreferrer"')
