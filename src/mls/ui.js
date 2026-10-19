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
