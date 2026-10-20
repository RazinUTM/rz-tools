// Checks of the NURBS geometry, the parameter-space shape functions and the banded solver. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { Math, isFinite, NaN, Infinity, Date };
ctx.globalThis = ctx;
for (const f of ['../src/nurbs/core.js']) vm.runInNewContext(readFileSync(new URL(f, import.meta.url), 'utf8'), ctx);
const N = ctx.RZNURBS, G = N.GEOM;

test('B-spline basis: partition of unity and derivatives that sum to zero', () => {
  const U = [0, 0, 0, 0.2, 0.2, 0.5, 0.5, 0.8, 0.8, 1, 1, 1], B = new Float64Array(3), D = new Float64Array(3);
  for (let k = 0; k <= 200; k++) {
    const u = k / 200, i = N.findSpan(9, 2, u, U); N.basis(i, u, 2, U, B, D);
    assert.ok(Math.abs(B[0] + B[1] + B[2] - 1) < 1e-14 && Math.abs(D[0] + D[1] + D[2]) < 1e-12);
  }
});

test('NURBS patches: exact circles, positive Jacobians, derivatives match finite differences', () => {
  const ph = G.plateHole(0.25, 1), an = G.annulus(0.3, 0.6), uc = G.unitCell(0.8, 1, 0.3), fb = G.fanBlade();
  for (const P of [ph, an, uc, fb, G.squareCurved(0.15), G.rect(0, 2, -0.2, 0.2)]) assert.ok(P.minDet(16) > 1e-4, 'det J > 0');
  for (let k = 0; k <= 100; k++) {
    const t = k / 100, p = ph.point(0, t), q = an.point(1, t), r = an.point(0, t);
    assert.ok(Math.abs(Math.hypot(p[0], p[1]) - 0.25) < 1e-14 && Math.abs(Math.hypot(q[0], q[1]) - 0.6) < 1e-14 && Math.abs(Math.hypot(r[0], r[1]) - 0.3) < 1e-14);
    const v = 0.2 + 0.6 * t, a = uc.point(0, v), b = uc.point(1, v);
    assert.ok(Math.abs(Math.hypot(a[0], a[1] - 0.5) - 0.3) < 1e-14 && Math.abs(Math.hypot(b[0] - 0.8, b[1] - 0.5) - 0.3) < 1e-14, 'unit cell openings');
  }
  assert.deepEqual(Array.from(uc.point(0.5, 0.5)).map((x) => +x.toFixed(12)), [0.4, 0.5]);
  assert.equal(JSON.stringify(uc.c0v), '[0.2,0.5,0.8]'); assert.equal(JSON.stringify(ph.c0v), '[0.5]'); assert.equal(JSON.stringify(an.c0v), '[]');
  for (const P of [ph, fb]) for (const [u, v] of [[0.31, 0.27], [0.77, 0.61], [0.13, 0.9]]) {
    const h = 1e-6, o = P.eval(u, v), a = P.eval(u + h, v), b = P.eval(u - h, v), c = P.eval(u, v + h), d = P.eval(u, v - h);
    const e = [(a[0] - b[0]) / (2 * h) - o[2], (a[1] - b[1]) / (2 * h) - o[3], (c[0] - d[0]) / (2 * h) - o[4], (c[1] - d[1]) / (2 * h) - o[5]];
    assert.ok(Math.max(...e.map(Math.abs)) < 1e-7, 'first derivatives');
  }
});

