/* ═══════════════════════════════════════════════════════════════
   2D Element-Free Galerkin (EFG) core — window.RZEFG
   MLS shape functions (linear or quadratic basis, circular supports),
   Gauss quadrature on background cells over the exact geometry,
   essential boundary conditions by penalty or Nitsche's method.
   Reuses the benchmarks, node grids and skyline solver of RZFEM.
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  var F = root.RZFEM, E = F.E, T = F.T;

  var GL = {
    2: { p: [-0.5773502691896257, 0.5773502691896257], w: [1, 1] },
    3: { p: [-0.7745966692414834, 0, 0.7745966692414834], w: [5 / 9, 8 / 9, 5 / 9] },
    4: { p: [-0.8611363115940526, -0.3399810435848563, 0.3399810435848563, 0.8611363115940526],
         w: [0.3478548451374538, 0.6521451548625461, 0.6521451548625461, 0.3478548451374538] },
    5: { p: [-0.9061798459386640, -0.5384693101056831, 0, 0.5384693101056831, 0.9061798459386640],
         w: [0.2369268850561891, 0.4786286704993665, 0.5688888888888889, 0.4786286704993665, 0.2369268850561891] }
  };

  // weight w(r) and dw/dr
  function weight(kind, r, out) {
    if (r >= 1) { out[0] = 0; out[1] = 0; return; }
    if (kind === 'quartic') { out[0] = 1 - 6 * r * r + 8 * r * r * r - 3 * r * r * r * r; out[1] = -12 * r + 24 * r * r - 12 * r * r * r; return; }
    if (r <= 0.5) { out[0] = 2 / 3 - 4 * r * r + 4 * r * r * r; out[1] = -8 * r + 12 * r * r; }
    else { out[0] = 4 / 3 - 4 * r + 4 * r * r - 4 / 3 * r * r * r; out[1] = -4 + 8 * r - 4 * r * r; }
  }

  // Patch test for EFG: rollers on x = 0 and y = 0 (consistent with the exact field), no point constraint
  function dirichletOf(pr, cfg) {
    if (cfg.problem !== 'patch') return pr.dirichlet;
    return function (tag) { return tag === 's0' ? [0, null] : tag === 't0' ? [null, 0] : null; };
  }

  /* ── model set-up: nodes, supports, neighbour buckets ─────────── */
  function setup(cfg) {
    var pr = F.PROBLEMS[cfg.problem](cfg), mesh = F.buildMesh(pr, 'Q4', cfg.distort || 0, cfg.seed || 1);
    var nn = mesh.nn, X = mesh.X, Y = mesh.Y, C = mesh.C, c = new Float64Array(nn), e, a;
    for (e = 0; e < mesh.ne; e++) for (a = 0; a < 4; a++) {
      var i = C[e * 4 + a], j = C[e * 4 + (a + 1) % 4], L = Math.hypot(X[i] - X[j], Y[i] - Y[j]);
      if (L > c[i]) c[i] = L; if (L > c[j]) c[j] = L;
    }
    var d = new Float64Array(nn), dmax = 0, hbar = 0;
    for (i = 0; i < nn; i++) { d[i] = cfg.alpha * c[i]; if (d[i] > dmax) dmax = d[i]; hbar += c[i] / nn; }
    var bb = pr.bbox, x0 = bb[0] - dmax, y0 = bb[2] - dmax, bs = dmax;
    var bx = Math.max(1, Math.ceil((bb[1] - bb[0] + 2 * dmax) / bs)), by = Math.max(1, Math.ceil((bb[3] - bb[2] + 2 * dmax) / bs));
    var heads = new Int32Array(bx * by).fill(-1), next = new Int32Array(nn);
    for (i = 0; i < nn; i++) {
      var ix = Math.min(bx - 1, Math.max(0, Math.floor((X[i] - x0) / bs))), iy = Math.min(by - 1, Math.max(0, Math.floor((Y[i] - y0) / bs)));
      next[i] = heads[iy * bx + ix]; heads[iy * bx + ix] = i;
    }
    var grade = pr.grade;
    function G(s, t) { return pr.map(grade ? Math.pow(Math.max(s, 0), grade) : s, t); }
    return { cfg: cfg, pr: pr, mesh: mesh, nn: nn, X: X, Y: Y, d: d, c: c, hbar: hbar, G: G, dirichlet: dirichletOf(pr, cfg),
             grid: { x0: x0, y0: y0, bs: bs, bx: bx, by: by, heads: heads, next: next },
             m: cfg.basis === 'quad' ? 6 : 3, wkind: cfg.weight || 'cubic', D: F.Dmat(cfg.nu) };
  }

  /* ── MLS shape functions at (x, y) ────────────────────────────── */
  // Returns {n, idx, phi, dx, dy} (views into scratch buffers when deriv), or null if A(x) is singular.
  function Scratch(nmax) {
    return { idx: new Int32Array(nmax), phi: new Float64Array(nmax), dx: new Float64Array(nmax), dy: new Float64Array(nmax),
             w: new Float64Array(nmax), wx: new Float64Array(nmax), wy: new Float64Array(nmax), P: new Float64Array(nmax * 6),
             A: new Float64Array(36), Ax: new Float64Array(36), Ay: new Float64Array(36), L: new Float64Array(36), wr: [0, 0] };
  }
  function basis(m, s, t, out, off) {
    out[off] = 1; out[off + 1] = s; out[off + 2] = t;
    if (m === 6) { out[off + 3] = s * s; out[off + 4] = s * t; out[off + 5] = t * t; }
  }
  function cholesky(A, m, L) {     // A = L Lᵀ; returns false if not positive definite
    var scale = 0, i, j, k;
    for (i = 0; i < m; i++) scale = Math.max(scale, A[i * m + i]);
    for (j = 0; j < m; j++) {
      var s = A[j * m + j];
      for (k = 0; k < j; k++) s -= L[j * m + k] * L[j * m + k];
      if (!(s > 1e-12 * scale)) return false;
      L[j * m + j] = Math.sqrt(s);
      for (i = j + 1; i < m; i++) { var v = A[i * m + j]; for (k = 0; k < j; k++) v -= L[i * m + k] * L[j * m + k]; L[i * m + j] = v / L[j * m + j]; }
    }
    return true;
  }
  function cholSolve(L, m, b) {
    var y = new Float64Array(m), i, k;
    for (i = 0; i < m; i++) { var s = b[i]; for (k = 0; k < i; k++) s -= L[i * m + k] * y[k]; y[i] = s / L[i * m + i]; }
    for (i = m - 1; i >= 0; i--) { var s2 = y[i]; for (k = i + 1; k < m; k++) s2 -= L[k * m + i] * y[k]; y[i] = s2 / L[i * m + i]; }
    return y;
  }
  function shape(md, x, y, S, deriv) {
    var g = md.grid, X = md.X, Y = md.Y, d = md.d, m = md.m, n = 0, i, j, k;
    var ix = Math.floor((x - g.x0) / g.bs), iy = Math.floor((y - g.y0) / g.bs), hloc = 0;
    for (var qy = iy - 1; qy <= iy + 1; qy++) {
      if (qy < 0 || qy >= g.by) continue;
      for (var qx = ix - 1; qx <= ix + 1; qx++) {
        if (qx < 0 || qx >= g.bx) continue;
        for (var I = g.heads[qy * g.bx + qx]; I >= 0; I = g.next[I]) {
          var dx = x - X[I], dy = y - Y[I], dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= d[I]) continue;
          if (n >= S.idx.length) return null;
          weight(md.wkind, dist / d[I], S.wr);
          S.idx[n] = I; S.w[n] = S.wr[0];
          var dwr = S.wr[1] / d[I];
          S.wx[n] = dist > 0 ? dwr * dx / dist : 0; S.wy[n] = dist > 0 ? dwr * dy / dist : 0;
          if (d[I] > hloc) hloc = d[I];
          n++;
        }
      }
    }
    if (n < m) return null;
    var h = hloc / md.cfg.alpha, A = S.A, Ax = S.Ax, Ay = S.Ay, P = S.P;
    A.fill(0); if (deriv) { Ax.fill(0); Ay.fill(0); }
    for (k = 0; k < n; k++) {
      basis(m, (X[S.idx[k]] - x) / h, (Y[S.idx[k]] - y) / h, P, k * 6);
      var w = S.w[k], wx = S.wx[k], wy = S.wy[k];
      for (i = 0; i < m; i++) for (j = 0; j < m; j++) {
        var pp = P[k * 6 + i] * P[k * 6 + j];
        A[i * m + j] += w * pp; if (deriv) { Ax[i * m + j] += wx * pp; Ay[i * m + j] += wy * pp; }
      }
    }
    if (!cholesky(A, m, S.L)) return null;
    var p0 = new Float64Array(m); p0[0] = 1;
    var gam = cholSolve(S.L, m, p0), gx = null, gy = null;
    if (deriv) {
      // γ,x = A⁻¹ (p,x − A,x γ); with the basis centred at the evaluation point p,x = e₂/h, p,y = e₃/h
      var rx = new Float64Array(m), ry = new Float64Array(m);
      rx[1] = 1 / h; ry[2] = 1 / h;
      for (i = 0; i < m; i++) for (j = 0; j < m; j++) { rx[i] -= Ax[i * m + j] * gam[j]; ry[i] -= Ay[i * m + j] * gam[j]; }
      gx = cholSolve(S.L, m, rx); gy = cholSolve(S.L, m, ry);
    }
    for (k = 0; k < n; k++) {
      var gp = 0, gxp = 0, gyp = 0;
      for (i = 0; i < m; i++) { var pv = P[k * 6 + i]; gp += gam[i] * pv; if (deriv) { gxp += gx[i] * pv; gyp += gy[i] * pv; } }
      S.phi[k] = S.w[k] * gp;
      if (deriv) { S.dx[k] = S.wx[k] * gp + S.w[k] * gxp; S.dy[k] = S.wy[k] * gp + S.w[k] * gyp; }
    }
    return n;
  }

  /* ── quadrature points on the exact geometry ──────────────────── */
  function jac(md, s, t) {     // d(x,y)/d(s,t) by central differences of the composite map
    var e = 1e-7, a = md.G(s + e, t), b = md.G(s - e, t), c = md.G(s, t + e), f = md.G(s, t - e);
    return [(a[0] - b[0]) / (2 * e), (a[1] - b[1]) / (2 * e), (c[0] - f[0]) / (2 * e), (c[1] - f[1]) / (2 * e)];
  }
  function cellPoints(md, ng) {
    var mesh = md.mesh, PS = mesh.PS, PT = mesh.PT, C = mesh.C, g = GL[ng], out = [];
    for (var e = 0; e < mesh.ne; e++) {
      var cs = [], ct = [];
      for (var a = 0; a < 4; a++) { cs.push(PS[C[e * 4 + a]]); ct.push(PT[C[e * 4 + a]]); }
      for (var i = 0; i < ng; i++) for (var j = 0; j < ng; j++) {
        var xi = g.p[i], eta = g.p[j];
        var N = [(1 - xi) * (1 - eta) / 4, (1 + xi) * (1 - eta) / 4, (1 + xi) * (1 + eta) / 4, (1 - xi) * (1 + eta) / 4];
        var Nx = [-(1 - eta) / 4, (1 - eta) / 4, (1 + eta) / 4, -(1 + eta) / 4], Ne = [-(1 - xi) / 4, -(1 + xi) / 4, (1 + xi) / 4, (1 - xi) / 4];
        var s = 0, t = 0, sx = 0, sy = 0, tx = 0, ty = 0;
        for (a = 0; a < 4; a++) { s += N[a] * cs[a]; t += N[a] * ct[a]; sx += Nx[a] * cs[a]; sy += Ne[a] * cs[a]; tx += Nx[a] * ct[a]; ty += Ne[a] * ct[a]; }
        var J = jac(md, s, t), xy = md.G(s, t);
        // d(x,y)/d(ξ,η) = d(x,y)/d(s,t) · d(s,t)/d(ξ,η)
        var x_xi = J[0] * sx + J[2] * tx, y_xi = J[1] * sx + J[3] * tx, x_eta = J[0] * sy + J[2] * ty, y_eta = J[1] * sy + J[3] * ty;
        out.push({ x: xy[0], y: xy[1], w: g.w[i] * g.w[j] * Math.abs(x_xi * y_eta - x_eta * y_xi) * T, cell: e });
      }
    }
    return out;
  }
  function edgePoints(md, be, ng) {
    var PS = md.mesh.PS, PT = md.mesh.PT, A = be.n[0], B = be.n[be.n.length - 1], g = GL[ng], out = [];
    var bb = md.pr.bbox, cx = (bb[0] + bb[1]) / 2, cy = (bb[2] + bb[3]) / 2;
    for (var q = 0; q < ng; q++) {
      var f = (1 + g.p[q]) / 2, s = PS[A] + f * (PS[B] - PS[A]), t = PT[A] + f * (PT[B] - PT[A]);
      var J = jac(md, s, t), ds = (PS[B] - PS[A]) / 2, dt = (PT[B] - PT[A]) / 2;
      var tx = J[0] * ds + J[2] * dt, ty = J[1] * ds + J[3] * dt, len = Math.hypot(tx, ty), xy = md.G(s, t);
      var nx = ty / len, ny = -tx / len;
      if (nx * (xy[0] - cx) + ny * (xy[1] - cy) < 0) { nx = -nx; ny = -ny; }
      out.push({ x: xy[0], y: xy[1], w: g.w[q] * len * T, nx: nx, ny: ny });
    }
    return out;
  }

  /* ── solve ────────────────────────────────────────────────────── */
  // cfg: problem fields as RZFEM plus { basis, weight, alpha, bc: 'penalty'|'nitsche', pexp, ng }
  function run(cfg) {
    var t0 = now(), md = setup(cfg), nn = md.nn, ndof = 2 * nn, D = md.D, m = md.m;
    var S = Scratch(256), ng = cfg.ng || 4, i, k, a, b;
    var gps = cellPoints(md, ng), ngp = gps.length;
    // shape functions at every Gauss point, stored compactly
    var start = new Int32Array(ngp + 1), idxL = [], phL = [], dxL = [], dyL = [], bad = 0;
    for (i = 0; i < ngp; i++) {
      var n = shape(md, gps[i].x, gps[i].y, S, true);
      if (n === null) { bad++; start[i + 1] = start[i]; continue; }
      for (k = 0; k < n; k++) { idxL.push(S.idx[k]); phL.push(S.phi[k]); dxL.push(S.dx[k]); dyL.push(S.dy[k]); }
      start[i + 1] = start[i] + n;
    }
    if (bad) return { error: 'singularA', bad: bad, md: md };
    var IDX = Int32Array.from(idxL), PH = Float64Array.from(phL), DX = Float64Array.from(dxL), DY = Float64Array.from(dyL);

    // essential boundary points
    var bpts = [];
    md.mesh.bedges.forEach(function (be) {
      edgePoints(md, be, 4).forEach(function (p) {
        var v = md.dirichlet(be.tag, p.x, p.y); if (!v) return;
        var nb = shape(md, p.x, p.y, S, true); if (nb === null) return;
        p.sx = v[0] !== null && v[0] !== undefined ? 1 : 0; p.sy = v[1] !== null && v[1] !== undefined ? 1 : 0;
        p.ux = p.sx ? v[0] : 0; p.uy = p.sy ? v[1] : 0;
        p.idx = Int32Array.from(S.idx.subarray(0, nb)); p.phi = Float64Array.from(S.phi.subarray(0, nb));
        p.dx = Float64Array.from(S.dx.subarray(0, nb)); p.dy = Float64Array.from(S.dy.subarray(0, nb));
        bpts.push(p);
      });
    });

    // skyline profile over all couplings
    var top = new Int32Array(ndof); for (a = 0; a < ndof; a++) top[a] = a;
    function profile(idx, s0, s1) {
      var mn = Infinity; for (k = s0; k < s1; k++) if (2 * idx[k] < mn) mn = 2 * idx[k];
      for (k = s0; k < s1; k++) { var q = 2 * idx[k]; if (mn < top[q]) top[q] = mn; if (mn < top[q + 1]) top[q + 1] = mn; }
    }
    for (i = 0; i < ngp; i++) profile(IDX, start[i], start[i + 1]);
    bpts.forEach(function (p) { profile(p.idx, 0, p.idx.length); });
    var K = new F.Skyline(top), f = new Float64Array(ndof);
    function add(r, c, v) { if (r <= c) K.add(r, c, v); }

    // domain integral: Bᵀ D B
    for (i = 0; i < ngp; i++) {
      var wq = gps[i].w, s0 = start[i], s1 = start[i + 1];
      for (a = s0; a < s1; a++) {
        var ax = DX[a], ay = DY[a], ra = 2 * IDX[a];
        for (b = s0; b < s1; b++) {
          var rb = 2 * IDX[b]; if (rb < ra) continue;
          var bx = DX[b], by = DY[b];
          // block (row = a, col = b): B_aᵀ D B_b
          add(ra, rb, wq * (ax * (D[0] * bx) + ay * (D[8] * by)));
          add(ra, rb + 1, wq * (ax * (D[1] * by) + ay * (D[8] * bx)));
          add(ra + 1, rb, wq * (ay * (D[3] * bx) + ax * (D[8] * by)));
          add(ra + 1, rb + 1, wq * (ay * (D[4] * by) + ax * (D[8] * bx)));
        }
      }
    }
    // traction loads on 's1'
    md.mesh.bedges.forEach(function (be) {
      if (be.tag !== 's1') return;
      edgePoints(md, be, 4).forEach(function (p) {
        var tr = md.pr.traction('s1', p.x, p.y); if (!tr) return;
        var nb = shape(md, p.x, p.y, S, false); if (nb === null) return;
        for (k = 0; k < nb; k++) { f[2 * S.idx[k]] += p.w * S.phi[k] * tr[0]; f[2 * S.idx[k] + 1] += p.w * S.phi[k] * tr[1]; }
      });
    });
    // essential boundary conditions
    var beta = cfg.bc === 'penalty' ? Math.pow(10, cfg.pexp == null ? 4 : cfg.pexp) * E / md.hbar : (cfg.kappa || 100) * E / md.hbar;
    bpts.forEach(function (p) {
      var w = p.w, nx = p.nx, ny = p.ny, nb = p.idx.length, I, J;
      var tr = [];                // traction operator t_I (2×2) for Nitsche
      if (cfg.bc !== 'penalty') for (I = 0; I < nb; I++) {
        var px = p.dx[I], py = p.dy[I];
        tr.push([nx * D[0] * px + ny * D[8] * py, nx * D[1] * py + ny * D[8] * px, ny * D[3] * px + nx * D[8] * py, ny * D[4] * py + nx * D[8] * px]);
      }
      var sx = p.sx, sy = p.sy;
      for (I = 0; I < nb; I++) {
        var rI = 2 * p.idx[I], fI = p.phi[I];
        f[rI] += w * beta * fI * sx * p.ux; f[rI + 1] += w * beta * fI * sy * p.uy;
        if (cfg.bc !== 'penalty') {   // −t_Iᵀ S ū
          var tI = tr[I];
          f[rI] -= w * (tI[0] * sx * p.ux + tI[2] * sy * p.uy);
          f[rI + 1] -= w * (tI[1] * sx * p.ux + tI[3] * sy * p.uy);
        }
        for (J = 0; J < nb; J++) {
          var rJ = 2 * p.idx[J]; if (rJ < rI) continue;
          var fJ = p.phi[J], pen = w * beta * fI * fJ;
          var k00 = pen * sx, k11 = pen * sy, k01 = 0, k10 = 0;
          if (cfg.bc !== 'penalty') {
            // −φ_I S t_J − t_Iᵀ S φ_J
            var tJ = tr[J], tI2 = tr[I];
            k00 -= w * (fI * sx * tJ[0] + tI2[0] * sx * fJ);
            k01 -= w * (fI * sx * tJ[1] + tI2[2] * sy * fJ);
            k10 -= w * (fI * sy * tJ[2] + tI2[1] * sx * fJ);
            k11 -= w * (fI * sy * tJ[3] + tI2[3] * sy * fJ);
          }
          add(rI, rJ, k00); add(rI, rJ + 1, k01); add(rI + 1, rJ, k10); add(rI + 1, rJ + 1, k11);
        }
      }
    });
    var t1 = now();
    var piv = K.factor();
    if (piv >= 0) return { error: 'singular', md: md, pivot: piv };
    var u = K.solve(f), t2 = now();
    var model = { cfg: cfg, md: md, pr: md.pr, mesh: md.mesh, u: u, gps: gps, start: start, IDX: IDX, PH: PH, DX: DX, DY: DY, bpts: bpts,
                  ndof: ndof, nn: nn, ngp: ngp, beta: beta, profile: K.a.length, S: S, time: { assemble: t1 - t0, solve: t2 - t1 } };
    return model;
  }

  /* ── evaluation ───────────────────────────────────────────────── */
  // u (2) and σ (3) of the EFG solution at (x, y); null outside the reach of the nodes
  function evalAt(model, x, y, out) {
    var S = model.S, n = shape(model.md, x, y, S, true); if (n === null) return null;
    var u = model.u, D = model.md.D, ux = 0, uy = 0, ex = 0, ey = 0, g = 0;
    for (var k = 0; k < n; k++) {
      var I = S.idx[k], a = u[2 * I], b = u[2 * I + 1];
      ux += S.phi[k] * a; uy += S.phi[k] * b; ex += S.dx[k] * a; ey += S.dy[k] * b; g += S.dy[k] * a + S.dx[k] * b;
    }
    out = out || new Float64Array(5);
    out[0] = ux; out[1] = uy; out[2] = D[0] * ex + D[1] * ey; out[3] = D[3] * ex + D[4] * ey; out[4] = D[8] * g;
    return out;
  }
  // value of shape function φ_I at (x, y)
  function phiAt(model, I, x, y) {
    var S = model.S, n = shape(model.md, x, y, S, false); if (n === null) return NaN;
    for (var k = 0; k < n; k++) if (S.idx[k] === I) return S.phi[k];
    return 0;
  }
  function energyError(model) {
    var ex = model.pr.exact; if (!ex) return null;
    var nu = model.cfg.nu, D = model.md.D, num = 0, den = 0, u = model.u;
    function cE(a, b, c) { return (a * a - 2 * nu * a * b + b * b + 2 * (1 + nu) * c * c) / E; }
    for (var i = 0; i < model.ngp; i++) {
      var exx = 0, eyy = 0, g = 0;
      for (var k = model.start[i]; k < model.start[i + 1]; k++) {
        var I = model.IDX[k], a = u[2 * I], b = u[2 * I + 1];
        exx += model.DX[k] * a; eyy += model.DY[k] * b; g += model.DY[k] * a + model.DX[k] * b;
      }
      var sx = D[0] * exx + D[1] * eyy, sy = D[3] * exx + D[4] * eyy, txy = D[8] * g, p = model.gps[i], se = ex.s(p.x, p.y);
      num += p.w * cE(se[0] - sx, se[1] - sy, se[2] - txy); den += p.w * cE(se[0], se[1], se[2]);
    }
    return Math.sqrt(num / den);
  }
  // largest violation of the essential boundary conditions, relative to max |u| on that boundary
  function bcError(model) {
    var u = model.u, worst = 0, ref = 0;
    model.bpts.forEach(function (p) {
      var ux = 0, uy = 0;
      for (var k = 0; k < p.idx.length; k++) { ux += p.phi[k] * u[2 * p.idx[k]]; uy += p.phi[k] * u[2 * p.idx[k] + 1]; }
      if (p.sx) { worst = Math.max(worst, Math.abs(ux - p.ux)); ref = Math.max(ref, Math.abs(p.ux)); }
      if (p.sy) { worst = Math.max(worst, Math.abs(uy - p.uy)); ref = Math.max(ref, Math.abs(p.uy)); }
    });
    return { abs: worst, ref: ref };
  }
  // number of nodes in the support of each Gauss point (min, mean, max)
  function supportStats(model) {
    var mn = Infinity, mx = 0, sum = 0;
    for (var i = 0; i < model.ngp; i++) { var c = model.start[i + 1] - model.start[i]; mn = Math.min(mn, c); mx = Math.max(mx, c); sum += c; }
    return { min: mn, mean: sum / model.ngp, max: mx };
  }

  function size(cfg) {
    var pr = F.PROBLEMS[cfg.problem](cfg), ng = cfg.ng || 4, nodes = (pr.nx + 1) * (pr.ny + 1);
    return { nodes: nodes, dof: 2 * nodes, cells: pr.nx * pr.ny, gauss: pr.nx * pr.ny * ng * ng, nx: pr.nx, ny: pr.ny };
  }
  function now() { return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now(); }

  root.RZEFG = { run: run, setup: setup, shape: shape, Scratch: Scratch, evalAt: evalAt, phiAt: phiAt, energyError: energyError,
                 bcError: bcError, supportStats: supportStats, size: size, weight: weight };
})(typeof window !== 'undefined' ? window : globalThis);
