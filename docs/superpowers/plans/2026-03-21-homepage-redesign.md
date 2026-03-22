# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the DJBSec homepage from a stock al-folio profile layout into a Clean Authority editorial layout with a proper design token system, while leaving all other pages visually unchanged.

**Architecture:** Introduce a `_sass/_tokens.scss` file as the single source of truth for color/font tokens, aliased into the existing `--global-*` CSS custom property system so nothing else breaks. Create a new `home.liquid` layout and three Liquid includes for the hero, briefing grid, and conference strip. The homepage front matter swaps `layout: about` → `layout: home`.

**Tech Stack:** Jekyll 4, Liquid templating, SCSS/Sass (via jekyll-sass-converter), Bootstrap 4, Google Fonts (Playfair Display + Inter + IBM Plex Mono). No JS changes in this phase.

**Spec:** `docs/superpowers/specs/2026-03-21-homepage-redesign-design.md`

**Branch:** `newDesign` — work only on this branch, never push to main.

**Verification command (run after every task):**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

Expected: `done in X seconds` with no errors.

---

## File Map

| Action | File                              | Responsibility                                                    |
| ------ | --------------------------------- | ----------------------------------------------------------------- |
| Modify | `_config.yml`                     | footer_fixed, Google Fonts URL, external_links rel                |
| Create | `_sass/_tokens.scss`              | All CSS custom properties (light + dark)                          |
| Modify | `_sass/_variables.scss`           | Add font stack vars, update $global-theme-color                   |
| Modify | `_sass/_themes.scss`              | Add --global-_ → --color-_ aliases                                |
| Create | `_sass/_typography.scss`          | Playfair heading styles, IBM Plex Mono utilities                  |
| Create | `_sass/_cards.scss`               | Feature card, article card, conference card, chip styles          |
| Create | `_sass/_home.scss`                | Hero grid, section headers, priority grid, conference row, footer |
| Modify | `assets/css/main.scss`            | Import new partials in correct order                              |
| Create | `_layouts/home.liquid`            | Homepage layout wrapper                                           |
| Create | `_includes/home-hero.html`        | Hero section (headline + bio panel)                               |
| Create | `_includes/home-cards.html`       | Latest briefing priority grid                                     |
| Create | `_includes/home-conferences.html` | Upcoming conferences 3-column strip                               |
| Modify | `_pages/about.md`                 | layout: home, remove all inline style=""                          |
| Modify | `_includes/footer.liquid`         | New dark three-column footer                                      |
| Modify | `_includes/header.liquid`         | Playfair brand name class                                         |

---

## Task 1: Config — fonts, footer, external links

**Files:**

- Modify: `_config.yml:47` (footer_fixed)
- Modify: `_config.yml:348` (external_links rel)
- Modify: `_config.yml:452` (google_fonts URL)

- [ ] **Step 1: Update footer_fixed**

In `_config.yml` line 47, change:

```yaml
footer_fixed: true
```

to:

```yaml
footer_fixed: false
```

- [ ] **Step 2: Update external_links rel**

In `_config.yml` line 348, change:

```yaml
rel: external nofollow noopener
```

to:

```yaml
rel: external nofollow noopener noreferrer
```

- [ ] **Step 3: Update Google Fonts URL**

In `_config.yml` line 452, change:

```yaml
fonts: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:100,300,400,500,700|Material+Icons&display=swap"
```

to:

```yaml
fonts: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Material+Icons&display=swap"
```

- [ ] **Step 4: Verify build passes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add _config.yml
git commit -m "chore: update fonts, footer_fixed, and external link rel for redesign"
```

---

## Task 2: Design tokens

**Files:**

- Create: `_sass/_tokens.scss`
- Modify: `assets/css/main.scss`

- [ ] **Step 1: Create `_sass/_tokens.scss`**

```scss
// _sass/_tokens.scss
// Single source of truth for all design tokens.
// Light values in :root, dark overrides in html[data-theme="dark"].

:root {
  --color-surface: #ffffff;
  --color-surface-raised: #f8f8fb;
  --color-surface-border: #e4e6ed;
  --color-ink: #1a1a2e;
  --color-ink-muted: #6b7280;
  --color-accent: #0057ff;
  --color-accent-subtle: #eff4ff;
  --color-severity-critical: #dc2626;
  --color-severity-high: #d97706;
}

