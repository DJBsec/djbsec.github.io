---
layout: page
title: Header Security Analyzer
permalink: /tools/header-analyzer/
nav: false
---

<style>
  .header-pass {
    background-color: #112; 
    color: #0f0; 
    padding: 0.5rem;
    margin-bottom: 0.3rem;
    border-left: 5px solid #0f0;
  }
  .header-fail {
    background-color: #211; 
    color: #f55; 
    padding: 0.5rem;
    margin-bottom: 0.3rem;
    border-left: 5px solid #f55;
  }
  #spinner {
    display: none;
    font-size: 1.2rem;
    margin-top: 1rem;
    color: #999;
  }
</style>

## 🛡️ HTTP Header Security Analyzer

Enter a secure URL to analyze key HTTP security headers:

<p>
  <input type="text" id="urlInput" placeholder="https://example.com" style="width: 100%; max-width: 500px;" />
  <button id="checkButton">Check</button>
</p>

<div id="spinner">⏳ Checking headers...</div>
<div id="headerResults" style="margin-top: 1rem;"></div>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("checkButton");
  const input = document.getElementById("urlInput");
  const output = document.getElementById("headerResults");
  const spinner = document.getElementById("spinner");

  const headerLinks = {
    "strict-transport-security": "https://owasp.org/www-project-secure-headers/#strict-transport-security",
    "content-security-policy": "https://owasp.org/www-project-secure-headers/#content-security-policy",
    "x-frame-options": "https://owasp.org/www-project-secure-headers/#x-frame-options",
    "x-content-type-options": "https://owasp.org/www-project-secure-headers/#x-content-type-options",
    "referrer-policy": "https://owasp.org/www-project-secure-headers/#referrer-policy",
    "permissions-policy": "https://owasp.org/www-project-secure-headers/#permissions-policy"
  };

  button.addEventListener("click", async () => {
    const url = input.value.trim();
    output.innerHTML = "";
    spinner.style.display = "block";

    if (!url.startsWith("https://")) {
      spinner.style.display = "none";
      output.innerHTML = `<div class="header-fail">❌ Please enter a valid HTTPS URL.</div>`;
      return;
    }

    try {
      const encodedURL = encodeURIComponent(url);
      const res = await fetch(`https://header-proxy.onrender.com/headers?url=${encodedURL}`);
      const data = await res.json();
      spinner.style.display = "none";

      if (data.error) {
        output.innerHTML = `<div class="header-fail">❌ Error: ${data.error}</div>`;
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

      const suggestions = [];

      importantHeaders.forEach(key => {
        const value = data.headers[key];
        const link = headerLinks[key];
        if (value) {
          output.innerHTML += `<div class="header-pass">🟢 <strong><a href="${link}" target="_blank" style="color:#0f0">${key}</a></strong>: ${value}</div>`;
        } else {
          output.innerHTML += `<div class="header-fail">🔴 <strong><a href="${link}" target="_blank" style="color:#f55">${key}</a></strong>: Not Set</div>`;

          // Suggestion logic
          switch (key) {
            case "strict-transport-security":
              suggestions.push("🔒 Add `Strict-Transport-Security` to enforce HTTPS connections.");
              break;
            case "content-security-policy":
              suggestions.push("🧱 Add `Content-Security-Policy` to prevent XSS and injection attacks.");
              break;
            case "x-frame-options":
              suggestions.push("🖼️ Add `X-Frame-Options` to prevent clickjacking.");
              break;
            case "x-content-type-options":
              suggestions.push("🧪 Add `X-Content-Type-Options` to block MIME-type sniffing.");
              break;
            case "referrer-policy":
              suggestions.push("🔍 Add `Referrer-Policy` to limit referer info leaks.");
              break;
            case "permissions-policy":
              suggestions.push("📱 Add `Permissions-Policy` to restrict features like camera, mic, geolocation.");
              break;
          }
        }
      });

      // Add suggestions block
      if (suggestions.length > 0) {
        output.innerHTML += `<h3 style="margin-top: 2rem;">⚠️ Suggested Improvements</h3>`;
        suggestions.forEach(s => {
          output.innerHTML += `<div class="header-fail">${s}</div>`;
        });
      } else {
        output.innerHTML += `<h3 style="margin-top: 2rem; color:#0f0;">✅ All key headers are set! Great job!</h3>`;
      }

    } catch (err) {
      spinner.style.display = "none";
      output.innerHTML = `<div class="header-fail">❌ Failed to check headers: ${err.message}</div>`;
    }
  });
});
</script>
---

<p style="margin-top: 2rem;">
  🔙 <a href="/blue-team/">Back to Blue Team Tools</a>
</p>
