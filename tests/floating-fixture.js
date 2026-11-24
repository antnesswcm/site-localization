/* SPDX-License-Identifier: MIT
 * Isolated about:blank only; all values below are synthetic.
 * Shared position-store contract regression, not a real GM/cross-origin test.
 * Native mouse/touch sequences and visual acceptance need separate validation.
 */
window.runFloatingControlTests = async function () {
  if (location.href !== 'about:blank') throw new Error('Use an isolated about:blank page.');
  window.__localUiFramework?.stop(); window.__localUiTranslator?.stop();
  const checks = [];
  const check = (name, value) => { if (!value) throw new Error('Floating regression failed: ' + name); checks.push(name); };
  const storageDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
  const positionDescriptor = Object.getOwnPropertyDescriptor(window, '__localUiPositionStore');
  const originalBody = document.body;
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
  const positionKey = 'local-ui-translator:toggle-position';
  let sharedPosition = null;
  let reads = 0;
  const writes = [];
  const copy = position => position && { ...position };
  const positionStore = {
    read() { reads++; return copy(sharedPosition); },
    write(position) { sharedPosition = copy(position); writes.push(copy(position)); }
  };
  const install = id => window.installTranslator({ id, exact: {} });
  const button = () => document.querySelector('[data-local-ui-translator]');
  const rect = () => button().getBoundingClientRect();
  const close = (a, b) => Math.abs(a - b) < 1;
  const radii = () => {
    const style = getComputedStyle(button());
    return [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius]
      .map(value => value.includes('%') ? parseFloat(value) * rect().width / 100 : parseFloat(value));
  };
  const shape = side => {
    const r = radii();
    const half = rect().width / 2;
    return side === 'left' ? r[0] === 0 && r[3] === 0 && close(r[1], half) && close(r[2], half) :
      side === 'right' ? r[1] === 0 && r[2] === 0 && close(r[0], half) && close(r[3], half) : r.every(value => close(value, half));
  };
  const pointer = (target, type, x, y, pointerType = 'touch') => target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 42, isPrimary: true, button: 0, clientX: x, clientY: y, pointerType }));
  const wait = async predicate => { const end = Date.now() + 2000; while (!predicate()) { if (Date.now() > end) throw new Error('Floating state wait timed out.'); await new Promise(resolve => setTimeout(resolve, 16)); } };
  let api;
  try {
    Object.defineProperty(window, 'localStorage', { configurable: true, value: storage });
    Object.defineProperty(window, '__localUiPositionStore', { configurable: true, value: positionStore });
    api = install('float-one');
    check('position read exactly once on installation', reads === 1 && writes.length === 0);
    check('default right edge is exactly 0px', close(rect().right, innerWidth));
    check('default vertical center', close(rect().top + rect().height / 2, innerHeight / 2));
    check('right dock has square outer and semicircular inner corners', shape('right'));
    check('docked control has equal positive width and height', rect().width > 0 && close(rect().width, rect().height));
    check('enabled control offers restore with 原', api.enabled && button().textContent === '原' && button().getAttribute('aria-pressed') === 'true');
    check('touch scroll disabled only on control', button().style.touchAction === 'none' && document.body.style.touchAction !== 'none');
    check('pointer-only instructions', button().getAttribute('aria-label').includes('Drag to dock') && !button().getAttribute('aria-label').includes('Alt+'));
    check('control is outside Tab order', button().tabIndex === -1);
    button().click();
    check('click 原 restores and offers 汉', !api.enabled && button().textContent === '汉' && values.get('local-ui-translator:float-one') === 'off');
    button().click();
    check('click 汉 enables localization and offers 原', api.enabled && button().textContent === '原' && values.get('local-ui-translator:float-one') === 'on');
    const start = rect();
    pointer(button(), 'pointerdown', start.left + start.width / 2, start.top + start.height / 2);
    pointer(window, 'pointermove', 20, 100);
    check('dragging control is circular with equal dimensions', shape('circle') && close(rect().width, rect().height));
    check('drag movement does not save or reread position', writes.length === 0 && reads === 1);
    pointer(window, 'pointerup', 20, 100);
    button().dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    check('dragNoClick leaves language enabled', api.enabled && button().textContent === '原');
    check('touch release docks left at exactly 0px', close(rect().left, 0));
    check('left dock has square outer and semicircular inner corners', shape('left'));
    check('release saves one normalized shared position', writes.length === 1 && sharedPosition.side === 'left' && sharedPosition.y >= 0 && sharedPosition.y <= 1);
    check('position never written to language localStorage', !values.has(positionKey));
    const saved = JSON.stringify(sharedPosition);
    button().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true, cancelable: true }));
    check('keyboard does not reposition or save', JSON.stringify(sharedPosition) === saved && writes.length === 1 && close(rect().left, 0));
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    const space = new KeyboardEvent('keyup', { key: ' ', bubbles: true, cancelable: true });
    button().dispatchEvent(enter); button().dispatchEvent(space);
    check('Enter and Space default activation blocked', enter.defaultPrevented && space.defaultPrevented && api.enabled);
    button().click();
    check('programmatic click remains available after drag', !api.enabled && button().textContent === '汉');
    api.stop(); api = install('float-two');
    check('position shared across configuration ids', reads === 2 && JSON.stringify(sharedPosition) === saved && close(rect().left, 0));
    check('language preference remains isolated per configuration', api.enabled && button().textContent === '原' && values.get('local-ui-translator:float-one') === 'off' && !values.has('local-ui-translator:float-two'));
    const open = { left: rect().left, top: rect().top };
    // Another tab/site writes the shared bridge; this installed engine must not subscribe.
    positionStore.write({ side: 'right', y: 0.75 });
    window.dispatchEvent(new StorageEvent('storage', { key: positionKey, newValue: JSON.stringify(sharedPosition) }));
    window.dispatchEvent(new Event('resize'));
    await new Promise(resolve => requestAnimationFrame(resolve));
    check('external store write leaves already-open instance unmoved', close(rect().left, open.left) && close(rect().top, open.top) && reads === 2);
    const b = button(); document.body.replaceWith(document.createElement('body')); await wait(() => b.isConnected);
    check('body replacement remounts same control', button() === b);
    const before = rect().top; window.dispatchEvent(new Event('resize'));
    check('resize remains visible and retains local position', rect().top >= 0 && rect().bottom <= innerHeight + 1 && close(rect().top, before) && close(rect().left, 0));
    check('resize and body remount do not reread shared position', reads === 2);
    api.stop(); api = install('float-three');
    check('new installation reads latest external shared position', reads === 3 && close(rect().right, innerWidth) && close(rect().top, 0.75 * Math.max(0, innerHeight - rect().height)));
    const r = rect(); const writeCount = writes.length;
    pointer(button(), 'pointerdown', r.left + r.width / 2, r.top + r.height / 2, 'mouse');
    pointer(window, 'pointermove', 20, 200, 'mouse'); api.stop();
    pointer(window, 'pointerup', 20, 200, 'mouse');
    window.dispatchEvent(new Event('resize'));
    check('stop during mouse drag removes control and resize cannot remount', !button());
    check('stop does not persist unfinished gesture', writes.length === writeCount && sharedPosition.side === 'right' && sharedPosition.y === 0.75);
    api = install('float-one');
    check('reinstall restores isolated off language preference', !api.enabled && button().textContent === '汉');
    api.stop(); sharedPosition = { side: 'left', y: 2 }; api = install('invalid-position');
    check('invalid stored position falls back to right center', close(rect().right, innerWidth) && close(rect().top + rect().height / 2, innerHeight / 2)); api.stop();
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('Storage blocked'); } });
    Object.defineProperty(window, '__localUiPositionStore', { configurable: true, value: { read() { throw new Error('Position read blocked'); }, write() { throw new Error('Position write blocked'); } } });
    api = install('blocked-storage'); button().click();
    check('blocked language and position reads do not prevent toggle', !api.enabled && button().textContent === '汉');
    const blocked = rect();
    pointer(button(), 'pointerdown', blocked.left + blocked.width / 2, blocked.top + blocked.height / 2);
    pointer(window, 'pointermove', 20, 100); pointer(window, 'pointerup', 20, 100);
    check('blocked position write does not prevent docking', close(rect().left, 0) && shape('left'));
    return { passed: checks.length, total: checks.length, checks };
  } finally {
    api?.stop();
    if (originalBody && document.body !== originalBody) document.body.replaceWith(originalBody);
    if (storageDescriptor) Object.defineProperty(window, 'localStorage', storageDescriptor); else delete window.localStorage;
    if (positionDescriptor) Object.defineProperty(window, '__localUiPositionStore', positionDescriptor); else delete window.__localUiPositionStore;
  }
};