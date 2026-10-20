/* ═══════════════════════════════════════════════════════════════
   2D NDM Explorer (NURBS-Divergence-Meshless, heat conduction) — UI
   Registered as RZTools tool 'ndm2d'; mount with <div data-rz-tool="ndm2d"></div>
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var D = window.RZNDM, NB = window.RZNURBS, V = NB.view, RZT = window.RZTools, U = RZT.util, fmt = U.fmt;
  var SHAPES = ['circle', 'square', 'tri', 'diamond'];
  var FLD = { T: { unit: '°C', div: false }, q: { unit: 'W/m²', div: false }, err: { unit: '°C', div: false }, phi: { unit: '', div: true } };
  var SYM = { T: 'T', q: '|q|', err: '|T − Texact|', phi: 'φ' };

  var T = {
    en: {
      gModel: 'Model', gApprox: 'Approximation', gCells: 'Integration cells', gNodes: 'Nodes', gView: 'View',
      problem: 'Problem', pradial: 'Quarter annulus · radial flow (exact)', pannulus: 'Quarter annulus (paper)', pblade: 'Fan blade (paper)', ppatch: 'Patch test (quadratic T)',
      approx: 'Shape functions', mls: 'MLS', rbf: 'RBF', alpha: 'Support radius `d = α h`, α', cells: 'Cell layout', nonov: 'Non-overlapping', ov: 'Overlapping', ngs: 'Gauss points per side',
      n: 'Refinement level', size: '{nodes} nodes · {cells} cell equations · {dir} boundary rows', distort: 'Irregular nodes', shuffle: 'New layout',
      field: 'Contour', fT: 'Temperature T', fq: 'Heat flux |q| = k|∇T|', ferr: 'Error |T − T exact|', fphi: 'Shape function φ of the selected node',
      show: 'Show', oNodes: 'Nodes', oCells: 'Cells', oGauss: 'Gauss points', oSupport: 'Support', oKnots: 'Knot lines', oNet: 'Control net', reset: 'Reset',
      mNodes: 'unknowns · {c} cell equations · {d} boundary rows', mTin: 'T at the inner arc, θ = 45° · exact {v}', mTP: 'T at P · reference {v}', mTP1: 'T at P₁ (ξ = 0, η = 0.5) · paper {v}',
      mPatch: 'max |T − T exact| at the nodes', mErr: 'Relative error, energy norm', mTQ: 'T at Q · reference {v}', mTP2: 'T at P₂ (ξ = 0.25, η = 0.5) · paper {v}',
      mFem: 'FEM Q4, same nodes · energy norm', mFemP: 'FEM Q4, same nodes · T at {p}', mRow: 'nonzeros per row (mean) · non-symmetric', mTime: 'assemble + solve',
      pass: 'passed', notExact: 'not exact',
      support: 'The approximation fails at {n} points: the support holds too few nodes ({k}). Increase the support radius or the refinement.',
      singular: 'The system matrix is singular. Change the support radius or the cell layout.', fail2: 'The model could not be solved.',
      big: 'Large model: it solves when you release the slider.', solving: 'Solving…',
      mlsDir: 'MLS does not interpolate: at its own node a shape function is {v}, not 1. NDM still imposes the temperature directly, because the row of a boundary node is the condition itself, Σ N_j(x_I) T_j = T̂, not an integral that needs a weak form.',
      patchOK: 'Passed: with a quadratic MLS basis, NDM recovers this quadratic temperature exactly, even with one Gauss point per side, overlapping cells or irregular nodes. Along a straight side the flux of a quadratic field is linear, so every line integral is exact.',
      patchRBF: 'Pure Gaussian RBFs do not reproduce a constant or a linear field, so even this quadratic temperature is not recovered.',
      patchCurved: '',
      ovNote: 'Overlapping cells still give one valid balance equation per node; the paper finds that they converge at a slightly lower rate than non-overlapping cells.',
      bladeNote: 'Geometry and boundary conditions from Rasin et al. (2025), Table 1 and Fig. 3: 60 W/m² into the hub arc, 30 °C on the other edges, k = 1 W/(m·K). The reference temperatures are the converged values implied by the paper’s Table 2.',
      annNote: 'The paper’s quarter-annular disc (Table 3): 60 W/m² into the inner arc, 30 °C on the other three sides, k = 1 W/(m·K). There is no closed-form solution; the reference values come from Richardson-extrapolated finite elements (128 × 256 cells).',
      radNote: 'The paper’s quarter annulus with insulated straight edges, so the heat flows radially: T = 30 + (q a / k) ln(b / r), with q = 60 W/m² into the inner arc (a = 0.3 m), 30 °C on the outer arc (b = 0.6 m).',
      p1s: '{f} in the physical space. Squares: nodes on a prescribed-temperature edge, whose row is the boundary condition; circles: one cell equation each. Solid edge: prescribed T; arrows: heat flux in; dashed: insulated. Tap a node to inspect its equation.',
      p2: 'Parameter space and the cell equation', p2s: 'Cells are rectangles in the NURBS parameter space, so the outward normal on each side is (0, ±1) or (±1, 0). The divergence theorem turns the cell integral of ∇²T into four line integrals; their sum equals the heat source (here zero) minus any prescribed flux.',
      eqTitle: 'Cell equation of node {i}', eqDir: 'Boundary row of node {i}', side_b: 'bottom', side_r: 'right', side_t: 'top', side_l: 'left',
      eqKnown: 'prescribed flux', eqIns: 'insulated', eqSum: 'net outflow, sum of the four sides', eqSrc: 'heat source F̂ = −∫ Q/k dΩ', eqStencil: '{n} nodes in this row',
      eqDirTxt: 'T̂ = {T} °C. Row: Σ N_j(x_I) T_j = T̂ over {n} nodes; N_I(x_I) = {own}.',
      eqUnit: 'Line integrals of ∇T·n (K); multiply by k for W per metre of thickness.',
      iKnots: 'Knot vectors', iCp: 'Control net', iCpV: '{a} × {b} control points · weights {w}', iC0: 'C⁰ lines', iNone: 'none', iHover: 'Point',
      readMap: '(ξ, η) = ({u}, {v}) → (x, y) = ({x}, {y}) m · |J| = {j}',
      p3: 'Along a line', p3s: 'NDM result against the reference. Hover to read values.',
      lradial_T45: 'T along θ = 45°, inner to outer arc', lradial_q45: 'Heat flux |q| along θ = 45°', lannulus_T45: 'T along θ = 45°, inner to outer arc', lannulus_Tin: 'T around the inner arc, θ = 0° → 90°',
      lblade_Tmid: 'T along η = 0.5, hub to tip', lblade_Thub: 'T along the hub arc ξ = 0', lpatch_Tmid: 'T along y = 0.5', lpatch_qmid: 'Heat flux |q| along y = 0.5',
      lgNdm: 'NDM', lgExact: 'exact', lgRef: 'reference', lgFem: 'FEM Q4, same nodes',
      p4: 'NDM against FEM', p4s: 'Relative energy-norm error against the number of nodes, for the radial-flow problem: NDM with MLS on non-overlapping and on overlapping cells, NDM with Gaussian RBFs, and bilinear Q4 finite elements on the same nodes. Support radius, Gauss points per side and node layout follow your settings.',
      run: 'Run comparison', running: 'Solving {i} of {n}…', stale: 'Settings changed since the last run. Run it again.', idle: 'Press “Run comparison” to solve {n} models, from coarse to fine.',
      noStudy: 'The comparison uses the radial-flow problem, which has an exact solution.',
      sMLS: 'NDM-MLS', sMLSo: 'NDM-MLS, overlapping', sRBF: 'NDM-RBF', sQ4: 'FEM Q4, same nodes', rate: 'rate', cur: 'current model', yErr: 'energy-norm error',
      readNode: 'node {i} at ({x}, {y}) m · {f} = {v}', readExact: ' · exact {v}', readLine: '{x} · NDM {fe} · ref {ex} {u}', readConv: '{s} · {dof} nodes · error {e}'
    },
    ms: {
      gModel: 'Model', gApprox: 'Approximation', gCells: 'Integration cells', gNodes: 'Nod', gView: 'Paparan',
      problem: 'Masalah', pradial: 'Suku anulus · aliran jejarian (exact)', pannulus: 'Suku anulus (paper)', pblade: 'Bilah kipas (paper)', ppatch: 'Patch test (T kuadratik)',
      approx: 'Shape functions', mls: 'MLS', rbf: 'RBF', alpha: 'Jejari support `d = α h`, α', cells: 'Susunan cell', nonov: 'Tidak bertindih', ov: 'Bertindih', ngs: 'Gauss points setiap sisi',
      n: 'Tahap refinement', size: '{nodes} nod · {cells} persamaan cell · {dir} baris sempadan', distort: 'Nod tidak sekata', shuffle: 'Susunan baharu',
      field: 'Kontur', fT: 'Suhu T', fq: 'Fluks haba |q| = k|∇T|', ferr: 'Ralat |T − T exact|', fphi: 'Shape function φ bagi nod terpilih',
      show: 'Papar', oNodes: 'Nod', oCells: 'Cell', oGauss: 'Gauss points', oSupport: 'Support', oKnots: 'Knot lines', oNet: 'Control net', reset: 'Set semula',
      mNodes: 'anu · {c} persamaan cell · {d} baris sempadan', mTin: 'T pada lengkok dalam, θ = 45° · exact {v}', mTP: 'T pada P · rujukan {v}', mTP1: 'T pada P₁ (ξ = 0, η = 0.5) · paper {v}',
      mPatch: 'max |T − T exact| pada nod', mErr: 'Ralat relatif, energy norm', mTQ: 'T pada Q · rujukan {v}', mTP2: 'T pada P₂ (ξ = 0.25, η = 0.5) · paper {v}',
      mFem: 'FEM Q4, nod yang sama · energy norm', mFemP: 'FEM Q4, nod yang sama · T pada {p}', mRow: 'nonzero setiap baris (purata) · tidak simetri', mTime: 'assemble + solve',
      pass: 'lulus', notExact: 'tidak exact',
      support: 'Approximation gagal pada {n} titik: support-nya mengandungi terlalu sedikit nod ({k}). Naikkan jejari support atau refinement.',
      singular: 'Matriks sistem singular. Ubah jejari support atau susunan cell.', fail2: 'Model tidak dapat diselesaikan.',
      big: 'Model besar: ia diselesaikan apabila anda melepaskan slider.', solving: 'Menyelesaikan…',
      mlsDir: 'MLS tidak menginterpolasi: pada nodnya sendiri, shape function bernilai {v}, bukan 1. NDM tetap mengenakan suhu secara terus, kerana baris bagi nod sempadan ialah syarat itu sendiri, Σ N_j(x_I) T_j = T̂, bukan kamiran yang memerlukan weak form.',
      patchOK: 'Lulus: dengan basis MLS kuadratik, NDM memperoleh semula suhu kuadratik ini secara exact, walaupun dengan satu Gauss point setiap sisi, cell bertindih atau nod tidak sekata. Pada sisi lurus, fluks medan kuadratik adalah linear, jadi setiap line integral adalah exact.',
      patchRBF: 'RBF Gaussian tulen tidak menghasilkan semula medan malar atau linear, jadi suhu kuadratik ini pun tidak diperoleh semula.',
      patchCurved: '',
      ovNote: 'Cell bertindih tetap memberi satu persamaan keseimbangan yang sah bagi setiap nod; paper mendapati ia converge pada kadar yang sedikit lebih rendah berbanding cell tidak bertindih.',
      bladeNote: 'Geometri dan syarat sempadan daripada Rasin et al. (2025), Jadual 1 dan Rajah 3: 60 W/m² masuk melalui lengkok hab, 30 °C pada sisi lain, k = 1 W/(m·K). Suhu rujukan ialah nilai converged yang tersirat daripada Jadual 2 paper.',
      annNote: 'Suku anulus daripada paper (Jadual 3): 60 W/m² masuk melalui lengkok dalam, 30 °C pada tiga sisi lain, k = 1 W/(m·K). Tiada penyelesaian bentuk tertutup; nilai rujukan diperoleh daripada finite element dengan ekstrapolasi Richardson (128 × 256 cell).',
      radNote: 'Suku anulus daripada paper dengan sisi lurus bertebat, jadi haba mengalir secara jejarian: T = 30 + (q a / k) ln(b / r), dengan q = 60 W/m² masuk melalui lengkok dalam (a = 0.3 m), 30 °C pada lengkok luar (b = 0.6 m).',
      p1s: '{f} dalam ruang fizikal. Segi empat: nod pada sisi bersuhu tetap, yang barisnya ialah syarat sempadan; bulatan: satu persamaan cell setiap satu. Sisi padu: T ditetapkan; anak panah: fluks haba masuk; putus-putus: bertebat. Ketik nod untuk meneliti persamaannya.',
      p2: 'Ruang parameter dan persamaan cell', p2s: 'Cell ialah segi empat tepat dalam ruang parameter NURBS, jadi normal luar pada setiap sisi ialah (0, ±1) atau (±1, 0). Teorem divergence menukar kamiran cell bagi ∇²T kepada empat line integral; jumlahnya sama dengan sumber haba (di sini sifar) tolak fluks yang ditetapkan.',
      eqTitle: 'Persamaan cell bagi nod {i}', eqDir: 'Baris sempadan bagi nod {i}', side_b: 'bawah', side_r: 'kanan', side_t: 'atas', side_l: 'kiri',
      eqKnown: 'fluks ditetapkan', eqIns: 'bertebat', eqSum: 'aliran keluar bersih, jumlah empat sisi', eqSrc: 'sumber haba F̂ = −∫ Q/k dΩ', eqStencil: '{n} nod dalam baris ini',
      eqDirTxt: 'T̂ = {T} °C. Baris: Σ N_j(x_I) T_j = T̂ melibatkan {n} nod; N_I(x_I) = {own}.',
      eqUnit: 'Line integral bagi ∇T·n (K); darab dengan k untuk W setiap meter ketebalan.',
      iKnots: 'Knot vectors', iCp: 'Control net', iCpV: '{a} × {b} control points · pemberat {w}', iC0: 'Garis C⁰', iNone: 'tiada', iHover: 'Titik',
      readMap: '(ξ, η) = ({u}, {v}) → (x, y) = ({x}, {y}) m · |J| = {j}',
      p3: 'Sepanjang satu garis', p3s: 'Keputusan NDM berbanding rujukan. Halakan untuk membaca nilai.',
      lradial_T45: 'T sepanjang θ = 45°, lengkok dalam ke luar', lradial_q45: 'Fluks haba |q| sepanjang θ = 45°', lannulus_T45: 'T sepanjang θ = 45°, lengkok dalam ke luar', lannulus_Tin: 'T sekeliling lengkok dalam, θ = 0° → 90°',
      lblade_Tmid: 'T sepanjang η = 0.5, hab ke hujung', lblade_Thub: 'T sepanjang lengkok hab ξ = 0', lpatch_Tmid: 'T sepanjang y = 0.5', lpatch_qmid: 'Fluks haba |q| sepanjang y = 0.5',
      lgNdm: 'NDM', lgExact: 'exact', lgRef: 'rujukan', lgFem: 'FEM Q4, nod yang sama',
      p4: 'NDM berbanding FEM', p4s: 'Ralat relatif energy norm berbanding bilangan nod, bagi masalah aliran jejarian: NDM dengan MLS pada cell tidak bertindih dan bertindih, NDM dengan RBF Gaussian, dan finite element bilinear Q4 pada nod yang sama. Jejari support, Gauss points setiap sisi dan susunan nod mengikut tetapan anda.',
      run: 'Jalankan perbandingan', running: 'Menyelesaikan {i} daripada {n}…', stale: 'Tetapan telah berubah sejak larian terakhir. Jalankan semula.', idle: 'Tekan “Jalankan perbandingan” untuk menyelesaikan {n} model, dari kasar ke halus.',
      noStudy: 'Perbandingan ini menggunakan masalah aliran jejarian, yang mempunyai exact solution.',
      sMLS: 'NDM-MLS', sMLSo: 'NDM-MLS, bertindih', sRBF: 'NDM-RBF', sQ4: 'FEM Q4, nod yang sama', rate: 'kadar', cur: 'model semasa', yErr: 'ralat energy norm',
      readNode: 'nod {i} pada ({x}, {y}) m · {f} = {v}', readExact: ' · exact {v}', readLine: '{x} · NDM {fe} · rujukan {ex} {u}', readConv: '{s} · {dof} nod · ralat {e}'
    }
  };

  var NMAX = { radial: 14, annulus: 14, blade: 14, patch: 12 };
  var LINES = { radial: ['T45', 'q45'], annulus: ['T45', 'Tin'], blade: ['Tmid', 'Thub'], patch: ['Tmid', 'qmid'] };
  var STUDY_N = [2, 3, 4, 6, 8, 12];
  var SERIES = [{ k: 'sMLS', approx: 'mls', overlap: 0 }, { k: 'sMLSo', approx: 'mls', overlap: 1 }, { k: 'sRBF', approx: 'rbf', overlap: 0 }, { k: 'sQ4', fem: true }];
  var LIVE_COST = 7e5, SUB = 4, RBFMAX = 3.5;

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
          '<select class="rzt-sel" data-in="problem"><option value="radial" data-k="pradial"></option><option value="annulus" data-k="pannulus"></option><option value="blade" data-k="pblade"></option><option value="patch" data-k="ppatch"></option></select></label>' +
        '<p class="rzt-grp" data-k="gApprox"></p>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="approx"></span>' + seg('approx', [['mls', 'mls'], ['rbf', 'rbf']]) + '</div>' +
        '<label class="rzt-field">' + lab('alpha', true) + rng('alpha', 2.5, 5, 0.5) + '</label>' +
        '<p class="rzt-grp" data-k="gCells"></p>' +
        '<div class="rzt-field rzt-wide"><span class="rzt-lab" data-k="cells"></span>' + seg('overlap', [['0', 'nonov'], ['1', 'ov']]) + '</div>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="ngs"></span>' + seg('ngs', [['1', '', '1'], ['3', '', '3'], ['5', '', '5']]) + '</div>' +
        '<p class="rzt-grp" data-k="gNodes"></p>' +
        '<label class="rzt-field">' + lab('n', true) + rng('n', 2, 12, 1) + '<span class="rzt-size" data-out="size"></span></label>' +
        '<div class="rzt-field">' + lab('distort', true) + rng('distort', 0, 0.4, 0.05) + '<button type="button" class="rzt-btn" data-act="shuffle" data-k="shuffle"></button></div>' +
        '<p class="rzt-grp" data-k="gView"></p>' +
        '<label class="rzt-field rzt-wide"><span class="rzt-lab" data-k="field"></span>' +
          '<select class="rzt-sel" data-in="field">' + ['T', 'q', 'err', 'phi'].map(function (f) { return '<option value="' + f + '" data-k="f' + f + '"></option>'; }).join('') + '</select></label>' +
        '<div class="rzt-field rzt-wide"><span class="rzt-lab" data-k="show"></span><div class="rzt-chips">' +
          chip('nodes') + chip('cells') + chip('gauss') + chip('support') + chip('knots') + chip('net') + '</div></div>' +
        '<button type="button" class="rzt-btn rzt-reset" data-act="reset" data-k="reset"></button>' +
      '</div>' +
      '<div class="rzt-main">' +
        '<div class="rzt-metrics">' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="nn"></span><span class="rzt-ml" data-m="nnl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv"><span data-m="q"></span> <span class="rzt-chip" data-m="qc"></span></span><span class="rzt-ml" data-m="ql"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv"><span data-m="err"></span> <span class="rzt-chip" data-m="errc"></span></span><span class="rzt-ml" data-m="errl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="fem"></span><span class="rzt-ml" data-m="feml"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="row"></span><span class="rzt-ml" data-k="mRow"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="time"></span><span class="rzt-ml" data-k="mTime"></span></div>' +
        '</div>' +
        '<div class="rzt-note rzt-warn" data-note="warn" hidden></div>' +
        '<div class="rzt-note rzt-ok" data-note="ok" hidden></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-h="1"></span><span class="rzt-sub" data-sub="1"></span></div>' +
          '<div class="rzt-cvwrap"><canvas class="rzt-cv rzt-cv-fem" data-cv="1"></canvas><canvas class="rzt-ov" data-ov="1" aria-hidden="true"></canvas></div>' +
          '<div class="rzt-cbar" data-cbar></div><span class="rzt-read rzt-read-b" data-read="1"></span></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p2"></span><span class="rzt-sub" data-k="p2s"></span></div>' +
          '<div class="rzt-ps"><div class="rzt-cvwrap rzt-psq"><canvas class="rzt-cv rzt-cv-ps" data-cv="p"></canvas><canvas class="rzt-ov" data-ov="p" aria-hidden="true"></canvas></div>' +
          '<div><div class="rzt-eq" data-eq></div><dl class="rzt-info" data-info></dl></div></div></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p3"></span>' +
          '<select class="rzt-sel rzt-sel-inline" data-in="line"></select><span class="rzt-sub" data-k="p3s"></span><div class="rzt-legend" data-lg="2"></div></div>' +
          '<canvas class="rzt-cv" data-cv="2"></canvas><span class="rzt-read" data-read="2"></span></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p4"></span><span class="rzt-sub" data-k="p4s"></span>' +
          '<div class="rzt-row"><button type="button" class="rzt-btn rzt-primary" data-act="study" data-k="run"></button><span class="rzt-sub" data-out="study"></span></div>' +
          '<div class="rzt-legend" data-lg="3"></div></div>' +
          '<canvas class="rzt-cv" data-cv="3"></canvas><span class="rzt-read" data-read="3"></span></div>' +
      '</div>' +
    '</div>';

  var DEFAULTS = { problem: 'radial', approx: 'mls', alpha: 3.5, overlap: '0', ngs: '5', distort: 0, seed: 7, field: 'T', line: 'T45',
                   n: { radial: 6, annulus: 6, blade: 6, patch: 4 }, ov: { nodes: true, cells: true, gauss: false, support: false, knots: true, net: false }, sel: null };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  RZT.register('ndm2d', function (root) {
    root.classList.add('rzt', 'rzt-on');
    root.innerHTML = HTML;
    var S = clone(DEFAULTS), C = U.readColors(root), lang = 'en', cur = null, study = null, studyTok = 0, lastW = 0;
    function q(sel) { return root.querySelector(sel); }
    function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    function t(k) { return (T[lang] || T.en)[k] || T.en[k] || k; }
    var cv1 = q('[data-cv="1"]'), ov1 = q('[data-ov="1"]'), cvp = q('[data-cv="p"]'), ovp = q('[data-ov="p"]'), cv2 = q('[data-cv="2"]'), cv3 = q('[data-cv="3"]');
    var view = null, pview = null, P2 = null, P3 = null, lineData = null, convPts = [], hover = null;

    function alphaEff() { return S.approx === 'rbf' ? Math.min(S.alpha, RBFMAX) : S.alpha; }
    function cfg(extra) {
      var c = { problem: S.problem, n: S.n[S.problem], approx: S.approx, alpha: alphaEff(), overlap: +S.overlap, ngs: +S.ngs, distort: S.distort, seed: S.seed };
      for (var k in extra) c[k] = extra[k];
      return c;
    }
    // ≈ solve time in units of 0.15 µs: nodes × side points × support size (RBF also factorises a matrix per point)
    function cost(c) { var sz = D.size(c), s = Math.PI * c.alpha * c.alpha; return sz.nodes * (4 * c.ngs + 2) * s * (c.approx === 'rbf' ? s / 8 : 1); }
    function studyKey() { return [S.alpha, S.ngs, S.distort, S.seed].join('|'); }

    /* ── compute ───────────────────────────────────────────────── */
    function compute() {
      var key = JSON.stringify(cfg());
      if (cur && cur.key === key) { computeLine(); return; }
      var m = D.run(cfg()), r = { model: m, key: key };
      hover = null;   // indices of the previous model are not valid any more
      if (!m.error) {
        var md = m.md, nn = md.nn, i, out = new Float64Array(3), sm = V.samples(md, SUB), ns = sm.n, ex = m.pr.exact;
        r.sm = sm; r.V = new Float64Array(ns * 3).fill(NaN);
        for (i = 0; i < ns; i++) { var v = D.evalAt(m, sm.A[i], sm.B[i], sm.SA[i], sm.SB[i], out); if (v) r.V.set(v, i * 3); }
        r.nodeV = new Float64Array(nn * 3);
        for (i = 0; i < nn; i++) { var w = D.evalAt(m, md.lat.A[i], md.lat.B[i], 1, 1, out); if (w) r.nodeV.set(w, i * 3); }
        r.errs = ex ? D.errors(m) : null;
        r.refs = m.pr.ref.pts.map(function (p) { var vv = D.evalParam(m, p.u, p.v); return vv ? vv[0] : NaN; });
        var fm = D.femRun(cfg());
        r.fem = fm.error ? null : { errs: ex ? D.femErrors(fm) : null, refs: m.pr.ref.pts.map(function (p) { return D.femNode(fm, p.u, p.v); }), tin: m.pr.key === 'radial' ? D.femNode(fm, 0, 0.5) : NaN };
        if (m.pr.key === 'radial') { var ti = D.evalParam(m, 0, 0.5); r.tin = ti ? ti[0] : NaN; }
        var nd = 0; for (i = 0; i < nn; i++) nd += m.dirich[i];
        r.nd = nd;
        if (S.sel == null || S.sel >= nn) S.sel = defaultNode(md, m);
      }
      cur = r;
      computeLine();
    }
    function defaultNode(md, m) {
      var lat = md.lat, i = Math.max(1, Math.round(lat.Mu * 0.35)), j = Math.round(lat.Mv * 0.4);
      var k = lat.node(Math.min(lat.Mu - 1, i), Math.max(1, Math.min(lat.Mv - 1, j)));
      return m.dirich[k] ? lat.node(1, 1) : k;
    }

    function lineDef() {
      var m = cur.model, pr = m.pr, key = S.line, P = m.md.patch, ex = pr.exact;
      function rr(u, v) { var p = P.point(u, v); return Math.hypot(p[0], p[1]); }
      function th(u, v) { var p = P.point(u, v); return Math.atan2(p[1], p[0]) * 180 / Math.PI; }
      if (pr.key === 'radial' || pr.key === 'annulus') {
        if (key === 'Tin') return { f: 'T', xl: 'θ (°)', pt: function (s) { return [0, s]; }, x: th, ref: null, marks: [0] };
        var f = key === 'q45' ? 'q' : 'T';
        return { f: f, xl: 'r (m)', pt: function (s) { return [s, 0.5]; }, x: rr, ref: ex ? function (u, v) { var p = P.point(u, v); return f === 'q' ? pr.k * Math.hypot.apply(null, ex.g(p[0], p[1])) : ex.T(p[0], p[1]); } : null, marks: pr.key === 'annulus' ? [0, 1] : [] };
      }
      if (pr.key === 'blade') {
        if (key === 'Thub') return { f: 'T', xl: 'η', pt: function (s) { return [0, s]; }, x: function (u, v) { return v; }, ref: null, marks: [0] };
        return { f: 'T', xl: 'ξ', pt: function (s) { return [s, 0.5]; }, x: function (u) { return u; }, ref: null, marks: [0, 1] };
      }
      var g = key === 'qmid' ? 'q' : 'T';
      return { f: g, xl: 'x (m)', pt: function (s) { return [s, 0.5]; }, x: function (u, v) { return P.point(u, v)[0]; },
               ref: function (u, v) { var p = P.point(u, v); return g === 'q' ? pr.k * Math.hypot.apply(null, ex.g(p[0], p[1])) : ex.T(p[0], p[1]); }, marks: [] };
    }
    function fieldOf(f, v, x, y) {
      if (f === 'T') return v[0];
      if (f === 'q') return D.K * Math.hypot(v[1], v[2]);
      if (f === 'err') { var ex = cur.model.pr.exact; return ex ? Math.abs(v[0] - ex.T(x, y)) : NaN; }
      return NaN;
    }
    function computeLine() {
      lineData = null;
      var m = cur.model; if (m.error) return;
      var d = lineDef(), Np = 97, xs = [], fe = [], rf = [], out = new Float64Array(3), md = m.md;
      for (var i = 0; i < Np; i++) {
        var s = i / (Np - 1), uv = d.pt(s), x = d.x(uv[0], uv[1]), v = D.evalAt(m, md.ax.index(uv[0]), md.ay.index(uv[1]), 1, 1, out);
        var p = md.patch.point(uv[0], uv[1]);
        xs.push(x); fe.push(v ? fieldOf(d.f, v, p[0], p[1]) : NaN); rf.push(d.ref ? d.ref(uv[0], uv[1]) : NaN);
      }
      var marks = [];
      m.pr.ref.pts.forEach(function (p, k) { if (d.marks.indexOf(k) >= 0) { var on = d.pt(0); if ((d.xl === 'θ (°)' && p.u === 0) || (d.xl === 'η' && p.u === 0) || (d.xl !== 'θ (°)' && d.xl !== 'η' && Math.abs(p.v - 0.5) < 1e-9)) marks.push({ x: d.x(p.u, p.v), y: p.T }); } });
      lineData = { d: d, xs: xs, fe: fe, rf: rf, unit: FLD[d.f].unit, marks: marks };
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
      var sz = D.size(cfg()), m = cur && !cur.model.error ? cur : null;
      q('[data-in="problem"]').value = S.problem; q('[data-in="field"]').value = S.field;
      var ni = q('[data-in="n"]'); ni.max = NMAX[S.problem]; ni.value = S.n[S.problem];
      var ai = q('[data-in="alpha"]'); ai.max = S.approx === 'rbf' ? RBFMAX : 5; ai.value = alphaEff();
      q('[data-in="distort"]').value = S.distort;
      q('[data-out="n"]').textContent = S.n[S.problem]; q('[data-out="alpha"]').textContent = alphaEff().toFixed(1); q('[data-out="distort"]').textContent = S.distort.toFixed(2);
      var nd = m ? m.nd : 0;
      q('[data-out="size"]').textContent = U.fill(t('size'), { nodes: U.group(sz.nodes), cells: U.group(sz.nodes - nd), dir: U.group(nd) }) + (pendingBig ? ' · ' + t('big') : '');
      ['approx', 'overlap', 'ngs'].forEach(function (g) { qa('[data-seg="' + g + '"] button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === String(S[g]))); }); });
      qa('[data-ov]').forEach(function (b) { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(!!S.ov[b.getAttribute('data-ov')])); });
      q('[data-act="shuffle"]').hidden = !(S.distort > 0);
      q('[data-in="field"] option[value="err"]').disabled = !(m && m.model.pr.exact);
    }
    function chipPct(el, val, ref) {
      var rel = (val - ref) / ref, dv = Math.abs(rel), pc = dv * 100;
      el.textContent = pc < 0.001 ? '<0.001%' : (rel >= 0 ? '+' : '\u2212') + (pc < 0.1 ? pc.toFixed(3) : pc.toFixed(2)) + '%';
      el.classList.add(dv <= 1e-3 ? 'is-good' : dv <= 1e-2 ? 'is-ok' : 'is-bad');
    }
    function setMetrics() {
      function put(k, v) { q('[data-m="' + k + '"]').textContent = v; }
      var m = cur.model, chp = q('[data-m="qc"]'), chp2 = q('[data-m="errc"]'), warn = q('[data-note="warn"]'), ok = q('[data-note="ok"]');
      chp.className = 'rzt-chip'; chp.textContent = ''; chp2.className = 'rzt-chip'; chp2.textContent = ''; warn.hidden = true; ok.hidden = true;
      if (m.error) {
        ['nn', 'q', 'err', 'fem', 'row', 'time'].forEach(function (k) { put(k, '—'); }); ['nnl', 'ql', 'errl', 'feml'].forEach(function (k) { put(k, ''); });
        warn.textContent = U.fill(t(m.error) || t('fail2'), { n: m.bad || 0, k: m.why || '' }); warn.hidden = false; return;
      }
      var pr = m.pr, W = [], O = [], nn = m.nn;
      put('nn', U.group(nn)); put('nnl', U.fill(t('mNodes'), { c: U.group(nn - cur.nd), d: U.group(cur.nd) }));
      put('row', (m.nnz / nn).toFixed(1)); put('time', Math.max(1, Math.round(m.time.assemble + m.time.solve)) + ' ms');
      function errTxt(e) { return e >= 1e-4 ? fmt(e * 100) + ' %' : U.sci(e); }
      if (pr.key === 'radial') {
        var te = pr.exact.T(0.3 * Math.SQRT1_2, 0.3 * Math.SQRT1_2);
        put('q', cur.tin.toFixed(3) + ' °C'); put('ql', U.fill(t('mTin'), { v: te.toFixed(3) + ' °C' })); chipPct(chp, cur.tin, te);
        put('err', errTxt(cur.errs.energy)); put('errl', t('mErr'));
        if (cur.fem) { put('fem', errTxt(cur.fem.errs.energy)); put('feml', t('mFem')); }
        O.push(t('radNote'));
      } else if (pr.key === 'patch') {
        var passed = cur.errs.tmax < 1e-9;
        put('q', U.sci(cur.errs.tmax) + ' °C'); put('ql', t('mPatch')); chp.textContent = t(passed ? 'pass' : 'notExact'); chp.classList.add(passed ? 'is-good' : 'is-ok');
        put('err', errTxt(cur.errs.energy)); put('errl', t('mErr'));
        if (cur.fem) { put('fem', errTxt(cur.fem.errs.energy)); put('feml', t('mFem')); }
        if (passed) O.push(t('patchOK')); else if (S.approx === 'rbf') W.push(t('patchRBF'));
      } else {
        var p0 = pr.ref.pts[0], p1 = pr.ref.pts[1], blade = pr.key === 'blade';
        put('q', cur.refs[0].toFixed(3) + ' °C'); put('ql', U.fill(t(blade ? 'mTP1' : 'mTP'), { v: p0.T.toFixed(3) + ' °C' })); chipPct(chp, cur.refs[0], p0.T);
        put('err', cur.refs[1].toFixed(3) + ' °C'); put('errl', U.fill(t(blade ? 'mTP2' : 'mTQ'), { v: p1.T.toFixed(3) + ' °C' })); chipPct(chp2, cur.refs[1], p1.T);
        if (cur.fem) { put('fem', cur.fem.refs[0].toFixed(3) + ' °C'); put('feml', U.fill(t('mFemP'), { p: blade ? 'P₁' : 'P' })); }
        O.push(t(blade ? 'bladeNote' : 'annNote'));
      }
      if (S.approx === 'mls' && pr.key !== 'patch') O.push(U.fill(t('mlsDir'), { v: fmt(D.phiAt(m, S.sel, m.md.lat.A[S.sel], m.md.lat.B[S.sel], 1, 1)) }));
      if (S.overlap === '1') O.push(t('ovNote'));
      if (W.length) { warn.textContent = W.join(' '); warn.hidden = false; }
      if (O.length) { ok.textContent = O.join(' '); ok.hidden = false; }
    }

    /* ── sample values ────────────────────────────────────────── */
    function sampleValues() {
      var m = cur.model, sm = cur.sm, vals = new Float64Array(sm.n), lo = Infinity, hi = -Infinity, i;
      for (i = 0; i < sm.n; i++) {
        var v;
        if (S.field === 'phi') v = D.phiAt(m, S.sel, sm.A[i], sm.B[i], sm.SA[i], sm.SB[i]);
        else v = isFinite(cur.V[i * 3]) ? fieldOf(S.field, [cur.V[i * 3], cur.V[i * 3 + 1], cur.V[i * 3 + 2]], sm.X[i], sm.Y[i]) : NaN;
        vals[i] = v; if (isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; }
      }
      return { vals: vals, lo: lo, hi: hi };
    }
    function setSize(cvs, W, H) {
      var dpr = window.devicePixelRatio || 1;
      cvs.forEach(function (c) { c.style.height = H + 'px'; if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); } });
    }
    // closed outline of an index-space rectangle [a0, a1] × [b0, b1], mapped by f(a, b) → [x, y] (screen)
    function rectPath(c, f, nseg) {
      var pts = [], k, n = nseg || 16;
      for (k = 0; k <= n; k++) pts.push(f(c[0] + (c[1] - c[0]) * k / n, c[2]));
      for (k = 1; k <= n; k++) pts.push(f(c[1], c[2] + (c[3] - c[2]) * k / n));
      for (k = n - 1; k >= 0; k--) pts.push(f(c[0] + (c[1] - c[0]) * k / n, c[3]));
      for (k = n - 1; k > 0; k--) pts.push(f(c[0], c[2] + (c[3] - c[2]) * k / n));
      return pts;
    }

    /* ── physical view ────────────────────────────────────────── */
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
      var md = m.md, sm = cur.sm, ns = sm.n, i, x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (i = 0; i < ns; i++) { x0 = Math.min(x0, sm.X[i]); x1 = Math.max(x1, sm.X[i]); y0 = Math.min(y0, sm.Y[i]); y1 = Math.max(y1, sm.Y[i]); }
      if (S.ov.net) for (var a1 = 0; a1 < md.patch.nu; a1++) for (var b1 = 0; b1 < md.patch.nv; b1++) { var cp = md.patch.ctrl(a1, b1); x0 = Math.min(x0, cp[0]); x1 = Math.max(x1, cp[0]); y0 = Math.min(y0, cp[1]); y1 = Math.max(y1, cp[1]); }
      var fit = V.fit(W, x0, x1, y0, y1, 34, 220, 520), SX = fit.SX, SY = fit.SY, H = fit.H;
      setSize([cv1, ov1], W, H);
      g = cv1.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      var fd = FLD[S.field], sv = sampleValues(), bp = U.bandPainter(sv.lo, sv.hi, fd.div, C), px = new Float64Array(ns), py = new Float64Array(ns);
      for (i = 0; i < ns; i++) { px[i] = SX(sm.X[i]); py[i] = SY(sm.Y[i]); }
      V.contour(bp, sm, px, py, sv.vals); bp.paint(g);
      var o = new Float64Array(12);
      function phys(a, b) { md.map.at(a, b, o, 1, 1); return [SX(o[0]), SY(o[1])]; }
      drawCommon(g, md, phys, function (n) { return [SX(md.X[n]), SY(md.Y[n])]; }, true, SX, SY);
      boundaryGlyphs(g, md, phys);
      view = { SX: SX, SY: SY, px: px, py: py, node: function (n) { return [SX(md.X[n]), SY(md.Y[n])]; } };
      sub.textContent = U.fill(t('p1s'), { f: U.plain(t('f' + S.field)) });
      U.colorbar(cbar, bp.cols, bp.lev, fd.unit);
      cur.sv = sv;
      drawHover();
    }
    // overlays common to both views; F(a, b) maps index → screen, nodeXY(n) gives a node's screen position
    function drawCommon(g, md, Fm, nodeXY, phys, SX, SY) {
      var m = cur.model, lat = md.lat, nn = md.nn, i;
      if (S.ov.cells) {
        g.save(); g.strokeStyle = U.rgba(C.fg, S.overlap === '1' ? 0.22 : 0.3); g.lineWidth = 0.7;
        for (i = 0; i < nn; i++) { if (m.dirich[i]) continue; V.stroke(g, rectPath(D.cellOf(md, i), Fm, 6), true); g.stroke(); }
        g.restore();
      }
      if (S.ov.knots) {
        g.save(); g.setLineDash([7, 3, 2, 3]);
        md.ax.A.slice(1, -1).forEach(function (a) { var c0 = md.ax.c0.indexOf(a) >= 0; g.strokeStyle = c0 ? C.fg : U.rgba(C.fg, 0.55); g.lineWidth = c0 ? 1.4 : 1; var pts = []; for (var k = 0; k <= 40; k++) pts.push(Fm(a, lat.Mv * k / 40)); V.stroke(g, pts); g.stroke(); });
        md.ay.A.slice(1, -1).forEach(function (b) { var c0 = md.ay.c0.indexOf(b) >= 0; g.strokeStyle = c0 ? C.fg : U.rgba(C.fg, 0.55); g.lineWidth = c0 ? 1.4 : 1; var pts = []; for (var k = 0; k <= 40; k++) pts.push(Fm(lat.Mu * k / 40, b)); V.stroke(g, pts); g.stroke(); });
        g.restore();
      }
      if (S.ov.net && phys) V.controlNet(g, md.patch, SX, SY, C);
      if (S.ov.gauss) {
        g.fillStyle = U.rgba(C.fg, 0.5);
        for (i = 0; i < nn; i++) { if (m.dirich[i]) continue; D.sidePoints(md, D.cellOf(md, i), md.ngs).forEach(function (P) { var s = Fm(P.a, P.b); g.fillRect(s[0] - 1, s[1] - 1, 2, 2); }); }
      }
      if (S.ov.support && S.sel != null) {
        var a = lat.A[S.sel], b = lat.B[S.sel], d = md.S.d, su = lat.ax.segOf(a, 1), sv2 = lat.ay.segOf(b, 1), pts = [];
        for (i = 0; i <= 72; i++) {
          var th = 2 * Math.PI * i / 72, aa = Math.max(su[0], Math.min(su[1], a + d * Math.cos(th))), bb = Math.max(sv2[0], Math.min(sv2[1], b + d * Math.sin(th)));
          pts.push(Fm(aa, bb));
        }
        V.stroke(g, pts, true); g.fillStyle = U.rgba(C.accent, 0.12); g.fill();
        g.save(); g.setLineDash([5, 4]); g.strokeStyle = C.accent; g.lineWidth = 1.4; g.stroke(); g.restore();
      }
      // the selected node's cell: outline, side Gauss points and outward normals
      if (S.sel != null && !m.dirich[S.sel]) {
        var c = D.cellOf(md, S.sel);
        g.save(); V.stroke(g, rectPath(c, Fm, 16), true); g.fillStyle = U.rgba(C.gold, 0.14); g.fill(); g.lineWidth = 2; g.strokeStyle = C.gold; g.stroke(); g.restore();
        g.fillStyle = C.fg;
        D.sidePoints(md, c, md.ngs).forEach(function (P) { var s = Fm(P.a, P.b); g.beginPath(); g.arc(s[0], s[1], 2.2, 0, Math.PI * 2); g.fill(); });
        // outward normals at the side midpoints
        var mids = [['b', (c[0] + c[1]) / 2, c[2], 0, -1], ['r', c[1], (c[2] + c[3]) / 2, 1, 0], ['t', (c[0] + c[1]) / 2, c[3], 0, 1], ['l', c[0], (c[2] + c[3]) / 2, -1, 0]];
        g.save(); g.strokeStyle = C.accent; g.fillStyle = C.accent; g.lineWidth = 1.6;
        mids.forEach(function (mm) {
          var p0 = Fm(mm[1], mm[2]), e = 1e-3, pa = Fm(mm[1] + (mm[3] ? 0 : e), mm[2] + (mm[3] ? e : 0)), pb = Fm(mm[1] - (mm[3] ? 0 : e), mm[2] - (mm[3] ? e : 0));
          // screen normal: perpendicular to the side tangent, pointing away from the cell
          var tx = pa[0] - pb[0], ty = pa[1] - pb[1], L = Math.hypot(tx, ty) || 1, nx = ty / L, ny = -tx / L;
          var inner = Fm(mm[1] - mm[3] * 0.25 * (c[1] - c[0]), mm[2] - mm[4] * 0.25 * (c[3] - c[2]));
          if ((inner[0] - p0[0]) * nx + (inner[1] - p0[1]) * ny > 0) { nx = -nx; ny = -ny; }
          var len = 16, ex = p0[0] + nx * len, ey = p0[1] + ny * len;
          g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(ex, ey); g.stroke();
          g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex - nx * 5 - ny * 3, ey - ny * 5 + nx * 3); g.lineTo(ex - nx * 5 + ny * 3, ey - ny * 5 - nx * 3); g.closePath(); g.fill();
        });
        g.restore();
      }
      if (S.ov.nodes) {
        var r = nn > 600 ? 1.7 : 2.5;
        g.lineWidth = 1; g.strokeStyle = C.fg; g.fillStyle = C.surface;
        for (i = 0; i < nn; i++) {
          var p = nodeXY(i); g.beginPath();
          if (m.dirich[i]) g.rect(p[0] - r, p[1] - r, 2 * r, 2 * r); else g.arc(p[0], p[1], r, 0, Math.PI * 2);
          g.fill(); g.stroke();
        }
      }
      if (S.sel != null) { var ps = nodeXY(S.sel); g.beginPath(); g.arc(ps[0], ps[1], 4.5, 0, Math.PI * 2); g.fillStyle = C.accent; g.fill(); g.lineWidth = 1.5; g.strokeStyle = C.surface; g.stroke(); }
      if (lineData && phys) {
        var d = lineData.d, pts2 = [];
        for (i = 0; i <= 40; i++) { var uv = d.pt(i / 40); pts2.push(Fm(md.ax.index(uv[0]), md.ay.index(uv[1]))); }
        g.save(); g.setLineDash([6, 4]); g.strokeStyle = C.fg; g.lineWidth = 1.4; V.stroke(g, pts2); g.stroke(); g.restore();
      }
    }
    // boundary conditions: prescribed T (solid), heat flux in (arrows), insulated (dashed)
    function boundaryGlyphs(g, md, Fm) {
      var pr = cur.model.pr, lat = md.lat;
      [['s0', 0, null], ['s1', lat.Mu, null], ['t0', null, 0], ['t1', null, lat.Mv]].forEach(function (E) {
        var bc = pr.bc(E[0], 0, 0), along = E[1] === null, M = along ? lat.Mu : lat.Mv, pts = [];
        for (var k = 0; k <= 60; k++) { var s = M * k / 60; pts.push(Fm(along ? s : E[1], along ? E[2] : s)); }
        g.save();
        if (bc && bc.T !== undefined) { g.strokeStyle = C.accent; g.lineWidth = 3; V.stroke(g, pts); g.stroke(); }
        else if (!bc) { g.setLineDash([4, 4]); g.strokeStyle = C.fg2; g.lineWidth = 1.5; V.stroke(g, pts); g.stroke(); }
        else {
          g.strokeStyle = C.gold; g.fillStyle = C.gold; g.lineWidth = 1.8;
          var cx = 0, cy = 0; pts.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= pts.length; cy /= pts.length;
          var mid = Fm(lat.Mu / 2, lat.Mv / 2);
          for (var j = 3; j < 60; j += 6) {
            var a = pts[j - 1], b = pts[j + 1], tx = b[0] - a[0], ty = b[1] - a[1], L = Math.hypot(tx, ty) || 1, nx = -ty / L, ny = tx / L, p = pts[j];
            if ((mid[0] - p[0]) * nx + (mid[1] - p[1]) * ny < 0) { nx = -nx; ny = -ny; }
            var sx = p[0] - nx * 18, sy = p[1] - ny * 18, ex = p[0] - nx * 3, ey = p[1] - ny * 3;
            g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.stroke();
            g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex - nx * 5 - ny * 3, ey - ny * 5 + nx * 3); g.lineTo(ex - nx * 5 + ny * 3, ey - ny * 5 - nx * 3); g.closePath(); g.fill();
          }
        }
        g.restore();
      });
    }

    /* ── parameter-space view and the cell equation ───────────── */
    function drawParam() {
      var m = cur.model, dpr = window.devicePixelRatio || 1, W = cvp.parentNode.clientWidth;
      if (!W) return;
      if (m.error) { setSize([cvp, ovp], W, 120); var g0 = cvp.getContext('2d'); g0.setTransform(dpr, 0, 0, dpr, 0, 0); g0.clearRect(0, 0, W, 120); q('[data-info]').innerHTML = ''; q('[data-eq]').innerHTML = ''; pview = null; return; }
      var md = m.md, sm = cur.sm, ns = sm.n, i, M = 30, side = Math.min(W - 2 * M, 360), H = side + 2 * M;
      setSize([cvp, ovp], W, H);
      var ox = (W - side) / 2, SX = function (u) { return ox + u * side; }, SY = function (v) { return M + (1 - v) * side; };
      var g = cvp.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      var sv = cur.sv || sampleValues(), bp = U.bandPainter(sv.lo, sv.hi, FLD[S.field].div, C), px = new Float64Array(ns), py = new Float64Array(ns);
      for (i = 0; i < ns; i++) { px[i] = SX(sm.U[i]); py[i] = SY(sm.W[i]); }
      V.contour(bp, sm, px, py, sv.vals); bp.paint(g);
      function Fm(a, b) { return [SX(md.ax.param(a, 1)), SY(md.ay.param(b, 1))]; }
      drawCommon(g, md, Fm, function (n) { return Fm(md.lat.A[n], md.lat.B[n]); }, false, SX, SY);
      g.strokeStyle = C.fg2; g.lineWidth = 1; g.strokeRect(SX(0), SY(1), side, side);
      g.fillStyle = C.fg2; g.font = '11px "IBM Plex Mono", ui-monospace, monospace'; g.textAlign = 'center'; g.textBaseline = 'top';
      md.patch.ku.forEach(function (u) { g.fillText(String(+u.toFixed(3)), SX(u), SY(0) + 5); });
      g.textAlign = 'right'; g.textBaseline = 'middle';
      md.patch.kv.forEach(function (v) { g.fillText(String(+v.toFixed(3)), SX(0) - 5, SY(v)); });
      g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText('ξ', SX(1) + 6, SY(0) + 5);
      g.textAlign = 'right'; g.textBaseline = 'bottom'; g.fillText('η', SX(0) - 5, SY(1) - 6);
      pview = { SX: SX, SY: SY, px: px, py: py, node: function (n) { return Fm(md.lat.A[n], md.lat.B[n]); } };
      fillEq(md); fillInfo(md);
      drawHover();
    }
    function fillEq(md) {
      var m = cur.model, I = S.sel, el = q('[data-eq]'); if (I == null) { el.innerHTML = ''; return; }
      var rep = D.cellReport(m, I), html;
      if (rep.kind === 'dirichlet') {
        html = '<p class="rzt-eq-h">' + U.esc(U.fill(t('eqDir'), { i: I })) + '</p><p>' + U.esc(U.fill(t('eqDirTxt'), { T: fmt(rep.T), n: rep.stencil, own: fmt(rep.own) })) + '</p>';
      } else {
        var rows = [['b', '−∫ (T,ξ G₁₂ + T,η G₂₂) dξ'], ['r', '+∫ (T,ξ G₁₁ + T,η G₁₂) dη'], ['t', '+∫ (T,ξ G₁₂ + T,η G₂₂) dξ'], ['l', '−∫ (T,ξ G₁₁ + T,η G₁₂) dη']];
        html = '<p class="rzt-eq-h">' + U.esc(U.fill(t('eqTitle'), { i: I })) + '</p><table class="rzt-tbl rzt-eq-t"><tbody>' + rows.map(function (r) {
          var kn = rep.known[r[0]], val = kn !== null ? kn : rep.sides[r[0]], tag = kn !== null ? (kn === 0 ? t('eqIns') : t('eqKnown')) : '';
          return '<tr><td>' + U.esc(t('side_' + r[0])) + '</td><td class="rzt-eq-f">' + U.esc(r[1]) + (tag ? ' <em>' + U.esc(tag) + '</em>' : '') + '</td><td>' + U.esc(fmt(val)) + '</td></tr>';
        }).join('') + '<tr class="rzt-eq-s"><td colspan="2">' + U.esc(t('eqSum')) + '</td><td>' + U.esc(fmt(rep.total)) + '</td></tr>' +
          '<tr><td colspan="2">' + U.esc(t('eqSrc')) + '</td><td>' + U.esc(fmt(rep.source)) + '</td></tr></tbody></table>' +
          '<p class="rzt-eq-n">' + U.esc(U.fill(t('eqStencil'), { n: rep.stencil })) + ' · ' + U.esc(t('eqUnit')) + '</p>';
      }
      el.innerHTML = html;
    }
    function fillInfo(md) {
      var P = md.patch, ws = {}, i, j;
      for (i = 0; i < P.nu; i++) for (j = 0; j < P.nv; j++) ws[+P.ctrl(i, j)[2].toFixed(4)] = 1;
      var wl = Object.keys(ws).map(Number).sort(function (a, b) { return b - a; }).map(function (w) { return String(+w.toFixed(4)); }).join(', ');
      var c0 = P.c0u.map(function (u) { return 'ξ = ' + u; }).concat(P.c0v.map(function (v) { return 'η = ' + v; }));
      var rows = [
        [t('iKnots'), 'Ξ = ' + V.knotText(P.U) + ', p = ' + P.p + '<br>H = ' + V.knotText(P.V) + ', q = ' + P.q],
        [t('iCp'), U.fill(t('iCpV'), { a: P.nu, b: P.nv, w: wl })],
        [t('iC0'), c0.length ? c0.join(', ') : t('iNone')],
        [t('iHover'), '<span data-out="hover">—</span>']
      ];
      q('[data-info]').innerHTML = rows.map(function (r) { return '<dt>' + U.esc(r[0]) + '</dt><dd>' + r[1] + '</dd>'; }).join('');
    }

    /* ── hover, linked between the views ──────────────────────── */
    function drawHover() {
      var dpr = window.devicePixelRatio || 1, rd = q('[data-read="1"]'), ho = q('[data-out="hover"]');
      [ov1, ovp].forEach(function (cv) { var g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, cv.width / dpr, cv.height / dpr); });
      if (!hover || !view || !pview || cur.model.error) { rd.textContent = ''; if (ho) ho.textContent = '—'; return; }
      var m = cur.model, md = m.md, sm = cur.sm, fd = FLD[S.field];
      function ring(cv, p) { var g = cv.getContext('2d'); g.beginPath(); g.arc(p[0], p[1], 6, 0, Math.PI * 2); g.lineWidth = 2; g.strokeStyle = C.surface; g.stroke(); g.beginPath(); g.arc(p[0], p[1], 5, 0, Math.PI * 2); g.lineWidth = 1.6; g.strokeStyle = C.fg; g.stroke(); }
      if (hover.node != null) {
        var n = hover.node; ring(ov1, view.node(n)); ring(ovp, pview.node(n));
        var x = md.X[n], y = md.Y[n], nv = cur.nodeV, v, ex = NaN;
        if (S.field === 'phi') v = D.phiAt(m, S.sel, md.lat.A[n], md.lat.B[n], 1, 1);
        else { v = fieldOf(S.field, [nv[n * 3], nv[n * 3 + 1], nv[n * 3 + 2]], x, y); if (S.field === 'T' && m.pr.exact) ex = m.pr.exact.T(x, y); }
        rd.textContent = U.fill(t('readNode'), { i: n, x: x.toFixed(3), y: y.toFixed(3), f: SYM[S.field], v: fmt(v) + (fd.unit ? ' ' + fd.unit : '') }) + (isFinite(ex) ? U.fill(t('readExact'), { v: fmt(ex) + ' ' + fd.unit }) : '');
        if (ho) { var o = md.map.at(md.lat.A[n], md.lat.B[n]); ho.textContent = U.fill(t('readMap'), { u: o[7].toFixed(3), v: o[8].toFixed(3), x: x.toFixed(3), y: y.toFixed(3), j: fmt(o[11]) }); }
        return;
      }
      var k = hover.k; ring(ov1, [view.px[k], view.py[k]]); ring(ovp, [pview.px[k], pview.py[k]]);
      rd.textContent = SYM[S.field] + ' = ' + fmt(cur.sv ? cur.sv.vals[k] : NaN) + (fd.unit ? ' ' + fd.unit : '');
      if (ho) ho.textContent = U.fill(t('readMap'), { u: sm.U[k].toFixed(3), v: sm.W[k].toFixed(3), x: sm.X[k].toFixed(3), y: sm.Y[k].toFixed(3), j: fmt(sm.J[k]) });
    }
    function nearest(ev, cv, vw) {
      var r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, best = null, bd = 14 * 14, i, nn = cur.model.md.nn;
      for (i = 0; i < nn; i++) { var p = vw.node(i), dx = p[0] - mx, dy = p[1] - my, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = { node: i }; } }
      if (best) return best;
      bd = 30 * 30;
      for (i = 0; i < vw.px.length; i++) { var ex = vw.px[i] - mx, ey = vw.py[i] - my, e = ex * ex + ey * ey; if (e < bd) { bd = e; best = { k: i }; } }
      return best;
    }
    [[ov1, function () { return view; }], [ovp, function () { return pview; }]].forEach(function (p) {
      p[0].addEventListener('mousemove', function (ev) { if (!view || !pview || cur.model.error) return; hover = nearest(ev, p[0], p[1]()); drawHover(); });
      p[0].addEventListener('mouseleave', function () { hover = null; drawHover(); });
      p[0].addEventListener('click', function (ev) { if (!view || !pview || cur.model.error) return; var h = nearest(ev, p[0], p[1]()); if (!h || h.node == null) return; S.sel = h.node; update(false); });
    });

    /* ── line plot ────────────────────────────────────────────── */
    function drawLine() {
      var lg = q('[data-lg="2"]');
      if (!lineData) { P2 = U.plot(cv2, { xr: [0, 1], yr: [0, 1] }, C); lg.innerHTML = ''; return; }
      var L = lineData, lo = Infinity, hi = -Infinity, pts = [], items = [];
      L.fe.concat(L.rf).concat(L.marks.map(function (m) { return m.y; })).forEach(function (v) { if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } });
      if (!isFinite(lo)) { lo = 0; hi = 1; }
      var pad = (hi - lo) * 0.08 || Math.max(Math.abs(hi) * 0.01, 1e-3); lo -= pad; hi += pad;
      var hasRef = L.rf.some(isFinite), lines = [];
      if (hasRef) lines.push({ x: L.xs, y: L.rf, stroke: U.rgba(C.fg2, 0.45), width: 5 });
      lines.push({ x: L.xs, y: L.fe, stroke: C.accent, width: 1.8 });
      L.marks.forEach(function (mk) { pts.push({ x: mk.x, y: mk.y, r: 5, fill: C.gold, stroke: C.surface, lw: 1.5, shape: 'diamond' }); });
      var xr = [Math.min.apply(null, L.xs), Math.max.apply(null, L.xs)];
      P2 = U.plot(cv2, { xr: xr, yr: [lo, hi], xlabel: L.d.xl, ylabel: L.unit, ml: 56, lines: lines, points: pts }, C);
      items.push({ t: t('lgNdm') + ' (' + t(S.approx) + ', α = ' + alphaEff().toFixed(1) + ')', c: C.accent });
      if (hasRef) items.push({ t: t('lgExact'), c: U.rgba(C.fg2, 0.6) });
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

    /* ── NDM against FEM (radial flow) ────────────────────────── */
    function runStudy() {
      var tok = ++studyTok, jobs = [];
      SERIES.forEach(function (sr, si) { STUDY_N.forEach(function (n) { jobs.push({ si: si, n: n }); }); });
      study = { key: studyKey(), pts: SERIES.map(function () { return []; }), done: 0, total: jobs.length };
      (function next() {
        if (tok !== studyTok) return;
        if (!jobs.length) { study.finished = true; drawConv(); return; }
        var j = jobs.shift(), sr = SERIES[j.si], c = { problem: 'radial', n: j.n, alpha: S.alpha, ngs: +S.ngs, distort: S.distort, seed: S.seed };
        if (sr.fem) { var fm = D.femRun(c); if (!fm.error) study.pts[j.si].push({ dof: fm.T.length, e: D.femErrors(fm).energy }); }
        else {
          c.approx = sr.approx; c.overlap = sr.overlap; if (sr.approx === 'rbf') c.alpha = Math.min(S.alpha, RBFMAX);
          var em = D.run(c); if (!em.error) study.pts[j.si].push({ dof: em.nn, e: D.errors(em).energy });
        }
        study.done++; drawConv();
        setTimeout(next, 0);
      })();
    }
    function drawConv() {
      var lg = q('[data-lg="3"]'), msg = q('[data-out="study"]'), btn = q('[data-act="study"]'), series = U.series(C);
      var valid = study && study.key === studyKey(), okP = S.problem === 'radial';
      btn.disabled = !okP || !!(valid && !study.finished);
      if (!okP) msg.textContent = t('noStudy');
      else if (!study) msg.textContent = U.fill(t('idle'), { n: SERIES.length * STUDY_N.length });
      else if (!valid) msg.textContent = t('stale');
      else msg.textContent = study.finished ? '' : U.fill(t('running'), { i: study.done, n: study.total });
      var lines = [], pts = [], items = [], all = []; convPts = [];
      if (valid && okP) SERIES.forEach(function (sr, i) {
        var P = study.pts[i].filter(function (p) { return p.e > 0 && isFinite(p.e); }); if (!P.length) return;
        lines.push({ x: P.map(function (p) { return p.dof; }), y: P.map(function (p) { return p.e; }), stroke: series[i], width: 2, dash: sr.fem ? [5, 4] : sr.overlap ? [2, 3] : null });
        P.forEach(function (p) { pts.push({ x: p.dof, y: p.e, r: 4.5, fill: series[i], stroke: C.surface, lw: 1.5, shape: SHAPES[i] }); convPts.push({ s: t(sr.k), dof: p.dof, e: p.e }); all.push(p); });
        var rate = P.length > 1 ? Math.log(P[P.length - 2].e / P[P.length - 1].e) / Math.log(Math.sqrt(P[P.length - 1].dof / P[P.length - 2].dof)) : NaN;
        items.push({ t: t(sr.k) + (isFinite(rate) ? ' · ' + t('rate') + ' ' + rate.toFixed(2) : ''), c: series[i], type: 'marker', shape: SHAPES[i] });
      });
      if (cur && !cur.model.error && okP && cur.errs) { all.push({ dof: cur.model.nn, e: cur.errs.energy }); pts.push({ x: cur.model.nn, y: cur.errs.energy, r: 7.5, stroke: C.fg, lw: 1.8 }); items.push({ t: t('cur'), c: C.surface, type: 'dot', b: C.fg }); }
      var dx = [10, 1e3], dy = [1e-4, 1];
      if (all.length) {
        var mnx = Math.min.apply(null, all.map(function (p) { return p.dof; })), mxx = Math.max.apply(null, all.map(function (p) { return p.dof; }));
        var mny = Math.min.apply(null, all.map(function (p) { return p.e; })), mxy = Math.max.apply(null, all.map(function (p) { return p.e; }));
        dx = [Math.pow(10, Math.floor(Math.log10(mnx))), Math.pow(10, Math.ceil(Math.log10(mxx)))]; dy = [Math.pow(10, Math.floor(Math.log10(mny))), Math.pow(10, Math.ceil(Math.log10(mxy)))];
        if (dy[1] / dy[0] < 100) dy[0] = dy[1] / 100; if (dx[1] / dx[0] < 100) dx[1] = dx[0] * 100;
      }
      P3 = U.plot(cv3, { xr: dx, yr: dy, xlog: true, ylog: true, xlabel: t('gNodes').toLowerCase(), ylabel: t('yErr'), lines: lines, points: pts }, C);
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
    var RECOMP = { n: 1, distort: 1, alpha: 1 };
    function readInput(el) {
      var k = el.getAttribute('data-in'), v = el.value;
      if (k === 'n') S.n[S.problem] = +v;
      else if (k === 'line' || k === 'field') S[k] = v;
      else if (k === 'problem') { S.problem = v; S.line = LINES[v][0]; S.sel = null; if (S.field === 'err' && v !== 'radial' && v !== 'patch') S.field = 'T'; fillLineSelect(); }
      else S[k] = +v;
      return k;
    }
    root.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-in'); if (!k || e.target.tagName === 'SELECT') return;
      readInput(e.target);
      if (RECOMP[k]) { if (cost(cfg()) <= LIVE_COST) update(true); else sync(true); }
    });
    root.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-in'); if (!k) return;
      readInput(e.target);
      if (k === 'line' || k === 'field') { computeLine(); update(false); return; }
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
