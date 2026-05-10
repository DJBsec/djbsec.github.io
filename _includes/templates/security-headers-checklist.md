# HTTP Security Headers Checklist

Quick-reference for production web applications. Run the [Header Analyzer](/tools/header-analyzer/) tool against your site to confirm.

## Required (high impact, low effort)

### Strict-Transport-Security (HSTS)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

- [ ] `max-age` is at least one year (31536000 seconds)
- [ ] `includeSubDomains` set if all subdomains are HTTPS
- [ ] `preload` directive set and site submitted to hstspreload.org (only after first two confirmed)

### Content-Security-Policy (CSP)

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-RANDOM'; style-src 'self'; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

- [ ] `default-src 'self'` baseline
- [ ] No `'unsafe-inline'` for `script-src`; use nonces or hashes
- [ ] `object-src 'none'` (kills Flash / legacy plugin attacks)
- [ ] `frame-ancestors 'none'` (replaces X-Frame-Options)
- [ ] CSP report-uri or report-to configured for monitoring

### X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

- [ ] Set on every response. No exceptions.

### Referrer-Policy

```
Referrer-Policy: strict-origin-when-cross-origin
```

- [ ] Default `strict-origin-when-cross-origin` is safe for most apps
- [ ] Use `no-referrer` if your app must not leak Referer at all

### Permissions-Policy

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

- [ ] Disable browser features the app does not use
- [ ] `interest-cohort=()` opts out of FLoC-style tracking (legacy but cheap)

## Cookie Flags

For every Set-Cookie:

- [ ] `Secure` — HTTPS-only
- [ ] `HttpOnly` — not readable by JavaScript (for session/auth cookies)
- [ ] `SameSite=Lax` minimum; `SameSite=Strict` if cross-site links don't need session
- [ ] `__Host-` prefix on session cookies (binds to exact origin, requires Secure + Path=/)

## Headers to REMOVE

- [ ] `Server` — strips version disclosure (e.g., `Server: Apache/2.4.41`)
- [ ] `X-Powered-By` — strips backend disclosure (e.g., `X-Powered-By: PHP/7.4.3`)
- [ ] `X-AspNet-Version`, `X-AspNetMvc-Version`
- [ ] `X-Generator` if it leaks framework version

## Legacy / Deprecated (set if needed for old browsers)

- [ ] `X-Frame-Options: DENY` — only for old browsers; CSP `frame-ancestors` supersedes
- [ ] `X-XSS-Protection: 0` — explicitly disable; modern advice is to OFF the header (it caused vulns)

## CORS (only if your app needs it)

- [ ] `Access-Control-Allow-Origin` is **never** `*` for authenticated APIs
- [ ] Allow-list specific origins
- [ ] `Access-Control-Allow-Credentials: true` only with explicit origin (not wildcard)
- [ ] `Access-Control-Max-Age` set to limit preflight chatter

## Verification Workflow

1. Deploy headers in **report-only** mode where supported (`Content-Security-Policy-Report-Only`)
2. Watch reports for 1–2 weeks; tighten policy
3. Promote to enforcing mode
4. Re-test with [Header Analyzer](/tools/header-analyzer/) and Mozilla Observatory
5. Document baseline; any future deviation requires a ticket

## Score Targets

| Tool                        | Minimum                      | Target                               |
| --------------------------- | ---------------------------- | ------------------------------------ |
| Mozilla Observatory         | B+                           | A+                                   |
| securityheaders.com         | A                            | A+                                   |
| Header Analyzer (this site) | All required headers present | All required + no version disclosure |

---

**Reminder:** these headers do not replace input validation, output encoding, authentication, or authorization. They are defense-in-depth. Treat them as the cheapest 10% you must always have set.
