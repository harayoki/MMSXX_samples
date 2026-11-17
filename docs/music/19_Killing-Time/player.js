// Killing Time: original MMLs, official MMSXX PLAYER, no music-side JS effects.
(async () => {
  const E = MMSXX.sound;
  const root = document.getElementById('killing-player');
  const status = document.querySelector('[data-music-status]');
  const preview = document.getElementById('killing-src');
  const tabs = [...document.querySelectorAll('[data-variant]')];
  const variants = { normal:'killing-time.mml', msx:'killing-time-msx.mml' };
  const sources = {};
  let current = 'normal', player = null, editor = null;
  const report = error => { status.textContent = 'PLAYERエラー: ' + (error?.message || String(error)); console.error('[Killing Time]',error); };
  window.addEventListener('error', event => report(event.error || event.message));
  window.addEventListener('unhandledrejection', event => report(event.reason));
  function select(key) {
    if (!variants[key] || current === key) return;
    current = key;
    for (const button of tabs) {
      const selected = button.dataset.variant === key;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    root.setAttribute('aria-labelledby','tab-'+key);
    if (!player) return;
    try {
      player.stop();
      player.setMML(MusicPage.splitMML(sources[key]));
      editor.setValue(sources[key]);
      status.textContent = '';
    } catch (error) { report(error); }
  }
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
      name=>import(MusicAssets.song('addons/'+name+'.js'))
    ));
    await Promise.all(Object.entries(variants).map(async ([key,file])=>{
      const response=await fetch(MusicAssets.song(file));
      if (!response.ok) throw Error(file+' HTTP '+response.status);
      sources[key]=await response.text();
    }));
    const audio=new E.ChipTuneSound(null,{spatial:'stereo'});
    player=E.player.mount(root,{
      audio,mml:MusicPage.splitMML(sources[current]),loops:2,
      copy:false,showMml:false,saveMml:false,saveWav:false,saveStems:false
    });
    editor = MusicPage.mountMMLTextarea(preview,sources[current],{
      onCommit: value => {
        sources[current] = value;
        try { player.setMML(MusicPage.splitMML(value)); status.textContent=''; }
        catch(error) { report(error); }
      }
    });
    status.textContent='';
  } catch(error) { report(error); }
})();