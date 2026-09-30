// Volcano Parade 専用音色と、旧ミックスの音量補正。
(() => {
  const E = MMSXX.sound;
  // vpBassはMMLの #wave。計算式はscripts/volcano_bass_wave.cjsへ保存。

  function registerVoices(audio) {
    E.registerTone('vpLead', {
      wave: 'pulse(50)',
      vib: { depth: 5, speed: 6, delay: 18 },
      overwrite: true,
      role: 'lead',
      note: 'Square lead; vibrato starts after 18 frames.',
    });
    audio.addFM('vpPiano', {
      ratio: 3, depth: 3, attack: .001, decay: .07, sustain: .1, wave: 'sine',
    }, {
      overwrite: true, role: 'chord',
      note: 'Bright, rounded short piano.',
    });
    audio.addFM('vpTom', {
      ratio: 1, depth: 3, attack: .002, decay: .1, sustain: .06,
      wave: 'sine', drop: .25, dropTime: .025,
    }, {
      overwrite: true, role: 'perc',
      note: 'Tom-like body with a shallow pitch drop.',
    });
  }

  const CHANNELS = { ARP: 0, MELODY: 1, BASS: 2, CALL: 3, CALL_LOW: 4, HAT: 5 };
  const VOICE_GAINS = {
    vpArp: { f: .065, cap: .24, comp: 1.078 },
    saw: { f: .065, cap: .24, comp: 1.078 },
    'pulse(50)': { f: .055, cap: .24, comp: 1.079 },
    vpLead: { f: .055, cap: .24, comp: 1.079 },
    vpBass: { f: .115, cap: .24, comp: .917 },
    vpPiano: { f: .115, cap: .27, comp: .695 },
    vpTom: { f: .115, cap: .24, comp: 1.227 },
  };
  const DEFAULT_GAIN = { f: .055, cap: .24, comp: 1 };
  const CHANNEL_GAINS = [.98, 1.049, 1.233, 1.063, 1.09, 1, 1, .98];

  function legacyVolume(value) {
    return Math.max(0, Math.min(15, 15 * Math.pow(Math.max(0, 3 * value), 1 / 1.8)));
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
      const wave = E.WAVEFORMS[event.wave];
      if (wave.kind === 'pulse' && wave.duty === .5) event.vol *= Math.pow(.85, 1 / 1.8);
      delete event.__g;
    }
  }

  function prepare(audio) {
    const tracks = audio.bgmDefs.get('__player__');
    if (!Array.isArray(tracks)) return;
    balanceTracks(tracks);
  }

  const editor = document.getElementById('vp-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { psgTune: false, spatial: 'mono' });
  audio.psgTune = false;
  registerVoices(audio);
  audio.volume = 10 ** (12.56 / 20);


  fetch(MusicAssets.song('volcano-parade.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      const player = E.player.mount(document.getElementById('vp-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 3,
      });
      prepare(audio);
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => {
          player.setMML(MusicPage.splitMML(value));
          prepare(audio);
        },
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML loading error: ' + error.message; });
})();

