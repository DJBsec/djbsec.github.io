---
layout: page
title: Tools
permalink: /tools/
description: Every tool on the site, grouped by use case — vulnerability management, web security, OSINT, forensics, threat mapping, and AI.
nav: true
nav_order: 4
dropdown: true
children:
  - title: All Tools
    permalink: /tools/
  - title: divider
  - title: EPSS Scanner
    permalink: /epss/
  - title: Blue Team
    permalink: /blue-team/
  - title: divider
  - title: AI Tools & Prompts
    permalink: /ai-tools-prompts/
---

<div class="row">
  <div class="col-12">

<p class="page-eyebrow">Toolkit</p>

<h2>All Tools</h2>

<p class="tools-landing-intro">Every tool on the site, grouped by what it helps you do. Want defender-focused workflow guidance? Start at <a href="{{ '/blue-team/' | relative_url }}">Blue Team</a>. New to security? Try the <a href="{{ '/start/' | relative_url }}">guided learning paths</a>.</p>

<nav class="tools-toc" aria-label="Tool groups">
  {% for group in site.data.tools %}
  <a class="tools-toc__chip" href="#{{ group.slug }}">{{ group.group }}</a>
  {% endfor %}
</nav>

{% for group in site.data.tools %}

<section class="tools-group" id="{{ group.slug }}">
  <header class="tools-group__head">
    <h3 class="tools-group__title">
      <i class="ti ti-{{ group.icon | default: 'tool' }}" aria-hidden="true"></i>
      {{ group.group }}
    </h3>
    {% if group.description %}<p class="tools-group__desc">{{ group.description }}</p>{% endif %}
  </header>

  <div class="tools-grid">
    {% for tool in group.tools %}
    <article class="djb-card djb-card--accent-left tools-card tools-card--{{ tool.status | default: 'active' }}">
      <div class="tools-card__head">
        <h4 class="djb-card__title tools-card__title">{{ tool.name }}</h4>
        {% if tool.status == 'planned' %}
        <span class="chip chip--secondary tools-card__chip">In dev</span>
        {% endif %}
      </div>
      <p class="djb-card__desc tools-card__desc">{{ tool.description }}</p>
      <div class="tools-card__cta">
        {% if tool.status == 'planned' %}
          <em class="text-muted">{{ tool.action | default: 'Coming soon' }}</em>
        {% elsif tool.external %}
          <a href="{{ tool.url }}" class="btn btn-sm btn-djb-secondary" target="_blank" rel="noopener noreferrer">{{ tool.action | default: 'Open' }} &rarr;</a>
        {% else %}
          <a href="{{ tool.url | relative_url }}" class="btn btn-sm btn-djb-secondary">{{ tool.action | default: 'Launch' }} &rarr;</a>
        {% endif %}
      </div>
    </article>
    {% endfor %}
  </div>
</section>
{% endfor %}

  </div>
</div>
