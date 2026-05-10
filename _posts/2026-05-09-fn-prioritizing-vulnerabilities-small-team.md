---
layout: post
title: "Field Notes — Prioritizing Vulnerabilities in a Small Team"
date: 2026-05-09 10:00:00
description: Practitioner notes on triaging a vulnerability backlog without a dedicated AppSec team. CVSS, EPSS, KEV, and the controls already in place.
tags: [Field Notes]
categories: Field Notes
thumbnail: assets/img/cybernews.webp
featured: false
published: true
---

A two-person IT shop opened their scanner one morning to 4,200 "high or critical" findings. Patching all of them in a quarter is not realistic. Patching the 30 that _actually_ matter, this week, is.

This is the workflow I land on most often when I help small teams with that pile.

## Three layers of signal

1. **CVSS** — how bad _if_ exploited. Public, immediate, often inflated.
2. **EPSS** — predicted likelihood of exploitation in the next 30 days. Public, updated daily, much closer to reality than CVSS for prioritization.
3. **CISA KEV** — confirmed evidence of exploitation in the wild. If something is on KEV, it has already happened to someone.

CVSS alone gives you 4,200 critical findings. EPSS narrows that to a few hundred. KEV usually surfaces a few dozen at most across an environment.

## A starting matrix

| Internet-facing | KEV / EPSS > 0.5 | Auth required | Action                 |
| --------------- | ---------------- | ------------- | ---------------------- |
| Yes             | Yes              | Pre-auth      | Emergency change — 24h |
| Yes             | No               | Pre-auth      | Patch in 7 days        |
| No              | Yes              | Pre-auth      | 14 days                |
| Any             | No               | Auth          | Monthly cycle          |

Override the matrix when:

- The host stores something irreplaceable (regulated data, customer secrets).
- A WAF rule or compensating control is already blocking the attack path.
- The patch itself has known stability issues — patch only after the next-version is out, but raise the priority of monitoring in the meantime.

## What I track per finding

For every finding I act on, the ticket has the same five fields:

- **Asset(s)** — hostname, owner, criticality
- **Decision** — patch / mitigate / accept
- **Justification** — one sentence
- **Verification** — how we'll know it's fixed (re-scan? runtime check? configuration audit?)
- **Revisit date** — even "accept" gets a date

Every accepted risk has an expiration. Otherwise the accept-list grows forever and turns into the next breach.

## The 80/20 cheat code

If you do nothing else this week, look at:

1. Anything on CISA KEV that you have running.
2. Anything internet-facing with EPSS > 0.5.
3. Anything with a working public exploit, regardless of EPSS.

That's usually under 50 items. It's a manageable Tuesday.

The point is not to ignore the other 4,150 findings. It's to know which ones to do _first_ — and to have a defensible answer when leadership asks why you patched X before Y.
