# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Single-page personal portfolio (Krutik Shah). Plain HTML/CSS/JS — no build step, no package manager, no tests, no linter. Edit files directly and reload.

- Preview: open `index.html`, or `python -m http.server 5500` and visit `http://localhost:5500`.
- Deploy: any static host (GitHub Pages / Vercel / Netlify); see `README.md`.

## Architecture

- `index.html` — the whole site. Sections are in order: hero, `#telemetry` (about), `#stack` (skills), `#experience`, `#systems` (projects), `#contact`. Section headings carry a numeric `sec-index` (01–05) that is hand-maintained. Also contains the splash screen, contact modal, project modal, and the AI-agent chat widget markup.
- `style.css` — one stylesheet, organised by `/* ---------- SECTION ---------- */` banners. Theme is driven by CSS custom properties in `:root` (dark "blueprint/terminal" look; fonts JetBrains Mono + Space Grotesk loaded from Google Fonts in `<head>`).
- `script.js` — one plain script (no modules), top-level code sectioned by `// ---- name ----` comments. Respects `prefers-reduced-motion`.
- `resume.html` — tiny redirect page that forwards to `assets/Krutik_Shah.pdf`; links to the resume go through it.

## Things that span files

- **Project cards ↔ modal**: each `.pipeline-card` in `#systems` holds a hidden `.pl-detail` block. `openProjectModal()` in `script.js` *moves* that DOM node into `#projectModal` (leaving a comment placeholder) and moves it back on close. New projects need `data-category` matching a `.filter-tab[data-filter]` button, plus `.pl-id`, `h3`, `.pl-role` and `.pl-detail`.
- **Nav highlighting**: `a[data-section]` links in `#navLinks` must match section `id`s; the active-section observer is built from them.
- **Site assistant** (bottom of `script.js`): a client-side, rule-based FAQ bot. Its `faqs` array hard-codes skills, experience, education, contact email, etc. — **update it whenever the corresponding content in `index.html` changes**, or the bot will contradict the page.
- **Contact form**: posts to Web3Forms; `YOUR_WEB3FORMS_ACCESS_KEY` in `index.html` is still a placeholder (form shows a "could not send" message until replaced).
- Resume PDF lives at `assets/Krutik_Shah.pdf`; keep the filename or update `resume.html` and the links in `index.html`.
