# Horizon Estates — Website

Production-ready static website for Horizon Estates, a Delhi NCR real estate brand.

## Structure
- `index.html` — Homepage (hero, search, listings, stats, services, EMI calculator, testimonials, gallery preview, FAQ, contact CTA)
- `about.html`, `properties.html`, `services.html`, `gallery.html`, `faq.html`, `contact.html`, `privacy.html`, `terms.html`
- `style.css` — All styling (design tokens as CSS variables at the top)
- `script.js` — All interactivity (nav, search tabs, counters, EMI calculator, FAQ accordion, lightbox, form validation)
- `robots.txt`, `sitemap.xml` — SEO files

## Deploying to Cloudflare Pages
1. Push this folder to a GitHub repository.
2. In Cloudflare Pages, create a new project connected to the repo.
3. Build command: none (static site). Output directory: `/` (root).
4. Deploy — no environment variables required.

## Editing content
- Update colors/fonts in the `:root` block at the top of `style.css`.
- Update property listings by editing `.property-card` blocks in `index.html` / `properties.html`.
- Update contact details in the top bar, `contact.html`, and the JSON-LD schema block in `index.html`.
- Replace Unsplash placeholder image URLs with your own photos once available — keep the same `alt` text pattern for SEO.
