# Anycubic HA Integration

> 🗓️ **Update (07.06.2026):**  
> Diese Version ist mit **Home Assistant 2026.6.1** getestet und bleibt ab **Home Assistant 2025.10.0** freigegeben. Sie nutzt weiterhin die integrierte **`paho-mqtt` 2.x-Lösung** (Callback-API v1) für **MQTT-Echtzeit-Updates**.  
> Voraussetzung für MQTT: **Slicer Next (Windows)** und dessen **Access-Token**.  
> Kein harter Pin auf `paho-mqtt==1.6.1`.
>
> 🗓️ **Update (08.06.2026):**  
> Die Druckerauswahl zeigt jetzt passende Druckerbilder fuer Kobra 3 und Kobra X. Die Kobra-X-Materialanzeige trennt internes Materialregal und ACE-Zugaenge klarer.

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

Die Komponente funktioniert getestet mit:
- ✅ Kobra 3 Combo
- ✅ Kobra X (bisher nur mit 4 Farben)
- ✅ Kobra 2, 2 Max, 2 Pro
- ✅ Photon Mono M5s (Basis)
- ✅ Anycubic M7 Pro (Basis)

Du hast andere Modelle? Bitte Rückmeldung geben 🙏

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
- Frontend-Panel mit Status + Dateimanager
- Spulen-Trocknung & Materialmanagement (ACE)
- Konfigurierbarer MQTT-Modus („nur beim Drucken“, dauerhaft, deaktiviert)

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

Fehler, Verbesserungsvorschlaege und Erfahrungen mit weiteren Druckermodellen koennen gerne ueber GitHub Issues gemeldet werden.

---

## 🔐 Token auslesen (Slicer Next)

1. **Slicer Next starten → einloggen → schließen**
2. Öffne:  
   %AppData%\AnycubicSlicerNext\AnycubicSlicerNext.conf
3. PowerShell-Befehl (kopiert Token in Zwischenablage):
   ```powershell
   $path = "$env:AppData\AnycubicSlicerNext\AnycubicSlicerNext.conf"; 
   (Select-String -Path $path -Pattern '"access_token"\s*:\s*"([^"]+)"').Matches.Groups[1].Value | Set-Clipboard
   ```
4. In Integration einfügen → fertig  
   (optional Token in Datei danach leeren: `"access_token": ""`)

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
