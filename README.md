# Navodya Manamendra — portfolio

A server-rendered Django portfolio styled as a hand-illustrated publication. Django templates render every page; Tailwind (standalone CLI), GSAP + ScrollTrigger and Motion add the styling and motion. The original build brief is kept in [docs/BRIEF.md](docs/BRIEF.md).

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate            # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py runserver        # http://127.0.0.1:8000
```

Settings: `config.settings.dev` (default for `manage.py`) and `config.settings.prod` (default for WSGI).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DJANGO_SECRET_KEY` | Required in production. |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hosts (default `localhost,127.0.0.1`). |
| `DJANGO_DEBUG` | Production debug flag (default off). |
| `DJANGO_SSL_REDIRECT` | Set `0` behind a proxy that already redirects. |
| `SITE_URL` | Absolute site URL for canonical/Open Graph tags. |
| `CONTACT_EMAIL` | Renders a `mailto:` button when set; hidden otherwise. |
| `CV_URL` | Renders a résumé button when set; hidden otherwise. |
| `GRADUATION_DATE` | Shown in Education when set; hidden otherwise. |
| `IMAGEKIT_URL_ENDPOINT` | Base URL for certificate images (see below). |

## Editing content

All content is in frozen dataclasses in [content/](content/), one module per section. No database or admin.
Certificate images: set `IMAGEKIT_URL_ENDPOINT` and fill `image_path` on a `Certificate`; until then an illustrated placeholder (clearly labelled) is shown. Only confirmed roles belong in `content/experience.py`.

## CSS

```bash
bin/tailwindcss.exe -c tailwind.config.js -i static/src/input.css -o static/css/tailwind.css --minify   # build
bin/tailwindcss.exe -c tailwind.config.js -i static/src/input.css -o static/css/tailwind.css --watch    # watch
```

Download the standalone Tailwind CLI v3.4.x for your OS into `bin/` (git-ignored). The compiled `static/css/tailwind.css` is committed. Hand-written styles live in `static/css/site.css`.

## Checks

```bash
python manage.py check
python manage.py check --deploy      # with DJANGO_SETTINGS_MODULE=config.settings.prod and a secret key
python manage.py test tests
python manage.py collectstatic --noinput
python tools/contrast.py             # WCAG AA for every text/background pair
```

Deploy: `gunicorn config.wsgi` with WhiteNoise serving `staticfiles/`.

## Vendored libraries

GSAP 3.15 + ScrollTrigger and Motion are bundled as ES modules in `static/vendor/` (no CDN). Lucide icons are static SVGs in `static/icons/`. Fonts (Instrument Serif, Manrope, JetBrains Mono) are self-hosted in `static/fonts/`. GSAP is used under its standard no-charge licence.
