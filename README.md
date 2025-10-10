# We Know Tarot — Mystic Starter (Vite + Tailwind)

A flexible starter for a tarot-inspired site with pages:
- Home (`index.html`)
- Products (`products.html`)
- Collections (`collections.html`)
- App (`app.html`)

## Quick Start
1. Install Node.js (v18+ recommended).
2. In a terminal, `cd` into this folder.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL (usually http://localhost:5173).

## Build for production
```bash
npm run build
npm run preview   # optional local preview of the build
```

## Replace placeholders
- Images live in `src/assets/images/`. Replace files with the same names to swap visuals.
- Colors/typography: edit `tailwind.config.js`.
- Shared navbar/footer live in `/components` and are injected by `src/scripts/main.js`.

## Deploy (later)
- **Netlify/Vercel**: connect your repo and use default build (`npm run build`) and serve `dist/`.
- **Static hosting**: upload the `dist/` folder after `npm run build`.

## Notes
- Tailwind is imported via JS (`import './styles/main.css'`) so Vite processes it.
- Use `/data/products.json` to manage sample products.