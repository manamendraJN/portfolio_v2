from dataclasses import dataclass


@dataclass(frozen=True)
class Certificate:
    issuer: str
    title: str
    verify_url: str = ""
    detail: str = ""
    issued: str = ""
    image_path: str = ""  # appended to IMAGEKIT_URL_ENDPOINT; empty until real assets exist


CERTIFICATES = (
    Certificate("SLIIT", "AI/ML Engineer", "https://code.sliit.org/certificates/muy9c4mfjv"),
    Certificate("SoloLearn", "Python (Basic)", "https://www.sololearn.com/en/certificates/CC-S7UZM0GN"),
    Certificate("HackerRank", "JavaScript (Basic)", "https://www.hackerrank.com/certificates/ef62b645d0bd"),
    Certificate("HackerRank", "React (Basic)", "https://www.hackerrank.com/certificates/206119c6659f"),
    Certificate("HackerRank", "SQL (Basic)", "https://hackerrank.com/certificates/12e449396716"),
    Certificate("HackerRank", "Java (Basic)", "https://www.hackerrank.com/certificates/768a9f87f70c"),
    Certificate(
        "AWS Academy", "Graduate, Cloud Web Application Builder",
        "https://www.credly.com/badges/230d6cf1-20b6-4433-b23c-0159a704e218",
    ),
    Certificate(
        "AWS", "SimuLearn: Computing Solutions",
        detail="Credential ID: dd070d49-7895-4e47-8c11-841964fdb44e", issued="August 2025",
    ),
    Certificate("IEEE SCSE 2026", "Author Certificate"),
)
