(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  function esc(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseDate(str) {
    if (!str) return null;
    var parts = str.split("-");
    if (parts.length !== 3) return null;
    return new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
  }

  var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  var DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function formatDateRange(startStr, endStr) {
    var s = parseDate(startStr);
    var e = parseDate(endStr);
    if (!s) return startStr || "";
    var sMonth = MONTH_NAMES[s.getMonth()].slice(0, 3);
    if (!e || startStr === endStr) {
      return sMonth + " " + s.getDate() + ", " + s.getFullYear();
    }
    var eMonth = MONTH_NAMES[e.getMonth()].slice(0, 3);
    if (s.getMonth() === e.getMonth()) {
      return sMonth + " " + s.getDate() + "\u2013" + e.getDate() + ", " + e.getFullYear();
    }
    return sMonth + " " + s.getDate() + " \u2013 " + eMonth + " " + e.getDate() + ", " + e.getFullYear();
  }

  function formatCostRange(min, max) {
    if (min === max) return "$" + min;
    return "$" + min + "\u2013$" + max;
  }

  function zeroPad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function toDateStr(year, month, day) {
    return year + "-" + zeroPad(month + 1) + "-" + zeroPad(day);
  }

  // Category → CSS data-cat attribute value
  // When a conference spans multiple categories, pick the first or use "mixed"
  function primaryCat(conf) {
    var tags = conf.category_tags;
    if (!tags || tags.length === 0) return "";
    return tags[0];
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  var state = {
    view: "grid",           // "grid" | "agenda"
    currentYear: 2026,
    currentMonth: 2,        // 0-indexed; clamped to 2–11 (Mar–Dec)
    search: "",
    filterState: "",
    filterCategory: "",
    conferences: [],
  };

  var MIN_MONTH = 2;  // March
  var MAX_MONTH = 11; // December

  // ---------------------------------------------------------------------------
  // Filter
  // ---------------------------------------------------------------------------
  function applyFilters(list) {
    var q = state.search.toLowerCase().trim();
    return list.filter(function (c) {
      if (q) {
        var haystack = [c.name, c.city, c.state, c.short_description]
          .concat(c.category_tags || [])
          .join(" ")
          .toLowerCase();
        if (haystack.indexOf(q) === -1) return false;
      }
      if (state.filterState && c.state !== state.filterState) return false;
      if (state.filterCategory) {
        var tags = c.category_tags || [];
        if (tags.indexOf(state.filterCategory) === -1) return false;
      }
      return true;
    });
  }

  // ---------------------------------------------------------------------------
  // Modal
  // ---------------------------------------------------------------------------
  var dropdownPopulated = false;

  function populateAirportDropdown() {
    if (dropdownPopulated) return;
    var select = document.getElementById("modal-airport-select");
    if (!select || !window.AIRFARE_DATA) return;

    var regionLabels = {
      south:     "South / Southwest",
      northeast: "Northeast",
      southeast: "Southeast",
      midwest:   "Midwest",
      mountain:  "Mountain",
      pacific:   "Pacific",
    };
    var groups = {};
    var airports = window.AIRFARE_DATA.airports;
    Object.keys(airports).forEach(function (iata) {
      var ap = airports[iata];
      if (!groups[ap.region]) groups[ap.region] = [];
      groups[ap.region].push({ iata: iata, ap: ap });
    });

    // Sort regions in display order
    var regionOrder = ["south","northeast","southeast","midwest","mountain","pacific"];
    regionOrder.forEach(function (region) {
      if (!groups[region]) return;
      var optgroup = document.createElement("optgroup");
      optgroup.label = regionLabels[region] || region;
      groups[region].sort(function (a, b) { return a.iata < b.iata ? -1 : 1; });
      groups[region].forEach(function (item) {
        var opt = document.createElement("option");
        opt.value = item.iata;
        opt.textContent = item.iata + " \u2014 " + item.ap.name + ", " + item.ap.state;
        optgroup.appendChild(opt);
      });
      select.appendChild(optgroup);
    });

    // "Other" optgroup at end
    var otherGroup = document.createElement("optgroup");
    otherGroup.label = "Other";
    var otherOpt = document.createElement("option");
    otherOpt.value = "__other__";
    otherOpt.textContent = "\u270f\ufe0f Enter my airport code\u2026";
    otherGroup.appendChild(otherOpt);
    select.appendChild(otherGroup);

    dropdownPopulated = true;
  }

  function getModalCosts(conf, iata) {
    var airfare = null;
    if (window.AIRFARE_DATA) {
      airfare = window.AIRFARE_DATA.estimate(iata, conf.state);
    }
    var airMin = airfare ? airfare.min : (conf.airfare_cost_min || 0);
    var airMax = airfare ? airfare.max : (conf.airfare_cost_max || 0);
    var totalMin = (conf.registration_cost_min || 0) + airMin + (conf.hotel_cost_min || 0);
    var totalMax = (conf.registration_cost_max || 0) + airMax + (conf.hotel_cost_max || 0);

    var airLabel = document.getElementById("modal-airfare-label");
    if (airLabel) airLabel.textContent = "Airfare (" + (airfare ? iata : "HOU") + ")";

    var airEl = document.getElementById("modal-airfare");
    if (airEl) airEl.textContent = formatCostRange(airMin, airMax);

    var totalEl = document.getElementById("modal-total");
    if (totalEl) totalEl.textContent = formatCostRange(totalMin, totalMax) + " est.";
  }

  function populateModal(conf) {
    var setText = function (id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val || "";
    };

    setText("modal-name", conf.name);
    setText("modal-description", conf.short_description);
    setText("modal-dates", formatDateRange(conf.start_date, conf.end_date));
    setText("modal-location", (conf.city || "") + (conf.state ? ", " + conf.state : ""));
    setText("modal-venue", conf.venue && conf.venue !== "TBD" ? conf.venue : "\u2014");

    // Tags — rebuild badge list
    var tagsEl = document.getElementById("modal-tags");
    if (tagsEl) {
      tagsEl.textContent = "";
      var tags = conf.category_tags || [];
      tags.forEach(function (tag) {
        var badge = document.createElement("span");
        badge.className = "cal-tag-badge mr-1";
        badge.setAttribute("data-cat", tag);
        badge.textContent = tag;
        tagsEl.appendChild(badge);
      });
    }

    // Cost fields
    setText("modal-reg-cost", formatCostRange(conf.registration_cost_min || 0, conf.registration_cost_max || 0));
    setText("modal-airfare", formatCostRange(conf.airfare_cost_min || 0, conf.airfare_cost_max || 0));
    setText("modal-hotel", formatCostRange(conf.hotel_cost_min || 0, conf.hotel_cost_max || 0));
    setText("modal-total", formatCostRange(conf.total_cost_min || 0, conf.total_cost_max || 0) + " est.");

    // Links
    var detailLink = document.getElementById("modal-detail-link");
    if (detailLink) {
      detailLink.href = window.calendarBasePath + conf.slug + "/";
    }
    var websiteLink = document.getElementById("modal-website-link");
    if (websiteLink) {
      if (conf.website_url) {
        websiteLink.href = conf.website_url;
        websiteLink.style.display = "";
      } else {
        websiteLink.style.display = "none";
      }
    }

    // Airport selector setup
    populateAirportDropdown();

    var airportSelect = document.getElementById("modal-airport-select");
    var airportCustom = document.getElementById("modal-airport-custom");

    // Reset to HOU each time modal opens
    if (airportSelect) airportSelect.value = "HOU";
    if (airportCustom) { airportCustom.style.display = "none"; airportCustom.value = ""; }

    // Initial costs with HOU
    getModalCosts(conf, "HOU");

    // Bind change — must rebind each open to capture current conf
    if (airportSelect) {
      airportSelect.onchange = function () {
        var val = airportSelect.value;
        if (val === "__other__") {
          if (airportCustom) { airportCustom.style.display = ""; airportCustom.focus(); }
        } else {
          if (airportCustom) { airportCustom.style.display = "none"; airportCustom.value = ""; }
          getModalCosts(conf, val);
        }
      };
    }

    var customTimer = null;
    if (airportCustom) {
      airportCustom.oninput = function () {
        clearTimeout(customTimer);
        var typed = airportCustom.value.toUpperCase().trim().slice(0, 3);
        airportCustom.value = typed;
        customTimer = setTimeout(function () {
          if (typed.length === 3) {
            var result = window.AIRFARE_DATA ? window.AIRFARE_DATA.estimate(typed, conf.state) : null;
            if (!result) {
              // Unknown airport — fall back to HOU, show note
              getModalCosts(conf, "HOU");
              var airLabel = document.getElementById("modal-airfare-label");
              if (airLabel) airLabel.textContent = "Airfare (unknown \u2014 using HOU)";
            } else {
              getModalCosts(conf, typed);
            }
          }
        }, 400);
      };
    }
  }

  function openModal(conf) {
    populateModal(conf);
    if (window.jQuery) {
      jQuery("#conferenceModal").modal("show");
    }
  }

  // ---------------------------------------------------------------------------
  // Grid renderer
  // ---------------------------------------------------------------------------
  function buildGridCells(year, month) {
    var firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var cells = [];
    for (var i = 0; i < firstDay; i++) {
      cells.push(null); // leading empty
    }
    for (var d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }
    return cells;
  }

  function conferencesOnDate(filtered, dateStr) {
    return filtered.filter(function (c) {
      return c.start_date === dateStr;
    });
  }

  function renderGrid(container) {
    var filtered = applyFilters(state.conferences);
    var year = state.currentYear;
    var month = state.currentMonth;

    var frag = document.createDocumentFragment();

    // Month navigation
    var nav = document.createElement("div");
    nav.className = "cal-month-nav";

    var prevBtn = document.createElement("button");
    prevBtn.className = "cal-nav-btn";
    prevBtn.textContent = "\u2039 Prev";
    prevBtn.disabled = month <= MIN_MONTH;
    prevBtn.addEventListener("click", function () {
      if (state.currentMonth > MIN_MONTH) {
        state.currentMonth--;
        render(container);
      }
    });

    var title = document.createElement("h3");
    title.textContent = MONTH_NAMES[month] + " " + year;

    var nextBtn = document.createElement("button");
    nextBtn.className = "cal-nav-btn";
    nextBtn.textContent = "Next \u203a";
    nextBtn.disabled = month >= MAX_MONTH;
    nextBtn.addEventListener("click", function () {
      if (state.currentMonth < MAX_MONTH) {
        state.currentMonth++;
        render(container);
      }
    });

    nav.appendChild(prevBtn);
    nav.appendChild(title);
    nav.appendChild(nextBtn);
    frag.appendChild(nav);

    // Grid
    var grid = document.createElement("div");
    grid.className = "cal-grid";

    // Day headers
    DAY_ABBR.forEach(function (d) {
      var h = document.createElement("div");
      h.className = "cal-day-header";
      h.textContent = d;
      grid.appendChild(h);
    });

    var today = new Date();
    var todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
    var cells = buildGridCells(year, month);
    var MAX_CHIPS = 3;

    cells.forEach(function (day) {
      var cell = document.createElement("div");
      if (day === null) {
        cell.className = "cal-cell cal-cell-empty";
        grid.appendChild(cell);
        return;
      }

      var dateStr = toDateStr(year, month, day);
      cell.className = "cal-cell" + (dateStr === todayStr ? " cal-cell-today" : "");

      var dayLabel = document.createElement("div");
      dayLabel.className = "cal-cell-day";
      dayLabel.textContent = day;
      cell.appendChild(dayLabel);

      var confs = conferencesOnDate(filtered, dateStr);
      var shown = confs.slice(0, MAX_CHIPS);
      var overflow = confs.length - shown.length;

      shown.forEach(function (conf) {
        var chip = document.createElement("div");
        chip.className = "cal-conf-chip";
        chip.setAttribute("data-cat", primaryCat(conf));
        chip.setAttribute("title", conf.name);
        chip.textContent = conf.name;
        chip.setAttribute("tabindex", "0");
        chip.setAttribute("role", "button");
        chip.setAttribute("aria-label", conf.name + " — click for details");
        chip.addEventListener("click", function (e) {
          e.stopPropagation();
          openModal(conf);
        });
        chip.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(conf);
          }
        });
        cell.appendChild(chip);
      });

      if (overflow > 0) {
        var more = document.createElement("div");
        more.className = "cal-overflow-chip";
        more.textContent = "+" + overflow + " more";
        more.setAttribute("tabindex", "0");
        more.setAttribute("role", "button");
        // Show next conf on click
        more.addEventListener("click", function () {
          openModal(confs[MAX_CHIPS]);
        });
        cell.appendChild(more);
      }

      grid.appendChild(cell);
    });

    frag.appendChild(grid);
    container.innerHTML = "";
    container.appendChild(frag);
  }

  // ---------------------------------------------------------------------------
  // Agenda renderer
  // ---------------------------------------------------------------------------
  function renderAgenda(container) {
    var filtered = applyFilters(state.conferences);

    if (filtered.length === 0) {
      container.innerHTML = "";
      var noResults = document.createElement("div");
      noResults.className = "cal-no-results";
      noResults.textContent = "No conferences match your filters.";
      container.appendChild(noResults);
      return;
    }

    // Group by month
    var groups = {};
    var groupOrder = [];
    filtered.forEach(function (c) {
      var d = parseDate(c.start_date);
      if (!d) return;
      var key = d.getFullYear() + "-" + zeroPad(d.getMonth() + 1);
      var label = MONTH_NAMES[d.getMonth()] + " " + d.getFullYear();
      if (!groups[key]) {
        groups[key] = { label: label, items: [] };
        groupOrder.push(key);
      }
      groups[key].items.push(c);
    });

    var frag = document.createDocumentFragment();
    var agenda = document.createElement("div");
    agenda.className = "cal-agenda";

    groupOrder.forEach(function (key) {
      var group = groups[key];
      var section = document.createElement("div");
      section.className = "cal-agenda-month";

      var heading = document.createElement("h4");
      heading.textContent = group.label;
      section.appendChild(heading);

      group.items.forEach(function (conf) {
        var card = document.createElement("div");
        card.className = "cal-conf-card";
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", conf.name + " — " + conf.city + ", " + conf.state + " — click for details");

        // Header row
        var header = document.createElement("div");
        header.className = "cal-conf-card-header";

        var nameEl = document.createElement("span");
        nameEl.className = "cal-conf-card-name";
        nameEl.textContent = conf.name;

        var dateEl = document.createElement("span");
        dateEl.className = "cal-conf-card-date";
        dateEl.textContent = formatDateRange(conf.start_date, conf.end_date);

        header.appendChild(nameEl);
        header.appendChild(dateEl);

        // Body row
        var body = document.createElement("div");
        body.className = "cal-conf-card-body";

        var locEl = document.createElement("span");
        locEl.className = "cal-conf-card-location";
        locEl.textContent = "\uD83D\uDCCD " + conf.city + ", " + conf.state;

        var costEl = document.createElement("span");
        costEl.className = "cal-conf-card-cost";
        costEl.textContent = "$" + (conf.total_cost_min || 0) + "\u2013$" + (conf.total_cost_max || 0) + " est. total";

        body.appendChild(locEl);
        body.appendChild(costEl);

        // Tags row
        var tagsRow = document.createElement("div");
        tagsRow.className = "cal-conf-card-tags mt-1";

        var tags = conf.category_tags || [];
        tags.forEach(function (tag) {
          var badge = document.createElement("span");
          badge.className = "cal-tag-badge mr-1";
          badge.setAttribute("data-cat", tag);
          badge.textContent = tag;
          tagsRow.appendChild(badge);
        });

        card.appendChild(header);
        card.appendChild(body);
        card.appendChild(tagsRow);

        card.addEventListener("click", function () {
          openModal(conf);
        });
        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(conf);
          }
        });

        section.appendChild(card);
      });

      agenda.appendChild(section);
    });

    frag.appendChild(agenda);
    container.innerHTML = "";
    container.appendChild(frag);
  }

  // ---------------------------------------------------------------------------
  // Filter chips
  // ---------------------------------------------------------------------------
  function renderActiveFilterChips(chipsEl) {
    chipsEl.innerHTML = "";
    var chips = [];
    if (state.search) chips.push({ label: "Search: " + state.search, key: "search" });
    if (state.filterState) chips.push({ label: "State: " + state.filterState, key: "filterState" });
    if (state.filterCategory) chips.push({ label: "Category: " + state.filterCategory, key: "filterCategory" });

    chips.forEach(function (chip) {
      var el = document.createElement("span");
      el.className = "cal-chip";
      var txt = document.createTextNode(chip.label + " ");
      el.appendChild(txt);
      var dismiss = document.createElement("span");
      dismiss.className = "cal-chip-dismiss";
      dismiss.textContent = "\u00d7";
      dismiss.setAttribute("aria-label", "Remove filter");
      dismiss.addEventListener("click", function () {
        state[chip.key] = "";
        if (chip.key === "search") {
          var searchInput = document.getElementById("cal-search");
          if (searchInput) searchInput.value = "";
        }
        if (chip.key === "filterState") {
          var stateSelect = document.getElementById("cal-filter-state");
          if (stateSelect) stateSelect.value = "";
        }
        if (chip.key === "filterCategory") {
          var catSelect = document.getElementById("cal-filter-category");
          if (catSelect) catSelect.value = "";
        }
        render(document.getElementById("cal-output"));
      });
      el.appendChild(dismiss);
      chipsEl.appendChild(el);
    });
  }

  // ---------------------------------------------------------------------------
  // Result count
  // ---------------------------------------------------------------------------
  function updateResultCount(countEl) {
    var filtered = applyFilters(state.conferences);
    if (state.view === "agenda") {
      countEl.textContent = filtered.length + " conference" + (filtered.length !== 1 ? "s" : "") + " shown";
    } else {
      var monthConfs = filtered.filter(function (c) {
        var d = parseDate(c.start_date);
        return d && d.getFullYear() === state.currentYear && d.getMonth() === state.currentMonth;
      });
      countEl.textContent = monthConfs.length + " conference" + (monthConfs.length !== 1 ? "s" : "") + " in " + MONTH_NAMES[state.currentMonth];
    }
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------
  function render(container) {
    var chipsEl = document.getElementById("cal-chips");
    var countEl = document.getElementById("cal-count");
    if (chipsEl) renderActiveFilterChips(chipsEl);
    if (countEl) updateResultCount(countEl);

    if (state.view === "grid") {
      renderGrid(container);
    } else {
      renderAgenda(container);
    }
  }

  // ---------------------------------------------------------------------------
  // Bind controls
  // ---------------------------------------------------------------------------
  var searchTimer = null;

  function bindFilters(container) {
    var searchInput = document.getElementById("cal-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        clearTimeout(searchTimer);
        var val = searchInput.value;
        searchTimer = setTimeout(function () {
          state.search = val;
          render(container);
        }, 200);
      });
    }

    var stateSelect = document.getElementById("cal-filter-state");
    if (stateSelect) {
      stateSelect.addEventListener("change", function () {
        state.filterState = stateSelect.value;
        render(container);
      });
    }

    var catSelect = document.getElementById("cal-filter-category");
    if (catSelect) {
      catSelect.addEventListener("change", function () {
        state.filterCategory = catSelect.value;
        render(container);
      });
    }
  }

  function bindViewToggle(container) {
    var gridBtn = document.getElementById("cal-view-grid");
    var agendaBtn = document.getElementById("cal-view-agenda");
    if (!gridBtn || !agendaBtn) return;

    gridBtn.addEventListener("click", function () {
      state.view = "grid";
      gridBtn.classList.add("active");
      agendaBtn.classList.remove("active");
      render(container);
    });

    agendaBtn.addEventListener("click", function () {
      state.view = "agenda";
      agendaBtn.classList.add("active");
      gridBtn.classList.remove("active");
      render(container);
    });
  }

  // ---------------------------------------------------------------------------
  // Populate state dropdowns dynamically
  // ---------------------------------------------------------------------------
  function populateStateDropdown(conferences) {
    var stateSelect = document.getElementById("cal-filter-state");
    if (!stateSelect) return;
    var states = [];
    conferences.forEach(function (c) {
      if (c.state && states.indexOf(c.state) === -1) states.push(c.state);
    });
    states.sort();
    states.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      stateSelect.appendChild(opt);
    });
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    var dataEl = document.getElementById("cal-data");
    var container = document.getElementById("cal-output");
    if (!dataEl || !container) return;

    try {
      state.conferences = JSON.parse(dataEl.textContent);
    } catch (e) {
      container.innerHTML = "<p class='text-danger'>Error loading conference data.</p>";
      return;
    }

    // Clamp current month to conference range
    var now = new Date();
    var m = now.getMonth();
    state.currentMonth = Math.min(Math.max(m, MIN_MONTH), MAX_MONTH);
    state.currentYear = 2026;

    populateStateDropdown(state.conferences);
    bindFilters(container);
    bindViewToggle(container);
    render(container);
  });
})();
