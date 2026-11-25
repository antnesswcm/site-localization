// ==UserScript==
// @name         站点汉化 / Site Localization
// @namespace    site-localization
// @version      0.4.0
// @description  完整站点配置的离线汉化；DockOrb 汉/原入口、拖动与主题
// @license      MIT
// @match        https://console.tailscale.com/admin/*
// @match        https://login.tailscale.com/admin/*
// @run-at       document-idle
// @sandbox      raw
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(function(){
"use strict";
const dockOrbScope = Object.create(globalThis);
(function(globalThis){
/*! DockOrb 0.3.0
MIT License

Copyright (c) 2026 antnesswcm

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

# Third-party notices

Selected Lucide static SVGs, pinned lucide-static 1.80.0.
Source: https://github.com/lucide-icons/lucide
Offline subset; no runtime network dependency. Original SVGs and SHA-256 manifest are in vendor/lucide. Includes the full upstream license (ISC and Feather MIT notices).

ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
(function(){
"use strict";
const __modules=Object.create(null);
__modules["src/interaction.mjs"]=(()=>{
// Pure interaction state: no DOM, clocks, effects, or business actions.
function createInteractionState() {
  return {
    hover: false,
    pinned: false,
    panel: false,
    focused: false,
    dragging: false,
    hidden: false,
  };
}
function expansionReasons(state) {
  return state.hidden || state.dragging
    ? []
    : ['hover', 'pinned', 'panel'].filter((key) => state[key]);
}
function reduceInteraction(state, event) {
  const next = { ...state };
  switch (event.type) {
    case 'hover':
      if (!next.hidden && !next.dragging) next.hover = Boolean(event.value);
      break;
    case 'pin':
      if (!next.hidden && !next.dragging) next.pinned = true;
      break;
    case 'focus':
      next.focused = Boolean(event.value);
      break;
    case 'panel':
      if (!event.value || (!next.hidden && !next.dragging)) next.panel = Boolean(event.value);
      break;
    case 'clear':
      next.hover = next.pinned = next.panel = false;
      break;
    case 'drag':
      next.dragging = Boolean(event.value);
      if (next.dragging) next.hover = next.pinned = next.panel = false;
      break;
    case 'hide':
      next.hidden = Boolean(event.value);
      if (next.hidden) next.hover = next.pinned = next.panel = false;
      break;
    default:
      throw new TypeError('Unknown interaction event: ' + event.type);
  }
  return next;
}

return Object.freeze({createInteractionState,expansionReasons,reduceInteraction});
})();
__modules["src/icons.mjs"]=(()=>{
/* Lucide static 1.80.0; ISC and Feather MIT. See THIRD-PARTY-NOTICES.md. */
const definitions = {
  window: [
    [
      'rect',
      {
        x: '2',
        y: '4',
        width: '20',
        height: '16',
        rx: '2',
      },
    ],
    [
      'path',
      {
        d: 'M10 4v4',
      },
    ],
    [
      'path',
      {
        d: 'M2 8h20',
      },
    ],
    [
      'path',
      {
        d: 'M6 4v4',
      },
    ],
  ],
  settings: [
    [
      'path',
      {
        d: 'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915',
      },
    ],
    [
      'circle',
      {
        cx: '12',
        cy: '12',
        r: '3',
      },
    ],
  ],
  x: [
    [
      'path',
      {
        d: 'M18 6 6 18',
      },
    ],
    [
      'path',
      {
        d: 'm6 6 12 12',
      },
    ],
  ],
  ellipsis: [
    [
      'circle',
      {
        cx: '12',
        cy: '12',
        r: '1',
      },
    ],
    [
      'circle',
      {
        cx: '19',
        cy: '12',
        r: '1',
      },
    ],
    [
      'circle',
      {
        cx: '5',
        cy: '12',
        r: '1',
      },
    ],
  ],
  check: [
    [
      'path',
      {
        d: 'M20 6 9 17l-5-5',
      },
    ],
  ],
  'circle-check': [
    [
      'circle',
      {
        cx: '12',
        cy: '12',
        r: '10',
      },
    ],
    [
      'path',
      {
        d: 'm16 9-5.5 5.5L8 12',
      },
    ],
  ],
  'circle-x': [
    [
      'circle',
      {
        cx: '12',
        cy: '12',
        r: '10',
      },
    ],
    [
      'path',
      {
        d: 'm15 9-6 6',
      },
    ],
    [
      'path',
      {
        d: 'm9 9 6 6',
      },
    ],
  ],
  'loader-circle': [
    [
      'path',
      {
        d: 'M21 12a9 9 0 1 1-6.219-8.56',
      },
    ],
  ],
  info: [
    [
      'circle',
      {
        cx: '12',
        cy: '12',
        r: '10',
      },
    ],
    [
      'path',
      {
        d: 'M12 16v-4',
      },
    ],
    [
      'path',
      {
        d: 'M12 8h.01',
      },
    ],
  ],
  'triangle-alert': [
    [
      'path',
      {
        d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
      },
    ],
    [
      'path',
      {
        d: 'M12 9v4',
      },
    ],
    [
      'path',
      {
        d: 'M12 17h.01',
      },
    ],
  ],
  'panels-top-left': [
    [
      'rect',
      {
        width: '18',
        height: '18',
        x: '3',
        y: '3',
        rx: '2',
      },
    ],
    [
      'path',
      {
        d: 'M3 9h18',
      },
    ],
    [
      'path',
      {
        d: 'M9 21V9',
      },
    ],
  ],
};
const ICON_NAMES = Object.freeze(Object.keys(definitions));
function createIcon(
  name,
  { document: doc = globalThis.document, size = 24, strokeWidth = 2, color = 'currentColor' } = {},
) {
  if (!Object.hasOwn(definitions, name)) throw new TypeError('Unknown icon: ' + name);
  if (!doc?.createElementNS) throw new TypeError('An owner document is required');
  if (
    !Number.isFinite(size) ||
    size <= 0 ||
    !Number.isFinite(strokeWidth) ||
    strokeWidth <= 0 ||
    typeof color !== 'string'
  )
    throw new TypeError('Invalid icon options');
  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const attrs = {
    viewBox: '0 0 24 24',
    width: String(size),
    height: String(size),
    fill: 'none',
    stroke: color,
    'stroke-width': String(strokeWidth),
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    focusable: 'false',
    'data-orb-icon': name,
  };
  for (const [key, value] of Object.entries(attrs)) svg.setAttribute(key, value);
  for (const [tag, attributes] of definitions[name]) {
    const node = doc.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    svg.append(node);
  }
  return svg;
}

return Object.freeze({ICON_NAMES,createIcon});
})();
__modules["src/feedback.mjs"]=(()=>{
// SPDX-License-Identifier: MIT
function validateFeedbackOptions(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options))
    throw new TypeError('Invalid feedback options');
  const value = { enabled: true, automatic: false, duration: 1600, ...options };
  if (
    typeof value.enabled !== 'boolean' ||
    typeof value.automatic !== 'boolean' ||
    !Number.isFinite(value.duration) ||
    value.duration < 0 ||
    value.duration > 60000
  )
    throw new TypeError('Invalid feedback configuration');
  return value;
}

/** Pure lifecycle controller. Inject a clock for deterministic race tests. */
function createFeedbackController({
  options = {},
  onChange = () => {},
  setTimeout: later = globalThis.setTimeout,
  clearTimeout: cancel = globalThis.clearTimeout,
} = {}) {
  let config = validateFeedbackOptions(options),
    current = { status: 'idle', label: '', token: 0 },
    serial = 0,
    timer = null,
    disposed = false;
  const read = () => ({ ...current });
  function stopTimer() {
    if (timer !== null) cancel(timer);
    timer = null;
  }
  function publish(value) {
    current = value;
    onChange(read());
  }
  function clear(token) {
    if (disposed || (token !== undefined && token !== current.token)) return false;
    stopTimer();
    publish({ status: 'idle', label: '', token: ++serial });
    return true;
  }
  function set(value = {}) {
    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value) ||
      !['pending', 'success', 'error', 'info'].includes(value.status)
    )
      throw new TypeError('Invalid feedback status');
    if (value.label !== undefined && typeof value.label !== 'string')
      throw new TypeError('Invalid feedback label');
    if (value.token !== undefined && (!Number.isSafeInteger(value.token) || value.token <= 0))
      throw new TypeError('Invalid feedback token');
    const duration = value.duration ?? config.duration;
    if (!Number.isFinite(duration) || duration < 0 || duration > 60000)
      throw new TypeError('Invalid feedback duration');
    if (disposed || !config.enabled || (value.token !== undefined && value.token !== current.token))
      return false;
    stopTimer();
    const token = value.token ?? ++serial;
    publish({
      status: value.status,
      label:
        value.label ??
        { pending: '处理中', success: '操作完成', error: '操作失败', info: '提示信息' }[
          value.status
        ],
      token,
    });
    if (value.status !== 'pending')
      timer = later(() => {
        if (disposed || token !== current.token) return;
        timer = null;
        clear(token);
      }, duration);
    return token;
  }
  function begin(value = {}) {
    if (disposed || !config.enabled) return ++serial;
    return set({ ...value, token: undefined, status: 'pending' });
  }
  function configure(options) {
    const next = validateFeedbackOptions(options);
    config = next;
    if (!config.enabled) clear();
  }
  function destroy() {
    if (disposed) return;
    stopTimer();
    disposed = true;
    current = { status: 'idle', label: '', token: ++serial };
  }
  return Object.freeze({ begin, set, clear, read, configure, destroy });
}

