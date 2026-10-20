/* ═══════════════════════════════════════════════════════════════
   2D NURBS-Divergence-Meshless (NDM) core, steady heat conduction — window.RZNDM
   Rasin, Hirol, Zainal Abidin, Mokhtaram, Mohd Noor and Mohd Yassin,
   Comput. Math. Appl. 196 (2025) 151–171.
   · k∇²T + Q = 0 is integrated over one cell per node; the divergence theorem turns
     each cell integral into four line integrals of the normal flux.
   · Cells are rectangles in the NURBS parameter space, so on each side one normal
     component is ±1 and the other 0: the line integrals reduce to
     −∫_b (T_ξG12 + T_ηG22)dξ + ∫_r (T_ξG11 + T_ηG12)dη + ∫_t (T_ξG12 + T_ηG22)dξ − ∫_l (T_ξG11 + T_ηG12)dη
     with G11 = (x_η² + y_η²)/|J|, G12 = −(x_ξx_η + y_ξy_η)/|J|, G22 = (x_ξ² + y_ξ²)/|J|.
   · T is approximated by MLS (quadratic basis, exponential weight) or Gaussian RBF
     in the parameter space. Dirichlet conditions are imposed directly: the row of a
     boundary node is Σ N_j(x_I) T_j = T̂, even for MLS, which is not interpolating.
   · One row per node (row-based assembly) → a non-symmetric banded system.
   Also: Q4 finite elements on the same nodes, for comparison.
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  var N = root.RZNURBS;
  var KCOND = 1;     // thermal conductivity k (W/m·K); the paper does not state it, k = 1 reproduces its tables

  /* ── problems ─────────────────────────────────────────────────── */
  // bc(tag, x, y) → { T: value } (prescribed temperature) | { q: value } (heat flux into the domain, W/m²) | null (insulated)
  // source Q(x, y) (W/m³), exact { T(x, y), g(x, y) → [∂T/∂x, ∂T/∂y] } | null, ref { pts: [{ name, u, v, T }] }
  function problem(cfg) {
    var G = N.GEOM, n = Math.max(1, Math.round(cfg.n || 4)), k = KCOND;
    if (cfg.problem === 'radial') {
      // quarter annulus, heat flux q into the inner arc, T₀ on the outer arc, insulated straight edges: T = T₀ + (q a/k) ln(b/r)
      var a = 0.3, b = 0.6, q = 60, T0 = 30;
      return { key: 'radial', patch: G.annulus(a, b), mu: n, mv: n, k: k, a: a, b: b, q: q, T0: T0,
        bc: function (tag) { return tag === 's0' ? { q: q } : tag === 's1' ? { T: T0 } : null; },
        source: null,
        exact: { T: function (x, y) { return T0 + q * a / k * Math.log(b / Math.hypot(x, y)); },
                 g: function (x, y) { var r2 = x * x + y * y, c = -q * a / k / r2; return [c * x, c * y]; } },
        ref: { pts: [] }, bbox: [0, b, 0, b] };
    }
    if (cfg.problem === 'annulus') {
      // the paper's quarter-annular disc (section 4.2): 60 W/m² into the inner arc, 30 °C on the other three sides
      return { key: 'annulus', patch: G.annulus(0.3, 0.6), mu: n, mv: n, k: k, q: 60, T0: 30,
        bc: function (tag) { return tag === 's0' ? { q: 60 } : { T: 30 }; },
        source: null, exact: null,
        // no closed form: reference from Q4 on 128 × 256 cells, Richardson-extrapolated (p = 2.00), checked against NDM-MLS
        ref: { pts: [{ name: 'P', u: 0, v: 0.5, T: 39.1487 }, { name: 'Q', u: 0.5, v: 0.5, T: 33.1757 }] }, bbox: [0, 0.6, 0, 0.6] };
    }
    if (cfg.problem === 'blade') {
      // fan blade (section 4.1): 60 W/m² into the hub arc ξ = 0, 30 °C on the other edges.
      // Reference: the converged values implied by the paper's Table 2 (value and error of each method).
      return { key: 'blade', patch: G.fanBlade(), mu: n, mv: n, k: k, q: 60, T0: 30,
        bc: function (tag) { return tag === 's0' ? { q: 60 } : { T: 30 }; },
        source: null, exact: null,
        ref: { pts: [{ name: 'P₁', u: 0, v: 0.5, T: 31.966 }, { name: 'P₂', u: 0.25, v: 0.5, T: 30.701 }, { name: 'P₃', u: 0.5, v: 0.75, T: 30.171 }] },
        bbox: [-0.03, 0.2, -0.05, 0.21] };
    }
    // patch test: quadratic temperature on the unit square with a uniform source; flux on x = 1, T elsewhere
    var c = [30, 1, -1, 5, -3, 2];     // T = c0 + c1 x + c2 y + c3 x² + c4 xy + c5 y²
    function Te(x, y) { return c[0] + c[1] * x + c[2] * y + c[3] * x * x + c[4] * x * y + c[5] * y * y; }
    function ge(x, y) { return [c[1] + 2 * c[3] * x + c[4] * y, c[2] + c[4] * x + 2 * c[5] * y]; }
    var Qs = -k * (2 * c[3] + 2 * c[5]);
    return { key: 'patch', patch: cfg.param === 'curved' ? G.squareCurved(0.15) : G.rect(0, 1, 0, 1), mu: n, mv: n, k: k,
      bc: function (tag, x, y) { return tag === 's1' ? { q: k * ge(x, y)[0] } : { T: Te(x, y) }; },
      source: function () { return Qs; }, exact: { T: Te, g: ge }, ref: { pts: [] }, bbox: [0, 1, 0, 1] };
  }

  /* ── set-up ───────────────────────────────────────────────────── */
  // cfg: { problem, n, distort, seed, approx: 'mls' | 'rbf', alpha (support radius / spacing), overlap: 0 | 1, gamma, ngs (Gauss points per side) }
  function setup(cfg) {
    var pr = problem(cfg), P = pr.patch, ax = new N.Axis(P.ku, pr.mu, P.c0u), ay = new N.Axis(P.kv, pr.mv, P.c0v);
    var lat = new N.Lattice(ax, ay, { distort: cfg.distort || 0, seed: cfg.seed || 1 });
    var map = new N.Map(P, ax, ay), nn = lat.nn, X = new Float64Array(nn), Y = new Float64Array(nn), o = new Float64Array(12);
    for (var k = 0; k < nn; k++) { map.at(lat.A[k], lat.B[k], o); X[k] = o[0]; Y[k] = o[1]; }
    var rbf = cfg.approx === 'rbf';
    var dS = cfg.alpha || 3;
    var S = new N.Approx(lat, rbf ? { kind: 'rpim', rbf: 'exp', m: 0, d: dS, exp: { ac: 0.8, dc: cfg.dc || 2 * dS } }
                                  : { kind: 'mls', m: 6, d: dS, c: cfg.c || 0.3 });
    // knot lines inside the domain (index positions): line integrals are split there
    return { cfg: cfg, pr: pr, patch: P, ax: ax, ay: ay, lat: lat, map: map, X: X, Y: Y, nn: nn, S: S, k: pr.k,
             gamma: cfg.overlap ? (cfg.gamma || 1.6) : 1, ngs: cfg.ngs || 5, kxA: ax.A.slice(1, -1), kxB: ay.A.slice(1, -1) };
  }

  // integration cell of node I in the index space: [a0, a1] × [b0, b1]
  function cellOf(md, I) {
    var lat = md.lat, h = md.gamma / 2, i = lat.LI[I], j = lat.LJ[I];
    return [Math.max(0, i - h), Math.min(lat.Mu, i + h), Math.max(0, j - h), Math.min(lat.Mv, j + h)];
  }
  // break [t0, t1] at interior knot lines
  function pieces(t0, t1, knots) {
    var out = [t0];
    for (var k = 0; k < knots.length; k++) if (knots[k] > t0 + 1e-12 && knots[k] < t1 - 1e-12) out.push(knots[k]);
    out.push(t1);
    return out;
  }
  // boundary condition on a cell side that lies on the domain boundary (null if the side is interior)
  function sideTag(md, s, c) {
    var lat = md.lat;
    if (s === 'b' && c[2] === 0) return 't0';
    if (s === 't' && c[3] === lat.Mv) return 't1';
    if (s === 'l' && c[0] === 0) return 's0';
    if (s === 'r' && c[1] === lat.Mu) return 's1';
    return null;
  }
  // Gauss points on the four sides of a cell: { s, a, b, w (incl. half-length), along ('a' | 'b'), sign }
  var SIDES = [['b', 'a', -1], ['r', 'b', 1], ['t', 'a', 1], ['l', 'b', -1]];
  function sidePoints(md, c, ng) {
    var g = N.GL[ng], out = [];
    SIDES.forEach(function (sd) {
      var name = sd[0], along = sd[1], sign = sd[2];
      var t0 = along === 'a' ? c[0] : c[2], t1 = along === 'a' ? c[1] : c[3], fixedV = name === 'b' ? c[2] : name === 't' ? c[3] : name === 'l' ? c[0] : c[1];
      var P = pieces(t0, t1, along === 'a' ? md.kxA : md.kxB);
      for (var k = 0; k + 1 < P.length; k++) for (var q = 0; q < ng; q++) {
        var t = (P[k] + P[k + 1]) / 2 + (P[k + 1] - P[k]) / 2 * g.p[q], w = g.w[q] * (P[k + 1] - P[k]) / 2;
        out.push({ s: name, a: along === 'a' ? t : fixedV, b: along === 'a' ? fixedV : t, w: w, along: along, sign: sign });
      }
    });
    return out;
  }
  // flux coefficient of shape function k at a side point: (G-terms) with index-space derivatives; o = map output
  function fluxCoef(o, da, db, along) {
    var J = o[6], xa = o[2], ya = o[3], xb = o[4], yb = o[5];
    var g12 = -(xa * xb + ya * yb) / J;
    if (along === 'a') return da * g12 + db * (xa * xa + ya * ya) / J;    // T_a G12 + T_b G22 (bottom and top sides)
    return da * (xb * xb + yb * yb) / J + db * g12;                      // T_a G11 + T_b G12 (left and right sides)
  }
  // side hint for the parameter map and supports at a point on a knot line (never happens inside pieces)
  function sideHint(t) { return t % 1 === 0 ? 1 : 0; }

  /* ── solve ────────────────────────────────────────────────────── */
  function run(cfg) {
    var t0 = now(), md = setup(cfg), pr = md.pr, lat = md.lat, nn = md.nn, S = md.S, map = md.map, k = md.k, ng = md.ngs;
    var o = new Float64Array(12), acc = new Float64Array(nn), mark = new Uint8Array(nn), touched = [], rows = new Array(nn), rhs = new Float64Array(nn);
    var dirich = new Uint8Array(nn), That = new Float64Array(nn), I, q, kk, bad = 0;
    // Dirichlet nodes: on a boundary edge where the temperature is prescribed
    for (I = 0; I < nn; I++) lat.edges(I).forEach(function (tag) { var v = pr.bc(tag, md.X[I], md.Y[I]); if (v && v.T !== undefined) { dirich[I] = 1; That[I] = v.T; } });
    function put(j, v) { if (!mark[j]) { mark[j] = 1; touched.push(j); } acc[j] += v; }
    var gA = N.GL[Math.max(2, Math.min(6, ng))], src = pr.source;
    for (I = 0; I < nn; I++) {
      touched.length = 0;
      if (dirich[I]) {
        var nd = S.at(lat.A[I], lat.B[I], false, 1, 1);
        if (nd < 0) { bad++; rows[I] = null; continue; }
        for (kk = 0; kk < nd; kk++) put(S.idx[kk], S.phi[kk]);
        rhs[I] = That[I];
      } else {
        var c = cellOf(md, I), sp = sidePoints(md, c, ng), b0 = 0;
        for (q = 0; q < sp.length; q++) {
          var P = sp[q], tag = sideTag(md, P.s, c), bc = tag ? pr.bc(tag, 0, 0) : null;
          map.at(P.a, P.b, o, sideHint(P.a), sideHint(P.b));
          if (tag && (!bc || bc.q !== undefined)) {
            // known flux on the boundary: ∫ (q_in / k) ds goes to the right-hand side
            if (bc) { var bq = pr.bc(tag, o[0], o[1]).q, ds = P.along === 'a' ? Math.hypot(o[2], o[3]) : Math.hypot(o[4], o[5]); b0 -= P.w * bq / k * ds; }
            continue;
          }
          var n = S.at(P.a, P.b, true, sideHint(P.a), sideHint(P.b));
          if (n < 0) { bad++; continue; }
          for (kk = 0; kk < n; kk++) put(S.idx[kk], P.sign * P.w * fluxCoef(o, S.da[kk], S.db[kk], P.along));
        }
        // heat source: ∫ (−Q / k) dΩ over the cell
        if (src) {
          var PA = pieces(c[0], c[1], md.kxA), PB = pieces(c[2], c[3], md.kxB);
          for (var ia = 0; ia + 1 < PA.length; ia++) for (var ib = 0; ib + 1 < PB.length; ib++)
            for (var p1 = 0; p1 < gA.p.length; p1++) for (var p2 = 0; p2 < gA.p.length; p2++) {
              var aa = (PA[ia] + PA[ia + 1]) / 2 + (PA[ia + 1] - PA[ia]) / 2 * gA.p[p1], bb = (PB[ib] + PB[ib + 1]) / 2 + (PB[ib + 1] - PB[ib]) / 2 * gA.p[p2];
              map.at(aa, bb, o);
              b0 -= gA.w[p1] * gA.w[p2] * (PA[ia + 1] - PA[ia]) / 2 * (PB[ib + 1] - PB[ib]) / 2 * o[6] * src(o[0], o[1]) / k;
            }
        }
        rhs[I] = b0;
      }
      var cols = new Int32Array(touched.length), vals = new Float64Array(touched.length);
      for (kk = 0; kk < touched.length; kk++) { var j = touched[kk]; cols[kk] = j; vals[kk] = acc[j]; acc[j] = 0; mark[j] = 0; }
      rows[I] = { c: cols, v: vals };
    }
    if (bad) return { error: 'support', bad: bad, md: md, why: S.fail };
    var kl = 0, ku = 0;
    for (I = 0; I < nn; I++) for (kk = 0; kk < rows[I].c.length; kk++) { var d = I - rows[I].c[kk]; if (d > kl) kl = d; if (-d > ku) ku = -d; }
    var B = new N.Band(nn, kl, ku);
    for (I = 0; I < nn; I++) for (kk = 0; kk < rows[I].c.length; kk++) B.add(I, rows[I].c[kk], rows[I].v[kk]);
    var t1 = now(), piv = B.factor();
    if (piv >= 0) return { error: 'singular', md: md, pivot: piv };
    var Tn = B.solve(rhs), t2 = now();
    var nnz = 0; for (I = 0; I < nn; I++) nnz += rows[I].c.length;
    return { cfg: cfg, md: md, pr: pr, T: Tn, rows: rows, rhs: rhs, dirich: dirich, That: That, nn: nn, kl: kl, ku: ku, nnz: nnz,
             time: { assemble: t1 - t0, solve: t2 - t1 } };
  }

  /* ── evaluation ───────────────────────────────────────────────── */
  // [T, ∂T/∂x, ∂T/∂y] at index point (a, b); sa, sb pick the side on a knot line. null if the approximation fails.
  function evalAt(model, a, b, sa, sb, out) {
    var md = model.md, S = md.S, o = model._o || (model._o = new Float64Array(12));
    md.map.at(a, b, o, sa, sb);
    if (!(Math.abs(o[6]) > 1e-10 * (Math.abs(o[2] * o[5]) + Math.abs(o[3] * o[4]) + 1e-300))) {
      a += a > md.lat.Mu / 2 ? -1e-4 : 1e-4; b += b > md.lat.Mv / 2 ? -1e-4 : 1e-4; md.map.at(a, b, o, sa, sb);
    }
    var n = S.at(a, b, true, sa, sb); if (n < 0) return null;
    var T = 0, Ta = 0, Tb = 0;
    for (var k = 0; k < n; k++) { var v = model.T[S.idx[k]]; T += S.phi[k] * v; Ta += S.da[k] * v; Tb += S.db[k] * v; }
    out = out || new Float64Array(3);
    out[0] = T; out[1] = (o[5] * Ta - o[3] * Tb) / o[6]; out[2] = (-o[4] * Ta + o[2] * Tb) / o[6];
    return out;
  }
  function evalParam(model, u, v, out) { var md = model.md; return evalAt(model, md.ax.index(u), md.ay.index(v), 1, 1, out); }
  function phiAt(model, I, a, b, sa, sb) { return model.md.S.phiOf(I, a, b, sa, sb); }

  // relative errors against the exact solution: energy (flux) norm and L2 norm of T − T_exact, over the exact geometry
  function errors(model) {
    var ex = model.pr.exact; if (!ex) return null;
    var md = model.md, lat = md.lat, g = N.GL[4], o = new Float64Array(3), m = new Float64Array(12), e1 = 0, d1 = 0, e0 = 0, d0 = 0, tmax = 0;
    for (var i = 0; i < lat.Mu; i++) for (var j = 0; j < lat.Mv; j++) for (var p = 0; p < 4; p++) for (var q = 0; q < 4; q++) {
      var a = i + (1 + g.p[p]) / 2, b = j + (1 + g.p[q]) / 2;
      md.map.at(a, b, m);
      var w = g.w[p] * g.w[q] * 0.25 * m[6], x = m[0], y = m[1], r = evalAt(model, a, b, 0, 0, o); if (!r) continue;
      var ge = ex.g(x, y), Te = ex.T(x, y);
      e1 += w * ((r[1] - ge[0]) * (r[1] - ge[0]) + (r[2] - ge[1]) * (r[2] - ge[1])); d1 += w * (ge[0] * ge[0] + ge[1] * ge[1]);
      e0 += w * (r[0] - Te) * (r[0] - Te); d0 += w * Te * Te;
    }
    for (var I = 0; I < lat.nn; I++) {
      var v = evalAt(model, lat.A[I], lat.B[I], 1, 1, o); if (v) tmax = Math.max(tmax, Math.abs(v[0] - ex.T(md.X[I], md.Y[I])));
    }
    return { energy: Math.sqrt(e1 / d1), l2: Math.sqrt(e0 / d0), tmax: tmax };
  }
  // the balance of one cell, evaluated with the solution: fluxes out through each side (W/m per unit thickness, ÷ k)
  function cellReport(model, I) {
    var md = model.md, pr = md.pr, S = md.S, lat = md.lat, k = md.k, o = new Float64Array(12);
    if (model.dirich[I]) {
      var n = S.at(lat.A[I], lat.B[I], false, 1, 1), own = 0;
      for (var q0 = 0; q0 < n; q0++) if (S.idx[q0] === I) own = S.phi[q0];
      return { kind: 'dirichlet', T: model.That[I], stencil: model.rows[I].c.length, own: own };
    }
    var c = cellOf(md, I), sp = sidePoints(md, c, md.ngs), out = { kind: 'cell', cell: c, sides: {}, known: {}, gps: [], stencil: model.rows[I].c.length };
    SIDES.forEach(function (s) { out.sides[s[0]] = 0; out.known[s[0]] = null; });
    sp.forEach(function (P) {
      var tag = sideTag(md, P.s, c), bc = tag ? pr.bc(tag, 0, 0) : null;
      md.map.at(P.a, P.b, o, sideHint(P.a), sideHint(P.b));
      var ds = P.along === 'a' ? Math.hypot(o[2], o[3]) : Math.hypot(o[4], o[5]);
      out.gps.push([P.a, P.b, P.s]);
      if (tag && (!bc || bc.q !== undefined)) { out.known[P.s] = (out.known[P.s] || 0) + (bc ? P.w * pr.bc(tag, o[0], o[1]).q / k * ds : 0); return; }
      var n = S.at(P.a, P.b, true, sideHint(P.a), sideHint(P.b)), f = 0; if (n < 0) return;
      for (var kk = 0; kk < n; kk++) f += P.sign * P.w * fluxCoef(o, S.da[kk], S.db[kk], P.along) * model.T[S.idx[kk]];
      out.sides[P.s] += f;
    });
    // Σ (all four sides) = F̂ = −∫ Q/k dΩ; the known sides were moved to the right-hand side when solving
    var tot = 0, kn = 0;
    SIDES.forEach(function (s) { var k0 = out.known[s[0]]; if (k0 !== null) kn += k0; tot += k0 !== null ? k0 : out.sides[s[0]]; });
    out.total = tot; out.knownSum = kn; out.source = model.rhs[I] + kn;
    return out;
  }

  /* ── Q4 finite elements on the same nodes (straight-sided elements) ── */
  function femRun(cfg) {
    var t0 = now(), md = setup(cfg), pr = md.pr, lat = md.lat, nn = md.nn, X = md.X, Y = md.Y, Mu = lat.Mu, Mv = lat.Mv, k = md.k, i, j, a, b, q;
    var fixed = new Uint8Array(nn), Tb = new Float64Array(nn);
    for (i = 0; i < nn; i++) lat.edges(i).forEach(function (tag) { var v = pr.bc(tag, X[i], Y[i]); if (v && v.T !== undefined) { fixed[i] = 1; Tb[i] = v.T; } });
    var eq = new Int32Array(nn), neq = 0; for (i = 0; i < nn; i++) eq[i] = fixed[i] ? -1 : neq++;
    var C = []; for (i = 0; i < Mu; i++) for (j = 0; j < Mv; j++) C.push([lat.node(i, j), lat.node(i + 1, j), lat.node(i + 1, j + 1), lat.node(i, j + 1)]);
    var top = new Int32Array(neq); for (a = 0; a < neq; a++) top[a] = a;
    C.forEach(function (e) { var mn = Infinity; e.forEach(function (n) { if (eq[n] >= 0 && eq[n] < mn) mn = eq[n]; }); e.forEach(function (n) { if (eq[n] >= 0 && mn < top[eq[n]]) top[eq[n]] = mn; }); });
    var K = new root.RZFEM.Skyline(top), f = new Float64Array(neq), g2 = N.GL[2], src = pr.source;
    var NQ = [0, 0, 0, 0], dX = [0, 0, 0, 0], dY = [0, 0, 0, 0];
    function shp(e, xi, et) {   // bilinear shape functions on element e; returns det J and fills NQ, dX, dY
      var sx = [-1, 1, 1, -1], sy = [-1, -1, 1, 1], j11 = 0, j12 = 0, j21 = 0, j22 = 0, dn = [], de = [];
      for (var t = 0; t < 4; t++) {
        NQ[t] = (1 + sx[t] * xi) * (1 + sy[t] * et) / 4; dn[t] = sx[t] * (1 + sy[t] * et) / 4; de[t] = sy[t] * (1 + sx[t] * xi) / 4;
        j11 += dn[t] * X[e[t]]; j12 += dn[t] * Y[e[t]]; j21 += de[t] * X[e[t]]; j22 += de[t] * Y[e[t]];
      }
      var det = j11 * j22 - j12 * j21;
      for (t = 0; t < 4; t++) { dX[t] = (j22 * dn[t] - j12 * de[t]) / det; dY[t] = (-j21 * dn[t] + j11 * de[t]) / det; }
      return det;
    }
    C.forEach(function (e) {
      for (var p1 = 0; p1 < 2; p1++) for (var p2 = 0; p2 < 2; p2++) {
        var det = shp(e, g2.p[p1], g2.p[p2]), w = det * g2.w[p1] * g2.w[p2], xq = 0, yq = 0;
        for (var t = 0; t < 4; t++) { xq += NQ[t] * X[e[t]]; yq += NQ[t] * Y[e[t]]; }
        var Qv = src ? src(xq, yq) : 0;
        for (var r = 0; r < 4; r++) {
          var er = eq[e[r]]; if (er < 0) continue;
          f[er] += w * NQ[r] * Qv;
          for (var s = 0; s < 4; s++) {
            var kv = w * k * (dX[r] * dX[s] + dY[r] * dY[s]), es = eq[e[s]];
            if (es < 0) f[er] -= kv * Tb[e[s]]; else if (er <= es) K.add(er, es, kv);
          }
        }
      }
    });
    // heat flux on the boundary, along the straight element edges
    [['s0', 0, null], ['s1', Mu, null], ['t0', null, 0], ['t1', null, Mv]].forEach(function (E) {
      var along = E[1] === null, segs = along ? Mu : Mv;
      for (var sgi = 0; sgi < segs; sgi++) {
        var n1 = along ? lat.node(sgi, E[2]) : lat.node(E[1], sgi), n2 = along ? lat.node(sgi + 1, E[2]) : lat.node(E[1], sgi + 1), L = Math.hypot(X[n2] - X[n1], Y[n2] - Y[n1]);
        for (q = 0; q < 2; q++) {
          var s = (1 + g2.p[q]) / 2, xq = X[n1] + s * (X[n2] - X[n1]), yq = Y[n1] + s * (Y[n2] - Y[n1]), bc = pr.bc(E[0], xq, yq);
          if (!bc || bc.q === undefined) continue;
          if (eq[n1] >= 0) f[eq[n1]] += (1 - s) * bc.q * L * g2.w[q] / 2;
          if (eq[n2] >= 0) f[eq[n2]] += s * bc.q * L * g2.w[q] / 2;
        }
      }
    });
    if (K.factor() >= 0) return { error: 'singular', md: md };
    var x = K.solve(f), T = new Float64Array(nn);
    for (i = 0; i < nn; i++) T[i] = eq[i] >= 0 ? x[eq[i]] : Tb[i];
    return { cfg: cfg, md: md, pr: pr, T: T, C: C, shp: shp, NQ: NQ, dX: dX, dY: dY, time: { total: now() - t0 } };
  }
  function femErrors(fm) {
    var ex = fm.pr.exact; if (!ex) return null;
    var g = N.GL[3], e1 = 0, d1 = 0, e0 = 0, d0 = 0, X = fm.md.X, Y = fm.md.Y, tmax = 0;
    fm.C.forEach(function (e) {
      for (var p1 = 0; p1 < 3; p1++) for (var p2 = 0; p2 < 3; p2++) {
        var det = fm.shp(e, g.p[p1], g.p[p2]), w = det * g.w[p1] * g.w[p2], xq = 0, yq = 0, T = 0, tx = 0, ty = 0;
        for (var t = 0; t < 4; t++) { xq += fm.NQ[t] * X[e[t]]; yq += fm.NQ[t] * Y[e[t]]; T += fm.NQ[t] * fm.T[e[t]]; tx += fm.dX[t] * fm.T[e[t]]; ty += fm.dY[t] * fm.T[e[t]]; }
        var ge = ex.g(xq, yq), Te = ex.T(xq, yq);
        e1 += w * ((tx - ge[0]) * (tx - ge[0]) + (ty - ge[1]) * (ty - ge[1])); d1 += w * (ge[0] * ge[0] + ge[1] * ge[1]);
        e0 += w * (T - Te) * (T - Te); d0 += w * Te * Te;
      }
    });
    for (var i = 0; i < fm.T.length; i++) tmax = Math.max(tmax, Math.abs(fm.T[i] - ex.T(X[i], Y[i])));
    return { energy: Math.sqrt(e1 / d1), l2: Math.sqrt(e0 / d0), tmax: tmax };
  }
  function femNode(fm, u, v) { var md = fm.md; return fm.T[md.lat.node(Math.round(md.ax.index(u)), Math.round(md.ay.index(v)))]; }

  function size(cfg) {
    var pr = problem(cfg), P = pr.patch, ax = new N.Axis(P.ku, pr.mu), ay = new N.Axis(P.kv, pr.mv), nodes = (ax.M + 1) * (ay.M + 1);
    return { nodes: nodes, Mu: ax.M, Mv: ay.M };
  }
  function now() { return N.now(); }

  root.RZNDM = { K: KCOND, problem: problem, setup: setup, run: run, cellOf: cellOf, sidePoints: sidePoints, evalAt: evalAt, evalParam: evalParam,
                 phiAt: phiAt, errors: errors, cellReport: cellReport, femRun: femRun, femErrors: femErrors, femNode: femNode, size: size };
})(typeof window !== 'undefined' ? window : globalThis);
