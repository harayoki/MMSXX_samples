// 天空のドミナント。NES 4ch / intro once, then endless main loop.
(() => {
  const E = MMSXX.sound;
  const editor = document.getElementById('sky-dominant-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });

  fetch(MusicAssets.song('sky-dominant.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('sky-dominant-player'), {
        audio, mml: MusicPage.splitMML(source), loops: Infinity,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(MusicPage.splitMML(value)),
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();

