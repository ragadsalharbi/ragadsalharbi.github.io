# Raghad Alharbi — Portfolio

Data analyst / data engineer portfolio.
Live at **[ragadsalharbi.github.io](https://ragadsalharbi.github.io)**

No framework, no build step, no image files. Three files.

## The idea

The tagline is *Messy data in. Answers out.* — so the hero draws it. Dots enter
from the left in disorder, funnel through a gate, and settle into ordered
columns on the right.

## Features

- **Animated hero canvas** — particles resolving from noise into a bar chart.
  Self-heals if the layout resolves late; colours follow the active theme;
  falls back to a static chart under `prefers-reduced-motion`.
- **Interactive SQL console** — four queries that type themselves with syntax
  highlighting and return result sets with row counts and timings.
- **RΛD monogram** — SVG letterforms that stroke-draw on load. The A has no
  crossbar. Inline SVG, so nothing can 404.
- **Frameless icon links** — bare glyphs that lift on hover and reveal their
  label beneath.
- Dark / light mode · English / Arabic with full RTL · project filtering
- Responsive, keyboard accessible, honours `prefers-reduced-motion`

## Palette

One cool family — background, surfaces and accent are all blue-cyan at
different depths, so nothing floats.

```
--b-950  #030B12   page
--b-800  #071A27   cards
--teal   #2DD4BF   accent
--sky    #4FB6E8   dates
--ice    #A5F3FC   numerals
```

`--flow-line` and `--flow-a` control the hero canvas and are redefined per
theme, so the animation stays legible in light mode.

## Breakpoints

| Width | Behaviour |
|---|---|
| > 940px | full nav, icon labels on hover |
| ≤ 940px | nav collapses to the burger sheet, two icons, labels off |
| ≤ 700px | single column, 60px rail, tighter hero, canvas at 55% opacity |

The menu sheet is `display:none` by default and only shows with `.is-open`.
It is force-hidden above 940px and auto-closes on resize back to desktop.

## Updating

**Console queries** — the `QUERIES` array in `script.js`.
**Hero animation** — `startFlow()`; `COLS` sets the bar count.
**Contact details** — the `ME` object in `script.js`.
**Any text** — every element carries `data-en` and `data-ar`. Edit both.
**Colours** — `:root` and `[data-theme="light"]` in `style.css`.

## Deploying

Push to the `ragadsalharbi.github.io` repository, then **hard-refresh**
(`Ctrl`/`Cmd` + `Shift` + `R`). Browsers cache `script.js` aggressively.
