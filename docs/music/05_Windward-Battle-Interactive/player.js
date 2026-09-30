// 風渡りの境界 戦闘曲(インタラクティブ)専用プレイヤー。
(() => {
  const E = MMSXX.sound;
  // MMLで未対応の設定だけをJSに残す。
  E.registerFM('wcKick', {
    ratio: 1, depth: 0, attack: .002, decay: .085, sustain: 0,
    drop: 1.8, dropTime: .075,
  }, {
    role: 'perc',
    note: 'Windward Crossing kick.',
    noteJa: 'Windward Crossingのキック。',
  });

  const editor = document.getElementById('wbi-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  audio.psgTune = false;
  audio.volume = 2.25;

  fetch(MusicAssets.song('windward-battle-interactive.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('wbi-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 3, forceOpen: true,
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
