---
layout: page
title: Hash Lookup
description: Look up file hashes against the CIRCL Hashlookup database to identify known clean and known malicious files.
permalink: /tools/hash-lookup/
nav: false
category: tools
---

<p style="margin-top: 2rem;">
  🔙 <a href="/blue-team/">Back to Blue Team Tools</a>
</p>

<div class="container my-4">
  <div class="text-center mb-4">
    <h2>🔍 Hash Lookup</h2>
    <p>Check an MD5, SHA-1, or SHA-256 hash against <a href="https://hashlookup.circl.lu/" target="_blank" rel="noopener noreferrer">CIRCL Hashlookup</a> — a free database aggregating NSRL (known-good software) and CIRCL's known-malicious indicators.</p>
  </div>

  <form id="hashlookup-form" class="mb-3">
    <div class="input-group">
      <input type="text" id="hash-input" class="form-control" placeholder="Enter MD5, SHA-1, or SHA-256 hash" autocomplete="off" spellcheck="false" maxlength="128">
      <button class="btn btn-primary" type="submit">Lookup</button>
    </div>
    <small class="form-text text-muted">Hash type is auto-detected by length: 32 = MD5, 40 = SHA-1, 64 = SHA-256.</small>
  </form>

  <div id="hashlookup-results"></div>
</div>

<script src="/assets/js/hash-lookup.js"></script>
