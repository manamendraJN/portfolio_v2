from dataclasses import dataclass


@dataclass(frozen=True)
class Research:
    title: str
    venue: str
    doi: str
    doi_url: str
    isbn: str
    supervisor: str
    contribution_title: str
    contribution: str
    group_title: str
    group_modules: tuple[str, ...]


# No accuracy figures or results: none were supplied.
RESEARCH = Research(
    title="Temporal Personal Fashion AI System with Multi-Component Integration",
    venue=(
        "2026 IEEE International Research Conference on Smart Computing and Systems "
        "Engineering (SCSE 2026), 26 March 2026, University of Kelaniya (per the supplied "
        "certificate details)."
    ),
    doi="10.1109/SCSE70081.2026.11499770",
    doi_url="https://doi.org/10.1109/SCSE70081.2026.11499770",
    isbn="979-8-3315-4791-2",
    supervisor="Mr. S M B Harshanath, SLIIT",
    contribution_title="Dual-View Anthropometric Measurement System and Garment Size Recommendation",
    contribution=(
        "The module extracts body measurements from front and side photographs using an "
        "EfficientNet-B3 backbone. A custom scoring algorithm evaluates compatibility with "
        "available garment sizes and produces confidence-rated recommendations with "
        "personalized fit advice."
    ),
    group_title="Wider group research (not Navodya's contribution)",
    group_modules=(
        "Temporal Wardrobe Intelligence",
        "Personalized Accessories Recommendation",
        "Integrated Grooming Recommendation",
    ),
)
