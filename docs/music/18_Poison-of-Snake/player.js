// Poison of Snake: preserve both original MMLs and use the official PLAYER.
(async () => {
  const E = MMSXX.sound;
  const root = document.getElementById('poison-player');
  const status = document.querySelector('[data-music-status]');
  const preview = document.getElementById('poison-src');
  const tabs = [...document.querySelectorAll('[data-variant]')];
  const variants = {
    fixch: {file:'poison-of-snake-msx-fixch.mml'},
    scc: {file:'poison-of-snake-msx-scc.mml'}
  };
  const sources = {};
  let current = 'fixch';
  let player = null;
  const report = error => {
    status.textContent = 'PLAYERエラー: ' + (error?.message || String(error));
    console.error('[Poison of Snake]', error);
  };
  window.addEventListener('error', e => report(e.error || e.message));
  window.addEventListener('unhandledrejection', e => report(e.reason));

  // Bind tabs before any asynchronous loading. Visual selection is independent
  // from an MML compile error or PLAYER initialization delay.
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
    // Addon modules register their voices as side effects before MML compile.
    await Promise.all(['sccSrmnd','manbowDrumkit','grdsSccDrumkit'].map(name =>
      import(MusicAssets.song('addons/' + name + '.js'))
    ));
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
