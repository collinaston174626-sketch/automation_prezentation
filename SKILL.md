---
name: automation-prezentation
description: >
  Generate Apple Keynote-style PowerPoint presentations from any business process data.
  Creates professional 16:9 PPTX in Apple Light theme with clean white backgrounds,
  subtle radial glows, auto-play fade-in animations, and infographic elements (flow diagrams,
  metric boxes, info cards, pie charts, comparison cards).
  Input: any format (markdown, JSON, plain text, meeting notes) describing business processes,
  automation proposals, or digital transformation plans.
  Output: animated PPTX with Apple-level design quality.
  Triggers: "create presentation", "automation proposal", "Apple keynote style",
  "business presentation PPTX", "generate slides", "process automation deck",
  "business process presentation", "make a deck", "slide deck from data",
  "presentation from notes", "professional PPTX".
---

# Business Automation Presentation Generator

Generate Apple Keynote Light-style PPTX from any business process data.

## Workflow

1. Analyze input data (any format: markdown, JSON, plain text, meeting notes)
2. Write `slides-config.json` using the slide type catalog below
3. Run: `node scripts/build-presentation.js slides-config.json [output.pptx]`
4. Run: `python scripts/add-animations.py output.pptx`

The builder emits a sidecar `_animation-config.json` that the animation script reads automatically.

For full JSON schema with all fields: see `references/json-schema.md`
For exact layout positions and sizing: see `references/slide-structure.md`
For visual design philosophy and OOXML internals: see `references/design-principles.md`

## Quick-Start Example

Minimal config for a 4-slide presentation:

```json
{
  "meta": { "title": "Project X", "author": "Team", "outputFileName": "ProjectX.pptx" },
  "slides": [
    { "type": "title", "brandName": "COMPANY", "mainTitle": "Project X", "subtitle": "Digital Transformation" },
    { "type": "section", "number": 1, "title": "Current Process", "subtitle": "Before Automation" },
    { "type": "process-flow", "label": "CURRENT PROCESS", "labelColor": "secondary", "title": "Manual Workflow",
      "flowRows": [{ "steps": [
        { "text": "Step 1\ndetails", "highlighted": false },
        { "text": "Step 2\ndetails", "highlighted": false },
        { "text": "Step 3\ndetails", "highlighted": true }
      ]}]
    },
    { "type": "next-steps", "icon": "handshake", "title": "Ready?", "subtitle": "Next Steps",
      "steps": [{ "number": "1", "title": "Discuss", "description": "Review priorities" }]
    }
  ]
}
```

## Apple Light Design System

**MANDATORY**: Always produce Light theme. Never use dark backgrounds, never invert colors.

### Color Palette (exact hex values)

| Role | Hex | Usage |
|------|-----|-------|
| **Background primary** | `#FFFFFF` | All content slide backgrounds |
| **Background section** | `#F5F5F7` | Section divider slides, card fills, metric box fills |
| **Text primary** | `#1D1D1F` | Titles, headings, flow box text — near-black for readability |
| **Text secondary** | `#6E6E73` | Subtitles, descriptions, card body text, labels |
| **Text tertiary** | `#AEAEB2` | Footnotes, disclaimers, low-priority text |
| **Accent blue** | `#0071E3` | Accent bars, highlighted borders, badge fills, metric values, info card titles, number badges, icons, brand name |
| **Deep blue** | `#0077ED` | Reserved for hover/interactive states (not used in static PPTX) |
| **Blue background** | `#EBF5FF` | Highlighted card fills, recommended option card bg |
| **Card border** | `#D2D2D7` | Default card/flow box border color |
| **Highlighted border** | `#0071E3` | Highlighted flow boxes, recommended option borders |
| **Green** | `#34C759` | "Recommended" badges, positive indicators, check icons |
| **Orange** | `#FF9500` | Warning text, warning star icons, caution indicators |
| **Orange bg** | `#FFF3E0` | Warning bar background fill |
| **Orange border** | `#E0C080` | Warning bar border |
| **Tag bg** | `#E8E8ED` | Technology tag pill fills |
| **Purple** | `#5856D6` | Pie chart segment (4th color) |
| **Gray 86** | `#86868B` | Budget labels, step card text |

### Typography System (Arial only — web-safe)

