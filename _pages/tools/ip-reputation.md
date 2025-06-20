---
layout: page
title: IP Reputation Checker (Live)
permalink: /tools/ip-live/
nav: false
---

## 🧠 Live IP Reputation Checker

Enter any IP address:

<input type="text" id="ipInput" placeholder="e.g. 1.2.3.4" />
<button onclick="checkIP()">Check</button>

<pre id="ipResult" style="margin-top: 1rem; background: #111; color: #0f0; padding: 1rem;"></pre>

<script>
  async function checkIP() {
    const ip = document.getElementById("ipInput").value.trim();
    const resultBox = document.getElementById("ipResult");
    resultBox.textContent = "🔍 Checking AbuseIPDB...";

    try {
      const res = await fetch(`https://YOUR_PROXY_DOMAIN/.netlify/functions/abuseipdb-proxy?ip=${ip}`);
      if (!res.ok) throw new Error("Lookup failed");

      const json = await res.json();
      const d = json.data;

      resultBox.textContent = `
✅ IP: ${d.ipAddress}
🌍 Country: ${d.countryCode}
🏷️ ISP: ${d.isp}
🛡️ Abuse Score: ${d.abuseConfidenceScore}
🕒 Last Reported: ${d.lastReportedAt}
🔗 https://www.abuseipdb.com/check/${ip}
      `.trim();
    } catch (err) {
      resultBox.textContent = "❌ Error looking up IP or invalid response.";
    }
  }
</script>

---

<p style="margin-top: 2rem;">
  🔙 <a href="/blue-team/">Back to Blue Team Tools</a>
</p>
