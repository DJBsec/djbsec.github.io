---
layout: page
title: Executive Cyber Briefing
permalink: /templates/executive-cyber-briefing/
description: Two-page monthly or quarterly cybersecurity briefing template for non-technical executives, board members, and business owners.
category: governance
template_slug: executive-cyber-briefing
---

<div class="tpl-actions">
  <a class="btn btn-sm btn-djb-secondary" href="{{ '/assets/pdf/templates/executive-cyber-briefing.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer">Download PDF &darr;</a>
  <button class="btn btn-sm btn-djb-secondary" type="button" data-tpl-copy>Copy as Markdown</button>
  <span class="tpl-copy-feedback mono" data-tpl-copy-feedback></span>
</div>

{% capture md %}{% include templates/executive-cyber-briefing.md %}{% endcapture %}
{{ md | markdownify }}
<textarea hidden id="tpl-md-source" readonly>{{ md }}</textarea>

<script defer src="{{ '/assets/js/template-copy.js' | relative_url }}"></script>
