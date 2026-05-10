---
layout: post
title: "Field Notes — Reading EPSS Scores in Practice"
date: 2026-05-09 12:00:00
description: Working examples of EPSS score interpretation — when to trust it, when to override it, and how it interacts with CVSS and CISA KEV.
tags: [Field Notes]
categories: Field Notes
thumbnail: assets/img/cybernews.webp
featured: false
published: true
---

EPSS is the single best public signal for "how likely is this CVE to actually be exploited?" It's not perfect. It's just dramatically better than CVSS at answering that specific question.

Here's how I read it in real triage.

## What EPSS _is_

A daily-updated probability (0.0 to 1.0) that a given CVE will be exploited in the wild within the next 30 days. The model considers exploit-code availability, mention frequency in security feeds, vendor patching cadence, and observed exploitation telemetry.

You can look up any CVE on the [EPSS Scanner](/epss/) on this site.

## What EPSS _is not_

It is **not** a measure of:

- How bad the exploit is _if_ successful (that's CVSS).
- Whether _your_ environment is exposed (that's compensating controls + reachability).
- Whether the exploit has _already_ happened in the wild (that's CISA KEV).

## Reading scores in practice

| EPSS        | Interpretation                                                 | Default action               |
| ----------- | -------------------------------------------------------------- | ---------------------------- |
| > 0.5 (50%) | High likelihood; security press has it; PoC widely circulating | Patch this cycle, no debate  |
| 0.1 – 0.5   | Working exploit known; selective targeting                     | Patch within 7–14 days       |
| 0.01 – 0.1  | Some interest; no broad campaign yet                           | Standard cycle               |
| < 0.01      | Below noise floor for typical attackers                        | Standard cycle, deprioritize |

**Always override toward action when:**

- The CVE is on CISA KEV (regardless of EPSS).
- The product is internet-facing AND pre-auth exploitable.
- A working weaponized exploit is on social media or in a Metasploit module.

**Sometimes override toward deferral when:**

- High EPSS but the affected feature/module is not enabled in our deployment.
- High EPSS but our WAF/EDR has signatures blocking the attack path.
- High EPSS but the host is air-gapped.

## The trap I see most often

Teams treat CVSS 9.8 as "drop everything." Most CVSS 9.8 issues never get exploited at scale — they require auth, or a non-default config, or a specific environment. Meanwhile a CVSS 6.5 in CISA KEV with EPSS 0.7 is happening _right now_ and is internet-facing on someone's edge router.

Use CVSS to know how bad something _would be_. Use EPSS to know how _likely_ it is. Use KEV to know what is _actually happening_. Then add your environmental context to decide what to do about it.

## A worked example

CVE-2024-XXXXX shows up. CVSS 9.8 (RCE, network, no auth). The team panics. I check:

1. **EPSS:** 0.012. Below noise floor.
2. **KEV:** not listed.
3. **PoC:** none found on GitHub or X.
4. **Exposure:** the affected service runs on three internal hosts. None internet-facing.

Decision: patch in the next monthly cycle. Document the rationale. Watch EPSS for the next two weeks — if it climbs past 0.1, escalate.

A week later I check the same CVE: EPSS climbed to 0.34 because a researcher published a working exploit. I bump it forward by two weeks. That's the system working as intended.

## The overall rule

Severity tells you _how bad_. Likelihood tells you _how soon_. Context tells you _what's worth your Tuesday_. Read all three before you patch — and certainly before you skip patching.