| Element | Size | Weight | Color | Extras |
|---------|------|--------|-------|--------|
| Brand name | 15pt | Bold | `#0071E3` | `charSpacing: 10`, centered, uppercase |
| Hero title | 46pt | Bold | `#1D1D1F` | centered |
| Hero subtitle | 36pt | Regular | `#1D1D1F` | centered |
| Section title | 48pt | Bold | `#1D1D1F` | centered |
| Section subtitle | 24pt | Regular | `#0071E3` | centered |
| Slide title | 24-26pt | Bold | `#1D1D1F` | left-aligned |
| Slide label | 10pt | Bold | `#6E6E73` or `#0071E3` | uppercase, `charSpacing: 4` |
| Workflow title | 22pt | Bold | `#1D1D1F` | left-aligned |
| Workflow subtitle | 11pt | Regular | `#0071E3` | left-aligned |
| Card heading | 14pt | Bold | `#1D1D1F` | pillar card titles |
| Card body | 9-9.5pt | Regular | `#6E6E73` | `lineSpacing: 1.3-1.4`, wrap |
| Info card title | 8.5pt | Bold | `#0071E3` | `charSpacing: 1`, uppercase feel |
| Info card body | 8.5pt | Regular | `#6E6E73` | `lineSpacing: 1.35`, wrap |
| Flow box text | 8.5pt | Regular | `#1D1D1F` | centered, `lineSpacing: 1.2` |
| Metric value | 22pt | Bold | `#0071E3` | centered |
| Metric label | 8pt | Regular | `#6E6E73` | centered, `lineSpacing: 1.2` |
| Tag text | 7.5pt | Regular | `#6E6E73` | centered |
| Description | 12pt | Regular | `#6E6E73` | centered, `lineSpacing: 1.5` |
| Budget total | 28pt | Bold | `#0071E3` | centered |

### Shadows & Borders

| Element | Shadow | Border |
|---------|--------|--------|
| Pillar/overview card | blur:6, offset:2, opacity:0.08 | `#D2D2D7`, 0.75pt |
| Flow box (normal) | blur:4, offset:1, opacity:0.08 | `#D2D2D7`, 0.75pt |
| Flow box (highlighted) | blur:4, offset:1, opacity:0.08 | `#0071E3`, 0.75pt |
| Info card | blur:3, offset:1, opacity:0.06 | `#D2D2D7`, 0.5pt |
| Comparison card (recommended) | blur:6, offset:2, opacity:0.08 | `#0071E3`, 1.5pt |
| Comparison card (normal) | none | `#D2D2D7`, 0.75pt |
| Metric box | none | `#D2D2D7`, 0.5pt |
| All shadows | `type: 'outer'`, `color: '000000'` | |

### Corner Radius (rectRadius)

| Element | Radius |
|---------|--------|
| Flow boxes | 0.12 |
| Info cards | 0.14 |
| Pillar/comparison cards | 0.18 |
| Accent bar | 0.02 |
| Tags | 0.04 |
| Badges / price pills | 0.06 |
| Warning bar | 0.08-0.10 |
| Metric boxes | 0.12 |

### Visual Elements

