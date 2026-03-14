# Airport Travel Estimates — Design Spec

**Date:** 2026-03-14
**Feature:** Dynamic airfare estimates based on user's origin airport
**Status:** Approved for implementation

---

## Problem

The Cybersecurity Calendar shows travel cost estimates hardcoded to Houston Hobby (HOU). Users from other cities see numbers that are irrelevant to them with no way to adjust.

## Goal

Let any user enter their nearest airport and instantly see updated airfare + total cost estimates inside the conference modal and detail page.

---

## Design Decisions

| Question                        | Decision                                                                                                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Where does the selector appear? | Inside the modal cost section AND the detail page cost card only                                                                                          |
| Does the setting persist?       | No — resets to HOU on each page load                                                                                                                      |
| Input type                      | Grouped dropdown (~50 airports) + "Other" option that reveals an IATA text field                                                                          |
| Estimation method               | Region-based matrix: 6 US regions × 6 regions = 36 airfare bands                                                                                          |
| Disclaimer                      | Info banner (yellow tint) above the cost table: "Quick estimates for reference only. Airfare and hotel costs vary — check current prices before booking." |

---

## Architecture

### New File: `assets/js/airfare-data.js`

Standalone script that sets `window.AIRFARE_DATA`. **Must be loaded before any other calendar scripts** on both the calendar page and the detail page (see Script Ordering below).

```
window.AIRFARE_DATA = {
  airports:      { [IATA]: { name, city, state, region } }   // ~50 airports
  stateToRegion: { [STATE]: region }                          // all 50 states + DC
  matrix:        { [originRegion]: { [destRegion]: { min, max } } }  // 6×6
  estimate(originIATA, destState) → { min, max, notes } | null
}
```

**Regions:** `northeast`, `southeast`, `midwest`, `south`, `mountain`, `pacific`

**Airport coverage (~50 airports, grouped by region for the dropdown):**

| Region          | Airports                                                   |
| --------------- | ---------------------------------------------------------- |
| South/Southwest | HOU, IAH, DAL, DFW, AUS, SAT, MSY, OKC, TUL, ABQ, PHX, TUS |
| Northeast       | BOS, JFK, LGA, EWR, PHL, BWI, DCA, IAD, RDU, CLT           |
| Southeast       | ATL, MCO, MIA, FLL, TPA, BNA, MEM, SDF                     |
| Midwest         | ORD, MDW, DTW, MSP, STL, MCI, IND, CMH, CLE, MKE, CVG, OMA |
| Mountain        | DEN, SLC, LAS, BOI, RNO                                    |
| Pacific         | LAX, SFO, SJC, SEA, PDX, SAN, SMF, OAK                     |

**6×6 airfare matrix (round-trip economy, USD):**

| From ↓ To →   | Northeast | Southeast | Midwest | South   | Mountain | Pacific |
| ------------- | --------- | --------- | ------- | ------- | -------- | ------- |
| **Northeast** | 100–220   | 150–320   | 150–300 | 200–400 | 220–420  | 280–520 |
| **Southeast** | 150–320   | 80–200    | 160–300 | 150–280 | 200–380  | 240–440 |
| **Midwest**   | 150–300   | 160–300   | 80–200  | 160–320 | 180–350  | 230–420 |
| **South**     | 200–400   | 120–280   | 150–300 | 80–200  | 170–350  | 200–400 |
| **Mountain**  | 220–420   | 200–380   | 180–350 | 160–320 | 80–220   | 130–280 |
| **Pacific**   | 280–520   | 240–440   | 230–420 | 200–400 | 130–280  | 80–220  |

**`estimate(originIATA, destState)`:**

1. Normalize `originIATA` to uppercase
2. Look up `originIATA` in `airports` → get `region`; return `null` if not found
3. Look up `destState` in `stateToRegion` → get `destRegion`; use `midwest` as default if not found
4. Return `matrix[region][destRegion]` with a notes string `"Estimated from {IATA} to {destState}, economy"`

---

### Script Ordering

Both pages must load scripts in this exact order:

**`_pages/cybersecurity-calendar.md`** (at bottom of page body):

```html
<script>
  window.calendarBasePath = "...";
</script>
<script src=".../airfare-data.js"></script>
<!-- FIRST -->
<script src=".../cybersecurity-calendar.js"></script>
```

**`_layouts/conference-detail.liquid`** (at bottom of layout body):

