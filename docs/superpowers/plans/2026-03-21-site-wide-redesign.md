# Site-Wide Inner Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring all inner pages into alignment with the "Clean Authority" design language from the homepage — same tokens, calmer density — without touching any JavaScript.

**Architecture:** Step 0 builds the shared foundation (`_page.scss`, `_learn.scss` stub, `page.liquid` updates) in one sequential commit. Then 4 independent agent groups run in parallel, each working on separate files with no shared write conflicts. All verification uses `JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5` — must show `done in X seconds` with no errors.

**Tech Stack:** Jekyll 4, Liquid, SCSS/Sass (Dart Sass via jekyll-sass-converter), Bootstrap 4, CSS custom properties (`--color-*` tokens in `_sass/_tokens.scss`), PurgeCSS (CI only — all new class names must appear literally in HTML).

**Spec:** `docs/superpowers/specs/2026-03-21-site-wide-redesign.md`

**Branch:** `newDesign` — never push to main.

---

## File Map

| File                                     | Task | Change                                      |
| ---------------------------------------- | ---- | ------------------------------------------- |
| `_sass/_page.scss`                       | 0    | **Create** — all inner page shared styles   |
| `_sass/_learn.scss`                      | 0    | **Create stub** — empty, filled by Task C   |
| `_layouts/page.liquid`                   | 0    | Modify — guard description, add divider     |
| `assets/css/main.scss`                   | 0    | Modify — add `"page"` and `"learn"` imports |
| `_pages/blog.md`                         | A1   | Modify — token-align `.news-*` SCSS         |
| `_pages/explained.md`                    | A2   | Modify — token-align `.explained-*` SCSS    |
| `_pages/blue-team.md`                    | B1   | Modify — HTML refactor                      |
| `_pages/red-team.md`                     | B2   | Modify — remove inline styles               |
| `_pages/ai-tools-prompts.md`             | B3   | Modify — HTML refactor (4 cards)            |
| `_pages/cyber-books.md`                  | C1   | Full rebuild                                |
| `_pages/cyber-podcasts-.md`              | C2   | Full rebuild                                |
| `_pages/cyber-maps.md`                   | C3   | Full rebuild                                |
| `_pages/cyber-learning-platforms.md`     | C4   | Full rebuild                                |
| `_pages/cybersecurity-search-engines.md` | C5   | Full rebuild                                |
| `_pages/epss.md`                         | D1   | Token align — button classes                |
| `_includes/cve_lookup.html`              | D1   | Token align — colors and buttons            |
| `_pages/cybersecurity-calendar.md`       | D2   | Token align — filter bar inline styles      |
| `_sass/_cybersecurity-calendar.scss`     | D2   | Token align (literals only)                 |
| `_pages/repositories.md`                 | D3   | Token align — grid gap                      |
| `_includes/repository/repo.liquid`       | D3   | Add `repo-card` wrapper                     |
| `_includes/repository/repo_user.liquid`  | D3   | Add `repo-card` wrapper                     |

---

## Task 0: Foundation — Page Styles, Learn Stub, Layout Guard

**⚠️ Run this before launching any parallel agents. All groups depend on this commit.**

**Files:**

- Create: `_sass/_page.scss`
- Create: `_sass/_learn.scss`
- Modify: `_layouts/page.liquid`
- Modify: `assets/css/main.scss`

- [ ] **Step 1: Create `_sass/_page.scss`**

```scss
// _sass/_page.scss
// Shared styles for all layout: page inner pages.

// ── Page header ──────────────────────────────────────────────────────────────
.post-title {
  font-family: $font-display;
  font-weight: 800;
  color: var(--color-ink);
  letter-spacing: -0.02em;
}

.page-eyebrow {
  font-family: $font-mono;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-accent);
  display: block;
  margin-bottom: 8px;
}

.page-description {
  color: var(--color-ink-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

.page-divider {
  border: none;
  border-top: 1px solid var(--color-surface-border);
  margin: 24px 0 40px;
}

// ── Section header (matches .home-section-header pattern) ────────────────────
.page-section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-ink);
  padding-bottom: 8px;
  margin-bottom: 24px;
  margin-top: 48px;

  &__title {
    font-family: $font-display;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--color-ink);
    letter-spacing: -0.02em;
  }
}

// ── Token table (replaces Bootstrap .table-dark header) ──────────────────────
.page-token-table {
  width: 100%;

  thead tr {
    background: var(--color-surface-raised);
    color: var(--color-ink);
  }

  th,
  td {
    border-color: var(--color-surface-border) !important;
    color: var(--color-ink);
  }

  .badge {
    font-family: $font-mono;
    font-size: 0.6rem;
    letter-spacing: 0.06em;
    font-weight: 600;
  }
}

// ── Chip secondary (neutral, for Learn sub-pages) ────────────────────────────
// Used on Books, Podcasts, Maps, Platforms, Search Engines pages.
.chip--secondary {
  background: var(--color-surface-raised);
  color: var(--color-ink-muted);
  border: 1px solid var(--color-surface-border);
}

// ── Learn grid (2-col responsive card grid) ──────────────────────────────────
// Used by all 5 Learn sub-pages. Class name must appear in rebuilt HTML.
.learn-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

// ── Repo card wrapper ─────────────────────────────────────────────────────────
.repo-card {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-surface-border);
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: var(--color-accent);
  }

  img {
    width: 100%;
    display: block;
  }
}
```

- [ ] **Step 2: Create `_sass/_learn.scss` stub**

```scss
// _sass/_learn.scss
// Learn sub-page styles — filled by Task Group C.
// This stub exists so main.scss can import it before content is added.
```

