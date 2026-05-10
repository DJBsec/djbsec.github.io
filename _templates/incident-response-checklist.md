---
layout: page
title: Incident Response Checklist
permalink: /templates/incident-response-checklist/
description: Working checklist for the SANS / NIST PICERL incident response lifecycle — preparation, identification, containment, eradication, recovery, lessons learned.
category: incident-response
template_slug: incident-response-checklist
---

<div class="tpl-actions">
  <a class="btn btn-sm btn-djb-secondary" href="{{ '/assets/pdf/templates/incident-response-checklist.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer">Download PDF &darr;</a>
  <button class="btn btn-sm btn-djb-secondary" type="button" data-tpl-copy>Copy as Markdown</button>
  <span class="tpl-copy-feedback mono" data-tpl-copy-feedback></span>
</div>

{% capture md %}{% include templates/incident-response-checklist.md %}{% endcapture %}
{{ md | markdownify }}
<textarea hidden id="tpl-md-source" readonly>{{ md }}</textarea>

<script defer src="{{ '/assets/js/template-copy.js' | relative_url }}"></script>
