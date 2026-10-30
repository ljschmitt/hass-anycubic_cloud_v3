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

### Kobra S1 Max elapsed print time

Version **0.4.4** includes the elapsed-time fix for [#17](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues/17): the Kobra S1 Max (model 20029) reports elapsed print time in seconds. Only this value is converted to the minutes still expected by the existing `job_time_elapsed` sensor, panel and dashboard card. Fractional minutes preserve seconds: `2601` seconds becomes `43.35` minutes, displayed as 43 minutes 21 seconds.

Cloud polling and MQTT use the same conversion without modifying or repeatedly dividing the raw values. Remaining time stays in minutes and its derived ETA is unchanged. Other printer models keep their existing behavior; units are never guessed from print duration or progress. Existing entity IDs and the card do not need changes. Automated regression checks cover the correction; confirmation on the affected S1 Max is still pending.

Background: in addition to the issue report, a [hardware capture on the S1 Max](https://github.com/chrisfore/anycubic_ha_local/blob/376bf5546ce9cfbc1f8d52e8f14685e08ae7d051/research/PROTOCOL-VALIDATED.md#info-report-data-master-object) documents elapsed seconds with remaining time still in minutes. This exception is not extended to other models.

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

## Camera behavior

The cloud camera stream is started only after the user presses Play. It is stopped when leaving the view, changing printers, or stopping playback. This prevents background camera sessions.

Alternative firmware cameras can be mapped per printer to an existing Home Assistant `camera.*` entity. Printers without a mapping continue to use the Anycubic cloud camera.

## Security and privacy

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
