# JSON Config Schema Reference

Complete specification for `slides-config.json` — the input format for `build-presentation.js`.

## Top-Level Structure

```json
{
  "meta": {
    "title": "Presentation title (embedded in PPTX metadata)",
    "author": "Author name",
    "outputFileName": "Output.pptx"
  },
  "slides": [ ... ]
}
```

## Slide Type: `title`

Hero opening slide with brand name, radial glows, and centered typography.

```json
{
  "type": "title",
  "brandName": "COMPANY",
  "mainTitle": "Headline Text",
  "subtitle": "Second Line",
  "description": "Longer explanatory text below"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| brandName | yes | Uppercase, rendered with charSpacing:10 in blue |
| mainTitle | yes | 46pt bold, the largest text on the slide |
| subtitle | yes | 36pt regular, directly below mainTitle |
| description | no | 12pt gray, appears at bottom |

## Slide Type: `overview`

N pillar cards (2-4) summarizing presentation sections.

```json
{
  "type": "overview",
  "title": "Overview Title",
  "subtitle": "Explanatory subtitle",
  "pillars": [
    {
      "icon": "layers",
      "title": "Pillar Name",
      "description": "Multi-line\ndescription"
    }
  ]
}
```

| Field | Required | Notes |
|-------|----------|-------|
| pillars | yes | Array of 2-4 items. Each gets a numbered badge. |
| pillars[].icon | yes | Key from icon registry (see below) |
| pillars[].title | yes | 14pt bold, max ~20 chars |
| pillars[].description | yes | 9.5pt gray, use `\n` for line breaks, max 3-4 lines |

**Icon registry**: `layers`, `calculator`, `box`, `phone`, `globe`, `cpu`, `users`, `database`, `settings`, `truck`, `dollar`, `chart`, `mail`, `shield`, `zap`, `handshake`

## Slide Type: `section`

Full-screen section divider with number badge, large title, blue subtitle.

```json
{
  "type": "section",
  "number": 1,
  "title": "Section Title",
  "subtitle": "Tagline in Blue"
}
```

All fields required. `number` displayed in blue circle badge.

## Slide Type: `process-flow`

Process visualization with 1-2 flow rows and optional extras.

```json
{
  "type": "process-flow",
  "label": "CURRENT PROCESS",
  "labelColor": "secondary",
  "title": "Process Name",
  "flowRows": [
    {
      "steps": [
        { "text": "Step text\nline 2", "highlighted": false }
      ]
    }
  ],
  "warningBar": {
    "title": "Problems:",
    "items": ["Issue 1", "Issue 2", "Issue 3"],
    "layout": "inline"
  },
  "tags": ["Technology 1", "Technology 2"],
  "costBar": { "text": "Cost summary text..." }
}
```

| Field | Required | Notes |
|-------|----------|-------|
| label | yes | Uppercase label, rendered with charSpacing:4 |
| labelColor | yes | `"secondary"` (gray #6E6E73) or `"accent"` (blue #0071E3) |
| title | yes | 26pt bold |
| flowRows | yes | 1-2 rows, each with 3-5 steps |
| flowRows[].steps[].text | yes | Max 3 lines, 4-6 words/line, `\n` for breaks |
| flowRows[].steps[].highlighted | yes | `true` = blue border/bg, `false` = gray |
| warningBar | no | Orange warning area |
| warningBar.layout | yes if warningBar | `"inline"` = pipe-separated text, `"grid"` = 2x2 with star icons |
| tags | no | Array of technology tag strings |
| costBar | no | Gray bar at bottom with cost summary |

## Slide Type: `workflow`

Named workflow/solution with flow steps, info cards, and metrics or warning.

```json
{
  "type": "workflow",
  "workflowNumber": 1,
  "title": "Solution Name",
  "subtitle": "Brief description of the solution",
  "flowSteps": [
    { "text": "Step 1\ndetails", "highlighted": true }
  ],
  "infoCards": [
    { "title": "TECHNOLOGIES", "body": "Tech 1\nTech 2\nTech 3" },
    { "title": "COSTS", "body": "Cost details\nmore lines" },
    { "title": "RESULT", "body": "Outcome\ndescription" }
  ],
  "metrics": [
    { "value": "24/7", "label": "Availability\nlabel" }
  ],
  "warningBar": null
}
```

| Field | Required | Notes |
|-------|----------|-------|
| workflowNumber | yes | Displayed in "Workflow N" badge |
| flowSteps | yes | 3-5 steps, `highlighted` defaults to true |
| infoCards | no | 2-3 cards with title (uppercase feel) and body |
| infoCards[].title | yes | 8.5pt bold blue, uppercase convention (TECHNOLOGIES, COSTS, RESULT) |
| infoCards[].body | yes | 8.5pt gray, max 3-4 lines |
| metrics | no | 2-4 metric boxes. Mutually exclusive with warningBar. |
| metrics[].value | yes | 1-4 chars: "24/7", "~0", "+AI", "40$" |
| metrics[].label | yes | 2 lines max: "Availability\nlabel" |
| warningBar | no | `{ "text": "..." }` — orange bar. Mutually exclusive with metrics. |

## Slide Type: `comparison`

Side-by-side comparison of exactly 2 options.

```json
{
  "type": "comparison",
  "title": "Solutions Comparison",
  "subtitle": "Optional subtitle",
  "options": [
    {
      "name": "Option A",
      "subtitle": "Category/type",
      "recommended": true,
      "features": "Feature 1\n\nFeature 2\n\nFeature 3",
      "price": "14 400 RUB/year",
      "priceStyle": "accent"
    },
    {
      "name": "Option B",
      "subtitle": "Category/type",
      "recommended": false,
      "features": "Feature 1\n\nFeature 2",
      "price": "288 USD/year",
      "priceStyle": "neutral"
    }
  ],
  "footer": "Footer note text"
}
```

| Field | Notes |
|-------|-------|
| options | Exactly 2 items |
| recommended | `true` = green badge + blue border + blue bg |
| priceStyle | `"accent"` = blue fill white text, `"neutral"` = gray fill gray text |
| features | Use `\n\n` between items for visual spacing |
| footer | Optional, 9pt gray tertiary at bottom |

## Slide Type: `budget`

Cost breakdown with pie chart (left) and line items (right).

```json
{
  "type": "budget",
  "title": "Annual Infrastructure Costs",
  "summary": {
    "label": "Estimated annual costs",
    "value": "~200-350 USD",
    "note": "excluding optional services"
  },
  "pieChart": {
    "title": "Base costs breakdown",
    "items": [
      { "label": "VPS", "value": 73, "color": "#0071E3" },
      { "label": "Domain", "value": 25, "color": "#34C759" },
      { "label": "Visual", "value": 5, "color": "#FF9500" },
      { "label": "API", "value": 40, "color": "#5856D6" }
    ]
  },
  "lineItems": [
    { "label": "VPS (Provider)", "value": "73 EUR/year" },
    { "label": "Domain name", "value": "~25 USD/year" }
  ]
}
```

| Field | Notes |
|-------|-------|
| summary.value | 28pt bold blue, the hero number |
| summary.note | 9pt gray below the value |
| pieChart.items | 2-5 segments. Use palette: #0071E3, #34C759, #FF9500, #5856D6, #FF2D55 |
| lineItems | Max 7 for good layout. Each gets label + value + separator line. |

## Slide Type: `next-steps`

Call-to-action with centered icon and step cards.

```json
{
  "type": "next-steps",
  "icon": "handshake",
  "title": "Ready to Start?",
  "subtitle": "Next Steps",
  "steps": [
    { "number": "1", "title": "Discussion", "description": "Discuss priorities..." },
    { "number": "2", "title": "Planning", "description": "Work out details..." },
    { "number": "3", "title": "Launch", "description": "Phased rollout..." }
  ]
}
```

| Field | Notes |
|-------|-------|
| icon | Key from icon registry. Default: "handshake" |
| steps | 2-4 items. Rendered as equal-width columns. |

## Slide Type: `questions`

Discussion items with alternating row backgrounds.

```json
{
  "type": "questions",
  "title": "Questions for Discussion",
  "items": [
    { "title": "Topic Name", "body": "Detailed question text explaining what to discuss." }
  ]
}
```

| Field | Notes |
|-------|-------|
| items | 3-6 items. Each row has green check icon + blue bold title + gray body. |
| items[].title | 3-5 words, rendered 10pt bold blue |
| items[].body | 1-2 sentences, rendered 9pt gray |

## Validation Rules

| Slide Type | Required Fields | Constraints |
|---|---|---|
| title | brandName, mainTitle, subtitle | brandName: uppercase recommended |
| overview | title, pillars | pillars: 2-4 items |
| section | number, title, subtitle | number: sequential integer |
| process-flow | label, labelColor, title, flowRows | flowRows: 1-2 rows, each with 3-5 steps |
| workflow | workflowNumber, title, flowSteps | flowSteps: 3-5 steps |
| comparison | title, options | options: exactly 2 |
| budget | title, summary, pieChart, lineItems | pieChart.items: 2-5, lineItems: max 7 |
| next-steps | title, subtitle, steps | steps: 2-4 items |
| questions | title, items | items: 3-6 items |

### Text Length Constraints
- Flow step text: max 3 lines x 6 words = 18 words
- Info card body: max 4 lines
- Metric value: max 4 characters
- Metric label: max 2 lines x 4 words = 8 words
- Pillar description: max 3 lines
- Warning bar items (inline): max 4 items x 4 words each
- Question title: 3-5 words
- Question body: 1-2 sentences
