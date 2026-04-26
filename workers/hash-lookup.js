// Cloudflare Worker — proxies CIRCL Hashlookup so the static site can call it
// from the browser (CIRCL restricts Access-Control-Allow-Origin to its own domain).
//
// Deploy: paste this into a new Cloudflare Worker. Default route name suggested:
//   hash-lookup-worker.bsherrill676.workers.dev
// Frontend calls: GET <worker>/lookup?hash=<md5|sha1|sha256>
//
// CIRCL endpoint: https://hashlookup.circl.lu/lookup/{md5|sha1|sha256}/{hash}
// Returns 200 with JSON when known, 404 with {"message":"Non existing ..."} when unknown.

const ALLOWED_ORIGINS = new Set([
  "https://djbsec.github.io",
  "https://djbsec.com",
  "https://www.djbsec.com",
  "http://localhost:4000",
  "http://127.0.0.1:4000",
]);

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : "https://djbsec.github.io";
  return {
    "Access-Control-Allow-Origin": allow,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

export default {
  async fetch(request) {
    const cors = corsHeaders(request.headers.get("Origin") || "");

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "GET") return jsonResponse({ error: "Method not allowed" }, 405, cors);

    const hash = (new URL(request.url).searchParams.get("hash") || "").trim().toLowerCase();
    if (!/^[a-f0-9]+$/.test(hash)) {
      return jsonResponse({ error: "Invalid hash: must be hexadecimal" }, 400, cors);
    }

    let algo;
    if (hash.length === 32) algo = "md5";
    else if (hash.length === 40) algo = "sha1";
    else if (hash.length === 64) algo = "sha256";
    else {
      return jsonResponse(
        { error: "Hash must be 32 (MD5), 40 (SHA-1), or 64 (SHA-256) hex characters" },
        400,
        cors,
      );
    }

    try {
      const upstream = await fetch(`https://hashlookup.circl.lu/lookup/${algo}/${hash}`, {
        headers: { Accept: "application/json" },
      });
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: { "Content-Type": "application/json", ...cors },
      });
    } catch (e) {
      return jsonResponse({ error: "Upstream lookup failed" }, 502, cors);
    }
  },
};
