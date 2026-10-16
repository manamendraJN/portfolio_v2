from whitenoise.storage import CompressedManifestStaticFilesStorage


class ModuleAwareStaticStorage(CompressedManifestStaticFilesStorage):
    """Hash-rewrite `import ... from "../vendor/x.js"` inside ES modules too."""

    support_js_module_import_aggregation = True
