---
layout: page
title: Roadmap
permalink: /roadmap/
description: What's been shipped and what's on the backlog — a public view of where this site is headed.
nav: true
nav_order: 7
---

<div class="row">
  <div class="col-12">

<p class="page-eyebrow">Roadmap</p>

<h2>What's shipped & what's next</h2>

<p class="tools-landing-intro">A public view of the backlog. Below is what's currently in progress or planned, followed by a log of what's already shipped. Last updated {{ site.data.roadmap.updated }}.</p>

<section class="roadmap-section" aria-labelledby="roadmap-planned">
  <h3 id="roadmap-planned" class="tools-group__title" style="margin-top: 8px;">
    <i class="ti ti-list-check" aria-hidden="true"></i> On the backlog
  </h3>

  <div class="tools-grid">
    {% for item in site.data.roadmap.planned %}
    <article class="djb-card djb-card--accent-left">
      <div class="tools-card__head">
        <h4 class="djb-card__title">{{ item.title | escape }}</h4>
        {% if item.status == 'in-progress' %}
        <span class="chip" style="background: var(--color-severity-high); color: var(--color-surface);">In progress</span>
        {% else %}
        <span class="chip chip--secondary">Planned</span>
        {% endif %}
      </div>
      <p class="djb-card__desc">{{ item.description | escape }}</p>
      {% if item.area or item.link %}
      <div class="tools-card__cta">
        {% if item.area %}<span class="chip chip--secondary">{{ item.area | escape }}</span>{% endif %}
        {% if item.link %}<a href="{{ item.link | relative_url }}" class="btn btn-sm btn-djb-secondary" style="margin-left: 8px;">Related &rarr;</a>{% endif %}
      </div>
      {% endif %}
    </article>
    {% endfor %}
  </div>
</section>

<section class="roadmap-section" aria-labelledby="roadmap-shipped" style="margin-top: 40px;">
  <h3 id="roadmap-shipped" class="tools-group__title">
    <i class="ti ti-check" aria-hidden="true"></i> Shipped
  </h3>

  <div class="table-responsive">
    <table class="table table-hover page-token-table mb-0">
      <thead class="thead-dark">
        <tr>
          <th style="width: 14%;">When</th>
          <th style="width: 24%;">Feature</th>
          <th style="width: 50%;">What it does</th>
          <th style="width: 12%;">Link</th>
        </tr>
      </thead>
      <tbody>
        {% for item in site.data.roadmap.shipped %}
        <tr>
          <td><span class="chip" style="background: var(--color-severity-low); color: var(--color-surface);">{{ item.date | escape }}</span></td>
          <td><strong>{{ item.title | escape }}</strong>{% if item.area %}<br><span class="chip chip--secondary">{{ item.area | escape }}</span>{% endif %}</td>
          <td>{{ item.description | escape }}</td>
          <td>
            {% if item.link %}<a href="{{ item.link | relative_url }}" class="btn btn-sm btn-djb-secondary">View</a>{% else %}<span class="text-muted">&mdash;</span>{% endif %}
          </td>
        </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</section>

  </div>
</div>
