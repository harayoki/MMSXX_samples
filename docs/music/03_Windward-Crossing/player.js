// Windward Crossing 共通音色と現行プレイヤー。
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

  const editor = document.getElementById('wc-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  audio.psgTune = false;
  audio.volume = 2.25;

  fetch(MusicAssets.song('windward-crossing.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('wc-player'), {
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
