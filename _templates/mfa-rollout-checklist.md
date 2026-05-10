---
layout: page
title: MFA Rollout Checklist
permalink: /templates/mfa-rollout-checklist/
description: Phased MFA rollout plan — privileged accounts, identity provider, VPN, SaaS, and customer-facing apps — with factor priorities, common pitfalls, and maintenance cadence.
category: identity
template_slug: mfa-rollout-checklist
---

<div class="tpl-actions">
  <a class="btn btn-sm btn-djb-secondary" href="{{ '/assets/pdf/templates/mfa-rollout-checklist.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer">Download PDF &darr;</a>
  <button class="btn btn-sm btn-djb-secondary" type="button" data-tpl-copy>Copy as Markdown</button>
  <span class="tpl-copy-feedback mono" data-tpl-copy-feedback></span>
</div>

{% capture md %}{% include templates/mfa-rollout-checklist.md %}{% endcapture %}
{{ md | markdownify }}
<textarea hidden id="tpl-md-source" readonly>{{ md }}</textarea>

<script defer src="{{ '/assets/js/template-copy.js' | relative_url }}"></script>
