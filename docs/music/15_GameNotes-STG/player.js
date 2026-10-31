// Gradius Stage1 Arrange v2.73: all per-round effects are in the MML.
// Official SOUND 0.69.0 + Pico PLAYER 1.4.0, no song-timed JS FX switching.
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
    await import('./addons.js');
    const response = await fetch(MusicAssets.song('gamenotes.mml.txt'));
    if (!response.ok) throw Error('MML HTTP ' + response.status);
    const source = await response.text();
    MusicPage.mountMMLPreview(document.getElementById('gamenotes-src'), source);
    const audio = new E.ChipTuneSound(null, { spatial: 'stereo' });
    E.player.mount(root, {
      audio, mml: MusicPage.splitMML(source), loops: 1,
      copy: false, showMml: false, saveMml: false,
    });
    status.textContent = '';
  } catch (error) { report(error); }
})();
