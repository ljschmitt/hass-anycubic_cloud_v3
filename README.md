# Anycubic HA Integration

Home-Assistant-Integration fuer Anycubic-Cloud-Drucker mit Statussensoren, MQTT-Echtzeitupdates, Druck- und Dateifunktionen, ACE-/Materialverwaltung und optionaler Kameraansicht.

> 🗓️ **Aktuelles Release: 0.1.0**
>
> - Neue **Nebenansicht** mit Kamerastream, digitalem Zoom und Vollbild
> - Anycubic-Cloudstream per Agora/WebRTC
> - Optionale Home-Assistant-`camera.*`-Entities pro Drucker fuer lokale Kameraquellen
> - Robustere Slicer-Next-Tokenverarbeitung und bereinigte MQTT-Startup-Reports
> - Verbesserte Kobra-X-Material-/ACE-Erkennung fuer bekannte 4-Farben-Setups
>
> Getestet mit **Home Assistant 2026.6.1**, freigegeben ab **Home Assistant 2025.10.0**.
> MQTT-Echtzeitupdates benoetigen **Slicer Next (Windows)** und dessen **Access-Token**.

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
- ✅ Kobra X (Basisfunktionen; ACE-/Materialanzeige fuer bekannte 4-Farben-Setups verbessert)
- ✅ Kobra 2, 2 Max, 2 Pro
- ✅ Photon Mono M5s (Basis)
- ✅ Anycubic M7 Pro (Basis)

### Zum Testen / Rueckmeldung gesucht

- 🧪 Kobra S1

Wenn du einen Kobra S1 oder ein anderes noch nicht bestaetigtes Modell testest, bitte Rueckmeldung geben: Wird das Geraet angelegt, welche Entitaeten funktionieren, gibt es MQTT- oder Kamera-Auffaelligkeiten? Bitte keine Tokens, privaten IPs, Seriennummern oder persoenlichen Daten in Issues hochladen.

---

## ⚙️ Funktionsweise

- Cloud-Polling: alle **1 Minute**
- MQTT (Echtzeit): **mehrfach pro Sekunde**
- Erfordert **Slicer Next Token** für MQTT-Zugriff

---

## 🎨 Frontend-Card

