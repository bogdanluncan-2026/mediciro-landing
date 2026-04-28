# mediciro-landing

Site de prezentare pentru aplicația MediciRO — programări medicale online pentru clinici private din România.

## Despre
- Site static SPA hostat pe mediciro.ro (S3 + CloudFront)
- Prezintă platforma MediciRO
- Stack: React + Vite + Tailwind CSS + Framer Motion

## Links
- Landing: https://mediciro.ro
- Aplicație: https://app.mediciro.ro
- API: https://api.mediciro.ro
- Owner: Bogdan Luncan

## Design System
- Inspirație: apple.com — minimalist, spațios, animații subtile la scroll
- Ease function standard: `[0.25, 0.1, 0.25, 1]` (cubic-bezier Apple) — folosit uniform în toate componentele
- Spațiere secțiuni: `py-32 lg:py-48`
- Headline tracking: `-0.03em` (tracking negativ pentru titluri mari)
- Animații: `y: 60, scale: 0.97` → `y: 0, scale: 1`, duration `0.8–1s`
- Fără scroll indicator în Hero (Apple nu folosește)

## Content Management

Tot conținutul site-ului (texte, link-uri, prețuri) se află în `src/content/site.json`.
Tipurile TypeScript sunt exportate automat din `src/content/index.ts`.

Pentru a edita texte, imagini sau link-uri:
1. Deschide `src/content/site.json`
2. Modifică valorile dorite
3. Salvează — site-ul se actualizează automat (în dev mode)

Structura JSON-ului:
- `meta` — informații generale (nume site, URL-uri, email contact)
- `navbar` — linkuri meniu, texte butoane
- `hero` — badge, headline, subtitle, CTA-uri, trust signals
- `features` — label secțiune, titlu, subtitlu, lista de funcționalități (cu `icon` și `color`)
- `howItWorks` — label, titlu, subtitlu, pașii (cu `icon`), CTA
- `screenshots` — label, titlu, subtitlu, lista de imagini/mockup-uri
- `pricing` — label, titlu, subtitlu, planuri (cu features, CTA, badge), footnote
- `finalCta` — badge, titlu, subtitlu, CTA-uri
- `footer` — descriere, coloane linkuri, copyright (cu placeholder `{year}` și `{company}`)

Iconițele în `features` și `howItWorks` sunt mapate în componentă via `iconMap`.
Culorile cardurilor din `features` sunt mapate via `colorMap` (valori: `blue`, `indigo`, `violet`, `sky`).

## Deploy
- S3 + CloudFront pe mediciro.ro
- Bucket S3: `mediciro.ro` (eu-central-1)
