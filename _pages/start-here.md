---
layout: page
title: Start Here
permalink: /start/
description: Guided learning paths — pick the one that matches you and follow the steps in order.
nav: true
nav_order: 2
---

<div class="row justify-content-center">
  <div class="col-lg-10">

<p class="page-eyebrow">Guided</p>

<h2>Pick your path</h2>

<p class="learn-intro">The site has 30+ explainers and a half-dozen tools. Without a path, that's a maze. These four routes are sequenced for a specific kind of reader. Pick the closest match — you can switch later.</p>

<div class="learn-grid">
  {% for path in site.data.learning_paths %}
  <a class="djb-card djb-card--accent-left path-card" href="#{{ path.id }}">
    <span class="path-card__icon" aria-hidden="true"><i class="ti ti-{{ path.icon | default: 'route' }}"></i></span>
    <h3 class="path-card__title">{{ path.title }}</h3>
    <p class="path-card__audience">{{ path.audience }}</p>
    <p class="path-card__desc">{{ path.description }}</p>
    <span class="path-card__cta">Start &rarr;</span>
  </a>
  {% endfor %}
</div>

{% for path in site.data.learning_paths %}
<section class="learn-path" id="{{ path.id }}">
  <header class="learn-path__header">
    <p class="learn-path__audience">{{ path.audience }}</p>
    <h3 class="learn-path__title">{{ path.title }}</h3>
    <p class="learn-path__desc">
      <strong>Goal:</strong> {{ path.goal }}<br>
      <strong>Time:</strong> {{ path.duration }}
    </p>
  </header>

  {% for step in path.steps %}
  <div class="learn-step">
    <span class="learn-step__num" aria-hidden="true">{{ forloop.index }}</span>
    <div class="learn-step__body">
      <p class="learn-step__kind">{{ step.kind | capitalize }}</p>
      <h4 class="learn-step__title">
        {% if step.url %}
          {% if step.kind == 'external' %}
          <a href="{{ step.url }}" target="_blank" rel="noopener noreferrer">{{ step.title }} &rarr;</a>
          {% else %}
          <a href="{{ step.url | relative_url }}">{{ step.title }}</a>
          {% endif %}
        {% else %}
          {{ step.title }}
        {% endif %}
      </h4>
      {% if step.desc %}<p class="learn-step__desc">{{ step.desc }}</p>{% endif %}
    </div>
  </div>
  {% endfor %}
</section>
{% endfor %}

  </div>
</div>
