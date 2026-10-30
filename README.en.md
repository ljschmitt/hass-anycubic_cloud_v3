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

Slicer Next 2.0.x still writes the required access token to its current debug log, but may label the URL parameter `id_token=` instead of the former `accessToken = ...` line. The command below supports both forms. It does not require Python, a repository download or process-memory access.

1. Open Slicer Next, sign in and open the printer view.
2. Open PowerShell, copy the complete command block below and run it once:

   ```powershell
   & {
       $ErrorActionPreference = 'Stop'
       $log = Get-ChildItem "$env:AppData\AnycubicSlicerNext\log\debug_*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
       if (!$log) { throw 'No Slicer debug log found. Start Slicer, sign in and open the printer view.' }
       $token = (Select-String -Path $log.FullName -Pattern '(?:accessToken\s*=\s*|id_token=)(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)' -AllMatches).Matches | ForEach-Object { $_.Groups[1].Value } | Select-Object -Last 1
       if (!$token) { throw 'No Slicer token found in the latest log.' }
       Set-Clipboard -Value $token
       if ((Get-Clipboard -Raw) -cne $token) { throw 'Could not confirm the token in the clipboard. Run the command again.' }
       Write-Host 'Token successfully copied to clipboard. Paste into Home Assistant with Ctrl+V now.' -ForegroundColor Green
   }
   ```

3. Paste the token into Home Assistant's **Slicer Next (Windows)** field during reauthentication or reconfiguration. Do not delete an existing integration just to replace its token.
4. Clear the clipboard after pasting with `Set-Clipboard -Value ''`, including clipboard history or sync when enabled.

The command reads only the newest local Slicer debug log and copies the last matching JWT. The green success message appears only after checking that the clipboard contains the extracted token. The token itself is not printed. Paste directly into Home Assistant afterwards; copying other text replaces the token in the clipboard. Home Assistant validates the pasted token with Anycubic. Although the current Slicer calls the URL parameter `id_token`, the tested Slicer version stores an `access-token` JWT there. If no token is found, sign in, open the printer view and retry. For Slicer builds that genuinely omit the token, the repository retains the advanced [PowerShell launcher](scripts/recover_slicer_token.ps1) and [Python helper](scripts/recover_slicer_token.py) as a fallback, not as the normal path.

The simple command was tested locally with Slicer Next 2.0.0.3 but is not guaranteed for every future Slicer build or cloud change.

**Repeated authentication requests with a still-valid token (`int()` / `NoneType`):** Anycubic can return `external_shelves.id: null` and `loaded: null` for an unassigned external spool holder. Through version 0.4.1, this can abort setup after a successful cloud login and incorrectly request reauthentication. Version **0.4.2** treats this empty holder as absent and gives optional `null` status fields on existing holders the same inactive defaults as omitted fields. Invalid cloud data during setup is retried without requesting a new token. Install the new version and restart Home Assistant for this fix to take effect. A genuinely rejected or expired token still requires reauthentication.

Use only your own account. Never upload tokens, dumps, configuration files or unredacted logs. Web authentication remains an alternative for polling without MQTT.

## Dashboard card

### Loaded slot of the primary ACE (unreleased)

The development version adds `loaded_slot` to the existing `sensor.anycubic_printer_ace_spools` sensor. This is the primary ACE's unchanged, **zero-based** cloud/MQTT value: `0` is its first slot, `1` its second slot, and `-1` means no slot is loaded. The value is `null` when no primary ACE exists. Offline printers can retain a cached value; it does not confirm current filament movement.

With multiple ACE units, this attribute refers only to the primary ACE. The Kobra X internal material rack is not treated as the primary ACE. Existing one-based `local_slot`, `slot` and `display_slot` fields and print-slot mappings stay unchanged. Before accessing `spool_info[loaded_slot]`, check that the value is a number from `0` to the list length minus one; never interpret `-1` as the last list item. This is an additional attribute, not a new entity.

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
