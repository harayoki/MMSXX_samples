// STARFABLE ボス曲。フェードはMMLで指定する。
(() => {
  const E = MMSXX.sound;
  E.registerEnvelope('sfFlat', { a: '0.5%', d: '0%', s: 1, r: '1%' });
  E.registerEnvelope('sfSoft', { a: '8%', d: '10%', s: 0.8, r: '15%' });
  E.registerEnvelope('sfPerc', { a: '0.2%', d: '25%', s: 0, r: '5%' });

  const editor = document.getElementById('starfable-boss-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });
  audio.volume = 0.5;
  audio.dynamic_effects = {};
  fetch(MusicAssets.song('starfable-boss.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('starfable-boss-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 1, channels: true, volume: true,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => {
          player.setMML(MusicPage.splitMML(value));
        },
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();

