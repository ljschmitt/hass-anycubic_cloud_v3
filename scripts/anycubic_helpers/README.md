# Anycubic developer helpers

These work-in-progress helpers are for a repository checkout. They are not imported by the Home Assistant integration and are deliberately outside `custom_components/`, so HACS does not install them.

From the repository root, install the helper dependencies in your chosen Python environment:

```bash
python -m pip install aiohttp aiofiles bcrypt cryptography paho-mqtt
```

To inspect a command without logging in or contacting a printer:

```bash
python -m scripts.anycubic_helpers.debug_dump_raw --help
python -m scripts.anycubic_helpers.gcode_metadata_parser --help
python -m scripts.anycubic_helpers.upload_to_cloud_and_print_with_ace --help
```

The package locates the repository's `anycubic_cloud_api` directly; it does not import Home Assistant's integration setup. Always run these module commands from the repository root, not from `custom_components`.

For an explicitly intended authenticated action, copy `anycubic_cached_sig_token.token.sample` to `anycubic_cached_sig_token.token` beside these helpers and replace its placeholder with your own supported token. The token/cache files in this directory are ignored by Git. Diagnostics can contain private account, device and project data; review and redact them before sharing.

The delete/upload/print helpers perform their named actions when invoked with real arguments. Importing a helper or requesting `--help` does not run those actions. Existing work-in-progress API/protocol limitations are unchanged; relocation is not hardware validation of these commands.

The translation generator is separate:

```bash
python scripts/build_translations.py
```

It reads the integration's `translations/input_translation_files/` and writes the same `strings.json` and translation files as before.
