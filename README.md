# MAGOCLUB

Static website for MAGOCLUB — personal training & lifestyle coaching practice
in Marylebone, London. Founded by Maria Elena Cismarescu.

Live at https://magoclub.co.uk

## Stack
Static HTML + CSS, no build step. Vanilla JS for nav drawer, dropdown, partial
includes, and the Register Interest form prototype.

## Pages
- `index.html` — Home
- `about.html` — About + The Founder + MAGO House teaser
- `the-pillars/` — Pillars hub + Body / Skill / Mind / Connection
- `mago-house.html` — Coming-soon flagship landing
- `register-interest.html` — Conversion form (mailto prototype)
- `404.html` — Off the floor

## Conventions
- `partials/nav.html` and `partials/footer.html` are loaded by `js/include.js`
  into every page — edit once, applies everywhere
- `<html data-root="">` for root pages, `<html data-root="../">` for nested
- `<body data-page="...">` drives nav active state
- Background rhythm uses `.band--stage-2`, `.band--tinted`, `.band--cream`
  wrappers around content sections

## Status
Prototype. Photography is placeholder (Pexels / Unsplash) pending Maria's
bespoke shoot. Form action is `mailto:` for now — to be replaced with a real
backend before launch.
