// CodeMirror試験ページ。MUSIC TOPからはリンクしない。
(() => {
  const E = MMSXX.sound;
  const host = document.getElementById('cm-editor');
  const mirror = document.getElementById('cm-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  audio.psgTune = false;


  fetch(MusicAssets.shared('03_Windward-Crossing/windward-crossing.mml'))
    .then(async response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const source = await response.text();
      const player = E.player.mount(document.getElementById('cm-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 3,
      });
      MusicPage.mountMMLEditor(host, source, {
        mirror,
        onCommit: value => player.setMML(MusicPage.splitMML(value)),
      });
      status.textContent = '';
    })
    .catch(error => {
      status.textContent = 'CodeMirror prototype failed: ' + error.message;
    });
})();

