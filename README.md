# Shopify Remix App – Promo Bar (Theme App Extension)

Eine Shopify App (Remix, TypeScript) mit Theme App Extension „Promo Bar“. Händler:innen können eine oben eingeblendete, ausblendbare Hinweisleiste verwalten.

## Features
- Remix + Polaris Admin UI mit Live-Vorschau
- Prisma (SQLite) zur Speicherung pro Shop
- Theme App Extension Block `Promo Bar` (App-Embed, Ziel: body)
- App Proxy Endpoint `/apps/promo-bar` liefert dynamische Daten (gecached, im Editor `no-store`)
- Sicherheit: OAuth & HMAC-Verifikation durch `@shopify/shopify-app-remix`

## Setup
1) Voraussetzungen
- Dev Store in Shopify Partner Dashboard anlegen
- Node 18+

2) Lokale Entwicklung
```bash
npm i -g @shopify/cli@latest
npm install
# Prisma Client generieren
set DATABASE_URL=file:./dev.db && npx prisma generate
# (optional) Migration + Seed
set DATABASE_URL=file:./dev.db && npx prisma migrate dev --name init
set DEV_STORE=<your-dev-store>.myshopify.com && npm run seed
# App starten
shopify app dev
```

3) Installation im Dev-Store
- `shopify app dev` öffnet den Install-Flow automatisch. Anschließend im Theme Editor „App-Einbindungen“ die `Promo Bar` aktivieren.

4) Theme App Extension erzeugen (falls neu erforderlich)
```bash
shopify app generate extension --type=theme-app-extension --name="Promo Bar"
```
(Hier bereits unter `extensions/promo-bar/` vorhanden.)

## Admin UI
- Aufruf: App-Home (Index). Einstellungen erfassen und speichern. Live-Vorschau zeigt die Leiste sofort.
- Mehrere Bars können angelegt werden; die Theme-Erweiterung rendert die erste passende aktive Bar je Seitentyp.

## Deploy & Release
```bash
# Builden und deployen
shopify app deploy
# Neue Version der Theme App Extension erstellen
shopify app release
```

## App Proxy/Render
- Die Theme-Erweiterung ruft `/apps/promo-bar` auf. Richte im Partner-Dashboard den App Proxy Pfad `promo-bar` ein (Subpath) und zeige auf die App-URL.
- Caching: 60s (Preview `no-store`).

## Akzeptanzkriterien (Abgleich)
- Block „Promo Bar“ im Theme Editor sichtbar und renderbar
- Admin-Seite speichert Einstellungen; Theme bezieht aktualisierte Styles ohne Full-Reload (Fetch im Block)
- CI: Lint, Typecheck, Playwright-Test enthalten

## Troubleshooting
- Fehlende Scopes/OAuth: Stelle sicher, dass die App im Dev-Store installiert ist. Env-Variablen `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SCOPES`, `APP_URL` gesetzt.
- App Proxy 403/CORS: App Proxy im Partner-Dashboard korrekt konfigurieren. Endpoint `/apps/promo-bar` erlaubt GET und sendet `Cache-Control`.
- Prisma Fehler: `DATABASE_URL` auf SQLite-Datei setzen, `npx prisma generate` ausführen.
- Playwright in CI: Falls Ports blockiert sind, erneut mit `npx playwright install --with-deps` ausführen. 