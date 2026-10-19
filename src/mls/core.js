/* ═══════════════════════════════════════════════════════════════
   MLS core — 1D Moving Least Squares approximation
   Shifted & scaled monomial basis p(s) = [1, s, s²], s = (x_I − x)/h,
   so p(0) = e₁ and φ_I(x) = w_I(x) · [A⁻¹(x) p(s_I)]₁.
   Support radius d = α·h, h = nominal nodal spacing.
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  function weight(kind, r) {
    if (r >= 1) return 0;
    if (kind === 'cubic') return r <= 0.5 ? (2 / 3 - 4 * r * r + 4 * r * r * r)
                                          : (4 / 3 - 4 * r + 4 * r * r - (4 / 3) * r * r * r);
    if (kind === 'quartic') return 1 - 6 * r * r + 8 * r * r * r - 3 * r * r * r * r;
    var c = 0.4, e1 = Math.exp(-1 / (c * c));                 // truncated Gaussian
    return (Math.exp(-(r * r) / (c * c)) - e1) / (1 - e1);
  }

  var FN = {
    sin:   { label: 'sin(2πx)',
             f: function (x) { return Math.sin(2 * Math.PI * x); },
             d: function (x) { return 2 * Math.PI * Math.cos(2 * Math.PI * x); } },
    quad:  { label: '1 + 2x − 3x²',
             f: function (x) { return 1 + 2 * x - 3 * x * x; },
             d: function (x) { return 2 - 6 * x; } },
    cubic: { label: '(2x − 1)³',
             f: function (x) { var t = 2 * x - 1; return t * t * t; },
             d: function (x) { var t = 2 * x - 1; return 6 * t * t; } },
    runge: { label: '1 / (1 + 25(2x − 1)²)',
             f: function (x) { var t = 2 * x - 1; return 1 / (1 + 25 * t * t); },
             d: function (x) { var t = 2 * x - 1, q = 1 + 25 * t * t; return -100 * t / (q * q); } },
    tanh:  { label: 'tanh(20(x − ½))',
             f: function (x) { return Math.tanh(20 * (x - 0.5)); },
             d: function (x) { var t = Math.tanh(20 * (x - 0.5)); return 20 * (1 - t * t); } }
  };

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function makeNodes(n, layout, seed) {
    var h = 1 / (n - 1), xs = new Float64Array(n), i;
    for (i = 0; i < n; i++) xs[i] = i * h;
    if (layout === 'irregular') {
      var rnd = mulberry32(seed || 1);
      for (i = 1; i < n - 1; i++) xs[i] += (rnd() - 0.5) * 0.7 * h;   // ±0.35 h, order preserved
    }
    return { xs: xs, h: h };
  }

  function grid(N) { var X = new Float64Array(N); for (var k = 0; k < N; k++) X[k] = k / (N - 1); return X; }

  // Inverse of a small symmetric m×m matrix stored row-major in a 3×3 buffer. Returns null if singular.
  function invSmall(A, m) {
    var M = new Float64Array(18), i, j, k, r, piv, f, scale = 0;
    for (i = 0; i < m; i++) for (j = 0; j < m; j++) { M[i * 6 + j] = A[i * 3 + j]; scale = Math.max(scale, Math.abs(A[i * 3 + j])); }
    for (i = 0; i < m; i++) M[i * 6 + 3 + i] = 1;
    for (k = 0; k < m; k++) {
      piv = k;
      for (r = k + 1; r < m; r++) if (Math.abs(M[r * 6 + k]) > Math.abs(M[piv * 6 + k])) piv = r;
      if (Math.abs(M[piv * 6 + k]) <= 1e-13 * (scale || 1)) return null;
      if (piv !== k) for (j = 0; j < 6; j++) { f = M[k * 6 + j]; M[k * 6 + j] = M[piv * 6 + j]; M[piv * 6 + j] = f; }
      f = M[k * 6 + k];
      for (j = 0; j < 6; j++) M[k * 6 + j] /= f;
      for (r = 0; r < m; r++) if (r !== k) {
        f = M[r * 6 + k];
        if (f !== 0) for (j = 0; j < 6; j++) M[r * 6 + j] -= f * M[k * 6 + j];
      }
    }
    var B = new Float64Array(9);
    for (i = 0; i < m; i++) for (j = 0; j < m; j++) B[i * 3 + j] = M[i * 6 + 3 + j];
    return B;
  }

  function norm1(A, m) {
    var best = 0;
    for (var j = 0; j < m; j++) { var s = 0; for (var i = 0; i < m; i++) s += Math.abs(A[i * 3 + j]); if (s > best) best = s; }
    return best;
  }

  /* Evaluate MLS at points X.
     cfg = { alpha, basis: 'lin'|'quad', weight: 'cubic'|'quartic'|'gauss' }
     Returns { phi (N·n, if wantPhi), uh (if U given), condMax, singular (count of x with singular A), sing (Uint8Array) } */
  function evaluate(cfg, nodes, X, U, wantPhi) {
    var xs = nodes.xs, h = nodes.h, n = xs.length, N = X.length;
    var m = cfg.basis === 'quad' ? 3 : 2, d = cfg.alpha * h;
    var A = new Float64Array(9), W = new Float64Array(n), S = new Float64Array(n);
    var phi = wantPhi ? new Float64Array(N * n) : null;
    var uh = U ? new Float64Array(N) : null, sing = new Uint8Array(N);
    var condMax = 0, nSing = 0, k, I, i, j;
    for (k = 0; k < N; k++) {
      var x = X[k], cnt = 0;
      A.fill(0);
      for (I = 0; I < n; I++) {
        var r = Math.abs(x - xs[I]) / d, w = r < 1 ? weight(cfg.weight, r) : 0;
        W[I] = w;
        if (w <= 0) continue;
        cnt++;
        var s = (xs[I] - x) / h, p = [1, s, s * s];
        S[I] = s;
        for (i = 0; i < m; i++) for (j = 0; j < m; j++) A[i * 3 + j] += w * p[i] * p[j];
      }
      var Ai = cnt >= m ? invSmall(A, m) : null;
      if (!Ai) { sing[k] = 1; nSing++; if (uh) uh[k] = NaN; continue; }
      var c = norm1(A, m) * norm1(Ai, m);
      if (c > condMax) condMax = c;
      var acc = 0;
      for (I = 0; I < n; I++) {
        if (W[I] <= 0) continue;
        var sI = S[I], ph = W[I] * (Ai[0] + Ai[1] * sI + (m === 3 ? Ai[2] * sI * sI : 0));
        if (phi) phi[k * n + I] = ph;
        if (U) acc += ph * U[I];
      }
      if (uh) uh[k] = acc;
    }
    return { phi: phi, uh: uh, condMax: condMax, singular: nSing, sing: sing };
  }

  // Second-order finite differences on a uniform grid (central inside, one-sided at the ends). NaN propagates.
  function diff(Y, X) {
    var N = Y.length, D = new Float64Array(N), dx = X[1] - X[0];
    D[0] = (-3 * Y[0] + 4 * Y[1] - Y[2]) / (2 * dx);
    D[N - 1] = (3 * Y[N - 1] - 4 * Y[N - 2] + Y[N - 3]) / (2 * dx);
    for (var k = 1; k < N - 1; k++) D[k] = (Y[k + 1] - Y[k - 1]) / (2 * dx);
    return D;
  }

  // Relative L2 error by the trapezoidal rule. NaN if any sample is undefined.
  function relL2(approx, exact, X) {
    var num = 0, den = 0, N = X.length;
    for (var k = 0; k < N; k++) {
      var wq = (k === 0 || k === N - 1) ? 0.5 : 1, e = approx[k] - exact[k];
      if (!isFinite(e)) return NaN;
      num += wq * e * e; den += wq * exact[k] * exact[k];
    }
    return den > 0 ? Math.sqrt(num / den) : Math.sqrt(num);
  }

  function sample(fn, X) { var Y = new Float64Array(X.length); for (var k = 0; k < X.length; k++) Y[k] = fn(X[k]); return Y; }

  /* α-sweep: relative error of u (metric 'u') or du/dx (metric 'du') for every α in alphas. */
  function sweep(cfg, nodes, X, fnKey, metric, alphas) {
    var F = FN[fnKey], U = sample(F.f, nodes.xs), exact = metric === 'du' ? sample(F.d, X) : sample(F.f, X);
    var out = new Float64Array(alphas.length);
    for (var i = 0; i < alphas.length; i++) {
      var r = evaluate({ alpha: alphas[i], basis: cfg.basis, weight: cfg.weight }, nodes, X, U, false);
      if (r.singular) { out[i] = NaN; continue; }
      out[i] = relL2(metric === 'du' ? diff(r.uh, X) : r.uh, exact, X);
    }
    return out;
  }

  root.RZMLS = { weight: weight, FN: FN, makeNodes: makeNodes, grid: grid, evaluate: evaluate,
                 diff: diff, relL2: relL2, sample: sample, sweep: sweep };
})(typeof window !== 'undefined' ? window : globalThis);
