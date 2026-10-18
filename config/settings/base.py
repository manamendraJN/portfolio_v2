"""Shared settings. Everything environment-specific is read from env vars."""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent


def env(name: str, default: str = "") -> str:
    return os.environ.get(name, default).strip()


def env_bool(name: str, default: bool = False) -> bool:
    value = env(name)
    return default if not value else value.lower() in {"1", "true", "yes", "on"}


SECRET_KEY = env("DJANGO_SECRET_KEY", "dev-only-insecure-key-change-me")
DEBUG = False
ALLOWED_HOSTS = [h for h in env("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if h]

INSTALLED_APPS = [
    "portfolio",  # before staticfiles: its runserver adds no-cache headers to /static/ in development
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "portfolio.context_processors.site",
            ],
        },
    },
]

# Content lives in Python dataclasses; SQLite is only here because Django wants a default.
DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}

LANGUAGE_CODE = "en"
TIME_ZONE = "Asia/Colombo"
USE_I18N = False
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

# Optional personal details. Unset values are hidden from the rendered site.
SITE_URL = env("SITE_URL")
CONTACT_EMAIL = env("CONTACT_EMAIL")
CV_URL = env("CV_URL")
GRADUATION_DATE = env("GRADUATION_DATE")
IMAGEKIT_URL_ENDPOINT = env("IMAGEKIT_URL_ENDPOINT")
PROFILE_IMAGE_PATH = env("PROFILE_IMAGE_PATH")  # path under IMAGEKIT_URL_ENDPOINT for the About portrait
