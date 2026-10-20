// Numerical checks of the 2D NDM core (steady heat conduction). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { Math, isFinite, NaN, Infinity, Date };
ctx.globalThis = ctx;
for (const f of ['../src/fem/core.js', '../src/nurbs/core.js', '../src/ndm/core.js']) vm.runInNewContext(readFileSync(new URL(f, import.meta.url), 'utf8'), ctx);
const D = ctx.RZNDM;
const base = { problem: 'radial', n: 4, approx: 'mls', alpha: 3.5, overlap: 0, ngs: 5, distort: 0, seed: 7 };
const run = (o) => D.run(Object.assign({}, base, o));

test('patch test: NDM-MLS recovers a quadratic temperature exactly, whatever the cells and Gauss points', () => {
  for (const o of [{}, { ngs: 1 }, { overlap: 1 }, { distort: 0.35 }]) {
    const e = D.errors(run(Object.assign({ problem: 'patch' }, o)));
    assert.ok(e.tmax < 1e-10 && e.energy < 1e-10, JSON.stringify(o) + ' ' + e.tmax);
  }
  assert.ok(D.errors(run({ problem: 'patch', approx: 'rbf', alpha: 3 })).energy > 1e-3, 'pure Gaussian RBF does not pass');
});

test('every cell balances: the four side integrals sum to the source', () => {
  const m = run({ problem: 'blade', n: 5 });
  for (let I = 0; I < m.nn; I += 7) {
    const r = D.cellReport(m, I); if (r.kind !== 'cell') continue;
    assert.ok(Math.abs(r.total - r.source) < 1e-9, String(r.total - r.source));
  }
});

test('Dirichlet rows make the temperature exact at boundary nodes, although MLS does not interpolate', () => {
  const m = run({ problem: 'blade', n: 5 }), lat = m.md.lat; let worst = 0, own = 1;
  for (let I = 0; I < m.nn; I++) if (m.dirich[I]) { worst = Math.max(worst, Math.abs(D.evalAt(m, lat.A[I], lat.B[I], 1, 1)[0] - 30)); own = Math.min(own, D.phiAt(m, I, lat.A[I], lat.B[I], 1, 1)); }
  assert.ok(worst < 1e-10 && own < 0.9, `${worst} ${own}`);
});

test('radial flow: NDM-MLS converges faster than overlapping cells and than Q4 on the same nodes', () => {
  const rate = (a, b) => Math.log(a.e / b.e) / Math.log(Math.sqrt(b.n / a.n));
  const pt = (o, n) => { const m = run(Object.assign({ n }, o)); return { e: D.errors(m).energy, n: m.nn }; };
  const fp = (n) => { const f = D.femRun(Object.assign({}, base, { n })); return { e: D.femErrors(f).energy, n: f.T.length }; };
  const r1 = rate(pt({}, 4), pt({}, 8)), r2 = rate(pt({ overlap: 1 }, 4), pt({ overlap: 1 }, 8)), r3 = rate(fp(4), fp(8));
  assert.ok(r1 > 2.2 && r2 > 1.6 && r2 < r1 && r3 < 1.3, `${r1} ${r2} ${r3}`);
  assert.ok(pt({}, 8).e < pt({ overlap: 1 }, 8).e && pt({}, 8).e < fp(8).e / 10);
});

test('fan blade: the converged temperatures of the paper’s Table 2 (k = 1 W/m·K)', () => {
  const m = run({ problem: 'blade', n: 8 });
  for (const p of m.pr.ref.pts) { const T = D.evalParam(m, p.u, p.v)[0]; assert.ok(Math.abs(T / p.T - 1) < 3e-4, `${p.name} ${T}`); }
});

test('quarter annulus with the paper’s conditions: NDM-MLS approaches the finite element reference', () => {
  const m = run({ problem: 'annulus', n: 10 });
  for (const p of m.pr.ref.pts) { const T = D.evalParam(m, p.u, p.v)[0]; assert.ok(Math.abs(T / p.T - 1) < 4e-4, `${p.name} ${T}`); }
});
