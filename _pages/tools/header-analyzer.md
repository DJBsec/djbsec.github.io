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

<script src="/assets/js/header-analyzer.js"></script>

---

<p style="margin-top: 2rem;">
  🔙 <a href="/blue-team/">Back to Blue Team Tools</a>
</p>
