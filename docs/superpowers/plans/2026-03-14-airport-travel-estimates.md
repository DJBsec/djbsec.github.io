# Airport Travel Estimates Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dynamic origin airport selector to the conference modal and detail page so users can see airfare + total cost estimates from their nearest airport instead of the hardcoded HOU default.

**Architecture:** A standalone `airfare-data.js` sets `window.AIRFARE_DATA` with ~50 airports, a 6-region×6-region cost matrix, and an `estimate()` function. The calendar modal JS and a new detail-page script both read this data to recalculate costs live when the user changes airports. No persistence — resets to HOU on every page load.

**Tech Stack:** Vanilla JS (IIFE pattern, no bundler), Bootstrap 4 modal, Jekyll Liquid, SASS with existing `$*-color` variables and CSS custom props.

**Spec:** `docs/superpowers/specs/2026-03-14-airport-travel-estimates-design.md`

---

## Chunk 1: Data layer — `airfare-data.js`

**Files:**
- Create: `assets/js/airfare-data.js`

- [ ] **Step 1: Create `assets/js/airfare-data.js`** with the full airport data, region matrix, and estimate function:

```js
window.AIRFARE_DATA = (function () {
  "use strict";

  var AIRPORTS = {
    // South/Southwest
    HOU: { name: "Houston Hobby",           city: "Houston",      state: "TX", region: "south" },
    IAH: { name: "Houston Intercontinental", city: "Houston",      state: "TX", region: "south" },
    DAL: { name: "Dallas Love Field",        city: "Dallas",       state: "TX", region: "south" },
    DFW: { name: "Dallas Fort Worth",        city: "Dallas",       state: "TX", region: "south" },
    AUS: { name: "Austin-Bergstrom",         city: "Austin",       state: "TX", region: "south" },
    SAT: { name: "San Antonio Intl",         city: "San Antonio",  state: "TX", region: "south" },
    MSY: { name: "Louis Armstrong New Orleans", city: "New Orleans", state: "LA", region: "south" },
    OKC: { name: "Will Rogers World",        city: "Oklahoma City", state: "OK", region: "south" },
    TUL: { name: "Tulsa Intl",               city: "Tulsa",        state: "OK", region: "south" },
    ABQ: { name: "Albuquerque Intl",         city: "Albuquerque",  state: "NM", region: "south" },
    PHX: { name: "Phoenix Sky Harbor",       city: "Phoenix",      state: "AZ", region: "south" },
    TUS: { name: "Tucson Intl",              city: "Tucson",       state: "AZ", region: "south" },
    // Northeast
    BOS: { name: "Boston Logan",             city: "Boston",       state: "MA", region: "northeast" },
    JFK: { name: "New York JFK",             city: "New York",     state: "NY", region: "northeast" },
    LGA: { name: "New York LaGuardia",       city: "New York",     state: "NY", region: "northeast" },
    EWR: { name: "Newark Liberty",           city: "Newark",       state: "NJ", region: "northeast" },
    PHL: { name: "Philadelphia Intl",        city: "Philadelphia", state: "PA", region: "northeast" },
    BWI: { name: "Baltimore-Washington",     city: "Baltimore",    state: "MD", region: "northeast" },
    DCA: { name: "Washington Reagan",        city: "Washington",   state: "DC", region: "northeast" },
    IAD: { name: "Washington Dulles",        city: "Washington",   state: "DC", region: "northeast" },
    RDU: { name: "Raleigh-Durham",           city: "Raleigh",      state: "NC", region: "northeast" },
    CLT: { name: "Charlotte Douglas",        city: "Charlotte",    state: "NC", region: "northeast" },
    // Southeast
    ATL: { name: "Atlanta Hartsfield-Jackson", city: "Atlanta",   state: "GA", region: "southeast" },
    MCO: { name: "Orlando Intl",             city: "Orlando",      state: "FL", region: "southeast" },
    MIA: { name: "Miami Intl",               city: "Miami",        state: "FL", region: "southeast" },
    FLL: { name: "Fort Lauderdale-Hollywood", city: "Fort Lauderdale", state: "FL", region: "southeast" },
    TPA: { name: "Tampa Intl",               city: "Tampa",        state: "FL", region: "southeast" },
    BNA: { name: "Nashville Intl",           city: "Nashville",    state: "TN", region: "southeast" },
    MEM: { name: "Memphis Intl",             city: "Memphis",      state: "TN", region: "southeast" },
    SDF: { name: "Louisville Intl",          city: "Louisville",   state: "KY", region: "southeast" },
    // Midwest
    ORD: { name: "Chicago O'Hare",           city: "Chicago",      state: "IL", region: "midwest" },
    MDW: { name: "Chicago Midway",           city: "Chicago",      state: "IL", region: "midwest" },
    DTW: { name: "Detroit Metro",            city: "Detroit",      state: "MI", region: "midwest" },
    MSP: { name: "Minneapolis-St Paul",      city: "Minneapolis",  state: "MN", region: "midwest" },
    STL: { name: "St. Louis Lambert",        city: "St. Louis",    state: "MO", region: "midwest" },
    MCI: { name: "Kansas City Intl",         city: "Kansas City",  state: "MO", region: "midwest" },
    IND: { name: "Indianapolis Intl",        city: "Indianapolis", state: "IN", region: "midwest" },
    CMH: { name: "Columbus Intl",            city: "Columbus",     state: "OH", region: "midwest" },
    CLE: { name: "Cleveland Hopkins",        city: "Cleveland",    state: "OH", region: "midwest" },
    MKE: { name: "Milwaukee Mitchell",       city: "Milwaukee",    state: "WI", region: "midwest" },
    CVG: { name: "Cincinnati/N. Kentucky",   city: "Cincinnati",   state: "OH", region: "midwest" },
    OMA: { name: "Eppley Airfield",          city: "Omaha",        state: "NE", region: "midwest" },
    // Mountain
    DEN: { name: "Denver Intl",              city: "Denver",       state: "CO", region: "mountain" },
    SLC: { name: "Salt Lake City Intl",      city: "Salt Lake City", state: "UT", region: "mountain" },
    LAS: { name: "Las Vegas Harry Reid",     city: "Las Vegas",    state: "NV", region: "mountain" },
    BOI: { name: "Boise Airport",            city: "Boise",        state: "ID", region: "mountain" },
    RNO: { name: "Reno-Tahoe Intl",          city: "Reno",         state: "NV", region: "mountain" },
    // Pacific
    LAX: { name: "Los Angeles Intl",         city: "Los Angeles",  state: "CA", region: "pacific" },
    SFO: { name: "San Francisco Intl",       city: "San Francisco", state: "CA", region: "pacific" },
    SJC: { name: "San Jose Mineta",          city: "San Jose",     state: "CA", region: "pacific" },
    SEA: { name: "Seattle-Tacoma",           city: "Seattle",      state: "WA", region: "pacific" },
    PDX: { name: "Portland Intl",            city: "Portland",     state: "OR", region: "pacific" },
    SAN: { name: "San Diego Intl",           city: "San Diego",    state: "CA", region: "pacific" },
    SMF: { name: "Sacramento Intl",          city: "Sacramento",   state: "CA", region: "pacific" },
    OAK: { name: "Oakland Intl",             city: "Oakland",      state: "CA", region: "pacific" },
  };

  var STATE_TO_REGION = {
    // Northeast
    CT: "northeast", DC: "northeast", DE: "northeast", MA: "northeast",
    MD: "northeast", ME: "northeast", NH: "northeast", NJ: "northeast",
    NY: "northeast", PA: "northeast", RI: "northeast", VA: "northeast",
    VT: "northeast", WV: "northeast",
    // Southeast
    AL: "southeast", AR: "southeast", FL: "southeast", GA: "southeast",
    KY: "southeast", MS: "southeast", NC: "southeast", SC: "southeast",
    TN: "southeast",
    // Midwest
    IA: "midwest", IL: "midwest", IN: "midwest", KS: "midwest",
    MI: "midwest", MN: "midwest", MO: "midwest", ND: "midwest",
    NE: "midwest", OH: "midwest", SD: "midwest", WI: "midwest",
    // South/Southwest
    AZ: "south", LA: "south", NM: "south", OK: "south", TX: "south",
    // Mountain
    CO: "mountain", ID: "mountain", MT: "mountain", NV: "mountain",
    UT: "mountain", WY: "mountain",
    // Pacific
    AK: "pacific", CA: "pacific", HI: "pacific", OR: "pacific", WA: "pacific",
  };

  // 6x6 matrix: origin region -> destination region -> { min, max } round-trip economy USD
  var MATRIX = {
    northeast: {
      northeast: { min: 100, max: 220 },
      southeast: { min: 150, max: 320 },
      midwest:   { min: 150, max: 300 },
      south:     { min: 200, max: 400 },
      mountain:  { min: 220, max: 420 },
      pacific:   { min: 280, max: 520 },
    },
    southeast: {
      northeast: { min: 150, max: 320 },
      southeast: { min: 80,  max: 200 },
      midwest:   { min: 160, max: 300 },
      south:     { min: 150, max: 280 },
      mountain:  { min: 200, max: 380 },
      pacific:   { min: 240, max: 440 },
    },
    midwest: {
      northeast: { min: 150, max: 300 },
      southeast: { min: 160, max: 300 },
      midwest:   { min: 80,  max: 200 },
      south:     { min: 160, max: 320 },
      mountain:  { min: 180, max: 350 },
      pacific:   { min: 230, max: 420 },
    },
    south: {
      northeast: { min: 200, max: 400 },
      southeast: { min: 120, max: 280 },
      midwest:   { min: 150, max: 300 },
      south:     { min: 80,  max: 200 },
      mountain:  { min: 170, max: 350 },
      pacific:   { min: 200, max: 400 },
    },
    mountain: {
      northeast: { min: 220, max: 420 },
      southeast: { min: 200, max: 380 },
      midwest:   { min: 180, max: 350 },
      south:     { min: 160, max: 320 },
      mountain:  { min: 80,  max: 220 },
      pacific:   { min: 130, max: 280 },
    },
    pacific: {
      northeast: { min: 280, max: 520 },
      southeast: { min: 240, max: 440 },
      midwest:   { min: 230, max: 420 },
      south:     { min: 200, max: 400 },
      mountain:  { min: 130, max: 280 },
      pacific:   { min: 80,  max: 220 },
    },
  };

  function estimate(originIATA, destState) {
    var iata = String(originIATA || "").toUpperCase().trim();
    var airport = AIRPORTS[iata];
    if (!airport) return null;
    var destRegion = STATE_TO_REGION[destState] || "midwest";
    var band = MATRIX[airport.region][destRegion];
    return {
      min: band.min,
      max: band.max,
      notes: "Estimated from " + iata + " to " + destState + ", economy",
    };
  }

  return { airports: AIRPORTS, stateToRegion: STATE_TO_REGION, matrix: MATRIX, estimate: estimate };
})();
```

