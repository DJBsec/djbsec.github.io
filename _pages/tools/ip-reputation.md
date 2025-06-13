---
layout: page
title: IP Reputation Checker
permalink: /tools/ip-reputation/
---

## 🔐 Secure IP Reputation Checker

Enter an IP you've previously submitted to check its abuse report:

```liquid
{% assign ip = '1.2.3.4' %}
{% assign data = site.data.ipcache[ip] %}

{% if data %}
✅ **IP:** {{ data.data.ipAddress }}  
🌍 **Country:** {{ data.data.countryCode }}  
🛡️ **Abuse Score:** {{ data.data.abuseConfidenceScore }}  
🕒 **Last Reported:** {{ data.data.lastReportedAt }}  
🔗 [View on AbuseIPDB](https://www.abuseipdb.com/check/{{ ip }})
{% else %}
❌ No cached data found. Use the button below to query it via GitHub Actions.
{% endif %}
