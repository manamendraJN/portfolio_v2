"""Development server that never lets the browser reuse stale static files.

Static files are not hashed in development, so a browser may keep an old script (for example parallax.js) while the
templates and CSS are new, which breaks scroll animations. This wraps the normal handler and marks /static/ responses
as no-cache. Production is unaffected (hashed filenames, WhiteNoise)."""
from django.contrib.staticfiles.management.commands.runserver import Command as StaticRunserver


class NoCacheStatic:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        is_static = environ.get("PATH_INFO", "").startswith("/static/")

        def patched(status, headers, exc_info=None):
            if is_static:
                headers = [h for h in headers if h[0].lower() != "cache-control"]
                headers.append(("Cache-Control", "no-cache, must-revalidate"))
            return start_response(status, headers, exc_info)

        return self.app(environ, patched)


class Command(StaticRunserver):
    def get_handler(self, *args, **options):
        return NoCacheStatic(super().get_handler(*args, **options))
