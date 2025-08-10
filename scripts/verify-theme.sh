#!/usr/bin/env bash
set -euo pipefail

# verify-theme.sh
# - Prints live theme ID and development themes for a store
# - Opens the live theme editor
# - Optionally checks if templates/page.safar.json exists by pulling only that file
#
# Usage:
#   STORE=my-shop.myshopify.com ./scripts/verify-theme.sh [--store <store>] [--no-open] [--check-template]
#

STORE_ENV=${STORE:-}
STORE_ARG=""
OPEN_EDITOR=1
CHECK_TEMPLATE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --store)
      STORE_ARG="$2"; shift 2 ;;
    --no-open)
      OPEN_EDITOR=0; shift ;;
    --check-template|--check)
      CHECK_TEMPLATE=1; shift ;;
    *)
      echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

STORE_DOMAIN="${STORE_ARG:-${STORE_ENV:-ecom-automate.myshopify.com}}"

if ! command -v shopify >/dev/null 2>&1; then
  echo "Shopify CLI nicht gefunden. Installiere mit: npm i -g @shopify/cli@latest" >&2
  exit 1
fi

echo "Store: ${STORE_DOMAIN}"; echo

echo "==> Shopify Themes (shopify theme list)"
LIST_OUT=$(shopify theme list --store "${STORE_DOMAIN}" 2>&1 || true)
echo "${LIST_OUT}" | sed -e 's/\r$//'

echo
# Versuche Live-Theme-ID zu extrahieren (robust gegen verschiedene Ausgabeformate)
LIVE_ID=""
# 1) Zeilen mit 'live' markieren, dann erste numerische Spalte nehmen
LIVE_ID=$(printf "%s\n" "${LIST_OUT}" \
  | sed -nE 's/^\s*([0-9]+).*\blive\b.*/\1/p' \
  | head -n1)
# Fallback: manche Formate nutzen [live] oder role=main
if [[ -z "${LIVE_ID}" ]]; then
  LIVE_ID=$(printf "%s\n" "${LIST_OUT}" \
    | sed -nE 's/^\s*([0-9]+).*\[(live|main)\].*/\1/p' \
    | head -n1)
fi
if [[ -z "${LIVE_ID}" ]]; then
  LIVE_ID=$(printf "%s\n" "${LIST_OUT}" \
    | sed -nE 's/^\s*([0-9]+).*role=(main|live).*/\1/p' \
    | head -n1)
fi

if [[ -n "${LIVE_ID}" ]]; then
  echo "Live Theme ID: ${LIVE_ID}"
else
  echo "Live Theme ID konnte nicht zuverlässig ermittelt werden. Öffne Editor mit --live." >&2
fi

echo
echo "==> Entwicklungs-Themes (preview/draft/unpublished/development)"
printf "%s\n" "${LIST_OUT}" | grep -Ei 'development|draft|unpublished|preview' || echo "Keine Entwicklungs-Themes erkannt."

echo
if [[ ${OPEN_EDITOR} -eq 1 ]]; then
  echo "==> Öffne Theme Editor für Live Theme"
  if [[ -n "${LIVE_ID}" ]]; then
    shopify theme open --store "${STORE_DOMAIN}" --theme "${LIVE_ID}" || true
  else
    shopify theme open --store "${STORE_DOMAIN}" --live || true
  fi
fi

if [[ ${CHECK_TEMPLATE} -eq 1 ]]; then
  echo
  echo "==> Prüfe Existenz von templates/page.safar.json im Live-Theme"
  TMPDIR=$(mktemp -d 2>/dev/null || mktemp -d -t safar_verify)
  CLEANUP() { rm -rf "${TMPDIR}" >/dev/null 2>&1 || true; }
  trap CLEANUP EXIT

  THEME_FLAG=(--live)
  if [[ -n "${LIVE_ID}" ]]; then THEME_FLAG=(--theme "${LIVE_ID}"); fi

  # Ziehe nur die Ziel-Datei in ein Temp-Verzeichnis
  if shopify theme pull --store "${STORE_DOMAIN}" "${THEME_FLAG[@]}" --only templates/page.safar.json --path "${TMPDIR}" >/dev/null 2>&1; then
    if [[ -f "${TMPDIR}/templates/page.safar.json" ]]; then
      echo "templates/page.safar.json: OK"
    else
      echo "templates/page.safar.json: FAIL (Datei fehlt nach Pull)"
      exit 2
    fi
  else
    echo "templates/page.safar.json: FAIL (Pull fehlgeschlagen)"
    exit 2
  fi
fi

echo
echo "Fertig." 