window.AIRFARE_DATA = (function () {
  "use strict";

  var AIRPORTS = {
    // South/Southwest
    HOU: { name: "Houston Hobby", city: "Houston", state: "TX", region: "south" },
    IAH: { name: "Houston Intercontinental", city: "Houston", state: "TX", region: "south" },
    DAL: { name: "Dallas Love Field", city: "Dallas", state: "TX", region: "south" },
    DFW: { name: "Dallas Fort Worth", city: "Dallas", state: "TX", region: "south" },
    AUS: { name: "Austin-Bergstrom", city: "Austin", state: "TX", region: "south" },
    SAT: { name: "San Antonio Intl", city: "San Antonio", state: "TX", region: "south" },
    MSY: { name: "Louis Armstrong New Orleans", city: "New Orleans", state: "LA", region: "south" },
    OKC: { name: "Will Rogers World", city: "Oklahoma City", state: "OK", region: "south" },
    TUL: { name: "Tulsa Intl", city: "Tulsa", state: "OK", region: "south" },
    ABQ: { name: "Albuquerque Intl", city: "Albuquerque", state: "NM", region: "south" },
    PHX: { name: "Phoenix Sky Harbor", city: "Phoenix", state: "AZ", region: "south" },
    TUS: { name: "Tucson Intl", city: "Tucson", state: "AZ", region: "south" },
    // Northeast
    BOS: { name: "Boston Logan", city: "Boston", state: "MA", region: "northeast" },
    JFK: { name: "New York JFK", city: "New York", state: "NY", region: "northeast" },
    LGA: { name: "New York LaGuardia", city: "New York", state: "NY", region: "northeast" },
    EWR: { name: "Newark Liberty", city: "Newark", state: "NJ", region: "northeast" },
    PHL: { name: "Philadelphia Intl", city: "Philadelphia", state: "PA", region: "northeast" },
    BWI: { name: "Baltimore-Washington", city: "Baltimore", state: "MD", region: "northeast" },
    DCA: { name: "Washington Reagan", city: "Washington", state: "DC", region: "northeast" },
    IAD: { name: "Washington Dulles", city: "Washington", state: "DC", region: "northeast" },
    RDU: { name: "Raleigh-Durham", city: "Raleigh", state: "NC", region: "northeast" },
    CLT: { name: "Charlotte Douglas", city: "Charlotte", state: "NC", region: "northeast" },
    // Southeast
    ATL: { name: "Atlanta Hartsfield-Jackson", city: "Atlanta", state: "GA", region: "southeast" },
    MCO: { name: "Orlando Intl", city: "Orlando", state: "FL", region: "southeast" },
    MIA: { name: "Miami Intl", city: "Miami", state: "FL", region: "southeast" },
    FLL: { name: "Fort Lauderdale-Hollywood", city: "Fort Lauderdale", state: "FL", region: "southeast" },
    TPA: { name: "Tampa Intl", city: "Tampa", state: "FL", region: "southeast" },
    BNA: { name: "Nashville Intl", city: "Nashville", state: "TN", region: "southeast" },
    MEM: { name: "Memphis Intl", city: "Memphis", state: "TN", region: "southeast" },
    SDF: { name: "Louisville Intl", city: "Louisville", state: "KY", region: "southeast" },
    // Midwest
    ORD: { name: "Chicago O'Hare", city: "Chicago", state: "IL", region: "midwest" },
    MDW: { name: "Chicago Midway", city: "Chicago", state: "IL", region: "midwest" },
    DTW: { name: "Detroit Metro", city: "Detroit", state: "MI", region: "midwest" },
    MSP: { name: "Minneapolis-St Paul", city: "Minneapolis", state: "MN", region: "midwest" },
    STL: { name: "St. Louis Lambert", city: "St. Louis", state: "MO", region: "midwest" },
    MCI: { name: "Kansas City Intl", city: "Kansas City", state: "MO", region: "midwest" },
    IND: { name: "Indianapolis Intl", city: "Indianapolis", state: "IN", region: "midwest" },
    CMH: { name: "Columbus Intl", city: "Columbus", state: "OH", region: "midwest" },
    CLE: { name: "Cleveland Hopkins", city: "Cleveland", state: "OH", region: "midwest" },
    MKE: { name: "Milwaukee Mitchell", city: "Milwaukee", state: "WI", region: "midwest" },
    CVG: { name: "Cincinnati/N. Kentucky", city: "Cincinnati", state: "OH", region: "midwest" },
    OMA: { name: "Eppley Airfield", city: "Omaha", state: "NE", region: "midwest" },
    // Mountain
    DEN: { name: "Denver Intl", city: "Denver", state: "CO", region: "mountain" },
    SLC: { name: "Salt Lake City Intl", city: "Salt Lake City", state: "UT", region: "mountain" },
    LAS: { name: "Las Vegas Harry Reid", city: "Las Vegas", state: "NV", region: "mountain" },
    BOI: { name: "Boise Airport", city: "Boise", state: "ID", region: "mountain" },
    RNO: { name: "Reno-Tahoe Intl", city: "Reno", state: "NV", region: "mountain" },
    // Pacific
    LAX: { name: "Los Angeles Intl", city: "Los Angeles", state: "CA", region: "pacific" },
    SFO: { name: "San Francisco Intl", city: "San Francisco", state: "CA", region: "pacific" },
    SJC: { name: "San Jose Mineta", city: "San Jose", state: "CA", region: "pacific" },
    SEA: { name: "Seattle-Tacoma", city: "Seattle", state: "WA", region: "pacific" },
    PDX: { name: "Portland Intl", city: "Portland", state: "OR", region: "pacific" },
    SAN: { name: "San Diego Intl", city: "San Diego", state: "CA", region: "pacific" },
    SMF: { name: "Sacramento Intl", city: "Sacramento", state: "CA", region: "pacific" },
    OAK: { name: "Oakland Intl", city: "Oakland", state: "CA", region: "pacific" },
  };

  var STATE_TO_REGION = {
    // Northeast
    CT: "northeast",
    DC: "northeast",
    DE: "northeast",
    MA: "northeast",
    MD: "northeast",
    ME: "northeast",
    NH: "northeast",
    NJ: "northeast",
    NY: "northeast",
    PA: "northeast",
    RI: "northeast",
    VA: "northeast",
    VT: "northeast",
    WV: "northeast",
    // Southeast
    AL: "southeast",
    AR: "southeast",
    FL: "southeast",
    GA: "southeast",
    KY: "southeast",
    MS: "southeast",
    NC: "southeast",
    SC: "southeast",
    TN: "southeast",
    // Midwest
    IA: "midwest",
    IL: "midwest",
    IN: "midwest",
    KS: "midwest",
    MI: "midwest",
    MN: "midwest",
    MO: "midwest",
    ND: "midwest",
    NE: "midwest",
    OH: "midwest",
    SD: "midwest",
    WI: "midwest",
    // South/Southwest
    AZ: "south",
    LA: "south",
    NM: "south",
    OK: "south",
    TX: "south",
    // Mountain
    CO: "mountain",
    ID: "mountain",
    MT: "mountain",
    NV: "mountain",
    UT: "mountain",
    WY: "mountain",
    // Pacific
    AK: "pacific",
    CA: "pacific",
    HI: "pacific",
    OR: "pacific",
    WA: "pacific",
  };

  // 6x6 matrix: origin region -> destination region -> { min, max } round-trip economy USD
  var MATRIX = {
    northeast: {
      northeast: { min: 100, max: 220 },
      southeast: { min: 150, max: 320 },
      midwest: { min: 150, max: 300 },
      south: { min: 200, max: 400 },
      mountain: { min: 220, max: 420 },
      pacific: { min: 280, max: 520 },
    },
    southeast: {
      northeast: { min: 150, max: 320 },
      southeast: { min: 80, max: 200 },
      midwest: { min: 160, max: 300 },
      south: { min: 150, max: 280 },
      mountain: { min: 200, max: 380 },
      pacific: { min: 240, max: 440 },
    },
    midwest: {
      northeast: { min: 150, max: 300 },
      southeast: { min: 160, max: 300 },
      midwest: { min: 80, max: 200 },
      south: { min: 160, max: 320 },
      mountain: { min: 180, max: 350 },
      pacific: { min: 230, max: 420 },
    },
    south: {
      northeast: { min: 200, max: 400 },
      southeast: { min: 120, max: 280 },
      midwest: { min: 150, max: 300 },
      south: { min: 80, max: 200 },
      mountain: { min: 170, max: 350 },
      pacific: { min: 200, max: 400 },
    },
    mountain: {
      northeast: { min: 220, max: 420 },
      southeast: { min: 200, max: 380 },
      midwest: { min: 180, max: 350 },
      south: { min: 160, max: 320 },
      mountain: { min: 80, max: 220 },
      pacific: { min: 130, max: 280 },
    },
    pacific: {
      northeast: { min: 280, max: 520 },
      southeast: { min: 240, max: 440 },
      midwest: { min: 230, max: 420 },
      south: { min: 200, max: 400 },
      mountain: { min: 130, max: 280 },
      pacific: { min: 80, max: 220 },
    },
  };

  function estimate(originIATA, destState) {
    var iata = String(originIATA || "")
      .toUpperCase()
      .trim();
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
