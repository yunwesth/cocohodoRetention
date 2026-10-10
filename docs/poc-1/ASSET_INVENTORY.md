# POC 1 — asset and brand inventory

Reviewed October 9, 2026. Local files are available for the prototype; their presence does not establish official brand approval or licensing provenance. No external photos were downloaded during POC 1. During the subsequent full MVP implementation, reference photos were downloaded for the local prototype; see the update below.

## Existing assets

Paths below are relative to the repository root.

| Asset / source | Intended use | Reuse status |
| --- | --- | --- |
| `packages/ui/src/brand-mark.tsx` | Walnut outline mark beside the Cocohodo name | Existing app artwork; prototype reuse proposed; official logo approval unresolved |
| `apps/rewards/features/mascot/hodo.tsx` and `apps/rewards/features/mascot/hodo.module.css` | Animated walnut mascot in the rewards introduction | Existing inline SVG; use sparingly; retain reduced-motion behavior; provenance/brand approval unconfirmed |
| `apps/rewards/public/hodo-mascot.png` | Optional raster mascot candidate | Existing file; not the SVG used by the current Hodo component; inspect before selection; provenance unconfirmed |
| `apps/rewards/public/coffee-art.svg` | Optional decorative coffee illustration | Existing file; inspect before selection; not a real product photo; provenance unconfirmed |
| `apps/rewards/public/icon.svg` | Existing app icon | Source shows a C-style mark, distinct from the walnut header; reconcile identity in POC 2 |
| `apps/rewards/public/apple-icon.png`, `apps/rewards/public/icon-192.png`, `apps/rewards/public/icon-512.png`, `apps/rewards/public/icon-maskable.png` | Existing home-screen icons | Existing assets; inspect visual consistency before reuse on the public site |

## Photograph brief

| Proposed image | Placement | Source and rights status | Fallback for prototype |
| --- | --- | --- | --- |
| Walnut pastries with a drink | Homepage hero | Shop-supplied image requested; no file selected | Labeled photo placeholder and existing walnut mark |
| Croissant taiyaki | Featured category | Shop-supplied image requested; no file selected | Text-led category card |
| Bubble tea or shaved ice | Featured category | Shop-supplied image requested; no file selected | Text-led category card |
| Walnut pastry gift box | Gift section | Shop-supplied image requested; no file selected | Text-led category card |
| Closter storefront and entrance | Visit page | Shop-supplied image requested; no file selected | Address, directions button, and hours |

The [existing website](https://njcocohodo.com/) is a reference for the business identity. Its photographs and logo require confirmation of reuse rights before importing them. Do not substitute another branch's storefront or generated imagery presented as an actual shop product.

## Brand tokens taken from the app

| Token | Value | Public-site proposal |
| --- | --- | --- |
| Paper | `#f8f5f2` | Main background |
| Ink | `#2c251f` | Main text and strong actions |
| Muted | `#85877f` | Existing reference; check contrast before text use |
| Line | `#e8e2dd` | Dividers |
| Sand | `#f2e6da` | Secondary backgrounds |
| Accent | `#e9d5c2` | Decorative highlights |
| Body type | Arial / Helvetica / sans-serif | Familiar, readable body text |
| Editorial type | Georgia / serif | Optional section headlines, already present in app styles |

Use warm, simple copy and generous space around food imagery. The mascot supports the rewards story; food and shop information lead the public homepage.

## Full MVP update — October 9, 2026

The local prototype now uses seven photographs from the reference website. Their exact URLs and publication-rights status are recorded in [photo sources](../../apps/website/public/photos/SOURCES.md). They replace the proposed placeholders for food imagery. No storefront photograph is used. The public favicon reuses the existing walnut mark to align it with the header; rewards icons remain unchanged.
