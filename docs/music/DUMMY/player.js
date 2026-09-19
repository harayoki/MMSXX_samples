// テープロードの憂鬱 専用プレイヤー。
(() => {
  const E = MMSXX.sound;
  const editor = document.getElementById('tape-load-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  audio.psgTune = false;
  audio.volume = 2.25;

  fetch(MusicAssets.song('tape-load-melancholy.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('tape-load-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 3,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(MusicPage.splitMML(value)),
      });
      status.textContent = '';
    })
    .catch(error => {
      status.textContent = 'MML load failed: ' + error.message +
        ' — Please use an HTTP server.';
    });
})();