return Object.freeze({validateFeedbackOptions,createFeedbackController});
})();
__modules["src/orb.mjs"]=(()=>{
// SPDX-License-Identifier: MIT — original generic component, no extension source/assets.
const { createInteractionState, reduceInteraction, expansionReasons }=__modules["src/interaction.mjs"];
const { createIcon, ICON_NAMES }=__modules["src/icons.mjs"];
const { createFeedbackController, validateFeedbackOptions }=__modules["src/feedback.mjs"];
const finite = (v, f) => (typeof v === 'number' && Number.isFinite(v) ? v : f);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function computePosition({
  viewport = {},
  size = 36,
  side = 'right',
  y = 0.5,
  inset = 4,
} = {}) {
  const left = finite(viewport.left, 0),
    top = finite(viewport.top, 0),
    width = Math.max(0, finite(viewport.width, 0)),
    height = Math.max(0, finite(viewport.height, 0));
  const padding = Math.min(Math.max(0, finite(inset, 4)), width / 2, height / 2),
    actualSize = Math.min(
      Math.max(0, finite(size, 36)),
      Math.max(0, width - padding * 2),
      Math.max(0, height - padding * 2),
    ),
    normalizedY = clamp(finite(y, 0.5), 0, 1),
    edge = side === 'left' ? 'left' : 'right';
  return {
    left: edge === 'left' ? left + padding : left + width - padding - actualSize,
    top: top + padding + (height - padding * 2 - actualSize) * normalizedY,
    size: actualSize,
    side: edge,
    y: normalizedY,
    inset: padding,
  };
}
function assertOptionObjects(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw TypeError('Options must be an object');
  for (const key of ['interaction', 'closeControl', 'feedback'])
    if (
      key in value &&
      (!value[key] || typeof value[key] !== 'object' || Array.isArray(value[key]))
    )
      throw TypeError('Invalid ' + key + ' object');
}
function validate(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config))
    throw TypeError('Options must be an object');
  const feedback = validateFeedbackOptions(config.feedback);
  for (const key of ['onAction', 'onError'])
    if (config[key] != null && typeof config[key] !== 'function')
      throw TypeError(key + ' must be a function');
  if (
    config.primaryAction != null &&
    (typeof config.primaryAction !== 'object' || Array.isArray(config.primaryAction))
  )
    throw TypeError('Invalid primaryAction');
  const descriptors = [...(config.primaryAction ? [config.primaryAction] : [])];
  if (!Array.isArray(config.actions)) throw TypeError('actions must be an array');
  const ids = new Set();
  for (const action of config.actions) {
    if (!action || typeof action.id !== 'string' || !action.id || ids.has(action.id))
      throw TypeError('Invalid or duplicate action id');
    ids.add(action.id);
    descriptors.push(action);
  }
  for (const action of descriptors) {
    if (!action || typeof action !== 'object' || typeof action.label !== 'string' || !action.label)
      throw TypeError('Action label required');
    for (const key of ['run', 'renderIcon'])
      if (action[key] != null && typeof action[key] !== 'function')
        throw TypeError('Invalid action callback');
    if (action.icon != null && !ICON_NAMES.includes(action.icon))
      throw TypeError('Invalid icon name');
  }
  if (
    !config.interaction ||
    typeof config.interaction !== 'object' ||
    Array.isArray(config.interaction) ||
    !['expand', 'action'].includes(config.interaction.touch)
  )
    throw TypeError('Invalid interaction policy');
  for (const key of ['hoverDelay', 'leaveDelay', 'longPressDelay'])
    if (
      typeof config.interaction[key] !== 'number' ||
      !Number.isFinite(config.interaction[key]) ||
      config.interaction[key] < 0 ||
      config.interaction[key] > 60000
    )
      throw TypeError('Invalid ' + key);
  if (
    !config.closeControl ||
    typeof config.closeControl !== 'object' ||
    Array.isArray(config.closeControl) ||
    typeof config.closeControl.enabled !== 'boolean' ||
    typeof config.closeControl.label !== 'string' ||
    !config.closeControl.label ||
    (config.closeControl.onRequest != null && typeof config.closeControl.onRequest !== 'function')
  )
    throw TypeError('Invalid closeControl');
  for (const key of ['retract', 'hidden', 'showTools'])
    if (typeof config[key] !== 'boolean') throw TypeError('Invalid ' + key);
  for (const key of ['size', 'opacity', 'safeInset'])
    if (typeof config[key] !== 'number' || !Number.isFinite(config[key]))
      throw TypeError('Invalid ' + key);
  if (!['auto', 'light', 'dark'].includes(config.theme)) throw TypeError('Invalid theme');
  return {
    ...config,
    feedback,
    size: clamp(config.size, 28, 48),
    opacity: clamp(config.opacity, 0.3, 1),
    safeInset: Math.max(0, config.safeInset),
    actions: config.actions.slice(),
    interaction: { ...config.interaction },
    closeControl: { ...config.closeControl },
  };
}
function mountOrb(options = {}) {
  assertOptionObjects(options);
  const doc = options.document || globalThis.document;
  if (!doc?.documentElement || !doc.defaultView)
    throw Error('mountOrb requires a browser document');
  const win = doc.defaultView;
  let config = validate({
    size: 36,
    opacity: 0.7,
    retract: false,
    hidden: false,
    showTools: true,
    theme: 'light',
    safeInset: 0,
    text: null,
    actions: [],
    ...options,
    feedback: validateFeedbackOptions(options.feedback),
    interaction: {
      touch: 'expand',
      hoverDelay: 500,
      leaveDelay: 160,
      longPressDelay: 500,
      ...options.interaction,
    },
    closeControl: { enabled: true, label: '隐藏悬浮入口', ...options.closeControl },
  });
  let position = {
      side: options.side === 'left' ? 'left' : 'right',
      y: clamp(finite(options.y, 0.5), 0, 1),
    },
    ui = reduceInteraction(createInteractionState(), { type: 'hide', value: config.hidden }),
    destroyed = false,
    pointer = null,
    revision = 0,
    pendingInitial = null,
    frame = 0,
    panelSpec = null,
    panelCleanup = null;
  let hoverTimer = 0,
    leaveTimer = 0,
    longTimer = 0,
    inside = false,
    suppressClick = false,
    lastActivation = null,
    memory,
    mainIconText,
    mainIconRenderer,
    mainIconReady = false,
    releasingPanel = false,
    mainIconName,
    lastFeedbackKey;
  const storage = options.storage || {
    read: () => memory,
    write: (value) => {
      memory = { ...value };
    },
  };
  if (typeof storage.read !== 'function' || typeof storage.write !== 'function')
    throw TypeError('Invalid storage adapter');
  const removers = [],
    host = doc.createElement('div');
  host.style.cssText =
    'position:fixed!important;left:0!important;top:0!important;width:0!important;height:0!important;z-index:2147483647!important;';
  const shadow = host.attachShadow({ mode: 'open' });
  const el = (tag, cls, text) => {
    const node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const style = el('style');
  style.textContent = `
:host{all:initial;color-scheme:light;font-family:system-ui,sans-serif;--surface:#fff;--ink:#303036;--muted:#888}
*{box-sizing:border-box}
button{font:inherit;cursor:pointer}
button:focus-visible{outline:2px solid #ED6D8F;outline-offset:2px}
[hidden]{display:none!important}
.orb-clip{position:fixed;overflow:hidden;pointer-events:none}
.orb{position:absolute;inset:0;display:flex;align-items:center;border:0;padding:0;background:var(--surface);color:white;box-shadow:0 2px 8px #00000014;touch-action:none;user-select:none;pointer-events:auto;transition:transform .25s ease-out,opacity .25s ease-out}
.inner{display:grid;place-items:center;flex:none;background:#ED6D8F;border-radius:50%;font-size:19px;line-height:1;pointer-events:none}
.inner svg{width:18px;height:18px}
.orb:focus-visible{outline-offset:-2px}
.orb[data-side=right]{border-radius:36px 0 0 36px;justify-content:flex-start}
.orb[data-side=left]{border-radius:0 36px 36px 0;justify-content:flex-end}
.orb[data-drag=true]{cursor:crosshair;border-radius:50%;justify-content:center;transform:none!important;transition:none}
.orb[data-retract=true][data-side=right]{transform:translateX(var(--retract-distance,22px))}
.orb[data-retract=true][data-side=left]{transform:translateX(calc(-1 * var(--retract-distance,22px)))}
.tools{position:fixed;display:flex;flex-direction:column;opacity:0;filter:blur(2px);pointer-events:none;transition:opacity .28s cubic-bezier(.16,1,.3,1),filter .28s cubic-bezier(.16,1,.3,1)}
.tools[data-visible=true]{opacity:1;filter:blur(0);pointer-events:auto}
.tools button{width:100%;flex:none;min-height:0;border:0;border-radius:50%;padding:0;display:grid;place-items:center;background:var(--surface);color:var(--muted);box-shadow:0 2px 8px #00000014;font-size:18px}
.tools button:hover{color:#ED6D8F}
.close-control{position:fixed;display:grid;place-items:center;border:0;border-radius:50%;padding:0;background:var(--surface);color:var(--muted);box-shadow:0 1px 5px #0002;font-size:14px;line-height:1}
.panel{position:fixed;background:var(--surface);color:var(--ink);border:1px solid #0001;border-radius:12px;box-shadow:0 6px 28px #0002;overflow:auto;font-size:14px}
.panel header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px;font-weight:600}
.panel-close{border:0;background:transparent;color:inherit;font-size:20px;padding:0 3px}
.panel-body{padding:0 16px 16px}
.tools svg{width:18px;height:18px}
:host([data-theme=dark]){color-scheme:dark;--surface:#222;--ink:#eee;--muted:#aaa}
@media(prefers-color-scheme:dark){:host([data-theme=auto]){color-scheme:dark;--surface:#222;--ink:#eee;--muted:#aaa}
}
@media(prefers-reduced-motion:reduce){.orb,.tools{transition:none}
.tools{filter:none}
}

`;
  style.textContent += `.main-content,.feedback-content{display:grid;place-items:center}.feedback-content{width:100%;height:100%;border-radius:50%;color:white}.feedback-content[data-status=pending] svg{animation:orb-spin .9s linear infinite}.tools svg{width:18px;height:18px}.close-control svg,.panel-close svg{width:12px;height:12px}.feedback-live{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}@keyframes orb-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.feedback-content svg{animation:none!important}}`;
  const clip = el('div', 'orb-clip'),
    orb = el('button', 'orb'),
    inner = el('span', 'inner'),
    tools = el('div', 'tools'),
    dismiss = el('button', 'close-control'),
    panel = el('section', 'panel'),
    header = el('header'),
    title = el('span'),
    panelClose = el('button', 'panel-close'),
    panelBody = el('div', 'panel-body');
  orb.type = dismiss.type = panelClose.type = 'button';
  panelClose.setAttribute('aria-label', '关闭面板');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  tools.setAttribute('role', 'toolbar');
  tools.setAttribute('aria-label', '更多操作');
  header.append(title, panelClose);
  panel.append(header, panelBody);
  const mainContent = el('span', 'main-content'),
    feedbackContent = el('span', 'feedback-content'),
    feedbackLive = el('span', 'feedback-live');
  feedbackLive.setAttribute('role', 'status');
  feedbackLive.setAttribute('aria-live', 'polite');
  feedbackLive.setAttribute('aria-atomic', 'true');
  inner.append(mainContent, feedbackContent);
  dismiss.append(createIcon('x', { document: doc, size: 12 }));
  panelClose.append(createIcon('x', { document: doc, size: 12 }));
  orb.append(inner);
  clip.append(orb);
  shadow.append(style, clip, tools, dismiss, panel, feedbackLive);
  (options.parent || doc.body || doc.documentElement).append(host);
  let viewport, geometry;
  const feedback = createFeedbackController({
    options: config.feedback,
    onChange: () => render(),
    setTimeout: win.setTimeout.bind(win),
    clearTimeout: win.clearTimeout.bind(win),
  });
  const emit = (event) => {
    ui = reduceInteraction(ui, event);
  };
  function report(error) {
    try {
      config.onError?.(error);
    } catch {
      /* Error hooks must not break controller cleanup. */
    }
  }
  function invoke(fn, arg) {
    if (!fn) return;
    try {
      const result = fn(arg);
      if (result && typeof result.then === 'function') Promise.resolve(result).catch(report);
    } catch (error) {
      report(error);
    }
  }
  function invokeAction(fn, arg) {
    if (!fn) return;
    const token = config.feedback.automatic ? feedback.begin() : undefined;
    try {
      const result = fn(arg);
      if (result && typeof result.then === 'function') {
        Promise.resolve(result).then(
          () => {
            if (token !== undefined) feedback.set({ token, status: 'success' });
          },
          (error) => {
            if (token !== undefined) feedback.set({ token, status: 'error' });
            report(error);
          },
        );
      } else if (token !== undefined) feedback.clear(token);
    } catch (error) {
      if (token !== undefined) feedback.set({ token, status: 'error' });
      report(error);
    }
  }
  function listen(target, name, fn, opts) {
    target.addEventListener(name, fn, opts);
    removers.push(() => target.removeEventListener(name, fn, opts));
  }
  function clearTimers() {
    win.clearTimeout(hoverTimer);
    win.clearTimeout(leaveTimer);
    win.clearTimeout(longTimer);
    hoverTimer = leaveTimer = longTimer = 0;
  }
  function cancelGesture() {
    if (!pointer) return;
    const old = pointer;
    pointer = null;
    suppressClick = true;
    lastActivation = { type: old.type, cancelled: true };
    emit({ type: 'drag', value: false });
    try {
      if (orb.hasPointerCapture(old.id)) orb.releasePointerCapture(old.id);
    } catch (error) {
      report(error);
    }
    if (pendingInitial) {
      const value = pendingInitial;
      pendingInitial = null;
      applyInitial(value);
    }
  }
  function visibleViewport() {
    const root = doc.documentElement,
      left = root.clientLeft,
      top = root.clientTop,
      right = left + root.clientWidth,
      bottom = top + root.clientHeight,
      vv = win.visualViewport;
    if (!vv) return { left, top, width: root.clientWidth, height: root.clientHeight };
    const x = clamp(finite(vv.offsetLeft, 0), left, right),
      y = clamp(finite(vv.offsetTop, 0), top, bottom);
    return {
      left: x,
      top: y,
      width: Math.max(0, Math.min(right, finite(vv.offsetLeft, 0) + vv.width) - x),
      height: Math.max(0, Math.min(bottom, finite(vv.offsetTop, 0) + vv.height) - y),
    };
  }
  function box(node, x, y, width, height) {
    Object.assign(node.style, {
      left: x + 'px',
      top: y + 'px',
      width: width + 'px',
      height: height + 'px',
    });
  }
  function canMore() {
    return (config.showTools && config.actions.length > 0) || config.closeControl.enabled;
  }
  function drawMainIcon() {
    const renderer = config.primaryAction?.renderIcon,
      name = config.primaryAction?.icon || 'window';
    if (
      !mainIconReady ||
      mainIconText !== config.text ||
      mainIconRenderer !== renderer ||
      mainIconName !== name
    ) {
      mainIconReady = true;
      mainIconText = config.text;
      mainIconRenderer = renderer;
      mainIconName = name;
      mainContent.replaceChildren();
      if (renderer) invoke(renderer, mainContent);
      else if (config.text != null) mainContent.textContent = String(config.text);
      else mainContent.append(createIcon(name, { document: doc, size: 18 }));
    }
    const state = feedback.read(),
      active = state.status !== 'idle';
    mainContent.hidden = active;
    feedbackContent.hidden = !active;
    orb.setAttribute('aria-busy', String(state.status === 'pending'));
    if (feedbackLive.textContent !== state.label) feedbackLive.textContent = state.label;
    const key = state.status + ':' + state.token;
    if (key !== lastFeedbackKey) {
      lastFeedbackKey = key;
      feedbackContent.replaceChildren();
      feedbackContent.dataset.status = state.status;
      if (active) {
        feedbackContent.style.background = {
          success: '#16a34a',
          error: '#dc2626',
          info: '#2563eb',
          pending: '#ED6D8F',
        }[state.status];
        feedbackContent.append(
          createIcon(
            { success: 'check', error: 'circle-x', info: 'info', pending: 'loader-circle' }[
              state.status
            ],
            { document: doc, size: 18 },
          ),
        );
      }
    }
  }
  function rebuildActions() {
    tools.replaceChildren();
    for (const action of config.actions) {
      const button = el('button');
      button.type = 'button';
      button.setAttribute('aria-label', action.label);
      button.dataset.actionId = action.id;
      if (action.renderIcon) invoke(action.renderIcon, button);
      else button.append(createIcon(action.icon || 'ellipsis', { document: doc, size: 18 }));
      button.onclick = () => invokeAction(action.run, api);
      tools.append(button);
    }
  }
  function render() {
    if (destroyed) return;
    viewport = visibleViewport();
    geometry = computePosition({
      viewport,
      size: config.size,
      ...position,
      inset: config.safeInset,
    });
    const dragging = Boolean(pointer?.dragging);
    if (dragging) {
      geometry.left = clamp(
        pointer.left,
        viewport.left + geometry.inset,
        viewport.left + viewport.width - geometry.inset - geometry.size,
      );
      geometry.top = clamp(
        pointer.top,
        viewport.top + geometry.inset,
        viewport.top + viewport.height - geometry.inset - geometry.size,
      );
    }
    const shellWidth = dragging
        ? geometry.size
        : Math.min((geometry.size * 41) / 36, Math.max(0, viewport.width - geometry.inset * 2)),
      shellLeft =
        dragging || position.side === 'left'
          ? geometry.left
          : geometry.left + geometry.size - shellWidth;
    box(clip, shellLeft, geometry.top, shellWidth, geometry.size);
    orb.style.width = shellWidth + 'px';
    orb.style.height = geometry.size + 'px';
    orb.style.setProperty('--retract-distance', (geometry.size * 22) / 36 + 'px');
    const innerSize = Math.min((geometry.size * 28) / 36, shellWidth);
    inner.style.width = inner.style.height = innerSize + 'px';
    inner.style.margin = dragging
      ? '0'
      : `0 ${Math.min((5 * geometry.size) / 36, Math.max(0, (shellWidth - innerSize) / 2))}px`;
    drawMainIcon();
    orb.dataset.side = position.side;
    orb.dataset.drag = String(dragging);
    orb.setAttribute('aria-label', config.primaryAction?.label || config.label || '悬浮入口');
    const reasons = expansionReasons(ui),
      expanded = reasons.length > 0,
      active = inside || ui.focused || expanded || dragging;
    orb.dataset.retract = String(config.retract && !active);
    orb.style.opacity = String(active ? 1 : config.opacity);
    orb.setAttribute('aria-expanded', String(expanded));
    host.dataset.theme = config.theme;
    clip.hidden = ui.hidden;
    const showTools =
      expanded && !ui.hidden && !dragging && config.showTools && config.actions.length > 0;
    tools.dataset.visible = String(showTools);
    tools.setAttribute('aria-hidden', String(!showTools));
    tools.inert = !showTools;
    const n = config.actions.length,
      tw = Math.min(36, viewport.width, n ? viewport.height / n : 36),
      gap = n > 1 ? Math.min(10, Math.max(0, (viewport.height - tw * n) / (n - 1))) : 0,
      th = n * tw + Math.max(0, n - 1) * gap;
    tools.style.gap = gap + 'px';
    for (const button of tools.children) {
      button.tabIndex = showTools ? 0 : -1;
      button.style.height = tw + 'px';
    }
    const tx =
        position.side === 'right'
          ? viewport.left + viewport.width - tw - Math.min(5, Math.max(0, viewport.width - tw))
          : viewport.left + Math.min(5, Math.max(0, viewport.width - tw)),
      below = geometry.top + geometry.size + 10,
      above = geometry.top - th - 10,
      ty =
        below + th <= viewport.top + viewport.height
          ? below
          : above >= viewport.top
            ? above
            : clamp(below, viewport.top, viewport.top + viewport.height - th);
    box(tools, tx, ty, tw, th);
    dismiss.hidden = !expanded || !config.closeControl.enabled || ui.hidden || dragging;
    dismiss.tabIndex = dismiss.hidden ? -1 : 0;
    dismiss.setAttribute('aria-label', config.closeControl.label);
    const ds = Math.min(16, viewport.width, viewport.height),
      dx = position.side === 'right' ? shellLeft - ds / 2 : shellLeft + shellWidth - ds / 2;
    box(
      dismiss,
      clamp(dx, viewport.left, viewport.left + viewport.width - ds),
      clamp(geometry.top - ds / 2, viewport.top, viewport.top + viewport.height - ds),
      ds,
      ds,
    );
    panel.hidden = !panelSpec || ui.hidden || dragging;
    if (panelSpec) {
      const w = Math.min(panelSpec.width, viewport.width),
        h = Math.min(panelSpec.height, viewport.height);
      box(
        panel,
        clamp(
          position.side === 'right' ? shellLeft - w - 24 : shellLeft + shellWidth + 24,
          viewport.left,
          viewport.left + viewport.width - w,
        ),
        clamp(geometry.top, viewport.top, viewport.top + viewport.height - h),
        w,
        h,
      );
    }
  }
  function schedule() {
    if (!destroyed && !frame)
      frame = win.requestAnimationFrame(() => {
        frame = 0;
        render();
      });
  }
  function releasePanel() {
    const cleanup = panelCleanup;
    panelCleanup = null;
    panelSpec = null;
    emit({ type: 'panel', value: false });
    panelBody.replaceChildren();
    const wasReleasing = releasingPanel;
    releasingPanel = true;
    try {
      invoke(cleanup);
    } finally {
      releasingPanel = wasReleasing;
    }
  }
  function closePanel() {
    if (destroyed) return;
    releasePanel();
    render();
  }
  function collapse() {
    if (destroyed) return;
    clearTimers();
    cancelGesture();
    releasePanel();
    emit({ type: 'clear' });
    render();
  }
  function expand() {
    if (destroyed || ui.hidden || ui.dragging || !canMore()) return;
    emit({ type: 'pin' });
    render();
  }
  function hide() {
    if (destroyed) return;
    clearTimers();
    cancelGesture();
    releasePanel();
    config.hidden = true;
    emit({ type: 'hide', value: true });
    render();
  }
  function openPanel(spec) {
    if (destroyed) return;
    if (releasingPanel) throw Error('Cannot open a panel during cleanup');
    if (
      !spec ||
      typeof spec.id !== 'string' ||
      !spec.id ||
      typeof spec.label !== 'string' ||
      !spec.label ||
      typeof spec.render !== 'function' ||
      (spec.width != null && (!Number.isFinite(spec.width) || spec.width <= 0)) ||
      (spec.height != null && (!Number.isFinite(spec.height) || spec.height <= 0))
    )
      throw TypeError('Invalid panel spec');
    if (ui.hidden || ui.dragging) return;
    clearTimers();
    releasePanel();
    if (destroyed || ui.hidden || ui.dragging) return;
    const current = { ...spec, width: spec.width ?? 320, height: spec.height ?? 360 };
    panelSpec = current;
    title.textContent = current.label;
    panel.setAttribute('aria-label', current.label);
    emit({ type: 'panel', value: true });
    render();
    try {
      const cleanup = current.render(panelBody, api);
      if (cleanup != null && typeof cleanup !== 'function')
        throw TypeError('Panel render must return a cleanup function or undefined');
      if (panelSpec === current) panelCleanup = cleanup || null;
      else invoke(cleanup);
    } catch (error) {
      if (panelSpec === current) releasePanel();
      report(error);
    }
    render();
    if (panelSpec === current) panelClose.focus();
  }
  function getState() {
    const reasons = expansionReasons(ui);
    return {
      ...position,
      size: config.size,
      opacity: config.opacity,
      retract: config.retract,
      theme: config.theme,
      showTools: config.showTools,
      hidden: ui.hidden,
      expanded: reasons.length > 0,
      expansionReasons: reasons,
      panelOpen: Boolean(panelSpec),
      panelId: panelSpec?.id ?? null,
      focused: ui.focused,
      dragging: ui.dragging,
      toolsVisible:
        reasons.length > 0 &&
        config.showTools &&
        config.actions.length > 0 &&
        !ui.hidden &&
        !ui.dragging,
      destroyed,
      feedback: feedback.read(),
    };
  }
  function setOptions(patch = {}) {
    if (destroyed) return;
    assertOptionObjects(patch);
    const next = validate({
      ...config,
      ...patch,
      feedback: { ...config.feedback, ...patch.feedback },
      interaction: { ...config.interaction, ...patch.interaction },
      closeControl: { ...config.closeControl, ...patch.closeControl },
    });
    if (patch.side != null && !['left', 'right'].includes(patch.side))
      throw TypeError('Invalid side');
    if (patch.y != null && (typeof patch.y !== 'number' || !Number.isFinite(patch.y)))
      throw TypeError('Invalid y');
    config = next;
    feedback.configure(config.feedback);
    if ('side' in patch || 'y' in patch) {
      revision++;
      position = { side: patch.side ?? position.side, y: clamp(patch.y ?? position.y, 0, 1) };
    }
    if (config.hidden !== ui.hidden) {
      if (config.hidden) {
        clearTimers();
        cancelGesture();
        releasePanel();
      }
      emit({ type: 'hide', value: config.hidden });
    }
    if ('interaction' in patch) {
      clearTimers();
      cancelGesture();
    }
    if ('actions' in patch) rebuildActions();
    render();
  }
  function destroy() {
    if (destroyed) return;
    feedback.destroy();
    clearTimers();
    releasePanel();
    destroyed = true;
    if (frame) win.cancelAnimationFrame(frame);
    if (pointer)
      try {
        if (orb.hasPointerCapture(pointer.id)) orb.releasePointerCapture(pointer.id);
      } catch {}
    pointer = null;
    removers.splice(0).forEach((fn) => fn());
    observer?.disconnect();
    layoutObserver?.disconnect();
    host.remove();
  }
  const api = Object.freeze({
    getState,
    setOptions,
    expand,
    collapse,
    openPanel,
    closePanel,
    hide,
    destroy,
    beginFeedback: feedback.begin,
    setFeedback: feedback.set,
    clearFeedback: feedback.clear,
  });
  function primary() {
    if (config.primaryAction?.run) invokeAction(config.primaryAction.run, api);
    else invokeAction(config.onAction, { ...position });
  }
  function applyInitial(value) {
    if (destroyed || revision !== 0 || !value || typeof value !== 'object') return;
    if (pointer) {
      pendingInitial = value;
      return;
    }
    position = {
      side: value.side === 'left' ? 'left' : 'right',
      y: clamp(finite(value.y, 0.5), 0, 1),
    };
    render();
  }
  listen(host, 'pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    inside = true;
    win.clearTimeout(leaveTimer);
    leaveTimer = 0;
    if (!hoverTimer && !ui.hover && canMore())
      hoverTimer = win.setTimeout(() => {
        hoverTimer = 0;
        if (inside && !destroyed && !pointer?.dragging) {
          emit({ type: 'hover', value: true });
          render();
        }
      }, config.interaction.hoverDelay);
    render();
  });
  listen(host, 'pointerleave', (event) => {
    if (event.pointerType === 'touch') return;
    win.clearTimeout(hoverTimer);
    hoverTimer = 0;
    win.clearTimeout(leaveTimer);
    leaveTimer = win.setTimeout(() => {
      leaveTimer = 0;
      inside = false;
      if (!destroyed) {
        emit({ type: 'hover', value: false });
        render();
      }
    }, config.interaction.leaveDelay);
  });
  listen(shadow, 'focusin', () => {
    emit({ type: 'focus', value: true });
    render();
  });
  listen(shadow, 'focusout', () => {
    Promise.resolve().then(() => {
      if (!destroyed) {
        emit({ type: 'focus', value: Boolean(shadow.activeElement) });
        render();
      }
    });
  });
  listen(orb, 'pointerdown', (event) => {
    if (ui.hidden || pointer || (event.pointerType === 'mouse' && event.button !== 0)) return;
    suppressClick = false;
    lastActivation = null;
    pointer = {
      id: event.pointerId,
      type: event.pointerType,
      x: event.clientX,
      y: event.clientY,
      left: geometry.left,
      top: geometry.top,
      originLeft: geometry.left,
      originTop: geometry.top,
      dragging: false,
      longPressed: false,
    };
    try {
      orb.setPointerCapture(event.pointerId);
    } catch (error) {
      report(error);
    }
    if (event.pointerType === 'touch' && config.interaction.touch === 'action' && canMore())
      longTimer = win.setTimeout(() => {
        longTimer = 0;
        if (pointer && !pointer.dragging && !destroyed) {
          pointer.longPressed = true;
          expand();
        }
      }, config.interaction.longPressDelay);
  });
  listen(orb, 'pointermove', (event) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x,
      dy = event.clientY - pointer.y;
    if (!pointer.dragging && Math.hypot(dx, dy) <= 6) return;
    if (!pointer.dragging) {
      revision++;
      clearTimers();
      releasePanel();
      emit({ type: 'drag', value: true });
    }
    pointer.dragging = true;
    suppressClick = true;
    pointer.left = pointer.originLeft + dx;
    pointer.top = pointer.originTop + dy;
    event.preventDefault();
    render();
  });
  function finish(event, cancelled) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const old = pointer;
    win.clearTimeout(longTimer);
    longTimer = 0;
    if (old.dragging && !cancelled) {
      position.side =
        geometry.left + geometry.size / 2 < viewport.left + viewport.width / 2 ? 'left' : 'right';
      const travel = viewport.height - geometry.inset * 2 - geometry.size;
      position.y =
        travel > 0 ? clamp((geometry.top - viewport.top - geometry.inset) / travel, 0, 1) : 0.5;
    }
    pointer = null;
    emit({ type: 'drag', value: false });
    lastActivation = { type: old.type, longPressed: old.longPressed, cancelled };
    if (cancelled) {
      clearTimers();
      releasePanel();
      emit({ type: 'clear' });
      suppressClick = true;
    }
    if (
      old.type === 'touch' &&
      !cancelled &&
      !old.dragging &&
      canMore() &&
      (config.interaction.touch === 'expand' || old.longPressed)
    )
      expand();
    try {
      if (orb.hasPointerCapture(event.pointerId)) orb.releasePointerCapture(event.pointerId);
    } catch (error) {
      report(error);
    }
    render();
    if (old.dragging && !cancelled) {
      try {
        Promise.resolve(storage.write({ ...position })).catch(report);
      } catch (error) {
        report(error);
      }
    }
    if (pendingInitial) {
      const v = pendingInitial;
      pendingInitial = null;
      applyInitial(v);
    }
  }
  listen(orb, 'pointerup', (event) => finish(event, false));
  listen(orb, 'pointercancel', (event) => finish(event, true));
  listen(orb, 'lostpointercapture', (event) => finish(event, true));
  listen(orb, 'click', (event) => {
    const origin = lastActivation;
    lastActivation = null;
    if (
      event.detail !== 0 &&
      (suppressClick ||
        origin?.cancelled ||
        origin?.longPressed ||
        (origin?.type === 'touch' && config.interaction.touch === 'expand' && canMore()))
    ) {
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    suppressClick = false;
    primary();
  });
  listen(dismiss, 'click', () =>
    config.closeControl.onRequest ? invoke(config.closeControl.onRequest, api) : hide(),
  );
  listen(panelClose, 'click', () => {
    closePanel();
    orb.focus();
  });
  listen(shadow, 'keydown', (event) => {
    if (event.key === 'ArrowDown' && event.composedPath().includes(orb)) {
      event.preventDefault();
      expand();
      (config.showTools ? tools.querySelector('button') : null)?.focus();
      if (!config.showTools || !config.actions.length) dismiss.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      if (panelSpec) closePanel();
      else collapse();
      orb.focus();
    }
  });
  listen(doc, 'pointerdown', (event) => {
    if (!event.composedPath().includes(host)) {
      collapse();
      inside = false;
      render();
    }
  });
  listen(win, 'resize', schedule);
  if (win.visualViewport) {
    listen(win.visualViewport, 'resize', schedule);
    listen(win.visualViewport, 'scroll', schedule);
  }
  const observer =
    typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(schedule) : null;
  observer?.observe(doc.documentElement);
  const layoutObserver =
    typeof win.MutationObserver === 'function' ? new win.MutationObserver(schedule) : null;
  layoutObserver?.observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ['dir', 'style', 'class'],
  });
  rebuildActions();
  render();
  try {
    const value = storage.read();
    if (value && typeof value.then === 'function')
      Promise.resolve(value).then(applyInitial, report);
    else applyInitial(value);
  } catch (error) {
    report(error);
  }
  return api;
}

