#!/usr/bin/env python3
"""
claude-code-radar / scan.py

Discovers popular GitHub repos related to Claude Code, classifies them,
summarizes them, and assigns a HEURISTIC RISK SCORE (not a security guarantee).

Outputs a single JSON file (data-YYYY-MM-DD.json) that build_html.py turns into
the interactive page. Designed to be called by a Claude Cowork scheduled task.

Auth: reads a GitHub token from the GITHUB_TOKEN environment variable.
      A read-only / public-repo fine-grained token is plenty.
      Without a token you get 60 req/hr; with one you get 5000 req/hr.
"""

import base64
import datetime as dt
import json
import os
import re
import sys
import time
from urllib.parse import quote

import requests

GITHUB_API = "https://api.github.com"
TOKEN = os.environ.get("GITHUB_TOKEN", "").strip()

# Anchor output paths to this script's folder so the scan works regardless of
# the directory the scheduled task happens to run from. JSON goes in ./json.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_DIR = os.path.join(SCRIPT_DIR, "json")

# Search queries cast a wide net across the Claude Code ecosystem.
SEARCH_QUERIES = [
    "claude code",
    "claude-code skills",
    "claude code mcp server",
    "claude code subagents",
    "claude code plugin",
    "claude code commands",
    "claude code hooks",
    "awesome claude code",
]

PER_QUERY = 30          # results pulled per query before dedup
MIN_STARS = 5           # ignore noise below this for the popularity pass
MAX_REPOS_DEEP_SCAN = 60  # cap deep analysis to stay within rate limits

# "Fresh" pass: catch brand-new repos that aren't popular enough yet to rank in
# the star-sorted search. We query the same topics restricted to repos created
# in the last FRESH_WINDOW_DAYS and drop the star floor so new projects show up.
FRESH_WINDOW_DAYS = 14
FRESH_MIN_STARS = 0
# Newly-discovered repos (not in the known index) are guaranteed a deep scan
# even if they fall below the star cap — up to this many extra per run.
MAX_NEW_EXTRA = 40

# Review content limits. scan.py embeds README + high-signal file contents into
# the data JSON so the Cowork session can assess each repo without re-fetching.
# NOTE: fetching key files adds GitHub API calls per repo — a GITHUB_TOKEN is
# effectively required now (the 60 req/hr unauthenticated limit won't be enough).
REVIEW_README_CHARS = 6000
REVIEW_SNIPPET_CHARS = 2500
REVIEW_MAX_FILES = 6

# Persistent index of every repo ever seen, so each run can flag what's new.
KNOWN_INDEX = os.path.join(JSON_DIR, "known_repos.json")


# --------------------------------------------------------------------------- #
# HTTP helpers
# --------------------------------------------------------------------------- #
def gh_headers():
    h = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "claude-code-radar",
    }
    if TOKEN:
        h["Authorization"] = f"Bearer {TOKEN}"
    return h


def gh_get(url, params=None):
    """GET with basic rate-limit awareness and retry."""
    for attempt in range(4):
        r = requests.get(url, headers=gh_headers(), params=params, timeout=30)
        if r.status_code == 403 and "rate limit" in r.text.lower():
            reset = int(r.headers.get("X-RateLimit-Reset", time.time() + 60))
            wait = max(5, reset - int(time.time()) + 2)
            print(f"  rate-limited, sleeping {wait}s", file=sys.stderr)
            time.sleep(min(wait, 90))
            continue
        if r.status_code == 404:
            return None
        if r.status_code >= 400:
            print(f"  HTTP {r.status_code} for {url}", file=sys.stderr)
            return None
        return r
    return None


# --------------------------------------------------------------------------- #
# Discovery
# --------------------------------------------------------------------------- #
def discover(min_stars=MIN_STARS, created_since=None, sort="stars"):
    """Run the topical searches and return {full_name: repo_item}.

    Pass created_since="YYYY-MM-DD" to restrict to recently-created repos (the
    "fresh" pass); leave it None for the standard popularity pass.
    """
    seen = {}
    for q in SEARCH_QUERIES:
        qq = f"{q} created:>={created_since}" if created_since else q
        print(f"Searching: {qq}", file=sys.stderr)
        r = gh_get(
            f"{GITHUB_API}/search/repositories",
            params={"q": qq, "sort": sort, "order": "desc", "per_page": PER_QUERY},
        )
        if not r:
            continue
        for item in r.json().get("items", []):
            if item["stargazers_count"] < min_stars:
                continue
            seen[item["full_name"]] = item  # dedup by full_name
        time.sleep(1)  # be polite to the search API
    return seen


