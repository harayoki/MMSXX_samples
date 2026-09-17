// Volcano Parade 専用音色と、旧ミックスの音量補正。
(() => {
  const E = MMSXX.sound;
  const sampleCycle = fn => Array.from({ length: 32 }, (_, i) => fn(i / 32));
  const triangleAt = x => 1 - 4 * Math.abs(x - .5);

  function filteredSquare(cutoff, resonance, mix) {
    return sampleCycle(x => {
      let sum = 0;
      for (let harmonic = 1; harmonic <= 15; harmonic += 2) {
        const n = harmonic * cutoff / resonance;
        const gain = 1 / Math.hypot(1 - n * n, n / mix);
        const phase = -Math.atan2(n / mix, 1 - n * n);
        sum += 4 / Math.PI / harmonic *
          Math.sin(2 * Math.PI * harmonic * x + phase) * gain;
      }
      return sum;
    });
  }

  function bassCycle(cutoff, squareMix) {
    const square = filteredSquare(cutoff, Math.max(360, 900 - cutoff * 2.5), .45);
    return Array.from({ length: 32 }, (_, i) =>
      triangleAt(i / 32) + squareMix * square[i]);
  }

  function registerVoices(audio) {
    audio.volume = 10 ** (12.56 / 20);
    E.registerTone('vpLead', {
      wave: 'pulse:50',
      vib: { depth: 5, speed: 6, delay: 18 },
      overwrite: true,
      role: 'lead',
      note: 'Square lead; vibrato starts after 18 frames.',
      noteJa: '18フレーム後からビブラートが入る矩形波リード。',
    });
    audio.addFM('vpPiano', {
      ratio: 3, depth: 3, attack: .001, decay: .07, sustain: .1, wave: 'sine',
    }, {
      overwrite: true, role: 'chord',
      note: 'Bright, rounded short piano.',
      noteJa: '明るく丸い短いピアノ。',
    });
    audio.addFM('vpTom', {
      ratio: 1, depth: 3, attack: .002, decay: .1, sustain: .06,
      wave: 'sine', drop: .25, dropTime: .025,
    }, {
      overwrite: true, role: 'perc',
      note: 'Tom-like body with a shallow pitch drop.',
      noteJa: '浅く音程が落ちるタム風の音。',
    });
    audio.addWave('vpBass', bassCycle(120, .36), 8, {
      overwrite: true, role: 'bass',
      note: 'Triangle and filtered pulse bass.',
      noteJa: '三角波とフィルター矩形波を混ぜたベース。',
    });
    audio.addWave('vpBassLow', bassCycle(92, .45), 8, {
      overwrite: true, role: 'bass',
      note: 'Low triangle and filtered pulse bass.',
      noteJa: '低域用の三角波とフィルター矩形波のベース。',
    });
    audio.addWave('vpBassHi', bassCycle(180, .24), 8, {
      overwrite: true, role: 'bass',
      note: 'High triangle and filtered pulse bass.',
      noteJa: '高域用の三角波とフィルター矩形波のベース。',
    });
  }

  const CHANNELS = { ARP: 0, MELODY: 1, BASS: 2, CALL: 3, CALL_LOW: 4, HAT: 5 };
  const VOICE_GAINS = {
    saw: { f: .065, cap: .24, comp: 1.078 },
    'pulse:50': { f: .055, cap: .24, comp: 1.079 },
    vpLead: { f: .055, cap: .24, comp: 1.079 },
    vpBass: { f: .115, cap: .24, comp: .917 },
    vpPiano: { f: .115, cap: .27, comp: .695 },
    vpTom: { f: .115, cap: .24, comp: 1.227 },
  };
  const DEFAULT_GAIN = { f: .055, cap: .24, comp: 1 };
  const CHANNEL_GAINS = [.98, 1.049, 1.233, 1.063, 1.09, 1, 1, .98];
  const legacyEnvelopes = [
    { a: .005, d: 0, s: 1, r: .01 },
    { a: .08, d: .1, s: .8, r: .15 },
    { a: .002, d: .25, s: 0, r: .05 },
    { a: .004, d: .4, s: .35, r: .12 },
    { a: .25, d: .2, s: .7, r: .4 },
    { a: .002, d: .12, s: .15, r: .08 },
  ];
  const envelopeCache = new Map();

  function legacyVolume(value) {
    return Math.max(0, Math.min(15, 15 * Math.pow(Math.max(0, 3 * value), 1 / 1.8)));
  }

  function adaptEnvelopes(tracks) {
    for (const track of tracks) for (const event of track.events) {
      const wave = E.WAVEFORMS[event.wave];
      if (wave.kind === 'pulse' && wave.duty === .5) event.vol *= Math.pow(.85, 1 / 1.8);
      const spec = legacyEnvelopes[event.env];
      if (!spec) continue;
      const duration = Math.max(.02, event.gate);
      const key = event.env + ':' + duration;
      if (!envelopeCache.has(key)) {
        const name = 'vpLegacy' + envelopeCache.size;
        E.registerEnvelope(name, {
          ...spec, d: spec.d * duration,
          note: 'Converted Volcano Parade envelope.',
          noteJa: 'Volcano Paradeの旧音長比例エンベロープを秒指定へ変換。',
        });
        envelopeCache.set(key, E.ENVELOPES.findIndex(env => env.name === name));
      }
      event.env = envelopeCache.get(key);
      event.open = false;
    }
  }

  function balanceTracks(tracks) {
    const events = ch => tracks[ch]?.events ?? [];
    for (const track of tracks) for (const event of track.events) event.__g = 1;
    const leads = [CHANNELS.MELODY, CHANNELS.CALL, CHANNELS.CALL_LOW].flatMap(events);
    for (const event of events(CHANNELS.ARP)) {
      event.__g = 1.08;
      const end = event.t + event.gate;
      if (leads.some(other => other.t < end && other.t + other.gate > event.t)) event.__g *= .48;
    }
    const beat = 60 / 135;
    for (const event of events(CHANNELS.BASS)) {
      const phase = event.t / beat % 1;
      event.__g *= Math.abs(phase - .5) < .09 ? 1.38 : .84;
    }
    events(CHANNELS.HAT).forEach((event, index) => { event.__open = index % 16 === 15; });
    const gateTail = [.0041, .0014, .0011, .0022, .0014, .0016];
    for (const [ch, track] of tracks.entries()) {
      if (ch !== CHANNELS.HAT) {
        for (const event of track.events) event.gate += gateTail[event.env] ?? .0014;
      }
    }
    for (const [ch, track] of tracks.entries()) for (const event of track.events) {
      const linear = event.vol / 15 * event.__g;
      let gain;
      if (ch === CHANNELS.HAT) {
        gain = Math.min(event.__open ? .026 : .035,
          linear * (event.__open ? .018 : .025)) * Math.pow(10, 9 / 20);
      } else {
        const spec = VOICE_GAINS[E.WAVEFORMS[event.wave].name] ?? DEFAULT_GAIN;
        gain = Math.min(spec.cap, linear * spec.f) * spec.comp;
      }
      event.vol = legacyVolume(gain) * (CHANNEL_GAINS[ch] ?? 1);
      delete event.__g;
    }
  }

  function prepare(audio) {
    const tracks = audio.bgmDefs.get('__player__');
    if (!Array.isArray(tracks)) return;
    balanceTracks(tracks);
    adaptEnvelopes(tracks);
  }

  const editor = document.getElementById('vp-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  audio.psgTune = false;
  registerVoices(audio);
  // 旧版がアルペジオを複製して7セントずらしていた処理は、現行の動的エフェクトへ移動。
  audio.dynamic_effects[CHANNELS.ARP] = { detune: 7 };

  fetch(MusicAssets.song('volcano-parade.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      editor.value = source;
      editor.disabled = false;
      const player = E.mountPlayer(document.getElementById('vp-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 3, open: false,
      });
      prepare(audio);
      editor.addEventListener('change', () => {
        player.setMML(MusicPage.splitMML(editor.value));
        prepare(audio);
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML loading error: ' + error.message; });
})();
