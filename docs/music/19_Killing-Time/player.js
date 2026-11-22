// Killing Time: original MMLs, official PLAYER; optional JS master reverb on MSX tab.
(async () => {
  const E = MMSXX.sound;
  const root = document.getElementById('killing-player');
  const status = document.querySelector('[data-music-status]');
  const preview = document.getElementById('killing-src');
  const tabs = [...document.querySelectorAll('[data-variant]')];
  const reverb = document.createElement('button');
  reverb.type = 'button';
  reverb.className = 'sw';
  reverb.dataset.killingReverb = '';
  let reverbOn = false;
  const syncReverbButton = () => {
    reverb.hidden = current !== 'msx';
    reverb.textContent = 'Reverb ' + (reverbOn ? 'ON' : 'OFF');
    reverb.setAttribute('aria-pressed', String(reverbOn));
    reverb.title = reverbOn ? 'リバーブをOFF' : 'リバーブをON';
  };
  const REVERB = [{ name:'killing-msx-reverb', kind:'reverb', decay:1.9, width:1.0, mix:0.32 }];
  let audio = null;
  let fxSeq = Promise.resolve();
  const updateFx = () => {
    syncReverbButton();
    if (!audio) return Promise.resolve();
    const effects = current === 'msx' && reverbOn ? REVERB : [];
    // Serialize rapid tab/checkbox changes so the last selection wins.
    fxSeq = fxSeq.catch(() => {}).then(() => audio.setMasterEffects(effects));
    fxSeq.catch(report);
    return fxSeq;
  };
  const variants = { normal:'killing-time.mml', msx:'killing-time-msx.mml' };
  const sources = {};
  const requestedTab = new URLSearchParams(location.search).get('tab');
  const tabKeys = [...tabs].map(button => button.dataset.variant);
  const requestedKey = /^\d+$/.test(requestedTab ?? '') ? tabKeys[Number(requestedTab)] : requestedTab;
  const initialTab = Object.hasOwn(variants, requestedKey) ? requestedKey : 'normal';
  let current = 'normal', player = null, editor = null;
  const report = error => { status.textContent = 'PLAYERエラー: ' + (error?.message || String(error)); console.error('[Killing Time]',error); };
  window.addEventListener('error', event => report(event.error || event.message));
  window.addEventListener('unhandledrejection', event => report(event.reason));
  function select(key) {
    if (!variants[key] || current === key) return;
    current = key;
    const url = new URL(location.href);
    url.searchParams.set('tab', key);
    history.replaceState(history.state, '', url);
    for (const button of tabs) {
      const selected = button.dataset.variant === key;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    root.setAttribute('aria-labelledby','tab-'+key);
    updateFx();
    if (!player) return;
    try {
      player.stop();
      player.setMML(MusicPage.splitMML(sources[key]));
      editor.setValue(sources[key]);
      status.textContent = '';
    } catch (error) { report(error); }
  }
  reverb.addEventListener('click', () => { reverbOn = !reverbOn; updateFx(); });
  for (const button of tabs) {
    button.addEventListener('click',()=>select(button.dataset.variant));
    button.addEventListener('keydown',event=>{
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const i=tabs.indexOf(button);
      const n=event.key==='Home'?0:event.key==='End'?tabs.length-1:
        (i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      tabs[n].focus(); select(tabs[n].dataset.variant);
    });
  }
  try {
    // These are the five addons explicitly referenced by the two supplied MMLs.
    await Promise.all(['tr909','tr808','ufo','manbowDrumkit','sccSrmnd'].map(
      name=>import(MusicAssets.shared('addons/'+name+'.js'))
    ));
    await Promise.all(Object.entries(variants).map(async ([key,file])=>{
      const response=await fetch(MusicAssets.song(file));
      if (!response.ok) throw Error(file+' HTTP '+response.status);
      sources[key]=await response.text();
    }));
    audio = new E.ChipTuneSound(null,{spatial:'stereo'});
    await updateFx();
    player=E.player.mount(root,{
      audio,mml:MusicPage.splitMML(sources[current]),loops:2,
      copy:false,showMml:false,saveMml:false,saveWav:false,saveStems:false
    });
    const level = root.querySelector('[data-p="level"]');
    if (!level) throw Error('PLAYERのLevelボタンが見つかりません');
    level.after(reverb);
    syncReverbButton();
    editor = MusicPage.mountMMLTextarea(preview,sources[current],{
      onCommit: value => {
        sources[current] = value;
        try { player.setMML(MusicPage.splitMML(value)); status.textContent=''; }
        catch(error) { report(error); }
      }
    });
    if (initialTab !== current) select(initialTab);
    status.textContent='';
  } catch(error) { report(error); }
})();