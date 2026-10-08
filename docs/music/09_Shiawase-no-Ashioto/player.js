// シアワセノアシオト。共通プレイヤーと6パートMMLを使用する。
(() => {
  const E = MMSXX.sound;
  const editor = document.getElementById('shiawase-no-ashioto-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });

  fetch(MusicAssets.song('shiawase-no-ashioto.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('shiawase-no-ashioto-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 1,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(MusicPage.splitMML(value)),
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();
