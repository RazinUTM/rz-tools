// Numerical checks for the MLS core. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { Math, Float64Array, Uint8Array, isFinite, NaN, Infinity };
ctx.globalThis = ctx;
vm.runInNewContext(readFileSync(new URL('../src/mls/core.js', import.meta.url), 'utf8'), ctx);
const M = ctx.RZMLS;
const X = M.grid(401);

function run(fnOrU, { n = 11, alpha = 2.5, basis = 'quad', weight = 'cubic', layout = 'regular', seed = 7 } = {}) {
  const nodes = M.makeNodes(n, layout, seed);
  const f = typeof fnOrU === 'string' ? M.FN[fnOrU].f : fnOrU;
  const U = M.sample(f, nodes.xs);
  const r = M.evaluate({ alpha, basis, weight }, nodes, X, U, true);
  return { nodes, r, err: r.singular ? NaN : M.relL2(r.uh, M.sample(f, X), X) };
}

test('weight functions: w(0), w(1) = 0, cubic spline continuous at r = 1/2', () => {
  assert.ok(Math.abs(M.weight('cubic', 0) - 2 / 3) < 1e-15);
  assert.equal(M.weight('quartic', 0), 1);
  assert.ok(Math.abs(M.weight('gauss', 0) - 1) < 1e-15);
  for (const k of ['cubic', 'quartic', 'gauss']) assert.equal(M.weight(k, 1), 0);
  const a = M.weight('cubic', 0.5 - 1e-12), b = M.weight('cubic', 0.5 + 1e-12);
  assert.ok(Math.abs(a - b) < 1e-10);
});

test('consistency: quadratic basis reproduces a quadratic to machine precision', () => {
  for (const layout of ['regular', 'irregular'])
    for (const weight of ['cubic', 'quartic', 'gauss'])
      for (const alpha of [2.5, 3, 4]) {
        const { err } = run('quad', { layout, weight, alpha });
        assert.ok(err < 1e-12, `${layout}/${weight}/α=${alpha}: ${err}`);
      }
});

test('consistency: linear basis reproduces a linear function', () => {
  const { err } = run((x) => 3 - 2 * x, { basis: 'lin', alpha: 1.8, layout: 'irregular' });
  assert.ok(err < 1e-12, String(err));
});

test('partition of unity: Σφ = 1', () => {
  const { r, nodes } = run('sin', { layout: 'irregular', alpha: 3 });
  const n = nodes.xs.length;
  for (let k = 0; k < X.length; k++) {
    let s = 0; for (let I = 0; I < n; I++) s += r.phi[k * n + I];
    assert.ok(Math.abs(s - 1) < 1e-12, `x=${X[k]}: Σφ=${s}`);
  }
});

test('singularity thresholds on a regular grid', () => {
  assert.ok(run('sin', { basis: 'lin', alpha: 0.95 }).r.singular > 0);
  assert.equal(run('sin', { basis: 'lin', alpha: 1.05 }).r.singular, 0);
  assert.ok(run('sin', { basis: 'quad', alpha: 1.45 }).r.singular > 0);   // interior fails too
  assert.ok(run('sin', { basis: 'quad', alpha: 1.95 }).r.singular > 0);   // boundary only
  assert.equal(run('sin', { basis: 'quad', alpha: 2.05 }).r.singular, 0);
});

test('convergence: ~h³ in u and ~h² in du/dx for the quadratic basis', () => {
  const ns = [11, 21, 41], eu = [], ed = [];
  for (const n of ns) {
    const nodes = M.makeNodes(n, 'regular');
    const U = M.sample(M.FN.sin.f, nodes.xs);
    const r = M.evaluate({ alpha: 2.5, basis: 'quad', weight: 'cubic' }, nodes, X, U, false);
    eu.push(M.relL2(r.uh, M.sample(M.FN.sin.f, X), X));
    ed.push(M.relL2(M.diff(r.uh, X), M.sample(M.FN.sin.d, X), X));
  }
  const rate = (e, i) => Math.log(e[i] / e[i + 1]) / Math.log((ns[i + 1] - 1) / (ns[i] - 1));
  const ru = rate(eu, 1), rd = rate(ed, 1);
  assert.ok(ru > 2.5 && ru < 3.6, `u rate ${ru}`);
  assert.ok(rd > 1.6 && rd < 2.6, `du rate ${rd}`);
});

test('sweep: α* is the minimum and singular α give NaN', () => {
  const nodes = M.makeNodes(11, 'regular');
  const alphas = []; for (let i = 0; i <= 70; i++) alphas.push(+(0.5 + i * 0.05).toFixed(2));
  const sw = M.sweep({ basis: 'quad', weight: 'cubic' }, nodes, X, 'sin', 'u', alphas);
  assert.ok(Number.isNaN(sw[0]));
  let best = -1; for (let i = 0; i < sw.length; i++) if (isFinite(sw[i]) && (best < 0 || sw[i] < sw[best])) best = i;
  assert.ok(best > 0 && alphas[best] > 2 && alphas[best] < 4, `α* = ${alphas[best]}`);
});
