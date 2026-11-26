/* SPDX-License-Identifier: MIT
 * Run only on an isolated about:blank page after loading the built userscript.
 * No account data, network requests or external test dependencies.
 */
window.runSiteLocalizationDomTests = async function (configuration) {
  if (location.href !== 'about:blank') throw new Error('Use a fresh isolated about:blank page.');
  window.__localUiFramework?.stop();
  const checks=[];
  const check=(name,passed)=>{if(!passed)throw new Error('DOM regression failed: '+name);checks.push(name);};
  const wait=async predicate=>{const end=Date.now()+2000;while(!predicate()){if(Date.now()>end)throw new Error('DOM state wait timed out.');await new Promise(resolve=>setTimeout(resolve,16));}};
  const root=document.createElement('main');
  const add=(tag,text)=>{const node=document.createElement(tag);node.textContent=text;root.append(node);return node;};
  const save=add('button','Save');const identity=save.firstChild;
  const plainCount=add('span','1 machine');const uiCount=add('button','1 machine');
  const device=add('a','Owner');device.setAttribute('aria-label','Detail view for Owner');
  const user=add('button','Network');user.setAttribute('aria-label','User menu');
  const code=add('pre','Save');const plain=add('div','Free');
  const input=add('input','');input.value='Network';input.placeholder='Search by name, owner, tag, version...';
  const inputIdentity=input;let clicks=0;save.addEventListener('click',()=>clicks++);
  document.body.append(root);
  const originalPhrase=' \nRequire new users to be approved by admins before\t they can access the network.\u00a0';
  const phrase=add('p',originalPhrase);const phraseIdentity=phrase.firstChild;
  const badge=add('div','4 machines');badge.className='rounded-full font-medium';
  const freeBadge=add('div','Free');freeBadge.className='rounded-full font-medium';
  const plainStatus=add('span','Connected');
  const table=document.createElement('table');root.append(table);const row=table.insertRow();const cells=Array.from({length:4},()=>row.insertCell());const status=document.createElement('span');status.textContent='Connected';cells[3].append(status);
  let conflictRejected=false;try{window.installTranslator({...configuration,exact:{'Save changes':'保存','Save  changes':'冲突'}});}catch(e){conflictRejected=e instanceof TypeError;}
  check('normalized phrase conflicts fail closed',conflictRejected);
  const role=document.createElement('div');role.textContent='Owner';cells[1].append(role);
   const plainOwner=add('span','Owner');const unit=add('div','days');unit.className='rounded-r-md border-l-0';const plainUnit=add('span','days');
   const events=[];
  const api=window.installTranslator(configuration);
  const unsubscribe=api.subscribe(state=>events.push(state));
  api.subscribe(()=>{throw new Error('Listener failure must be isolated');});
  check('engine creates no UI',!document.querySelector('[data-site-localization-ui]'));
  check('engine has no legacy singleton',!window.__localUiTranslator);
  try {
    await wait(()=>save.textContent==='保存'&&uiCount.textContent==='1 台设备');
    await wait(()=>phrase.textContent.includes('新用户必须')&&status.textContent==='已连接'&&badge.textContent==='4 台设备');
    check('layout whitespace normalizes for phrase lookup',phrase.textContent===' \n新用户必须经过管理员审批后才能访问网络。\u00a0');
    check('phrase normalization retains text node identity',phrase.firstChild===phraseIdentity);
    check('semantic badge scope translates device count',badge.textContent==='4 台设备');
    check('semantic badge scope translates plan',freeBadge.textContent==='免费版');
    check('explicit table status rule translates only its target',status.textContent==='已连接'&&plainStatus.textContent==='Connected');
    await wait(()=>role.textContent==='所有者'&&unit.textContent==='天');
     check('role column translates without changing plain or device Owner',role.textContent==='所有者'&&plainOwner.textContent==='Owner'&&device.textContent==='Owner');
     check('unit control translates without changing unscoped days',unit.textContent==='天'&&plainUnit.textContent==='days');
     check('UI exact translation',save.textContent==='保存');
    check('dynamic count inside UI translates',uiCount.textContent==='1 台设备');
    check('dynamic count outside UI stays untouched',plainCount.textContent==='1 machine');
    check('device name is protected',device.textContent==='Owner');
    check('user menu is protected',user.textContent==='Network');
    check('policy code is protected',code.textContent==='Save');
    check('unscoped short text stays untouched',plain.textContent==='Free');
    check('input value is unchanged',input.value==='Network');
    check('placeholder translates',input.placeholder==='按名称、所有者、标签、版本搜索…');
    save.click();check('text/input identity and listener retained',save.firstChild===identity&&input===inputIdentity&&clicks===1);
    const dynamic=add('button','Cancel');await wait(()=>dynamic.textContent==='取消');check('added child translates',true);
    identity.nodeValue='Cancel';await wait(()=>save.textContent==='取消');check('external characterData translates',true);
    api.toggle(false);check('normalized phrase restores original whitespace byte-for-byte',phrase.textContent===originalPhrase);check('updated original restores',save.textContent==='Cancel');check('placeholder restores',input.placeholder==='Search by name, owner, tag, version...');
    api.toggle(true);await wait(()=>save.textContent==='取消');identity.nodeValue='CUSTOM_DATA';await wait(()=>api.stats.externalChanges>=2);
    api.toggle(false);check('external custom data is not overwritten',save.textContent==='CUSTOM_DATA');api.toggle(true);await wait(()=>dynamic.textContent==='取消');
    dynamic.remove();await wait(()=>dynamic.textContent==='Cancel');check('detached node restores',true);
    root.append(dynamic);await wait(()=>dynamic.textContent==='取消');check('reinserted node translates',true);
    api.stop();check('stop restores dynamic original',dynamic.textContent==='Cancel');check('stop notifies and clears subscriptions',events.at(-1)?.stopped===true); const eventCount=events.length;api.toggle();check('stopped engine emits no further changes',events.length===eventCount);unsubscribe();
    check('stop leaves custom data and input unchanged',save.textContent==='CUSTOM_DATA'&&input.value==='Network');
    return {passed:checks.length,total:checks.length,checks};
  } finally {api.stop();root.remove();}
};
