# DJBSec — Cybersecurity Site

[![deploy](https://github.com/DJBsec/djbsec.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/DJBsec/djbsec.github.io/actions/workflows/deploy.yml)

Source for **[djbsec.github.io](https://djbsec.github.io)** — a practical cybersecurity site built around guided learning paths, hands-on security tools, and daily threat news. Authored by DJBSec, an IT and security practitioner with 25+ years in the field.

The goal of the site is to turn real-world experience into useful material for distinct audiences: people new to security, blue team analysts, IT leaders, and small business owners.

## What's on the site

- **Start Here** — audience-specific learning paths (`/start/`) that route beginners, blue teamers, IT leaders, and small business owners through the right articles and tools.
- **Tools** — practical, client-side security tools (`/tools/`):
  - **EPSS Scanner** (`/epss/`) — EPSS exploit-probability scores for any CVE, with 30-day history and CISA KEV cross-reference.
  - **AI Plugin Radar** (`/plugins/`) — curated security dashboard for Claude Code and Codex plugins. Top GitHub repos, each read by Claude and risk-rated before you install.
  - Header Analyzer, IP Reputation, Hash Lookup, OSINT search, threat maps, and more.
- **Cybersecurity Explained** — short explainer articles (`_explained/`).
- **CyberNews** — daily security news posts (`_posts/`).
- **Blue Team / Red Team** — defender- and offense-focused resource hubs.

## Tech stack

Jekyll static site (based on the [al-folio](https://github.com/alshedivat/al-folio) theme, MIT), hosted on GitHub Pages.

- **Markdown:** Kramdown (GFM). Note: Kramdown does not render Markdown inside raw HTML blocks — keep content outside `<div>` wrappers or add `markdown="1"`.
- **Templating:** Liquid (`_layouts/`, `_includes/`).
- **Styling:** Bootstrap 4 + MDB, plus SASS in `_sass/`. Design tokens (light + dark) live in `_sass/_tokens.scss`. PurgeCSS strips unused selectors in production.
- **JS:** minified by jekyll-terser in production.

## Local development

```bash
bundle install                  # install Ruby dependencies
bundle exec jekyll serve        # serve at http://localhost:4000
JEKYLL_ENV=production bundle exec jekyll build   # production build
```

The CI pipeline additionally runs `purgecss` and `imagemagick` post-build; neither is required locally.

## Repository layout

| Path          | Purpose                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------- |
| `_config.yml` | Site settings, plugins, collections, library versions                                     |
| `_pages/`     | Navigable pages (Start Here, Tools, EPSS, AI Plugin Radar, …)                             |
| `_posts/`     | Daily CyberNews posts                                                                     |
| `_explained/` | Cybersecurity explainer articles                                                          |
| `_data/`      | Data driving pages — `tools.yml`, `learning_paths.yml`, `plugins.json`, etc.              |
| `_includes/`  | Liquid partials, including the interactive tools (`cve_lookup.html`, `plugin_radar.html`) |
| `_sass/`      | Styles and design tokens                                                                  |
| `plugin_sec/` | Offline scan + review pipeline that feeds the AI Plugin Radar                             |

## AI Plugin Radar pipeline

The `/plugins/` dashboard is data-driven. The scan and review pipeline runs offline (see [`plugin_sec/SETUP.md`](plugin_sec/SETUP.md)):

1. `scan.py` discovers and scores popular Claude Code / Codex repos via the GitHub API.
2. Claude reviews each repo's README and key files (skills, MCP configs, hooks, install scripts) and writes a risk verdict.
3. `python3 plugin_sec/export_site_data.py` merges the latest scan + reviews into `_data/plugins.json` (dropping the untrusted raw repo text).
4. Commit `_data/plugins.json` — the page rebuilds from it. No HTML editing required.

The verdicts are heuristic indicators and human-readable reviews, **not formal security audits** — always review code yourself before installing.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds the site and deploys `_site/` to GitHub Pages.

## Credits

Built on the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme by Maruan Al-Shedivat and contributors, available under the [MIT License](https://github.com/alshedivat/al-folio/blob/main/LICENSE).
