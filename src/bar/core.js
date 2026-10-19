/* ═══════════════════════════════════════════════════════════════
   1D bar FEM core — window.RZBAR
   Axially loaded bar, fixed at x = 0, free at x = L. Tip load P,
   uniform distributed load q, linearly tapered area A(x).
   Linear (2-node) or quadratic (3-node) elements, exact solution.
   SI units: N, m, Pa.
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  var G3 = { p: [-Math.sqrt(0.6), 0, Math.sqrt(0.6)], w: [5 / 9, 8 / 9, 5 / 9] };

  function area(c, x) { return c.A0 + (c.A1 - c.A0) * x / c.L; }

  // exact axial force, stress and displacement
  function exact(c) {
    var k = (c.A1 - c.A0) / c.L, E = c.E, P = c.P, q = c.q, L = c.L, A0 = c.A0;
    function N(x) { return P + q * (L - x); }
    function u(x) {
      if (Math.abs(k) * L < 1e-9 * A0) return (P * x + q * (L * x - x * x / 2)) / (E * A0);
      var cc = P + q * L;
      return ((cc + q * A0 / k) / k * Math.log((A0 + k * x) / A0) - q / k * x) / E;
    }
    return { N: N, u: u, s: function (x) { return N(x) / area(c, x); } };
  }

  // shape functions on the reference element ξ ∈ [−1, 1]
  function shp(order, xi) {
    if (order === 1) return { N: [(1 - xi) / 2, (1 + xi) / 2], dN: [-0.5, 0.5] };
    return { N: [xi * (xi - 1) / 2, 1 - xi * xi, xi * (xi + 1) / 2], dN: [xi - 0.5, -2 * xi, xi + 0.5] };
  }

  // c = { n, order (1|2), E, A0, A1, L, P, q }
  function run(c) {
    var n = c.n, o = c.order === 2 ? 2 : 1, nn = o * n + 1, Le = c.L / n, i, j, e, a, b;
    var x = new Float64Array(nn); for (i = 0; i < nn; i++) x[i] = c.L * i / (nn - 1);
    var K = []; for (i = 0; i < nn; i++) K.push(new Float64Array(nn));
    var f = new Float64Array(nn), ke = [];
    for (e = 0; e < n; e++) {
      var dofs = []; for (a = 0; a <= o; a++) dofs.push(o * e + a);
      var x0 = x[dofs[0]], kE = [];
      for (a = 0; a <= o; a++) kE.push(new Float64Array(o + 1));
      for (var g = 0; g < 3; g++) {
        var xi = G3.p[g], s = shp(o, xi), xg = x0 + (xi + 1) * Le / 2, w = G3.w[g] * Le / 2, EA = c.E * area(c, xg);
        for (a = 0; a <= o; a++) {
          f[dofs[a]] += s.N[a] * c.q * w;
          for (b = 0; b <= o; b++) kE[a][b] += (s.dN[a] * 2 / Le) * EA * (s.dN[b] * 2 / Le) * w;
        }
      }
      for (a = 0; a <= o; a++) for (b = 0; b <= o; b++) K[dofs[a]][dofs[b]] += kE[a][b];
      ke.push(kE);
    }
    f[nn - 1] += c.P;
    // fixed at node 0: solve the reduced system (symmetric positive definite) by Gaussian elimination
    var m = nn - 1, M = [], r = new Float64Array(m);
    for (i = 0; i < m; i++) { M.push(Float64Array.from(K[i + 1].subarray(1))); r[i] = f[i + 1]; }
    for (j = 0; j < m; j++) {
      for (i = j + 1; i < m; i++) {
        var fct = M[i][j] / M[j][j]; if (!fct) continue;
        for (var k = j; k < m; k++) M[i][k] -= fct * M[j][k];
        r[i] -= fct * r[j];
      }
    }
    var u = new Float64Array(nn);
    for (i = m - 1; i >= 0; i--) { var sm = r[i]; for (k = i + 1; k < m; k++) sm -= M[i][k] * u[k + 1]; u[i + 1] = sm / M[i][i]; }
    var R = -f[0]; for (j = 0; j < nn; j++) R += K[0][j] * u[j];
    return { c: c, o: o, n: n, nn: nn, Le: Le, x: x, u: u, K: K, f: f, ke: ke, reaction: R, ex: exact(c) };
  }

  // FE displacement and stress inside element e at ξ
  function fieldAt(md, e, xi) {
    var o = md.o, s = shp(o, xi), uu = 0, du = 0;
    for (var a = 0; a <= o; a++) { var d = o * e + a; uu += s.N[a] * md.u[d]; du += s.dN[a] * 2 / md.Le * md.u[d]; }
    return { x: md.x[o * e] + (xi + 1) * md.Le / 2, u: uu, s: md.c.E * du };
  }
  // relative error in the energy norm: ∫ (N − Nʰ)² / EA dx  /  ∫ N² / EA dx
  function energyError(md) {
    var num = 0, den = 0, g5 = [-0.9061798459386640, -0.5384693101056831, 0, 0.5384693101056831, 0.9061798459386640],
        w5 = [0.2369268850561891, 0.4786286704993665, 0.5688888888888889, 0.4786286704993665, 0.2369268850561891];
    for (var e = 0; e < md.n; e++) for (var g = 0; g < 5; g++) {
      var p = fieldAt(md, e, g5[g]), A = area(md.c, p.x), EA = md.c.E * A, Nh = p.s * A, N = md.ex.N(p.x), w = w5[g] * md.Le / 2;
      num += (N - Nh) * (N - Nh) / EA * w; den += N * N / EA * w;
    }
    return den > 0 ? Math.sqrt(num / den) : 0;
  }

  root.RZBAR = { run: run, fieldAt: fieldAt, energyError: energyError, exact: exact, area: area };
})(typeof window !== 'undefined' ? window : globalThis);
