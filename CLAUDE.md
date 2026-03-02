# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Local development (serves at http://localhost:4000)
bundle exec jekyll serve

# Production build
bundle exec jekyll build

# Install Ruby dependencies
bundle install
```

The CI pipeline (`.github/workflows/deploy.yml`) also runs `purgecss` and `imagemagick` post-build, but those are not required locally.

## Architecture

This is a **Jekyll static site** using the [al-folio](https://github.com/alshedivat/al-folio) academic theme, hosted on GitHub Pages. Deployment is handled by GitHub Actions — pushes to `main` trigger a build and deploy the `_site/` output to GitHub Pages via `JamesIves/github-pages-deploy-action`.

### Templating & Rendering

- **Markdown parser**: Kramdown with GFM input. **Critical gotcha**: Kramdown does NOT render Markdown (headings, bold, lists) inside raw HTML blocks. Keep page content outside `<div>` wrappers, or add `markdown="1"` to the wrapper element.
- **Templates**: Liquid (`.liquid` files in `_layouts/` and `_includes/`)
- **CSS**: Bootstrap 4 + MDB (mdbootstrap), plus SASS in `_sass/`. Styles are compressed and PurgeCSS removes unused selectors in production.
- **JS**: Minified by jekyll-terser in production (`drop_console: true` is set).

### Navigation

Nav items are auto-generated from pages in `_pages/` with `nav: true` in front matter, sorted by `nav_order`. Current order:

| nav_order | Page                    |
| --------- | ----------------------- |
| 1         | Blog                    |
| 2         | Cybersecurity Explained |
| 3         | EPSS                    |
| 4         | AI Tools & Prompts      |
| 5         | Repositories            |
| 6         | Blue Team               |

### Collections

- `_posts/` — Daily CyberNews blog posts. Use `_posts/template.md` as a starting point. Front matter: `layout: post`, `tags: CyberNews`, `categories: News`, `thumbnail: assets/img/cybernews.webp`.
- `_explained/` — Short cybersecurity explainer articles. Front matter: `layout: page`, `category: explained`, `img: assets/img/projects/<name>.png`.
- `_news/` — Short news items (displayed on the about/home page).

### Key Files & Data

- `_config.yml` — All site settings: theme, plugins, collections, third-party library versions.
- `_data/repositories.yml` — GitHub repos shown on the Repositories page. Add/remove entries under `github_repos`.
- `_includes/cve_lookup.html` — The EPSS CVE lookup tool (client-side JS + external APIs).
- `_includes/repository/repo.liquid` / `repo_user.liquid` — Render GitHub repo/user cards using GitHub's OpenGraph CDN (`opengraph.githubassets.com/1/{owner}/{repo}`).
- `_pages/` — All navigable pages. Each is a standalone Markdown/HTML file with Liquid front matter.
- `assets/json/resume.json` — Resume data loaded by jekyll-get-json at build time.

### EPSS Tool (`_includes/cve_lookup.html`)

- Backend: Cloudflare Worker at `epss-worker.bsherrill676.workers.dev/get_epss` (POST with `{cve, date}`)
- EPSS history: `https://api.first.org/data/v1/epss?cve=<CVE>&scope=time-series` — data is at `response.data[0]["time-series"]`. The `?days=30` parameter returns empty data; use `?scope=time-series` instead.
- CISA KEV: fetched from `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json`
- Chart.js is loaded dynamically from CDN only when needed.

### Page Patterns

New nav pages follow this front matter structure:

```yaml
---
layout: page
title: Page Title
permalink: /page-slug/
description: Short description shown in meta/subtitle
nav: true
nav_order: N
---
```

Tool/resource pages (like Blue Team, AI Tools) use Bootstrap tables with `table-hover` and `table-dark` header for consistent styling. Cards use Bootstrap's `card` class with colored `card-header` (`bg-danger`, `bg-primary`, etc.).

## GSD Workflow (Task Management)

Use a simple GSD workflow stored in `.gsd/`:

- Backlog: `.gsd/backlog.md`
- Doing: `.gsd/doing.md`
- Done: `.gsd/done.md`

Rules:

1. When I ask you to plan work, create clear, small tasks in `backlog.md`.
2. When starting work, move exactly one task into `doing.md` and include:
   - branch name (must be `ai/<something>` or `feature/<something>`)
   - acceptance criteria
   - files you expect to change
3. When finished, move it to `done.md` with a short changelog and testing results.

Completion definition (required):

- `JEKYLL_ENV=production bundle exec jekyll build` passes.
- Summarize changed files and how to verify locally.

Safety:

- Work only on the current git branch. Never switch branches.
- Never push to `main`/`master` directly.
- Do not modify `Gemfile*`, `package*.json`, or `.github/workflows/*` unless explicitly asked.