html[data-theme="dark"] {
  --color-surface: #0f1117;
  --color-surface-raised: #1a1f2e;
  --color-surface-border: #2a3040;
  --color-ink: #e2e8f0;
  --color-ink-muted: #94a3b8;
  --color-accent: #3b82f6;
  --color-accent-subtle: #1e2a4a;
  --color-severity-critical: #ef4444;
  --color-severity-high: #f59e0b;
}
```

- [ ] **Step 2: Add `_tokens` import to `assets/css/main.scss`**

The current import order in `assets/css/main.scss` is:

```scss
@import "variables", "themes", ...;
```

Change it to insert `tokens` after `variables` (before `themes`), and add `typography`, `cards`, and `home` at the **end** — after `base` — so they can intentionally override base styles without specificity fights:

```scss
@import "variables", "tokens", "themes", "layout", "base", "distill", "cv", "tabs", "typograms", "font-awesome/fontawesome", "font-awesome/brands",
  "font-awesome/solid", "font-awesome/regular", "tabler-icons/tabler-icons.scss", "tabler-icons/tabler-icons-filled.scss",
  "tabler-icons/tabler-icons-outline.scss", "cybersecurity-calendar", "typography", "cards", "home";
```

Important: `typography`, `cards`, and `home` go **after** `base` so their heading/component rules win the cascade over `_base.scss`'s broad selectors. `tokens` goes before `themes` so both compile cleanly (CSS custom properties resolve at browser runtime regardless of SCSS import order, but this grouping is clearest).

(Note: `typography`, `cards`, and `home` partials don't exist yet — create placeholder empty files so the build doesn't fail.)

- [ ] **Step 3: Create placeholder files to keep build happy**

Create `_sass/_typography.scss`, `_sass/_cards.scss`, and `_sass/_home.scss` each with just a comment:

```scss
// placeholder — styles added in subsequent tasks
```

- [ ] **Step 4: Verify build passes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add _sass/_tokens.scss _sass/_typography.scss _sass/_cards.scss _sass/_home.scss assets/css/main.scss
git commit -m "feat: add design token system and import skeleton"
```

---

## Task 3: Wire tokens into existing theme vars + update variables

**Files:**

- Modify: `_sass/_themes.scss`
- Modify: `_sass/_variables.scss`

- [ ] **Step 1: Update `_sass/_variables.scss`**

Add font stack variables. Append these lines after the existing color variables (around line 50):

```scss
// Font stacks — used by _typography.scss and _home.scss
$font-display: "Playfair Display", Georgia, serif;
$font-body:
  Inter,
  system-ui,
  -apple-system,
  sans-serif;
$font-mono: "IBM Plex Mono", "Courier New", monospace;
```

Note: Do NOT change `$purple-color`. The accent color is controlled entirely by the `--color-accent` token alias we add in Step 2 — that alias overrides the SCSS-interpolated `--global-theme-color` value and is the single source of truth for the accent. Changing `$purple-color` would be redundant dead code.

- [ ] **Step 2: Add token aliases to `_sass/_themes.scss`**

In the `:root` block (ends around line 76), add these aliases **after** the existing `--global-*` declarations but still inside `:root {}`:

```scss
// Token aliases — new components use --color-* directly;
// existing components continue using --global-* which points here.
--global-bg-color: var(--color-surface);
--global-text-color: var(--color-ink);
--global-text-color-light: var(--color-ink-muted);
--global-theme-color: var(--color-accent);
--global-hover-color: var(--color-accent);
--global-card-bg-color: var(--color-surface-raised);
--global-divider-color: var(--color-surface-border);
```

In the `html[data-theme="dark"]` block (ends around line 122), add the same aliases inside that block:

```scss
--global-bg-color: var(--color-surface);
--global-text-color: var(--color-ink);
--global-text-color-light: var(--color-ink-muted);
--global-theme-color: var(--color-accent);
--global-hover-color: var(--color-accent);
--global-card-bg-color: var(--color-surface-raised);
--global-divider-color: var(--color-surface-border);
```

- [ ] **Step 3: Verify build passes and spot-check an existing page**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
bundle exec jekyll serve --no-watch &
sleep 3
curl -s http://localhost:4000/blog/ | grep -c "post" && kill %1
```

Expected: build passes, blog page returns content.

- [ ] **Step 4: Commit**

```bash
git add _sass/_variables.scss _sass/_themes.scss
git commit -m "feat: wire design tokens into global CSS var aliases"
```

---

## Task 4: Typography styles

**Files:**

- Modify: `_sass/_typography.scss` (replace placeholder)

- [ ] **Step 1: Write `_sass/_typography.scss`**

```scss
// _sass/_typography.scss
// Playfair Display for headings, IBM Plex Mono for metadata/labels.

