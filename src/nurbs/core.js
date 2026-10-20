/* ═══════════════════════════════════════════════════════════════
   NURBS geometry and parameter-space meshfree approximation — window.RZNURBS
   Shared by the N-RPIM and NDM explorers.
   · B-spline and NURBS basis functions (Cox–de Boor) and NURBS surface patches
     with first derivatives; the patches used in the papers and benchmarks.
   · An index space for the nodes: each knot span is divided into equal intervals,
     so nodes sit on a lattice with unit spacing and every knot line is a node line.
     Shape functions are built in this space (the "parent space" of the papers),
     then mapped to the NURBS parameter space and on to the physical space.
   · RPIM (radial basis functions with optional polynomial terms) and MLS shape
     functions with first derivatives; dense and banded LU solvers.
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  /* ── Gauss–Legendre rules on [−1, 1] ───────────────────────── */
  var GL = {
    1: { p: [0], w: [2] },
    2: { p: [-0.5773502691896257, 0.5773502691896257], w: [1, 1] },
    3: { p: [-0.7745966692414834, 0, 0.7745966692414834], w: [5 / 9, 8 / 9, 5 / 9] },
    4: { p: [-0.8611363115940526, -0.3399810435848563, 0.3399810435848563, 0.8611363115940526],
         w: [0.3478548451374538, 0.6521451548625461, 0.6521451548625461, 0.3478548451374538] },
    5: { p: [-0.9061798459386640, -0.5384693101056831, 0, 0.5384693101056831, 0.9061798459386640],
         w: [0.2369268850561891, 0.4786286704993665, 0.5688888888888889, 0.4786286704993665, 0.2369268850561891] },
    6: { p: [-0.9324695142031521, -0.6612093864662645, -0.2386191860831969, 0.2386191860831969, 0.6612093864662645, 0.9324695142031521],
         w: [0.1713244923791704, 0.3607615730481386, 0.4679139345726910, 0.4679139345726910, 0.3607615730481386, 0.1713244923791704] }
  };

  /* ── B-spline basis ─────────────────────────────────────────── */
  // knot span index i with U[i] ≤ u < U[i+1] (the last non-empty span for u = U[end]); nb = number of basis functions
  function findSpan(nb, p, u, U) {
    var n = nb - 1;
    if (u >= U[n + 1]) return n;
    if (u <= U[p]) return p;
    var lo = p, hi = n + 1, mid = (lo + hi) >> 1;
    while (u < U[mid] || u >= U[mid + 1]) { if (u < U[mid]) hi = mid; else lo = mid; mid = (lo + hi) >> 1; }
    return mid;
  }
  // span for a parameter that sits on an interior knot, taking the side: side < 0 gives the left limit
  function spanSide(nb, p, u, U, side) {
    var i = findSpan(nb, p, u, U);
    if (side < 0 && u > U[p] && u === U[i]) { while (i > p && U[i - 1] === u) i--; i--; }
    return i;
  }
  // N[j] = N_{i−p+j, p}(u) and D[j] = its derivative, j = 0..p (Cox–de Boor; 0/0 taken as 0)
  function basis(i, u, p, U, N, D) {
    var T = [[1]], j, k;
    for (k = 1; k <= p; k++) {
      var row = new Array(k + 1);
      for (j = 0; j <= k; j++) {
        var a = i - k + j, v = 0, d1 = U[a + k] - U[a], d2 = U[a + k + 1] - U[a + 1];
        if (j >= 1 && d1 > 0) v += (u - U[a]) / d1 * T[k - 1][j - 1];
        if (j <= k - 1 && d2 > 0) v += (U[a + k + 1] - u) / d2 * T[k - 1][j];
        row[j] = v;
      }
      T[k] = row;
    }
    for (j = 0; j <= p; j++) {
      N[j] = T[p][j];
      if (!D) continue;
      var b = i - p + j, dv = 0;
      if (p > 0) {
        var e1 = U[b + p] - U[b], e2 = U[b + p + 1] - U[b + 1];
        if (j >= 1 && e1 > 0) dv += p / e1 * T[p - 1][j - 1];
        if (j <= p - 1 && e2 > 0) dv -= p / e2 * T[p - 1][j];
      }
      D[j] = dv;
    }
  }
  function distinct(U) {
    var out = [];
    for (var i = 0; i < U.length; i++) if (!out.length || U[i] > out[out.length - 1] + 1e-14) out.push(U[i]);
    return out;
  }
  // interior knot values with their multiplicity (for continuity labels)
  function interiorKnots(U, p) {
    var d = distinct(U), out = [];
    for (var k = 1; k < d.length - 1; k++) {
      var m = 0; for (var i = 0; i < U.length; i++) if (Math.abs(U[i] - d[k]) < 1e-14) m++;
      out.push({ v: d[k], mult: m, cont: p - m });
    }
    return out;
  }

  /* ── NURBS surface patch ────────────────────────────────────── */
  // def: { p, q, U, V, cp: [[x, y, w], ...] } with control point (i, j) at index i·nv + j,
  // i along ξ (knot vector U), j along η (knot vector V)
  function Patch(def) {
    this.p = def.p; this.q = def.q; this.U = def.U; this.V = def.V;
    this.nu = def.U.length - def.p - 1; this.nv = def.V.length - def.q - 1;
    if (def.cp.length !== this.nu * this.nv) throw new Error('control net size');
    var cp = new Float64Array(3 * def.cp.length);
    def.cp.forEach(function (c, k) { cp[3 * k] = c[0]; cp[3 * k + 1] = c[1]; cp[3 * k + 2] = c.length > 2 ? c[2] : 1; });
    this.cp = cp;
    this.Nu = new Float64Array(this.p + 1); this.Du = new Float64Array(this.p + 1);
    this.Nv = new Float64Array(this.q + 1); this.Dv = new Float64Array(this.q + 1);
    this.ku = distinct(this.U); this.kv = distinct(this.V);
    // interior knots where the geometry is only C⁰ (multiplicity ≥ degree): the map has a kink there
    this.c0u = interiorKnots(this.U, this.p).filter(function (k) { return k.cont <= 0; }).map(function (k) { return k.v; });
    this.c0v = interiorKnots(this.V, this.q).filter(function (k) { return k.cont <= 0; }).map(function (k) { return k.v; });
  }
  // out = [x, y, x_ξ, y_ξ, x_η, y_η]; su, sv < 0 take the left limit on a knot
  Patch.prototype.eval = function (u, v, out, su, sv) {
    var p = this.p, q = this.q, nv = this.nv, cp = this.cp, a, b;
    var iu = spanSide(this.nu, p, u, this.U, su), iv = spanSide(nv, q, v, this.V, sv);
    basis(iu, u, p, this.U, this.Nu, this.Du); basis(iv, v, q, this.V, this.Nv, this.Dv);
    var W = 0, Wu = 0, Wv = 0, X = 0, Xu = 0, Xv = 0, Y = 0, Yu = 0, Yv = 0;
    for (a = 0; a <= p; a++) {
      var na = this.Nu[a], da = this.Du[a], base = (iu - p + a) * nv + iv - q;
      for (b = 0; b <= q; b++) {
        var k = 3 * (base + b), w = cp[k + 2], x = cp[k], y = cp[k + 1];
        var n0 = na * this.Nv[b] * w, nu = da * this.Nv[b] * w, nw = na * this.Dv[b] * w;
        W += n0; Wu += nu; Wv += nw; X += n0 * x; Xu += nu * x; Xv += nw * x; Y += n0 * y; Yu += nu * y; Yv += nw * y;
      }
    }
    out = out || new Float64Array(6);
    var x0 = X / W, y0 = Y / W;
    out[0] = x0; out[1] = y0;
    out[2] = (Xu - Wu * x0) / W; out[3] = (Yu - Wu * y0) / W;
    out[4] = (Xv - Wv * x0) / W; out[5] = (Yv - Wv * y0) / W;
    return out;
  };
  Patch.prototype.point = function (u, v) { var o = this.eval(u, v); return [o[0], o[1]]; };
  Patch.prototype.ctrl = function (i, j) { var k = 3 * (i * this.nv + j); return [this.cp[k], this.cp[k + 1], this.cp[k + 2]]; };
  // smallest Jacobian determinant on an n×n sample of every knot span (geometry check)
  Patch.prototype.minDet = function (n) {
    var mn = Infinity, o = new Float64Array(6), ku = this.ku, kv = this.kv;
    for (var su = 0; su < ku.length - 1; su++) for (var sv = 0; sv < kv.length - 1; sv++)
      for (var i = 0; i <= n; i++) for (var j = 0; j <= n; j++) {
        var u = ku[su] + (ku[su + 1] - ku[su]) * (0.001 + 0.998 * i / n), v = kv[sv] + (kv[sv + 1] - kv[sv]) * (0.001 + 0.998 * j / n);
        this.eval(u, v, o); mn = Math.min(mn, o[2] * o[5] - o[4] * o[3]);
      }
    return mn;
  };

  /* ── geometry library ───────────────────────────────────────── */
  var S2 = Math.SQRT2, WQ = (1 + 1 / S2) / 2;      // quarter circle in two quadratic spans: weight of the inner control points
  var GEOM = {
    // rectangle, bilinear (affine map)
    rect: function (x0, x1, y0, y1) {
      return new Patch({ p: 1, q: 1, U: [0, 0, 1, 1], V: [0, 0, 1, 1], cp: [[x0, y0], [x0, y1], [x1, y0], [x1, y1]] });
    },
    // square [0,1]² with a curved (non-affine) parametrization: straight edges, interior control point moved
    squareCurved: function (s) {
      var cp = [];
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
        var x = i / 2, y = j / 2;
        if (i === 1 && j === 1) { x += s; y += s; }
        cp.push([x, y]);
      }
      return new Patch({ p: 2, q: 2, U: [0, 0, 0, 1, 1, 1], V: [0, 0, 0, 1, 1, 1], cp: cp });
    },
    // quarter of a square plate [0, b]² with a circular hole of radius a at the origin. ξ radial (hole → outer edges),
    // η angular (θ = 0 → 90°). Two quadratic spans, each a 45° arc of the hole joined to one straight outer edge; the
    // repeated knot η = 0.5 puts a C⁰ line on the diagonal, so the corner (b, b) is a regular point of the map.
    // (A single C¹ pair of spans, as in Hughes et al. 2005, collapses the corner: det J = 0 there.)
    plateHole: function (a, b) {
      var c8 = Math.cos(Math.PI / 8), t8 = Math.tan(Math.PI / 8), s4 = Math.SQRT1_2, cp = [];
      var hole = [[a, 0, 1], [a, a * t8, c8], [a * s4, a * s4, 1], [a * t8, a, c8], [0, a, 1]];
      var out = [[b, 0, 1], [b, b / 2, 1], [b, b, 1], [b / 2, b, 1], [0, b, 1]];
      var rows = [hole, hole.map(function (h, k) { return [(h[0] + out[k][0]) / 2, (h[1] + out[k][1]) / 2, 1]; }), out];
      rows.forEach(function (r) { r.forEach(function (c) { cp.push(c); }); });
      return new Patch({ p: 2, q: 2, U: [0, 0, 0, 1, 1, 1], V: [0, 0, 0, 0.5, 0.5, 1, 1, 1], cp: cp });
    },
    // quarter-annular disc, inner radius ri, outer ro (Rasin et al. 2025, Table 3: ri = 0.3, ro = 0.6)
    annulus: function (ri, ro) {
      var cp = [];
      [ri, (ri + ro) / 2, ro].forEach(function (r) {
        cp.push([r, 0, 1], [r, r * (S2 - 1), WQ], [r * (S2 - 1), r, WQ], [0, r, 1]);
      });
      return new Patch({ p: 2, q: 2, U: [0, 0, 0, 1, 1, 1], V: [0, 0, 0, 0.5, 1, 1, 1], cp: cp });
    },
    // fan blade (Rasin et al. 2025, Table 1, from Luo et al. 2023). ξ runs from the hub arc to the tip
    // (five control points, C⁰ at ξ = 0.5), η across the blade (three control points).
    fanBlade: function () {
      var R = [
        [[0.0515, 0.0037, 1], [0.0937, 0.0014, 0.9821], [0.1320, -0.0163, 1], [0.1868, -0.0417, 0.4984], [0.1799, 0.0271, 1]],
        [[0.0470, 0.0651, 0.6421], [0.0883, 0.1015, 0.6796], [0.1296, 0.1378, 0.7170], [0.1466, 0.1300, 0.8157], [0.1636, 0.1222, 0.9143]],
        [[-0.0127, 0.0500, 1], [-0.0207, 0.0956, 0.9882], [-0.0085, 0.1478, 1], [0.0305, 0.2048, 0.6698], [0.0939, 0.1661, 1]]
      ], cp = [];
      for (var i = 0; i < 5; i++) for (var j = 0; j < 3; j++) cp.push(R[j][i]);
      return new Patch({ p: 2, q: 2, U: [0, 0, 0, 0.5, 0.5, 1, 1, 1], V: [0, 0, 0, 1, 1, 1], cp: cp });
    },
    // web post of a cellular beam between two half openings (Mokhtaram et al. 2022, Table 1):
    // width s, depth d, opening radius r; ξ along x, η along y (C⁰ at η = 0.2, 0.5, 0.8)
    unitCell: function (s, d, r) {
      var h = 1 / S2, rows = [
        [[0, 0], [s / 2, 0], [s, 0]],
        [[0, d / 4 - r / 2], [s / 2, d / 20], [s, d / 4 - r / 2]],
        [[0, d / 2 - r], [s / 2, d / 10], [s, d / 2 - r]],
        [[r, d / 2 - r, h], [s / 2, d / 2.5], [s - r, d / 2 - r, h]],
        [[r, d / 2], [s / 2, d / 2], [s - r, d / 2]],
        [[r, d / 2 + r, h], [s / 2, d - d / 2.5], [s - r, d / 2 + r, h]],
        [[0, d / 2 + r], [s / 2, d - d / 10], [s, d / 2 + r]],
        [[0, 3 * d / 4 + r / 2], [s / 2, d - d / 20], [s, 3 * d / 4 + r / 2]],
        [[0, d], [s / 2, d], [s, d]]
      ], cp = [];
      for (var i = 0; i < 3; i++) for (var j = 0; j < 9; j++) cp.push(rows[j][i]);
      return new Patch({ p: 2, q: 2, U: [0, 0, 0, 1, 1, 1], V: [0, 0, 0, 0.2, 0.2, 0.5, 0.5, 0.8, 0.8, 1, 1, 1], cp: cp });
    }
  };

  /* ── index space ────────────────────────────────────────────── */
  // knots: distinct knot values κ₀ < … < κ_S; m: intervals per span (number or array).
  // Index coordinate a ∈ [0, M] maps linearly onto each span; nodes of the regular lattice sit at integers.
  // c0: knot values where the geometry is only C⁰; the approximation does not reach across them
  function Axis(knots, m, c0) {
    var S = knots.length - 1, A = [0], ms = [];
    for (var s = 0; s < S; s++) { var k = Math.max(1, Math.round(Array.isArray(m) ? m[s] : m)); ms.push(k); A.push(A[s] + k); }
    this.knots = knots; this.m = ms; this.A = A; this.M = A[S]; this.S = S;
    this.c0 = [];
    for (s = 1; s < S; s++) if ((c0 || []).some(function (v) { return Math.abs(v - knots[s]) < 1e-12; })) this.c0.push(A[s]);
  }
  // index range [lo, hi] of the C⁰-bounded segment containing a (side < 0: the segment on the left of a break)
  Axis.prototype.segOf = function (a, side) {
    var lo = 0, hi = this.M, c = this.c0;
    for (var k = 0; k < c.length; k++) {
      if (a < c[k] - 1e-9 || (Math.abs(a - c[k]) <= 1e-9 && side < 0)) { hi = c[k]; break; }
      lo = c[k];
    }
    return [lo, hi];
  };
  Axis.prototype.isBreak = function (i) { return this.c0.indexOf(i) >= 0; };
  // span containing index a; side > 0 prefers the span on the right at a span boundary, side < 0 the left
  Axis.prototype.span = function (a, side) {
    var A = this.A, S = this.S;
    for (var s = 0; s < S; s++) {
      if (a < A[s + 1] - 1e-12) return s;
      if (Math.abs(a - A[s + 1]) <= 1e-12) return (side > 0 && s < S - 1) ? s + 1 : s;
    }
    return S - 1;
  };
  Axis.prototype.param = function (a, side) {
    var s = this.span(a, side);
    return this.knots[s] + (a - this.A[s]) / this.m[s] * (this.knots[s + 1] - this.knots[s]);
  };
  Axis.prototype.dparam = function (a, side) { var s = this.span(a, side); return (this.knots[s + 1] - this.knots[s]) / this.m[s]; };
  Axis.prototype.index = function (u) {
    var K = this.knots, S = this.S;
    for (var s = 0; s < S; s++) if (u <= K[s + 1] + 1e-14 || s === S - 1) return this.A[s] + (u - K[s]) / (K[s + 1] - K[s]) * this.m[s];
    return this.M;
  };
  // index positions of the knot lines (span boundaries), interior only
  Axis.prototype.knotIdx = function () { return this.A.slice(1, -1); };

  /* ── deterministic random numbers ───────────────────────────── */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ── nodes on the index lattice ─────────────────────────────── */
  // opt: { distort (≤ 0.45), seed, keep(i, j) → true to leave a node unperturbed }
  // Interior nodes are moved randomly by up to ±distort in each index direction; boundary nodes stay on the lattice.
  function Lattice(ax, ay, opt) {
    opt = opt || {};
    var Mu = ax.M, Mv = ay.M, I = Mu + 1, J = Mv + 1, nn = I * J, rnd = mulberry32(opt.seed || 1), dist = opt.distort || 0, i, j;
    var id = new Int32Array(nn), A = new Float64Array(nn), B = new Float64Array(nn), LI = new Int32Array(nn), LJ = new Int32Array(nn), n = 0;
    var jFast = J <= I;            // number fastest along the shorter direction: narrower band
    function put(ii, jj) { id[ii * J + jj] = n; LI[n] = ii; LJ[n] = jj; n++; }
    if (jFast) { for (i = 0; i < I; i++) for (j = 0; j < J; j++) put(i, j); }
    else { for (j = 0; j < J; j++) for (i = 0; i < I; i++) put(i, j); }
    for (i = 0; i < I; i++) for (j = 0; j < J; j++) {
      var k = id[i * J + j], a = i, b = j;
      if (dist > 0 && i > 0 && i < Mu && j > 0 && j < Mv && !(opt.keep && opt.keep(i, j))) {
        var da = (2 * rnd() - 1) * dist, db = (2 * rnd() - 1) * dist;
        // nodes on a C⁰ knot line stay on it (they are shared by the segments on both sides)
        if (!ax.isBreak(i)) a += da; if (!ay.isBreak(j)) b += db;
      }
      A[k] = a; B[k] = b;
    }
    this.ax = ax; this.ay = ay; this.Mu = Mu; this.Mv = Mv; this.I = I; this.J = J; this.nn = nn; this.dist = dist;
    this.id = id; this.A = A; this.B = B; this.LI = LI; this.LJ = LJ;
  }
  Lattice.prototype.node = function (i, j) { return this.id[i * this.J + j]; };
  // boundary flags: which lattice edge a node lies on ('s0' ξ = 0, 's1' ξ = 1, 't0' η = 0, 't1' η = 1)
  Lattice.prototype.edges = function (k) {
    var out = [], i = this.LI[k], j = this.LJ[k];
    if (i === 0) out.push('s0'); if (i === this.Mu) out.push('s1'); if (j === 0) out.push('t0'); if (j === this.Mv) out.push('t1');
    return out;
  };

  /* ── geometry map: index (a, b) → parameter (ξ, η) → physical (x, y) ── */
  function Map(patch, ax, ay) { this.patch = patch; this.ax = ax; this.ay = ay; this.g = new Float64Array(6); }
  // out: [x, y, x_a, y_a, x_b, y_b, det ∂(x,y)/∂(a,b), ξ, η, dξ/da, dη/db, det ∂(x,y)/∂(ξ,η)]
  Map.prototype.at = function (a, b, out, sa, sb) {
    var ax = this.ax, ay = this.ay, u = ax.param(a, sa), v = ay.param(b, sb), du = ax.dparam(a, sa), dv = ay.dparam(b, sb), g = this.g;
    this.patch.eval(u, v, g, sa, sb);
    out = out || new Float64Array(12);
    out[0] = g[0]; out[1] = g[1];
    out[2] = g[2] * du; out[3] = g[3] * du; out[4] = g[4] * dv; out[5] = g[5] * dv;
    out[6] = out[2] * out[5] - out[4] * out[3];
    out[7] = u; out[8] = v; out[9] = du; out[10] = dv; out[11] = g[2] * g[5] - g[4] * g[3];
    return out;
  };

  /* ── dense LU with partial pivoting (row-major n×n, in place) ── */
  function luFactor(M, n, piv) {
    var i, j, k, amax = 0;
    for (i = 0; i < n * n; i++) { var v0 = Math.abs(M[i]); if (v0 > amax) amax = v0; }
    for (k = 0; k < n; k++) {
      var p = k, best = Math.abs(M[k * n + k]);
      for (i = k + 1; i < n; i++) { var v = Math.abs(M[i * n + k]); if (v > best) { best = v; p = i; } }
      if (!(best > 1e-13 * amax)) return false;
      piv[k] = p;
      if (p !== k) for (j = 0; j < n; j++) { var t = M[k * n + j]; M[k * n + j] = M[p * n + j]; M[p * n + j] = t; }
      var d = M[k * n + k];
      for (i = k + 1; i < n; i++) {
        var f = M[i * n + k] / d; if (!f) { M[i * n + k] = 0; continue; }
        M[i * n + k] = f;
        for (j = k + 1; j < n; j++) M[i * n + j] -= f * M[k * n + j];
      }
    }
    return true;
  }
  function luSolve(M, n, piv, b) {      // b overwritten with the solution
    var i, j;
    for (i = 0; i < n; i++) { var p = piv[i]; if (p !== i) { var t = b[i]; b[i] = b[p]; b[p] = t; } }
    for (i = 1; i < n; i++) { var s = b[i]; for (j = 0; j < i; j++) s -= M[i * n + j] * b[j]; b[i] = s; }
    for (i = n - 1; i >= 0; i--) { var s2 = b[i]; for (j = i + 1; j < n; j++) s2 -= M[i * n + j] * b[j]; b[i] = s2 / M[i * n + i]; }
    return b;
  }
  // Cholesky of a small SPD matrix (row-major); false if not positive definite
  function chol(A, m, L) {
    var scale = 0, i, j, k;
    for (i = 0; i < m; i++) scale = Math.max(scale, A[i * m + i]);
    for (j = 0; j < m; j++) {
      var s = A[j * m + j];
      for (k = 0; k < j; k++) s -= L[j * m + k] * L[j * m + k];
      if (!(s > 1e-12 * scale)) return false;
      L[j * m + j] = Math.sqrt(s);
      for (i = j + 1; i < m; i++) { var v = A[i * m + j]; for (k = 0; k < j; k++) v -= L[i * m + k] * L[j * m + k]; L[i * m + j] = v / L[j * m + j]; }
    }
    return true;
  }
  function cholSolve(L, m, b, y) {
    var i, k;
    for (i = 0; i < m; i++) { var s = b[i]; for (k = 0; k < i; k++) s -= L[i * m + k] * y[k]; y[i] = s / L[i * m + i]; }
    for (i = m - 1; i >= 0; i--) { var s2 = y[i]; for (k = i + 1; k < m; k++) s2 -= L[k * m + i] * y[k]; y[i] = s2 / L[i * m + i]; }
    return y;
  }

  /* ── banded LU with partial pivoting (non-symmetric systems) ── */
  // LAPACK band storage: entry (i, j) at a[kv + i − j + j·ld], kv = kl + ku, ld = 2kl + ku + 1
  function Band(n, kl, ku) {
    this.n = n; this.kl = kl; this.ku = ku; this.kv = kl + ku; this.ld = 2 * kl + ku + 1;
    this.a = new Float64Array(this.ld * n); this.piv = new Int32Array(n);
  }
  Band.prototype.add = function (i, j, v) { this.a[this.kv + i - j + j * this.ld] += v; };
  Band.prototype.get = function (i, j) { var d = i - j; return (d > this.kl || d < -this.ku) ? 0 : this.a[this.kv + d + j * this.ld]; };
  Band.prototype.factor = function () {          // −1 on success, else the failing column
    var n = this.n, kl = this.kl, ku = this.ku, kv = this.kv, ld = this.ld, a = this.a, piv = this.piv, ju = 0, j, t, c, amax = 0;
    for (t = 0; t < a.length; t++) { var v0 = Math.abs(a[t]); if (v0 > amax) amax = v0; }
    for (j = 0; j < n; j++) {
      var km = Math.min(kl, n - 1 - j), cj = kv + j * ld, jp = 0, best = Math.abs(a[cj]);
      for (t = 1; t <= km; t++) { var v = Math.abs(a[cj + t]); if (v > best) { best = v; jp = t; } }
      piv[j] = j + jp;
      if (!(best > 1e-14 * amax)) return j;
      ju = Math.max(ju, Math.min(j + ku + jp, n - 1));
      if (jp) for (c = j; c <= ju; c++) { var p1 = kv + j - c + c * ld, tmp = a[p1]; a[p1] = a[p1 + jp]; a[p1 + jp] = tmp; }
      var d = a[cj];
      for (t = 1; t <= km; t++) a[cj + t] /= d;
      for (c = j + 1; c <= ju; c++) {
        var base = kv + j - c + c * ld, f = a[base]; if (f === 0) continue;
        for (t = 1; t <= km; t++) a[base + t] -= a[cj + t] * f;
      }
    }
    return -1;
  };
  Band.prototype.solve = function (b) {
    var n = this.n, kl = this.kl, kv = this.kv, ld = this.ld, a = this.a, piv = this.piv, x = Float64Array.from(b), j, t, i;
    for (j = 0; j < n; j++) {
      var p = piv[j]; if (p !== j) { var tmp = x[j]; x[j] = x[p]; x[p] = tmp; }
      var km = Math.min(kl, n - 1 - j), xj = x[j], cj = kv + j * ld;
      if (xj) for (t = 1; t <= km; t++) x[j + t] -= a[cj + t] * xj;
    }
    for (j = n - 1; j >= 0; j--) {
      x[j] /= a[kv + j * ld];
      var xk = x[j]; if (!xk) continue;
      for (i = Math.max(0, j - kv); i < j; i++) x[i] -= a[kv + i - j + j * ld] * xk;
    }
    return x;
  };

  /* ── meshfree shape functions in the index space ─────────────── */
  // opt: { kind: 'rpim' | 'mls', rbf: 'mq' | 'tps' | 'exp', m: 0 | 3 | 6 (polynomial terms), d: support radius
  //        (index units = nodal spacings), mq: {q, ac}, tps: {eta}, exp: {ac, dc}, c: MLS weight shape (r/d units) }
  // Defaults follow the papers: MQ q = 2.1, αc = 0.1, dc = 1; TPS η = 4.0001; Gaussian αc = 0.8, dc = 2; MLS weight exp(−(r/c)²).
  var NMAX = 400;
  function Approx(lat, opt) {
    this.lat = lat; this.kind = opt.kind || 'rpim'; this.rbf = opt.rbf || 'mq'; this.m = opt.m == null ? 3 : opt.m; this.d = opt.d || 2.5;
    this.mq = opt.mq || { q: 2.1, ac: 0.1 }; this.tps = opt.tps || { eta: 4.0001 }; this.exp = opt.exp || { ac: 0.8, dc: 2 };
    this.c = opt.c || 0.3;
    var N = NMAX, M = N + 6;
    this.idx = new Int32Array(N); this.phi = new Float64Array(N); this.da = new Float64Array(N); this.db = new Float64Array(N);
    this.ra = new Float64Array(N); this.rb = new Float64Array(N); this.w = new Float64Array(N); this.wa = new Float64Array(N); this.wb = new Float64Array(N);
    this.G = new Float64Array(M * M); this.piv = new Int32Array(M); this.r0 = new Float64Array(M); this.r1 = new Float64Array(M); this.r2 = new Float64Array(M);
    this.P = new Float64Array(N * 6); this.A = new Float64Array(36); this.Aa = new Float64Array(36); this.Ab = new Float64Array(36); this.L = new Float64Array(36);
    this.g0 = new Float64Array(6); this.g1 = new Float64Array(6); this.g2 = new Float64Array(6); this.t0 = new Float64Array(6);
    this.cidx = new Int32Array(N); this.cpa = new Float64Array(N); this.cpb = new Float64Array(N); this.pk = new Float64Array(6); this.tmp2 = [0, 0];
    this.cKey = null; this.cn = -1; this.n = 0; this.fail = null;
  }
  // nodes within the support of (a, b); returns their count
  // supports never cross a C⁰ knot line: sa, sb choose the segment for a point that lies on one
  Approx.prototype.gather = function (a, b, d, sa, sb) {
    var lat = this.lat, pad = d + lat.dist + 1e-9, su = lat.ax.segOf(a, sa), sv = lat.ay.segOf(b, sb);
    var i0 = Math.max(su[0], Math.ceil(a - pad)), i1 = Math.min(su[1], Math.floor(a + pad));
    var j0 = Math.max(sv[0], Math.ceil(b - pad)), j1 = Math.min(sv[1], Math.floor(b + pad)), n = 0, d2 = d * d, J = lat.J;
    for (var i = i0; i <= i1; i++) for (var j = j0; j <= j1; j++) {
      var k = lat.id[i * J + j], ra = lat.A[k] - a, rb = lat.B[k] - b;
      if (ra * ra + rb * rb >= d2) continue;
      if (n >= NMAX) return -1;
      this.idx[n] = k; this.ra[n] = ra; this.rb[n] = rb; n++;
    }
    return n;
  };
  // R(r) and g = R'(r)/r as functions of r²
  Approx.prototype.rbfAt = function (r2, out) {
    if (this.rbf === 'mq') { var c2 = this.mq.ac * this.mq.ac, q = this.mq.q, s = r2 + c2, sq = Math.pow(s, q - 1); out[0] = sq * s; out[1] = 2 * q * sq; }
    else if (this.rbf === 'tps') { var e = this.tps.eta; if (r2 <= 0) { out[0] = 0; out[1] = 0; } else { var pw = Math.pow(r2, e / 2 - 1); out[0] = pw * r2; out[1] = e * pw; } }
    else { var k = this.exp.ac / (this.exp.dc * this.exp.dc), v = Math.exp(-k * r2); out[0] = v; out[1] = -2 * k * v; }
  };
  // Shape functions at index point (a, b). Fills idx, phi (and da, db = ∂φ/∂a, ∂φ/∂b when deriv). Returns n, or −1 on failure.
  Approx.prototype.at = function (a, b, deriv, sa, sb) {
    var n = this.gather(a, b, this.d, sa, sb);
    this.n = n; this.fail = null;
    if (n < 0) { this.fail = 'many'; return -1; }
    return this.kind === 'mls' ? this.mls(n, deriv) : this.rpim(n, deriv);
  };
  Approx.prototype.rpim = function (n, deriv) {
    var m = this.m, M = n + m, G = this.G, ra = this.ra, rb = this.rb, k, l, tmp = [0, 0];
    if (n < Math.max(1, m)) { this.fail = 'few'; return -1; }
    for (k = 0; k < n; k++) {
      for (l = k; l < n; l++) {
        var dx = ra[k] - ra[l], dy = rb[k] - rb[l]; this.rbfAt(dx * dx + dy * dy, tmp);
        G[k * M + l] = tmp[0]; G[l * M + k] = tmp[0];
      }
      // polynomial terms centred at the evaluation point: [1, Δa, Δb, Δa², ΔaΔb, Δb²]
      if (m) {
        var pk = [1, ra[k], rb[k], ra[k] * ra[k], ra[k] * rb[k], rb[k] * rb[k]];
        for (l = 0; l < m; l++) { G[k * M + n + l] = pk[l]; G[(n + l) * M + k] = pk[l]; }
      }
    }
    for (k = n; k < M; k++) for (l = n; l < M; l++) G[k * M + l] = 0;
    if (!luFactor(G, M, this.piv)) { this.fail = 'singular'; return -1; }
    var r0 = this.r0, r1 = this.r1, r2 = this.r2;
    for (k = 0; k < n; k++) {
      this.rbfAt(ra[k] * ra[k] + rb[k] * rb[k], tmp);
      r0[k] = tmp[0];
      // ∂R_k/∂a at the evaluation point x: R'(r)(a_x − a_k)/r = −g·Δa
      if (deriv) { r1[k] = -tmp[1] * ra[k]; r2[k] = -tmp[1] * rb[k]; }
    }
    for (l = 0; l < m; l++) { r0[n + l] = l === 0 ? 1 : 0; if (deriv) { r1[n + l] = l === 1 ? 1 : 0; r2[n + l] = l === 2 ? 1 : 0; } }
    luSolve(G, M, this.piv, r0);
    if (deriv) { luSolve(G, M, this.piv, r1); luSolve(G, M, this.piv, r2); }
    for (k = 0; k < n; k++) { this.phi[k] = r0[k]; if (deriv) { this.da[k] = r1[k]; this.db[k] = r2[k]; } }
    return n;
  };
  Approx.prototype.mls = function (n, deriv) {
    var m = this.m || 6, P = this.P, A = this.A, Aa = this.Aa, Ab = this.Ab, ra = this.ra, rb = this.rb, k, i, j;
    if (n < m) { this.fail = 'few'; return -1; }
    var cd = this.c * this.d, s2 = 1 / (cd * cd);
    A.fill(0); if (deriv) { Aa.fill(0); Ab.fill(0); }
    for (k = 0; k < n; k++) {
      var r2 = ra[k] * ra[k] + rb[k] * rb[k], w = Math.exp(-r2 * s2);
      this.w[k] = w;
      // ∂w/∂a at the evaluation point: w·(−2 s2)(a_x − a_k) = 2 s2 w Δa
      this.wa[k] = 2 * s2 * w * ra[k]; this.wb[k] = 2 * s2 * w * rb[k];
      var o = k * 6;
      P[o] = 1; P[o + 1] = ra[k]; P[o + 2] = rb[k]; P[o + 3] = ra[k] * ra[k]; P[o + 4] = ra[k] * rb[k]; P[o + 5] = rb[k] * rb[k];
      for (i = 0; i < m; i++) for (j = i; j < m; j++) {
        var pp = P[o + i] * P[o + j];
        A[i * m + j] += w * pp; if (deriv) { Aa[i * m + j] += this.wa[k] * pp; Ab[i * m + j] += this.wb[k] * pp; }
      }
    }
    for (i = 0; i < m; i++) for (j = 0; j < i; j++) { A[i * m + j] = A[j * m + i]; Aa[i * m + j] = Aa[j * m + i]; Ab[i * m + j] = Ab[j * m + i]; }
    if (!chol(A, m, this.L)) { this.fail = 'singular'; return -1; }
    var e = this.t0; e.fill(0); e[0] = 1;
    var g = cholSolve(this.L, m, e, this.g0), ga = null, gb = null;
    if (deriv) {
      var ta = new Float64Array(m), tb = new Float64Array(m);
      ta[1] = 1; tb[2] = 1;
      for (i = 0; i < m; i++) for (j = 0; j < m; j++) { ta[i] -= Aa[i * m + j] * g[j]; tb[i] -= Ab[i * m + j] * g[j]; }
      ga = cholSolve(this.L, m, ta, this.g1); gb = cholSolve(this.L, m, tb, this.g2);
    }
    for (k = 0; k < n; k++) {
      var o2 = k * 6, gp = 0, gap = 0, gbp = 0;
      for (i = 0; i < m; i++) { var pv = P[o2 + i]; gp += g[i] * pv; if (deriv) { gap += ga[i] * pv; gbp += gb[i] * pv; } }
      this.phi[k] = this.w[k] * gp;
      if (deriv) { this.da[k] = this.wa[k] * gp + this.w[k] * gap; this.db[k] = this.wb[k] * gp + this.w[k] * gbp; }
    }
    return n;
  };
  // RPIM with one support per integration cell: the moment matrix G is built and factorised once for the
  // cell (nodes within d of the cell centre); inCell() then evaluates the shape functions anywhere in that cell.
  // Within a cell the shape functions are smooth; they can jump across cell edges (but not at the nodes).
  Approx.prototype.cell = function (ca, cb) {
    if (this.cKey === ca + ',' + cb) return this.cn;
    this.cKey = ca + ',' + cb; this.fail = null;
    var n = this.gather(ca, cb, this.d), m = this.m, M = n + m, G = this.G, ra = this.ra, rb = this.rb, k, l, tmp = this.tmp2;
    this.cn = n; this.cA = ca; this.cB = cb;
    if (n < 0) { this.fail = 'many'; return (this.cn = -1); }
    if (n < Math.max(1, m)) { this.fail = 'few'; return (this.cn = -1); }
    for (k = 0; k < n; k++) { this.cidx[k] = this.idx[k]; this.cpa[k] = ra[k]; this.cpb[k] = rb[k]; }
    for (k = 0; k < n; k++) {
      for (l = k; l < n; l++) {
        var dx = ra[k] - ra[l], dy = rb[k] - rb[l]; this.rbfAt(dx * dx + dy * dy, tmp);
        G[k * M + l] = tmp[0]; G[l * M + k] = tmp[0];
      }
      if (m) {
        var x = ra[k], y = rb[k], pk = this.pk; pk[0] = 1; pk[1] = x; pk[2] = y; pk[3] = x * x; pk[4] = x * y; pk[5] = y * y;
        for (l = 0; l < m; l++) { G[k * M + n + l] = pk[l]; G[(n + l) * M + k] = pk[l]; }
      }
    }
    for (k = n; k < M; k++) for (l = n; l < M; l++) G[k * M + l] = 0;
    if (!luFactor(G, M, this.piv)) { this.fail = 'singular'; return (this.cn = -1); }
    return n;
  };
  Approx.prototype.inCell = function (a, b, deriv) {
    var n = this.cn, m = this.m, M = n + m, k, tmp = this.tmp2, r0 = this.r0, r1 = this.r1, r2 = this.r2;
    if (n < 0) return -1;
    var da = a - this.cA, db = b - this.cB;      // offset of the point from the cell centre (polynomial origin)
    for (k = 0; k < n; k++) {
      var dx = this.cpa[k] - da, dy = this.cpb[k] - db;   // node − point
      this.rbfAt(dx * dx + dy * dy, tmp);
      r0[k] = tmp[0]; if (deriv) { r1[k] = -tmp[1] * dx; r2[k] = -tmp[1] * dy; }
    }
    if (m) {
      r0[n] = 1; r0[n + 1] = da; r0[n + 2] = db;
      if (m > 3) { r0[n + 3] = da * da; r0[n + 4] = da * db; r0[n + 5] = db * db; }
      if (deriv) {
        r1[n] = 0; r1[n + 1] = 1; r1[n + 2] = 0; r2[n] = 0; r2[n + 1] = 0; r2[n + 2] = 1;
        if (m > 3) { r1[n + 3] = 2 * da; r1[n + 4] = db; r1[n + 5] = 0; r2[n + 3] = 0; r2[n + 4] = da; r2[n + 5] = 2 * db; }
      }
    }
    luSolve(this.G, M, this.piv, r0);
    if (deriv) { luSolve(this.G, M, this.piv, r1); luSolve(this.G, M, this.piv, r2); }
    for (k = 0; k < n; k++) { this.idx[k] = this.cidx[k]; this.phi[k] = r0[k]; if (deriv) { this.da[k] = r1[k]; this.db[k] = r2[k]; } }
    this.n = n;
    return n;
  };
  // value of φ_I at (a, b): 0 outside its support, NaN where the approximation fails
  Approx.prototype.phiOf = function (I, a, b, sa, sb) {
    var n = this.at(a, b, false, sa, sb); if (n < 0) return NaN;
    for (var k = 0; k < n; k++) if (this.idx[k] === I) return this.phi[k];
    return 0;
  };

  function now() { return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now(); }

  root.RZNURBS = {
    GL: GL, findSpan: findSpan, basis: basis, distinct: distinct, interiorKnots: interiorKnots, Patch: Patch, GEOM: GEOM,
    Axis: Axis, Lattice: Lattice, Map: Map, Approx: Approx, Band: Band, luFactor: luFactor, luSolve: luSolve,
    chol: chol, cholSolve: cholSolve, mulberry32: mulberry32, now: now
  };
})(typeof window !== 'undefined' ? window : globalThis);
