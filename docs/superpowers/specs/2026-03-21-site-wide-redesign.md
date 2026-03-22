# Site-Wide Redesign Spec

**Date:** 2026-03-21
**Branch:** newDesign
**Goal:** Bring all inner pages into alignment with the "Clean Authority" design language established on the homepage — calm, editorial, token-native — without disrupting the homepage or any JavaScript functionality.

---

## Design Principles

- **Same design language, lower density.** Inner pages share the homepage's tokens (Playfair Display, IBM Plex Mono, `--color-*` CSS custom properties) but use more breathing room and less visual density than the homepage.
- **Selective HTML refactor (Option B).** Pages where current markup limits the design (inline styles, `bg-*` Bootstrap colors, emoji headings) get targeted HTML rewrites. Pages with clean structure get CSS-only token alignment.
- **No JS changes.** Calendar, EPSS, and Explained page JavaScript is untouched. Only classes and CSS change.
- **Blog listing preserved.** The `.news-*` class structure stays; only token alignment applied.
- **Every class defined in a SCSS partial must appear literally in at least one HTML page file** — PurgeCSS scans `_site/**/*.html` and removes any selector whose name does not appear as a string in the rendered HTML.

---

## Foundation (pre-agent, sequential)

**Files:**
- New: `_sass/_page.scss`
- New (stub): `_sass/_learn.scss` — create as an empty file with a comment placeholder so the `main.scss` import does not break the build before Agent C fills it
- Modify: `_layouts/page.liquid`
- Modify: `assets/css/main.scss` — add `"learn"` to the `@import` list

**`page.liquid` changes:**
- Wrap the description line in a guard: `{% if page.description %}<p class="page-description">{{ page.description }}</p>{% endif %}` — prevents an empty `<p>` tag on pages with no `description` front matter (e.g., tools sub-pages)
- Add `.page-eyebrow` span above the `h1` if `page.eyebrow` front matter is set (optional — not required by every page)
- Add `<hr class="page-divider">` below the header block

**`_page.scss` styles:**
- `.post-title` — Playfair Display, weight 800, `--color-ink`, letter-spacing -0.02em
- `.page-eyebrow` — IBM Plex Mono, `--color-accent`, 0.68rem, uppercase, 0.14em tracking
- `.page-description` — `--color-ink-muted`, 0.95rem, line-height 1.6
- `.page-divider` — `1px solid var(--color-surface-border)`, margin `24px 0 40px`
- `.page-section-header` — matches `.home-section-header` pattern: flex, space-between, 2px bottom border in `--color-ink`, Playfair Display title
- `.learn-grid` — 2-column responsive grid, `gap: 16px`, collapses to 1 column below 640px (defined here, used by Group 3)
- `.chip--secondary` — neutral chip variant: `--color-surface-raised` background, `--color-ink-muted` text (used by all Learn sub-pages instead of per-category chip modifiers — avoids creating many new selectors that could be purged)

**Note on `main.scss` / `_learn.scss` ordering:** The pre-work step must create the `_learn.scss` stub AND add the import to `main.scss` in the same commit. Agent C then fills `_learn.scss` with real content. No agent other than the pre-work step touches `main.scss`.

---

## Group 1 — Content Pages

### Blog / News Listing (`_pages/blog.md`)

**Approach:** CSS token alignment only. `.news-*` structure preserved entirely.

- Masthead title: Playfair Display, `--color-ink`
- Tagline: `--color-ink-muted`
- Filter pills: active → `--color-accent` background, `#fff` text; inactive → `--color-surface-border` border, `--color-ink-muted` text
- Hero card: `--color-accent-subtle` background, `rgba(0, 87, 255, 0.2)` border (use literal rgba since CSS custom properties cannot be used inside `rgba()` without `rgb()` syntax in older browsers)
- Card titles: Playfair Display, weight 700
- Dates / read-time: IBM Plex Mono `.mono` class
- Category/tag badges: `.chip` pattern from `_typography.scss`
- All changes in existing `.news-*` SCSS rules; no new partial needed

### Cybersecurity Explained (`_pages/explained.md`)

**Approach:** SCSS-only update. The `.explained-item` element must remain an `<a>` tag — the `fixCorners()` JS function sets `borderRadius` via inline style on each `.explained-item` element and will break if the element type or class name changes. Do NOT add `djb-card` as an HTML class on `.explained-item`. Instead, apply `.djb-card`-equivalent styles directly to `.explained-item` in `_sass/_cybersecurity-calendar.scss` (or in a new rule block at the bottom of the existing explained SCSS section).

- `.explained-filter-btn` — replace custom styles with token-based pill: inactive uses `--color-surface-border` border + `--color-ink-muted` text; active uses `--color-accent` background + `#fff` text
- `.explained-item` — add `border: 1px solid var(--color-surface-border)`, `border-radius: 6px`, hover `border-color: var(--color-accent)` and `box-shadow: 0 2px 12px rgba(0,87,255,0.08)`
- `.explained-item__title` (or equivalent title element) — Playfair Display, weight 700
- `.explained-toolbar` count label — add `.eyebrow` class in the HTML
- JS (`filterExplained`, `toggleSort`, `fixCorners`) and all `data-cat` attributes: untouched

