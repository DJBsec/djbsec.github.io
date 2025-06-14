---
layout: page
title: Header Security Analyzer
permalink: /tools/header-analyzer/
nav: false
---

## 🛡️ HTTP Header Security Analyzer

Enter a secure URL (must be HTTPS):

<input type="text" id="urlInput" placeholder="https://example.com" style="width: 100%; max-width: 400px;" />
<button onclick="checkHeaders()">Check</button>

<div id="headerResults" style="margin-top: 1.5rem; padding: 1rem; background: #111; color: #0f0;"></div>

<script>
async function checkHeaders() {
  const url = document.getElementById("urlInput").value.trim();
  const output = document.getElementById("headerResults");
  output.textContent = "⏳ Fetching headers...";

  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    // The response will not expose headers in 'no-cors' mode, so we fake demo here
    output.innerHTML = `
⚠️ Most headers cannot be read due to browser CORS restrictions.<br><br>
This tool must be run through a proxy or backend to access full headers from third-party domains.

✅ You can try scanning your own domain by setting up a secure proxy.
    `;
  } catch (error) {
    output.textContent = "❌ Error fetching headers: " + error.message;
  }
}
</script>
