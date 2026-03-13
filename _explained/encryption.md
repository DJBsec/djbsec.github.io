---
layout: page
title: Encryption
description: What is encryption?
img: assets/img/projects/encryption.png
category: explained
topic_type: defense
icon: lock
---

## 🔐 What Is Encryption?

**Encryption** is the process of scrambling data into an unreadable format so that only someone with the correct key can read it. Think of it like a combination lock on your information — the data is still there, but it looks like gibberish to anyone who doesn't have the right code to unlock it.

Encryption protects data both **in transit** (moving across the internet) and **at rest** (stored on a device or server). When you see "HTTPS" in your browser's address bar, that padlock icon means your connection is encrypted using TLS. When your phone asks you to set a passcode, that passcode helps encrypt the files stored on the device.

Modern encryption relies on complex mathematics. Common standards like AES-256 (used for storing data) and RSA (used for exchanging keys) are so strong that breaking them by brute force would take longer than the age of the universe with today's computers.

---

### 🧪 Real-World Example

You log in to your bank's website. Before your username and password travel from your browser to the bank's server, encryption scrambles them into ciphertext. Even if an attacker intercepted that traffic on a public Wi-Fi network, they would see only random characters — not your credentials.

---

### ✅ Key Takeaways

- Always use websites and services that show **HTTPS** in the URL bar.
- Enable **full-disk encryption** on laptops and phones (FileVault on macOS, BitLocker on Windows, built-in on modern iOS/Android).
- Use **end-to-end encrypted** messaging apps (like Signal) for sensitive conversations.
- Strong encryption is only useful if you protect your **keys and passwords** — a great lock means nothing if you hand out the key.
- Encryption does not prevent all attacks — it protects data confidentiality, but you still need other controls for integrity and access.