- [ ] **Step 3: Update `_layouts/page.liquid`**

Replace the existing `<header class="post-header">...</header>` section with:

```liquid
<header class="post-header">
  {% if page.eyebrow -%}
    <span class="page-eyebrow">{{ page.eyebrow }}</span>
  {%- endif %}
  <h1 class="post-title">{{ page.title }}</h1>
  {% if page.description %}
    <p class="page-description">{{ page.description }}</p>
  {% endif %}
</header>
<hr class="page-divider">
```

The `{% if page.eyebrow %}` guard is required so `.page-eyebrow` appears in rendered HTML and survives PurgeCSS. Pages without `eyebrow:` front matter render nothing extra.

- [ ] **Step 4: Add `"page"` and `"learn"` imports to `assets/css/main.scss`**

Add both `"page"` and `"learn"` to the `@import` list after `"home"`:

```scss
  "home",
  "page",
  "learn"
```

**Both imports are required in this step.** Without `@import "page"`, all styles in `_page.scss` (`.page-divider`, `.page-token-table`, `.chip--secondary`, `.learn-grid`, `.repo-card`, etc.) will not be compiled into the output CSS.

- [ ] **Step 5: Verify build passes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

Expected: `done in X seconds` with no errors.

- [ ] **Step 6: Commit**

```bash
git add _sass/_page.scss _sass/_learn.scss _layouts/page.liquid assets/css/main.scss
git commit -m "feat: add page foundation styles, learn stub, and layout guard"
```

---

## Task A1: Blog / News — Token Alignment

**Approach:** SCSS only. Find the `.news-*` CSS rules (they live in `_pages/blog.md` inside `<style>` tags or in a separate SCSS partial — check first with `grep -r "news-hero-card\|news-filter" _sass/ _pages/`).

**Files:**

- Modify: wherever `.news-*` styles currently live (likely `_pages/blog.md` inline `<style>` or `_sass/_base.scss`)

- [ ] **Step 1: Locate news styles**

```bash
grep -r "news-hero-card\|news-masthead\|news-filter" /Users/ben/Documents/GitHub/djbsec.github.io/_sass/ /Users/ben/Documents/GitHub/djbsec.github.io/_pages/blog.md
```

- [ ] **Step 2: Apply token alignment**

Update the following in the news styles (wherever they live):

```scss
// Masthead
.news-masthead h1,
.news-masthead__title {
  font-family: $font-display;
  color: var(--color-ink);
}
.news-masthead__tagline {
  color: var(--color-ink-muted);
}

// Filter pills
.news-filter-btn {
  border: 1px solid var(--color-surface-border);
  color: var(--color-ink-muted);
  background: transparent;
  font-family: $font-mono;
  font-size: 0.72rem;
  &.active,
  &:hover {
    background: var(--color-accent);
    color: #fff;
    border-color: var(--color-accent);
  }
}

// Hero card
.news-hero-card {
  background: var(--color-accent-subtle);
  border: 1px solid rgba(0, 87, 255, 0.2);
}

// Card titles
.news-card__title,
.news-hero-card__title {
  font-family: $font-display;
  font-weight: 700;
  color: var(--color-ink);
}

// Dates / read-time
.news-card__meta,
.news-hero-card__meta {
  font-family: $font-mono;
  font-size: 0.68rem;
  color: var(--color-ink-muted);
}
```

- [ ] **Step 3: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add _pages/blog.md  # or whichever file was changed
git commit -m "feat: token-align blog/news listing styles"
```

---

## Task A2: Cybersecurity Explained — Token Alignment

**⚠️ Critical constraint:** `.explained-item` MUST remain an `<a>` tag. The `fixCorners()` JS function sets inline `borderRadius` on it. Do NOT add `djb-card` as an HTML class — apply card-like styles directly to `.explained-item` in SCSS.

**Files:**

- Modify: `_pages/explained.md` (the `<style>` block at top, or wherever explained CSS lives — find with `grep -r "explained-item" _sass/`)

- [ ] **Step 1: Locate explained styles**

```bash
grep -r "explained-item\|explained-filter" /Users/ben/Documents/GitHub/djbsec.github.io/_sass/ /Users/ben/Documents/GitHub/djbsec.github.io/_pages/explained.md | head -20
```

- [ ] **Step 2: Update filter buttons**

Replace current `.explained-filter-btn` styles:

```scss
.explained-filter-btn {
  font-family: $font-mono;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 5px 14px;
  border: 1px solid var(--color-surface-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-ink-muted);
  cursor: pointer;
  transition: all 0.15s ease;

  &.active,
  &:hover {
    background: var(--color-accent);
    color: #fff;
    border-color: var(--color-accent);
  }
}
```

- [ ] **Step 3: Apply card-like styles to `.explained-item`**

Add/update in the explained styles:

```scss
.explained-item {
  border: 1px solid var(--color-surface-border);
  border-radius: 6px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: var(--color-accent);
    box-shadow: 0 2px 12px rgba(0, 87, 255, 0.08);
  }
}

.explained-title {
  font-family: $font-display;
  font-weight: 700;
  color: var(--color-ink);
}

.explained-desc {
  color: var(--color-ink-muted);
}
```

- [ ] **Step 4: Add `.eyebrow` class to results count in `_pages/explained.md`**

Find the results meta paragraph:

```html
<p class="explained-results-meta" id="explained-meta"></p>
```

Add `eyebrow` class:

```html
<p class="explained-results-meta eyebrow" id="explained-meta"></p>
```

- [ ] **Step 5: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git commit -am "feat: token-align cybersecurity explained page styles"
```

