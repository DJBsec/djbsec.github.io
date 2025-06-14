---
layout: page
title: Header Security Analyzer
permalink: /tools/header-analyzer/
nav: false
---

## 🛡️ HTTP Header Security Analyzer

Enter a **secure website URL** (HTTPS only):

<input type="text" id="urlInput" placeholder="https://example.com" style="width: 100%; max-width: 500px;" />
<button onclick="checkHeaders()">Check</button>

<pre id="headerResults" style="margin-top: 1rem; background: #111; color: #0f0; padding: 1rem;"></pre>

<script>
async function checkHeaders() {
  const url = document.getElementById("urlInput").value.trim();
  const output = document.getElementById("headerResults");

  if (!url.startsWith("https://")) {
    output.textContent = "❌ Please enter a valid HTTPS URL.";
    return;
  }

  output.textContent = "⏳ Checking headers...";

  try {
    const encodedURL = encodeURIComponent(url);
    const res = await fetch(`https://header-proxy.onrender.com/headers?url=${encodedURL}`);
    const data = await res.json();

    if (data.error) {
      output.textContent = `❌ Error: ${data.error}`;
      return;
    }

    const importantHeaders = [
      "strict-transport-security",
      "content-security-policy",
      "x-frame-options",
      "x-content-type-options",
      "referrer-policy",
      "permissions-policy"
    ];

    let results = "📦 Security Headers:\n\n";
    for (const key of importantHeaders) {
      if (data.headers[key]) {
        results += `✅ ${key}: ${data.headers[key]}\n`;
      } else {
        results += `❌ ${key}: Not Set\n`;
      }
    }

    output.textContent = results;
  } catch (err) {
    output.textContent = `❌ Failed to check headers: ${err.message}`;
  }
}
</script>