# rz-tools

Browser-based interactive tools for teaching computational mechanics, used on
[people.utm.my/arazin](https://people.utm.my/arazin/). Each tool is plain JavaScript with no
dependencies, runs entirely in the reader's browser, and follows the host page's language
(EN/BM) and light/dark theme.

Assoc. Prof. Ts. Dr. Ahmad Razin Zainal Abidin, Faculty of Civil Engineering, Universiti Teknologi Malaysia.

## Tools

| Name  | Tool | What it shows |
| ----- | ---- | ------------- |
| `mls` | MLS Approximation Explorer | 1D Moving Least Squares: dilation parameter α, linear/quadratic basis, cubic/quartic/Gaussian weight, regular/irregular nodes. Plots the approximation and its derivative, all shape functions with Σφ, and an α-sweep of the relative L2 error with α* and EFF = E(α)/E(α*). |

## Embedding

Load the bundle once, then place a placeholder wherever a tool should appear:

```html
<script src="https://cdn.jsdelivr.net/gh/RazinUTM/rz-tools@v1.0.0/dist/rz-tools.min.js"
        integrity="sha384-…" crossorigin="anonymous" defer></script>

<div data-rz-tool="mls"></div>
```

On the WordPress site the script tag is not pasted into pages. The site bundle (Divi → Theme
Options → Integration → head) injects it only on pages that contain a `data-rz-tool` element,
using the version and SRI hash printed by `npm run build`.

Colours come from the host page's CSS custom properties (`--accent`, `--gold`, `--fg`, `--fg2`,
`--border`, `--surface`, `--bg`), with UTM maroon/gold fallbacks. Language follows
`body[data-rzlang="en|ms"]`; theme follows `body.razin-dark` or `html[data-theme]`.

## Development

```bash
npm install
npm run build   # dist/rz-tools.js, dist/rz-tools.min.js, demo/index.html
npm test        # numerical checks of the MLS core
```

Open `demo/index.html` in a browser to try the tools without the website.

```
src/registry.js     RZTools.register / mount / boot
src/base.css        shared styles, injected at load time (selectors scoped to .rzt.rzt-on)
src/mls/core.js     MLS numerics (window.RZMLS)
src/mls/ui.js       MLS user interface
src/mls/doc.html    bilingual explanation blocks used on the demo and website pages
demo/template.html  demo page template
```

## Releasing a new version

1. Bump `version` in `package.json`, run `npm run build` and `npm test`.
2. Commit, then tag: `git tag v1.0.1 && git push --tags`.
3. Update the version and SRI hash in the website's loader.

Tagged files on jsDelivr are cached permanently, so a released version never changes. That is
why the website pins an exact tag with an SRI hash rather than a range such as `@1`, which jsDelivr
caches for up to 7 days and which would load whatever is tagged next.

## Notes on the MLS implementation

- Shifted and scaled basis p(s) = [1, s, s²], s = (x<sub>I</sub> − x)/h, so φ<sub>I</sub>(x) = w<sub>I</sub>(x)·[A⁻¹(x) p(s<sub>I</sub>)]₁ and A(x) stays well conditioned.
- Support radius d = αh with h the nominal nodal spacing; irregular layouts perturb interior nodes by up to ±0.35h.
- A(x) is inverted by Gauss–Jordan with partial pivoting; a point is flagged singular when fewer than m nodes lie in its support or a pivot falls below 10⁻¹³‖A‖.
- Errors are relative L2 norms over 401 uniform samples (trapezoidal rule). du/dx is a second-order finite difference of uʰ.
- The tests check consistency (quadratic reproduced to < 10⁻¹²), partition of unity, the singularity thresholds (linear α > 1, quadratic α > 1.5 interior and α > 2 at the boundary on a regular grid), and convergence rates of about h³ in u and h² in du/dx.
