(function () {
  "use strict";

  var detailDropdownPopulated = false;

  function populateDetailDropdown() {
    if (detailDropdownPopulated) return;
    var select = document.getElementById("detail-airport-select");
    if (!select || !window.AIRFARE_DATA) return;

    var regionLabels = {
      south: "South / Southwest", northeast: "Northeast",
      southeast: "Southeast",     midwest: "Midwest",
      mountain: "Mountain",       pacific: "Pacific",
    };
    var groups = {};
    var airports = window.AIRFARE_DATA.airports;
    Object.keys(airports).forEach(function (iata) {
      var ap = airports[iata];
      if (!groups[ap.region]) groups[ap.region] = [];
      groups[ap.region].push({ iata: iata, ap: ap });
    });

    var regionOrder = ["south","northeast","southeast","midwest","mountain","pacific"];
    regionOrder.forEach(function (region) {
      if (!groups[region]) return;
      var og = document.createElement("optgroup");
      og.label = regionLabels[region] || region;
      groups[region].sort(function (a, b) { return a.iata < b.iata ? -1 : 1; });
      groups[region].forEach(function (item) {
        var opt = document.createElement("option");
        opt.value = item.iata;
        opt.textContent = item.iata + " \u2014 " + item.ap.name + ", " + item.ap.state;
        og.appendChild(opt);
      });
      select.appendChild(og);
    });

    var og2 = document.createElement("optgroup");
    og2.label = "Other";
    var o2 = document.createElement("option");
    o2.value = "__other__";
    o2.textContent = "\u270f\ufe0f Enter my airport code\u2026";
    og2.appendChild(o2);
    select.appendChild(og2);

    detailDropdownPopulated = true;
  }

  function formatCostRange(min, max) {
    if (min === max) return "$" + min;
    return "$" + min + "\u2013$" + max;
  }

  function getDetailCosts(iata) {
    var conf = window.DETAIL_CONF;
    if (!conf) return;

    var airfare = null;
    if (window.AIRFARE_DATA) {
      airfare = window.AIRFARE_DATA.estimate(iata, conf.state);
    }
    var airMin = airfare ? airfare.min : 0;
    var airMax = airfare ? airfare.max : 0;
    var totalMin = (conf.registration_cost_min || 0) + airMin + (conf.hotel_cost_min || 0);
    var totalMax = (conf.registration_cost_max || 0) + airMax + (conf.hotel_cost_max || 0);

    var labelEl = document.getElementById("detail-airfare-label");
    if (labelEl) labelEl.textContent = "Airfare (" + (airfare ? iata : "HOU") + ")";

    // Detail page renders each cell separately — update all airfare/total cells
    ["detail-airfare-min","detail-airfare-max"].forEach(function (id, i) {
      var el = document.getElementById(id);
      if (el) el.textContent = "$" + (i === 0 ? airMin : airMax);
    });
    ["detail-total-min","detail-total-max"].forEach(function (id, i) {
      var el = document.getElementById(id);
      if (el) el.textContent = "$" + (i === 0 ? totalMin : totalMax);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.AIRFARE_DATA || !window.DETAIL_CONF) return;

    populateDetailDropdown();

    var select = document.getElementById("detail-airport-select");
    var custom = document.getElementById("detail-airport-custom");

    if (select) select.value = "HOU";
    getDetailCosts("HOU");

    if (select) {
      select.addEventListener("change", function () {
        var val = select.value;
        if (val === "__other__") {
          if (custom) { custom.style.display = ""; custom.focus(); }
        } else {
          if (custom) { custom.style.display = "none"; custom.value = ""; }
          getDetailCosts(val);
        }
      });
    }

    var customTimer = null;
    if (custom) {
      custom.addEventListener("input", function () {
        clearTimeout(customTimer);
        var typed = custom.value.toUpperCase().trim().slice(0, 3);
        custom.value = typed;
        customTimer = setTimeout(function () {
          if (typed.length === 3) {
            var result = window.AIRFARE_DATA ? window.AIRFARE_DATA.estimate(typed, window.DETAIL_CONF.state) : null;
            if (!result) {
              getDetailCosts("HOU");
              var labelEl = document.getElementById("detail-airfare-label");
              if (labelEl) labelEl.textContent = "Airfare (unknown \u2014 using HOU)";
            } else {
              getDetailCosts(typed);
            }
          }
        }, 400);
      });
    }
  });
})();
