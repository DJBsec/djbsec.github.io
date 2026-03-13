---
layout: page
title: EPSS
description: What is the Exploit Prediction Scoring System?
img: assets/img/projects/epss.png
category: explained
topic_type: concepts
icon: chart-bar
---

## 📊 What Is EPSS?

The **Exploit Prediction Scoring System (EPSS)** is a free, data-driven model that estimates the probability a published CVE will be exploited in the wild **within the next 30 days**. Scores range from 0 to 1 (0% – 100%) and are refreshed daily for every known CVE.

Where **CVSS** measures the _severity_ of a vulnerability based on its characteristics, EPSS measures _likelihood of exploitation_ based on real-world signals. A vulnerability can be critical by CVSS but have a near-zero EPSS score — meaning attackers are not actively targeting it.

EPSS is maintained by [FIRST](https://www.first.org/epss/) and powered by a machine-learning model trained on inputs including CVSS metrics, CWE weakness type, exploit code availability (Exploit-DB, GitHub, Metasploit), presence on CISA KEV, and live exploitation telemetry from honeypots and IDS/IPS sensors.

---

### 🧪 Real-World Example

As of October 2023, the NVD contained over 139,000 CVEs with CVSS 3.x scores. In any given 30-day window, only about **2.7%** of those CVEs showed active exploitation. Using CVSS ≥7 to prioritize would capture 82% of exploited CVEs — but require patching **57%** of all vulnerabilities. Using EPSS ≥10% captures 63% of exploited CVEs while targeting only **2.7%** of the total — making remediation far more efficient.

---

### ✅ Key Takeaways

- EPSS scores are probabilities (0–1), not severity ratings — a score of 0.94 means a 94% chance of exploitation in the next 30 days
- Pair EPSS with CVSS: high severity + high EPSS = patch immediately; high severity + low EPSS = monitor and schedule
- CISA KEV entries tend to have high EPSS scores — if a CVE is on KEV, treat it as urgent regardless
- EPSS data is free and available via CSV download or API at `api.first.org/data/v1/epss`
- There is no single "right" threshold — organizations with limited resources should optimize for efficiency; mission-critical environments should optimize for coverage
- EPSS is not a guarantee: it predicts likelihood, not certainty — unknown exploits and targeted attacks can still affect low-scoring CVEs
