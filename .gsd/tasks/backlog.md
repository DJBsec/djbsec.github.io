# Backlog

---

## Task 3 — About page credential/stats bar
**Priority:** Medium
The intro jumps straight to prose with no visual anchor. A stat row (25+ Years / CISSP / Daily News) communicates authority at a glance and uses `--global-theme-color` so it works in both light and dark mode.

**Files:** `_pages/about.md`
**Change:** Add a 3-column stat row between the intro paragraph and "Who I Am" section.
**Acceptance:** Stats row visible on home page, renders correctly in light and dark mode.

---

## Task 4 — Blue Team table row improvements
**Priority:** Medium
Row hover has no directional accent. "Coming Soon" badges look like abandoned placeholders.

**Files:** `_pages/blue-team.md`
**Changes:**
- Add left border accent on row hover via inline style or `_sass/_base.scss`
- Replace `<span class="badge bg-secondary">Coming Soon</span>` with italic "In development" text
**Acceptance:** Hovering a row shows a left accent stripe; Coming Soon rows look intentional rather than unfinished.

---

## Task 5 — Blog post dates in monospace
**Priority:** Low
Post dates use default styling. Monospace + theme color gives the CyberNews feed a terminal/news-ticker feel consistent with the cybersecurity brand.

**Files:** `_sass/_base.scss`
**Change:** Target `.post-meta` and `.post .date` with `font-family: 'Courier New', monospace` and `color: var(--global-theme-color)`.
**Acceptance:** Dates on blog listing and individual post pages render in monospace cyan.

---

## Task 6 — Replace full card borders with left-only accent stripe
**Priority:** Low
The "What You'll Find Here" cards on the about page and section cards on the AI Tools page use full Bootstrap border classes that look like default components. A left-only accent stripe is more editorial and less generic.

**Files:** `_pages/about.md`, `_pages/ai-tools-prompts.md`
**Change:** Replace `border-primary/success/info` card classes with `style="border-left: 4px solid <color>; border-top:none; border-right:none; border-bottom:none;"` per card.
**Acceptance:** Cards show only a left accent stripe in their respective colors.
