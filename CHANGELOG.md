# Changelog

## 0.3.9-beta.1

### Changed

- Replaced the prominent free-form ACE slot field in local and USB print preparation with loaded spool colors and ordered selection. A collapsible manual slot list remains available for unsupported layouts and repeated slot assignments.

## 0.3.8

### Added

- Added an on-demand preview to local and USB print preparation. The preview is shown only when the selected printer's Anycubic project history contains an exact normalized filename match; remote image URLs remain behind the authenticated Home Assistant backend.

## 0.3.7

### Fixed

- Empty local and USB folders are now treated as successfully loaded empty lists when Anycubic omits the `records` field from the MQTT response.

## 0.3.6

### Fixed

- The Anycubic panel and bundled card now list only printer devices owned by this integration, preventing same-named network devices from integrations such as FRITZ!Box from appearing as duplicate printers.

## 0.3.5

### Added

- Added the diagnostic `debug_set_light_status` service to test explicit Anycubic light command types per printer without changing existing light entity IDs.

### Fixed

- Stabilized local and USB file-list loading in the Anycubic panel by keeping the loading state active until the printer returns real file data or the request times out.
- Local and USB file-list service calls now establish the MQTT action connection before requesting printer files, matching the existing button path and avoiding delayed or missing responses when MQTT was not already active.
- The local and USB file-list tabs now handle Home Assistant `file_info: null` states as not loaded instead of rendering a blank content area.
- Fixed the first-open auto-load behavior for local and USB file-list tabs. A failed or too-early auto-load attempt no longer blocks later automatic retries for the rest of the browser session.
- Local and USB file-list tabs now use the selected printer device as their auto-load target, matching their service-based request path.
- Preserved already known ACE boxes when Anycubic sends a single-box `multi_color_box` MQTT update, preventing the secondary ACE Pro from sporadically disappearing in two-ACE setups.

## 0.3.5-beta.3

### Fixed

- Local and USB file-list service calls now establish the MQTT action connection before requesting printer files, matching the existing button path and avoiding delayed or missing responses when MQTT was not already active.
- The local and USB file-list tabs now show explicit loading, empty, and not-loaded messages instead of leaving the content area blank while waiting for a printer response.

## 0.3.5-beta.2

### Fixed

- Fixed the first-open auto-load behavior for local and USB file-list tabs. A failed or too-early auto-load attempt no longer blocks later automatic retries for the rest of the browser session.
- Local and USB file-list tabs now use the selected printer device as their auto-load target, matching their service-based request path.

## 0.3.5-beta.1

### Added

- Added a diagnostic `debug_set_light_status` service to test explicit Anycubic light command types per printer without changing the existing light entity IDs.

## 0.3.4

### Fixed

- Preserved already known ACE boxes when Anycubic sends a single-box `multi_color_box` MQTT update, preventing the secondary ACE Pro from sporadically disappearing in two-ACE setups.

## 0.3.3

### Fixed

- Mapped Anycubic print status code `9` to `leveling` so bed leveling no longer appears as `unknown` while the printer is busy.
- Fixed dashboard-card ETA formatting to use the browser/Home Assistant local time instead of UTC.

## 0.3.2

### Fixed

- Added explicit `dark_icon.png` and `dark_logo.png` brand assets so Home Assistant 2026.3+ can resolve both light and dark brand image variants from the local custom integration package.

### Notes

- Older Home Assistant versions and current HACS download lists may still use the public brands CDN and can show a generic placeholder there. The local brand assets are only available through Home Assistant's local brands proxy.

## 0.3.1

### Fixed

- Suggested the compatibility entity ID suffix `job_z_thickness` for the existing internal `job_z_thick` layer-height sensor key.
- Added the missing local brand logo file next to the existing local brand icon for Home Assistant 2026.3 and newer.
- Rebuilt the bundled dashboard card so its visible console version matches the integration release.

### Notes

- Existing installations can use the `anycubic_ha_integration.migrate_entity_ids` service to rename an existing `job_z_thick` entity to the compatible `job_z_thickness` entity ID after testing with `dry_run: true`.
- HACS can only offer updates automatically when the integration was installed as a HACS custom repository. Manual installations still need manual replacement.
- HACS may still show a generic placeholder icon in its downloads list until HACS itself switches that view to Home Assistant's local brands proxy for custom integrations.

## 0.3.0

### Added

- Added the native Home Assistant `light.*` entity for Anycubic camera light control.
- Added the side view camera panel with manual stream start, zoom, fullscreen, and optional per-printer Home Assistant `camera.*` mappings.
- Added cautious first-open auto-loading for local, USB, and cloud file-list tabs.
- Added local and USB file print preparation from the panel, with printer selection and optional ACE slot mapping.
- Added stable English entity-ID suggestions plus the `migrate_entity_ids` service for older localized entity IDs.
- Added release safety checks for synchronized versions, private-data patterns, and tag/release collisions.

### Changed

- Kobra X camera light now uses initial command type `3`, matching the value confirmed through Slicer/MQTT behavior. This fixes the Home Assistant restart case where the light command failed until the Slicer toggled the light once.
- Kobra X ACE/material handling now treats ACE-reserved internal rack slots as ACE feed entries instead of normal filament slots.
- ACE/material spool layout keeps dynamic slot data while rendering up to four evenly sized spool items per row.
- The built-in panel and dashboard-card entity lookups now expect stable English technical entity IDs instead of localized German fallback IDs.
- Local and USB file views clear stale folder data immediately during folder changes.
- Camera streams in the side view start only when Play is pressed and stop on Stop, printer change, or leaving the view.

### Fixed

- Reduced known Kobra X MQTT warning noise for progress reports without temperature fields, `aux_fan_speed_pct`, `z_comp`, `video/initSuccess`, and known `buried` reports.
- Handled `list_mode` in local and USB file-list MQTT reports.
- Fixed the file-list path coordinator crash from the withdrawn `0.1.9` release.
- Fixed sensor setup issues from `0.1.6`.
- Prevented offline printers from also appearing as available or busy.

### Notes

- MQTT-dependent data can take a short time to initialize after a Home Assistant restart. During that window, MQTT/peripheral states may temporarily appear inactive or unknown.
- Kobra S1 basic functions are reported, while camera and chamber light support remain open for further feedback.
