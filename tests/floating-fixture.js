/* SPDX-License-Identifier: MIT
 * Isolated about:blank only. Synthetic pointer/storage lifecycle regression;
 * real mouse/touch tests must additionally exercise native event sequences.
 */
window.runFloatingControlTests = async function () {
  if (location.href !== 'about:blank') throw new Error('Use an isolated about:blank page.');
  window.__localUiFramework?.stop(); window.__localUiTranslator?.stop();
  const checks = [];
  const check = (name, value) => { if (!value) throw new Error('Floating regression failed: ' + name); checks.push(name); };
  const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  Object.defineProperty(window, 'localStorage', { configurable: true, value: storage });
  const key = 'local-ui-translator:toggle-position';
  const install = id => window.installTranslator({ id, exact: {} });
  const button = () => document.querySelector('[data-local-ui-translator]');
  const rect = () => button().getBoundingClientRect();
  const pointer = (target, type, x, y) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 42, isPrimary: true, button: 0, clientX: x, clientY: y, pointerType: 'touch' }));
  const wait = async predicate => { const end=Date.now()+2000; while(!predicate()){if(Date.now()>end)throw new Error('Floating state wait timed out.');await new Promise(resolve=>setTimeout(resolve,16));} };
  let api;
  try {
    api = install('float-one');
    check('default right edge', Math.abs(rect().right - (innerWidth - 8)) < 2);
    check('default vertical center', Math.abs(rect().top + rect().height/2 - innerHeight/2) < 2);
    check('touch scroll disabled only on control', button().style.touchAction === 'none');
    check('accessible adjustment instructions', button().getAttribute('aria-label').includes('Alt+'));
    const start = rect();
    pointer(button(),'pointerdown',start.left+10,start.top+10);
    pointer(window,'pointermove',20,100);pointer(window,'pointerup',20,100);
    button().dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1}));
    check('drag click does not toggle',api.enabled);
    check('touch pointer snaps left',Math.abs(rect().left-8)<2);
    check('normalized position stored',JSON.parse(values.get(key)).side==='left' && JSON.parse(values.get(key)).y>=0 && JSON.parse(values.get(key)).y<=1);
    button().click();check('keyboard/programmatic activation toggles',!api.enabled);
    const y=JSON.parse(values.get(key)).y;
    button().dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',altKey:true,bubbles:true,cancelable:true}));
    check('keyboard vertical adjustment',JSON.parse(values.get(key)).y>y);
    button().dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',altKey:true,bubbles:true,cancelable:true}));
    check('keyboard switches edge',JSON.parse(values.get(key)).side==='right');
    const expected = values.get(key); api.stop(); api=install('float-two');
    check('position shared across site ids',values.get(key)===expected && Math.abs(rect().right-(innerWidth-8))<2);
    check('language preference remains per site',api.enabled);
    const b=button();document.body.replaceWith(document.createElement('body'));await wait(()=>b.isConnected);
    check('body replacement remounts same control',button()===b);
    const before=rect().top;window.dispatchEvent(new Event('resize'));
    check('resize stays within viewport',rect().top>=0&&rect().bottom<=innerHeight+1&&rect().top===before);
    const r=rect();pointer(b,'pointerdown',r.left+10,r.top+10);pointer(window,'pointermove',20,200);api.stop();
    pointer(window,'pointerup',20,200);
    check('stop during drag removes overlay',!button());
    check('stop does not persist unfinished gesture',values.get(key)===expected);
    values.set(key,'{"side":"left","y":2}');api=install('invalid-position');
    check('invalid stored position falls back',Math.abs(rect().right-(innerWidth-8))<2);api.stop();
    Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new Error('Storage blocked');}});
    api=install('blocked-storage');button().click();
    check('blocked storage does not prevent toggle',!api.enabled);
    return {passed:checks.length,total:checks.length,checks};
  } finally {
    api?.stop();
    if(descriptor)Object.defineProperty(window,'localStorage',descriptor);else delete window.localStorage;
  }
};
