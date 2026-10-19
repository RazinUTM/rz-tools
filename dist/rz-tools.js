/*! rz-tools v1.1.0 | A. R. Zainal Abidin, Universiti Teknologi Malaysia | https://github.com/RazinUTM/rz-tools */
(function(){if(document.getElementById('rzt-css'))return;var s=document.createElement('style');s.id='rzt-css';s.textContent="/* ═══════════════════════════════════════════════════════════════\n   Shared styles for interactive tools (.rzt). Every selector starts with\n   .rzt.rzt-on so it outranks theme rules like `body.x .entry-content p`.\n   Colours come from the host tokens with UTM fallbacks.\n   ═══════════════════════════════════════════════════════════════ */\n.rzt.rzt-on {\n  --rzt-ok: #2A6B2A; --rzt-ok-bg: #EAF5EA; --rzt-warn: #8B5E00; --rzt-warn-bg: #FFF4E0; --rzt-bad: #A52A2A; --rzt-bad-bg: #FBECEC;\n  font-family: 'Poppins', system-ui, -apple-system, sans-serif; font-size: 15px; line-height: 1.5;\n  color: var(--fg, #0F1624); text-align: left;\n}\nbody.razin-dark .rzt.rzt-on, .rzt.rzt-on.is-dark {\n  --rzt-ok: #7AC97A; --rzt-ok-bg: #0D2B0D; --rzt-warn: #E0B44A; --rzt-warn-bg: #2B1E00; --rzt-bad: #F08A8A; --rzt-bad-bg: #3A1414;\n}\n.rzt.rzt-on *, .rzt.rzt-on *::before, .rzt.rzt-on *::after { box-sizing: border-box; }\n.rzt.rzt-on .rzt-body { display: grid; grid-template-columns: 272px minmax(0, 1fr); gap: 20px; align-items: start; }\n@media (max-width: 880px) { .rzt.rzt-on .rzt-body { grid-template-columns: minmax(0, 1fr); } }\n\n/* controls */\n.rzt.rzt-on .rzt-ctrl {\n  display: flex; flex-direction: column; gap: 16px; padding: 18px;\n  background: var(--surface, #fff); border: 1px solid var(--border, #DDE3EF); border-radius: 6px;\n  position: sticky; top: calc(var(--rz-nav-h, 0px) + 14px);\n}\n@media (max-width: 880px) { .rzt.rzt-on .rzt-ctrl { position: static; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px 12px; padding: 14px; } }\n.rzt.rzt-on .rzt-nt { text-transform: none; }\n.rzt.rzt-on .rzt-field { display: flex; flex-direction: column; gap: 7px; margin: 0; padding: 0; min-width: 0; }\n.rzt.rzt-on .rzt-lab {\n  display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin: 0;\n  font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px; font-weight: 500;\n  letter-spacing: .07em; text-transform: uppercase; color: var(--fg2, #5D6B85);\n}\n.rzt.rzt-on .rzt-lab output { font-size: 13px; font-weight: 600; letter-spacing: 0; text-transform: none; color: var(--accent, #7B1535); font-variant-numeric: tabular-nums; }\n.rzt.rzt-on .rzt-sel {\n  width: 100%; margin: 0; padding: 8px 10px; font: inherit; font-size: 14px; line-height: 1.3;\n  color: var(--fg, #0F1624); background: var(--bg, #F4F6FA); border: 1px solid var(--border, #DDE3EF); border-radius: 4px; height: auto;\n}\n.rzt.rzt-on .rzt-sel:focus-visible, .rzt.rzt-on .rzt-rng:focus-visible, .rzt.rzt-on button:focus-visible { outline: 2px solid var(--accent, #7B1535); outline-offset: 2px; }\n.rzt.rzt-on .rzt-rng { width: 100%; margin: 4px 0 0; padding: 0; accent-color: var(--accent, #7B1535); background: transparent; border: 0; height: 22px; }\n.rzt.rzt-on .rzt-seg { display: flex; margin: 0; border: 1px solid var(--border, #DDE3EF); border-radius: 4px; overflow: hidden; }\n.rzt.rzt-on .rzt-seg button {\n  flex: 1; margin: 0; padding: 7px 6px; font: inherit; font-size: 13px; line-height: 1.2; cursor: pointer;\n  color: var(--fg2, #5D6B85); background: var(--surface, #fff); border: 0; border-radius: 0; box-shadow: none;\n}\n.rzt.rzt-on .rzt-seg button + button { border-left: 1px solid var(--border, #DDE3EF); }\n.rzt.rzt-on .rzt-seg button[aria-pressed=\"true\"] { background: var(--accent, #7B1535); color: #fff; }\n.rzt.rzt-on .rzt-btn {\n  margin: 0; padding: 6px 12px; font: inherit; font-size: 13px; line-height: 1.2; cursor: pointer; align-self: flex-start;\n  color: var(--fg2, #5D6B85); background: var(--surface, #fff); border: 1px solid var(--border, #DDE3EF); border-radius: 4px; box-shadow: none;\n}\n.rzt.rzt-on .rzt-btn:hover { border-color: var(--accent, #7B1535); color: var(--accent, #7B1535); }\n.rzt.rzt-on .rzt-stepper { display: flex; align-items: center; gap: 8px; }\n.rzt.rzt-on .rzt-stepper output { flex: 1; text-align: center; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 13px; color: var(--fg, #0F1624); font-variant-numeric: tabular-nums; }\n.rzt.rzt-on .rzt-stepper .rzt-btn { padding: 4px 12px; font-size: 16px; }\n.rzt.rzt-on .rzt-reset { align-self: stretch; text-align: center; }\n\n/* metrics */\n.rzt.rzt-on .rzt-main { display: flex; flex-direction: column; gap: 14px; min-width: 0; }\n.rzt.rzt-on .rzt-metrics {\n  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; margin: 0;\n  background: var(--border, #DDE3EF); border: 1px solid var(--border, #DDE3EF); border-radius: 6px; overflow: hidden;\n}\n@media (max-width: 560px) { .rzt.rzt-on .rzt-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } }\n.rzt.rzt-on .rzt-m { display: flex; flex-direction: column; gap: 3px; padding: 11px 14px; background: var(--surface, #fff); min-width: 0; }\n.rzt.rzt-on .rzt-mv { font-size: 19px; font-weight: 600; line-height: 1.15; color: var(--fg, #0F1624); font-variant-numeric: tabular-nums; white-space: nowrap; }\n.rzt.rzt-on .rzt-ml { font-size: 12px; line-height: 1.35; color: var(--fg2, #5D6B85); }\n.rzt.rzt-on .rzt-chip { display: inline-block; margin-left: 2px; padding: 0 6px; border-radius: 3px; font-size: 11px; font-weight: 600; white-space: nowrap; }\n.rzt.rzt-on .rzt-chip.is-good { background: var(--rzt-ok-bg); color: var(--rzt-ok); }\n.rzt.rzt-on .rzt-chip.is-ok { background: var(--rzt-warn-bg); color: var(--rzt-warn); }\n.rzt.rzt-on .rzt-chip.is-bad { background: var(--rzt-bad-bg); color: var(--rzt-bad); }\n.rzt.rzt-on .rzt-note { margin: 0; padding: 10px 14px; font-size: 13.5px; line-height: 1.5; border-radius: 0 4px 4px 0; color: var(--fg, #0F1624); }\n.rzt.rzt-on .rzt-warn { background: var(--rzt-warn-bg); border-left: 3px solid var(--rzt-warn); }\n.rzt.rzt-on .rzt-ok { background: var(--rzt-ok-bg); border-left: 3px solid var(--rzt-ok); }\n\n/* plots */\n.rzt.rzt-on .rzt-plot { position: relative; margin: 0; padding: 14px 14px 8px; background: var(--surface, #fff); border: 1px solid var(--border, #DDE3EF); border-radius: 6px; }\n.rzt.rzt-on .rzt-ph { display: flex; flex-direction: column; gap: 3px; margin: 0 0 8px; }\n.rzt.rzt-on .rzt-h { font-size: 15px; font-weight: 600; line-height: 1.3; color: var(--fg, #0F1624); }\n.rzt.rzt-on .rzt-sub { font-size: 12.5px; line-height: 1.45; color: var(--fg2, #5D6B85); max-width: 68ch; }\n.rzt.rzt-on .rzt-legend { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 4px; font-size: 12px; color: var(--fg2, #5D6B85); }\n.rzt.rzt-on .rzt-legend span { display: inline-flex; align-items: center; gap: 6px; }\n.rzt.rzt-on .rzt-sw { display: inline-block; flex-shrink: 0; }\n.rzt.rzt-on .rzt-sw.line { width: 18px; height: 0; border-top: 2.5px solid; }\n.rzt.rzt-on .rzt-sw.dash { width: 18px; height: 0; border-top: 2px dashed; }\n.rzt.rzt-on .rzt-sw.dot { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid; }\n.rzt.rzt-on .rzt-sw.band { width: 14px; height: 10px; border-radius: 2px; }\n.rzt.rzt-on .rzt-cv { display: block; width: 100%; height: 210px; margin: 0; cursor: pointer; touch-action: manipulation; }\n.rzt.rzt-on .rzt-cv-main { height: 270px; }\n@media (max-width: 560px) { .rzt.rzt-on .rzt-cv { height: 180px; } .rzt.rzt-on .rzt-cv-main { height: 220px; } }\n.rzt.rzt-on .rzt-read { position: absolute; right: 16px; top: 14px; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 12px; color: var(--fg, #0F1624); font-variant-numeric: tabular-nums; }\n\n/* shared additions: groups, size line, overlays, colour bar, markers */\n@media (min-width: 881px) { .rzt.rzt-on .rzt-ctrl { max-height: calc(100vh - var(--rz-nav-h, 0px) - 28px); overflow-y: auto; } }\n.rzt.rzt-on .rzt-grp { grid-column: 1 / -1; margin: 2px 0 -6px; padding: 12px 0 0; border-top: 1px solid var(--border, #DDE3EF); font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--accent, #7B1535); }\n.rzt.rzt-on .rzt-grp:first-child { border-top: 0; padding-top: 0; }\n.rzt.rzt-on .rzt-wide { grid-column: 1 / -1; }\n.rzt.rzt-on .rzt-field[hidden] { display: none; }\n.rzt.rzt-on .rzt-field.is-off { opacity: .45; }\n.rzt.rzt-on .rzt-size { font-size: 11.5px; line-height: 1.35; color: var(--fg2, #5D6B85); font-variant-numeric: tabular-nums; }\n.rzt.rzt-on .rzt-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 12px; margin-top: 8px; }\n.rzt.rzt-on .rzt-primary { background: var(--accent, #7B1535); border-color: var(--accent, #7B1535); color: #fff; }\n.rzt.rzt-on .rzt-primary:hover { color: #fff; opacity: .9; }\n.rzt.rzt-on .rzt-btn:disabled { opacity: .5; cursor: default; }\n.rzt.rzt-on .rzt-sel-inline { width: auto; max-width: 100%; margin: 2px 0 0; padding: 6px 8px; font-size: 13px; }\n.rzt.rzt-on .rzt-cvwrap { position: relative; }\n.rzt.rzt-on .rzt-cv-fem { height: 320px; cursor: crosshair; }\n.rzt.rzt-on .rzt-ov { position: absolute; left: 0; top: 0; width: 100%; height: 100%; cursor: crosshair; touch-action: manipulation; }\n.rzt.rzt-on .rzt-cbar { position: relative; margin: 6px 0 0; padding-right: 40px; }\n.rzt.rzt-on .rzt-cb-sw { display: flex; height: 12px; border-radius: 2px; overflow: hidden; }\n.rzt.rzt-on .rzt-cb-sw i { flex: 1; }\n.rzt.rzt-on .rzt-cb-tk { position: relative; height: 20px; }\n.rzt.rzt-on .rzt-cb-tk b, .rzt.rzt-on .rzt-cb-u { position: absolute; top: 4px; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px; font-weight: 400; line-height: 1.2; color: var(--fg2, #5D6B85); white-space: nowrap; font-variant-numeric: tabular-nums; }\n.rzt.rzt-on .rzt-cb-u { top: -1px; right: 0; color: var(--fg, #0F1624); }\n.rzt.rzt-on .rzt-read-b, .rzt.rzt-on .rzt-plot .rzt-read[data-read=\"2\"], .rzt.rzt-on .rzt-plot .rzt-read[data-read=\"3\"] { position: static; display: block; min-height: 18px; margin-top: 4px; }\n.rzt.rzt-on .rzt-sw.mk { width: 10px; height: 10px; }\n.rzt.rzt-on .rzt-sw.mk-circle { border-radius: 50%; }\n.rzt.rzt-on .rzt-sw.mk-square { border-radius: 1px; }\n.rzt.rzt-on .rzt-sw.mk-tri { clip-path: polygon(50% 0, 100% 100%, 0 100%); }\n.rzt.rzt-on .rzt-sw.mk-diamond { clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); }\n\n/* explanation blocks (rendered by the host page, styled here) */\n.rzt-doc details { margin: 0 0 10px; background: var(--surface, #fff); border: 1px solid var(--border, #DDE3EF); border-radius: 6px; }\n.rzt-doc summary { cursor: pointer; padding: 13px 16px; font-weight: 600; color: var(--fg, #0F1624); }\n.rzt-doc details > div { padding: 0 18px 14px; color: var(--fg2, #5D6B85); font-size: 14.5px; line-height: 1.65; }\n.rzt-doc .rzt-eq { margin: 10px 0; padding: 10px 14px; overflow-x: auto; white-space: nowrap; background: var(--bg, #F4F6FA); border-radius: 4px; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 13.5px; color: var(--fg, #0F1624); }\n.rzt-doc ul, .rzt-doc ol { margin: 8px 0; padding-left: 1.3em; }\n.rzt-doc li { margin-bottom: 6px; }\n.rzt-doc b { color: var(--fg, #0F1624); }\n/* themes such as Divi reset sub/sup to the baseline; restore them without disturbing line height */\n.rzt-doc sub, .rzt-doc sup, .rzt.rzt-on sub, .rzt.rzt-on sup { position: relative; font-size: 75%; line-height: 0; vertical-align: baseline; }\n.rzt-doc sub, .rzt.rzt-on sub { bottom: -0.25em; }\n.rzt-doc sup, .rzt.rzt-on sup { top: -0.5em; }\n@media (prefers-reduced-motion: reduce) { .rzt.rzt-on * { transition: none !important; } }\n";(document.head||document.documentElement).appendChild(s);})();
/* ═══════════════════════════════════════════════════════════════
   Tool registry. Each tool calls RZTools.register(name, mountFn).
   Any element <div data-rz-tool="name"></div> on the page is mounted
   once the bundle has loaded. Mounting is idempotent.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var RZT = window.RZTools = window.RZTools || {};
  var reg = RZT._reg = RZT._reg || {};

  RZT.register = function (name, fn) { reg[name] = fn; };
  RZT.list = function () { return Object.keys(reg); };

  RZT.mount = function (el) {
    if (!el || el.getAttribute('data-rzt-mounted')) return false;
    var name = el.getAttribute('data-rz-tool'), fn = reg[name];
    if (!fn) {
      el.textContent = 'Unknown interactive tool: "' + name + '". Available: ' + RZT.list().join(', ') + '.';
      return false;
    }
    el.setAttribute('data-rzt-mounted', '1');
    try { fn(el); return true; }
    catch (err) {
      el.textContent = 'This interactive tool could not start in your browser. Please try a recent version of Chrome, Edge, Firefox or Safari.';
      if (window.console) console.error('[rz-tools]', name, err);
      return false;
    }
  };

  RZT.boot = function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-rz-tool]'), RZT.mount);
  };
})();

/* ═══════════════════════════════════════════════════════════════
   Shared helpers for all tools: number formatting, host colours,
   OKLab colour ramps and a small dependency-free canvas plotter.
   Exposed as RZTools.util.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var U = window.RZTools.util = window.RZTools.util || {};

  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function supNum(e) { return String(e).split('').map(function (c) { return SUP[c]; }).join(''); }
  U.sci = function (v) {
    if (!isFinite(v)) return '—';
    if (v === 0) return '0';
    var e = Math.floor(Math.log10(Math.abs(v))), mant = v / Math.pow(10, e);
    if (Math.abs(mant) >= 9.995) { mant /= 10; e++; }
    if (e >= -2 && e <= 3) return v.toPrecision(3).replace(/\.?0+$/, function (z) { return z.indexOf('.') === 0 ? '' : z; });
    return mant.toFixed(2) + ' × 10' + supNum(e);
  };
  U.pow10Label = function (e) { return '10' + supNum(e); };
  U.fill = function (s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k]; }); };
  U.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  U.group = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };

  /* ── colours from the host page ─────────────────────────────── */
  U.readColors = function (el) {
    var cs = getComputedStyle(el);
    function v(n, d) { var x = cs.getPropertyValue(n).trim(); return x || d; }
    var C = { accent: v('--accent', '#7B1535'), gold: v('--gold', '#C8A020'), fg: v('--fg', '#0F1624'),
              fg2: v('--fg2', '#5D6B85'), border: v('--border', '#DDE3EF'), surface: v('--surface', '#FFFFFF') };
    C.dark = luminance(C.surface) < 0.25;
    return C;
  };
  function hexRgb(c) {
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(c).trim());
    if (m) {
      var h = m[1]; if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    var r = /rgba?\(([^)]+)\)/.exec(c);
    if (r) return r[1].split(',').slice(0, 3).map(function (x) { return parseFloat(x); });
    return [128, 128, 128];
  }
  function luminance(c) {
    var p = hexRgb(c).map(function (x) { x /= 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
  }
  U.rgba = function (c, a) { var p = hexRgb(c); return 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + a + ')'; };

  /* ── OKLab ramps (perceptually even steps) ──────────────────── */
  function toLin(x) { x /= 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }
  function fromLin(x) { x = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(x * 255))); }
  function toOklab(hex) {
    var p = hexRgb(hex), r = toLin(p[0]), g = toLin(p[1]), b = toLin(p[2]);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function fromOklab(L) {
    var l = Math.pow(L[0] + 0.3963377774 * L[1] + 0.2158037573 * L[2], 3), m = Math.pow(L[0] - 0.1055613458 * L[1] - 0.0638541728 * L[2], 3),
        s = Math.pow(L[0] - 0.0894841775 * L[1] - 1.2914855480 * L[2], 3);
    var r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    return '#' + [fromLin(r), fromLin(g), fromLin(b)].map(function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
  }
  // n colours spread evenly along a piecewise-linear OKLab path through the stops
  U.ramp = function (stops, n) {
    var L = stops.map(toOklab), out = [];
    for (var i = 0; i < n; i++) {
      var t = n === 1 ? 0.5 : i / (n - 1), x = t * (L.length - 1), k = Math.min(L.length - 2, Math.floor(x)), f = x - k;
      out.push(fromOklab([0, 1, 2].map(function (c) { return L[k][c] + f * (L[k + 1][c] - L[k][c]); })));
    }
    return out;
  };
  // Sequential = one hue light→dark (flipped on dark surfaces); diverging = blue ↔ neutral ↔ maroon.
  U.scales = function (C) {
    return C.dark
      ? { seq: ['#2A1823', '#9C3F5E', '#F6C2D0'], div: ['#7FB0EE', '#3A3A40', '#E57E98'] }
      : { seq: ['#F6EBEE', '#C46A86', '#4F0B21'], div: ['#184f95', '#ECEBE8', '#7B1535'] };
  };
  // Categorical slots 1–4 (validated order) for series
  U.series = function (C) {
    return C.dark ? ['#3987e5', '#d95926', '#199e70', '#c98500'] : ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'];
  };

  /* ── minimal canvas plotter ──────────────────────────────────── */
  function niceStep(range, count) {
    var raw = range / count, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag;
    return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
  }
  U.niceStep = niceStep;
  function marker(g, shape, x, y, r) {
    g.beginPath();
    if (shape === 'square') g.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7);
    else if (shape === 'tri') { g.moveTo(x, y - r * 1.1); g.lineTo(x + r, y + r * 0.75); g.lineTo(x - r, y + r * 0.75); g.closePath(); }
    else if (shape === 'diamond') { g.moveTo(x, y - r * 1.15); g.lineTo(x + r * 1.15, y); g.lineTo(x, y + r * 1.15); g.lineTo(x - r * 1.15, y); g.closePath(); }
    else g.arc(x, y, r, 0, Math.PI * 2);
  }
  U.marker = marker;
  function fmtTick(v, st) {
    var dec = Math.max(0, -Math.floor(Math.log10(st)));
    if (Math.abs(v) < st * 1e-9) v = 0;
    var out = (Math.abs(v) >= 1e4 || (st < 1e-3)) ? U.sci(v) : v.toFixed(Math.min(dec, 3));
    return out.replace(/^-/, '\u2212');
  }
  U.plot = function (cv, spec, C) {
    var dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
    if (!W || !H) return null;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    var g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    var mg = { l: spec.ml || 52, r: 12, t: 10, b: 26 }, xr = spec.xr, yr = spec.yr, ly = !!spec.ylog, lx = !!spec.xlog;
    var ty = ly ? Math.log10 : function (v) { return v; }, tx = lx ? Math.log10 : function (v) { return v; };
    var y0 = ty(yr[0]), y1 = ty(yr[1]), x0 = tx(xr[0]), x1 = tx(xr[1]), pw = W - mg.l - mg.r, ph = H - mg.t - mg.b;
    function X(v) { return mg.l + (tx(v) - x0) / (x1 - x0) * pw; }
    function Y(v) { return mg.t + (1 - (ty(v) - y0) / (y1 - y0)) * ph; }
    var mono = '11px "IBM Plex Mono", ui-monospace, monospace';
    g.font = mono; g.lineWidth = 1;

    // grid + ticks
    g.strokeStyle = C.border; g.fillStyle = C.fg2; g.textBaseline = 'middle'; g.textAlign = 'right';
    var yt = [];
    if (ly) { for (var e = Math.ceil(y0 - 1e-9); e <= Math.floor(y1 + 1e-9); e++) yt.push({ v: Math.pow(10, e), s: U.pow10Label(e) }); }
    else {
      var st = niceStep(yr[1] - yr[0], 5);
      for (var v = Math.ceil(yr[0] / st) * st; v <= yr[1] + st * 1e-9; v += st) yt.push({ v: v, s: fmtTick(v, st) });
    }
    yt.forEach(function (t) { var y = Math.round(Y(t.v)) + 0.5; g.beginPath(); g.moveTo(mg.l, y); g.lineTo(W - mg.r, y); g.stroke(); g.fillText(t.s, mg.l - 6, y); });
    g.textAlign = 'center'; g.textBaseline = 'top';
    if (lx) {
      for (var ex = Math.ceil(x0 - 1e-9); ex <= Math.floor(x1 + 1e-9); ex++) {
        var px = Math.round(X(Math.pow(10, ex))) + 0.5;
        g.beginPath(); g.moveTo(px, mg.t); g.lineTo(px, H - mg.b); g.stroke(); g.fillText(U.pow10Label(ex), px, H - mg.b + 6);
      }
    } else {
      var xs = niceStep(xr[1] - xr[0], Math.max(3, Math.floor(pw / 80)));
      for (var xv = Math.ceil(xr[0] / xs) * xs; xv <= xr[1] + xs * 1e-9; xv += xs) {
        var x = Math.round(X(xv)) + 0.5;
        g.beginPath(); g.moveTo(x, mg.t); g.lineTo(x, H - mg.b); g.stroke();
        g.fillText(fmtTick(xv, xs), x, H - mg.b + 6);
      }
    }
    if (spec.xlabel) { g.textAlign = 'right'; g.textBaseline = 'bottom'; g.fillText(spec.xlabel, W - mg.r, H - mg.b - 3); }
    if (spec.ylabel) { g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText(spec.ylabel, mg.l + 4, mg.t + 2); }

    g.save(); g.beginPath(); g.rect(mg.l, mg.t, pw, ph); g.clip();
    (spec.bands || []).forEach(function (b) {
      g.fillStyle = b.fill; var a = X(b.x0), c = X(b.x1); g.fillRect(a, mg.t, c - a, ph);
      if (b.edge) { g.strokeStyle = b.edge; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(a, mg.t); g.lineTo(a, mg.t + ph); g.moveTo(c, mg.t); g.lineTo(c, mg.t + ph); g.stroke(); g.setLineDash([]); }
    });
    (spec.hlines || []).forEach(function (h) { g.strokeStyle = h.stroke; g.lineWidth = h.width || 1; g.setLineDash(h.dash || []); var y = Y(h.y); g.beginPath(); g.moveTo(mg.l, y); g.lineTo(W - mg.r, y); g.stroke(); g.setLineDash([]); });
    (spec.lines || []).forEach(function (L) {
      g.strokeStyle = L.stroke; g.lineWidth = L.width || 1.5; g.setLineDash(L.dash || []); g.lineJoin = 'round';
      g.beginPath(); var pen = false;
      for (var k = 0; k < L.x.length; k++) {
        var yv = L.y[k];
        if (!isFinite(yv) || (ly && yv <= 0)) { pen = false; continue; }
        var px = X(L.x[k]), py = Y(yv);
        if (pen) g.lineTo(px, py); else { g.moveTo(px, py); pen = true; }
      }
      g.stroke(); g.setLineDash([]);
    });
    (spec.vlines || []).forEach(function (V) { g.strokeStyle = V.stroke; g.lineWidth = V.width || 1.5; g.setLineDash(V.dash || []); var x = X(V.x); g.beginPath(); g.moveTo(x, mg.t); g.lineTo(x, mg.t + ph); g.stroke(); g.setLineDash([]); });
    (spec.ticks || []).forEach(function (t) { g.strokeStyle = t.stroke; g.lineWidth = t.width || 1.5; var x = X(t.x); g.beginPath(); g.moveTo(x, mg.t + ph); g.lineTo(x, mg.t + ph - (t.len || 7)); g.stroke(); });
    (spec.points || []).forEach(function (P) {
      if (!isFinite(P.y) || (ly && P.y <= 0)) return;
      marker(g, P.shape, X(P.x), Y(P.y), P.r || 3.5);
      if (P.fill) { g.fillStyle = P.fill; g.fill(); }
      if (P.stroke) { g.strokeStyle = P.stroke; g.lineWidth = P.lw || 1.2; g.stroke(); }
    });
    (spec.labels || []).forEach(function (L) { g.font = L.font || mono; g.fillStyle = L.fill; g.textAlign = L.align || 'left'; g.textBaseline = L.base || 'top'; g.fillText(L.text, L.px != null ? L.px : X(L.x), L.py != null ? L.py : Y(L.y)); });
    g.restore();
    return { X: X, Y: Y, invX: function (p) { var t = x0 + (p - mg.l) / pw * (x1 - x0); return lx ? Math.pow(10, t) : t; }, mg: mg, W: W, H: H };
  };

  // Legend markup: items {t, c, type: 'line'|'dash'|'dot'|'band'|'marker', shape, b}
  U.legendHtml = function (items) {
    return items.map(function (it) {
      var sw;
      if (it.type === 'dot') sw = '<i class="rzt-sw dot" style="background:' + it.c + ';border-color:' + (it.b || it.c) + '"></i>';
      else if (it.type === 'band') sw = '<i class="rzt-sw band" style="background:' + it.c + '"></i>';
      else if (it.type === 'marker') sw = '<i class="rzt-sw mk mk-' + (it.shape || 'circle') + '" style="background:' + it.c + '"></i>';
      else sw = '<i class="rzt-sw ' + (it.type === 'dash' || it.dash ? 'dash' : 'line') + '" style="border-color:' + it.c + '"></i>';
      return '<span>' + sw + it.t + '</span>';
    }).join('');
  };
})();

