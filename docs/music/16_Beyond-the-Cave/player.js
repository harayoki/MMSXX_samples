// Beyond the Cave: official PLAYER and SOUND via shared music page.
(() => {
  const E = MMSXX.sound;
  const editor = document.getElementById('beyond-the-cave-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'stereo' });
  fetch(MusicAssets.song('beyond-the-cave.mml'))
    .then(response => { if (!response.ok) throw Error('MML HTTP ' + response.status); return response.text(); })
    .then(source => {
      const player = E.player.mount(document.getElementById('beyond-the-cave-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 2,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(MusicPage.splitMML(value)),
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'PLAYER エラー: ' + error.message; console.error(error); });
})();
