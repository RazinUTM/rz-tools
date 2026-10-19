/* ═══════════════════════════════════════════════════════════════
   1D Bar FEM Explorer — UI
   Registered as RZTools tool 'bar1d'; mount with <div data-rz-tool="bar1d"></div>
   Browser version of the earlier Streamlit app (fem_app.py), extended with
   a distributed load, a tapered section, quadratic elements and exact curves.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var B = window.RZBAR, RZT = window.RZTools, U = RZT.util, fmt = U.fmt;

  var T = {
    en: {
      gModel: 'Bar and loads', gMesh: 'Mesh', gView: 'View',
      E: 'Young’s modulus `E (GPa)`', A0: 'Area at support `A₀ (m²)`', taper: 'Taper `A(L) / A₀`', L: 'Length `L (m)`', P: 'Tip load `P (kN)`', q: 'Distributed load `q (kN/m)`',
      n: 'Number of elements `n`', order: 'Element', lin: 'Linear (2-node)', quad: 'Quadratic (3-node)', scale: 'Deformation scale', reset: 'Reset',
      hintP: 'Positive = tension (→)', mU: 'max displacement · exact {v}', mS: 'max |σ| · exact {v}', mK: 'axial stiffness EA₀/L', mR: 'support reaction R = −(P + qL)',
      mN: 'elements / nodes', mE: 'relative error, energy norm',
      exactAll: 'Exact for every mesh: with a tip load on a uniform bar the axial force is constant, so linear elements reproduce the exact displacement and stress.',
      nodalExact: 'Nodal displacements are exact, but the stress is constant in each element while the exact stress varies linearly along the bar. Refine the mesh, or switch to quadratic elements.',
      quadExact: 'Quadratic elements reproduce the exact solution here, because the exact displacement is itself quadratic.',
      taperNote: 'For a tapered bar the exact displacement is logarithmic, so neither nodal values nor stresses are exact; the error falls as the mesh is refined.',
      p1: 'Deformed bar', p1s: 'Shaded by axial stress: blue is compression, maroon is tension. The dashed outline is the undeformed bar; bar height is proportional to A(x).',
      p2: 'Displacement u(x)', p3: 'Stress σ(x)', p23s: 'FE result against the exact solution. Hover to read values.',
      p4: 'Convergence', p4s: 'Relative energy-norm error against the number of elements for both element types, with the current bar and loads. A slope of −p means the error falls as hᵖ.',
      lgFE: 'FE', lgExact: 'exact', lgNodes: 'nodes', lgLin: 'linear', lgQuad: 'quadratic', lgCur: 'current mesh', rate: 'rate',
      convExact: 'The FE solution is exact for these loads with both element types, so there is no error to plot.',
      tU: 'Nodal displacements', tS: 'Element stresses', tCode: 'Python code (linear elements)',
      hNode: 'Node', hX: 'x (m)', hU: 'uʰ (mm)', hUx: 'exact (mm)', hEl: 'Element', hNodes: 'Nodes', hS: 'σ (MPa)', hF: 'N (kN)', hT: 'Type',
      tension: 'Tension', compression: 'Compression', zero: 'Zero', copy: 'Copy code', copied: 'Copied', copyFail: 'Select the code and copy it manually',
      read: '{x} m · FE {fe} · exact {ex} {u}', bad: 'Enter positive values for E, A₀ and L.'
    },
    ms: {
      gModel: 'Bar dan beban', gMesh: 'Mesh', gView: 'Paparan',
      E: 'Modulus Young `E (GPa)`', A0: 'Luas di support `A₀ (m²)`', taper: 'Tirus `A(L) / A₀`', L: 'Panjang `L (m)`', P: 'Beban hujung `P (kN)`', q: 'Beban teragih `q (kN/m)`',
      n: 'Bilangan element `n`', order: 'Element', lin: 'Linear (2 nod)', quad: 'Kuadratik (3 nod)', scale: 'Skala ubah bentuk', reset: 'Set semula',
      hintP: 'Positif = tegangan (→)', mU: 'sesaran maksimum · exact {v}', mS: 'max |σ| · exact {v}', mK: 'kekukuhan paksi EA₀/L', mR: 'tindak balas support R = −(P + qL)',
      mN: 'element / nod', mE: 'ralat relatif, energy norm',
      exactAll: 'Exact untuk setiap mesh: dengan beban di hujung bar seragam, daya paksi adalah malar, jadi element linear menghasilkan semula sesaran dan tegasan exact.',
      nodalExact: 'Sesaran nodal adalah exact, tetapi tegasan malar dalam setiap element manakala tegasan exact berubah secara linear sepanjang bar. Haluskan mesh, atau tukar ke element kuadratik.',
      quadExact: 'Element kuadratik menghasilkan semula exact solution di sini, kerana sesaran exact itu sendiri kuadratik.',
      taperNote: 'Bagi bar tirus, sesaran exact adalah logaritma, jadi nilai nodal dan tegasan tidak exact; ralat berkurang apabila mesh dihaluskan.',
      p1: 'Bar terubah bentuk', p1s: 'Diwarnakan mengikut tegasan paksi: biru ialah mampatan, maroon ialah tegangan. Garis putus-putus ialah bar asal; tinggi bar berkadar dengan A(x).',
      p2: 'Sesaran u(x)', p3: 'Tegasan σ(x)', p23s: 'Keputusan FE berbanding exact solution. Halakan untuk membaca nilai.',
      p4: 'Convergence', p4s: 'Ralat relatif energy norm berbanding bilangan element bagi kedua-dua jenis element, dengan bar dan beban semasa. Cerun −p bermaksud ralat jatuh mengikut hᵖ.',
      lgFE: 'FE', lgExact: 'exact', lgNodes: 'nod', lgLin: 'linear', lgQuad: 'kuadratik', lgCur: 'mesh semasa', rate: 'kadar',
      convExact: 'Penyelesaian FE adalah exact untuk beban ini dengan kedua-dua jenis element, jadi tiada ralat untuk diplot.',
      tU: 'Sesaran nodal', tS: 'Tegasan element', tCode: 'Kod Python (element linear)',
      hNode: 'Nod', hX: 'x (m)', hU: 'uʰ (mm)', hUx: 'exact (mm)', hEl: 'Element', hNodes: 'Nod', hS: 'σ (MPa)', hF: 'N (kN)', hT: 'Jenis',
      tension: 'Tegangan', compression: 'Mampatan', zero: 'Sifar', copy: 'Salin kod', copied: 'Disalin', copyFail: 'Pilih kod dan salin secara manual',
      read: '{x} m · FE {fe} · exact {ex} {u}', bad: 'Masukkan nilai positif untuk E, A₀ dan L.'
    }
  };

  var CODE = [
    'import numpy as np',
    '',
    'def solve_bar_fem(n_elem, E, A0, A1, L, P, q=0.0):',
    '    """Fixed-free bar with linear elements: tip load P, uniform load q,',
    '    area varying linearly from A0 at the support to A1 at the tip."""',
    '    n_nodes = n_elem + 1',
    '    Le = L / n_elem',
    '    x = np.linspace(0.0, L, n_nodes)',
    '    A = A0 + (A1 - A0) * x / L',
    '',
    '    K = np.zeros((n_nodes, n_nodes))',
    '    F = np.zeros(n_nodes)',
    '    for e in range(n_elem):',
    '        A_mean = 0.5 * (A[e] + A[e + 1])            # exact for a linear taper',
    '        ke = (E * A_mean / Le) * np.array([[1.0, -1.0],',
    '                                           [-1.0, 1.0]])',
    '        K[e:e + 2, e:e + 2] += ke',
    '        F[e:e + 2] += q * Le / 2                    # consistent nodal loads',
    '    F[-1] += P                                      # tip load',
    '',
    '    u = np.zeros(n_nodes)                           # u[0] = 0 (fixed support)',
    '    u[1:] = np.linalg.solve(K[1:, 1:], F[1:])',
    '',
    '    sigma = E * np.diff(u) / Le                     # constant stress per element',
    '    return x, u, sigma'
  ].join('\n');

  function num(k, step) { return '<input class="rzt-sel rzt-num" type="number" inputmode="decimal" step="' + step + '" data-in="' + k + '">'; }
  function rng(k, min, max, step) { return '<input class="rzt-rng" type="range" min="' + min + '" max="' + max + '" step="' + step + '" data-in="' + k + '">'; }
  function lab(k, out) { return '<span class="rzt-lab"><span data-k="' + k + '"></span>' + (out ? '<output data-out="' + k + '"></output>' : '') + '</span>'; }

  var HTML =
    '<div class="rzt-body">' +
      '<div class="rzt-ctrl">' +
        '<p class="rzt-grp" data-k="gModel"></p>' +
        '<label class="rzt-field">' + lab('E') + num('E', 10) + '</label>' +
        '<label class="rzt-field">' + lab('A0') + num('A0', 0.001) + '</label>' +
        '<label class="rzt-field">' + lab('taper', true) + rng('taper', 0.25, 1, 0.05) + '</label>' +
        '<label class="rzt-field">' + lab('L') + num('L', 0.1) + '</label>' +
        '<label class="rzt-field">' + lab('P') + num('P', 5) + '<span class="rzt-size" data-k="hintP"></span></label>' +
        '<label class="rzt-field">' + lab('q') + num('q', 5) + '</label>' +
        '<p class="rzt-grp" data-k="gMesh"></p>' +
        '<label class="rzt-field">' + lab('n', true) + rng('n', 1, 40, 1) + '</label>' +
        '<div class="rzt-field rzt-wide"><span class="rzt-lab" data-k="order"></span>' +
          '<div class="rzt-seg" role="group" data-seg="order"><button type="button" data-v="1" data-k="lin"></button><button type="button" data-v="2" data-k="quad"></button></div></div>' +
        '<p class="rzt-grp" data-k="gView"></p>' +
        '<label class="rzt-field">' + lab('scale', true) + rng('scale', 0, 3, 0.1) + '</label>' +
        '<button type="button" class="rzt-btn rzt-reset" data-act="reset" data-k="reset"></button>' +
      '</div>' +
      '<div class="rzt-main">' +
        '<div class="rzt-metrics">' +
          '<div class="rzt-m"><span class="rzt-mv"><span data-m="u"></span> <span class="rzt-chip" data-m="uc"></span></span><span class="rzt-ml" data-m="ul"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv"><span data-m="s"></span> <span class="rzt-chip" data-m="sc"></span></span><span class="rzt-ml" data-m="sl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="err"></span><span class="rzt-ml" data-k="mE"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="k"></span><span class="rzt-ml" data-k="mK"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="r"></span><span class="rzt-ml" data-k="mR"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="ne"></span><span class="rzt-ml" data-k="mN"></span></div>' +
        '</div>' +
        '<div class="rzt-note rzt-ok" data-note="ok" hidden></div>' +
        '<div class="rzt-note rzt-warn" data-note="warn" hidden></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p1"></span><span class="rzt-sub" data-k="p1s"></span></div>' +
          '<canvas class="rzt-cv rzt-cv-bar" data-cv="1"></canvas><div class="rzt-cbar" data-cbar></div></div>' +
        '<div class="rzt-pair">' +
          '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p2"></span><span class="rzt-sub" data-k="p23s"></span><div class="rzt-legend" data-lg="2"></div></div>' +
            '<canvas class="rzt-cv" data-cv="2"></canvas><span class="rzt-read" data-read="2"></span></div>' +
          '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p3"></span><span class="rzt-sub" data-k="p23s"></span><div class="rzt-legend" data-lg="3"></div></div>' +
            '<canvas class="rzt-cv" data-cv="3"></canvas><span class="rzt-read" data-read="3"></span></div>' +
        '</div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p4"></span><span class="rzt-sub" data-k="p4s"></span><div class="rzt-legend" data-lg="4"></div></div>' +
          '<canvas class="rzt-cv" data-cv="4"></canvas><span class="rzt-read" data-read="4"></span></div>' +
        '<details class="rzt-acc"><summary data-k="tU"></summary><div class="rzt-tblwrap" data-tbl="u"></div></details>' +
        '<details class="rzt-acc"><summary data-k="tS"></summary><div class="rzt-tblwrap" data-tbl="s"></div></details>' +
        '<details class="rzt-acc"><summary data-k="tCode"></summary><div class="rzt-code"><button type="button" class="rzt-btn" data-act="copy" data-k="copy"></button><pre><code></code></pre></div></details>' +
      '</div>' +
    '</div>';

  var DEFAULTS = { E: 200, A0: 0.01, taper: 1, L: 1, P: 50, q: 0, n: 4, order: 1, scale: 1 };   // E in GPa, P in kN, q in kN/m

  RZT.register('bar1d', function (root) {
    root.classList.add('rzt', 'rzt-on');
    root.innerHTML = HTML;
    root.querySelector('.rzt-code code').textContent = CODE;
    var S = {}, k; for (k in DEFAULTS) S[k] = DEFAULTS[k];
    var C = U.readColors(root), lang = 'en', md = null, conv = null, lastW = 0, P2 = null, P3 = null, P4 = null, curves = null;
    function q(sel) { return root.querySelector(sel); }
    function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    function t(key) { return (T[lang] || T.en)[key] || T.en[key] || key; }
    var cv1 = q('[data-cv="1"]'), cv2 = q('[data-cv="2"]'), cv3 = q('[data-cv="3"]'), cv4 = q('[data-cv="4"]');

    function params() {
      return { E: S.E * 1e9, A0: S.A0, A1: S.A0 * S.taper, L: S.L, P: S.P * 1e3, q: S.q * 1e3 };
    }
    function valid() { return S.E > 0 && S.A0 > 0 && S.L > 0 && isFinite(S.P) && isFinite(S.q); }

    function compute() {
      if (!valid()) { md = null; conv = null; return; }
      var p = params(); p.n = S.n; p.order = S.order;
      md = B.run(p);
      // exact curves on a fine grid, FE curves sampled inside every element
      var ex = md.ex, xs = [], ue = [], se = [], xf = [], uf = [], sf = [], i, e;
      for (i = 0; i <= 200; i++) { var x = S.L * i / 200; xs.push(x); ue.push(ex.u(x) * 1e3); se.push(ex.s(x) * 1e-6); }
      for (e = 0; e < md.n; e++) {
        for (i = 0; i <= 8; i++) { var f = B.fieldAt(md, e, -1 + 2 * i / 8); xf.push(f.x); uf.push(f.u * 1e3); sf.push(f.s * 1e-6); }
        xf.push(NaN); uf.push(NaN); sf.push(NaN);     // break the line between elements (stress jumps)
      }
      curves = { xs: xs, ue: ue, se: se, xf: xf, uf: uf, sf: sf };
      // convergence for both element types
      conv = { 1: [], 2: [] };
      [1, 2].forEach(function (o) { [1, 2, 4, 8, 16, 32].forEach(function (n) { var p2 = params(); p2.n = n; p2.order = o; conv[o].push({ n: n, e: B.energyError(B.run(p2)) }); }); });
      md.err = B.energyError(md);
    }

    /* metrics and notes */
    function setMetrics() {
      function put(key, v) { q('[data-m="' + key + '"]').textContent = v; }
      var ok = q('[data-note="ok"]'), warn = q('[data-note="warn"]'); ok.hidden = true; warn.hidden = true;
      if (!md) { ['u', 's', 'err', 'k', 'r', 'ne', 'ul', 'sl', 'uc', 'sc'].forEach(function (k2) { put(k2, '—'); }); put('ul', ''); put('sl', ''); put('uc', ''); put('sc', ''); warn.textContent = t('bad'); warn.hidden = false; return; }
      var umax = 0, ux = 0, smax = 0, sx = 0, i;
      for (i = 0; i < md.nn; i++) if (Math.abs(md.u[i]) > Math.abs(umax)) umax = md.u[i];
      for (i = 0; i < curves.xs.length; i++) { if (Math.abs(curves.ue[i]) > Math.abs(ux)) ux = curves.ue[i]; if (Math.abs(curves.se[i]) > Math.abs(sx)) sx = curves.se[i]; }
      for (i = 0; i < curves.sf.length; i++) if (isFinite(curves.sf[i]) && Math.abs(curves.sf[i]) > Math.abs(smax)) smax = curves.sf[i];
      put('u', fmt(umax * 1e3) + ' mm'); put('ul', U.fill(t('mU'), { v: fmt(ux) + ' mm' }));
      put('s', fmt(Math.abs(smax)) + ' MPa'); put('sl', U.fill(t('mS'), { v: fmt(Math.abs(sx)) + ' MPa' }));
      chip('uc', umax * 1e3, ux); chip('sc', Math.abs(smax), Math.abs(sx));
      put('err', md.err < 1e-10 ? '0' : md.err >= 1e-4 ? fmt(md.err * 100) + ' %' : U.sci(md.err));
      put('k', fmt(S.E * 1e3 * S.A0 / S.L) + ' MN/m'); put('r', fmt(md.reaction / 1e3) + ' kN'); put('ne', md.n + ' / ' + md.nn);
      var uniform = Math.abs(S.taper - 1) < 1e-9, msg = null;
      if (uniform && S.q === 0) msg = ['ok', t('exactAll')];
      else if (uniform && S.order === 2) msg = ['ok', t('quadExact')];
      else if (uniform) msg = ['warn', t('nodalExact')];
      else msg = ['warn', t('taperNote')];
      var el = msg[0] === 'ok' ? ok : warn; el.textContent = msg[1]; el.hidden = false;
    }
    function chip(key, fe, ex) {
      var c = q('[data-m="' + key + '"]'); c.className = 'rzt-chip';
      if (!ex) { c.textContent = ''; return; }
      var r = fe / ex, d = Math.abs(r - 1);
      c.textContent = (r * 100).toFixed(d < 1e-4 ? 0 : 1) + '%';
      c.classList.add(d <= 0.01 ? 'is-good' : d <= 0.05 ? 'is-ok' : 'is-bad');
    }

    /* bar diagram */
    function drawBar() {
      var dpr = window.devicePixelRatio || 1, W = cv1.clientWidth, H = cv1.clientHeight, g;
      if (!W || !H) return;
      if (cv1.width !== Math.round(W * dpr) || cv1.height !== Math.round(H * dpr)) { cv1.width = Math.round(W * dpr); cv1.height = Math.round(H * dpr); }
      g = cv1.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      var cbar = q('[data-cbar]');
      if (!md) { cbar.innerHTML = ''; return; }
      var L = S.L, umax = 0, i, e;
      for (i = 0; i < md.nn; i++) umax = Math.max(umax, Math.abs(md.u[i]));
      var sc = umax > 0 ? S.scale * 0.15 * L / umax : 0;
      var ml = 40, mr = 70, kx = (W - ml - mr) / (L * 1.2), cy = H / 2 - 4, hmax = Math.min(H * 0.24, 46), amax = Math.max(S.A0, S.A0 * S.taper);
      function SX(x) { return ml + x * kx; }
      function half(x) { return hmax * B.area(params(), x) / amax; }
      // values and colour scale
      var lo = Infinity, hi = -Infinity;
      curves.sf.forEach(function (v) { if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } });
      var bp = U.bandPainter(lo, hi, true, C, true);
      for (e = 0; e < md.n; e++) for (i = 0; i < 8; i++) {
        var a = B.fieldAt(md, e, -1 + 2 * i / 8), b = B.fieldAt(md, e, -1 + 2 * (i + 1) / 8);
        var xa = SX(a.x + sc * a.u), xb = SX(b.x + sc * b.u), ha = half(a.x), hb = half(b.x), va = a.s * 1e-6, vb = b.s * 1e-6;
        bp.tri([[xa, cy - ha, va], [xb, cy - hb, vb], [xb, cy + hb, vb]]);
        bp.tri([[xa, cy - ha, va], [xb, cy + hb, vb], [xa, cy + ha, va]]);
      }
      bp.paint(g);
      // undeformed outline
      g.save(); g.setLineDash([4, 3]); g.strokeStyle = U.rgba(C.fg2, 0.85); g.lineWidth = 1; g.beginPath();
      g.moveTo(SX(0), cy - half(0)); g.lineTo(SX(L), cy - half(L)); g.lineTo(SX(L), cy + half(L)); g.lineTo(SX(0), cy + half(0)); g.closePath(); g.stroke(); g.restore();
      // element boundaries and nodes
      g.strokeStyle = U.rgba(C.fg, 0.35); g.lineWidth = 0.8; g.beginPath();
      for (i = 0; i < md.nn; i += md.o) { var xn = SX(md.x[i] + sc * md.u[i]), hn = half(md.x[i]); g.moveTo(xn, cy - hn); g.lineTo(xn, cy + hn); }
      g.stroke();
      for (i = 0; i < md.nn; i++) {
        g.beginPath(); g.arc(SX(md.x[i] + sc * md.u[i]), cy, i % md.o === 0 ? 3.4 : 2.4, 0, Math.PI * 2);
        g.fillStyle = C.surface; g.fill(); g.lineWidth = 1.4; g.strokeStyle = C.fg; g.stroke();
      }
      // support wall
      var h0 = half(0) + 10; g.strokeStyle = C.fg2; g.lineWidth = 1.4; g.beginPath(); g.moveTo(SX(0), cy - h0); g.lineTo(SX(0), cy + h0);
      for (var y = cy - h0; y <= cy + h0; y += 7) { g.moveTo(SX(0), y); g.lineTo(SX(0) - 6, y + 5); }
      g.stroke();
      // loads
      g.strokeStyle = C.gold; g.fillStyle = C.gold; g.lineWidth = 2;
      var xt = SX(L + sc * md.u[md.nn - 1]);
      if (S.P !== 0) arrow(g, S.P > 0 ? xt + 6 : xt + 40, cy, S.P > 0 ? xt + 40 : xt + 6, cy, 'P');
      if (S.q !== 0) {
        g.lineWidth = 1.3;
        for (i = 0; i < 10; i++) {
          var xq = (i + 0.5) * L / 10, f2 = B.fieldAt(md, Math.min(md.n - 1, Math.floor(xq / md.Le)), ((xq % md.Le) / md.Le) * 2 - 1), xs = SX(xq + sc * f2.u), yq = cy - half(xq) - 9;
          arrow(g, S.q > 0 ? xs - 7 : xs + 7, yq, S.q > 0 ? xs + 7 : xs - 7, yq, '');
        }
      }
      U.colorbar(cbar, bp.cols, bp.lev, 'MPa');
    }
    function arrow(g, x0, y0, x1, y1, label) {
      var dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - ux * 6 - uy * 3.5, y1 - uy * 6 + ux * 3.5); g.lineTo(x1 - ux * 6 + uy * 3.5, y1 - uy * 6 - ux * 3.5); g.closePath(); g.fill();
      if (label) { g.font = '600 13px Poppins, system-ui, sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText(label, Math.max(x0, x1) + 6, y0); }
    }

    /* line plots */
    function linePlot(cv, lgId, ye, yf, unit, withNodes) {
      if (!md) return U.plot(cv, { xr: [0, 1], yr: [0, 1] }, C);
      var lo = Infinity, hi = -Infinity;
      ye.concat(yf).forEach(function (v) { if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } });
      if (lo > 0) lo = 0; if (hi < 0) hi = 0;
      var pad = (hi - lo) * 0.08 || 1; lo -= pad; hi += pad;
      var pts = [];
      if (withNodes) for (var i = 0; i < md.nn; i++) pts.push({ x: md.x[i], y: md.u[i] * 1e3, r: i % md.o === 0 ? 4 : 3, fill: C.accent, stroke: C.surface, lw: 1.4 });
      var P = U.plot(cv, { xr: [0, S.L], yr: [lo, hi], xlabel: 'x (m)', ylabel: unit, ml: 56, hlines: [{ y: 0, stroke: C.border, width: 1.5 }],
        lines: [{ x: curves.xs, y: ye, stroke: U.rgba(C.fg2, 0.45), width: 5 }, { x: curves.xf, y: yf, stroke: C.accent, width: 1.8 }], points: pts }, C);
      q('[data-lg="' + lgId + '"]').innerHTML = U.legendHtml([{ t: t('lgFE') + ' (' + t(S.order === 2 ? 'lgQuad' : 'lgLin') + ')', c: C.accent }, { t: t('lgExact'), c: U.rgba(C.fg2, 0.6) }]);
      return P;
    }
    function readLine(cv, P, ye, yf, unit, id, ev) {
      if (!P || !md) return;
      var r = cv.getBoundingClientRect(), x = Math.max(0, Math.min(S.L, P.invX(ev.clientX - r.left))), i, bi = 0, bd = Infinity;
      for (i = 0; i < curves.xf.length; i++) { if (!isFinite(curves.xf[i])) continue; var d = Math.abs(curves.xf[i] - x); if (d < bd) { bd = d; bi = i; } }
      var exv = unit === 'mm' ? md.ex.u(curves.xf[bi]) * 1e3 : md.ex.s(curves.xf[bi]) * 1e-6;
      q('[data-read="' + id + '"]').textContent = U.fill(t('read'), { x: fmt(curves.xf[bi]), fe: fmt(yf[bi]), ex: fmt(exv), u: unit });
    }
    cv2.addEventListener('mousemove', function (ev) { readLine(cv2, P2, curves.ue, curves.uf, 'mm', 2, ev); });
    cv3.addEventListener('mousemove', function (ev) { readLine(cv3, P3, curves.se, curves.sf, 'MPa', 3, ev); });
    [cv2, cv3].forEach(function (c, i) { c.addEventListener('mouseleave', function () { q('[data-read="' + (i + 2) + '"]').textContent = ''; }); });

    /* convergence */
    function drawConv() {
      var lg = q('[data-lg="4"]'), series = U.series(C), lines = [], pts = [], items = [], all = [];
      if (!md) { P4 = U.plot(cv4, { xr: [1, 100], yr: [1e-3, 1], xlog: true, ylog: true }, C); lg.innerHTML = ''; return; }
      [1, 2].forEach(function (o, i) {
        var P = conv[o].filter(function (p) { return p.e > 1e-12; }); if (!P.length) return;
        lines.push({ x: P.map(function (p) { return p.n; }), y: P.map(function (p) { return p.e; }), stroke: series[i], width: o === S.order ? 2.6 : 1.6 });
        P.forEach(function (p) { pts.push({ x: p.n, y: p.e, r: o === S.order ? 5 : 4, fill: series[i], stroke: C.surface, lw: 1.5, shape: i ? 'square' : 'circle' }); all.push(p); });
        var a = P[P.length - 2], b = P[P.length - 1], rate = a && b ? Math.log(a.e / b.e) / Math.log(b.n / a.n) : NaN;
        items.push({ t: t(o === 2 ? 'lgQuad' : 'lgLin') + (isFinite(rate) ? ' · ' + t('rate') + ' ' + rate.toFixed(2) : ''), c: series[i], type: 'marker', shape: i ? 'square' : 'circle' });
      });
      if (md.err > 1e-12) { pts.push({ x: md.n, y: md.err, r: 7.5, stroke: C.fg, lw: 1.8 }); items.push({ t: t('lgCur'), c: C.surface, type: 'dot', b: C.fg }); all.push({ n: md.n, e: md.err }); }
      var labels = [];
      if (!all.length) labels.push({ text: t('convExact'), fill: C.fg2, px: cv4.clientWidth / 2, py: cv4.clientHeight / 2 - 12, align: 'center', font: '12.5px Poppins, system-ui, sans-serif' });
      var dy = [1e-3, 1];
      if (all.length) {
        var mn = Math.min.apply(null, all.map(function (p) { return p.e; })), mx = Math.max.apply(null, all.map(function (p) { return p.e; }));
        dy = [Math.pow(10, Math.floor(Math.log10(mn))), Math.pow(10, Math.ceil(Math.log10(mx)))]; if (dy[1] / dy[0] < 100) dy[0] = dy[1] / 100;
      }
      P4 = U.plot(cv4, { xr: [1, 100], yr: dy, xlog: true, ylog: true, xlabel: 'n', lines: lines, points: pts, labels: labels }, C);
      lg.innerHTML = U.legendHtml(items);
    }
    cv4.addEventListener('mousemove', function (ev) {
      if (!P4 || !conv) return;
      var r = cv4.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, best = null, bd = 16 * 16;
      [1, 2].forEach(function (o) { conv[o].forEach(function (p) { if (!(p.e > 1e-12)) return; var dx = P4.X(p.n) - mx, dy = P4.Y(p.e) - my, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = { o: o, n: p.n, e: p.e }; } }); });
      q('[data-read="4"]').textContent = best ? t(best.o === 2 ? 'lgQuad' : 'lgLin') + ' · n = ' + best.n + ' · ' + U.sci(best.e) : '';
    });
    cv4.addEventListener('mouseleave', function () { q('[data-read="4"]').textContent = ''; });

    /* tables */
    function tables() {
      var tu = q('[data-tbl="u"]'), ts = q('[data-tbl="s"]');
      if (!md) { tu.innerHTML = ''; ts.innerHTML = ''; return; }
      var rows = [], i, e;
      for (i = 0; i < md.nn; i++) rows.push('<tr><td>' + i + '</td><td>' + md.x[i].toFixed(4) + '</td><td>' + (md.u[i] * 1e3).toPrecision(7) + '</td><td>' + (md.ex.u(md.x[i]) * 1e3).toPrecision(7) + '</td></tr>');
      tu.innerHTML = '<table class="rzt-tbl"><thead><tr><th>' + t('hNode') + '</th><th>' + t('hX') + '</th><th>' + t('hU') + '</th><th>' + t('hUx') + '</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
      rows = [];
      for (e = 0; e < md.n; e++) {
        var a = B.fieldAt(md, e, -1), b = B.fieldAt(md, e, 1), sm = (a.s + b.s) / 2, Am = B.area(params(), (a.x + b.x) / 2);
        var sTxt = md.o === 1 ? (a.s * 1e-6).toPrecision(6) : (a.s * 1e-6).toPrecision(5) + ' → ' + (b.s * 1e-6).toPrecision(5);
        var type = sm > 1e-9 ? t('tension') : sm < -1e-9 ? t('compression') : t('zero');
        rows.push('<tr><td>' + (e + 1) + '</td><td>' + (md.o * e) + '–' + (md.o * e + md.o) + '</td><td>' + sTxt + '</td><td>' + (sm * Am / 1e3).toPrecision(6) + '</td><td>' + type + '</td></tr>');
      }
      ts.innerHTML = '<table class="rzt-tbl"><thead><tr><th>' + t('hEl') + '</th><th>' + t('hNodes') + '</th><th>' + t('hS') + '</th><th>' + t('hF') + '</th><th>' + t('hT') + '</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
    }

    /* controls */
    function sync() {
      ['E', 'A0', 'L', 'P', 'q'].forEach(function (k2) { var el = q('[data-in="' + k2 + '"]'); if (document.activeElement !== el) el.value = S[k2]; });
      q('[data-in="taper"]').value = S.taper; q('[data-in="n"]').value = S.n; q('[data-in="scale"]').value = S.scale;
      q('[data-out="taper"]').textContent = S.taper.toFixed(2); q('[data-out="n"]').textContent = S.n;
      var um = 0; if (md) for (var i = 0; i < md.nn; i++) um = Math.max(um, Math.abs(md.u[i]));
      q('[data-out="scale"]').textContent = um > 0 ? '×' + fmt(S.scale * 0.15 * S.L / um) : S.scale.toFixed(1);
      qa('[data-seg="order"] button').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-v') === S.order)); });
    }
    function applyLang() {
      var b = document.body && document.body.getAttribute('data-rzlang'); lang = b === 'ms' ? 'ms' : 'en';
      qa('[data-k]').forEach(function (el) {
        var key = el.getAttribute('data-k'); if (!key) return;
        var txt = t(key);
        if (el.tagName !== 'OPTION' && /[`\u03B1-\u03C9]/.test(txt)) el.innerHTML = U.labelHtml(txt); else el.textContent = U.plain(txt);
      });
      redraw();
    }
    function redraw() {
      sync(); setMetrics(); drawBar();
      P2 = linePlot(cv2, 2, md ? curves.ue : [], md ? curves.uf : [], 'mm', true);
      P3 = linePlot(cv3, 3, md ? curves.se : [], md ? curves.sf : [], 'MPa', false);
      drawConv(); tables();
    }
    var pending = false, need = false;
    function update(recompute) {
      if (recompute) need = true;
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; if (need) { need = false; compute(); } redraw(); });
    }

    root.addEventListener('input', function (e) {
      var k2 = e.target.getAttribute('data-in'); if (!k2) return;
      var v = parseFloat(e.target.value); if (!isFinite(v)) return;
      S[k2] = v; update(k2 !== 'scale');
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
      if (b.parentNode.getAttribute('data-seg') === 'order') { S.order = +b.getAttribute('data-v'); update(true); return; }
      var act = b.getAttribute('data-act');
      if (act === 'reset') { for (var k3 in DEFAULTS) S[k3] = DEFAULTS[k3]; update(true); }
      else if (act === 'copy') {
        var done = function (ok) { b.textContent = t(ok ? 'copied' : 'copyFail'); setTimeout(function () { b.textContent = t('copy'); }, 1800); };
        try {
          navigator.clipboard.writeText(CODE).then(function () { done(true); }, function () { selectCode(); done(false); });
        } catch (err) { selectCode(); done(false); }
      }
    });
    function selectCode() { try { var r = document.createRange(); r.selectNodeContents(q('.rzt-code code')); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) { /* ignore */ } }

    if ('ResizeObserver' in window) new ResizeObserver(function () { var w = root.clientWidth; if (w !== lastW) { lastW = w; update(false); } }).observe(root);
    else window.addEventListener('resize', function () { update(false); });
    function themeChanged() { C = U.readColors(root); update(false); }
    var mo = new MutationObserver(function (list) { list.forEach(function (m) { if (m.attributeName === 'data-rzlang') applyLang(); else themeChanged(); }); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-rzlang', 'data-theme'] });
    if (window.matchMedia) { var mq = window.matchMedia('(prefers-color-scheme: dark)'); (mq.addEventListener ? mq.addEventListener('change', themeChanged) : mq.addListener(themeChanged)); }

    compute(); applyLang();
  });
})();
