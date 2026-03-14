---
layout: default
permalink: /blog/
title: News
nav: true
nav_order: 1
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 6
  sort_field: date
  sort_reverse: true
  trail:
    before: 1 # The number of links before the current page
    after: 3 # The number of links after the current page
---

<div class="post">

{% assign blog_name_size = site.blog_name | size %}
{% assign blog_description_size = site.blog_description | size %}

{% if blog_name_size > 0 or blog_description_size > 0 %}

<div class="news-masthead">
  <div class="news-masthead-inner">
    <div class="news-masthead-title">
      <span class="news-accent-line"></span>
      <h1>{{ site.blog_name }}</h1>
      {% if blog_description_size > 0 %}
      <span class="news-divider">|</span>
      <p class="news-tagline">{{ site.blog_description }}</p>
      {% endif %}
    </div>
  </div>
</div>
{% endif %}

{% if site.display_tags and site.display_tags.size > 0 or site.display_categories and site.display_categories.size > 0 %}

<div class="news-filter-bar">
  {% for tag in site.display_tags %}
    <a class="news-pill" href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">
      <i class="fa-solid fa-hashtag fa-xs"></i> {{ tag }}
    </a>
  {% endfor %}
  {% for category in site.display_categories %}
    <a class="news-pill news-pill--category" href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">
      <i class="fa-solid fa-tag fa-xs"></i> {{ category }}
    </a>
  {% endfor %}
</div>
{% endif %}

{% assign sorted_posts = site.posts | sort: "date" | reverse %}
{% assign hero_post = sorted_posts[0] %}
{% assign secondary_posts = sorted_posts | slice: 1, 2 %}

{% if hero_post %}

<div class="news-featured-section">

{% if hero_post.external_source == blank %}
{% assign hero_read_time = hero_post.content | number_of_words | divided_by: 180 | plus: 1 %}
{% else %}
{% assign hero_read_time = hero_post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
{% endif %}

  <a class="news-hero-card" href="{{ hero_post.url | relative_url }}">
    {% if hero_post.thumbnail %}
    <div class="news-hero-img">
      <img src="{{ hero_post.thumbnail | relative_url }}" alt="{{ hero_post.title }}">
    </div>
    {% endif %}
    <div class="news-hero-body">
      <span class="news-badge news-badge--featured">Latest</span>
      <h2 class="news-hero-title">{{ hero_post.title }}</h2>
      {% if hero_post.description %}
      <p class="news-hero-excerpt">{{ hero_post.description }}</p>
      {% endif %}
      <div class="news-meta">
        <i class="fa-solid fa-calendar fa-xs"></i> {{ hero_post.date | date: "%b %d, %Y" }}
        &middot; {{ hero_read_time }} min read
      </div>
    </div>
  </a>

  <div class="news-secondary-stack">
    {% for post in secondary_posts %}
    {% if post.external_source == blank %}
      {% assign sec_read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
    {% else %}
      {% assign sec_read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
    {% endif %}
    <a class="news-secondary-card" href="{{ post.url | relative_url }}">
      {% if post.thumbnail %}
      <div class="news-secondary-img">
        <img src="{{ post.thumbnail | relative_url }}" alt="{{ post.title }}">
      </div>
      {% endif %}
      <div class="news-secondary-body">
        <h3>{{ post.title }}</h3>
        {% if post.description %}
        <p class="news-secondary-excerpt">{{ post.description }}</p>
        {% endif %}
        <div class="news-meta">{{ post.date | date: "%b %d, %Y" }} &middot; {{ sec_read_time }} min read</div>
      </div>
    </a>
    {% endfor %}
  </div>

</div>
{% endif %}

<div class="news-section-header">
  <span class="news-section-label">Latest Intelligence</span>
  <span class="news-section-line"></span>
</div>

<div class="news-grid">

{% if page.pagination.enabled %}
{% assign postlist = paginator.posts %}
{% else %}
{% assign postlist = site.posts %}
{% endif %}

{% for post in postlist %}

{% if post.external_source == blank %}
{% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
{% else %}
{% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
{% endif %}

{% if post.redirect == blank %}
{% assign post_url = post.url | relative_url %}
{% elsif post.redirect contains '://' %}
{% assign post_url = post.redirect %}
{% else %}
{% assign post_url = post.redirect | relative_url %}
{% endif %}

<div class="news-card">
{% if post.thumbnail %}<div class="news-card-img"><img src="{{ post.thumbnail | relative_url }}" alt="{{ post.title }}"></div>{% endif %}
<div class="news-card-body">
{% assign post_categories = post.categories | join: "" %}
{% if post_categories != "" %}
<span class="news-badge news-badge--cat">{{ post.categories[0] }}</span>
{% endif %}
{% if post.tags and post.tags.size > 0 %}
  {% for tag in post.tags %}
    <a class="news-badge news-badge--tag" href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}" onclick="event.stopPropagation()"><i class="fa-solid fa-hashtag fa-xs"></i> {{ tag }}</a>
  {% endfor %}
{% endif %}
<h3 class="news-card-title">{{ post.title }}</h3>
{% if post.description %}
<p class="news-card-excerpt">{{ post.description }}</p>
{% endif %}
<div class="news-card-meta">
{{ post.date | date: "%b %d, %Y" }} &middot; {{ read_time }} min read
</div>
<a class="stretched-link" href="{{ post_url }}"{% if post.redirect contains '://' %} target="_blank" rel="noopener"{% endif %}></a>
</div>
</div>

{% endfor %}

</div>

{% if page.pagination.enabled %}
{% include pagination.liquid %}
{% endif %}

</div>
