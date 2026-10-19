// Build the single-file bundle and the demo page.
//   dist/rz-tools.js      readable bundle (CSS injected at load time)
//   dist/rz-tools.min.js  minified bundle, the file the website loads
//   demo/<tool>.html      standalone demo pages that load ../dist/rz-tools.js
// Usage: npm run build
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { minify } from 'terser';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const pkg = JSON.parse(read('./package.json'));
const V = pkg.version;

// Order matters: registry first, then each tool's core and UI, then boot.
const SHARED = ['src/registry.js', 'src/shared.js'];
const TOOLS = [
  { name: 'mls', files: ['src/mls/core.js', 'src/mls/ui.js'] },
  { name: 'fem2d', files: ['src/fem/core.js', 'src/fem/ui.js'] },
  { name: 'bar1d', files: ['src/bar/core.js', 'src/bar/ui.js'] },
  { name: 'efg2d', files: ['src/efg/core.js', 'src/efg/ui.js'] },
];

const css = read('./src/base.css');
const injectCss =
  "(function(){if(document.getElementById('rzt-css'))return;var s=document.createElement('style');" +
  "s.id='rzt-css';s.textContent=" + JSON.stringify(css) + ";(document.head||document.documentElement).appendChild(s);})();\n";

const banner = `/*! rz-tools v${V} | A. R. Zainal Abidin, Universiti Teknologi Malaysia | https://github.com/RazinUTM/rz-tools */\n`;
const boot =
  `window.RZTools.version='${V}';\n` +
  "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',window.RZTools.boot);else window.RZTools.boot();\n";

const body = [...SHARED, ...TOOLS.flatMap((t) => t.files)].map((f) => read('./' + f)).join('\n');
const bundle = banner + injectCss + body + '\n' + boot;

const min = await minify(bundle, {
  compress: { passes: 2 },
  mangle: true,
  format: { comments: /^!/ },
});
if (min.error) throw min.error;

mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('./dist/rz-tools.js', import.meta.url), bundle);
writeFileSync(new URL('./dist/rz-tools.min.js', import.meta.url), min.code);

// Demo pages: one per tool, from a shared template
const DEMOS = {
  mls: { title: 'MLS Approximation Explorer', eyebrow: 'Meshfree methods', doc: 'src/mls/doc.html',
    desc: 'Interactive Moving Least Squares (MLS) approximation explorer: dilation parameter, basis, weight function, shape functions and error sweep.',
    en: 'Change the dilation parameter &alpha;, the basis and the weight function, and watch how the Moving Least Squares approximation, its shape functions and its error respond. The sweep finds the &alpha; that minimises the error for your current settings.',
    ms: 'Ubah dilation parameter &alpha;, basis dan weight function, dan lihat bagaimana Moving Least Squares approximation, shape functions dan ralatnya bertindak balas. Sweep mencari &alpha; yang meminimumkan ralat bagi tetapan semasa anda.' },
  fem2d: { title: '2D Plane Stress FEM Explorer', eyebrow: 'Finite element method', doc: 'src/fem/doc.html',
    desc: 'Interactive 2D plane stress finite element solver with T3, Q4, QM6 and Q8 elements, stress contours, exact benchmarks and convergence studies.',
    en: 'Solve three classic plane stress benchmarks with four element types, then compare the stresses and deflections with the exact solutions. See shear locking, stress averaging, mesh distortion and convergence rates for yourself.',
    ms: 'Selesaikan tiga benchmark plane stress klasik dengan empat jenis element, kemudian bandingkan tegasan dan pesongan dengan exact solution. Lihat sendiri shear locking, purata tegasan, herotan mesh dan kadar convergence.' },
  bar1d: { title: '1D Bar FEM Explorer', eyebrow: 'Finite element method', doc: 'src/bar/doc.html',
    desc: 'Interactive 1D axial bar finite element solver: tip and distributed loads, tapered section, linear and quadratic elements, exact solution and convergence.',
    en: 'An axially loaded bar, fixed at one end. Change the material, geometry, loads and mesh, and compare the finite element displacement and stress with the exact solution.',
    ms: 'Bar yang dibebankan secara paksi, ditetapkan pada satu hujung. Ubah bahan, geometri, beban dan mesh, dan bandingkan sesaran dan tegasan finite element dengan exact solution.' },
  efg2d: { title: '2D Meshfree EFG Explorer', eyebrow: 'Meshfree methods', doc: 'src/efg/doc.html',
    desc: 'Interactive 2D Element-Free Galerkin solver with MLS shape functions, penalty and Nitsche boundary conditions, and a comparison with finite elements on exact benchmarks.',
    en: 'Solve the same plane stress benchmarks with the Element-Free Galerkin method: nodes only, no elements. Change the basis, the dilation parameter, the integration and the treatment of the boundary conditions, and compare the accuracy with finite elements on the same nodes.',
    ms: 'Selesaikan benchmark plane stress yang sama dengan Element-Free Galerkin method: nod sahaja, tanpa element. Ubah basis, dilation parameter, kamiran dan rawatan syarat sempadan, dan bandingkan ketepatannya dengan finite element pada nod yang sama.' },
};
const tpl = read('./demo/template.html');
for (const [name, d] of Object.entries(DEMOS)) {
  const html = tpl.replaceAll('{{VERSION}}', V).replaceAll('{{TITLE}}', d.title).replaceAll('{{EYEBROW}}', d.eyebrow)
    .replace('{{DESC}}', d.desc).replace('{{LEAD_EN}}', d.en).replace('{{LEAD_MS}}', d.ms).replace('{{TOOL}}', name).replace('{{DOC}}', read('./' + d.doc));
  writeFileSync(new URL(`./demo/${name}.html`, import.meta.url), html);
}

const sri = (s) => 'sha384-' + createHash('sha384').update(s, 'utf8').digest('base64');
console.log(`rz-tools v${V}`);
console.log(`  dist/rz-tools.js      ${(bundle.length / 1024).toFixed(1)} KB`);
console.log(`  dist/rz-tools.min.js  ${(min.code.length / 1024).toFixed(1)} KB  ${sri(min.code)}`);
console.log(`  tools: ${TOOLS.map((t) => t.name).join(', ')}`);
