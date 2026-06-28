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
- Before commits and releases, verify that no personal Home Assistant settings, tokens, URLs, printer IDs, serial numbers, private IPs, local camera mappings, user-specific entity IDs, or environment-specific assumptions are included.
- Implement changes so they remain portable across other Home Assistant installations and Anycubic printers, including printers that are offline, in another network, or missing optional local/LAN capabilities.

## Versioning and Builds

- The root `Version` file is the canonical project version. Run `python scripts/sync_version.py` after changing it, or `python scripts/sync_version.py --check` to verify generated version files.
- Keep `custom_components/anycubic_ha_integration/manifest.json`, `custom_components/anycubic_ha_integration/frontend_panel/package.json`, `custom_components/anycubic_ha_integration/frontend_panel/package-lock.json`, and the README release line synchronized through `scripts/sync_version.py`.
- Use semantic versioning intentionally. Normal user-facing feature work should use the next appropriate normal version such as `0.2.0`.
- If a published release causes a startup/crash bug, delete that faulty GitHub release and tag, then publish the crash fix by appending a bugfix digit to the faulty version, for example `0.1.9` -> `0.1.91`. Use this special appended bugfix version only for crash-release replacements; after that, continue normal versioning.
- Before creating a release, perform a version collision check: verify the intended `v<version>` tag does not already exist on the remote, verify no GitHub release for that tag exists, and verify the local version files are synchronized. If the tag already exists, stop and choose a new version before publishing.
- Every committed version bump must be finished with a matching pushed GitHub tag and published release, for example `v0.1.2`.
- After publishing, verify the pushed tag points to the current release commit and that GitHub lists the new release as the latest release.
- `npm run build` and `npm run build_card` run `eslint --fix`, which can touch unrelated source files, line endings, or formatting. After any frontend build, inspect the actual diff and restore unrelated formatter-only or line-ending changes before staging.
- Prefer targeted quick builds when lint formatting is not part of the task, but still verify the final diff before committing.
