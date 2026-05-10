# Incident Response Checklist

A working checklist based on the SANS / NIST PICERL lifecycle. Use this in real-time during an incident, or as a tabletop guide.

## 1. Prepare (before anything happens)

- [ ] On-call rotation documented; primary + backup names known
- [ ] Comms tree: who to call (legal, exec, PR, insurance, MSSP, IR retainer)
- [ ] Out-of-band comms channel ready (Signal group, separate Slack workspace) — assume primary is compromised
- [ ] Decision-tree authority: who can authorize containment that takes services offline?
- [ ] Logs centralized and at least 90 days deep
- [ ] Recent backup test: when was the last successful restore drill?
- [ ] IR retainer or hotline number on file

## 2. Identify

- [ ] Source of detection logged (alert, user report, third party, threat-intel feed)
- [ ] Initial timestamp recorded (UTC)
- [ ] Affected systems enumerated: hostname, IP, owner, criticality
- [ ] Indicator of Compromise (IOC) noted: file hash, IP, domain, behavior
- [ ] Severity assigned (Low / Med / High / Critical) — re-evaluate hourly
- [ ] Incident ticket opened; ticket ID broadcast to responders
- [ ] Initial scoping question: data exfil, destructive, persistence, or recon?

## 3. Contain

Short-term:

- [ ] Isolate affected hosts (network quarantine, not power-off — preserve volatile evidence)
- [ ] Disable compromised credentials (rotate, revoke MFA tokens, kill active sessions)
- [ ] Block known IOCs at perimeter (firewall, DNS, EDR)
- [ ] Take memory + disk image of at least one affected host before reboot

Long-term:

- [ ] Patch / reconfigure to prevent re-entry on the same vector
- [ ] Increase logging and monitoring on adjacent systems
- [ ] Push EDR / IDS rule updates derived from observed IOCs

## 4. Eradicate

- [ ] Remove malware (re-image is safer than clean — clean only if you're certain)
- [ ] Reset all credentials with potential exposure
- [ ] Rotate any leaked secrets (API keys, certificates, service accounts)
- [ ] Verify persistence mechanisms removed: scheduled tasks, services, registry run keys, web shells, SSH keys, cron jobs

## 5. Recover

- [ ] Restore from clean backup (verified-clean — confirm pre-incident timestamp)
- [ ] Phased return to production (canary first, then full)
- [ ] Heightened monitoring for at least 30 days
- [ ] Confirm normal business function with affected business owners

## 6. Lessons Learned (within 2 weeks)

- [ ] Post-incident review meeting scheduled
- [ ] Timeline document: what we knew when, what we did when
- [ ] Root cause: technical AND organizational
- [ ] Detection gap: would we catch this faster next time? What instrumentation is missing?
- [ ] Action items logged in a tracker — owner + date for each
- [ ] Controls / playbook updates committed
- [ ] Tabletop scenario drafted from the incident for next training cycle

## Severity Quick Reference

| Level    | Examples                                                    | Response Time        |
| -------- | ----------------------------------------------------------- | -------------------- |
| Critical | Data exfil confirmed; ransomware spreading; production down | Immediate, all hands |
| High     | Single-host compromise; phishing with credential theft      | < 1 hour             |
| Medium   | Suspicious activity, no confirmed compromise                | < 4 hours            |
| Low      | Failed exploit attempts; benign anomaly                     | Next business day    |

## Communication Templates

**Internal first message:**

> We are investigating a potential security incident affecting [systems]. The incident ticket is [ID]. Please [specific instruction — e.g., do not log into X]. Updates every 30 minutes.

**Hold-line (don't have facts yet):**

> We are aware of [event]. We are currently investigating. We will share verified details as we have them. Avoid speculating internally or externally until we confirm.
