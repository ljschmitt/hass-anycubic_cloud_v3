# Changelog

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