- [ ] **Step 2: Verify the file parses without errors**

```bash
node -e "require('./assets/js/airfare-data.js'); console.log('OK')" 2>/dev/null || \
  node -e "eval(require('fs').readFileSync('assets/js/airfare-data.js','utf8')); console.log(Object.keys(AIRFARE_DATA))"
```
Expected output: `[ 'airports', 'stateToRegion', 'matrix', 'estimate' ]`

- [ ] **Step 3: Spot-check the estimate function manually**

```bash
node -e "
eval(require('fs').readFileSync('assets/js/airfare-data.js','utf8'));
var r = AIRFARE_DATA.estimate('HOU','NV');
console.log('HOU->NV:', r);
var r2 = AIRFARE_DATA.estimate('JFK','CA');
console.log('JFK->CA:', r2);
var r3 = AIRFARE_DATA.estimate('XXX','TX');
console.log('XXX->TX (should be null):', r3);
"
```
Expected: HOU→NV returns `{ min:170, max:350, notes:'...' }`, JFK→CA returns `{ min:280, max:520 }`, XXX returns `null`.

- [ ] **Step 4: Commit**

```bash
git add assets/js/airfare-data.js
git commit -m "feat: add airfare-data.js with region-based airport cost matrix"
```

---

## Chunk 2: Modal HTML — selector widget + disclaimer

