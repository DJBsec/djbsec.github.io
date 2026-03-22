---
layout: page
title: Cybersecurity Podcasts
permalink: /podcasts/
description: Curated list of the best cybersecurity podcasts to keep you informed and inspired.
nav: false
nav_order: 2
---

<div class="learn-grid">
{% assign podcasts = "
401 Access Denied|https://www.itpro.tv/podcast/401-access-denied|IT security topics explained for practitioners
7 Minute Security|https://7ms.us|Short practical security lessons — great for commutes
8th Layer Insights|https://8thlayerinsights.com|The human side of cybersecurity
Absolute AppSec|https://absoluteappsec.com|Application security deep dives
Breaking Down Security|https://brakeingsecurity.com|Security concepts and current news
Click Here|https://clickhereshow.com|Investigative journalism on major security breaches
Crypto-Gram Security Podcast|https://www.schneier.com/crypto-gram|Bruce Schneier's monthly security digest
Cyber Security Headlines|https://cisoseries.com/cyber-security-headlines|Daily briefings from the CISO Series
Darknet Diaries|https://darknetdiaries.com|True crime stories from the dark side of the internet
Hacker Valley Studio|https://hackervalley.com|Cybersecurity leadership and career development
Hacking Humans|https://thecyberwire.com/podcasts/hacking-humans|Social engineering and phishing awareness
Malicious Life|https://malicious.life|The untold history of cybersecurity
Risky Business|https://risky.biz|Weekly news and analysis with Patrick Gray
Security Now|https://twit.tv/shows/security-now|Deep technical security dives with Steve Gibson
Security Weekly|https://www.securityweekly.com|Industry news and practitioner interviews
Simply Cyber|https://www.simplycyber.io|Cyber career development and skill building
Smashing Security|https://www.smashingsecurity.com|A lighthearted take on security news
The Cyberlaw Podcast|https://www.lawfareblog.com/topic/cyberlaw-podcast|Lawfare's analysis of cyberlaw and policy
The Hacker Mind|https://thehackermind.com|Stories and interviews from the hacker community
The Privacy, Security, & OSINT Show|https://inteltechniques.com/podcast.html|Privacy, security, and OSINT techniques
Unsupervised Learning|https://danielmiessler.com/podcast|Daniel Miessler's weekly curated security insights
" | split: "
" %}
{% for line in podcasts %}
{% assign parts = line | split: "|" %}
{% if parts[0] != "" %}
  <div class="djb-card">
    <span class="chip chip--secondary">Podcast</span>
    <p class="djb-card__title">{{ parts[0] }}</p>
    <p class="djb-card__desc">{{ parts[2] }}</p>
    <a href="{{ parts[1] }}" class="home-section-header__link" target="_blank" rel="noopener noreferrer">Listen &rarr;</a>
  </div>
{% endif %}
{% endfor %}
</div>
