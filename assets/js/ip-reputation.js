(function () {
  "use strict";

  /* SEC-02 / SEC-03 / SEC-05 / SEC-06 */

  function esc(s) {
    if (s == null) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function safeHref(url) {
    try {
      const u = new URL(url);
      return u.protocol === "https:" ? esc(url) : null;
    } catch {
      return null;
    }
  }

  document.getElementById("iplookup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const ip = document.getElementById("ip-input").value.trim();
    const resultsDiv = document.getElementById("iplookup-results");
    resultsDiv.innerHTML = `
      <div class="text-center my-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

    fetch(`https://ip-reputation.onrender.com/iplookup?ip=${encodeURIComponent(ip)}`)
      .then((res) => res.json())
      .then((data) => {
        // SEC-03: validate response shape before accessing nested fields
        if (
          !data ||
          typeof data.abuseipdb !== "object" ||
          typeof data.ipinfo !== "object" ||
          typeof data.greynoise !== "object" ||
          typeof data.virustotal !== "object"
        ) {
          resultsDiv.innerHTML = `<div class="alert alert-danger">Unexpected response from API.</div>`;
          return;
        }

        const abuseScore = Number(data.abuseipdb.abuseConfidenceScore) || 0;
        let abuseBadge = '<span class="badge bg-success">🟢 Clean</span>';
        if (abuseScore >= 70) {
          abuseBadge = '<span class="badge bg-danger">🔴 High Risk</span>';
        } else if (abuseScore >= 20) {
          abuseBadge = '<span class="badge bg-warning text-dark">🟡 Suspicious</span>';
        }

        const geo = data.ipinfo;
        const geoCard = `
          <div class="card mb-3">
            <div class="card-header">IP Geolocation</div>
            <div class="card-body">
              <p>Country: ${esc(geo.country) || "N/A"}</p>
              <p>Region: ${esc(geo.region) || "N/A"}</p>
              <p>City: ${esc(geo.city) || "N/A"}</p>
              <p>ISP/Org: ${esc(geo.org) || "N/A"}</p>
            </div>
          </div>
        `;

        // SEC-02: validate GreyNoise link is https: before rendering as href
        const gnLink = safeHref(data.greynoise.link);
        const gnLinkHtml = gnLink ? `<p><a href="${gnLink}" target="_blank" rel="noopener noreferrer">GreyNoise Link 🔗</a></p>` : "";

        const vtStats = data.virustotal.last_analysis_stats || {};
        const output = `
          <h5>Results for ${esc(ip)}</h5>

          ${geoCard}

          <div class="card mb-3">
            <div class="card-header">AbuseIPDB</div>
            <div class="card-body">
              <p>Confidence Score: ${esc(abuseScore)} ${abuseBadge}</p>
              <p>Total Reports: ${esc(data.abuseipdb.totalReports)}</p>
              <p>ISP: ${esc(data.abuseipdb.isp)}</p>
              <p>Country: ${esc(data.abuseipdb.countryCode)}</p>
            </div>
          </div>

          <div class="card mb-3">
            <div class="card-header">GreyNoise</div>
            <div class="card-body">
              <p>Classification: <span class="badge bg-info">${esc(data.greynoise.classification)}</span></p>
              <p>Name: ${esc(data.greynoise.name)}</p>
              ${gnLinkHtml}
            </div>
          </div>

          <div class="card mb-3">
            <div class="card-header">VirusTotal</div>
            <div class="card-body">
              <p>ASN Owner: ${esc(data.virustotal.as_owner)}</p>
              <p>Country: ${esc(data.virustotal.country)}</p>
              <p>Malicious Reports: ${esc(vtStats.malicious)}</p>
            </div>
          </div>
        `;
        resultsDiv.innerHTML = output;
      })
      .catch((err) => {
        resultsDiv.innerHTML = `<div class="alert alert-danger">❌ Error fetching IP data: ${esc(err.message)}</div>`;
      });
  });
})();
