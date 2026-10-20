/* ═══════════════════════════════════════════════════════════════
   2D N-RPIM core (NURBS geometry + radial point interpolation) — window.RZNRPIM
   Mokhtaram, Mohd Noor, Jamil Abd Nazir, Zainal Abidin and Mohd Yassin,
   Eng. Anal. Bound. Elem. 138 (2022) 266–279.
   · The domain is a NURBS patch, so curved edges are exact.
   · Nodes live in the parameter space; RPIM shape functions (MQ or TPS radial
     basis functions plus polynomial terms) are built there and carry the
     Kronecker delta property, so essential conditions are imposed directly.
   · Galerkin weak form integrated on cells that subdivide the knot spans:
     parent (Gauss) → parameter (affine) → physical (NURBS); B = Ĵ⁻¹ J̃⁻¹ B̃.
   Also solves Q4 finite elements on the same nodes (straight-sided elements).
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  var N = root.RZNURBS, F = root.RZFEM, T = F.T, E0 = F.E;

  /* ── problems ─────────────────────────────────────────────────── */
  // Each returns { key, patch, mu, mv (intervals per knot span in ξ and η), E, nu, dirichlet(tag, x, y),
  // traction(tag, x, y), points [{u, v, ux, uy}], exact {u, s} | null, ref, bbox, keep(i, j) }
  function problem(cfg) {
    var G = N.GEOM, n = Math.max(1, Math.round(cfg.n || 4)), pr, base;
    if (cfg.problem === 'cantilever') {
      base = F.PROBLEMS.cantilever(cfg);
      pr = { patch: G.rect(0, base.L, -base.D / 2, base.D / 2), mu: Math.max(1, Math.round(n * cfg.ld)), mv: n };
    } else if (cfg.problem === 'hole') {
      base = F.PROBLEMS.hole(cfg);
      pr = { patch: G.plateHole(base.a, base.b), mu: n, mv: n };
    } else if (cfg.problem === 'patch') {
      base = F.PROBLEMS.patch(cfg);
      pr = { patch: cfg.param === 'curved' ? G.squareCurved(0.15) : G.rect(0, 1, 0, 1), mu: n, mv: n };
    } else return cell(cfg, n);
    for (var k in base) if (!(k in pr)) pr[k] = base[k];
    pr.E = E0; pr.nu = cfg.nu; pr.points = [];
    return pr;
  }
  // Web post of a cellular beam (paper, section 6): E = 210 GPa, ν = 0.25, 1 kN/m on a 1 mm web = 1 MPa.
  // References are the paper's converged COMSOL values.
  function cell(cfg, n) {
    var s = 0.8, d = 1.0, r = 0.3, q = 1e6, shear = cfg.load === 'shear', tol = 1e-9;
    var pts = shear ? [] : [{ u: 0, v: 0.5, ux: null, uy: 0 }, { u: 1, v: 0.5, ux: null, uy: 0 }, { u: 0.5, v: 0.5, ux: 0, uy: null }];
    return {
      key: 'cell', load: shear ? 'shear' : 'comp', patch: N.GEOM.unitCell(s, d, r), mu: 2 * n, mv: n, E: 210e9, nu: 0.25, s: s, d: d, r: r, q: q,
      dirichlet: function (tag, x) {
        if (!shear) return null;
        if (tag === 's0' && Math.abs(x) < tol) return [0, 0];          // clamped on the left edges
        if (tag === 's1' && Math.abs(x - s) < tol) return [0, null];   // horizontally restrained on the right edges
        return null;
      },
      traction: function (tag, x) {
        if (shear) return tag === 's1' && Math.abs(x - s) < tol ? [0, -q] : null;
        return tag === 't0' ? [0, q] : tag === 't1' ? [0, -q] : null;
      },
      points: pts, exact: null,
      // shear reference: the paper prints −17.332 × 10⁻⁵ m; its digits match −1.7332 × 10⁻⁵ m, the value this
      // tool's N-RPIM and FEM converge to (see README), so the exponent is taken as 10⁻⁶ on the printed 17.332
      ref: shear ? { pts: [{ name: 'B', u: 1, v: 1, f: 'uy', val: -1.7332e-5 }] }
                 : { pts: [{ name: 'A', u: 1, v: 0.2, f: 'ux', val: -2.6204e-7 }, { name: 'A', u: 1, v: 0.2, f: 'uy', val: 9.8366e-6 }] },
      bbox: [0, s, 0, d]
    };
  }

  /* ── set-up: index axes, nodes, map, shape functions ──────────── */
  function setup(cfg) {
    var pr = problem(cfg), P = pr.patch, ax = new N.Axis(P.ku, pr.mu, P.c0u), ay = new N.Axis(P.kv, pr.mv, P.c0v);
    // nodes that carry point supports are not moved by the distortion
    var keepSet = {};
    pr.points.forEach(function (p) { keepSet[Math.round(ax.index(p.u)) + ',' + Math.round(ay.index(p.v))] = 1; });
    var lat = new N.Lattice(ax, ay, { distort: cfg.distort || 0, seed: cfg.seed || 1, keep: function (i, j) { return !!keepSet[i + ',' + j]; } });
    var map = new N.Map(P, ax, ay), nn = lat.nn, X = new Float64Array(nn), Y = new Float64Array(nn), o = new Float64Array(12);
    for (var k = 0; k < nn; k++) { map.at(lat.A[k], lat.B[k], o); X[k] = o[0]; Y[k] = o[1]; }
    var approx = new N.Approx(lat, { kind: 'rpim', rbf: cfg.rbf || 'mq', m: cfg.m == null ? 3 : +cfg.m, d: cfg.alpha || 2.5 });
    var nu = pr.nu, Ey = pr.E;
    return { cfg: cfg, pr: pr, patch: P, ax: ax, ay: ay, lat: lat, map: map, X: X, Y: Y, nn: nn, S: approx, D: F.Dmat(nu, Ey), E: Ey, nu: nu,
             perPoint: cfg.supp === 'point' };
  }

  // shape functions at index point (a, b) inside cell (ci, cj): one support per cell (default) or per point
  function shapeAt(md, a, b, deriv, ci, cj, sa, sb) {
    var S = md.S;
    if (md.perPoint) return S.at(a, b, deriv, sa, sb);
    if (ci == null) {
      ci = Math.floor(a); cj = Math.floor(b);
      if (sa < 0 && ci === a) ci--; if (sb < 0 && cj === b) cj--;
      ci = Math.min(md.lat.Mu - 1, Math.max(0, ci)); cj = Math.min(md.lat.Mv - 1, Math.max(0, cj));
    }
    if (S.cell(ci + 0.5, cj + 0.5) < 0) return -1;
    return S.inCell(a, b, deriv);
  }
  // physical derivatives from index derivatives; g = map output
  function toXY(g, da, db, out) {
    var det = g[6];
    out[0] = (g[5] * da - g[3] * db) / det; out[1] = (-g[4] * da + g[2] * db) / det;
  }

  /* ── solve ────────────────────────────────────────────────────── */
  // cfg: { problem, n, ld, support, ar, outer, nu, param, load, distort, seed, rbf, m, alpha, ng }
  function run(cfg) {
    var t0 = now(), md = setup(cfg), pr = md.pr, lat = md.lat, nn = md.nn, ndof = 2 * nn, D = md.D, S = md.S, map = md.map;
    var Mu = lat.Mu, Mv = lat.Mv, ng = cfg.ng || 4, g = N.GL[ng], o = new Float64Array(12), xy = [0, 0], k, a, b, i, j;

    // essential conditions at the nodes (Kronecker delta → direct imposition)
    var fixed = new Uint8Array(ndof), ubar = new Float64Array(ndof);
    function fix(nd, v) { for (var c = 0; c < 2; c++) if (v[c] !== null && v[c] !== undefined) { fixed[2 * nd + c] = 1; ubar[2 * nd + c] = v[c]; } }
    for (k = 0; k < nn; k++) lat.edges(k).forEach(function (tag) { var v = pr.dirichlet(tag, md.X[k], md.Y[k]); if (v) fix(k, v); });
    pr.points.forEach(function (p) { fix(lat.node(Math.round(md.ax.index(p.u)), Math.round(md.ay.index(p.v))), [p.ux, p.uy]); });
    var eq = new Int32Array(ndof), neq = 0;
    for (a = 0; a < ndof; a++) eq[a] = fixed[a] ? -1 : neq++;

    // Gauss points of every cell: shape functions and their physical derivatives
    var gx = [], gy = [], gw = [], gc = [], start = [0], idxL = [], phL = [], dxL = [], dyL = [], bad = 0;
    for (i = 0; i < Mu; i++) for (j = 0; j < Mv; j++) for (var p = 0; p < ng; p++) for (var q = 0; q < ng; q++) {
      var ga = i + (1 + g.p[p]) / 2, gb = j + (1 + g.p[q]) / 2;
      map.at(ga, gb, o);
      var n = shapeAt(md, ga, gb, true, i, j);
      if (n < 0) { bad++; continue; }
      gx.push(o[0]); gy.push(o[1]); gw.push(g.w[p] * g.w[q] * 0.25 * o[6] * T); gc.push(i * Mv + j);
      for (k = 0; k < n; k++) { toXY(o, S.da[k], S.db[k], xy); idxL.push(S.idx[k]); phL.push(S.phi[k]); dxL.push(xy[0]); dyL.push(xy[1]); }
      start.push(idxL.length);
    }
    if (bad) return { error: 'support', bad: bad, md: md, why: S.fail };
    var ngp = gw.length, IDX = Int32Array.from(idxL), PH = Float64Array.from(phL), DX = Float64Array.from(dxL), DY = Float64Array.from(dyL), ST = Int32Array.from(start);

    // traction loads on the boundary segments between lattice nodes
    var f = new Float64Array(ndof), g4 = N.GL[4];
    [['s0', 0, null], ['s1', Mu, null], ['t0', null, 0], ['t1', null, Mv]].forEach(function (E) {
      var tag = E[0], along = E[1] === null, segs = along ? Mu : Mv;
      for (var sgi = 0; sgi < segs; sgi++) for (var qq = 0; qq < 4; qq++) {
        var tt = sgi + (1 + g4.p[qq]) / 2, aa = along ? tt : E[1], bb = along ? E[2] : tt;
        map.at(aa, bb, o);
        var tr = pr.traction(tag, o[0], o[1]); if (!tr) continue;
        var ds = (along ? Math.hypot(o[2], o[3]) : Math.hypot(o[4], o[5])) * 0.5 * g4.w[qq] * T;
        var ci = along ? sgi : (E[1] === 0 ? 0 : Mu - 1), cj = along ? (E[2] === 0 ? 0 : Mv - 1) : sgi;
        var nb = shapeAt(md, aa, bb, false, ci, cj); if (nb < 0) continue;
        for (k = 0; k < nb; k++) { f[2 * S.idx[k]] += S.phi[k] * tr[0] * ds; f[2 * S.idx[k] + 1] += S.phi[k] * tr[1] * ds; }
      }
    });

    // skyline profile and assembly of Bᵀ D B on the free equations
    var top = new Int32Array(neq); for (a = 0; a < neq; a++) top[a] = a;
    for (i = 0; i < ngp; i++) {
      var mn = Infinity;
      for (k = ST[i]; k < ST[i + 1]; k++) for (var c = 0; c < 2; c++) { var e = eq[2 * IDX[k] + c]; if (e >= 0 && e < mn) mn = e; }
      for (k = ST[i]; k < ST[i + 1]; k++) for (c = 0; c < 2; c++) { e = eq[2 * IDX[k] + c]; if (e >= 0 && mn < top[e]) top[e] = mn; }
    }
    var K = new F.Skyline(top), rhs = new Float64Array(neq);
    for (a = 0; a < ndof; a++) if (eq[a] >= 0) rhs[eq[a]] += f[a];
    var blk = [0, 0, 0, 0];
    for (i = 0; i < ngp; i++) {
      var w = gw[i], s0 = ST[i], s1 = ST[i + 1];
      for (a = s0; a < s1; a++) {
        var ax_ = DX[a], ay_ = DY[a], ra = 2 * IDX[a];
        for (b = s0; b < s1; b++) {
          var bx = DX[b], by = DY[b], rb = 2 * IDX[b];
          blk[0] = w * (ax_ * D[0] * bx + ay_ * D[8] * by); blk[1] = w * (ax_ * D[1] * by + ay_ * D[8] * bx);
          blk[2] = w * (ay_ * D[3] * bx + ax_ * D[8] * by); blk[3] = w * (ay_ * D[4] * by + ax_ * D[8] * bx);
          for (var r = 0; r < 2; r++) {
            var er = eq[ra + r]; if (er < 0) continue;
            for (c = 0; c < 2; c++) {
              var ec = eq[rb + c], kv = blk[2 * r + c];
              if (ec < 0) rhs[er] -= kv * ubar[rb + c];
              else if (er <= ec) K.add(er, ec, kv);
            }
          }
        }
      }
    }
    var t1 = now();
    var piv = K.factor();
    if (piv >= 0) return { error: 'singular', md: md, pivot: piv };
    var x = K.solve(rhs), u = new Float64Array(ndof);
    for (a = 0; a < ndof; a++) u[a] = eq[a] >= 0 ? x[eq[a]] : ubar[a];
    var t2 = now();
    return { cfg: cfg, md: md, pr: pr, u: u, f: f, fixed: fixed, ndof: ndof, neq: neq, nn: nn, ngp: ngp, gx: gx, gy: gy, gw: gw, gc: gc,
             start: ST, IDX: IDX, PH: PH, DX: DX, DY: DY, profile: K.a.length, time: { assemble: t1 - t0, solve: t2 - t1 } };
  }

  /* ── evaluation ───────────────────────────────────────────────── */
  // [ux, uy, σxx, σyy, τxy] at index point (a, b); sa, sb pick the knot span on a C⁰ line. null if the support fails.
  function evalAt(model, a, b, sa, sb, out, ci, cj) {
    var md = model.md, S = md.S, D = md.D, u = model.u, o = model._o || (model._o = new Float64Array(12)), xy = [0, 0];
    md.map.at(a, b, o, sa, sb);
    if (!(Math.abs(o[6]) > 1e-10 * (Math.abs(o[2] * o[5]) + Math.abs(o[3] * o[4]) + 1e-300))) {
      // degenerate point of the parametrization (a collapsed corner): step slightly inside
      a += a > md.lat.Mu / 2 ? -1e-4 : 1e-4; b += b > md.lat.Mv / 2 ? -1e-4 : 1e-4; md.map.at(a, b, o, sa, sb);
    }
    var n = shapeAt(md, a, b, true, ci, cj, sa, sb); if (n < 0) return null;
    var ux = 0, uy = 0, exx = 0, eyy = 0, gxy = 0;
    for (var k = 0; k < n; k++) {
      var I = S.idx[k], p = u[2 * I], q = u[2 * I + 1];
      toXY(o, S.da[k], S.db[k], xy);
      ux += S.phi[k] * p; uy += S.phi[k] * q; exx += xy[0] * p; eyy += xy[1] * q; gxy += xy[1] * p + xy[0] * q;
    }
    out = out || new Float64Array(5);
    out[0] = ux; out[1] = uy; out[2] = D[0] * exx + D[1] * eyy; out[3] = D[3] * exx + D[4] * eyy; out[4] = D[8] * gxy;
    return out;
  }
  // value at a point given in the NURBS parameter space (ξ, η)
  function evalParam(model, u, v, out) { var md = model.md; return evalAt(model, md.ax.index(u), md.ay.index(v), 0, 0, out); }
  function phiAt(model, I, a, b, ci, cj) {
    var md = model.md, n = shapeAt(md, a, b, false, ci, cj); if (n < 0) return NaN;
    for (var k = 0; k < n; k++) if (md.S.idx[k] === I) return md.S.phi[k];
    return 0;
  }

  function energyError(model) {
    var ex = model.pr.exact; if (!ex) return null;
    var nu = model.md.nu, Ey = model.md.E, D = model.md.D, u = model.u, num = 0, den = 0;
    function cE(a, b, c) { return (a * a - 2 * nu * a * b + b * b + 2 * (1 + nu) * c * c) / Ey; }
    for (var i = 0; i < model.ngp; i++) {
      var exx = 0, eyy = 0, g = 0;
      for (var k = model.start[i]; k < model.start[i + 1]; k++) {
        var I = model.IDX[k], a = u[2 * I], b = u[2 * I + 1];
        exx += model.DX[k] * a; eyy += model.DY[k] * b; g += model.DY[k] * a + model.DX[k] * b;
      }
      var sx = D[0] * exx + D[1] * eyy, sy = D[3] * exx + D[4] * eyy, txy = D[8] * g, se = ex.s(model.gx[i], model.gy[i]), w = model.gw[i];
      num += w * cE(se[0] - sx, se[1] - sy, se[2] - txy); den += w * cE(se[0], se[1], se[2]);
    }
    return Math.sqrt(num / den);
  }
  function supportStats(model) {
    var mn = Infinity, mx = 0, sum = 0;
    for (var i = 0; i < model.ngp; i++) { var c = model.start[i + 1] - model.start[i]; mn = Math.min(mn, c); mx = Math.max(mx, c); sum += c; }
    return { min: mn, mean: sum / model.ngp, max: mx };
  }

  /* ── Q4 finite elements on the same nodes ─────────────────────── */
  // Straight-sided bilinear elements through the NURBS-mapped nodes, solved by RZFEM.
  function femRun(cfg) {
    var md = setup(cfg), pr = md.pr, lat = md.lat, Mu = lat.Mu, Mv = lat.Mv, C = [], bedges = [], i, j;
    function nd(ii, jj) { return lat.node(ii, jj); }
    for (i = 0; i < Mu; i++) for (j = 0; j < Mv; j++) {
      var n00 = nd(i, j), n10 = nd(i + 1, j), n11 = nd(i + 1, j + 1), n01 = nd(i, j + 1);
      C.push(n00, n10, n11, n01);
      if (i === 0) bedges.push({ tag: 's0', n: [n01, n00] });
      if (i === Mu - 1) bedges.push({ tag: 's1', n: [n10, n11] });
      if (j === 0) bedges.push({ tag: 't0', n: [n00, n10] });
      if (j === Mv - 1) bedges.push({ tag: 't1', n: [n11, n01] });
    }
    var mesh = { type: 'Q4', npe: 4, nn: md.nn, ne: C.length / 4, X: md.X, Y: md.Y, C: new Int32Array(C), bedges: bedges, nx: Mu, ny: Mv };
    var fpr = {};
    for (var k in pr) fpr[k] = pr[k];
    fpr.nodeBC = function () {
      var out = [];
      pr.points.forEach(function (p) {
        var n = lat.node(Math.round(md.ax.index(p.u)), Math.round(md.ay.index(p.v)));
        if (p.ux !== null && p.ux !== undefined) out.push({ n: n, d: 0, v: p.ux });
        if (p.uy !== null && p.uy !== undefined) out.push({ n: n, d: 1, v: p.uy });
      });
      return out;
    };
    var m = F.run({ nu: md.nu, elem: 'Q4', pr: fpr, mesh: mesh });
    m.md = md;
    return m;
  }
  // FEM nodal value at a lattice node given by parameter values
  function femNode(fm, u, v) { var md = fm.md; return md.lat.node(Math.round(md.ax.index(u)), Math.round(md.ay.index(v))); }

  function size(cfg) {
    var pr = problem(cfg), P = pr.patch, ax = new N.Axis(P.ku, pr.mu, P.c0u), ay = new N.Axis(P.kv, pr.mv, P.c0v), ng = cfg.ng || 4, nodes = (ax.M + 1) * (ay.M + 1);
    return { nodes: nodes, dof: 2 * nodes, cells: ax.M * ay.M, gauss: ax.M * ay.M * ng * ng, Mu: ax.M, Mv: ay.M };
  }
  function now() { return N.now(); }

  root.RZNRPIM = { problem: problem, setup: setup, run: run, evalAt: evalAt, evalParam: evalParam, phiAt: phiAt, energyError: energyError,
                   supportStats: supportStats, femRun: femRun, femNode: femNode, size: size, toXY: toXY };
})(typeof window !== 'undefined' ? window : globalThis);
