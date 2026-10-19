// Build the single-file bundle and the demo page.
//   dist/rz-tools.js      readable bundle (CSS injected at load time)
//   dist/rz-tools.min.js  minified bundle, the file the website loads
//   demo/index.html       standalone demo that loads ../dist/rz-tools.js
// Usage: npm run build
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { minify } from 'terser';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const pkg = JSON.parse(read('./package.json'));
const V = pkg.version;

// Order matters: registry first, then each tool's core and UI, then boot.
const TOOLS = [
  { name: 'mls', files: ['src/mls/core.js', 'src/mls/ui.js'] },
];

const css = read('./src/base.css');
const injectCss =
  "(function(){if(document.getElementById('rzt-css'))return;var s=document.createElement('style');" +
  "s.id='rzt-css';s.textContent=" + JSON.stringify(css) + ";(document.head||document.documentElement).appendChild(s);})();\n";

const banner = `/*! rz-tools v${V} | A. R. Zainal Abidin, Universiti Teknologi Malaysia | https://github.com/RazinUTM/rz-tools */\n`;
const boot =
  `window.RZTools.version='${V}';\n` +
  "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',window.RZTools.boot);else window.RZTools.boot();\n";

const body = [read('./src/registry.js'), ...TOOLS.flatMap((t) => t.files.map((f) => read('./' + f)))].join('\n');
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

// Demo page: template + explanation blocks
const demo = read('./demo/template.html')
  .replaceAll('{{VERSION}}', V)
  .replace('{{DOC_MLS}}', read('./src/mls/doc.html'));
writeFileSync(new URL('./demo/index.html', import.meta.url), demo);

const sri = (s) => 'sha384-' + createHash('sha384').update(s, 'utf8').digest('base64');
console.log(`rz-tools v${V}`);
console.log(`  dist/rz-tools.js      ${(bundle.length / 1024).toFixed(1)} KB`);
console.log(`  dist/rz-tools.min.js  ${(min.code.length / 1024).toFixed(1)} KB  ${sri(min.code)}`);
console.log(`  tools: ${TOOLS.map((t) => t.name).join(', ')}`);
