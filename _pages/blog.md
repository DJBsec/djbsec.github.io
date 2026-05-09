---
layout: default
permalink: /blog/
title: Blog
description: Thoughts on cybersecurity, mentorship, and industry happenings.
nav: true
nav_order: 1
---

<div class="post">

<div class="news-masthead">
  <div class="news-masthead-inner">
    <div class="news-masthead-title">
      <span class="news-accent-line"></span>
      <h1>Blog</h1>
      <span class="news-divider">|</span>
      <p class="news-tagline">Thoughts on cybersecurity, mentorship, and industry happenings.</p>
    </div>
  </div>
</div>

{% assign posts = site.blog | sort: 'date' | reverse %}

<div class="news-section-header">
  <span class="news-section-label">Recent Posts</span>
  <span class="news-section-line"></span>
</div>

<div class="news-grid">
  {% for post in posts %}
    {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
    <div class="news-card">
      {% if post.thumbnail %}
        <div class="news-card-img"><img src="{{ post.thumbnail | relative_url }}" alt="{{ post.title | escape }}"></div>
      {% endif %}
      <div class="news-card-body">
        {% if post.tags and post.tags.size > 0 %}
          {% for tag in post.tags %}
            <span class="news-badge news-badge--tag"><i class="fa-solid fa-hashtag fa-xs"></i> {{ tag | escape }}</span>
          {% endfor %}
        {% endif %}
        <h3 class="news-card-title">{{ post.title | escape }}</h3>
        {% if post.description %}
          <p class="news-card-excerpt">{{ post.description | escape }}</p>
        {% endif %}
        <div class="news-card-meta">
          {{ post.date | date: "%b %d, %Y" }} &middot; {{ read_time }} min read
        </div>
        <a class="stretched-link" href="{{ post.url | relative_url }}"></a>
      </div>
    </div>
  {% endfor %}
  {% if posts.size == 0 %}
    <p>No posts yet — check back soon.</p>
  {% endif %}
</div>

</div>