---

## Task B1: Blue Team — HTML Refactor

**Files:**

- Modify: `_pages/blue-team.md`

- [ ] **Step 1: Remove emoji from H2 headings, convert to eyebrow + clean H2**

Replace:

```markdown
## 🛡️ What Is a Blue Teamer?
```

With:

```html
<p class="page-eyebrow">Overview</p>

## What Is a Blue Teamer?
```

Replace:

```markdown
## 🔵 Blue Team Toolset
```

With:

```html
<p class="page-eyebrow">Tools</p>

## Blue Team Toolset
```

Replace:

```markdown
## 📊 Tools by Category
```

With:

```html
<p class="page-eyebrow">Categories</p>

## Tools by Category
```

Replace:

```markdown
## 🚀 Quick Start Guide
```

With:

```html
<p class="page-eyebrow">Getting Started</p>

## Quick Start Guide
```

- [ ] **Step 2: Update table — remove `.table-dark`, add `.page-token-table`, convert badges to `.chip`**

Replace `<table class="table table-hover" ...>` and `<thead class="table-dark">`:

```html
<table class="table table-hover page-token-table" style="margin-top: 1rem;">
  <thead>
    <tr>
      <th style="width: 20%;">Tool</th>
      <th style="width: 50%;">Description</th>
      <th style="width: 15%;">Category</th>
      <th style="width: 15%;">Action</th>
    </tr>
  </thead>
</table>
```

Replace each `<span class="badge bg-primary">`, `<span class="badge bg-success">`, `<span class="badge bg-secondary">`, and `<span class="badge" style="background-color: #6c757d;">` with:

```html
<span class="chip chip--secondary">Vuln Mgmt</span>
<span class="chip chip--secondary">Web Security</span>
<span class="chip chip--secondary">Intel</span>
<span class="chip chip--secondary">Forensics</span>
```

(Use the appropriate label for each row — Vuln Mgmt, Intel, Web Security, Forensics, Visualization, Analysis.)

Remove emoji from `<th>` cells (Tool, Description, Category, Action — no emoji).

- [ ] **Step 3: Replace 4-column Bootstrap card grid with `.djb-card`**

Replace each `<div class="card h-100">` block:

```html
<div class="col-md-3 mb-3">
  <div class="card h-100">
    <div class="card-body text-center">
      <h5 class="card-title">🔍 Vulnerability Management</h5>
      <p class="card-text">...</p>
      <span class="badge bg-primary">1 Active</span>
    </div>
  </div>
</div>
```

With:

```html
<div class="col-md-3 mb-3">
  <div class="djb-card h-100">
    <p class="djb-card__title">Vulnerability Management</p>
    <p class="djb-card__desc">Tools for identifying, scoring, and prioritizing security vulnerabilities</p>
    <span class="chip chip--secondary">1 Active</span>
  </div>
</div>
```

Apply same pattern to all 4 category cards (Web Security, Threat Intelligence, Forensics & Analysis). Remove all emoji from card titles.

- [ ] **Step 4: Remove emoji from Quick Start list items**

Remove emoji prefixes from the numbered list items in the Quick Start Guide section.

- [ ] **Step 5: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git add _pages/blue-team.md
git commit -m "feat: refactor blue team page to design tokens and djb-card components"
```

---

## Task B2: Red Team — Inline Style Removal

**Files:**

- Modify: `_pages/red-team.md`

- [ ] **Step 1: Read the current file**

```bash
cat /Users/ben/Documents/GitHub/djbsec.github.io/_pages/red-team.md
```

- [ ] **Step 2: Remove inline styles from table, add `.page-token-table`**

Find the `<table>` element and:

- Remove `style="background-color: #300; color: white;"` from `<thead>` row
- Remove `style="border-bottom: 1px solid #944;"` from data rows
- Add `page-token-table` class to the `<table>` tag
- Remove emoji from `<th>` cells if present

- [ ] **Step 3: Remove any H2 emoji prefixes**

- [ ] **Step 4: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add _pages/red-team.md
git commit -m "feat: remove inline styles from red team page, apply token table"
```

---

## Task B3: AI Tools & Prompts — 4-Card HTML Refactor

**Files:**

- Modify: `_pages/ai-tools-prompts.md`

The page has 4 Bootstrap cards: Security (danger), ChatGPT (primary), Copilot (info), Prompt Tips (warning). Each gets converted to `.djb-card` with left accent border.

- [ ] **Step 1: Replace each Bootstrap card with `.djb-card`**

Pattern — replace each card like:

```html
<div class="card mb-5" style="border-left: 4px solid #dc3545; border-top: none; border-right: none; border-bottom: none;">
  <div class="card-header bg-danger text-white d-flex justify-content-between align-items-center py-3">
    <div>
      <h3 class="mb-1">🔐 Security Prompts</h3>
      <p class="mb-0" style="font-size: 0.9rem; opacity: 0.9;">...</p>
    </div>
    <a href="..." class="btn btn-light btn-sm" ...>📂 Browse Folder</a>
  </div>
  <div class="card-body p-0"></div>
</div>
```

With:

```html
<div class="djb-card mb-5" style="border-left: 3px solid var(--color-accent);">
  <div class="d-flex justify-content-between align-items-start mb-3">
    <div>
      <p class="eyebrow" style="margin-bottom: 4px;">Security</p>
      <h3 class="djb-card__title" style="margin-bottom: 4px;">Security Prompts</h3>
      <p class="djb-card__desc">Prompts built for cybersecurity professionals — M365 hardening, roadmaps, and security advisory</p>
    </div>
    <a href="..." class="btn-djb-secondary" style="white-space: nowrap; font-size: 0.75rem;" target="_blank" rel="noopener noreferrer"
      >Browse Folder</a
    >
  </div>
  <div></div>
</div>
```

