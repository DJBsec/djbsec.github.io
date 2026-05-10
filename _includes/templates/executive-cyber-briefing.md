# Executive Cyber Briefing Template

A monthly or quarterly report template for non-technical executives, board members, or business owners. Aim for 2 pages. Replace the bracketed prompts with current state.

---

## 1. One-line summary (TL;DR)

> [Current posture in one sentence. Example: "Posture is stable; one high-severity issue under remediation; phishing volume up 18% this month."]

## 2. Risk dashboard

| Area                      | Status       | Change vs last period | Notes                              |
| ------------------------- | ------------ | --------------------- | ---------------------------------- |
| Vulnerability remediation | 🟢 / 🟡 / 🔴 | ▲ / ▬ / ▼             | [Open critical CVEs aging > SLA]   |
| Identity & access         | 🟢 / 🟡 / 🔴 | ▲ / ▬ / ▼             | [MFA coverage %]                   |
| Endpoint protection       | 🟢 / 🟡 / 🔴 | ▲ / ▬ / ▼             | [EDR coverage, last 30d incidents] |
| Email security            | 🟢 / 🟡 / 🔴 | ▲ / ▬ / ▼             | [Phishing reports, BEC attempts]   |
| Backups & recovery        | 🟢 / 🟡 / 🔴 | ▲ / ▬ / ▼             | [Last successful restore test]     |
| Third-party / vendor      | 🟢 / 🟡 / 🔴 | ▲ / ▬ / ▼             | [SOC 2 expirations, new vendors]   |

🟢 within tolerance · 🟡 watch · 🔴 action required

## 3. What changed this period

**Improvements**

- [Concrete win, e.g., "Rolled out app-based MFA to remaining 12% of staff"]
- [Concrete win]

**Setbacks or new risks**

- [Issue + business impact + plan + ETA]
- [Issue + business impact + plan + ETA]

## 4. Incidents

| Date         | Severity            | Summary        | Status                      |
| ------------ | ------------------- | -------------- | --------------------------- |
| [YYYY-MM-DD] | [Low/Med/High/Crit] | [One sentence] | [Open / Contained / Closed] |

If zero incidents: state that explicitly. Boards distrust silence.

## 5. Threat landscape (external)

Two or three items relevant to _our_ industry, vendors, or geography. Avoid generic news.

- **[Threat or trend]** — [What it means for us specifically. What we are doing about it.]
- **[Threat or trend]** — [Same.]

## 6. Decisions requested

If nothing is needed: say so. Otherwise:

- [ ] **Decision:** [What you need approved] — **Cost:** [$ or FTE] — **Impact if no:** [What breaks or stalls]
- [ ] **Decision:** ...

## 7. Spend snapshot

| Line item                  | Budget | Spent YTD | Forecast variance |
| -------------------------- | ------ | --------- | ----------------- |
| Tools & subscriptions      |        |           |                   |
| Headcount                  |        |           |                   |
| Training & certifications  |        |           |                   |
| Incident response retainer |        |           |                   |
| Insurance (cyber)          |        |           |                   |

## 8. Next quarter focus

Three items, not ten. Each item = title + outcome + owner + target date.

1. **[Initiative]** — [Outcome statement] — [Owner] — [Date]
2. ...
3. ...

---

## Tone notes (delete before sending)

- Use plain English. "Critical CVE on Fortinet edge" → "Vendor-reported flaw on our perimeter firewall, patch in next 48h."
- Quantify whenever possible. "We blocked 14,000 phishing emails this month, up from 11,500 last month."
- Don't bury bad news. Lead with it, then the plan.
- Map every spend item to a risk it reduces. If you can't, question the spend.
- Color in dashboards is for at-a-glance; keep one-line annotations explaining the color.
