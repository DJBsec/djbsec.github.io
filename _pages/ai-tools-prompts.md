---
layout: page
title: AI Tools & Prompts
description: Learn how to use AI effectively with curated prompt repositories and resources to get better results from tools like ChatGPT, Claude, Copilot, and more.
permalink: /ai-tools-prompts/
nav: false
---

## AI Tools & Prompt Library

This page is a collection of **AI prompts I've written** — ready to copy and use with ChatGPT, Microsoft Copilot, and security-focused AI workflows.

**What is a prompt?** It's the instruction you type into an AI tool. A well-written prompt gets you a focused, useful answer. A vague one gets you a vague response. The prompts here are designed to skip the guesswork — just pick one, paste it in, and go.

Prompts are organized into three sections based on the tool or use case:

- **Security** — cybersecurity roadmaps, M365 hardening, and security advisory
- **ChatGPT** — learning, summarizing, and prompt writing fundamentals
- **Copilot** — Microsoft 365 productivity and executive communication

---

{% for category in site.data.ai_prompts %}
{% include prompt_category.liquid category=category %}
{% endfor %}

---

<!-- ===================== Tips ===================== -->
<div class="djb-card djb-card--accent-left mb-4">
  <div class="mb-3">
    <p class="eyebrow" style="margin-bottom: 4px;">Prompt Tips</p>
    <h3 class="djb-card__title" style="margin-bottom: 4px;">Prompt Writing Tips</h3>
    <p class="djb-card__desc">Five principles for getting better results from any AI tool</p>
  </div>
  <div>
    <ol class="mb-0">
      <li class="mb-3">
        <strong>Be specific</strong><br>
        Instead of <em>"explain firewalls"</em>, try <em>"explain how stateful firewalls differ from packet filtering firewalls, in plain language for a non-technical audience."</em>
      </li>
      <li class="mb-3">
        <strong>Assign a role</strong><br>
        Start with <em>"You are a senior cybersecurity analyst…"</em> to prime the AI with the right perspective and vocabulary.
      </li>
      <li class="mb-3">
        <strong>Provide context</strong><br>
        Tell the AI who the output is for, what format you need, and any constraints — the more context, the better the result.
      </li>
      <li class="mb-3">
        <strong>Iterate</strong><br>
        Treat your first response as a draft. Follow up with <em>"make it shorter"</em>, <em>"add more detail on X"</em>, or <em>"rewrite for a technical audience"</em>.
      </li>
      <li class="mb-0">
        <strong>Use examples</strong><br>
        Show the AI what you want by including a sample in your prompt — this is called <em>few-shot prompting</em> and dramatically improves output quality.
      </li>
    </ol>
  </div>
</div>
