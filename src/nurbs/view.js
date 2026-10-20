/* ═══════════════════════════════════════════════════════════════
   Drawing helpers shared by the N-RPIM and NDM explorers — RZNURBS.view
   Sample grids over the integration cells, the physical and parameter-space
   frames, knot lines, the control net and outlines.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var N = window.RZNURBS, V = N.view = {};

  // (SUB+1)² samples in every lattice cell, in index coordinates, with the side hints that keep
  // points on a C⁰ knot line inside their own cell. Returns { n, np, A, B, SA, SB, CI, CJ, U, W, X, Y, J }.
  V.samples = function (md, SUB) {
    var lat = md.lat, Mu = lat.Mu, Mv = lat.Mv, S1 = SUB + 1, np = S1 * S1, n = Mu * Mv * np, o = new Float64Array(12);
    var A = new Float64Array(n), B = new Float64Array(n), SA = new Int8Array(n), SB = new Int8Array(n), CI = new Int32Array(n), CJ = new Int32Array(n);
    var U = new Float64Array(n), W = new Float64Array(n), X = new Float64Array(n), Y = new Float64Array(n), J = new Float64Array(n);
    for (var i = 0; i < Mu; i++) for (var j = 0; j < Mv; j++) {
      var base = (i * Mv + j) * np;
      for (var q = 0; q < S1; q++) for (var p = 0; p < S1; p++) {
        var k = base + q * S1 + p;
        A[k] = i + p / SUB; B[k] = j + q / SUB; SA[k] = p === 0 ? 1 : p === SUB ? -1 : 0; SB[k] = q === 0 ? 1 : q === SUB ? -1 : 0;
        CI[k] = i; CJ[k] = j;
        md.map.at(A[k], B[k], o, SA[k], SB[k]);
        X[k] = o[0]; Y[k] = o[1]; U[k] = o[7]; W[k] = o[8]; J[k] = o[11];
      }
    }
    return { n: n, np: np, SUB: SUB, A: A, B: B, SA: SA, SB: SB, CI: CI, CJ: CJ, U: U, W: W, X: X, Y: Y, J: J, Mu: Mu, Mv: Mv };
  };

  // fit a bounding box into a canvas of width W: returns { H, k, SX, SY, inv }
  V.fit = function (W, x0, x1, y0, y1, M, hmin, hmax) {
    var avail = W - 2 * M, asp = (y1 - y0) / ((x1 - x0) || 1), H = Math.round(Math.min(hmax, Math.max(hmin, avail * asp + 2 * M)));
    var k = Math.min(avail / ((x1 - x0) || 1), (H - 2 * M) / ((y1 - y0) || 1)), ox = (W - k * (x1 - x0)) / 2, oy = (H - k * (y1 - y0)) / 2;
    return { H: H, k: k, SX: function (x) { return ox + (x - x0) * k; }, SY: function (y) { return H - oy - (y - y0) * k; },
             IX: function (px) { return x0 + (px - ox) / k; }, IY: function (py) { return y0 + (H - oy - py) / k; } };
  };

  // banded contour over the sample cells: px, py = screen coordinates of the samples, vals = values
  V.contour = function (bp, sm, px, py, vals) {
    var S1 = sm.SUB + 1, nc = sm.Mu * sm.Mv;
    for (var c = 0; c < nc; c++) {
      var base = c * sm.np;
      for (var q = 0; q < sm.SUB; q++) for (var p = 0; p < sm.SUB; p++) {
        var k0 = base + q * S1 + p, k1 = k0 + 1, k2 = k0 + S1 + 1, k3 = k0 + S1;
        var A = [px[k0], py[k0], vals[k0]], B = [px[k1], py[k1], vals[k1]], C = [px[k2], py[k2], vals[k2]], D = [px[k3], py[k3], vals[k3]];
        bp.tri([A, B, C]); bp.tri([A, C, D]);
      }
    }
  };
  // outline of lattice cell c (i·Mv + j) through its samples, as screen points
  V.cellRim = function (sm, c, px, py) {
    var S1 = sm.SUB + 1, base = c * sm.np, out = [], a;
    for (a = 0; a <= sm.SUB; a++) out.push([px[base + a], py[base + a]]);
    for (a = 1; a <= sm.SUB; a++) out.push([px[base + a * S1 + sm.SUB], py[base + a * S1 + sm.SUB]]);
    for (a = sm.SUB - 1; a >= 0; a--) out.push([px[base + sm.SUB * S1 + a], py[base + sm.SUB * S1 + a]]);
    for (a = sm.SUB - 1; a > 0; a--) out.push([px[base + a * S1], py[base + a * S1]]);
    return out;
  };
  // polyline of an index-space path mapped to the physical space: f(t) → [a, b, sa, sb], t ∈ [0, 1]
  V.path = function (md, f, n, SX, SY) {
    var o = new Float64Array(12), out = [];
    for (var i = 0; i <= n; i++) { var q = f(i / n); md.map.at(q[0], q[1], o, q[2], q[3]); out.push([SX(o[0]), SY(o[1])]); }
    return out;
  };
  V.stroke = function (g, pts, close) {
    if (!pts.length) return;
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    if (close) g.closePath();
  };
  // knot lines (interior knots, both directions) in the physical space; C⁰ lines drawn heavier
  V.knotLines = function (g, md, SX, SY, C) {
    var P = md.patch, ax = md.ax, ay = md.ay;
    g.save(); g.setLineDash([7, 3, 2, 3]);
    ax.A.slice(1, -1).forEach(function (a) {
      var c0 = ax.c0.indexOf(a) >= 0;
      g.strokeStyle = c0 ? C.fg : U().rgba(C.fg, 0.55); g.lineWidth = c0 ? 1.4 : 1;
      V.stroke(g, V.path(md, function (t) { return [a, t * md.lat.Mv, 1, 0]; }, 60, SX, SY)); g.stroke();
    });
    ay.A.slice(1, -1).forEach(function (b) {
      var c0 = ay.c0.indexOf(b) >= 0;
      g.strokeStyle = c0 ? C.fg : U().rgba(C.fg, 0.55); g.lineWidth = c0 ? 1.4 : 1;
      V.stroke(g, V.path(md, function (t) { return [t * md.lat.Mu, b, 0, 1]; }, 60, SX, SY)); g.stroke();
    });
    g.restore();
    return P;
  };
  // control net: polygon lines and points (squares), weights ≠ 1 drawn hollow
  V.controlNet = function (g, P, SX, SY, C) {
    var i, j, c;
    g.save(); g.strokeStyle = U().rgba(C.gold, 0.9); g.lineWidth = 1; g.setLineDash([3, 3]);
    for (i = 0; i < P.nu; i++) { g.beginPath(); for (j = 0; j < P.nv; j++) { c = P.ctrl(i, j); if (j) g.lineTo(SX(c[0]), SY(c[1])); else g.moveTo(SX(c[0]), SY(c[1])); } g.stroke(); }
    for (j = 0; j < P.nv; j++) { g.beginPath(); for (i = 0; i < P.nu; i++) { c = P.ctrl(i, j); if (i) g.lineTo(SX(c[0]), SY(c[1])); else g.moveTo(SX(c[0]), SY(c[1])); } g.stroke(); }
    g.setLineDash([]);
    for (i = 0; i < P.nu; i++) for (j = 0; j < P.nv; j++) {
      c = P.ctrl(i, j); var x = SX(c[0]), y = SY(c[1]);
      g.beginPath(); g.rect(x - 3.5, y - 3.5, 7, 7);
      if (Math.abs(c[2] - 1) < 1e-9) { g.fillStyle = C.gold; g.fill(); } else { g.fillStyle = C.surface; g.fill(); g.lineWidth = 1.6; g.strokeStyle = C.gold; g.stroke(); }
    }
    g.restore();
  };
  // knot vector as text, e.g. {0, 0, 0, 0.5, 1, 1, 1}
  V.knotText = function (Uk) { return '{' + Uk.map(function (v) { return +v.toFixed(3); }).join(', ') + '}'; };
  function U() { return window.RZTools.util; }
})();
