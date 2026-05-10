---
layout: page
title: HTTP Security Headers Checklist
permalink: /templates/security-headers-checklist/
description: Production-ready checklist of HTTP security headers — HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, cookie flags, and headers to remove.
category: web-security
template_slug: security-headers-checklist
---

<div class="tpl-actions">
  <a class="btn btn-sm btn-djb-secondary" href="{{ '/assets/pdf/templates/security-headers-checklist.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer">Download PDF &darr;</a>
  <button class="btn btn-sm btn-djb-secondary" type="button" data-tpl-copy>Copy as Markdown</button>
  <span class="tpl-copy-feedback mono" data-tpl-copy-feedback></span>
</div>

{% capture md %}{% include templates/security-headers-checklist.md %}{% endcapture %}
{{ md | markdownify }}
<textarea hidden id="tpl-md-source" readonly>{{ md }}</textarea>

<script defer src="{{ '/assets/js/template-copy.js' | relative_url }}"></script>
