// SPDX-License-Identifier: MIT
import {readFile,writeFile,mkdir} from 'node:fs/promises';
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
const packed=JSON.stringify(configs);
const engine=await readFile(new URL('src/engine.js',root),'utf8');
const runtime=await readFile(new URL('src/framework/runtime.js',root),'utf8');
const positionStore=await readFile(new URL('src/framework/position-store.js',root),'utf8');
const matches=[...new Set(configs.flatMap(config=>config.matches))];
const metadata=`// ==UserScript==
// @name         ${project.displayName}${args.length?' · '+configs[0].id:''}
// @namespace    local-ui-translator
// @version      ${project.version}
// @description  一个脚本承载完整站点汉化配置；自动选站、增量DOM翻译、中英文切换
// @license      MIT
${matches.map(match=>'// @match        '+match).join('\n')}
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @sandbox      raw
// ==/UserScript==
`;
const output=metadata+'\n(function(){\n"use strict";\n'+positionStore+'\n'+engine+'\n'+runtime+'\nwindow.startLocalUiFramework('+packed+');\n})();\n';
const artifact=args.length ? 'dist/local-ui-zh.'+configs[0].id+'.user.js' : 'dist/local-ui-zh.user.js';
await mkdir(new URL('dist/',root),{recursive:true});
await writeFile(new URL(artifact,root),output);
console.log(JSON.stringify({artifact,version:project.version,bytes:Buffer.byteLength(output),sites:configs.map(config=>config.id),exactTerms:configs.reduce((n,c)=>n+Object.keys(c.exact||{}).length,0),matches}));
