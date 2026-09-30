// 草原のトリニティ専用音色と現行プレイヤー。
(() => {
  const E = MMSXX.sound;
  // エンベロープ・音色定義はMML側。

  const editor = document.getElementById('gt-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });
  fetch(MusicAssets.song('grassland-trinity.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('gt-player'), {
        audio, mml: source, loops: 2,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(value),
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();
