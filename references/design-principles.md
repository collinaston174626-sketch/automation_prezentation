# Design Principles Reference

Consolidated visual design system from Apple Keynote conventions, applied as an immutable Light theme.

## Table of Contents
1. [Light Theme Enforcement](#light-theme-enforcement)
2. [Apple Keynote Design Rules](#apple-keynote-design-rules)
3. [Complete Color Specification](#complete-color-specification)
4. [Shadow & Depth System](#shadow--depth-system)
5. [Spacing & Layout Grid](#spacing--layout-grid)
6. [Animation Timing Profiles](#animation-timing-profiles)
7. [Slide Count & Pacing](#slide-count--pacing)
8. [Progressive Enhancement](#progressive-enhancement)
9. [OOXML Technical Reference](#ooxml-technical-reference)
10. [PptxGenJS Patterns](#pptxgenjs-patterns)

---

## Light Theme Enforcement

**This is non-negotiable. Every presentation MUST use the Light theme.**

### Mandatory Rules
- ALL content slide backgrounds: `#FFFFFF` (pure white)
- ALL section divider backgrounds: `#F5F5F7` (Apple light gray)
- NEVER use dark backgrounds (#000000, #1D1D1F, #2C2C2C, or any dark color as bg)
- NEVER invert the color scheme (white text on dark bg)
- NEVER use gradients as slide backgrounds
- Text is always dark on light: primary `#1D1D1F`, secondary `#6E6E73`
- Slide transitions use `thruBlk="0"` — NO black flash between slides
- Radial glows are subtle (opacity 0.06-0.08), creating soft light ambiance, not dramatic dark effects
- Card fills are `#F5F5F7` (light gray) or `#EBF5FF` (light blue for highlighted), never dark
- The overall feel: bright, clean, airy, premium — like a sunlit Apple Store

### Why Light Theme
- Matches Apple's 2023-2025 keynote aesthetic (WWDC, product launches)
- Maximum readability in all lighting conditions (conference rooms, projectors)
- Professional and trustworthy appearance for business proposals
- Consistent with the blue accent color system (#0071E3) which pops on white

---

## Apple Keynote Design Rules

### 1. Minimalism First
- Remove everything that doesn't serve a clear purpose
- One focal point per slide — ONE key message
- Extreme whitespace: let content breathe, never crowd
- No decorative elements that don't carry information

### 2. Bold Typography Hierarchy
- Hero titles: 46-48pt for maximum impact
- Clear size jumps: title (46pt) > subtitle (36pt) > slide title (24pt) > body (9pt)
- Only 1 font family: Arial (web-safe, renders identically everywhere)
- Hierarchy through weight (bold vs regular) and size, never through different fonts
- charSpacing for brand names (10) and labels (4) adds premium feel

### 3. Color Discipline
- Maximum 3 functional colors in play on any single slide
- ONE accent color: Apple Blue `#0071E3` — used for emphasis, links, badges, metric values
- Gray spectrum for text hierarchy: `#1D1D1F` > `#6E6E73` > `#AEAEB2`
- Functional colors ONLY where semantically meaningful: green = positive/recommended, orange = warning/caution
- Never use color for decoration — every color choice must communicate something

### 4. Card-Based Content Grouping
- Content organized in bordered rounded rectangles (cards)
- Consistent card styling across ALL slides — same border, same radius, same shadow
- Cards provide visual separation without heavy divider lines
- Highlighted cards use accent blue border (#0071E3) and light blue fill (#EBF5FF)

### 5. Flow Diagrams Replace Bullet Points
- Process steps rendered as connected rounded rectangles with arrow icons between them
- Each step is a self-contained card with centered multi-line text
- Arrows flow left-to-right (reading direction)
- Highlighted steps (blue border+bg) indicate automated/improved portions
- Gray steps indicate manual/current-state portions

### 6. Metric Boxes for KPIs
- Large bold number (22pt, accent blue) is the focal point
- Small label below (8pt, gray) provides context
- Contained in subtle rounded rectangle with gray bg
- Usually 2-4 metrics in a row, evenly spaced
- Values should be punchy: "24/7", "<1 min", "+AI", "~0"

### 7. Progressive Disclosure via Animation
- Auto-play on slide enter — NO click required
- Groups of related elements appear together (title+label, all cards in a row, etc.)
- Sequential timing: structural elements first, then content, then details
- Micro-stagger (20ms) within groups creates smooth cascading effect
- Animation serves comprehension, not spectacle

---

## Complete Color Specification

### Primary Palette

| Swatch | Hex | RGB | Role |
|--------|-----|-----|------|
| White | `#FFFFFF` | 255,255,255 | Content slide backgrounds |
| Light Gray | `#F5F5F7` | 245,245,247 | Section bg, card fills, metric fills |
| Near Black | `#1D1D1F` | 29,29,31 | Primary text, titles |
| Medium Gray | `#6E6E73` | 110,110,115 | Secondary text, descriptions |
| Light Gray Text | `#AEAEB2` | 174,174,178 | Tertiary text, footnotes |
| Apple Blue | `#0071E3` | 0,113,227 | Accent, links, badges, metric values |

### Functional Colors

| Swatch | Hex | RGB | Role |
|--------|-----|-----|------|
| Green | `#34C759` | 52,199,89 | Recommended badges, positive |
| Orange | `#FF9500` | 255,149,0 | Warning text, caution icons |
| Orange Bg | `#FFF3E0` | 255,243,224 | Warning bar fill |
| Orange Border | `#E0C080` | 224,192,128 | Warning bar border |
| Purple | `#5856D6` | 88,86,214 | Chart segment 4 |
| Red | `#FF2D55` | 255,45,85 | Chart segment 5 (if needed) |

### Structural Colors

| Swatch | Hex | Role |
|--------|-----|------|
| Card Border | `#D2D2D7` | Default borders for cards, flow boxes |
| Highlighted Bg | `#EBF5FF` | Blue tint fill for highlighted cards |
| Tag Bg | `#E8E8ED` | Technology tag pill fill |
| Gray 86 | `#86868B` | Budget labels, step descriptions |

### Chart Color Palette (ordered)
1. `#0071E3` — Blue (primary/largest segment)
2. `#34C759` — Green
3. `#FF9500` — Orange
4. `#5856D6` — Purple
5. `#FF2D55` — Red (if 5th segment needed)

---

## Shadow & Depth System

All shadows use `type: 'outer'`, `color: '000000'` (black). The system creates subtle depth without heavy drop shadows.

| Element | blur | offset | opacity | Visual effect |
|---------|------|--------|---------|---------------|
| Pillar cards (overview) | 6 | 2 | 0.08 | Most prominent — floating card |
| Comparison cards (recommended) | 6 | 2 | 0.08 | Same as pillars |
| Flow boxes | 4 | 1 | 0.08 | Subtle lift from slide surface |
| Info cards | 3 | 1 | 0.06 | Very subtle, secondary depth |
| Metric boxes | none | — | — | Flat — differentiated by bg color only |
| Warning bars | none | — | — | Flat — differentiated by orange bg |
| Tags | none | — | — | Flat |

### Corner Radius System

| Radius | Elements |
|--------|----------|
| 0.02 | Accent bars (nearly square ends) |
| 0.04 | Tags |
| 0.06 | Badges, price pills, cost bar |
| 0.08-0.10 | Warning bars |
| 0.12 | Flow boxes, metric boxes, summary boxes |
| 0.14 | Info cards |
| 0.18 | Pillar cards, comparison cards (largest radius for biggest cards) |

---

## Spacing & Layout Grid

### Slide Dimensions
- **Format**: 16:9 widescreen
- **Size**: 10" x 5.625" (254mm x 142.9mm)

### Margin System
| Zone | Value | Usage |
|------|-------|-------|
| Left margin | 0.6-0.9" | Content start (0.9 for titles, 0.6 for cards) |
| Right margin | 0.6-0.9" | Mirror of left |
| Top (title area) | 0.25-0.42" | Slide label/title start |
| Bottom safe | 0.5" | Nothing below y:5.125 |

### Vertical Zone Allocation
| Zone | Y range | Content |
|------|---------|---------|
| Header | 0.25 - 1.1 | Labels, titles, workflow badges |
| Flow area | 1.1 - 2.4 | Flow diagram rows |
| Cards area | 2.3 - 3.7 | Info cards, comparison cards |
| Metrics/footer | 3.7 - 5.0 | Metric boxes, footers, cost bars |

### Horizontal Distribution
- Flow boxes: auto-calculated `(available_width - arrow_gaps) / step_count`
- Cards: `(available_width - gaps) / card_count` with gap 0.2-0.4"
- Pillars: centered with gap 0.35" between cards
- Metrics: evenly distributed with gap 0.4"

---

## Animation Timing Profiles

### Section-style (dramatic reveal)
- **Duration**: 800-900ms per element
- **Gap between groups**: 200-400ms
- **Used by**: title, section, next-steps
- **Feel**: Deliberate, premium, Apple keynote reveal

### Content-style (efficient information)
- **Duration**: 500-700ms per element
- **Gap between groups**: 250-500ms
- **Used by**: overview, process-flow, workflow, comparison, budget, questions
- **Feel**: Brisk, professional, respect-the-audience's-time

### Micro-stagger
- **Within-group offset**: 20ms per element
- **Purpose**: Creates subtle cascading wave within a group
- **Example**: 5 flow boxes in a group appear at delays 0, 20, 40, 60, 80ms relative to group start

### Slide Transitions
- **Type**: Fade
- **Speed**: Medium
- **thruBlk**: "0" (CRITICAL — prevents black flash between slides in Light theme)
- **advClick**: "1" (advance on click)

---

## Slide Count & Pacing

### Recommended Totals
| Input complexity | Slide count | Presentation time |
|---|---|---|
| 1 business process | 5-7 slides | 5-10 minutes |
| 2-3 processes | 10-15 slides | 15-25 minutes |
| 4+ processes | 15-20 slides | 25-40 minutes |

### Pacing Rules
- Never exceed 20 content slides — split into multiple presentations
- Section dividers add breathing room; always use them between processes
- Budget slide is optional; only include when concrete cost data exists
- The overview slide replaces a traditional "agenda" — never add a separate agenda slide
- Questions slide is always last — it's the conversation starter, not the closer
- next-steps is the emotional closer, questions is the rational closer

---

## Progressive Enhancement

### Minimum Viable Presentation (5 slides)
title -> section -> process-flow -> next-steps -> questions

### Standard Presentation (10-12 slides)
title -> overview -> [section -> process-flow (current) -> workflow (proposed)] x N -> next-steps -> questions

### Full Presentation (15+ slides)
title -> overview -> [section -> process-flow (current) -> workflow (proposed)] x N -> comparison -> budget -> next-steps -> questions

Each level adds visual richness without breaking the existing structure.

---

## OOXML Technical Reference

### Slide XML Structure
```xml
<p:sld>
  <p:cSld>
    <p:spTree>      <!-- Shape tree: all visual elements -->
      <p:sp>        <!-- Shape: rectangle, text box, oval, line -->
      <p:pic>       <!-- Picture/image (including rasterized SVG icons) -->
    </p:spTree>
  </p:cSld>
  <p:transition spd="med" advClick="1">
    <p:fade thruBlk="0"/>    <!-- Light theme: NO black -->
  </p:transition>
  <p:timing>        <!-- Animation timing tree -->
    <p:tnLst>
      <p:par>       <!-- Root timing node -->
</p:sld>
```

### Animation Timing Tree
```
tmRoot (id=1, indefinite)
  └── mainSeq (id=2, indefinite)
       └── click-group (id=3, delay=0)
            ├── element1: clickEffect (auto-starts)
            ├── element2: withEffect (delay=20ms)
            ├── element3: withEffect (delay=200ms)  ← new group
            └── ...
```

### Critical: The `<p:set>` Visibility Pattern
```xml
<p:par>
  <p:cTn presetID="10" presetClass="entr" nodeType="clickEffect">
    <p:childTnLst>
      <!-- 1) MANDATORY: Set visibility to visible -->
      <p:set>
        <p:cBhvr><p:cTn dur="1" fill="hold"/><p:tgtEl spid="N"/></p:cBhvr>
        <p:to><p:strVal val="visible"/></p:to>
      </p:set>
      <!-- 2) Fade effect -->
      <p:animEffect transition="in" filter="fade">
        <p:cBhvr><p:cTn dur="600"/><p:tgtEl spid="N"/></p:cBhvr>
      </p:animEffect>
    </p:childTnLst>
  </p:cTn>
</p:par>
```

Without `<p:set>`, elements appear instantly then "blink" when fade fires. The `<p:set>` tells PowerPoint to initially hide the element, then reveal it with the fade.

### Shape ID Assignment
PptxGenJS assigns IDs starting from 2 (id=1 is spTree). Each `addShape`, `addText`, `addImage` call increments the counter. The `ShapeTracker` class in `build-presentation.js` mirrors this to produce accurate animation configs.

---

## PptxGenJS Patterns

### Shape Types Used
```javascript
pptx.shapes.ROUNDED_RECTANGLE  // Cards, boxes, badges, bars
pptx.shapes.OVAL               // Number badges
pptx.shapes.LINE               // Separator lines in budget
```

### Standard Shadow
```javascript
shadow: { type: 'outer', blur: 4, offset: 1, color: '000000', opacity: 0.08 }
```

### Text with Line Spacing
```javascript
{ lineSpacingMultiple: 1.3, wrap: true }
```

### SVG-to-PNG via Sharp
```javascript
const svg = `<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>`;
const base64 = (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
const dataUri = 'data:image/png;base64,' + base64;
slide.addImage({ data: dataUri, x, y, w, h });
```

### Radial Glow Generation
```javascript
const svg = `<svg width="800" height="800">
  <radialGradient id="g" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#0071E3" stop-opacity="0.08"/>
    <stop offset="50%" stop-color="#0071E3" stop-opacity="0.024"/>
    <stop offset="100%" stop-color="#0071E3" stop-opacity="0"/>
  </radialGradient>
  <circle cx="400" cy="400" r="400" fill="url(#g)"/>
</svg>`;
```
This creates a subtle blue ambient glow on white backgrounds — NOT a spotlight or dark gradient.
