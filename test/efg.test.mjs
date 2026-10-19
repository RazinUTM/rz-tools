// Numerical checks for the 2D EFG core. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { Math, Float64Array, Int32Array, Int8Array, Uint8Array, isFinite, NaN, Infinity, Date };
ctx.globalThis = ctx;
for (const f of ['../src/fem/core.js', '../src/efg/core.js']) vm.runInNewContext(readFileSync(new URL(f, import.meta.url), 'utf8'), ctx);
const G = ctx.RZEFG, F = ctx.RZFEM;
const base = { problem: 'cantilever', n: 4, ld: 5, support: 'exact', ar: 0.25, outer: 'kirsch', nu: 0.3, distort: 0, seed: 7,
               basis: 'lin', weight: 'cubic', alpha: 2.5, bc: 'nitsche', pexp: 3, ng: 4 };
const run = (o) => G.run(Object.assign({}, base, o));

test('MLS shape functions: partition of unity and reproduction of the basis, with derivatives', () => {
  for (const [basis, alpha] of [['lin', 2.5], ['quad', 3.5]]) for (const distort of [0, 0.3]) {
    const md = G.setup(Object.assign({}, base, { basis, alpha, distort })), S = G.Scratch(256);
    for (const [x, y] of [[0.37, 0.03], [1.91, -0.17], [0, 0.2], [1.2, 0.11]]) {
      const n = G.shape(md, x, y, S, true);
      let s = 0, sx = 0, sy = 0, dx = 0, dxx = 0, dy = 0, dyy = 0, sxy = 0;
      for (let k = 0; k < n; k++) {
        const I = S.idx[k], X = md.X[I], Y = md.Y[I];
        s += S.phi[k]; sx += S.phi[k] * X; sy += S.phi[k] * Y; sxy += S.phi[k] * X * Y;
        dx += S.dx[k]; dxx += S.dx[k] * X; dy += S.dy[k]; dyy += S.dy[k] * Y;
      }
      assert.ok(Math.abs(s - 1) < 1e-12 && Math.abs(sx - x) < 1e-12 && Math.abs(sy - y) < 1e-12, `${basis} (${x},${y}) reproduction`);
      assert.ok(Math.abs(dx) < 1e-8 && Math.abs(dy) < 1e-8 && Math.abs(dxx - 1) < 1e-8 && Math.abs(dyy - 1) < 1e-8, `${basis} derivative reproduction`);
      if (basis === 'quad') assert.ok(Math.abs(sxy - x * y) < 1e-11, 'quadratic term reproduced');
    }
  }
});

test('shape functions do not interpolate', () => {
  const m = run({});
  const I = 52, v = G.phiAt(m, I, m.md.X[I], m.md.Y[I]);
  assert.ok(v > 0.1 && v < 0.9, String(v));
});

test('patch test: integration error falls with more Gauss points but is not zero', () => {
  const e = (ng) => G.energyError(run({ problem: 'patch', n: 4, distort: 0.3, ng }));
  const e2 = e(2), e5 = e(5);
  assert.ok(e5 < e2 / 5, `${e2} → ${e5}`);
  assert.ok(e5 > 1e-8, 'EFG with cell quadrature is not exact');
});

test('cantilever: EFG beats bilinear FEM on the same nodes and converges', () => {
  const errs = [2, 4, 8].map((n) => G.energyError(run({ n })));
  assert.ok(errs[1] < errs[0] && errs[2] < errs[1], errs.join(' '));
  const fem = F.energyError(F.run(Object.assign({}, base, { elem: 'Q4', n: 8 })));
  assert.ok(errs[2] < fem / 3, `EFG ${errs[2]} vs Q4 ${fem}`);
  const tip = G.evalAt(run({ n: 8 }), 2, 0)[1] / run({ n: 8 }).pr.ref.tip;
  assert.ok(Math.abs(tip - 1) < 1e-3, String(tip));
});

test('penalty: too small or too large is worse than moderate; Nitsche is consistent', () => {
  const e = (p) => G.energyError(run({ bc: 'penalty', pexp: p }));
  const bc0 = G.bcError(run({ bc: 'penalty', pexp: 0 })).abs, bc4 = G.bcError(run({ bc: 'penalty', pexp: 4 })).abs;
  assert.ok(bc0 > 100 * bc4, 'weak enforcement with a small penalty');
  assert.ok(e(8) > 5 * e(3), 'over-constraint with a large penalty');
  assert.ok(G.energyError(run({ bc: 'nitsche' })) <= e(3) * 1.05);
});

test('too small a dilation parameter makes A(x) singular', () => {
  assert.equal(run({ alpha: 1.0 }).error !== undefined, true);
  assert.equal(run({ basis: 'quad', alpha: 1.5 }).error, 'singularA');
  assert.equal(run({ alpha: 1.5 }).error, undefined);
});

test('plate with a hole: stress concentration tends to 3', () => {
  const m = run({ problem: 'hole', n: 12, basis: 'quad', alpha: 3.5 });
  const scf = G.evalAt(m, 0, m.pr.a)[2] / m.pr.s0;
  assert.ok(Math.abs(scf - 3) < 0.03, String(scf));
});
