# Project Instructions

## Documentation

- Always read `README.md` before making user-facing, setup-related, release-related, or behavior-changing changes.
- Treat `README.md` as the public source of truth for setup, supported printers, camera behavior, release notes, and user-facing guidance.
- When code changes affect installation, configuration, UI behavior, supported devices, camera handling, security, or troubleshooting, update `README.md` in the same change.
- Do not publish personal data in documentation, examples, commits, issues, or release notes. Use placeholders for printer IDs, entity IDs, IP addresses, tokens, usernames, Home Assistant URLs, and serial numbers.

## UI Text

- Default UI text belongs in English source/localization files.
- German text belongs in the German translation files.
- Avoid hardcoded German strings in TypeScript or Python unless the file is explicitly German-only documentation.

## Local Testing Artifacts

- Remove temporary probes, test scripts, logs, screenshots, and generated files that are no longer needed before finishing a task.
- Do not commit local Home Assistant credentials, Anycubic tokens, private IPs, user-specific IDs, or screenshots containing sensitive data.
