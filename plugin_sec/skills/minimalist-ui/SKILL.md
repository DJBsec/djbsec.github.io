---
name: minimalist-ui
description: Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows.
source: https://github.com/Leonxlnx/taste-skill (skills/minimalist-skill), MIT License, (c) 2026 Leonxlnx
note: Saved into this project so the Claude Code Radar page styling travels with the repo. Applied by build_html.py. Not a Cowork-registered skill — it is reference design guidance.
---

# Protocol: Premium Utilitarian Minimalism UI Architect

## 1. Protocol Overview
Name: Premium Utilitarian Minimalism & Editorial UI
Description: An advanced frontend engineering directive for generating highly refined, ultra-minimalist, "document-style" web interfaces analogous to top-tier workspace platforms. This protocol strictly enforces a high-contrast warm monochrome palette, bespoke typographic hierarchies, meticulous structural macro-whitespace, bento-grid layouts, and an ultra-flat component architecture with deliberate muted pastel accents. It actively rejects standard generic SaaS design trends.

## 2. Absolute Negative Constraints (Banned Elements)
- DO NOT use the "Inter", "Roboto", or "Open Sans" typefaces.
- DO NOT use generic, thin-line icon libraries like "Lucide", "Feather", or standard "Heroicons".
- DO NOT use heavy drop shadows. Shadows must be practically non-existent or heavily customized to be ultra-diffuse and low opacity (< 0.05).
- DO NOT use primary colored backgrounds for large elements or sections.
- DO NOT use gradients, neon colors, or 3D glassmorphism (beyond subtle navbar blurs).
- DO NOT use rounded-full (pill shapes) for large containers, cards, or primary buttons.
- DO NOT use emojis anywhere in code, markup, text content, headings, or alt text.
- DO NOT use AI copywriting cliches: "Elevate", "Seamless", "Unleash", "Next-Gen", "Game-changer", "Delve".

## 3. Typographic Architecture
- Primary Sans-Serif (Body, UI): clean, geometric, or system-native fonts with character ('SF Pro Display', 'Geist Sans', 'Helvetica Neue', 'Switzer').
- Editorial Serif (Hero Headings): 'Lyon Text', 'Newsreader', 'Playfair Display', 'Instrument Serif'. Tight tracking (-0.02em to -0.04em), tight line-height (1.1).
- Monospace (Code, Meta-data): 'Geist Mono', 'SF Mono', 'JetBrains Mono'.
- Text Colors: never absolute black. Off-black/charcoal (#111111 or #2F3437), line-height 1.6. Secondary muted gray (#787774).

## 4. Color Palette (Warm Monochrome + Spot Pastels)
- Canvas / Background: Pure White #FFFFFF or Warm Bone/Off-White #F7F6F3 / #FBFBFA.
- Primary Surface (Cards): #FFFFFF or #F9F9F8.
- Structural Borders / Dividers: Ultra-light gray #EAEAEA or rgba(0,0,0,0.06).
- Accent Colors: highly desaturated, washed-out pastels for tags / inline code / icon backgrounds.
  - Pale Red: #FDEBEC (Text: #9F2F2D)
  - Pale Blue: #E1F3FE (Text: #1F6C9F)
  - Pale Green: #EDF3EC (Text: #346538)
  - Pale Yellow: #FBF3DB (Text: #956400)

## 5. Component Specifications
- Cards: border 1px solid #EAEAEA; crisp radius 8px-12px max; generous internal padding (24px-40px).
- Tags & Status Badges: pill-shaped, very small typography, uppercase with wide tracking (0.05em); muted pastel backgrounds.
- Dividers: separate items with border-bottom 1px solid #EAEAEA rather than container boxes.
- Keystrokes: <kbd> with 1px border, 4px radius, #F7F6F3 background, monospace.

## 6. Subtle Motion & Micro-Animations
- Scroll Entry: fade in gently. translateY(12px) + opacity 0 resolving over 600ms with cubic-bezier(0.16, 1, 0.3, 1). Use IntersectionObserver, never scroll listeners.
- Hover States: ultra-subtle shadow shift (0 0 0 to 0 2px 8px rgba(0,0,0,0.04) over 200ms).
- Staggered Reveals: cascade delay (index * 80ms). Never mount everything at once.
- Performance: animate exclusively via transform and opacity.

## 7. Execution Protocol
1. Establish macro-whitespace first (massive vertical padding between sections).
2. Constrain main content width.
3. Apply custom typographic hierarchy and monochromatic color variables immediately.
4. Every card, divider, and border adheres strictly to 1px solid #EAEAEA.
5. Add scroll-entry animations to major content blocks.
6. Sections have visual depth through subtle texture, not empty flat backgrounds.
