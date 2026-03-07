(function () {
  "use strict";

  /* SEC-03 / SEC-05 / SEC-06 */

  function esc(s) {
    if (s == null) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

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
      "permissions-policy": "https://owasp.org/www-project-secure-headers/#permissions-policy",
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

        // SEC-03: validate response shape
        if (!data || typeof data !== "object") {
          output.innerHTML = `<div class="header-fail">❌ Unexpected response from API.</div>`;
          return;
        }

        if (data.error) {
          output.innerHTML = `<div class="header-fail">❌ Error: ${esc(data.error)}</div>`;
          return;
        }

        if (!data.headers || typeof data.headers !== "object") {
          output.innerHTML = `<div class="header-fail">❌ No headers returned from API.</div>`;
          return;
        }

        const importantHeaders = [
          "strict-transport-security",
          "content-security-policy",
          "x-frame-options",
          "x-content-type-options",
          "referrer-policy",
          "permissions-policy",
        ];

        const suggestions = [];

        importantHeaders.forEach((key) => {
          const value = data.headers[key];
          const link = headerLinks[key];
          if (value) {
            // SEC-06: use createTextNode for header value to prevent XSS
            const row = document.createElement("div");
            row.className = "header-pass";
            row.innerHTML = `🟢 <strong><a href="${link}" target="_blank" style="color:#0f0">${key}</a></strong>: `;
            row.appendChild(document.createTextNode(value));
            output.appendChild(row);
          } else {
            output.innerHTML += `<div class="header-fail">🔴 <strong><a href="${link}" target="_blank" style="color:#f55">${key}</a></strong>: Not Set</div>`;

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

        if (suggestions.length > 0) {
          output.innerHTML += `<h3 style="margin-top: 2rem;">⚠️ Suggested Improvements</h3>`;
          suggestions.forEach((s) => {
            output.innerHTML += `<div class="header-fail">${s}</div>`;
          });
        } else {
          output.innerHTML += `<h3 style="margin-top: 2rem; color:#0f0;">✅ All key headers are set! Great job!</h3>`;
        }
      } catch (err) {
        spinner.style.display = "none";
        output.innerHTML = `<div class="header-fail">❌ Failed to check headers: ${esc(err.message)}</div>`;
      }
    });
  });
})();
