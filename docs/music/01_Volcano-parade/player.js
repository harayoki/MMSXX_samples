// Volcano Paradeのページ初期化。音色・音量・アクセントはMMLで指定。
(() => {
  const E = MMSXX.sound;
  // vpBassはMMLの #wave。計算式はscripts/volcano_bass_wave.cjsへ保存。

  const editor = document.getElementById('vp-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  audio.psgTune = false;

  fetch(MusicAssets.song('volcano-parade.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('vp-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 3,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => {
          player.setMML(MusicPage.splitMML(value));
        },
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML loading error: ' + error.message; });
})();