---

## Group 2 — Tool/Resource Pages

### Blue Team (`_pages/blue-team.md`)

**Approach:** Selective HTML refactor.

- H2 headings: remove emoji prefix, add `.eyebrow` span above each as a separate `<p>` element with the section category name
- Bootstrap table: remove `.table-dark` from `<thead>`; add `class="page-token-table"` to the `<table>`; badge column cells get `.chip` class replacing `badge bg-*`
- "In development" rows: remove badge, add `class="text-muted"` in italic
- 4-column Bootstrap card grid at bottom: replace each `<div class="card">` with `<div class="djb-card">`, move card title to a `<p class="djb-card__title">`, card body text to `<p class="djb-card__desc">`
- Add `.page-token-table` CSS in `_page.scss`: `thead { background: var(--color-surface-raised); color: var(--color-ink); }`, `td, th { border-color: var(--color-surface-border); }`

### Red Team (`_pages/red-team.md`)

**Approach:** Minimal — inline style removal only. Red Team has NO category card grid (unlike Blue Team). It has a single `<table>` with inline `style="background-color: #300; color: white;"` on the `<thead>` row and `style="border-bottom: 1px solid #944;"` on data rows.

- Remove all inline `style=""` attributes from the table
- Add `class="page-token-table"` to the `<table>` — the `.page-token-table` styles from `_page.scss` (see Blue Team above) handle the rest
- Do NOT add a card grid — there is none in the current page and none should be invented

### AI Tools & Prompts (`_pages/ai-tools-prompts.md`)

**Approach:** Selective HTML refactor. Note: the page has **four** Bootstrap cards, not three — the fourth is "Prompt Writing Tips" with `bg-warning text-dark`.

- All four Bootstrap cards: replace `<div class="card">` with `<div class="djb-card">`, remove `bg-danger/primary/info/warning` Bootstrap header classes
- Card headers: become `<p class="eyebrow">` label + `<h3>` title in Playfair Display
- Hardcoded `style="border-left: 4px solid #..."` → remove; add `border-left: 3px solid var(--color-accent)` via class or inline token var
- Tables inside cards: add `class="page-token-table"` for consistent token-based table styling

---

## Group 3 — Learn Sub-Pages (Full Redesign)

**Pages:** Books, Podcasts, Maps, Learning Platforms, Search Engines

**Approach:** Full HTML rebuild from plain markdown lists. Agent C reads each page's current content and section headings before rebuilding — do not invent content or restructure categories beyond what already exists in the page.

**`_sass/_learn.scss`** — Agent C fills this file. The stub was created by the pre-work step. All new class names defined here must appear literally in at least one of the five rebuilt page files (PurgeCSS requirement).

**Shared template pattern for all five pages:**
- Page header via `_page.scss` foundation (already handled by `page.liquid` + `_page.scss`)
- Resources grouped into sections using `.page-section-header` divider titles (matching the existing categories/headings in the current page)
- Each resource: `.djb-card` with Playfair title (`djb-card__title`), `--color-ink-muted` description (`djb-card__desc`), `.chip.chip--secondary` for type, link styled as `.home-section-header__link`
- Cards in `.learn-grid` (2-column responsive grid defined in `_page.scss`, collapses to 1 column below 640px)
- Use `.chip--secondary` (neutral, token-based) for all category chips — do not create per-category chip modifiers

**Per-page chip labels aligned to actual current content:**

| Page | Actual section headings (use these) | Chip label |
|---|---|---|
| **Books** (`cyber-books.md`) | Leadership Books / Story Books with Technical Backgrounds / Technical Books / Business Books | Leadership / Story / Technical / Business |
| **Podcasts** (`cyber-podcasts-.md`) | Read page to determine actual categories | Use `.chip--secondary` for format type |
| **Maps** (`cyber-maps.md`) | Read page to determine actual categories | Use `.chip--secondary` for map type |
| **Learning Platforms** (`cyber-learning-platforms.md`) | Read page to determine actual categories | Free / Paid / Freemium |
| **Search Engines** (`cybersecurity-search-engines.md`) | Read page to determine actual categories | OSINT / Vuln / Threat / Code |

**Agent C instruction:** Read each page fully before rebuilding. Preserve all existing links and content. Do not re-categorize content — map existing section headings to chip labels that fit naturally.

---

## Group 4 — JS Tool Pages

### EPSS (`_pages/epss.md` + `_includes/cve_lookup.html`)

**Approach:** Token alignment only — no JS changes, no layout changes.

- Input/button colors → `var(--color-*)` tokens
- Score displays → `--color-severity-critical`, `--color-severity-high`
- Buttons → `.btn-djb-primary` / `.btn-djb-secondary`

### Calendar (`_pages/cybersecurity-calendar.md` + `_sass/_cybersecurity-calendar.scss`)

