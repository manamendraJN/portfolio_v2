from dataclasses import dataclass


@dataclass(frozen=True)
class Hero:
    line_one: str
    line_emphasis: str
    line_three: str
    intro: str
    caption: str


HERO = Hero(
    line_one="Thoughtful code.",
    line_emphasis="Intelligent ideas.",
    line_three="Useful software.",
    intro=(
        "Navodya Manamendra, a Software Engineer building practical web applications "
        "and exploring intelligent solutions through AI and computer vision."
    ),
    caption="From first sketch to software people rely on.",
)
