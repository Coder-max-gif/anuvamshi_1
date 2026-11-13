# Anuvamshi Shetty — website

Static site (no build step). Home page with a WebGL α (three.js), smooth scroll (Lenis), and 7 subpages:

| Audience | Pages |
|---|---|
| CFA candidates | `cfa-courses.html`, `cfa-notes.html`, `cfa-sessions.html` |
| Investors | `newsletter.html`, `personal-finance.html`, `financial-models.html` |
| Founders | `founders-website.html` |

## Run locally
```
npx serve .
```

## Edit
- Home page: `index.html`, styles in `styles.css` + `effects.css`, 3D in `main.js`, effects in `effects.js`.
- Subpages: edit `tools/build-pages.cjs`, then `node tools/build-pages.cjs` to regenerate them (shared styles/behaviour in `sub.css` / `sub.js`).
- Instagram thumbnails: see `assets/ig/README.md`.
- Newsletter signup: set `data-endpoint` on the `form.signup` elements (Substack, Mailchimp, ConvertKit…).

Deploys as-is to any static host (GitHub Pages, Netlify, Vercel).
