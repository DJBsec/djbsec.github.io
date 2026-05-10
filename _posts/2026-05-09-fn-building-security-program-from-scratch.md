---
layout: post
title: "Field Notes — Building a Security Program From Scratch"
date: 2026-05-09 11:00:00
description: A 90-day playbook for the first security hire at a small business. Identity, endpoints, email, backups, logging — in that order.
tags: [Field Notes]
categories: Field Notes
thumbnail: assets/img/cybernews.webp
featured: false
published: true
---

You are the first security hire — or you're the IT person who just inherited the security responsibilities. There is no SOC. There is no SIEM. There is one of you and the work of ten.

The trap is to start with the most exciting tool. Don't. Start with the controls that fail loudly when missing.

## The order I always run

### Days 1–14 — Identity

Identity is the perimeter. If you do nothing else, do this:

- App-based MFA on email for everyone. SMS for admins is malpractice in 2026 — use FIDO2 keys or app push with number matching.
- Disable legacy / basic auth on email (the single biggest BEC mitigation).
- Audit shared admin accounts. Replace with named accounts and just-in-time elevation.
- Conditional access: block sign-ins from impossible-travel scenarios.

### Days 15–30 — Endpoints

- Modern EDR on every endpoint. Free options exist; pick one.
- Disk encryption on every laptop (BitLocker / FileVault).
- Auto-updates on for OS and major apps.
- Inventory: a list, even if it's a spreadsheet, of every endpoint and its owner.

### Days 31–45 — Email

- SPF, DKIM, DMARC. DMARC starts in `p=none` (monitor), then `p=quarantine`, then `p=reject` once aligned.
- Enable phishing-resistant inbound rules: external sender banner, attachment sandbox, link rewriting.
- Train staff on a 30-minute basics talk. Cover BEC, gift-card scams, and the out-of-band check rule.

### Days 46–60 — Backups

- Pick the systems whose loss would be catastrophic (~5 of them).
- Tested, off-site, immutable if possible. Restore-test one folder.
- Document RPO/RTO so leadership knows what they bought.

### Days 61–90 — Logging & Visibility

- Centralized logs from email, IdP, EDR, firewall, cloud control plane. 90 days minimum.
- Alerts on: privileged-account creation, MFA bypass, mass mailbox forwarding rules, impossible-travel sign-ins.
- Document one IR playbook (BEC). Tabletop it.

## What I deliberately defer

In the first 90 days, you are not buying a SIEM-of-SIEMs, a SOAR platform, an attack-surface management product, or a deception platform. None of those help you survive a real incident if MFA isn't on email and there's no backup tested in 18 months.

## How to communicate progress

Every two weeks, send leadership three numbers:

1. % of users with MFA on email
2. % of endpoints with EDR + encryption
3. Last successful restore test (date)

Three numbers. Improving. That's the whole pitch in the first six months.

## The lesson the books don't say

The hardest part of building a program from scratch is not the technical work. It's saying "no" to shiny tools and "yes" to the unglamorous five-control baseline. Do the boring things first. The boring things are what survive incidents.