Diese Integration ergänzt die [Anycubic-Karte für Home Assistant](https://github.com/WaresWichall/hass-anycubic_card).

---

## 🖼️ Galerie

<img width="300" src="custom_components/anycubic_ha_integration/frontend_panel/dist/assets/printer-kobra-3.webp">
<img width="300" src="custom_components/anycubic_ha_integration/frontend_panel/dist/assets/printer-kobra-x.webp">
<img width="300" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra3-1.png">  
<img width="300" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/anycubic-ace-ui.gif">  
<img width="300" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra2-2.png">  
<img width="300" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra3-print.png">  
<img width="200" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra2-1.png">

---

## 🧩 Features

- Mehrere Drucker gleichzeitig
- Druckstart / Pause / Fortsetzen / Abbruch (via Services & UI)
- ACE-Slot-Verwaltung (Farbe, Presets, Services)
- Dateimanager (MQTT benötigt)
- Sensoren: Temp, Speed, Fan, Job-Fortschritt, Name, Zeit, …
- Firmware-Update-Entitäten
- MQTT-Aktivität automatisch während Druck (oder dauerhaft)
- Frontend-Panel mit Status, Nebenansicht + Dateimanager
- Spulen-Trocknung & Materialmanagement (ACE)
- Konfigurierbarer MQTT-Modus („nur beim Drucken“, dauerhaft, deaktiviert)

---

## 📷 Kamera / Nebenansicht

Die Nebenansicht zeigt standardmaessig den Anycubic-Cloud-Kamerastream des ausgewaehlten Druckers. Fuer normale Anycubic-Firmware muss dafuer nichts weiter eingerichtet werden.

Bei Druckern mit alternativer Firmware oder lokaler Kamera-Bruecke, z. B. Rinkhals/Moonraker, kann optional pro Drucker eine Home-Assistant-`camera.*`-Entity verwendet werden. Das ueberschreibt nicht die Standardkamera fuer alle Drucker, sondern nur den jeweils gemappten Drucker.

Hinweis zum Anycubic-Cloudstream: Der verschluesselte WebRTC-Stream benoetigt im Browser einen sicheren Kontext, also z. B. HTTPS, Home Assistant Cloud oder localhost. Wenn Home Assistant nur ueber unverschluesseltes HTTP aufgerufen wird, kann der Browser die Kamera blockieren. Eine lokale Home-Assistant-`camera.*`-Entity wird dagegen ueber den Home-Assistant-Kameraproxy geladen und ist deshalb der sauberste Weg fuer lokale Streams.

### Integrierte Rinkhals/Moonraker-Webcam als HA-Kamera anlegen

Die integrierte Rinkhals-Webcam wird von Moonraker meist als MJPEG-Stream angeboten:

```text
Snapshot: http://<drucker-ip>:4409/webcam/?action=snapshot
Stream:   http://<drucker-ip>:4409/webcam/?action=stream
```

In Home Assistant:

1. **Einstellungen -> Geraete & Dienste -> Integration hinzufuegen**
2. **Generic Camera** suchen und auswaehlen
3. Als **Still Image URL** die Snapshot-URL eintragen
4. Als **Stream Source URL** die Stream-URL eintragen
5. Optional einen Namen vergeben, z. B. `Printer Webcam`
6. Nach dem Anlegen die Entity-ID pruefen, z. B. `camera.printer_webcam`

> Wichtig: Nicht die Fluidd-Webcam-Ansicht oder eine go2rtc-Raumkamera-URL eintragen, wenn die integrierte Drucker-Webcam verwendet werden soll. Fuer Rinkhals ist die integrierte Kamera in der Regel der `/webcam/`-Pfad des Druckers.

### Kamera einem bestimmten Drucker zuordnen

Anschliessend wird die Kamera im Anycubic-Panel nur fuer diesen Drucker gemappt. Das Mapping gehoert in die Panel-Card-Konfiguration der Integration:

```yaml
cameraEntityIds:
  "<printer-id-or-serial>": camera.printer_webcam
```

Der Schluessel kann die Anycubic-Drucker-ID bzw. Seriennummer sein. Alternativ kann die Home-Assistant-Device-ID des Druckers verwendet werden.

Beispiel mit mehreren Druckern:

```yaml
cameraEntityIds:
  "<first-printer-id-or-serial>": camera.first_printer_webcam
  "<second-printer-id-or-serial>": camera.second_printer_webcam
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

> ⚠️ Wähle als Auth-Methode: **Slicer Next (Windows)**  
> und füge den **Access-Token** ein (siehe unten).

---

## 🖐️ Manuelle Installation

1. Repository als ZIP herunterladen  
2. Entpacken nach:  
   /config/custom_components/anycubic_ha_integration/
3. Home Assistant neu starten
4. Integration hinzufügen wie oben

---

## ⚠️ Sicherheit und Haftung

Diese Integration steuert und liest 3D-Drucker ueber Anycubic Cloud, Services und optional MQTT. Die Nutzung erfolgt auf eigene Verantwortung.

Ich uebernehme keine Haftung fuer Schaeden am 3D-Drucker, an angeschlossenem Zubehoer, an Filament, Druckobjekten oder der Umgebung. Bitte alle Funktionen vorsichtig verwenden, neue Versionen gruendlich testen und insbesondere Steuerbefehle wie Druckstart, Pause, Abbruch, Temperatur-, ACE- und Materialslot-Aenderungen aufmerksam pruefen.

Fuer die Anycubic-MQTT-Verbindung sind die im Projekt enthaltenen Anycubic-TLS-Client-Zertifikatsdateien erforderlich. Sie gehoeren zur Anycubic-Protokollanbindung und enthalten keine benutzerspezifischen Home-Assistant- oder Anycubic-Zugangsdaten. Eigene Tokens, Logs, Screenshots mit Tokens oder lokale Konfigurationsdateien sollten niemals in Issues, Pull Requests oder Releases hochgeladen werden.

Fehler, Verbesserungsvorschlaege und Erfahrungen mit weiteren Druckermodellen koennen gerne ueber GitHub Issues gemeldet werden.

---

## 🔐 Token auslesen (Slicer Next)

1. **Slicer Next starten und eingeloggt lassen**
2. PowerShell-Befehl fuer Slicer Next 1.4.1.2+ (kopiert den neuesten Access-Token aus dem aktuellen Log in die Zwischenablage):
   ```powershell
   $log = Get-ChildItem "$env:AppData\AnycubicSlicerNext\log" -Filter "debug_*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
   $token = Select-String -Path $log.FullName -Pattern 'accessToken = ([^,\s]+)' | Select-Object -Last 1
   $token.Matches.Groups[1].Value | Set-Clipboard
   ```
3. Alternative fuer aeltere Slicer-Versionen mit Klartext-Token in der `.conf`:
   ```powershell
   $path = "$env:AppData\AnycubicSlicerNext\AnycubicSlicerNext.conf"; 
   (Select-String -Path $path -Pattern '"access_token"\s*:\s*"([^"]+)"').Matches.Groups[1].Value | Set-Clipboard
   ```
4. In Integration einfügen → fertig

> Hinweis: Der aktuelle Slicer-Next-Token ist ein JWT und besteht aus drei durch Punkte getrennten Teilen. Die Integration entfernt Anführungszeichen, Whitespace und kann auch Log-Zeilen wie `accessToken = ...` verarbeiten.

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

> 

---

## 🙌 Mitwirkende

- [@ljschmitt](https://github.com/ljschmitt)
- [@WaresWichall](https://github.com/WaresWichall) (Original-Entwicklung)

---

## 📄 Lizenz

MIT License – frei für private und kommerzielle Nutzung. Siehe LICENSE-Datei.

---

## 💬 Feedback / Probleme

➡️ [Issue öffnen](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues)

---

## ✅ Kompatibilität

- Home Assistant 2025.10.0 oder neuer
- Getestet mit Home Assistant 2026.6.1
