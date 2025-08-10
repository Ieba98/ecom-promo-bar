# SAFAR Landing – Installation (Dawn)

Diese Section bildet die komplette SAFAR-Landingpage als einzelne Online Store 2.0 Section ab. Keine externen Builds nötig.

## 1‑Minute Install
1) Dateien in Dawn kopieren
- `sections/safar-landing.liquid`
- `assets/safar-landing.css`
- `assets/safar-landing.js`
- `templates/page.safar.json`

2) Dev starten
```bash
shopify theme dev --store <your-dev-store>.myshopify.com
```

3) Seite mit Template „safar“ anlegen
- Im Admin: Online-Shop → Seiten → Seite hinzufügen
- Titel vergeben → rechts unter „Theme-Template“: `page.safar` wählen → Speichern
- Vorschau öffnen: Die Landingpage rendert sofort mit Demo-Inhalten

4) Anpassen im Theme Editor
- Im Customizer die Section „SAFAR Landing“ öffnen
- Farben (bg, accent, text), Logo-Text, Glas-Effekt steuern
- Blöcke hinzufügen/reihen: NAV_LINK, HERO, STEP (bis 3), FEATURE_CARD, FEATURE_ITEM, TESTIMONIAL, FAQ_ITEM, FOOTER_LINK
- Hero-Hintergründe (Desktop/Mobil) via `image_picker` setzen

## Hinweise
- Performance: Bilder außerhalb des Hero werden lazy geladen. Animationen sind reduziert, wenn `prefers-reduced-motion` aktiv ist.
- A11y: Semantische Überschriften, beschriftete Buttons, `aria-` Attribute, `focus-visible` States.
- Mehrere Instanzen: JS ist pro Section-Namespace isoliert.

## Troubleshooting
- Section nicht sichtbar: Stelle sicher, dass `sections/safar-landing.liquid` vorhanden ist und `page.safar.json` die Section `safar-landing` referenziert.
- Template „safar“ fehlt: Prüfe, ob `templates/page.safar.json` korrekt kopiert wurde und Dateiname exakt stimmt.
- Bilder fehlen: Lade über den Theme Editor eigene Bilder hoch (Hero Desktop/Mobil, Feature Card). Leere Caches nach Upload.
- JS-Fehler in Konsole: Sicherstellen, dass `assets/safar-landing.js` existiert. Die Section lädt das Script automatisch per `{{ 'safar-landing.js' | asset_url | script_tag }}`. 