// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../src/framework/position-store.js',import.meta.url),'utf8');
function instance(shared,origin){const win={location:{origin}};const ctx=vm.createContext({window:win,GM_getValue:(key,def)=>shared.get(key)??def,GM_setValue:(key,val)=>shared.set(key,structuredClone(val))});vm.runInContext(source,ctx);return win.__localUiPositionStore;}
const plain=value=>JSON.parse(JSON.stringify(value));
test('one userscript position value crosses origins without live synchronization',()=>{const shared=new Map(),a=instance(shared,'https://site-a.example'),b=instance(shared,'https://site-b.example');a.write({side:'left',y:.3});const bSnapshot=plain(b.read());a.write({side:'right',y:.8});assert.deepEqual(bSnapshot,{side:'left',y:.3});const c=instance(shared,'https://site-c.example');assert.deepEqual(plain(c.read()),{side:'right',y:.8});assert.deepEqual([...shared.keys()],['local-ui-translator:toggle-position']);});
test('invalid positions never overwrite remembered value',()=>{const shared=new Map(),store=instance(shared,'https://test.example');assert.equal(store.read(),null);for(const bad of [null,{side:'top',y:.2},{side:'left',y:NaN},{side:'left',y:-.1},{side:'right',y:1.1}])assert.equal(store.write(bad),false);assert.equal(shared.size,0);shared.set('local-ui-translator:toggle-position','broken');assert.equal(store.read(),null);});
test('returned positions are detached from stored data',()=>{const shared=new Map(),store=instance(shared,'https://test.example');store.write({side:'left',y:.4});const p=store.read();p.y=.9;assert.equal(store.read().y,.4);});
test('missing and throwing GM APIs degrade without origin localStorage fallback',()=>{for(const extra of [{},{GM_getValue:()=>{throw Error('denied')},GM_setValue:()=>{throw Error('denied')}}]){const window={localStorage:{getItem(){throw Error('must not read')},setItem(){throw Error('must not write')}}};vm.runInContext(source,vm.createContext({window,...extra}));assert.equal(window.__localUiPositionStore.read(),null);assert.equal(window.__localUiPositionStore.write({side:'left',y:.2}),false);}});
test('bridge registers no remote-change or polling listeners',()=>{assert.doesNotMatch(source,/addValueChangeListener|addEventListener|BroadcastChannel|setInterval|setTimeout/);});
