---
layout: page
title: Cybersecurity Explained
permalink: /explained/
description: Breaking down complex security topics into plain language — no technical background required.
nav: false
---

{% assign sorted_topics = site.explained | sort: "title" %}
{% assign threat_count = site.explained | where: "topic_type", "threat" | size %}
{% assign defense_count = site.explained | where: "topic_type", "defense" | size %}
{% assign tools_count = site.explained | where: "topic_type", "tools" | size %}
{% assign concepts_count = site.explained | where: "topic_type", "concepts" | size %}
{% assign total_count = site.explained | size %}

<div class="explained-directory">

  <div class="explained-toolbar">
    <div class="explained-filter-bar">
      <button class="explained-filter-btn active" data-filter="all" onclick="filterExplained('all', this)">
        All <span class="explained-filter-count">{{ total_count }}</span>
      </button>
      <button class="explained-filter-btn threat" data-filter="threat" onclick="filterExplained('threat', this)">
        Threats <span class="explained-filter-count">{{ threat_count }}</span>
      </button>
      <button class="explained-filter-btn defense" data-filter="defense" onclick="filterExplained('defense', this)">
        Defense <span class="explained-filter-count">{{ defense_count }}</span>
      </button>
      <button class="explained-filter-btn tools" data-filter="tools" onclick="filterExplained('tools', this)">
        Tools <span class="explained-filter-count">{{ tools_count }}</span>
      </button>
      <button class="explained-filter-btn concepts" data-filter="concepts" onclick="filterExplained('concepts', this)">
        Concepts <span class="explained-filter-count">{{ concepts_count }}</span>
      </button>
    </div>

    <button class="explained-sort-btn" id="explained-sort-btn" onclick="toggleSort(this)" title="Toggle sort order">
      <i class="ti ti-arrows-sort"></i>
      <span id="explained-sort-label">A–Z</span>
    </button>

  </div>

  <p class="explained-results-meta eyebrow" id="explained-meta">
    <strong>{{ total_count }}</strong> topics
  </p>

  <div class="explained-list" id="explained-list">
    {% for item in sorted_topics %}
    <a class="explained-item"
       data-cat="{{ item.topic_type | default: 'defense' }}"
       data-title="{{ item.title }}"
       data-order="{{ item.topic_type | default: 'defense' }}"
       href="{{ item.url | relative_url }}">
      <div class="explained-icon">
        <i class="ti ti-{{ item.icon | default: 'shield' }}"></i>
      </div>
      <div class="explained-content">
        <div class="explained-title">{{ item.title }}</div>
        <div class="explained-desc">{{ item.description }}</div>
      </div>
      <div class="explained-meta">
        <span class="explained-badge">{{ item.topic_type | capitalize | default: 'Defense' }}</span>
        <i class="ti ti-arrow-right explained-arrow"></i>
      </div>
    </a>
    {% endfor %}
  </div>

</div>

<script>
  var currentFilter = 'all';
  var currentSort   = 'alpha';  // 'alpha' | 'category'
  var catOrder      = { threat: 0, defense: 1, tools: 2, concepts: 3 };

  function filterExplained(cat, btn) {
    currentFilter = cat;
    document.querySelectorAll('.explained-filter-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    applyFilterAndCount();
  }

  function toggleSort(btn) {
    currentSort = currentSort === 'alpha' ? 'category' : 'alpha';
    document.getElementById('explained-sort-label').textContent =
      currentSort === 'alpha' ? 'A–Z' : 'Category';
    btn.classList.toggle('active', currentSort === 'category');
    sortList();
    applyFilterAndCount();
  }

  function sortList() {
    var list  = document.getElementById('explained-list');
    var items = Array.from(list.querySelectorAll('.explained-item'));

    items.sort(function(a, b) {
      if (currentSort === 'category') {
        var catA = catOrder[a.dataset.cat] !== undefined ? catOrder[a.dataset.cat] : 99;
        var catB = catOrder[b.dataset.cat] !== undefined ? catOrder[b.dataset.cat] : 99;
        if (catA !== catB) return catA - catB;
      }
      return a.dataset.title.localeCompare(b.dataset.title);
    });

    items.forEach(function(item) { list.appendChild(item); });
  }

  function applyFilterAndCount() {
    var items = Array.from(document.querySelectorAll('.explained-item'));
    var count = 0;

    items.forEach(function(item) {
      var show = currentFilter === 'all' || item.dataset.cat === currentFilter;
      item.classList.toggle('explained-hidden', !show);
      if (show) count++;
    });

    document.getElementById('explained-meta').innerHTML =
      '<strong>' + count + '</strong> topic' + (count !== 1 ? 's' : '');

    fixCorners();
  }

  function fixCorners() {
    var items   = Array.from(document.querySelectorAll('.explained-item'));
    var visible = items.filter(function(i) { return !i.classList.contains('explained-hidden'); });

    items.forEach(function(i) {
      i.style.borderRadius = '';
      i.style.borderBottom = '';
    });
    if (visible.length === 0) return;

    visible[0].style.borderTopLeftRadius  = '8px';
    visible[0].style.borderTopRightRadius = '8px';
    if (visible.length === 1) {
      visible[0].style.borderBottomLeftRadius  = '8px';
      visible[0].style.borderBottomRightRadius = '8px';
    } else {
      visible[visible.length - 1].style.borderBottomLeftRadius  = '8px';
      visible[visible.length - 1].style.borderBottomRightRadius = '8px';
      visible[visible.length - 1].style.borderBottom = 'none';
    }
  }
</script>
