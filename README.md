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
| `fem2d` | 2D Plane Stress FEM Explorer | T3, Q4, QM6 (incompatible modes) and Q8 elements on three benchmarks: Timoshenko cantilever, plate with a hole (Kirsch) and the patch test. Banded stress contours on the deformed shape, raw or averaged stresses, line plots against the exact solution, energy-norm error and a convergence study across all four elements. |

## Embedding

Load the bundle once, then place a placeholder wherever a tool should appear:

```html
<script src="https://cdn.jsdelivr.net/gh/RazinUTM/rz-tools@<commit>/dist/rz-tools.min.js"
        integrity="sha384-…" crossorigin="anonymous" defer></script>

<div data-rz-tool="mls"></div>
```

On the WordPress site the script tag is not pasted into pages. The site bundle (Divi → Theme
Options → Integration → head) injects it only on pages that contain a `data-rz-tool` element,
pinned to a commit hash with the SRI hash printed by `npm run build`.

Colours come from the host page's CSS custom properties (`--accent`, `--gold`, `--fg`, `--fg2`,
`--border`, `--surface`, `--bg`), with UTM maroon/gold fallbacks. Language follows
`body[data-rzlang="en|ms"]`; theme follows `body.razin-dark` or `html[data-theme]`.

## Development

```bash
npm install
npm run build   # dist/rz-tools.js, dist/rz-tools.min.js, demo/<tool>.html
npm test        # numerical checks of the MLS and FEM cores
```

Open `demo/mls.html` or `demo/fem2d.html` in a browser to try the tools without the website.

```
src/registry.js     RZTools.register / mount / boot
src/shared.js       formatting, host colours, OKLab colour ramps, canvas plotter (RZTools.util)
src/base.css        shared styles, injected at load time (selectors scoped to .rzt.rzt-on)
src/mls/core.js     MLS numerics (window.RZMLS)
src/mls/ui.js       MLS user interface
src/mls/doc.html    bilingual explanation blocks used on the demo and website pages
src/fem/core.js     2D plane stress FEM (window.RZFEM): meshes, elements, skyline solver, recovery, errors
src/fem/ui.js       FEM user interface
src/fem/doc.html    bilingual explanation blocks
demo/template.html  demo page template (build writes demo/<tool>.html)
```

## Releasing a new version

1. Bump `version` in `package.json`, run `npm run build` and `npm test`.
2. Commit and push to `main`. Optionally create a GitHub Release with a matching tag (`v1.0.1`) for the record.
3. Update the commit hash and SRI hash in the website's loader.

jsDelivr caches files requested by commit hash (or exact tag) permanently, so a pinned build never
changes. The website pins a commit with an SRI hash rather than a range such as `@1`, which jsDelivr
caches for up to 7 days and which would load whatever is released next; the SRI hash makes the
browser refuse any file that differs from the reviewed build.

## Notes on the MLS implementation

- Shifted and scaled basis p(s) = [1, s, s²], s = (x<sub>I</sub> − x)/h, so φ<sub>I</sub>(x) = w<sub>I</sub>(x)·[A⁻¹(x) p(s<sub>I</sub>)]₁ and A(x) stays well conditioned.
- Support radius d = αh with h the nominal nodal spacing; irregular layouts perturb interior nodes by up to ±0.35h.
- A(x) is inverted by Gauss–Jordan with partial pivoting; a point is flagged singular when fewer than m nodes lie in its support or a pivot falls below 10⁻¹³‖A‖.
- Errors are relative L2 norms over 401 uniform samples (trapezoidal rule). du/dx is a second-order finite difference of uʰ.
- The tests check consistency (quadratic reproduced to < 10⁻¹²), partition of unity, the singularity thresholds (linear α > 1, quadratic α > 1.5 interior and α > 2 at the boundary on a regular grid), and convergence rates of about h³ in u and h² in du/dx.

## Notes on the 2D plane stress FEM implementation

- Structured mapped meshes in parametric (s, t) space; interior nodes can be perturbed by up to ±0.4 of an element. Q8 midside nodes sit at parametric midpoints, so the hole boundary is exact at every node.
- Element stiffness by Gauss quadrature: T3 one point, Q4 and QM6 2 × 2, Q8 3 × 3. QM6 adds the modes 1 − ξ² and 1 − η² with Taylor's correction (Jacobian at the centre scaled by det J₀ / det J) and condenses them statically.
- Essential boundary conditions are eliminated through equation numbering; the free equations are factorised with a skyline LDLᵀ (Crout) solver. Nodes are numbered along the shorter side of the grid to keep the profile small.
- Stresses: 2 × 2 Gauss-point values extrapolated to the element nodes (raw), then averaged at shared nodes. The relative energy-norm error uses the direct B·u stresses with 4 × 4 points per quadrilateral and the 7-point degree-5 rule per triangle.
- Exact solutions: Timoshenko and Goodier's cantilever (sign convention checked against Hooke's law for a downward load) and Kirsch's plate with a hole; both satisfy equilibrium and compatibility to round-off in the tests.
- The tests check the solver against a dense solve, the patch test for all elements on distorted meshes, equilibrium of reactions, energy-norm rates (≈ 1 for T3, Q4, QM6 and ≈ 2 for Q8), shear locking of T3 and Q4, and the stress concentration factor at the hole.
