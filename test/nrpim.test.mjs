// Numerical checks of the 2D N-RPIM core. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { Math, isFinite, NaN, Infinity, Date };
ctx.globalThis = ctx;
for (const f of ['../src/fem/core.js', '../src/nurbs/core.js', '../src/nrpim/core.js']) vm.runInNewContext(readFileSync(new URL(f, import.meta.url), 'utf8'), ctx);
const R = ctx.RZNRPIM, F = ctx.RZFEM;
const base = { problem: 'hole', n: 4, ld: 5, support: 'exact', ar: 0.25, outer: 'kirsch', nu: 0.3, distort: 0, seed: 7, rbf: 'mq', m: 3, alpha: 2.5, ng: 4, load: 'comp' };
const run = (o) => R.run(Object.assign({}, base, o));

test('patch test: small error that more Gauss points do not remove (jumps between cell supports)', () => {
  const e2 = R.energyError(run({ problem: 'patch', ng: 2 })), e5 = R.energyError(run({ problem: 'patch', ng: 5 }));
  assert.ok(e5 > 1e-3 && e5 < 0.03, String(e5));
  assert.ok(e2 / e5 < 1.2, `${e2} vs ${e5}`);
});

test('plate with a hole: converges, beats Q4 on the same nodes, stress concentration within 5%', () => {
  const e = [2, 4, 8].map((n) => R.energyError(run({ n })));
  assert.ok(e[1] < e[0] && e[2] < e[1], e.join(' '));
  const fem = F.energyError(R.femRun(Object.assign({}, base, { n: 8 })));
  assert.ok(e[2] < 0.7 * fem, `N-RPIM ${e[2]} vs Q4 ${fem}`);
  const scf = R.evalParam(run({ n: 8 }), 0, 1)[2] / 100e6;
  assert.ok(Math.abs(scf / 3 - 1) < 0.05, String(scf));
});

test('cantilever: polynomial terms are essential; with them N-RPIM avoids the locking of Q4', () => {
  const e3 = R.energyError(run({ problem: 'cantilever', n: 4 })), e0 = R.energyError(run({ problem: 'cantilever', n: 4, m: 0 }));
  const q4 = F.energyError(R.femRun(Object.assign({}, base, { problem: 'cantilever', n: 4 })));
  assert.ok(e3 < 0.03 && e0 > 0.5 && q4 > 5 * e3, `${e3} ${e0} ${q4}`);
});

test('unit cell from the paper: N-RPIM reaches the COMSOL references faster than Q4', () => {
  const c = run({ problem: 'cell', n: 8 }), vA = R.evalParam(c, 1, 0.2)[1];
  assert.ok(Math.abs(vA / 9.8366e-6 - 1) < 0.005, String(vA));
  const fm = R.femRun(Object.assign({}, base, { problem: 'cell', n: 8 })), fv = fm.u[2 * R.femNode(fm, 1, 0.2) + 1];
  assert.ok(Math.abs(vA / 9.8366e-6 - 1) < Math.abs(fv / 9.8366e-6 - 1) / 3, `${vA} vs FEM ${fv}`);
  const s = run({ problem: 'cell', load: 'shear', n: 8 }), vB = R.evalParam(s, 1, 1)[1];
  assert.ok(Math.abs(vB / -1.7332e-5 - 1) < 0.01, String(vB));
  // point supports carry no reaction under the self-equilibrated compression load
  assert.ok(c.fixed.reduce((a, b) => a + b, 0) === 3);
});

test('irregular nodes and both radial basis functions solve without failures', () => {
  for (const rbf of ['mq', 'tps']) for (const problem of ['hole', 'cantilever', 'patch']) {
    const m = run({ problem, rbf, distort: 0.35, n: 3 });
    assert.ok(!m.error && m.u.every(isFinite), `${rbf} ${problem}`);
  }
});
