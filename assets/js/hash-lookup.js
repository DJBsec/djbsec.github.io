(function () {
  "use strict";

  const WORKER_URL = "https://hash-lookup-worker.bsherrill676.workers.dev/lookup";

  // Tiny DOM builder. Children may be strings (added as text nodes) or Nodes.
  // Attribute keys: "class" maps to className, "text" sets textContent,
  // everything else uses setAttribute.
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k of Object.keys(attrs)) {
        const v = attrs[k];
        if (v == null) continue;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else node.setAttribute(k, v);
      }
    }
    for (const c of children) {
      if (c == null) continue;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  function detectAlgo(hash) {
    if (!/^[a-f0-9]+$/i.test(hash)) return null;
    if (hash.length === 32) return "MD5";
    if (hash.length === 40) return "SHA-1";
    if (hash.length === 64) return "SHA-256";
    return null;
  }

  function alertBox(level, ...children) {
    return el("div", { class: "alert alert-" + level }, ...children);
  }

  function card(headerText, body) {
    return el("div", { class: "card mb-3" }, el("div", { class: "card-header", text: headerText }), el("div", { class: "card-body" }, body));
  }

  function pivotLinks(hash) {
    const h = encodeURIComponent(hash);
    const body = el("div", null);
    body.appendChild(el("p", { class: "mb-2", text: "Look up this hash on other threat intelligence platforms:" }));
    const targets = [
      { label: "VirusTotal", url: "https://www.virustotal.com/gui/file/" + h },
      { label: "MalwareBazaar", url: "https://bazaar.abuse.ch/browse.php?search=" + h },
      { label: "Hybrid Analysis", url: "https://www.hybrid-analysis.com/search?query=" + h },
    ];
    for (const t of targets) {
      body.appendChild(
        el("a", {
          class: "btn btn-sm btn-outline-secondary me-2 mb-2",
          href: t.url,
          target: "_blank",
          rel: "noopener noreferrer",
          text: t.label,
        })
      );
    }
    return card("Cross-Reference", body);
  }

  function trustBanner(data) {
    if (data.KnownMalicious) {
      return alertBox(
        "danger",
        el("strong", { text: "⚠️ Known malicious" }),
        " — this hash matches a known-bad sample (",
        el("code", { text: String(data.KnownMalicious) }),
        ")."
      );
    }
    const trust = data["hashlookup:trust"];
    if (trust !== undefined && trust !== "") {
      const t = Number(trust);
      if (!Number.isNaN(t)) {
        if (t >= 80) {
          return alertBox("success", el("strong", { text: "✅ Known clean" }), ` — high trust (${t}/100). Found in NSRL or other reputable sources.`);
        }
        if (t >= 50) {
          return alertBox("info", el("strong", { text: "ℹ️ Known file" }), ` — medium trust (${t}/100).`);
        }
        return alertBox("warning", el("strong", { text: "⚠️ Low trust" }), ` (${t}/100). Treat with caution.`);
      }
    }
    return alertBox("info", el("strong", { text: "ℹ️ Hash found" }), " in CIRCL Hashlookup database.");
  }

  function detailRow(label, value, asCode) {
    if (value == null || value === "") return null;
    const valNode = asCode ? el("code", { text: String(value) }) : document.createTextNode(String(value));
    return el("p", { class: asCode ? "mb-1" : null }, el("strong", { text: label + ": " }), valNode);
  }

  function detailsBody(data) {
    const wrap = el("div", null);
    const rows = [
      detailRow("File name", data.FileName),
      detailRow("File size", data.FileSize ? data.FileSize + " bytes" : null),
      detailRow("MIME type", data.mimetype),
      detailRow("Product", data.ProductCode && data.ProductCode.ProductName),
      detailRow("Source", data.source),
      detailRow("Database", data.db),
      detailRow("MD5", data.MD5, true),
      detailRow("SHA-1", data["SHA-1"], true),
      detailRow("SHA-256", data["SHA-256"], true),
    ].filter(Boolean);
    if (rows.length === 0) {
      wrap.appendChild(el("p", { class: "text-muted", text: "No additional details returned." }));
    } else {
      for (const r of rows) wrap.appendChild(r);
    }
    return wrap;
  }

  function spinnerNode() {
    const wrap = el("div", { class: "text-center my-3" });
    const spin = el("div", { class: "spinner-border text-primary", role: "status" });
    spin.appendChild(el("span", { class: "visually-hidden", text: "Loading..." }));
    wrap.appendChild(spin);
    return wrap;
  }

  function renderResult(hash, algo, status, data) {
    const resultsDiv = document.getElementById("hashlookup-results");
    resultsDiv.replaceChildren();

    if (status === 404) {
      resultsDiv.appendChild(
        alertBox(
          "warning",
          el("strong", { text: "No match found" }),
          " for " + algo + " hash ",
          el("code", { text: hash }),
          " in CIRCL Hashlookup.",
          el("br"),
          el("small", {
            text: "The hash is not in NSRL (known-good) or CIRCL's known-malicious sets. This does not mean the file is safe — check the cross-reference links below.",
          })
        )
      );
      resultsDiv.appendChild(pivotLinks(hash));
      return;
    }

    if (status !== 200 || !data || typeof data !== "object" || Array.isArray(data)) {
      const msg = data && typeof data === "object" && data.error ? String(data.error) : "Unexpected response from lookup service.";
      resultsDiv.appendChild(alertBox("danger", msg));
      return;
    }

    const heading = el("h5", null, "Results for " + algo + " ", el("code", { text: hash }));
    resultsDiv.appendChild(heading);
    resultsDiv.appendChild(trustBanner(data));
    resultsDiv.appendChild(card("File Details", detailsBody(data)));
    resultsDiv.appendChild(pivotLinks(hash));
  }

  document.getElementById("hashlookup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const resultsDiv = document.getElementById("hashlookup-results");
    const hash = document.getElementById("hash-input").value.trim().toLowerCase();
    const algo = detectAlgo(hash);

    if (!algo) {
      resultsDiv.replaceChildren(alertBox("danger", "Hash must be hexadecimal and 32 (MD5), 40 (SHA-1), or 64 (SHA-256) characters long."));
      return;
    }

    resultsDiv.replaceChildren(spinnerNode());

    fetch(WORKER_URL + "?hash=" + encodeURIComponent(hash))
      .then(async (res) => {
        let data = null;
        try {
          data = await res.json();
        } catch (_) {}
        renderResult(hash, algo, res.status, data);
      })
      .catch((err) => {
        resultsDiv.replaceChildren(alertBox("danger", "❌ Error contacting lookup service: " + (err && err.message ? err.message : "")));
      });
  });
})();
