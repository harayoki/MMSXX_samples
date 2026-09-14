
// Volcano Parade専用音色。標準APIで登録し、MMLから名前で呼び出す。
var sampleCycle = (s) => Array.from({ length: 32 }, (e, t) => s(t / 32)), triangleAt = (s) => 1 - 4 * Math.abs(s - 0.5);
function filteredSquare(s, e, t) {
	return sampleCycle((o) => {
		let n = 0;
		for (let a = 1; a <= 15; a += 2) {
			let i = a * s / e, c = 1 / Math.hypot(1 - i * i, i / t), r = -Math.atan2(i / t, 1 - i * i);
			n += 4 / Math.PI * (1 / a) * Math.sin(2 * Math.PI * a * o + r) * c;
		}
		return n;
	});
}
function bassCycle(s, e) {
	let t = filteredSquare(s, Math.max(360, 900 - s * 2.5), 0.45);
	return Array.from({ length: 32 }, (o, n) => triangleAt(n / 32) + e * t[n]);
}
window.registerVolcanoVoices = function(sound, registerTone) {
	// ページ全体の音量補正。全曲約 -19 LUFS、最大ピーク -1 dBTP以下を目安。
	sound.volume = 10 ** (12.56 / 20);
	registerTone("vpLead", {
		wave: "pulse50",
		vib: {
			depth: 5,
			speed: 6,
			delay: 18

		},
		overwrite: true,
		role: "lead",
		note: "Square lead; vibrato holds off for 18 frames, then eases in."

	});
	sound.addFM("vpPiano", {
		ratio: 3,
		depth: 3,
		attack: 1e-3,
		decay: 0.07,
		sustain: 0.1,
		wave: "sine"

	}, {
		overwrite: true,
		role: "chord",
		note: "Bright but rounded piano: odd harmonics that ring on the attack and clear fast."

	});
	sound.addFM("vpTom", {
		ratio: 1,
		depth: 3,
		attack: 2e-3,
		decay: 0.1,
		sustain: 0.06,
		wave: "sine",
		drop: 0.25,
		dropTime: 0.025

	}, {
		overwrite: true,
		role: "chord",
		note: "Round, tom-like body under the bright piano. Shallow pitch drop so the note is still heard."

	});
	sound.addWave("vpBass", bassCycle(120, 0.36), 8, {
		overwrite: true,
		role: "bass",
		note: "Triangle with a filtered square mixed in, the way the original layered them."

	});
	sound.addWave("vpBassLow", bassCycle(92, 0.45), 8, {
		overwrite: true,
		role: "bass",
		note: "Triangle with a filtered square mixed in. For the low octave."

	});
	sound.addWave("vpBassHi", bassCycle(180, 0.24), 8, {
		overwrite: true,
		role: "bass",
		note: "Same shape with less square, for the octave above."

	});
};


// Volcano Parade playback and arrangement preparation.
// Copyright 2026 harayoki. All rights reserved.
const E = MMSXX.sound;
const SoundEngine = E.ChipTuneSound,
  registerTone = E.registerTone;
var registerVoices = window.registerVolcanoVoices;
var CHANNELS = {
    ARP: 0,
    MELODY: 1,
    BASS: 2,
    CALL: 3,
    CALL_LOW: 4,
    HAT: 5,
    TOM: 6,
  },
  VOICE_GAINS = {
    saw: { f: 0.065, cap: 0.24, comp: 1.078 },
    pulse50: { f: 0.055, cap: 0.24, comp: 1.079 },
    vpLead: { f: 0.055, cap: 0.24, comp: 1.079 },
    vpBass: { f: 0.115, cap: 0.24, comp: 0.917 },
    vpPiano: { f: 0.115, cap: 0.27, comp: 0.695 },
    vpTom: { f: 0.115, cap: 0.24, comp: 1.227 },
  },
  DEFAULT_GAIN = { f: 0.055, cap: 0.24, comp: 1 },
  HAT_BOOST_DB = 9;