# --------------------------------------------------------------------------- #
# Per-repo content fetch
# --------------------------------------------------------------------------- #
def get_readme(full_name):
    r = gh_get(f"{GITHUB_API}/repos/{full_name}/readme")
    if not r:
        return ""
    data = r.json()
    if data.get("encoding") == "base64":
        try:
            return base64.b64decode(data["content"]).decode("utf-8", "ignore")
        except Exception:
            return ""
    return ""


def get_tree(full_name, default_branch):
    r = gh_get(
        f"{GITHUB_API}/repos/{full_name}/git/trees/{default_branch}",
        params={"recursive": "1"},
    )
    if not r:
        return []
    return [t["path"] for t in r.json().get("tree", []) if t["type"] == "blob"]


def get_file_content(full_name, path, branch):
    r = gh_get(
        f"{GITHUB_API}/repos/{full_name}/contents/{quote(path)}",
        params={"ref": branch},
    )
    if not r:
        return ""
    data = r.json()
    if isinstance(data, dict) and data.get("encoding") == "base64":
        try:
            return base64.b64decode(data["content"]).decode("utf-8", "ignore")
        except Exception:
            return ""
    return ""


def _review_priority(path):
    """Lower number = more important to feed the reviewer. These are the files
    that actually execute or get loaded into an agent's context."""
    p = path.lower()
    b = os.path.basename(p)
    if b == "skill.md":
        return 0
    if b == ".mcp.json" or p.endswith(".mcp.json") or b == "plugin.json":
        return 1
    if "/hooks/" in p or p.startswith("hooks/") or "hook" in b:
        return 2
    if b.startswith("install") or p.endswith((".sh", ".ps1")):
        return 3
    if b == "package.json":
        return 4
    return 9


def is_key_file(path):
    return _review_priority(path) < 9


def collect_review_files(full_name, paths, branch):
    """Fetch the contents of the highest-signal files for the reviewer."""
    candidates = sorted([p for p in paths if is_key_file(p)], key=_review_priority)
    out = []
    for p in candidates[:REVIEW_MAX_FILES]:
        content = get_file_content(full_name, p, branch)
        if content:
            out.append({"path": p, "content": content[:REVIEW_SNIPPET_CHARS]})
        time.sleep(0.2)
    return out


# --------------------------------------------------------------------------- #
# Classification
# --------------------------------------------------------------------------- #
def classify(paths, topics, description):
    paths_l = [p.lower() for p in paths]
    blob = " ".join(paths_l + [t.lower() for t in topics] + [(description or "").lower()])
    cats = []

    if any(p.endswith("skill.md") or "/skills/" in p or p.startswith("skills/") for p in paths_l):
        cats.append("Skills")
    if any("mcp" in p for p in paths_l) or ".mcp.json" in paths_l or "mcp" in blob:
        cats.append("MCP Servers")
    if any(p.startswith("agents/") or "/agents/" in p or "subagent" in p for p in paths_l) or "subagent" in blob:
        cats.append("Subagents")
    if any(p.startswith("commands/") or "/commands/" in p for p in paths_l):
        cats.append("Slash Commands")
    if "claude-plugin" in blob or any("plugin" in p for p in paths_l):
        cats.append("Plugins")
    if any(k in blob for k in ("hook", "hooks")):
        cats.append("Hooks")
    if any(k in blob for k in ("awesome", "curated", "list of")):
        cats.append("Resource Lists")

    if not cats:
        cats.append("General / Tooling")
    return sorted(set(cats))


# --------------------------------------------------------------------------- #
# Heuristic risk scoring
# --------------------------------------------------------------------------- #
# NOTE: This is a risk *indicator*, not an audit. It rewards transparency and
# maintenance signals and penalizes patterns that warrant a closer human look.
SECRET_PATTERNS = [
    re.compile(r"(?i)aws_secret_access_key\s*=\s*['\"][A-Za-z0-9/+=]{30,}"),
    re.compile(r"(?i)api[_-]?key\s*[:=]\s*['\"][A-Za-z0-9_\-]{20,}"),
    re.compile(r"ghp_[A-Za-z0-9]{30,}"),
    re.compile(r"sk-[A-Za-z0-9]{20,}"),
    re.compile(r"(?i)-----BEGIN (RSA |EC )?PRIVATE KEY-----"),
]
RISKY_INSTALL = re.compile(r"(?i)(curl|wget)\s+[^\n|]*\|\s*(sudo\s+)?(bash|sh)\b")


