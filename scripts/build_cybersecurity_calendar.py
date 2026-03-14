#!/usr/bin/env python3
"""
build_cybersecurity_calendar.py
Reads scripts/output/conferences_raw.json + _data/cybersecurity_calendar_config.yml
+ _data/cybersecurity_calendar_manual.yml (never overwritten)
Writes:
  _data/cybersecurity_calendar.yml
  _conferences/<slug>.md  (stubs — only created if they don't exist)
"""

import json
import os
import re
import sys

import yaml

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_JSON = os.path.join(REPO_ROOT, "scripts", "output", "conferences_raw.json")
CONFIG_YAML = os.path.join(REPO_ROOT, "_data", "cybersecurity_calendar_config.yml")
MANUAL_YAML = os.path.join(REPO_ROOT, "_data", "cybersecurity_calendar_manual.yml")
OUT_YAML = os.path.join(REPO_ROOT, "_data", "cybersecurity_calendar.yml")
CONF_DIR = os.path.join(REPO_ROOT, "_conferences")


# ---------------------------------------------------------------------------
# Cost estimation helpers
# ---------------------------------------------------------------------------

def compute_airfare(state, config):
    bands = config["airfare_bands"]
    band = bands.get(state, bands["DEFAULT"])
    return band["min"], band["max"], f"Estimated from HOU to {state}, economy"


def find_hotel_tier(city, config):
    tiers = config["hotel_tiers"]
    for tier_name in ("tier1", "tier2", "tier3"):
        tier = tiers[tier_name]
        if city in tier["cities"]:
            return tier
    return {
        "nightly_min": tiers["tier4_default"]["nightly_min"],
        "nightly_max": tiers["tier4_default"]["nightly_max"],
        "notes": tiers["tier4_default"]["notes"],
    }


def compute_hotel(city, state, nights, conf_id, config):
    tier = find_hotel_tier(city, config)
    surges = config["surge_multipliers"]
    surge = surges.get(conf_id, surges["default"])
    hotel_min = int(tier["nightly_min"] * surge["min"] * nights)
    hotel_max = int(tier["nightly_max"] * surge["max"] * nights)
    notes = f"Estimated — {tier.get('notes', 'standard pricing')}, {nights} nights"
    return hotel_min, hotel_max, notes


def compute_nights(start_date, end_date):
    from datetime import date
    fmt = "%Y-%m-%d"
    try:
        s = date.fromisoformat(start_date)
        e = date.fromisoformat(end_date)
        delta = (e - s).days
        return max(delta, 1)
    except Exception:
        return 2


def enrich(conf, config):
    """Add airfare / hotel / total cost estimates to a conference dict."""
    nights = compute_nights(conf["start_date"], conf["end_date"])
    air_min, air_max, air_notes = compute_airfare(conf.get("state", ""), config)
    hotel_min, hotel_max, hotel_notes = compute_hotel(
        conf.get("city", ""), conf.get("state", ""), nights, conf["id"], config
    )
    reg_min = conf.get("registration_cost_min", 0)
    reg_max = conf.get("registration_cost_max", 0)
    total_min = reg_min + air_min + hotel_min
    total_max = reg_max + air_max + hotel_max

    conf["conference_nights"] = nights
    conf["airfare_cost_min"] = air_min
    conf["airfare_cost_max"] = air_max
    conf["airfare_cost_notes"] = air_notes
    conf["hotel_cost_min"] = hotel_min
    conf["hotel_cost_max"] = hotel_max
    conf["hotel_cost_notes"] = hotel_notes
    conf["total_cost_min"] = total_min
    conf["total_cost_max"] = total_max
    return conf


# ---------------------------------------------------------------------------
# Merge logic
# ---------------------------------------------------------------------------

def load_manual(path):
    if not os.path.exists(path):
        return {"additions": [], "overrides": {}}
    with open(path) as f:
        data = yaml.safe_load(f) or {}
    return {
        "additions": data.get("additions", []) or [],
        "overrides": data.get("overrides", {}) or {},
    }


def merge(generated, manual):
    """Apply manual overrides and additions to the generated list."""
    by_id = {c["id"]: c for c in generated}

    # Field-level overrides
    for conf_id, fields in manual["overrides"].items():
        if conf_id in by_id:
            by_id[conf_id].update(fields)

    # Additions (full entry wins if id already exists)
    for entry in manual["additions"]:
        cid = entry.get("id")
        if cid:
            by_id[cid] = entry

    result = list(by_id.values())
    result.sort(key=lambda c: c.get("start_date", "9999"))
    return result


# ---------------------------------------------------------------------------
# Stub generation
# ---------------------------------------------------------------------------

STUB_TEMPLATE = """\
---
conference_id: {id}
title: "{title}"
description: "{description}"
og_image: assets/img/djbsec.png
keywords: "{keywords}"
last_modified_at: 2026-03-14
---
"""


def make_stub(conf):
    kw_parts = [conf["name"]]
    for tag in conf.get("category_tags", []):
        kw_parts.append(tag)
    kw_parts += [conf.get("city", ""), "cybersecurity conference 2026"]
    keywords = ", ".join(p for p in kw_parts if p)
    return STUB_TEMPLATE.format(
        id=conf["id"],
        title=conf["name"].replace('"', '\\"'),
        description=conf.get("short_description", "").replace('"', '\\"'),
        keywords=keywords,
    )


def write_stub(conf, conf_dir):
    slug = conf["slug"]
    path = os.path.join(conf_dir, f"{slug}.md")
    if not os.path.exists(path):
        with open(path, "w") as f:
            f.write(make_stub(conf))
        return True
    return False


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    # Load raw conference data
    if not os.path.exists(RAW_JSON):
        print(f"ERROR: {RAW_JSON} not found. Run fetch_cyber_conferences.py first.")
        sys.exit(1)
    with open(RAW_JSON) as f:
        conferences = json.load(f)

    # Load config
    with open(CONFIG_YAML) as f:
        config = yaml.safe_load(f)

    # Enrich with cost estimates
    conferences = [enrich(c, config) for c in conferences]

    # Load and apply manual overrides/additions
    manual = load_manual(MANUAL_YAML)
    conferences = merge(conferences, manual)

    # Enrich any manual additions that may lack cost fields
    for c in conferences:
        if "airfare_cost_min" not in c:
            c = enrich(c, config)

    # Write _data/cybersecurity_calendar.yml
    with open(OUT_YAML, "w") as f:
        f.write("# Auto-generated by scripts/build_cybersecurity_calendar.py\n")
        f.write("# To make permanent changes, edit _data/cybersecurity_calendar_manual.yml\n")
        f.write("# and re-run this script.\n\n")
        yaml.dump(conferences, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
    print(f"Wrote {len(conferences)} conferences to {OUT_YAML}")

    # Write _conferences/*.md stubs
    os.makedirs(CONF_DIR, exist_ok=True)
    created = 0
    for c in conferences:
        if write_stub(c, CONF_DIR):
            created += 1
    print(f"Created {created} new _conferences/ stubs (existing stubs not overwritten)")


if __name__ == "__main__":
    main()
