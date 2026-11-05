# 🧩 Entwicklung – Anycubic HA Integration

## 🖥️ Frontend (Panel & Card)

Aktuell wird mit **Node.js v18.20.4** gebaut.

### 🔧 Vorbereitung

Öffne ein Terminal im Verzeichnis:  
```
custom_components/anycubic_ha_integration/frontend_panel
```

Führe dann aus:
```bash
npm install
```

### 🏗️ Build-Befehle

Beide Teile (Panel **und** Card) gleichzeitig bauen:
```bash
npm run build && npm run build_card
```

Nur das Panel bauen:
```bash
npm run build
```

Nur die Card bauen:
```bash
npm run build_card
```

Die generierten Dateien werden automatisch im `dist/`-Ordner abgelegt und beim nächsten Home-Assistant-Neustart verwendet.

---

## 🌐 Übersetzungen

### 🧠 Komponente (Backend)

Quell-Übersetzungsdateien befinden sich unter:
```
custom_components/anycubic_ha_integration/translations/input_translation_files/
```

Aus diesen Quellen werden die endgültigen JSON-Dateien generiert mit:
```bash
python scripts/build_translations.py
```

> Alle Service-Texte werden aus dem Abschnitt `common` erzeugt.

---

### 🎨 Frontend (UI)

Quell-Übersetzungen liegen hier:
```
custom_components/anycubic_ha_integration/frontend_panel/localize/languages/
```

Wenn du eine neue Sprache hinzufügen möchtest, erweitere die Datei:  
`custom_components/anycubic_ha_integration/frontend_panel/localize/localize.ts`

Beispiel für Deutsch:

```ts
import * as en from './languages/en.json';
import * as de from './languages/de.json';
```

Und ergänze im Sprachobjekt:
```ts
var languages: any = {
  en: en,
  de: de,
};
```

Danach das Frontend neu bauen:
```bash
npm run build
```

---

## 🧰 Hinweise

Entwickler-Helfer fuer Diagnose, Dateiaktionen und Metadaten liegen unter `scripts/anycubic_helpers/`, ausserhalb der installierten Integration. Aufruf und Abhaengigkeiten stehen in der [Helfer-Anleitung](scripts/anycubic_helpers/README.md). `--help` und Modulimporte fuehren keine Cloud- oder Druckeraktionen aus.

- Prüfe vor dem Commit, dass keine temporären Build-Dateien (`node_modules`, `.cache`, `dist/`) eingecheckt werden.  
- Änderungen an `manifest.json`, `translations`, oder dem Panel erfordern einen **Neustart von Home Assistant**.  
- Für Tests empfiehlt sich das Add-on **Studio Code Server** oder ein lokales Dev-Setup mit **HA Container**.
