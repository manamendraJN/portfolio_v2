from dataclasses import dataclass


@dataclass(frozen=True)
class Role:
    number: str
    title: str
    organisation: str
    period: str
    note: str
    description: str
    tech: tuple[str, ...] = ()
    illustration: str = ""


# Only confirmed roles are published. Do not add unconfirmed positions here.
EXPERIENCE = (
    Role(
        number="01",
        title="Broadcast Ad Insertion & Playout Operator",
        organisation="Dialog Axiata PLC",
        period="May 2026 to present",
        note=(
            "Broadcast operations experience, not software engineering employment. "
            "Contract role, Colombo District, Sri Lanka, per the supplied profile."
        ),
        description=(
            "Supported advertisement insertion, commercial playout, server operations, broadcast "
            "monitoring, and advertisement management for satellite television services through "
            "a recruitment assignment with Sara Creation."
        ),
        illustration="broadcast",
    ),
    Role(
        number="02",
        title="Full Stack Engineer Intern",
        organisation="Department of Agrarian Development, Sri Lanka",
        period="August 2025 to February 2026",
        note="",
        description="Practical experience building web-based systems.",
        tech=("PHP", "JavaScript", "SQL", "HTML", "CSS", "XAMPP"),
        illustration="agrarian",
    ),
)
