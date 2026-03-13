---
layout: page
title: Network Segmentation
description: What is network segmentation?
img: assets/img/projects/network-segmentation.png
category: explained
topic_type: defense
icon: topology-ring
---

## 🌐 What Is Network Segmentation?

**Network segmentation** is the practice of dividing a computer network into smaller, isolated sections called segments or zones. Each segment has its own access rules, so a device or user in one zone cannot freely communicate with devices in another zone without explicit permission.

The security goal is **containment**. If an attacker compromises one part of your network — say, a guest Wi-Fi laptop or a vulnerable IoT thermostat — segmentation prevents them from moving freely to sensitive systems like servers, payment databases, or industrial controls. This lateral movement is how attackers often go from a minor foothold to a catastrophic breach.

Common segmentation approaches include VLANs (Virtual Local Area Networks), firewalls between zones, and micro-segmentation in cloud and virtualized environments where controls apply at the individual workload level.

---

### 🧪 Real-World Example

The 2013 Target breach began when attackers compromised a third-party HVAC vendor's credentials. Because Target's network allowed that vendor access to reach point-of-sale systems, 40 million credit card numbers were stolen. Proper segmentation — isolating vendor access from payment systems — would have contained the breach to the HVAC management network only.

---

### ✅ Key Takeaways

- Separate **guest Wi-Fi** from your internal corporate or home network so visitors cannot reach internal devices.
- Isolate **IoT devices** (smart TVs, cameras, thermostats) on their own network segment.
- Place **servers and databases** in a dedicated zone with strict inbound rules — only the applications that need them should reach them.
- Apply the **principle of least privilege** to network access, not just user accounts.
- Use a **firewall or access control list** between each segment to enforce the boundaries.
- Regularly **audit** what can talk to what — network access rules accumulate and drift over time.