Apply to all 4 cards. Use appropriate eyebrow labels: Security / ChatGPT / Copilot / Prompt Tips. Remove all emoji from headings and buttons.

- [ ] **Step 2: Update tables inside cards — add `.page-token-table`, remove `.table-secondary` from `<thead>`**

Each table's `<thead class="table-secondary">` becomes `<thead>` (the `.page-token-table` styles handle it). Add `page-token-table` to each `<table class="table table-hover mb-0">`.

- [ ] **Step 3: Close card divs correctly**

After removing `.card-body` and `.card-header` wrappers, ensure the closing `</div>` structure is correct — each card should be a single `<div class="djb-card mb-5">` wrapping all its content.

- [ ] **Step 4: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add _pages/ai-tools-prompts.md
git commit -m "feat: refactor ai tools page to djb-card components"
```

---

## Task C: Learn Sub-Pages — Full Rebuild

**⚠️ Key rules:**

- Every class defined in `_learn.scss` must appear literally in at least one page's HTML (PurgeCSS)
- Use `.chip.chip--secondary` for all chips (defined in `_page.scss` from Task 0)
- Use `.learn-grid` for card grids (defined in `_page.scss` from Task 0)
- Preserve ALL existing links exactly

### Task C1: Books (`_pages/cyber-books.md`)

Current sections: Leadership Books / Story Books with Technical Backgrounds / Technical Books / Business Books

- [ ] **Step 1: Rebuild `_pages/cyber-books.md`**

Replace all content after the front matter `---` with:

```html
<div class="page-section-header"><span class="page-section-header__title">Leadership</span></div>
<div class="learn-grid">
  <div class="djb-card">
    <span class="chip chip--secondary">Leadership</span>
    <p class="djb-card__title">Extreme Ownership</p>
    <p class="djb-card__desc">Jocko Willink & Leif Babin on taking total ownership of outcomes — essential reading for security leaders.</p>
    <a href="https://a.co/d/9Kf2jbM" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
</div>

<div class="page-section-header"><span class="page-section-header__title">Story Books</span></div>
<p class="page-description" style="margin-bottom: 16px;">Recommended reading order:</p>
<div class="learn-grid">
  <div class="djb-card">
    <span class="chip chip--secondary">Story</span>
    <p class="djb-card__title">The Cuckoo's Egg</p>
    <p class="djb-card__desc">Tracking a spy through the maze of computer espionage. The original cybersecurity thriller.</p>
    <a href="https://a.co/d/gO9putQ" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Story</span>
    <p class="djb-card__title">This Is How They Tell Me the World Ends</p>
    <p class="djb-card__desc">The cyberweapons arms race — Nicole Perlroth's definitive account of zero-day exploits and nation-state hacking.</p>
    <a href="https://a.co/d/0gfPwAO" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Story</span>
    <p class="djb-card__title">Ghost in the Wires</p>
    <p class="djb-card__desc">Kevin Mitnick's adventures as the world's most wanted hacker.</p>
    <a href="https://a.co/d/4l73HPp" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Story</span>
    <p class="djb-card__title">The Art of Invisibility</p>
    <p class="djb-card__desc">How to be safe in the age of Big Brother and Big Data — from the world's most famous hacker.</p>
    <a href="https://a.co/d/ckDUnlP" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Story</span>
    <p class="djb-card__title">Tracers in the Dark</p>
    <p class="djb-card__desc">The global hunt for the crime lords of cryptocurrency.</p>
    <a href="https://a.co/d/ioaNEUT" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Story</span>
    <p class="djb-card__title">Countdown to Zero Day</p>
    <p class="djb-card__desc">Stuxnet and the launch of the world's first digital weapon.</p>
    <a href="https://a.co/d/a9yDCpg" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Story</span>
    <p class="djb-card__title">Sandworm</p>
    <p class="djb-card__desc">A new era of cyberwar and the hunt for the Kremlin's most dangerous hackers.</p>
    <a href="https://a.co/d/2nupHH4" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Story</span>
    <p class="djb-card__title">Fancy Bear Goes Phishing</p>
    <p class="djb-card__desc">The dark history of the information age, told through five extraordinary hacks.</p>
    <a
      href="https://www.amazon.com/Fancy-Bear-Goes-Phishing-Extraordinary/dp/0374601178"
      class="home-section-header__link"
      target="_blank"
      rel="noopener noreferrer"
      >View on Amazon &rarr;</a
    >
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Story</span>
    <p class="djb-card__title">Scary Smart</p>
    <p class="djb-card__desc">The future of artificial intelligence and how you can save our world.</p>
    <a href="https://a.co/d/7YUY7bE" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
</div>

<div class="page-section-header"><span class="page-section-header__title">Technical</span></div>
<div class="learn-grid">
  <div class="djb-card">
    <span class="chip chip--secondary">Technical</span>
    <p class="djb-card__title">Understand, Manage, and Measure Cyber Risk</p>
    <p class="djb-card__desc">Ryan Leirvik's practical guide to creating a sustainable cyber program.</p>
    <a href="https://a.co/d/9VDVLzP" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Technical</span>
    <p class="djb-card__title">Building a Second Brain</p>
    <p class="djb-card__desc">A proven method to organize your digital life and unlock your creative potential.</p>
    <a href="https://a.co/d/2hD7l1K" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Technical</span>
    <p class="djb-card__title">Alice and Bob Learn Application Security</p>
    <p class="djb-card__desc">Approachable application security fundamentals for developers and security professionals.</p>
    <a href="https://a.co/d/6Y9576j" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Technical</span>
    <p class="djb-card__title">Cybersecurity Career Master Plan</p>
    <p class="djb-card__desc">Proven techniques and tips to help you advance in your cybersecurity career.</p>
    <a href="https://a.co/d/ime4jnr" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Technical</span>
    <p class="djb-card__title">The Tao of Open Source Intelligence</p>
    <p class="djb-card__desc">Comprehensive guide to OSINT techniques and methodologies.</p>
    <a href="https://a.co/d/6r1fJvM" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