return Object.freeze({computePosition,mountOrb,default:mountOrb});
})();
const {mountOrb,computePosition}=__modules['src/orb.mjs'];
const {createIcon,ICON_NAMES}=__modules['src/icons.mjs'];
if(Object.hasOwn(globalThis,"GenericOrb"))throw new Error("GenericOrb already exists");
Object.defineProperty(globalThis,"GenericOrb",{value:Object.freeze({mountOrb,computePosition,createIcon,ICON_NAMES}),configurable:true});
})();

})(dockOrbScope);
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
        try { translator = global.createSiteSession(next); active = next; }
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

window.startLocalUiFramework([{"id":"tailscale-zh-cn","name":"Tailscale","matches":["https://console.tailscale.com/admin/*","https://login.tailscale.com/admin/*"],"uiSelector":"a,button,h1,h2,h3,h4,p,label,th,dt,[role=\"menuitem\"],[role=\"tab\"],[role=\"dialog\"],[role=\"heading\"],input","ignoreSelector":"script,style,pre,code,textarea,[contenteditable]:not([contenteditable=\"false\"]),.monaco-editor,.cm-editor,.CodeMirror,[data-site-localization-ui]","protectSelector":"a[href^=\"/admin/machines/100.\"],a[aria-label^=\"Detail view for\"],button[aria-label=\"User menu\"],[data-testid*=\"device-name\"],[data-testid*=\"machine-name\"],[data-testid*=\"user-email\"]","attributes":["title","placeholder","aria-label"],"theme":{"root":"html","darkClass":"dark","useColorScheme":true},"exact":{"Network":"网络","Machines":"设备","MACHINE":"设备","Machine":"设备","Apps":"应用","Services":"服务","Users":"用户","Access controls":"访问控制","Logs":"日志","Settings":"设置","Resource hub":"资源中心","Help":"帮助","Free":"免费版","Manage the devices connected to your tailnet.":"管理已连接到你私有网络的设备。","See how to manage devices":"查看设备管理说明","Add device":"添加设备","Filters":"筛选","Learn more":"了解更多","See more":"查看更多","Search by name, owner, tag, version...":"按名称、所有者、标签、版本搜索…","Search by name, owner, tag, version…":"按名称、所有者、标签、版本搜索…","Add devices to your network":"将设备加入你的网络","Operating systems":"操作系统","Cloud providers":"云服务商","Containers":"容器","Add AWS VM":"添加 AWS 虚拟机","Tailscale works best when it’s installed on multiple devices. Explore what you can do with Tailscale in these environments.":"在多台设备上安装 Tailscale，可以发挥更大作用。了解这些环境中的使用方式。","Connected":"已连接","Disconnected":"未连接","Currently connected":"当前在线","Not currently connected":"当前离线","Last seen":"最后在线时间","Last Seen":"最后在线时间","Addresses":"地址","Version":"版本","OS":"操作系统","OS Version":"系统版本","Owner":"所有者","Managed by":"管理者","Tags":"标签","Shared":"已共享","Not shared":"未共享","Enabled":"已启用","Disabled":"已禁用","Auto-update":"自动更新","Property":"属性","Exit node":"出口节点","Subnet":"子网","Connector":"连接器","Ephemeral node":"临时节点","Edit machine name…":"编辑设备名称…","Edit machine IPv4…":"编辑设备 IPv4…","Edit route settings…":"编辑路由设置…","Edit ACL tags…":"编辑 ACL 标签…","Disable key expiry":"禁用密钥过期","Enable key expiry":"启用密钥过期","Share…":"共享…","Remove…":"移除…","View recent activity":"查看近期活动","Cancel":"取消","Save":"保存","Save changes":"保存更改","Apply":"应用","Close":"关闭","Minimize":"最小化","Done":"完成","Continue":"继续","Back":"返回","Copy":"复制","Copied":"已复制","Edit":"编辑","Remove":"移除","Delete":"删除","Enable":"启用","Disable":"禁用","Manage":"管理","Configure":"配置","Reset":"重置","Search":"搜索","DNS settings":"DNS 设置","Nameservers":"DNS 服务器","Global nameservers":"全局 DNS 服务器","Search domains":"搜索域","Add nameserver":"添加 DNS 服务器","Add search domain":"添加搜索域","Override local DNS":"覆盖本地 DNS","Split DNS":"分流 DNS","HTTPS Certificates":"HTTPS 证书","General":"常规","Keys":"密钥","Auth keys":"入网密钥","API access tokens":"API 访问令牌","Generate auth key":"生成入网密钥","Generate access token":"生成访问令牌","Reusable":"可重复使用","Ephemeral":"临时设备","Pre-approved":"预先批准","Expiration":"过期时间","Key expiry":"密钥过期","Device approval":"设备审批","User management":"用户管理","Invite users":"邀请用户","Invite user":"邀请用户","Role":"角色","Status":"状态","Active":"有效","Pending":"待处理","Expired":"已过期","Network flow logs":"网络流量日志","Configuration audit logs":"配置审计日志","Audit logs":"审计日志","View logs":"查看日志","Documentation":"文档","Support":"支持","Sign out":"退出登录","Billing":"账单","Overview":"概览","Access rules":"访问规则","Grants":"授权规则","Tests":"测试","Preview":"预览","JSON editor":"JSON 编辑器","Visual editor":"可视化编辑器","Route settings":"路由设置","Subnet routes":"子网路由","Exit node settings":"出口节点设置","Use as exit node":"用作出口节点","Approved":"已批准","Not approved":"未批准","Advertised routes":"发布的路由","Device details":"设备详情","Details":"详情","Created":"创建时间","Last connected":"最后连接时间","Client version":"客户端版本","Operating system":"操作系统","Authentication":"身份验证","Key expiration":"密钥到期时间","Manage DNS and nameservers of your network.":"管理网络的 DNS 设置和 DNS 服务器。","See how to configure DNS":"查看 DNS 配置方法","Tailnet DNS name":"私有网络 DNS 名称","This unique name is used when registering DNS entries, sharing your device to other tailnets, and issuing TLS certificates.":"此唯一名称用于注册 DNS 记录、向其他私有网络共享设备，以及签发 TLS 证书。","Rename tailnet...":"重命名私有网络…","Manage in Apps":"前往应用管理","Control device and user access to your third-party applications, without requiring any end user configuration.":"管理设备和用户对第三方应用的访问，无需最终用户额外配置。","Set the nameservers used by devices on your network to resolve DNS queries.":"设置网络中设备解析 DNS 查询时使用的 DNS 服务器。","Search Domains":"搜索域","Add search domain...":"添加搜索域…","Set custom DNS search domains. With MagicDNS enabled, your tailnet domain is always the first search domain.":"设置自定义 DNS 搜索域。启用 MagicDNS 时，私有网络域名始终是第一个搜索域。","Automatically register domain names for devices in your tailnet. This lets you to use a machine’s name instead of its IP address.":"自动为私有网络中的设备注册域名，以便通过设备名而非 IP 地址访问。","Disable MagicDNS…":"禁用 MagicDNS…","Enable HTTPS...":"启用 HTTPS…","Allow users to provision HTTPS certificates for their devices.":"允许用户为自己的设备签发 HTTPS 证书。","Manage the users in your network and their permissions.":"管理网络中的用户及其权限。","See how user roles work":"了解用户角色的作用","Search users...":"搜索用户…","USER":"用户","Device management":"设备管理","Policy file management":"策略文件管理","Trust credentials":"信任凭据","Contact preferences":"联系偏好","Authentication keys":"入网密钥","API tokens":"API 令牌","Generate key":"生成密钥","View and manage your Auth keys and API access tokens.":"查看和管理入网密钥与 API 访问令牌。","Your private device keys are not included here: they are always private, stay on your device, and are never shared with Tailscale.":"此处不显示设备私钥：私钥仅保留在设备上，不会提供给 Tailscale。","Authenticate devices without an interactive login.":"无需交互式登录即可授权设备入网。","Generate auth key…":"生成入网密钥…","Generate access token…":"生成访问令牌…","You don’t have any valid auth keys":"当前没有有效的入网密钥","Access tokens give access to the Tailscale API.":"访问令牌用于调用 Tailscale API。","API access token":"API 访问令牌","Revoke…":"撤销…","TYPE":"类型","REVOKE KEY":"撤销密钥"},"rules":[{"pattern":"^(\\d+) machines?$","replacement":"$1 台设备"},{"pattern":"^(\\d+) addresses?$","replacement":"$1 个地址"},{"pattern":"^Read documentation about (Machines(?: filters)?)$","replacement":"阅读设备管理文档"},{"pattern":"^Read documentation about (DNS|MagicDNS|HTTPS)$","replacement":"阅读 $1 文档"}]}]);
})();
