// PEACH APPLE: the uploaded MML is the only music source.
(async () => {
  const status = document.querySelector('[data-music-status]');
  try {
    await Promise.all(['tr808','tr909','ufo'].map(name =>
      import(MusicAssets.shared('addons/' + name + '.js'))
    ));
    const response = await fetch(MusicAssets.song('peachup-euro.mml'));
    if (!response.ok) throw Error('MML HTTP ' + response.status);
    const source = await response.text();
    const E = MMSXX.sound;
    const audio = new E.ChipTuneSound(null, { spatial:'stereo' });
    const player = E.player.mount(document.getElementById('peach-player'), {
      audio, mml:MusicPage.splitMML(source), loops:2,
      copy:false, showMml:false, saveMml:false, saveWav:false, saveStems:false
    });
    MusicPage.mountMMLPreview(document.getElementById('peach-src'), source);
    status.textContent = '';
  } catch (error) {
    status.textContent = 'PLAYERエラー: ' + (error?.message || String(error));
    console.error('[PEACH APPLE]', error);
  }
})();
