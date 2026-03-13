---
layout: page
title: Supply Chain Attacks
description: What is a supply chain attack?
img: assets/img/projects/supply-chain-attacks.png
category: explained
topic_type: threat
icon: package
---

## 📦 What Is a Supply Chain Attack?

A **supply chain attack** targets an organization not by attacking it directly, but by compromising a third-party vendor, software library, or service provider that the organization trusts and relies upon. Rather than breaking through a well-defended front door, attackers find a weaker link in the chain — a software update mechanism, an open-source dependency, or a managed service provider — and use it as a stealthy entry point into thousands of downstream targets at once. Because the malicious code or access arrives through a trusted channel (a legitimate software update, for example), it often bypasses traditional security controls entirely. Supply chain attacks are particularly dangerous because a single successful compromise can cascade to hundreds or even thousands of organizations simultaneously.

---

### 🧪 Real-World Example

In the SolarWinds attack of 2020, attackers inserted malicious code into a routine software update for a widely used IT monitoring product. When roughly 18,000 organizations installed the update — including government agencies and Fortune 500 companies — they unknowingly gave the attackers a persistent backdoor into their networks. The breach went undetected for months.

---

### 🛡️ How to Protect Yourself

- Vet third-party vendors and software providers carefully, including their security practices and incident history
- Keep an accurate inventory of all third-party software, libraries, and services your organization uses
- Apply software updates from verified, official sources and monitor vendor security advisories
- Use tools that detect anomalous behavior in software already running in your environment
- Segment your network so that a compromised vendor connection cannot reach your most sensitive systems
- Require vendors with privileged access to meet minimum security standards and conduct periodic reviews
