# Anycubic-Druckerdiagnose in Home Assistant

Der Bericht hilft bei MQTT-, Firmware- und Kameraproblemen. Er hält fünf Minuten lang die eingehenden MQTT- und Cloud-Daten eines ausgewählten Druckers fest. Home Assistant hält den Bericht ab Aufnahmestart 30 Minuten zur Abfrage bereit. Ein erneuter Start für dasselbe Anycubic-Konto ersetzt die vorherige Aufnahme.

## Über das Zahnrad starten und am Gerät herunterladen

Dieser Weg ist ab [Integration 0.4.9-beta.5](https://github.com/ljschmitt/hass-anycubic_cloud_v3/releases/tag/v0.4.9-beta.5) verfügbar. Die [bebilderte Anleitung](https://apps.schmittit.de/anycubic_ha_cloud/#druckerdiagnose) zeigt jeden Schritt.

1. Öffne **Einstellungen → Geräte & Dienste → Anycubic Cloud**. Das **Zahnrad** befindet sich rechts am Anycubic-Cloud-Kontoeintrag. Es öffnet die Integrationsoptionen.
2. Wähle **Druckerdiagnose starten**, wähle den Drucker und bestätige mit **Aufzeichnung starten**. Home Assistant zeigt eine Bestätigung.
3. Stelle das Problem einmal nach und warte möglichst fünf Minuten. Öffne unter **Geräte** den Drucker, für den du die Aufzeichnung gestartet hast.
4. Wähle **Diagnosedaten herunterladen** unter **Geräte-Informationen** auf der Geräteseite. Du erhältst eine JSON-Datei. Wenn sie unter `data` nur `"status": "capture_unavailable"` enthält, prüfe die Druckerauswahl und starte bei abgelaufenem Bericht eine neue Aufnahme.
5. Öffne die JSON-Datei in einem Texteditor. Kopiere das Objekt, das direkt auf den Schlüssel `"data"` folgt, also alles von dessen öffnender bis zu dessen schließender geschweiften Klammer. Der Abschnitt enthält `printer`, `integration_entities` und `capture`. Prüfe ihn und speichere ihn bei Bedarf unter dem neutralen Namen `anycubic-diagnose.json`. Die restliche Download-Datei enthält Home-Assistant-Systeminformationen. Ihr automatisch erzeugter Dateiname enthält lokale IDs.
6. Füge den geprüften Abschnitt als Kommentar ein oder hänge die umbenannte Datei an [Issue #33](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues/33) an.

Schreib Druckermodell, Firmware, relevantes Zubehör wie ACE und den nachgestellten Ablauf dazu. Beim Kobra-2-Max-Kameratest gehört die genaue Kamerameldung in [Issue #31](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues/31). Prüfe vor dem Teilen, dass der Beitrag keine Tokens, Zugangsdaten, privaten IP-Adressen, Seriennummern, Geräte-IDs oder Kontodaten enthält.

## Alternative: mit den Entwicklerwerkzeugen starten

Dieser Weg steht in der veröffentlichten [Integration 0.4.9-beta.4](https://github.com/ljschmitt/hass-anycubic_cloud_v3/releases/tag/v0.4.9-beta.4) zur Verfügung. Melde dich in Home Assistant als Administrator an.

1. Öffne **Entwicklerwerkzeuge → Aktionen**. Suche nach **Druckerdiagnose starten** (`anycubic_ha_integration.start_printer_diagnostics`).
2. Wähle unter den Feldern der Aktion deinen **Anycubic-Cloud-Eintrag** und den **Drucker**. Klicke auf **Aktion ausführen**.
3. Stelle das Problem während der Aufnahme einmal nach. Beim Kameratest öffnest du die Kamera im Anycubic-Cloud-Panel einmal und merkst dir die angezeigte Meldung. Warte möglichst fünf Minuten, damit mindestens ein regulärer Cloud-Abruf stattfinden kann. MQTT-Daten erscheinen, wenn der Drucker in dieser Zeit über eine aktive MQTT-Verbindung meldet.
4. Suche in **Entwicklerwerkzeuge → Aktionen** nach **Druckerdiagnose exportieren** (`anycubic_ha_integration.export_printer_diagnostics`). Wähle dasselbe Konto und denselben Drucker und führe die Aktion aus. Unter dem Formular erscheint die Antwort.
5. Prüfe die Antwort. Kopiere sie in einen Kommentar zu [Issue #33](https://github.com/ljschmitt/hass-anycubic_cloud_v3/issues/33) oder speichere sie als `anycubic-diagnose.txt`. Ziehe die Textdatei in das Kommentarfeld.
