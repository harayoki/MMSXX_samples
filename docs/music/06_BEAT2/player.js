// BEAT2 現行プレイヤー。
(() => {
  const E = MMSXX.sound;
  const editor = document.getElementById('beat2-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });

  fetch(MusicAssets.song('beat2.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('beat2-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 3,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(MusicPage.splitMML(value)),
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();
