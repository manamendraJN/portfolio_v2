from dataclasses import dataclass


@dataclass(frozen=True)
class Person:
    name: str
    role: str
    github: str
    linkedin: str
    image_path: str = ""  # appended to IMAGEKIT_URL_ENDPOINT, e.g. "portfolio/navodya.jpg"; empty shows a placeholder


PERSON = Person(
    name="Navodya Manamendra",
    role="Software Engineer and Full-Stack Developer",
    github="https://github.com/manamendraJN",
    linkedin="https://www.linkedin.com/in/navodya-manamendra-35a309248/",
)
