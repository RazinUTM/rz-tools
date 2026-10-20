/* ═══════════════════════════════════════════════════════════════
   2D N-RPIM Explorer — UI
   Registered as RZTools tool 'nrpim2d'; mount with <div data-rz-tool="nrpim2d"></div>
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var R = window.RZNRPIM, NB = window.RZNURBS, V = NB.view, F = window.RZFEM, RZT = window.RZTools, U = RZT.util, fmt = U.fmt, FIELD = U.FIELD, SYM = U.FSYM;
  var SHAPES = ['circle', 'square', 'tri', 'diamond'];

  var T = {
    en: {
      gModel: 'Model', gApprox: 'RPIM approximation', gNodes: 'Nodes', gView: 'View',
      problem: 'Problem', phole: 'Plate with a hole (Kirsch)', pcantilever: 'Cantilever (Timoshenko)', pcell: 'Cellular beam unit cell (paper)', ppatch: 'Patch test',
      ld: 'Span / depth `L/D`', support: 'Left support', supExact: 'Exact', supClamp: 'Clamped', ar: 'Hole radius `a / b`', outer: 'Outer edges',
      outKirsch: 'Kirsch', outUniform: 'Uniform', nu: 'Poisson’s ratio ν', load: 'Load case', lcomp: 'Compression', lshear: 'Shear',
      rbf: 'Radial basis function', mq: 'MQ', tps: 'TPS', m: 'Polynomial terms', m0: 'None', m3: 'Linear', m6: 'Quadratic',
      alpha: 'Support radius `d = α h`, α', ng: 'Gauss points per cell',
      n: 'Refinement level', size: '{nodes} nodes · {dof} DOF · {cells} cells', distort: 'Irregular nodes', shuffle: 'New layout',
      field: 'Contour', fsvm: 'Von Mises stress', fsxx: 'Stress σxx', fsyy: 'Stress σyy', fsxy: 'Shear stress τxy', fumag: 'Displacement |u|', fux: 'Displacement ux', fuy: 'Displacement uy',
      fphi: 'Shape function φ of the selected node', show: 'Show', oNodes: 'Nodes', oSupport: 'Support', oCells: 'Cells', oKnots: 'Knot lines', oNet: 'Control net', oGauss: 'Gauss points',
      scale: 'Deformation scale', reset: 'Reset',
      mDof: 'DOF · {nn} nodes · {gp} Gauss points', mTip: 'Tip deflection v(L, 0) · Timoshenko {v}', mScf: 'SCF = σxx(0, a) / σ₀ · Kirsch 3', mScfU: 'SCF = σxx(0, a) / σ₀ · Kirsch ∞ plate 3',
      mPatch: 'max |σ − σexact| / σ₀', mRefA: 'v at A (0.8, 0.2) · paper {v}', mRefB: 'v at B (0.8, 1.0) · paper {v}',
      mErr: 'Relative error, energy norm', mErrNone: 'Energy-norm error · needs an exact solution', mSup: 'nodes per support, mean ({a}–{b})', mTime: 'assemble + solve',
      mUA: 'u at A · paper {v}',
      pass: 'passed', notExact: 'not exact',
      support_: 'The moment matrix G is singular in {n} cells: their support holds too few nodes for the polynomial terms. Increase the support radius or the refinement.',
      singular: 'The stiffness matrix is singular. Increase the support radius or the refinement.',
      m0Note: 'Without polynomial terms the MQ and TPS functions used here cannot reproduce a constant or a linear displacement, so the result is poor. RPIM normally adds at least the linear terms.',
      patchNote: 'N-RPIM does not pass the patch test exactly. Each integration cell uses its own support, so the shape functions jump slightly across cell edges (they still interpolate the nodes). More Gauss points do not remove the error, because it comes from these jumps, not from the quadrature.',
      clamped: 'Clamped support: every point on x = 0 is fixed, so no error norm is shown, and the stresses at the clamped corners are singular.',
      uniform: 'Uniform tension on a finite plate: Kirsch’s solution is for an infinite plate, so no error norm is shown.',
      cellNote: 'Geometry, material (E = 210 GPa, ν = 0.25) and loads (1 kN/m on a 1 mm web) from Mokhtaram et al. (2022). The supports are applied at nodes, as in the paper. The geometry is only C⁰ across the bold knot lines η = 0.2, 0.5 and 0.8, so the supports of the shape functions stop at these lines.',
      phiNote: 'RPIM shape functions interpolate: φ = {v} at its own node and zero at every other node (the Kronecker delta property). That is why the essential conditions are applied straight to the nodal values, as in FEM.',
      big: 'Large model: it solves when you release the slider.', solving: 'Solving…', fail2: 'The model could not be solved.',
      p1s: '{f} in the physical space, on the deformed shape (displacements × {s}). Tap a node to select it; hover to read values.',
      p1sU: '{f} in the physical space. Tap a node to select it; hover to read values.',
      p2: 'Parameter space', p2s: 'The same field on the NURBS parameter space (ξ, η). Nodes and integration cells are laid out here, each knot span divided into equal cells; the NURBS map then carries them to the physical domain. Hover either view to follow a point.',
      iKnots: 'Knot vectors', iCp: 'Control net', iCpV: '{a} × {b} control points · weights {w}', iC0: 'C⁰ lines', iNone: 'none', iLat: 'Lattice', iLatV: '{a} × {b} nodes · {c} cells · {g} Gauss points',
      iMap: 'Integration', iMapV: 'parent [−1, 1]² → parameter cell (affine) → physical (NURBS): B = Ĵ⁻¹ J̃⁻¹ B̃', iHover: 'Point',
      readMap: '(ξ, η) = ({u}, {v}) → (x, y) = ({x}, {y}) m · |J| = {j}',
      p3: 'Along a line', p3s: 'N-RPIM result against the reference solution. Hover to read values.',
      lcantilever_sxx: 'σxx through the depth at x = L/2', lcantilever_sxy: 'τxy through the depth at x = L/2', lcantilever_uy: 'Deflection along the axis y = 0',
      lhole_sxx: 'σxx along x = 0, from the hole to the edge', lhole_stt: 'σθθ around the hole, θ = 0° → 90°', lpatch_sxx: 'σxx along y = 0.5', lpatch_ux: 'ux along y = 0.5',
      lcell_syy: 'σyy across the web post at y = 0.5', lcell_uy: 'uy along the right edge x = 0.8', lcell_sxx: 'σxx along the top edge y = 1',
      lgFE: 'N-RPIM', lgExact: 'exact', lgKirsch: 'Kirsch (infinite plate)', lgTimo: 'Timoshenko (exact support)', lgFem: 'FEM Q4, same nodes', lgRef: 'paper reference',
      p4: 'N-RPIM against FEM', p4s: 'Relative energy-norm error against DOF: N-RPIM with MQ and with TPS radial basis functions, and bilinear Q4 finite elements on the same nodes. The Q4 elements have straight sides, so a curved edge becomes a polygon. Polynomial terms, support radius, Gauss points, ν, geometry and node layout follow your settings.',
      p4sCell: 'Error in the paper’s reference displacement against DOF: N-RPIM with MQ and with TPS, and bilinear Q4 finite elements on the same nodes. Support radius, Gauss points and node layout follow your settings.',
      run: 'Run comparison', running: 'Solving {i} of {n}…', stale: 'Settings changed since the last run. Run it again.', idle: 'Press “Run comparison” to solve {n} models, from coarse to fine.',
      noExact: 'The comparison needs an exact solution: choose the exact support or Kirsch tractions.', noPatch: 'Use the plate, the cantilever or the unit cell for the comparison.',
      sMQ: 'N-RPIM · MQ', sTPS: 'N-RPIM · TPS', sQ4: 'FEM Q4, same nodes', rate: 'rate', cur: 'current model', yErr: 'energy-norm error', yRef: '|error| in {q}',
      readNode: 'node {i} at ({x}, {y}) m · {f} = {v}', readExact: ' · exact {v}', readLine: '{x} · N-RPIM {fe} · ref {ex} {u}', readConv: '{s} · {dof} DOF · error {e}'
    },
    ms: {
      gModel: 'Model', gApprox: 'Approximation RPIM', gNodes: 'Nod', gView: 'Paparan',
      problem: 'Masalah', phole: 'Plat berlubang (Kirsch)', pcantilever: 'Cantilever (Timoshenko)', pcell: 'Unit cell cellular beam (paper)', ppatch: 'Patch test',
      ld: 'Rentang / kedalaman `L/D`', support: 'Support kiri', supExact: 'Exact', supClamp: 'Clamped', ar: 'Jejari lubang `a / b`', outer: 'Sisi luar',
      outKirsch: 'Kirsch', outUniform: 'Seragam', nu: 'Poisson’s ratio ν', load: 'Kes beban', lcomp: 'Mampatan', lshear: 'Ricih',
      rbf: 'Radial basis function', mq: 'MQ', tps: 'TPS', m: 'Sebutan polinomial', m0: 'Tiada', m3: 'Linear', m6: 'Kuadratik',
      alpha: 'Jejari support `d = α h`, α', ng: 'Gauss points setiap cell',
      n: 'Tahap refinement', size: '{nodes} nod · {dof} DOF · {cells} cell', distort: 'Nod tidak sekata', shuffle: 'Susunan baharu',
      field: 'Kontur', fsvm: 'Tegasan von Mises', fsxx: 'Tegasan σxx', fsyy: 'Tegasan σyy', fsxy: 'Tegasan ricih τxy', fumag: 'Sesaran |u|', fux: 'Sesaran ux', fuy: 'Sesaran uy',
      fphi: 'Shape function φ bagi nod terpilih', show: 'Papar', oNodes: 'Nod', oSupport: 'Support', oCells: 'Cell', oKnots: 'Knot lines', oNet: 'Control net', oGauss: 'Gauss points',
      scale: 'Skala ubah bentuk', reset: 'Set semula',
      mDof: 'DOF · {nn} nod · {gp} Gauss points', mTip: 'Pesongan hujung v(L, 0) · Timoshenko {v}', mScf: 'SCF = σxx(0, a) / σ₀ · Kirsch 3', mScfU: 'SCF = σxx(0, a) / σ₀ · Kirsch plat ∞ 3',
      mPatch: 'max |σ − σexact| / σ₀', mRefA: 'v pada A (0.8, 0.2) · paper {v}', mRefB: 'v pada B (0.8, 1.0) · paper {v}',
      mErr: 'Ralat relatif, energy norm', mErrNone: 'Ralat energy norm · perlukan exact solution', mSup: 'nod setiap support, purata ({a}–{b})', mTime: 'assemble + solve',
      mUA: 'u pada A · paper {v}',
      pass: 'lulus', notExact: 'tidak exact',
      support_: 'Moment matrix G singular dalam {n} cell: support-nya mengandungi terlalu sedikit nod untuk sebutan polinomial. Naikkan jejari support atau refinement.',
      singular: 'Stiffness matrix singular. Naikkan jejari support atau refinement.',
      m0Note: 'Tanpa sebutan polinomial, fungsi MQ dan TPS di sini tidak dapat menghasilkan semula sesaran malar atau linear, jadi keputusannya lemah. RPIM biasanya menambah sekurang-kurangnya sebutan linear.',
      patchNote: 'N-RPIM tidak lulus patch test secara exact. Setiap integration cell menggunakan support sendiri, jadi shape functions melompat sedikit merentas sisi cell (ia tetap menginterpolasi nod). Tambahan Gauss points tidak menghapuskan ralat ini kerana puncanya ialah lompatan tersebut, bukan quadrature.',
      clamped: 'Support clamped: setiap titik pada x = 0 ditetapkan, jadi energy norm tidak dipaparkan, dan tegasan di sudut clamped adalah singular.',
      uniform: 'Tegangan seragam pada plat terhingga: penyelesaian Kirsch adalah untuk plat tak terhingga, jadi energy norm tidak dipaparkan.',
      cellNote: 'Geometri, bahan (E = 210 GPa, ν = 0.25) dan beban (1 kN/m pada web 1 mm) daripada Mokhtaram et al. (2022). Support dikenakan pada nod seperti dalam paper. Geometri hanya C⁰ merentas knot lines tebal η = 0.2, 0.5 dan 0.8, jadi support bagi shape functions berhenti pada garis ini.',
      phiNote: 'Shape functions RPIM menginterpolasi: φ = {v} pada nodnya sendiri dan sifar pada semua nod lain (sifat Kronecker delta). Sebab itu essential conditions dikenakan terus pada nilai nodal, sama seperti FEM.',
      big: 'Model besar: ia diselesaikan apabila anda melepaskan slider.', solving: 'Menyelesaikan…', fail2: 'Model tidak dapat diselesaikan.',
      p1s: '{f} dalam ruang fizikal, pada bentuk terubah (sesaran × {s}). Ketik nod untuk memilihnya; halakan untuk membaca nilai.',
      p1sU: '{f} dalam ruang fizikal. Ketik nod untuk memilihnya; halakan untuk membaca nilai.',
      p2: 'Ruang parameter', p2s: 'Medan yang sama pada ruang parameter NURBS (ξ, η). Nod dan integration cells disusun di sini, setiap knot span dibahagi kepada cell yang sama saiz; pemetaan NURBS kemudian membawanya ke domain fizikal. Halakan pada mana-mana paparan untuk menjejak satu titik.',
      iKnots: 'Knot vectors', iCp: 'Control net', iCpV: '{a} × {b} control points · pemberat {w}', iC0: 'Garis C⁰', iNone: 'tiada', iLat: 'Kekisi', iLatV: '{a} × {b} nod · {c} cell · {g} Gauss points',
      iMap: 'Kamiran', iMapV: 'parent [−1, 1]² → cell parameter (affine) → fizikal (NURBS): B = Ĵ⁻¹ J̃⁻¹ B̃', iHover: 'Titik',
      readMap: '(ξ, η) = ({u}, {v}) → (x, y) = ({x}, {y}) m · |J| = {j}',
      p3: 'Sepanjang satu garis', p3s: 'Keputusan N-RPIM berbanding penyelesaian rujukan. Halakan untuk membaca nilai.',
      lcantilever_sxx: 'σxx merentas kedalaman pada x = L/2', lcantilever_sxy: 'τxy merentas kedalaman pada x = L/2', lcantilever_uy: 'Pesongan sepanjang paksi y = 0',
      lhole_sxx: 'σxx sepanjang x = 0, dari lubang ke sisi', lhole_stt: 'σθθ sekeliling lubang, θ = 0° → 90°', lpatch_sxx: 'σxx sepanjang y = 0.5', lpatch_ux: 'ux sepanjang y = 0.5',
      lcell_syy: 'σyy merentas web post pada y = 0.5', lcell_uy: 'uy sepanjang sisi kanan x = 0.8', lcell_sxx: 'σxx sepanjang sisi atas y = 1',
      lgFE: 'N-RPIM', lgExact: 'exact', lgKirsch: 'Kirsch (plat tak terhingga)', lgTimo: 'Timoshenko (support exact)', lgFem: 'FEM Q4, nod yang sama', lgRef: 'rujukan paper',
      p4: 'N-RPIM berbanding FEM', p4s: 'Ralat relatif energy norm berbanding DOF: N-RPIM dengan radial basis function MQ dan TPS, dan finite element bilinear Q4 pada nod yang sama. Element Q4 bersisi lurus, jadi sisi melengkung menjadi poligon. Sebutan polinomial, jejari support, Gauss points, ν, geometri dan susunan nod mengikut tetapan anda.',
      p4sCell: 'Ralat sesaran rujukan paper berbanding DOF: N-RPIM dengan MQ dan TPS, dan finite element bilinear Q4 pada nod yang sama. Jejari support, Gauss points dan susunan nod mengikut tetapan anda.',
      run: 'Jalankan perbandingan', running: 'Menyelesaikan {i} daripada {n}…', stale: 'Tetapan telah berubah sejak larian terakhir. Jalankan semula.', idle: 'Tekan “Jalankan perbandingan” untuk menyelesaikan {n} model, dari kasar ke halus.',
      noExact: 'Perbandingan ini perlukan exact solution: pilih support exact atau traction Kirsch.', noPatch: 'Gunakan plat, cantilever atau unit cell untuk perbandingan.',
      sMQ: 'N-RPIM · MQ', sTPS: 'N-RPIM · TPS', sQ4: 'FEM Q4, nod yang sama', rate: 'kadar', cur: 'model semasa', yErr: 'ralat energy norm', yRef: '|ralat| dalam {q}',
      readNode: 'nod {i} pada ({x}, {y}) m · {f} = {v}', readExact: ' · exact {v}', readLine: '{x} · N-RPIM {fe} · rujukan {ex} {u}', readConv: '{s} · {dof} DOF · ralat {e}'
    }
  };

  var NMAX = { hole: 14, cantilever: 10, cell: 12, patch: 10 };
  var LINES = { cantilever: ['sxx', 'sxy', 'uy'], hole: ['sxx', 'stt'], patch: ['sxx', 'ux'], cell: ['syy', 'uy', 'sxx'] };
  var STUDY_N = { cantilever: [2, 3, 4, 6], hole: [2, 4, 6, 8, 12], cell: [2, 3, 4, 6, 8] };
  var SERIES = [{ k: 'sMQ', rbf: 'mq' }, { k: 'sTPS', rbf: 'tps' }, { k: 'sQ4', fem: true }];
  var LIVE_COST = 1e6, SUB = 4;

  function seg(name, opts) {
    return '<div class="rzt-seg" role="group" data-seg="' + name + '">' + opts.map(function (o) {
      return '<button type="button" data-v="' + o[0] + '"' + (o[1] ? ' data-k="' + o[1] + '"' : '') + '>' + (o[2] || '') + '</button>';
    }).join('') + '</div>';
  }
  function rng(k, min, max, step) { return '<input class="rzt-rng" type="range" min="' + min + '" max="' + max + '" step="' + step + '" data-in="' + k + '">'; }
  function lab(k, out) { return '<span class="rzt-lab"><span data-k="' + k + '"></span>' + (out ? '<output data-out="' + k + '"></output>' : '') + '</span>'; }
  function chip(k) { return '<button type="button" data-ov="' + k + '" data-k="o' + k.charAt(0).toUpperCase() + k.slice(1) + '"></button>'; }

  var HTML =
    '<div class="rzt-body">' +
      '<div class="rzt-ctrl">' +
        '<p class="rzt-grp" data-k="gModel"></p>' +
        '<label class="rzt-field rzt-wide"><span class="rzt-lab" data-k="problem"></span>' +
          '<select class="rzt-sel" data-in="problem"><option value="hole" data-k="phole"></option><option value="cantilever" data-k="pcantilever"></option><option value="cell" data-k="pcell"></option><option value="patch" data-k="ppatch"></option></select></label>' +
        '<label class="rzt-field" data-only="cantilever">' + lab('ld', true) + rng('ld', 2, 12, 1) + '</label>' +
        '<div class="rzt-field" data-only="cantilever"><span class="rzt-lab" data-k="support"></span>' + seg('support', [['exact', 'supExact'], ['clamped', 'supClamp']]) + '</div>' +
        '<label class="rzt-field" data-only="hole">' + lab('ar', true) + rng('ar', 0.1, 0.5, 0.05) + '</label>' +
        '<div class="rzt-field" data-only="hole"><span class="rzt-lab" data-k="outer"></span>' + seg('outer', [['kirsch', 'outKirsch'], ['uniform', 'outUniform']]) + '</div>' +
        '<div class="rzt-field" data-only="cell"><span class="rzt-lab" data-k="load"></span>' + seg('load', [['comp', 'lcomp'], ['shear', 'lshear']]) + '</div>' +
        '<label class="rzt-field" data-not="cell">' + lab('nu', true) + rng('nu', 0, 0.49, 0.01) + '</label>' +
        '<p class="rzt-grp" data-k="gApprox"></p>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="rbf"></span>' + seg('rbf', [['mq', 'mq'], ['tps', 'tps']]) + '</div>' +
        '<div class="rzt-field rzt-wide"><span class="rzt-lab" data-k="m"></span>' + seg('m', [['0', 'm0'], ['3', 'm3'], ['6', 'm6']]) + '</div>' +
        '<label class="rzt-field">' + lab('alpha', true) + rng('alpha', 2, 4, 0.5) + '</label>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="ng"></span>' + seg('ng', [['2', '', '2×2'], ['3', '', '3×3'], ['4', '', '4×4'], ['5', '', '5×5']]) + '</div>' +
        '<p class="rzt-grp" data-k="gNodes"></p>' +
        '<label class="rzt-field">' + lab('n', true) + rng('n', 2, 10, 1) + '<span class="rzt-size" data-out="size"></span></label>' +
        '<div class="rzt-field" data-not="cell">' + lab('distort', true) + rng('distort', 0, 0.4, 0.05) + '<button type="button" class="rzt-btn" data-act="shuffle" data-k="shuffle"></button></div>' +
        '<p class="rzt-grp" data-k="gView"></p>' +
        '<label class="rzt-field rzt-wide"><span class="rzt-lab" data-k="field"></span>' +
          '<select class="rzt-sel" data-in="field">' + ['svm', 'sxx', 'syy', 'sxy', 'umag', 'ux', 'uy', 'phi'].map(function (f) { return '<option value="' + f + '" data-k="f' + f + '"></option>'; }).join('') + '</select></label>' +
        '<div class="rzt-field rzt-wide"><span class="rzt-lab" data-k="show"></span><div class="rzt-chips">' +
          chip('nodes') + chip('support') + chip('cells') + chip('knots') + chip('net') + chip('gauss') + '</div></div>' +
        '<label class="rzt-field">' + lab('scale', true) + rng('scale', 0, 3, 0.1) + '</label>' +
        '<button type="button" class="rzt-btn rzt-reset" data-act="reset" data-k="reset"></button>' +
      '</div>' +
      '<div class="rzt-main">' +
        '<div class="rzt-metrics">' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="dof"></span><span class="rzt-ml" data-m="dofl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv"><span data-m="q"></span> <span class="rzt-chip" data-m="qc"></span></span><span class="rzt-ml" data-m="ql"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv"><span data-m="err"></span> <span class="rzt-chip" data-m="errc"></span></span><span class="rzt-ml" data-m="errl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="sup"></span><span class="rzt-ml" data-m="supl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="fem"></span><span class="rzt-ml" data-m="feml"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="time"></span><span class="rzt-ml" data-k="mTime"></span></div>' +
        '</div>' +
        '<div class="rzt-note rzt-warn" data-note="warn" hidden></div>' +
        '<div class="rzt-note rzt-ok" data-note="ok" hidden></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-h="1"></span><span class="rzt-sub" data-sub="1"></span></div>' +
          '<div class="rzt-cvwrap"><canvas class="rzt-cv rzt-cv-fem" data-cv="1"></canvas><canvas class="rzt-ov" data-ov="1" aria-hidden="true"></canvas></div>' +
          '<div class="rzt-cbar" data-cbar></div><span class="rzt-read rzt-read-b" data-read="1"></span></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p2"></span><span class="rzt-sub" data-k="p2s"></span></div>' +
          '<div class="rzt-ps"><div class="rzt-cvwrap rzt-psq"><canvas class="rzt-cv rzt-cv-ps" data-cv="p"></canvas><canvas class="rzt-ov" data-ov="p" aria-hidden="true"></canvas></div>' +
          '<dl class="rzt-info" data-info></dl></div></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p3"></span>' +
          '<select class="rzt-sel rzt-sel-inline" data-in="line"></select><span class="rzt-sub" data-k="p3s"></span><div class="rzt-legend" data-lg="2"></div></div>' +
          '<canvas class="rzt-cv" data-cv="2"></canvas><span class="rzt-read" data-read="2"></span></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p4"></span><span class="rzt-sub" data-sub="4"></span>' +
          '<div class="rzt-row"><button type="button" class="rzt-btn rzt-primary" data-act="study" data-k="run"></button><span class="rzt-sub" data-out="study"></span></div>' +
          '<div class="rzt-legend" data-lg="3"></div></div>' +
          '<canvas class="rzt-cv" data-cv="3"></canvas><span class="rzt-read" data-read="3"></span></div>' +
      '</div>' +
    '</div>';

  var DEFAULTS = { problem: 'hole', ld: 5, support: 'exact', ar: 0.25, outer: 'kirsch', nu: 0.3, load: 'comp', rbf: 'mq', m: '3', alpha: 2.5, ng: '4',
                   distort: 0, seed: 7, field: 'sxx', scale: 1, line: 'sxx',
                   n: { hole: 6, cantilever: 4, cell: 4, patch: 4 }, ov: { nodes: true, support: true, cells: false, knots: true, net: true, gauss: false }, sel: null };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  RZT.register('nrpim2d', function (root) {
    root.classList.add('rzt', 'rzt-on');
    root.innerHTML = HTML;
    var S = clone(DEFAULTS), C = U.readColors(root), lang = 'en', cur = null, study = null, studyTok = 0, lastW = 0;
    function q(sel) { return root.querySelector(sel); }
    function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    function t(k) { return (T[lang] || T.en)[k] || T.en[k] || k; }
    var cv1 = q('[data-cv="1"]'), ov1 = q('[data-ov="1"]'), cvp = q('[data-cv="p"]'), ovp = q('[data-ov="p"]'), cv2 = q('[data-cv="2"]'), cv3 = q('[data-cv="3"]');
    var view = null, pview = null, P2 = null, P3 = null, lineData = null, convPts = [], hover = null;

    function cfg(extra) {
      var c = { problem: S.problem, n: S.n[S.problem], ld: S.ld, support: S.support, ar: S.ar, outer: S.outer, nu: S.nu, load: S.load,
                distort: S.problem === 'cell' ? 0 : S.distort, seed: S.seed, rbf: S.rbf, m: +S.m, alpha: S.alpha, ng: +S.ng };
      for (var k in extra) c[k] = extra[k];
      return c;
    }
    // ≈ solve time in units of 0.1 µs: Gauss points × (nodes per support)² (measured in Chromium)
    function cost(c) { var sz = R.size(c), s = 2.1 * c.alpha * c.alpha + c.m; return sz.gauss * s * s; }
    function studyKey() { return [S.problem, S.ld, S.support, S.ar, S.outer, S.nu, S.load, S.distort, S.seed, S.m, S.alpha, S.ng].join('|'); }

    /* ── compute ───────────────────────────────────────────────── */
    function compute() {
      var key = JSON.stringify(cfg());
      if (cur && cur.key === key) { computeLine(); return; }
      var m = R.run(cfg()), r = { model: m, key: key };
      hover = null;   // indices of the previous model are not valid any more
      if (!m.error) {
        var md = m.md, nn = md.nn, i, out = new Float64Array(5), sm = V.samples(md, SUB), ns = sm.n;
        r.err = R.energyError(m); r.sup = R.supportStats(m); r.sm = sm;
        r.V = new Float64Array(ns * 5).fill(NaN);
        for (i = 0; i < ns; i++) { var v = R.evalAt(m, sm.A[i], sm.B[i], sm.SA[i], sm.SB[i], out, sm.CI[i], sm.CJ[i]); if (v) r.V.set(v, i * 5); }
        r.nodeV = new Float64Array(nn * 5);
        for (i = 0; i < nn; i++) { var w = R.evalAt(m, md.lat.A[i], md.lat.B[i], 1, 1, out); if (w) r.nodeV.set(w, i * 5); }
        var umax = 0;
        for (i = 0; i < ns; i++) { var ux = r.V[i * 5], uy = r.V[i * 5 + 1]; if (isFinite(ux)) umax = Math.max(umax, Math.hypot(ux, uy)); }
        r.umax = umax;
        var pr = m.pr;
        if (pr.key === 'cantilever') { var tp = R.evalParam(m, 1, 0.5); r.q = tp ? tp[1] : NaN; r.qref = pr.ref.tip; }
        else if (pr.key === 'hole') { var hp = R.evalParam(m, 0, 1); r.q = hp ? hp[2] / pr.s0 : NaN; }
        else if (pr.key === 'cell') {
          r.refs = pr.ref.pts.map(function (p) { var vv = R.evalParam(m, p.u, p.v); return vv ? (p.f === 'ux' ? vv[0] : vv[1]) : NaN; });
          var fm = R.femRun(cfg()); r.fem = fm.error ? null : pr.ref.pts.map(function (p) { var nd = R.femNode(fm, p.u, p.v); return fm.u[2 * nd + (p.f === 'ux' ? 0 : 1)]; });
        } else { var er = 0; for (i = 0; i < ns; i++) if (isFinite(r.V[i * 5 + 2])) er = Math.max(er, Math.abs(r.V[i * 5 + 2] - pr.s0), Math.abs(r.V[i * 5 + 3]), Math.abs(r.V[i * 5 + 4])); r.q = er / pr.s0; }
        if (pr.key !== 'cell' && pr.exact) { var fm2 = R.femRun(cfg()); r.femErr = fm2.error ? null : F.energyError(fm2); }
        // fixed DOFs for the support glyphs; boundary segments of the lattice
        r.fixed = m.fixed;
        var lat = md.lat, be = [];
        for (i = 0; i < lat.Mu; i++) { be.push({ tag: 't0', n: [lat.node(i, 0), lat.node(i + 1, 0)] }); be.push({ tag: 't1', n: [lat.node(i + 1, lat.Mv), lat.node(i, lat.Mv)] }); }
        for (i = 0; i < lat.Mv; i++) { be.push({ tag: 's0', n: [lat.node(0, i + 1), lat.node(0, i)] }); be.push({ tag: 's1', n: [lat.node(lat.Mu, i), lat.node(lat.Mu, i + 1)] }); }
        r.bedges = be;
        r.points = pr.points.map(function (p) { return { n: lat.node(Math.round(md.ax.index(p.u)), Math.round(md.ay.index(p.v))), ux: p.ux, uy: p.uy }; });
        if (S.sel == null || S.sel >= nn) S.sel = defaultNode(md);
      }
      cur = r;
      computeLine();
    }
    function defaultNode(md) {
      var lat = md.lat, i = Math.round(lat.Mu * (md.pr.key === 'hole' ? 0.3 : 0.5)), j = Math.round(lat.Mv * (md.pr.key === 'cell' ? 0.25 : 0.5));
      return lat.node(Math.max(0, Math.min(lat.Mu, i)), Math.max(0, Math.min(lat.Mv, j)));
    }

    // a line in the parameter space: pt(s) → [ξ, η], x-axis value, and a reference
    function lineDef() {
      var m = cur.model, pr = m.pr, key = S.line;
      if (pr.key === 'cantilever') {
        var L = pr.L, D = pr.D, tm = pr.timo;
        if (key === 'uy') return { f: 'uy', xr: [0, L], xl: 'x (m)', pt: function (s) { return [s / L, 0.5]; }, ref: function (s) { return tm.u(s, 0)[1]; } };
        var c = key === 'sxy' ? 2 : 0;
        return { f: key === 'sxy' ? 'sxy' : 'sxx', xr: [-D / 2, D / 2], xl: 'y (m)', pt: function (s) { return [0.5, (s + D / 2) / D]; }, ref: function (s) { return tm.s(L / 2, s)[c]; } };
      }
      if (pr.key === 'hole') {
        var a = pr.a, b = pr.b, ks = pr.kirschS, P = m.md.patch;
        if (key === 'stt') return { f: 'stt', xr: [0, 90], xl: 'θ (°)', param: true, pt: function (s) { return [0, s]; }, x: function (u, v) { var p = P.point(u, v); return Math.atan2(p[1], p[0]) * 180 / Math.PI; },
          ref: function (th) { th *= Math.PI / 180; return stt(ks(a * Math.cos(th), a * Math.sin(th)), th); } };
        return { f: 'sxx', xr: [a, b], xl: 'y (m)', param: true, pt: function (s) { return [s, 1]; }, x: function (u, v) { return P.point(u, v)[1]; }, ref: function (y) { return ks(0, y)[0]; } };
      }
      if (pr.key === 'cell') {
        if (key === 'uy') return { f: 'uy', xr: [0, 1], xl: 'y (m)', param: true, pt: function (s) { return [1, s]; }, x: function (u, v) { return m.md.patch.point(u, v)[1]; }, ref: null, cellRef: true };
        if (key === 'sxx') return { f: 'sxx', xr: [0, 0.8], xl: 'x (m)', pt: function (s) { return [s / 0.8, 1]; }, ref: null };
        return { f: 'syy', xr: [0.3, 0.5], xl: 'x (m)', pt: function (s) { return [(s - 0.3) / 0.2, 0.5]; }, ref: null };
      }
      if (key === 'ux') return { f: 'ux', xr: [0, 1], xl: 'x (m)', pt: function (s) { return [s, 0.5]; }, ref: function (s) { return pr.exact.u(s, 0.5)[0]; } };
      return { f: 'sxx', xr: [0, 1], xl: 'x (m)', pt: function (s) { return [s, 0.5]; }, ref: function () { return pr.s0; } };
    }
    function stt(s3, th) { var c = Math.cos(th), s = Math.sin(th); return s3[0] * s * s + s3[1] * c * c - 2 * s3[2] * s * c; }
    function computeLine() {
      lineData = null;
      var m = cur.model; if (m.error) return;
      var d = lineDef(), Np = 97, xs = [], fe = [], rf = [], out = new Float64Array(5), k = d.f === 'stt' ? 1e-6 : FIELD[d.f].k, md = m.md;
      for (var i = 0; i < Np; i++) {
        var s = d.param ? i / (Np - 1) : d.xr[0] + (d.xr[1] - d.xr[0]) * i / (Np - 1), uv = d.pt(s), x = d.param ? d.x(uv[0], uv[1]) : s;
        // keep points that sit on a C⁰ knot line on one side
        var a = md.ax.index(uv[0]), b = md.ay.index(uv[1]), v = R.evalAt(m, a, b, 1, 1, out), val = NaN;
        if (v) val = d.f === 'stt' ? stt([v[2], v[3], v[4]], x * Math.PI / 180) : F.fieldOf(d.f, [v[0], v[1]], [v[2], v[3], v[4]]);
        xs.push(x); fe.push(val * k); rf.push(d.ref ? d.ref(x) * k : NaN);
      }
      lineData = { d: d, xs: xs, fe: fe, rf: rf, unit: d.f === 'stt' || F.isStress(d.f) ? 'MPa' : 'mm', k: k };
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
      var sz = R.size(cfg());
      q('[data-in="problem"]').value = S.problem; q('[data-in="field"]').value = S.field;
      var ni = q('[data-in="n"]'); ni.max = NMAX[S.problem]; ni.value = S.n[S.problem];
      ['ld', 'ar', 'nu', 'alpha', 'distort', 'scale'].forEach(function (k) { q('[data-in="' + k + '"]').value = S[k]; });
      q('[data-out="n"]').textContent = S.n[S.problem]; q('[data-out="ld"]').textContent = S.ld; q('[data-out="ar"]').textContent = S.ar.toFixed(2);
      q('[data-out="nu"]').textContent = S.nu.toFixed(2); q('[data-out="alpha"]').textContent = S.alpha.toFixed(1); q('[data-out="distort"]').textContent = S.distort.toFixed(2);
      q('[data-out="scale"]').textContent = cur && !cur.model.error ? '×' + fmt(S.scale * autoScale()) : S.scale.toFixed(1);
      q('[data-out="size"]').textContent = U.fill(t('size'), { nodes: U.group(sz.nodes), dof: U.group(sz.dof), cells: U.group(sz.cells) }) + (pendingBig ? ' · ' + t('big') : '');
      ['support', 'outer', 'load', 'rbf', 'm', 'ng'].forEach(function (g) { qa('[data-seg="' + g + '"] button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === String(S[g]))); }); });
      qa('[data-ov]').forEach(function (b) { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(!!S.ov[b.getAttribute('data-ov')])); });
      qa('[data-only]').forEach(function (el) { el.hidden = el.getAttribute('data-only') !== S.problem; });
      qa('[data-not]').forEach(function (el) { el.hidden = el.getAttribute('data-not') === S.problem; });
      q('[data-act="shuffle"]').hidden = !(S.distort > 0);
    }
    function autoScale() { var bb = cur.model.pr.bbox, L = Math.max(bb[1] - bb[0], bb[3] - bb[2]); return cur.umax > 0 ? 0.08 * L / cur.umax : 0; }
    function hasExact() { return S.problem === 'cantilever' ? S.support === 'exact' : S.problem === 'hole' ? S.outer === 'kirsch' : true; }
    function chipPct(el, ratio) {
      var dv = Math.abs(ratio - 1); el.textContent = (ratio * 100).toFixed(dv < 0.001 ? 2 : 1) + '%';
      el.classList.add(dv <= 0.01 ? 'is-good' : dv <= 0.05 ? 'is-ok' : 'is-bad');
    }

    function setMetrics() {
      function put(k, v) { q('[data-m="' + k + '"]').textContent = v; }
      var m = cur.model, chp = q('[data-m="qc"]'), chp2 = q('[data-m="errc"]'), warn = q('[data-note="warn"]'), ok = q('[data-note="ok"]'), sz = R.size(cfg());
      chp.className = 'rzt-chip'; chp.textContent = ''; chp2.className = 'rzt-chip'; chp2.textContent = ''; warn.hidden = true; ok.hidden = true;
      put('dof', U.group(sz.dof)); put('dofl', U.fill(t('mDof'), { nn: U.group(sz.nodes), gp: U.group(sz.gauss) }));
      if (m.error) {
        ['q', 'err', 'sup', 'fem', 'time'].forEach(function (k) { put(k, '—'); }); ['ql', 'errl', 'supl', 'feml'].forEach(function (k) { put(k, ''); });
        warn.textContent = U.fill(t(m.error === 'support' ? 'support_' : m.error) || t('fail2'), { n: m.bad || 0 }); warn.hidden = false; return;
      }
      var pr = m.pr, W = [], O = [];
      put('fem', '—'); put('feml', '');
      if (pr.key === 'cantilever') {
        put('q', fmt(cur.q * 1e3) + ' mm'); put('ql', U.fill(t('mTip'), { v: fmt(cur.qref * 1e3) + ' mm' })); chipPct(chp, cur.q / cur.qref);
        if (S.support === 'clamped') W.push(t('clamped'));
      } else if (pr.key === 'hole') {
        put('q', isFinite(cur.q) ? cur.q.toFixed(3) : '—');
        if (S.outer === 'kirsch') { put('ql', t('mScf')); chipPct(chp, cur.q / 3); } else { put('ql', t('mScfU')); W.push(t('uniform')); }
      } else if (pr.key === 'cell') {
        var iv = pr.ref.pts.length - 1, ref = pr.ref.pts[iv];
        put('q', fmt(cur.refs[iv] * 1e3) + ' mm'); put('ql', U.fill(t(pr.load === 'shear' ? 'mRefB' : 'mRefA'), { v: fmt(ref.val * 1e3) + ' mm' })); chipPct(chp, cur.refs[iv] / ref.val);
        O.push(t('cellNote'));
      } else {
        put('q', U.sci(cur.q)); put('ql', t('mPatch'));
        var passed = cur.q < 1e-8; chp.textContent = t(passed ? 'pass' : 'notExact'); chp.classList.add(passed ? 'is-good' : 'is-ok');
        if (!passed) W.push(t('patchNote'));
      }
      if (pr.key === 'cell') {
        var r0 = pr.ref.pts[0];
        if (pr.load === 'comp') { put('err', fmt(cur.refs[0] * 1e3) + ' mm'); put('errl', U.fill(t('mUA'), { v: fmt(r0.val * 1e3) + ' mm' })); chipPct(chp2, cur.refs[0] / r0.val); }
        else { put('err', '—'); put('errl', t('mErrNone')); }
        if (cur.fem) { var fv = cur.fem[cur.fem.length - 1]; put('fem', fmt(fv * 1e3) + ' mm'); put('feml', t('lgFem') + ' · ' + (fv / ref.val * 100).toFixed(1) + '%'); }
      } else if (cur.err == null) { put('err', '—'); put('errl', t('mErrNone')); }
      else {
        put('err', cur.err >= 1e-4 ? fmt(cur.err * 100) + ' %' : U.sci(cur.err)); put('errl', t('mErr'));
        if (cur.femErr != null) { put('fem', cur.femErr >= 1e-4 ? fmt(cur.femErr * 100) + ' %' : U.sci(cur.femErr)); put('feml', t('lgFem') + ' · ' + t('mErr').toLowerCase()); }
      }
      put('sup', cur.sup.mean.toFixed(1)); put('supl', U.fill(t('mSup'), { a: cur.sup.min, b: cur.sup.max }));
      put('time', Math.max(1, Math.round(m.time.assemble + m.time.solve)) + ' ms');
      if (S.m === '0') W.push(t('m0Note'));
      if (S.field === 'phi' && S.sel != null) O.push(U.fill(t('phiNote'), { v: fmt(R.phiAt(m, S.sel, m.md.lat.A[S.sel], m.md.lat.B[S.sel])) }));
      if (W.length) { warn.textContent = W.join(' '); warn.hidden = false; }
      if (O.length) { ok.textContent = O.join(' '); ok.hidden = false; }
    }

    /* ── field values on the sample grid ──────────────────────── */
    function sampleValues() {
      var m = cur.model, sm = cur.sm, fd = FIELD[S.field], vals = new Float64Array(sm.n), lo = Infinity, hi = -Infinity, i;
      for (i = 0; i < sm.n; i++) {
        var v;
        if (S.field === 'phi') v = R.phiAt(m, S.sel, sm.A[i], sm.B[i], sm.CI[i], sm.CJ[i]);
        else v = isFinite(cur.V[i * 5]) ? F.fieldOf(S.field, [cur.V[i * 5], cur.V[i * 5 + 1]], [cur.V[i * 5 + 2], cur.V[i * 5 + 3], cur.V[i * 5 + 4]]) * fd.k : NaN;
        vals[i] = v; if (isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; }
      }
      return { vals: vals, lo: lo, hi: hi };
    }
    function setSize(cvs, W, H) {
      var dpr = window.devicePixelRatio || 1;
      cvs.forEach(function (c) { c.style.height = H + 'px'; if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); } });
    }
    // the support of node I: cells whose centre lies within d of the node (one support per cell)
    function supportCells(md, I) {
      var lat = md.lat, a = lat.A[I], b = lat.B[I], d = md.S.d, su = lat.ax.segOf(a, 0), sv = lat.ay.segOf(b, 0), out = [];
      var isA = lat.ax.isBreak(lat.LI[I]), isB = lat.ay.isBreak(lat.LJ[I]);
      for (var i = 0; i < lat.Mu; i++) for (var j = 0; j < lat.Mv; j++) {
        var ca = i + 0.5, cb = j + 0.5;
        // segment of the cell must contain the node (nodes on a C⁰ line belong to both sides)
        var sa = lat.ax.segOf(ca, 0), sb = lat.ay.segOf(cb, 0);
        if (!(a >= sa[0] - 1e-9 && a <= sa[1] + 1e-9 && b >= sb[0] - 1e-9 && b <= sb[1] + 1e-9)) continue;
        if (!isA && (sa[0] !== su[0])) continue; if (!isB && (sb[0] !== sv[0])) continue;
        if ((ca - a) * (ca - a) + (cb - b) * (cb - b) < d * d) out.push(i * lat.Mv + j);
      }
      return out;
    }

    /* ── physical-space contour ───────────────────────────────── */
    function drawContour() {
      var m = cur.model, g, dpr = window.devicePixelRatio || 1, W = cv1.parentNode.clientWidth;
      var h = q('[data-h="1"]'), sub = q('[data-sub="1"]'), cbar = q('[data-cbar]');
      h.textContent = U.plain(t('f' + S.field));
      if (!W) return;
      if (m.error) {
        setSize([cv1, ov1], W, 220); g = cv1.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, 220);
        g.fillStyle = C.fg2; g.font = '13px Poppins, system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(t('fail2'), W / 2, 110);
        cbar.innerHTML = ''; sub.textContent = ''; view = null; drawHover(); return;
      }
      var md = m.md, sm = cur.sm, nn = md.nn, i, sc = S.scale * autoScale(), ns = sm.n;
      var qx = new Float64Array(ns), qy = new Float64Array(ns), nx = new Float64Array(nn), ny = new Float64Array(nn);
      var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (i = 0; i < ns; i++) {
        var ux = cur.V[i * 5], uy = cur.V[i * 5 + 1]; if (!isFinite(ux)) { ux = 0; uy = 0; }
        qx[i] = sm.X[i] + sc * ux; qy[i] = sm.Y[i] + sc * uy;
        x0 = Math.min(x0, qx[i], sm.X[i]); x1 = Math.max(x1, qx[i], sm.X[i]); y0 = Math.min(y0, qy[i], sm.Y[i]); y1 = Math.max(y1, qy[i], sm.Y[i]);
      }
      for (i = 0; i < nn; i++) { nx[i] = md.X[i] + sc * cur.nodeV[i * 5]; ny[i] = md.Y[i] + sc * cur.nodeV[i * 5 + 1]; }
      if (S.ov.net) for (var a1 = 0; a1 < md.patch.nu; a1++) for (var b1 = 0; b1 < md.patch.nv; b1++) { var cp = md.patch.ctrl(a1, b1); x0 = Math.min(x0, cp[0]); x1 = Math.max(x1, cp[0]); y0 = Math.min(y0, cp[1]); y1 = Math.max(y1, cp[1]); }
      var fit = V.fit(W, x0, x1, y0, y1, 40, 200, 560), SX = fit.SX, SY = fit.SY, H = fit.H;
      setSize([cv1, ov1], W, H);
      g = cv1.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      var fd = FIELD[S.field], sv = sampleValues(), bp = U.bandPainter(sv.lo, sv.hi, fd.div, C);
      var px = new Float64Array(ns), py = new Float64Array(ns);
      for (i = 0; i < ns; i++) { px[i] = SX(qx[i]); py[i] = SY(qy[i]); }
      V.contour(bp, sm, px, py, sv.vals); bp.paint(g);
      drawOverlays(g, md, sm, px, py, SX, SY, nx, ny, true, sc);
      U.bcGlyphs(g, { X: md.X, Y: md.Y, bedges: cur.bedges, fixed: cur.fixed, pr: m.pr, px: nx, py: ny, SX: SX, SY: SY, C: C, loadTags: ['s0', 's1', 't0', 't1'] });
      pointSupports(g, nx, ny, SX, SY);
      view = { SX: SX, SY: SY, nx: nx, ny: ny, px: px, py: py, sc: sc };
      sub.textContent = U.fill(t(sc > 0 ? 'p1s' : 'p1sU'), { f: U.plain(t('f' + S.field)), s: fmt(sc) });
      U.colorbar(cbar, bp.cols, bp.lev, fd.unit);
      cur.bp = bp; cur.sv = sv;
      drawHover();
    }
    function pointSupports(g, nx, ny, SX, SY) {
      g.save(); g.strokeStyle = C.fg2; g.fillStyle = C.fg2; g.lineWidth = 1.2;
      cur.points.forEach(function (p) {
        var x = SX(nx[p.n]), y = SY(ny[p.n]);
        if (p.uy != null) { g.beginPath(); g.moveTo(x, y + 2); g.lineTo(x - 5, y + 10); g.lineTo(x + 5, y + 10); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(x - 6, y + 13); g.lineTo(x + 6, y + 13); g.stroke(); }
        if (p.ux != null) { g.beginPath(); g.moveTo(x + 2, y); g.lineTo(x + 10, y - 5); g.lineTo(x + 10, y + 5); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(x + 13, y - 6); g.lineTo(x + 13, y + 6); g.stroke(); }
      });
      g.restore();
    }
    // overlays shared by both views. phys: physical view (nodes at nx, ny); else parameter view
    function drawOverlays(g, md, sm, px, py, SX, SY, nx, ny, phys, sc) {
      var lat = md.lat, nn = md.nn, i, nc = lat.Mu * lat.Mv;
      if (S.ov.support && S.sel != null) {
        var cells = supportCells(md, S.sel), path = new Path2D();
        cells.forEach(function (c) { var rim = V.cellRim(sm, c, px, py); path.moveTo(rim[0][0], rim[0][1]); for (var k = 1; k < rim.length; k++) path.lineTo(rim[k][0], rim[k][1]); path.closePath(); });
        g.fillStyle = U.rgba(C.accent, 0.16); g.fill(path, 'nonzero');
        g.save(); g.strokeStyle = U.rgba(C.accent, 0.55); g.lineWidth = 0.8; g.stroke(path); g.restore();
      }
      if (S.ov.cells) {
        var cp = new Path2D();
        for (i = 0; i < nc; i++) { var rim2 = V.cellRim(sm, i, px, py); cp.moveTo(rim2[0][0], rim2[0][1]); for (var k2 = 1; k2 < rim2.length; k2++) cp.lineTo(rim2[k2][0], rim2[k2][1]); cp.closePath(); }
        g.strokeStyle = U.rgba(C.fg, 0.32); g.lineWidth = 0.6; g.stroke(cp);
      }
      if (S.ov.knots) {
        if (phys && !sc) V.knotLines(g, md, SX, SY, C);
        else if (phys) knotLinesSampled(g, md, sm, px, py);
        else paramKnots(g, md, SX, SY);
      }
      if (S.ov.net && phys) V.controlNet(g, md.patch, SX, SY, C);
      if (S.ov.gauss && cur.model.ngp <= 20000) {
        g.fillStyle = U.rgba(C.fg, 0.55);
        var gpts = gaussPositions(md, phys);
        for (i = 0; i < gpts.length; i += 2) g.fillRect(SX(gpts[i]) - 1, SY(gpts[i + 1]) - 1, 2, 2);
      }
      if (S.ov.nodes) {
        var r = nn > 600 ? 1.6 : 2.4;
        g.fillStyle = C.surface; g.strokeStyle = C.fg; g.lineWidth = 1;
        for (i = 0; i < nn; i++) { g.beginPath(); g.arc(SX(nx[i]), SY(ny[i]), r, 0, Math.PI * 2); g.fill(); g.stroke(); }
      }
      if (S.sel != null) { g.beginPath(); g.arc(SX(nx[S.sel]), SY(ny[S.sel]), 4.5, 0, Math.PI * 2); g.fillStyle = C.accent; g.fill(); g.lineWidth = 1.5; g.strokeStyle = C.surface; g.stroke(); }
      if (lineData && phys) {
        var d = lineData.d, md2 = cur.model.md, o = new Float64Array(5);
        g.save(); g.setLineDash([6, 4]); g.strokeStyle = C.fg; g.lineWidth = 1.4; g.beginPath();
        for (i = 0; i <= 40; i++) {
          var s = d.param ? i / 40 : d.xr[0] + (d.xr[1] - d.xr[0]) * i / 40, uv = d.pt(s), a = md2.ax.index(uv[0]), b = md2.ay.index(uv[1]);
          var p = md2.patch.point(uv[0], uv[1]), v = sc ? R.evalAt(cur.model, a, b, 1, 1, o) : null;
          var X = SX(p[0] + (v ? sc * v[0] : 0)), Y = SY(p[1] + (v ? sc * v[1] : 0));
          if (i) g.lineTo(X, Y); else g.moveTo(X, Y);
        }
        g.stroke(); g.restore();
      }
    }
    // knot lines through the deformed samples (cells that start on a knot line)
    function knotLinesSampled(g, md, sm, px, py) {
      var lat = md.lat, S1 = SUB + 1;
      g.save(); g.setLineDash([7, 3, 2, 3]);
      md.ax.A.slice(1, -1).forEach(function (a) {
        g.strokeStyle = md.ax.c0.indexOf(a) >= 0 ? C.fg : U.rgba(C.fg, 0.55); g.lineWidth = md.ax.c0.indexOf(a) >= 0 ? 1.4 : 1; g.beginPath();
        for (var j = 0; j < lat.Mv; j++) { var base = (a * lat.Mv + j) * sm.np; for (var qq = 0; qq <= SUB; qq++) { var k = base + qq * S1; if (j === 0 && qq === 0) g.moveTo(px[k], py[k]); else g.lineTo(px[k], py[k]); } }
        g.stroke();
      });
      md.ay.A.slice(1, -1).forEach(function (b) {
        g.strokeStyle = md.ay.c0.indexOf(b) >= 0 ? C.fg : U.rgba(C.fg, 0.55); g.lineWidth = md.ay.c0.indexOf(b) >= 0 ? 1.4 : 1; g.beginPath();
        for (var i = 0; i < lat.Mu; i++) { var base = (i * lat.Mv + b) * sm.np; for (var p = 0; p <= SUB; p++) { var k = base + p; if (i === 0 && p === 0) g.moveTo(px[k], py[k]); else g.lineTo(px[k], py[k]); } }
        g.stroke();
      });
      g.restore();
    }
    function paramKnots(g, md, SX, SY) {
      g.save(); g.setLineDash([7, 3, 2, 3]);
      md.patch.ku.slice(1, -1).forEach(function (u) { var c0 = md.patch.c0u.indexOf(u) >= 0; g.strokeStyle = c0 ? C.fg : U.rgba(C.fg, 0.55); g.lineWidth = c0 ? 1.4 : 1; g.beginPath(); g.moveTo(SX(u), SY(0)); g.lineTo(SX(u), SY(1)); g.stroke(); });
      md.patch.kv.slice(1, -1).forEach(function (v) { var c0 = md.patch.c0v.indexOf(v) >= 0; g.strokeStyle = c0 ? C.fg : U.rgba(C.fg, 0.55); g.lineWidth = c0 ? 1.4 : 1; g.beginPath(); g.moveTo(SX(0), SY(v)); g.lineTo(SX(1), SY(v)); g.stroke(); });
      g.restore();
    }
    function gaussPositions(md, phys) {
      var key = phys ? 'gpX' : 'gpU';
      if (cur[key]) return cur[key];
      var m = cur.model, out = [], o = new Float64Array(12), gl = NB.GL[+S.ng];
      for (var i = 0; i < md.lat.Mu; i++) for (var j = 0; j < md.lat.Mv; j++) for (var p = 0; p < gl.p.length; p++) for (var qq = 0; qq < gl.p.length; qq++) {
        md.map.at(i + (1 + gl.p[p]) / 2, j + (1 + gl.p[qq]) / 2, o);
        out.push(phys ? o[0] : o[7], phys ? o[1] : o[8]);
      }
      if (phys && view && view.sc) { /* undeformed positions are fine at small scales */ }
      cur[key] = out; return out;
    }

    /* ── parameter-space view ─────────────────────────────────── */
    function drawParam() {
      var m = cur.model, dpr = window.devicePixelRatio || 1, wrap = cvp.parentNode, W = wrap.clientWidth, info = q('[data-info]');
      if (!W) return;
      if (m.error) { setSize([cvp, ovp], W, 120); var g0 = cvp.getContext('2d'); g0.setTransform(dpr, 0, 0, dpr, 0, 0); g0.clearRect(0, 0, W, 120); info.innerHTML = ''; pview = null; return; }
      var md = m.md, sm = cur.sm, ns = sm.n, i, M = 28, side = Math.min(W - 2 * M, 360), H = side + 2 * M;
      setSize([cvp, ovp], W, H);
      var ox = (W - side) / 2, SX = function (u) { return ox + u * side; }, SY = function (v) { return M + (1 - v) * side; };
      var g = cvp.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      var sv = cur.sv || sampleValues(), bp = U.bandPainter(sv.lo, sv.hi, FIELD[S.field].div, C), px = new Float64Array(ns), py = new Float64Array(ns);
      for (i = 0; i < ns; i++) { px[i] = SX(sm.U[i]); py[i] = SY(sm.W[i]); }
      V.contour(bp, sm, px, py, sv.vals); bp.paint(g);
      var nu = new Float64Array(md.nn), nv = new Float64Array(md.nn);
      for (i = 0; i < md.nn; i++) { nu[i] = md.ax.param(md.lat.A[i], 1); nv[i] = md.ay.param(md.lat.B[i], 1); }
      drawOverlays(g, md, sm, px, py, SX, SY, nu, nv, false, 0);
      // frame and axis labels
      g.strokeStyle = C.fg2; g.lineWidth = 1; g.strokeRect(SX(0), SY(1), side, side);
      g.fillStyle = C.fg2; g.font = '11px "IBM Plex Mono", ui-monospace, monospace'; g.textAlign = 'center'; g.textBaseline = 'top';
      md.patch.ku.forEach(function (u) { g.fillText(String(+u.toFixed(3)), SX(u), SY(0) + 5); });
      g.textAlign = 'right'; g.textBaseline = 'middle';
      md.patch.kv.forEach(function (v) { g.fillText(String(+v.toFixed(3)), SX(0) - 5, SY(v)); });
      g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText('ξ', SX(1) + 6, SY(0) + 5);
      g.textAlign = 'right'; g.textBaseline = 'bottom'; g.fillText('η', SX(0) - 5, SY(1) - 6);
      pview = { SX: SX, SY: SY, px: px, py: py, nu: nu, nv: nv, side: side };
      fillInfo(md);
      drawHover();
    }
    function fillInfo(md) {
      var P = md.patch, ws = {}, i, j;
      for (i = 0; i < P.nu; i++) for (j = 0; j < P.nv; j++) ws[+P.ctrl(i, j)[2].toFixed(4)] = 1;
      var wl = Object.keys(ws).map(Number).sort(function (a, b) { return b - a; }).map(function (w) { return String(+w.toFixed(4)); }).join(', ');
      var c0 = P.c0u.map(function (u) { return 'ξ = ' + u; }).concat(P.c0v.map(function (v) { return 'η = ' + v; }));
      var gl = +S.ng, rows = [
        [t('iKnots'), 'Ξ = ' + V.knotText(P.U) + ', p = ' + P.p + '<br>H = ' + V.knotText(P.V) + ', q = ' + P.q],
        [t('iCp'), U.fill(t('iCpV'), { a: P.nu, b: P.nv, w: wl })],
        [t('iC0'), c0.length ? c0.join(', ') : t('iNone')],
        [t('iLat'), U.fill(t('iLatV'), { a: md.lat.I, b: md.lat.J, c: md.lat.Mu * md.lat.Mv, g: U.group(md.lat.Mu * md.lat.Mv * gl * gl) })],
        [t('iMap'), U.esc(t('iMapV'))],
        [t('iHover'), '<span data-out="hover">—</span>']
      ];
      q('[data-info]').innerHTML = rows.map(function (r) { return '<dt>' + U.esc(r[0]) + '</dt><dd>' + r[1] + '</dd>'; }).join('');
    }

    /* ── hover, linked between the two views ──────────────────── */
    function drawHover() {
      var dpr = window.devicePixelRatio || 1, rd = q('[data-read="1"]'), ho = q('[data-out="hover"]');
      [[ov1, view], [ovp, pview]].forEach(function (p) { var g = p[0].getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, p[0].width / dpr, p[0].height / dpr); });
      if (!hover || !view || !pview || cur.model.error) { rd.textContent = ''; if (ho) ho.textContent = '—'; return; }
      var m = cur.model, md = m.md, sm = cur.sm, fd = FIELD[S.field];
      function ring(cvs, x, y) { var g = cvs.getContext('2d'); g.beginPath(); g.arc(x, y, 6, 0, Math.PI * 2); g.lineWidth = 2; g.strokeStyle = C.surface; g.stroke(); g.beginPath(); g.arc(x, y, 5, 0, Math.PI * 2); g.lineWidth = 1.6; g.strokeStyle = C.fg; g.stroke(); }
      if (hover.node != null) {
        var n = hover.node; ring(ov1, view.SX(view.nx[n]), view.SY(view.ny[n])); ring(ovp, pview.SX(pview.nu[n]), pview.SY(pview.nv[n]));
        var x = md.X[n], y = md.Y[n], nv = cur.nodeV, v, ex = NaN;
        if (S.field === 'phi') v = R.phiAt(m, S.sel, md.lat.A[n], md.lat.B[n]);
        else { v = F.fieldOf(S.field, [nv[n * 5], nv[n * 5 + 1]], [nv[n * 5 + 2], nv[n * 5 + 3], nv[n * 5 + 4]]) * fd.k; ex = m.pr.exact ? F.fieldOf(S.field, m.pr.exact.u(x, y), m.pr.exact.s(x, y)) * fd.k : NaN; }
        rd.textContent = U.fill(t('readNode'), { i: n, x: x.toFixed(3), y: y.toFixed(3), f: SYM[S.field], v: fmt(v) + (fd.unit ? ' ' + fd.unit : '') }) + (isFinite(ex) ? U.fill(t('readExact'), { v: fmt(ex) + ' ' + fd.unit }) : '');
        if (ho) { var o = md.map.at(md.lat.A[n], md.lat.B[n]); ho.textContent = U.fill(t('readMap'), { u: o[7].toFixed(3), v: o[8].toFixed(3), x: x.toFixed(3), y: y.toFixed(3), j: fmt(o[11]) }); }
        return;
      }
      var k = hover.k; ring(ov1, view.px[k], view.py[k]); ring(ovp, pview.px[k], pview.py[k]);
      var val = cur.sv ? cur.sv.vals[k] : NaN;
      rd.textContent = SYM[S.field] + ' = ' + fmt(val) + (fd.unit ? ' ' + fd.unit : '');
      if (ho) ho.textContent = U.fill(t('readMap'), { u: sm.U[k].toFixed(3), v: sm.W[k].toFixed(3), x: sm.X[k].toFixed(3), y: sm.Y[k].toFixed(3), j: fmt(sm.J[k]) });
    }
    function nearest(ev, cvs, vw, nodesU, nodesV, SXf, SYf) {
      var r = cvs.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, best = null, bd = 14 * 14, i;
      for (i = 0; i < nodesU.length; i++) { var dx = SXf(nodesU[i]) - mx, dy = SYf(nodesV[i]) - my, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = { node: i }; } }
      if (best) return best;
      bd = 30 * 30;
      for (i = 0; i < vw.px.length; i++) { var ex = vw.px[i] - mx, ey = vw.py[i] - my, e = ex * ex + ey * ey; if (e < bd) { bd = e; best = { k: i }; } }
      return best;
    }
    function onMove(ev, which) {
      if (!view || !pview) return;
      hover = which === 1 ? nearest(ev, ov1, view, view.nx, view.ny, view.SX, view.SY) : nearest(ev, ovp, pview, pview.nu, pview.nv, pview.SX, pview.SY);
      drawHover();
    }
    ov1.addEventListener('mousemove', function (ev) { onMove(ev, 1); });
    ovp.addEventListener('mousemove', function (ev) { onMove(ev, 2); });
    [ov1, ovp].forEach(function (o) { o.addEventListener('mouseleave', function () { hover = null; drawHover(); }); });
    [[ov1, 1], [ovp, 2]].forEach(function (p) {
      p[0].addEventListener('click', function (ev) {
        if (!view || !pview) return;
        var h = p[1] === 1 ? nearest(ev, ov1, view, view.nx, view.ny, view.SX, view.SY) : nearest(ev, ovp, pview, pview.nu, pview.nv, pview.SX, pview.SY);
        if (!h || h.node == null) return; S.sel = h.node; update(false);
      });
    });

    /* ── line plot ────────────────────────────────────────────── */
    function drawLine() {
      var lg = q('[data-lg="2"]');
      if (!lineData) { P2 = U.plot(cv2, { xr: [0, 1], yr: [0, 1] }, C); lg.innerHTML = ''; return; }
      var L = lineData, lo = Infinity, hi = -Infinity, pts = [], items = [];
      L.fe.concat(L.rf).forEach(function (v) { if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } });
      var pr = cur.model.pr;
      if (pr.key === 'cell' && L.d.cellRef) pr.ref.pts.forEach(function (p) { if (p.f === 'uy') { var yv = p.val * 1e3; lo = Math.min(lo, yv); hi = Math.max(hi, yv); pts.push({ x: cur.model.md.patch.point(p.u, p.v)[1], y: yv, r: 5, fill: C.gold, stroke: C.surface, lw: 1.5, shape: 'diamond' }); } });
      if (!isFinite(lo)) { lo = -1; hi = 1; }
      var pad = (hi - lo) * 0.08 || Math.max(Math.abs(hi) * 0.1, 1e-3); lo -= pad; hi += pad;
      var hasRef = L.rf.some(isFinite), refOnly = (S.problem === 'cantilever' && S.support === 'clamped') || (S.problem === 'hole' && S.outer === 'uniform');
      var refName = S.problem === 'hole' ? (S.outer === 'kirsch' ? t('lgExact') : t('lgKirsch')) : S.problem === 'cantilever' ? (S.support === 'exact' ? t('lgExact') : t('lgTimo')) : t('lgExact');
      var lines = [];
      if (hasRef) lines.push(refOnly ? { x: L.xs, y: L.rf, stroke: C.fg2, width: 1.6, dash: [5, 4] } : { x: L.xs, y: L.rf, stroke: U.rgba(C.fg2, 0.45), width: 5 });
      lines.push({ x: L.xs, y: L.fe, stroke: C.accent, width: 1.8 });
      var xr = [Math.min.apply(null, L.xs), Math.max.apply(null, L.xs)];
      P2 = U.plot(cv2, { xr: xr, yr: [lo, hi], xlabel: L.d.xl, ylabel: L.unit, ml: 56, hlines: lo < 0 && hi > 0 ? [{ y: 0, stroke: C.border, width: 1.5 }] : [], lines: lines, points: pts }, C);
      items.push({ t: t('lgFE') + ' (' + t(S.rbf) + ', α = ' + S.alpha.toFixed(1) + ')', c: C.accent });
      if (hasRef) items.push(refOnly ? { t: refName, c: C.fg2, dash: true } : { t: refName, c: U.rgba(C.fg2, 0.6) });
      if (pts.length) items.push({ t: t('lgRef'), c: C.gold, type: 'marker', shape: 'diamond' });
      lg.innerHTML = U.legendHtml(items);
    }
    cv2.addEventListener('mousemove', function (ev) {
      if (!P2 || !lineData) return;
      var r = cv2.getBoundingClientRect(), x = P2.invX(ev.clientX - r.left), L = lineData, i = 0, bd = Infinity;
      for (var k = 0; k < L.xs.length; k++) { var d = Math.abs(L.xs[k] - x); if (d < bd) { bd = d; i = k; } }
      q('[data-read="2"]').textContent = U.fill(t('readLine'), { x: L.d.xl.split(' ')[0] + ' = ' + fmt(L.xs[i]), fe: fmt(L.fe[i]), ex: fmt(L.rf[i]), u: L.unit });
    });
    cv2.addEventListener('mouseleave', function () { q('[data-read="2"]').textContent = ''; });

    /* ── N-RPIM against FEM ───────────────────────────────────── */
    function studyOK() { return S.problem !== 'patch' && hasExact(); }
    function studyErr(model, fem) {
      var pr = model.pr;
      if (pr.key !== 'cell') return fem ? F.energyError(model) : R.energyError(model);
      var p = pr.ref.pts[pr.ref.pts.length - 1], v;
      if (fem) { var nd = R.femNode(model, p.u, p.v); v = model.u[2 * nd + (p.f === 'ux' ? 0 : 1)]; }
      else { var w = R.evalParam(model, p.u, p.v); v = w ? (p.f === 'ux' ? w[0] : w[1]) : NaN; }
      return Math.abs(v / p.val - 1);
    }
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
        if (sr.fem) { var fm = R.femRun(c); if (!fm.error) study.pts[j.si].push({ dof: fm.ndof, e: studyErr(fm, true) }); }
        else { c.rbf = sr.rbf; var em = R.run(c); if (!em.error) study.pts[j.si].push({ dof: em.ndof, e: studyErr(em, false) }); }
        study.done++; drawConv();
        setTimeout(next, 0);
      })();
    }
    function drawConv() {
      var lg = q('[data-lg="3"]'), msg = q('[data-out="study"]'), btn = q('[data-act="study"]'), series = U.series(C), sub = q('[data-sub="4"]');
      var valid = study && study.key === studyKey(), cellP = S.problem === 'cell';
      sub.textContent = t(cellP ? 'p4sCell' : 'p4s');
      btn.disabled = !studyOK() || !!(valid && !study.finished);
      if (S.problem === 'patch') msg.textContent = t('noPatch');
      else if (!hasExact()) msg.textContent = t('noExact');
      else if (!study) msg.textContent = U.fill(t('idle'), { n: SERIES.length * STUDY_N[S.problem].length });
      else if (!valid) msg.textContent = t('stale');
      else msg.textContent = study.finished ? '' : U.fill(t('running'), { i: study.done, n: study.total });
      var lines = [], pts = [], items = [], all = []; convPts = [];
      if (valid) SERIES.forEach(function (sr, i) {
        var P = study.pts[i].filter(function (p) { return p.e > 0 && isFinite(p.e); }); if (!P.length) return;
        lines.push({ x: P.map(function (p) { return p.dof; }), y: P.map(function (p) { return p.e; }), stroke: series[i], width: 2, dash: sr.fem ? [5, 4] : null });
        P.forEach(function (p) { pts.push({ x: p.dof, y: p.e, r: 4.5, fill: series[i], stroke: C.surface, lw: 1.5, shape: SHAPES[i] }); convPts.push({ s: t(sr.k), dof: p.dof, e: p.e }); all.push(p); });
        var rate = P.length > 1 ? Math.log(P[P.length - 2].e / P[P.length - 1].e) / Math.log(Math.sqrt(P[P.length - 1].dof / P[P.length - 2].dof)) : NaN;
        items.push({ t: t(sr.k) + (isFinite(rate) ? ' · ' + t('rate') + ' ' + rate.toFixed(2) : ''), c: series[i], type: 'marker', shape: SHAPES[i] });
      });
      if (cur && !cur.model.error && studyOK()) {
        var ce = cellP ? studyErr(cur.model, false) : cur.err;
        if (ce > 0 && isFinite(ce)) { all.push({ dof: cur.model.ndof, e: ce }); pts.push({ x: cur.model.ndof, y: ce, r: 7.5, stroke: C.fg, lw: 1.8 }); items.push({ t: t('cur'), c: C.surface, type: 'dot', b: C.fg }); }
      }
      var dx = [10, 1e4], dy = [1e-3, 1];
      if (all.length) {
        var mnx = Math.min.apply(null, all.map(function (p) { return p.dof; })), mxx = Math.max.apply(null, all.map(function (p) { return p.dof; }));
        var mny = Math.min.apply(null, all.map(function (p) { return p.e; })), mxy = Math.max.apply(null, all.map(function (p) { return p.e; }));
        dx = [Math.pow(10, Math.floor(Math.log10(mnx))), Math.pow(10, Math.ceil(Math.log10(mxx)))]; dy = [Math.pow(10, Math.floor(Math.log10(mny))), Math.pow(10, Math.ceil(Math.log10(mxy)))];
        if (dy[1] / dy[0] < 100) dy[0] = dy[1] / 100; if (dx[1] / dx[0] < 100) dx[1] = dx[0] * 100;
      }
      var ylab = cellP ? U.fill(t('yRef'), { q: S.load === 'shear' ? 'v_B' : 'v_A' }) : t('yErr');
      P3 = U.plot(cv3, { xr: dx, yr: dy, xlog: true, ylog: true, xlabel: 'DOF', ylabel: ylab, lines: lines, points: pts }, C);
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
    function redraw() { if (!cur) return; sync(); setMetrics(); cur.sv = null; drawContour(); drawParam(); drawLine(); drawConv(); }
    var pending = false, needCompute = false;
    function update(recompute) {
      if (recompute) needCompute = true;
      if (pending) return; pending = true;
      var heavy = needCompute && cost(cfg()) > LIVE_COST;
      if (heavy) q('[data-sub="1"]').textContent = t('solving');
      (heavy ? function (f) { setTimeout(f, 30); } : requestAnimationFrame)(function () {
        pending = false;
        if (needCompute) { needCompute = false; compute(); }
        redraw();
      });
    }

    var RECOMP = { ld: 1, ar: 1, nu: 1, n: 1, distort: 1, alpha: 1 };
    function readInput(el) {
      var k = el.getAttribute('data-in'), v = el.value;
      if (k === 'n') S.n[S.problem] = +v;
      else if (k === 'line' || k === 'field') S[k] = v;
      else if (k === 'problem') {
        S.problem = v; S.line = LINES[v][0]; S.distort = v === 'patch' ? 0.3 : 0; S.field = v === 'cantilever' ? 'svm' : v === 'cell' ? 'svm' : 'sxx'; S.sel = null;
        fillLineSelect();
      }
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
      if (sg) { S[sg] = b.getAttribute('data-v'); update(true); return; }
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
