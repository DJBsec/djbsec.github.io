---
layout: page
title: IP Reputation Checker
description: Query suspicious IPs against GeoLocation, AbuseIPDB, VirusTotal, and GreyNoise.
permalink: /tools/ip-reputation/
nav: false
category: tools
---

<p style="margin-top: 2rem;">
  🔙 <a href="/blue-team/">Back to Blue Team Tools</a>
</p>

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

<script src="/assets/js/ip-reputation.js"></script>
