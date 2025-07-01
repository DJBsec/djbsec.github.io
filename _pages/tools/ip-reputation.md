---
layout: page
title: IP Reputation Checker
description: Query suspicious IPs against AbuseIPDB, VirusTotal, and GreyNoise.
permalink: /tools/ip-reputation/
nav: true
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

<script>
document.getElementById('iplookup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const ip = document.getElementById('ip-input').value;
  document.getElementById('iplookup-results').innerHTML = "Loading...";

  fetch(`https://your-render-url.onrender.com/iplookup?ip=${ip}`)
    .then(res => res.json())
    .then(data => {
      let output = `
        <h5>Results for ${ip}</h5>
        <div class="card mb-3">
          <div class="card-body">
            <h6>AbuseIPDB</h6>
            <p>Confidence Score: ${data.abuseipdb.abuseConfidenceScore}</p>
            <p>Total Reports: ${data.abuseipdb.totalReports}</p>
            <p>ISP: ${data.abuseipdb.isp}</p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h6>GreyNoise</h6>
            <p>Classification: ${data.greynoise.classification}</p>
            <p>Name: ${data.greynoise.name}</p>
            <p><a href="${data.greynoise.link}" target="_blank">GreyNoise Link</a></p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h6>VirusTotal</h6>
            <p>ASN Owner: ${data.virustotal.as_owner}</p>
            <p>Country: ${data.virustotal.country}</p>
            <p>Malicious Reports: ${data.virustotal.last_analysis_stats.malicious}</p>
          </div>
        </div>
      `;
      document.getElementById('iplookup-results').innerHTML = output;
    })
    .catch(err => {
      document.getElementById('iplookup-results').innerHTML = '<p class="text-danger">Error fetching IP data.</p>';
    });
});
</script>
