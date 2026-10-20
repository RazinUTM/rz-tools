/* ═══════════════════════════════════════════════════════════════
   2D plane stress FEM core — window.RZFEM
   Elements: T3 (CST), Q4 (bilinear), QM6 (Q4 + incompatible modes,
   Taylor–Beresford–Wilson with the patch-test correction), Q8 (serendipity).
   Structured mapped meshes; skyline LDLᵀ solver on free equations;
   Gauss-point stresses extrapolated to nodes, raw (per element) and averaged.
   Units: SI internally (m, N, Pa); the UI converts to mm and MPa.
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var E = 200e9, T = 0.01;            // Young's modulus (Pa) and thickness (m), fixed
  var R3 = Math.sqrt(3);

  /* ── quadrature ─────────────────────────────────────────────── */
  var GL = {
    1: { p: [0], w: [2] },
    2: { p: [-1 / R3, 1 / R3], w: [1, 1] },
    3: { p: [-Math.sqrt(0.6), 0, Math.sqrt(0.6)], w: [5 / 9, 8 / 9, 5 / 9] },
    4: { p: [-0.8611363115940526, -0.3399810435848563, 0.3399810435848563, 0.8611363115940526],
         w: [0.3478548451374538, 0.6521451548625461, 0.6521451548625461, 0.3478548451374538] }
  };
  // 7-point degree-5 rule on the triangle (area coordinates, weights sum to 1)
  var TRI7 = (function () {
    var a1 = 0.0597158717897698, b1 = 0.4701420641051151, w1 = 0.1323941527885062,
        a2 = 0.7974269853530873, b2 = 0.1012865073234563, w2 = 0.1259391805448271;
    return [[1 / 3, 1 / 3, 0.225], [a1, b1, w1], [b1, a1, w1], [b1, b1, w1], [a2, b2, w2], [b2, a2, w2], [b2, b2, w2]];
  })();

  function Dmat(nu, Ey) {
    var c = (Ey || E) / (1 - nu * nu);
    return [c, c * nu, 0, c * nu, c, 0, 0, 0, c * (1 - nu) / 2];
  }

  /* ── shape functions in natural coordinates ─────────────────── */
  var Q4C = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  var Q8C = [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [1, 0], [0, 1], [-1, 0]];
  function shapeQ4(xi, eta, N, Nx, Ne) {
    for (var a = 0; a < 4; a++) {
      var xa = Q4C[a][0], ea = Q4C[a][1];
      N[a] = 0.25 * (1 + xi * xa) * (1 + eta * ea);
      Nx[a] = 0.25 * xa * (1 + eta * ea);
      Ne[a] = 0.25 * ea * (1 + xi * xa);
    }
  }
  function shapeQ8(xi, eta, N, Nx, Ne) {
    for (var a = 0; a < 4; a++) {
      var xa = Q8C[a][0], ea = Q8C[a][1];
      N[a] = 0.25 * (1 + xi * xa) * (1 + eta * ea) * (xi * xa + eta * ea - 1);
      Nx[a] = 0.25 * xa * (1 + eta * ea) * (2 * xi * xa + eta * ea);
      Ne[a] = 0.25 * ea * (1 + xi * xa) * (xi * xa + 2 * eta * ea);
    }
    // midside nodes: 4 (eta=-1), 5 (xi=1), 6 (eta=1), 7 (xi=-1)
    N[4] = 0.5 * (1 - xi * xi) * (1 - eta); Nx[4] = -xi * (1 - eta); Ne[4] = -0.5 * (1 - xi * xi);
    N[5] = 0.5 * (1 + xi) * (1 - eta * eta); Nx[5] = 0.5 * (1 - eta * eta); Ne[5] = -eta * (1 + xi);
    N[6] = 0.5 * (1 - xi * xi) * (1 + eta); Nx[6] = -xi * (1 + eta); Ne[6] = 0.5 * (1 - xi * xi);
    N[7] = 0.5 * (1 - xi) * (1 - eta * eta); Nx[7] = -0.5 * (1 - eta * eta); Ne[7] = -eta * (1 - xi);
  }
  function shapeT3(xi, eta, N, Nx, Ne) {   // xi, eta = area coordinates L2, L3
    N[0] = 1 - xi - eta; N[1] = xi; N[2] = eta;
    Nx[0] = -1; Nx[1] = 1; Nx[2] = 0; Ne[0] = -1; Ne[1] = 0; Ne[2] = 1;
  }
  var SHAPE = { T3: shapeT3, Q4: shapeQ4, QM6: shapeQ4, Q8: shapeQ8 };
  var NPE = { T3: 3, Q4: 4, QM6: 4, Q8: 8 };

  /* ── benchmark problems ─────────────────────────────────────── */
  function cantilever(p) {
    var L = 2, D = L / p.ld, P = 20e3, I = T * D * D * D / 12, nu = p.nu, EI = E * I;
    var exactOn = p.support !== 'clamped';
    function u(x, y) {
      return [P * y / (6 * EI) * ((6 * L - 3 * x) * x + (2 + nu) * (y * y - D * D / 4)),
             -P / (6 * EI) * (3 * nu * y * y * (L - x) + (4 + 5 * nu) * D * D * x / 4 + (3 * L - x) * x * x)];
    }
    function s(x, y) { return [P * (L - x) * y / I, 0, -P / (2 * I) * (D * D / 4 - y * y)]; }
    var ny = Math.max(1, p.n), nx = Math.max(1, Math.round(p.n * p.ld));
    return {
      key: 'cantilever', L: L, D: D, P: P, I: I, nx: nx, ny: ny, grade: null,
      map: function (sx, ty) { return [sx * L, (ty - 0.5) * D]; },
      dirichlet: function (tag, x, y) {          // returns [ux|null, uy|null]
        if (tag !== 's0') return null;
        if (!exactOn) return [0, 0];
        return u(x, y);
      },
      traction: function (tag, x, y) { return tag === 's1' ? [0, -P / (2 * I) * (D * D / 4 - y * y)] : null; },
      exact: exactOn ? { u: u, s: s } : null,
      timo: { u: u, s: s },
      ref: { tip: u(L, 0)[1], beam: -P * L * L * L / (3 * EI) },
      bbox: [0, L, -D / 2, D / 2]
    };
  }

  function hole(p) {
    var b = 1, a = p.ar * b, s0 = 100e6, nu = p.nu, mu = E / (2 * (1 + nu)), ka = (3 - nu) / (1 + nu);
    var kirsch = p.outer !== 'uniform';
    function s(x, y) {
      var r2 = x * x + y * y, th = Math.atan2(y, x), q = a * a / r2, q2 = q * q;
      var c2 = Math.cos(2 * th), c4 = Math.cos(4 * th), s2 = Math.sin(2 * th), s4 = Math.sin(4 * th);
      return [s0 * (1 - q * (1.5 * c2 + c4) + 1.5 * q2 * c4), s0 * (-q * (0.5 * c2 - c4) - 1.5 * q2 * c4), s0 * (-q * (0.5 * s2 + s4) + 1.5 * q2 * s4)];
    }
    function u(x, y) {
      var r = Math.sqrt(x * x + y * y), th = Math.atan2(y, x), c = s0 * a / (8 * mu);
      return [c * (r / a * (ka + 1) * Math.cos(th) + 2 * a / r * ((1 + ka) * Math.cos(th) + Math.cos(3 * th)) - 2 * a * a * a / (r * r * r) * Math.cos(3 * th)),
              c * (r / a * (ka - 3) * Math.sin(th) + 2 * a / r * ((1 - ka) * Math.sin(th) + Math.sin(3 * th)) - 2 * a * a * a / (r * r * r) * Math.sin(3 * th))];
    }
    var nr = Math.max(1, p.n), nt = 2 * Math.max(1, p.n);
    return {
      key: 'hole', a: a, b: b, s0: s0, nx: nr, ny: nt, grade: 1.6,
      // s: radial (hole → outer edge), t: angle 0 → 90°; rays from the centre meet the outer square
      map: function (sr, tt) {
        var th = tt * Math.PI / 2, ax = a * Math.cos(th), ay = a * Math.sin(th), bx, by;
        if (th <= Math.PI / 4) { bx = b; by = b * Math.tan(th); } else { bx = b / Math.tan(th); by = b; }
        if (tt >= 1) bx = 0;
        return [ax + sr * (bx - ax), ay + sr * (by - ay)];
      },
      dirichlet: function (tag) { return tag === 't0' ? [null, 0] : tag === 't1' ? [0, null] : null; },
      traction: function (tag, x, y) {
        if (tag !== 's1') return null;
        var onRight = Math.abs(x - b) < 1e-9 * b, nx = onRight ? 1 : 0, ny = onRight ? 0 : 1;
        if (!kirsch) return onRight ? [s0, 0] : [0, 0];
        var st = s(x, y);
        return [st[0] * nx + st[2] * ny, st[2] * nx + st[1] * ny];
      },
      exact: kirsch ? { u: u, s: s } : null,
      kirschS: s,
      ref: { scf: 3 },
      bbox: [0, b, 0, b]
    };
  }

  function patch(p) {
    var s0 = 100e6, nu = p.nu;
    function u(x, y) { return [s0 * x / E, -nu * s0 * y / E]; }
    function s() { return [s0, 0, 0]; }
    var n = Math.max(1, p.n);
    return {
      key: 'patch', s0: s0, nx: n, ny: n, grade: null,
      map: function (sx, ty) { return [sx, ty]; },
      dirichlet: function (tag, x, y) {
        if (tag === 's0') return [0, (Math.abs(y) < 1e-12) ? 0 : null];
        return null;
      },
      traction: function (tag) { return tag === 's1' ? [s0, 0] : null; },
      exact: { u: u, s: s },
      ref: {},
      bbox: [0, 1, 0, 1]
    };
  }
  var PROBLEMS = { cantilever: cantilever, hole: hole, patch: patch };

  /* ── deterministic random numbers ───────────────────────────── */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ── structured mapped mesh ─────────────────────────────────── */
  // Corner grid (nx+1)×(ny+1) in parametric (s,t) ∈ [0,1]², interior corners perturbed by ±d·Δ.
  // Q8 uses a half-index grid (2nx+1)×(2ny+1) without cell centres; midside nodes sit at the
  // parametric midpoint of their edge, so curved boundaries (the hole) stay exact at those nodes.
  function buildMesh(pr, type, distort, seed) {
    var nx = pr.nx, ny = pr.ny, quad8 = type === 'Q8', st = quad8 ? 2 : 1;
    var I = st * nx + 1, J = st * ny + 1, rnd = mulberry32(seed || 1), i, j;
    var cs = new Float64Array((nx + 1) * (ny + 1)), ct = new Float64Array((nx + 1) * (ny + 1));
    for (i = 0; i <= nx; i++) for (j = 0; j <= ny; j++) {
      var k = i * (ny + 1) + j, s = i / nx, t = j / ny;
      if (distort > 0 && i > 0 && i < nx && j > 0 && j < ny) {
        s += (2 * rnd() - 1) * distort / nx; t += (2 * rnd() - 1) * distort / ny;
      }
      cs[k] = s; ct[k] = t;
    }
    function param(hi, hj) {          // parametric coords of a half-index node
      if (!quad8) return [cs[hi * (ny + 1) + hj], ct[hi * (ny + 1) + hj]];
      var i0 = hi >> 1, j0 = hj >> 1, i1 = (hi + 1) >> 1, j1 = (hj + 1) >> 1;
      var a = i0 * (ny + 1) + j0, b = i1 * (ny + 1) + j1;
      return [(cs[a] + cs[b]) / 2, (ct[a] + ct[b]) / 2];
    }
    // node numbering: fastest along the shorter direction keeps the skyline narrow
    var id = new Int32Array(I * J).fill(-1), nn = 0, jFast = J <= I;
    function exists(hi, hj) { return !(quad8 && (hi & 1) && (hj & 1)); }
    if (jFast) { for (i = 0; i < I; i++) for (j = 0; j < J; j++) if (exists(i, j)) id[i * J + j] = nn++; }
    else { for (j = 0; j < J; j++) for (i = 0; i < I; i++) if (exists(i, j)) id[i * J + j] = nn++; }
    var X = new Float64Array(nn), Y = new Float64Array(nn), PS = new Float64Array(nn), PT = new Float64Array(nn), tagS = new Int8Array(nn), tagT = new Int8Array(nn);
    for (i = 0; i < I; i++) for (j = 0; j < J; j++) {
      var n = id[i * J + j]; if (n < 0) continue;
      var pq = param(i, j), sg = pr.grade ? Math.pow(pq[0], pr.grade) : pq[0], xy = pr.map(sg, pq[1]);
      X[n] = xy[0]; Y[n] = xy[1]; PS[n] = pq[0]; PT[n] = pq[1];
      tagS[n] = i === 0 ? 1 : i === I - 1 ? 2 : 0;
      tagT[n] = j === 0 ? 1 : j === J - 1 ? 2 : 0;
    }
    function N(hi, hj) { return id[hi * J + hj]; }
    var npe = NPE[type], conn = [], bedges = [];
    for (i = 0; i < nx; i++) for (j = 0; j < ny; j++) {
      var a = st * i, b = st * j;
      var n00 = N(a, b), n10 = N(a + st, b), n11 = N(a + st, b + st), n01 = N(a, b + st);
      if (type === 'T3') {
        if ((i + j) % 2 === 0) { conn.push(n00, n10, n11, n00, n11, n01); }
        else { conn.push(n00, n10, n01, n10, n11, n01); }
      } else if (quad8) {
        conn.push(n00, n10, n11, n01, N(a + 1, b), N(a + 2, b + 1), N(a + 1, b + 2), N(a, b + 1));
      } else conn.push(n00, n10, n11, n01);
      // boundary edges, oriented counter-clockwise around the domain
      var mid = quad8;
      if (i === 0) bedges.push({ tag: 's0', n: mid ? [n01, N(a, b + 1), n00] : [n01, n00] });
      if (i === nx - 1) bedges.push({ tag: 's1', n: mid ? [n10, N(a + 2, b + 1), n11] : [n10, n11] });
      if (j === 0) bedges.push({ tag: 't0', n: mid ? [n00, N(a + 1, b), n10] : [n00, n10] });
      if (j === ny - 1) bedges.push({ tag: 't1', n: mid ? [n11, N(a + 1, b + 2), n01] : [n11, n01] });
    }
    var C = new Int32Array(conn);
    return { type: type, npe: npe, nn: nn, ne: C.length / npe, X: X, Y: Y, PS: PS, PT: PT, C: C, bedges: bedges, tagS: tagS, tagT: tagT, nx: nx, ny: ny };
  }

  /* ── element routines ───────────────────────────────────────── */
  // Jacobian-based derivatives at (xi, eta). Returns detJ; fills dNdx, dNdy.
  function derivs(type, ex, ey, xi, eta, N, Nx, Ne, dNdx, dNdy) {
    SHAPE[type](xi, eta, N, Nx, Ne);
    var n = NPE[type], j11 = 0, j12 = 0, j21 = 0, j22 = 0, a;
    for (a = 0; a < n; a++) { j11 += Nx[a] * ex[a]; j12 += Nx[a] * ey[a]; j21 += Ne[a] * ex[a]; j22 += Ne[a] * ey[a]; }
    var det = j11 * j22 - j12 * j21;
    for (a = 0; a < n; a++) { dNdx[a] = (j22 * Nx[a] - j12 * Ne[a]) / det; dNdy[a] = (-j21 * Nx[a] + j11 * Ne[a]) / det; }
    return det;
  }

  function Ctx(type) {      // scratch arrays per element type
    var n = NPE[type];
    return { N: new Float64Array(n), Nx: new Float64Array(n), Ne: new Float64Array(n), dx: new Float64Array(n), dy: new Float64Array(n),
             ex: new Float64Array(n), ey: new Float64Array(n) };
  }

  // Integration points in natural coordinates: [xi, eta, weight]
  function stiffPoints(type) {
    if (type === 'T3') return [[1 / 3, 1 / 3, 0.5]];
    var g = type === 'Q8' ? GL[3] : GL[2], out = [];
    for (var i = 0; i < g.p.length; i++) for (var j = 0; j < g.p.length; j++) out.push([g.p[i], g.p[j], g.w[i] * g.w[j]]);
    return out;
  }
  function errorPoints(type) {
    if (type === 'T3') return TRI7.map(function (q) { return [q[0], q[1], 0.5 * q[2]]; });
    var g = GL[4], out = [];
    for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) out.push([g.p[i], g.p[j], g.w[i] * g.w[j]]);
    return out;
  }

  // Incompatible-mode derivative matrix for QM6 at (xi, eta): 2×2 [dP1/dx dP2/dx; dP1/dy dP2/dy]
  function qm6Inc(ex, ey, xi, eta, det, ctx0) {
    var j0 = ctx0;   // {i11,i12,i21,i22,det0} inverse of J0
    var s = j0.det0 / det, p1x = -2 * xi, p2e = -2 * eta;   // dP1/dξ, dP2/dη
    return [s * (j0.i11 * p1x), s * (j0.i12 * p2e), s * (j0.i21 * p1x), s * (j0.i22 * p2e)];
  }
  function j0inv(ex, ey) {
    var Nx = [-0.25, 0.25, 0.25, -0.25], Ne = [-0.25, -0.25, 0.25, 0.25], j11 = 0, j12 = 0, j21 = 0, j22 = 0;
    for (var a = 0; a < 4; a++) { j11 += Nx[a] * ex[a]; j12 += Nx[a] * ey[a]; j21 += Ne[a] * ex[a]; j22 += Ne[a] * ey[a]; }
    var d = j11 * j22 - j12 * j21;
    // [dP/dx; dP/dy] = J⁻¹ [dP/dξ; dP/dη],  J⁻¹ = [j22 −j12; −j21 j11]/d
    return { i11: j22 / d, i12: -j12 / d, i21: -j21 / d, i22: j11 / d, det0: d };
  }

  // Element stiffness (2n×2n, row-major). For QM6 also returns R = Kii⁻¹ Kic (4×8) for recovering α = −R uₑ.
  function elemK(type, ex, ey, D, ctx) {
    var n = NPE[type], m = 2 * n, K = new Float64Array(m * m), pts = stiffPoints(type), q, a, b;
    var qm6 = type === 'QM6', Kci, Kii, j0;
    if (qm6) { Kci = new Float64Array(8 * 4); Kii = new Float64Array(16); j0 = j0inv(ex, ey); }
    for (q = 0; q < pts.length; q++) {
      var det = derivs(type, ex, ey, pts[q][0], pts[q][1], ctx.N, ctx.Nx, ctx.Ne, ctx.dx, ctx.dy);
      if (!(det > 0)) return null;
      var wd = pts[q][2] * det * T, dx = ctx.dx, dy = ctx.dy, Bi = null;
      if (qm6) {
        var G = qm6Inc(ex, ey, pts[q][0], pts[q][1], det, j0);   // P1x, P2x, P1y, P2y
        // incompatible columns: α0: ux·P1, α1: ux·P2, α2: uy·P1, α3: uy·P2
        Bi = [[G[0], 0, G[2]], [G[1], 0, G[3]], [0, G[2], G[0]], [0, G[3], G[1]]];
        for (var c1 = 0; c1 < 4; c1++) for (var c2 = 0; c2 < 4; c2++) {
          var u1 = Bi[c1], u2 = Bi[c2];
          var Du2 = [D[0] * u2[0] + D[1] * u2[1], D[3] * u2[0] + D[4] * u2[1], D[8] * u2[2]];
          Kii[c1 * 4 + c2] += wd * (u1[0] * Du2[0] + u1[1] * Du2[1] + u1[2] * Du2[2]);
        }
      }
      for (a = 0; a < n; a++) {
        // D·B_a columns (3×2)
        var ax = dx[a], ay = dy[a];
        var d00 = D[0] * ax, d01 = D[1] * ay, d10 = D[3] * ax, d11 = D[4] * ay, g0 = D[8] * ay, g1 = D[8] * ax;
        for (b = a; b < n; b++) {
          var bx = dx[b], by = dy[b];
          // B_bᵀ D B_a : rows of B_b = [bx 0; 0 by; by bx]
          var kxx = bx * d00 + by * g0, kxy = bx * d01 + by * g1, kyx = by * d10 + bx * g0, kyy = by * d11 + bx * g1;
          K[(2 * b) * m + 2 * a] += wd * kxx; K[(2 * b) * m + 2 * a + 1] += wd * kxy;
          K[(2 * b + 1) * m + 2 * a] += wd * kyx; K[(2 * b + 1) * m + 2 * a + 1] += wd * kyy;
        }
        if (qm6) {
          var DBa = [[d00, d01], [d10, d11], [g0, g1]];   // D·B_a (3×2)
          for (var c = 0; c < 4; c++) for (var r = 0; r < 2; r++)
            Kci[(2 * a + r) * 4 + c] += wd * (Bi[c][0] * DBa[0][r] + Bi[c][1] * DBa[1][r] + Bi[c][2] * DBa[2][r]);
        }
      }
    }
    for (a = 0; a < m; a++) for (b = a + 1; b < m; b++) K[a * m + b] = K[b * m + a];
    if (!qm6) return { K: K };
    // static condensation: K ← Kcc − Kci Kii⁻¹ Kic
    var inv = invDense(Kii, 4); if (!inv) return null;
    var R = new Float64Array(4 * 8);
    for (var c3 = 0; c3 < 4; c3++) for (var d3 = 0; d3 < 8; d3++) { var sum = 0; for (var e3 = 0; e3 < 4; e3++) sum += inv[c3 * 4 + e3] * Kci[d3 * 4 + e3]; R[c3 * 8 + d3] = sum; }
    for (a = 0; a < 8; a++) for (b = 0; b < 8; b++) { var s2 = 0; for (var c4 = 0; c4 < 4; c4++) s2 += Kci[a * 4 + c4] * R[c4 * 8 + b]; K[a * 8 + b] -= s2; }
    return { K: K, R: R };
  }

  function invDense(A, n) {
    var M = new Float64Array(n * 2 * n), i, j, k;
    for (i = 0; i < n; i++) { for (j = 0; j < n; j++) M[i * 2 * n + j] = A[i * n + j]; M[i * 2 * n + n + i] = 1; }
    for (k = 0; k < n; k++) {
      var p = k; for (i = k + 1; i < n; i++) if (Math.abs(M[i * 2 * n + k]) > Math.abs(M[p * 2 * n + k])) p = i;
      if (Math.abs(M[p * 2 * n + k]) < 1e-300) return null;
      if (p !== k) for (j = 0; j < 2 * n; j++) { var t = M[k * 2 * n + j]; M[k * 2 * n + j] = M[p * 2 * n + j]; M[p * 2 * n + j] = t; }
      var f = M[k * 2 * n + k]; for (j = 0; j < 2 * n; j++) M[k * 2 * n + j] /= f;
      for (i = 0; i < n; i++) if (i !== k) { var g = M[i * 2 * n + k]; if (g) for (j = 0; j < 2 * n; j++) M[i * 2 * n + j] -= g * M[k * 2 * n + j]; }
    }
    var B = new Float64Array(n * n); for (i = 0; i < n; i++) for (j = 0; j < n; j++) B[i * n + j] = M[i * 2 * n + n + j];
    return B;
  }

  /* ── skyline LDLᵀ ───────────────────────────────────────────── */
  function Skyline(top) {
    var n = top.length, start = new Int32Array(n + 1);
    for (var j = 0; j < n; j++) start[j + 1] = start[j] + (j - top[j] + 1);
    this.n = n; this.top = top; this.start = start; this.a = new Float64Array(start[n]);
  }
  Skyline.prototype.add = function (i, j, v) {     // i ≤ j
    this.a[this.start[j] + (i - this.top[j])] += v;
  };
  Skyline.prototype.factor = function () {        // returns index of failed pivot or −1
    var n = this.n, a = this.a, top = this.top, st = this.start, j, i, r, maxd = 0;
    for (j = 0; j < n; j++) maxd = Math.max(maxd, Math.abs(a[st[j] + (j - top[j])]));
    for (j = 0; j < n; j++) {
      var tj = top[j], cj = st[j] - tj;            // a[cj + row] = entry (row, j)
      for (i = tj + 1; i < j; i++) {
        var ti = top[i], ci = st[i] - ti, m = ti > tj ? ti : tj, s = 0;
        for (r = m; r < i; r++) s += a[ci + r] * a[cj + r];
        a[cj + i] -= s;
      }
      var dj = a[cj + j];
      for (i = tj; i < j; i++) {
        var g = a[cj + i], di = a[st[i] + (i - top[i])], l = g / di;
        a[cj + i] = l; dj -= l * g;
      }
      if (!(dj > 1e-12 * maxd)) return j;
      a[cj + j] = dj;
    }
    return -1;
  };
  Skyline.prototype.solve = function (f) {
    var n = this.n, a = this.a, top = this.top, st = this.start, j, i, x = Float64Array.from(f);
    for (j = 0; j < n; j++) { var cj = st[j] - top[j], s = 0; for (i = top[j]; i < j; i++) s += a[cj + i] * x[i]; x[j] -= s; }
    for (j = 0; j < n; j++) x[j] /= a[st[j] + (j - top[j])];
    for (j = n - 1; j >= 0; j--) { var c2 = st[j] - top[j], xj = x[j]; for (i = top[j]; i < j; i++) x[i] -= a[c2 + i] * xj; }
    return x;
  };

  /* ── edge loads ─────────────────────────────────────────────── */
  function edgeLoads(mesh, pr, F) {
    var g = GL[4], X = mesh.X, Y = mesh.Y;
    mesh.bedges.forEach(function (e) {
      var nn = e.n, m = nn.length;
      var tr0 = pr.traction(e.tag, X[nn[0]], Y[nn[0]]); if (!tr0 && !pr.traction(e.tag, X[nn[m - 1]], Y[nn[m - 1]])) return;
      for (var q = 0; q < 4; q++) {
        var xi = g.p[q], N, dN;
        if (m === 2) { N = [(1 - xi) / 2, (1 + xi) / 2]; dN = [-0.5, 0.5]; }
        else { N = [xi * (xi - 1) / 2, 1 - xi * xi, xi * (xi + 1) / 2]; dN = [xi - 0.5, -2 * xi, xi + 0.5]; }
        var nodes = m === 2 ? [nn[0], nn[1]] : [nn[0], nn[1], nn[2]];
        var x = 0, y = 0, tx = 0, ty = 0;
        for (var k = 0; k < m; k++) { x += N[k] * X[nodes[k]]; y += N[k] * Y[nodes[k]]; tx += dN[k] * X[nodes[k]]; ty += dN[k] * Y[nodes[k]]; }
        var tr = pr.traction(e.tag, x, y); if (!tr) continue;
        var ds = Math.sqrt(tx * tx + ty * ty) * g.w[q] * T;
        for (k = 0; k < m; k++) { F[2 * nodes[k]] += N[k] * tr[0] * ds; F[2 * nodes[k] + 1] += N[k] * tr[1] * ds; }
      }
    });
  }

  /* ── solve one configuration ────────────────────────────────── */
  // cfg: { problem, elem, n, distort, seed, nu, ld, ar, support, outer }
  function run(cfg) {
    var t0 = now();
    // cfg.pr and cfg.mesh let other tools solve their own geometry (e.g. NURBS-mapped nodes) with these elements
    var pr = cfg.pr || PROBLEMS[cfg.problem](cfg), mesh = cfg.mesh || buildMesh(pr, cfg.elem, cfg.distort || 0, cfg.seed || 1);
    var D = Dmat(cfg.nu, pr.E), nn = mesh.nn, ndof = 2 * nn, type = mesh.type, npe = mesh.npe, ne = mesh.ne;
    var X = mesh.X, Y = mesh.Y, C = mesh.C, e, a, b;

    // essential boundary conditions → equation numbers
    var fixed = new Uint8Array(ndof), ubar = new Float64Array(ndof);
    mesh.bedges.forEach(function (be) {
      be.n.forEach(function (nd) {
        var v = pr.dirichlet(be.tag, X[nd], Y[nd]); if (!v) return;
        for (var c = 0; c < 2; c++) if (v[c] !== null && v[c] !== undefined) { fixed[2 * nd + c] = 1; ubar[2 * nd + c] = v[c]; }
      });
    });
    // optional point supports: pr.nodeBC(mesh) → [{ n, d (0 = x, 1 = y), v }]
    if (pr.nodeBC) pr.nodeBC(mesh).forEach(function (c) { fixed[2 * c.n + c.d] = 1; ubar[2 * c.n + c.d] = c.v; });
    var eq = new Int32Array(ndof), neq = 0;
    for (a = 0; a < ndof; a++) eq[a] = fixed[a] ? -1 : neq++;

    // skyline profile
    var top = new Int32Array(neq); for (a = 0; a < neq; a++) top[a] = a;
    for (e = 0; e < ne; e++) {
      var mn = Infinity;
      for (a = 0; a < npe; a++) for (var c = 0; c < 2; c++) { var q = eq[2 * C[e * npe + a] + c]; if (q >= 0 && q < mn) mn = q; }
      for (a = 0; a < npe; a++) for (c = 0; c < 2; c++) { q = eq[2 * C[e * npe + a] + c]; if (q >= 0 && mn < top[q]) top[q] = mn; }
    }
    var K = new Skyline(top), F = new Float64Array(ndof), R = type === 'QM6' ? new Float64Array(ne * 32) : null;
    edgeLoads(mesh, pr, F);
    var f = new Float64Array(neq); for (a = 0; a < ndof; a++) if (eq[a] >= 0) f[eq[a]] += F[a];

    var ctx = Ctx(type), m = 2 * npe, dofs = new Int32Array(m), bad = -1;
    for (e = 0; e < ne; e++) {
      for (a = 0; a < npe; a++) { var nd = C[e * npe + a]; ctx.ex[a] = X[nd]; ctx.ey[a] = Y[nd]; dofs[2 * a] = 2 * nd; dofs[2 * a + 1] = 2 * nd + 1; }
      var ek = elemK(type, ctx.ex, ctx.ey, D, ctx);
      if (!ek) { bad = e; break; }
      if (R) R.set(ek.R, e * 32);
      var Ke = ek.K;
      for (a = 0; a < m; a++) {
        var ia = eq[dofs[a]];
        if (ia < 0) continue;
        for (b = 0; b < m; b++) {
          var ib = eq[dofs[b]], kv = Ke[a * m + b];
          if (ib < 0) { f[ia] -= kv * ubar[dofs[b]]; continue; }
          if (ia <= ib) K.add(ia, ib, kv);
        }
      }
    }
    var t1 = now();
    if (bad >= 0) return { error: 'distorted', pr: pr, mesh: mesh };
    var piv = K.factor();
    if (piv >= 0) return { error: 'singular', pr: pr, mesh: mesh };
    var x = K.solve(f), u = new Float64Array(ndof);
    for (a = 0; a < ndof; a++) u[a] = eq[a] >= 0 ? x[eq[a]] : ubar[a];
    var t2 = now();

    var model = { cfg: cfg, pr: pr, mesh: mesh, D: D, u: u, R: R, F: F, fixed: fixed, neq: neq, ndof: ndof,
                  profile: K.a.length, time: { assemble: t1 - t0, solve: t2 - t1 } };
    recover(model);
    model.time.recover = now() - t2;
    return model;
  }

  /* ── stress recovery ────────────────────────────────────────── */
  // Stress at natural point (xi, eta) of element e, directly from B·u (+ incompatible modes for QM6).
  function stressAt(model, e, xi, eta, ctx, out) {
    var mesh = model.mesh, type = mesh.type, npe = mesh.npe, C = mesh.C, D = model.D, u = model.u, a;
    for (a = 0; a < npe; a++) { var nd = C[e * npe + a]; ctx.ex[a] = mesh.X[nd]; ctx.ey[a] = mesh.Y[nd]; }
    var det = derivs(type, ctx.ex, ctx.ey, xi, eta, ctx.N, ctx.Nx, ctx.Ne, ctx.dx, ctx.dy);
    var exx = 0, eyy = 0, gxy = 0;
    for (a = 0; a < npe; a++) {
      var n2 = 2 * C[e * npe + a], ux = u[n2], uy = u[n2 + 1];
      exx += ctx.dx[a] * ux; eyy += ctx.dy[a] * uy; gxy += ctx.dy[a] * ux + ctx.dx[a] * uy;
    }
    if (type === 'QM6') {
      var R = model.R, al = [0, 0, 0, 0], k, c;
      for (k = 0; k < 4; k++) { var s = 0; for (c = 0; c < 4; c++) { var n3 = 2 * C[e * 4 + c]; s += R[e * 32 + k * 8 + 2 * c] * u[n3] + R[e * 32 + k * 8 + 2 * c + 1] * u[n3 + 1]; } al[k] = -s; }
      var G = qm6Inc(ctx.ex, ctx.ey, xi, eta, det, j0inv(ctx.ex, ctx.ey));
      exx += G[0] * al[0] + G[1] * al[1]; eyy += G[2] * al[2] + G[3] * al[3];
      gxy += G[2] * al[0] + G[3] * al[1] + G[0] * al[2] + G[1] * al[3];
    }
    out[0] = D[0] * exx + D[1] * eyy; out[1] = D[3] * exx + D[4] * eyy; out[2] = D[8] * gxy;
    return det;
  }

  // Raw nodal stresses per element (Gauss points extrapolated), plus simple nodal averages.
  function recover(model) {
    var mesh = model.mesh, type = mesh.type, npe = mesh.npe, ne = mesh.ne, nn = mesh.nn, C = mesh.C;
    var raw = new Float64Array(ne * npe * 3), avg = new Float64Array(nn * 3), cnt = new Float64Array(nn);
    var ctx = Ctx(type), s = [0, 0, 0], e, a, k;
    var gp = [[-1, -1], [1, -1], [1, 1], [-1, 1]], sg = new Float64Array(12), Nq = new Float64Array(4), d1 = new Float64Array(4), d2 = new Float64Array(4);
    for (e = 0; e < ne; e++) {
      if (type === 'T3') {
        stressAt(model, e, 1 / 3, 1 / 3, ctx, s);
        for (a = 0; a < 3; a++) for (k = 0; k < 3; k++) raw[(e * 3 + a) * 3 + k] = s[k];
      } else {
        for (var g = 0; g < 4; g++) { stressAt(model, e, gp[g][0] / R3, gp[g][1] / R3, ctx, s); sg[g * 3] = s[0]; sg[g * 3 + 1] = s[1]; sg[g * 3 + 2] = s[2]; }
        var nat = type === 'Q8' ? Q8C : Q4C;
        for (a = 0; a < npe; a++) {
          shapeQ4(nat[a][0] * R3, nat[a][1] * R3, Nq, d1, d2);
          for (k = 0; k < 3; k++) raw[(e * npe + a) * 3 + k] = Nq[0] * sg[k] + Nq[1] * sg[3 + k] + Nq[2] * sg[6 + k] + Nq[3] * sg[9 + k];
        }
      }
      for (a = 0; a < npe; a++) { var nd = C[e * npe + a]; cnt[nd]++; for (k = 0; k < 3; k++) avg[nd * 3 + k] += raw[(e * npe + a) * 3 + k]; }
    }
    for (a = 0; a < nn; a++) for (k = 0; k < 3; k++) avg[a * 3 + k] /= cnt[a] || 1;
    model.sRaw = raw; model.sAvg = avg;
  }

  /* ── derived fields ─────────────────────────────────────────── */
  var FIELDS = ['umag', 'ux', 'uy', 'sxx', 'syy', 'sxy', 'svm'];
  function fieldOf(key, u2, s3) {     // u2 = [ux, uy], s3 = [sxx, syy, sxy]
    switch (key) {
      case 'umag': return Math.sqrt(u2[0] * u2[0] + u2[1] * u2[1]);
      case 'ux': return u2[0];
      case 'uy': return u2[1];
      case 'sxx': return s3[0];
      case 'syy': return s3[1];
      case 'sxy': return s3[2];
      case 'svm': return Math.sqrt(s3[0] * s3[0] - s3[0] * s3[1] + s3[1] * s3[1] + 3 * s3[2] * s3[2]);
    }
    return NaN;
  }
  function isStress(key) { return key.charAt(0) === 's'; }

  // Values at each element's nodes: Float64Array(ne·npe). mode 'raw' | 'avg' (displacements are always continuous).
  function elementField(model, key, mode) {
    var mesh = model.mesh, npe = mesh.npe, ne = mesh.ne, C = mesh.C, u = model.u, out = new Float64Array(ne * npe);
    var u2 = [0, 0], s3 = [0, 0, 0];
    for (var e = 0; e < ne; e++) for (var a = 0; a < npe; a++) {
      var nd = C[e * npe + a], i = e * npe + a;
      u2[0] = u[2 * nd]; u2[1] = u[2 * nd + 1];
      if (isStress(key)) {
        var src = mode === 'raw' ? model.sRaw : model.sAvg, off = mode === 'raw' ? i * 3 : nd * 3;
        s3[0] = src[off]; s3[1] = src[off + 1]; s3[2] = src[off + 2];
      }
      out[i] = fieldOf(key, u2, s3);
    }
    return out;
  }
  function nodalField(model, key) {
    var nn = model.mesh.nn, u = model.u, s = model.sAvg, out = new Float64Array(nn);
    for (var n = 0; n < nn; n++) out[n] = fieldOf(key, [u[2 * n], u[2 * n + 1]], [s[3 * n], s[3 * n + 1], s[3 * n + 2]]);
    return out;
  }
  function exactField(model, key, x, y) {
    var ex = model.pr.exact; if (!ex) return NaN;
    return fieldOf(key, ex.u(x, y), ex.s(x, y));
  }

  /* ── point location and interpolation ───────────────────────── */
  function bboxes(model) {
    if (model._bb) return model._bb;
    var mesh = model.mesh, npe = mesh.npe, ne = mesh.ne, bb = new Float64Array(ne * 4);
    for (var e = 0; e < ne; e++) {
      var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (var a = 0; a < npe; a++) { var nd = mesh.C[e * npe + a], x = mesh.X[nd], y = mesh.Y[nd]; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      var px = (x1 - x0) * 0.02 + 1e-12, py = (y1 - y0) * 0.02 + 1e-12;
      bb[e * 4] = x0 - px; bb[e * 4 + 1] = x1 + px; bb[e * 4 + 2] = y0 - py; bb[e * 4 + 3] = y1 + py;
    }
    return (model._bb = bb);
  }
  // Natural coordinates of (x, y) inside element e, or null.
  function locateIn(model, e, x, y, ctx, tol) {
    var mesh = model.mesh, type = mesh.type, npe = mesh.npe, a;
    for (a = 0; a < npe; a++) { var nd = mesh.C[e * npe + a]; ctx.ex[a] = mesh.X[nd]; ctx.ey[a] = mesh.Y[nd]; }
    var xi = type === 'T3' ? 1 / 3 : 0, eta = xi;
    for (var it = 0; it < 12; it++) {
      SHAPE[type](xi, eta, ctx.N, ctx.Nx, ctx.Ne);
      var fx = -x, fy = -y, j11 = 0, j12 = 0, j21 = 0, j22 = 0;
      for (a = 0; a < npe; a++) { fx += ctx.N[a] * ctx.ex[a]; fy += ctx.N[a] * ctx.ey[a]; j11 += ctx.Nx[a] * ctx.ex[a]; j12 += ctx.Nx[a] * ctx.ey[a]; j21 += ctx.Ne[a] * ctx.ex[a]; j22 += ctx.Ne[a] * ctx.ey[a]; }
      var det = j11 * j22 - j12 * j21; if (!det) return null;
      var dxi = (j22 * fx - j21 * fy) / det, deta = (-j12 * fx + j11 * fy) / det;
      xi -= dxi; eta -= deta;
      if (Math.abs(dxi) + Math.abs(deta) < 1e-12) break;
    }
    var t = tol || 1e-7;
    if (type === 'T3') return (xi >= -t && eta >= -t && xi + eta <= 1 + t) ? [xi, eta] : null;
    return (Math.abs(xi) <= 1 + t && Math.abs(eta) <= 1 + t) ? [xi, eta] : null;
  }
  function locate(model, x, y, tol) {
    var bb = bboxes(model), ne = model.mesh.ne, ctx = model._lctx || (model._lctx = Ctx(model.mesh.type));
    for (var e = 0; e < ne; e++) {
      if (x < bb[e * 4] || x > bb[e * 4 + 1] || y < bb[e * 4 + 2] || y > bb[e * 4 + 3]) continue;
      var nc = locateIn(model, e, x, y, ctx, tol); if (nc) return { e: e, xi: nc[0], eta: nc[1] };
    }
    return null;
  }
  // FE value of a field at a physical point; mode 'raw' | 'avg'. NaN if outside the mesh.
  function evalAt(model, key, x, y, mode, tol) {
    var loc = locate(model, x, y, tol); if (!loc) return NaN;
    var mesh = model.mesh, npe = mesh.npe, ctx = model._lctx, e = loc.e, a, k;
    SHAPE[mesh.type](loc.xi, loc.eta, ctx.N, ctx.Nx, ctx.Ne);
    var u2 = [0, 0], s3 = [0, 0, 0];
    for (a = 0; a < npe; a++) {
      var nd = mesh.C[e * npe + a], Na = ctx.N[a];
      u2[0] += Na * model.u[2 * nd]; u2[1] += Na * model.u[2 * nd + 1];
      for (k = 0; k < 3; k++) s3[k] += Na * (mode === 'raw' ? model.sRaw[(e * npe + a) * 3 + k] : model.sAvg[nd * 3 + k]);
    }
    return fieldOf(key, u2, s3);
  }

  /* ── energy-norm error ──────────────────────────────────────── */
  function energyError(model) {
    var ex = model.pr.exact; if (!ex) return null;
    var mesh = model.mesh, type = mesh.type, npe = mesh.npe, ne = mesh.ne, nu = model.cfg.nu;
    var pts = errorPoints(type), ctx = Ctx(type), s = [0, 0, 0], num = 0, den = 0;
    function cE(v) { return (v[0] * v[0] - 2 * nu * v[0] * v[1] + v[1] * v[1] + 2 * (1 + nu) * v[2] * v[2]) / E; }
    for (var e = 0; e < ne; e++) for (var q = 0; q < pts.length; q++) {
      var det = stressAt(model, e, pts[q][0], pts[q][1], ctx, s), x = 0, y = 0;
      for (var a = 0; a < npe; a++) { x += ctx.N[a] * ctx.ex[a]; y += ctx.N[a] * ctx.ey[a]; }
      var se = ex.s(x, y), w = pts[q][2] * det * T;
      num += w * cE([se[0] - s[0], se[1] - s[1], se[2] - s[2]]);
      den += w * cE(se);
    }
    return Math.sqrt(num / den);
  }

  // Internal force at constrained DOFs = reactions (used for checks)
  function reactions(model) {
    var mesh = model.mesh, type = mesh.type, npe = mesh.npe, ne = mesh.ne, C = mesh.C, D = model.D, ctx = Ctx(type), out = new Float64Array(model.ndof);
    for (var e = 0; e < ne; e++) {
      for (var a = 0; a < npe; a++) { var nd = C[e * npe + a]; ctx.ex[a] = mesh.X[nd]; ctx.ey[a] = mesh.Y[nd]; }
      var K = elemK(type, ctx.ex, ctx.ey, D, ctx).K, m = 2 * npe;
      for (a = 0; a < m; a++) {
        var ga = 2 * C[e * npe + (a >> 1)] + (a & 1); if (!model.fixed[ga]) continue;
        for (var b = 0; b < m; b++) out[ga] += K[a * m + b] * model.u[2 * C[e * npe + (b >> 1)] + (b & 1)];
      }
    }
    return out;
  }

  // Size of a configuration without building it
  function size(cfg) {
    var pr = PROBLEMS[cfg.problem](cfg), nx = pr.nx, ny = pr.ny, t = cfg.elem;
    var nodes = t === 'Q8' ? (2 * nx + 1) * (2 * ny + 1) - nx * ny : (nx + 1) * (ny + 1);
    return { nodes: nodes, dof: 2 * nodes, elements: (t === 'T3' ? 2 : 1) * nx * ny, nx: nx, ny: ny };
  }

  function now() { return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now(); }

  root.RZFEM = {
    E: E, T: T, FIELDS: FIELDS, NPE: NPE, PROBLEMS: PROBLEMS, run: run, size: size, buildMesh: buildMesh,
    elementField: elementField, nodalField: nodalField, exactField: exactField, fieldOf: fieldOf, isStress: isStress,
    evalAt: evalAt, locate: locate, energyError: energyError, reactions: reactions, shape: SHAPE,
    Skyline: Skyline, Dmat: Dmat
  };
})(typeof window !== 'undefined' ? window : globalThis);
