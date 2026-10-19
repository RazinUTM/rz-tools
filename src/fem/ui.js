/* ═══════════════════════════════════════════════════════════════
   2D Plane Stress FEM Explorer — UI
   Registered as RZTools tool 'fem2d'; mount with <div data-rz-tool="fem2d"></div>
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var F = window.RZFEM, RZT = window.RZTools, U = RZT.util;
  var ELEMS = ['T3', 'Q4', 'QM6', 'Q8'], SHAPES = ['circle', 'square', 'tri', 'diamond'];

  var T = {
    en: {
      gModel: 'Model', gMesh: 'Mesh', gView: 'View',
      problem: 'Problem', pcantilever: 'Cantilever (Timoshenko)', phole: 'Plate with a hole (Kirsch)', ppatch: 'Patch test',
      elem: 'Element', ld: 'Span / depth L/D', support: 'Left support', supExact: 'Exact', supClamp: 'Clamped',
      ar: 'Hole radius `a / b`', outer: 'Outer edges', outKirsch: 'Kirsch', outUniform: 'Uniform',
      nu: 'Poisson’s ratio ν', ncantilever: 'Elements through depth', nhole: 'Elements along radius', npatch: 'Elements per side',
      size: '{dof} DOF · {ne} elements', distort: 'Distortion', shuffle: 'New layout',
      field: 'Contour', fumag: 'Displacement |u|', fux: 'Displacement ux', fuy: 'Displacement uy', fsxx: 'Stress σxx', fsyy: 'Stress σyy',
      fsxy: 'Shear stress τxy', fsvm: 'Von Mises stress', smooth: 'Stresses', avg: 'Averaged', raw: 'Raw', scale: 'Deformation scale',
      meshLines: 'Mesh lines', show: 'Show', hide: 'Hide', reset: 'Reset',
      mDof: 'degrees of freedom · {ne} × {el}', mTip: 'Tip deflection v(L, 0) · Timoshenko {v}', mScf: 'SCF = σxx(0, a) / σ₀ · Kirsch {v}',
      mScfU: 'SCF = σxx(0, a) / σ₀ · Kirsch ∞ plate 3', mPatch: 'max |σ − σexact| / σ₀', mErr: 'Relative error, energy norm',
      mErrNone: 'Energy-norm error · needs an exact solution', mVm: 'max von Mises (averaged)', mU: 'max |u|', mTime: 'assemble + solve',
      pass: 'passed', fail: 'failed',
      lock: 'Shear locking: {el} elements cannot bend without spurious shear strain, so the beam is too stiff — {pct} of the exact tip deflection. Refine through the depth, or switch to QM6 or Q8.',
      clamped: 'Clamped support: every node at x = 0 is fixed. The exact Timoshenko solution assumes a different support, so no error norm is shown, and the stresses at the two clamped corners are singular — they keep growing as you refine.',
      uniform: 'Uniform tension on a finite plate: Kirsch’s solution is for an infinite plate, so no error norm is shown. The stress concentration rises above 3 as the hole grows relative to the plate.',
      patchOk: 'Patch test passed: the element reproduces a constant stress state exactly, even on a distorted mesh — the consistency condition behind convergence.',
      patchBad: 'Patch test failed: the element does not reproduce a constant stress state on this mesh.',
      singular: 'The stiffness matrix is singular: the model is not supported against rigid-body motion.',
      distorted: 'An element has a non-positive Jacobian. Reduce the mesh distortion.',
      big: 'Large model: it solves when you release the slider.',
      p1s: '{smooth} values on the deformed shape (displacements × {s}). Hover or tap near a node to read it; the dashed line is the path plotted below.',
      p1sU: '{smooth} values on the undeformed shape. Hover or tap near a node to read it; the dashed line is the path plotted below.',
      sAvg: 'Averaged nodal', sRaw: 'Unaveraged element', sDisp: 'Nodal',
      p2: 'Along a line', p2s: 'FE result against the reference solution, sampled inside the elements. Hover to read values.',
      lcantilever_sxx: 'σxx through the depth at x = L/2', lcantilever_sxy: 'τxy through the depth at x = L/2', lcantilever_uy: 'Deflection along the axis y = 0',
      lhole_sxx: 'σxx along x = 0, from the hole to the edge', lhole_stt: 'σθθ around the hole, θ = 0° → 90°',
      lpatch_sxx: 'σxx along y = 0.5', lpatch_ux: 'ux along y = 0.5',
      lgFE: 'FE', lgExact: 'exact', lgKirsch: 'Kirsch (infinite plate)', lgTimo: 'Timoshenko (exact support)',
      p3: 'Convergence study', p3s: 'Relative energy-norm error against DOF for all four elements on this problem, with the current ν, geometry and distortion. On these axes a slope of −p/2 means the error falls as hᵖ.',
      run: 'Run study', running: 'Solving {i} of {n}…', stale: 'Settings changed since the last study. Run it again.', noExact: 'The study needs an exact solution: choose the exact support or Kirsch tractions.',
      idle: 'Press “Run study” to solve 16 meshes, from coarse to fine.', rate: 'rate', cur: 'current model',
      readNode: '({x}, {y}) m · {f} = {v}', readExact: ' · exact {v}', readLine: '{x} · FE {fe} · ref {ex} {u}', readConv: '{el} · {dof} DOF · error {e}',
      fail2: 'The model could not be solved.',
      noPatch: 'The patch test is exact on every mesh, so there is nothing to converge.'
    },
    ms: {
      gModel: 'Model', gMesh: 'Mesh', gView: 'Paparan',
      problem: 'Masalah', pcantilever: 'Cantilever (Timoshenko)', phole: 'Plat berlubang (Kirsch)', ppatch: 'Patch test',
      elem: 'Element', ld: 'Rentang / kedalaman L/D', support: 'Support kiri', supExact: 'Exact', supClamp: 'Clamped',
      ar: 'Jejari lubang `a / b`', outer: 'Sisi luar', outKirsch: 'Kirsch', outUniform: 'Seragam',
      nu: 'Poisson’s ratio ν', ncantilever: 'Element merentas kedalaman', nhole: 'Element sepanjang jejari', npatch: 'Element setiap sisi',
      size: '{dof} DOF · {ne} element', distort: 'Herotan', shuffle: 'Susunan baharu',
      field: 'Kontur', fumag: 'Sesaran |u|', fux: 'Sesaran ux', fuy: 'Sesaran uy', fsxx: 'Tegasan σxx', fsyy: 'Tegasan σyy',
      fsxy: 'Tegasan ricih τxy', fsvm: 'Tegasan von Mises', smooth: 'Tegasan', avg: 'Purata', raw: 'Mentah', scale: 'Skala ubah bentuk',
      meshLines: 'Garis mesh', show: 'Papar', hide: 'Sorok', reset: 'Set semula',
      mDof: 'darjah kebebasan · {ne} × {el}', mTip: 'Pesongan hujung v(L, 0) · Timoshenko {v}', mScf: 'SCF = σxx(0, a) / σ₀ · Kirsch {v}',
      mScfU: 'SCF = σxx(0, a) / σ₀ · Kirsch plat ∞ 3', mPatch: 'max |σ − σexact| / σ₀', mErr: 'Ralat relatif, energy norm',
      mErrNone: 'Ralat energy norm · perlukan exact solution', mVm: 'max von Mises (purata)', mU: 'max |u|', mTime: 'assemble + solve',
      pass: 'lulus', fail: 'gagal',
      lock: 'Shear locking: element {el} tidak boleh melentur tanpa terikan ricih palsu, jadi rasuk terlalu kaku — {pct} daripada pesongan hujung exact. Haluskan mesh merentas kedalaman, atau tukar ke QM6 atau Q8.',
      clamped: 'Support clamped: setiap nod pada x = 0 ditetapkan. Exact solution Timoshenko mengandaikan support yang berbeza, jadi energy norm tidak dipaparkan, dan tegasan di dua sudut clamped adalah singular — ia terus meningkat apabila mesh dihaluskan.',
      uniform: 'Tegangan seragam pada plat terhingga: penyelesaian Kirsch adalah untuk plat tak terhingga, jadi energy norm tidak dipaparkan. Kepekatan tegasan melebihi 3 apabila lubang membesar berbanding plat.',
      patchOk: 'Patch test lulus: element menghasilkan semula keadaan tegasan malar dengan tepat, walaupun pada mesh terherot — syarat consistency di sebalik convergence.',
      patchBad: 'Patch test gagal: element tidak menghasilkan semula tegasan malar pada mesh ini.',
      singular: 'Stiffness matrix singular: model tidak disokong terhadap gerakan rigid-body.',
      distorted: 'Satu element mempunyai Jacobian tidak positif. Kurangkan herotan mesh.',
      big: 'Model besar: ia diselesaikan apabila anda melepaskan slider.',
      p1s: 'Nilai {smooth} pada bentuk terubah (sesaran × {s}). Halakan atau ketik berhampiran nod untuk membacanya; garis putus-putus ialah laluan yang diplot di bawah.',
      p1sU: 'Nilai {smooth} pada bentuk asal. Halakan atau ketik berhampiran nod untuk membacanya; garis putus-putus ialah laluan yang diplot di bawah.',
      sAvg: 'nodal purata', sRaw: 'element tanpa purata', sDisp: 'nodal',
      p2: 'Sepanjang satu garis', p2s: 'Keputusan FE berbanding penyelesaian rujukan, disampel di dalam element. Halakan untuk membaca nilai.',
      lcantilever_sxx: 'σxx merentas kedalaman pada x = L/2', lcantilever_sxy: 'τxy merentas kedalaman pada x = L/2', lcantilever_uy: 'Pesongan sepanjang paksi y = 0',
      lhole_sxx: 'σxx sepanjang x = 0, dari lubang ke sisi', lhole_stt: 'σθθ sekeliling lubang, θ = 0° → 90°',
      lpatch_sxx: 'σxx sepanjang y = 0.5', lpatch_ux: 'ux sepanjang y = 0.5',
      lgFE: 'FE', lgExact: 'exact', lgKirsch: 'Kirsch (plat tak terhingga)', lgTimo: 'Timoshenko (support exact)',
      p3: 'Kajian convergence', p3s: 'Ralat relatif energy norm berbanding DOF bagi keempat-empat element untuk masalah ini, dengan ν, geometri dan herotan semasa. Pada paksi ini, cerun −p/2 bermaksud ralat jatuh mengikut hᵖ.',
      run: 'Jalankan kajian', running: 'Menyelesaikan {i} daripada {n}…', stale: 'Tetapan telah berubah sejak kajian terakhir. Jalankan semula.', noExact: 'Kajian ini perlukan exact solution: pilih support exact atau traction Kirsch.',
      idle: 'Tekan “Jalankan kajian” untuk menyelesaikan 16 mesh, dari kasar ke halus.', rate: 'kadar', cur: 'model semasa',
      readNode: '({x}, {y}) m · {f} = {v}', readExact: ' · exact {v}', readLine: '{x} · FE {fe} · rujukan {ex} {u}', readConv: '{el} · {dof} DOF · ralat {e}',
      fail2: 'Model tidak dapat diselesaikan.',
      noPatch: 'Patch test adalah exact pada setiap mesh, jadi tiada apa untuk menumpu.'
    }
  };

  var FIELD = U.FIELD, SYM = U.FSYM, fmt = U.fmt;
  var NMAX = { cantilever: 16, hole: 24, patch: 12 }, NDEF = { cantilever: 4, hole: 8, patch: 4 };
  var LINES = { cantilever: ['sxx', 'sxy', 'uy'], hole: ['sxx', 'stt'], patch: ['sxx', 'ux'] };
  var STUDY_N = { cantilever: [1, 2, 4, 8], hole: [2, 4, 8, 16], patch: [1, 2, 4, 8] };
  var LIVE_DOF = 5000;



  function seg(name, opts) {
    return '<div class="rzt-seg" role="group" data-seg="' + name + '">' + opts.map(function (o) {
      return '<button type="button" data-v="' + o[0] + '"' + (o[1] ? ' data-k="' + o[1] + '"' : '') + '>' + (o[2] || '') + '</button>';
    }).join('') + '</div>';
  }
  function rng(k, min, max, step) { return '<input class="rzt-rng" type="range" min="' + min + '" max="' + max + '" step="' + step + '" data-in="' + k + '">'; }

  var HTML =
    '<div class="rzt-body">' +
      '<div class="rzt-ctrl">' +
        '<p class="rzt-grp" data-k="gModel"></p>' +
        '<label class="rzt-field rzt-wide"><span class="rzt-lab" data-k="problem"></span>' +
          '<select class="rzt-sel" data-in="problem"><option value="cantilever" data-k="pcantilever"></option><option value="hole" data-k="phole"></option><option value="patch" data-k="ppatch"></option></select></label>' +
        '<div class="rzt-field rzt-wide"><span class="rzt-lab" data-k="elem"></span>' + seg('elem', ELEMS.map(function (e) { return [e, '', e]; })) + '</div>' +
        '<label class="rzt-field" data-only="cantilever"><span class="rzt-lab"><span data-k="ld"></span><output data-out="ld"></output></span>' + rng('ld', 2, 12, 1) + '</label>' +
        '<div class="rzt-field" data-only="cantilever"><span class="rzt-lab" data-k="support"></span>' + seg('support', [['exact', 'supExact'], ['clamped', 'supClamp']]) + '</div>' +
        '<label class="rzt-field" data-only="hole"><span class="rzt-lab"><span data-k="ar"></span><output data-out="ar"></output></span>' + rng('ar', 0.1, 0.5, 0.05) + '</label>' +
        '<div class="rzt-field" data-only="hole"><span class="rzt-lab" data-k="outer"></span>' + seg('outer', [['kirsch', 'outKirsch'], ['uniform', 'outUniform']]) + '</div>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-k="nu"></span><output data-out="nu"></output></span>' + rng('nu', 0, 0.49, 0.01) + '</label>' +
        '<p class="rzt-grp" data-k="gMesh"></p>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-kn="n"></span><output data-out="n"></output></span>' + rng('n', 1, 16, 1) +
          '<span class="rzt-size" data-out="size"></span></label>' +
        '<div class="rzt-field"><span class="rzt-lab"><span data-k="distort"></span><output data-out="distort"></output></span>' + rng('distort', 0, 0.4, 0.05) +
          '<button type="button" class="rzt-btn" data-act="shuffle" data-k="shuffle"></button></div>' +
        '<p class="rzt-grp" data-k="gView"></p>' +
        '<label class="rzt-field rzt-wide"><span class="rzt-lab" data-k="field"></span>' +
          '<select class="rzt-sel" data-in="field">' + ['svm', 'sxx', 'syy', 'sxy', 'umag', 'ux', 'uy'].map(function (f) { return '<option value="' + f + '" data-k="f' + f + '"></option>'; }).join('') + '</select></label>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="smooth"></span>' + seg('smooth', [['avg', 'avg'], ['raw', 'raw']]) + '</div>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="meshLines"></span>' + seg('mesh', [['1', 'show'], ['0', 'hide']]) + '</div>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-k="scale"></span><output data-out="scale"></output></span>' + rng('scale', 0, 3, 0.1) + '</label>' +
        '<button type="button" class="rzt-btn rzt-reset" data-act="reset" data-k="reset"></button>' +
      '</div>' +
      '<div class="rzt-main">' +
        '<div class="rzt-metrics">' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="dof"></span><span class="rzt-ml" data-m="dofl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv"><span data-m="q"></span> <span class="rzt-chip" data-m="qc"></span></span><span class="rzt-ml" data-m="ql"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="err"></span><span class="rzt-ml" data-m="errl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="vm"></span><span class="rzt-ml" data-k="mVm"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="umax"></span><span class="rzt-ml" data-k="mU"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="time"></span><span class="rzt-ml" data-k="mTime"></span></div>' +
        '</div>' +
        '<div class="rzt-note rzt-warn" data-note="warn" hidden></div>' +
        '<div class="rzt-note rzt-ok" data-note="ok" hidden></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-h="1"></span><span class="rzt-sub" data-sub="1"></span></div>' +
          '<div class="rzt-cvwrap"><canvas class="rzt-cv rzt-cv-fem" data-cv="1"></canvas><canvas class="rzt-ov" data-ov="1" aria-hidden="true"></canvas></div>' +
          '<div class="rzt-cbar" data-cbar></div><span class="rzt-read rzt-read-b" data-read="1"></span></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h"><span data-k="p2"></span></span>' +
          '<select class="rzt-sel rzt-sel-inline" data-in="line"></select><span class="rzt-sub" data-k="p2s"></span><div class="rzt-legend" data-lg="2"></div></div>' +
          '<canvas class="rzt-cv" data-cv="2"></canvas><span class="rzt-read" data-read="2"></span></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p3"></span><span class="rzt-sub" data-k="p3s"></span>' +
          '<div class="rzt-row"><button type="button" class="rzt-btn rzt-primary" data-act="study" data-k="run"></button><span class="rzt-sub" data-out="study"></span></div>' +
          '<div class="rzt-legend" data-lg="3"></div></div>' +
          '<canvas class="rzt-cv" data-cv="3"></canvas><span class="rzt-read" data-read="3"></span></div>' +
      '</div>' +
    '</div>';

  var DEFAULTS = { problem: 'cantilever', elem: 'Q4', ld: 5, support: 'exact', ar: 0.25, outer: 'kirsch', nu: 0.3, distort: 0, seed: 7,
                   field: 'svm', smooth: 'avg', mesh: '1', scale: 1, line: 'sxx', n: { cantilever: 4, hole: 8, patch: 4 } };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  RZT.register('fem2d', function (root) {
    root.classList.add('rzt', 'rzt-on');
    root.innerHTML = HTML;
    var S = clone(DEFAULTS), C = U.readColors(root), lang = 'en', cur = null, study = null, studyTok = 0, lastW = 0;
    function q(sel) { return root.querySelector(sel); }
    function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    function t(k) { return (T[lang] || T.en)[k] || T.en[k] || k; }
    var cv1 = q('[data-cv="1"]'), ov1 = q('[data-ov="1"]'), cv2 = q('[data-cv="2"]'), cv3 = q('[data-cv="3"]');
    var view = null, P2 = null, P3 = null, lineData = null, convPts = [];

    function cfg(extra) {
      var c = { problem: S.problem, elem: S.elem, n: S.n[S.problem], ld: S.ld, support: S.support, ar: S.ar, outer: S.outer,
                nu: S.nu, distort: S.distort, seed: S.seed };
      for (var k in extra) c[k] = extra[k];
      return c;
    }
    function studyKey() { return [S.problem, S.ld, S.support, S.ar, S.outer, S.nu, S.distort, S.seed].join('|'); }

    /* ── compute ───────────────────────────────────────────────── */
    function compute() {
      var key = JSON.stringify(cfg());
      if (cur && cur.key === key) { computeLine(); return; }
      var m = F.run(cfg()), r = { model: m, key: key };
      if (!m.error) {
        var mesh = m.mesh, nn = mesh.nn, umax = 0, vm = F.nodalField(m, 'svm'), vmax = 0;
        for (var i = 0; i < nn; i++) { umax = Math.max(umax, Math.hypot(m.u[2 * i], m.u[2 * i + 1])); vmax = Math.max(vmax, vm[i]); }
        r.umax = umax; r.vmax = vmax; r.err = F.energyError(m);
        var pr = m.pr;
        if (pr.key === 'cantilever') { r.q = F.evalAt(m, 'uy', pr.L, 0, 'avg', 1e-6); r.qref = pr.ref.tip; }
        else if (pr.key === 'hole') { r.q = F.evalAt(m, 'sxx', 0, pr.a, 'avg', 1e-3) / pr.s0; r.qref = 3; }
        else {
          var e = 0; for (i = 0; i < nn; i++) e = Math.max(e, Math.abs(m.sAvg[3 * i] - pr.s0), Math.abs(m.sAvg[3 * i + 1]), Math.abs(m.sAvg[3 * i + 2]));
          r.q = e / pr.s0;
        }
      }
      cur = r;
      computeLine();
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
        if (key === 'stt') return { f: 'stt', xr: [0, 90], xl: 'θ (°)', pt: function (s) { var th = s * Math.PI / 180, r = a * (1 + 1e-6); return [r * Math.cos(th), r * Math.sin(th)]; },
          ref: function (s) { var th = s * Math.PI / 180, r = a * (1 + 1e-6); return stt(ks(r * Math.cos(th), r * Math.sin(th)), th); }, th: true };
        return { f: 'sxx', xr: [a, b], xl: 'y (m)', pt: function (s) { return [0, s]; }, ref: function (s) { return ks(0, s)[0]; } };
      }
      if (key === 'ux') return { f: 'ux', xr: [0, 1], xl: 'x (m)', pt: function (s) { return [s, 0.5]; }, ref: function (s) { return pr.exact.u(s, 0.5)[0]; } };
      return { f: 'sxx', xr: [0, 1], xl: 'x (m)', pt: function (s) { return [s, 0.5]; }, ref: function () { return pr.s0; } };
    }
    function stt(s3, th) { var c = Math.cos(th), s = Math.sin(th); return s3[0] * s * s + s3[1] * c * c - 2 * s3[2] * s * c; }

    function computeLine() {
      lineData = null;
      var m = cur.model; if (m.error) return;
      var d = lineDef(), N = 97, xs = [], fe = [], rf = [], mode = S.smooth === 'raw' ? 'raw' : 'avg', tol = m.mesh.type === 'Q8' ? 3e-3 : 1e-6;
      var k = d.f === 'stt' ? FIELD.sxx.k : FIELD[d.f].k;
      for (var i = 0; i < N; i++) {
        var s = d.xr[0] + (d.xr[1] - d.xr[0]) * i / (N - 1), p = d.pt(s), v;
        if (d.f === 'stt') {
          var th = s * Math.PI / 180;
          v = stt([F.evalAt(m, 'sxx', p[0], p[1], mode, tol), F.evalAt(m, 'syy', p[0], p[1], mode, tol), F.evalAt(m, 'sxy', p[0], p[1], mode, tol)], th);
        } else v = F.evalAt(m, d.f, p[0], p[1], F.isStress(d.f) ? mode : 'avg', tol);
        xs.push(s); fe.push(v * k); rf.push(d.ref(s) * k);
      }
      lineData = { d: d, xs: xs, fe: fe, rf: rf, unit: d.f === 'stt' || F.isStress(d.f) ? 'MPa' : 'mm' };
    }

    /* ── language ─────────────────────────────────────────────── */
    function applyLang() {
      var b = document.body && document.body.getAttribute('data-rzlang'); lang = b === 'ms' ? 'ms' : 'en';
      qa('[data-k]').forEach(function (el) {
        var key = el.getAttribute('data-k'); if (!key) return;
        var txt = t(key);
        if (el.tagName !== 'OPTION' && /[`\u03B1-\u03C9]/.test(txt)) el.innerHTML = U.labelHtml(txt); else el.textContent = U.plain(txt);
      });
      fillLineSelect();
      redraw();
    }
    function fillLineSelect() {
      var sel = q('[data-in="line"]'), opts = LINES[S.problem];
      sel.innerHTML = opts.map(function (k) { return '<option value="' + k + '">' + U.esc(t('l' + S.problem + '_' + k)) + '</option>'; }).join('');
      sel.value = S.line;
    }

    /* ── controls ─────────────────────────────────────────────── */
    function sync() {
      var n = S.n[S.problem], sz = F.size(cfg());
      q('[data-in="problem"]').value = S.problem; q('[data-in="field"]').value = S.field;
      var ni = q('[data-in="n"]'); ni.max = NMAX[S.problem]; ni.value = n;
      q('[data-kn="n"]').textContent = t('n' + S.problem);
      q('[data-in="ld"]').value = S.ld; q('[data-in="ar"]').value = S.ar; q('[data-in="nu"]').value = S.nu;
      q('[data-in="distort"]').value = S.distort; q('[data-in="scale"]').value = S.scale;
      q('[data-out="n"]').textContent = n; q('[data-out="ld"]').textContent = S.ld; q('[data-out="ar"]').textContent = S.ar.toFixed(2);
      q('[data-out="nu"]').textContent = S.nu.toFixed(2); q('[data-out="distort"]').textContent = S.distort.toFixed(2);
      q('[data-out="scale"]').textContent = cur && cur.model && !cur.model.error ? '×' + fmt(S.scale * autoScale()) : S.scale.toFixed(1);
      q('[data-out="size"]').textContent = U.fill(t('size'), { dof: U.group(sz.dof), ne: U.group(sz.elements) });
      ['elem', 'support', 'outer', 'smooth', 'mesh'].forEach(function (g) {
        qa('[data-seg="' + g + '"] button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === String(S[g]))); });
      });
      qa('[data-only]').forEach(function (el) { el.hidden = el.getAttribute('data-only') !== S.problem; });
      q('[data-act="shuffle"]').hidden = !(S.distort > 0);
      var sm = q('[data-seg="smooth"]'); sm.parentNode.classList.toggle('is-off', !F.isStress(S.field));
    }
    function autoScale() {
      var m = cur.model, bb = m.pr.bbox, L = Math.max(bb[1] - bb[0], bb[3] - bb[2]);
      return cur.umax > 0 ? 0.08 * L / cur.umax : 0;
    }

    function setMetrics() {
      function put(k, v) { q('[data-m="' + k + '"]').textContent = v; }
      var m = cur.model, chip = q('[data-m="qc"]'); chip.className = 'rzt-chip'; chip.textContent = '';
      var warn = q('[data-note="warn"]'), ok = q('[data-note="ok"]'); warn.hidden = true; ok.hidden = true;
      var sz = F.size(cfg());
      put('dof', U.group(sz.dof)); put('dofl', U.fill(t('mDof'), { ne: U.group(sz.elements), el: S.elem }));
      if (m.error) {
        ['q', 'err', 'vm', 'umax', 'time'].forEach(function (k) { put(k, '—'); });
        put('ql', ''); put('errl', '');
        warn.textContent = t(m.error) || t('fail2'); warn.hidden = false; return;
      }
      var pr = m.pr, msgW = null, msgO = null;
      if (pr.key === 'cantilever') {
        put('q', fmt(cur.q * 1e3) + ' mm'); put('ql', U.fill(t('mTip'), { v: fmt(cur.qref * 1e3) + ' mm' }));
        var ratio = cur.q / cur.qref;
        chip.textContent = (ratio * 100).toFixed(1) + '%';
        chip.classList.add(Math.abs(ratio - 1) <= 0.01 ? 'is-good' : Math.abs(ratio - 1) <= 0.05 ? 'is-ok' : 'is-bad');
        if (S.support === 'clamped') msgW = t('clamped');
        else if (ratio < 0.9 && (S.elem === 'Q4' || S.elem === 'T3')) msgW = U.fill(t('lock'), { el: S.elem, pct: Math.round(ratio * 100) + '%' });
      } else if (pr.key === 'hole') {
        put('q', isFinite(cur.q) ? cur.q.toFixed(3) : '—');
        if (S.outer === 'kirsch') {
          put('ql', U.fill(t('mScf'), { v: '3' }));
          var dv = Math.abs(cur.q / 3 - 1);
          chip.textContent = (cur.q / 3 * 100).toFixed(1) + '%'; chip.classList.add(dv <= 0.01 ? 'is-good' : dv <= 0.05 ? 'is-ok' : 'is-bad');
        } else { put('ql', t('mScfU')); msgW = t('uniform'); }
      } else {
        put('q', U.sci(cur.q)); put('ql', t('mPatch'));
        var passed = cur.q < 1e-8;
        chip.textContent = t(passed ? 'pass' : 'fail'); chip.classList.add(passed ? 'is-good' : 'is-bad');
        if (passed) msgO = t('patchOk'); else msgW = t('patchBad');
      }
      if (cur.err == null) { put('err', '—'); put('errl', t('mErrNone')); }
      else { put('err', cur.err >= 1e-4 ? fmt(cur.err * 100) + ' %' : U.sci(cur.err)); put('errl', t('mErr')); }
      put('vm', fmt(cur.vmax * 1e-6) + ' MPa'); put('umax', fmt(cur.umax * 1e3) + ' mm');
      put('time', Math.max(1, Math.round(m.time.assemble + m.time.solve)) + ' ms');
      if (msgW) { warn.textContent = msgW; warn.hidden = false; }
      if (msgO) { ok.textContent = msgO; ok.hidden = false; }
    }

    /* ── contour plot ─────────────────────────────────────────── */
    var Q4SUB = [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]];
    var Q8G = [-1, -1 / 3, 1 / 3, 1], Q8N = (function () {     // Q8 shape functions at the 4×4 display grid
      var out = [], N = new Float64Array(8), a = new Float64Array(8), b = new Float64Array(8);
      for (var j = 0; j < 4; j++) for (var i = 0; i < 4; i++) { F.shape.Q8(Q8G[i], Q8G[j], N, a, b); out.push(Array.prototype.slice.call(N)); }
      return out;
    })();
    var Q8TRI = (function () { var tr = []; for (var j = 0; j < 3; j++) for (var i = 0; i < 3; i++) { var p = j * 4 + i; tr.push([p, p + 1, p + 5], [p, p + 5, p + 4]); } return tr; })();
    var Q8RIM = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4];

    function drawContour() {
      var m = cur.model, g, dpr = window.devicePixelRatio || 1, W = cv1.parentNode.clientWidth;
      var h = q('[data-h="1"]'), sub = q('[data-sub="1"]'), cbar = q('[data-cbar]');
      h.textContent = t('f' + S.field);
      if (!W) return;
      if (m.error) {
        setSize(W, 240); g = cv1.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, 240);
        g.fillStyle = C.fg2; g.font = '13px Poppins, system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(t('fail2'), W / 2, 120);
        cbar.innerHTML = ''; sub.textContent = ''; view = null; return;
      }
      var mesh = m.mesh, nn = mesh.nn, npe = mesh.npe, ne = mesh.ne, X = mesh.X, Y = mesh.Y, u = m.u, Cn = mesh.C;
      var sc = S.scale * autoScale(), px = new Float64Array(nn), py = new Float64Array(nn), i, e, a;
      var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (i = 0; i < nn; i++) {
        px[i] = X[i] + sc * u[2 * i]; py[i] = Y[i] + sc * u[2 * i + 1];
        x0 = Math.min(x0, X[i], px[i]); x1 = Math.max(x1, X[i], px[i]); y0 = Math.min(y0, Y[i], py[i]); y1 = Math.max(y1, Y[i], py[i]);
      }
      var M = 44, avail = W - 2 * M, asp = (y1 - y0) / (x1 - x0), H = Math.round(Math.min(560, Math.max(200, avail * asp + 2 * M)));
      var k = Math.min(avail / (x1 - x0), (H - 2 * M) / (y1 - y0)), ox = (W - k * (x1 - x0)) / 2, oy = (H - k * (y1 - y0)) / 2;
      function SX(x) { return ox + (x - x0) * k; } function SY(y) { return H - oy - (y - y0) * k; }
      setSize(W, H);
      g = cv1.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);

      // values and colour scale
      var fd = FIELD[S.field], raw = S.smooth === 'raw' && F.isStress(S.field), vals = F.elementField(m, S.field, raw ? 'raw' : 'avg');
      var lo = Infinity, hi = -Infinity;
      for (i = 0; i < vals.length; i++) { vals[i] *= fd.k; if (vals[i] < lo) lo = vals[i]; if (vals[i] > hi) hi = vals[i]; }
      var bp = U.bandPainter(lo, hi, fd.div, C), tri = bp.tri, cols = bp.cols, lev = bp.lev;
      var edges = new Path2D();
      var type = mesh.type, pts = [];
      for (e = 0; e < ne; e++) {
        var base = e * npe;
        if (type === 'Q8') {
          pts.length = 0;
          for (var s = 0; s < 16; s++) {
            var N = Q8N[s], xx = 0, yy = 0, vv = 0;
            for (a = 0; a < 8; a++) { var nd = Cn[base + a]; xx += N[a] * px[nd]; yy += N[a] * py[nd]; vv += N[a] * vals[base + a]; }
            pts.push([SX(xx), SY(yy), vv]);
          }
          for (s = 0; s < 18; s++) tri([pts[Q8TRI[s][0]], pts[Q8TRI[s][1]], pts[Q8TRI[s][2]]]);
          edges.moveTo(pts[Q8RIM[0]][0], pts[Q8RIM[0]][1]); for (s = 1; s < 12; s++) edges.lineTo(pts[Q8RIM[s]][0], pts[Q8RIM[s]][1]); edges.closePath();
        } else {
          pts.length = 0;
          for (a = 0; a < npe; a++) { var n2 = Cn[base + a]; pts.push([SX(px[n2]), SY(py[n2]), vals[base + a]]); }
          if (npe === 3) tri(pts);
          else {
            var cx = 0, cy = 0, cvv = 0; for (a = 0; a < 4; a++) { cx += pts[a][0] / 4; cy += pts[a][1] / 4; cvv += pts[a][2] / 4; }
            pts.push([cx, cy, cvv]);
            for (s = 0; s < 4; s++) tri([pts[Q4SUB[s][0]], pts[Q4SUB[s][1]], pts[Q4SUB[s][2]]]);
          }
          edges.moveTo(pts[0][0], pts[0][1]); for (a = 1; a < npe; a++) edges.lineTo(pts[a][0], pts[a][1]); edges.closePath();
        }
      }
      bp.paint(g);
      if (S.mesh === '1') { g.strokeStyle = U.rgba(C.fg, ne > 1500 ? 0.22 : 0.4); g.lineWidth = 0.6; g.stroke(edges); }

      // undeformed outline
      if (sc > 0) {
        g.save(); g.setLineDash([4, 3]); g.strokeStyle = U.rgba(C.fg2, 0.8); g.lineWidth = 1; g.beginPath();
        mesh.bedges.forEach(function (be) { var n0 = be.n[0], nL = be.n[be.n.length - 1]; g.moveTo(SX(X[n0]), SY(Y[n0])); if (be.n.length === 3) g.lineTo(SX(X[be.n[1]]), SY(Y[be.n[1]])); g.lineTo(SX(X[nL]), SY(Y[nL])); });
        g.stroke(); g.restore();
      }
      // line path
      if (lineData) {
        var d = lineData.d; g.save(); g.setLineDash([6, 4]); g.strokeStyle = C.fg; g.lineWidth = 1.4; g.beginPath();
        for (i = 0; i <= 40; i++) { var pp = d.pt(d.xr[0] + (d.xr[1] - d.xr[0]) * i / 40); if (i) g.lineTo(SX(pp[0]), SY(pp[1])); else g.moveTo(SX(pp[0]), SY(pp[1])); }
        g.stroke(); g.restore();
      }
      U.bcGlyphs(g, { X: mesh.X, Y: mesh.Y, bedges: mesh.bedges, fixed: m.fixed, pr: m.pr, px: px, py: py, SX: SX, SY: SY, C: C });

      view = { SX: SX, SY: SY, px: px, py: py, W: W, H: H, nodal: F.nodalField(m, S.field) };
      sub.textContent = U.fill(t(sc > 0 ? 'p1s' : 'p1sU'), { smooth: F.isStress(S.field) ? t(raw ? 'sRaw' : 'sAvg') : t('sDisp'), s: fmt(sc) });
      U.colorbar(cbar, cols, lev, fd.unit);
      drawHover(null);
    }
    function setSize(W, H) {
      var dpr = window.devicePixelRatio || 1;
      [cv1, ov1].forEach(function (c) { c.style.height = H + 'px'; if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); } });
    }

    function drawHover(n) {
      var dpr = window.devicePixelRatio || 1, g = ov1.getContext('2d'), rd = q('[data-read="1"]');
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, ov1.width / dpr, ov1.height / dpr);
      if (n == null || !view) { rd.textContent = ''; return; }
      var m = cur.model, sx = view.SX(view.px[n]), sy = view.SY(view.py[n]);
      g.beginPath(); g.arc(sx, sy, 5.5, 0, Math.PI * 2); g.lineWidth = 2; g.strokeStyle = C.surface; g.stroke();
      g.beginPath(); g.arc(sx, sy, 4.5, 0, Math.PI * 2); g.lineWidth = 1.6; g.strokeStyle = C.fg; g.stroke();
      var fd = FIELD[S.field], x = m.mesh.X[n], y = m.mesh.Y[n], v = view.nodal[n] * fd.k, ex = F.exactField(m, S.field, x, y) * fd.k;
      rd.textContent = U.fill(t('readNode'), { x: x.toFixed(3), y: y.toFixed(3), f: SYM[S.field], v: fmt(v) + ' ' + fd.unit }) +
        (isFinite(ex) ? U.fill(t('readExact'), { v: fmt(ex) + ' ' + fd.unit }) : '');
    }
    function nearestNode(ev) {
      if (!view) return null;
      var r = ov1.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, best = null, bd = 18 * 18;
      for (var i = 0; i < view.px.length; i++) { var dx = view.SX(view.px[i]) - mx, dy = view.SY(view.py[i]) - my, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
      return best;
    }
    ov1.addEventListener('mousemove', function (ev) { drawHover(nearestNode(ev)); });
    ov1.addEventListener('mouseleave', function () { drawHover(null); });
    ov1.addEventListener('click', function (ev) { drawHover(nearestNode(ev)); });

    /* ── line plot ────────────────────────────────────────────── */
    function drawLine() {
      var lg = q('[data-lg="2"]');
      if (!lineData) { P2 = U.plot(cv2, { xr: [0, 1], yr: [0, 1] }, C); lg.innerHTML = ''; return; }
      var L = lineData, lo = Infinity, hi = -Infinity;
      L.fe.concat(L.rf).forEach(function (v) { if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } });
      if (!isFinite(lo)) { lo = -1; hi = 1; }
      var pad = (hi - lo) * 0.08 || Math.max(Math.abs(hi) * 0.1, 1e-3); lo -= pad; hi += pad;
      var refOnly = (S.problem === 'cantilever' && S.support === 'clamped') || (S.problem === 'hole' && S.outer === 'uniform');
      var refName = cur.model.pr.key === 'hole' ? (S.outer === 'kirsch' ? t('lgExact') : t('lgKirsch')) : cur.model.pr.key === 'cantilever' ? (S.support === 'exact' ? t('lgExact') : t('lgTimo')) : t('lgExact');
      P2 = U.plot(cv2, { xr: L.d.xr, yr: [lo, hi], xlabel: L.d.xl, ylabel: L.unit, ml: 56,
        hlines: lo < 0 && hi > 0 ? [{ y: 0, stroke: C.border, width: 1.5 }] : [],
        lines: [refOnly ? { x: L.xs, y: L.rf, stroke: C.fg2, width: 1.6, dash: [5, 4] } : { x: L.xs, y: L.rf, stroke: U.rgba(C.fg2, 0.45), width: 5 },
                { x: L.xs, y: L.fe, stroke: C.accent, width: 1.8 }] }, C);
      lg.innerHTML = U.legendHtml([{ t: t('lgFE') + ' (' + S.elem + ')', c: C.accent }, refOnly ? { t: refName, c: C.fg2, dash: true } : { t: refName, c: U.rgba(C.fg2, 0.6) }]);
    }
    cv2.addEventListener('mousemove', function (ev) {
      if (!P2 || !lineData) return;
      var r = cv2.getBoundingClientRect(), x = P2.invX(ev.clientX - r.left), L = lineData, i = 0, bd = Infinity;
      for (var k = 0; k < L.xs.length; k++) { var d = Math.abs(L.xs[k] - x); if (d < bd) { bd = d; i = k; } }
      q('[data-read="2"]').textContent = U.fill(t('readLine'), { x: L.d.xl.split(' ')[0] + ' = ' + fmt(L.xs[i]), fe: fmt(L.fe[i]), ex: fmt(L.rf[i]), u: L.unit });
    });
    cv2.addEventListener('mouseleave', function () { q('[data-read="2"]').textContent = ''; });

    /* ── convergence study ────────────────────────────────────── */
    function hasExact() { return S.problem === 'patch' ? false : S.problem === 'cantilever' ? S.support === 'exact' : S.outer === 'kirsch'; }
    function runStudy() {
      if (!hasExact()) return;
      var tok = ++studyTok, jobs = [], key = studyKey();
      ELEMS.forEach(function (el) { STUDY_N[S.problem].forEach(function (n) { jobs.push({ el: el, n: n }); }); });
      study = { key: key, pts: { T3: [], Q4: [], QM6: [], Q8: [] }, done: 0, total: jobs.length };
      var base = cfg();
      (function next() {
        if (tok !== studyTok) return;
        if (!jobs.length) { study.finished = true; drawConv(); return; }
        var j = jobs.shift(), c = {}; for (var k in base) c[k] = base[k]; c.elem = j.el; c.n = j.n;
        var m = F.run(c);
        if (!m.error) study.pts[j.el].push({ dof: m.ndof, e: F.energyError(m) });
        study.done++; drawConv();
        setTimeout(next, 0);
      })();
    }
    function drawConv() {
      var lg = q('[data-lg="3"]'), msg = q('[data-out="study"]'), btn = q('[data-act="study"]'), series = U.series(C);
      btn.disabled = !hasExact() || !!(study && !study.finished && study.key === studyKey());
      var pts = [], lines = [], items = [], all = [];
      var valid = study && study.key === studyKey();
      if (S.problem === 'patch') msg.textContent = t('noPatch');
      else if (!hasExact()) msg.textContent = t('noExact');
      else if (!study) msg.textContent = t('idle');
      else if (!valid) msg.textContent = t('stale');
      else msg.textContent = study.finished ? '' : U.fill(t('running'), { i: study.done, n: study.total });
      convPts = [];
      if (valid) ELEMS.forEach(function (el, i) {
        var P = study.pts[el]; if (!P.length) return;
        var xs = P.map(function (p) { return p.dof; }), ys = P.map(function (p) { return p.e; }), w = el === S.elem ? 2.6 : 1.6;
        lines.push({ x: xs, y: ys, stroke: series[i], width: w });
        P.forEach(function (p) { pts.push({ x: p.dof, y: p.e, r: el === S.elem ? 5 : 4, fill: series[i], stroke: C.surface, lw: 1.5, shape: SHAPES[i] }); convPts.push({ el: el, dof: p.dof, e: p.e }); all.push(p); });
        var rate = P.length > 1 ? Math.log(P[P.length - 2].e / P[P.length - 1].e) / Math.log(Math.sqrt(P[P.length - 1].dof / P[P.length - 2].dof)) : NaN;
        items.push({ t: el + (isFinite(rate) ? ' · ' + t('rate') + ' ' + rate.toFixed(2) : ''), c: series[i], type: 'marker', shape: SHAPES[i] });
      });
      if (cur && !cur.model.error && cur.err != null && hasExact()) {
        all.push({ dof: cur.model.ndof, e: cur.err });
        pts.push({ x: cur.model.ndof, y: cur.err, r: 7.5, stroke: C.fg, lw: 1.8 });
        items.push({ t: t('cur') + ' (' + S.elem + ')', c: C.surface, type: 'dot', b: C.fg });
      }
      var dx = [10, 1e4], dy = [1e-3, 1];
      if (all.length) {
        var mnx = Math.min.apply(null, all.map(function (p) { return p.dof; })), mxx = Math.max.apply(null, all.map(function (p) { return p.dof; }));
        var mny = Math.min.apply(null, all.map(function (p) { return p.e; })), mxy = Math.max.apply(null, all.map(function (p) { return p.e; }));
        dx = [Math.pow(10, Math.floor(Math.log10(mnx))), Math.pow(10, Math.ceil(Math.log10(mxx)))];
        dy = [Math.pow(10, Math.floor(Math.log10(mny))), Math.pow(10, Math.ceil(Math.log10(mxy)))];
        if (dy[1] / dy[0] < 100) dy[0] = dy[1] / 100;
        if (dx[1] / dx[0] < 100) dx[1] = dx[0] * 100;
      }
      P3 = U.plot(cv3, { xr: dx, yr: dy, xlog: true, ylog: true, xlabel: 'DOF', lines: lines, points: pts }, C);
      lg.innerHTML = U.legendHtml(items);
    }
    cv3.addEventListener('mousemove', function (ev) {
      if (!P3 || !convPts.length) return;
      var r = cv3.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, best = null, bd = 16 * 16;
      convPts.forEach(function (p) { var dx = P3.X(p.dof) - mx, dy = P3.Y(p.e) - my, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = p; } });
      q('[data-read="3"]').textContent = best ? U.fill(t('readConv'), { el: best.el, dof: U.group(best.dof), e: U.sci(best.e) }) : '';
    });
    cv3.addEventListener('mouseleave', function () { q('[data-read="3"]').textContent = ''; });

    /* ── redraw / update ──────────────────────────────────────── */
    function redraw() {
      if (!cur) return;
      sync(); setMetrics(); drawContour(); drawLine(); drawConv();
    }
    var pending = false, needCompute = false;
    function update(recompute) {
      if (recompute) needCompute = true;
      if (pending) return; pending = true;
      requestAnimationFrame(function () {
        pending = false;
        if (needCompute) { needCompute = false; compute(); }
        redraw();
      });
    }

    /* events */
    var RECOMP = { ld: 1, ar: 1, nu: 1, n: 1, distort: 1 };
    function readInput(el) {
      var k = el.getAttribute('data-in'), v = el.value;
      if (k === 'n') S.n[S.problem] = +v;
      else if (k === 'line') S.line = v;
      else if (k === 'field') S.field = v;
      else if (k === 'problem') {
        S.problem = v; S.line = LINES[v][0];
        S.distort = v === 'patch' ? 0.3 : 0;
        S.field = v === 'patch' ? 'sxx' : v === 'hole' ? 'sxx' : 'svm';
        fillLineSelect();
      } else S[k] = +v;
      return k;
    }
    root.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-in'); if (!k || e.target.tagName === 'SELECT') return;
      readInput(e.target);
      if (k === 'scale') { update(false); return; }
      if (RECOMP[k]) {
        if (F.size(cfg()).dof <= LIVE_DOF) update(true);
        else { sync(); var o = q('[data-out="size"]'); o.textContent += ' · ' + t('big'); }
      }
    });
    root.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-in'); if (!k) return;
      readInput(e.target);
      if (k === 'line') { computeLine(); update(false); return; }
      if (k === 'field' || k === 'scale') { if (k === 'field') computeLine(); update(false); return; }
      update(true);
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
      var sg = b.parentNode.getAttribute('data-seg');
      if (sg) {
        S[sg] = b.getAttribute('data-v');
        if (sg === 'smooth') { computeLine(); update(false); }
        else update(sg !== 'mesh');
        return;
      }
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