def score_repo(repo, readme, paths):
    """Return (score 0-100, label, list_of_factors)."""
    factors = []
    score = 50  # neutral baseline

    stars = repo["stargazers_count"]
    forks = repo.get("forks_count", 0)
    archived = repo.get("archived", False)
    license_obj = repo.get("license")
    pushed_at = repo.get("pushed_at", "")
    open_issues = repo.get("open_issues_count", 0)

    # --- Maintenance / community trust signals (raise score = lower risk) ---
    if stars >= 1000:
        score += 12; factors.append(("+", f"Popular: {stars:,} stars"))
    elif stars >= 200:
        score += 7; factors.append(("+", f"{stars:,} stars"))
    elif stars >= 50:
        score += 3; factors.append(("+", f"{stars:,} stars"))

    if license_obj and license_obj.get("spdx_id") not in (None, "NOASSERTION"):
        score += 6; factors.append(("+", f"Licensed ({license_obj['spdx_id']})"))
    else:
        score -= 6; factors.append(("-", "No clear license"))

    # Freshness
    if pushed_at:
        try:
            last = dt.datetime.fromisoformat(pushed_at.replace("Z", "+00:00"))
            days = (dt.datetime.now(dt.timezone.utc) - last).days
            if days <= 30:
                score += 8; factors.append(("+", f"Active (updated {days}d ago)"))
            elif days <= 180:
                score += 3; factors.append(("+", f"Updated {days}d ago"))
            elif days > 540:
                score -= 10; factors.append(("-", f"Stale (updated {days}d ago)"))
        except Exception:
            pass

    if archived:
        score -= 12; factors.append(("-", "Archived / unmaintained"))

    if forks >= 20:
        score += 3; factors.append(("+", f"{forks} forks"))

    # --- Code-surface risk signals (lower score = higher risk) ---
    readme_lc = readme or ""
    secret_hits = sum(1 for p in SECRET_PATTERNS if p.search(readme_lc))
    if secret_hits:
        score -= 20; factors.append(("-", f"Possible hardcoded secret(s) in README ({secret_hits})"))

    if RISKY_INSTALL.search(readme_lc):
        score -= 10; factors.append(("-", "README uses curl|bash style install"))

    # Dependency manifests present = inspectable surface (slightly positive,
    # but flag if many ecosystems = larger attack surface)
    manifests = [p for p in paths if os.path.basename(p).lower() in (
        "package.json", "requirements.txt", "pyproject.toml", "cargo.toml",
        "go.mod", "gemfile", "pom.xml")]
    if manifests:
        factors.append(("i", f"Dependency manifests: {len(manifests)}"))

    # Executable / install scripts warrant a look
    scripts = [p for p in paths if p.lower().endswith((".sh", ".ps1")) or "install" in p.lower()]
    if scripts:
        score -= 4; factors.append(("-", f"Contains install/shell scripts ({len(scripts)})"))

    # CI present = some hygiene
    if any(p.startswith(".github/workflows/") for p in paths):
        score += 4; factors.append(("+", "Has CI workflows"))

    # Security policy present
    if any(os.path.basename(p).lower() == "security.md" for p in paths):
        score += 4; factors.append(("+", "Has SECURITY.md"))

    score = max(0, min(100, score))
    if score >= 75:
        label = "Lower risk"
    elif score >= 55:
        label = "Moderate"
    elif score >= 35:
        label = "Elevated"
    else:
        label = "Higher risk — review carefully"
    return score, label, factors


def summarize_readme(readme):
    """Lightweight extractive summary. Cowork/Claude will rewrite this into
    plain language at runtime; this is a deterministic fallback."""
    if not readme:
        return "No README found."
    # strip badges / html / code fences
    text = re.sub(r"!\[.*?\]\(.*?\)", "", readme)
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"#+ ", "", text)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    blurb = " ".join(lines[:4])
    return (blurb[:400] + "…") if len(blurb) > 400 else blurb