</div>

<div class="page-section-header"><span class="page-section-header__title">Business</span></div>
<div class="learn-grid">
  <div class="djb-card">
    <span class="chip chip--secondary">Business</span>
    <p class="djb-card__title">The Phoenix Project</p>
    <p class="djb-card__desc">A novel about IT, DevOps, and helping your business win — the foundational DevOps story.</p>
    <a href="https://a.co/d/ebZ90xC" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Business</span>
    <p class="djb-card__title">Beyond the Phoenix Project</p>
    <p class="djb-card__desc">The origins and evolution of DevOps — the follow-up to The Phoenix Project.</p>
    <a href="https://a.co/d/3G2i5PJ" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Business</span>
    <p class="djb-card__title">The Unicorn Project</p>
    <p class="djb-card__desc">A novel about developers, digital disruption, and thriving in the age of data.</p>
    <a href="https://a.co/d/dkafgPm" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Business</span>
    <p class="djb-card__title">The Advantage</p>
    <p class="djb-card__desc">Why organizational health trumps everything else in business.</p>
    <a href="https://a.co/d/d3EYFZ9" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Business</span>
    <p class="djb-card__title">The 7 Habits of Highly Effective People</p>
    <p class="djb-card__desc">Powerful lessons in personal change — still the standard for personal effectiveness.</p>
    <a href="https://a.co/d/asvdDZz" class="home-section-header__link" target="_blank" rel="noopener noreferrer">View on Amazon &rarr;</a>
  </div>
</div>
```

- [ ] **Step 2: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add _pages/cyber-books.md
git commit -m "feat: rebuild cybersecurity books page with djb-card grid layout"
```

---

### Task C2: Podcasts (`_pages/cyber-podcasts-.md`)

The current page uses inline `<style>` with hardcoded `#0077b6`, `#333`, `#f9f9f9` and a Liquid-driven grid. Replace entirely.

- [ ] **Step 1: Remove inline `<style>` block, replace with token-native `.djb-card` grid**

Replace the entire page content after front matter with:

```html
<div class="learn-grid">
  {% assign podcasts = " 401 Access Denied|https://www.itpro.tv/podcast/401-access-denied|IT security topics explained for practitioners 7 Minute
  Security|https://7ms.us|Short practical security lessons — great for commutes 8th Layer Insights|https://8thlayerinsights.com|The human side of
  cybersecurity Absolute AppSec|https://absoluteappsec.com|Application security deep dives Breaking Down
  Security|https://brakeingsecurity.com|Security concepts and current news Click Here|https://clickhereshow.com|Investigative journalism on major
  security breaches Crypto-Gram Security Podcast|https://www.schneier.com/crypto-gram|Bruce Schneier's monthly security digest Cyber Security
  Headlines|https://cisoseries.com/cyber-security-headlines|Daily briefings from the CISO Series Darknet Diaries|https://darknetdiaries.com|True crime
  stories from the dark side of the internet Hacker Valley Studio|https://hackervalley.com|Cybersecurity leadership and career development Hacking
  Humans|https://thecyberwire.com/podcasts/hacking-humans|Social engineering and phishing awareness Malicious Life|https://malicious.life|The untold
  history of cybersecurity Risky Business|https://risky.biz|Weekly news and analysis with Patrick Gray Security
  Now|https://twit.tv/shows/security-now|Deep technical security dives with Steve Gibson Security Weekly|https://www.securityweekly.com|Industry news
  and practitioner interviews Simply Cyber|https://www.simplycyber.io|Cyber career development and skill building Smashing
  Security|https://www.smashingsecurity.com|A lighthearted take on security news The Cyberlaw
  Podcast|https://www.lawfareblog.com/topic/cyberlaw-podcast|Lawfare's analysis of cyberlaw and policy The Hacker
  Mind|https://thehackermind.com|Stories and interviews from the hacker community The Privacy, Security, & OSINT
  Show|https://inteltechniques.com/podcast.html|Privacy, security, and OSINT techniques Unsupervised
  Learning|https://danielmiessler.com/podcast|Daniel Miessler's weekly curated security insights " | split: " " %} {% for line in podcasts %} {%
  assign parts = line | split: "|" %} {% if parts[0] != "" %}
  <div class="djb-card">
    <span class="chip chip--secondary">Podcast</span>
    <p class="djb-card__title">{{ parts[0] }}</p>
    <p class="djb-card__desc">{{ parts[2] }}</p>
    <a href="{{ parts[1] }}" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Listen &rarr;</a>
  </div>
  {% endif %} {% endfor %}
</div>
```

- [ ] **Step 2: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add _pages/cyber-podcasts-.md
git commit -m "feat: rebuild podcasts page with token-native djb-card grid"
```

---

### Task C3: Maps (`_pages/cyber-maps.md`)

Current: inline-styled table with `style="background-color: #222; color: white;"` header.

- [ ] **Step 1: Replace inline-styled table with `.djb-card` grid**

Replace all content after front matter with:

```html
<p class="page-description">
  Live threat visualizations from leading cybersecurity vendors — DDoS activity, global attack sources, botnet flows, and more.
