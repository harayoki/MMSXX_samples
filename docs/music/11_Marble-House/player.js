// MARBLE HOUSE（OPLL&SCC）。MMLの各チャンネルを公式PLAYERで再生する。
(() => {
  const E = MMSXX.sound;
  const editor = document.getElementById('marble-house-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });
  // PLAYERの再生音量だけを1.2倍にする。MMLの音量と音色には触れない。
  audio.volume = 1.2;

  fetch(MusicAssets.song('marble-house.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('marble-house-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 1,
      });
      // マスター音量スライダーにも120%を正しく表示する（公式PLAYERのDOMのみ設定）。
      const volumeControl = document.querySelector('#marble-house-player [data-p="vol"]');
      if (volumeControl) {
        volumeControl.max = '200';
        volumeControl.value = '120';
      }
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(MusicPage.splitMML(value)),
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();