**Files:**
- Modify: `_includes/conference-modal.html`

- [ ] **Step 1: Add the airport selector and disclaimer banner to the modal body**

In `_includes/conference-modal.html`, replace the opening `<div class="modal-body">` section so it reads:

```html
      <div class="modal-body">
        <p class="text-muted mb-3"><span id="modal-description"></span></p>

        <!-- Airport selector -->
        <div class="cal-airport-selector mb-2">
          <span class="cal-airport-label">✈️ Travel from:</span>
          <select id="modal-airport-select" class="cal-select" aria-label="Origin airport">
            <!-- populated by JS -->
          </select>
          <input id="modal-airport-custom" type="text" class="cal-search-input"
                 placeholder="e.g. LAX" maxlength="3"
                 aria-label="Enter airport IATA code"
                 style="display:none;width:5rem;text-transform:uppercase" />
        </div>

        <!-- Estimates disclaimer -->
        <div class="cal-estimate-notice mb-3">
          ℹ️ <strong>Quick estimates for reference only.</strong>
          Airfare and hotel costs vary — check current prices before booking.
        </div>

        <div class="row">
          <div class="col-sm-6">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <th>Dates</th>
                  <td><span id="modal-dates"></span></td>
                </tr>
                <tr>
                  <th>Location</th>
                  <td><span id="modal-location"></span></td>
                </tr>
                <tr>
                  <th>Venue</th>
                  <td><span id="modal-venue"></span></td>
                </tr>
                <tr>
                  <th>Categories</th>
                  <td><span id="modal-tags"></span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-sm-6">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <th>Registration</th>
                  <td><span id="modal-reg-cost"></span></td>
                </tr>
                <tr>
                  <th id="modal-airfare-label">Airfare (HOU)</th>
                  <td><span id="modal-airfare"></span></td>
                </tr>
                <tr>
                  <th>Hotel</th>
                  <td><span id="modal-hotel"></span></td>
                </tr>
                <tr>
                  <th><strong>Total Est.</strong></th>
                  <td><strong><span id="modal-total"></span></strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
```

