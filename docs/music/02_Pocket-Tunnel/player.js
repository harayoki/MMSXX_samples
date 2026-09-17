// Pocket Tunnel 3アレンジ共通プレイヤー。
(() => {
  const E = MMSXX.sound;
  E.registerEnvelope('ptHeld', {
    a: .003, d: 0, s: 1, r: .004,
    note: 'Pocket Tunnel held envelope.',
    noteJa: 'Pocket Tunnelの保持音用エンベロープ。',
  });
  E.registerEnvelope('ptDecay', {
    a: .003, d: .1, s: .32, r: .04,
    note: 'Pocket Tunnel short decay.',
    noteJa: 'Pocket Tunnelの短い減衰音。',
  });
  E.registerFM('ptKick', {
    ratio: 1, depth: 0, attack: .003, decay: .12, sustain: 0,
    drop: 125 / 45 - 1, dropTime: .12,
  }, {
    role: 'perc',
    note: 'Pocket Tunnel kick.',
    noteJa: 'Pocket Tunnelのキック。',
  });

  const tones = {
    ptLead: { wave: 'pulse:50', unit: .5 },
    ptJazzLead: { wave: 'pulse:50', unit: .425 },
    ptArp: { wave: 'saw', unit: 1 },
    ptBass: { wave: 'pulse:50', unit: 1 },
    ptJazzBass: { wave: 'triangle', unit: 1.25 },
    ptChord: { wave: 'pulse:50', unit: .5 },
    ptJazzChord: { wave: 'triangle', unit: .5 },
    ptJazzAnswer: { wave: 'triangle', unit: .6 },
    ptHarmony: { wave: 'pulse:50', unit: 1 },
    ptChipPulse: { wave: 'pulse:50', unit: 1 },
  };
  for (const [name, spec] of Object.entries(tones)) {
    E.registerTone(name, {
      wave: spec.wave, env: 'ptHeld',
      note: 'Pocket Tunnel custom tone.',
      noteJa: 'Pocket Tunnel専用音色。',
    });
  }

  const songs = [
    {
      id: 'original', title: 'ノーマル', file: 'original.mml',
      gain: 10 ** (3.74 / 20), tune: false,
    },
    {
      id: 'jazz', title: 'おしゃれアレンジ', file: 'jazz.mml',
      gain: 10 ** (5.42 / 20), tune: false,
    },
    {
      id: 'fusion-v1', title: 'チップチューン アレンジ', file: 'fusion-v1.mml',
      gain: 10 ** (13.10 / 20), tune: true,
    },
  ];
  const envelopeCache = new Map();

  function convertedEnvelope(gate, sustain, legacy) {
    const key = [gate, sustain, legacy].join('_');
    if (envelopeCache.has(key)) return envelopeCache.get(key);
    const name = 'ptEnv' + envelopeCache.size;
    const spec = legacy
      ? { a: .002, d: .25 * Math.max(.02, gate), s: 0, r: .05 }
      : sustain
        ? { a: .003, d: 0, s: 1, r: .004 }
        : { a: .003, d: Math.max(0, gate * .7 - .003), s: .32, r: gate * .3 };
    E.registerEnvelope(name, {
      ...spec,
      note: 'Converted Pocket Tunnel envelope.',
      noteJa: legacy
        ? '旧Fusionの音長比例エンベロープを秒指定へ変換。'
        : 'Pocket Tunnelの旧エンベロープを秒指定へ変換。',
    });
    const index = E.ENVELOPES.findIndex(env => env.name === name);
    envelopeCache.set(key, index);
    return index;
  }

  function nativeVolume(linear) {
    return 15 * Math.pow(Math.max(0, linear) / .14, 1 / 1.8);
  }

  function configureDynamicEffects(song, audio) {
    audio.dynamic_effects = {};
    // 旧 @d14 の複製声は「おしゃれアレンジ」だけで使う。
    if (song.id === 'jazz') audio.dynamic_effects[0] = { detune: 14 };
  }

  function prepare(song, audio) {
    configureDynamicEffects(song, audio);
    const tracks = audio.bgmDefs.get('__player__');
    if (!Array.isArray(tracks)) return;
    const legacy = song.id === 'fusion-v1';
    for (const track of tracks) for (const event of track.events) {
      const name = E.WAVEFORMS[event.wave].name;
      const spec = tones[name];
      if (legacy) {
        if (E.ENVELOPES[event.env].name === 'percussive') {
          event.env = convertedEnvelope(event.gate, false, true);
          event.open = false;
        }
        if (name === 'ptChipPulse') {
          event.vol = nativeVolume(Math.pow(event.vol / 15, 1.8) * .14 * .85);
        }
      } else {
        const envName = E.ENVELOPES[event.env].name;
        const sustain = envName === 'ptHeld';
        if (envName === 'ptHeld' || envName === 'ptDecay') {
          event.env = convertedEnvelope(event.gate, sustain, false);
        }
        if (name === 'ptKick') event.freq = 45;
        event.vol = nativeVolume(event.vol * (spec?.unit ?? 1) / 15 *
          (spec?.wave === 'pulse:50' ? .85 : 1));
        event.open = false;
      }
    }
    audio.psgTune = song.tune;
    audio.volume = .45 * (legacy ? 1 / .45 : .24) * song.gain;
  }

  const editor = document.getElementById('pt-src');
  const tabs = document.getElementById('pt-mixes');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  const drafts = new Map();
  let current = songs.find(song =>
    song.id === new URLSearchParams(location.search).get('mix')) ?? songs[0];
  let player;

  function select(song) {
    if (current?.source) drafts.set(current.id, editor.value);
    current = song;
    editor.value = drafts.get(song.id) ?? song.source;
    for (const button of tabs.children) {
      const active = button.dataset.mix === song.id;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    }
    if (player) {
      configureDynamicEffects(song, audio);
      player.setMML(MusicPage.splitMML(editor.value));
      prepare(song, audio);
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
    editor.disabled = false;
    editor.value = current.source;
    configureDynamicEffects(current, audio);
    player = E.player.mount(document.getElementById('pt-player'), {
      audio, mml: MusicPage.splitMML(current.source), loops: 3,
    });
    prepare(current, audio);
    select(current);
    editor.addEventListener('change', () => {
      drafts.set(current.id, editor.value);
      player.setMML(MusicPage.splitMML(editor.value));
      prepare(current, audio);
    });
    status.textContent = '';
  }).catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();