function legacyVolume(s) {
  return Math.max(0, Math.min(15, 15 * Math.pow(Math.max(0, 3 * s), 1 / 1.8)));
}
var CHANNEL_GAINS = [0.98, 1.049, 1.233, 1.063, 1.09, 1, 1, 0.98];
function prepareSong(s, e, t) {
  const shared = MusicWav.loopMacro(t);
  let o = t
    .split(/\r?\n\s*\r?\n/)
    .map((a) => a.trim())
    .filter(Boolean);
  o = o.map((part) => (/\$LOOP_END\s*=/i.test(part) ? part : shared + part));
  s.defineBGM(e, o);
  let n = s.bgmDefs.get(e);
  return (
    balanceTracks(s, n),
    adaptEnvelopes(n),
    { channels: o.length, seconds: Math.max(...n.map((a) => a.total), 0) }
  );
}
function balanceTracks(s, e) {
  let t = s.waveNames,
    o = (r) => (e[r] ? e[r].events : []);
  for (let r of e) for (let u of r.events) u.__g = 1;
  let n = [CHANNELS.MELODY, CHANNELS.CALL, CHANNELS.CALL_LOW].flatMap(o);
  for (let r of o(CHANNELS.ARP)) {
    r.__g = 1.08;
    let u = r.t + r.gate;
    n.some((l) => l.t < u && l.t + l.gate > r.t) && (r.__g *= 0.48);
  }
  let a = 60 / 135;
  for (let r of o(CHANNELS.BASS)) {
    let u = (r.t / a) % 1;
    r.__g *= Math.abs(u - 0.5) < 0.09 ? 1.38 : 0.84;
  }
  o(CHANNELS.HAT).forEach((r, u) => {
    r.__open = u % 16 === 15;
  });
  let i = [0.0041, 0.0014, 0.0011, 0.0022, 0.0014, 0.0016];
  for (let [r, u] of e.entries())
    if (r !== CHANNELS.HAT)
      for (let l of u.events) l.gate += i[l.env] ?? 0.0014;
  let c = e[CHANNELS.ARP];
  if (c) {
    let r = Math.max(...c.events.map((u) => u.detune), 0);
    if (r > 0) {
      let u = Math.pow(2, r / 1200);
      e.push({
        ...c,
        ch: e.length,
        events: c.events.map((l) => ({ ...l, freq: l.freq * u, detune: 0 })),
      });
      for (let l of c.events) l.detune = 0;
    }
  }
  for (let [r, u] of e.entries())
    for (let l of u.events) {
      let d = (l.vol / 15) * l.__g,
        h;
      if (r === CHANNELS.HAT)
        h =
          Math.min(l.__open ? 0.026 : 0.035, d * (l.__open ? 0.018 : 0.025)) *
          Math.pow(10, HAT_BOOST_DB / 20);
      else {
        let f = VOICE_GAINS[t[l.wave]] ?? DEFAULT_GAIN;
        h = Math.min(f.cap, d * f.f) * f.comp;
      }
      ((l.vol = legacyVolume(h) * (CHANNEL_GAINS[r] ?? 1)), delete l.__g);
    }
}
var root = document.getElementById("mmsxx-inline"),
  sourceField = root.querySelector("#mmsxx-src"),
  playStatus = root.querySelector("#mmsxx-status"),
  playButton = root.querySelector("#mmsxx-play"),
  stopButton = root.querySelector("#mmsxx-stop"),
  engine = null,
  finishTimer = 0;
function preparePlayback() {
  return (
    engine ||
      ((engine = new SoundEngine(null, { psgTune: false, spatial: "mono" })),
      (engine.psgTune = !1),
      engine.unlock(),
      registerVoices(engine, registerTone)),
    prepareSong(engine, "volcano", sourceField.value)
  );
}
function stopPlayback() {
  (clearTimeout(finishTimer),
    (finishTimer = 0),
    engine && engine.stopBGM(),
    (playStatus.textContent = "Stopped"));
}
function play() {
  stopPlayback();
  let s = 0;
  try {
    ((s = preparePlayback().seconds), engine.playBGM("volcano", !1, !0));
  } catch (e) {
    playStatus.textContent = "Error: " + e.message;
    return;
  }
  ((playStatus.textContent = `Playing / ${s.toFixed(2)} sec`),
    (finishTimer = setTimeout(
      () => {
        playStatus.textContent = "Finished";
      },
      s * 1e3 + 500,
    )));
}
playButton.addEventListener("click", play);
stopButton.addEventListener("click", stopPlayback);
// Legacy envelopes used decay as a fraction of note length. Convert through
// the public registration API; the bundled engine itself is unchanged.
const legacyEnvelopes = [
  { a: 0.005, d: 0, s: 1, r: 0.01 },
  { a: 0.08, d: 0.1, s: 0.8, r: 0.15 },
  { a: 0.002, d: 0.25, s: 0, r: 0.05 },
  { a: 0.004, d: 0.4, s: 0.35, r: 0.12 },
  { a: 0.25, d: 0.2, s: 0.7, r: 0.4 },
  { a: 0.002, d: 0.12, s: 0.15, r: 0.08 },
];
const envelopeCache = new Map();
function adaptEnvelopes(tracks) {
  for (const track of tracks)
    for (const event of track.events) {
      // Match the former square oscillator level to the current pulse waveform.
      const wave = E.WAVEFORMS[event.wave];
      if (wave.kind === "pulse" && wave.duty === 0.5)
        event.vol *= Math.pow(0.85, 1 / 1.8);
      const spec = legacyEnvelopes[event.env];
      if (spec) {
        const duration = Math.max(0.02, event.gate);
        const key = event.env + ":" + duration;
        if (!envelopeCache.has(key)) {
          const name = "vpLegacy" + envelopeCache.size;
          E.registerEnvelope(name, { ...spec, d: spec.d * duration });
          envelopeCache.set(
            key,
            E.ENVELOPES.findIndex((env) => env.name === name),
          );
        }
        event.env = envelopeCache.get(key);
        event.open = false;
      }
    }
}
window.renderVolcanoWav = async (source, job) => {
  const renderer = new E.ChipTuneSound(null, {
    psgTune: false,
    spatial: "mono",
  });
  registerVoices(renderer, E.registerTone);
  prepareSong(renderer, "download", source);
  return MusicWav.render(renderer, "download", {
    loops: 1,
    tail: 1,
    sampleRate: 48000,
    channels: 1,
  }, job);
};


MusicWav.attach({source:document.getElementById('mmsxx-src'),button:document.getElementById('mmsxx-wav'),status:document.getElementById('mmsxx-wav-status'),key:()=> 'volcano',basename:()=> 'volcano_parade',render:(snapshot,job)=>window.renderVolcanoWav(snapshot.source,job)});
(async () => {
	const source = document.getElementById('mmsxx-src');
	const play = document.getElementById('mmsxx-play');
	const status = document.getElementById('mmsxx-status');
	status.textContent = 'Loading MML…';
	try {
		const response = await fetch(MusicAssets.song('volcano-parade.mml'));
		if (!response.ok) throw new Error('HTTP ' + response.status);
		source.value = await response.text();
		source.disabled = false;
		play.disabled = false;
		status.textContent = 'Ready';
	} catch (error) {
		status.textContent = 'MML loading error: ' + error.message;
	}
})();
