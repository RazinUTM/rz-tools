// Numerical checks for the 1D bar FEM core. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { Math, Float64Array, isFinite };
ctx.globalThis = ctx;
vm.runInNewContext(readFileSync(new URL('../src/bar/core.js', import.meta.url), 'utf8'), ctx);
const B = ctx.RZBAR;
const base = { E: 200e9, A0: 0.01, A1: 0.01, L: 1, P: 50000, q: 0 };
const run = (o) => B.run(Object.assign({}, base, o));

test('tip load on a uniform bar is exact for any mesh (the original app)', () => {
  for (const n of [1, 3, 7, 20]) {
    const m = run({ n, order: 1 });
    assert.ok(Math.abs(m.u[m.nn - 1] - 50000 / (200e9 * 0.01)) < 1e-15);
    assert.ok(B.energyError(m) < 1e-12);
  }
});

test('distributed load: linear elements are nodally exact, quadratic elements exact everywhere', () => {
  const m = run({ n: 4, order: 1, q: 20000 });
  for (let i = 0; i < m.nn; i++) assert.ok(Math.abs(m.u[i] - m.ex.u(m.x[i])) < 1e-15);
  assert.ok(B.energyError(m) > 0.01);
  assert.ok(B.energyError(run({ n: 2, order: 2, q: 20000 })) < 1e-12);
});

test('tapered bar: energy-norm rates 1 (linear) and 2 (quadratic)', () => {
  for (const [order, lo, hi] of [[1, 0.9, 1.1], [2, 1.8, 2.2]]) {
    const e8 = B.energyError(run({ n: 8, order, A1: 0.0025 })), e16 = B.energyError(run({ n: 16, order, A1: 0.0025 }));
    const rate = Math.log(e8 / e16) / Math.log(2);
    assert.ok(rate > lo && rate < hi, `order ${order}: ${rate}`);
  }
});

test('support reaction balances the loads', () => {
  const m = run({ n: 5, order: 2, q: 30000, A1: 0.004 });
  assert.ok(Math.abs(m.reaction + (50000 + 30000)) < 1e-6);
});
