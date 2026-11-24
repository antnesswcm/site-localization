// SPDX-License-Identifier: MIT
// One userscript-scoped value across origins. Read on instance start; no listeners.
(function (global) {
  const key = 'local-ui-translator:toggle-position';
  function valid(value) {
    return !!value && (value.side === 'left' || value.side === 'right') &&
      typeof value.y === 'number' && Number.isFinite(value.y) && value.y >= 0 && value.y <= 1;
  }
  global.__localUiPositionStore = Object.freeze({
    read() {
      try {
        if (typeof GM_getValue !== 'function') return null;
        const value = GM_getValue(key, null);
        return valid(value) ? { side: value.side, y: value.y } : null;
      } catch (_) { return null; }
    },
    write(value) {
      if (!valid(value)) return false;
      try {
        if (typeof GM_setValue !== 'function') return false;
        GM_setValue(key, { side: value.side, y: value.y });
        return true;
      } catch (_) { return false; }
    }
  });
})(window);
