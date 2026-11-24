/* SPDX-License-Identifier: MIT
 * Generic site dispatcher. No site names, selectors or translations here.
 */
(function (global) {
  'use strict';
  function compileMatch(pattern) {
    const parts = /^(https?|\*):\/\/(\*|\*\.[a-z0-9.-]+|[a-z0-9.-]+)(\/.*)$/i.exec(pattern);
    if (!parts) throw new TypeError('Unsupported site match: ' + pattern);
    const escape = value => value.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    const path = new RegExp('^' + parts[3].split('*').map(escape).join('.*') + '$');
    return href => {
      let url; try { url = new URL(href); } catch (_) { return false; }
      if (!['http:', 'https:'].includes(url.protocol)) return false;
      if (parts[1] !== '*' && url.protocol !== parts[1].toLowerCase() + ':') return false;
      const host = parts[2].toLowerCase();
      const domain = host.startsWith('*.') ? host.slice(2) : host;
      const hostMatches = host === '*' || url.hostname === domain || (host.startsWith('*.') && url.hostname.endsWith('.' + domain));
      return hostMatches && path.test(url.pathname + url.search);
    };
  }
  function startLocalUiFramework(configurations) {
    if (!Array.isArray(configurations)) throw new TypeError('Site configurations must be an array.');
    const ids = new Set();
    const sites = configurations.map(config => {
      if (!config || typeof config.id !== 'string' || !config.id || ids.has(config.id)) throw new TypeError('Site ids must be unique and nonempty.');
      ids.add(config.id);
      if (!Array.isArray(config.matches) || !config.matches.length) throw new TypeError('Each site needs explicit URL matches.');
      return { config, matches: config.matches.map(compileMatch) };
    });
    function select(href) {
      const found = sites.filter(site => site.matches.some(match => match(href)));
      if (found.length > 1) throw new Error('Ambiguous site configuration; refusing to translate.');
      return found[0]?.config || null;
    }
    if (global.__localUiFramework) global.__localUiFramework.stop();
    let translator = null;
    let active = null;
    let stopped = false;
    let error = null;
    const listeners = [];
    const historyPatches = [];
    function refresh() {
      if (stopped) return;
      let next;
      try { next = select(global.location.href); error = null; }
      catch (reason) { next = null; error = reason.message; }
      if (next === active && (!next || !translator?.stopped)) return;
      if (translator) translator.stop();
      translator = null; active = null;
      if (next) {
        try { translator = global.installTranslator(next); active = next; }
        catch (reason) { error = reason.message; }
      }
    }
    const api = {
      get siteId() { return active?.id || null; },
      get error() { return error; },
      get stopped() { return stopped; },
      sites: Object.freeze(sites.map(site => Object.freeze({ id: site.config.id, name: site.config.name || site.config.id }))),
      select(href) { return select(href)?.id || null; },
      refresh,
      stop() {
        if (stopped) return;
        stopped = true;
        translator?.stop(); translator = null; active = null;
        for (const [event, handler] of listeners) global.removeEventListener(event, handler);
        for (const { name, original, wrapper } of historyPatches) {
          if (global.history[name] === wrapper) global.history[name] = original;
        }
        if (global.__localUiFramework === api) delete global.__localUiFramework;
      }
    };
    for (const event of ['popstate', 'hashchange']) {
      global.addEventListener(event, refresh); listeners.push([event, refresh]);
    }
    for (const name of ['pushState', 'replaceState']) {
      const original = global.history[name];
      function wrapper(...args) {
        const result = original.apply(this, args);
        refresh();
        return result;
      }
      try { global.history[name] = wrapper; historyPatches.push({name, original, wrapper}); } catch (_) { /* Manual refresh remains available. */ }
    }
    global.__localUiFramework = api;
    refresh();
    return api;
  }
  global.startLocalUiFramework = startLocalUiFramework;
})(window);
