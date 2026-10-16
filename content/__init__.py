"""Typed, frozen content for the portfolio. One module per section."""
from .about import ABOUT, FOCUS_CARDS
from .certificates import CERTIFICATES
from .contact import CONTACT_HEADLINE
from .education import EDUCATION
from .experience import EXPERIENCE
from .hero import HERO
from .person import PERSON
from .projects import PROJECTS
from .research import RESEARCH
from .skills import SKILL_GROUPS

__all__ = [
    "ABOUT", "FOCUS_CARDS", "CERTIFICATES", "CONTACT_HEADLINE", "EDUCATION",
    "EXPERIENCE", "HERO", "PERSON", "PROJECTS", "RESEARCH", "SKILL_GROUPS",
]
