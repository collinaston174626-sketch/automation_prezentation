# 🎨 automation-prezentation

### ✨ Apple Keynote-quality PowerPoint generator for [Claude Code](https://claude.ai/claude-code)

Transforms any business data — raw notes, markdown, JSON, meeting transcripts — into stunning **animated PPTX presentations** with Apple Light design, professional infographics, and auto-play fade-in animations. One command. Zero design skills required.

---

## 🤯 Why This Exists

Creating a polished business presentation takes hours: layout, alignment, color matching, animations, consistent styling across dozens of slides. And the result still looks like "made in PowerPoint."

**automation-prezentation** generates presentations that look like they came from a professional design agency — clean white backgrounds, subtle radial glows, perfectly spaced infographic elements — all from your raw text input.

---

## 🚀 How It Works

Just describe what you need:

```
You:   Create a presentation about our new automation workflow from these meeting notes
Claude: ✔ Analyzing data... ✔ 14 slides generated... ✔ Animations applied... ✔ Done!
```

Feed it anything — bullet points, spreadsheet data, process descriptions, brainstorm notes — and get back a boardroom-ready `.pptx` file.

---

## 🔥 Key Features

| | |
|---|---|
| 🍎 **Apple Light theme** | Clean white backgrounds, subtle radial glows, premium typography |
| 📊 **Rich infographics** | Flow diagrams, metric boxes, pie charts, comparison cards, info cards |
| 🎬 **Auto-play animations** | Professional fade-in transitions on every element — no clicks needed |
| 📐 **16:9 widescreen** | Perfect for projectors, screens, and video calls |
| 📝 **Any input format** | Markdown, JSON, plain text, meeting notes — it all works |
| 🎯 **Smart slide types** | Title, section, process-flow, metrics, comparison, next-steps, and more |
| 🏗️ **JSON-driven pipeline** | Full control over every slide via structured config |

---

## 🎭 Slide Type Catalog

| Type | What It Creates |
|------|----------------|
| 🏷️ `title` | Opening slide with brand name, title, and subtitle |
| 📑 `section` | Section divider with numbered heading |
| 🔄 `process-flow` | Multi-row step-by-step flow diagrams with highlights |
| 📊 `metrics` | KPI boxes with icons, values, and labels |
| 📋 `info-cards` | Grid of information cards with descriptions |
| 🥧 `pie-chart` | Animated pie charts with percentage breakdowns |
| ⚖️ `comparison` | Side-by-side before/after or option comparison |
| 🤝 `next-steps` | Closing slide with numbered action items |

---

## 🏗️ Architecture

```
   📝 Any Input Data
         |
   🧠 Claude analyzes & structures
         |
   📋 slides-config.json
         |
    +----+----+
    |         |
  Node.js   Python
  Builder   Animator
    |         |
    +----+----+
         |
   🎨 Polished .pptx
   with animations & infographics
```

---

## 📦 Skill Structure

```
automation_prezentation/
├── SKILL.md                          # 🧠 Instructions for Claude
├── README.md                         # 📖 You are here
├── scripts/
│   ├── build-presentation.js         # 🏗️ PPTX builder (Node.js)
│   └── add-animations.py            # 🎬 Animation injector (Python)
└── references/
    ├── json-schema.md                # 📋 Full config schema
    ├── slide-structure.md            # 📐 Layout positions & sizing
    └── design-principles.md          # 🎨 Visual philosophy & OOXML details
```

---

## 📋 Requirements

- 🟢 Node.js (for PPTX generation)
- 🐍 Python 3.8+ (for animation injection)
- 🤖 [Claude Code](https://claude.ai/claude-code) with skill support

---

## 💎 Design Philosophy

- **White space is king** — clean, breathable layouts
- **Consistency over creativity** — every slide follows the same visual system
- **Animation with purpose** — elements fade in sequentially to guide attention
- **Infographics over text** — data visualized, not described

---

## 📄 License

collinaston174626-sketch
