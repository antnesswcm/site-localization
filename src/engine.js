/* SPDX-License-Identifier: MIT
 * Original local DOM translator. No network requests or third-party dependencies.
 * Load this script, then call installTranslator(a trusted local adapter).
 */
(function (global) {
  'use strict';

  const DEFAULT_UI = 'button,a,label,legend,summary,option,h1,h2,h3,h4,h5,h6,[role="button"],[role="tab"],[role="menuitem"],[role="heading"]';
  const EXCLUDED = 'script,style,pre,code,textarea,[contenteditable]:not([contenteditable="false"]),.notranslate,[translate="no"],[data-local-ui-translator]';
  const ALLOWED_ATTRIBUTES = new Set(['title', 'placeholder', 'aria-label']);

  function installTranslator(adapter) {
    if (!adapter || typeof adapter.id !== 'string' || !adapter.id.trim()) {
      throw new TypeError('A trusted adapter with a nonempty id is required.');
    }
    const doc = global.document;
    const exact = Object.assign(Object.create(null), adapter.exact || {});
    const uiSelector = adapter.uiSelector || DEFAULT_UI;
    const rootSelector = adapter.rootSelector || null;
    const excluded = [EXCLUDED, adapter.ignoreSelector, adapter.protectSelector].filter(Boolean).join(',');
    const attributes = Array.from(new Set(adapter.attributes || ['title', 'placeholder', 'aria-label']));
    if (attributes.some(name => !ALLOWED_ATTRIBUTES.has(name))) {
      throw new TypeError('Only title, placeholder and aria-label may be translated.');
    }
    // Validate before stopping an existing installation. Regexes are code-like local
    // resources: never construct an adapter from a remote response or page text.
    const rules = (adapter.rules || []).map(rule => {
      if (typeof rule.pattern !== 'string' || !rule.pattern.startsWith('^') || !rule.pattern.endsWith('$')) {
        throw new TypeError('Translation rules must start with ^ and end with $.');
      }
      if (typeof rule.replacement !== 'string' || /[my]/.test(rule.flags || '')) {
        throw new TypeError('Rules require a string replacement and cannot use m/y flags.');
      }
      return { regex: new RegExp(rule.pattern, (rule.flags || '').replace(/g/g, '')), replacement: rule.replacement, selector: rule.selector || null };
    });
    const selectors = [excluded, uiSelector, rootSelector, ...rules.map(rule => rule.selector)].filter(Boolean);
    selectors.forEach(selector => doc.querySelector(selector));
    if (global.__localUiTranslator && typeof global.__localUiTranslator.stop === 'function') {
      global.__localUiTranslator.stop();
    }

    const records = new WeakMap();
    const modified = new Set();
    const queue = new Set();
    const counts = { scans: 0, visited: 0, translated: 0, restored: 0, externalChanges: 0, flushes: 0 };
    const storageKey = 'local-ui-translator:' + adapter.id;
    let enabled = true;
    let stopped = false;
    let frame = null;
    let button = null;
    let position = { side: 'right', y: 0.5 };
    let drag = null;
    let suppressClick = false;
    let colorScheme = null;
    try { colorScheme = global.matchMedia('(prefers-color-scheme: dark)'); } catch (_) { /* Light colors remain usable. */ }
    try {
      // The userscript-level store owns local-ui-translator:toggle-position.
      // Origin-local storage cannot provide the shared cross-site position.
      const saved = global.__localUiPositionStore?.read();
      if (saved && (saved.side === 'left' || saved.side === 'right') &&
          typeof saved.y === 'number' && Number.isFinite(saved.y) && saved.y >= 0 && saved.y <= 1) {
        position = { side: saved.side, y: saved.y };
      }
    } catch (_) { /* Corrupt or unavailable storage uses the default position. */ }
    try { enabled = global.localStorage.getItem(storageKey) !== 'off'; } catch (_) { /* Storage is optional. */ }

    function elementFor(node) { return node.nodeType === 1 ? node : node.parentElement; }
    function allowed(element) {
      return !!element && !element.closest(excluded) && (!rootSelector || !!element.closest(rootSelector));
    }
    function readField(node, field) { return field === '#text' ? node.nodeValue : node.getAttribute(field); }
    function writeField(node, field, value) {
      if (field === '#text') node.nodeValue = value;
      else if (value === null) node.removeAttribute(field);
      else node.setAttribute(field, value);
    }
    function forget(node, field) {
      const map = records.get(node);
      if (!map) return;
      map.delete(field);
      if (!map.size) { records.delete(node); modified.delete(node); }
    }
    function restoreField(node, field) {
      const record = records.get(node)?.get(field);
      if (!record) return;
      if (readField(node, field) === record.last) {
        writeField(node, field, record.original);
        counts.restored++;
      }
      forget(node, field);
    }
    function restoreNode(node) {
      const map = records.get(node);
      if (map) Array.from(map.keys()).forEach(field => restoreField(node, field));
    }
    function translate(value, element, field) {
      if (typeof value !== 'string' || !value.trim()) return value;
      const text = value.trim();
      let result = text;
      if (Object.prototype.hasOwnProperty.call(exact, text)) {
        const short = text.length <= 32 && text.split(/\s+/).length <= 3;
        // Attributes are explicit UI labels; short text nodes need a UI scope.
        if (!short || field !== '#text' || element.closest(uiSelector)) result = exact[text];
      }
      if (result === text) {
        for (const rule of rules) {
          // Unscoped text rules must stay within explicit UI, just like short exact terms.
          if (field === '#text' && !rule.selector && !element.closest(uiSelector)) continue;
          if (rule.selector && !element.closest(rule.selector)) continue;
          const match = rule.regex.exec(text);
          // Full-match guard also rejects unsafe top-level ^a|b$ alternatives.
          if (match && match.index === 0 && match[0].length === text.length) {
            result = text.replace(rule.regex, rule.replacement);
            break;
          }
        }
      }
      if (typeof result !== 'string' || result === text) return value;
      const start = value.indexOf(text);
      return value.slice(0, start) + result + value.slice(start + text.length);
    }
    function processField(node, field) {
      counts.visited++;
      const element = elementFor(node);
      if (!enabled || !allowed(element)) { restoreField(node, field); return; }
      let current = readField(node, field);
      let previous = records.get(node)?.get(field);
      if (previous && current !== previous.last) {
        counts.externalChanges++;
        forget(node, field);
        previous = null;
      }
      // Re-evaluate context even when a framework retained our translated value.
      const original = previous ? previous.original : current;
      const translated = translate(original, element, field);
      if (translated === original) { restoreField(node, field); return; }
      if (current === translated) return;
      let map = records.get(node);
      if (!map) { map = new Map(); records.set(node, map); }
      map.set(field, { original, last: translated });
      modified.add(node);
      writeField(node, field, translated);
      counts.translated++;
    }
    function scan(root) {
      if (!root || !root.isConnected) return;
      counts.scans++;
      if (root.nodeType === 3) { processField(root, '#text'); return; }
      if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
      function attrs(element) { attributes.forEach(name => { if (element.hasAttribute(name) || records.get(element)?.has(name)) processField(element, name); }); }
      if (root.nodeType === 1 && root.closest(excluded)) return;
      if (root.nodeType === 1) attrs(root);
      const walker = doc.createTreeWalker(root, global.NodeFilter.SHOW_ELEMENT | global.NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          return node.nodeType === 1 && node.matches(excluded)
            ? global.NodeFilter.FILTER_REJECT : global.NodeFilter.FILTER_ACCEPT;
        }
      });
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeType === 3) processField(node, '#text');
        else attrs(node);
      }
    }
    function prune() {
      // Restore safely before forgetting detached nodes: reinsertion must not turn
      // our Chinese value into the next scan's supposed English original.
      for (const node of modified) {
        if (!node.isConnected || !allowed(elementFor(node))) restoreNode(node);
      }
    }
    function flush() {
      frame = null;
      if (stopped) return;
      counts.flushes++;
      ensureButton();
      const roots = Array.from(queue);
      queue.clear();
      const minimal = roots.filter(root => !roots.some(other => other !== root && other.contains && other.contains(root)));
      minimal.forEach(scan);
      prune();
    }
    function scheduleFlush() {
      if (!stopped && frame === null) frame = global.requestAnimationFrame(flush);
    }
    function enqueue(node) {
      if (stopped || !node) return;
      queue.add(node);
      scheduleFlush();
    }
    function isOurWrite(node, field) {
      const record = records.get(node)?.get(field);
      return !!record && readField(node, field) === record.last;
    }
    const contextAttributes = new Set(['class', 'id', 'role', 'contenteditable', 'translate']);
    // Selector attributes can change SPA protection/scope without text changing.
    selectors.forEach(selector => {
      const regex = /\[\s*([\w:-]+)/g;
      let match;
      while ((match = regex.exec(selector))) contextAttributes.add(match[1]);
    });
    const observer = new global.MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (button && (mutation.target === button || button.contains(mutation.target))) continue;
        if (mutation.type === 'characterData') {
          if (!isOurWrite(mutation.target, '#text')) enqueue(mutation.target);
        } else if (mutation.type === 'attributes') {
          // Adapters must use ancestor scopes; sibling/:has dependency tracking
          // is intentionally unsupported to keep updates confined to this subtree.
          if (contextAttributes.has(mutation.attributeName) || !isOurWrite(mutation.target, mutation.attributeName)) enqueue(mutation.target);
        } else {
          for (const node of mutation.addedNodes) {
            if (node !== button) enqueue(node);
          }
          // Only cleanup/reattach on removals, never rescan a whole React list.
          if (mutation.removedNodes.length && (modified.size || (button && !button.isConnected))) scheduleFlush();
        }
      }
    });
    function observe() {
      observer.observe(doc, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: Array.from(new Set([...attributes, ...contextAttributes])) });
    }
    function bounds() {
      const width = global.innerWidth;
      const height = global.innerHeight;
      const x = Math.max(0, width - button.offsetWidth);
      const y = Math.max(0, height - button.offsetHeight);
      return { x, y };
    }
    function placeButton() {
      if (!button || !button.isConnected || drag) return;
      const b = bounds();
      button.style.left = (position.side === 'left' ? 0 : b.x) + 'px';
      button.style.top = (position.y * b.y) + 'px';
      button.style.borderRadius = position.side === 'left' ? '0 50% 50% 0' : '50% 0 0 50%';
      button.style.cursor = 'pointer';
    }
    function savePosition() {
      try { global.__localUiPositionStore?.write({ ...position }); } catch (_) { /* Storage is optional. */ }
    }
    function updateColors() {
      if (!button) return;
      const dark = !!colorScheme?.matches;
      button.style.backgroundColor = dark ? '#252a32' : '#f8fafc';
      button.style.color = dark ? '#f1f5f9' : '#202938';
      button.style.borderColor = dark ? '#8993a3' : '#697586';
      button.style.boxShadow = dark ? '0 2px 6px #0006' : '0 2px 6px #0003';
      const logo = button.firstElementChild;
      if (logo) {
        logo.style.backgroundColor = dark ? '#8b4165' : '#f3b6d0';
        logo.style.color = dark ? '#fff7fb' : '#3c2030';
      }
    }
    function endDrag(event, save = true) {
      if (!drag || (event && event.pointerId !== drag.id)) return;
      const previous = drag;
      drag = null;
      global.removeEventListener('pointermove', moveDrag);
      global.removeEventListener('pointerup', endDrag);
      global.removeEventListener('pointercancel', endDrag);
      try { button.releasePointerCapture(previous.id); } catch (_) { /* Capture may already be lost. */ }
      if (previous.moved && save) {
        const b = bounds();
        const rect = button.getBoundingClientRect();
        position.side = rect.left + rect.width / 2 < global.innerWidth / 2 ? 'left' : 'right';
        position.y = b.y > 0 ? Math.max(0, Math.min(1, rect.top / b.y)) : 0.5;
        suppressClick = true;
        if (save) savePosition();
      }
      placeButton();
    }
    function moveDrag(event) {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 6) return;
      drag.moved = true;
      button.style.cursor = 'crosshair';
      event.preventDefault();
      const b = bounds();
      button.style.left = Math.max(0, Math.min(b.x, drag.left + dx)) + 'px';
      button.style.top = Math.max(0, Math.min(b.y, drag.top + dy)) + 'px';
    }
    function resizeButton() { endDrag(null); placeButton(); }
    function updateButton() {
      if (!button) return;
      const label = enabled ? '原' : '汉';
      const logo = button.firstElementChild;
      if (logo?.firstChild) logo.firstChild.nodeValue = label;
      button.setAttribute('aria-pressed', String(enabled));
      const help = '拖动贴边；点击切换语言 / Drag to dock; click to switch language';
      const action = enabled ? '恢复英文 / Restore English' : '汉化界面 / Translate to Chinese';
      button.setAttribute('aria-label', action + '；' + help);
      button.title = action + '；' + help;
      placeButton();
    }
    function ensureButton() {
      if (stopped || !doc.body) return;
      if (!button) {
        button = doc.createElement('button');
        button.type = 'button';
        button.tabIndex = -1;
        // Pointer-only control: localization is not a frequent keyboard action.
        const blockActivation = event => {
          if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
        };
        button.addEventListener('keydown', blockActivation);
        button.addEventListener('keyup', blockActivation);
        button.setAttribute('data-local-ui-translator', adapter.id);
        button.style.cssText = 'position:fixed;left:0;top:0;width:36px;height:36px;min-width:0;min-height:0;max-width:100vw;max-height:100vh;box-sizing:border-box;z-index:2147483647;display:flex;align-items:center;justify-content:center;margin:0;padding:0;border:1px solid #697586;border-radius:50%;background:#f8fafc;color:#202938;font:600 20px/1 system-ui;appearance:none;cursor:pointer;touch-action:none;user-select:none;box-shadow:0 2px 8px #0003;';
        const logo = doc.createElement('span');
        logo.setAttribute('data-local-ui-logo', '');
        logo.setAttribute('aria-hidden', 'true');
        logo.style.cssText = 'display:flex;align-items:center;justify-content:center;width:26px;height:26px;min-width:26px;min-height:26px;box-sizing:border-box;border:0;border-radius:50%;padding:0;margin:0;font:600 17px/1 system-ui;pointer-events:none;';
        logo.appendChild(doc.createTextNode(enabled ? '原' : '汉'));
        button.appendChild(logo);
        updateColors();
        colorScheme?.addEventListener('change', updateColors);
        button.addEventListener('click', event => {
          if (suppressClick && event.detail !== 0) { suppressClick = false; event.preventDefault(); return; }
          suppressClick = false;
          api.toggle();
        });
        button.addEventListener('pointerdown', event => {
          if (drag || event.button !== 0 || event.isPrimary === false) return;
          suppressClick = false;
          const rect = button.getBoundingClientRect();
          drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false };
          button.style.borderRadius = '50%';
          button.style.cursor = 'pointer';
          try { button.setPointerCapture(event.pointerId); } catch (_) { /* Window listeners still track the gesture. */ }
          global.addEventListener('pointermove', moveDrag, { passive: false });
          global.addEventListener('pointerup', endDrag);
          global.addEventListener('pointercancel', endDrag);
        });
        button.addEventListener('lostpointercapture', endDrag);
        updateButton();
      }
      if (!button.isConnected) {
        endDrag(null, false);
        doc.body.appendChild(button);
        placeButton();
      }
    }
    function refresh() { ensureButton(); enqueue(doc.documentElement); }
    function restore() {
      observer.disconnect();
      for (const node of modified) restoreNode(node);
      if (!stopped) observe();
    }
    const api = {
      id: adapter.id,
      get enabled() { return enabled; },
      get stopped() { return stopped; },
      get stats() { return Object.freeze({ ...counts, trackedNodes: modified.size, queuedRoots: queue.size, enabled, stopped }); },
      refresh,
      restore,
      toggle(force) {
        if (stopped) return false;
        enabled = typeof force === 'boolean' ? force : !enabled;
        try { global.localStorage.setItem(storageKey, enabled ? 'on' : 'off'); } catch (_) { /* fail safe */ }
        updateButton();
        if (enabled) refresh(); else restore();
        return enabled;
      },
      stop() {
        if (stopped) return;
        stopped = true;
        observer.disconnect();
        if (frame !== null) global.cancelAnimationFrame(frame);
        frame = null;
        queue.clear();
        restore();
        global.removeEventListener('popstate', refresh);
        global.removeEventListener('hashchange', refresh);
        global.removeEventListener('resize', resizeButton);
        colorScheme?.removeEventListener('change', updateColors);
        endDrag(null, false);
        doc.removeEventListener('DOMContentLoaded', refresh);
        if (button) button.remove();
        button = null;
        if (global.__localUiTranslator === api) delete global.__localUiTranslator;
      }
    };
    global.__localUiTranslator = api;
    observe();
    global.addEventListener('popstate', refresh);
    global.addEventListener('hashchange', refresh);
    global.addEventListener('resize', resizeButton);
    doc.addEventListener('DOMContentLoaded', refresh);
    refresh();
    return api;
  }
  global.installTranslator = installTranslator;
})(window);