/* ═══════════════════════════════════════════════════════════════
   MLS core — 1D Moving Least Squares approximation
   Shifted & scaled monomial basis p(s) = [1, s, s²], s = (x_I − x)/h,
   so p(0) = e₁ and φ_I(x) = w_I(x) · [A⁻¹(x) p(s_I)]₁.
   Support radius d = α·h, h = nominal nodal spacing.
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  function weight(kind, r) {
    if (r >= 1) return 0;
    if (kind === 'cubic') return r <= 0.5 ? (2 / 3 - 4 * r * r + 4 * r * r * r)
                                          : (4 / 3 - 4 * r + 4 * r * r - (4 / 3) * r * r * r);
    if (kind === 'quartic') return 1 - 6 * r * r + 8 * r * r * r - 3 * r * r * r * r;
    var c = 0.4, e1 = Math.exp(-1 / (c * c));                 // truncated Gaussian
    return (Math.exp(-(r * r) / (c * c)) - e1) / (1 - e1);
  }

  var FN = {
    sin:   { label: 'sin(2πx)',
             f: function (x) { return Math.sin(2 * Math.PI * x); },
             d: function (x) { return 2 * Math.PI * Math.cos(2 * Math.PI * x); } },
    quad:  { label: '1 + 2x − 3x²',
             f: function (x) { return 1 + 2 * x - 3 * x * x; },
             d: function (x) { return 2 - 6 * x; } },
    cubic: { label: '(2x − 1)³',
             f: function (x) { var t = 2 * x - 1; return t * t * t; },
             d: function (x) { var t = 2 * x - 1; return 6 * t * t; } },
    runge: { label: '1 / (1 + 25(2x − 1)²)',
             f: function (x) { var t = 2 * x - 1; return 1 / (1 + 25 * t * t); },
             d: function (x) { var t = 2 * x - 1, q = 1 + 25 * t * t; return -100 * t / (q * q); } },
    tanh:  { label: 'tanh(20(x − ½))',
             f: function (x) { return Math.tanh(20 * (x - 0.5)); },
             d: function (x) { var t = Math.tanh(20 * (x - 0.5)); return 20 * (1 - t * t); } }
  };

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function makeNodes(n, layout, seed) {
    var h = 1 / (n - 1), xs = new Float64Array(n), i;
    for (i = 0; i < n; i++) xs[i] = i * h;
    if (layout === 'irregular') {
      var rnd = mulberry32(seed || 1);
      for (i = 1; i < n - 1; i++) xs[i] += (rnd() - 0.5) * 0.7 * h;   // ±0.35 h, order preserved
    }
    return { xs: xs, h: h };
  }

  function grid(N) { var X = new Float64Array(N); for (var k = 0; k < N; k++) X[k] = k / (N - 1); return X; }

  // Inverse of a small symmetric m×m matrix stored row-major in a 3×3 buffer. Returns null if singular.
  function invSmall(A, m) {
    var M = new Float64Array(18), i, j, k, r, piv, f, scale = 0;
    for (i = 0; i < m; i++) for (j = 0; j < m; j++) { M[i * 6 + j] = A[i * 3 + j]; scale = Math.max(scale, Math.abs(A[i * 3 + j])); }
    for (i = 0; i < m; i++) M[i * 6 + 3 + i] = 1;
    for (k = 0; k < m; k++) {
      piv = k;
      for (r = k + 1; r < m; r++) if (Math.abs(M[r * 6 + k]) > Math.abs(M[piv * 6 + k])) piv = r;
      if (Math.abs(M[piv * 6 + k]) <= 1e-13 * (scale || 1)) return null;
      if (piv !== k) for (j = 0; j < 6; j++) { f = M[k * 6 + j]; M[k * 6 + j] = M[piv * 6 + j]; M[piv * 6 + j] = f; }
      f = M[k * 6 + k];
      for (j = 0; j < 6; j++) M[k * 6 + j] /= f;
      for (r = 0; r < m; r++) if (r !== k) {
        f = M[r * 6 + k];
        if (f !== 0) for (j = 0; j < 6; j++) M[r * 6 + j] -= f * M[k * 6 + j];
      }
    }
    var B = new Float64Array(9);
    for (i = 0; i < m; i++) for (j = 0; j < m; j++) B[i * 3 + j] = M[i * 6 + 3 + j];
    return B;
  }

  function norm1(A, m) {
    var best = 0;
    for (var j = 0; j < m; j++) { var s = 0; for (var i = 0; i < m; i++) s += Math.abs(A[i * 3 + j]); if (s > best) best = s; }
    return best;
  }

  /* Evaluate MLS at points X.
     cfg = { alpha, basis: 'lin'|'quad', weight: 'cubic'|'quartic'|'gauss' }
     Returns { phi (N·n, if wantPhi), uh (if U given), condMax, singular (count of x with singular A), sing (Uint8Array) } */
  function evaluate(cfg, nodes, X, U, wantPhi) {
    var xs = nodes.xs, h = nodes.h, n = xs.length, N = X.length;
    var m = cfg.basis === 'quad' ? 3 : 2, d = cfg.alpha * h;
    var A = new Float64Array(9), W = new Float64Array(n), S = new Float64Array(n);
    var phi = wantPhi ? new Float64Array(N * n) : null;
    var uh = U ? new Float64Array(N) : null, sing = new Uint8Array(N);
    var condMax = 0, nSing = 0, k, I, i, j;
    for (k = 0; k < N; k++) {
      var x = X[k], cnt = 0;
      A.fill(0);
      for (I = 0; I < n; I++) {
        var r = Math.abs(x - xs[I]) / d, w = r < 1 ? weight(cfg.weight, r) : 0;
        W[I] = w;
        if (w <= 0) continue;
        cnt++;
        var s = (xs[I] - x) / h, p = [1, s, s * s];
        S[I] = s;
        for (i = 0; i < m; i++) for (j = 0; j < m; j++) A[i * 3 + j] += w * p[i] * p[j];
      }
      var Ai = cnt >= m ? invSmall(A, m) : null;
      if (!Ai) { sing[k] = 1; nSing++; if (uh) uh[k] = NaN; continue; }
      var c = norm1(A, m) * norm1(Ai, m);
      if (c > condMax) condMax = c;
      var acc = 0;
      for (I = 0; I < n; I++) {
        if (W[I] <= 0) continue;
        var sI = S[I], ph = W[I] * (Ai[0] + Ai[1] * sI + (m === 3 ? Ai[2] * sI * sI : 0));
        if (phi) phi[k * n + I] = ph;
        if (U) acc += ph * U[I];
      }
      if (uh) uh[k] = acc;
    }
    return { phi: phi, uh: uh, condMax: condMax, singular: nSing, sing: sing };
  }

  // Second-order finite differences on a uniform grid (central inside, one-sided at the ends). NaN propagates.
  function diff(Y, X) {
    var N = Y.length, D = new Float64Array(N), dx = X[1] - X[0];
    D[0] = (-3 * Y[0] + 4 * Y[1] - Y[2]) / (2 * dx);
    D[N - 1] = (3 * Y[N - 1] - 4 * Y[N - 2] + Y[N - 3]) / (2 * dx);
    for (var k = 1; k < N - 1; k++) D[k] = (Y[k + 1] - Y[k - 1]) / (2 * dx);
    return D;
  }

  // Relative L2 error by the trapezoidal rule. NaN if any sample is undefined.
  function relL2(approx, exact, X) {
    var num = 0, den = 0, N = X.length;
    for (var k = 0; k < N; k++) {
      var wq = (k === 0 || k === N - 1) ? 0.5 : 1, e = approx[k] - exact[k];
      if (!isFinite(e)) return NaN;
      num += wq * e * e; den += wq * exact[k] * exact[k];
    }
    return den > 0 ? Math.sqrt(num / den) : Math.sqrt(num);
  }

  function sample(fn, X) { var Y = new Float64Array(X.length); for (var k = 0; k < X.length; k++) Y[k] = fn(X[k]); return Y; }

  /* α-sweep: relative error of u (metric 'u') or du/dx (metric 'du') for every α in alphas. */
  function sweep(cfg, nodes, X, fnKey, metric, alphas) {
    var F = FN[fnKey], U = sample(F.f, nodes.xs), exact = metric === 'du' ? sample(F.d, X) : sample(F.f, X);
    var out = new Float64Array(alphas.length);
    for (var i = 0; i < alphas.length; i++) {
      var r = evaluate({ alpha: alphas[i], basis: cfg.basis, weight: cfg.weight }, nodes, X, U, false);
      if (r.singular) { out[i] = NaN; continue; }
      out[i] = relL2(metric === 'du' ? diff(r.uh, X) : r.uh, exact, X);
    }
    return out;
  }

  root.RZMLS = { weight: weight, FN: FN, makeNodes: makeNodes, grid: grid, evaluate: evaluate,
                 diff: diff, relL2: relL2, sample: sample, sweep: sweep };
})(typeof window !== 'undefined' ? window : globalThis);

