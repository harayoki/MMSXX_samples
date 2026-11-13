// Gradius Stage1 Arrange v2.73: all per-round effects are in the MML.
// Official SOUND 0.87.1 + Pico PLAYER 1.5.1, no song-timed JS FX switching.
(async () => {
  const E = MMSXX.sound;
  const root = document.getElementById('gamenotes-player');
  const status = document.querySelector('[data-music-status]');
  const report = error => {
    status.textContent = 'PLAYER エラー：' + (error?.stack || error?.message || String(error));
    console.error('[GameNotes]', error);
  };
  window.addEventListener('error', e => report(e.error || e.message));
  window.addEventListener('unhandledrejection', e => report(e.reason));
  try {
    // Import the addon against the SAME official engine instance as the page loader.
    // Versioned URL avoids browser cache retaining its previous 0.69.0 imports.
    await import(MusicAssets.song('addons.js') + '?v=20261113-tr808-0871');
    const { findWave } = await import(MusicAssets.shared('runtime/sound-0.87.1/sound/mml.js'));
    const { listAddons } = await import(MusicAssets.shared('runtime/sound-0.87.1/sound/addon.js'));
    const required = ['tr808::snareDrum', 'tr808::bassDrum', 'tr808::closedHihat',
      'gamenotes::grdsSt1::edgeLead'];
    const missing = required.filter(name => findWave(name) < 0);
    if (missing.length) {
      throw new Error('必要な音色が登録されていません: ' + missing.join(', ')
        + ' / 登録済みアドオン: ' + listAddons().map(a => a.id).join(', '));
    }
    const response = await fetch(MusicAssets.song('gamenotes.mml.txt'));
    if (!response.ok) throw Error('MML HTTP ' + response.status);
    const source = await response.text();
    MusicPage.mountMMLPreview(document.getElementById('gamenotes-src'), source);
    const audio = new E.ChipTuneSound(null, { spatial: 'stereo' });
    E.player.mount(root, {
      audio, mml: MusicPage.splitMML(source), loops: 1,
      copy: false, showMml: false, saveMml: false, saveWav: false, saveStems: false,
    });
    status.textContent = '';
  } catch (error) { report(error); }
})();