- [ ] **Step 2: Build and confirm modal HTML renders without Jekyll errors**

```bash
bundle exec jekyll build 2>&1 | grep -iE "error|done in" | tail -5
```
Expected: `done in X seconds` with no errors.

- [ ] **Step 3: Commit**

```bash
git add _includes/conference-modal.html
git commit -m "feat: add airport selector and estimates disclaimer to conference modal"
```

---

## Chunk 3: Calendar JS — modal airport binding

**Files:**
- Modify: `assets/js/cybersecurity-calendar.js`
- Modify: `_pages/cybersecurity-calendar.md`

- [ ] **Step 1: Add `airfare-data.js` script tag to `_pages/cybersecurity-calendar.md`**

Find the two `<script>` tags at the bottom of `_pages/cybersecurity-calendar.md`:
```html
<script>
  window.calendarBasePath = ...
</script>
<script src="{{ '/assets/js/cybersecurity-calendar.js' | relative_url }}"></script>
```

Add `airfare-data.js` between them:
```html
<script>
  window.calendarBasePath = "{{ '/cybersecurity-calendar/' | relative_url }}";
</script>
<script src="{{ '/assets/js/airfare-data.js' | relative_url }}"></script>
<script src="{{ '/assets/js/cybersecurity-calendar.js' | relative_url }}"></script>
```

- [ ] **Step 2: Add `getModalCosts(conf, iata)` function to `cybersecurity-calendar.js`**