/* ═══════════════════════════════════════════════════════════════
   MLS Approximation Explorer — UI
   Registered as RZTools tool 'mls'; mount with <div data-rz-tool="mls"></div>
   Dependency-free; reads colours from the host page's CSS tokens
   (--accent, --gold, --fg, --fg2, --border, --surface) and follows the
   site language switch (body[data-rzlang]) and theme.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var M = window.RZMLS, RZT = window.RZTools;

  var T = {
    en: {
      fn: 'Test function', nodes: 'Nodes', alpha: 'Dilation parameter α', basis: 'Basis',
      lin: 'Linear', quad: 'Quadratic', weight: 'Weight function',
      cubic: 'Cubic spline', quartic: 'Quartic spline', gauss: 'Gaussian',
      layout: 'Node layout', regular: 'Regular', irregular: 'Irregular', shuffle: 'New layout',
      show: 'Main plot shows', metric: 'Sweep measures error in', node: 'Inspect node', reset: 'Reset',
      p1: 'Approximation', p1d: 'Derivative',
      p1s: 'MLS against the exact function. Dots are nodal values uᵢ = f(xᵢ); MLS does not pass through them. Click a node to inspect it.',
      p1sd: 'Derivative of the MLS approximation against the exact derivative. Click near a node to inspect it.',
      p2: 'Shape functions', p2s: 'All φᵢ(x) in grey, the inspected node in colour, its weight function, and the sum Σφᵢ.',
      p3: 'Error against α', p3s: 'Relative L2 error for every α from 0.5 to 4.0 with the current settings. Click the curve to set α.',
      lgExact: 'exact', lgMls: 'MLS', lgNodes: 'nodal values', lgSupport: 'support of node', lgPhi: 'φ of node',
      lgW: 'weight (scaled)', lgSum: 'Σφ', lgAll: 'other φ', lgErr: 'error', lgCur: 'current α',
      lgOpt: 'α*', lgSing: 'A(x) singular',
      mErr: 'Error in u', mErrD: 'Error in du/dx', mCond: 'max cond₁ A(x)', mPU: 'max |Σφ − 1|',
      mOpt: 'α* from sweep', mEff: 'EFF = E(α) / E(α*)',
      effGood: 'near optimal', effOk: 'acceptable', effBad: 'far from α*', relL2: 'relative L2',
      sing: 'A(x) is singular at {n} of {N} sample points: their support holds fewer than m = {m} nodes. Increase α, or use the linear basis.',
      singB: ' Near the boundary the support is one-sided, so the quadratic basis needs α > 2 on a regular grid.',
      exact: 'Exact reproduction: a quadratic basis reproduces any quadratic function to machine precision, for every α that keeps A(x) non-singular.',
      none: 'No α in the range gives a non-singular A(x) for these settings.',
      read: 'α = {a} · E = {e}', readS: 'α = {a} · A(x) singular'
    },
    ms: {
      fn: 'Fungsi ujian', nodes: 'Bilangan nod', alpha: 'Dilation parameter α', basis: 'Basis',
      lin: 'Linear', quad: 'Kuadratik', weight: 'Weight function',
      cubic: 'Cubic spline', quartic: 'Quartic spline', gauss: 'Gaussian',
      layout: 'Susunan nod', regular: 'Seragam', irregular: 'Tak seragam', shuffle: 'Susunan baharu',
      show: 'Plot utama memaparkan', metric: 'Sweep mengukur ralat bagi', node: 'Periksa nod', reset: 'Set semula',
      p1: 'Approximation', p1d: 'Terbitan',
      p1s: 'MLS berbanding fungsi tepat. Titik ialah nilai nod uᵢ = f(xᵢ); MLS tidak melalui titik-titik ini. Klik nod untuk memeriksanya.',
      p1sd: 'Terbitan MLS approximation berbanding terbitan tepat. Klik berhampiran nod untuk memeriksanya.',
      p2: 'Shape functions', p2s: 'Semua φᵢ(x) dalam kelabu, nod yang diperiksa berwarna, weight function-nya, dan jumlah Σφᵢ.',
      p3: 'Ralat berbanding α', p3s: 'Ralat relatif L2 bagi setiap α dari 0.5 hingga 4.0 dengan tetapan semasa. Klik lengkung untuk menetapkan α.',
      lgExact: 'tepat', lgMls: 'MLS', lgNodes: 'nilai nod', lgSupport: 'support nod', lgPhi: 'φ nod',
      lgW: 'weight (diskala)', lgSum: 'Σφ', lgAll: 'φ lain', lgErr: 'ralat', lgCur: 'α semasa',
      lgOpt: 'α*', lgSing: 'A(x) singular',
      mErr: 'Ralat u', mErrD: 'Ralat du/dx', mCond: 'max cond₁ A(x)', mPU: 'max |Σφ − 1|',
      mOpt: 'α* daripada sweep', mEff: 'EFF = E(α) / E(α*)',
      effGood: 'hampir optimum', effOk: 'boleh diterima', effBad: 'jauh dari α*', relL2: 'relatif L2',
      sing: 'A(x) singular pada {n} daripada {N} titik sampel: support-nya mengandungi kurang daripada m = {m} nod. Naikkan α, atau guna basis linear.',
      singB: ' Berhampiran sempadan, support hanya sebelah, jadi basis kuadratik memerlukan α > 2 pada grid seragam.',
      exact: 'Penghasilan semula tepat: basis kuadratik menghasilkan semula mana-mana fungsi kuadratik pada ketepatan mesin, bagi setiap α yang mengekalkan A(x) tidak singular.',
      none: 'Tiada α dalam julat ini yang memberi A(x) tidak singular untuk tetapan ini.',
      read: 'α = {a} · E = {e}', readS: 'α = {a} · A(x) singular'
    }
  };

  var U = RZT.util, sci = U.sci, fill = U.fill, readColors = U.readColors, rgba = U.rgba, plot = U.plot;

  /* ── markup ──────────────────────────────────────────────────── */
  function seg(name, opts) {
    return '<div class="rzt-seg" role="group" data-seg="' + name + '">' + opts.map(function (o) {
      return '<button type="button" data-v="' + o[0] + '" data-k="' + o[1] + '"></button>';
    }).join('') + '</div>';
  }
  var HTML =
    '<div class="rzt-body">' +
      '<div class="rzt-ctrl">' +
        '<label class="rzt-field"><span class="rzt-lab" data-k="fn"></span>' +
          '<select class="rzt-sel" data-in="fn">' + Object.keys(M.FN).map(function (k) { return '<option value="' + k + '">' + M.FN[k].label + '</option>'; }).join('') + '</select></label>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-k="alpha"></span><output data-out="alpha"></output></span>' +
          '<input class="rzt-rng" type="range" min="0.5" max="4" step="0.05" data-in="alpha"></label>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-k="nodes"></span><output data-out="n"></output></span>' +
          '<input class="rzt-rng" type="range" min="5" max="41" step="1" data-in="n"></label>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="basis"></span>' + seg('basis', [['lin', 'lin'], ['quad', 'quad']]) + '</div>' +
        '<label class="rzt-field"><span class="rzt-lab" data-k="weight"></span>' +
          '<select class="rzt-sel" data-in="weight"><option value="cubic" data-k="cubic"></option><option value="quartic" data-k="quartic"></option><option value="gauss" data-k="gauss"></option></select></label>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="layout"></span>' + seg('layout', [['regular', 'regular'], ['irregular', 'irregular']]) +
          '<button type="button" class="rzt-btn" data-act="shuffle" data-k="shuffle"></button></div>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="show"></span>' + seg('show', [['u', ''], ['du', '']]) + '</div>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="metric"></span>' + seg('metric', [['u', ''], ['du', '']]) + '</div>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="node"></span>' +
          '<div class="rzt-stepper"><button type="button" class="rzt-btn" data-act="prev" aria-label="Previous node">‹</button>' +
          '<output data-out="sel"></output><button type="button" class="rzt-btn" data-act="next" aria-label="Next node">›</button></div></div>' +
        '<button type="button" class="rzt-btn rzt-reset" data-act="reset" data-k="reset"></button>' +
      '</div>' +
      '<div class="rzt-main">' +
        '<div class="rzt-metrics">' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="eu"></span><span class="rzt-ml"><span data-k="mErr"></span> · <span data-k="relL2"></span></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="ed"></span><span class="rzt-ml"><span data-k="mErrD"></span> · <span data-k="relL2"></span></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="opt"></span><span class="rzt-ml" data-k="mOpt"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="eff"></span><span class="rzt-ml"><span data-k="mEff"></span> <span class="rzt-chip" data-m="effc"></span></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="cond"></span><span class="rzt-ml" data-k="mCond"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="pu"></span><span class="rzt-ml" data-k="mPU"></span></div>' +
        '</div>' +
        '<div class="rzt-note rzt-warn" data-note="sing" hidden></div>' +
        '<div class="rzt-note rzt-ok" data-note="exact" data-k="exact" hidden></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p1" data-alt="p1d"></span><span class="rzt-sub" data-k="p1s" data-alt="p1sd"></span><div class="rzt-legend" data-lg="1"></div></div><canvas class="rzt-cv rzt-cv-main" data-cv="1"></canvas></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p2"></span><span class="rzt-sub" data-k="p2s"></span><div class="rzt-legend" data-lg="2"></div></div><canvas class="rzt-cv" data-cv="2"></canvas></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p3"></span><span class="rzt-sub" data-k="p3s"></span><div class="rzt-legend" data-lg="3"></div></div><canvas class="rzt-cv rzt-cv-click" data-cv="3"></canvas><span class="rzt-read" data-read></span></div>' +
      '</div>' +
    '</div>';

  var DEFAULTS = { fn: 'sin', n: 11, alpha: 2.5, basis: 'quad', weight: 'cubic', layout: 'regular', seed: 7, show: 'u', metric: 'u', sel: 5 };
  var ALPHAS = []; for (var ai = 0; ai <= 70; ai++) ALPHAS.push(+(0.5 + ai * 0.05).toFixed(2));
  var NGRID = 401;

  RZT.register('mls', function (root) {
    root.classList.add('rzt', 'rzt-on');
    root.innerHTML = HTML;

    var S = {}; for (var k in DEFAULTS) S[k] = DEFAULTS[k];
    var X = M.grid(NGRID), C = readColors(root), lang = 'en';
    var cur = null, sw = null, swKey = '';
    function q(sel) { return root.querySelector(sel); }
    function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    var cv1 = q('[data-cv="1"]'), cv2 = q('[data-cv="2"]'), cv3 = q('[data-cv="3"]');
    var P1 = null, P3 = null;

    function t(k) { return (T[lang] || T.en)[k] || T.en[k] || k; }
    function detectLang() {
      var b = document.body && document.body.getAttribute('data-rzlang');
      return b === 'ms' ? 'ms' : 'en';
    }
    function applyLang() {
      lang = detectLang();
      qa('[data-k]').forEach(function (el) {
        var key = el.getAttribute('data-k'); if (!key) return;
        var txt = t(key);
        // keep Greek letters lower-case inside upper-cased labels (α would otherwise render as Α)
        if (/[\u03B1-\u03C9]/.test(txt) && el.tagName !== 'OPTION') el.innerHTML = txt.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }).replace(/([\u03B1-\u03C9]+)/g, '<span class="rzt-nt">$1</span>');
        else el.textContent = txt;
      });
      qa('[data-seg="show"] button, [data-seg="metric"] button').forEach(function (b) { b.textContent = b.getAttribute('data-v') === 'u' ? 'u(x)' : 'du/dx'; });
      redraw();
    }

    /* compute */
    function compute() {
      var nodes = M.makeNodes(S.n, S.layout, S.seed), F = M.FN[S.fn];
      var U = M.sample(F.f, nodes.xs);
      var r = M.evaluate({ alpha: S.alpha, basis: S.basis, weight: S.weight }, nodes, X, U, true);
      var fx = M.sample(F.f, X), dfx = M.sample(F.d, X), duh = r.singular ? null : M.diff(r.uh, X);
      var pu = 0, n = S.n;
      if (!r.singular) for (var k = 0; k < NGRID; k++) { var s = 0; for (var I = 0; I < n; I++) s += r.phi[k * n + I]; pu = Math.max(pu, Math.abs(s - 1)); }
      cur = { nodes: nodes, U: U, r: r, fx: fx, dfx: dfx, duh: duh, pu: r.singular ? NaN : pu,
              eu: r.singular ? NaN : M.relL2(r.uh, fx, X), ed: r.singular ? NaN : M.relL2(duh, dfx, X) };
      var key = [S.fn, S.n, S.basis, S.weight, S.layout, S.seed, S.metric].join('|');
      if (key !== swKey) { swKey = key; sw = M.sweep({ basis: S.basis, weight: S.weight }, nodes, X, S.fn, S.metric, ALPHAS); }
      var best = -1; for (var i = 0; i < sw.length; i++) if (isFinite(sw[i]) && (best < 0 || sw[i] < sw[best])) best = i;
      cur.best = best;
    }

    function setMetrics() {
      function put(m, v) { q('[data-m="' + m + '"]').textContent = v; }
      put('eu', sci(cur.eu)); put('ed', sci(cur.ed));
      put('cond', cur.r.singular ? '∞' : sci(cur.r.condMax));
      put('pu', sci(cur.pu));
      var chip = q('[data-m="effc"]'); chip.className = 'rzt-chip';
      if (cur.best < 0) { put('opt', '—'); put('eff', '—'); chip.textContent = ''; }
      else {
        put('opt', ALPHAS[cur.best].toFixed(2));
        var e = S.metric === 'du' ? cur.ed : cur.eu, eff = e / sw[cur.best];
        put('eff', isFinite(eff) ? '×' + (eff < 10 ? eff.toFixed(2) : sci(eff)) : '—');
        if (isFinite(eff)) {
          var cls = eff <= 1.05 ? 'good' : eff <= 2 ? 'ok' : 'bad';
          chip.classList.add('is-' + cls); chip.textContent = t(cls === 'good' ? 'effGood' : cls === 'ok' ? 'effOk' : 'effBad');
        } else chip.textContent = '';
      }
      var ns = q('[data-note="sing"]');
      if (cur.r.singular) {
        var msg = fill(t('sing'), { n: cur.r.singular, N: NGRID, m: S.basis === 'quad' ? 3 : 2 });
        if (S.basis === 'quad' && S.layout === 'regular' && S.alpha <= 2 && S.alpha > 1.5) msg += t('singB');
        ns.textContent = msg; ns.hidden = false;
      } else ns.hidden = true;
      q('[data-note="exact"]').hidden = !(S.fn === 'quad' && S.basis === 'quad' && !cur.r.singular);
    }

    function legend(id, items) {
      q('[data-lg="' + id + '"]').innerHTML = items.map(function (it) {
        var sw = it.type === 'dot' ? '<i class="rzt-sw dot" style="background:' + it.c + ';border-color:' + (it.b || it.c) + '"></i>'
               : it.type === 'band' ? '<i class="rzt-sw band" style="background:' + it.c + '"></i>'
               : '<i class="rzt-sw ' + (it.dash ? 'dash' : 'line') + '" style="border-color:' + it.c + '"></i>';
        return '<span>' + sw + it.t + '</span>';
      }).join('');
    }

    function drawMain() {
      var nd = cur.nodes, xs = nd.xs, d = S.alpha * nd.h, sel = S.sel, du = S.show === 'du';
      var ex = du ? cur.dfx : cur.fx, ap = du ? cur.duh : cur.r.uh;
      var lo = Infinity, hi = -Infinity, k;
      function acc(a) { if (!a) return; for (k = 0; k < a.length; k++) if (isFinite(a[k])) { if (a[k] < lo) lo = a[k]; if (a[k] > hi) hi = a[k]; } }
      acc(ex); acc(ap); if (!du) acc(cur.U);
      var pad = (hi - lo) * 0.1 || 1; lo -= pad; hi += pad;
      var spec = {
        xr: [0, 1], yr: [lo, hi], xlabel: 'x',
        bands: [{ x0: xs[sel] - d, x1: xs[sel] + d, fill: rgba(C.accent, 0.07), edge: rgba(C.accent, 0.5) }],
        lines: [{ x: X, y: ex, stroke: C.fg2, width: 2 }].concat(ap ? [{ x: X, y: ap, stroke: C.accent, width: 2.2 }] : []),
        ticks: Array.prototype.map.call(xs, function (x, I) { return { x: x, stroke: I === sel ? C.accent : C.fg2, width: I === sel ? 2.5 : 1.2, len: I === sel ? 10 : 6 }; }),
        points: du ? [] : Array.prototype.map.call(xs, function (x, I) { return { x: x, y: cur.U[I], r: I === sel ? 5.5 : 3.6, fill: C.gold, stroke: I === sel ? C.accent : C.fg, lw: I === sel ? 2 : 1 }; })
      };
      P1 = plot(cv1, spec, C);
      var it = [{ t: t('lgExact') + (du ? ' f′' : ' f'), c: C.fg2 }, { t: t('lgMls') + (du ? ' duʰ/dx' : ' uʰ'), c: C.accent }];
      if (!du) it.push({ t: t('lgNodes'), type: 'dot', c: C.gold, b: C.fg });
      it.push({ t: t('lgSupport') + ' ' + (sel + 1), type: 'band', c: rgba(C.accent, 0.18) });
      legend(1, it);
      var h = q('[data-cv="1"]').parentNode;
      h.querySelector('.rzt-h').textContent = t(du ? 'p1d' : 'p1');
      h.querySelector('.rzt-sub').textContent = t(du ? 'p1sd' : 'p1s');
    }

    function drawShape() {
      var n = S.n, sel = S.sel, xs = cur.nodes.xs, phi = cur.r.phi, d = S.alpha * cur.nodes.h, k, I;
      var lines = [], lo = -0.2, hi = 1.1, sum = new Float64Array(NGRID), wsel = new Float64Array(NGRID);
      var w0 = M.weight(S.weight, 0);
      for (I = 0; I < n; I++) {
        var y = new Float64Array(NGRID);
        for (k = 0; k < NGRID; k++) {
          var v = cur.r.sing[k] ? NaN : phi[k * n + I]; y[k] = v;
          if (isFinite(v)) { sum[k] += v; if (v < lo) lo = v; if (v > hi) hi = v; }
        }
        if (I !== sel) lines.push({ x: X, y: y, stroke: rgba(C.fg2, 0.32), width: 1 });
        else var ysel = y;
      }
      var mx = 0; for (k = 0; k < NGRID; k++) if (isFinite(ysel[k]) && ysel[k] > mx) mx = ysel[k];
      for (k = 0; k < NGRID; k++) { wsel[k] = M.weight(S.weight, Math.abs(X[k] - xs[sel]) / d) / w0 * (mx || 1); if (cur.r.sing[k]) sum[k] = NaN; }
      lines.push({ x: X, y: sum, stroke: C.fg, width: 1, dash: [2, 3] });
      lines.push({ x: X, y: wsel, stroke: C.gold, width: 1.8, dash: [6, 4] });
      lines.push({ x: X, y: ysel, stroke: C.accent, width: 2.4 });
      var pad = (hi - lo) * 0.06;
      plot(cv2, { xr: [0, 1], yr: [lo - pad, hi + pad], xlabel: 'x', lines: lines, hlines: [{ y: 0, stroke: C.border }],
                  ticks: Array.prototype.map.call(xs, function (x, J) { return { x: x, stroke: J === sel ? C.accent : C.fg2, width: J === sel ? 2.5 : 1.2, len: J === sel ? 10 : 6 }; }) }, C);
      legend(2, [{ t: t('lgPhi') + ' ' + (sel + 1), c: C.accent }, { t: t('lgW'), c: C.gold, dash: true }, { t: t('lgSum'), c: C.fg, dash: true }, { t: t('lgAll'), c: rgba(C.fg2, 0.6) }]);
    }

    function drawSweep() {
      var lo = Infinity, hi = 0, i, singBands = [], start = null;
      for (i = 0; i < sw.length; i++) {
        if (isFinite(sw[i]) && sw[i] > 0) { lo = Math.min(lo, sw[i]); hi = Math.max(hi, sw[i]); }
        var bad = !isFinite(sw[i]);
        if (bad && start === null) start = ALPHAS[i] - 0.025;
        if (!bad && start !== null) { singBands.push({ x0: Math.max(0.5, start), x1: ALPHAS[i] - 0.025, fill: rgba(C.fg2, 0.12) }); start = null; }
      }
      if (start !== null) singBands.push({ x0: Math.max(0.5, start), x1: 4, fill: rgba(C.fg2, 0.12) });
      var cv = cv3;
      if (!isFinite(lo)) { P3 = plot(cv, { xr: [0.5, 4], yr: [1e-3, 1], ylog: true, xlabel: 'α', bands: singBands,
        labels: [{ text: t('none'), fill: C.fg2, px: cv.clientWidth / 2, py: cv.clientHeight / 2 - 10, align: 'center' }] }, C); legend(3, []); return; }
      var e0 = Math.floor(Math.log10(lo)), e1 = Math.ceil(Math.log10(hi)); if (e1 - e0 < 1) e1 = e0 + 1;
      var spec = { xr: [0.5, 4], yr: [Math.pow(10, e0), Math.pow(10, e1)], ylog: true, xlabel: 'α', bands: singBands,
                   lines: [{ x: ALPHAS, y: sw, stroke: C.accent, width: 2.2 }],
                   vlines: [{ x: S.alpha, stroke: C.gold, width: 2 }], points: [] , labels: [] };
      if (cur.best >= 0) {
        spec.vlines.push({ x: ALPHAS[cur.best], stroke: rgba(C.fg, 0.45), width: 1, dash: [4, 4] });
        spec.points.push({ x: ALPHAS[cur.best], y: sw[cur.best], r: 5, fill: C.surface, stroke: C.fg, lw: 2 });
      }
      var e = S.metric === 'du' ? cur.ed : cur.eu;
      if (isFinite(e)) spec.points.push({ x: S.alpha, y: e, r: 4.5, fill: C.gold, stroke: C.fg, lw: 1 });
      if (singBands.length) spec.labels.push({ text: t('lgSing'), fill: C.fg2, x: singBands[0].x0 + 0.06, px: null, py: 14 });
      P3 = plot(cv, spec, C);
      var it = [{ t: t('lgErr') + ' (' + (S.metric === 'du' ? 'du/dx' : 'u') + ')', c: C.accent }, { t: t('lgCur'), c: C.gold }, { t: t('lgOpt') + ' = ' + (cur.best >= 0 ? ALPHAS[cur.best].toFixed(2) : '—'), type: 'dot', c: C.surface, b: C.fg }];
      if (singBands.length) it.push({ t: t('lgSing'), type: 'band', c: rgba(C.fg2, 0.25) });
      legend(3, it);
    }

    function syncControls() {
      q('[data-in="fn"]').value = S.fn; q('[data-in="weight"]').value = S.weight;
      q('[data-in="alpha"]').value = S.alpha; q('[data-in="n"]').value = S.n;
      q('[data-out="alpha"]').textContent = S.alpha.toFixed(2); q('[data-out="n"]').textContent = S.n;
      q('[data-out="sel"]').textContent = 'I = ' + (S.sel + 1) + ' / ' + S.n;
      ['basis', 'layout', 'show', 'metric'].forEach(function (g) {
        qa('[data-seg="' + g + '"] button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === S[g])); });
      });
      q('[data-act="shuffle"]').hidden = S.layout !== 'irregular';
    }

    function redraw() {
      if (!cur) return;
      syncControls(); setMetrics(); drawMain(); drawShape(); drawSweep();
    }
    var pending = false;
    function update(recompute) {
      if (recompute) compute();
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; redraw(); });
    }

    /* events */
    root.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-in'); if (!k) return;
      if (k === 'alpha') S.alpha = +e.target.value;
      else if (k === 'n') { S.n = +e.target.value; S.sel = Math.min(S.sel, S.n - 1); }
      else S[k] = e.target.value;
      update(true);
    });
    root.addEventListener('change', function (e) { if (e.target.tagName === 'SELECT') { S[e.target.getAttribute('data-in')] = e.target.value; update(true); } });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
      var sg = b.parentNode.getAttribute('data-seg');
      if (sg) { S[sg] = b.getAttribute('data-v'); update(sg !== 'show'); return; }
      var act = b.getAttribute('data-act');
      if (act === 'shuffle') { S.seed = (S.seed * 48271 + 11) % 2147483647; update(true); }
      else if (act === 'prev') { S.sel = (S.sel - 1 + S.n) % S.n; update(false); }
      else if (act === 'next') { S.sel = (S.sel + 1) % S.n; update(false); }
      else if (act === 'reset') { for (var k in DEFAULTS) S[k] = DEFAULTS[k]; update(true); }
    });
    function pickNode(cv, P, ev) {
      if (!P || !cur) return;
      var r = cv.getBoundingClientRect(), x = P.invX(ev.clientX - r.left), best = 0, bd = Infinity;
      for (var I = 0; I < cur.nodes.xs.length; I++) { var dd = Math.abs(cur.nodes.xs[I] - x); if (dd < bd) { bd = dd; best = I; } }
      S.sel = best; update(false);
    }
    cv1.addEventListener('click', function (ev) { pickNode(cv1, P1, ev); });
    cv2.addEventListener('click', function (ev) { pickNode(cv2, P1, ev); });
    var readEl = q('[data-read]');
    function alphaAt(ev) {
      if (!P3) return null;
      var r = cv3.getBoundingClientRect(), a = P3.invX(ev.clientX - r.left);
      a = Math.round(a / 0.05) * 0.05; return Math.max(0.5, Math.min(4, +a.toFixed(2)));
    }
    cv3.addEventListener('mousemove', function (ev) {
      var a = alphaAt(ev); if (a == null || !sw) return;
      var i = Math.round((a - 0.5) / 0.05), e = sw[i];
      readEl.textContent = isFinite(e) ? fill(t('read'), { a: a.toFixed(2), e: sci(e) }) : fill(t('readS'), { a: a.toFixed(2) });
    });
    cv3.addEventListener('mouseleave', function () { readEl.textContent = ''; });
    cv3.addEventListener('click', function (ev) { var a = alphaAt(ev); if (a == null) return; S.alpha = a; update(true); });

    /* host-page reactions: resize, theme, language */
    if ('ResizeObserver' in window) new ResizeObserver(function () { update(false); }).observe(root);
    else window.addEventListener('resize', function () { update(false); });
    function themeChanged() { C = readColors(root); update(false); }
    var mo = new MutationObserver(function (list) {
      list.forEach(function (m) { if (m.attributeName === 'data-rzlang') applyLang(); else themeChanged(); });
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-rzlang', 'data-theme'] });
    if (window.matchMedia) { var mq = window.matchMedia('(prefers-color-scheme: dark)'); (mq.addEventListener ? mq.addEventListener('change', themeChanged) : mq.addListener(themeChanged)); }

    compute(); applyLang();
  });
})();

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

  function Dmat(nu) {
    var c = E / (1 - nu * nu);
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
    var X = new Float64Array(nn), Y = new Float64Array(nn), tagS = new Int8Array(nn), tagT = new Int8Array(nn);
    for (i = 0; i < I; i++) for (j = 0; j < J; j++) {
      var n = id[i * J + j]; if (n < 0) continue;
      var pq = param(i, j), sg = pr.grade ? Math.pow(pq[0], pr.grade) : pq[0], xy = pr.map(sg, pq[1]);
      X[n] = xy[0]; Y[n] = xy[1];
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
    return { type: type, npe: npe, nn: nn, ne: C.length / npe, X: X, Y: Y, C: C, bedges: bedges, tagS: tagS, tagT: tagT, nx: nx, ny: ny };
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
    var pr = PROBLEMS[cfg.problem](cfg), mesh = buildMesh(pr, cfg.elem, cfg.distort || 0, cfg.seed || 1);
    var D = Dmat(cfg.nu), nn = mesh.nn, ndof = 2 * nn, type = mesh.type, npe = mesh.npe, ne = mesh.ne;
    var X = mesh.X, Y = mesh.Y, C = mesh.C, e, a, b;

    // essential boundary conditions → equation numbers
    var fixed = new Uint8Array(ndof), ubar = new Float64Array(ndof);
    mesh.bedges.forEach(function (be) {
      be.n.forEach(function (nd) {
        var v = pr.dirichlet(be.tag, X[nd], Y[nd]); if (!v) return;
        for (var c = 0; c < 2; c++) if (v[c] !== null && v[c] !== undefined) { fixed[2 * nd + c] = 1; ubar[2 * nd + c] = v[c]; }
      });
    });
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

/* ═══════════════════════════════════════════════════════════════
   2D Plane Stress FEM Explorer — UI
   Registered as RZTools tool 'fem2d'; mount with <div data-rz-tool="fem2d"></div>
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var F = window.RZFEM, RZT = window.RZTools, U = RZT.util;
  var ELEMS = ['T3', 'Q4', 'QM6', 'Q8'], SHAPES = ['circle', 'square', 'tri', 'diamond'];

  var T = {
    en: {
      gModel: 'Model', gMesh: 'Mesh', gView: 'View',
      problem: 'Problem', pcantilever: 'Cantilever (Timoshenko)', phole: 'Plate with a hole (Kirsch)', ppatch: 'Patch test',
      elem: 'Element', ld: 'Span / depth L/D', support: 'Left support', supExact: 'Exact', supClamp: 'Clamped',
      ar: 'Hole radius a / b', outer: 'Outer edges', outKirsch: 'Kirsch', outUniform: 'Uniform',
      nu: 'Poisson’s ratio ν', ncantilever: 'Elements through depth', nhole: 'Elements along radius', npatch: 'Elements per side',
      size: '{dof} DOF · {ne} elements', distort: 'Distortion', shuffle: 'New layout',
      field: 'Contour', fumag: 'Displacement |u|', fux: 'Displacement ux', fuy: 'Displacement uy', fsxx: 'Stress σxx', fsyy: 'Stress σyy',
      fsxy: 'Shear stress τxy', fsvm: 'Von Mises stress', smooth: 'Stresses', avg: 'Averaged', raw: 'Raw', scale: 'Deformation scale',
      meshLines: 'Mesh lines', show: 'Show', hide: 'Hide', reset: 'Reset',
      mDof: 'degrees of freedom · {ne} × {el}', mTip: 'Tip deflection v(L, 0) · Timoshenko {v}', mScf: 'SCF = σxx(0, a) / σ₀ · Kirsch {v}',
      mScfU: 'SCF = σxx(0, a) / σ₀ · Kirsch ∞ plate 3', mPatch: 'max |σ − σexact| / σ₀', mErr: 'Relative error, energy norm',
      mErrNone: 'Energy-norm error · needs an exact solution', mVm: 'max von Mises (averaged)', mU: 'max |u|', mTime: 'assemble + solve',
      pass: 'passed', fail: 'failed',
      lock: 'Shear locking: {el} elements cannot bend without spurious shear strain, so the beam is too stiff — {pct} of the exact tip deflection. Refine through the depth, or switch to QM6 or Q8.',
      clamped: 'Clamped support: every node at x = 0 is fixed. The exact Timoshenko solution assumes a different support, so no error norm is shown, and the stresses at the two clamped corners are singular — they keep growing as you refine.',
      uniform: 'Uniform tension on a finite plate: Kirsch’s solution is for an infinite plate, so no error norm is shown. The stress concentration rises above 3 as the hole grows relative to the plate.',
      patchOk: 'Patch test passed: the element reproduces a constant stress state exactly, even on a distorted mesh — the consistency condition behind convergence.',
      patchBad: 'Patch test failed: the element does not reproduce a constant stress state on this mesh.',
      singular: 'The stiffness matrix is singular: the model is not supported against rigid-body motion.',
      distorted: 'An element has a non-positive Jacobian. Reduce the mesh distortion.',
      big: 'Large model: it solves when you release the slider.',
      p1s: '{smooth} values on the deformed shape (displacements × {s}). Hover or tap near a node to read it; the dashed line is the path plotted below.',
      p1sU: '{smooth} values on the undeformed shape. Hover or tap near a node to read it; the dashed line is the path plotted below.',
      sAvg: 'Averaged nodal', sRaw: 'Unaveraged element', sDisp: 'Nodal',
      p2: 'Along a line', p2s: 'FE result against the reference solution, sampled inside the elements. Hover to read values.',
      lcantilever_sxx: 'σxx through the depth at x = L/2', lcantilever_sxy: 'τxy through the depth at x = L/2', lcantilever_uy: 'Deflection along the axis y = 0',
      lhole_sxx: 'σxx along x = 0, from the hole to the edge', lhole_stt: 'σθθ around the hole, θ = 0° → 90°',
      lpatch_sxx: 'σxx along y = 0.5', lpatch_ux: 'ux along y = 0.5',
      lgFE: 'FE', lgExact: 'exact', lgKirsch: 'Kirsch (infinite plate)', lgTimo: 'Timoshenko (exact support)',
      p3: 'Convergence study', p3s: 'Relative energy-norm error against DOF for all four elements on this problem, with the current ν, geometry and distortion. On these axes a slope of −p/2 means the error falls as hᵖ.',
      run: 'Run study', running: 'Solving {i} of {n}…', stale: 'Settings changed since the last study. Run it again.', noExact: 'The study needs an exact solution: choose the exact support or Kirsch tractions.',
      idle: 'Press “Run study” to solve 16 meshes, from coarse to fine.', rate: 'rate', cur: 'current model',
      readNode: '({x}, {y}) m · {f} = {v}', readExact: ' · exact {v}', readLine: '{x} · FE {fe} · ref {ex} {u}', readConv: '{el} · {dof} DOF · error {e}',
      fail2: 'The model could not be solved.',
      noPatch: 'The patch test is exact on every mesh, so there is nothing to converge.'
    },
    ms: {
      gModel: 'Model', gMesh: 'Mesh', gView: 'Paparan',
      problem: 'Masalah', pcantilever: 'Cantilever (Timoshenko)', phole: 'Plat berlubang (Kirsch)', ppatch: 'Patch test',
      elem: 'Element', ld: 'Rentang / kedalaman L/D', support: 'Support kiri', supExact: 'Exact', supClamp: 'Clamped',
      ar: 'Jejari lubang a / b', outer: 'Sisi luar', outKirsch: 'Kirsch', outUniform: 'Seragam',
      nu: 'Poisson’s ratio ν', ncantilever: 'Element merentas kedalaman', nhole: 'Element sepanjang jejari', npatch: 'Element setiap sisi',
      size: '{dof} DOF · {ne} element', distort: 'Herotan', shuffle: 'Susunan baharu',
      field: 'Kontur', fumag: 'Sesaran |u|', fux: 'Sesaran ux', fuy: 'Sesaran uy', fsxx: 'Tegasan σxx', fsyy: 'Tegasan σyy',
      fsxy: 'Tegasan ricih τxy', fsvm: 'Tegasan von Mises', smooth: 'Tegasan', avg: 'Purata', raw: 'Mentah', scale: 'Skala ubah bentuk',
      meshLines: 'Garis mesh', show: 'Papar', hide: 'Sorok', reset: 'Set semula',
      mDof: 'darjah kebebasan · {ne} × {el}', mTip: 'Pesongan hujung v(L, 0) · Timoshenko {v}', mScf: 'SCF = σxx(0, a) / σ₀ · Kirsch {v}',
      mScfU: 'SCF = σxx(0, a) / σ₀ · Kirsch plat ∞ 3', mPatch: 'max |σ − σexact| / σ₀', mErr: 'Ralat relatif, energy norm',
      mErrNone: 'Ralat energy norm · perlukan exact solution', mVm: 'max von Mises (purata)', mU: 'max |u|', mTime: 'assemble + solve',
      pass: 'lulus', fail: 'gagal',
      lock: 'Shear locking: element {el} tidak boleh melentur tanpa terikan ricih palsu, jadi rasuk terlalu kaku — {pct} daripada pesongan hujung exact. Haluskan mesh merentas kedalaman, atau tukar ke QM6 atau Q8.',
      clamped: 'Support clamped: setiap nod pada x = 0 ditetapkan. Exact solution Timoshenko mengandaikan support yang berbeza, jadi energy norm tidak dipaparkan, dan tegasan di dua sudut clamped adalah singular — ia terus meningkat apabila mesh dihaluskan.',
      uniform: 'Tegangan seragam pada plat terhingga: penyelesaian Kirsch adalah untuk plat tak terhingga, jadi energy norm tidak dipaparkan. Kepekatan tegasan melebihi 3 apabila lubang membesar berbanding plat.',
      patchOk: 'Patch test lulus: element menghasilkan semula keadaan tegasan malar dengan tepat, walaupun pada mesh terherot — syarat consistency di sebalik convergence.',
      patchBad: 'Patch test gagal: element tidak menghasilkan semula tegasan malar pada mesh ini.',
      singular: 'Stiffness matrix singular: model tidak disokong terhadap gerakan rigid-body.',
      distorted: 'Satu element mempunyai Jacobian tidak positif. Kurangkan herotan mesh.',
      big: 'Model besar: ia diselesaikan apabila anda melepaskan slider.',
      p1s: 'Nilai {smooth} pada bentuk terubah (sesaran × {s}). Halakan atau ketik berhampiran nod untuk membacanya; garis putus-putus ialah laluan yang diplot di bawah.',
      p1sU: 'Nilai {smooth} pada bentuk asal. Halakan atau ketik berhampiran nod untuk membacanya; garis putus-putus ialah laluan yang diplot di bawah.',
      sAvg: 'nodal purata', sRaw: 'element tanpa purata', sDisp: 'nodal',
      p2: 'Sepanjang satu garis', p2s: 'Keputusan FE berbanding penyelesaian rujukan, disampel di dalam element. Halakan untuk membaca nilai.',
      lcantilever_sxx: 'σxx merentas kedalaman pada x = L/2', lcantilever_sxy: 'τxy merentas kedalaman pada x = L/2', lcantilever_uy: 'Pesongan sepanjang paksi y = 0',
      lhole_sxx: 'σxx sepanjang x = 0, dari lubang ke sisi', lhole_stt: 'σθθ sekeliling lubang, θ = 0° → 90°',
      lpatch_sxx: 'σxx sepanjang y = 0.5', lpatch_ux: 'ux sepanjang y = 0.5',
      lgFE: 'FE', lgExact: 'exact', lgKirsch: 'Kirsch (plat tak terhingga)', lgTimo: 'Timoshenko (support exact)',
      p3: 'Kajian convergence', p3s: 'Ralat relatif energy norm berbanding DOF bagi keempat-empat element untuk masalah ini, dengan ν, geometri dan herotan semasa. Pada paksi ini, cerun −p/2 bermaksud ralat jatuh mengikut hᵖ.',
      run: 'Jalankan kajian', running: 'Menyelesaikan {i} daripada {n}…', stale: 'Tetapan telah berubah sejak kajian terakhir. Jalankan semula.', noExact: 'Kajian ini perlukan exact solution: pilih support exact atau traction Kirsch.',
      idle: 'Tekan “Jalankan kajian” untuk menyelesaikan 16 mesh, dari kasar ke halus.', rate: 'kadar', cur: 'model semasa',
      readNode: '({x}, {y}) m · {f} = {v}', readExact: ' · exact {v}', readLine: '{x} · FE {fe} · rujukan {ex} {u}', readConv: '{el} · {dof} DOF · ralat {e}',
      fail2: 'Model tidak dapat diselesaikan.',
      noPatch: 'Patch test adalah exact pada setiap mesh, jadi tiada apa untuk menumpu.'
    }
  };

  var FIELD = {
    umag: { unit: 'mm', k: 1e3, div: false }, ux: { unit: 'mm', k: 1e3, div: true }, uy: { unit: 'mm', k: 1e3, div: true },
    sxx: { unit: 'MPa', k: 1e-6, div: true }, syy: { unit: 'MPa', k: 1e-6, div: true }, sxy: { unit: 'MPa', k: 1e-6, div: true },
    svm: { unit: 'MPa', k: 1e-6, div: false }
  };
  var SYM = { umag: '|u|', ux: 'ux', uy: 'uy', sxx: 'σxx', syy: 'σyy', sxy: 'τxy', svm: 'σvM' };
  var NMAX = { cantilever: 16, hole: 24, patch: 12 }, NDEF = { cantilever: 4, hole: 8, patch: 4 };
  var LINES = { cantilever: ['sxx', 'sxy', 'uy'], hole: ['sxx', 'stt'], patch: ['sxx', 'ux'] };
  var STUDY_N = { cantilever: [1, 2, 4, 8], hole: [2, 4, 8, 16], patch: [1, 2, 4, 8] };
  var LIVE_DOF = 5000;

  function fmt(v) {
    if (!isFinite(v)) return '—';
    if (v === 0) return '0';
    var a = Math.abs(v);
    return (a >= 1e4 || a < 1e-2 ? U.sci(v) : String(+v.toPrecision(3))).replace(/^-/, '\u2212');
  }

  function seg(name, opts) {
    return '<div class="rzt-seg" role="group" data-seg="' + name + '">' + opts.map(function (o) {
      return '<button type="button" data-v="' + o[0] + '"' + (o[1] ? ' data-k="' + o[1] + '"' : '') + '>' + (o[2] || '') + '</button>';
    }).join('') + '</div>';
  }
  function rng(k, min, max, step) { return '<input class="rzt-rng" type="range" min="' + min + '" max="' + max + '" step="' + step + '" data-in="' + k + '">'; }

  var HTML =
    '<div class="rzt-body">' +
      '<div class="rzt-ctrl">' +
        '<p class="rzt-grp" data-k="gModel"></p>' +
        '<label class="rzt-field rzt-wide"><span class="rzt-lab" data-k="problem"></span>' +
          '<select class="rzt-sel" data-in="problem"><option value="cantilever" data-k="pcantilever"></option><option value="hole" data-k="phole"></option><option value="patch" data-k="ppatch"></option></select></label>' +
        '<div class="rzt-field rzt-wide"><span class="rzt-lab" data-k="elem"></span>' + seg('elem', ELEMS.map(function (e) { return [e, '', e]; })) + '</div>' +
        '<label class="rzt-field" data-only="cantilever"><span class="rzt-lab"><span data-k="ld"></span><output data-out="ld"></output></span>' + rng('ld', 2, 12, 1) + '</label>' +
        '<div class="rzt-field" data-only="cantilever"><span class="rzt-lab" data-k="support"></span>' + seg('support', [['exact', 'supExact'], ['clamped', 'supClamp']]) + '</div>' +
        '<label class="rzt-field" data-only="hole"><span class="rzt-lab"><span data-k="ar"></span><output data-out="ar"></output></span>' + rng('ar', 0.1, 0.5, 0.05) + '</label>' +
        '<div class="rzt-field" data-only="hole"><span class="rzt-lab" data-k="outer"></span>' + seg('outer', [['kirsch', 'outKirsch'], ['uniform', 'outUniform']]) + '</div>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-k="nu"></span><output data-out="nu"></output></span>' + rng('nu', 0, 0.49, 0.01) + '</label>' +
        '<p class="rzt-grp" data-k="gMesh"></p>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-kn="n"></span><output data-out="n"></output></span>' + rng('n', 1, 16, 1) +
          '<span class="rzt-size" data-out="size"></span></label>' +
        '<div class="rzt-field"><span class="rzt-lab"><span data-k="distort"></span><output data-out="distort"></output></span>' + rng('distort', 0, 0.4, 0.05) +
          '<button type="button" class="rzt-btn" data-act="shuffle" data-k="shuffle"></button></div>' +
        '<p class="rzt-grp" data-k="gView"></p>' +
        '<label class="rzt-field rzt-wide"><span class="rzt-lab" data-k="field"></span>' +
          '<select class="rzt-sel" data-in="field">' + ['svm', 'sxx', 'syy', 'sxy', 'umag', 'ux', 'uy'].map(function (f) { return '<option value="' + f + '" data-k="f' + f + '"></option>'; }).join('') + '</select></label>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="smooth"></span>' + seg('smooth', [['avg', 'avg'], ['raw', 'raw']]) + '</div>' +
        '<div class="rzt-field"><span class="rzt-lab" data-k="meshLines"></span>' + seg('mesh', [['1', 'show'], ['0', 'hide']]) + '</div>' +
        '<label class="rzt-field"><span class="rzt-lab"><span data-k="scale"></span><output data-out="scale"></output></span>' + rng('scale', 0, 3, 0.1) + '</label>' +
        '<button type="button" class="rzt-btn rzt-reset" data-act="reset" data-k="reset"></button>' +
      '</div>' +
      '<div class="rzt-main">' +
        '<div class="rzt-metrics">' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="dof"></span><span class="rzt-ml" data-m="dofl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv"><span data-m="q"></span> <span class="rzt-chip" data-m="qc"></span></span><span class="rzt-ml" data-m="ql"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="err"></span><span class="rzt-ml" data-m="errl"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="vm"></span><span class="rzt-ml" data-k="mVm"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="umax"></span><span class="rzt-ml" data-k="mU"></span></div>' +
          '<div class="rzt-m"><span class="rzt-mv" data-m="time"></span><span class="rzt-ml" data-k="mTime"></span></div>' +
        '</div>' +
        '<div class="rzt-note rzt-warn" data-note="warn" hidden></div>' +
        '<div class="rzt-note rzt-ok" data-note="ok" hidden></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-h="1"></span><span class="rzt-sub" data-sub="1"></span></div>' +
          '<div class="rzt-cvwrap"><canvas class="rzt-cv rzt-cv-fem" data-cv="1"></canvas><canvas class="rzt-ov" data-ov="1" aria-hidden="true"></canvas></div>' +
          '<div class="rzt-cbar" data-cbar></div><span class="rzt-read rzt-read-b" data-read="1"></span></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h"><span data-k="p2"></span></span>' +
          '<select class="rzt-sel rzt-sel-inline" data-in="line"></select><span class="rzt-sub" data-k="p2s"></span><div class="rzt-legend" data-lg="2"></div></div>' +
          '<canvas class="rzt-cv" data-cv="2"></canvas><span class="rzt-read" data-read="2"></span></div>' +
        '<div class="rzt-plot"><div class="rzt-ph"><span class="rzt-h" data-k="p3"></span><span class="rzt-sub" data-k="p3s"></span>' +
          '<div class="rzt-row"><button type="button" class="rzt-btn rzt-primary" data-act="study" data-k="run"></button><span class="rzt-sub" data-out="study"></span></div>' +
          '<div class="rzt-legend" data-lg="3"></div></div>' +
          '<canvas class="rzt-cv" data-cv="3"></canvas><span class="rzt-read" data-read="3"></span></div>' +
      '</div>' +
    '</div>';

  var DEFAULTS = { problem: 'cantilever', elem: 'Q4', ld: 5, support: 'exact', ar: 0.25, outer: 'kirsch', nu: 0.3, distort: 0, seed: 7,
                   field: 'svm', smooth: 'avg', mesh: '1', scale: 1, line: 'sxx', n: { cantilever: 4, hole: 8, patch: 4 } };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  RZT.register('fem2d', function (root) {
    root.classList.add('rzt', 'rzt-on');
    root.innerHTML = HTML;
    var S = clone(DEFAULTS), C = U.readColors(root), lang = 'en', cur = null, study = null, studyTok = 0, lastW = 0;
    function q(sel) { return root.querySelector(sel); }
    function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    function t(k) { return (T[lang] || T.en)[k] || T.en[k] || k; }
    var cv1 = q('[data-cv="1"]'), ov1 = q('[data-ov="1"]'), cv2 = q('[data-cv="2"]'), cv3 = q('[data-cv="3"]');
    var view = null, P2 = null, P3 = null, lineData = null, convPts = [];

    function cfg(extra) {
      var c = { problem: S.problem, elem: S.elem, n: S.n[S.problem], ld: S.ld, support: S.support, ar: S.ar, outer: S.outer,
                nu: S.nu, distort: S.distort, seed: S.seed };
      for (var k in extra) c[k] = extra[k];
      return c;
    }
    function studyKey() { return [S.problem, S.ld, S.support, S.ar, S.outer, S.nu, S.distort, S.seed].join('|'); }

    /* ── compute ───────────────────────────────────────────────── */
    function compute() {
      var key = JSON.stringify(cfg());
      if (cur && cur.key === key) { computeLine(); return; }
      var m = F.run(cfg()), r = { model: m, key: key };
      if (!m.error) {
        var mesh = m.mesh, nn = mesh.nn, umax = 0, vm = F.nodalField(m, 'svm'), vmax = 0;
        for (var i = 0; i < nn; i++) { umax = Math.max(umax, Math.hypot(m.u[2 * i], m.u[2 * i + 1])); vmax = Math.max(vmax, vm[i]); }
        r.umax = umax; r.vmax = vmax; r.err = F.energyError(m);
        var pr = m.pr;
        if (pr.key === 'cantilever') { r.q = F.evalAt(m, 'uy', pr.L, 0, 'avg', 1e-6); r.qref = pr.ref.tip; }
        else if (pr.key === 'hole') { r.q = F.evalAt(m, 'sxx', 0, pr.a, 'avg', 1e-3) / pr.s0; r.qref = 3; }
        else {
          var e = 0; for (i = 0; i < nn; i++) e = Math.max(e, Math.abs(m.sAvg[3 * i] - pr.s0), Math.abs(m.sAvg[3 * i + 1]), Math.abs(m.sAvg[3 * i + 2]));
          r.q = e / pr.s0;
        }
      }
      cur = r;
      computeLine();
    }

    function lineDef() {
      var pr = cur.model.pr, key = S.line;
      if (pr.key === 'cantilever') {
        var L = pr.L, D = pr.D, tm = pr.timo;
        if (key === 'uy') return { f: 'uy', xr: [0, L], xl: 'x (m)', pt: function (s) { return [s, 0]; }, ref: function (s) { return tm.u(s, 0)[1]; } };
        var c = key === 'sxy' ? 2 : 0;
        return { f: key === 'sxy' ? 'sxy' : 'sxx', xr: [-D / 2, D / 2], xl: 'y (m)', pt: function (s) { return [L / 2, s]; }, ref: function (s) { return tm.s(L / 2, s)[c]; } };
      }
      if (pr.key === 'hole') {
        var a = pr.a, b = pr.b, ks = pr.kirschS;
        if (key === 'stt') return { f: 'stt', xr: [0, 90], xl: 'θ (°)', pt: function (s) { var th = s * Math.PI / 180, r = a * (1 + 1e-6); return [r * Math.cos(th), r * Math.sin(th)]; },
          ref: function (s) { var th = s * Math.PI / 180, r = a * (1 + 1e-6); return stt(ks(r * Math.cos(th), r * Math.sin(th)), th); }, th: true };
        return { f: 'sxx', xr: [a, b], xl: 'y (m)', pt: function (s) { return [0, s]; }, ref: function (s) { return ks(0, s)[0]; } };
      }
      if (key === 'ux') return { f: 'ux', xr: [0, 1], xl: 'x (m)', pt: function (s) { return [s, 0.5]; }, ref: function (s) { return pr.exact.u(s, 0.5)[0]; } };
      return { f: 'sxx', xr: [0, 1], xl: 'x (m)', pt: function (s) { return [s, 0.5]; }, ref: function () { return pr.s0; } };
    }
    function stt(s3, th) { var c = Math.cos(th), s = Math.sin(th); return s3[0] * s * s + s3[1] * c * c - 2 * s3[2] * s * c; }

    function computeLine() {
      lineData = null;
      var m = cur.model; if (m.error) return;
      var d = lineDef(), N = 97, xs = [], fe = [], rf = [], mode = S.smooth === 'raw' ? 'raw' : 'avg', tol = m.mesh.type === 'Q8' ? 3e-3 : 1e-6;
      var k = d.f === 'stt' ? FIELD.sxx.k : FIELD[d.f].k;
      for (var i = 0; i < N; i++) {
        var s = d.xr[0] + (d.xr[1] - d.xr[0]) * i / (N - 1), p = d.pt(s), v;
        if (d.f === 'stt') {
          var th = s * Math.PI / 180;
          v = stt([F.evalAt(m, 'sxx', p[0], p[1], mode, tol), F.evalAt(m, 'syy', p[0], p[1], mode, tol), F.evalAt(m, 'sxy', p[0], p[1], mode, tol)], th);
        } else v = F.evalAt(m, d.f, p[0], p[1], F.isStress(d.f) ? mode : 'avg', tol);
        xs.push(s); fe.push(v * k); rf.push(d.ref(s) * k);
      }
      lineData = { d: d, xs: xs, fe: fe, rf: rf, unit: d.f === 'stt' || F.isStress(d.f) ? 'MPa' : 'mm' };
    }

    /* ── language ─────────────────────────────────────────────── */
    function applyLang() {
      var b = document.body && document.body.getAttribute('data-rzlang'); lang = b === 'ms' ? 'ms' : 'en';
      qa('[data-k]').forEach(function (el) {
        var key = el.getAttribute('data-k'); if (!key) return;
        var txt = t(key);
        if (/[α-ω]/.test(txt) && el.tagName !== 'OPTION') el.innerHTML = U.esc(txt).replace(/([α-ω]+)/g, '<span class="rzt-nt">$1</span>');
        else el.textContent = txt;
      });
      fillLineSelect();
      redraw();
    }
    function fillLineSelect() {
      var sel = q('[data-in="line"]'), opts = LINES[S.problem];
      sel.innerHTML = opts.map(function (k) { return '<option value="' + k + '">' + U.esc(t('l' + S.problem + '_' + k)) + '</option>'; }).join('');
      sel.value = S.line;
    }

    /* ── controls ─────────────────────────────────────────────── */
    function sync() {
      var n = S.n[S.problem], sz = F.size(cfg());
      q('[data-in="problem"]').value = S.problem; q('[data-in="field"]').value = S.field;
      var ni = q('[data-in="n"]'); ni.max = NMAX[S.problem]; ni.value = n;
      q('[data-kn="n"]').textContent = t('n' + S.problem);
      q('[data-in="ld"]').value = S.ld; q('[data-in="ar"]').value = S.ar; q('[data-in="nu"]').value = S.nu;
      q('[data-in="distort"]').value = S.distort; q('[data-in="scale"]').value = S.scale;
      q('[data-out="n"]').textContent = n; q('[data-out="ld"]').textContent = S.ld; q('[data-out="ar"]').textContent = S.ar.toFixed(2);
      q('[data-out="nu"]').textContent = S.nu.toFixed(2); q('[data-out="distort"]').textContent = S.distort.toFixed(2);
      q('[data-out="scale"]').textContent = cur && cur.model && !cur.model.error ? '×' + fmt(S.scale * autoScale()) : S.scale.toFixed(1);
      q('[data-out="size"]').textContent = U.fill(t('size'), { dof: U.group(sz.dof), ne: U.group(sz.elements) });
      ['elem', 'support', 'outer', 'smooth', 'mesh'].forEach(function (g) {
        qa('[data-seg="' + g + '"] button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === String(S[g]))); });
      });
      qa('[data-only]').forEach(function (el) { el.hidden = el.getAttribute('data-only') !== S.problem; });
      q('[data-act="shuffle"]').hidden = !(S.distort > 0);
      var sm = q('[data-seg="smooth"]'); sm.parentNode.classList.toggle('is-off', !F.isStress(S.field));
    }
    function autoScale() {
      var m = cur.model, bb = m.pr.bbox, L = Math.max(bb[1] - bb[0], bb[3] - bb[2]);
      return cur.umax > 0 ? 0.08 * L / cur.umax : 0;
    }

    function setMetrics() {
      function put(k, v) { q('[data-m="' + k + '"]').textContent = v; }
      var m = cur.model, chip = q('[data-m="qc"]'); chip.className = 'rzt-chip'; chip.textContent = '';
      var warn = q('[data-note="warn"]'), ok = q('[data-note="ok"]'); warn.hidden = true; ok.hidden = true;
      var sz = F.size(cfg());
      put('dof', U.group(sz.dof)); put('dofl', U.fill(t('mDof'), { ne: U.group(sz.elements), el: S.elem }));
      if (m.error) {
        ['q', 'err', 'vm', 'umax', 'time'].forEach(function (k) { put(k, '—'); });
        put('ql', ''); put('errl', '');
        warn.textContent = t(m.error) || t('fail2'); warn.hidden = false; return;
      }
      var pr = m.pr, msgW = null, msgO = null;
      if (pr.key === 'cantilever') {
        put('q', fmt(cur.q * 1e3) + ' mm'); put('ql', U.fill(t('mTip'), { v: fmt(cur.qref * 1e3) + ' mm' }));
        var ratio = cur.q / cur.qref;
        chip.textContent = (ratio * 100).toFixed(1) + '%';
        chip.classList.add(Math.abs(ratio - 1) <= 0.01 ? 'is-good' : Math.abs(ratio - 1) <= 0.05 ? 'is-ok' : 'is-bad');
        if (S.support === 'clamped') msgW = t('clamped');
        else if (ratio < 0.9 && (S.elem === 'Q4' || S.elem === 'T3')) msgW = U.fill(t('lock'), { el: S.elem, pct: Math.round(ratio * 100) + '%' });
      } else if (pr.key === 'hole') {
        put('q', isFinite(cur.q) ? cur.q.toFixed(3) : '—');
        if (S.outer === 'kirsch') {
          put('ql', U.fill(t('mScf'), { v: '3' }));
          var dv = Math.abs(cur.q / 3 - 1);
          chip.textContent = (cur.q / 3 * 100).toFixed(1) + '%'; chip.classList.add(dv <= 0.01 ? 'is-good' : dv <= 0.05 ? 'is-ok' : 'is-bad');
        } else { put('ql', t('mScfU')); msgW = t('uniform'); }
      } else {
        put('q', U.sci(cur.q)); put('ql', t('mPatch'));
        var passed = cur.q < 1e-8;
        chip.textContent = t(passed ? 'pass' : 'fail'); chip.classList.add(passed ? 'is-good' : 'is-bad');
        if (passed) msgO = t('patchOk'); else msgW = t('patchBad');
      }
      if (cur.err == null) { put('err', '—'); put('errl', t('mErrNone')); }
      else { put('err', cur.err >= 1e-4 ? fmt(cur.err * 100) + ' %' : U.sci(cur.err)); put('errl', t('mErr')); }
      put('vm', fmt(cur.vmax * 1e-6) + ' MPa'); put('umax', fmt(cur.umax * 1e3) + ' mm');
      put('time', Math.max(1, Math.round(m.time.assemble + m.time.solve)) + ' ms');
      if (msgW) { warn.textContent = msgW; warn.hidden = false; }
      if (msgO) { ok.textContent = msgO; ok.hidden = false; }
    }

    /* ── contour plot ─────────────────────────────────────────── */
    var Q4SUB = [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]];
    var Q8G = [-1, -1 / 3, 1 / 3, 1], Q8N = (function () {     // Q8 shape functions at the 4×4 display grid
      var out = [], N = new Float64Array(8), a = new Float64Array(8), b = new Float64Array(8);
      for (var j = 0; j < 4; j++) for (var i = 0; i < 4; i++) { F.shape.Q8(Q8G[i], Q8G[j], N, a, b); out.push(Array.prototype.slice.call(N)); }
      return out;
    })();
    var Q8TRI = (function () { var tr = []; for (var j = 0; j < 3; j++) for (var i = 0; i < 3; i++) { var p = j * 4 + i; tr.push([p, p + 1, p + 5], [p, p + 5, p + 4]); } return tr; })();
    var Q8RIM = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4];

    function clip(P, lev, above) {
      var out = [], n = P.length;
      for (var i = 0; i < n; i++) {
        var a = P[i], b = P[(i + 1) % n], ia = above ? a[2] >= lev : a[2] <= lev, ib = above ? b[2] >= lev : b[2] <= lev;
        if (ia) out.push(a);
        if (ia !== ib) { var s = (lev - a[2]) / (b[2] - a[2]); out.push([a[0] + s * (b[0] - a[0]), a[1] + s * (b[1] - a[1]), lev]); }
      }
      return out;
    }

    function drawContour() {
      var m = cur.model, g, dpr = window.devicePixelRatio || 1, W = cv1.parentNode.clientWidth;
      var h = q('[data-h="1"]'), sub = q('[data-sub="1"]'), cbar = q('[data-cbar]');
      h.textContent = t('f' + S.field);
      if (!W) return;
      if (m.error) {
        setSize(W, 240); g = cv1.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, 240);
        g.fillStyle = C.fg2; g.font = '13px Poppins, system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(t('fail2'), W / 2, 120);
        cbar.innerHTML = ''; sub.textContent = ''; view = null; return;
      }
      var mesh = m.mesh, nn = mesh.nn, npe = mesh.npe, ne = mesh.ne, X = mesh.X, Y = mesh.Y, u = m.u, Cn = mesh.C;
      var sc = S.scale * autoScale(), px = new Float64Array(nn), py = new Float64Array(nn), i, e, a;
      var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (i = 0; i < nn; i++) {
        px[i] = X[i] + sc * u[2 * i]; py[i] = Y[i] + sc * u[2 * i + 1];
        x0 = Math.min(x0, X[i], px[i]); x1 = Math.max(x1, X[i], px[i]); y0 = Math.min(y0, Y[i], py[i]); y1 = Math.max(y1, Y[i], py[i]);
      }
      var M = 44, avail = W - 2 * M, asp = (y1 - y0) / (x1 - x0), H = Math.round(Math.min(560, Math.max(200, avail * asp + 2 * M)));
      var k = Math.min(avail / (x1 - x0), (H - 2 * M) / (y1 - y0)), ox = (W - k * (x1 - x0)) / 2, oy = (H - k * (y1 - y0)) / 2;
      function SX(x) { return ox + (x - x0) * k; } function SY(y) { return H - oy - (y - y0) * k; }
      setSize(W, H);
      g = cv1.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);

      // values and colour scale
      var fd = FIELD[S.field], raw = S.smooth === 'raw' && F.isStress(S.field), vals = F.elementField(m, S.field, raw ? 'raw' : 'avg');
      var lo = Infinity, hi = -Infinity;
      for (i = 0; i < vals.length; i++) { vals[i] *= fd.k; if (vals[i] < lo) lo = vals[i]; if (vals[i] > hi) hi = vals[i]; }
      var scales = U.scales(C), nb, cols;
      if (fd.div) { var mx = Math.max(Math.abs(lo), Math.abs(hi)) || 1; lo = -mx; hi = mx; nb = 11; cols = U.ramp(scales.div, nb); }
      else { if (hi - lo < 1e-9 * Math.max(Math.abs(hi), 1e-30)) lo = hi - (Math.abs(hi) || 1); nb = 10; cols = U.ramp(scales.seq, nb); }
      var span = hi - lo, lev = []; for (i = 0; i <= nb; i++) lev.push(lo + span * i / nb);
      function band(v) { var b = Math.floor((v - lo) / span * nb); return b < 0 ? 0 : b >= nb ? nb - 1 : b; }

      var paths = []; for (i = 0; i < nb; i++) paths.push(new Path2D());
      var edges = new Path2D();
      function tri(P) {
        var v0 = P[0][2], v1 = P[1][2], v2 = P[2][2], b0 = band(Math.min(v0, v1, v2)), b1 = band(Math.max(v0, v1, v2));
        for (var bk = b0; bk <= b1; bk++) {
          var poly = P;
          if (bk > b0) poly = clip(poly, lev[bk], true);
          if (bk < b1) poly = clip(poly, lev[bk + 1], false);
          if (poly.length < 3) continue;
          var p = paths[bk]; p.moveTo(poly[0][0], poly[0][1]);
          for (var r = 1; r < poly.length; r++) p.lineTo(poly[r][0], poly[r][1]);
          p.closePath();
        }
      }
      var type = mesh.type, pts = [];
      for (e = 0; e < ne; e++) {
        var base = e * npe;
        if (type === 'Q8') {
          pts.length = 0;
          for (var s = 0; s < 16; s++) {
            var N = Q8N[s], xx = 0, yy = 0, vv = 0;
            for (a = 0; a < 8; a++) { var nd = Cn[base + a]; xx += N[a] * px[nd]; yy += N[a] * py[nd]; vv += N[a] * vals[base + a]; }
            pts.push([SX(xx), SY(yy), vv]);
          }
          for (s = 0; s < 18; s++) tri([pts[Q8TRI[s][0]], pts[Q8TRI[s][1]], pts[Q8TRI[s][2]]]);
          edges.moveTo(pts[Q8RIM[0]][0], pts[Q8RIM[0]][1]); for (s = 1; s < 12; s++) edges.lineTo(pts[Q8RIM[s]][0], pts[Q8RIM[s]][1]); edges.closePath();
        } else {
          pts.length = 0;
          for (a = 0; a < npe; a++) { var n2 = Cn[base + a]; pts.push([SX(px[n2]), SY(py[n2]), vals[base + a]]); }
          if (npe === 3) tri(pts);
          else {
            var cx = 0, cy = 0, cvv = 0; for (a = 0; a < 4; a++) { cx += pts[a][0] / 4; cy += pts[a][1] / 4; cvv += pts[a][2] / 4; }
            pts.push([cx, cy, cvv]);
            for (s = 0; s < 4; s++) tri([pts[Q4SUB[s][0]], pts[Q4SUB[s][1]], pts[Q4SUB[s][2]]]);
          }
          edges.moveTo(pts[0][0], pts[0][1]); for (a = 1; a < npe; a++) edges.lineTo(pts[a][0], pts[a][1]); edges.closePath();
        }
      }
      for (i = 0; i < nb; i++) { g.fillStyle = cols[i]; g.fill(paths[i]); g.strokeStyle = cols[i]; g.lineWidth = 0.5; g.stroke(paths[i]); }
      if (S.mesh === '1') { g.strokeStyle = U.rgba(C.fg, ne > 1500 ? 0.22 : 0.4); g.lineWidth = 0.6; g.stroke(edges); }

      // undeformed outline
      if (sc > 0) {
        g.save(); g.setLineDash([4, 3]); g.strokeStyle = U.rgba(C.fg2, 0.8); g.lineWidth = 1; g.beginPath();
        mesh.bedges.forEach(function (be) { var n0 = be.n[0], nL = be.n[be.n.length - 1]; g.moveTo(SX(X[n0]), SY(Y[n0])); if (be.n.length === 3) g.lineTo(SX(X[be.n[1]]), SY(Y[be.n[1]])); g.lineTo(SX(X[nL]), SY(Y[nL])); });
        g.stroke(); g.restore();
      }
      // line path
      if (lineData) {
        var d = lineData.d; g.save(); g.setLineDash([6, 4]); g.strokeStyle = C.fg; g.lineWidth = 1.4; g.beginPath();
        for (i = 0; i <= 40; i++) { var pp = d.pt(d.xr[0] + (d.xr[1] - d.xr[0]) * i / 40); if (i) g.lineTo(SX(pp[0]), SY(pp[1])); else g.moveTo(SX(pp[0]), SY(pp[1])); }
        g.stroke(); g.restore();
      }
      glyphs(g, m, px, py, SX, SY);

      view = { SX: SX, SY: SY, px: px, py: py, W: W, H: H, nodal: F.nodalField(m, S.field) };
      sub.textContent = U.fill(t(sc > 0 ? 'p1s' : 'p1sU'), { smooth: F.isStress(S.field) ? t(raw ? 'sRaw' : 'sAvg') : t('sDisp'), s: fmt(sc) });
      colorbar(cbar, cols, lev, fd.unit);
      drawHover(null);
    }
    function setSize(W, H) {
      var dpr = window.devicePixelRatio || 1;
      [cv1, ov1].forEach(function (c) { c.style.height = H + 'px'; if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); } });
    }
    function colorbar(el, cols, lev, unit) {
      var W = el.clientWidth || 300, nb = cols.length, stride = Math.max(1, Math.ceil(56 / (W / nb)));
      var sw = cols.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join(''), show = [];
      for (var i = 0; i <= nb; i += stride) show.push(i);
      if (show[show.length - 1] !== nb) { if (nb - show[show.length - 1] < stride) show.pop(); show.push(nb); }
      var tk = show.map(function (i) {
        var tf = i === 0 ? 'translateX(0)' : i === nb ? 'translateX(-100%)' : 'translateX(-50%)';
        return '<b style="left:' + (100 * i / nb) + '%;transform:' + tf + '">' + fmt(lev[i]) + '</b>';
      }).join('');
      el.innerHTML = '<div class="rzt-cb-sw">' + sw + '</div><div class="rzt-cb-tk">' + tk + '</div><span class="rzt-cb-u">' + unit + '</span>';
    }

    // supports (walls / rollers / pins) and load arrows
    function glyphs(g, m, px, py, SX, SY) {
      var mesh = m.mesh, fx = m.fixed, pr = m.pr, bb = pr.bbox, cxm = (bb[0] + bb[1]) / 2, cym = (bb[2] + bb[3]) / 2;
      g.save(); g.strokeStyle = C.fg2; g.fillStyle = C.fg2; g.lineWidth = 1.2;
      function outward(be) {
        var A = be.n[0], B = be.n[be.n.length - 1], tx = mesh.X[B] - mesh.X[A], ty = mesh.Y[B] - mesh.Y[A], nx = ty, ny = -tx, l = Math.hypot(nx, ny) || 1;
        nx /= l; ny /= l;
        var mx = (mesh.X[A] + mesh.X[B]) / 2 - cxm, my = (mesh.Y[A] + mesh.Y[B]) / 2 - cym;
        if (pr.key === 'hole' && be.tag !== 's1') { nx = be.tag === 't0' ? 0 : -1; ny = be.tag === 't0' ? -1 : 0; return [nx, ny]; }
        if (nx * mx + ny * my < 0) { nx = -nx; ny = -ny; }
        return [nx, ny];
      }
      var nodeN = {}, walls = [];
      mesh.bedges.forEach(function (be) {
        var all = be.n.every(function (n) { return fx[2 * n] && fx[2 * n + 1]; }), any = be.n.some(function (n) { return fx[2 * n] || fx[2 * n + 1]; });
        if (!any) return;
        var o = outward(be);
        if (all) walls.push([be, o]);
        be.n.forEach(function (n) { if (!nodeN[n] && (fx[2 * n] || fx[2 * n + 1])) nodeN[n] = o; });
      });
      // walls: offset line + hatch
      walls.forEach(function (w) {
        var be = w[0], o = w[1], ox = o[0] * 4, oy = -o[1] * 4, A = be.n[0], B = be.n[be.n.length - 1];
        var ax = SX(px[A]) + ox, ay = SY(py[A]) + oy, bx = SX(px[B]) + ox, by = SY(py[B]) + oy, len = Math.hypot(bx - ax, by - ay);
        g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by);
        var nh = Math.max(1, Math.round(len / 7));
        var ux = (bx - ax) / (len || 1), uy = (by - ay) / (len || 1);
        for (var i = 0; i <= nh; i++) { var tt = i / nh, hx = ax + tt * (bx - ax), hy = ay + tt * (by - ay); g.moveTo(hx, hy); g.lineTo(hx + o[0] * 6 + ux * 4, hy - o[1] * 6 + uy * 4); }
        g.stroke();
      });
      // rollers and pins
      var last = {}, step = 9;
      Object.keys(nodeN).forEach(function (key) {
        var n = +key, o = nodeN[key], both = fx[2 * n] && fx[2 * n + 1], sx = SX(px[n]), sy = SY(py[n]);
        if (both) {
          var onWall = walls.some(function (w) { return w[0].n.indexOf(n) >= 0; });
          if (onWall) return;
          g.beginPath(); g.moveTo(sx, sy + 2); g.lineTo(sx - 5, sy + 10); g.lineTo(sx + 5, sy + 10); g.closePath(); g.fill();
          return;
        }
        var tag = o.join(','), lp = last[tag];
        if (lp && Math.hypot(lp[0] - sx, lp[1] - sy) < step) return;
        last[tag] = [sx, sy];
        var cx = sx + o[0] * 5, cy = sy - o[1] * 5;
        g.beginPath(); g.arc(cx, cy, 2.6, 0, Math.PI * 2); g.stroke();
        g.beginPath(); g.moveTo(cx + o[0] * 3 - o[1] * 4, cy - o[1] * 3 - o[0] * 4); g.lineTo(cx + o[0] * 3 + o[1] * 4, cy - o[1] * 3 + o[0] * 4); g.stroke();
      });
      // load arrows on traction edges
      var loaded = mesh.bedges.filter(function (be) { return be.tag === 's1'; }), tr = [], tmax = 0;
      var every = Math.max(1, Math.ceil(loaded.length / 14));
      loaded.forEach(function (be, i) {
        if (i % every) return;
        var nA = be.n[0], nB = be.n[be.n.length - 1], mid = be.n.length === 3 ? be.n[1] : -1;
        var x = mid >= 0 ? mesh.X[mid] : (mesh.X[nA] + mesh.X[nB]) / 2, y = mid >= 0 ? mesh.Y[mid] : (mesh.Y[nA] + mesh.Y[nB]) / 2;
        var dx = mid >= 0 ? px[mid] - mesh.X[mid] : (px[nA] + px[nB] - mesh.X[nA] - mesh.X[nB]) / 2, dy = mid >= 0 ? py[mid] - mesh.Y[mid] : (py[nA] + py[nB] - mesh.Y[nA] - mesh.Y[nB]) / 2;
        var tv = pr.traction('s1', x, y); if (!tv) return;
        var mag = Math.hypot(tv[0], tv[1]); tmax = Math.max(tmax, mag);
        tr.push({ x: x + dx, y: y + dy, t: tv, mag: mag, o: outward(be) });
      });
      g.strokeStyle = C.gold; g.fillStyle = C.gold; g.lineWidth = 1.8;
      tr.forEach(function (a) {
        if (!(a.mag > 1e-9 * tmax)) return;
        var L = 6 + 22 * a.mag / tmax, ux = a.t[0] / a.mag, uy = -a.t[1] / a.mag;
        var sx = SX(a.x) + a.o[0] * 6, sy = SY(a.y) - a.o[1] * 6, ex = sx + ux * L, ey = sy + uy * L;
        g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.stroke();
        g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex - ux * 5 - uy * 3, ey - uy * 5 + ux * 3); g.lineTo(ex - ux * 5 + uy * 3, ey - uy * 5 - ux * 3); g.closePath(); g.fill();
      });
      g.restore();
    }

    function drawHover(n) {
      var dpr = window.devicePixelRatio || 1, g = ov1.getContext('2d'), rd = q('[data-read="1"]');
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, ov1.width / dpr, ov1.height / dpr);
      if (n == null || !view) { rd.textContent = ''; return; }
      var m = cur.model, sx = view.SX(view.px[n]), sy = view.SY(view.py[n]);
      g.beginPath(); g.arc(sx, sy, 5.5, 0, Math.PI * 2); g.lineWidth = 2; g.strokeStyle = C.surface; g.stroke();
      g.beginPath(); g.arc(sx, sy, 4.5, 0, Math.PI * 2); g.lineWidth = 1.6; g.strokeStyle = C.fg; g.stroke();
      var fd = FIELD[S.field], x = m.mesh.X[n], y = m.mesh.Y[n], v = view.nodal[n] * fd.k, ex = F.exactField(m, S.field, x, y) * fd.k;
      rd.textContent = U.fill(t('readNode'), { x: x.toFixed(3), y: y.toFixed(3), f: SYM[S.field], v: fmt(v) + ' ' + fd.unit }) +
        (isFinite(ex) ? U.fill(t('readExact'), { v: fmt(ex) + ' ' + fd.unit }) : '');
    }
    function nearestNode(ev) {
      if (!view) return null;
      var r = ov1.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, best = null, bd = 18 * 18;
      for (var i = 0; i < view.px.length; i++) { var dx = view.SX(view.px[i]) - mx, dy = view.SY(view.py[i]) - my, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
      return best;
    }
    ov1.addEventListener('mousemove', function (ev) { drawHover(nearestNode(ev)); });
    ov1.addEventListener('mouseleave', function () { drawHover(null); });
    ov1.addEventListener('click', function (ev) { drawHover(nearestNode(ev)); });

    /* ── line plot ────────────────────────────────────────────── */
    function drawLine() {
      var lg = q('[data-lg="2"]');
      if (!lineData) { P2 = U.plot(cv2, { xr: [0, 1], yr: [0, 1] }, C); lg.innerHTML = ''; return; }
      var L = lineData, lo = Infinity, hi = -Infinity;
      L.fe.concat(L.rf).forEach(function (v) { if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } });
      if (!isFinite(lo)) { lo = -1; hi = 1; }
      var pad = (hi - lo) * 0.08 || Math.max(Math.abs(hi) * 0.1, 1e-3); lo -= pad; hi += pad;
      var refOnly = (S.problem === 'cantilever' && S.support === 'clamped') || (S.problem === 'hole' && S.outer === 'uniform');
      var refName = cur.model.pr.key === 'hole' ? (S.outer === 'kirsch' ? t('lgExact') : t('lgKirsch')) : cur.model.pr.key === 'cantilever' ? (S.support === 'exact' ? t('lgExact') : t('lgTimo')) : t('lgExact');
      P2 = U.plot(cv2, { xr: L.d.xr, yr: [lo, hi], xlabel: L.d.xl, ylabel: L.unit, ml: 56,
        hlines: lo < 0 && hi > 0 ? [{ y: 0, stroke: C.border, width: 1.5 }] : [],
        lines: [refOnly ? { x: L.xs, y: L.rf, stroke: C.fg2, width: 1.6, dash: [5, 4] } : { x: L.xs, y: L.rf, stroke: U.rgba(C.fg2, 0.45), width: 5 },
                { x: L.xs, y: L.fe, stroke: C.accent, width: 1.8 }] }, C);
      lg.innerHTML = U.legendHtml([{ t: t('lgFE') + ' (' + S.elem + ')', c: C.accent }, refOnly ? { t: refName, c: C.fg2, dash: true } : { t: refName, c: U.rgba(C.fg2, 0.6) }]);
    }
    cv2.addEventListener('mousemove', function (ev) {
      if (!P2 || !lineData) return;
      var r = cv2.getBoundingClientRect(), x = P2.invX(ev.clientX - r.left), L = lineData, i = 0, bd = Infinity;
      for (var k = 0; k < L.xs.length; k++) { var d = Math.abs(L.xs[k] - x); if (d < bd) { bd = d; i = k; } }
      q('[data-read="2"]').textContent = U.fill(t('readLine'), { x: L.d.xl.split(' ')[0] + ' = ' + fmt(L.xs[i]), fe: fmt(L.fe[i]), ex: fmt(L.rf[i]), u: L.unit });
    });
    cv2.addEventListener('mouseleave', function () { q('[data-read="2"]').textContent = ''; });

    /* ── convergence study ────────────────────────────────────── */
    function hasExact() { return S.problem === 'patch' ? false : S.problem === 'cantilever' ? S.support === 'exact' : S.outer === 'kirsch'; }
    function runStudy() {
      if (!hasExact()) return;
      var tok = ++studyTok, jobs = [], key = studyKey();
      ELEMS.forEach(function (el) { STUDY_N[S.problem].forEach(function (n) { jobs.push({ el: el, n: n }); }); });
      study = { key: key, pts: { T3: [], Q4: [], QM6: [], Q8: [] }, done: 0, total: jobs.length };
      var base = cfg();
      (function next() {
        if (tok !== studyTok) return;
        if (!jobs.length) { study.finished = true; drawConv(); return; }
        var j = jobs.shift(), c = {}; for (var k in base) c[k] = base[k]; c.elem = j.el; c.n = j.n;
        var m = F.run(c);
        if (!m.error) study.pts[j.el].push({ dof: m.ndof, e: F.energyError(m) });
        study.done++; drawConv();
        setTimeout(next, 0);
      })();
    }
    function drawConv() {
      var lg = q('[data-lg="3"]'), msg = q('[data-out="study"]'), btn = q('[data-act="study"]'), series = U.series(C);
      btn.disabled = !hasExact() || !!(study && !study.finished && study.key === studyKey());
      var pts = [], lines = [], items = [], all = [];
      var valid = study && study.key === studyKey();
      if (S.problem === 'patch') msg.textContent = t('noPatch');
      else if (!hasExact()) msg.textContent = t('noExact');
      else if (!study) msg.textContent = t('idle');
      else if (!valid) msg.textContent = t('stale');
      else msg.textContent = study.finished ? '' : U.fill(t('running'), { i: study.done, n: study.total });
      convPts = [];
      if (valid) ELEMS.forEach(function (el, i) {
        var P = study.pts[el]; if (!P.length) return;
        var xs = P.map(function (p) { return p.dof; }), ys = P.map(function (p) { return p.e; }), w = el === S.elem ? 2.6 : 1.6;
        lines.push({ x: xs, y: ys, stroke: series[i], width: w });
        P.forEach(function (p) { pts.push({ x: p.dof, y: p.e, r: el === S.elem ? 5 : 4, fill: series[i], stroke: C.surface, lw: 1.5, shape: SHAPES[i] }); convPts.push({ el: el, dof: p.dof, e: p.e }); all.push(p); });
        var rate = P.length > 1 ? Math.log(P[P.length - 2].e / P[P.length - 1].e) / Math.log(Math.sqrt(P[P.length - 1].dof / P[P.length - 2].dof)) : NaN;
        items.push({ t: el + (isFinite(rate) ? ' · ' + t('rate') + ' ' + rate.toFixed(2) : ''), c: series[i], type: 'marker', shape: SHAPES[i] });
      });
      if (cur && !cur.model.error && cur.err != null && hasExact()) {
        all.push({ dof: cur.model.ndof, e: cur.err });
        pts.push({ x: cur.model.ndof, y: cur.err, r: 7.5, stroke: C.fg, lw: 1.8 });
        items.push({ t: t('cur') + ' (' + S.elem + ')', c: C.surface, type: 'dot', b: C.fg });
      }
      var dx = [10, 1e4], dy = [1e-3, 1];
      if (all.length) {
        var mnx = Math.min.apply(null, all.map(function (p) { return p.dof; })), mxx = Math.max.apply(null, all.map(function (p) { return p.dof; }));
        var mny = Math.min.apply(null, all.map(function (p) { return p.e; })), mxy = Math.max.apply(null, all.map(function (p) { return p.e; }));
        dx = [Math.pow(10, Math.floor(Math.log10(mnx))), Math.pow(10, Math.ceil(Math.log10(mxx)))];
        dy = [Math.pow(10, Math.floor(Math.log10(mny))), Math.pow(10, Math.ceil(Math.log10(mxy)))];
        if (dy[1] / dy[0] < 100) dy[0] = dy[1] / 100;
        if (dx[1] / dx[0] < 100) dx[1] = dx[0] * 100;
      }
      P3 = U.plot(cv3, { xr: dx, yr: dy, xlog: true, ylog: true, xlabel: 'DOF', lines: lines, points: pts }, C);
      lg.innerHTML = U.legendHtml(items);
    }
    cv3.addEventListener('mousemove', function (ev) {
      if (!P3 || !convPts.length) return;
      var r = cv3.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, best = null, bd = 16 * 16;
      convPts.forEach(function (p) { var dx = P3.X(p.dof) - mx, dy = P3.Y(p.e) - my, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = p; } });
      q('[data-read="3"]').textContent = best ? U.fill(t('readConv'), { el: best.el, dof: U.group(best.dof), e: U.sci(best.e) }) : '';
    });
    cv3.addEventListener('mouseleave', function () { q('[data-read="3"]').textContent = ''; });

    /* ── redraw / update ──────────────────────────────────────── */
    function redraw() {
      if (!cur) return;
      sync(); setMetrics(); drawContour(); drawLine(); drawConv();
    }
    var pending = false, needCompute = false;
    function update(recompute) {
      if (recompute) needCompute = true;
      if (pending) return; pending = true;
      requestAnimationFrame(function () {
        pending = false;
        if (needCompute) { needCompute = false; compute(); }
        redraw();
      });
    }

    /* events */
    var RECOMP = { ld: 1, ar: 1, nu: 1, n: 1, distort: 1 };
    function readInput(el) {
      var k = el.getAttribute('data-in'), v = el.value;
      if (k === 'n') S.n[S.problem] = +v;
      else if (k === 'line') S.line = v;
      else if (k === 'field') S.field = v;
      else if (k === 'problem') {
        S.problem = v; S.line = LINES[v][0];
        S.distort = v === 'patch' ? 0.3 : 0;
        S.field = v === 'patch' ? 'sxx' : v === 'hole' ? 'sxx' : 'svm';
        fillLineSelect();
      } else S[k] = +v;
      return k;
    }
    root.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-in'); if (!k || e.target.tagName === 'SELECT') return;
      readInput(e.target);
      if (k === 'scale') { update(false); return; }
      if (RECOMP[k]) {
        if (F.size(cfg()).dof <= LIVE_DOF) update(true);
        else { sync(); var o = q('[data-out="size"]'); o.textContent += ' · ' + t('big'); }
      }
    });
    root.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-in'); if (!k) return;
      readInput(e.target);
      if (k === 'line') { computeLine(); update(false); return; }
      if (k === 'field' || k === 'scale') { if (k === 'field') computeLine(); update(false); return; }
      update(true);
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
      var sg = b.parentNode.getAttribute('data-seg');
      if (sg) {
        S[sg] = b.getAttribute('data-v');
        if (sg === 'smooth') { computeLine(); update(false); }
        else update(sg !== 'mesh');
        return;
      }
      var act = b.getAttribute('data-act');
      if (act === 'shuffle') { S.seed = (S.seed * 48271 + 11) % 2147483647; update(true); }
      else if (act === 'reset') { studyTok++; study = null; S = clone(DEFAULTS); fillLineSelect(); update(true); }
      else if (act === 'study') runStudy();
    });

    if ('ResizeObserver' in window) new ResizeObserver(function () { var w = root.clientWidth; if (w !== lastW) { lastW = w; update(false); } }).observe(root);
    else window.addEventListener('resize', function () { update(false); });
    function themeChanged() { C = U.readColors(root); update(false); }
    var mo = new MutationObserver(function (list) { list.forEach(function (m) { if (m.attributeName === 'data-rzlang') applyLang(); else themeChanged(); }); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-rzlang', 'data-theme'] });
    if (window.matchMedia) { var mq = window.matchMedia('(prefers-color-scheme: dark)'); (mq.addEventListener ? mq.addEventListener('change', themeChanged) : mq.addListener(themeChanged)); }

    compute(); applyLang();
  });
})();

window.RZTools.version='1.1.0';
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',window.RZTools.boot);else window.RZTools.boot();
