from dataclasses import dataclass


@dataclass(frozen=True)
class Education:
    degree: str
    institution: str
    status: str


# Grades and awards are intentionally absent: none were supplied.
EDUCATION = Education(
    degree="BSc (Hons) in Information Technology",
    institution="Sri Lanka Institute of Information Technology (SLIIT)",
    status="Fourth-year student",
)
