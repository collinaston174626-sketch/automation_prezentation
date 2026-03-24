# Slide Type Specifications

Technical layout details for each slide type. These are the exact positions and sizing used by `build-presentation.js`.

## Layout Constants

- **Slide size**: 10" x 5.625" (16:9)
- **Default margins**: 0.6-0.9" from edges
- **Flow box rectRadius**: 0.12
- **Card rectRadius**: 0.14-0.18
- **Shadow (cards)**: type:outer, blur:4-6, offset:1-2, opacity:0.06-0.08
- **Arrow icon**: 0.22 x 0.22, placed between flow boxes

## Title Slide

| Element | Position | Style |
|---------|----------|-------|
| Blue glow | x:1.5 y:-1.5 w:7 h:7 | Radial, opacity 0.08 |
| Purple glow | x:5 y:1 w:5 h:5 | Radial, opacity 0.06 |
| Brand name | y:1.2, full width | 15pt bold blue, charSpacing:10, centered |
| Accent bar | x:4.0 y:1.75 w:2.0 | Blue thin bar |
| Main title | y:2.0 | 46pt bold, centered |
| Subtitle | y:2.65 | 36pt, centered |
| Description | y:3.55 | 12pt gray, centered, lineSpacing:1.5 |

**Animation**: 6 groups, dur=800ms, delays=[0, 200, 600, 800, 1200, 1800]

## Overview Slide

| Element | Position | Style |
|---------|----------|-------|
| Accent bar | x:4.0 y:0.8 w:2.0 | Blue thin bar |
| Title | y:1.0 | 34pt bold, centered |
| Subtitle | y:1.7 | 13pt gray, centered |
| Pillar cards | y:2.4, h:2.3 | Auto-spaced from left:0.7, gap:0.35 |

Each pillar card contains: bg rect + numBadge(0.38) + icon(0.55x0.55) + title(14pt bold) + desc(9.5pt gray)

**Animation**: 2 + N groups (title+accent, subtitle, then each pillar), dur=600ms

## Section Divider

| Element | Position | Style |
|---------|----------|-------|
| Blue glow | x:2 y:-0.5 w:6 h:6 | Radial |
| Number badge | x:4.75 y:1.4 size:0.55 | Blue oval |
| Title | y:2.15 | 48pt bold, centered |
| Accent bar | x:3.5 y:3.05 w:3.0 | Blue thin bar |
| Subtitle | y:3.2 | 24pt blue, centered |

**Animation**: 5 groups, dur=900ms, delays=[0, 300, 700, 1100, 1300]

## Process Flow Slide

| Element | Position | Style |
|---------|----------|-------|
| Label | x:0.9 y:0.35 | 10pt bold uppercase, charSpacing:4 |
| Title | x:0.9 y:0.62 | 26pt bold |
| Flow rows | y starts at 1.3 | Auto-calculated box widths |
| Warning bar | After flow rows | Orange bg #FFF3E0, border #E0C080 |
| Tags | After warning | Auto-spaced tag pills |
| Cost bar | Bottom | Gray bg #F5F5F7, centered text |

**Flow row layout algorithm**:
```
boxWidth = (slideWidth - margins - arrowGaps) / stepsCount
arrowX = boxX + boxWidth + arrowGap
```

**Animation**: groups=[label+title, flowRow1, flowRow2, warningBar, tags, costBar], dur=600ms

## Workflow Slide

| Element | Position | Style |
|---------|----------|-------|
| Badge | x:0.9 y:0.3 w:1.15 h:0.3 | Blue fill, "Workflow N" |
| Title | x:2.15 y:0.25 | 22pt bold |
| Subtitle | x:0.9 y:0.7 | 11pt blue |
| Flow steps | y:1.15 h:0.82 | Auto-laid-out, all highlighted by default |
| Info cards | y:2.35 | Auto-spaced, h:1.15-1.25 |
| Metrics | y:3.75-3.85 | 4 boxes, h:1.0 |
| Warning bar | y:3.8 | Orange, alternative to metrics |

**Animation**: 4 groups, dur=600ms, delays=[0, 300, 800, 1200-1300]

## Comparison Slide

| Element | Position | Style |
|---------|----------|-------|
| Title | x:0.9 y:0.35 | 24pt bold |
| Option cards | y:1.3 h:2.75 | Side-by-side, auto-spaced |
| Recommended badge | Top-right of card | Green #34C759 |
| Price badge | Bottom of card | Blue (accent) or gray (neutral) |
| Footer | y:4.75 | 9pt gray tertiary, centered |

**Animation**: 4 groups, dur=700ms, delays=[0, 400, 700, 1000, 1200]

## Budget Slide

| Element | Position | Style |
|---------|----------|-------|
| Title | x:0.83 y:0.42 | 22pt bold |
| Pie chart image | x:5.5 y:0.9 w:3.5 h:3.5 | SVG-rendered PNG |
| Summary box | x:0.8 y:1.1 w:4.0 h:1.2 | Gray bg, blue total value |
| Line items | x:1.0, starting y:2.6 | Label + value + separator, step:0.38 |

**Animation**: 3 groups, dur=600ms, delays=[0, 400, 900]

## Next Steps Slide

| Element | Position | Style |
|---------|----------|-------|
| Icon image | x:4.2 y:1.0 w:1.6 h:1.6 | 200px SVG icon |
| Title | y:2.01 | 30pt bold, centered |
| Subtitle | y:2.59 | 16pt blue, centered |
| Step cards | y:3.2 h:0.9 | Auto-spaced columns, gray bg |

**Animation**: 3 groups, dur=800ms, delays=[0, 300, 700]

## Questions Slide

| Element | Position | Style |
|---------|----------|-------|
| Title | x:0.9 y:0.3 | 24pt bold |
| Accent bar | x:0.9 y:0.75 w:1.5 | Blue thin bar |
| Question rows | y starts at 1.0, step:0.68 | Alternating bg (#F5F5F7 / white) |

Each row: check icon(0.22x0.22) + title(blue bold 10pt, w:2.2) + body(gray 9pt, w:5.7)

**Animation**: 1 + N groups (title+bar, then each row), dur=500ms, base delay between rows: 250ms
