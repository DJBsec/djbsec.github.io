---
layout: page
title: Principle of Least Privilege
description: What is the principle of least privilege?
img: assets/img/projects/least-privilege.png
category: explained
topic_type: defense
icon: user-check
---

## 🔒 What Is the Principle of Least Privilege?

The **principle of least privilege (PoLP)** means giving every user, application, and system only the minimum level of access needed to do its job — nothing more. An accountant needs access to financial records but not to the engineering code repository. A web server needs to read files but not to install new software. Limiting access by default dramatically reduces the damage that can result from an error, a compromised account, or a malicious insider.

Least privilege applies everywhere: user accounts, service accounts, database permissions, cloud IAM roles, and even what code can do at runtime. The complementary concept of **just-in-time access** takes this further — granting elevated permissions only for the duration of a specific task, then revoking them automatically.

The failure to apply least privilege is behind a huge proportion of serious breaches. When attackers or malware gain access to an account, they inherit that account's permissions. A low-privilege account limits the blast radius; an over-privileged one can lead to full network compromise.

---

### 🧪 Real-World Example

A marketing intern is given a company login. With no least-privilege controls, their account has the same broad access as a senior engineer — including production databases. The intern clicks a phishing link, and the attacker now has access to customer records. Had the account been scoped to only the tools the intern actually needs, the breach would have been contained.

---

### ✅ Key Takeaways

- **Audit existing accounts** regularly and remove permissions that are no longer needed.
- Avoid using **administrator or root accounts** for everyday tasks — use them only when required.
- Apply least privilege to **service accounts and APIs** — they are frequent targets and often over-permissioned.
- Use **role-based access control (RBAC)** to assign permissions to roles, then assign roles to users, rather than granting individual permissions ad hoc.
- Implement **just-in-time access** for sensitive operations so elevated rights expire automatically.
- Log and alert on **privilege escalation events** — legitimate users rarely need to suddenly access things outside their role.
