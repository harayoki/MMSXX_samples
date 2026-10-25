(() => {
  const E = MMSXX.sound;
  const root = document.getElementById('pink-panther-player');
  const status = document.querySelector('[data-music-status]');

  const style = document.createElement('style');
  style.textContent = E.player.CSS;
  document.head.prepend(style);
  fetch('./pink-panther.mml.txt')
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      // Render the excerpt independently of the PLAYER initialization.
      MusicPage.mountMMLPreview(
        document.getElementById('pink-panther-src'), source
      );
      E.player.mount(root, {
        mml: MusicPage.splitMML(source), loops: 1, copy: false, showMml: false, saveMml: false,
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = '曲の読み込みエラー：' + error.message; });
})();

