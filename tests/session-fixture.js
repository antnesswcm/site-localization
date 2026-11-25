/* SPDX-License-Identifier: MIT
 * Isolated DOM integration. GM capabilities supplied by the browser runner.
 */
window.runSiteSessionTests = async function (config) {
  if(location.href!=='about:blank')throw Error('Isolated about:blank only');
  const checks=[],check=(name,value)=>{if(!value)throw Error(name);checks.push(name);};
  const wait=async fn=>{const end=Date.now()+3000;while(!fn()){if(Date.now()>end)throw Error('Timeout');await new Promise(r=>setTimeout(r,16));}};
  const text=document.createElement('button');text.textContent='Save';document.body.append(text);
  let session=window.createSiteSession(config);
  try {
    await wait(()=>text.textContent==='保存');
    const root=document.querySelector('[data-site-localization-ui]');
    const host=root.firstElementChild;
    const main=host.shadowRoot.querySelector('.orb');
    check('one DockOrb root',document.querySelectorAll('[data-site-localization-ui]').length===1);
    check('component namespace stays private',!Object.hasOwn(window,'GenericOrb'));
    check('initial label means restore original',main.textContent==='原');
    check('translation UI excluded',!session.translator.stats.stopped);
    main.click();
    check('click restores original',text.textContent==='Save'&&!session.translator.enabled);
    check('logo switches to next action',main.textContent==='汉');
    check('click does not expand',!session.orb.getState().expanded);
    check('new GM enabled state saved',GM_getValue('site-localization:enabled:'+config.id,true)===false);
    session.orb.hide();check('hide keeps language unchanged',!session.translator.enabled);
    window.__testMenus.values().next().value();
    check('menu restores hidden entrance',!session.orb.getState().hidden);
    main.click();await wait(()=>text.textContent==='保存');
    check('second click localizes',main.textContent==='原');
    session.stop();check('stop restores content',text.textContent==='Save');
    check('stop removes UI root',!document.querySelector('[data-site-localization-ui]'));
    check('stop unregisters menu',window.__testMenus.size===0);
    check('stop destroys component',session.orb.getState().destroyed);
    session.stop();check('repeated stop safe',true);
    GM_setValue('site-localization:enabled:'+config.id,false);
    session=window.createSiteSession(config);
    check('new session reads GM boolean',session.translator.enabled===false);
    GM_setValue('site-localization:enabled:'+config.id,true);
    check('existing session is not live synced',session.translator.enabled===false);
    session.stop();
    GM_setValue('site-localization:orb-position',{side:'left',y:0.25});
    session=window.createSiteSession({...config,theme:{root:'html',darkClass:'test-dark',lightClass:'test-light'}});
    check('shared position read on session start',session.orb.getState().side==='left'&&session.orb.getState().y===0.25);
    GM_setValue('site-localization:orb-position',{side:'right',y:0.8});
    check('position does not live sync',session.orb.getState().side==='left');
    document.documentElement.classList.add('test-light');await wait(()=>session.orb.getState().theme==='light');
    check('explicit page light theme',true);
    document.documentElement.classList.replace('test-light','test-dark');await wait(()=>session.orb.getState().theme==='dark');
    check('explicit page dark theme',true);
    document.documentElement.classList.remove('test-dark');
    const previousBody=document.body,nextBody=document.createElement('body');previousBody.replaceWith(nextBody);
    await wait(()=>nextBody.querySelector('[data-site-localization-ui]'));
    check('body replacement remounts same root',nextBody.querySelectorAll('[data-site-localization-ui]').length===1);
    nextBody.replaceWith(previousBody);await wait(()=>previousBody.querySelector('[data-site-localization-ui]'));
    check('body restoration does not duplicate UI',previousBody.querySelectorAll('[data-site-localization-ui]').length===1);
    session.stop();check('replacement session also unregisters menu',window.__testMenus.size===0);
    return {passed:checks.length,total:checks.length,checks};
  } finally {session.stop();text.remove();}
};
