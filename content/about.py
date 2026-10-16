from dataclasses import dataclass


@dataclass(frozen=True)
class FocusCard:
    number: str
    title: str
    text: str
    icon: str


ABOUT = (
    "I'm a Software Engineer and Full-Stack Developer pursuing a BSc (Hons) in Information "
    "Technology at SLIIT. I enjoy turning complex problems into practical, well-designed "
    "software that improves real-world workflows.",
    "My experience spans web application development, business-oriented systems, computer "
    "vision, and AI research. I'm particularly interested in reliable software architecture, "
    "thoughtful user experiences, and intelligent applications that solve meaningful problems.",
    "I'm working toward becoming a well-rounded Software Engineer and AI Developer who can "
    "design, build, and deploy scalable, reliable, and intelligent software.",
)

# Only claims already present in ABOUT.
FOCUS_CARDS = (
    FocusCard(
        "01", "Practical web applications",
        "Turning complex problems into practical, well-designed software that improves real-world workflows.",
        "globe",
    ),
    FocusCard(
        "02", "Reliable architecture, thoughtful experience",
        "A particular interest in reliable software architecture and thoughtful user experiences.",
        "layout",
    ),
    FocusCard(
        "03", "Intelligent applications",
        "Intelligent applications that solve meaningful problems, drawing on computer vision and AI research.",
        "brain",
    ),
)
