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
| `efg2d` | 2D Meshfree EFG Explorer | Element-Free Galerkin on the same three benchmarks: MLS shape functions (linear or quadratic basis, cubic or quartic spline weight, dilation parameter α), Gauss quadrature on background cells, essential boundary conditions by penalty or Nitsche's method. Shows nodes, supports, cells, Gauss points and the shape function of any node, and compares the energy-norm error with Q4 finite elements on the same nodes. |
| `bar1d` | 1D Bar FEM Explorer | Browser version of the earlier Streamlit app: fixed–free axial bar with tip load, plus a uniform distributed load, a linearly tapered section and quadratic elements. Deformed bar shaded by stress, u(x) and σ(x) against the exact solution, convergence, nodal and element tables, and the equivalent Python code. |
| `nrpim2d` | 2D N-RPIM Explorer | NURBS geometry with radial point interpolation (Mokhtaram et al., 2022): MQ or TPS radial basis functions with polynomial terms, built in the NURBS parameter space, Galerkin integration on knot-span cells, direct essential conditions. Plate with a hole, cantilever, patch test and the paper's cellular-beam unit cell with its COMSOL references. Physical and parameter-space views linked by hover, control net and knot lines, and a comparison with Q4 elements on the same nodes. |
| `ndm2d` | 2D NDM Explorer | NURBS-Divergence-Meshless method for steady heat conduction (Rasin et al., 2025): one balance equation per cell from the divergence theorem, written as four line integrals in the parameter space; MLS or Gaussian RBF approximation; non-overlapping or overlapping cells; 1, 3 or 5 Gauss points per side; direct Dirichlet rows. Radial flow with an exact solution, the paper's quarter annulus and fan blade, and a patch test. A cell inspector shows the four side integrals of any node. |

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
npm test        # numerical checks of every core
```

Open any page in `demo/` (mls, fem2d, efg2d, bar1d, nrpim2d, ndm2d) in a browser to try the tools without the website.

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
src/efg/core.js     2D EFG (window.RZEFG): MLS shape functions, cell quadrature, penalty / Nitsche BCs; reuses RZFEM benchmarks and solver
src/efg/ui.js       EFG user interface
src/bar/core.js     1D bar FEM (window.RZBAR) with exact solutions
src/bar/ui.js       1D bar user interface
src/nurbs/core.js   NURBS patches and geometry library, index-space node lattice, RPIM and MLS shape functions,
                    dense and banded LU (window.RZNURBS)
src/nurbs/view.js   drawing helpers shared by the NURBS explorers (sample grids, knot lines, control net)
src/nrpim/core.js   2D N-RPIM plane stress (window.RZNRPIM); Q4 on the same nodes through RZFEM
src/nrpim/ui.js     N-RPIM user interface
src/ndm/core.js     2D NDM heat conduction (window.RZNDM); Q4 on the same nodes for comparison
src/ndm/ui.js       NDM user interface
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

## Notes on the 2D EFG implementation

- Nodes are the corner nodes of the same mapped grids as the FEM explorer; their cells serve as background integration cells, mapped through the exact geometry (curved hole included).
- Circular supports d_I = α c_I, with c_I the longest grid edge at node I. MLS uses a basis centred and scaled at each evaluation point; derivatives follow from γ = A⁻¹p, γ,x = A⁻¹(p,x − A,x γ). A(x) is factorised by Cholesky; fewer than m nodes or a non-positive pivot flags the point as singular.
- Essential boundary conditions on the supported edges: penalty β = 10ᵖ E/h̄, or symmetric Nitsche with β = 100 E/h̄ (stable for β ≳ 10 E/h̄ in these benchmarks). The EFG patch test uses rollers on x = 0 and y = 0, which match the exact field without a point constraint.
- Tests check partition of unity and reproduction of the basis and its derivatives, non-interpolation, the patch-test integration error, convergence and the advantage over Q4 on the same nodes, the penalty trade-off, singular moment matrices for small α, and the stress concentration factor.

## Notes on the 1D bar

- Fixed at x = 0; tip load P, uniform load q and area varying linearly from A₀ to A(L). Element matrices by 3-point Gauss quadrature (exact for these integrands); consistent loads.
- Exact solution N(x) = P + q(L − x), u(x) = ∫ N / (E A) dx in closed form, including the logarithmic tapered case.
- Tests check exactness for the tip load, nodal exactness with a distributed load, quadratic elements reproducing the quadratic solution, energy-norm rates on the tapered bar, and the support reaction.

## Notes on the NURBS geometry and the parameter-space approximations

- Patches are tensor-product NURBS of degree 2 evaluated with the Cox–de Boor recursion; first derivatives of the
  rational map are exact. Geometry library: rectangle, square with a curved parametrization, plate with a hole,
  quarter annulus (Rasin et al. 2025, Table 3), fan blade (their Table 1) and the cellular-beam unit cell
  (Mokhtaram et al. 2022, Table 1). The tests check exact circles and positive Jacobians.
- The plate with a hole uses two quadratic spans that meet at the corner (b, b), with the knot η = 0.5 repeated. The
  usual single C¹ pair of spans collapses that corner (det J = 0), which made the RPIM stresses near it blow up.
- Fan blade: the table's knot vectors are swapped relative to its Fig. 3; the five-point direction (with the C⁰
  knot at 0.5) runs from the hub arc to the tip. With this reading and k = 1 W/(m·K), the computed temperatures
  match the converged values implied by Table 2 (31.966, 30.701, 30.171 °C) to about 0.01%.
- Nodes live in an index space: each knot span is divided into equal intervals, so every knot line is a node line
  and nodes sit on a unit lattice (interior nodes can be perturbed). Distances for RBF and MLS are measured in this
  space, so the support radius is α times the nodal spacing.
- Supports never cross a C⁰ knot line (a knot repeated p times). There the map has a kink, so a smooth physical
  field is only C⁰ in the parameter space. Letting supports cross these lines made N-RPIM converge to the wrong
  displacement on the unit cell; stopping them, as the knot spans of the paper are treated, recovers the reference.
- RPIM: MQ R = (r² + (αc dc)²)^q with q = 2.1, αc = 0.1, dc = 1, or TPS R = r^η with η = 4.0001, plus 0, 3 or 6
  polynomial terms; the moment matrix is factorised by LU with partial pivoting. MLS: quadratic basis centred at the
  evaluation point, weight exp(−(r/(c d))²) with c = 0.3, Cholesky factorisation. Gaussian RBF for NDM:
  exp(−αc (r/dc)²), αc = 0.8, dc = 2d, no polynomial terms.

## Notes on the 2D N-RPIM implementation

- Integration cells are the lattice cells, so they subdivide the knot spans; Gauss points map parent → parameter
  (affine) → physical (NURBS), B = Ĵ⁻¹ J̃⁻¹ B̃. Tractions are integrated along the exact boundary.
- One support per integration cell (nodes within d of the cell centre): the moment matrix is factorised once per
  cell, and the shape functions are smooth inside each cell but jump slightly across cell edges. The patch-test
  error (about 1% on a regular lattice) comes from these jumps and does not fall with more Gauss points. A support
  per Gauss point (`supp: 'point'`, not in the interface) changes erratically with the support radius.
- Essential conditions and the unit cell's point supports are applied directly to nodal values (Kronecker delta).
  Q4 elements on the same nodes are solved by RZFEM through the `cfg.pr` / `cfg.mesh` / `pr.nodeBC` hooks.
- Unit cell under transverse compression: N-RPIM converges to v_A = 9.8368 × 10⁻⁶ m (32 intervals per span) against
  the paper's COMSOL 9.8366 × 10⁻⁶ m, and u_A towards −2.62 × 10⁻⁷ m, as does Richardson-extrapolated Q4. Under
  shear it converges to v_B = −1.7311 × 10⁻⁵ m (n = 16). The paper prints −17.332 × 10⁻⁵ m; the digits agree with
  −1.7332 × 10⁻⁵ m, which is the reference used here.
- Tests check the patch-test behaviour, convergence and the advantage over Q4, the stress concentration factor, the
  need for polynomial terms, the unit-cell references, and robustness with irregular nodes.

## Notes on the 2D NDM implementation

- One cell per node: non-overlapping cells are the dual cells of the lattice; overlapping cells are 1.6 times as
  large. Nodes with a prescribed temperature get the row Σ N_j(x_I) T_j = T̂ instead of a cell equation. Side
  integrals use the paper's Eq. 8 with the G terms of the map (computed in the index coordinates), split at every
  interior knot line; flux and insulated sides go to the right-hand side.
- The non-symmetric system is stored in LAPACK band format and factorised by LU with partial pivoting.
- Checks: the quadratic patch test is exact to round-off with 1, 3 or 5 Gauss points per side, overlapping cells
  and irregular nodes; every cell balance closes to round-off; boundary rows make T exact at boundary nodes for MLS.
  Radial flow (exact T = 30 + (q a/k) ln(b/r)): energy-norm rates of about 2.5 (MLS), 2.0 (MLS, overlapping) and
  1.1 (Q4); the Gaussian RBF stalls near 1%, as the paper's RBF curves flatten.
- Quarter annulus with the paper's conditions: no closed form; the references T(P) = 39.1487 °C at (ξ, η) = (0, 0.5)
  and T(Q) = 33.1757 °C at (0.5, 0.5) come from Q4 on 16 × 32 to 128 × 256 cells, Richardson-extrapolated (observed
  order 2.00), and NDM-MLS approaches them from above.
