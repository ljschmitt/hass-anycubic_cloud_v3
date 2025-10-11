> [!NOTE]  
> **Update (11.10.2025):** Diese Version enthält die **integrierte paho-mqtt-2.x-Lösung** (Callback-API v1) – damit funktionieren **MQTT-Echtzeit-Updates** wieder.  
> Voraussetzung: **Slicer Next (Windows)** und dessen **Access-Token**.  
> Hinweise zu den technischen Anpassungen:  
> – `callback_api_version=CallbackAPIVersion.VERSION1` beim MQTT-Client  
> – angepasste Callback-Signaturen (`on_connect/on_subscribe/...` mit `properties=None`, `on_message` **ohne** `properties`)  
> – kein harter Pin mehr auf `paho-mqtt==1.6.1`
>
> **Alter TEXT
> ~~Anycubic hat versucht, den MQTT-Zugriff zu blockieren, siehe [hier](https://github.com/WaresWichall/hass-anycubic_cloud/issues/33)~~  
> ~~Ich wechsle zu einer anderen Druckermarke und werde in diesem Projekt nicht mehr so aktiv sein, werde aber weiterhin Fehler beheben.~~  
> ~~MQTT-Zugriff ist jetzt mit Tokens aus **Slicer Next (Windows-Version)** verfügbar.  ~~
> ~~Funktioniert weiterhin Stand **01/12/2024**.~~

---

# Anycubic Cloud Home Assistant Integration

Die Komponente funktioniert sehr gut mit:
- Kobra 3 Combo
- Kobra 2
- Kobra 2 Max
- Kobra 2 Pro
- Photon Mono M5s (Basis-Support)
- M7 Pro (Basis-Support)

Wenn sie bei dir mit anderen Druckern funktioniert, melde es bitte – wenn nicht, ebenfalls :)

**Update-Pfad / Verhalten:**  
Die Anycubic-Cloud wird **alle 1 Minute** gepollt; **MQTT** liefert Updates **mehrfach pro Sekunde**.  
Wenn Sensoren nur minütlich aktualisieren, prüfe den Auth-Modus (Slicer-Token) und öffne ggf. ein Issue.

## Frontend-Card

Diese Integration ergänzt die [Anycubic-Karte für Home Assistant](https://github.com/WaresWichall/hass-anycubic_card).

## Galerie

<img width="300" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra3-1.png"> <img width="300" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/anycubic-ace-ui.gif"> <img width="300" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra2-2.png">
<img width="300" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra3-print.png"> <img width="200" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra2-1.png">

## Features

- Unterstützung mehrerer Drucker
- Druckstart-Services / UI-Panel
- Pause/Weiter/Abbrechen-Buttons
- ACE-Slot-Farben/Einstellungen via Services / UI-Panel
- Dateimanager via Services / UI-Panel
- Retract/Extrude-Services
- Drucker-Sensoren (Temperatur, Lüfter, Speed, …)
- Job-Sensoren (Name, Fortschritt, Vorschaubild, Zeit, Parameter)
- ACE-Sensoren
- Firmware-Update-Entitäten
- ACE-Trocknungs- und Spulen-Management mit Presets
- Konfigurierbarer MQTT-Verbindungsmodus (Standard: „nur während des Druckens“)
- Und mehr …

## Panel

Ein Frontend-Panel wird der Sidebar hinzugefügt:  
- Basis-Infos (+ Druckerkarte)  
- Dateimanager (**MQTT aktiv** erforderlich)  
- Druckstart-Services

---

## Installation

1. **Token besorgen** (siehe Auth-Abschnitte unten).  
2. Dieses Repository in **HACS** hinzufügen: Menü **… → Custom Repositories** → Kategorie **Integration**.  
3. **Home Assistant neu starten**.  
4. **Einstellungen → Integrationen → Neue hinzufügen** → nach **Anycubic** suchen.  
5. **Authentifizierungsmodus wählen** (empfohlen: *Slicer Next*).  
6. **Token** in das Feld `User Token` bzw. `Slicer Access Token` einfügen.  
7. Drucker auswählen → fertig!  
8. Optional weitere Optionen in **Konfigurieren** der Integration anpassen.

> [!TIP]  
> In dieser integrierten Version gibt es **keinen** harten Zwang auf `paho-mqtt==1.6.1`. Home Assistant nutzt seine eigene **paho-mqtt 2.x**.  
> Falls du manuell installiert hast, stelle in `manifest.json` sicher, dass `"requirements": []` (oder `["paho-mqtt>=2.0.0,<3"]`) gesetzt ist.

---

## Slicer-Authentifizierung (empfohlen, mit MQTT-Echtzeit)

> [!IMPORTANT]  
> Getestet/unterstützt mit **Slicer Next für Windows**.

1. Im **Slicer Next** angemeldet sein, dann den Slicer **schließen**.  
2. Konfigurationsdatei finden:
	%AppData%\AnycubicSlicerNext\AnycubicSlicerNext.conf
	oder
	C:\Users<USERNAME>\AppData\Roaming\AnycubicSlicerNext\AnycubicSlicerNext.conf
	
> [!NOTE]
> Nimm einfach diesen Einzeiler (kopiert den Token direkt in die Zwischenablage):
> 
> $path = "$env:AppData\AnycubicSlicerNext\AnycubicSlicerNext.conf"; (Select-String -Path $path -Pattern '"access_token"\s*:\s*"([^"]+)"').Matches.Groups[1].Value | Set-Clipboard
> 
> 
> Prüfen (nur zur Kontrolle, nichts Sensibles ausgeben):
> 
> $token = (Select-String -Path $path -Pattern '"access_token"\s*:\s*"([^"]+)"').Matches.Groups[1].Value
> $token.Length
> $token.Substring(0,6) + "..." + $token.Substring($token.Length-6)
> 
> 
> Falls in der Datei mehrere Tokens stehen (ältere Einträge), nimm die letzte Übereinstimmung:
> 
> $raw = Get-Content "$env:AppData\AnycubicSlicerNext\AnycubicSlicerNext.conf" -Raw
> [regex]::Matches($raw, '"access_token"\s*:\s*"([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Wher
> 
---	
3. Den kompletten Wert von `access_token` **ohne** Anführungszeichen kopieren (typisch ~344 Zeichen, einzeilig).  
4. **Empfehlung:** Den `access_token` in der Datei danach auf **leer** setzen (`"access_token": ""`), damit nicht Slicer und Home Assistant gleichzeitig dieselbe Session verwenden.

<img width="400" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/dev/screenshots/auth_slicer_token.png">

---

## Web-Authentifizierung (Polling-Only)

> [!IMPORTANT]  
> **Web-Auth unterstützt kein MQTT** – nur Polling (≈1×/Minute).

1. [Anycubic Cloud Website](https://cloud-universe.anycubic.com/file) öffnen und einloggen.  
2. Browser-DevTools → **Konsole**:
```js
window.localStorage["XX-Token"]
