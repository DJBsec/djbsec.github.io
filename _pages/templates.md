---
layout: page
title: Templates
permalink: /templates/
description: Practical security artifacts — incident response, vulnerability triage, headers, executive briefings, MFA rollout. Markdown source plus PDF download.
nav: false
---

<div class="row justify-content-center">
  <div class="col-lg-10">

<p class="page-eyebrow">Downloads</p>

<h2>Templates &amp; Checklists</h2>

<p class="learn-intro">Practical artifacts to drop into a runbook, ticket, or board pack. Each template ships as Markdown (copy to clipboard or paste into Confluence/Notion) and as a printable PDF.</p>

<div class="tpl-toc">
  {% assign sorted_templates = site.templates | sort: "title" %}
  {% for tpl in sorted_templates %}
  <article class="djb-card djb-card--accent-left tpl-card">
    <p class="tpl-card__meta">{{ tpl.category | replace: '-', ' ' | capitalize }}</p>
    <h3 class="tpl-card__title">{{ tpl.title }}</h3>
    <p class="tpl-card__desc">{{ tpl.description }}</p>
    <div class="tpl-card__actions">
      <a class="btn btn-sm btn-djb-secondary" href="{{ tpl.url | relative_url }}">Open &rarr;</a>
      <a class="btn btn-sm btn-djb-secondary" href="{{ '/assets/pdf/templates/' | append: tpl.template_slug | append: '.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer">PDF &darr;</a>
    </div>
  </article>
  {% endfor %}
</div>

<p class="learn-intro" style="margin-top: 2rem;"><strong>Source:</strong> templates are versioned at <a href="https://github.com/djbsec/djbsec.github.io/tree/main/_includes/templates">github.com/djbsec/djbsec.github.io</a>. Spot something to improve? Open an issue or PR.</p>

  </div>
</div>
