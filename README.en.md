# Anycubic HA Integration

[Deutsch](README.md) | [English](README.en.md)

[![Latest release](https://img.shields.io/github/v/release/ljschmitt/hass-anycubic_cloud_v3?label=release)](https://github.com/ljschmitt/hass-anycubic_cloud_v3/releases/latest)
[![GitHub stars](https://img.shields.io/github/stars/ljschmitt/hass-anycubic_cloud_v3)](https://github.com/ljschmitt/hass-anycubic_cloud_v3/stargazers)
[![License: GPL-3.0](https://img.shields.io/github/license/ljschmitt/hass-anycubic_cloud_v3)](LICENSE)

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ljschmitt&repository=hass-anycubic_cloud_v3&category=integration)

A Home Assistant integration for Anycubic cloud printers with status sensors, MQTT real-time updates, print and file actions, ACE/material management, and an optional camera view.

The integration is currently available through HACS as a custom repository. Its [submission to the default HACS catalog](https://github.com/hacs/default/pull/8869) is under review.

## Highlights

- Multiple Anycubic printers in one Home Assistant installation
- Cloud polling and optional MQTT real-time updates
- Print status, temperatures, speed, fan, layers, progress, and timing sensors
- Pause, resume, cancel, and prepared print workflows with ordered color selection for all loaded material sources and a collapsible manual slot-number fallback
- Local, USB, and cloud file views
- ACE spool, material, color, and drying information
- Native camera-light entity on supported printers
- On-demand Anycubic cloud camera stream
- Optional per-printer Home Assistant `camera.*` mapping for local or alternative firmware cameras
- Dedicated Anycubic Cloud panel plus an optional matching dashboard card

## Compatibility

Reported or tested:

- Anycubic Kobra 3 Combo
- Anycubic Kobra X, including known ACE/material setups and camera light
- Anycubic Kobra S1 basic functions; camera and chamber light still need further testing
- Anycubic Kobra 2, Kobra 2 Max, and Kobra 2 Pro
- Anycubic Photon Mono M5s basic support
- Anycubic M7 Pro basic support

Feedback about additional models is welcome. Never include tokens, private IP addresses, serial numbers, printer IDs, or other personal data in public issues.

## Screenshots

<img width="420" alt="Anycubic Kobra 3 status panel" src="screenshots/kobra3-1.png">
<img width="420" alt="Anycubic ACE material display" src="screenshots/anycubic-ace-ui.gif">

## Installation with HACS

Until the default HACS catalog submission is merged:

1. Open **HACS -> Integrations -> menu -> Custom repositories**.
2. Add `https://github.com/ljschmitt/hass-anycubic_cloud_v3` as an **Integration**.
3. Search for **Anycubic HA Integration** and install it.
4. Restart Home Assistant.
5. Open **Settings -> Devices & services -> Add integration**.

For MQTT support, select the **Slicer Next (Windows)** authentication method and provide its access token. The alternative web token method supports cloud polling but not MQTT.

Detailed token extraction, camera setup, Rinkhals/Moonraker mapping, entity migration, and troubleshooting instructions are available in the [German documentation](README.md).

### Recover a Slicer token on Windows

Newer Slicer versions encrypt the configuration and may no longer log `accessToken = ...`. The old PowerShell command then fails with a null-array error because its search found nothing.

1. Install 64-bit Python 3.9 or newer from [python.org](https://www.python.org/downloads/windows/). Download and extract the complete repository using **Code -> Download ZIP**.
2. Review [the PowerShell launcher](scripts/recover_slicer_token.ps1) and [the Python helper](scripts/recover_slicer_token.py). No extra Python packages are required.
3. Open exactly one Slicer Next instance, sign in and open the printer view. Run Slicer and PowerShell as the same Windows user, normally without administrator rights.
4. Open PowerShell in the extracted repository directory and run:

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\recover_slicer_token.ps1
   ```

   The execution-policy option applies only to this process. Do not bypass organizational restrictions on managed computers.

5. Only after **Cloud login successful. Access token copied to clipboard**, paste into Home Assistant's **Slicer Next (Windows)** token field during reauthentication/reconfiguration. Do not delete an existing integration just to replace its token.
6. Clear the clipboard after pasting with `Set-Clipboard -Value ''`. Also remove the entry from clipboard history/sync if enabled, or disable those features before recovery.

The helper reads the Slicer process without writing to it or creating a memory dump. It filters for unexpired access tokens, rejects ambiguous accounts and checks candidates over HTTPS against Anycubic's login endpoint before copying one. It does not print or save credentials, change Home Assistant or control printers. An ID token is not an access token; the issuer alone does not distinguish them. Local JWT decoding is not signature verification; cloud acceptance is required.

On failure, follow the helper's message; the clipboard remains unchanged and may contain an older value. If no token is found, sign in and open the printer view before retrying. An expired/revoked token may require signing in again, which can invalidate existing sessions. Do not disable security software to obtain process access. Cloud success validates token exchange only, not MQTT or integration setup. This approach worked locally but is not guaranteed for every Slicer build or future cloud version. Background: [upstream issue #67](https://github.com/WaresWichall/hass-anycubic_cloud/issues/67).

Use only your own account. Never upload tokens, dumps, configuration files or unredacted logs. Web authentication remains an alternative for polling without MQTT.

## Dashboard card

The recommended companion dashboard card is [ljschmitt/hass-anycubic_card](https://github.com/ljschmitt/hass-anycubic_card). The integration also includes its own Home Assistant side panel, so the external card is optional.

## Camera behavior

The cloud camera stream is started only after the user presses Play. It is stopped when leaving the view, changing printers, or stopping playback. This prevents background camera sessions.

Alternative firmware cameras can be mapped per printer to an existing Home Assistant `camera.*` entity. Printers without a mapping continue to use the Anycubic cloud camera.

## Security and privacy

This integration communicates with Anycubic cloud services and can control supported printer actions. Use it at your own risk and test control functions carefully.

Do not publish Anycubic tokens, Home Assistant credentials, printer IDs, serial numbers, MAC addresses, private URLs, local IP addresses, diagnostics containing personal data, or environment-specific camera mappings.

## Support and feedback

- [Open an issue](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues)
- [Latest release](https://github.com/ljschmitt/hass-anycubic_cloud_v3/releases/latest)
- [German documentation](README.md)

## License

GNU General Public License v3.0. See [LICENSE](LICENSE).