- **Radial glows**: Subtle SVG-rasterized circles. Blue glow (#0071E3, opacity 0.08), purple glow (#AF52DE, opacity 0.06). Used on title slide and section dividers. Creates soft light ambiance without darkening.
- **Accent bars**: Thin (h: 0.035") blue (#0071E3) rounded rectangles. Used to visually separate title from content.
- **Number badges**: Blue (#0071E3) filled ovals with white bold number. Size 0.38-0.55" depending on context.
- **Icons**: SVG stroke icons rasterized to PNG via Sharp. Stroke color #0071E3, stroke-width 1.5. Available: layers, calculator, box, arrow, check, star, handshake, phone, globe, cpu, users, database, settings, truck, dollar, chart, mail, shield, zap.
- **Pie charts**: SVG-rendered to PNG. Use palette: #0071E3, #34C759, #FF9500, #5856D6, #FF2D55.

## Slide Types (9 types)

| Type | Purpose | Key elements |
|------|---------|-------------|
| `title` | Hero opening | brandName, mainTitle, subtitle, description, radial glows |
| `overview` | N pillars summary (2-4) | pillar cards with icons, numbered badges |
| `section` | Section divider | number badge, large title, blue subtitle, glow |
| `process-flow` | Current/proposed process | flow rows, warning bar, tags, cost bar |
| `workflow` | Named solution detail | badge, flow steps, info cards, metrics OR warning |
| `comparison` | Side-by-side (2 options) | recommended badge, price badges, features |
| `budget` | Cost breakdown | pie chart, summary box, line items |
| `next-steps` | Call-to-action | centered icon, step cards |
| `questions` | Discussion items | alternating-bg rows with check icons |

For complete JSON schema with all fields and examples: see `references/json-schema.md`

## Content Guidelines

When analyzing input data and writing `slides-config.json`:

### Slide Sequence Pattern
1. `title` (always 1)
2. `overview` (always 1 — summarize all sections as pillar cards)
3. Per business process section:
   - `section` divider (numbered sequentially)
   - `process-flow` current/manual process (`labelColor: "secondary"`)
   - `workflow` or `process-flow` proposed automation (`labelColor: "accent"`)
4. `comparison` (if comparing solutions/vendors)
5. `budget` (if cost data available)
6. `next-steps` (always 1)
7. `questions` (always 1 — extract discussion points from data)

### Recommended Slide Counts
- For 1 business process: 5-7 slides (title, overview, section, current, proposed, next-steps, questions)
- For 2-3 processes: 10-15 slides (the sweet spot for a 20-min presentation)
- For 4+ processes: 15-20 slides (max; split into multiple presentations if more)
- Every presentation MUST have: title, overview, at least 1 section+process, next-steps, questions

### Content Density Rules
- Each flow step: exactly 2-3 lines of text, 2-6 words per line — EVERY line must have at least 2 words (a single word per line breaks the layout). For Russian/long-word languages: combine short words onto the same line to meet the 2-word minimum. Example: ✗ "Автоматическая\nгенерация\nнакладных" (1 word per line) → ✓ "Авто-генерация накладных\nв системе 1С" (2+ words per line)
- Info card body: 3-4 lines; if content is longer, split into 2 cards or summarize
- Pillar descriptions: 2-3 lines with `\n` breaks; avoid paragraphs
- Warning bar items: 3-4 short phrases (2-4 words each) for inline layout; 4-6 for grid layout
- Metric values MUST be punchy: numbers ("24/7"), symbols ("+AI"), currency ("40$"), approximations ("~0") — never full words

### Edge Cases
- If input has only 1 process AND describes both current + proposed: skip overview, use process-flow with 2 flowRows (row 1: current steps `highlighted: false`, row 2: proposed steps `highlighted: true`, `labelColor: "accent"`). When using 2 flowRows, omit warningBar — instead move problem items to `tags`. Pattern: title → section → process-flow (2 rows) → next-steps → questions
- If input has only 1 process with only current state: skip overview (go title → section → process-flow → next-steps → questions)
- If no cost data: skip budget slide entirely
- If no comparison needed: skip comparison slide
- If input language is mixed: use the dominant language; translate only when meaning would be lost
- Always ensure ALL key topics from input are represented: current process, proposed automation, problems/risks, and expected outcomes must each appear on at least one slide

### Text Formatting Rules
- Flow steps: exactly 2-3 lines, 2-6 words per line (min 2 words per line!), `\n` for breaks
- Info card body: max 3-4 lines per card
- Metric values: 1-4 chars (numbers, symbols, abbreviations)
- Metric labels: max 2 lines, 3-4 words per line
- Use `highlighted: true` for automated/improved steps
- Use `highlighted: false` for manual/current/unchanged steps
- Match the language of input data (Russian, English, etc.)

## Animation System

All animations auto-play on slide enter. The builder (`ShapeTracker` class) tracks shape IDs and writes `_animation-config.json`. The Python script reads this and injects OOXML timing XML.

| Slide type | Duration | Timing style |
|------------|----------|-------------|
| title | 800ms | 6 groups, long stagger (200-600ms gaps) |
| section | 900ms | 5 groups, dramatic reveal |
| overview | 600ms | 2+N groups (title, subtitle, then each pillar) |
| process-flow | 600ms | groups per row + extras |
| workflow | 600ms | 4 groups (header, flow, cards, metrics) |
| comparison | 700ms | per-option reveal |
| budget | 600ms | 3 groups (title, chart+summary, items) |
| next-steps | 800ms | 3 groups (icon, title, steps) |
| questions | 500ms | per-row reveal |

### OOXML Critical Rules
- `<p:set style.visibility=visible>` MANDATORY before each fade (prevents element blinking)
- First animation: `clickEffect` (auto-starts entire sequence on slide enter)
- All subsequent: `withEffect` with delay offsets
- Slide transitions: fade with `thruBlk="0"` (Light theme — NO black flash)
- Micro-stagger: 20ms between elements within a group

## Config Validation

The builder validates the JSON config and prints warnings for:
- Missing required fields per slide type
- Empty flow step arrays
- Comparison slides with != 2 options
- Metric values longer than 4 characters

A valid config always needs: `meta.title`, `slides` (array), and each slide needs `type`.

## Dependencies

- **Node.js**: `npm install pptxgenjs sharp`
- **Python**: `pip install defusedxml` (optional)
- Python 3.10+, Node.js 16+