</p>

<div class="learn-grid">
  <div class="djb-card">
    <span class="chip chip--secondary">Threat Map</span>
    <p class="djb-card__title">Akamai Real-Time Web Monitor</p>
    <p class="djb-card__desc">Real-time internet conditions including web traffic and attack trends.</p>
    <a
      href="https://www.akamai.com/us/en/resources/visualizing-akamai/real-time-web-monitor.jsp"
      class="home-section-header__link"
      target="_blank"
      rel="noopener noreferrer"
      >Visit &rarr;</a
    >
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Threat Map</span>
    <p class="djb-card__title">BitDefender Threat Map</p>
    <p class="djb-card__desc">Live cyber threat visualizations across the globe.</p>
    <a href="https://threatmap.bitdefender.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Threat Map</span>
    <p class="djb-card__title">Check Point Threat Map</p>
    <p class="djb-card__desc">Real-time cyberattacks detected by Check Point sensors worldwide.</p>
    <a href="https://threatmap.checkpoint.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">DDoS</span>
    <p class="djb-card__title">Digital Attack Map</p>
    <p class="djb-card__desc">Google-backed DDoS attack trends using Arbor Networks data.</p>
    <a href="https://www.digitalattackmap.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Threat Map</span>
    <p class="djb-card__title">FortiGuard Threat Map</p>
    <p class="djb-card__desc">Cyberattacks blocked by Fortinet devices globally.</p>
    <a href="https://threatmap.fortiguard.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Threat Map</span>
    <p class="djb-card__title">Kaspersky Cybermap</p>
    <p class="djb-card__desc">Real-time threat detection visualization from Kaspersky Labs.</p>
    <a href="https://cybermap.kaspersky.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">DDoS</span>
    <p class="djb-card__title">Netscout Arbor DDoS</p>
    <p class="djb-card__desc">Data-driven DDoS and attack analytics from Netscout.</p>
    <a href="https://www.netscout.com/arbor-ddos?lang=en" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">DDoS</span>
    <p class="djb-card__title">TrendMicro Botnet Map</p>
    <p class="djb-card__desc">Botnet command and control activity around the world.</p>
    <a
      href="https://emea.trendmicro.com/us/security-intelligence/current-threat-activity/global-botnet-map/index.html"
      class="home-section-header__link"
      target="_blank"
      rel="noopener noreferrer"
      >Visit &rarr;</a
    >
  </div>
</div>

<p style="margin-top: 2rem;"><a href="/blue-team/" class="home-section-header__link">&larr; Back to Blue Team Tools</a></p>
```

- [ ] **Step 2: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add _pages/cyber-maps.md
git commit -m "feat: rebuild cybersecurity maps page with djb-card grid"
```

---

### Task C4: Learning Platforms (`_pages/cyber-learning-platforms.md`)

Current: plain markdown list with no descriptions or categories.

- [ ] **Step 1: Rebuild with `.djb-card` grid**

Replace all content after front matter with:

```html
<div class="learn-grid">
  <div class="djb-card">
    <span class="chip chip--secondary">Free</span>
    <p class="djb-card__title">OverTheWire</p>
    <p class="djb-card__desc">Wargames to learn and practice security concepts in a fun, game-like environment.</p>
    <a href="https://overthewire.org/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Freemium</span>
    <p class="djb-card__title">TryHackMe</p>
    <p class="djb-card__desc">Beginner-friendly guided learning paths and hands-on labs for all skill levels.</p>
    <a href="https://tryhackme.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Freemium</span>
    <p class="djb-card__title">Hack The Box</p>
    <p class="djb-card__desc">Penetration testing labs and real-world hacking challenges for intermediate to advanced practitioners.</p>
    <a href="https://www.hackthebox.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Free</span>
    <p class="djb-card__title">PortSwigger Web Security Academy</p>
    <p class="djb-card__desc">Free, comprehensive web security training from the makers of Burp Suite.</p>
    <a href="https://portswigger.net/web-security" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Paid</span>
    <p class="djb-card__title">TCM Security Academy</p>
    <p class="djb-card__desc">Affordable, practical cybersecurity courses built by practitioners for practitioners.</p>
    <a href="https://academy.tcm-sec.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Freemium</span>
    <p class="djb-card__title">Cybrary</p>
    <p class="djb-card__desc">Career-focused cybersecurity training with certification prep and skill assessments.</p>
    <a href="https://www.cybrary.it/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Paid</span>
    <p class="djb-card__title">PentesterLab</p>
    <p class="djb-card__desc">Hands-on web application security training with real vulnerability exercises.</p>
    <a href="https://pentesterlab.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Free</span>
    <p class="djb-card__title">VulnHub</p>
    <p class="djb-card__desc">Free downloadable vulnerable VMs for offline practice and CTF-style challenges.</p>
    <a href="https://www.vulnhub.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Freemium</span>
    <p class="djb-card__title">CyberSecLabs</p>
    <p class="djb-card__desc">Beginner-friendly labs focused on real-world penetration testing scenarios.</p>
    <a href="https://www.cyberseclabs.co.uk/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Free</span>
    <p class="djb-card__title">Root Me</p>
    <p class="djb-card__desc">500+ security challenges across web, network, forensics, and cryptography.</p>
    <a href="https://www.root-me.org/en/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Freemium</span>
    <p class="djb-card__title">RangeForce</p>
    <p class="djb-card__desc">Cloud-based cybersecurity training platform with hands-on skill development modules.</p>
    <a href="https://www.rangeforce.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Paid</span>
    <p class="djb-card__title">Certified Secure</p>
    <p class="djb-card__desc">European security training platform with hands-on labs and certification paths.</p>
    <a href="https://www.certifiedsecure.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
</div>
```

