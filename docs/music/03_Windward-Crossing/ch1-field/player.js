// Windward Crossing CH1フィールド専用プレイヤー。
(() => {
  const E = MMSXX.sound;
  E.registerEnvelope('wcLeadEnv', {
    a: .004, d: .09, s: .68, r: .012,
    note: 'Windward Crossing lead envelope.',
    noteJa: 'Windward Crossingのリード用エンベロープ。',
  });
  E.registerTone('wcFieldLead', {
    wave: 'wtNesTriangle', env: 'wcLeadEnv',
    note: 'Field lead.', noteJa: 'フィールド用リード。',
  });

  const editor = document.getElementById('wc-ch1-field-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  audio.psgTune = false;
  audio.volume = 2.25;

  fetch(MusicAssets.song('ch1-field.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('wc-ch1-field-player'), {
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
