// SPDX-License-Identifier: MIT
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import configurations from './src/sites/index.mjs';
import {validateConfigurations} from './tools/validate-config.mjs';
const root=new URL('./',import.meta.url);
const project=JSON.parse(await readFile(new URL('package.json',root),'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(project.version) || typeof project.displayName!=='string' || /[\r\n]/.test(project.displayName)) throw new Error('Invalid project metadata.');
const args=process.argv.slice(2);
if (args.length && !(args.length===2 && args[0]==='--site')) throw new Error('Usage: node build.mjs [--site tailscale-zh-cn]');
validateConfigurations(configurations);
const configs=args.length ? configurations.filter(site=>site.id===args[1]) : configurations;
if (!configs.length) throw new Error('No matching site configuration.');
const vendor=await readFile(new URL('vendor/dockorb/dockorb.js',root),'utf8');
const manifest=JSON.parse(await readFile(new URL('vendor/dockorb/manifest.json',root),'utf8'));
if(createHash('sha256').update(vendor).digest('hex')!==manifest.sha256) throw new Error('DockOrb vendor checksum mismatch.');
const notices=await readFile(new URL('vendor/dockorb/THIRD-PARTY-NOTICES.md',root),'utf8');
if(!vendor.includes('Permission to use, copy, modify, and/or distribute') || !notices.includes('ISC')) throw new Error('Missing third-party license notices.');
const engine=await readFile(new URL('src/engine.js',root),'utf8');
const session=await readFile(new URL('src/framework/site-session.js',root),'utf8');
const runtime=await readFile(new URL('src/framework/runtime.js',root),'utf8');
const matches=[...new Set(configs.flatMap(config=>config.matches))];
const metadata=`// ==UserScript==
// @name         ${project.displayName}${args.length?' · '+configs[0].id:''}
// @namespace    site-localization
// @version      ${project.version}
// @description  完整站点配置的离线汉化；DockOrb 汉/原入口、拖动与主题
// @license      MIT
${matches.map(match=>'// @match        '+match).join('\n')}
// @run-at       document-idle
// @sandbox      raw
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==
`;
const output=metadata+'\n(function(){\n"use strict";\nconst dockOrbScope = Object.create(globalThis);\n(function(globalThis){\n'+vendor+'\n})(dockOrbScope);\n'+engine+'\n'+session+'\n'+runtime+'\nwindow.startLocalUiFramework('+JSON.stringify(configs)+');\n})();\n';
const artifact=args.length ? 'dist/local-ui-zh.'+configs[0].id+'.user.js' : 'dist/local-ui-zh.user.js';
await mkdir(new URL('dist/',root),{recursive:true});
await writeFile(new URL(artifact,root),output);
console.log(JSON.stringify({artifact,version:project.version,dockOrb:manifest.version,bytes:Buffer.byteLength(output),sites:configs.map(config=>config.id),exactTerms:configs.reduce((n,c)=>n+Object.keys(c.exact||{}).length,0),matches}));