- [ ] **Step 2: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add _pages/cyber-learning-platforms.md
git commit -m "feat: rebuild learning platforms page with djb-card grid"
```

---

### Task C5: Search Engines (`_pages/cybersecurity-search-engines.md`)

Current: inline-styled table with `style="background-color: #222; color: white;"` header.

- [ ] **Step 1: Replace with `.djb-card` grid**

Replace all content after front matter with:

```html
<p class="page-description">Internet-wide scan platforms, threat intelligence engines, and OSINT databases.</p>

<div class="learn-grid">
  <div class="djb-card">
    <span class="chip chip--secondary">OSINT</span>
    <p class="djb-card__title">Shodan</p>
    <p class="djb-card__desc">Search exposed devices connected to the internet — the de facto standard for attack surface discovery.</p>
    <a href="https://www.shodan.io/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">OSINT</span>
    <p class="djb-card__title">Censys</p>
    <p class="djb-card__desc">Assess attack surfaces of internet-connected devices and services.</p>
    <a href="https://censys.io/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Threat Intel</span>
    <p class="djb-card__title">GreyNoise</p>
    <p class="djb-card__desc">Contextualizes background noise from internet-wide scanning — filters signal from the noise.</p>
    <a href="https://www.greynoise.io/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Vuln</span>
    <p class="djb-card__title">Vulners</p>
    <p class="djb-card__desc">Vulnerability search engine with CVE indexing and exploit tracking.</p>
    <a href="https://vulners.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Threat Intel</span>
    <p class="djb-card__title">Pulsedive</p>
    <p class="djb-card__desc">Threat intelligence feeds, enrichment, and community-sourced IOC searches.</p>
    <a href="https://pulsedive.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">OSINT</span>
    <p class="djb-card__title">IntelligenceX</p>
    <p class="djb-card__desc">Search Tor, data leaks, domains, emails, and historical internet records.</p>
    <a href="https://intelx.io/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">OSINT</span>
    <p class="djb-card__title">Hunter</p>
    <p class="djb-card__desc">Find and verify email addresses associated with any domain.</p>
    <a href="https://hunter.io/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">OSINT</span>
    <p class="djb-card__title">URLScan</p>
    <p class="djb-card__desc">Scan and analyze websites — inspect behavior, resources, and outbound connections.</p>
    <a href="https://urlscan.io/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">OSINT</span>
    <p class="djb-card__title">GrayHatWarfare</p>
    <p class="djb-card__desc">Search publicly exposed Amazon S3 buckets for accidental data exposure.</p>
    <a href="https://grayhatwarfare.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Threat Intel</span>
    <p class="djb-card__title">LeakIX</p>
    <p class="djb-card__desc">Search exposed services and publicly indexed sensitive data.</p>
    <a href="https://leakix.net/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">OSINT</span>
    <p class="djb-card__title">crt.sh</p>
    <p class="djb-card__desc">Search certificates logged by Certificate Transparency — great for subdomain discovery.</p>
    <a href="https://crt.sh/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">OSINT</span>
    <p class="djb-card__title">Netlas</p>
    <p class="djb-card__desc">Search and monitor external internet-facing assets and attack surfaces.</p>
    <a href="https://netlas.io/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Threat Intel</span>
    <p class="djb-card__title">Binary Edge</p>
    <p class="djb-card__desc">Scans the internet for threat intelligence and exposes attack surface data.</p>
    <a href="https://www.binaryedge.io/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">Code</span>
    <p class="djb-card__title">Grep App</p>
    <p class="djb-card__desc">Search across open-source GitHub repositories for code patterns and secrets.</p>
    <a href="https://grep.app/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">OSINT</span>
    <p class="djb-card__title">PublicWWW</p>
    <p class="djb-card__desc">Search websites by HTML, JavaScript, and CSS source code fingerprints.</p>
    <a href="https://publicwww.com/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
  <div class="djb-card">
    <span class="chip chip--secondary">OSINT</span>
    <p class="djb-card__title">ZoomEye</p>
    <p class="djb-card__desc">Internet-wide scanner for threat research and device fingerprinting.</p>
    <a href="https://www.zoomeye.org/" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Visit &rarr;</a>
  </div>
</div>

<p style="margin-top: 2rem;"><a href="/blue-team/" class="home-section-header__link">&larr; Back to Blue Team Tools</a></p>
```

- [ ] **Step 2: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add _pages/cybersecurity-search-engines.md
git commit -m "feat: rebuild cybersecurity search engines page with djb-card grid"
```

---

### Task C6: Commit `_learn.scss`

After all 5 pages are rebuilt, add any page-specific overrides discovered during implementation to `_learn.scss`. Even if empty, this confirms the stub is intentional.

- [ ] **Step 1: Update `_sass/_learn.scss` with any discovered overrides, or confirm stub is correct**

