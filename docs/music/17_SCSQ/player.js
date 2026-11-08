// SCSQ (スクシーク): SONG MML is the source of truth.
// Official SOUND 0.85.6 / Pico PLAYER 1.5.0; the page does not alter instruments or timed FX.
(async () => {
  const E = MMSXX.sound;
  const status = document.querySelector('[data-music-status]');
  const root = document.getElementById('scsq-player');
  const editor = document.getElementById('scsq-src');
  const effects = document.getElementById('scsq-fx');

  try {
    // Required by the original MML. Load before compiling.
    await import(MusicAssets.song('opllpsg808.js'));
    // .js is deliberately used for static servers that return an incorrect MIME type for .mjs.
    const response = await fetch(MusicAssets.song('scsq.mml'));
    if (!response.ok) throw new Error('MML HTTP ' + response.status);
    const source = await response.text();

    const audio = new E.ChipTuneSound(null, { spatial: 'stereo' });
    const player = E.player.mount(root, {
      audio, mml: MusicPage.splitMML(source), loops: 2,
    });
    MusicPage.mountMMLTextarea(editor, source, {
      onCommit: value => player.setMML(MusicPage.splitMML(value)),
    });

    // SOUND 0.85.6 can bypass channel, bus and master effects without rebuilding MML.
    effects.disabled = false;
    effects.addEventListener('click', () => {
      const off = audio.bypassEffects();
      effects.textContent = off ? 'Effects: Off' : 'Effects: On';
      effects.setAttribute('aria-pressed', String(!off));
    });
    status.textContent = '';
  } catch (error) {
    status.textContent = 'PLAYER エラー: ' + (error?.message || String(error));
    console.error('[SCSQ]', error);
  }
})();