// Heading font — applied globally
h1,
h2,
h3 {
  font-family: $font-display;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}

h1 {
  font-weight: 800;
}
h2 {
  font-weight: 700;
}
h3 {
  font-weight: 700;
}

// Metadata utility class — dates, tags, badges, EPSS scores
.mono {
  font-family: $font-mono;
  font-size: 0.75em;
  letter-spacing: 0.05em;
}

// Eyebrow label — uppercase mono with accent color
.eyebrow {
  font-family: $font-mono;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-accent);
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 2px;
    background: var(--color-accent);
    flex-shrink: 0;
  }
}

// Chip — category pill for cards
.chip {
  font-family: $font-mono;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 2px 7px;
  border-radius: 2px;
  display: inline-block;

  &--news {
    background: var(--color-accent);
    color: #fff;
  }
  &--learn {
    background: #e8f5e9;
    color: #1b5e20;
  }
  &--tool {
    background: #fff3e0;
    color: #e65100;
  }
  &--calendar {
    background: #f3e5f5;
    color: #4a148c;
  }
}
```

- [ ] **Step 2: Verify build passes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add _sass/_typography.scss
git commit -m "feat: add typography styles — Playfair headings and mono utilities"
```

---

## Task 5: Card styles

**Files:**

- Modify: `_sass/_cards.scss` (replace placeholder)

- [ ] **Step 1: Write `_sass/_cards.scss`**

```scss
// _sass/_cards.scss
// Reusable card components. Used on homepage; extended in Phase B.

// Base card
.djb-card {
  border: 1px solid var(--color-surface-border);
  border-radius: 6px;
  padding: 20px;
  background: var(--color-surface);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: var(--color-accent);
    box-shadow: 0 2px 12px rgba(0, 87, 255, 0.08);
  }

  &__chip {
    margin-bottom: 10px;
  }
  &__date {
    font-family: $font-mono;
    font-size: 0.6rem;
    color: var(--color-ink-muted);
    margin-bottom: 6px;
  }
  &__title {
    font-family: $font-display;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--color-ink);
    margin-bottom: 6px;
    line-height: 1.25;
    letter-spacing: -0.01em;
  }
  &__desc {
    font-size: 0.82rem;
    color: var(--color-ink-muted);
    line-height: 1.65;
  }
}

// Featured card — full-width, accent background, two-column interior
.djb-card--featured {
  background: var(--color-accent-subtle);
  border-color: rgba(0, 87, 255, 0.2);

  .djb-card__title {
    font-size: 1.35rem;
  }
}

.djb-card--featured-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

// Mini CVE headline row (inside featured card right column)
.cve-row {
  font-size: 0.8rem;
  color: var(--color-ink);
  padding: 8px 10px;
  border-left: 2px solid var(--color-accent);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0 3px 3px 0;
  margin-bottom: 6px;

  html[data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }

  &__meta {
    font-family: $font-mono;
    font-size: 0.6rem;
    color: var(--color-ink-muted);
    margin-top: 2px;
  }
}

// Conference card
.conf-card {
  border: 1px solid var(--color-surface-border);
  border-radius: 4px;
  padding: 16px;
  background: var(--color-surface);

  &__badge {
    font-family: $font-mono;
    font-size: 0.62rem;
    color: var(--color-accent);
    border: 1px solid rgba(0, 87, 255, 0.3);
    padding: 2px 7px;
    border-radius: 2px;
    display: inline-block;
    margin-bottom: 8px;
    letter-spacing: 0.06em;
  }

  &__name {
    font-family: $font-display;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--color-ink);
    margin-bottom: 4px;
  }
  &__location {
    font-size: 0.75rem;
    color: var(--color-ink-muted);
    margin-bottom: 8px;
  }
  &__cost {
    font-family: $font-mono;
    font-size: 0.68rem;
    color: var(--color-ink-muted);
    border-top: 1px solid var(--color-surface-border);
    padding-top: 8px;
    margin-top: 8px;
  }
}
```