**Approach:** Token alignment in `_cybersecurity-calendar.scss`. **Important:** The file already uses `--global-*` CSS custom property tokens (e.g., `--global-bg-color`, `--global-theme-color`) throughout — do NOT replace those. Only replace the small number of literal CSS hex values (e.g., `#fff` on text) that appear as raw property values. Do NOT touch SASS variable references like `$red-color`, `$blue-color`, `rgba($yellow-color, ...)` — those are SASS variables used in maps and must remain as-is or the build will fail.

- Replace literal `#` hex values in CSS property values with `var(--color-*)` equivalents where appropriate
- Filter bar inputs/dropdowns → `--color-surface-border` borders, `--color-accent` focus
- Grid view conference cards → add `.djb-card` hover treatment via CSS override
- Table view → `.page-token-table` treatment
- No JS changes

### Repositories (`_pages/repositories.md` + `_includes/repository/repo.liquid` + `repo_user.liquid`)

**Approach:** Token alignment + minimal HTML addition.

- Both `repo.liquid` and `repo_user.liquid` currently render only an `<img>` inside a `.repo` div with no styled container. To achieve card-like styling, wrap the `<img>` in a new `<div class="repo-card">` in each liquid file.
- `.repo-card` CSS in `_page.scss` (or a new `.repo-card` rule block): `background: var(--color-surface-raised)`, `border: 1px solid var(--color-surface-border)`, `border-radius: 6px`, `overflow: hidden`
- Grid gap → 16px via `.repositories-grid` or existing flex parent
- No Playfair on repo names — the OpenGraph images render the repo name as an image, there is no text title element to restyle

---

## Execution Plan

**Step 0 — Pre-work (sequential, before agents launch):**
1. Create `_sass/_learn.scss` stub (comment only)
2. Add `"learn"` to `@import` list in `assets/css/main.scss`
3. Create `_sass/_page.scss` with ALL styles it will ever need — including `.chip--secondary`, `.page-section-header`, `.learn-grid`, `.page-token-table`, `.page-divider`, and `.repo-card`. No agent writes to `_page.scss` after this point.
4. Update `_layouts/page.liquid`: guard `description` with `{% if page.description %}`, add `<hr class="page-divider">`
5. Run build to verify foundation compiles cleanly
6. Commit: `feat: add page foundation styles and _learn.scss stub`

**Step 1 — Parallel (4 sub-agents simultaneously after Step 0 commits):**

| Agent | Pages | SCSS files touched |
|---|---|---|
| A | `blog.md`, `explained.md` | existing `.news-*` rules, existing `.explained-*` rules only |
| B | `blue-team.md`, `red-team.md`, `ai-tools-prompts.md` | HTML only — all needed CSS already in `_page.scss` from Step 0 |
| C | `cyber-books.md`, `cyber-podcasts-.md`, `cyber-maps.md`, `cyber-learning-platforms.md`, `cybersecurity-search-engines.md` | `_learn.scss` only |
| D | `epss.md`, `cve_lookup.html`, `cybersecurity-calendar.md`, `_cybersecurity-calendar.scss`, `repositories.md`, `repo.liquid`, `repo_user.liquid` | `_cybersecurity-calendar.scss` only — all other CSS already in `_page.scss` from Step 0 |

**Each agent:**
1. Read assigned files fully before making changes
2. Make changes
3. Run `JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5` — must show `done in X seconds` with no errors
4. Commit with descriptive message on `newDesign` branch

**No shared file conflicts:** `main.scss` touched only in Step 0. `_page.scss` completed in Step 0 — no agent writes to it. Each agent works in separate files.

---

## Files Changed Summary

| File | Step | Change type |
|---|---|---|
| `_sass/_page.scss` | 0 only | New (complete — no agents write to this file) |
| `_sass/_learn.scss` | 0 stub, C fills | New |
| `_layouts/page.liquid` | 0 | Modify |
| `assets/css/main.scss` | 0 | Add `_learn` import |
| `_pages/blog.md` | A | CSS token align (SCSS only) |
| `_pages/explained.md` | A | SCSS + minimal class additions |
| `_pages/blue-team.md` | B | Selective HTML refactor |
| `_pages/red-team.md` | B | Inline style removal only |
| `_pages/ai-tools-prompts.md` | B | Selective HTML refactor (4 cards) |
| `_pages/cyber-books.md` | C | Full HTML rebuild |
| `_pages/cyber-podcasts-.md` | C | Full HTML rebuild |
| `_pages/cyber-maps.md` | C | Full HTML rebuild |
| `_pages/cyber-learning-platforms.md` | C | Full HTML rebuild |
| `_pages/cybersecurity-search-engines.md` | C | Full HTML rebuild |
| `_pages/epss.md` + `_includes/cve_lookup.html` | D | Token align |
| `_pages/cybersecurity-calendar.md` | D | Token align |
| `_sass/_cybersecurity-calendar.scss` | D | Token align (literals only) |
| `_pages/repositories.md` | D | Token align |
| `_includes/repository/repo.liquid` + `repo_user.liquid` | D | Add `repo-card` wrapper div |
