import re

from django.test import TestCase, override_settings

SECTION_IDS = [
    "hero", "work", "skills", "about", "experience",
    "education", "research", "certificates", "contact",
]


def visible_text(html: str) -> str:
    html = re.sub(r"<(script|style)\b.*?</\1>", "", html, flags=re.S)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html))


class HomeTests(TestCase):
    def get(self):
        return self.client.get("/")

    def test_home_returns_200(self):
        self.assertEqual(self.get().status_code, 200)

    def test_required_section_ids_exist(self):
        html = self.get().content.decode()
        for section_id in SECTION_IDS:
            self.assertIn(f'id="{section_id}"', html, section_id)

    def test_single_h1_with_exact_headline(self):
        html = self.get().content.decode()
        self.assertEqual(len(re.findall(r"<h1\b", html)), 1)
        h1 = re.search(r"<h1\b.*?</h1>", html, re.S).group(0)
        text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", h1)).strip()
        self.assertEqual(text, "Thoughtful code. Intelligent ideas. Useful software.")

    def test_contact_headline_exact(self):
        self.assertContains(self.get(), "Have an interesting problem to solve?")

    @override_settings(CONTACT_EMAIL="", CV_URL="")
    def test_unset_email_and_cv_are_not_rendered(self):
        html = self.get().content.decode()
        self.assertNotIn("mailto:", html)
        self.assertNotIn("[ADD", html)
        self.assertNotIn("Résumé", html)

    @override_settings(CONTACT_EMAIL="hi@example.com", CV_URL="https://example.com/cv.pdf")
    def test_configured_email_and_cv_are_rendered(self):
        html = self.get().content.decode()
        self.assertIn('href="mailto:hi@example.com"', html)
        self.assertIn('href="https://example.com/cv.pdf"', html)

    def test_unverified_heritage_crops_role_absent(self):
        self.assertNotContains(self.get(), "Heritage")

    def test_twenty_percent_figure_is_worded_as_reported(self):
        text = visible_text(self.get().content.decode())
        self.assertIn("Reported 20% reduction in operational delays", text)
        self.assertIn("not independently verified", text)
        self.assertEqual(text.count("20%"), 1)

    def test_broadcast_role_is_not_called_software_engineering(self):
        text = visible_text(self.get().content.decode())
        self.assertIn("not software engineering employment", text)
        self.assertNotIn("Software Engineer at Dialog", text)

    def test_external_links_use_noopener(self):
        html = self.get().content.decode()
        for tag in re.findall(r"<a\b[^>]*target=\"_blank\"[^>]*>", html):
            self.assertIn("noopener noreferrer", tag)

    def test_no_skill_percentages_or_forbidden_sections(self):
        text = visible_text(self.get().content.decode()).lower()
        for word in ("testimonial", "newsletter", "cookie"):
            self.assertNotIn(word, text)

    def test_certificates_without_url_show_no_fake_link(self):
        html = self.get().content.decode()
        self.assertEqual(html.count("No verification link supplied"), 2)

    @override_settings(IMAGEKIT_URL_ENDPOINT="")
    def test_certificate_images_fall_back_to_illustrated_placeholder(self):
        html = self.get().content.decode()
        self.assertIn("Illustration placeholder", html)
        self.assertNotIn("<img", html)

    def test_projects_have_repo_links(self):
        html = self.get().content.decode()
        for url in (
            "https://github.com/Shiranakther/Warehouse_Management_Syatem",
            "https://github.com/manamendraJN/issue-tracker",
            "https://issuesync.netlify.app/",
            "https://github.com/manamendraJN/HandGestureControl",
            "https://github.com/manamendraJN/Collab-Hub",
            "https://github.com/manamendraJN/SkillSphere",
        ):
            self.assertIn(f'href="{url}"', html)

    def test_research_separates_contribution_from_group(self):
        html = self.get().content.decode()
        self.assertIn("My contribution", html)
        self.assertIn("Wider group research", html)

    def test_404_page(self):
        self.assertEqual(self.client.get("/missing/").status_code, 404)


class ProfilePhotoTests(TestCase):
    @override_settings(IMAGEKIT_URL_ENDPOINT="", PROFILE_IMAGE_PATH="")
    def test_placeholder_when_unset(self):
        html = self.client.get("/").content.decode()
        self.assertIn("Photo placeholder", html)
        self.assertNotIn("Portrait of", html)

    @override_settings(IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/demo", PROFILE_IMAGE_PATH="me.jpg")
    def test_imagekit_url_used_when_set(self):
        html = self.client.get("/").content.decode()
        self.assertIn('src="https://ik.imagekit.io/demo/me.jpg"', html)