- [ ] **Step 2: Final build verification**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add _sass/_learn.scss
git commit -m "feat: finalize _learn.scss for learn sub-pages"
```

---

## Task D1: EPSS — Token Alignment

**Files:**

- Modify: `_pages/epss.md`
- Modify: `_includes/cve_lookup.html`

- [ ] **Step 1: Read both files**

```bash
cat /Users/ben/Documents/GitHub/djbsec.github.io/_pages/epss.md
head -100 /Users/ben/Documents/GitHub/djbsec.github.io/_includes/cve_lookup.html
```

- [ ] **Step 2: Update `_pages/epss.md` — replace Bootstrap button classes**

Find any `<button class="btn btn-primary">` or `<button class="btn btn-outline-*">` in the page file and replace:

- `btn btn-primary` → `btn-djb-primary`
- `btn btn-outline-primary` → `btn-djb-secondary`

- [ ] **Step 3: Update `_includes/cve_lookup.html` — replace hardcoded colors**

Find any `style="..."` attributes or `<style>` blocks with hardcoded hex colors (`#dc2626`, `#d97706`, etc.) and replace with:

- Critical severity → `var(--color-severity-critical)`
- High severity → `var(--color-severity-high)`
- Accent/primary → `var(--color-accent)`
- Surface → `var(--color-surface)`
- Border → `var(--color-surface-border)`

Replace any Bootstrap button classes with `btn-djb-primary` / `btn-djb-secondary` as in Step 2.

**Do NOT touch any JavaScript in this file.**

- [ ] **Step 4: Verify build — no JS changes**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add _pages/epss.md _includes/cve_lookup.html
git commit -m "feat: token-align EPSS CVE lookup tool colors and buttons"
```

---

## Task D2: Calendar — Token Alignment

**⚠️ Critical:** Only replace literal CSS hex values. Do NOT touch SASS variable references like `$red-color`, `$blue-color`, `$cat-colors` map, or `rgba($yellow-color, ...)` expressions.

**Files:**

- Modify: `_pages/cybersecurity-calendar.md`
- Modify: `_sass/_cybersecurity-calendar.scss`

- [ ] **Step 1: Read `_pages/cybersecurity-calendar.md` and remove any inline styles**

```bash
cat /Users/ben/Documents/GitHub/djbsec.github.io/_pages/cybersecurity-calendar.md
```

Find any `style="..."` attributes on filter bar `<input>` or `<select>` elements in the page file. Replace hardcoded colors with token-based CSS classes or remove the inline styles (the `_cybersecurity-calendar.scss` handles those elements via class selectors). If there are no inline styles in the page file, skip to Step 2.

- [ ] **Step 2: Identify literal hex values to replace in `_cybersecurity-calendar.scss`**

```bash
grep -n "#[0-9a-fA-F]\{3,6\}" /Users/ben/Documents/GitHub/djbsec.github.io/_sass/_cybersecurity-calendar.scss | grep -v "\\$" | head -30
```

- [ ] **Step 2: Replace safe literal hex values**

Review each match. Replace only those that are plain CSS property values (backgrounds, borders, text colors) NOT inside SASS variable assignments or maps. Typical safe replacements:

```scss
// Input/select borders
border: 1px solid #ccc → border: 1px solid var(--color-surface-border)
background: #fff       → background: var(--color-surface)
color: #333            → color: var(--color-ink)
color: #666            → color: var(--color-ink-muted)
```

Leave untouched: `$red-color: #...`, `$blue-color: #...`, `rgba($yellow-color, ...)`, and any hex inside SASS maps.

- [ ] **Step 4: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add _pages/cybersecurity-calendar.md _sass/_cybersecurity-calendar.scss
git commit -m "feat: token-align calendar SCSS literal colors"
```

---

## Task D3: Repositories — Token Align + `repo-card` Wrapper

**Files:**

- Modify: `_pages/repositories.md`
- Modify: `_includes/repository/repo.liquid`
- Modify: `_includes/repository/repo_user.liquid`

- [ ] **Step 1: Read all three files**

```bash
cat /Users/ben/Documents/GitHub/djbsec.github.io/_pages/repositories.md
cat /Users/ben/Documents/GitHub/djbsec.github.io/_includes/repository/repo.liquid
cat /Users/ben/Documents/GitHub/djbsec.github.io/_includes/repository/repo_user.liquid
```

- [ ] **Step 2: Update `_pages/repositories.md` — adjust grid gap**

Find the repo grid container (likely a `<div>` with a flex/grid class). Add or update its style to set `gap: 16px` via `.repositories-grid` or the existing flex parent class. If the page uses only the include tags with no wrapping container markup, this step may be a no-op — check the page source first.

- [ ] **Step 2: Wrap image in `.repo-card` div in `repo.liquid`**

Wherever the `<img>` tag renders (likely inside a `.repo` div), wrap it:

```html
<div class="repo-card">
  <img ... />
</div>
```

- [ ] **Step 3: Apply same wrapper in `repo_user.liquid`**

- [ ] **Step 4: Verify build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git add _pages/repositories.md _includes/repository/repo.liquid _includes/repository/repo_user.liquid
git commit -m "feat: add repo-card wrapper to repository includes"
```

---

## Parallel Execution Summary

After Task 0 commits:

| Agent | Tasks      | Files touched                                                                                                                                                          |
| ----- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** | A1, A2     | `_pages/blog.md` SCSS, `_pages/explained.md` SCSS                                                                                                                      |
| **B** | B1, B2, B3 | `_pages/blue-team.md`, `_pages/red-team.md`, `_pages/ai-tools-prompts.md`                                                                                              |
| **C** | C1–C6      | 5 `_pages/cyber-*.md` files, `_sass/_learn.scss`                                                                                                                       |
| **D** | D1, D2, D3 | `_pages/epss.md`, `_includes/cve_lookup.html`, `_pages/cybersecurity-calendar.md`, `_sass/_cybersecurity-calendar.scss`, `_pages/repositories.md`, 2 repo liquid files |

No agent writes to a file another agent writes to.