Add this function directly before `populateModal`:

```js
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
```

- [ ] **Step 3: Update `populateModal(conf)` to call the new functions**

At the end of the existing `populateModal` function, before the closing `}`, add:

```js
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
          // Clear any unknown-airport note
          var airEl = document.getElementById("modal-airfare");
          if (airEl && airEl.dataset.unknownNote) { airEl.dataset.unknownNote = ""; }
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
```

- [ ] **Step 4: Build and verify no JS errors**

```bash
bundle exec jekyll build 2>&1 | grep -iE "error|done in" | tail -5
```
Expected: `done in X seconds`.

- [ ] **Step 5: Smoke-test in browser**

```bash
bundle exec jekyll serve &
```
Open `http://localhost:4000/cybersecurity-calendar/`, open any conference modal, verify:
- Dropdown shows airports grouped by region
- Changing airport updates the "Airfare (XXX)" label and Total row
- Selecting "Other" reveals the text input
- Typing "LAX" in the text input updates costs after 400ms
- Typing "ZZZ" shows "(unknown — using HOU)" in the airfare label

- [ ] **Step 6: Commit**

```bash
git add assets/js/cybersecurity-calendar.js _pages/cybersecurity-calendar.md
git commit -m "feat: dynamic airport selector in conference modal with live cost updates"
```

---

## Chunk 4: Detail page — selector + scripts

**Files:**
- Modify: `_layouts/conference-detail.liquid`
- Create: `assets/js/conference-detail-airport.js`

- [ ] **Step 1: Create `assets/js/conference-detail-airport.js`**

```js
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
```

- [ ] **Step 2: Modify `_layouts/conference-detail.liquid` — update cost card header**

Change line:
```liquid
        <div class="card-header bg-success text-white">
          <i class="ti ti-coin"></i> Travel Cost Estimates from Houston (HOU)
```
To:
```liquid
        <div class="card-header bg-success text-white">
          <i class="ti ti-coin"></i> Travel Cost Estimates
```

- [ ] **Step 3: Add airport selector + disclaimer to the cost card, above the cost table**

In `_layouts/conference-detail.liquid`, inside the cost card's `<div class="card-body">`, add before the `<table>`:

```html
          <!-- Airport selector -->
          <div class="cal-airport-selector mb-2">
            <span class="cal-airport-label">✈️ Travel from:</span>
            <select id="detail-airport-select" class="cal-select" aria-label="Origin airport">
              <!-- populated by conference-detail-airport.js -->
            </select>
            <input id="detail-airport-custom" type="text" class="cal-search-input"
                   placeholder="e.g. LAX" maxlength="3"
                   aria-label="Enter airport IATA code"
                   style="display:none;width:5rem;text-transform:uppercase" />
          </div>

          <!-- Estimates disclaimer -->
          <div class="cal-estimate-notice mb-3">
            ℹ️ <strong>Quick estimates for reference only.</strong>
            Airfare and hotel costs vary — check current prices before booking.
          </div>
```

- [ ] **Step 4: Add `id` attributes to the dynamic cost cells in the detail page cost table**

In `_layouts/conference-detail.liquid`, update the airfare and total rows in the cost table:

```liquid
              <tr>
                <td>
                  Airfare <span class="badge cal-est-badge">Est.</span>
                </td>
                <td id="detail-airfare-min">${{ conf.airfare_cost_min }}</td>
                <td id="detail-airfare-max">${{ conf.airfare_cost_max }}</td>
                <td><small>{{ conf.airfare_cost_notes }}</small></td>
              </tr>
              ...
              <tr class="table-active fw-bold">
                <td>Total <span class="badge cal-est-badge">Est.</span></td>
                <td id="detail-total-min">${{ conf.total_cost_min }}</td>
                <td id="detail-total-max">${{ conf.total_cost_max }}</td>
                <td><small>All estimates from HOU</small></td>
              </tr>
```

