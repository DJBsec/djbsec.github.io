---
layout: page
title: Man-in-the-Middle Attacks
description: What is a man-in-the-middle attack?
img: assets/img/projects/man-in-the-middle.png
category: explained
topic_type: threat
icon: arrows-exchange
---

## 🕵️ What Is a Man-in-the-Middle Attack?

A **man-in-the-middle (MitM) attack** occurs when an attacker secretly intercepts and potentially alters communication between two parties who believe they are communicating directly with each other. Think of it like a postal worker opening your letters, reading or changing the contents, resealing them, and sending them on — with neither the sender nor recipient ever knowing. MitM attacks can target web browsing, email, messaging apps, and even financial transactions. Common techniques include rogue Wi-Fi hotspots, ARP spoofing on local networks, and SSL stripping (downgrading a secure HTTPS connection to unencrypted HTTP). The attacker can passively eavesdrop to harvest credentials or actively modify data in transit.

---

### 🧪 Real-World Example

You connect to a free Wi-Fi network at an airport called "AirportFreeWifi." Unknown to you, the hotspot is run by an attacker. When you visit your bank's website, the attacker intercepts the traffic, captures your login credentials, and relays your session normally so you never notice anything is wrong.

---

### 🛡️ How to Protect Yourself

- Always verify that websites use HTTPS (padlock icon) before entering any sensitive information
- Avoid using public or unsecured Wi-Fi for banking, email, or any sensitive activity
- Use a VPN on public networks to encrypt your traffic end-to-end
- Pay attention to browser warnings about invalid or untrusted certificates
- Keep your device's operating system and browser updated to protect against known vulnerabilities
- Use MFA so that stolen credentials alone are not enough to access your accounts
