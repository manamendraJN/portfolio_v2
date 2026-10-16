from dataclasses import dataclass


@dataclass(frozen=True)
class SkillGroup:
    number: str
    name: str
    items: tuple[str, ...]
    icon: str


# No percentages and no years of experience, by design.
SKILL_GROUPS = (
    SkillGroup("01", "Languages", ("Java", "JavaScript", "PHP", "Python", "C", "TypeScript"), "code"),
    SkillGroup("02", "Frontend", ("HTML5", "CSS3", "React", "Tailwind CSS", "Bootstrap"), "layout"),
    SkillGroup("03", "Backend", ("Node.js", "Express", "Spring Boot"), "server"),
    SkillGroup("04", "Mobile", ("Kotlin",), "smartphone"),
    SkillGroup("05", "Databases", ("MongoDB", "MySQL", "SQLite", "PostgreSQL"), "database"),
    SkillGroup("06", "AI/ML and computer vision", ("OpenCV", "MediaPipe", "EfficientNet-B3"), "brain"),
    SkillGroup("07", "Application technologies", ("MERN Stack", "JWT", "OAuth 2.0", "Socket.IO", "WebRTC"), "globe"),
    SkillGroup("08", "Tools", ("Git", "GitHub", "Postman", "GitHub Actions", "Docker"), "wrench"),
    SkillGroup("09", "Cloud", ("AWS-related learning and credentials",), "cloud"),
    SkillGroup("10", "Design", ("Figma", "UI/UX", "Responsive design"), "palette"),
)