Also add `id="detail-airfare-label"` to the `<th>` of the Airfare row (it's inside the `<thead>`):
```html
                <th id="detail-airfare-label">Airfare</th>
```

- [ ] **Step 5: Add script tags to the bottom of `_layouts/conference-detail.liquid`**

Before the closing `</div>` of the post, add:

```liquid
  <script src="{{ '/assets/js/airfare-data.js' | relative_url }}"></script>
  <script>
    window.DETAIL_CONF = {
      state: {{ conf.state | jsonify }},
      registration_cost_min: {{ conf.registration_cost_min | default: 0 }},
      registration_cost_max: {{ conf.registration_cost_max | default: 0 }},
      hotel_cost_min: {{ conf.hotel_cost_min | default: 0 }},
      hotel_cost_max: {{ conf.hotel_cost_max | default: 0 }}
    };
  </script>
  <script src="{{ '/assets/js/conference-detail-airport.js' | relative_url }}"></script>
```

- [ ] **Step 6: Build**

```bash
bundle exec jekyll build 2>&1 | grep -iE "error|done in" | tail -5
```
Expected: `done in X seconds`.

- [ ] **Step 7: Smoke-test detail page**

Open `http://localhost:4000/cybersecurity-calendar/defcon-34/`, verify:
- Cost card header reads "Travel Cost Estimates" (no HOU mention)
- Airport selector dropdown is populated and defaults to HOU
- Changing to JFK updates Airfare and Total cells
- "Other" reveals text input; typing "LAX" updates costs

- [ ] **Step 8: Commit**

```bash
git add assets/js/conference-detail-airport.js _layouts/conference-detail.liquid
git commit -m "feat: dynamic airport selector on conference detail page"
```

---

## Chunk 5: SCSS — styles for new components

**Files:**
- Modify: `_sass/_cybersecurity-calendar.scss`

- [ ] **Step 1: Add `.cal-airport-selector` and `.cal-estimate-notice` to the SCSS file**

Append to `_sass/_cybersecurity-calendar.scss` before the `// Responsive` section:

```scss
// ---------------------------------------------------------------------------
// Airport selector widget
// ---------------------------------------------------------------------------
.cal-airport-selector {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  background: rgba($green-color, 0.06);
  border: 1px solid rgba($green-color, 0.4);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;

  .cal-airport-label {
    font-size: 0.85rem;
    color: var(--global-text-color-light);
    white-space: nowrap;
  }

  select,
  input {
    background: var(--global-bg-color);
    color: var(--global-text-color);
    border: 1px solid var(--global-divider-color);
    border-radius: 0.375rem;
    padding: 0.375rem 0.5rem;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: var(--global-theme-color);
    }
  }

  select {
    flex: 1 1 200px;
    cursor: pointer;
  }

  input {
    width: 5rem;
    text-transform: uppercase;
  }
}

// ---------------------------------------------------------------------------
// Estimates disclaimer banner
// ---------------------------------------------------------------------------
.cal-estimate-notice {
  background: rgba($yellow-color, 0.12);
  border: 1px solid rgba($yellow-color, 0.35);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  line-height: 1.4;
}
```

- [ ] **Step 2: Build and verify styles compile**

```bash
bundle exec jekyll build 2>&1 | grep -iE "error|scss|done in" | tail -10
```
Expected: `done in X seconds`, no SCSS errors.

- [ ] **Step 3: Visually verify dark mode**

Open `http://localhost:4000/cybersecurity-calendar/`, toggle dark mode, confirm:
- `.cal-airport-selector` background and input colors adapt correctly
- `.cal-estimate-notice` yellow tint is visible but not harsh in both modes

- [ ] **Step 4: Final full build**

```bash
JEKYLL_ENV=production bundle exec jekyll build 2>&1 | grep -iE "error|done in" | tail -5
```
Expected: `done in X seconds`, no errors.

- [ ] **Step 5: Commit**

```bash
git add _sass/_cybersecurity-calendar.scss
git commit -m "feat: styles for airport selector and estimates disclaimer"
```
