#!/usr/bin/env python3
"""
plugin_sec / export_site_data.py

Site wiring step. Merges the newest data-*.json + reviews-*.json (the same pair
build_html.py consumes) into a single trimmed JSON that the Jekyll site renders
at _data/plugins.json.

It deliberately DROPS `review_inputs` (the raw, untrusted README/skill/hook text
the scan fetched) so none of that bulk or untrusted content ships to the public
site. Only the verdict, summary, findings, and observable metadata survive.

Run after each Cowork scan, then commit _data/plugins.json:

    python3 plugin_sec/export_site_data.py
    git add _data/plugins.json && git commit -m "Update plugin radar data"

Does not modify scan.py or build_html.py.
"""

import glob
import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_DIR = os.path.join(SCRIPT_DIR, "json")
SITE_ROOT = os.path.dirname(SCRIPT_DIR)
OUT_PATH = os.path.join(SITE_ROOT, "_data", "plugins.json")

# Fields kept per repo. review_inputs and the nested claude_review are handled
# separately; everything else listed here is copied verbatim when present.
KEEP_FIELDS = (
    "full_name", "url", "description", "summary", "stars", "forks",
    "language", "topics", "license", "pushed_at", "categories",
    "is_new", "first_seen",
)


def newest(pattern):
    files = sorted(glob.glob(os.path.join(JSON_DIR, pattern)))
    return files[-1] if files else None


def reviews_for(data_path):
    base = os.path.basename(data_path).replace("data-", "reviews-", 1)
    return os.path.join(JSON_DIR, base)


def slim_review(cr):
    """Keep only the human-facing review fields; drop anything else."""
    if not cr:
        return None
    out = {
        "risk": str(cr.get("risk", "")).lower(),
        "summary": cr.get("summary", ""),
        "rationale": cr.get("rationale", ""),
        "reviewed_at": cr.get("reviewed_at", ""),
        "findings": [],
    }
    for f in (cr.get("findings") or []):
        out["findings"].append({
            "severity": str(f.get("severity", "info")).lower(),
            "note": f.get("note", ""),
        })
    return out


def main():
    data_path = sys.argv[1] if len(sys.argv) > 1 else newest("data-*.json")
    if not data_path:
        sys.exit(f"No data-*.json found in {JSON_DIR}. Run scan.py first.")

    with open(data_path) as f:
        data = json.load(f)

    reviews = {}
    rp = reviews_for(data_path)
    if os.path.exists(rp):
        with open(rp) as f:
            reviews = json.load(f)
    else:
        print(f"(no reviews file at {rp} — exporting heuristic only)")

    repos_out = []
    reviewed = 0
    for r in data.get("repos", []):
        rec = {k: r.get(k) for k in KEEP_FIELDS}
        sec = r.get("security") or {}
        rec["security"] = {
            "score": sec.get("score"),
            "label": sec.get("label", ""),
            "factors": sec.get("factors", []),
        }
        cr = slim_review(reviews.get(r["full_name"]) or r.get("claude_review"))
        if cr:
            rec["claude_review"] = cr
            reviewed += 1
        repos_out.append(rec)

    out = {
        "generated_at": data.get("generated_at", ""),
        "repo_count": data.get("repo_count", len(repos_out)),
        "new_count": data.get("new_count", 0),
        "reviewed_count": reviewed,
        "repos": repos_out,
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)

    print(f"Wrote {OUT_PATH}")
    print(f"  {len(repos_out)} repos, {reviewed} with Claude reviews, "
          f"{out['new_count']} new, generated {out['generated_at'][:10]}")


if __name__ == "__main__":
    main()
