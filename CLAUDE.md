# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML5 website for **Pana Fiul S.R.L.**, an Argentine industrial supplies company (hoses, couplings, valves). No build process — files are deployed directly to an Apache server.

## No Build/Test Commands

This is a plain static site. There are no npm scripts, build tools, or test frameworks. To preview locally, open any `.html` file in a browser or use a local static server (e.g., `python -m http.server`).

## Architecture

### Page Structure
- `index.html` — Homepage (hero, product overview, CTAs)
- `empresa.html` — Company info
- `productos.html` — Full product catalog
- `contacto.html` — Contact form
- `gracias.html` — Post-submission confirmation (`noindex, nofollow`)
- 11 product landing pages (`mangueras-*.html`, `acoples-*.html`, `empaquetaduras-industriales.html`, `juntas-de-sellado.html`, `textiles-industriales.html`, `valvulas-industriales.html`)

### Assets
- `styles.css` — All styling (1000+ lines, no preprocessor)
- `script.js` — Client-side JS: mobile menu, scroll effects, contact form via EmailJS
- `Imagenes/` — Images organized by section (Inicio, Empresa, Contacto, Productos)
- `PDF/` — Technical data sheets (Acoples, Mangueras, Sellados); robots.txt and .htaccess block indexing/direct access

### External Dependency
EmailJS (CDN) handles contact form submission: service `service_gzjx69p`, template `template_8cnrjxx`. Falls back to `mailto:` if unavailable.

## CSS Conventions

**Color palette:**
- Green accent: `#10b981` (buttons, hover states, highlights)
- Header/dark text: `#334155`, `#475569`
- Page backgrounds: `#f8fafc`

**Key classes:**
- `.container` — max-width 1200px, 2rem padding
- `.grid-2 / .grid-3 / .grid-4` — CSS Grid with `auto-fit minmax`
- `.card` — white box with shadow and hover lift
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline` — button variants
- `.product-card` — flex-based product grid item
- `.bg-gray / .bg-white / .bg-dark` — section background variants
- Mobile breakpoints: 768px (most layouts), 560px (small screens → single column)

Only exception to no inline CSS: hero banner images use a CSS custom property inline: `style="--hero-banner: url(...);"`.

## JavaScript Conventions

- All logic in `script.js`, DOM-ready via `DOMContentLoaded`
- Product context passed via URL query strings (e.g., `?producto=mangueras-industriales`); `script.js` reads this to pre-populate the contact form
- Product label mapping defined at top of file (11 product types → human-readable Spanish labels)
- Contact form fields: `name`, `email`, `telefono`, `empresa`, `tipo_consulta`, `producto`, `mensaje`, `origen` (auto-set to current page URL)

## Content Language

All content is in **Spanish (Argentina)**. Keep new copy consistent with the existing tone — professional, industrial B2B.

## Product Page Template

Each product landing page follows this consistent structure:
1. Technical hero with background image
2. Intro section with lead text
3. Feature panels or spec tables
4. Related products section
5. CTA section linking to `contacto.html`

When adding or editing a product page, match this structure and reference existing pages (e.g., `mangueras-industriales.html`) as a template.

## SEO / Apache Config

- `sitemap.xml` and `robots.txt` are manually maintained — update `lastmod` and `sitemap.xml` entries when adding pages
- `.htaccess` blocks WordPress probing and prevents PDF folder indexing
- `gracias.html` must keep `<meta name="robots" content="noindex, nofollow">`
