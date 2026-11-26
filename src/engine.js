/* SPDX-License-Identifier: MIT
 * Original local DOM translator. No network requests or third-party dependencies.
 * Load this script, then call installTranslator(a trusted local adapter).
 */
(function (global) {
  'use strict';

  const DEFAULT_UI = 'button,a,label,legend,summary,option,h1,h2,h3,h4,h5,h6,[role="button"],[role="tab"],[role="menuitem"],[role="heading"]';
  const EXCLUDED = 'script,style,pre,code,textarea,[contenteditable]:not([contenteditable="false"]),.notranslate,[translate="no"],[data-site-localization-ui]';
  const ALLOWED_ATTRIBUTES = new Set(['title', 'placeholder', 'aria-label']);

  function installTranslator(adapter, options = {}) {
    if (options.enabled !== undefined && typeof options.enabled !== "boolean") throw new TypeError("enabled must be boolean");
    if (!adapter || typeof adapter.id !== 'string' || !adapter.id.trim()) {
      throw new TypeError('A trusted adapter with a nonempty id is required.');
    }
    const doc = global.document;
    // HTML layout whitespace is not part of a UI phrase's identity. Keep the
    // untouched field in records so restoring still preserves its exact bytes.
    const normalizeText = value => value.trim().replace(/\s+/g, ' ');
    const exact = Object.create(null);
    for (const [key, value] of Object.entries(adapter.exact || {})) {
      const normalized = normalizeText(key);
      if (Object.prototype.hasOwnProperty.call(exact, normalized) && exact[normalized] !== value) {
        throw new TypeError('Conflicting translations after whitespace normalization.');
      }
      exact[normalized] = value;
    }
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


    const records = new WeakMap();
    const modified = new Set();
    const queue = new Set();
    const counts = { scans: 0, visited: 0, translated: 0, restored: 0, externalChanges: 0, flushes: 0 };
    const subscribers = new Set();
    let enabled = options.enabled ?? true;
    let stopped = false;
    let frame = null;
    function notify() {
      for (const listener of subscribers) { try { listener({enabled, stopped}); } catch (_) {} }
    }

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
      const rawText = value.trim();
      const text = normalizeText(rawText);
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
      const start = value.indexOf(rawText);
      return value.slice(0, start) + result + value.slice(start + rawText.length);
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
        if (elementFor(mutation.target)?.closest("[data-site-localization-ui]")) continue;
        if (mutation.type === 'characterData') {
          if (!isOurWrite(mutation.target, '#text')) enqueue(mutation.target);
        } else if (mutation.type === 'attributes') {
          // Adapters must use ancestor scopes; sibling/:has dependency tracking
          // is intentionally unsupported to keep updates confined to this subtree.
          if (contextAttributes.has(mutation.attributeName) || !isOurWrite(mutation.target, mutation.attributeName)) enqueue(mutation.target);
        } else {
          for (const node of mutation.addedNodes) {
            enqueue(node);
          }
          // Only cleanup/reattach on removals, never rescan a whole React list.
          if (mutation.removedNodes.length && modified.size) scheduleFlush();
        }
      }
    });
    function observe() {
      observer.observe(doc, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: Array.from(new Set([...attributes, ...contextAttributes])) });
    }
    function refresh() { enqueue(doc.documentElement); }
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
        notify();
        if (enabled) refresh(); else restore();
        return enabled;
      },
      subscribe(listener) {
        if (typeof listener !== "function") throw new TypeError("listener must be a function");
        if (stopped) return () => {};
        subscribers.add(listener); return () => subscribers.delete(listener);
      },
      stop() {
        if (stopped) return;
        stopped = true;
        observer.disconnect();
        if (frame !== null) global.cancelAnimationFrame(frame);
        frame = null;
        queue.clear();
        restore();
        doc.removeEventListener('DOMContentLoaded', refresh);
        notify(); subscribers.clear();
      }
    };
    observe();
    doc.addEventListener('DOMContentLoaded', refresh);
    refresh();
    return api;
  }
  global.installTranslator = installTranslator;
})(window);
