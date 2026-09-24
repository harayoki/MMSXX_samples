// 草原のトリニティ専用音色と現行プレイヤー。
(() => {
  const E = MMSXX.sound;
  const tones = {
    fieldLeadAttack: { wave: 'pulse:50', env: 'flat', pitch: [120, 0] },
    fieldTriangle: { wave: 'wtNesTriangle', env: 'flat' },
    fieldHit2x14500: { wave: 'pulse:50', env: 'flat', pitch: [-21.740748211670333] },
    fieldHit2x8200: { wave: 'pulse:50', env: 'flat', pitch: [-8.569250687891364] },
    fieldHit2x5200: { wave: 'pulse:50', env: 'flat', pitch: [2.896005539719072] },
    fieldHit0x29000: { wave: 'pulse:12', env: 'flat', pitch: [-21.740748211670333] },
    fieldHit0x18000: { wave: 'pulse:12', env: 'flat', pitch: [-47.407940633981895] },
    fieldHit0x11800: { wave: 'pulse:12', env: 'flat', pitch: [21.540003004618065] },
  };
  const envelopes = {
    fieldBody: { a: .004, d: '40%', s: .35, r: .12 },
    fieldHit: { a: .002, d: '25%', s: 0, r: .05 },
    // 20msより短い打音は、従来の減衰時間を維持する。
    fieldShortHit: { a: .002, d: .004464285714285714, s: 0, r: .05 },
  };
  for (const [name, spec] of Object.entries(envelopes)) {
    E.registerEnvelope(name, {
      ...spec,
      note: 'Grassland Trinity note-relative envelope.',
      noteJa: '草原のトリニティの音長に合わせたエンベロープ。',
    });
  }
  for (const [name, spec] of Object.entries(tones)) {
    E.registerTone(name, {
      ...spec,
      note: 'Grassland Trinity custom tone.',
      noteJa: '草原のトリニティ専用音色。',
    });
  }

  const editor = document.getElementById('gt-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });
  fetch(MusicAssets.song('grassland-trinity.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('gt-player'), {
        audio, mml: source, loops: 2,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => player.setMML(value),
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();
