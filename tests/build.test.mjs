// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import sites from '../src/sites/index.mjs';
import {validateConfigurations} from '../tools/validate-config.mjs';
const good=()=>structuredClone(sites[0]);
test('complete configurations pass offline validation',()=>assert.equal(validateConfigurations(sites),sites));
for(const [name,change] of [
 ['numeric id',c=>c.id=123],['empty id',c=>c.id=''],['metadata injection',c=>c.matches=['https://example.org/ui/*\n// @match *://*/*']],
 ['all hosts',c=>c.matches=['https://*/ui/*']],['no matches',c=>c.matches=[]],['unsafe attribute',c=>c.attributes=['value']],
 ['bad dictionary',c=>c.exact.Save=123],['unanchored regex',c=>c.rules=[{pattern:'Save',replacement:'保存'}]],
 ['multiline regex',c=>c.rules=[{pattern:'^Save$',replacement:'保存',flags:'m'}]],['invalid regex',c=>c.rules=[{pattern:'^[$',replacement:'x'}]],
 ['bad selector',c=>c.uiSelector=123],['executable resource',c=>c.extra=()=>{}],['null theme',c=>c.theme=null],
 ['unknown theme root',c=>c.theme={root:'#app'}],['theme class list',c=>c.theme={root:'html',darkClass:'a b'}],
 ['invalid color scheme flag',c=>c.theme={root:'html',useColorScheme:1}],['unknown theme field',c=>c.theme={root:'html',guessBackground:true}]
])test('reject '+name,()=>{const c=good();change(c);assert.throws(()=>validateConfigurations([c]));});
test('duplicate id rejected',()=>assert.throws(()=>validateConfigurations([good(),good()])));
const artifact=await readFile(new URL('../dist/local-ui-zh.user.js',import.meta.url),'utf8');
const engine=await readFile(new URL('../src/engine.js',import.meta.url),'utf8');
const project=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
test('single bundle syntax',()=>new vm.Script(artifact));
test('brand and version single source',()=>{assert.ok(artifact.includes('// @name         '+project.displayName));assert.ok(artifact.includes('// @version      '+project.version));});
test('bundle has exactly registered match scopes',()=>assert.deepEqual([...artifact.matchAll(/^\/\/ @match\s+(.*)$/gm)].map(m=>m[1]),[...new Set(sites.flatMap(s=>s.matches))]));
test('offline bundle contains no runtime dependency or network declaration',()=>assert.doesNotMatch(artifact,/^\/\/ @(?:require|connect)\b/m));
test('new namespace and explicit GM capabilities',()=>{assert.match(artifact,/@namespace\s+site-localization/);for(const name of ['GM_getValue','GM_setValue','GM_registerMenuCommand','GM_unregisterMenuCommand'])assert.match(artifact,new RegExp('@grant\\s+'+name));});
test('pure DOM engine contains neither UI nor storage singleton',()=>assert.doesNotMatch(engine,/ensureButton|updateButton|localStorage|__localUiTranslator/));
test('full bundled icon licenses',()=>{assert.match(artifact,/ISC License/);assert.match(artifact,/Cole Bemis/);});
test('fixed vendor bytes match manifest',async()=>{const bytes=await readFile(new URL('../vendor/dockorb/dockorb.js',import.meta.url));const manifest=JSON.parse(await readFile(new URL('../vendor/dockorb/manifest.json',import.meta.url)));assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest.sha256);assert.equal(manifest.version,'0.3.0');});
