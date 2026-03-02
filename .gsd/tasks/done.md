# Done

## Site Infrastructure

- [x] Review full repo structure and understand how site is built (Jekyll + al-folio + GitHub Pages)
- [x] Create CLAUDE.md with architecture, commands, and key patterns

## Repositories Page

- [x] Fix broken images — replaced github-readme-stats.vercel.app (rate-limited) with GitHub OpenGraph CDN (`opengraph.githubassets.com`)
- [x] Remove GitHub profile trophies section entirely

## About Page

- [x] Rewrite home page intro for readability — added bold opener, "Who I Am" section, and "What You'll Find Here" Bootstrap cards

## AI Tools & Prompts Page

- [x] Create new `/ai-tools-prompts/` nav page (nav_order: 4)
- [x] Add DJBsec/ai_prompts repo content — Security, ChatGPT, Copilot folder sections with file links
- [x] Fix Kramdown rendering bug — removed outer `<div>` wrapper that prevented Markdown from rendering
- [x] Reorder sections: Security → ChatGPT → Copilot

## EPSS CVE Lookup Tool

- [x] Add CISA KEV status check (fetches live KEV catalog, cached per session)
- [x] Add 30-day EPSS trend chart (Chart.js, loaded dynamically)
- [x] Add Copy to Clipboard button
- [x] Add Recent Lookups chips (persisted in localStorage)
- [x] Fix trend chart API — changed `?days=30` (returns empty) to `?scope=time-series`, updated data path to `data[0]["time-series"]`
- [x] Reorder results display: EPSS → CVSS → CISA KEV → Vulnerability Details → Trend Chart

## AI Tools & Prompts Page

- [x] Fix broken M365 Security Advisor link — renamed file in ai_prompts repo and updated URL in `_pages/ai-tools-prompts.md` (`M365_Secuirty_Advisor.md` → `M365_Security_Advisor.md`)
- [x] Add "more coming" footer note to Copilot section — repo only has one file, note links to repo for updates

## Posts

- [x] Unpublish template.md — added `published: false` so Jekyll skips it during build; no longer appears in blog listing

## UI Improvements

- [x] Change site accent color to cyber blue — `$purple-color: #00bfff` in `_sass/_variables.scss`, cascades to all nav highlights, links, and hover states
- [x] EPSS terminal-style inputs — dark background, monospace font, cyan glow on focus, left-border accent on result sections and chart box
- [x] About page stats bar — 3-column row (25+ Years / CISSP / Daily) in monospace cyan between intro and "Who I Am"
- [x] About + AI Tools cards — replaced full Bootstrap `border-*` classes with left-only `4px` accent stripes per card color
- [x] Blue Team table — replaced "Coming Soon" badges with italic "In development" text; table rows now show cyan left accent on hover via `box-shadow`
- [x] Blog post dates — `.post-meta` in `.post-list` and `.post` now uses monospace font + `var(--global-theme-color)` (cyan)
- [x] CyberNews post list — left border hover accent with smooth transition on `.post-list li`
- [x] CyberNews post H2 headings — left cyan border + subtle background tint on `.post-content h2`
- [x] CyberNews post HR dividers — slim cyan-tinted rule on `.post-content hr`

## Config

- [x] Enable social icons in navbar — set `enable_navbar_social: true` in `_config.yml`

## Navigation

- [x] Add EPSS page to navbar at nav_order: 3 (before AI Tools & Prompts)
- [x] Shift subsequent pages: AI Tools (4), Repositories (5), Blue Team (6)
