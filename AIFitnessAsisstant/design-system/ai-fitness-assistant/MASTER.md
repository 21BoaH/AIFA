# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** AI Fitness Assistant
**Direction:** Volt Lab (v2, replaces "Vibrant & Block-based")
**Category:** Fitness / computer-vision lab
**Implemented in:** `assets/css/common.css` (all tokens live in `:root` at the top)

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Canvas | `#0A0C0F` | `--color-bg` |
| Canvas (deep: stage, footer, inputs) | `#060709` | `--color-bg-deep` |
| Surface 1 / 2 / 3 | `#111419` / `#171B21` / `#1F242C` | `--color-surface`, `-2`, `-3` |
| Foreground | `#F3F5F7` | `--color-fg` |
| Muted text (8.2:1) | `#A4ADBA` | `--color-fg-muted` |
| Subtle text (6.0:1) | `#8A93A1` | `--color-fg-subtle` |
| Primary accent: Volt | `#D7FF3A` | `--color-volt` |
| On Volt | `#0A0C0F` | `--color-on-volt` |
| Data accent: Cyan | `#5CD3F5` | `--color-cyan` |
| Waiting cue | `#FFC857` | `--color-warn` |
| Destructive (fills) / error text | `#FF5C5C` / `#FF9A94` | `--color-danger`, `--color-danger-text` |
| Decorative line | `rgba(255,255,255,.08)` | `--color-line` |
| Input border (3.1:1) | `#5B6472` | `--color-line-interactive` |
| Focus ring | `#D7FF3A` | `--color-ring` |

**Color notes:** One loud accent. Volt marks action and progress (CTAs, skeleton overlay, active state);
cyan marks measured data (joint angles, landmarks, data chips). Never use either for body copy.

### Typography

- **Display / body:** Archivo (variable: `wdth` 100–125, `wght` 400–800)
  - Headlines use the expanded cut: `font-stretch: 125%` (`--stretch-display`), weight 800, tight tracking
  - Component titles: `font-stretch: 112%` (`--stretch-title`), weight 750
- **Data / labels:** JetBrains Mono, used for eyebrows, chips, readouts, table headers and code
- **Mood:** athletic, technical, precise, high-energy
- **Google Fonts:** `https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..800&family=JetBrains+Mono:wght@400;500;600&display=swap`

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps |
| `--space-sm` | `8px` | Icon gaps, inline spacing |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Card padding (mobile) |
| `--space-xl` | `32px` | Card padding |
| `--space-2xl` | `48px` | Section header gap |
| `--space-3xl` | `64px` | Page-head padding |
| `--space-4xl` | `112px` | Section rhythm |

### Radii & Elevation

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-md` | `10px` | Inputs, small panels |
| `--radius-lg` | `16px` | Cards |
| `--radius-xl` | `24px` | Feature rows, CTA band, result cards |
| `--radius-pill` | `999px` | Buttons, badges, segmented controls |
| `--shadow-lg` | `0 24px 48px -16px rgba(0,0,0,.7)` | Hovered cards, floating widgets |
| `--glow-volt` | `0 10px 32px -8px rgba(215,255,58,.45)` | Primary button hover |

---

## Signature Motifs

- **Viewfinder corners** (`.frame-corners`): volt corner brackets on media and the camera stage.
- **Lab floor** (`.backdrop`): faint 56px grid plus a volt/cyan glow behind page heads.
- **Accent rule** (`.card--barred`): a short 44px volt (or cyan) line on a card's top edge.
- **Mono eyebrow** (`.eyebrow`): uppercase JetBrains Mono kicker with a leading dash.

## Component Specs

| Component | Class | Spec |
|-----------|-------|------|
| Primary button | `.btn--primary` | Volt fill, ink text, pill, 48px min height; hover lifts 1px + volt glow |
| Secondary button | `.btn--secondary` | Transparent, 16% white border; hover tints volt |
| Ghost button | `.btn--ghost` | Muted text, 8% border; hover surface-3 |
| Card | `.card` | Surface 1, 1px line, 16px radius; interactive variant lifts 3px with volt border |
| Chip | `.chip` (`--cyan`, `--volt`) | Mono 12px data tag, 6px radius |
| Segmented control | `.segmented` | Real radios inside a pill track; checked = volt fill |
| Input | `.input`, `.select` | Deep canvas fill, interactive border, volt focus border + 3px glow |

---

## Anti-Patterns (Do NOT Use)

- ❌ **Emojis as icons**: use inline SVG (Lucide-style, 2px stroke)
- ❌ **Hardcoded hex/px in page styles**: use tokens from `common.css`
- ❌ **Volt or cyan for paragraphs**: accents are for action and data only
- ❌ **Missing cursor:pointer** on clickable elements
- ❌ **Layout-shifting hovers**: transforms only, never size changes
- ❌ **Instant state changes**: always transition (120–360ms motion tokens)
- ❌ **Invisible focus states**: the 2px volt ring is never removed

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (use SVG instead)
- [ ] All colours, spacing and type come from tokens
- [ ] `cursor: pointer` on all clickable elements
- [ ] Hover states with smooth transitions (120–360ms)
- [ ] Text contrast 4.5:1 minimum (all text tokens are 6:1 or better on surfaces)
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected (hero demo freezes, reveals and scan line disabled)
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind the sticky nav
- [ ] No horizontal scroll on mobile
