# Anycubic Cloud

[Deutsch](README.md) | [English](README.en.md)

[![Latest release](https://img.shields.io/github/v/release/ljschmitt/hass-anycubic_cloud_v3?label=release)](https://github.com/ljschmitt/hass-anycubic_cloud_v3/releases/latest)
[![GitHub stars](https://img.shields.io/github/stars/ljschmitt/hass-anycubic_cloud_v3)](https://github.com/ljschmitt/hass-anycubic_cloud_v3/stargazers)
[![License: GPL-3.0](https://img.shields.io/github/license/ljschmitt/hass-anycubic_cloud_v3)](LICENSE)

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ljschmitt&repository=hass-anycubic_cloud_v3&category=integration)

A Home Assistant integration for Anycubic cloud printers with status sensors, MQTT real-time updates, print and file actions, ACE/material management, and an optional camera view.

From **0.4.5-beta.1**, the display names are **Anycubic Cloud** and **Anycubic Cloud Card**, previously **Anycubic HA Integration** and **Anycubic Frontend Card**. Repository URLs, the `anycubic_ha_integration` domain, existing entity IDs and `custom:anycubic-card` remain unchanged.

**0.4.5** combines the ACE drying fix, repository-helper cleanup and MQTT fixes from the Kobra X print and drying test. Use matching integration and dashboard-card versions. The beta was tested on Home Assistant 2026.11.0 with Marketplace.

**0.4.6** adds Kobra X plate and nozzle controls with bundled Slicer images, plus the ACE 2 Pro fill estimate handling. Use the [matching dashboard card 0.4.6](https://github.com/ljschmitt/hass-anycubic_card/releases/tag/v0.4.6).

The integration was [added to the default HACS catalog](https://github.com/hacs/default/pull/8869) on November 2, 2026. Existing custom-repository installations remain usable.

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
- Anycubic Kobra 3 Max + ACE 1 Pro: basic functions, spool/drying status and cloud camera reported; drying controls are tracked in [#23](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues/23).
- Anycubic Kobra X, including known ACE/material setups and camera light
- Anycubic Kobra S1 basic functions; camera and chamber light still need further testing
- Anycubic Kobra 2, Kobra 2 Max, and Kobra 2 Pro
- Anycubic Photon Mono M5s basic support
- Anycubic M7 Pro basic support

Feedback about additional models is welcome. Never include tokens, private IP addresses, serial numbers, printer IDs, or other personal data in public issues.

### Kobra S1 Max elapsed print time

Version **0.4.4** includes the elapsed-time fix for [#17](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues/17): the Kobra S1 Max (model 20029) reports elapsed print time in seconds. Only this value is converted to the minutes still expected by the existing `job_time_elapsed` sensor, panel and dashboard card. Fractional minutes preserve seconds: `2601` seconds becomes `43.35` minutes, displayed as 43 minutes 21 seconds.

Cloud polling and MQTT use the same conversion without modifying or repeatedly dividing the raw values. Remaining time stays in minutes and its derived ETA is unchanged. Other printer models keep their existing behavior; units are never guessed from print duration or progress. Existing entity IDs and the card do not need changes. Automated regression checks cover the correction; confirmation on the affected S1 Max is still pending.

Background: in addition to the issue report, a [hardware capture on the S1 Max](https://github.com/chrisfore/anycubic_ha_local/blob/376bf5546ce9cfbc1f8d52e8f14685e08ae7d051/research/PROTOCOL-VALIDATED.md#info-report-data-master-object) documents elapsed seconds with remaining time still in minutes. This exception is not extended to other models.

### ACE controls and drying (#23)

ACE controls are below the material spools in the panel's **Main view**; the **Side view** is for the camera. First save duration in minutes and temperature in °C under the integration's **Drying presets** options. Only fully configured presets get a start button. An idle printer's card may be collapsed; `alwaysShow: true` keeps its status and ACE controls visible.

The shared panel/card drying dialog resolves the existing `drying_start_preset_1` through `drying_start_preset_4` buttons. It calls the actual entity ID from the entity registry and refreshes immediately when changing between primary and secondary ACEs. Existing entity IDs remain valid.

Each stop button now targets only its selected ACE. Previously the secondary stop request could lose its box ID and target the primary ACE, while the primary stop button could stop both ACEs. The internal API's stop-all call without a box selection remains available. Automated tests cover single/dual ACEs and the Kobra X internal material rack; confirmation on the affected Kobra 3 Max is still pending. The panel and separate dashboard card each need a rebuilt bundle to receive the dialog fix.

Drying reports can update the status, target temperature and remaining time when the measured temperature is omitted. On the Kobra X, the integration converts the observed seconds-based total duration to minutes. It retains the latest active MQTT status for each ACE until the reported time elapses or a stop arrives, and counts down locally between reports.

### Firmware MQTT reports (0.4.5)

Reported preparation phases such as `nozzle_purging`, `nozzle_cooling_off` and `hotbed_cooling_off` remain active and do not imply completion. Existing printing/paused jobs keep their status; initial preparation uses the existing `Preheating` state. Only explicit finished/cancelled reports end a job, and delayed phase reports cannot revive a completed/cancelled project. An unattributed phase does not overwrite the last terminal cloud project.

Fan `query` responses update the existing fan fields. Known informational `extrudeControl/getInfo` and modern `extfilbox` fields are consumed without guessing material, slot mappings or ambiguous per-tool temperatures. Omitted `feed_status` preserves the cached ACE feed state. Unknown fields remain visible. Camera `pushFailed` remains a real error with its vendor code.

The Kobra X completed a print through cooldown on the beta and acknowledged an ACE stop from Home Assistant. The observed leveling, filament change and drying messages were replayed against the fixes. Hardware feedback on preset visibility, start, status and stop remains open for the S1 Max and Kobra 3 Max. On dual ACEs, verify that stopping one leaves the other running.

### Kobra X hardware diagnostics and firmware reports

Starting with **0.4.6-beta.1**, **Build Plate Type**, **Nozzle Diameter**, and **Nozzle Material** appear as diagnostic entities after the corresponding MQTT reports arrive. On the Kobra X, build plate codes `1`, `2`, and `3` identify textured PEI, smooth / transfer, and low-temperature plates. Nozzle material codes `1` and `2` identify brass and hardened steel. These mappings are specific to the Kobra X. Unmapped codes remain visible in the `material_code` attribute. The nozzle diameter is shown in millimeters, including values such as 0.25 mm.

The built-in panel and matching dashboard card show the reported build plate and nozzle below the printer statistics when expanded. Entries without reported values stay hidden.

From **0.4.6**, the integration includes the original Slicer plate and nozzle images. The Anycubic Cloud sidebar panel and matching dashboard card load them automatically and center the thumbnails at the standard spool diameter. The dashboard card can still prefer custom images via `hardwareImagePath`. [Dashboard card images](https://github.com/ljschmitt/hass-anycubic_card/tree/v0.4.6#optional-local-hardware-images)

[Version 0.4.7](CHANGELOG.md#047) removes the shared actions and sidebar panel when the last Anycubic Cloud account unloads. Reloading an account registers them again. Use the [matching dashboard card 0.4.7](https://github.com/ljschmitt/hass-anycubic_card/releases/tag/v0.4.7).

From **0.4.6-beta.2**, the integration reads hardware settings when it first reaches a Kobra X. Open the plate type in the expanded card or use **Build Plate Selection** under the device's configuration entities. This control is available while a supported printer is online and idle. Select the plate physically installed and follow Anycubic's bed-leveling guidance after a change. The entity updates after the new value is reported by the cloud.

Version **0.4.6-beta.3** adds **Nozzle Selection** for the Kobra X. The options are brass (0.2, 0.25, 0.4, 0.6, and 0.8 mm) and hardened steel (0.4, 0.6, and 0.8 mm). Select the installed nozzle. Anycubic recommends PID tuning and bed leveling after a nozzle change.

The overview shows thumbnails when available and uses labels as a fallback. Selecting the plate or nozzle in the card opens a chooser with names and any available images. **Apply** sends the change. The integration then reads the setting back to confirm it.

**Current Status** includes the last reported calibration snapshot. Firmware and temperature reports update the existing entities. Successful file and preview acknowledgements leave file lists intact.

### ACE 2 Pro remaining filament

From **0.4.6**, `spool_info` includes `consumables_percent` for ACE 2 Pro slots. A reported estimate is used for loaded, automatically recognized spools. Manually configured, empty or reserved slots and missing or invalid estimates return `null`. The panel and matching card show **Unknown** for an occupied spool without a verified estimate, including the Kobra X's default 100% on manually configured slots. [Feedback in #18](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues/18)

## Screenshots

<img width="420" alt="Anycubic Kobra 3 status panel" src="screenshots/kobra3-1.png">
<img width="420" alt="Anycubic ACE material display" src="screenshots/anycubic-ace-ui.gif">

## Installation with HACS

Search for **Anycubic Cloud** in HACS, install it and restart Home Assistant. Then add the integration under **Settings → Devices & services**. If an older catalog has not refreshed yet, reload the repository data or use the custom-repository fallback:

1. Open **HACS -> Integrations -> menu -> Custom repositories**.
2. Add `https://github.com/ljschmitt/hass-anycubic_cloud_v3` as an **Integration**.
3. Search for **Anycubic Cloud** and install it.
4. Restart Home Assistant.
5. Open **Settings -> Devices & services -> Add integration**.

For MQTT support, select the **Slicer Next (Windows & macOS)** authentication method and provide its access token. The alternative web token method supports cloud polling but not MQTT.

Detailed token extraction, camera setup, Rinkhals/Moonraker mapping, entity migration, and troubleshooting instructions are available in the [German documentation](README.md).

<a id="recover-a-slicer-token-on-windows"></a>

### Recover a Slicer token (Windows and macOS)

Slicer Next 2.0.x still writes the required access token to its current debug log, but may label the URL parameter `id_token=` instead of the former `accessToken = ...` line. The command below supports both forms. It does not require Python, a repository download or process-memory access.

1. Open Slicer Next, sign in and open the printer view.
2. Copy the complete command for your operating system and run it once.

   **Windows** (PowerShell):

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

   **macOS** (Terminal; the log lives in `~/Library/Application Support/AnycubicSlicerNext/log/`, its file name changes on every start and is found automatically):

   ```bash
   bash <<'ANYCUBIC_TOKEN'
   f=
   for candidate in "$HOME/Library/Application Support/AnycubicSlicerNext/log/"debug_*.log; do
       [ -f "$candidate" ] || continue
       if [ -z "$f" ] || [ "$candidate" -nt "$f" ]; then f=$candidate; fi
   done
   if [ -z "$f" ]; then printf '%s\n' 'No Slicer debug log found. Sign in and open the printer view.' >&2; exit 1; fi
   t=$(grep -h -o -E '(accessToken[[:space:]]*=[[:space:]]*|id_token=)eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+' "$f" | tail -n 1 | sed -E 's/^(accessToken[[:space:]]*=[[:space:]]*|id_token=)//')
   if [ -z "$t" ]; then printf '%s\n' 'No Slicer token found in the latest log.' >&2; exit 1; fi
   if ! printf '%s' "$t" | pbcopy; then printf '%s\n' 'Could not copy token to clipboard.' >&2; exit 1; fi
   copied=$(pbpaste) || exit 1
   if [ "$copied" != "$t" ]; then printf '%s\n' 'Could not confirm the token in the clipboard. Run the command again.' >&2; exit 1; fi
   printf '%s\n' 'Token successfully copied and verified. Paste into Home Assistant with Cmd+V now.'
   ANYCUBIC_TOKEN
   ```

3. Paste the token into Home Assistant's **Slicer Next (Windows & macOS)** field during reauthentication or reconfiguration. Do not delete an existing integration just to replace its token.
4. Clear the clipboard after pasting (Windows: `Set-Clipboard -Value ''`, macOS: `pbcopy < /dev/null`), including clipboard history or sync when enabled.

Both commands read only the newest local Slicer debug log and copy the last matching JWT. A success message appears only after checking that the clipboard contains the extracted token (green in PowerShell). The token itself is not printed. The macOS block explicitly uses the built-in Bash and can also be pasted into a zsh Terminal. Paste directly into Home Assistant afterwards; copying other text replaces the token in the clipboard. Home Assistant validates the pasted token with Anycubic. Although the current Slicer calls the URL parameter `id_token`, the tested Slicer version stores an `access-token` JWT there. If no token is found, sign in, open the printer view and retry. For Slicer builds that genuinely omit the token, the repository retains the advanced [PowerShell launcher](scripts/recover_slicer_token.ps1) and [Python helper](scripts/recover_slicer_token.py) as a fallback, not as the normal path.

The Windows log extraction was tested locally with Slicer Next 2.0.0.3. A contributor reported successful macOS extraction with that Slicer version on Apple Silicon. Automated tests cover both token spellings, newest-log selection and clipboard failures; a native macOS check runs in CI. This does not guarantee future Slicer builds or cloud changes.

**Repeated authentication requests with a still-valid token (`int()` / `NoneType`):** Anycubic can return `external_shelves.id: null` and `loaded: null` for an unassigned external spool holder. Through version 0.4.1, this can abort setup after a successful cloud login and incorrectly request reauthentication. Version **0.4.2** treats this empty holder as absent and gives optional `null` status fields on existing holders the same inactive defaults as omitted fields. Invalid cloud data during setup is retried without requesting a new token. Install the new version and restart Home Assistant for this fix to take effect. A genuinely rejected or expired token still requires reauthentication.

Use only your own account. Never upload tokens, dumps, configuration files or unredacted logs. Web authentication remains an alternative for polling without MQTT.

## Dashboard card

### Loaded slot of the primary ACE

Version **0.4.3** adds `loaded_slot` to the existing `sensor.anycubic_printer_ace_spools` sensor. This is the primary ACE's unchanged, **zero-based** cloud/MQTT value: `0` is its first slot, `1` its second slot, and `-1` means no slot is loaded. The value is `null` when no primary ACE exists. Offline printers can retain a cached value; it does not confirm current filament movement.

With multiple ACE units, this attribute refers only to the primary ACE. The Kobra X internal material rack is not treated as the primary ACE. Existing one-based `local_slot`, `slot` and `display_slot` fields and print-slot mappings stay unchanged. Before accessing `spool_info[loaded_slot]`, check that the value is a number from `0` to the list length minus one; never interpret `-1` as the last list item. This is an additional attribute, not a new entity.

The recommended companion dashboard card is [ljschmitt/hass-anycubic_card](https://github.com/ljschmitt/hass-anycubic_card). The integration also includes its own Home Assistant side panel, so the external card is optional.

From [0.4.8](CHANGELOG.md#048), the power icon reflects the entity configured through `powerEntityId`. **On** uses the theme's success color, **Off** is a ring, and **Unknown** and **Unavailable** use a neutral icon. The tooltip shows the state reported by Home Assistant. Use the [matching dashboard card 0.4.8](https://github.com/ljschmitt/hass-anycubic_card/releases/tag/v0.4.8).

## Camera behavior

In the panel's Side view, the cloud camera stream starts only after pressing Play. The optional dashboard card also supports the cloud stream after clicking the printer graphic. Both use an authenticated Agora/WebRTC session in the browser; the integration does not create a native Home Assistant `camera.*` entity or expose a fixed RTSP/MJPEG URL to copy into another camera integration.

The card currently has no setting to open its camera view automatically. `alwaysShow: true` keeps status and ACE controls expanded, but does not start camera playback. Automatically opening the camera would be a separate feature.

Alternative firmware cameras can be mapped per printer to an existing Home Assistant `camera.*` entity. Printers without a mapping continue to use the Anycubic cloud camera.

If a supported local camera source is available, it can be added with [Generic Camera](https://www.home-assistant.io/integrations/generic/) and mapped with `cameraEntityId` or the panel's per-printer `cameraEntityIds`. Compatibility of an alternative firmware or bridge with the Kobra 3 Max is not confirmed here. Cloud playback requires a secure browser context such as HTTPS.

## Security and privacy

### Branding in Home Assistant and HACS

Home Assistant 2026.3+ can serve the integration's local `brand/icon.png`, `dark_icon.png`, `logo.png` and `dark_logo.png` through its authenticated `/api/brands/integration/anycubic_ha_integration/` endpoint. A successful PNG response confirms local delivery; an unauthenticated request can return 403.

HACS 2.0.5 still [hardcodes a public Brands CDN URL for update-entity images](https://github.com/hacs/integration/blob/2.0.5/custom_components/hacs/update.py#L71-L79), and its old frontend also uses CDN-based icon resolution. Inclusion in the HACS catalog does not publish an integration's local images to that CDN. Refreshing the browser cache or re-adding the repository does not repair this source mismatch.

[Frenck confirms this is fixed in Marketplace with Home Assistant 2026.11](https://github.com/hacs/integration/issues/5223#issuecomment-6222989180); its [update entity uses the local Brands endpoint](https://github.com/home-assistant/core/blob/2026.11.0/homeassistant/components/marketplace/update.py#L94-L104). Plan upgrades/migration using the [official announcement](https://github.com/hacs/integration/issues/5590). This integration does not patch or upgrade HACS/Home Assistant.

### Repository-only developer helpers (from 0.4.5-beta.1)

Following [Frenck's review](https://github.com/hacs/default/pull/8869#pullrequestreview-5735268964), unused diagnostics, delete/upload/print helpers and their token sample are moved outside the installed integration to [`scripts/anycubic_helpers/`](scripts/anycubic_helpers/README.md). Imports do not execute their actions. The translation generator now runs with `python scripts/build_translations.py`; CI and development instructions use that path. Existing installed files are not removed by this source change until an updated package is installed through the normal workflow.

This integration communicates with Anycubic cloud services and can control supported printer actions. Use it at your own risk and test control functions carefully.

Do not publish Anycubic tokens, Home Assistant credentials, printer IDs, serial numbers, MAC addresses, private URLs, local IP addresses, diagnostics containing personal data, or environment-specific camera mappings.

**MQTT certificate verification (from 0.4.4):** Connections require a valid broker certificate issued by the bundled Anycubic CA and a matching hostname (`CERT_REQUIRED`, `check_hostname=True`), with Paho's insecure mode disabled and TLS 1.2 as the minimum. Missing, untrusted or expired certificates and incorrect hostnames fail closed; there is no fallback to an unverified connection.

Anycubic's current broker and client certificates still have SHA-1 signatures, requiring OpenSSL compatibility level `SECLEVEL=0`. Offered cipher suites exclude anonymous, unencrypted and PSK/SRP authentication. The vendor CA omits KeyUsage, so standard TLS-client certificate verification is used instead of the additional `VERIFY_X509_STRICT` defaults in newer Python versions. Vendor certificates are unchanged. This remains a protocol limitation; certificate-chain, validity and hostname checks stay enabled. A live TLS 1.3 connection, successful MQTT authentication and acknowledged subscriptions were verified without publishing printer commands.

## Support and feedback

- [Open an issue](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues)
- [Latest release](https://github.com/ljschmitt/hass-anycubic_cloud_v3/releases/latest)
- [German documentation](README.md)

## Contributors

- [@ljschmitt](https://github.com/ljschmitt)
- [@WaresWichall](https://github.com/WaresWichall) – original development
- [@sunnyfunny1977-alt](https://github.com/sunnyfunny1977-alt) – primary-ACE loaded-slot reporting ([#9](https://github.com/ljschmitt/hass-anycubic_cloud_v3/pull/9))
- [@sphings79](https://github.com/sphings79) – macOS Slicer-token recovery instructions ([#19](https://github.com/ljschmitt/hass-anycubic_cloud_v3/pull/19))
- [@flouou](https://github.com/flouou) – early analysis and proposed fix for incomplete cloud/ACE data, plus token-recovery help ([#12](https://github.com/ljschmitt/hass-anycubic_cloud_v3/pull/12), [#11](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues/11))

Thanks also to everyone reporting bugs, supplying diagnostics and testing fixes on their printers.

## License

GNU General Public License v3.0. See [LICENSE](LICENSE).