- [ ] **Step 2: Verify build passes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add _sass/_cards.scss
git commit -m "feat: add reusable card component styles"
```

---

## Task 6: Home layout SCSS

**Files:**

- Modify: `_sass/_home.scss` (replace placeholder)

- [ ] **Step 1: Write `_sass/_home.scss`**

```scss
// _sass/_home.scss
// Layout styles for the homepage only: hero, section headers, grids, footer.

// ── Hero ────────────────────────────────────────────────────────────────────
.home-hero {
  border-bottom: 1px solid var(--color-surface-border);
  padding: 56px 0 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 36px 0 32px;
  }
}

.home-hero__headline {
  h1 {
    font-size: 2.8rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 18px;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 0.95rem;
    color: var(--color-ink-muted);
    line-height: 1.7;
    margin-bottom: 28px;
    max-width: 420px;
  }
}

.home-hero__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

// Bio panel (right column of hero)
.home-bio-panel {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-surface-border);
  border-radius: 6px;
  padding: 24px;

  &__label {
    font-family: $font-mono;
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-accent);
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--color-surface-border);
  }

  &__text {
    font-size: 0.85rem;
    color: var(--color-ink-muted);
    line-height: 1.8;
    margin-bottom: 16px;
  }
}

.home-cred-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.home-cred-tile {
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-left: 3px solid var(--color-accent);
  padding: 10px 12px;

  &__label {
    font-family: $font-mono;
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-ink-muted);
    margin-bottom: 2px;
  }
  &__value {
    font-family: $font-display;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-ink);
  }
}

// ── Section header ───────────────────────────────────────────────────────────
.home-section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-ink);
  padding-bottom: 8px;
  margin-bottom: 24px;
  margin-top: 48px;

  &__title {
    font-family: $font-display;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--color-ink);
    letter-spacing: -0.02em;
  }
  &__link {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-accent);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

// ── Priority grid ────────────────────────────────────────────────────────────
.home-priority-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.home-priority-grid__featured {
  grid-column: 1 / -1;
}

// ── Conference row ───────────────────────────────────────────────────────────
.home-conf-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

// ── CTA buttons ──────────────────────────────────────────────────────────────
.btn-djb-primary {
  display: inline-block;
  background: var(--color-accent);
  color: #fff !important;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none !important;
  border: none;
  cursor: pointer;
  min-height: 44px;
  line-height: 24px;

  &:hover {
    opacity: 0.9;
  }
}

.btn-djb-secondary {
  display: inline-block;
  color: var(--color-accent) !important;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid var(--color-accent);
  text-decoration: none !important;
  background: transparent;
  cursor: pointer;
  min-height: 44px;
  line-height: 24px;

  &:hover {
    background: var(--color-accent-subtle);
  }
}

// ── Footer ───────────────────────────────────────────────────────────────────
// The home footer lives inside default.liquid's .container wrapper, so we use
// a negative-margin breakout to make it full-bleed across the viewport.
.home-footer {
  border-top: 2px solid var(--color-ink);
  background: var(--color-ink);
  padding: 32px 24px;
  margin-top: 56px;
  // Break out of default.liquid's .container to span full width:
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  width: 100vw;

  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    max-width: 960px;
    margin: 0 auto;
  }

  &__brand {
    font-family: $font-display;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
  }

  &__tagline {
    font-family: $font-mono;
    font-size: 0.62rem;
    color: rgba(255, 255, 255, 0.35);
    margin-top: 2px;
  }

  &__links {
    display: flex;
    gap: 20px;
    list-style: none;
    padding: 0;
    margin: 0;

    a {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      &:hover {
        color: #fff;
      }
    }
  }

  &__meta {
    font-family: $font-mono;
    font-size: 0.62rem;
    color: rgba(255, 255, 255, 0.3);
    text-align: right;
  }
}
```

- [ ] **Step 2: Verify build passes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add _sass/_home.scss
git commit -m "feat: add homepage layout SCSS"
```

---

## Task 7: Navbar brand style

**Files:**

- Modify: `_includes/header.liquid`
- Modify: `_sass/_base.scss` (add nav token overrides)

The header Liquid template is complex — make the smallest change possible. We only need the brand name to use Playfair Display. The existing nav link colors will pick up `--color-accent` automatically via the token aliases we added in Task 3.

- [ ] **Step 1: Add Playfair class to brand `<a>` in `_includes/header.liquid`**

Find the brand anchor (line 6):

```liquid
        <a class="navbar-brand title font-weight-lighter" href="{{ site.baseurl }}/">
```

Change to:

```liquid
        <a class="navbar-brand title font-weight-bold djb-nav-brand" href="{{ site.baseurl }}/">
```

- [ ] **Step 2: Add `.djb-nav-brand` style to `_sass/_home.scss`** (append to file)

```scss
// Nav brand — Playfair Display
.djb-nav-brand {
  font-family: $font-display !important;
  font-size: 1.1rem !important;
  letter-spacing: -0.02em;
}
```

- [ ] **Step 3: Verify build passes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add _includes/header.liquid _sass/_home.scss
git commit -m "feat: apply Playfair Display to navbar brand"
```

---

## Task 8: Homepage includes

**Files:**

- Create: `_includes/home-hero.html`
- Create: `_includes/home-cards.html`
- Create: `_includes/home-conferences.html`

- [ ] **Step 1: Create `_includes/home-hero.html`**

Important: `default.liquid` already wraps `{{ content }}` in `<div class="container mt-5">`. Do NOT add `.container` to section elements — that would create nested containers with broken padding. The sections inherit the container from `default.liquid`.

```html
<section class="home-hero">
  <!-- Left: headline + CTAs -->
  <div class="home-hero__headline">
    <p class="eyebrow">Security Intelligence</p>
    <h1>Cybersecurity<br />clarity,<br />every day.</h1>
    <p>Daily briefings, explainers, tools, and resources for security practitioners and leaders — curated by a CISSP with 25 years in the field.</p>
    <div class="home-hero__actions">
      <a href="{{ '/blog/' | relative_url }}" class="btn-djb-primary">Read Today's Briefing</a>
      <a href="{{ '/blue-team/' | relative_url }}" class="btn-djb-secondary">Explore Resources</a>
    </div>
  </div>

  <!-- Right: bio panel -->
  <div class="home-bio-panel">
    <p class="home-bio-panel__label">Background</p>
    <p class="home-bio-panel__text">
      Started at the helpdesk, worked through systems administration, network engineering, and senior leadership. Built a security program from the
      ground up. CISSP since 2024.
    </p>
    <div class="home-cred-grid">
      <div class="home-cred-tile">
        <p class="home-cred-tile__label">Experience</p>
        <p class="home-cred-tile__value">25+ years</p>
      </div>
      <div class="home-cred-tile">
        <p class="home-cred-tile__label">Certification</p>
        <p class="home-cred-tile__value">CISSP</p>
      </div>
      <div class="home-cred-tile">
        <p class="home-cred-tile__label">Network</p>
        <p class="home-cred-tile__value">Cisco</p>
      </div>
      <div class="home-cred-tile">
        <p class="home-cred-tile__label">Firewall</p>
        <p class="home-cred-tile__value">Palo Alto</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create `_includes/home-cards.html`**

This uses Liquid to pull the most recent post and two secondary items. The featured card right column (CVE rows) is static placeholder content for Phase A.

