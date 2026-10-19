// Numerical checks for the 2D plane stress FEM core. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { Math, Float64Array, Int32Array, Int8Array, Uint8Array, isFinite, NaN, Infinity, Date };
ctx.globalThis = ctx;
vm.runInNewContext(readFileSync(new URL('../src/fem/core.js', import.meta.url), 'utf8'), ctx);
const M = ctx.RZFEM;
const ELEMS = ['T3', 'Q4', 'QM6', 'Q8'];
const run = (o) => M.run(Object.assign({ nu: 0.3, distort: 0, seed: 1 }, o));

test('skyline LDLᵀ matches a dense solve', () => {
  const n = 12, top = new Int32Array(n), A = [];
  for (let j = 0; j < n; j++) top[j] = Math.max(0, j - 3);
  const K = new M.Skyline(top);
  for (let i = 0; i < n; i++) { A.push(new Array(n).fill(0)); }
  for (let j = 0; j < n; j++) for (let i = top[j]; i <= j; i++) {
    const v = i === j ? 10 + j : Math.sin(i + 2 * j);
    K.add(i, j, v); A[i][j] = v; A[j][i] = v;
  }
  const f = Array.from({ length: n }, (_, i) => Math.cos(i));
  assert.equal(K.factor(), -1);
  const x = K.solve(Float64Array.from(f));
  for (let i = 0; i < n; i++) {
    let s = 0; for (let j = 0; j < n; j++) s += A[i][j] * x[j];
    assert.ok(Math.abs(s - f[i]) < 1e-12, `row ${i}: ${s} vs ${f[i]}`);
  }
});

test('patch test: every element reproduces constant stress on a distorted mesh', () => {
  for (const elem of ELEMS) for (const seed of [1, 5]) {
    const m = run({ problem: 'patch', elem, n: 4, distort: 0.35, seed });
    assert.ok(!m.error, elem + ' ' + m.error);
    const err = M.energyError(m);
    assert.ok(err < 1e-12, `${elem} seed ${seed}: energy error ${err}`);
    for (let i = 0; i < m.mesh.nn; i++) {
      const ex = m.pr.exact.u(m.mesh.X[i], m.mesh.Y[i]);
      assert.ok(Math.abs(m.u[2 * i] - ex[0]) < 1e-15 && Math.abs(m.u[2 * i + 1] - ex[1]) < 1e-15);
      assert.ok(Math.abs(m.sAvg[3 * i] - 1e8) < 1e-4 * 1e2);
    }
  }
});

test('equilibrium: reactions balance the applied load', () => {
  for (const elem of ELEMS) {
    const m = run({ problem: 'cantilever', elem, n: 3, ld: 5, support: 'clamped' });
    const R = M.reactions(m); let rx = 0, ry = 0;
    for (let i = 0; i < m.mesh.nn; i++) { rx += R[2 * i]; ry += R[2 * i + 1]; }
    assert.ok(Math.abs(rx) < 1e-6 && Math.abs(ry - 20e3) < 1e-6, `${elem}: ΣR = (${rx}, ${ry})`);
  }
});

function rates(problem, ns, extra) {
  const out = {};
  for (const elem of ELEMS) {
    const pts = ns.map((n) => { const m = run(Object.assign({ problem, elem, n }, extra)); return { dof: m.ndof, e: M.energyError(m) }; });
    const a = pts[pts.length - 2], b = pts[pts.length - 1];
    out[elem] = Math.log(a.e / b.e) / Math.log(Math.sqrt(b.dof / a.dof));
  }
  return out;
}

test('energy-norm convergence: O(h) for T3, Q4, QM6 and O(h²) for Q8 (cantilever)', () => {
  const r = rates('cantilever', [4, 8, 16], { ld: 5, support: 'exact' });
  for (const k of ['T3', 'Q4', 'QM6']) assert.ok(r[k] > 0.9 && r[k] < 1.2, `${k}: ${r[k]}`);
  assert.ok(r.Q8 > 1.9 && r.Q8 < 2.3, `Q8: ${r.Q8}`);
});

