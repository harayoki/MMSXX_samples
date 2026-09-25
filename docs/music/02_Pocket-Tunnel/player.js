// Pocket Tunnel 3アレンジ共通プレイヤー。
(() => {
  const E = MMSXX.sound;
  E.registerEnvelope('ptHeld', {
    a: .003, d: 0, s: 1, r: .004,
    note: 'Pocket Tunnel held envelope.',
    noteJa: 'Pocket Tunnelの保持音用エンベロープ。',
  });
  E.registerEnvelope('ptDecay', {
    a: .003, d: '70%', s: .32, r: '30%',
    note: 'Pocket Tunnel short decay.',
    noteJa: 'Pocket Tunnelの短い減衰音。',
  });
  E.registerEnvelope('ptPercussive', { a: .002, d: '25%', s: 0, r: .05 });
  E.registerFM('ptKick', {
    ratio: 1, depth: 0, attack: .003, decay: .12, sustain: 0,
    drop: 125 / 45 - 1, dropTime: .12,
  }, {
    role: 'perc',
    note: 'Pocket Tunnel kick.',
    noteJa: 'Pocket Tunnelのキック。',
  });

  const tones = {
    ptLead: { wave: 'pulse:50' },
    ptJazzLead: { wave: 'pulse:50' },
    ptArp: { wave: 'saw' },
    ptBass: { wave: 'pulse:50' },
    ptJazzBass: { wave: 'triangle' },
    ptChord: { wave: 'pulse:50' },
    ptJazzChord: { wave: 'triangle' },
    ptJazzAnswer: { wave: 'triangle' },
    ptHarmony: { wave: 'pulse:50' },
    ptChipPulse: { wave: 'pulse:50' },
  };
  for (const [name, spec] of Object.entries(tones)) {
    E.registerTone(name, {
      wave: spec.wave, env: 'ptHeld',
      note: 'Pocket Tunnel custom tone.',
      noteJa: 'Pocket Tunnel専用音色。',
    });
  }

  // タブ切替時のマスター音量とチューニング設定。音符の強弱はMMLのvで指定。
  const songs = [
    {
      id: 'original', title: 'ノーマル', file: 'original.mml',
      volume: 0.870156, tune: false,
    },
    {
      id: 'jazz', title: 'おしゃれアレンジ', file: 'jazz.mml',
      volume: 1.199816, tune: false,
    },
    {
      id: 'fusion-v1', title: 'チップチューン アレンジ', file: 'fusion-v1.mml',
      volume: 1.851206, tune: true,
    },
  ];
  function configureDynamicEffects(song, audio) {
    audio.dynamic_effects = {};
    // 旧 @d14 の複製声は「おしゃれアレンジ」だけで使う。
    if (song.id === 'jazz') audio.dynamic_effects[0] = { detune: 14 };
  }

  function applyMixSettings(song, audio) {
    configureDynamicEffects(song, audio);
    audio.psgTune = song.tune;
    audio.volume = song.volume;
  }

  const editor = document.getElementById('pt-src');
  const tabs = document.getElementById('pt-mixes');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  const drafts = new Map();
  let current = songs.find(song =>
    song.id === new URLSearchParams(location.search).get('mix')) ?? songs[0];
  let player;
  let sourceEditor;

  function select(song) {
    if (current?.source && sourceEditor) drafts.set(current.id, sourceEditor.getValue());
    current = song;
    const source = drafts.get(song.id) ?? song.source;
    if (sourceEditor) sourceEditor.setValue(source);
    for (const button of tabs.children) {
      const active = button.dataset.mix === song.id;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    }
    if (player) {
      configureDynamicEffects(song, audio);
      player.setMML(MusicPage.splitMML(source));
      applyMixSettings(song, audio);
    }
  }

  function addTabs() {
    for (const song of songs) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.mix = song.id;
      button.setAttribute('role', 'tab');
      button.textContent = song.title;
      button.addEventListener('click', () => select(song));
      tabs.append(button);
    }
    tabs.addEventListener('keydown', event => {
      const buttons = [...tabs.children];
      const at = buttons.indexOf(document.activeElement);
      if (at < 0) return;
      let next;
      if (event.key === 'ArrowRight') next = (at + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (at + buttons.length - 1) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      buttons[next].click();
      buttons[next].focus();
    });
  }

  Promise.all(songs.map(async song => {
    const response = await fetch(MusicAssets.song(song.file));
    if (!response.ok) throw new Error(song.file + ' (HTTP ' + response.status + ')');
    song.source = await response.text();
  })).then(() => {
    addTabs();
    configureDynamicEffects(current, audio);
    player = E.player.mount(document.getElementById('pt-player'), {
      audio, mml: MusicPage.splitMML(current.source), loops: 3,
    });
    sourceEditor = MusicPage.mountMMLTextarea(editor, current.source, {
      onCommit: value => {
        drafts.set(current.id, value);
        player.setMML(MusicPage.splitMML(value));
        applyMixSettings(current, audio);
      },
    });
    applyMixSettings(current, audio);
    select(current);
    status.textContent = '';
  }).catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();


