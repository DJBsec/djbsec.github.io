---
layout: default
permalink: /field-notes/
title: Field Notes
description: Practitioner-judgment posts on how cybersecurity actually plays out in small teams and small organizations.
nav: false
---

<div class="post">

<div class="news-masthead">
  <div class="news-masthead-inner">
    <div class="news-masthead-title">
      <span class="news-accent-line"></span>
      <h1>Field Notes</h1>
      <span class="news-divider">|</span>
      <p class="news-tagline">Judgment calls from real engagements</p>
    </div>
  </div>
</div>

<p class="learn-intro" style="max-width: 760px; margin: 1.5rem auto 2rem;">CyberNews tracks the daily threat landscape. <strong>Field Notes</strong> is the opposite — opinionated, slow-burn posts on how cybersecurity actually plays out when you are running a two-person IT team or starting a security program from scratch. Less news, more judgment.</p>

{% assign field_notes = site.posts | where: "categories", "Field Notes" | sort: "date" | reverse %}

{% if field_notes.size == 0 %}
<p class="learn-intro" style="text-align: center;">No field notes yet — check back soon.</p>
{% else %}

<div class="news-grid">
{% for post in field_notes %}
{% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
<div class="news-card">
{% if post.thumbnail %}<div class="news-card-img"><img src="{{ post.thumbnail | relative_url }}" alt="{{ post.title }}"></div>{% endif %}
<div class="news-card-body">
<span class="news-badge news-badge--cat">Field Notes</span>
{% if post.tags and post.tags.size > 0 %}
  {% for tag in post.tags %}
    <a class="news-badge news-badge--tag" href="{{ tag | slugify | prepend: '/cybernews/tag/' | relative_url }}" onclick="event.stopPropagation()"><i class="fa-solid fa-hashtag fa-xs"></i> {{ tag }}</a>
  {% endfor %}
{% endif %}
<h3 class="news-card-title">{{ post.title }}</h3>
{% if post.description %}
<p class="news-card-excerpt">{{ post.description }}</p>
{% endif %}
<div class="news-card-meta">
{{ post.date | date: "%b %d, %Y" }} &middot; {{ read_time }} min read
</div>
<a class="stretched-link" href="{{ post.url | relative_url }}"></a>
</div>
</div>
{% endfor %}
</div>

{% endif %}

</div>