```html
{% assign latest_post = site.posts | first %} {% assign explained_posts = site.explained | sort: 'date' | reverse %} {% assign explained_post =
explained_posts | first %} {% assign next_conf = site.data.cybersecurity_calendar | sort: 'start_date' | first %}

<div class="home-section-header">
  <span class="home-section-header__title">Latest Briefing</span>
  <a href="{{ '/blog/' | relative_url }}" class="home-section-header__link">All posts &rarr;</a>
</div>

<div class="home-priority-grid">
  <!-- Featured card -->
  <div class="home-priority-grid__featured">
    <div class="djb-card djb-card--featured">
      <div class="djb-card--featured-inner">
        <div>
          <span class="chip chip--news">CyberNews</span>
          <p class="djb-card__date mono">{{ latest_post.date | date: "%Y-%m-%d" }}</p>
          <p class="djb-card__title">{{ latest_post.title }}</p>
          <p class="djb-card__desc">{{ latest_post.description | default: latest_post.content | strip_html | truncatewords: 28 }}</p>
          <a href="{{ latest_post.url | relative_url }}" class="btn-djb-primary" style="margin-top: 14px; font-size: 0.78rem; padding: 7px 14px;"
            >Read briefing &rarr;</a
          >
        </div>
        <div>
          <!-- Phase A: static CVE placeholder. Phase B: pull from post front matter. -->
          <div class="cve-row">
            <div>Ivanti Connect Secure — RCE</div>
            <div class="cve-row__meta">EPSS 0.94 &middot; CVSS 9.8 &middot; KEV</div>
          </div>
          <div class="cve-row">
            <div>Fortinet FortiOS — Auth Bypass</div>
            <div class="cve-row__meta">EPSS 0.87 &middot; CVSS 9.1 &middot; KEV</div>
          </div>
          <div class="cve-row">
            <div>Palo Alto PAN-OS — DoS</div>
            <div class="cve-row__meta">EPSS 0.61 &middot; CVSS 7.5 &middot; KEV</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Secondary card: Explained -->
  {% if explained_post %}
  <div class="djb-card">
    <span class="chip chip--learn">Explained</span>
    <p class="djb-card__title">{{ explained_post.title }}</p>
    <p class="djb-card__desc">{{ explained_post.description | default: explained_post.content | strip_html | truncatewords: 20 }}</p>
    <a
      href="{{ explained_post.url | relative_url }}"
      class="home-section-header__link"
      style="display:inline-block; margin-top: 10px; font-size: 0.78rem;"
      >Read more &rarr;</a
    >
  </div>
  {% endif %}

  <!-- Secondary card: Calendar -->
  {% if next_conf %}
  <div class="djb-card">
    <span class="chip chip--calendar">Calendar</span>
    <p class="djb-card__title">{{ next_conf.name }}</p>
    <p class="djb-card__desc">
      {{ next_conf.city }}, {{ next_conf.state }} &middot; {{ next_conf.start_date | date: "%b %-d" }}–{{ next_conf.end_date | date: "%-d" }} &middot;
      Est. ${{ next_conf.total_cost_min | ceil }}–${{ next_conf.total_cost_max | ceil }} from Houston
    </p>
    <a
      href="{{ '/cybersecurity-calendar/' | relative_url }}"
      class="home-section-header__link"
      style="display:inline-block; margin-top: 10px; font-size: 0.78rem;"
      >Full calendar &rarr;</a
    >
  </div>
  {% endif %}
</div>
```

- [ ] **Step 3: Create `_includes/home-conferences.html`**

```html
{% assign upcoming = site.data.cybersecurity_calendar | sort: 'start_date' %} {% assign today = 'now' | date: '%Y-%m-%d' %} {% assign future_confs =
"" | split: "" %} {% for conf in upcoming %} {% if conf.start_date >= today %} {% assign future_confs = future_confs | push: conf %} {% endif %} {%
endfor %}

<div class="home-section-header">
  <span class="home-section-header__title">Upcoming Conferences</span>
  <a href="{{ '/cybersecurity-calendar/' | relative_url }}" class="home-section-header__link">Full calendar &rarr;</a>
</div>

<div class="home-conf-row">
  {% for conf in future_confs limit: 3 %}
  <div class="conf-card">
    <span class="conf-card__badge">{{ conf.start_date | date: "%b %-d" }}–{{ conf.end_date | date: "%-d" }}</span>
    <p class="conf-card__name">{{ conf.name }}</p>
    <p class="conf-card__location">{{ conf.city }}, {{ conf.state }}</p>
    <p class="conf-card__cost">
      ~${{ conf.total_cost_min | ceil }}–${{ conf.total_cost_max | ceil }} from HOU &middot; {{ conf.category_tags | first | capitalize }}
    </p>
  </div>
  {% endfor %}
</div>
```

- [ ] **Step 4: Verify build passes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

Note: build passes even if includes are not yet referenced by a layout — Jekyll compiles them when called.

- [ ] **Step 5: Commit**

```bash
git add _includes/home-hero.html _includes/home-cards.html _includes/home-conferences.html
git commit -m "feat: add homepage section includes (hero, cards, conferences)"
```

---

## Task 9: Home layout template + footer

**Files:**

- Create: `_layouts/home.liquid`
- Modify: `_includes/footer.liquid`

- [ ] **Step 1: Create `_layouts/home.liquid`**

This extends the existing `default` layout (which already handles `<head>`, scripts, and the navbar via `header.liquid`). It replaces the `about.liquid` content with our three includes.

