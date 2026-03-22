# DJBSec Homepage Redesign — Design Spec

**Date:** 2026-03-21
**Branch:** `newDesign`
**Status:** Approved

---

## Context

The site currently uses the stock al-folio academic theme with a profile-photo `about` layout as the homepage. It reads as a personal blog rather than a curated security intelligence resource. The goal is to make the site feel like a trusted, authoritative security publication without abandoning the Jekyll/GitHub Pages stack. The user wants maximum visible impact on the homepage first, with a clear path to extend the redesign to all pages later.

---

## Visual Direction

**Clean Authority** — editorial, premium, authoritative. Light background by default. Not a hacker aesthetic, not a SOC dashboard. Think Bloomberg or The Economist applied to cybersecurity.

### Typography

| Role               | Font             | Weights       | Usage                                    |
| ------------------ | ---------------- | ------------- | ---------------------------------------- |
| Display / headings | Playfair Display | 700, 800      | H1–H3, site name, stat figures           |
| Body               | Inter            | 400, 500, 600 | Paragraphs, nav, UI labels               |
| Metadata           | IBM Plex Mono    | 400, 500      | Dates, tags, badges, EPSS scores, labels |

All three loaded from Google Fonts. The existing site loads fonts via a single URL in `_config.yml` under `third_party_libraries.google_fonts.url.fonts`, consumed by `_includes/head.liquid`. **The font loading approach is:** update the `_config.yml` `google_fonts.url.fonts` value to a combined Google Fonts URL that includes Playfair Display, Inter, and IBM Plex Mono. This replaces the current Roboto/Roboto Slab URL and keeps the existing `head.liquid` font `<link>` mechanism unchanged. Font stack variables are then declared in `_sass/_variables.scss` for use in `_sass/_typography.scss`.

### Color Tokens

All tokens defined in `_sass/_tokens.scss` as CSS custom properties. Overrides existing `_themes.scss` light/dark vars.

| Token                       | Light     | Dark      | Purpose                               |
| --------------------------- | --------- | --------- | ------------------------------------- |
| `--color-surface`           | `#ffffff` | `#0f1117` | Page background                       |
| `--color-surface-raised`    | `#f8f8fb` | `#1a1f2e` | Cards, panels, signal strip           |
| `--color-surface-border`    | `#e4e6ed` | `#2a3040` | Dividers, card borders                |
| `--color-ink`               | `#1a1a2e` | `#e2e8f0` | Primary text, headings                |
| `--color-ink-muted`         | `#6b7280` | `#94a3b8` | Secondary text, captions              |
| `--color-accent`            | `#0057ff` | `#3b82f6` | Links, CTAs, rule lines, left-borders |
| `--color-accent-subtle`     | `#eff4ff` | `#1e2a4a` | Accent tinted backgrounds             |
| `--color-severity-critical` | `#dc2626` | `#ef4444` | Critical severity labels only         |
| `--color-severity-high`     | `#d97706` | `#f59e0b` | High severity labels                  |

### Theme

Light mode is default. Dark mode toggle preserved — existing al-folio mechanism. Dark mode uses the token dark values above, keeping the editorial feel rather than inverting to a hacker aesthetic.

---

## Homepage Layout

Replaces `layout: about` with a new `layout: home`. The `about.md` page splits: homepage content stays at `/`, background/bio moves to a dedicated About page (future Phase B).

### Sections (top to bottom)

**1. Nav** _(updated visual only)_
Sticky, `backdrop-filter: blur(8px)`. Brand name in Playfair Display. Nav links in Inter 500, `--color-ink-muted` at rest → `--color-accent` on hover. Theme toggle as IBM Plex Mono pill. Existing nav labels unchanged.

**2. Hero** _(two-column)_

- Left: eyebrow label ("Security Intelligence" in IBM Plex Mono + accent rule), H1 headline in Playfair Display, value prop paragraph, primary CTA ("Read Today's Briefing") + secondary CTA ("Explore Resources")
- Right: Background panel — bio text + 2×2 credential tiles (Experience, Certification, Network, Firewall), each with accent left-border

**3. Latest Briefing** _(priority grid)_
Section header: Playfair title + "All posts →" link, separated by a 2px `--color-ink` rule.
Grid layout:

- Full-width featured card (2-col internal): left has chip + date + title + summary; right has 3 mini CVE headline rows with EPSS/CVSS/KEV metadata in IBM Plex Mono. **Data source for Phase A:** the CVE rows are static placeholder content in `home-cards.html`. Existing post files do not carry structured CVE front matter. Adding dynamic CVE data (via post front matter fields) is deferred to Phase B.
- Two secondary cards below: one Explained article, one Calendar item