```html
<script src=".../airfare-data.js"></script>
<!-- FIRST -->
<script>
  var DETAIL_CONF = { ... };
</script>
<script src=".../conference-detail-airport.js"></script>
```

Because `cybersecurity-calendar.js` runs inside `DOMContentLoaded`, `AIRFARE_DATA` will always be defined before any modal is opened as long as `airfare-data.js` precedes it. The `window.AIRFARE_DATA` guard in `getModalCosts` is belt-and-suspenders only.

---

### Modified: `_includes/conference-modal.html`

Add to the modal body, **above** the cost table:

1. **Airport selector widget:**

   ```html
   <div class="cal-airport-selector">
     <span>✈️ Travel from:</span>
     <select id="modal-airport-select">
       <!-- optgroups populated by JS from AIRFARE_DATA.airports -->
       <optgroup label="Other">
         <option value="__other__">✏️ Enter my airport code…</option>
       </optgroup>
     </select>
     <input id="modal-airport-custom" type="text" placeholder="e.g. LAX" maxlength="3" style="display:none" />
   </div>
   ```

2. **Disclaimer banner** (always visible):

   ```html
   <div class="cal-estimate-notice">
     ℹ️ <strong>Quick estimates for reference only.</strong>
     Airfare and hotel costs vary — check current prices before booking.
   </div>
   ```

3. Change the static `<th>Airfare (HOU)</th>` label to `<th id="modal-airfare-label">Airfare (est.)</th>`. The JS will update this to `Airfare (XXX)` when the user changes airports via `element.textContent = "Airfare (" + iata + ")"`.

4. Confirm `id` attributes exist on dynamic cost cells: `modal-airfare`, `modal-hotel`, `modal-total`.

---

### Modified: `assets/js/cybersecurity-calendar.js`

**`populateModal(conf)`** — after setting all static text content:

- Populate the airport dropdown from `window.AIRFARE_DATA.airports` grouped by region (run once on first modal open via a `dropdownPopulated` flag, then skip)
- Reset dropdown to `HOU` and hide the custom input on each modal open
- Reset the airfare label: `#modal-airfare-label` → `"Airfare (HOU)"`
- Compute and display costs using `getModalCosts(conf, 'HOU')`
- Bind `change` on `#modal-airport-select`:
  - If value is `__other__`: show `#modal-airport-custom`, clear its value, focus it
  - Otherwise: hide `#modal-airport-custom`, clear any error note, update `#modal-airfare-label` to `"Airfare (XXX)"`, call `getModalCosts(conf, selectedIATA)`
- Bind `input` on `#modal-airport-custom` (debounced 400ms):
  - Normalize input to uppercase, trim to 3 chars
  - Call `getModalCosts(conf, typedIATA)`
  - If `estimate()` returns `null`: show `"(unknown — using HOU estimates)"` in the airfare notes cell; use HOU fallback values
  - When user switches dropdown away from `__other__`: hide custom input, clear the unknown-airport note

**`getModalCosts(conf, iata)`:**

```
if window.AIRFARE_DATA:
  result = AIRFARE_DATA.estimate(iata, conf.state)
else:
  result = null

if result:
  airMin = result.min
  airMax = result.max
else:
  airMin = conf.airfare_cost_min   // pre-computed HOU values from data blob
  airMax = conf.airfare_cost_max

totalMin = conf.registration_cost_min + airMin + conf.hotel_cost_min
totalMax = conf.registration_cost_max + airMax + conf.hotel_cost_max

→ update #modal-airfare via .textContent = "$airMin–$airMax"
→ update #modal-hotel via .textContent  (unchanged — hotel costs don't vary by origin)
→ update #modal-total via .textContent  = "$totalMin–$totalMax est."
```

**Note on total fallback:** When `result` is null and `conf.airfare_cost_min` is used, the recomputed total equals `registration + HOU_airfare + hotel`. This may differ from the pre-baked `conf.total_cost_min` if the build script applied surge multipliers differently. This is a known and acceptable limitation — always recompute the total from parts rather than using the pre-baked total.

---

### Modified: `_layouts/conference-detail.liquid`

**In the cost card**, above the cost table, add:

1. Same airport selector widget (IDs: `detail-airport-select`, `detail-airport-custom`)
2. Same disclaimer banner (`.cal-estimate-notice`)
3. Change `<th>Airfare <span...>Est.</span></th>` to include an `id="detail-airfare-label"` so JS can update it to `"Airfare (XXX)"` on airport change.
4. Add `id` attributes to detail cost cells: `detail-airfare-min`, `detail-airfare-max`, `detail-total-min`, `detail-total-max` (the detail page renders min/max in separate cells unlike the modal).
5. Update the cost card header from `"Travel Cost Estimates from Houston (HOU)"` to `"Travel Cost Estimates"` — the airport selector widget makes the origin self-evident.

