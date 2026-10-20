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
  // Labels are set in upper case; `…` marks symbols and units that must keep their case, as do Greek letters.
  U.labelHtml = function (txt) {
    return U.esc(txt).replace(/`([^`]*)`/g, '<span class="rzt-nt">$1</span>').replace(/([\u03B1-\u03C9]+)/g, '<span class="rzt-nt">$1</span>');
  };
  U.plain = function (txt) { return String(txt).replace(/`/g, ''); };
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


  /* ── field definitions, number format, banded contours ─────── */
  U.FIELD = {
    umag: { unit: 'mm', k: 1e3, div: false }, ux: { unit: 'mm', k: 1e3, div: true }, uy: { unit: 'mm', k: 1e3, div: true },
    sxx: { unit: 'MPa', k: 1e-6, div: true }, syy: { unit: 'MPa', k: 1e-6, div: true }, sxy: { unit: 'MPa', k: 1e-6, div: true },
    svm: { unit: 'MPa', k: 1e-6, div: false }, phi: { unit: '', k: 1, div: true }
  };
  U.FSYM = { umag: '|u|', ux: 'ux', uy: 'uy', sxx: 'σxx', syy: 'σyy', sxy: 'τxy', svm: 'σvM', phi: 'φ' };
  U.fmt = function (v) {
    if (!isFinite(v)) return '—';
    if (v === 0) return '0';
    var a = Math.abs(v);
    return (a >= 1e4 || a < 1e-2 ? U.sci(v) : String(+v.toPrecision(3))).replace(/^-/, '\u2212');
  };
  function clip(P, lev, above) {
    var out = [], n = P.length;
    for (var i = 0; i < n; i++) {
      var a = P[i], b = P[(i + 1) % n], ia = above ? a[2] >= lev : a[2] <= lev, ib = above ? b[2] >= lev : b[2] <= lev;
      if (ia) out.push(a);
      if (ia !== ib) { var s = (lev - a[2]) / (b[2] - a[2]); out.push([a[0] + s * (b[0] - a[0]), a[1] + s * (b[1] - a[1]), lev]); }
    }
    return out;
  }
  // Banded contour painter: tri([[x,y,v],[x,y,v],[x,y,v]]) collects clipped polygons per band; paint(g) fills them.
  U.bandPainter = function (lo, hi, diverging, C, oneSided) {
    var scales = U.scales(C), nb, cols, i;
    var tiny = 1e-9 * Math.max(Math.abs(lo), Math.abs(hi), 1e-30);
    if (diverging && oneSided && lo >= 0) { if (!(hi - lo > tiny)) lo = 0; if (!(hi > lo)) hi = lo + 1; nb = 10; cols = U.ramp([scales.div[1], scales.div[2]], nb + 2).slice(2); }
    else if (diverging && oneSided && hi <= 0) { if (!(hi - lo > tiny)) hi = 0; if (!(hi > lo)) lo = hi - 1; nb = 10; cols = U.ramp([scales.div[0], scales.div[1]], nb + 2).slice(0, nb); }
    else if (diverging) { var mx = Math.max(Math.abs(lo), Math.abs(hi)) || 1; lo = -mx; hi = mx; nb = 11; cols = U.ramp(scales.div, nb); }
    else { if (!(hi - lo > 1e-9 * Math.max(Math.abs(hi), 1e-30))) lo = hi - (Math.abs(hi) || 1); nb = 10; cols = U.ramp(scales.seq, nb); }
    var span = hi - lo, lev = []; for (i = 0; i <= nb; i++) lev.push(lo + span * i / nb);
    function band(v) { var b = Math.floor((v - lo) / span * nb); return b < 0 ? 0 : b >= nb ? nb - 1 : b; }
    var paths = []; for (i = 0; i < nb; i++) paths.push(new Path2D());
    return {
      cols: cols, lev: lev,
      tri: function (P) {
        var v0 = P[0][2], v1 = P[1][2], v2 = P[2][2];
        if (!isFinite(v0) || !isFinite(v1) || !isFinite(v2)) return;
        var b0 = band(Math.min(v0, v1, v2)), b1 = band(Math.max(v0, v1, v2));
        for (var bk = b0; bk <= b1; bk++) {
          var poly = P;
          if (bk > b0) poly = clip(poly, lev[bk], true);
          if (bk < b1) poly = clip(poly, lev[bk + 1], false);
          if (poly.length < 3) continue;
          var p = paths[bk]; p.moveTo(poly[0][0], poly[0][1]);
          for (var r = 1; r < poly.length; r++) p.lineTo(poly[r][0], poly[r][1]);
          p.closePath();
        }
      },
      paint: function (g) { for (var j = 0; j < nb; j++) { g.fillStyle = cols[j]; g.fill(paths[j]); g.strokeStyle = cols[j]; g.lineWidth = 0.5; g.stroke(paths[j]); } }
    };
  };
  U.colorbar = function (el, cols, lev, unit) {
    // spacing between tick labels from the widest label (about 7 px per character at 11 px)
    var wide = 0; for (var w0 = 0; w0 < lev.length; w0++) wide = Math.max(wide, U.fmt(lev[w0]).length);
    var W = el.clientWidth || 300, nb = cols.length, stride = Math.max(1, Math.ceil(Math.max(56, wide * 7 + 10) / (W / nb)));
    var sw = cols.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join(''), show = [];
    for (var i = 0; i <= nb; i += stride) show.push(i);
    if (show[show.length - 1] !== nb) { if (nb - show[show.length - 1] < stride) show.pop(); show.push(nb); }
    var tk = show.map(function (i) {
      var tf = i === 0 ? 'translateX(0)' : i === nb ? 'translateX(-100%)' : 'translateX(-50%)';
      return '<b style="left:' + (100 * i / nb) + '%;transform:' + tf + '">' + U.fmt(lev[i]) + '</b>';
    }).join('');
    el.innerHTML = '<div class="rzt-cb-sw">' + sw + '</div><div class="rzt-cb-tk">' + tk + '</div><span class="rzt-cb-u">' + unit + '</span>';
  };

  // supports (walls / rollers / pins) and load arrows. o = { X, Y, bedges, fixed (per dof), pr, px, py, SX, SY, C }
  U.bcGlyphs = function (g, o) {
    var mesh = { X: o.X, Y: o.Y, bedges: o.bedges }, fx = o.fixed, pr = o.pr, px = o.px, py = o.py, SX = o.SX, SY = o.SY, C = o.C, bb = pr.bbox, cxm = (bb[0] + bb[1]) / 2, cym = (bb[2] + bb[3]) / 2;
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
    // load arrows on traction edges (o.loadTags, default the s1 edges)
    var ltags = o.loadTags || ['s1'], tr = [], tmax = 0, loaded = [];
    // thin the arrows on each loaded edge separately (about 14 per edge)
    ltags.forEach(function (tg) {
      var es = mesh.bedges.filter(function (be) { return be.tag === tg; }), every = Math.max(1, Math.ceil(es.length / 14));
      es.forEach(function (be, i) { if (!(i % every)) loaded.push(be); });
    });
    loaded.forEach(function (be) {
      var nA = be.n[0], nB = be.n[be.n.length - 1], mid = be.n.length === 3 ? be.n[1] : -1;
      var x = mid >= 0 ? mesh.X[mid] : (mesh.X[nA] + mesh.X[nB]) / 2, y = mid >= 0 ? mesh.Y[mid] : (mesh.Y[nA] + mesh.Y[nB]) / 2;
      var dx = mid >= 0 ? px[mid] - mesh.X[mid] : (px[nA] + px[nB] - mesh.X[nA] - mesh.X[nB]) / 2, dy = mid >= 0 ? py[mid] - mesh.Y[mid] : (py[nA] + py[nB] - mesh.Y[nA] - mesh.Y[nB]) / 2;
      var tv = pr.traction(be.tag, x, y); if (!tv) return;
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
    var mg = { l: spec.ml || 52, r: 12, t: spec.ylabel ? 22 : 10, b: 26 }, xr = spec.xr, yr = spec.yr, ly = !!spec.ylog, lx = !!spec.xlog;
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
    if (spec.ylabel) { g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText(spec.ylabel, 4, 2); }

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
