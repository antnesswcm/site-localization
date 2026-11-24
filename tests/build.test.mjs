// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import sites from '../src/sites/index.mjs';
import {validateConfigurations} from '../tools/validate-config.mjs';
const good=()=>structuredClone(sites[0]);
test('registered complete site configurations pass offline validation',()=>assert.equal(validateConfigurations(sites),sites));
for (const [name,change] of [
  ['missing id',c=>delete c.id],['numeric id',c=>c.id=123],['empty id',c=>c.id=''],
  ['metadata newline injection',c=>c.matches=['https://example.org/ui/*\n// @match *://*/*']],
  ['all-host match',c=>c.matches=['https://*/ui/*']],['missing matches',c=>c.matches=[]],
  ['unsafe attribute',c=>c.attributes=['value']],['non-string translation',c=>c.exact.Save=123],
  ['unanchored rule',c=>c.rules=[{pattern:'Save',replacement:'保存'}]],
  ['multiline flag',c=>c.rules=[{pattern:'^Save$',replacement:'保存',flags:'m'}]],
  ['invalid regex',c=>c.rules=[{pattern:'^[$',replacement:'x'}]],
  ['non-string selector',c=>c.uiSelector=123],['executable resource',c=>c.extra=()=>{}]
]) test('reject '+name,()=>{const c=good();change(c);assert.throws(()=>validateConfigurations([c]));});
test('duplicate id rejected',()=>assert.throws(()=>validateConfigurations([good(),good()])));
test('explicitly scoped dynamic rule is supported',()=>{const c=good();c.rules=[{pattern:'^(\\d+) items?$',replacement:'$1 项',selector:'[data-item-count]'}];validateConfigurations([c]);});
test('existing off preference remains off with unchanged storage identity',async()=>{
  const source=await readFile(new URL('../src/engine.js',import.meta.url),'utf8');
  const values=new Map([['local-ui-translator:tailscale-zh-cn','off']]);
  const window={document:{querySelector(){return null;},body:null,documentElement:{},addEventListener(){},removeEventListener(){}},localStorage:{getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)},MutationObserver:class{observe(){} disconnect(){}},requestAnimationFrame(){return 1;},cancelAnimationFrame(){},addEventListener(){},removeEventListener(){}};
  vm.runInNewContext(source,{window});
  const api=window.installTranslator(sites[0]);
  assert.equal(api.enabled,false);assert.equal(values.get('local-ui-translator:tailscale-zh-cn'),'off');api.stop();
});
const artifact=await readFile(new URL('../dist/local-ui-zh.user.js',import.meta.url),'utf8');
const project=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
test('published bundle has valid JavaScript syntax',()=>new vm.Script(artifact));
test('bundle uses project brand and single version source',()=>{assert.ok(artifact.includes('// @name         '+project.displayName));assert.ok(artifact.includes('// @version      '+project.version));});
test('technical namespace and site preference identity remain stable',()=>{assert.ok(artifact.includes('// @namespace    local-ui-translator'));assert.ok(artifact.includes("'local-ui-translator:' + adapter.id"));assert.equal(sites[0].id,'tailscale-zh-cn');});
test('bundle includes exactly the registered URL matches',()=>assert.deepEqual([...artifact.matchAll(/^\/\/ @match\s+(.*)$/gm)].map(m=>m[1]),[...new Set(sites.flatMap(s=>s.matches))]));
test('bundle has no remote update or dependency declarations before publication',()=>assert.doesNotMatch(artifact,/^\/\/ @(?:require|connect|updateURL|downloadURL)\b/m));
