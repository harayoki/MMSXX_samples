// 闇の回廊。共通プレイヤーと6パートMMLを使用する。
(() => {
  const E = MMSXX.sound;
  E.registerEnvelope('gradual', {
    a: 0.003, d: 0.65, s: 0.65, r: 0.06,
    note: 'Quick attack, then a gradual fall with a smooth ending.',
    noteJa: '素早く立ち上がり、ゆっくり弱まり、音の終わりもなめらかに消える。',
  });
  const editor = document.getElementById('dark-corridor-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });

  fetch(MusicAssets.song('dark-corridor.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('dark-corridor-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 1,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(MusicPage.splitMML(value)),
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();
