/* SPDX-License-Identifier: MIT
 * Synthetic DOM only. Load engine.js first in isolated about:blank.
 * This fixture does not contact sites or subscribe to the real system MQL.
 */
window.runThemeControlTests = async function () {
  if (location.href !== 'about:blank') throw new Error('Use an isolated about:blank page.');
  window.__localUiFramework?.stop(); window.__localUiTranslator?.stop();
  const checks = [];
  const check = (name, value) => { if (!value) throw new Error('Theme regression failed: ' + name); checks.push(name); };
  const names = ['matchMedia', 'MutationObserver', 'localStorage', '__localUiPositionStore', 'getComputedStyle'];
  const descriptors = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(window, name)]));
  const originalBody = document.body;
  const html = document.documentElement;
  const htmlAttributes = ['class', 'style'].map(name => [name, html.getAttribute(name)]);
  const NativeObserver = window.MutationObserver;
  const nativeStyle = window.getComputedStyle;
  const observers = [];
  const listeners = new Set();
  const mql = {
    matches: false, media: '(prefers-color-scheme: dark)',
    addEventListener(type, listener) { if (type === 'change') listeners.add(listener); },
    removeEventListener(type, listener) { if (type === 'change') listeners.delete(listener); }
  };
  const setSystem = dark => { mql.matches = dark; for (const listener of [...listeners]) listener({matches: dark, media: mql.media}); };
  const patch = (name, value) => Object.defineProperty(window, name, {configurable: true, writable: true, value});
  const settle = async () => { await new Promise(resolve => requestAnimationFrame(resolve)); await new Promise(resolve => requestAnimationFrame(resolve)); };
  const button = () => document.querySelector('[data-local-ui-translator]');
  const isDark = () => button().style.backgroundColor === 'rgb(37, 42, 50)';
  const fixedLogo = () => {
    const logo = button().firstElementChild;
    const style = nativeStyle.call(window, logo);
    return style.backgroundColor === 'rgb(237, 109, 143)' && style.color === 'rgb(60, 32, 48)' && style.fontSize === '14px' && style.width === '26px' && style.height === '26px';
  };
  let api;
  const install = theme => { api?.stop(); api = window.installTranslator({id:'theme-fixture', exact:{}, ...(theme ? {theme} : {})}); };
  try {
    patch('matchMedia', query => { check('only dark system query requested', query === mql.media); return mql; });
    patch('localStorage', {getItem: () => null, setItem() {}});
    patch('__localUiPositionStore', {read: () => null, write() {}});
    patch('MutationObserver', class {
      constructor(callback) { this.native = new NativeObserver(callback); this.active = false; this.options = []; observers.push(this); }
      observe(target, options) { this.active = true; this.options.push({target, options}); this.native.observe(target, options); }
      disconnect() { this.active = false; this.native.disconnect(); }
    });
    const body = document.createElement('body');
    originalBody.replaceWith(body);
    html.className = 'dark'; html.style.colorScheme = 'dark';
    const theme = {root:'html', darkClass:'dark', lightClass:'light', useColorScheme:true};
    install(theme);
    check('dark site overrides light system', isDark());
    check('fixed pink logo, dark text and 14px / 26px geometry on dark site', fixedLogo());
    setSystem(true);
    html.className = 'light'; html.style.colorScheme = 'light'; await settle();
    check('dynamic light site overrides dark system', !isDark());
    check('fixed logo is unchanged on light site', fixedLogo());
    setSystem(false); html.className = 'dark'; html.style.colorScheme = 'dark'; await settle();
    check('dynamic markers reverse to dark', isDark());
    html.className = ''; html.style.colorScheme = 'normal'; await settle();
    check('removed marker and unknown scheme fall back to light system', !isDark());
    setSystem(true);
    check('unknown normal falls back to dark system on change', isDark());
    html.style.colorScheme = 'light dark'; await settle();
    check('multi-value scheme follows dark system, not list inference', isDark());
    setSystem(false);
    check('light dark remains unknown with light system', !isDark());
    html.style.colorScheme = 'dark'; await settle();
    check('single computed dark is explicit without class', isDark());
    html.style.colorScheme = 'light'; setSystem(true); await settle();
    check('single computed light is explicit without class', !isDark());
    html.className = 'dark'; await settle();
    check('conflicting class and computed scheme use dark system', isDark());
    setSystem(false);
    check('conflict uses light system too', !isDark());
    html.className = 'dark light'; html.style.colorScheme = 'normal'; setSystem(true); await settle();
    check('conflicting positive classes use system', isDark());
    patch('getComputedStyle', () => { throw new Error('Synthetic computed-style failure'); });
    html.className = 'light'; setSystem(true); await settle();
    check('read exception falls back to system even with class', isDark());
    patch('getComputedStyle', nativeStyle);
    html.className = 'dark'; html.style.colorScheme = 'dark';
    install(); setSystem(false);
    check('no theme ignores site marker and uses light system', !isDark());
    setSystem(true);
    check('no theme responds to system change', isDark());
    setSystem(false);
    install({root:'body', darkClass:'dark', lightClass:'light'});
    document.body.className = 'dark'; await settle();
    check('body root class is observed', isDark());
    const replacement = document.createElement('body'); replacement.className = 'light';
    document.body.replaceWith(replacement); setSystem(true); await settle();
    check('body replacement rebinds and light site retains priority', !isDark());
    replacement.className = 'dark'; setSystem(false); await settle();
    check('replacement body marker changes are observed', isDark());
    const themeRecords = observers.filter(record => record.options.some(({options}) => options.attributeFilter?.join(',') === 'class,style'));
    check('theme observers watch only class/style without subtree', themeRecords.length > 0 && themeRecords.every(record => record.options.every(({options}) => !options.subtree)));
    const retained = button(); const before = retained.style.backgroundColor;
    api.stop();
    check('stop disconnects every observer and mock MQL listener', observers.every(record => !record.active) && listeners.size === 0);
    replacement.className = 'light'; setSystem(true); await settle();
    check('stopped control removed and retained colors not updated', !retained.isConnected && retained.style.backgroundColor === before);
    return {passed: checks.length, checks};
  } finally {
    api?.stop();
    if (document.body !== originalBody) document.body.replaceWith(originalBody);
    for (const [name, value] of htmlAttributes) { if (value === null) html.removeAttribute(name); else html.setAttribute(name, value); }
    for (const name of names) {
      const descriptor = descriptors.get(name);
      if (descriptor) Object.defineProperty(window, name, descriptor); else delete window[name];
    }
  }
};
