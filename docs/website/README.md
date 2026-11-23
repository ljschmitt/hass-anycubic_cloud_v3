# Slicer token instructions

Published pages:

- [German](https://apps.schmittit.de/anycubic_ha_cloud/slicer-token.html)
- [English](https://apps.schmittit.de/anycubic_ha_cloud/en/slicer-token.html)

The HTML pages use the existing website's `assets/site-20261115/site.css` and icon. Deploy `token-guide.js` and `token-guide.css` into `assets/token-guide-20261123/` alongside the pages. Preserve the existing homepages and change only their token-guide links. Back up changed pages and check their current hashes before replacing them.

Keep both commands synchronized with the respective README. `tests/test_slicer_token_commands.py` checks exact command parity and executes those commands against synthetic logs and clipboard adapters. The JavaScript copies public shell commands only, never extracted tokens. Clipboard denial falls back to legacy copying and finally selects the command with manual-copy instructions, without claiming success.

The Home Assistant setup form uses sanitized Markdown and standard selectors. It links to these pages; their copy buttons are not injected into the native HA dialog.
