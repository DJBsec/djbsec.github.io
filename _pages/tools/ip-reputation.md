---
layout: page
title: IP Reputation Checker
description: Query suspicious IPs against GeoLocation, AbuseIPDB, VirusTotal, and GreyNoise.
permalink: /tools/ip-reputation/
nav: false
category: tools
---

<div class="container my-4">
  <div class="text-center mb-4">
    <h2>📡 IP Reputation Checker</h2>
    <p>Enter an IP address below to check its reputation across multiple threat intelligence sources.</p>
  </div>

  <form id="iplookup-form" class="mb-3">
    <div class="input-group">
      <input type="text" id="ip-input" class="form-control" placeholder="Enter IP address">
      <button class="btn btn-primary" type="submit">Check</button>
    </div>
  </form>

  <div id="iplookup-results"></div>
</div>

<!-- 🔻 THIS SCRIPT GOES HERE -->
<script>
document.getElementById('iplookup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const ip = document.getElementById('ip-input').value;
  const resultsDiv = document.getElementById('iplookup-results');
  resultsDiv.innerHTML = `
    <div class="text-center my-3">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;

  fetch(`https://ip-reputation.onrender.com/iplookup?ip=${ip}`)
    .then(res => res.json())
    .then(data => {
      let abuseScore = data.abuseipdb.abuseConfidenceScore;
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
            <p>Country: ${geo.country || 'N/A'}</p>
            <p>Region: ${geo.region || 'N/A'}</p>
            <p>City: ${geo.city || 'N/A'}</p>
            <p>ISP/Org: ${geo.org || 'N/A'}</p>
          </div>
        </div>
      `;

      const output = `
        <h5>Results for ${ip}</h5>

        ${geoCard}

        <div class="card mb-3">
          <div class="card-header">AbuseIPDB</div>
          <div class="card-body">
            <p>Confidence Score: ${abuseScore} ${abuseBadge}</p>
            <p>Total Reports: ${data.abuseipdb.totalReports}</p>
            <p>ISP: ${data.abuseipdb.isp}</p>
            <p>Country: ${data.abuseipdb.countryCode}</p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-header">GreyNoise</div>
          <div class="card-body">
            <p>Classification: <span class="badge bg-info">${data.greynoise.classification}</span></p>
            <p>Name: ${data.greynoise.name}</p>
            <p><a href="${data.greynoise.link}" target="_blank">GreyNoise Link 🔗</a></p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-header">VirusTotal</div>
          <div class="card-body">
            <p>ASN Owner: ${data.virustotal.as_owner}</p>
            <p>Country: ${data.virustotal.country}</p>
            <p>Malicious Reports: ${data.virustotal.last_analysis_stats.malicious}</p>
          </div>
        </div>
      `;
      resultsDiv.innerHTML = output;
    })
    .catch(err => {
      resultsDiv.innerHTML = `<div class="alert alert-danger">❌ Error fetching IP data: ${err.message}</div>`;
    });
});
</script>
