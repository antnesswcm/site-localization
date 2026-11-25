/* SPDX-License-Identifier: MIT
 * Host integration: localization, DockOrb, userscript persistence and site theme.
 * No migration or runtime downloads. Site rules remain complete configurations.
 */
(function (global, DockOrb) {
  'use strict';
  const POSITION_KEY = 'site-localization:orb-position';
  const preferenceKey = id => 'site-localization:enabled:' + id;
  function read(key, fallback) {
    try { return typeof GM_getValue === 'function' ? GM_getValue(key, fallback) : fallback; }
    catch (_) { return fallback; }
  }
  function write(key, value) {
    try { if (typeof GM_setValue === 'function') GM_setValue(key, value); } catch (_) { /* Optional persistence. */ }
  }
  function createSiteSession(config) {
    const doc = global.document;
    const saved = read(preferenceKey(config.id), true);
    const translator = global.installTranslator(config, { enabled: typeof saved === 'boolean' ? saved : true });
    const parent = doc.createElement('div');
    parent.setAttribute('data-site-localization-ui', '');
    (doc.body || doc.documentElement).append(parent);
    let orb = null, stopped = false, menu = null, logo = null;
    const scheme = global.matchMedia('(prefers-color-scheme: dark)');
    function theme() {
      const declaration = config.theme;
      const root = declaration?.root === 'body' ? doc.body : doc.documentElement;
      const signals = [];
      if (declaration && root) {
        if (declaration.darkClass && root.classList.contains(declaration.darkClass)) signals.push('dark');
        if (declaration.lightClass && root.classList.contains(declaration.lightClass)) signals.push('light');
        if (declaration.useColorScheme) {
          const value = global.getComputedStyle(root).colorScheme;
          if (value === 'light' || value === 'dark') signals.push(value);
        }
      }
      return signals.length && signals.every(value => value === signals[0]) ? signals[0] : scheme.matches ? 'dark' : 'light';
    }
    function update() {
      if (!orb || stopped) return;
      if (logo) logo.textContent = translator.enabled ? '原' : '汉';
      orb.setOptions({ primaryAction: action(), theme: theme() });
    }
    function toggle() {
      translator.toggle();
      write(preferenceKey(config.id), translator.enabled);
      update();
    }
    function renderLogo(container) {
      logo = doc.createElement('span');
      logo.style.cssText = 'font:500 14px/1 "Microsoft YaHei","PingFang SC",sans-serif;';
      logo.textContent = translator.enabled ? '原' : '汉';
      container.append(logo);
    }
    function action() {
      return { label: translator.enabled ? '恢复原文' : '汉化界面', run: toggle, renderIcon: renderLogo };
    }
    function attach() {
      if (stopped) return;
      if (!parent.isConnected) (doc.body || doc.documentElement).append(parent);
      bindTheme();
    }
    const bodyObserver = new global.MutationObserver(attach);
    let themeRoot = null;
    const themeObserver = new global.MutationObserver(update);
    function bindTheme() {
      const next = config.theme?.root === 'body' ? doc.body : doc.documentElement;
      if (next !== themeRoot) {
        themeObserver.disconnect(); themeRoot = next;
        if (themeRoot) themeObserver.observe(themeRoot, { attributes: true, attributeFilter: ['class', 'style'] });
        update();
      }
    }
    const unsubscribe = translator.subscribe(() => update());
    try {
      orb = DockOrb.mountOrb({ document: doc, parent, text: null,
        primaryAction: action(), actions: [], interaction: { touch: 'action' },
        feedback: { enabled: false }, theme: theme(),
        closeControl: { enabled: true, label: '隐藏汉化入口（翻译状态不变）' },
        storage: { read: () => read(POSITION_KEY, null), write: value => write(POSITION_KEY, value) }
      });
      bodyObserver.observe(doc.documentElement, { childList: true });
      bindTheme();
      scheme.addEventListener('change', update);
      if (typeof GM_registerMenuCommand === 'function') menu = GM_registerMenuCommand('显示汉化入口', () => { if (!stopped) { orb.setOptions({ hidden: false }); orb.collapse(); } });
    } catch (error) {
      unsubscribe(); translator.stop(); bodyObserver.disconnect(); themeObserver.disconnect();
      scheme.removeEventListener('change', update);
      if (orb) orb.destroy(); parent.remove(); throw error;
    }
    const api = {
      id: config.id, translator, orb,
      get stopped() { return stopped; },
      stop() {
        if (stopped) return;
        stopped = true; unsubscribe();
        scheme.removeEventListener('change', update);
        bodyObserver.disconnect(); themeObserver.disconnect();
        if (menu !== null && typeof GM_unregisterMenuCommand === 'function') { try { GM_unregisterMenuCommand(menu); } catch (_) {} }
        translator.stop(); orb.destroy(); parent.remove();
      }
    };
    return api;
  }
  global.createSiteSession = createSiteSession;
})(window, dockOrbScope.GenericOrb);
