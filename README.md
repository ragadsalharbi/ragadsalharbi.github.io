# Raghad Alharbi — Portfolio

Data analyst / data engineer portfolio.
Live at **[ragadsalharbi.github.io](https://ragadsalharbi.github.io)**

No framework, no build step, no image files. Three files.

## What it does

- **Interactive SQL console** — four real queries (`profile`, `projects`,
  `skills`, `contact`). Each types itself out with syntax highlighting and
  returns a result set with row count and timing.
- **RΛD monogram** — SVG letterforms that stroke-draw on load, with a
  sparkline beneath. No image file, so nothing can 404.
- Dark / light mode, remembered between visits
- English / Arabic with full RTL layout — including the console tables
- Project filtering; every card links to its repository
- Save contact downloads a `.vcf`
- Responsive to mobile, keyboard accessible, honours `prefers-reduced-motion`

## Structure

```text
.
├── index.html
├── style.css
├── script.js
└── README.md
```

## Updating

**Console queries** — the `QUERIES` array at the top of `script.js`. Each entry
has `sql`, `head` and `rows`, in both languages. Adding a query means adding an
entry plus one `<button class="tab">` in `index.html`.

**Contact details** — the `ME` object in `script.js`. The vCard reads from it.

**Any text** — every translatable element carries `data-en` and `data-ar`.
Edit both.

**A new project** — copy an `<a class="card">` block and update `href`,
`data-cat` (`data` / `eng` / `net`), title, repo name, description and tags.

**Colours** — `:root` and `[data-theme="light"]` at the top of `style.css`.

## Deploying

Push to the `ragadsalharbi.github.io` repository. GitHub Pages serves the root
of `main`; changes appear within a minute or two.
