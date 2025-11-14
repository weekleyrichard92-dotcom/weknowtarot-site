<!-- Copilot instructions for the We Know Tarot site -->
# We Know Tarot — Agent Quick Guide

This file gives concise, actionable context so AI coding agents can be productive immediately.

- Project type: Static site built with Vite + Tailwind. Entry pages: `index.html`, `products.html`, `collections.html`, `app.html`.
- Where to look: UI components live in `components/` (shared `navbar.html`, `footer.html`). Client JS lives in `src/scripts/` and CSS in `src/styles/main.css`.

Key patterns

- Shared HTML injection: `src/scripts/main.js` uses `fetch()` to inject `components/navbar.html` and `components/footer.html` into pages. If you change markup, update the IDs/selectors used by `main.js`.
- Data-driven sample content: `data/products.json` is read by `src/scripts/products.js` (see `loadProducts()`) — update this file to change product listings. Paths used are static (e.g. images under `src/assets/images/`), so use absolute paths like `/src/assets/images/...`.
- Tailwind configuration: `tailwind.config.js` lists content globs including `components/**/*.html` and `src/**/*.js`. When adding new markup files, add them to `content` so Tailwind generates utilities.

<!-- Copilot instructions for the We Know Tarot site -->
# We Know Tarot — Agent Quick Guide

This file gives concise, actionable context so AI coding agents can be productive immediately.

- Project type: Static site built with Vite + Tailwind. Entry pages: `index.html`, `products.html`, `collections.html`, `app.html`.
- Where to look: UI components live in `components/` (shared `navbar.html`, `footer.html`). Client JS lives in `src/scripts/` and CSS in `src/styles/main.css`.

Key patterns

- Shared HTML injection: `src/scripts/main.js` uses `fetch()` to inject `components/navbar.html` and `components/footer.html` into pages. If you change markup, update the IDs/selectors used by `main.js`.
- Data-driven sample content: `data/products.json` is read by `src/scripts/products.js` (see `loadProducts()`) — update this file to change product listings. Paths used are static (e.g. images under `src/assets/images/`), so use absolute paths like `/src/assets/images/...`.
- Tailwind configuration: `tailwind.config.js` lists content globs including `components/**/*.html` and `src/**/*.js`. When adding new markup files, add them to `content` so Tailwind generates utilities.

Build & dev workflow

- Local dev: `npm install` then `npm run dev` (runs `vite` and opens the browser). Production build: `npm run build` and optional preview with `npm run preview`.
- Node: Project expects Node.js (v18+ recommended). `package.json` uses ESM (`"type": "module"`).

Conventions & small rules

- Routing: Pages reference assets with absolute paths (e.g. `/data/products.json`, `/components/navbar.html`). During dev and in the built `dist/` folder these paths resolve relative to site root.
- CSS import: Tailwind is imported from JS (`src/scripts/main.js` imports `../styles/main.css`) so Vite processes Tailwind. Avoid moving that import unless you update `index.html` script order.
- Minimal JS: Keep components purely HTML when possible; shared behavior (like year injection in `main.js`) is centralized in `src/scripts/main.js`.

Examples to reference when editing

- To change the navbar layout: edit `components/navbar.html` and ensure `main.js` still targets the element with id "navbar" (check `document.querySelector` calls in `src/scripts/main.js`).
- To update product cards: edit `data/products.json` or `src/scripts/products.js` (function `loadProducts()` produces markup).
- To add Tailwind utilities: update `tailwind.config.js` `theme.extend` and ensure new classes appear in files matched by `content`.

Integration points

- No backend: this is a static site. All data is local JSON and images in `src/assets/images/`.
- Deploy: built output is `dist/` (static). Common hosts: Netlify/Vercel. CI/deploy scripts are not included in this repo.

When suggested edits are ambiguous

- Preserve absolute asset paths and file names used across HTML/JS. If renaming or moving files, update all references: imports in `src/scripts/*.js`, `data/*.json` fetches, and `components/*.html` image paths.
- If a change touches Tailwind classes, ensure the changed files are included by `tailwind.config.js` content globs or classes may be purged in production.

If you modify build config

- `vite.config.js` is minimal (server open). Any changes to base paths or publicDir affect how absolute paths resolve — update HTML/JS accordingly.

Files of immediate interest

- `README.md` — quick start and notes
- `package.json` — scripts (`dev`, `build`, `preview`) and Node/Esm expectations
- `src/scripts/main.js` — component injection + year logic
- `src/scripts/products.js` — `loadProducts()` example for rendering data
- `data/products.json` — sample data source
- `components/navbar.html`, `components/footer.html` — shared markup

If anything is unclear or more context is needed (test commands, CI, or expected deploy target), ask the repo owner before making changes that affect paths or build configuration.