**At bottom of layout**, in this order:

```liquid
<script src="{{ '/assets/js/airfare-data.js' | relative_url }}"></script>
<script>
  var DETAIL_CONF = {
    state: {{ conf.state | jsonify }},
    registration_cost_min: {{ conf.registration_cost_min | default: 0 }},
    registration_cost_max: {{ conf.registration_cost_max | default: 0 }},
    hotel_cost_min: {{ conf.hotel_cost_min | default: 0 }},
    hotel_cost_max: {{ conf.hotel_cost_max | default: 0 }}
  };
</script>
<script src="{{ '/assets/js/conference-detail-airport.js' | relative_url }}"></script>
```

### New File: `assets/js/conference-detail-airport.js`

Runs inside `DOMContentLoaded`. Mirrors the modal airport logic but targets detail page IDs. Uses `window.AIRFARE_DATA` and `window.DETAIL_CONF`. Same dropdown population, same `getDetailCosts()` function, same unknown-IATA fallback, same uppercase normalization.

---

### Modified: `_sass/_cybersecurity-calendar.scss`

**`.cal-airport-selector`** — flex row with `$green-color`-tinted border (`border: 1px solid rgba($green-color, 0.4)`), `border-radius: 0.5rem`, `padding: 0.5rem 0.75rem`. The `<select>` and `<input>` inside apply the exact same property values as `.cal-select`:

- `background: var(--global-bg-color)`
- `color: var(--global-text-color)`
- `border: 1px solid var(--global-divider-color)`
- `border-radius: 0.375rem`
- `padding: 0.375rem 0.5rem`
- `font-size: 0.9rem`
- Focus ring: `border-color: var(--global-theme-color)` (no box-shadow, matching `.cal-select`)

The `<input>` inside also gets `width: 5rem` and `text-transform: uppercase`.

**`.cal-estimate-notice`** — info banner:

- `background: rgba($yellow-color, 0.12)`
- `border: 1px solid rgba($yellow-color, 0.35)`
- `border-radius: 0.375rem`
- `padding: 0.5rem 0.75rem`
- `font-size: 0.8rem`
- `line-height: 1.4`
- `color` inherits (works in both light and dark mode)
- `margin-bottom: 0.75rem`

---

### Modified: `_pages/cybersecurity-calendar.md`

Add `airfare-data.js` script tag before `cybersecurity-calendar.js` at the bottom of the page body.

---

## Files Summary

| File                                     | Action                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `assets/js/airfare-data.js`              | **Create** — airport data + region matrix + estimate()                               |
| `assets/js/conference-detail-airport.js` | **Create** — detail page airport selector binding                                    |
| `assets/js/cybersecurity-calendar.js`    | **Modify** — populateModal() + getModalCosts() + dropdown population                 |
| `_includes/conference-modal.html`        | **Modify** — add selector widget + disclaimer banner + id on airfare label           |
| `_layouts/conference-detail.liquid`      | **Modify** — add selector widget + disclaimer + update card header + script includes |
| `_sass/_cybersecurity-calendar.scss`     | **Modify** — add .cal-airport-selector + .cal-estimate-notice                        |
| `_pages/cybersecurity-calendar.md`       | **Modify** — add airfare-data.js script tag before cybersecurity-calendar.js         |

---

## Error Handling

- **Unknown IATA typed in custom field:** normalize to uppercase; if `estimate()` returns `null`, fall back to HOU pre-computed airfare values and show `"(unknown — using HOU estimates)"` in the airfare notes area
- **User switches dropdown away from `__other__`:** hide custom input, clear the unknown-airport note immediately
- **`AIRFARE_DATA` not loaded:** `getModalCosts` / `getDetailCosts` check `window.AIRFARE_DATA` before calling — fall back to pre-computed values silently (belt-and-suspenders; correct script ordering prevents this in practice)
- **Conference has no state field:** `estimate()` returns `null`, falls back to pre-computed airfare
- **Total cost divergence:** always recompute total from `registration + airfare + hotel` parts — do not use the pre-baked `total_cost_min/max` from the data blob

## Out of Scope

- Persisting airport preference across sessions
- Real-time flight pricing API integration
- Driving/train cost estimates
- International origin airports
