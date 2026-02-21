# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Build dev + start BrowserSync watch/live-reload
npm run dev      # One-time dev build (no watch)
npm run build    # Production build (minified CSS/JS, optimized images)
```

No linting or test commands are configured.

## Architecture

**Source → Build pipeline:** All source files live in `dev/`, output goes to `build/`. There is no src-level bundler — Gulp handles the pipeline entirely.

**Gulp setup:** `gulpfile.js` creates a global `$` object (`$.gulp`, `$.browserSync`, `$.del`) used by every task module. Tasks are loaded from `gulp/tasks/` (registered in `gulp/path/tasks.js`) and define named gulp tasks called from the three top-level build pipelines.

### Directory layout

```
dev/
  pug/
    *.pug          ← page entry points (compiled to build/*.html)
    template/      ← base layout (main.pug)
    modules/       ← components (header, footer)
    utils/         ← pug mixins
  static/
    styles/
      styles.scss  ← SCSS entry point
      utils/       ← vars, mixins, fonts, libs imports
      modules/     ← per-component SCSS, collected via modules/modules.scss
    js/
      main.js      ← JS entry point (ES6 module syntax)
      modules/     ← feature modules (Header, Footer, Navigation classes)
      utils/       ← helpers, validators
    images/
      svg/         ← individual SVGs → compiled to sprite.svg
      general/     ← static images
      content/     ← content images
    fonts/
gulp/
  tasks/           ← one file per gulp task
  path/tasks.js    ← ordered list of task files to load
build/             ← compiled output (gitignored in normal use)
```

### Key build behaviors

- **SCSS:** `styles.scss` is the sole entry point. Dev builds produce `styles.min.css` with sourcemaps. Production adds csscomb ordering + csso minification.
- **JS:** `main.js` is copied as-is (dev) or concatenated+uglified to `main.min.js` (prod). The gulp task does **not** transpile or bundle ES6 `import` statements — the browser must support native ES6 modules, or modules must be self-contained.
- **Libraries:** `just-validate`, `imask`, and `swiper` are bundled from `node_modules` into `build/static/js/libs.min.js`.
- **SVG sprites:** Place individual SVGs in `dev/static/images/svg/`. The `svg` task strips `fill`/`stroke`/`style` attributes and outputs a single symbol sprite at `build/static/images/svg/sprite.svg`.
- **Cache busting:** The `hash` task appends query-string hashes to JS/CSS/image references in built HTML files (runs in `npm start` after dev build).
- **Images:** Dev copies images as-is; prod compresses via imagemin with jpeg-recompress.

### SCSS utilities

Mixins available in all SCSS files (imported via `utils/mixins.scss`):

| Mixin | Purpose |
|---|---|
| `media($px)` / `media-min($px)` | max/min-width breakpoints |
| `size($px, $border?)` | square dimensions with optional border-radius |
| `center()` | absolute 50%/50% centering |
| `ellipsis()` | single-line text truncation |
| `line-clamp($n)` | multi-line clamp |
| `scrollbars()` | custom scrollbar styling |
| `placeholder` | cross-browser placeholder |
| `links($link, $visited, $hover, $active)` | link state colors |

CSS custom properties for colors, typography, scroll, and button defaults are defined at the top of `styles.scss` and consumed throughout via `var(--name)`.
