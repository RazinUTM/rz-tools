/*! rz-tools v1.0.0 | A. R. Zainal Abidin, Universiti Teknologi Malaysia | https://github.com/RazinUTM/rz-tools */
(function(){if(document.getElementById('rzt-css'))return;var s=document.createElement('style');s.id='rzt-css';s.textContent="/* ═══════════════════════════════════════════════════════════════\n   Shared styles for interactive tools (.rzt). Every selector starts with\n   .rzt.rzt-on so it outranks theme rules like `body.x .entry-content p`.\n   Colours come from the host tokens with UTM fallbacks.\n   ═══════════════════════════════════════════════════════════════ */\n.rzt.rzt-on {\n  --rzt-ok: #2A6B2A; --rzt-ok-bg: #EAF5EA; --rzt-warn: #8B5E00; --rzt-warn-bg: #FFF4E0; --rzt-bad: #A52A2A; --rzt-bad-bg: #FBECEC;\n  font-family: 'Poppins', system-ui, -apple-system, sans-serif; font-size: 15px; line-height: 1.5;\n  color: var(--fg, #0F1624); text-align: left;\n}\nbody.razin-dark .rzt.rzt-on, .rzt.rzt-on.is-dark {\n  --rzt-ok: #7AC97A; --rzt-ok-bg: #0D2B0D; --rzt-warn: #E0B44A; --rzt-warn-bg: #2B1E00; --rzt-bad: #F08A8A; --rzt-bad-bg: #3A1414;\n}\n.rzt.rzt-on *, .rzt.rzt-on *::before, .rzt.rzt-on *::after { box-sizing: border-box; }\n.rzt.rzt-on .rzt-body { display: grid; grid-template-columns: 272px minmax(0, 1fr); gap: 20px; align-items: start; }\n@media (max-width: 880px) { .rzt.rzt-on .rzt-body { grid-template-columns: minmax(0, 1fr); } }\n\n/* controls */\n.rzt.rzt-on .rzt-ctrl {\n  display: flex; flex-direction: column; gap: 16px; padding: 18px;\n  background: var(--surface, #fff); border: 1px solid var(--border, #DDE3EF); border-radius: 6px;\n  position: sticky; top: calc(var(--rz-nav-h, 0px) + 14px);\n}\n@media (max-width: 880px) { .rzt.rzt-on .rzt-ctrl { position: static; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px 12px; padding: 14px; } }\n.rzt.rzt-on .rzt-nt { text-transform: none; }\n.rzt.rzt-on .rzt-field { display: flex; flex-direction: column; gap: 7px; margin: 0; padding: 0; min-width: 0; }\n.rzt.rzt-on .rzt-lab {\n  display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin: 0;\n  font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px; font-weight: 500;\n  letter-spacing: .07em; text-transform: uppercase; color: var(--fg2, #5D6B85);\n}\n.rzt.rzt-on .rzt-lab output { font-size: 13px; font-weight: 600; letter-spacing: 0; text-transform: none; color: var(--accent, #7B1535); font-variant-numeric: tabular-nums; }\n.rzt.rzt-on .rzt-sel {\n  width: 100%; margin: 0; padding: 8px 10px; font: inherit; font-size: 14px; line-height: 1.3;\n  color: var(--fg, #0F1624); background: var(--bg, #F4F6FA); border: 1px solid var(--border, #DDE3EF); border-radius: 4px; height: auto;\n}\n.rzt.rzt-on .rzt-sel:focus-visible, .rzt.rzt-on .rzt-rng:focus-visible, .rzt.rzt-on button:focus-visible { outline: 2px solid var(--accent, #7B1535); outline-offset: 2px; }\n.rzt.rzt-on .rzt-rng { width: 100%; margin: 4px 0 0; padding: 0; accent-color: var(--accent, #7B1535); background: transparent; border: 0; height: 22px; }\n.rzt.rzt-on .rzt-seg { display: flex; margin: 0; border: 1px solid var(--border, #DDE3EF); border-radius: 4px; overflow: hidden; }\n.rzt.rzt-on .rzt-seg button {\n  flex: 1; margin: 0; padding: 7px 6px; font: inherit; font-size: 13px; line-height: 1.2; cursor: pointer;\n  color: var(--fg2, #5D6B85); background: var(--surface, #fff); border: 0; border-radius: 0; box-shadow: none;\n}\n.rzt.rzt-on .rzt-seg button + button { border-left: 1px solid var(--border, #DDE3EF); }\n.rzt.rzt-on .rzt-seg button[aria-pressed=\"true\"] { background: var(--accent, #7B1535); color: #fff; }\n.rzt.rzt-on .rzt-btn {\n  margin: 0; padding: 6px 12px; font: inherit; font-size: 13px; line-height: 1.2; cursor: pointer; align-self: flex-start;\n  color: var(--fg2, #5D6B85); background: var(--surface, #fff); border: 1px solid var(--border, #DDE3EF); border-radius: 4px; box-shadow: none;\n}\n.rzt.rzt-on .rzt-btn:hover { border-color: var(--accent, #7B1535); color: var(--accent, #7B1535); }\n.rzt.rzt-on .rzt-stepper { display: flex; align-items: center; gap: 8px; }\n.rzt.rzt-on .rzt-stepper output { flex: 1; text-align: center; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 13px; color: var(--fg, #0F1624); font-variant-numeric: tabular-nums; }\n.rzt.rzt-on .rzt-stepper .rzt-btn { padding: 4px 12px; font-size: 16px; }\n.rzt.rzt-on .rzt-reset { align-self: stretch; text-align: center; }\n\n/* metrics */\n.rzt.rzt-on .rzt-main { display: flex; flex-direction: column; gap: 14px; min-width: 0; }\n.rzt.rzt-on .rzt-metrics {\n  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; margin: 0;\n  background: var(--border, #DDE3EF); border: 1px solid var(--border, #DDE3EF); border-radius: 6px; overflow: hidden;\n}\n@media (max-width: 560px) { .rzt.rzt-on .rzt-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } }\n.rzt.rzt-on .rzt-m { display: flex; flex-direction: column; gap: 3px; padding: 11px 14px; background: var(--surface, #fff); min-width: 0; }\n.rzt.rzt-on .rzt-mv { font-size: 19px; font-weight: 600; line-height: 1.15; color: var(--fg, #0F1624); font-variant-numeric: tabular-nums; white-space: nowrap; }\n.rzt.rzt-on .rzt-ml { font-size: 12px; line-height: 1.35; color: var(--fg2, #5D6B85); }\n.rzt.rzt-on .rzt-chip { display: inline-block; margin-left: 2px; padding: 0 6px; border-radius: 3px; font-size: 11px; font-weight: 600; white-space: nowrap; }\n.rzt.rzt-on .rzt-chip.is-good { background: var(--rzt-ok-bg); color: var(--rzt-ok); }\n.rzt.rzt-on .rzt-chip.is-ok { background: var(--rzt-warn-bg); color: var(--rzt-warn); }\n.rzt.rzt-on .rzt-chip.is-bad { background: var(--rzt-bad-bg); color: var(--rzt-bad); }\n.rzt.rzt-on .rzt-note { margin: 0; padding: 10px 14px; font-size: 13.5px; line-height: 1.5; border-radius: 0 4px 4px 0; color: var(--fg, #0F1624); }\n.rzt.rzt-on .rzt-warn { background: var(--rzt-warn-bg); border-left: 3px solid var(--rzt-warn); }\n.rzt.rzt-on .rzt-ok { background: var(--rzt-ok-bg); border-left: 3px solid var(--rzt-ok); }\n\n/* plots */\n.rzt.rzt-on .rzt-plot { position: relative; margin: 0; padding: 14px 14px 8px; background: var(--surface, #fff); border: 1px solid var(--border, #DDE3EF); border-radius: 6px; }\n.rzt.rzt-on .rzt-ph { display: flex; flex-direction: column; gap: 3px; margin: 0 0 8px; }\n.rzt.rzt-on .rzt-h { font-size: 15px; font-weight: 600; line-height: 1.3; color: var(--fg, #0F1624); }\n.rzt.rzt-on .rzt-sub { font-size: 12.5px; line-height: 1.45; color: var(--fg2, #5D6B85); max-width: 68ch; }\n.rzt.rzt-on .rzt-legend { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 4px; font-size: 12px; color: var(--fg2, #5D6B85); }\n.rzt.rzt-on .rzt-legend span { display: inline-flex; align-items: center; gap: 6px; }\n.rzt.rzt-on .rzt-sw { display: inline-block; flex-shrink: 0; }\n.rzt.rzt-on .rzt-sw.line { width: 18px; height: 0; border-top: 2.5px solid; }\n.rzt.rzt-on .rzt-sw.dash { width: 18px; height: 0; border-top: 2px dashed; }\n.rzt.rzt-on .rzt-sw.dot { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid; }\n.rzt.rzt-on .rzt-sw.band { width: 14px; height: 10px; border-radius: 2px; }\n.rzt.rzt-on .rzt-cv { display: block; width: 100%; height: 210px; margin: 0; cursor: pointer; touch-action: manipulation; }\n.rzt.rzt-on .rzt-cv-main { height: 270px; }\n@media (max-width: 560px) { .rzt.rzt-on .rzt-cv { height: 180px; } .rzt.rzt-on .rzt-cv-main { height: 220px; } }\n.rzt.rzt-on .rzt-read { position: absolute; right: 16px; top: 14px; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 12px; color: var(--fg, #0F1624); font-variant-numeric: tabular-nums; }\n\n/* explanation blocks (rendered by the host page, styled here) */\n.rzt-doc details { margin: 0 0 10px; background: var(--surface, #fff); border: 1px solid var(--border, #DDE3EF); border-radius: 6px; }\n.rzt-doc summary { cursor: pointer; padding: 13px 16px; font-weight: 600; color: var(--fg, #0F1624); }\n.rzt-doc details > div { padding: 0 18px 14px; color: var(--fg2, #5D6B85); font-size: 14.5px; line-height: 1.65; }\n.rzt-doc .rzt-eq { margin: 10px 0; padding: 10px 14px; overflow-x: auto; white-space: nowrap; background: var(--bg, #F4F6FA); border-radius: 4px; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 13.5px; color: var(--fg, #0F1624); }\n.rzt-doc ul, .rzt-doc ol { margin: 8px 0; padding-left: 1.3em; }\n.rzt-doc li { margin-bottom: 6px; }\n.rzt-doc b { color: var(--fg, #0F1624); }\n/* themes such as Divi reset sub/sup to the baseline; restore them without disturbing line height */\n.rzt-doc sub, .rzt-doc sup, .rzt.rzt-on sub, .rzt.rzt-on sup { position: relative; font-size: 75%; line-height: 0; vertical-align: baseline; }\n.rzt-doc sub, .rzt.rzt-on sub { bottom: -0.25em; }\n.rzt-doc sup, .rzt.rzt-on sup { top: -0.5em; }\n@media (prefers-reduced-motion: reduce) { .rzt.rzt-on * { transition: none !important; } }\n";(document.head||document.documentElement).appendChild(s);})();
/* ═══════════════════════════════════════════════════════════════
   Tool registry. Each tool calls RZTools.register(name, mountFn).
   Any element <div data-rz-tool="name"></div> on the page is mounted
   once the bundle has loaded. Mounting is idempotent.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var RZT = window.RZTools = window.RZTools || {};
  var reg = RZT._reg = RZT._reg || {};

  RZT.register = function (name, fn) { reg[name] = fn; };
  RZT.list = function () { return Object.keys(reg); };

  RZT.mount = function (el) {
    if (!el || el.getAttribute('data-rzt-mounted')) return false;
    var name = el.getAttribute('data-rz-tool'), fn = reg[name];
    if (!fn) {
      el.textContent = 'Unknown interactive tool: "' + name + '". Available: ' + RZT.list().join(', ') + '.';
      return false;
    }
    el.setAttribute('data-rzt-mounted', '1');
    try { fn(el); return true; }
    catch (err) {
      el.textContent = 'This interactive tool could not start in your browser. Please try a recent version of Chrome, Edge, Firefox or Safari.';
      if (window.console) console.error('[rz-tools]', name, err);
      return false;
    }
  };

  RZT.boot = function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-rz-tool]'), RZT.mount);
  };
})();

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

/* ═══════════════════════════════════════════════════════════════
   MLS Approximation Explorer — UI
   Registered as RZTools tool 'mls'; mount with <div data-rz-tool="mls"></div>
   Dependency-free; reads colours from the host page's CSS tokens
   (--accent, --gold, --fg, --fg2, --border, --surface) and follows the
   site language switch (body[data-rzlang]) and theme.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var M = window.RZMLS, RZT = window.RZTools;

  var T = {
    en: {
      fn: 'Test function', nodes: 'Nodes', alpha: 'Dilation parameter α', basis: 'Basis',
      lin: 'Linear', quad: 'Quadratic', weight: 'Weight function',
      cubic: 'Cubic spline', quartic: 'Quartic spline', gauss: 'Gaussian',
      layout: 'Node layout', regular: 'Regular', irregular: 'Irregular', shuffle: 'New layout',
      show: 'Main plot shows', metric: 'Sweep measures error in', node: 'Inspect node', reset: 'Reset',
      p1: 'Approximation', p1d: 'Derivative',
      p1s: 'MLS against the exact function. Dots are nodal values uᵢ = f(xᵢ); MLS does not pass through them. Click a node to inspect it.',
      p1sd: 'Derivative of the MLS approximation against the exact derivative. Click near a node to inspect it.',
      p2: 'Shape functions', p2s: 'All φᵢ(x) in grey, the inspected node in colour, its weight function, and the sum Σφᵢ.',
      p3: 'Error against α', p3s: 'Relative L2 error for every α from 0.5 to 4.0 with the current settings. Click the curve to set α.',
      lgExact: 'exact', lgMls: 'MLS', lgNodes: 'nodal values', lgSupport: 'support of node', lgPhi: 'φ of node',
      lgW: 'weight (scaled)', lgSum: 'Σφ', lgAll: 'other φ', lgErr: 'error', lgCur: 'current α',
      lgOpt: 'α*', lgSing: 'A(x) singular',
      mErr: 'Error in u', mErrD: 'Error in du/dx', mCond: 'max cond₁ A(x)', mPU: 'max |Σφ − 1|',
      mOpt: 'α* from sweep', mEff: 'EFF = E(α) / E(α*)',
      effGood: 'near optimal', effOk: 'acceptable', effBad: 'far from α*', relL2: 'relative L2',
      sing: 'A(x) is singular at {n} of {N} sample points: their support holds fewer than m = {m} nodes. Increase α, or use the linear basis.',
      singB: ' Near the boundary the support is one-sided, so the quadratic basis needs α > 2 on a regular grid.',
      exact: 'Exact reproduction: a quadratic basis reproduces any quadratic function to machine precision, for every α that keeps A(x) non-singular.',
      none: 'No α in the range gives a non-singular A(x) for these settings.',
      read: 'α = {a} · E = {e}', readS: 'α = {a} · A(x) singular'
    },
    ms: {
      fn: 'Fungsi ujian', nodes: 'Bilangan nod', alpha: 'Dilation parameter α', basis: 'Basis',
      lin: 'Linear', quad: 'Kuadratik', weight: 'Weight function',
      cubic: 'Cubic spline', quartic: 'Quartic spline', gauss: 'Gaussian',
      layout: 'Susunan nod', regular: 'Seragam', irregular: 'Tak seragam', shuffle: 'Susunan baharu',
      show: 'Plot utama memaparkan', metric: 'Sweep mengukur ralat bagi', node: 'Periksa nod', reset: 'Set semula',
      p1: 'Approximation', p1d: 'Terbitan',
      p1s: 'MLS berbanding fungsi tepat. Titik ialah nilai nod uᵢ = f(xᵢ); MLS tidak melalui titik-titik ini. Klik nod untuk memeriksanya.',
      p1sd: 'Terbitan MLS approximation berbanding terbitan tepat. Klik berhampiran nod untuk memeriksanya.',
      p2: 'Shape functions', p2s: 'Semua φᵢ(x) dalam kelabu, nod yang diperiksa berwarna, weight function-nya, dan jumlah Σφᵢ.',
      p3: 'Ralat berbanding α', p3s: 'Ralat relatif L2 bagi setiap α dari 0.5 hingga 4.0 dengan tetapan semasa. Klik lengkung untuk menetapkan α.',
      lgExact: 'tepat', lgMls: 'MLS', lgNodes: 'nilai nod', lgSupport: 'support nod', lgPhi: 'φ nod',
      lgW: 'weight (diskala)', lgSum: 'Σφ', lgAll: 'φ lain', lgErr: 'ralat', lgCur: 'α semasa',
      lgOpt: 'α*', lgSing: 'A(x) singular',
      mErr: 'Ralat u', mErrD: 'Ralat du/dx', mCond: 'max cond₁ A(x)', mPU: 'max |Σφ − 1|',
      mOpt: 'α* daripada sweep', mEff: 'EFF = E(α) / E(α*)',
      effGood: 'hampir optimum', effOk: 'boleh diterima', effBad: 'jauh dari α*', relL2: 'relatif L2',
      sing: 'A(x) singular pada {n} daripada {N} titik sampel: support-nya mengandungi kurang daripada m = {m} nod. Naikkan α, atau guna basis linear.',
      singB: ' Berhampiran sempadan, support hanya sebelah, jadi basis kuadratik memerlukan α > 2 pada grid seragam.',
      exact: 'Penghasilan semula tepat: basis kuadratik menghasilkan semula mana-mana fungsi kuadratik pada ketepatan mesin, bagi setiap α yang mengekalkan A(x) tidak singular.',
      none: 'Tiada α dalam julat ini yang memberi A(x) tidak singular untuk tetapan ini.',
      read: 'α = {a} · E = {e}', readS: 'α = {a} · A(x) singular'
    }
  };

  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function sci(v) {
    if (!isFinite(v)) return '—';
    if (v === 0) return '0';
    var e = Math.floor(Math.log10(Math.abs(v))), mant = v / Math.pow(10, e);
    if (Math.abs(mant) >= 9.995) { mant /= 10; e++; }
    if (e >= -2 && e <= 3) return v.toPrecision(3).replace(/\.?0+$/, function (z) { return z.indexOf('.') === 0 ? '' : z; });
    return mant.toFixed(2) + ' × 10' + String(e).split('').map(function (c) { return SUP[c]; }).join('');
  }
  function pow10Label(e) { return '10' + String(e).split('').map(function (c) { return SUP[c]; }).join(''); }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k]; }); }

  /* ── colours from the host page ─────────────────────────────── */
  function readColors(el) {
    var cs = getComputedStyle(el);
    function v(n, d) { var x = cs.getPropertyValue(n).trim(); return x || d; }
    return { accent: v('--accent', '#7B1535'), gold: v('--gold', '#C8A020'), fg: v('--fg', '#0F1624'),
             fg2: v('--fg2', '#5D6B85'), border: v('--border', '#DDE3EF'), surface: v('--surface', '#FFFFFF') };
  }
  function rgba(c, a) {
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
    if (m) {
      var h = m[1]; if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
    }
    var r = /rgba?\(([^)]+)\)/.exec(c);
    if (r) { var p = r[1].split(',').slice(0, 3).join(','); return 'rgba(' + p + ',' + a + ')'; }
    return c;
  }

  /* ── minimal canvas plotter ──────────────────────────────────── */
  function niceStep(range, count) {
    var raw = range / count, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag;
    return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
  }
  function plot(cv, spec, C) {
    var dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
    if (!W || !H) return null;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    var g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    var mg = { l: 52, r: 12, t: 10, b: 26 }, xr = spec.xr, yr = spec.yr, lg = !!spec.ylog;
    var ty = lg ? function (v) { return Math.log10(v); } : function (v) { return v; };
    var y0 = ty(yr[0]), y1 = ty(yr[1]), pw = W - mg.l - mg.r, ph = H - mg.t - mg.b;
    function X(v) { return mg.l + (v - xr[0]) / (xr[1] - xr[0]) * pw; }
    function Y(v) { return mg.t + (1 - (ty(v) - y0) / (y1 - y0)) * ph; }
    var mono = '11px "IBM Plex Mono", ui-monospace, monospace';
    g.font = mono; g.lineWidth = 1;

    // grid + ticks
    g.strokeStyle = C.border; g.fillStyle = C.fg2; g.textBaseline = 'middle'; g.textAlign = 'right';
    var yt = [];
    if (lg) { for (var e = Math.ceil(y0); e <= Math.floor(y1); e++) yt.push({ v: Math.pow(10, e), s: pow10Label(e) }); }
    else {
      var st = niceStep(yr[1] - yr[0], 5), dec = Math.max(0, -Math.floor(Math.log10(st)));
      for (var v = Math.ceil(yr[0] / st) * st; v <= yr[1] + st * 1e-9; v += st) yt.push({ v: v, s: (Math.abs(v) < st * 1e-9 ? 0 : v).toFixed(Math.min(dec, 3)) });
    }
    yt.forEach(function (t) { var y = Math.round(Y(t.v)) + 0.5; g.beginPath(); g.moveTo(mg.l, y); g.lineTo(W - mg.r, y); g.stroke(); g.fillText(t.s, mg.l - 6, y); });
    var xs = niceStep(xr[1] - xr[0], Math.max(3, Math.floor(pw / 80))), xd = Math.max(0, -Math.floor(Math.log10(xs)));
    g.textAlign = 'center'; g.textBaseline = 'top';
    for (var xv = Math.ceil(xr[0] / xs) * xs; xv <= xr[1] + xs * 1e-9; xv += xs) {
      var x = Math.round(X(xv)) + 0.5;
      g.beginPath(); g.moveTo(x, mg.t); g.lineTo(x, H - mg.b); g.stroke();
      g.fillText(xv.toFixed(Math.min(xd, 2)), x, H - mg.b + 6);
    }
    if (spec.xlabel) { g.textAlign = 'right'; g.textBaseline = 'bottom'; g.fillText(spec.xlabel, W - mg.r, H - mg.b - 3); }

    g.save(); g.beginPath(); g.rect(mg.l, mg.t, pw, ph); g.clip();
    (spec.bands || []).forEach(function (b) {
      g.fillStyle = b.fill; var a = X(b.x0), c = X(b.x1); g.fillRect(a, mg.t, c - a, ph);
      if (b.edge) { g.strokeStyle = b.edge; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(a, mg.t); g.lineTo(a, mg.t + ph); g.moveTo(c, mg.t); g.lineTo(c, mg.t + ph); g.stroke(); g.setLineDash([]); }
    });
    (spec.hlines || []).forEach(function (h) { g.strokeStyle = h.stroke; g.lineWidth = h.width || 1; g.setLineDash(h.dash || []); var y = Y(h.y); g.beginPath(); g.moveTo(mg.l, y); g.lineTo(W - mg.r, y); g.stroke(); g.setLineDash([]); });
    (spec.lines || []).forEach(function (L) {
      g.strokeStyle = L.stroke; g.lineWidth = L.width || 1.5; g.setLineDash(L.dash || []); g.lineJoin = 'round';
      g.beginPath(); var pen = false;
      for (var k = 0; k < L.x.length; k++) {
        var yv = L.y[k];
        if (!isFinite(yv) || (lg && yv <= 0)) { pen = false; continue; }
        var px = X(L.x[k]), py = Y(yv);
        if (pen) g.lineTo(px, py); else { g.moveTo(px, py); pen = true; }
      }
      g.stroke(); g.setLineDash([]);
    });
    (spec.vlines || []).forEach(function (V) { g.strokeStyle = V.stroke; g.lineWidth = V.width || 1.5; g.setLineDash(V.dash || []); var x = X(V.x); g.beginPath(); g.moveTo(x, mg.t); g.lineTo(x, mg.t + ph); g.stroke(); g.setLineDash([]); });
    (spec.ticks || []).forEach(function (t) { g.strokeStyle = t.stroke; g.lineWidth = t.width || 1.5; var x = X(t.x); g.beginPath(); g.moveTo(x, mg.t + ph); g.lineTo(x, mg.t + ph - (t.len || 7)); g.stroke(); });
    (spec.points || []).forEach(function (P) {
      if (!isFinite(P.y)) return;
      g.beginPath(); g.arc(X(P.x), Y(P.y), P.r || 3.5, 0, Math.PI * 2);
      if (P.fill) { g.fillStyle = P.fill; g.fill(); }
      if (P.stroke) { g.strokeStyle = P.stroke; g.lineWidth = P.lw || 1.2; g.stroke(); }
    });
    (spec.labels || []).forEach(function (L) { g.font = L.font || mono; g.fillStyle = L.fill; g.textAlign = L.align || 'left'; g.textBaseline = L.base || 'top'; g.fillText(L.text, L.px != null ? L.px : X(L.x), L.py != null ? L.py : Y(L.y)); });
    g.restore();
    return { X: X, Y: Y, invX: function (px) { return xr[0] + (px - mg.l) / pw * (xr[1] - xr[0]); }, mg: mg, W: W, H: H };
  }

  /* ── markup ──────────────────────────────────────────────────── */
  function seg(name, opts) {
    return '<div class="rzt-seg" role="group" data-seg="' + name + '">' + opts.map(function (o) {
      return '<button type="button" data-v="' + o[0] + '" data-k="' + o[1] + '"></button>';
    }).join('') + '</div>';
  }
  var HTML =
    '<div class="rzt-body">' +
      '<div class="rzt-ctrl">' +
        '<label class="rzt-field"><span class="rzt-lab" data-k="fn"></span>' +
          '<select class="rzt-sel" data-in="fn">' + Object.keys(M.FN).map(function (k) { return '<option value="' + k + '">' + M.FN[k].label + '</option>'; }).join('') + '</select></label>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-k="alpha"></span><output data-out="alpha"></output></span>' +
          '<input class="rzt-rng" type="range" min="0.5" max="4" step="0.05" data-in="alpha"></label>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-k="nodes"></span><output data-out="n"></output></span>' +
          '<input class="rzt-rng" type="range" min="5" max="41" step="1" data-in="n"></label>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="basis"></span>' + seg('basis', [['lin', 'lin'], ['quad', 'quad']]) + '</div>' +
        '<label class="rzt-field"><span class="rzt-lab" data-k="weight"></span>' +
          '<select class="rzt-sel" data-in="weight"><option value="cubic" data-k="cubic"></option><option value="quartic" data-k="quartic"></option><option value="gauss" data-k="gauss"></option></select></label>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="layout"></span>' + seg('layout', [['regular', 'regular'], ['irregular', 'irregular']]) +
          '<button type="button" class="rzt-btn" data-act="shuffle" data-k="shuffle"></button></div>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="show"></span>' + seg('show', [['u', ''], ['du', '']]) + '</div>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="metric"></span>' + seg('metric', [['u', ''], ['du', '']]) + '</div>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="node"></span>' +
          '<div class="rzt-stepper"><button type="button" class="rzt-btn" data-act="prev" aria-label="Previous node">‹</button>' +
          '<output data-out="sel"></output><button type="button" class="rzt-btn" data-act="next" aria-label="Next node">›</button></div></div>' +
        '<button type="button" class="rzt-btn rzt-reset" data-act="reset" data-k="reset"></button>' +
      '</div>' +
      '<div class="rzt-main">' +
        '<div class="rzt-metrics">' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="eu"></span><span class="rzt-ml"><span data-k="mErr"></span> · <span data-k="relL2"></span></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="ed"></span><span class="rzt-ml"><span data-k="mErrD"></span> · <span data-k="relL2"></span></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="opt"></span><span class="rzt-ml" data-k="mOpt"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="eff"></span><span class="rzt-ml"><span data-k="mEff"></span> <span class="rzt-chip" data-m="effc"></span></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="cond"></span><span class="rzt-ml" data-k="mCond"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="pu"></span><span class="rzt-ml" data-k="mPU"></span></div>' +
        '</div>' +
        '<div class="rzt-note rzt-warn" data-note="sing" hidden></div>' +
        '<div class="rzt-note rzt-ok" data-note="exact" data-k="exact" hidden></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p1" data-alt="p1d"></span><span class="rzt-sub" data-k="p1s" data-alt="p1sd"></span><div class="rzt-legend" data-lg="1"></div></div><canvas class="rzt-cv rzt-cv-main" data-cv="1"></canvas></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p2"></span><span class="rzt-sub" data-k="p2s"></span><div class="rzt-legend" data-lg="2"></div></div><canvas class="rzt-cv" data-cv="2"></canvas></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p3"></span><span class="rzt-sub" data-k="p3s"></span><div class="rzt-legend" data-lg="3"></div></div><canvas class="rzt-cv rzt-cv-click" data-cv="3"></canvas><span class="rzt-read" data-read></span></div>' +
      '</div>' +
    '</div>';

  var DEFAULTS = { fn: 'sin', n: 11, alpha: 2.5, basis: 'quad', weight: 'cubic', layout: 'regular', seed: 7, show: 'u', metric: 'u', sel: 5 };
  var ALPHAS = []; for (var ai = 0; ai <= 70; ai++) ALPHAS.push(+(0.5 + ai * 0.05).toFixed(2));
  var NGRID = 401;

  RZT.register('mls', function (root) {
    root.classList.add('rzt', 'rzt-on');
    root.innerHTML = HTML;

    var S = {}; for (var k in DEFAULTS) S[k] = DEFAULTS[k];
    var X = M.grid(NGRID), C = readColors(root), lang = 'en';
    var cur = null, sw = null, swKey = '';
    function q(sel) { return root.querySelector(sel); }
    function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    var cv1 = q('[data-cv="1"]'), cv2 = q('[data-cv="2"]'), cv3 = q('[data-cv="3"]');
    var P1 = null, P3 = null;

    function t(k) { return (T[lang] || T.en)[k] || T.en[k] || k; }
    function detectLang() {
      var b = document.body && document.body.getAttribute('data-rzlang');
      return b === 'ms' ? 'ms' : 'en';
    }
    function applyLang() {
      lang = detectLang();
      qa('[data-k]').forEach(function (el) {
        var key = el.getAttribute('data-k'); if (!key) return;
        var txt = t(key);
        // keep Greek letters lower-case inside upper-cased labels (α would otherwise render as Α)
        if (/[\u03B1-\u03C9]/.test(txt) && el.tagName !== 'OPTION') el.innerHTML = txt.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }).replace(/([\u03B1-\u03C9]+)/g, '<span class="rzt-nt">$1</span>');
        else el.textContent = txt;
      });
      qa('[data-seg="show"] button, [data-seg="metric"] button').forEach(function (b) { b.textContent = b.getAttribute('data-v') === 'u' ? 'u(x)' : 'du/dx'; });
      redraw();
    }

    /* compute */
    function compute() {
      var nodes = M.makeNodes(S.n, S.layout, S.seed), F = M.FN[S.fn];
      var U = M.sample(F.f, nodes.xs);
      var r = M.evaluate({ alpha: S.alpha, basis: S.basis, weight: S.weight }, nodes, X, U, true);
      var fx = M.sample(F.f, X), dfx = M.sample(F.d, X), duh = r.singular ? null : M.diff(r.uh, X);
      var pu = 0, n = S.n;
      if (!r.singular) for (var k = 0; k < NGRID; k++) { var s = 0; for (var I = 0; I < n; I++) s += r.phi[k * n + I]; pu = Math.max(pu, Math.abs(s - 1)); }
      cur = { nodes: nodes, U: U, r: r, fx: fx, dfx: dfx, duh: duh, pu: r.singular ? NaN : pu,
              eu: r.singular ? NaN : M.relL2(r.uh, fx, X), ed: r.singular ? NaN : M.relL2(duh, dfx, X) };
      var key = [S.fn, S.n, S.basis, S.weight, S.layout, S.seed, S.metric].join('|');
      if (key !== swKey) { swKey = key; sw = M.sweep({ basis: S.basis, weight: S.weight }, nodes, X, S.fn, S.metric, ALPHAS); }
      var best = -1; for (var i = 0; i < sw.length; i++) if (isFinite(sw[i]) && (best < 0 || sw[i] < sw[best])) best = i;
      cur.best = best;
    }

    function setMetrics() {
      function put(m, v) { q('[data-m="' + m + '"]').textContent = v; }
      put('eu', sci(cur.eu)); put('ed', sci(cur.ed));
      put('cond', cur.r.singular ? '∞' : sci(cur.r.condMax));
      put('pu', sci(cur.pu));
      var chip = q('[data-m="effc"]'); chip.className = 'rzt-chip';
      if (cur.best < 0) { put('opt', '—'); put('eff', '—'); chip.textContent = ''; }
      else {
        put('opt', ALPHAS[cur.best].toFixed(2));
        var e = S.metric === 'du' ? cur.ed : cur.eu, eff = e / sw[cur.best];
        put('eff', isFinite(eff) ? '×' + (eff < 10 ? eff.toFixed(2) : sci(eff)) : '—');
        if (isFinite(eff)) {
          var cls = eff <= 1.05 ? 'good' : eff <= 2 ? 'ok' : 'bad';
          chip.classList.add('is-' + cls); chip.textContent = t(cls === 'good' ? 'effGood' : cls === 'ok' ? 'effOk' : 'effBad');
        } else chip.textContent = '';
      }
      var ns = q('[data-note="sing"]');
      if (cur.r.singular) {
        var msg = fill(t('sing'), { n: cur.r.singular, N: NGRID, m: S.basis === 'quad' ? 3 : 2 });
        if (S.basis === 'quad' && S.layout === 'regular' && S.alpha <= 2 && S.alpha > 1.5) msg += t('singB');
        ns.textContent = msg; ns.hidden = false;
      } else ns.hidden = true;
      q('[data-note="exact"]').hidden = !(S.fn === 'quad' && S.basis === 'quad' && !cur.r.singular);
    }

    function legend(id, items) {
      q('[data-lg="' + id + '"]').innerHTML = items.map(function (it) {
        var sw = it.type === 'dot' ? '<i class="rzt-sw dot" style="background:' + it.c + ';border-color:' + (it.b || it.c) + '"></i>'
               : it.type === 'band' ? '<i class="rzt-sw band" style="background:' + it.c + '"></i>'
               : '<i class="rzt-sw ' + (it.dash ? 'dash' : 'line') + '" style="border-color:' + it.c + '"></i>';
        return '<span>' + sw + it.t + '</span>';
      }).join('');
    }

    function drawMain() {
      var nd = cur.nodes, xs = nd.xs, d = S.alpha * nd.h, sel = S.sel, du = S.show === 'du';
      var ex = du ? cur.dfx : cur.fx, ap = du ? cur.duh : cur.r.uh;
      var lo = Infinity, hi = -Infinity, k;
      function acc(a) { if (!a) return; for (k = 0; k < a.length; k++) if (isFinite(a[k])) { if (a[k] < lo) lo = a[k]; if (a[k] > hi) hi = a[k]; } }
      acc(ex); acc(ap); if (!du) acc(cur.U);
      var pad = (hi - lo) * 0.1 || 1; lo -= pad; hi += pad;
      var spec = {
        xr: [0, 1], yr: [lo, hi], xlabel: 'x',
        bands: [{ x0: xs[sel] - d, x1: xs[sel] + d, fill: rgba(C.accent, 0.07), edge: rgba(C.accent, 0.5) }],
        lines: [{ x: X, y: ex, stroke: C.fg2, width: 2 }].concat(ap ? [{ x: X, y: ap, stroke: C.accent, width: 2.2 }] : []),
        ticks: Array.prototype.map.call(xs, function (x, I) { return { x: x, stroke: I === sel ? C.accent : C.fg2, width: I === sel ? 2.5 : 1.2, len: I === sel ? 10 : 6 }; }),
        points: du ? [] : Array.prototype.map.call(xs, function (x, I) { return { x: x, y: cur.U[I], r: I === sel ? 5.5 : 3.6, fill: C.gold, stroke: I === sel ? C.accent : C.fg, lw: I === sel ? 2 : 1 }; })
      };
      P1 = plot(cv1, spec, C);
      var it = [{ t: t('lgExact') + (du ? ' f′' : ' f'), c: C.fg2 }, { t: t('lgMls') + (du ? ' duʰ/dx' : ' uʰ'), c: C.accent }];
      if (!du) it.push({ t: t('lgNodes'), type: 'dot', c: C.gold, b: C.fg });
      it.push({ t: t('lgSupport') + ' ' + (sel + 1), type: 'band', c: rgba(C.accent, 0.18) });
      legend(1, it);
      var h = q('[data-cv="1"]').parentNode;
      h.querySelector('.rzt-h').textContent = t(du ? 'p1d' : 'p1');
      h.querySelector('.rzt-sub').textContent = t(du ? 'p1sd' : 'p1s');
    }

    function drawShape() {
      var n = S.n, sel = S.sel, xs = cur.nodes.xs, phi = cur.r.phi, d = S.alpha * cur.nodes.h, k, I;
      var lines = [], lo = -0.2, hi = 1.1, sum = new Float64Array(NGRID), wsel = new Float64Array(NGRID);
      var w0 = M.weight(S.weight, 0);
      for (I = 0; I < n; I++) {
        var y = new Float64Array(NGRID);
        for (k = 0; k < NGRID; k++) {
          var v = cur.r.sing[k] ? NaN : phi[k * n + I]; y[k] = v;
          if (isFinite(v)) { sum[k] += v; if (v < lo) lo = v; if (v > hi) hi = v; }
        }
        if (I !== sel) lines.push({ x: X, y: y, stroke: rgba(C.fg2, 0.32), width: 1 });
        else var ysel = y;
      }
      var mx = 0; for (k = 0; k < NGRID; k++) if (isFinite(ysel[k]) && ysel[k] > mx) mx = ysel[k];
      for (k = 0; k < NGRID; k++) { wsel[k] = M.weight(S.weight, Math.abs(X[k] - xs[sel]) / d) / w0 * (mx || 1); if (cur.r.sing[k]) sum[k] = NaN; }
      lines.push({ x: X, y: sum, stroke: C.fg, width: 1, dash: [2, 3] });
      lines.push({ x: X, y: wsel, stroke: C.gold, width: 1.8, dash: [6, 4] });
      lines.push({ x: X, y: ysel, stroke: C.accent, width: 2.4 });
      var pad = (hi - lo) * 0.06;
      plot(cv2, { xr: [0, 1], yr: [lo - pad, hi + pad], xlabel: 'x', lines: lines, hlines: [{ y: 0, stroke: C.border }],
                  ticks: Array.prototype.map.call(xs, function (x, J) { return { x: x, stroke: J === sel ? C.accent : C.fg2, width: J === sel ? 2.5 : 1.2, len: J === sel ? 10 : 6 }; }) }, C);
      legend(2, [{ t: t('lgPhi') + ' ' + (sel + 1), c: C.accent }, { t: t('lgW'), c: C.gold, dash: true }, { t: t('lgSum'), c: C.fg, dash: true }, { t: t('lgAll'), c: rgba(C.fg2, 0.6) }]);
    }

    function drawSweep() {
      var lo = Infinity, hi = 0, i, singBands = [], start = null;
      for (i = 0; i < sw.length; i++) {
        if (isFinite(sw[i]) && sw[i] > 0) { lo = Math.min(lo, sw[i]); hi = Math.max(hi, sw[i]); }
        var bad = !isFinite(sw[i]);
        if (bad && start === null) start = ALPHAS[i] - 0.025;
        if (!bad && start !== null) { singBands.push({ x0: Math.max(0.5, start), x1: ALPHAS[i] - 0.025, fill: rgba(C.fg2, 0.12) }); start = null; }
      }
      if (start !== null) singBands.push({ x0: Math.max(0.5, start), x1: 4, fill: rgba(C.fg2, 0.12) });
      var cv = cv3;
      if (!isFinite(lo)) { P3 = plot(cv, { xr: [0.5, 4], yr: [1e-3, 1], ylog: true, xlabel: 'α', bands: singBands,
        labels: [{ text: t('none'), fill: C.fg2, px: cv.clientWidth / 2, py: cv.clientHeight / 2 - 10, align: 'center' }] }, C); legend(3, []); return; }
      var e0 = Math.floor(Math.log10(lo)), e1 = Math.ceil(Math.log10(hi)); if (e1 - e0 < 1) e1 = e0 + 1;
      var spec = { xr: [0.5, 4], yr: [Math.pow(10, e0), Math.pow(10, e1)], ylog: true, xlabel: 'α', bands: singBands,
                   lines: [{ x: ALPHAS, y: sw, stroke: C.accent, width: 2.2 }],
                   vlines: [{ x: S.alpha, stroke: C.gold, width: 2 }], points: [] , labels: [] };
      if (cur.best >= 0) {
        spec.vlines.push({ x: ALPHAS[cur.best], stroke: rgba(C.fg, 0.45), width: 1, dash: [4, 4] });
        spec.points.push({ x: ALPHAS[cur.best], y: sw[cur.best], r: 5, fill: C.surface, stroke: C.fg, lw: 2 });
      }
      var e = S.metric === 'du' ? cur.ed : cur.eu;
      if (isFinite(e)) spec.points.push({ x: S.alpha, y: e, r: 4.5, fill: C.gold, stroke: C.fg, lw: 1 });
      if (singBands.length) spec.labels.push({ text: t('lgSing'), fill: C.fg2, x: singBands[0].x0 + 0.06, px: null, py: 14 });
      P3 = plot(cv, spec, C);
      var it = [{ t: t('lgErr') + ' (' + (S.metric === 'du' ? 'du/dx' : 'u') + ')', c: C.accent }, { t: t('lgCur'), c: C.gold }, { t: t('lgOpt') + ' = ' + (cur.best >= 0 ? ALPHAS[cur.best].toFixed(2) : '—'), type: 'dot', c: C.surface, b: C.fg }];
      if (singBands.length) it.push({ t: t('lgSing'), type: 'band', c: rgba(C.fg2, 0.25) });
      legend(3, it);
    }

    function syncControls() {
      q('[data-in="fn"]').value = S.fn; q('[data-in="weight"]').value = S.weight;
      q('[data-in="alpha"]').value = S.alpha; q('[data-in="n"]').value = S.n;
      q('[data-out="alpha"]').textContent = S.alpha.toFixed(2); q('[data-out="n"]').textContent = S.n;
      q('[data-out="sel"]').textContent = 'I = ' + (S.sel + 1) + ' / ' + S.n;
      ['basis', 'layout', 'show', 'metric'].forEach(function (g) {
        qa('[data-seg="' + g + '"] button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === S[g])); });
      });
      q('[data-act="shuffle"]').hidden = S.layout !== 'irregular';
    }

    function redraw() {
      if (!cur) return;
      syncControls(); setMetrics(); drawMain(); drawShape(); drawSweep();
    }
    var pending = false;
    function update(recompute) {
      if (recompute) compute();
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; redraw(); });
    }

    /* events */
    root.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-in'); if (!k) return;
      if (k === 'alpha') S.alpha = +e.target.value;
      else if (k === 'n') { S.n = +e.target.value; S.sel = Math.min(S.sel, S.n - 1); }
      else S[k] = e.target.value;
      update(true);
    });
    root.addEventListener('change', function (e) { if (e.target.tagName === 'SELECT') { S[e.target.getAttribute('data-in')] = e.target.value; update(true); } });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
      var sg = b.parentNode.getAttribute('data-seg');
      if (sg) { S[sg] = b.getAttribute('data-v'); update(sg !== 'show'); return; }
      var act = b.getAttribute('data-act');
      if (act === 'shuffle') { S.seed = (S.seed * 48271 + 11) % 2147483647; update(true); }
      else if (act === 'prev') { S.sel = (S.sel - 1 + S.n) % S.n; update(false); }
      else if (act === 'next') { S.sel = (S.sel + 1) % S.n; update(false); }
      else if (act === 'reset') { for (var k in DEFAULTS) S[k] = DEFAULTS[k]; update(true); }
    });
    function pickNode(cv, P, ev) {
      if (!P || !cur) return;
      var r = cv.getBoundingClientRect(), x = P.invX(ev.clientX - r.left), best = 0, bd = Infinity;
      for (var I = 0; I < cur.nodes.xs.length; I++) { var dd = Math.abs(cur.nodes.xs[I] - x); if (dd < bd) { bd = dd; best = I; } }
      S.sel = best; update(false);
    }
    cv1.addEventListener('click', function (ev) { pickNode(cv1, P1, ev); });
    cv2.addEventListener('click', function (ev) { pickNode(cv2, P1, ev); });
    var readEl = q('[data-read]');
    function alphaAt(ev) {
      if (!P3) return null;
      var r = cv3.getBoundingClientRect(), a = P3.invX(ev.clientX - r.left);
      a = Math.round(a / 0.05) * 0.05; return Math.max(0.5, Math.min(4, +a.toFixed(2)));
    }
    cv3.addEventListener('mousemove', function (ev) {
      var a = alphaAt(ev); if (a == null || !sw) return;
      var i = Math.round((a - 0.5) / 0.05), e = sw[i];
      readEl.textContent = isFinite(e) ? fill(t('read'), { a: a.toFixed(2), e: sci(e) }) : fill(t('readS'), { a: a.toFixed(2) });
    });
    cv3.addEventListener('mouseleave', function () { readEl.textContent = ''; });
    cv3.addEventListener('click', function (ev) { var a = alphaAt(ev); if (a == null) return; S.alpha = a; update(true); });

    /* host-page reactions: resize, theme, language */
    if ('ResizeObserver' in window) new ResizeObserver(function () { update(false); }).observe(root);
    else window.addEventListener('resize', function () { update(false); });
    function themeChanged() { C = readColors(root); update(false); }
    var mo = new MutationObserver(function (list) {
      list.forEach(function (m) { if (m.attributeName === 'data-rzlang') applyLang(); else themeChanged(); });
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-rzlang', 'data-theme'] });
    if (window.matchMedia) { var mq = window.matchMedia('(prefers-color-scheme: dark)'); (mq.addEventListener ? mq.addEventListener('change', themeChanged) : mq.addListener(themeChanged)); }

    compute(); applyLang();
  });
})();

window.RZTools.version='1.0.0';
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',window.RZTools.boot);else window.RZTools.boot();
