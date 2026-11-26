// SPDX-License-Identifier: MIT
// Structural/offline validation. Actual CSS selector syntax is validated by the DOM engine.
export function validateConfigurations(configurations) {
  if (!Array.isArray(configurations) || !configurations.length) throw new TypeError('At least one site configuration is required.');
  const ids = new Set();
  for (const config of configurations) {
    if (!config || typeof config.id !== 'string' || !/^[a-z0-9-]+$/.test(config.id) || ids.has(config.id)) throw new TypeError('Invalid or duplicate site id.');
    ids.add(config.id);
    if (!Array.isArray(config.matches) || !config.matches.length) throw new TypeError('Missing site matches.');
    for (const match of config.matches) {
      if (typeof match !== 'string' || !/^https?:\/\/(?:\*\.)?[a-z0-9.-]+\/[^\s]*$/i.test(match)) throw new TypeError('Explicit HTTP(S) host matches required.');
    }
    for (const key of ['rootSelector','uiSelector','ignoreSelector','protectSelector']) {
      if (config[key] !== undefined && (typeof config[key] !== 'string' || !config[key].trim())) throw new TypeError('Invalid selector: '+key);
    }
    if (config.attributes !== undefined && (!Array.isArray(config.attributes) || config.attributes.some(value=>!['title','placeholder','aria-label'].includes(value)))) throw new TypeError('Unsupported translation attributes.');
    if (config.exact !== undefined && (!config.exact || typeof config.exact !== 'object' || Array.isArray(config.exact) || Object.values(config.exact).some(value=>typeof value!=='string'))) throw new TypeError('Exact translations must be a string dictionary.');
    const phrases = new Map();
    for (const [key, translation] of Object.entries(config.exact || {})) {
      const normalized = key.trim().replace(/\s+/g, ' ');
      if (!normalized || (phrases.has(normalized) && phrases.get(normalized) !== translation)) throw new TypeError('Conflicting or empty normalized translation phrase.');
      phrases.set(normalized, translation);
    }
    if (config.theme !== undefined) {
      const t=config.theme;
      if (!t || typeof t!=='object' || Array.isArray(t) || !['html','body'].includes(t.root) || Object.keys(t).some(key=>!['root','darkClass','lightClass','useColorScheme'].includes(key))) throw new TypeError('Invalid theme declaration.');
      for (const key of ['darkClass','lightClass']) if(t[key]!==undefined && (typeof t[key]!=='string' || !/^[a-zA-Z_][\w-]*$/.test(t[key]))) throw new TypeError('Invalid theme class.');
      if(t.useColorScheme!==undefined && typeof t.useColorScheme!=='boolean') throw new TypeError('Invalid color scheme option.');
    }
    if (config.rules !== undefined && !Array.isArray(config.rules)) throw new TypeError('Rules must be an array.');
    for (const rule of config.rules || []) {
      if (!rule || typeof rule.pattern !== 'string' || !rule.pattern.startsWith('^') || !rule.pattern.endsWith('$') || typeof rule.replacement !== 'string' || (rule.flags !== undefined && typeof rule.flags !== 'string') || /[my]/.test(rule.flags || '')) throw new TypeError('Invalid anchored translation rule.');
      new RegExp(rule.pattern, (rule.flags || '').replace(/g/g,''));
      if (rule.selector !== undefined && (typeof rule.selector !== 'string' || !rule.selector.trim())) throw new TypeError('Invalid rule selector.');
    }
  }
  JSON.stringify(configurations, (_,value)=>{
    if (typeof value==='function' || typeof value==='undefined' || value instanceof RegExp) throw new TypeError('Only serializable declarative configurations are supported.');
    return value;
  });
  return configurations;
}
