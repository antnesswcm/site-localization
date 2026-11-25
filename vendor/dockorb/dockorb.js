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