**4. Upcoming Conferences** _(3-column row)_
Section header same pattern. Three conference cards: date badge (mono, accent border), name (Playfair), location, cost estimate from HOU. Links to full calendar.

**5. Footer** _(dark)_
Full-width, `--color-ink` background. Three-column: brand + tagline left, quick links center, credentials right. All in Inter/Mono at reduced opacity.

---

## Component Architecture

### New files (Phase A)

| File                              | Purpose                                                           |
| --------------------------------- | ----------------------------------------------------------------- |
| `_sass/_tokens.scss`              | CSS custom property definitions — single source of truth          |
| `_sass/_typography.scss`          | Playfair heading styles, IBM Plex Mono metadata utilities         |
| `_sass/_home.scss`                | Homepage layout: hero, priority grid, conference row              |
| `_sass/_cards.scss`               | Article card, conference card, feature card — shared with Phase B |
| `_layouts/home.liquid`            | New homepage layout template                                      |
| `_includes/home-hero.html`        | Hero section (headline + bio panel)                               |
| `_includes/home-cards.html`       | Latest briefing priority grid                                     |
| `_includes/home-conferences.html` | Conference spotlight strip                                        |

### Modified files (Phase A)

| File                      | Change                                                                                                                                                                                                                                                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets/css/main.scss`    | Add `@import` for four new partials in this order: `tokens` → `typography` → `cards` → `home`. Must come after `variables` but before `themes` so tokens resolve correctly.                                                                                                                                                         |
| `_sass/_variables.scss`   | Update `$global-theme-color` to `#0057ff`; add `$font-display`, `$font-body`, `$font-mono` vars; update `google_fonts` URL                                                                                                                                                                                                          |
| `_sass/_themes.scss`      | **Aliasing strategy** — preserve all existing `--global-*` custom properties unchanged. Add aliases pointing them at new tokens (e.g. `--global-bg-color: var(--color-surface)`). This keeps all existing pages working without modification. New components use `--color-*` tokens directly. No site-wide find/replace in Phase A. |
| `_pages/about.md`         | Change `layout: about` → `layout: home`, remove all inline `style=""` attributes                                                                                                                                                                                                                                                    |
| `_includes/header.liquid` | Playfair brand name, token-based link colors                                                                                                                                                                                                                                                                                        |
| `_includes/footer.liquid` | New dark footer structure (document-flow, not fixed-position)                                                                                                                                                                                                                                                                       |
| `_config.yml`             | (1) Update `google_fonts.url.fonts` to combined URL for Playfair Display + Inter + IBM Plex Mono. (2) Set `footer_fixed: false` — required for document-flow footer; current `true` would pin the new footer as a fixed viewport bar. (3) Add `noreferrer` to external link `rel` value (currently `external nofollow noopener`).   |

---

## Phase B Roadmap (future)

Phase A establishes the design system. Phase B extends it page by page using the same tokens and card components.

| Phase              | Scope                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **B1 — Blog/News** | Redesigned archive cards with date, chip, summary. Featured top story area.                                                                     |
| **B2 — Explained** | Knowledge library layout. Topic filters, reading time, difficulty, next reads.                                                                  |
| **B3 — Blue Team** | Grouped resource cards replacing long tables. Category labels, "best for" tags.                                                                 |
| **B4 — Calendar**  | Visual refresh of existing interactive calendar. Timeline toggle, cost viz, improved quick-view modal.                                          |
| **B5 — About**     | Dedicated about page with bio narrative, timeline, contact/follow signals.                                                                      |
| **B6 — Hardening** | CSP report-only, inline script/style removal, SRI audit, accessibility pass (WCAG 2.2 AA), performance audit (LCP <2.5s, INP <200ms, CLS <0.1). |

---

## Accessibility & Performance Baseline

These apply to Phase A and carry forward:

- Semantic landmark structure (`<nav>`, `<main>`, `<footer>`)
- Heading hierarchy: one H1 per page
- Visible focus indicators using `--color-accent` outline
- `prefers-reduced-motion` respected — no animations without this check
- Minimum 44px tap targets on CTAs
- External links: `rel="noopener noreferrer"`
- Alt text on all images
- Color contrast ≥ 4.5:1 for body text in both themes

---

## Verification

1. `JEKYLL_ENV=production bundle exec jekyll build` passes with no errors
2. Homepage renders with new `home.liquid` layout — no profile photo, no inline styles
3. Existing pages (Blog, Explained, EPSS, Blue Team, Calendar) render unchanged
4. Dark mode toggle switches between light and dark token sets correctly
5. Nav is sticky and functional on mobile
6. Lighthouse: Performance ≥ 90, Accessibility ≥ 90
7. No inline `style=""` attributes in `about.md` or `home.liquid`
