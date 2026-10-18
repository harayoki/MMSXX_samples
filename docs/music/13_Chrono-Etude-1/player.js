// Chrono etude #1: official MMSXX player through the shared music page.
(() => {
  const E = MMSXX.sound;
  const editor = document.getElementById('chrono-etude-src');
  const status = document.querySelector('[data-music-status]');
  const report = error => {
    status.textContent = 'PLAYER エラー：' + (error?.message || String(error));
    console.error(error);
  };
  window.addEventListener('error', event => report(event.error || event.message));
  window.addEventListener('unhandledrejection', event => report(event.reason));

  const audio = new E.ChipTuneSound(null, { spatial: 'stereo' });
  fetch(MusicAssets.song('chrono-etude-1.mml'))
    .then(response => {
      if (!response.ok) throw new Error('MML HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(
        document.getElementById('chrono-etude-player'), {
          audio,
          mml: MusicPage.splitMML(source),
          loops: 2,
        }
      );
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(MusicPage.splitMML(value)),
      });
      status.textContent = '';
    })
    .catch(report);
})();
