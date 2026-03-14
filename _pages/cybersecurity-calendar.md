---
layout: page
title: Calendar
permalink: /cybersecurity-calendar/
description: "US cybersecurity conferences for 2026 — dates, locations, and travel cost estimates from Houston (HOU)."
nav: true
nav_order: 2
---

<div class="row justify-content-center">
<div class="col-lg-11">

<!-- Filter bar -->
<div class="cal-filter-bar">
  <div class="cal-filter-row">
    <input type="text" id="cal-search" class="cal-search-input"
           placeholder="Search conferences, cities, categories…" aria-label="Search conferences" />
    <select id="cal-filter-state" class="cal-select" aria-label="Filter by state">
      <option value="">All States</option>
    </select>
    <select id="cal-filter-category" class="cal-select" aria-label="Filter by category">
      <option value="">All Categories</option>
      <option value="hacking">Hacking</option>
      <option value="enterprise">Enterprise</option>
      <option value="training">Training</option>
      <option value="community">Community</option>
    </select>
    <div class="cal-view-toggle">
      <button id="cal-view-grid" class="cal-view-btn active" aria-pressed="true">
        &#9783; Grid
      </button>
      <button id="cal-view-agenda" class="cal-view-btn" aria-pressed="false">
        &#9776; Agenda
      </button>
    </div>
  </div>
</div>

<!-- Active filter chips -->
<div id="cal-chips" class="cal-chip-bar" aria-live="polite"></div>

<!-- Result count -->
<div id="cal-count" class="cal-result-count"></div>

<!-- Calendar output -->
<div id="cal-output"></div>

<!-- Conference quick-view modal -->
{% include conference-modal.html %}

<!-- Conference data injected via Liquid (XSS-safe via jsonify) -->
<script id="cal-data" type="application/json">
[{% for conf in site.data.cybersecurity_calendar %}{"id":{{ conf.id | jsonify }},"name":{{ conf.name | jsonify }},"slug":{{ conf.slug | jsonify }},"short_description":{{ conf.short_description | jsonify }},"start_date":{{ conf.start_date | jsonify }},"end_date":{{ conf.end_date | jsonify }},"city":{{ conf.city | jsonify }},"state":{{ conf.state | jsonify }},"venue":{{ conf.venue | jsonify }},"website_url":{{ conf.website_url | jsonify }},"cfp_url":{{ conf.cfp_url | jsonify }},"category_tags":{{ conf.category_tags | jsonify }},"registration_cost_min":{{ conf.registration_cost_min | default: 0 }},"registration_cost_max":{{ conf.registration_cost_max | default: 0 }},"registration_cost_notes":{{ conf.registration_cost_notes | jsonify }},"is_estimated_pricing":{{ conf.is_estimated_pricing | jsonify }},"airfare_cost_min":{{ conf.airfare_cost_min | default: 0 }},"airfare_cost_max":{{ conf.airfare_cost_max | default: 0 }},"airfare_cost_notes":{{ conf.airfare_cost_notes | jsonify }},"hotel_cost_min":{{ conf.hotel_cost_min | default: 0 }},"hotel_cost_max":{{ conf.hotel_cost_max | default: 0 }},"hotel_cost_notes":{{ conf.hotel_cost_notes | jsonify }},"total_cost_min":{{ conf.total_cost_min | default: 0 }},"total_cost_max":{{ conf.total_cost_max | default: 0 }},"conference_nights":{{ conf.conference_nights | default: 1 }},"data_confidence":{{ conf.data_confidence | jsonify }}}{% unless forloop.last %},{% endunless %}{% endfor %}]
</script>

</div>
</div>

<script>
  // Base path for detail page links — consumed by cybersecurity-calendar.js
  window.calendarBasePath = "{{ '/cybersecurity-calendar/' | relative_url }}";
</script>
<script src="{{ '/assets/js/airfare-data.js' | relative_url }}"></script>
<script src="{{ '/assets/js/cybersecurity-calendar.js' | relative_url }}"></script>
