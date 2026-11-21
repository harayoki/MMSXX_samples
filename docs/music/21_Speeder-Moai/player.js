// Speeder Moai: two supplied MMLs, official shared PLAYER only.
(async () => {
  const E = MMSXX.sound;
  const root = document.getElementById('speeder-player');
  const status = document.querySelector('[data-music-status]');
  const preview = document.getElementById('speeder-src');
  const tabs = [...document.querySelectorAll('[data-variant]')];
  const variants = {
    msx: {file: 'speeder-moai-msx.mml'},
    analog: {file: 'speeder-moai-analog.mml'}
  };
  const sources = {};
  let current = 'analog';
  let player = null;
  const report = error => {
    status.textContent = 'PLAYERエラー: ' + (error?.message || String(error));
    console.error('[Speeder Moai]', error);
  };
  window.addEventListener('error', e => report(e.error || e.message));
  window.addEventListener('unhandledrejection', e => report(e.reason));
  function select(key) {
    if (!variants[key] || key === current) return;
    current = key;
    for (const button of tabs) {
      const selected = button.dataset.variant === key;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    root.setAttribute('aria-labelledby', 'tab-' + key);
    if (!player) return;
    try {
      player.stop();
      player.setMML(MusicPage.splitMML(sources[key]));
      MusicPage.mountMMLPreview(preview, sources[key], {lines:'fill'});
      status.textContent = '';
    } catch (error) { report(error); }
  }
  for (const button of tabs) {
    button.addEventListener('click', () => select(button.dataset.variant));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const index = tabs.indexOf(button);
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[target].focus();
      select(tabs[target].dataset.variant);
    });
  }
  try {
    await Promise.all(['sccSrmnd-legacy','manbowDrumkit','tr909'].map(name =>
      import(MusicAssets.shared('addons/' + name + '.js'))));
    await Promise.all(Object.entries(variants).map(async ([key, entry]) => {
      const response = await fetch(MusicAssets.song(entry.file));
      if (!response.ok) throw Error(entry.file + ' HTTP ' + response.status);
      sources[key] = await response.text();
    }));
    const audio = new E.ChipTuneSound(null, {spatial:'stereo'});
    player = E.player.mount(root, {
      audio, mml: MusicPage.splitMML(sources[current]), loops:2,
      copy:false, showMml:false, saveMml:false, saveWav:false, saveStems:false
    });
    MusicPage.mountMMLPreview(preview, sources[current], {lines:'fill'});
    status.textContent = '';
  } catch (error) { report(error); }
})();