# --------------------------------------------------------------------------- #
# Persistent known-repo index (for "new since last run" detection)
# --------------------------------------------------------------------------- #
def load_known():
    """Return {full_name: {first_seen, last_seen, peak_stars}}."""
    try:
        with open(KNOWN_INDEX) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_known(index):
    os.makedirs(JSON_DIR, exist_ok=True)
    with open(KNOWN_INDEX, "w") as f:
        json.dump(index, f, indent=2, sort_keys=True)


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main():
    if not TOKEN:
        print("WARNING: no GITHUB_TOKEN set — limited to 60 req/hr.", file=sys.stderr)

    today = dt.date.today().isoformat()
    known = load_known()

    # Two discovery passes: popular (star-sorted) + fresh (recently created).
    since = (dt.date.today() - dt.timedelta(days=FRESH_WINDOW_DAYS)).isoformat()
    popular = discover()
    fresh = discover(min_stars=FRESH_MIN_STARS, created_since=since, sort="updated")
    merged = {**fresh, **popular}  # popular wins on dup keys
    all_repos = sorted(merged.values(), key=lambda x: x["stargazers_count"], reverse=True)
    print(f"Discovered {len(all_repos)} unique repos "
          f"({len(popular)} popular, {len(fresh)} fresh)", file=sys.stderr)

    # Deep-scan the top-by-stars, then guarantee any newly-seen repo gets scanned
    # too (so a brand-new low-star repo isn't dropped before it's ever reviewed).
    top = all_repos[:MAX_REPOS_DEEP_SCAN]
    top_names = {r["full_name"] for r in top}
    extra_new = [r for r in all_repos[MAX_REPOS_DEEP_SCAN:]
                 if r["full_name"] not in top_names and r["full_name"] not in known]
    extra_new = extra_new[:MAX_NEW_EXTRA]
    repos = top + extra_new
    if extra_new:
        print(f"Including {len(extra_new)} extra newly-discovered repos beyond the "
              f"star cap", file=sys.stderr)

    results = []
    new_this_run = []
    for i, repo in enumerate(repos):
        fn = repo["full_name"]
        print(f"[{i+1}/{len(repos)}] {fn}", file=sys.stderr)
        readme = get_readme(fn)
        branch = repo.get("default_branch", "main")
        paths = get_tree(fn, branch)
        topics = repo.get("topics", [])
        cats = classify(paths, topics, repo.get("description"))
        score, label, factors = score_repo(repo, readme, paths)
        stars = repo["stargazers_count"]

        # --- new-repo detection against the persistent index ---
        prev = known.get(fn)
        is_new = prev is None
        first_seen = today if is_new else prev.get("first_seen", today)
        if is_new:
            new_this_run.append(fn)
        known[fn] = {
            "first_seen": first_seen,
            "last_seen": today,
            "peak_stars": max(stars, (prev or {}).get("peak_stars", 0)),
        }

        # --- content the Cowork session will read to assess the repo ---
        review_inputs = {
            "readme": (readme or "")[:REVIEW_README_CHARS],
            "key_files": collect_review_files(fn, paths, branch),
            "tree_sample": paths[:200],
        }

        results.append({
            "full_name": fn,
            "url": repo["html_url"],
            "description": repo.get("description") or "",
            "summary": summarize_readme(readme),
            "stars": stars,
            "forks": repo.get("forks_count", 0),
            "language": repo.get("language") or "—",
            "topics": topics,
            "license": (repo.get("license") or {}).get("spdx_id", "None"),
            "pushed_at": repo.get("pushed_at", ""),
            "categories": cats,
            "is_new": is_new,
            "first_seen": first_seen,
            "security": {"score": score, "label": label, "factors": factors},
            "review_inputs": review_inputs,
            "claude_review": None,  # filled in by the Cowork session
        })
        time.sleep(0.3)

    save_known(known)

    out = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "repo_count": len(results),
        "new_count": len(new_this_run),
        "new_repos": new_this_run,
        "repos": results,
    }
    os.makedirs(JSON_DIR, exist_ok=True)
    fname = os.path.join(JSON_DIR, f"data-{today}.json")
    with open(fname, "w") as f:
        json.dump(out, f, indent=2)
    print(f"Wrote {fname} ({len(results)} repos, {len(new_this_run)} new)")


if __name__ == "__main__":
    main()
