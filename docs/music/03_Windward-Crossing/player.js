// Windward Crossing 共通音色と現行プレイヤー。
(() => {
  const E = MMSXX.sound;
  E.registerEnvelope('wcLeadEnv', {
    a: .004, d: .09, s: .68, r: .012,
    note: 'Windward Crossing lead envelope.',
    noteJa: 'Windward Crossingのリード用エンベロープ。',
  });
  E.registerEnvelope('wcPluckEnv', {
    a: .003, d: .08, s: .18, r: .008,
    note: 'Windward Crossing pluck envelope.',
    noteJa: 'Windward Crossingの短い伴奏用エンベロープ。',
  });
  E.registerEnvelope('wcDrumEnv', {
    a: .001, d: .045, s: 0, r: .004,
    note: 'Windward Crossing drum envelope.',
    noteJa: 'Windward Crossingの打楽器用エンベロープ。',
  });
  E.registerEnvelope('wcBattleBassEnv', {
    a: .003, d: .055, s: .65, r: .01,
    note: 'Windward Crossing battle bass envelope.',
    noteJa: 'Windward Crossingの戦闘ベース用エンベロープ。',
  });
  E.registerTone('wcFieldLead', {
    wave: 'wtNesTriangle', env: 'wcLeadEnv',
    note: 'Field lead.', noteJa: 'フィールド用リード。',
  });
  E.registerTone('wcBattleLead', {
    wave: 'pulse:25', env: 'wcLeadEnv',
    note: 'Battle lead.', noteJa: '戦闘用リード。',
  });
  E.registerTone('wcBattleBass', {
    wave: 'pulse:50', env: 'wcBattleBassEnv',
    note: 'Battle bass.', noteJa: '戦闘用ベース。',
  });
  E.registerTone('wcBass', {
    wave: 'wtNesTriangle', env: 'wcPluckEnv',
    note: 'Field bass.', noteJa: 'フィールド用ベース。',
  });
  E.registerTone('wcArp', {
    wave: 'pulse:50', env: 'wcPluckEnv',
    note: 'Short accompaniment.', noteJa: '短い伴奏音。',
  });
  E.registerFM('wcKick', {
    ratio: 1, depth: 0, attack: .002, decay: .085, sustain: 0,
    drop: 1.8, dropTime: .075,
  }, {
    role: 'perc',
    note: 'Windward Crossing kick.',
    noteJa: 'Windward Crossingのキック。',
  });

  const editor = document.getElementById('wc-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  audio.psgTune = false;
  audio.volume = 2.25;

  fetch(MusicAssets.song('windward-crossing.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      editor.value = source;
      editor.disabled = false;
      const player = E.player.mount(document.getElementById('wc-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 3,
      });
      editor.addEventListener('change', () =>
        player.setMML(MusicPage.splitMML(editor.value)));
      status.textContent = '';
    })
    .catch(error => {
      status.textContent = 'MML load failed: ' + error.message +
        ' — Please use an HTTP server.';
    });
})();
