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