test('energy-norm convergence on the plate with a hole (Kirsch tractions)', () => {
  const r = rates('hole', [8, 16], { ar: 0.25, outer: 'kirsch' });
  for (const k of ['T3', 'Q4', 'QM6']) assert.ok(r[k] > 0.9 && r[k] < 1.3, `${k}: ${r[k]}`);
  assert.ok(r.Q8 > 1.7, `Q8: ${r.Q8}`);
});

test('shear locking: one element through the depth', () => {
  const tip = (elem) => { const m = run({ problem: 'cantilever', elem, n: 1, ld: 5, support: 'exact' }); return M.evalAt(m, 'uy', 2, 0, 'avg', 1e-6) / m.pr.ref.tip; };
  assert.ok(tip('T3') < 0.4);
  assert.ok(tip('Q4') > 0.6 && tip('Q4') < 0.75);
  assert.ok(tip('QM6') > 0.99);
  assert.ok(tip('Q8') > 0.99);
});

test('stress concentration at the hole tends to 3 (Q8, Kirsch tractions)', () => {
  const m = run({ problem: 'hole', elem: 'Q8', n: 16, ar: 0.25, outer: 'kirsch' });
  const scf = M.evalAt(m, 'sxx', 0, m.pr.a, 'avg', 1e-4) / m.pr.s0;
  assert.ok(Math.abs(scf - 3) < 0.05, String(scf));
});

test('finite plate under uniform tension: SCF above the Kirsch value', () => {
  const m = run({ problem: 'hole', elem: 'Q8', n: 16, ar: 0.4, outer: 'uniform' });
  const scf = M.evalAt(m, 'sxx', 0, m.pr.a, 'avg', 1e-4) / m.pr.s0;
  assert.ok(scf > 3.2 && scf < 5, String(scf));
  assert.equal(M.energyError(m), null);
});

test('exact solutions are compatible (Hooke ∘ ∇u = σ) and in equilibrium (div σ = 0)', () => {
  const nu = 0.3, E = M.E, c = E / (1 - nu * nu), h = 1e-6;
  const hooke = (ex, ey, g) => [c * (ex + nu * ey), c * (nu * ex + ey), c * (1 - nu) / 2 * g];
  const cases = [
    [M.PROBLEMS.cantilever({ n: 1, ld: 5, nu, support: 'exact' }).timo, (i) => [0.1 + 0.15 * i, -0.18 + 0.03 * i]],
    [M.PROBLEMS.hole({ n: 1, ar: 0.25, nu, outer: 'kirsch' }).exact, (i) => { const r = 0.3 + 0.05 * i, th = 0.12 * i; return [r * Math.cos(th), r * Math.sin(th)]; }],
  ];
  for (const [S, pt] of cases) for (let i = 0; i < 12; i++) {
    const [x, y] = pt(i), ux1 = S.u(x + h, y), ux0 = S.u(x - h, y), uy1 = S.u(x, y + h), uy0 = S.u(x, y - h);
    const sh = hooke((ux1[0] - ux0[0]) / (2 * h), (uy1[1] - uy0[1]) / (2 * h), (uy1[0] - uy0[0]) / (2 * h) + (ux1[1] - ux0[1]) / (2 * h));
    const se = S.s(x, y), scale = Math.max(...se.map(Math.abs), 1e6);
    for (let k = 0; k < 3; k++) assert.ok(Math.abs(sh[k] - se[k]) < 1e-6 * scale, `compatibility at (${x}, ${y}): ${sh[k]} vs ${se[k]}`);
    const sx1 = S.s(x + h, y), sx0 = S.s(x - h, y), sy1 = S.s(x, y + h), sy0 = S.s(x, y - h);
    const f1 = (sx1[0] - sx0[0]) / (2 * h) + (sy1[2] - sy0[2]) / (2 * h), f2 = (sx1[2] - sx0[2]) / (2 * h) + (sy1[1] - sy0[1]) / (2 * h);
    assert.ok(Math.abs(f1) < 1e-6 * scale && Math.abs(f2) < 1e-6 * scale, `equilibrium at (${x}, ${y}): ${f1}, ${f2}`);
  }
});
