// BEAT 現行プレイヤー。
(() => {
  const E = MMSXX.sound;
  const editor = document.getElementById('beat-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });

  fetch(MusicAssets.song('beat.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      editor.value = source;
      editor.disabled = false;
      const player = E.player.mount(document.getElementById('beat-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 3,
      });
      editor.addEventListener('change', () => {
        player.setMML(MusicPage.splitMML(editor.value));
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();
