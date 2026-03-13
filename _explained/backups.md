---
layout: page
title: Backups & the 3-2-1 Rule
description: What is the 3-2-1 backup rule?
img: assets/img/projects/backups.png
category: explained
topic_type: defense
icon: cloud-upload
---

## 💾 What Is the 3-2-1 Backup Rule?

**Backups** are copies of your data stored separately from the original, so you can recover if data is lost, corrupted, or held hostage by ransomware. The **3-2-1 rule** is the simplest and most widely recommended framework for doing backups reliably:

- **3** — Keep at least three copies of your data (the original plus two backups).
- **2** — Store copies on at least two different types of media (e.g., an internal drive and an external drive, or a local NAS and cloud storage).
- **1** — Keep at least one copy **offsite** — physically or geographically separate from the others.

The logic is straightforward: a single backup stored next to the original fails if the building burns down or ransomware encrypts everything connected to the same network. Offsite and offline copies survive those scenarios.

A backup that has never been tested is not a real backup. Regularly restore files from your backups to confirm they actually work.

---

### 🧪 Real-World Example

> A small business is hit by ransomware on a Monday morning. Every file on the network is encrypted, and attackers demand $50,000. The IT team checks their backups — they have a cloud backup from the previous night and an offline external drive updated weekly. Within four hours, systems are restored from the cloud backup. They pay nothing.

---

### ✅ Key Takeaways

- Follow the **3-2-1 rule**: three copies, two media types, one offsite.
- Ensure at least one backup is **offline or air-gapped** so ransomware cannot reach it.
- **Automate** your backups — manual processes get skipped.
- **Test restores** on a schedule; a backup you have never restored from may be corrupted or incomplete.
- Back up **all critical data**: documents, databases, email, configuration files, and system images.
- Know your **recovery time objective (RTO)** — how fast you need to be back up — and ensure your backup solution can meet it.
