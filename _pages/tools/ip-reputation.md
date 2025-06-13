---
layout: page
title: IP Reputation Checker
permalink: /tools/ip-reputation/
nav: false
---

## 🔐 Secure IP Reputation Checker

Enter an IP you've previously submitted via GitHub Actions:

<input type="text" id="ipInput" placeholder="e.g. 1.2.3.4" />
<button onclick="lookupIP()">Check</button>

<pre id="ipResult" style="margin-top: 1rem; background: #111; color: #0f0; padding: 1rem;"></pre>

<script src="/assets/js/ip-cache-reader.js"></script>