test('RPIM shape functions: Kronecker delta and polynomial reproduction, per point and per cell', () => {
  const ax = new N.Axis([0, 1], 10), ay = new N.Axis([0, 0.5, 1], 4), lat = new N.Lattice(ax, ay, { distort: 0.3, seed: 3 });
  for (const [rbf, m] of [['mq', 3], ['tps', 3], ['mq', 6]]) {
    const S = new N.Approx(lat, { kind: 'rpim', rbf, m, d: 2.5 });
    const k0 = lat.node(4, 3), n = S.at(lat.A[k0], lat.B[k0], false);
    for (let k = 0; k < n; k++) assert.ok(Math.abs(S.phi[k] - (S.idx[k] === k0 ? 1 : 0)) < 1e-10, 'Kronecker delta');
    for (const [a, b] of [[0.3, 0.2], [5.17, 4.61], [9.9, 7.95]]) for (const cell of [false, true]) {
      const nn = cell ? (S.cell(Math.floor(a) + 0.5, Math.floor(b) + 0.5), S.inCell(a, b, true)) : S.at(a, b, true);
      let s = 0, sa = 0, sb = 0, da = 0, daa = 0, sq = 0;
      for (let k = 0; k < nn; k++) { const A = lat.A[S.idx[k]], B = lat.B[S.idx[k]]; s += S.phi[k]; sa += S.phi[k] * A; sb += S.phi[k] * B; da += S.da[k]; daa += S.da[k] * A; sq += S.phi[k] * A * B; }
      assert.ok(Math.abs(s - 1) < 1e-10 && Math.abs(sa - a) < 1e-9 && Math.abs(sb - b) < 1e-9 && Math.abs(da) < 1e-8 && Math.abs(daa - 1) < 1e-8, `${rbf} m=${m} linear`);
      if (m === 6) assert.ok(Math.abs(sq - a * b) < 1e-8, 'quadratic');
    }
  }
});

test('MLS shape functions: quadratic reproduction without interpolation; Gaussian RBF without polynomials does not reproduce constants', () => {
  const ax = new N.Axis([0, 1], 8), ay = new N.Axis([0, 1], 8), lat = new N.Lattice(ax, ay, { distort: 0.25, seed: 5 });
  const S = new N.Approx(lat, { kind: 'mls', m: 6, d: 3.5, c: 0.3 });
  for (const [a, b] of [[0, 0], [3.3, 4.1], [8, 5.5]]) {
    const n = S.at(a, b, true); let s = 0, sq = 0, dq = 0;
    for (let k = 0; k < n; k++) { const A = lat.A[S.idx[k]], B = lat.B[S.idx[k]]; s += S.phi[k]; sq += S.phi[k] * A * A; dq += S.da[k] * A * A; }
    assert.ok(Math.abs(s - 1) < 1e-12 && Math.abs(sq - a * a) < 1e-10 && Math.abs(dq - 2 * a) < 1e-9);
  }
  const k0 = lat.node(4, 4); assert.ok(S.phiOf(k0, lat.A[k0], lat.B[k0]) < 0.9, 'MLS does not interpolate');
  const R = new N.Approx(lat, { kind: 'rpim', rbf: 'exp', m: 0, d: 3, exp: { ac: 0.8, dc: 2 } }), n = R.at(3.3, 4.1, false);
  let s = 0; for (let k = 0; k < n; k++) s += R.phi[k];
  assert.ok(Math.abs(s - 1) > 1e-3, 'no partition of unity');
});

test('supports stop at C⁰ knot lines; nodes on those lines stay on them', () => {
  const P = G.unitCell(0.8, 1, 0.3), ax = new N.Axis(P.ku, 4, P.c0u), ay = new N.Axis(P.kv, 3, P.c0v), lat = new N.Lattice(ax, ay, { distort: 0.4, seed: 2 });
  assert.equal(JSON.stringify(ay.c0), '[3,6,9]');
  for (let i = 1; i < 4; i++) assert.equal(lat.B[lat.node(i, 6)], 6, 'node kept on the C⁰ line');
  const S = new N.Approx(lat, { kind: 'rpim', rbf: 'mq', m: 3, d: 2.5 }), n = S.at(2.2, 5.6, false);
  for (let k = 0; k < n; k++) assert.ok(lat.B[S.idx[k]] >= 3 - 1e-12 && lat.B[S.idx[k]] <= 6 + 1e-12, 'support inside the segment');
});

test('banded LU with partial pivoting matches a dense solve', () => {
  const n = 80, kl = 9, ku = 6, B = new N.Band(n, kl, ku), Dm = new Float64Array(n * n), rnd = N.mulberry32(11), rhs = new Float64Array(n);
  for (let i = 0; i < n; i++) { rhs[i] = rnd() - 0.5; for (let j = Math.max(0, i - kl); j <= Math.min(n - 1, i + ku); j++) { const v = rnd() - 0.5; B.add(i, j, v); Dm[i * n + j] = v; } }
  assert.equal(B.factor(), -1);
  const x = B.solve(rhs); let res = 0;
  for (let i = 0; i < n; i++) { let s = -rhs[i]; for (let j = 0; j < n; j++) s += Dm[i * n + j] * x[j]; res = Math.max(res, Math.abs(s)); }
  assert.ok(res < 1e-11, String(res));
});
