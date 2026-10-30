# Anycubic HA Integration

[Deutsch](README.md) | [English](README.en.md)

[![Latest release](https://img.shields.io/github/v/release/ljschmitt/hass-anycubic_cloud_v3?label=release)](https://github.com/ljschmitt/hass-anycubic_cloud_v3/releases/latest)
[![GitHub stars](https://img.shields.io/github/stars/ljschmitt/hass-anycubic_cloud_v3)](https://github.com/ljschmitt/hass-anycubic_cloud_v3/stargazers)
[![License: GPL-3.0](https://img.shields.io/github/license/ljschmitt/hass-anycubic_cloud_v3)](LICENSE)

[![In HACS oeffnen](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ljschmitt&repository=hass-anycubic_cloud_v3&category=integration)

Home-Assistant-Integration fuer Anycubic-Cloud-Drucker mit Statussensoren, MQTT-Echtzeitupdates, Druck- und Dateifunktionen, ACE-/Materialverwaltung und optionaler Kameraansicht.

Die Integration ist derzeit ueber HACS als benutzerdefiniertes Repository installierbar. Die [Aufnahme in den standardmaessigen HACS-Katalog](https://github.com/hacs/default/pull/8869) befindet sich in der Pruefung.

> 🗓️ **Aktuelles Release: 0.4.3**
>
> - Der bestehende ACE-Spulensensor meldet den aktiven Slot der primaeren ACE als zusaetzliches Attribut `loaded_slot`.
> - Token-Anleitung und Einrichtungsdialog unterstuetzen Windows und macOS mit Pruefung der Zwischenablage.
> - Bestehende Windows-Anweisungen, Dokumentationslinks, Entity-IDs und Druck-Slotzuordnungen bleiben erhalten.
> - Passende Dashboard-Card auf Version 0.4.3 synchronisiert; das Card-Verhalten bleibt unveraendert.
>
> Getestet mit **Home Assistant 2026.8.3**, freigegeben ab **Home Assistant 2025.10.0**.
> MQTT-Echtzeitupdates benoetigen **Slicer Next (Windows oder macOS)** und dessen **Access-Token**.

➡️ Eigener Fork mit:
- Fehlerkorrekturen
- deutschen Texten
- MQTT-Erweiterungen
- verbessertem MQTT-Fallback bei Verbindungsproblemen

---

## 📚 Inhalt

- [🧵 Kompatible Drucker](#-kompatible-drucker)
- [⚙️ Funktionsweise](#-funktionsweise)
- [🎨 Frontend-Card](#-frontend-card)
- [🖼️ Galerie](#-galerie)
- [🧩 Features](#-features)
- [📷 Kamera / Nebenansicht](#-kamera--nebenansicht)
- [📦 Installation über HACS (empfohlen)](#-installation-über-hacs-empfohlen)
- [🖐️ Manuelle Installation](#-manuelle-installation)
- [⚠️ Sicherheit und Haftung](#️-sicherheit-und-haftung)
- [🔐 Token auslesen (Slicer Next)](#-token-auslesen-slicer-next)
- [🌐 Web-Login (ohne MQTT, nur Polling)](#-web-login-ohne-mqtt-nur-polling)
- [📥 Releases](#-releases)
- [🙌 Mitwirkende](#-mitwirkende)
- [📄 Lizenz](#-lizenz)
- [💬 Feedback / Probleme](#-feedback--probleme)
- [✅ Kompatibilität](#-kompatibilität)

---

## 🧵 Kompatible Drucker

### Getestet / rueckgemeldet

- ✅ Kobra 3 Combo
- ✅ Kobra X (Basisfunktionen; ACE-/Materialanzeige fuer bekannte 4-Farben-Setups verbessert; Kameralicht-Entity getestet)
- ✅ Kobra S1 (Basisfunktionen rueckgemeldet; Kamera und Chamber-Light noch offen)
- ✅ Kobra 2, 2 Max, 2 Pro
- ✅ Photon Mono M5s (Basis)
- ✅ Anycubic M7 Pro (Basis)

### Zum Testen / Rueckmeldung gesucht

- 🧪 Weitere noch nicht bestaetigte Modelle

Wenn du ein noch nicht bestaetigtes Modell testest, bitte Rueckmeldung geben: Wird das Geraet angelegt, welche Entitaeten funktionieren, gibt es MQTT- oder Kamera-Auffaelligkeiten? Bitte keine Tokens, privaten IPs, Seriennummern oder persoenlichen Daten in Issues hochladen.

---

## ⚙️ Funktionsweise

- Cloud-Polling: alle **1 Minute**
- MQTT (Echtzeit): **mehrfach pro Sekunde**
- Erfordert **Slicer Next Token** für MQTT-Zugriff

### Druckzeit beim Kobra S1 Max (Entwicklungsstand)

Die Korrektur zu [#17](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues/17) ist noch nicht Bestandteil von Version 0.4.3: Beim Kobra S1 Max (Modell 20029) wird die verstrichene Druckzeit in Sekunden gemeldet. Die Integration rechnet ausschliesslich diesen Wert in die weiterhin vom Sensor `job_time_elapsed`, Panel und Dashboard-Card erwarteten Minuten um; Sekunden bleiben als Nachkommastellen erhalten. Beispielsweise werden `2601` Sekunden als `43.35` Minuten und damit als 43 Minuten 21 Sekunden angezeigt.

Cloud-Polling und MQTT verwenden dieselbe Umrechnung, ohne die Rohwerte zu veraendern oder mehrfach zu teilen. Die Restzeit bleibt in Minuten und die daraus berechnete ETA unveraendert. Andere Druckermodelle behalten die bisherige Verarbeitung; es gibt keine automatische Einheitenschaetzung anhand der Druckdauer oder des Fortschritts. Bestehende Entity-IDs und die Card muessen dafuer nicht geaendert werden. Die Korrektur ist automatisiert geprueft; die Bestaetigung am betroffenen S1 Max steht noch aus.

Hintergrund: Neben dem Fehlerbericht dokumentiert eine [Messung am S1 Max](https://github.com/chrisfore/anycubic_ha_local/blob/376bf5546ce9cfbc1f8d52e8f14685e08ae7d051/research/PROTOCOL-VALIDATED.md#info-report-data-master-object) verstrichene Sekunden bei weiterhin minutenbasierter Restzeit. Diese Ausnahme wird nicht auf andere Modelle uebertragen.

---

## 🎨 Frontend-Card

Empfohlen fuer diese Integration ist der passende Anycubic-Card-Fork:

➡️ [ljschmitt/hass-anycubic_card](https://github.com/ljschmitt/hass-anycubic_card)

Die urspruengliche [Anycubic-Karte fuer Home Assistant](https://github.com/WaresWichall/hass-anycubic_card) ist eine separate Dashboard-/Lovelace-Card und wurde fuer die originale Anycubic-Integration gebaut. Dieser Fork bleibt naeher an den Entity-IDs und Zusatzfunktionen dieser Integration. Bitte fuer neue Setups bevorzugt den Fork verwenden, damit Dashboard-Card und Integration denselben Stand erwarten.

Die Integration selbst bringt weiterhin ein eigenes Home-Assistant-Panel mit. Die externe Card ist optional und muss separat in HACS als Dashboard-/Frontend-Card installiert werden.

### Entity-IDs und externe Karten

Home Assistant kann Entity-IDs aus lokalisierten Anzeigenamen erzeugen. Dadurch konnten auf deutsch eingestellten Systemen z. B. Entity-IDs mit deutschen Begriffen entstehen, waehrend externe Dashboard-Karten haeufig englische Standardnamen erwarten.

Ab Version **0.2.5** schlagen neue Anycubic-Entities stabile englische Entity-IDs vor. Entity-Anzeigenamen bleiben ebenfalls Englisch und orientieren sich an den vom Anycubic-/Dashboard-Card-Umfeld erwarteten Namen. Deutsche Uebersetzungen werden fuer Konfiguration, Services, Panel-/Card-UI und Dokumentation verwendet, aber nicht fuer Entity-Namen.

Ab Version **0.2.6** bleiben die Print-Button-Entity-IDs bewusst beim vom Dashboard-Plugin erwarteten Format `pause_print`, `resume_print` und `cancel_print`. Die Sensor-Kompatibilitaet bleibt davon unberuehrt.

Bestehende Entity-IDs werden bewusst **nicht automatisch** umbenannt, weil das vorhandene Dashboards, Automationen oder Skripte brechen koennte. Wer bestehende lokalisierte Entity-IDs auf die stabilen englischen Namen umstellen moechte, kann den Dienst `anycubic_ha_integration.migrate_entity_ids` verwenden:

1. In Home Assistant **Entwicklerwerkzeuge -> Dienste** oeffnen
2. Dienst `anycubic_ha_integration.migrate_entity_ids` auswaehlen
3. Zuerst mit `dry_run: true` ausfuehren und die geplanten Umbenennungen im Home-Assistant-Log pruefen
4. Nur wenn die geplanten Aenderungen passen, erneut mit `dry_run: false` ausfuehren
5. Danach eigene Dashboards, Karten, Automationen und Skripte pruefen

Der Dienst benennt nur Entity-Registry-Eintraege dieser Integration um. Er legt keine Kameras an, loescht keine Entities und veraendert keine persoenlichen Home-Assistant-Einstellungen ausser den bewusst migrierten Entity-IDs.

### Aktiver Slot der primaeren ACE

Der bestehende Sensor `sensor.anycubic_printer_ace_spools` erhaelt ab Version **0.4.3** das zusaetzliche Attribut `loaded_slot`. Es gibt den unveraenderten, **nullbasierten** Cloud-/MQTT-Wert der primaeren ACE zurueck: `0` ist ihr erster Slot, `1` ihr zweiter Slot und `-1` bedeutet, dass kein Slot geladen ist. Ohne primaere ACE ist der Wert `null`. Bei offline befindlichen Druckern kann der letzte bekannte Wert stehen bleiben; er bestaetigt keine aktuelle Filamentbewegung.

Bei mehreren ACE-Geraeten gilt dieses Attribut ausschliesslich fuer die primaere ACE. Beim Kobra X wird das interne Materialregal nicht als primaere ACE gewertet. Die vorhandenen Felder `local_slot`, `slot` und `display_slot` bleiben einsbasiert und unveraendert. Vor einem Zugriff auf `spool_info[loaded_slot]` immer pruefen, ob `loaded_slot` eine Zahl zwischen `0` und der Listenlaenge minus eins ist; insbesondere darf `-1` nicht als letzter Listeneintrag interpretiert werden. Das Attribut benoetigt keine neue Entity und aendert keine Druck-Slotzuordnung.

---

## 🖼️ Galerie

<img width="300" alt="Anycubic Kobra 3 status panel" src="screenshots/kobra3-1.png">
<img width="300" alt="Anycubic ACE material display" src="screenshots/anycubic-ace-ui.gif">
<img width="300" alt="Anycubic Kobra 2 Pro status card" src="screenshots/kobra2-2.png">
<img width="300" alt="Anycubic print service" src="screenshots/kobra3-print.png">
<img width="200" alt="Anycubic Kobra 2 status card" src="screenshots/kobra2-1.png">

---

## 🧩 Features

- Mehrere Drucker gleichzeitig
- Die Druckerauswahl zeigt nur Geraete dieser Integration; gleichnamige Netzwerkgeraete anderer Integrationen werden nicht als zusaetzliche Drucker aufgefuehrt.
- Druckstart / Pause / Fortsetzen / Abbruch (via Services & UI)
- Vorbereiteter Druckstart aus lokalen und USB-Dateilisten mit farbiger Auswahl aller aktuell geladenen Materialquellen. Beim Kobra X werden Materialregal und ACE gemeinsam angeboten, waehrend die fuer den ACE reservierte Zuleitung nicht als Filamentspule auswaehlbar ist. Die Auswahlreihenfolge wird als Slotzuordnung uebernommen; eine aufklappbare manuelle Slotnummernliste bleibt als Fallback erhalten.
- Die Druckvorbereitung zeigt eine Vorschau, wenn die Anycubic-Projekthistorie fuer denselben Drucker einen exakt passenden Dateinamen mit Bild enthaelt. Ohne sicheren Treffer bleibt der Druck weiterhin moeglich und es wird keine fremde Vorschau geraten.
- Leere lokale und USB-Unterordner werden als leere Ordner angezeigt, auch wenn der Drucker in der MQTT-Antwort kein `records`-Feld mitsendet.
- ACE-Slot-Verwaltung (Farbe, Presets, Services)
- Dateimanager (MQTT benötigt)
- Sensoren: Temp, Speed, Fan, Job-Fortschritt, Name, Zeit, …
- Firmware-Update-Entitäten
- MQTT-Aktivität automatisch während Druck (oder dauerhaft)
- Frontend-Panel mit Status, Nebenansicht + Dateimanager
- Native Kameralicht-Entity fuer Drucker, die das Anycubic-Kamera-/Lichtkommando unterstuetzen
- Spulen-Trocknung & Materialmanagement (ACE)
- Konfigurierbarer MQTT-Modus („nur beim Drucken“, dauerhaft, deaktiviert)

---

## 📷 Kamera / Nebenansicht

Die Nebenansicht bietet standardmaessig den Anycubic-Cloud-Kamerastream des ausgewaehlten Druckers an. Fuer normale Anycubic-Firmware muss dafuer nichts weiter eingerichtet werden.

Der Kamerastream wird bewusst **nicht automatisch im Hintergrund gestartet**. Erst wenn in der Nebenansicht der Play-Button gedrueckt wird, wird die lokale Kameraquelle bzw. die Anycubic-Cloud-Kamerasession angefragt. Beim Stoppen, Verlassen der Ansicht oder Wechsel auf einen anderen Drucker wird der Stream wieder beendet.

Bei Druckern mit alternativer Firmware oder lokaler Kamera-Bruecke, z. B. Rinkhals/Moonraker, kann optional pro Drucker eine Home-Assistant-`camera.*`-Entity verwendet werden. Das ueberschreibt nicht die Standardkamera fuer alle Drucker, sondern nur den jeweils gemappten Drucker.

Hinweis zum Anycubic-Cloudstream: Der verschluesselte WebRTC-Stream benoetigt im Browser einen sicheren Kontext, also z. B. HTTPS, Home Assistant Cloud oder localhost. Wenn Home Assistant nur ueber unverschluesseltes HTTP aufgerufen wird, kann der Browser die Kamera blockieren. Eine lokale Home-Assistant-`camera.*`-Entity wird dagegen ueber den Home-Assistant-Kameraproxy geladen und ist deshalb der sauberste Weg fuer lokale Streams.

### Kameralicht

Drucker, die das Anycubic-Kamera-/Lichtkommando unterstuetzen, erhalten eine native Home-Assistant-`light.*`-Entity, z. B. `light.anycubic_printer_camera_light`. Diese Entity schaltet das Kameralicht des Druckers ueber die Anycubic-Cloud-/MQTT-Befehle, so wie es auch im Slicer-Print-Setting angezeigt wird.

Diese native Entity ist nicht dasselbe wie die optionale `lightEntityId` in der externen Dashboard-Card. `lightEntityId` verweist auf eine beliebige vorhandene Home-Assistant-Lichtquelle, z. B. eine Raumlampe. Die native Kameralicht-Entity gehoert dagegen zum Anycubic-Drucker selbst.

Da Anycubic die Lichtfunktion nicht bei jedem Modell gleich in der Funktionsliste deklariert, wird die Entity bei Druckern mit Kamera-/Video-Funktion oder offizieller `VIDEO_LIGHT`-/`BOX_LIGHT`-Funktion angelegt. Wenn ein Drucker den Befehl nicht unterstuetzt oder offline ist, kann das Schalten fehlschlagen oder unverfuegbar bleiben.

Fuer gezielte Modelltests gibt es den Diagnose-Dienst `anycubic_ha_integration.debug_set_light_status`. Er sendet das Anycubic-Lichtkommando mit einem expliziten `light_type` an einen ausgewaehlten Drucker und ist nur fuer kontrollierte Tests gedacht, z. B. wenn geklaert werden muss, welcher Lichtkanal bei einem Modell Kopflicht oder Kameralicht schaltet.

### Integrierte Rinkhals/Moonraker-Webcam als HA-Kamera anlegen

Die integrierte Rinkhals-Webcam wird von Moonraker meist als MJPEG-Stream angeboten:

```text
Snapshot: http://<drucker-ip>:4409/webcam/?action=snapshot
Stream:   http://<drucker-ip>:4409/webcam/?action=stream
```

In Home Assistant:

1. **Einstellungen -> Geraete & Dienste -> Integration hinzufuegen**
2. **MJPEG IP Camera** suchen und auswaehlen
3. Als **MJPEG URL** die Stream-URL eintragen
4. Als **Still Image URL** die Snapshot-URL eintragen
5. Optional einen Namen vergeben, z. B. `Printer Webcam`
6. Nach dem Anlegen die Entity-ID pruefen, z. B. `camera.printer_webcam`

> Hinweis: Wenn beim Einrichten mit **Generic Camera** zwar der Snapshot angezeigt wird, der Stream aber nur laedt, ist das fuer diese Moonraker-URL normal. Die `/webcam/?action=stream`-Adresse ist ein MJPEG-HTTP-Stream und gehoert in Home Assistant zur **MJPEG IP Camera**-Integration. **Generic Camera** ist eher fuer Snapshot plus separate RTSP-/Streaming-Quelle geeignet.

> Wichtig: Nicht die Fluidd-Webcam-Ansicht oder eine go2rtc-Raumkamera-URL eintragen, wenn die integrierte Drucker-Webcam verwendet werden soll. Fuer Rinkhals ist die integrierte Kamera in der Regel der `/webcam/`-Pfad des Druckers.

### Kamera einem bestimmten Drucker zuordnen

Anschliessend wird die Kamera im Anycubic-Panel nur fuer diesen Drucker gemappt. Die Home-Assistant-Bereichs- oder Geraetezuordnung der Kamera reicht dafuer nicht aus; sie dient nur der Home-Assistant-Organisation.

Das Mapping gehoert in die **Panel-Kartenkonfiguration** der Anycubic-Integration:

1. **Einstellungen -> Geraete & Dienste -> Anycubic HA Integration**
2. Beim Integrationseintrag **Konfigurieren** auswaehlen
3. **Panel-Kartenkonfiguration** oeffnen
4. Falls dort `null` steht, den Inhalt durch die YAML-Konfiguration ersetzen

Die Drucker-ID fuer den Schluessel kann direkt aus der Anycubic-Panel-URL abgelesen werden. Wenn die URL z. B. so aussieht:

```text
/anycubic_ha_integration/<printer-panel-id>/main
```

dann ist `<printer-panel-id>` der Schluessel fuer `cameraEntityIds`.

Die Kamera-Entity-ID findest du in Home Assistant auf der Kamera-Entity, z. B. `camera.printer_webcam`.

```yaml
cameraEntityIds:
  "<printer-panel-id>": camera.printer_webcam
```

Der Schluessel kann ausserdem die Anycubic-Drucker-ID bzw. Seriennummer sein. Alternativ kann die Home-Assistant-Device-ID des Druckers verwendet werden.

Beispiel mit mehreren Druckern:

```yaml
cameraEntityIds:
  "<first-printer-panel-id>": camera.first_printer_webcam
  "<second-printer-panel-id>": camera.second_printer_webcam
```

Drucker ohne Eintrag in `cameraEntityIds` verwenden weiterhin automatisch den Anycubic-Cloud-Kamerastream.

Fuer einfache Setups mit nur einer Kamera kann weiterhin die bestehende Option `cameraEntityId` verwendet werden. `cameraEntityIds` hat Vorrang und ist fuer mehrere Drucker die empfohlene Variante.

---

## 📦 Installation über HACS (empfohlen)

1. **HACS → Integrationen → ⋯ → Custom Repositories**
2. Repository:  
   https://github.com/ljschmitt/hass-anycubic_cloud_v3  
   Kategorie: **Integration**
3. **Daten neu laden**
4. Integration in HACS suchen:  
   **Anycubic HA Integration**
5. Installieren → Home Assistant **neustarten**
6. **Einstellungen → Geräte & Dienste → Integration hinzufügen**

> ⚠️ Wähle als Auth-Methode: **Slicer Next (Windows & macOS)**  
> und füge den **Access-Token** ein (siehe unten).

Updates werden von HACS nur dann automatisch angeboten, wenn diese Integration als HACS-Custom-Repository installiert wurde. Bei manueller ZIP-Installation muss die Integration auch manuell aktualisiert werden.

### Brand-/Icon-Hinweis

Home Assistant 2026.3 und neuer kann Brand-Bilder direkt aus `custom_components/anycubic_ha_integration/brand/` laden. Diese Integration liefert dafuer `icon.png`, `logo.png`, `dark_icon.png` und `dark_logo.png` mit.

Wenn Home Assistant selbst das Icon korrekt zeigt, HACS in der Download-Liste aber weiterhin ein Platzhalter-Icon anzeigt, liegt das an der HACS-/Brands-CDN-Anzeige und nicht an den lokalen Brand-Dateien der Integration. Direkte Aufrufe von `/api/brands/integration/anycubic_ha_integration/icon.png` benoetigen ausserdem eine gueltige Home-Assistant-Authentifizierung; ohne Token ist ein `403 Forbidden` normal.

---

## 🖐️ Manuelle Installation

1. Repository als ZIP herunterladen  
2. Entpacken nach:  
   /config/custom_components/anycubic_ha_integration/
3. Home Assistant neu starten
4. Integration hinzufügen wie oben

Manuell installierte Versionen erhalten keine automatische Update-Anzeige in HACS. Fuer automatische Update-Hinweise bitte die Installation ueber HACS als Custom Repository verwenden.

---

## ⚠️ Sicherheit und Haftung

Diese Integration steuert und liest 3D-Drucker ueber Anycubic Cloud, Services und optional MQTT. Die Nutzung erfolgt auf eigene Verantwortung.

Ich uebernehme keine Haftung fuer Schaeden am 3D-Drucker, an angeschlossenem Zubehoer, an Filament, Druckobjekten oder der Umgebung. Bitte alle Funktionen vorsichtig verwenden, neue Versionen gruendlich testen und insbesondere Steuerbefehle wie Druckstart, Pause, Abbruch, Temperatur-, ACE- und Materialslot-Aenderungen aufmerksam pruefen.

Fuer die Anycubic-MQTT-Verbindung sind die im Projekt enthaltenen Anycubic-TLS-Client-Zertifikatsdateien erforderlich. Sie gehoeren zur Anycubic-Protokollanbindung und enthalten keine benutzerspezifischen Home-Assistant- oder Anycubic-Zugangsdaten. Eigene Tokens, Logs, Screenshots mit Tokens oder lokale Konfigurationsdateien sollten niemals in Issues, Pull Requests oder Releases hochgeladen werden.

**MQTT-Zertifikatspruefung (Entwicklungsstand nach 0.4.3):** Die Verbindung verlangt ein gueltiges Broker-Zertifikat der mitgelieferten Anycubic-CA und einen passenden Hostnamen (`CERT_REQUIRED`, `check_hostname=True`); die Paho-Ausnahme fuer unsichere Verbindungen ist deaktiviert. TLS 1.2 ist die Mindestversion. Fehlende, fremde oder abgelaufene Zertifikate und falsche Hostnamen fuehren zum Verbindungsfehler, ohne Rueckfall auf eine ungepruefte Verbindung.

Anycubics derzeitige Broker- und Client-Zertifikate sind noch mit SHA-1 signiert. Deshalb ist OpenSSL-Kompatibilitaetsstufe `SECLEVEL=0` erforderlich; die angebotenen Cipher-Suites schliessen anonyme, unverschluesselte und PSK-/SRP-Verfahren aus. Die Hersteller-CA hat keine KeyUsage-Erweiterung; verwendet wird die normale TLS-Client-Zertifikatspruefung statt der zusaetzlichen `VERIFY_X509_STRICT`-Vorgaben neuerer Python-Versionen. Die Herstellerzertifikate werden nicht veraendert. Dies ist eine verbleibende Protokoll-Einschraenkung, keine Abschaltung der Zertifikats-, Gueltigkeits- oder Hostnamenpruefung. Die gepruefte Verbindung wurde mit TLS 1.3, erfolgreicher MQTT-Anmeldung und bestaetigten Abonnements getestet, ohne Druckerbefehle zu veroeffentlichen.

Fehler, Verbesserungsvorschlaege und Erfahrungen mit weiteren Druckermodellen koennen gerne ueber GitHub Issues gemeldet werden.

---

<a id="windows-token-aus-dem-laufenden-slicer-auslesen"></a>

## 🔐 Token auslesen (Slicer Next)

Slicer Next 2.0.x schreibt den benoetigten Access-Token weiterhin in das aktuelle Debug-Log, verwendet dort aber teilweise den Parameternamen `id_token=` statt der frueheren Zeile `accessToken = ...`. Der folgende Befehl unterstuetzt beide Schreibweisen. Python, ein Repository-Download und Speicherzugriff sind fuer den normalen Weg nicht erforderlich.

1. **Slicer Next starten, einloggen und die Druckeransicht oeffnen.**
2. Den Befehl fuer das eigene Betriebssystem vollstaendig kopieren und einmal ausfuehren.

   **Windows** (PowerShell):

   ```powershell
   & {
       $ErrorActionPreference = 'Stop'
       $log = Get-ChildItem "$env:AppData\AnycubicSlicerNext\log\debug_*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
       if (!$log) { throw 'Kein Slicer-Debug-Log gefunden. Slicer starten, einloggen und die Druckeransicht oeffnen.' }
       $token = (Select-String -Path $log.FullName -Pattern '(?:accessToken\s*=\s*|id_token=)(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)' -AllMatches).Matches | ForEach-Object { $_.Groups[1].Value } | Select-Object -Last 1
       if (!$token) { throw 'Kein Slicer-Token im neuesten Log gefunden.' }
       Set-Clipboard -Value $token
       if ((Get-Clipboard -Raw) -cne $token) { throw 'Token konnte nicht in der Zwischenablage bestaetigt werden. Befehl erneut ausfuehren.' }
       Write-Host 'Token erfolgreich in die Zwischenablage kopiert. Jetzt in Home Assistant mit Strg+V einfuegen.' -ForegroundColor Green
   }
   ```

   **macOS** (Terminal; das Log liegt unter `~/Library/Application Support/AnycubicSlicerNext/log/`, der Dateiname des Logs ist bei jedem Start anders und wird automatisch gefunden):

   ```bash
   bash <<'ANYCUBIC_TOKEN'
   f=
   for candidate in "$HOME/Library/Application Support/AnycubicSlicerNext/log/"debug_*.log; do
       [ -f "$candidate" ] || continue
       if [ -z "$f" ] || [ "$candidate" -nt "$f" ]; then f=$candidate; fi
   done
   if [ -z "$f" ]; then printf '%s\n' 'Kein Slicer-Debug-Log gefunden. Einloggen und Druckeransicht oeffnen.' >&2; exit 1; fi
   t=$(grep -h -o -E '(accessToken[[:space:]]*=[[:space:]]*|id_token=)eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+' "$f" | tail -n 1 | sed -E 's/^(accessToken[[:space:]]*=[[:space:]]*|id_token=)//')
   if [ -z "$t" ]; then printf '%s\n' 'Kein Slicer-Token im neuesten Log gefunden.' >&2; exit 1; fi
   if ! printf '%s' "$t" | pbcopy; then printf '%s\n' 'Token konnte nicht in die Zwischenablage kopiert werden.' >&2; exit 1; fi
   copied=$(pbpaste) || exit 1
   if [ "$copied" != "$t" ]; then printf '%s\n' 'Token konnte nicht in der Zwischenablage bestaetigt werden. Befehl erneut ausfuehren.' >&2; exit 1; fi
   printf '%s\n' 'Token erfolgreich kopiert und geprueft. Jetzt in Home Assistant mit Cmd+V einfuegen.'
   ANYCUBIC_TOKEN
   ```

3. In Home Assistant bei **Slicer Next (Windows & macOS)** den Token mit `Strg+V` (macOS: `Cmd+V`) einfuegen. Eine bestehende Integration zum Erneuern des Tokens nicht loeschen.
4. Danach die Zwischenablage leeren: Windows mit `Set-Clipboard -Value ''`, macOS mit `pbcopy < /dev/null`. Falls der Windows-Zwischenablageverlauf oder die Cloud-Synchronisierung aktiv ist, den Eintrag auch dort entfernen.

Beide Befehle lesen nur das neueste lokale Slicer-Debug-Log und kopieren den letzten passenden JWT in die Zwischenablage. Eine Erfolgsmeldung erscheint erst nach dem Abgleich des Zwischenablage-Inhalts mit dem gefundenen Token (unter PowerShell in Gruen). Der Token selbst wird nicht im Terminal ausgegeben. Der macOS-Block verwendet ausdruecklich die mitgelieferte Bash und kann auch in ein zsh-Terminal eingefuegt werden. Danach direkt in Home Assistant einfuegen; das Kopieren eines anderen Textes ersetzt den Token in der Zwischenablage. Die Integration prueft den eingefuegten Token anschliessend beim Anycubic-Login. Obwohl der aktuelle Slicer den URL-Parameter `id_token` nennt, enthaelt er in der geprueften Slicer-Version einen JWT mit dem Token-Typ `access-token`.

### Fehlerbehebung und Grenzen

- **Wiederholte Anmeldung trotz weiterhin gueltigem Token (`int()` / `NoneType`):** Anycubic kann fuer einen nicht belegten externen Spulenhalter `external_shelves.id: null` und `loaded: null` liefern. Bis einschliesslich Version 0.4.1 kann dies die Einrichtung nach erfolgreichem Cloud-Login abbrechen und faelschlich eine erneute Anmeldung verlangen. Ab Version **0.4.2** wird dieser leere Halter als nicht vorhanden behandelt; optionale `null`-Statuswerte eines vorhandenen Halters verwenden dieselben inaktiven Standardwerte wie fehlende Statusfelder. Ungueltige Cloud-Daten werden bei der Einrichtung erneut angefragt, ohne einen neuen Token zu verlangen. Die neue Version muss installiert und Home Assistant anschliessend neu gestartet werden, damit die Korrektur wirkt. Ein tatsaechlich abgelehnter oder abgelaufener Token erfordert weiterhin eine erneute Anmeldung.
- **Einrichtungsfehler mit `feed_status` nach bestaetigtem Token:** Ein fehlendes ACE-Datenfeld kann bis Version 0.4.0 faelschlich als Anmeldefehler erscheinen. Das ist kein Nachweis fuer einen ungueltigen Token. Version 0.4.1 behandelt dieses optionale Feld als unbekannt; andere fehlende Pflichtfelder werden als Einrichtungsfehler gemeldet.
- **Kein Token gefunden:** Slicer einloggen, die Druckeransicht oeffnen und den Befehl erneut ausfuehren. Der Slicer muss zuvor ein aktuelles Debug-Log erzeugt haben.
- **Token wird abgelehnt:** Im Slicer ab- und erneut anmelden, die Druckeransicht oeffnen und den Token erneut kopieren. Ein noch nicht abgelaufener JWT kann bereits widerrufen sein.
- **Andere Slicer-Version ohne passenden Log-Eintrag:** Als technischer Notfallweg stehen weiterhin der [PowerShell-Starter](scripts/recover_slicer_token.ps1) und das [Python-Hilfsskript](scripts/recover_slicer_token.py) fuer die lokale, schreibgeschuetzte Prozessspeicher-Suche zur Verfuegung. Dieser Weg ist nicht der normale Einstieg.

Das Auslesen wurde lokal mit Slicer Next 2.0.0.3 unter Windows geprueft. Ein Beitragender hat erfolgreiches Auslesen mit dieser Slicer-Version auf macOS (Apple Silicon) rueckgemeldet. Automatisierte Tests decken beide Token-Schreibweisen, die Auswahl des neuesten Logs und Zwischenablagefehler ab; eine native macOS-Pruefung laeuft in CI. Das ist keine Garantie fuer kuenftige Slicer-Builds oder Cloud-Aenderungen.

Nur eigene Zugangsdaten auslesen. **Keine Tokens, Speicherabbilder, Konfigurationsdateien oder unbereinigten Logs in GitHub-Issues hochladen.** Als Alternative bleibt der unten beschriebene Web-Modus ohne MQTT.

---

## 🌐 Web-Login (ohne MQTT, nur Polling)

1. [Anycubic Cloud öffnen](https://cloud-universe.anycubic.com/file)  
2. Developer Tools → Konsole:  
   ```js
   window.localStorage["XX-Token"]
   ```
3. Token kopieren → Integration einfügen

> ⚠️ Hinweis: Diese Methode unterstützt **kein MQTT**, nur 1-Minuten-Updates.

---

## 📥 Releases

➡️ [Letztes Release ansehen](https://github.com/ljschmitt/hass-anycubic_cloud_v3/releases/latest)

### Beta-/Test-Releases

Groessere oder riskantere Aenderungen koennen zuerst als GitHub **Pre-release** veroeffentlicht werden, z. B. `v0.3.1-beta.1`. Diese Versionen sind fuer Tester gedacht und sollten in HACS bewusst ueber die Versionsauswahl installiert werden. Stabile Nutzer sollten beim neuesten normalen Release bleiben.

Wenn HACS eine neue Beta- oder Stable-Version nicht sofort anbietet, in HACS das Repository neu laden bzw. die verfuegbaren Versionen aktualisieren. Das Integration-Panel in Home Assistant zeigt die Version des installierten Frontend-Bundles; nach einem Update kann ein Home-Assistant-Neustart und Browser-Cache-Refresh noetig sein, bis die Anzeige aktualisiert ist.

Branch-Strategie:

- `master` ist der stabile Branch fuer normale Releases, z. B. `v0.3.0`
- `beta` ist der Test-Branch fuer riskantere Aenderungen und Beta-Pre-releases, z. B. `v0.3.1-beta.1`
- Nach erfolgreichem Beta-Test werden die Aenderungen nach `master` uebernommen und als normales Release veroeffentlicht

Beta-Releases sind besonders sinnvoll fuer:

- neue Druckerfunktionen wie Kameralicht, ACE-/Materiallogik oder Dateidruck
- Aenderungen an MQTT-Handling oder Cloud-Kommandos
- neue Frontend-/Dashboard-Funktionen

Bitte bei Beta-Feedback keine Tokens, privaten IPs, Seriennummern, Drucker-IDs oder Screenshots mit persoenlichen Daten in Issues hochladen.

### Maintainer-Hinweis

Die Projektversion wird zentral in `Version` gepflegt. Vor einem Release:

```powershell
python scripts/sync_version.py
python scripts/sync_version.py --check
python scripts/check_private_data.py
python scripts/check_release_version.py
cd custom_components/anycubic_ha_integration/frontend_panel
npm run build
npm run build_card
```

Danach immer die echten Diffs pruefen, weil der Frontend-Build `eslint --fix` ausfuehrt und dadurch auch reine Formatierungs- oder Zeilenenden-Aenderungen entstehen koennen.

Vor dem Veroeffentlichen eines stabilen Releases oder Beta-Pre-releases sollte zusaetzlich der GitHub-Workflow **Release Gate** manuell gestartet werden. Er prueft Version-Sync, private lokale Daten und ob der geplante `v<Version>`-Tag bzw. das passende GitHub-Release bereits existiert. Bei einem Tag-Push prueft derselbe Workflow, ob der Tag zur Version im Repository passt.

Der Release-Check erwartet stabile Versionen auf `master` bzw. `main` und Pre-release-Versionen auf `beta`.

---

## 🙌 Mitwirkende

- [@ljschmitt](https://github.com/ljschmitt)
- [@WaresWichall](https://github.com/WaresWichall) (Original-Entwicklung)
- [@sunnyfunny1977-alt](https://github.com/sunnyfunny1977-alt) – aktiver Slot der primaeren ACE ([#9](https://github.com/ljschmitt/hass-anycubic_cloud_v3/pull/9))
- [@sphings79](https://github.com/sphings79) – macOS-Anleitung zur Slicer-Token-Auslesung ([#19](https://github.com/ljschmitt/hass-anycubic_cloud_v3/pull/19))
- [@flouou](https://github.com/flouou) – fruehe Analyse und Fixvorschlag fuer unvollstaendige Cloud-/ACE-Daten sowie Hilfe zur Token-Auslesung ([#12](https://github.com/ljschmitt/hass-anycubic_cloud_v3/pull/12), [#11](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues/11))

Danke auch an alle, die Fehler melden, Diagnosen bereitstellen und Korrekturen auf ihren Druckern testen.

---

## 📄 Lizenz

GNU General Public License v3.0. Siehe [LICENSE](LICENSE).

---

## 💬 Feedback / Probleme

➡️ [Issue öffnen](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues)

---

## ✅ Kompatibilität

- Home Assistant 2025.10.0 oder neuer
- Getestet mit Home Assistant 2026.8.3
