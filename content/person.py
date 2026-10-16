from dataclasses import dataclass


@dataclass(frozen=True)
class Person:
    name: str
    role: str
    github: str
    linkedin: str


PERSON = Person(
    name="Navodya Manamendra",
    role="Software Engineer and Full-Stack Developer",
    github="https://github.com/manamendraJN",
    linkedin="https://www.linkedin.com/in/navodya-manamendra-35a309248/",
)
