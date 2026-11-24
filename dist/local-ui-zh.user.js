// ==UserScript==
// @name         站点汉化 / Site Localization
// @namespace    local-ui-translator
// @version      0.3.0
// @description  一个脚本承载完整站点汉化配置；自动选站、增量DOM翻译、中英文切换
// @license      MIT
// @match        https://console.tailscale.com/admin/*
// @match        https://login.tailscale.com/admin/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function(){
"use strict";
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
    const positionKey = 'local-ui-translator:toggle-position';
    let position = { side: 'right', y: 0.5 };
    let drag = null;
    let suppressClick = false;
    try {
      const saved = JSON.parse(global.localStorage.getItem(positionKey));
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
      return { x, y, insetX: Math.min(8, x / 2), insetY: Math.min(8, y / 2) };
    }
    function placeButton() {
      if (!button || !button.isConnected || drag) return;
      const b = bounds();
      button.style.left = (position.side === 'left' ? b.insetX : b.x - b.insetX) + 'px';
      button.style.top = (b.insetY + position.y * (b.y - 2 * b.insetY)) + 'px';
    }
    function savePosition() {
      try { global.localStorage.setItem(positionKey, JSON.stringify(position)); } catch (_) { /* Storage is optional. */ }
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
        position.y = b.y > 2 * b.insetY ? Math.max(0, Math.min(1, (rect.top - b.insetY) / (b.y - 2 * b.insetY))) : 0.5;
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
      event.preventDefault();
      const b = bounds();
      button.style.left = Math.max(0, Math.min(b.x, drag.left + dx)) + 'px';
      button.style.top = Math.max(0, Math.min(b.y, drag.top + dy)) + 'px';
    }
    function resizeButton() { endDrag(null); placeButton(); }
    function updateButton() {
      if (!button) return;
      const label = enabled ? '中文 · 切换 English' : 'English · 切换中文';
      if (button.firstChild) button.firstChild.nodeValue = label;
      else button.appendChild(doc.createTextNode(label));
      button.setAttribute('aria-pressed', String(enabled));
      const help = '拖动贴边；点击切换语言 / Drag to dock; click to switch language';
      button.setAttribute('aria-label', label + '；' + help);
      button.title = '本地界面翻译 / Local UI translation；' + help;
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
        button.style.cssText = 'position:fixed;left:0;top:0;max-width:100vw;max-height:100vh;box-sizing:border-box;z-index:2147483647;padding:8px 12px;border:1px solid #777;border-radius:8px;background:#fff;color:#222;font:13px system-ui;cursor:grab;touch-action:none;user-select:none;box-shadow:0 2px 8px #0003;';
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

window.startLocalUiFramework([{"id":"tailscale-zh-cn","name":"Tailscale","matches":["https://console.tailscale.com/admin/*","https://login.tailscale.com/admin/*"],"uiSelector":"a,button,h1,h2,h3,h4,p,label,th,dt,[role=\"menuitem\"],[role=\"tab\"],[role=\"dialog\"],[role=\"heading\"],input","ignoreSelector":"script,style,pre,code,textarea,[contenteditable]:not([contenteditable=\"false\"]),.monaco-editor,.cm-editor,.CodeMirror,[data-local-ui-translator]","protectSelector":"a[href^=\"/admin/machines/100.\"],a[aria-label^=\"Detail view for\"],button[aria-label=\"User menu\"],[data-testid*=\"device-name\"],[data-testid*=\"machine-name\"],[data-testid*=\"user-email\"]","attributes":["title","placeholder","aria-label"],"exact":{"Network":"网络","Machines":"设备","MACHINE":"设备","Machine":"设备","Apps":"应用","Services":"服务","Users":"用户","Access controls":"访问控制","Logs":"日志","Settings":"设置","Resource hub":"资源中心","Help":"帮助","Free":"免费版","Manage the devices connected to your tailnet.":"管理已连接到你私有网络的设备。","See how to manage devices":"查看设备管理说明","Add device":"添加设备","Filters":"筛选","Learn more":"了解更多","See more":"查看更多","Search by name, owner, tag, version...":"按名称、所有者、标签、版本搜索…","Search by name, owner, tag, version…":"按名称、所有者、标签、版本搜索…","Add devices to your network":"将设备加入你的网络","Operating systems":"操作系统","Cloud providers":"云服务商","Containers":"容器","Add AWS VM":"添加 AWS 虚拟机","Tailscale works best when it’s installed on multiple devices. Explore what you can do with Tailscale in these environments.":"在多台设备上安装 Tailscale，可以发挥更大作用。了解这些环境中的使用方式。","Connected":"已连接","Disconnected":"未连接","Currently connected":"当前在线","Not currently connected":"当前离线","Last seen":"最后在线时间","Last Seen":"最后在线时间","Addresses":"地址","Version":"版本","OS":"操作系统","OS Version":"系统版本","Owner":"所有者","Managed by":"管理者","Tags":"标签","Shared":"已共享","Not shared":"未共享","Enabled":"已启用","Disabled":"已禁用","Auto-update":"自动更新","Property":"属性","Exit node":"出口节点","Subnet":"子网","Connector":"连接器","Ephemeral node":"临时节点","Edit machine name…":"编辑设备名称…","Edit machine IPv4…":"编辑设备 IPv4…","Edit route settings…":"编辑路由设置…","Edit ACL tags…":"编辑 ACL 标签…","Disable key expiry":"禁用密钥过期","Enable key expiry":"启用密钥过期","Share…":"共享…","Remove…":"移除…","View recent activity":"查看近期活动","Cancel":"取消","Save":"保存","Save changes":"保存更改","Apply":"应用","Close":"关闭","Minimize":"最小化","Done":"完成","Continue":"继续","Back":"返回","Copy":"复制","Copied":"已复制","Edit":"编辑","Remove":"移除","Delete":"删除","Enable":"启用","Disable":"禁用","Manage":"管理","Configure":"配置","Reset":"重置","Search":"搜索","DNS settings":"DNS 设置","Nameservers":"DNS 服务器","Global nameservers":"全局 DNS 服务器","Search domains":"搜索域","Add nameserver":"添加 DNS 服务器","Add search domain":"添加搜索域","Override local DNS":"覆盖本地 DNS","Split DNS":"分流 DNS","HTTPS Certificates":"HTTPS 证书","General":"常规","Keys":"密钥","Auth keys":"入网密钥","API access tokens":"API 访问令牌","Generate auth key":"生成入网密钥","Generate access token":"生成访问令牌","Reusable":"可重复使用","Ephemeral":"临时设备","Pre-approved":"预先批准","Expiration":"过期时间","Key expiry":"密钥过期","Device approval":"设备审批","User management":"用户管理","Invite users":"邀请用户","Invite user":"邀请用户","Role":"角色","Status":"状态","Active":"有效","Pending":"待处理","Expired":"已过期","Network flow logs":"网络流量日志","Configuration audit logs":"配置审计日志","Audit logs":"审计日志","View logs":"查看日志","Documentation":"文档","Support":"支持","Sign out":"退出登录","Billing":"账单","Overview":"概览","Access rules":"访问规则","Grants":"授权规则","Tests":"测试","Preview":"预览","JSON editor":"JSON 编辑器","Visual editor":"可视化编辑器","Route settings":"路由设置","Subnet routes":"子网路由","Exit node settings":"出口节点设置","Use as exit node":"用作出口节点","Approved":"已批准","Not approved":"未批准","Advertised routes":"发布的路由","Device details":"设备详情","Details":"详情","Created":"创建时间","Last connected":"最后连接时间","Client version":"客户端版本","Operating system":"操作系统","Authentication":"身份验证","Key expiration":"密钥到期时间","Manage DNS and nameservers of your network.":"管理网络的 DNS 设置和 DNS 服务器。","See how to configure DNS":"查看 DNS 配置方法","Tailnet DNS name":"私有网络 DNS 名称","This unique name is used when registering DNS entries, sharing your device to other tailnets, and issuing TLS certificates.":"此唯一名称用于注册 DNS 记录、向其他私有网络共享设备，以及签发 TLS 证书。","Rename tailnet...":"重命名私有网络…","Manage in Apps":"前往应用管理","Control device and user access to your third-party applications, without requiring any end user configuration.":"管理设备和用户对第三方应用的访问，无需最终用户额外配置。","Set the nameservers used by devices on your network to resolve DNS queries.":"设置网络中设备解析 DNS 查询时使用的 DNS 服务器。","Search Domains":"搜索域","Add search domain...":"添加搜索域…","Set custom DNS search domains. With MagicDNS enabled, your tailnet domain is always the first search domain.":"设置自定义 DNS 搜索域。启用 MagicDNS 时，私有网络域名始终是第一个搜索域。","Automatically register domain names for devices in your tailnet. This lets you to use a machine’s name instead of its IP address.":"自动为私有网络中的设备注册域名，以便通过设备名而非 IP 地址访问。","Disable MagicDNS…":"禁用 MagicDNS…","Enable HTTPS...":"启用 HTTPS…","Allow users to provision HTTPS certificates for their devices.":"允许用户为自己的设备签发 HTTPS 证书。","Manage the users in your network and their permissions.":"管理网络中的用户及其权限。","See how user roles work":"了解用户角色的作用","Search users...":"搜索用户…","USER":"用户","Device management":"设备管理","Policy file management":"策略文件管理","Trust credentials":"信任凭据","Contact preferences":"联系偏好","Authentication keys":"入网密钥","API tokens":"API 令牌","Generate key":"生成密钥","View and manage your Auth keys and API access tokens.":"查看和管理入网密钥与 API 访问令牌。","Your private device keys are not included here: they are always private, stay on your device, and are never shared with Tailscale.":"此处不显示设备私钥：私钥仅保留在设备上，不会提供给 Tailscale。","Authenticate devices without an interactive login.":"无需交互式登录即可授权设备入网。","Generate auth key…":"生成入网密钥…","Generate access token…":"生成访问令牌…","You don’t have any valid auth keys":"当前没有有效的入网密钥","Access tokens give access to the Tailscale API.":"访问令牌用于调用 Tailscale API。","API access token":"API 访问令牌","Revoke…":"撤销…","TYPE":"类型","REVOKE KEY":"撤销密钥"},"rules":[{"pattern":"^(\\d+) machines?$","replacement":"$1 台设备"},{"pattern":"^(\\d+) addresses?$","replacement":"$1 个地址"},{"pattern":"^Read documentation about (Machines(?: filters)?)$","replacement":"阅读设备管理文档"},{"pattern":"^Read documentation about (DNS|MagicDNS|HTTPS)$","replacement":"阅读 $1 文档"}]}]);
})();
