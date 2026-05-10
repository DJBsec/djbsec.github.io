# MFA Rollout Checklist

Multi-factor authentication is the single highest-ROI control for most organizations. This checklist takes you from "MFA on a few admin accounts" to "MFA on every authentication path that matters."

## Phase 0 — Pre-flight

- [ ] Inventory all authentication systems (IdP, VPN, email, finance, HR, code repo, cloud consoles, RDP/SSH gateways, customer-facing apps with admin functions)
- [ ] Identify dependencies: which systems federate to your IdP? Which are standalone?
- [ ] Choose factor types in priority order:
  1. **FIDO2 / WebAuthn (security keys, platform passkeys)** — phishing-resistant, ideal for admins
  2. **App-based TOTP / push (Authy, Microsoft Authenticator, Duo, Okta Verify)** — strong, low friction
  3. **SMS / email OTP** — only as fallback; vulnerable to SIM swap
- [ ] Pilot group selected (~10% of users, mix of technical and non-technical)
- [ ] Communications plan drafted: announcement, how-to, help-desk macro
- [ ] Help desk staffed for first-week spike
- [ ] Recovery / backup process defined (admin-assisted reset, recovery codes)
- [ ] Lost-device procedure documented

## Phase 1 — Privileged accounts (week 1)

Scope: domain admins, root/sudo on prod, cloud admins, security team, finance approvers, anyone with `*` permissions anywhere.

- [ ] Hardware security keys procured (YubiKey 5 or equivalent — 2 per admin: primary + backup)
- [ ] Recovery codes generated, printed, sealed in tamper-evident envelopes, stored in safe
- [ ] FIDO2 enforced on IdP for privileged groups
- [ ] Break-glass account documented separately (paper, in safe; not in password manager that could be locked out)
- [ ] Audit log review: any admin auth that bypassed MFA in the last 30 days?

## Phase 2 — Email and IdP for all users (weeks 2–3)

- [ ] Enrollment self-service portal published
- [ ] Deadline set (~14 days from announcement)
- [ ] Daily report of unenrolled users to managers
- [ ] Conditional access: enforce MFA on all sign-ins; allow exceptions only with documented business reason and expiry date
- [ ] Legacy / basic auth disabled on email (single biggest BEC mitigation)
- [ ] OAuth tokens / app passwords audited; revoke unused

## Phase 3 — VPN and remote access (week 4)

- [ ] VPN client integrated with IdP (so MFA flows through)
- [ ] RDP / SSH jump hosts behind MFA-protected gateway
- [ ] No direct internet exposure of management interfaces (admin panels, jump hosts)

## Phase 4 — Business apps (weeks 5–8)

For each SaaS / line-of-business app:

- [ ] SSO via IdP (preferred — inherits MFA)
- [ ] If no SSO: app-native MFA enabled and enforced
- [ ] If neither: document the gap, set a deprecation or migration date

## Phase 5 — Customer-facing (if applicable)

- [ ] Optional MFA enabled for end users
- [ ] Required MFA for any customer with elevated permissions (admin role, financial actions)
- [ ] Risk-based MFA challenges: new device, geographic anomaly, high-value action

## Verification

- [ ] Run a phishing simulation against a small set of users; confirm credentials alone fail without MFA
- [ ] Confirm reporting dashboard shows enrollment % per group
- [ ] Confirm break-glass works (test in pre-prod if possible)

## Common pitfalls

- **SMS for admins:** SIM-swap is real. Use FIDO2 for anyone with privileged access.
- **No backup factor:** every user needs at least 2 factors registered, or recovery becomes a help-desk nightmare.
- **Push fatigue:** number-matching on push apps prevents accidental approval. Turn it on if your app supports it.
- **Service accounts:** never put a human's MFA on a service account. Use proper machine identity (cert, managed identity, OIDC).
- **Legacy protocols:** SMTP basic auth, IMAP, POP3, NTLM, LDAP simple bind — disable wholesale, exception by exception.

## Maintenance

- [ ] Quarterly review of MFA exceptions
- [ ] Quarterly review of users with no MFA factors registered
- [ ] Annual replacement / inventory of hardware keys
- [ ] Annual phishing simulation including MFA-bypass scenarios (consent phishing, push fatigue)