```liquid
---
layout: default
---
{% include home-hero.html %}
{% include home-cards.html %}
{% include home-conferences.html %}

<footer class="home-footer" role="contentinfo">
  <div class="container home-footer__inner">
    <div>
      <p class="home-footer__brand">DJBSec</p>
      <p class="home-footer__tagline">Security intelligence, daily.</p>
    </div>
    <ul class="home-footer__links">
      <li><a href="{{ '/blog/' | relative_url }}">Blog</a></li>
      <li><a href="{{ '/cybersecurity-explained/' | relative_url }}">Explained</a></li>
      <li><a href="{{ '/blue-team/' | relative_url }}">Blue Team</a></li>
      <li><a href="{{ '/cybersecurity-calendar/' | relative_url }}">Calendar</a></li>
    </ul>
    <div class="home-footer__meta">
      CISSP &middot; 25+ yrs &middot; Houston, TX<br>
      &copy; {{ site.time | date: '%Y' }}
      {{ site.first_name }}
      {{ site.last_name }}
    </div>
  </div>
</footer>
```

Note: The home layout provides its own footer, so we need to suppress the default footer on the homepage. Add a front matter flag `hide_footer: true` and gate `footer.liquid` on it.

- [ ] **Step 2: Update `_includes/footer.liquid` to support suppression**

Wrap the entire existing footer content:

```liquid
{% unless page.hide_footer %}
  {% if site.footer_fixed %}
    <footer class="fixed-bottom" role="contentinfo">...existing content...</footer>
  {% else %}
    <footer class="sticky-bottom mt-5" role="contentinfo">...existing content...</footer>
  {% endif %}
{% endunless %}
```

- [ ] **Step 3: Verify build passes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add _layouts/home.liquid _includes/footer.liquid
git commit -m "feat: add home layout template and footer suppression flag"
```

---

## Task 10: Wire about.md to home layout

**Files:**

- Modify: `_pages/about.md`

- [ ] **Step 1: Update front matter and strip inline styles**

Replace the entire content of `_pages/about.md` with:

```yaml
---
layout: home
title: home
permalink: /
hide_footer: true
---
```

That's it — no body content. All homepage content is now rendered by the three includes in `home.liquid`. The inline styles from the original file are gone.

- [ ] **Step 2: Verify build passes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 3: Serve locally and check homepage**

```bash
bundle exec jekyll serve --livereload
```

Open http://localhost:4000 and verify:

- Hero shows with two columns (headline left, bio panel right)
- Latest Briefing section shows the most recent post
- Upcoming Conferences section shows 3 conference cards
- Dark footer appears
- No profile photo
- No inline styles in page source

- [ ] **Step 4: Check dark mode**

In browser devtools, set `html` attribute `data-theme="dark"` and verify colors switch correctly.

- [ ] **Step 5: Check existing pages are unaffected**

Visit http://localhost:4000/blog/, http://localhost:4000/blue-team/, http://localhost:4000/cybersecurity-calendar/ — all should render normally with updated accent color and fonts but unchanged layouts.

- [ ] **Step 6: Commit**

```bash
git add _pages/about.md
git commit -m "feat: switch homepage to home layout, remove inline styles"
```

---

## Task 11: Final verification + production build

- [ ] **Step 1: Production build**

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

Expected: no errors, no warnings about missing files.

- [ ] **Step 2: Verify no inline styles remain on homepage**

```bash
grep -n 'style="' _site/index.html | head -20
```

Expected: zero results (or only results from third-party includes outside our control).

- [ ] **Step 3: Verify font URLs in built output**

```bash
grep "fonts.googleapis" _site/index.html
```

Expected: one `<link>` tag referencing Playfair+Inter+IBM+Plex+Mono.

- [ ] **Step 4: Verify noreferrer in external links**

```bash
grep -o 'rel="[^"]*"' _site/index.html | sort -u | head -10
```

Expected: external link rel includes `noreferrer`.

- [ ] **Step 5: Verify footer_fixed is off**

```bash
grep -c "fixed-bottom" _site/index.html
```

Expected: `0`.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: homepage redesign — Clean Authority layout, design tokens, Playfair Display"
```

---

## Checklist summary

| Task | Description                                  | Status |
| ---- | -------------------------------------------- | ------ |
| 1    | Config: fonts, footer, external links        | ☐      |
| 2    | Design token file + main.scss imports        | ☐      |
| 3    | Token aliases in themes + variable updates   | ☐      |
| 4    | Typography styles                            | ☐      |
| 5    | Card component styles                        | ☐      |
| 6    | Home layout SCSS                             | ☐      |
| 7    | Navbar brand style                           | ☐      |
| 8    | Homepage includes (hero, cards, conferences) | ☐      |
| 9    | Home layout template + footer suppression    | ☐      |
| 10   | Wire about.md to home layout                 | ☐      |
| 11   | Final verification                           | ☐      |
