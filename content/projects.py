from dataclasses import dataclass


@dataclass(frozen=True)
class Link:
    label: str
    url: str


@dataclass(frozen=True)
class Project:
    slug: str
    number: str
    title: str
    summary: str
    tech: tuple[str, ...]
    links: tuple[Link, ...]
    features: tuple[str, ...] = ()
    contribution: str = ""
    reported_outcome: str = ""
    illustration: str = ""
    illustration_alt: str = ""


PROJECTS = (
    Project(
        slug="warehouse",
        number="01",
        title="Warehouse Management System",
        summary="Built for a client to streamline inventory, employee, and shipping operations.",
        tech=("MongoDB", "Express", "React", "Node.js"),
        links=(Link("Repository", "https://github.com/Shiranakther/Warehouse_Management_Syatem"),),
        features=(
            "Inventory monitoring", "Low-stock alerts", "Purchase orders", "Shipping",
            "Wastage tracking", "Supplier management", "Staff scheduling",
        ),
        contribution="Secure login, staff management, and a shift scheduling algorithm.",
        reported_outcome=(
            "Reported 20% reduction in operational delays (figure from the project "
            "description, not independently verified)."
        ),
        illustration="warehouse",
        illustration_alt="Isometric warehouse and shelving blueprint",
    ),
    Project(
        slug="issuesync",
        number="02",
        title="IssueSync",
        summary=(
            "Issue tracker with authentication, CRUD operations, reusable navigation, toast "
            "notifications, and separately deployed frontend and backend."
        ),
        tech=("React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "JWT", "Netlify", "Render"),
        links=(
            Link("Live demo", "https://issuesync.netlify.app/"),
            Link("Repository", "https://github.com/manamendraJN/issue-tracker"),
        ),
        illustration="issuesync",
        illustration_alt="Kanban-style cards and a ticket thread drawn as a technical sketch",
    ),
    Project(
        slug="gesture",
        number="03",
        title="HandGestureControl",
        summary="Controls the mouse through right-hand webcam gestures.",
        tech=("Python", "OpenCV", "MediaPipe", "PyAutoGUI", "Win32 API"),
        links=(Link("Repository", "https://github.com/manamendraJN/HandGestureControl"),),
        features=(
            "Cursor movement", "Adjustable speed", "Gesture-based clicking",
            "Calibration", "Real-time hand tracking",
        ),
        illustration="gesture",
        illustration_alt="Line-drawn hand with landmark points and a cursor trail",
    ),
    Project(
        slug="collabhub",
        number="04",
        title="Collab Hub",
        summary=(
            "Remote-work platform for task distribution, project management, and file sharing. "
            "Its Smart Workload Balancer considers workload, deadlines, and task complexity."
        ),
        tech=("React", "Node.js", "Express", "MongoDB", "Socket.IO", "JWT"),
        links=(Link("Repository", "https://github.com/manamendraJN/Collab-Hub"),),
        illustration="collabhub",
        illustration_alt="Connected nodes and workload bars drawn as a balance diagram",
    ),
    Project(
        slug="skillsphere",
        number="05",
        title="SkillSphere",
        summary=(
            "Learning platform with learning paths, progress tracking, interactive video "
            "sessions, community forums, and gamification."
        ),
        tech=("React", "Spring Boot", "MySQL", "WebRTC", "OAuth 2.0"),
        links=(Link("Repository", "https://github.com/manamendraJN/SkillSphere"),),
        illustration="skillsphere",
        illustration_alt="A winding learning path with milestones and a video-call frame",
    ),
)
