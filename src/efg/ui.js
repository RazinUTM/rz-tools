/* ═══════════════════════════════════════════════════════════════
   2D Meshfree (EFG) Explorer — UI
   Registered as RZTools tool 'efg2d'; mount with <div data-rz-tool="efg2d"></div>
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var G = window.RZEFG, F = window.RZFEM, RZT = window.RZTools, U = RZT.util, fmt = U.fmt, FIELD = U.FIELD, SYM = U.FSYM;
  var SHAPES = ['circle', 'square', 'tri', 'diamond'];

  var T = {
    en: {
      gModel: 'Model', gMf: 'Meshfree approximation', gNodes: 'Nodes', gView: 'View',
      problem: 'Problem', pcantilever: 'Cantilever (Timoshenko)', phole: 'Plate with a hole (Kirsch)', ppatch: 'Patch test',
      ld: 'Span / depth `L/D`', support: 'Left support', supExact: 'Exact', supClamp: 'Clamped', ar: 'Hole radius `a / b`', outer: 'Outer edges',
      outKirsch: 'Kirsch', outUniform: 'Uniform', nu: 'Poisson’s ratio ν',
      basis: 'Basis', lin: 'Linear', quad: 'Quadratic', weight: 'Weight function', cubic: 'Cubic spline', quartic: 'Quartic spline',
      alpha: 'Dilation parameter α', bc: 'Essential BCs', nitsche: 'Nitsche', penalty: 'Penalty', pexp: 'Penalty `β = 10ᵖ E/h`, p', ng: 'Gauss points per cell',
      ncantilever: 'Nodes through depth − 1', nhole: 'Nodes along radius − 1', npatch: 'Nodes per side − 1', size: '{nodes} nodes · {dof} DOF · {gp} Gauss points',
      distort: 'Distortion', shuffle: 'New layout',
      field: 'Contour', fsvm: 'Von Mises stress', fsxx: 'Stress σxx', fsyy: 'Stress σyy', fsxy: 'Shear stress τxy', fumag: 'Displacement |u|', fux: 'Displacement ux', fuy: 'Displacement uy',
      fphi: 'Shape function φ of the selected node', show: 'Show', oNodes: 'Nodes', oSupport: 'Support', oCells: 'Cells', oGauss: 'Gauss points',
      scale: 'Deformation scale', reset: 'Reset',
      mDof: 'DOF · {nn} nodes · {gp} Gauss points', mTip: 'Tip deflection v(L, 0) · Timoshenko {v}', mScf: 'SCF = σxx(0, a) / σ₀ · Kirsch {v}', mScfU: 'SCF = σxx(0, a) / σ₀ · Kirsch ∞ plate 3',
      mPatch: 'max |σ − σexact| / σ₀', mErr: 'Relative error, energy norm', mErrNone: 'Energy-norm error · needs an exact solution', mBc: 'max |uʰ − ū| on supported edges', mSup: 'nodes per support, mean ({a}–{b})', mTime: 'assemble + solve',
      pass: 'passed', notExact: 'not exact',
      singularA: 'A(x) is singular at {n} Gauss points: their supports contain too few nodes for the {basis} basis. Increase α.',
      singular: 'The stiffness matrix is not positive definite. Increase α, or use more Gauss points per cell.',
      penHigh: 'Large penalty factor: the supported edge is over-constrained and the equations become ill-conditioned, so the error grows again. Nitsche’s method enforces the condition without this trade-off.',
      penLow: 'Small penalty factor: the boundary condition is only weakly enforced. Compare the boundary error with Nitsche’s method.',
      patchNote: 'EFG does not pass the patch test exactly. MLS shape functions are rational and their supports do not line up with the background cells, so Gauss quadrature leaves an integration error. Add Gauss points per cell and watch it fall.',
      clamped: 'Clamped support: every point on x = 0 is fixed, so no error norm is shown, and the stresses at the clamped corners are singular.',
      uniform: 'Uniform tension on a finite plate: Kirsch’s solution is for an infinite plate, so no error norm is shown.',
      phiNote: 'MLS shape functions do not interpolate: at its own node, φ = {v} rather than 1. The nodal parameters uᵢ are therefore not the displacements at the nodes, which is why essential boundary conditions need special treatment.',
      big: 'Large model: it solves when you release the slider.', solving: 'Solving…', fail2: 'The model could not be solved.',
      p1s: '{f} on the deformed shape (displacements × {s}). Tap a node to select it; hover to read values. The dashed line is the path plotted below.',
      p1sU: '{f} on the undeformed shape. Tap a node to select it; hover to read values. The dashed line is the path plotted below.',
      p2: 'Along a line', p2s: 'EFG result against the reference solution. Hover to read values.',
      lcantilever_sxx: 'σxx through the depth at x = L/2', lcantilever_sxy: 'τxy through the depth at x = L/2', lcantilever_uy: 'Deflection along the axis y = 0',
      lhole_sxx: 'σxx along x = 0, from the hole to the edge', lhole_stt: 'σθθ around the hole, θ = 0° → 90°', lpatch_sxx: 'σxx along y = 0.5', lpatch_ux: 'ux along y = 0.5',
      lgFE: 'EFG', lgExact: 'exact', lgKirsch: 'Kirsch (infinite plate)', lgTimo: 'Timoshenko (exact support)',
      p3: 'EFG against FEM', p3s: 'Relative energy-norm error against DOF on the same nodes: EFG with linear basis (α = 2.5) under Nitsche and penalty conditions, quadratic basis (α = 3.5), and bilinear Q4 finite elements. Weight function, Gauss points, ν, geometry and distortion follow your settings.',
      run: 'Run comparison', running: 'Solving {i} of {n}…', stale: 'Settings changed since the last run. Run it again.', idle: 'Press “Run comparison” to solve 16 models, from coarse to fine.',
      noExact: 'The comparison needs an exact solution: choose the exact support or Kirsch tractions.', noPatch: 'Use the cantilever or the plate with a hole for the comparison.',
      sLinN: 'EFG linear · Nitsche', sLinP: 'EFG linear · penalty', sQuadN: 'EFG quadratic · Nitsche', sQ4: 'FEM Q4', rate: 'rate', cur: 'current model',
      readNode: 'node {i} at ({x}, {y}) m · {f} = {v}', readExact: ' · exact {v}', readPar: ' · nodal parameter {v}', readLine: '{x} · EFG {fe} · ref {ex} {u}', readConv: '{s} · {dof} DOF · error {e}'
    },
    ms: {
      gModel: 'Model', gMf: 'Approximation meshfree', gNodes: 'Nod', gView: 'Paparan',
      problem: 'Masalah', pcantilever: 'Cantilever (Timoshenko)', phole: 'Plat berlubang (Kirsch)', ppatch: 'Patch test',
      ld: 'Rentang / kedalaman `L/D`', support: 'Support kiri', supExact: 'Exact', supClamp: 'Clamped', ar: 'Jejari lubang `a / b`', outer: 'Sisi luar',
      outKirsch: 'Kirsch', outUniform: 'Seragam', nu: 'Poisson’s ratio ν',
      basis: 'Basis', lin: 'Linear', quad: 'Kuadratik', weight: 'Weight function', cubic: 'Cubic spline', quartic: 'Quartic spline',
      alpha: 'Dilation parameter α', bc: 'Essential BCs', nitsche: 'Nitsche', penalty: 'Penalti', pexp: 'Penalti `β = 10ᵖ E/h`, p', ng: 'Gauss points setiap cell',
      ncantilever: 'Nod merentas kedalaman − 1', nhole: 'Nod sepanjang jejari − 1', npatch: 'Nod setiap sisi − 1', size: '{nodes} nod · {dof} DOF · {gp} Gauss points',
      distort: 'Herotan', shuffle: 'Susunan baharu',
      field: 'Kontur', fsvm: 'Tegasan von Mises', fsxx: 'Tegasan σxx', fsyy: 'Tegasan σyy', fsxy: 'Tegasan ricih τxy', fumag: 'Sesaran |u|', fux: 'Sesaran ux', fuy: 'Sesaran uy',
      fphi: 'Shape function φ bagi nod terpilih', show: 'Papar', oNodes: 'Nod', oSupport: 'Support', oCells: 'Cell', oGauss: 'Gauss points',
      scale: 'Skala ubah bentuk', reset: 'Set semula',
      mDof: 'DOF · {nn} nod · {gp} Gauss points', mTip: 'Pesongan hujung v(L, 0) · Timoshenko {v}', mScf: 'SCF = σxx(0, a) / σ₀ · Kirsch {v}', mScfU: 'SCF = σxx(0, a) / σ₀ · Kirsch plat ∞ 3',
      mPatch: 'max |σ − σexact| / σ₀', mErr: 'Ralat relatif, energy norm', mErrNone: 'Ralat energy norm · perlukan exact solution', mBc: 'max |uʰ − ū| pada sisi bersokong', mSup: 'nod setiap support, purata ({a}–{b})', mTime: 'assemble + solve',
      pass: 'lulus', notExact: 'tidak exact',
      singularA: 'A(x) singular pada {n} Gauss points: support-nya mengandungi terlalu sedikit nod untuk basis {basis}. Naikkan α.',
      singular: 'Stiffness matrix tidak positive definite. Naikkan α, atau gunakan lebih banyak Gauss points setiap cell.',
      penHigh: 'Faktor penalti besar: sisi bersokong terlalu dikekang dan persamaan menjadi ill-conditioned, jadi ralat meningkat semula. Kaedah Nitsche mengenakan syarat ini tanpa tukar ganti tersebut.',
      penLow: 'Faktor penalti kecil: syarat sempadan hanya dikenakan secara lemah. Bandingkan ralat sempadan dengan kaedah Nitsche.',
      patchNote: 'EFG tidak lulus patch test secara exact. MLS shape functions adalah rasional dan support-nya tidak sejajar dengan background cells, jadi Gauss quadrature meninggalkan ralat kamiran. Tambah Gauss points setiap cell dan lihat ia berkurang.',
      clamped: 'Support clamped: setiap titik pada x = 0 ditetapkan, jadi energy norm tidak dipaparkan, dan tegasan di sudut clamped adalah singular.',
      uniform: 'Tegangan seragam pada plat terhingga: penyelesaian Kirsch adalah untuk plat tak terhingga, jadi energy norm tidak dipaparkan.',
      phiNote: 'MLS shape functions tidak menginterpolasi: pada nodnya sendiri, φ = {v}, bukan 1. Oleh itu parameter nodal uᵢ bukan sesaran pada nod, dan inilah sebabnya essential boundary conditions memerlukan rawatan khas.',
      big: 'Model besar: ia diselesaikan apabila anda melepaskan slider.', solving: 'Menyelesaikan…', fail2: 'Model tidak dapat diselesaikan.',
      p1s: '{f} pada bentuk terubah (sesaran × {s}). Ketik nod untuk memilihnya; halakan untuk membaca nilai. Garis putus-putus ialah laluan yang diplot di bawah.',
      p1sU: '{f} pada bentuk asal. Ketik nod untuk memilihnya; halakan untuk membaca nilai. Garis putus-putus ialah laluan yang diplot di bawah.',
      p2: 'Sepanjang satu garis', p2s: 'Keputusan EFG berbanding penyelesaian rujukan. Halakan untuk membaca nilai.',
      lcantilever_sxx: 'σxx merentas kedalaman pada x = L/2', lcantilever_sxy: 'τxy merentas kedalaman pada x = L/2', lcantilever_uy: 'Pesongan sepanjang paksi y = 0',
      lhole_sxx: 'σxx sepanjang x = 0, dari lubang ke sisi', lhole_stt: 'σθθ sekeliling lubang, θ = 0° → 90°', lpatch_sxx: 'σxx sepanjang y = 0.5', lpatch_ux: 'ux sepanjang y = 0.5',
      lgFE: 'EFG', lgExact: 'exact', lgKirsch: 'Kirsch (plat tak terhingga)', lgTimo: 'Timoshenko (support exact)',
      p3: 'EFG berbanding FEM', p3s: 'Ralat relatif energy norm berbanding DOF pada nod yang sama: EFG dengan basis linear (α = 2.5) di bawah syarat Nitsche dan penalti, basis kuadratik (α = 3.5), dan finite element bilinear Q4. Weight function, Gauss points, ν, geometri dan herotan mengikut tetapan anda.',
      run: 'Jalankan perbandingan', running: 'Menyelesaikan {i} daripada {n}…', stale: 'Tetapan telah berubah sejak larian terakhir. Jalankan semula.', idle: 'Tekan “Jalankan perbandingan” untuk menyelesaikan 16 model, dari kasar ke halus.',
      noExact: 'Perbandingan ini perlukan exact solution: pilih support exact atau traction Kirsch.', noPatch: 'Gunakan cantilever atau plat berlubang untuk perbandingan.',
      sLinN: 'EFG linear · Nitsche', sLinP: 'EFG linear · penalti', sQuadN: 'EFG kuadratik · Nitsche', sQ4: 'FEM Q4', rate: 'kadar', cur: 'model semasa',
      readNode: 'nod {i} pada ({x}, {y}) m · {f} = {v}', readExact: ' · exact {v}', readPar: ' · parameter nodal {v}', readLine: '{x} · EFG {fe} · rujukan {ex} {u}', readConv: '{s} · {dof} DOF · ralat {e}'
    }
  };

  var NMAX = { cantilever: 10, hole: 14, patch: 10 };
  var LINES = { cantilever: ['sxx', 'sxy', 'uy'], hole: ['sxx', 'stt'], patch: ['sxx', 'ux'] };
  var STUDY_N = { cantilever: [2, 3, 4, 6], hole: [4, 6, 8, 12] };
  var SERIES = [{ k: 'sLinN', basis: 'lin', alpha: 2.5, bc: 'nitsche' }, { k: 'sLinP', basis: 'lin', alpha: 2.5, bc: 'penalty' },
                { k: 'sQuadN', basis: 'quad', alpha: 3.5, bc: 'nitsche' }, { k: 'sQ4', fem: true }];
  var LIVE_COST = 4e6, SUB = 3;

  function seg(name, opts) {
    return '<div class="rzt-seg" role="group" data-seg="' + name + '">' + opts.map(function (o) {
      return '<button type="button" data-v="' + o[0] + '"' + (o[1] ? ' data-k="' + o[1] + '"' : '') + '>' + (o[2] || '') + '</button>';
    }).join('') + '</div>';
  }
  function rng(k, min, max, step) { return '<input class="rzt-rng" type="range" min="' + min + '" max="' + max + '" step="' + step + '" data-in="' + k + '">'; }
  function lab(k, out) { return '<span class="rzt-lab"><span data-k="' + k + '"></span>' + (out ? '<output data-out="' + k + '"></output>' : '') + '</span>'; }

  var HTML =
    '<div class="rzt-body">' +
      '<div class="rzt-ctrl">' +
        '<p class="rzt-grp" data-k="gModel"></p>' +
        '<label class="rzt-field rzt-wide"><span class="rzt-lab" data-k="problem"></span>' +
          '<select class="rzt-sel" data-in="problem"><option value="cantilever" data-k="pcantilever"></option><option value="hole" data-k="phole"></option><option value="patch" data-k="ppatch"></option></select></label>' +
        '<label class="rzt-field" data-only="cantilever">' + lab('ld', true) + rng('ld', 2, 12, 1) + '</label>' +
        '<div class="rzt-field" data-only="cantilever"><span class="rzt-lab" data-k="support"></span>' + seg('support', [['exact', 'supExact'], ['clamped', 'supClamp']]) + '</div>' +
        '<label class="rzt-field" data-only="hole">' + lab('ar', true) + rng('ar', 0.1, 0.5, 0.05) + '</label>' +
        '<div class="rzt-field" data-only="hole"><span class="rzt-lab" data-k="outer"></span>' + seg('outer', [['kirsch', 'outKirsch'], ['uniform', 'outUniform']]) + '</div>' +
        '<label class="rzt-field">' + lab('nu', true) + rng('nu', 0, 0.49, 0.01) + '</label>' +
        '<p class="rzt-grp" data-k="gMf"></p>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="basis"></span>' + seg('basis', [['lin', 'lin'], ['quad', 'quad']]) + '</div>' +
        '<label class="rzt-field"><span class="rzt-lab" data-k="weight"></span><select class="rzt-sel" data-in="weight"><option value="cubic" data-k="cubic"></option><option value="quartic" data-k="quartic"></option></select></label>' +
        '<label class="rzt-field">' + lab('alpha', true) + rng('alpha', 1, 4, 0.1) + '</label>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="bc"></span>' + seg('bc', [['nitsche', 'nitsche'], ['penalty', 'penalty']]) + '</div>' +
        '<label class="rzt-field" data-pen>' + lab('pexp', true) + rng('pexp', 0, 8, 1) + '</label>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="ng"></span>' + seg('ng', [['2', '', '2×2'], ['3', '', '3×3'], ['4', '', '4×4'], ['5', '', '5×5']]) + '</div>' +
        '<p class="rzt-grp" data-k="gNodes"></p>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-kn="n"></span><output data-out="n"></output></span>' + rng('n', 1, 10, 1) + '<span class="rzt-size" data-out="size"></span></label>' +
        '<div class="rzt-field">' + lab('distort', true) + rng('distort', 0, 0.4, 0.05) + '<button type="button" class="rzt-btn" data-act="shuffle" data-k="shuffle"></button></div>' +
        '<p class="rzt-grp" data-k="gView"></p>' +
        '<label class="rzt-field rzt-wide"><span class="rzt-lab" data-k="field"></span>' +
          '<select class="rzt-sel" data-in="field">' + ['svm', 'sxx', 'syy', 'sxy', 'umag', 'ux', 'uy', 'phi'].map(function (f) { return '<option value="' + f + '" data-k="f' + f + '"></option>'; }).join('') + '</select></label>' +
        '<div class="rzt-field rzt-wide"><span class="rzt-lab" data-k="show"></span><div class="rzt-chips" data-toggles>' +
          '<button type="button" data-ov="nodes" data-k="oNodes"></button><button type="button" data-ov="support" data-k="oSupport"></button>' +
          '<button type="button" data-ov="cells" data-k="oCells"></button><button type="button" data-ov="gauss" data-k="oGauss"></button></div></div>' +
        '<label class="rzt-field">' + lab('scale', true) + rng('scale', 0, 3, 0.1) + '</label>' +
        '<button type="button" class="rzt-btn rzt-reset" data-act="reset" data-k="reset"></button>' +
      '</div>' +
      '<div class="rzt-main">' +
        '<div class="rzt-metrics">' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="dof"></span><span class="rzt-ml" data-m="dofl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv"><span data-m="q"></span> <span class="rzt-chip" data-m="qc"></span></span><span class="rzt-ml" data-m="ql"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="err"></span><span class="rzt-ml" data-m="errl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="bc"></span><span class="rzt-ml" data-k="mBc"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="sup"></span><span class="rzt-ml" data-m="supl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="time"></span><span class="rzt-ml" data-k="mTime"></span></div>' +
        '</div>' +
        '<div class="rzt-note rzt-warn" data-note="warn" hidden></div>' +
        '<div class="rzt-note rzt-ok" data-note="ok" hidden></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-h="1"></span><span class="rzt-sub" data-sub="1"></span></div>' +
          '<div class="rzt-cvwrap"><canvas class="rzt-cv rzt-cv-fem" data-cv="1"></canvas><canvas class="rzt-ov" data-ov="1" aria-hidden="true"></canvas></div>' +
          '<div class="rzt-cbar" data-cbar></div><span class="rzt-read rzt-read-b" data-read="1"></span></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p2"></span>' +
          '<select class="rzt-sel rzt-sel-inline" data-in="line"></select><span class="rzt-sub" data-k="p2s"></span><div class="rzt-legend" data-lg="2"></div></div>' +
          '<canvas class="rzt-cv" data-cv="2"></canvas><span class="rzt-read" data-read="2"></span></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p3"></span><span class="rzt-sub" data-k="p3s"></span>' +
          '<div class="rzt-row"><button type="button" class="rzt-btn rzt-primary" data-act="study" data-k="run"></button><span class="rzt-sub" data-out="study"></span></div>' +
          '<div class="rzt-legend" data-lg="3"></div></div>' +
          '<canvas class="rzt-cv" data-cv="3"></canvas><span class="rzt-read" data-read="3"></span></div>' +
      '</div>' +
    '</div>';

  var DEFAULTS = { problem: 'cantilever', ld: 5, support: 'exact', ar: 0.25, outer: 'kirsch', nu: 0.3, basis: 'lin', weight: 'cubic', alpha: 2.5,
                   bc: 'nitsche', pexp: 3, ng: '4', distort: 0, seed: 7, field: 'svm', scale: 1, line: 'sxx',
                   n: { cantilever: 4, hole: 8, patch: 4 }, ov: { nodes: true, support: true, cells: false, gauss: false }, sel: null };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  RZT.register('efg2d', function (root) {
    root.classList.add('rzt', 'rzt-on');
    root.innerHTML = HTML;
    var S = clone(DEFAULTS), C = U.readColors(root), lang = 'en', cur = null, study = null, studyTok = 0, lastW = 0;
    function q(sel) { return root.querySelector(sel); }
    function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    function t(k) { return (T[lang] || T.en)[k] || T.en[k] || k; }
    var cv1 = q('[data-cv="1"]'), ov1 = q('[data-ov="1"]'), cv2 = q('[data-cv="2"]'), cv3 = q('[data-cv="3"]');
    var view = null, P2 = null, P3 = null, lineData = null, convPts = [];

    function cfg(extra) {
      var c = { problem: S.problem, n: S.n[S.problem], ld: S.ld, support: S.support, ar: S.ar, outer: S.outer, nu: S.nu, distort: S.distort, seed: S.seed,
                basis: S.basis, weight: S.weight, alpha: S.alpha, bc: S.bc, pexp: S.pexp, ng: +S.ng };
      for (var k in extra) c[k] = extra[k];
      return c;
    }
    function cost(c) { var sz = G.size(c), k = 3.1 * c.alpha * c.alpha; return sz.gauss * k * k * (c.basis === 'quad' ? 1.6 : 1); }
    function studyKey() { return [S.problem, S.ld, S.support, S.ar, S.outer, S.nu, S.distort, S.seed, S.weight, S.ng, S.pexp].join('|'); }

    /* ── compute ───────────────────────────────────────────────── */
    function compute() {
      var key = JSON.stringify(cfg());
      if (cur && cur.key === key) { computeLine(); return; }
      var m = G.run(cfg()), r = { model: m, key: key };
      if (!m.error) {
        var md = m.md, nn = md.nn, i, out = new Float64Array(5);
        r.err = G.energyError(m); r.bc = G.bcError(m); r.sup = G.supportStats(m);
        // values at the nodes (uʰ(x_I), not the nodal parameters) and on a sub-grid of every background cell
        r.nodeV = new Float64Array(nn * 5);
        for (i = 0; i < nn; i++) { var v = G.evalAt(m, md.X[i], md.Y[i], out); if (v) r.nodeV.set(v, i * 5); }
        var mesh = md.mesh, ne = mesh.ne, np = (SUB + 1) * (SUB + 1), PX = new Float64Array(ne * np), PY = new Float64Array(ne * np), V = new Float64Array(ne * np * 5).fill(NaN);
        for (var e = 0; e < ne; e++) {
          var cs = [], ct = []; for (var a = 0; a < 4; a++) { cs.push(mesh.PS[mesh.C[e * 4 + a]]); ct.push(mesh.PT[mesh.C[e * 4 + a]]); }
          for (var jj = 0; jj <= SUB; jj++) for (var ii = 0; ii <= SUB; ii++) {
            var xi = -1 + 2 * ii / SUB, eta = -1 + 2 * jj / SUB, N = [(1 - xi) * (1 - eta) / 4, (1 + xi) * (1 - eta) / 4, (1 + xi) * (1 + eta) / 4, (1 - xi) * (1 + eta) / 4];
            var s = 0, tt = 0; for (a = 0; a < 4; a++) { s += N[a] * cs[a]; tt += N[a] * ct[a]; }
            var xy = md.G(s, tt), k = e * np + jj * (SUB + 1) + ii;
            PX[k] = xy[0]; PY[k] = xy[1];
            var w = G.evalAt(m, xy[0], xy[1], out); if (w) V.set(w, k * 5);
          }
        }
        r.grid = { PX: PX, PY: PY, V: V, np: np };
        var umax = 0, vmax = 0;
        for (i = 0; i < ne * np; i++) {
          var ux = V[i * 5], uy = V[i * 5 + 1]; if (!isFinite(ux)) continue;
          umax = Math.max(umax, Math.hypot(ux, uy)); vmax = Math.max(vmax, F.fieldOf('svm', [ux, uy], [V[i * 5 + 2], V[i * 5 + 3], V[i * 5 + 4]]));
        }
        r.umax = umax; r.vmax = vmax;
        var pr = m.pr;
        if (pr.key === 'cantilever') { var tp = G.evalAt(m, pr.L, 0); r.q = tp ? tp[1] : NaN; r.qref = pr.ref.tip; }
        else if (pr.key === 'hole') { var hp = G.evalAt(m, 0, pr.a); r.q = hp ? hp[2] / pr.s0 : NaN; }
        else { var er = 0; for (i = 0; i < ne * np; i++) if (isFinite(V[i * 5 + 2])) er = Math.max(er, Math.abs(V[i * 5 + 2] - pr.s0), Math.abs(V[i * 5 + 3]), Math.abs(V[i * 5 + 4])); r.q = er / pr.s0; }
        // GP displacement for the overlay
        r.gpU = new Float64Array(m.ngp * 2);
        for (i = 0; i < m.ngp; i++) for (k = m.start[i]; k < m.start[i + 1]; k++) { r.gpU[2 * i] += m.PH[k] * m.u[2 * m.IDX[k]]; r.gpU[2 * i + 1] += m.PH[k] * m.u[2 * m.IDX[k] + 1]; }
        // fixed flags per dof for support glyphs
        r.fixed = new Uint8Array(2 * nn);
        md.mesh.bedges.forEach(function (be) { be.n.forEach(function (nd) { var dv = md.dirichlet(be.tag, md.X[nd], md.Y[nd]); if (!dv) return; if (dv[0] != null) r.fixed[2 * nd] = 1; if (dv[1] != null) r.fixed[2 * nd + 1] = 1; }); });
        if (S.sel == null || S.sel >= nn) S.sel = defaultNode(md);
      }
      cur = r;
      computeLine();
    }
    function defaultNode(md) {
      var bb = md.pr.bbox, cx = md.pr.key === 'hole' ? md.pr.a * 1.6 / Math.SQRT2 : (bb[0] + bb[1]) / 2, cy = md.pr.key === 'hole' ? cx : (bb[2] + bb[3]) / 2, best = 0, bd = Infinity;
      for (var i = 0; i < md.nn; i++) { var d = Math.hypot(md.X[i] - cx, md.Y[i] - cy); if (d < bd) { bd = d; best = i; } }
      return best;
    }

    function lineDef() {
      var pr = cur.model.pr, key = S.line;
      if (pr.key === 'cantilever') {
        var L = pr.L, D = pr.D, tm = pr.timo;
        if (key === 'uy') return { f: 'uy', xr: [0, L], xl: 'x (m)', pt: function (s) { return [s, 0]; }, ref: function (s) { return tm.u(s, 0)[1]; } };
        var c = key === 'sxy' ? 2 : 0;
        return { f: key === 'sxy' ? 'sxy' : 'sxx', xr: [-D / 2, D / 2], xl: 'y (m)', pt: function (s) { return [L / 2, s]; }, ref: function (s) { return tm.s(L / 2, s)[c]; } };
      }
      if (pr.key === 'hole') {
        var a = pr.a, b = pr.b, ks = pr.kirschS;
        if (key === 'stt') return { f: 'stt', xr: [0, 90], xl: 'θ (°)', pt: function (s) { var th = s * Math.PI / 180; return [a * Math.cos(th), a * Math.sin(th)]; },
          ref: function (s) { var th = s * Math.PI / 180; return stt(ks(a * Math.cos(th), a * Math.sin(th)), th); } };
        return { f: 'sxx', xr: [a, b], xl: 'y (m)', pt: function (s) { return [0, s]; }, ref: function (s) { return ks(0, s)[0]; } };
      }
      if (key === 'ux') return { f: 'ux', xr: [0, 1], xl: 'x (m)', pt: function (s) { return [s, 0.5]; }, ref: function (s) { return pr.exact.u(s, 0.5)[0]; } };
      return { f: 'sxx', xr: [0, 1], xl: 'x (m)', pt: function (s) { return [s, 0.5]; }, ref: function () { return pr.s0; } };
    }
    function stt(s3, th) { var c = Math.cos(th), s = Math.sin(th); return s3[0] * s * s + s3[1] * c * c - 2 * s3[2] * s * c; }
    function computeLine() {
      lineData = null;
      var m = cur.model; if (m.error) return;
      var d = lineDef(), N = 97, xs = [], fe = [], rf = [], out = new Float64Array(5), k = d.f === 'stt' ? 1e-6 : FIELD[d.f].k;
      for (var i = 0; i < N; i++) {
        var s = d.xr[0] + (d.xr[1] - d.xr[0]) * i / (N - 1), p = d.pt(s), v = G.evalAt(m, p[0], p[1], out), val = NaN;
        if (v) val = d.f === 'stt' ? stt([v[2], v[3], v[4]], s * Math.PI / 180) : F.fieldOf(d.f, [v[0], v[1]], [v[2], v[3], v[4]]);
        xs.push(s); fe.push(val * k); rf.push(d.ref(s) * k);
      }
      lineData = { d: d, xs: xs, fe: fe, rf: rf, unit: d.f === 'stt' || F.isStress(d.f) ? 'MPa' : 'mm' };
    }

    /* ── language ─────────────────────────────────────────────── */
    function applyLang() {
      var b = document.body && document.body.getAttribute('data-rzlang'); lang = b === 'ms' ? 'ms' : 'en';
      qa('[data-k]').forEach(function (el) {
        var key = el.getAttribute('data-k'); if (!key) return;
        var txt = t(key);
        if (el.tagName !== 'OPTION' && /[`α-ω]/.test(txt)) el.innerHTML = U.labelHtml(txt); else el.textContent = U.plain(txt);
      });
      fillLineSelect(); redraw();
    }
    function fillLineSelect() {
      var sel = q('[data-in="line"]');
      sel.innerHTML = LINES[S.problem].map(function (k) { return '<option value="' + k + '">' + U.esc(t('l' + S.problem + '_' + k)) + '</option>'; }).join('');
      sel.value = S.line;
    }

    /* ── controls and metrics ─────────────────────────────────── */
    function sync(pendingBig) {
      var sz = G.size(cfg());
      q('[data-in="problem"]').value = S.problem; q('[data-in="field"]').value = S.field; q('[data-in="weight"]').value = S.weight;
      var ni = q('[data-in="n"]'); ni.max = NMAX[S.problem]; ni.value = S.n[S.problem];
      q('[data-kn="n"]').textContent = t('n' + S.problem);
      ['ld', 'ar', 'nu', 'alpha', 'pexp', 'distort', 'scale'].forEach(function (k) { q('[data-in="' + k + '"]').value = S[k]; });
      q('[data-out="n"]').textContent = S.n[S.problem]; q('[data-out="ld"]').textContent = S.ld; q('[data-out="ar"]').textContent = S.ar.toFixed(2);
      q('[data-out="nu"]').textContent = S.nu.toFixed(2); q('[data-out="alpha"]').textContent = S.alpha.toFixed(1); q('[data-out="pexp"]').textContent = S.pexp;
      q('[data-out="distort"]').textContent = S.distort.toFixed(2);
      q('[data-out="scale"]').textContent = cur && !cur.model.error ? '×' + fmt(S.scale * autoScale()) : S.scale.toFixed(1);
      q('[data-out="size"]').textContent = U.fill(t('size'), { nodes: U.group(sz.nodes), dof: U.group(sz.dof), gp: U.group(sz.gauss) }) + (pendingBig ? ' · ' + t('big') : '');
      ['support', 'outer', 'basis', 'bc', 'ng'].forEach(function (g) { qa('[data-seg="' + g + '"] button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === String(S[g]))); }); });
      qa('[data-ov]').forEach(function (b) { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(!!S.ov[b.getAttribute('data-ov')])); });
      qa('[data-only]').forEach(function (el) { el.hidden = el.getAttribute('data-only') !== S.problem; });
      q('[data-pen]').hidden = S.bc !== 'penalty';
      q('[data-act="shuffle"]').hidden = !(S.distort > 0);
    }
    function autoScale() { var bb = cur.model.pr.bbox, L = Math.max(bb[1] - bb[0], bb[3] - bb[2]); return cur.umax > 0 ? 0.08 * L / cur.umax : 0; }
    function hasExact() { return S.problem === 'cantilever' ? S.support === 'exact' : S.problem === 'hole' ? S.outer === 'kirsch' : true; }

    function setMetrics() {
      function put(k, v) { q('[data-m="' + k + '"]').textContent = v; }
      var m = cur.model, chip = q('[data-m="qc"]'), warn = q('[data-note="warn"]'), ok = q('[data-note="ok"]'), sz = G.size(cfg());
      chip.className = 'rzt-chip'; chip.textContent = ''; warn.hidden = true; ok.hidden = true;
      put('dof', U.group(sz.dof)); put('dofl', U.fill(t('mDof'), { nn: U.group(sz.nodes), gp: U.group(sz.gauss) }));
      if (m.error) {
        ['q', 'err', 'bc', 'sup', 'time'].forEach(function (k) { put(k, '—'); }); put('ql', ''); put('errl', ''); put('supl', '');
        warn.textContent = U.fill(t(m.error) || t('fail2'), { n: m.bad || 0, basis: t(S.basis) }); warn.hidden = false; return;
      }
      var pr = m.pr, W = [], O = [];
      if (pr.key === 'cantilever') {
        put('q', fmt(cur.q * 1e3) + ' mm'); put('ql', U.fill(t('mTip'), { v: fmt(cur.qref * 1e3) + ' mm' }));
        var ratio = cur.q / cur.qref; chip.textContent = (ratio * 100).toFixed(1) + '%';
        chip.classList.add(Math.abs(ratio - 1) <= 0.01 ? 'is-good' : Math.abs(ratio - 1) <= 0.05 ? 'is-ok' : 'is-bad');
        if (S.support === 'clamped') W.push(t('clamped'));
      } else if (pr.key === 'hole') {
        put('q', isFinite(cur.q) ? cur.q.toFixed(3) : '—');
        if (S.outer === 'kirsch') { put('ql', U.fill(t('mScf'), { v: '3' })); var dv = Math.abs(cur.q / 3 - 1); chip.textContent = (cur.q / 3 * 100).toFixed(1) + '%'; chip.classList.add(dv <= 0.01 ? 'is-good' : dv <= 0.05 ? 'is-ok' : 'is-bad'); }
        else { put('ql', t('mScfU')); W.push(t('uniform')); }
      } else {
        put('q', U.sci(cur.q)); put('ql', t('mPatch'));
        var passed = cur.q < 1e-8; chip.textContent = t(passed ? 'pass' : 'notExact'); chip.classList.add(passed ? 'is-good' : 'is-ok');
        if (!passed) W.push(t('patchNote'));
      }
      if (cur.err == null) { put('err', '—'); put('errl', t('mErrNone')); }
      else { put('err', cur.err >= 1e-4 ? fmt(cur.err * 100) + ' %' : U.sci(cur.err)); put('errl', t('mErr')); }
      put('bc', fmt(cur.bc.abs * 1e3) + ' mm');
      put('sup', cur.sup.mean.toFixed(1)); put('supl', U.fill(t('mSup'), { a: cur.sup.min, b: cur.sup.max }));
      put('time', Math.max(1, Math.round(m.time.assemble + m.time.solve)) + ' ms');
      if (S.bc === 'penalty' && S.pexp >= 6) W.push(t('penHigh'));
      if (S.bc === 'penalty' && S.pexp <= 1) W.push(t('penLow'));
      if (S.field === 'phi' && S.sel != null) O.push(U.fill(t('phiNote'), { v: fmt(G.phiAt(m, S.sel, m.md.X[S.sel], m.md.Y[S.sel])) }));
      if (W.length) { warn.textContent = W.join(' '); warn.hidden = false; }
      if (O.length) { ok.textContent = O.join(' '); ok.hidden = false; }
    }

    /* ── contour plot ─────────────────────────────────────────── */
    function setSize(W, H) {
      var dpr = window.devicePixelRatio || 1;
      [cv1, ov1].forEach(function (c) { c.style.height = H + 'px'; if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); } });
    }
    function drawContour() {
      var m = cur.model, g, dpr = window.devicePixelRatio || 1, W = cv1.parentNode.clientWidth;
      var h = q('[data-h="1"]'), sub = q('[data-sub="1"]'), cbar = q('[data-cbar]');
      h.textContent = U.plain(t('f' + S.field));
      if (!W) return;
      if (m.error) {
        setSize(W, 220); g = cv1.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, 220);
        g.fillStyle = C.fg2; g.font = '13px Poppins, system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(t('fail2'), W / 2, 110);
        cbar.innerHTML = ''; sub.textContent = ''; view = null; drawHover(null); return;
      }
      var md = m.md, nn = md.nn, X = md.X, Y = md.Y, gr = cur.grid, np = gr.np, ne = md.mesh.ne, i, e, a;
      var sc = S.scale * autoScale(), npts = ne * np, qx = new Float64Array(npts), qy = new Float64Array(npts), nx = new Float64Array(nn), ny = new Float64Array(nn);
      var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (i = 0; i < npts; i++) {
        var ux = gr.V[i * 5], uy = gr.V[i * 5 + 1]; if (!isFinite(ux)) { ux = 0; uy = 0; }
        qx[i] = gr.PX[i] + sc * ux; qy[i] = gr.PY[i] + sc * uy;
        x0 = Math.min(x0, qx[i], gr.PX[i]); x1 = Math.max(x1, qx[i], gr.PX[i]); y0 = Math.min(y0, qy[i], gr.PY[i]); y1 = Math.max(y1, qy[i], gr.PY[i]);
      }
      for (i = 0; i < nn; i++) { nx[i] = X[i] + sc * cur.nodeV[i * 5]; ny[i] = Y[i] + sc * cur.nodeV[i * 5 + 1]; }
      var M = 44, avail = W - 2 * M, asp = (y1 - y0) / (x1 - x0), H = Math.round(Math.min(560, Math.max(200, avail * asp + 2 * M)));
      var k = Math.min(avail / (x1 - x0), (H - 2 * M) / (y1 - y0)), ox = (W - k * (x1 - x0)) / 2, oy = (H - k * (y1 - y0)) / 2;
      function SX(x) { return ox + (x - x0) * k; } function SY(y) { return H - oy - (y - y0) * k; }
      setSize(W, H);
      g = cv1.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);

      // field values on the display grid
      var fd = FIELD[S.field], vals = new Float64Array(npts), lo = Infinity, hi = -Infinity;
      for (i = 0; i < npts; i++) {
        var v;
        if (S.field === 'phi') v = G.phiAt(m, S.sel, gr.PX[i], gr.PY[i]);
        else v = isFinite(gr.V[i * 5]) ? F.fieldOf(S.field, [gr.V[i * 5], gr.V[i * 5 + 1]], [gr.V[i * 5 + 2], gr.V[i * 5 + 3], gr.V[i * 5 + 4]]) * fd.k : NaN;
        vals[i] = v; if (isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; }
      }
      var bp = U.bandPainter(lo, hi, fd.div, C), cellsP = new Path2D(), S1 = SUB + 1;
      for (e = 0; e < ne; e++) {
        var base = e * np;
        for (var jj = 0; jj < SUB; jj++) for (var ii = 0; ii < SUB; ii++) {
          var p0 = base + jj * S1 + ii, p1 = p0 + 1, p2 = p0 + S1 + 1, p3 = p0 + S1;
          var A = [SX(qx[p0]), SY(qy[p0]), vals[p0]], Bq = [SX(qx[p1]), SY(qy[p1]), vals[p1]], Cq = [SX(qx[p2]), SY(qy[p2]), vals[p2]], Dq = [SX(qx[p3]), SY(qy[p3]), vals[p3]];
          bp.tri([A, Bq, Cq]); bp.tri([A, Cq, Dq]);
        }
        if (S.ov.cells) {
          var rim = []; for (a = 0; a <= SUB; a++) rim.push(base + a); for (a = 1; a <= SUB; a++) rim.push(base + a * S1 + SUB);
          for (a = SUB - 1; a >= 0; a--) rim.push(base + SUB * S1 + a); for (a = SUB - 1; a > 0; a--) rim.push(base + a * S1);
          cellsP.moveTo(SX(qx[rim[0]]), SY(qy[rim[0]])); for (a = 1; a < rim.length; a++) cellsP.lineTo(SX(qx[rim[a]]), SY(qy[rim[a]])); cellsP.closePath();
        }
      }
      bp.paint(g);
      if (S.ov.cells) { g.strokeStyle = U.rgba(C.fg, 0.35); g.lineWidth = 0.6; g.stroke(cellsP); }
      if (S.ov.gauss && m.ngp <= 12000) {
        g.fillStyle = U.rgba(C.fg, 0.55);
        for (i = 0; i < m.ngp; i++) { g.fillRect(SX(m.gps[i].x + sc * cur.gpU[2 * i]) - 1, SY(m.gps[i].y + sc * cur.gpU[2 * i + 1]) - 1, 2, 2); }
      }
      // undeformed outline
      if (sc > 0) {
        g.save(); g.setLineDash([4, 3]); g.strokeStyle = U.rgba(C.fg2, 0.8); g.lineWidth = 1; g.beginPath();
        md.mesh.bedges.forEach(function (be) { var n0 = be.n[0], nL = be.n[be.n.length - 1]; g.moveTo(SX(X[n0]), SY(Y[n0])); g.lineTo(SX(X[nL]), SY(Y[nL])); });
        g.stroke(); g.restore();
      }
      // support of the selected node
      if (S.ov.support && S.sel != null) {
        g.save(); g.setLineDash([5, 4]); g.strokeStyle = C.accent; g.lineWidth = 1.6; g.beginPath();
        g.arc(SX(nx[S.sel]), SY(ny[S.sel]), md.d[S.sel] * k, 0, Math.PI * 2); g.stroke(); g.restore();
        g.fillStyle = U.rgba(C.accent, 0.08); g.beginPath(); g.arc(SX(nx[S.sel]), SY(ny[S.sel]), md.d[S.sel] * k, 0, Math.PI * 2); g.fill();
      }
      // nodes
      if (S.ov.nodes) {
        var r = nn > 600 ? 1.6 : 2.4;
        g.fillStyle = C.surface; g.strokeStyle = C.fg; g.lineWidth = 1;
        for (i = 0; i < nn; i++) { g.beginPath(); g.arc(SX(nx[i]), SY(ny[i]), r, 0, Math.PI * 2); g.fill(); g.stroke(); }
      }
      if (S.sel != null) {
        g.beginPath(); g.arc(SX(nx[S.sel]), SY(ny[S.sel]), 4.5, 0, Math.PI * 2); g.fillStyle = C.accent; g.fill(); g.lineWidth = 1.5; g.strokeStyle = C.surface; g.stroke();
      }
      // line path
      if (lineData) {
        var d = lineData.d; g.save(); g.setLineDash([6, 4]); g.strokeStyle = C.fg; g.lineWidth = 1.4; g.beginPath();
        for (i = 0; i <= 40; i++) { var pp = d.pt(d.xr[0] + (d.xr[1] - d.xr[0]) * i / 40); if (i) g.lineTo(SX(pp[0]), SY(pp[1])); else g.moveTo(SX(pp[0]), SY(pp[1])); }
        g.stroke(); g.restore();
      }
      U.bcGlyphs(g, { X: X, Y: Y, bedges: md.mesh.bedges, fixed: cur.fixed, pr: m.pr, px: nx, py: ny, SX: SX, SY: SY, C: C });

      view = { SX: SX, SY: SY, nx: nx, ny: ny };
      sub.textContent = U.fill(t(sc > 0 ? 'p1s' : 'p1sU'), { f: U.plain(t('f' + S.field)), s: fmt(sc) });
      U.colorbar(cbar, bp.cols, bp.lev, fd.unit);
      drawHover(null);
    }
    function drawHover(n) {
      var dpr = window.devicePixelRatio || 1, g = ov1.getContext('2d'), rd = q('[data-read="1"]');
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, ov1.width / dpr, ov1.height / dpr);
      if (n == null || !view) { rd.textContent = ''; return; }
      var m = cur.model, md = m.md, sx = view.SX(view.nx[n]), sy = view.SY(view.ny[n]);
      g.beginPath(); g.arc(sx, sy, 6, 0, Math.PI * 2); g.lineWidth = 2; g.strokeStyle = C.surface; g.stroke();
      g.beginPath(); g.arc(sx, sy, 5, 0, Math.PI * 2); g.lineWidth = 1.6; g.strokeStyle = C.fg; g.stroke();
      var x = md.X[n], y = md.Y[n], fd = FIELD[S.field], v, ex = NaN, extra = '';
      if (S.field === 'phi') v = G.phiAt(m, S.sel, x, y);
      else {
        var nv = cur.nodeV; v = F.fieldOf(S.field, [nv[n * 5], nv[n * 5 + 1]], [nv[n * 5 + 2], nv[n * 5 + 3], nv[n * 5 + 4]]) * fd.k;
        ex = m.pr.exact ? F.fieldOf(S.field, m.pr.exact.u(x, y), m.pr.exact.s(x, y)) * fd.k : NaN;
        if (S.field === 'ux' || S.field === 'uy') extra = U.fill(t('readPar'), { v: fmt(m.u[2 * n + (S.field === 'uy' ? 1 : 0)] * 1e3) + ' mm' });
      }
      rd.textContent = U.fill(t('readNode'), { i: n, x: x.toFixed(3), y: y.toFixed(3), f: SYM[S.field], v: fmt(v) + (fd.unit ? ' ' + fd.unit : '') }) +
        (isFinite(ex) ? U.fill(t('readExact'), { v: fmt(ex) + ' ' + fd.unit }) : '') + extra;
    }
    function nearestNode(ev, rad) {
      if (!view) return null;
      var r = ov1.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, best = null, bd = rad * rad;
      for (var i = 0; i < view.nx.length; i++) { var dx = view.SX(view.nx[i]) - mx, dy = view.SY(view.ny[i]) - my, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
      return best;
    }
    ov1.addEventListener('mousemove', function (ev) { drawHover(nearestNode(ev, 18)); });
    ov1.addEventListener('mouseleave', function () { drawHover(null); });
    ov1.addEventListener('click', function (ev) { var n = nearestNode(ev, 24); if (n == null) return; S.sel = n; update(false); });

    /* ── line plot ────────────────────────────────────────────── */
    function drawLine() {
      var lg = q('[data-lg="2"]');
      if (!lineData) { P2 = U.plot(cv2, { xr: [0, 1], yr: [0, 1] }, C); lg.innerHTML = ''; return; }
      var L = lineData, lo = Infinity, hi = -Infinity;
      L.fe.concat(L.rf).forEach(function (v) { if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } });
      if (!isFinite(lo)) { lo = -1; hi = 1; }
      var pad = (hi - lo) * 0.08 || Math.max(Math.abs(hi) * 0.1, 1e-3); lo -= pad; hi += pad;
      var refOnly = (S.problem === 'cantilever' && S.support === 'clamped') || (S.problem === 'hole' && S.outer === 'uniform');
      var refName = S.problem === 'hole' ? (S.outer === 'kirsch' ? t('lgExact') : t('lgKirsch')) : S.problem === 'cantilever' ? (S.support === 'exact' ? t('lgExact') : t('lgTimo')) : t('lgExact');
      P2 = U.plot(cv2, { xr: L.d.xr, yr: [lo, hi], xlabel: L.d.xl, ylabel: L.unit, ml: 56, hlines: lo < 0 && hi > 0 ? [{ y: 0, stroke: C.border, width: 1.5 }] : [],
        lines: [refOnly ? { x: L.xs, y: L.rf, stroke: C.fg2, width: 1.6, dash: [5, 4] } : { x: L.xs, y: L.rf, stroke: U.rgba(C.fg2, 0.45), width: 5 }, { x: L.xs, y: L.fe, stroke: C.accent, width: 1.8 }] }, C);
      lg.innerHTML = U.legendHtml([{ t: t('lgFE') + ' (' + t(S.basis) + ', α = ' + S.alpha.toFixed(1) + ')', c: C.accent }, refOnly ? { t: refName, c: C.fg2, dash: true } : { t: refName, c: U.rgba(C.fg2, 0.6) }]);
    }
    cv2.addEventListener('mousemove', function (ev) {
      if (!P2 || !lineData) return;
      var r = cv2.getBoundingClientRect(), x = P2.invX(ev.clientX - r.left), L = lineData, i = 0, bd = Infinity;
      for (var k = 0; k < L.xs.length; k++) { var d = Math.abs(L.xs[k] - x); if (d < bd) { bd = d; i = k; } }
      q('[data-read="2"]').textContent = U.fill(t('readLine'), { x: L.d.xl.split(' ')[0] + ' = ' + fmt(L.xs[i]), fe: fmt(L.fe[i]), ex: fmt(L.rf[i]), u: L.unit });
    });
    cv2.addEventListener('mouseleave', function () { q('[data-read="2"]').textContent = ''; });

    /* ── EFG against FEM ──────────────────────────────────────── */
    function studyOK() { return S.problem !== 'patch' && hasExact(); }
    function runStudy() {
      if (!studyOK()) return;
      var tok = ++studyTok, jobs = [], base = cfg();
      SERIES.forEach(function (sr, si) { STUDY_N[S.problem].forEach(function (n) { jobs.push({ si: si, n: n }); }); });
      study = { key: studyKey(), pts: SERIES.map(function () { return []; }), done: 0, total: jobs.length };
      (function next() {
        if (tok !== studyTok) return;
        if (!jobs.length) { study.finished = true; drawConv(); return; }
        var j = jobs.shift(), sr = SERIES[j.si], c = {}, k;
        for (k in base) c[k] = base[k];
        c.n = j.n;
        if (sr.fem) { c.elem = 'Q4'; var fm = F.run(c); if (!fm.error) study.pts[j.si].push({ dof: fm.ndof, e: F.energyError(fm) }); }
        else { c.basis = sr.basis; c.alpha = sr.alpha; c.bc = sr.bc; var em = G.run(c); if (!em.error) study.pts[j.si].push({ dof: em.ndof, e: G.energyError(em) }); }
        study.done++; drawConv();
        setTimeout(next, 0);
      })();
    }
    function drawConv() {
      var lg = q('[data-lg="3"]'), msg = q('[data-out="study"]'), btn = q('[data-act="study"]'), series = U.series(C);
      var valid = study && study.key === studyKey();
      btn.disabled = !studyOK() || !!(valid && !study.finished);
      if (S.problem === 'patch') msg.textContent = t('noPatch');
      else if (!hasExact()) msg.textContent = t('noExact');
      else if (!study) msg.textContent = t('idle');
      else if (!valid) msg.textContent = t('stale');
      else msg.textContent = study.finished ? '' : U.fill(t('running'), { i: study.done, n: study.total });
      var lines = [], pts = [], items = [], all = []; convPts = [];
      if (valid) SERIES.forEach(function (sr, i) {
        var P = study.pts[i]; if (!P.length) return;
        lines.push({ x: P.map(function (p) { return p.dof; }), y: P.map(function (p) { return p.e; }), stroke: series[i], width: 2, dash: sr.fem ? [5, 4] : null });
        P.forEach(function (p) { pts.push({ x: p.dof, y: p.e, r: 4.5, fill: series[i], stroke: C.surface, lw: 1.5, shape: SHAPES[i] }); convPts.push({ s: t(sr.k), dof: p.dof, e: p.e }); all.push(p); });
        var rate = P.length > 1 ? Math.log(P[P.length - 2].e / P[P.length - 1].e) / Math.log(Math.sqrt(P[P.length - 1].dof / P[P.length - 2].dof)) : NaN;
        items.push({ t: t(sr.k) + (isFinite(rate) ? ' · ' + t('rate') + ' ' + rate.toFixed(2) : ''), c: series[i], type: 'marker', shape: SHAPES[i] });
      });
      if (cur && !cur.model.error && cur.err != null && studyOK()) {
        all.push({ dof: cur.model.ndof, e: cur.err }); pts.push({ x: cur.model.ndof, y: cur.err, r: 7.5, stroke: C.fg, lw: 1.8 });
        items.push({ t: t('cur'), c: C.surface, type: 'dot', b: C.fg });
      }
      var dx = [10, 1e4], dy = [1e-3, 1];
      if (all.length) {
        var mnx = Math.min.apply(null, all.map(function (p) { return p.dof; })), mxx = Math.max.apply(null, all.map(function (p) { return p.dof; }));
        var mny = Math.min.apply(null, all.map(function (p) { return p.e; })), mxy = Math.max.apply(null, all.map(function (p) { return p.e; }));
        dx = [Math.pow(10, Math.floor(Math.log10(mnx))), Math.pow(10, Math.ceil(Math.log10(mxx)))]; dy = [Math.pow(10, Math.floor(Math.log10(mny))), Math.pow(10, Math.ceil(Math.log10(mxy)))];
        if (dy[1] / dy[0] < 100) dy[0] = dy[1] / 100; if (dx[1] / dx[0] < 100) dx[1] = dx[0] * 100;
      }
      P3 = U.plot(cv3, { xr: dx, yr: dy, xlog: true, ylog: true, xlabel: 'DOF', lines: lines, points: pts }, C);
      lg.innerHTML = U.legendHtml(items);
    }
    cv3.addEventListener('mousemove', function (ev) {
      if (!P3 || !convPts.length) return;
      var r = cv3.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, best = null, bd = 16 * 16;
      convPts.forEach(function (p) { var dx = P3.X(p.dof) - mx, dy = P3.Y(p.e) - my, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = p; } });
      q('[data-read="3"]').textContent = best ? U.fill(t('readConv'), { s: best.s, dof: U.group(best.dof), e: U.sci(best.e) }) : '';
    });
    cv3.addEventListener('mouseleave', function () { q('[data-read="3"]').textContent = ''; });

    /* ── redraw / update ──────────────────────────────────────── */
    function redraw() { if (!cur) return; sync(); setMetrics(); drawContour(); drawLine(); drawConv(); }
    var pending = false, needCompute = false;
    function update(recompute) {
      if (recompute) needCompute = true;
      if (pending) return; pending = true;
      var heavy = needCompute && cost(cfg()) > LIVE_COST;
      if (heavy) q('[data-sub="1"]').textContent = t('solving');
      // let the "solving" message paint before a long solve
      (heavy ? function (f) { setTimeout(f, 30); } : requestAnimationFrame)(function () {
        pending = false;
        if (needCompute) { needCompute = false; compute(); }
        redraw();
      });
    }

    var RECOMP = { ld: 1, ar: 1, nu: 1, n: 1, distort: 1, alpha: 1, pexp: 1 };
    function readInput(el) {
      var k = el.getAttribute('data-in'), v = el.value;
      if (k === 'n') S.n[S.problem] = +v;
      else if (k === 'line' || k === 'field' || k === 'weight') S[k] = v;
      else if (k === 'problem') { S.problem = v; S.line = LINES[v][0]; S.distort = v === 'patch' ? 0.3 : 0; S.field = v === 'cantilever' ? 'svm' : 'sxx'; S.sel = null; fillLineSelect(); }
      else S[k] = +v;
      return k;
    }
    root.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-in'); if (!k || e.target.tagName === 'SELECT') return;
      readInput(e.target);
      if (k === 'scale') { update(false); return; }
      if (RECOMP[k]) { if (cost(cfg()) <= LIVE_COST) update(true); else sync(true); }
    });
    root.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-in'); if (!k) return;
      readInput(e.target);
      if (k === 'line' || k === 'field') { computeLine(); update(false); return; }
      if (k === 'scale') { update(false); return; }
      update(true);
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
      var sg = b.parentNode.getAttribute('data-seg');
      if (sg) {
        S[sg] = b.getAttribute('data-v');
        if (sg === 'basis' && S.basis === 'quad' && S.alpha < 2.5) S.alpha = 3.5;
        update(true); return;
      }
      var ov = b.getAttribute('data-ov');
      if (ov && b.tagName === 'BUTTON') { S.ov[ov] = !S.ov[ov]; update(false); return; }
      var act = b.getAttribute('data-act');
      if (act === 'shuffle') { S.seed = (S.seed * 48271 + 11) % 2147483647; update(true); }
      else if (act === 'reset') { studyTok++; study = null; S = clone(DEFAULTS); fillLineSelect(); update(true); }
      else if (act === 'study') runStudy();
    });

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
