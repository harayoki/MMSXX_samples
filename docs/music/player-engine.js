// MMS/XX player and audio engine, source commit 6c495496df2e5bf8fdc6ddaa1e41dc05913078ac
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // ../../../tmp/panther-update/sound/audio.js
  var audio_exports = {};
  __export(audio_exports, {
    ChipTuneSound: () => ChipTuneSound,
    SE_SYS_PAUSE: () => SE_SYS_PAUSE,
    SOUND_VERSION: () => SOUND_VERSION,
    encodeWAV: () => encodeWAV,
    psgDiv: () => psgDiv
  });

  // ../../../tmp/panther-update/sound/mml.js
  var mml_exports = {};
  __export(mml_exports, {
    DEFAULT_ENV: () => DEFAULT_ENV,
    DEFAULT_WAVE: () => DEFAULT_WAVE,
    DEV_MARKS: () => DEV_MARKS,
    ENVELOPES: () => ENVELOPES,
    HEAD_MARK: () => HEAD_MARK,
    NOISE_VARIANTS: () => NOISE_VARIANTS,
    ROLES: () => ROLES,
    SPECIALS: () => SPECIALS,
    TUNINGS: () => TUNINGS,
    VCURVES: () => VCURVES,
    WAVE: () => WAVE,
    WAVEFORMS: () => WAVEFORMS,
    compileMML: () => compileMML,
    countOldStyle: () => countOldStyle,
    describeVoice: () => describeVoice,
    envSec: () => envSec,
    findWave: () => findWave,
    isSystemMark: () => isSystemMark,
    listEnvelopes: () => listEnvelopes,
    listVoiceFamilies: () => listVoiceFamilies,
    listVoices: () => listVoices,
    metaOf: () => metaOf,
    readBundles: () => readBundles,
    readChordSets: () => readChordSets,
    readDirectives: () => readDirectives,
    readDrums: () => readDrums,
    readVoices: () => readVoices,
    registerBaked: () => registerBaked,
    registerBeep: () => registerBeep,
    registerCoreFamilies: () => registerCoreFamilies,
    registerEnvelope: () => registerEnvelope,
    registerFM: () => registerFM,
    registerFamily: () => registerFamily,
    registerLayer: () => registerLayer,
    registerNoiseVariants: () => registerNoiseVariants,
    registerOPLL: () => registerOPLL,
    registerOPLLVoice: () => registerOPLLVoice,
    registerOPM: () => registerOPM,
    registerWave: () => registerWave,
    roleOf: () => roleOf,
    sealPresets: () => sealPresets,
    shareBundles: () => shareBundles,
    songParts: () => songParts,
    splitVoices: () => splitVoices,
    toneOf: () => toneOf,
    validateMML: () => validateMML,
    voiceName: () => voiceName,
    voiceNameProblem: () => voiceNameProblem,
    waveMeta: () => waveMeta,
    waveRole: () => waveRole
  });

  // ../../../tmp/panther-update/sound/gm.js
  var GM_NAMES = [
    "Acoustic Grand Piano",
    "Bright Acoustic Piano",
    "Electric Grand Piano",
    "Honky-tonk Piano",
    "Electric Piano 1",
    "Electric Piano 2",
    "Harpsichord",
    "Clavi",
    "Celesta",
    "Glockenspiel",
    "Music Box",
    "Vibraphone",
    "Marimba",
    "Xylophone",
    "Tubular Bells",
    "Dulcimer",
    "Drawbar Organ",
    "Percussive Organ",
    "Rock Organ",
    "Church Organ",
    "Reed Organ",
    "Accordion",
    "Harmonica",
    "Tango Accordion",
    "Acoustic Guitar (nylon)",
    "Acoustic Guitar (steel)",
    "Electric Guitar (jazz)",
    "Electric Guitar (clean)",
    "Electric Guitar (muted)",
    "Overdriven Guitar",
    "Distortion Guitar",
    "Guitar Harmonics",
    "Acoustic Bass",
    "Electric Bass (finger)",
    "Electric Bass (pick)",
    "Fretless Bass",
    "Slap Bass 1",
    "Slap Bass 2",
    "Synth Bass 1",
    "Synth Bass 2",
    "Violin",
    "Viola",
    "Cello",
    "Contrabass",
    "Tremolo Strings",
    "Pizzicato Strings",
    "Orchestral Harp",
    "Timpani",
    "String Ensemble 1",
    "String Ensemble 2",
    "Synth Strings 1",
    "Synth Strings 2",
    "Choir Aahs",
    "Voice Oohs",
    "Synth Voice",
    "Orchestra Hit",
    "Trumpet",
    "Trombone",
    "Tuba",
    "Muted Trumpet",
    "French Horn",
    "Brass Section",
    "Synth Brass 1",
    "Synth Brass 2",
    "Soprano Sax",
    "Alto Sax",
    "Tenor Sax",
    "Baritone Sax",
    "Oboe",
    "English Horn",
    "Bassoon",
    "Clarinet",
    "Piccolo",
    "Flute",
    "Recorder",
    "Pan Flute",
    "Blown Bottle",
    "Shakuhachi",
    "Whistle",
    "Ocarina",
    "Lead 1 (square)",
    "Lead 2 (sawtooth)",
    "Lead 3 (calliope)",
    "Lead 4 (chiff)",
    "Lead 5 (charang)",
    "Lead 6 (voice)",
    "Lead 7 (fifths)",
    "Lead 8 (bass + lead)",
    "Pad 1 (new age)",
    "Pad 2 (warm)",
    "Pad 3 (polysynth)",
    "Pad 4 (choir)",
    "Pad 5 (bowed)",
    "Pad 6 (metallic)",
    "Pad 7 (halo)",
    "Pad 8 (sweep)",
    "FX 1 (rain)",
    "FX 2 (soundtrack)",
    "FX 3 (crystal)",
    "FX 4 (atmosphere)",
    "FX 5 (brightness)",
    "FX 6 (goblins)",
    "FX 7 (echoes)",
    "FX 8 (sci-fi)",
    "Sitar",
    "Banjo",
    "Shamisen",
    "Koto",
    "Kalimba",
    "Bag pipe",
    "Fiddle",
    "Shanai",
    "Tinkle Bell",
    "Agogo",
    "Steel Drums",
    "Woodblock",
    "Taiko Drum",
    "Melodic Tom",
    "Synth Drum",
    "Reverse Cymbal",
    "Guitar Fret Noise",
    "Breath Noise",
    "Seashore",
    "Bird Tweet",
    "Telephone Ring",
    "Helicopter",
    "Applause",
    "Gunshot"
  ];
  var key = (s) => String(s).toLowerCase().replace(/[^a-z0-9+]/g, "");
  var BY_KEY = new Map(GM_NAMES.map((n, i) => [key(n), i]));
  function gmIndex(name) {
    const at = BY_KEY.get(key(name));
    return at === void 0 ? -1 : at;
  }
  function gmLike(name, limit = 5) {
    const k = key(name);
    if (!k) return [];
    const hit = GM_NAMES.filter((n) => key(n).includes(k) || k.includes(key(n)));
    if (hit.length) return hit.slice(0, limit);
    const head = k.slice(0, 3);
    return GM_NAMES.filter((n) => key(n).startsWith(head)).slice(0, limit);
  }

  // ../../../tmp/panther-update/sound/opllvoice.js
  var OP_FIELDS = {
    mul: {
      at: "ml",
      max: 15,
      note: "Frequency multiple, 0 to 15. 0 means half. 1 is the written pitch, 2 is an octave up. On the modulator this sets which harmonic it adds."
    },
    ksr: {
      at: "kr",
      max: 1,
      note: "Key scale rate, 0 or 1. With 1 the envelope runs faster for higher notes, the way a real instrument decays faster up top."
    },
    hold: {
      at: "eg",
      max: 1,
      note: "Sustaining, 0 or 1. With 1 the note holds while the key is down. With 0 it keeps falling away, like a plucked or struck instrument."
    },
    vibrato: {
      at: "pm",
      max: 1,
      note: "Pitch wobble, 0 or 1. The chip has one fixed depth and speed."
    },
    tremolo: {
      at: "am",
      max: 1,
      note: "Volume wobble, 0 or 1. The chip has one fixed depth and speed."
    },
    ksl: {
      at: "kl",
      max: 3,
      note: "Key scale level, 0 to 3. How much quieter the higher notes get. 0 keeps every octave at the same level."
    },
    tl: {
      at: "tl",
      max: 63,
      modOnly: true,
      note: "Total level of the modulator, 0 to 63, in steps of 0.75dB. 0 is the strongest. Larger numbers mean fewer harmonics, a rounder sound. The carrier has no total level: its loudness is the volume register (v in MML)."
    },
    wave: {
      at: "ws",
      max: 1,
      note: "Waveform, 0 or 1. 0 is a sine. 1 is a half sine, with the lower half cut off, which is thinner and has more harmonics."
    },
    fb: {
      at: "fb",
      max: 7,
      modOnly: true,
      note: "Feedback of the modulator into itself, 0 to 7. 0 is none. Larger numbers add harmonics and, at the top, break into noise. Only the modulator has it."
    },
    ar: {
      at: "ar",
      max: 15,
      note: "Attack rate, 0 to 15. How fast it rises. 15 is instant, 0 never starts."
    },
    dr: {
      at: "dr",
      max: 15,
      note: "Decay rate, 0 to 15. How fast it falls to the sustain level after the attack."
    },
    sl: {
      at: "sl",
      max: 15,
      note: "Sustain level, 0 to 15, in steps of 3dB. 0 is full, 15 is nearly silent. Where the decay stops."
    },
    rr: {
      at: "rr",
      max: 15,
      note: "Release rate, 0 to 15. How fast it falls once the key is let go."
    }
  };
  var ALIASES = {
    ratio: "mul",
    harmonic: "mul",
    depth: "tl",
    level: "tl",
    attack: "ar",
    decay: "dr",
    sustain: "sl",
    release: "rr",
    feedback: "fb",
    scale: "ksl",
    scaleRate: "ksr",
    sustaining: "hold",
    half: "wave"
  };
  function fieldOf(key2, where) {
    const name = ALIASES[key2] ?? key2;
    const f = OP_FIELDS[name];
    if (!f) {
      const all = [...Object.keys(OP_FIELDS), ...Object.keys(ALIASES)].sort().join(" ");
      throw new Error(`[ChpTnSnd] OPLL \u306E\u30E6\u30FC\u30B6\u30FC\u97F3\u8272: ${where} \u306B "${key2}" \u306F\u66F8\u3051\u307E\u305B\u3093(\u66F8\u3051\u308B\u3082\u306E: ${all})`);
    }
    return [name, f];
  }
  function numOf(v, f, key2, where) {
    const n = v === true ? f.max : v === false ? 0 : Number(v);
    if (!Number.isFinite(n) || n < 0 || n > f.max || n !== Math.floor(n)) {
      throw new Error(`[ChpTnSnd] OPLL \u306E\u30E6\u30FC\u30B6\u30FC\u97F3\u8272: ${where} \u306E "${key2}" \u306F 0\u301C${f.max} \u306E\u6574\u6570\u3067\u3059(${v} \u3068\u66F8\u3044\u3066\u3042\u308A\u307E\u3059)`);
    }
    return n;
  }
  function readOp(src, where, isMod) {
    const out = {
      ml: 0,
      kr: 0,
      eg: 0,
      pm: 0,
      am: 0,
      kl: 0,
      tl: 0,
      ws: 0,
      fb: 0,
      ar: 0,
      dr: 0,
      sl: 0,
      rr: 0
    };
    for (const [key2, v] of Object.entries(src || {})) {
      const [name, f] = fieldOf(key2, where);
      if (f.modOnly && !isMod) {
        throw new Error(`[ChpTnSnd] OPLL \u306E\u30E6\u30FC\u30B6\u30FC\u97F3\u8272: "${key2}" \u306F\u5909\u8ABF\u5074(mod)\u306B\u3060\u3051\u66F8\u3051\u307E\u3059` + (name === "tl" ? "\u3002\u30AD\u30E3\u30EA\u30A2\u5074\u306E\u97F3\u91CF\u306F MML \u306E v \u3067\u3059" : "\u3002\u5B9F\u6A5F\u306E\u30AD\u30E3\u30EA\u30A2\u5074\u306B\u306F\u7121\u3044\u30D1\u30E9\u30E1\u30FC\u30BF\u3067\u3059"));
      }
      out[f.at] = numOf(v, f, key2, where);
    }
    return out;
  }
  function toBytes(m, c) {
    return [
      m.am << 7 | m.pm << 6 | m.eg << 5 | m.kr << 4 | m.ml,
      c.am << 7 | c.pm << 6 | c.eg << 5 | c.kr << 4 | c.ml,
      m.kl << 6 | m.tl,
      c.kl << 6 | c.ws << 4 | m.ws << 3 | m.fb,
      m.ar << 4 | m.dr,
      c.ar << 4 | c.dr,
      m.sl << 4 | m.rr,
      c.sl << 4 | c.rr
    ];
  }
  function opllVoice(spec = {}) {
    if (spec.bytes) {
      const b = [...spec.bytes];
      if (b.length !== 8 || b.some((x) => !Number.isInteger(x) || x < 0 || x > 255)) {
        throw new Error("[ChpTnSnd] OPLL \u306E\u30E6\u30FC\u30B6\u30FC\u97F3\u8272: bytes \u306F 0\u301C255 \u306E\u6570 8 \u500B\u3067\u3059");
      }
      return b;
    }
    const m = readOp(spec.mod, "mod", true);
    const c = readOp(spec.car, "car", false);
    if (spec.feedback !== void 0) {
      m.fb = numOf(spec.feedback, OP_FIELDS.fb, "feedback", "\u3053\u306E\u97F3\u8272");
    }
    return toBytes(m, c);
  }

  // ../../../tmp/panther-update/sound/tones.js
  var tones_exports = {};
  __export(tones_exports, {
    TONE_FRAME: () => TONE_FRAME,
    TONE_PRESETS: () => TONE_PRESETS,
    readTable: () => readTable,
    registerDefaultTones: () => registerDefaultTones,
    registerTone: () => registerTone
  });
  var TONE_FRAME = 1 / 60;
  var waveByName = (name) => findWave(name);
  function registerTone(name, spec = {}) {
    const at = waveByName(name);
    if (at >= 0 && !spec.overwrite) {
      throw new Error(`[ChpTnSnd] \u97F3\u8272 "${name}" \u306F\u3082\u3046\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059(\u5DEE\u3057\u66FF\u3048\u308B\u306A\u3089 overwrite: true \u3092\u6E21\u3057\u3066\u304F\u3060\u3055\u3044)`);
    }
    const base = WAVEFORMS[waveByName(spec.wave || "pulse(50)")] || WAVEFORMS[2];
    const tone = toneOf(spec, base.kind, name) || {
      arp: null,
      pitch: null,
      vol: null,
      duty: null,
      loop: {},
      vib: null
    };
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: base.kind,
      duty: base.duty,
      samples: base.samples,
      bits: base.bits,
      modRatio: base.modRatio,
      modDepth: base.modDepth,
      modTable: base.modTable,
      patch: base.patch,
      // 2 オペ FM の設定も写す。写していなかったので、`wave: 'opllViolin'` の
      // ように FM を土台にすると `ratio` が undefined になって落ちていた
      // (`freq * undefined` が NaN になり、AudioParam が受け取らない)。
      // 下流は `kind` を見て分岐するので、`kind` を継ぐなら中身も継ぐ
      ratio: base.ratio,
      depth: base.depth,
      attack: base.attack,
      decay: base.decay,
      sustain: base.sustain,
      drop: base.drop,
      dropTime: base.dropTime,
      // FM の変調側に使う波形。`spec.wave` は土台の名前なので、
      // ここは土台が持っているものをそのまま渡す
      ...base.kind === "fm" ? { wave: base.wave } : {},
      // 焼いて使う音色の元
      from: base.from,
      // ロール。書いていなければ元の形のものを継ぐ
      role: roleOf(spec.role, name) ?? base.role ?? null,
      ...metaOf(spec),
      tone
    };
    if (tone.duty) {
      entry.special = [...new Set((entry.special || []).concat("worklet"))];
    }
    if (spec.env) {
      const e = ENVELOPES.findIndex((x) => x.name === spec.env);
      if (e >= 0) entry.defaultEnv = e;
    } else if (base.defaultEnv !== void 0) {
      entry.defaultEnv = base.defaultEnv;
    }
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function readTable(table, frame, loop) {
    if (!table || !table.length) return 0;
    if (frame < table.length) return table[frame];
    if (loop == null || loop < 0 || loop >= table.length) return table[table.length - 1];
    const span = table.length - loop;
    return table[loop + (frame - loop) % span];
  }
  var TONE_PRESETS = {
    // 分散和音。長三和音を 1 フレームずつ回して、和音に聞かせる。
    // 矩形波が 2 本しか無い機械で和音を出す手
    "tnArp(major)": {
      noteJa: "\u9577\u4E09\u548C\u97F3\u3092 1 \u30D5\u30EC\u30FC\u30E0\u305A\u3064\u56DE\u3059\u3002\u77E9\u5F62\u6CE2\u304C 2 \u672C\u3057\u304B\u7121\u3044\u6A5F\u68B0\u3067\u548C\u97F3\u3092\u51FA\u3059\u624B",
      dev: ["done"],
      role: "arp",
      note: "Major triad spun one frame per step. The classic way to fake a chord on a machine with only two pulse channels.",
      wave: "pulse(25)",
      env: "flat",
      arp: [0, 4, 7],
      loop: { arp: 0 }
    },
    "tnArp(minor)": {
      noteJa: "\u77ED\u4E09\u548C\u97F3\u3067\u540C\u3058\u3053\u3068\u3092\u3059\u308B\u3002tnArp(major) \u3068\u7D44\u306B\u3059\u308B\u3068\u9032\u884C\u304C\u56DE\u305B\u308B",
      dev: ["done"],
      role: "arp",
      note: "Minor triad, same spin. Pairs with tnArp(major) for a whole progression.",
      wave: "pulse(25)",
      env: "flat",
      arp: [0, 3, 7],
      loop: { arp: 0 }
    },
    // もっと尖らせたもの。尖り方は 3 つの掛け合わせで決まる —
    // 形が細いほど鼻にかかり、跳ぶ幅が広いほど和音ではなく震えに聞こえ、
    // 1 段が長いほど 1 つ 1 つが聞き取れる。
    //
    // 上の 2 つは「和音に聞かせる」寄り。ここから下は「震えて聞かせる」寄り
    "tnArp(hard)": {
      noteJa: "\u540C\u3058\u9577\u4E09\u548C\u97F3\u3092\u7D30\u3044\u77E9\u5F62\u6CE2\u3067\u3002\u9F3B\u306B\u304B\u304B\u3063\u3066\u524D\u3078\u51FA\u308B\u306E\u3067\u3001\u548C\u97F3\u3068\u3044\u3046\u3088\u308A\u5538\u3063\u3066\u805E\u3053\u3048\u308B",
      dev: ["done"],
      role: "arp",
      note: 'Same major triad on a narrow pulse. Reads as nasal and forward \u2014 closer to "buzzing" than "chord".',
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 4, 7],
      loop: { arp: 0 }
    },
    // オクターブまで跳ぶ。幅が広いほど荒れる。あの手の曲でいちばん多い形
    "tnArp(wide)": {
      noteJa: "\u4E3B\u97F3\u30FB5 \u5EA6\u30FB\u30AA\u30AF\u30BF\u30FC\u30D6\u3002\u8DF3\u3076\u5E45\u304C\u5E83\u3044\u306E\u3067\u3001\u548C\u97F3\u3067\u306F\u306A\u304F\u9707\u3048\u306B\u805E\u3053\u3048\u308B\u3002\u30D5\u30A1\u30DF\u30B3\u30F3\u306E\u30EA\u30FC\u30C9\u3067\u3044\u3061\u3070\u3093\u591A\u3044\u5F62",
      dev: ["done"],
      role: "arp",
      note: "Root, fifth, octave. The wide jump stops sounding like a chord and starts sounding like a warble. The most common shape in NES-era leads.",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 7, 12],
      loop: { arp: 0 }
    },
    "tnArp(wideM)": {
      noteJa: "tnArp(wide) \u306E\u77ED\u8ABF\u7248",
      dev: ["done"],
      role: "arp",
      note: "Minor version of tnArp(wide).",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 3, 12],
      loop: { arp: 0 }
    },
    // 1 段を 2 フレーム持つ組。tnArp と同じ和音の作り分けを、遅い側にも置く。
    //
    // 速さは和音の種類と同じくらい効く。速い側は和音に、遅い側は
    // 1 つ 1 つの音に聞こえるので、同じ [0,4,7] でも別の音として使う。
    // 別のまとまりにしてあるのは、選ぶときにまず速さで選ぶから
    "tnArpSlow(major)": {
      noteJa: "\u9577\u4E09\u548C\u97F3\u3092\u30011 \u6BB5 2 \u30D5\u30EC\u30FC\u30E0\u3067\u56DE\u3059\u3002\u9045\u3044\u3076\u3093\u548C\u97F3\u306E 1 \u3064 1 \u3064\u304C\u805E\u3053\u3048\u3066\u3001\u7C92\u304C\u7ACB\u3064",
      dev: ["done"],
      role: "arp",
      note: "A major triad at two frames per step. Slow enough that you hear each note of it, so it comes out grainy rather than as a chord.",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 0, 4, 4, 7, 7],
      loop: { arp: 0 }
    },
    "tnArpSlow(minor)": {
      noteJa: "\u77ED\u4E09\u548C\u97F3\u3092\u30011 \u6BB5 2 \u30D5\u30EC\u30FC\u30E0\u3067\u56DE\u3059",
      dev: ["done"],
      role: "arp",
      note: "Minor triad at two frames per step.",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 0, 3, 3, 7, 7],
      loop: { arp: 0 }
    },
    "tnArpSlow(hard)": {
      noteJa: "\u540C\u3058\u9577\u4E09\u548C\u97F3\u3092\u3001\u3044\u3061\u3070\u3093\u7D30\u3044\u77E9\u5F62\u6CE2\u3067\u3002\u9045\u3044\u306E\u3067\u5538\u308A\u306B\u306F\u306A\u3089\u305A\u3001\u7C92\u304C\u786C\u304F\u306A\u308B",
      dev: ["done"],
      role: "arp",
      note: "The same major triad on the narrowest pulse. Too slow to buzz, so it reads as hard-edged grain instead.",
      wave: "wtPulse(6)",
      env: "flat",
      arp: [0, 0, 4, 4, 7, 7],
      loop: { arp: 0 }
    },
    "tnArpSlow(wide)": {
      noteJa: "\u4E3B\u97F3\u30FB5 \u5EA6\u30FB\u30AA\u30AF\u30BF\u30FC\u30D6\u3092\u30011 \u6BB5 2 \u30D5\u30EC\u30FC\u30E0\u3067\u56DE\u3059\u3002\u8DF3\u3076\u5E45\u304C\u5E83\u3044\u306E\u3067\u3001\u65CB\u5F8B\u304C 3 \u672C\u8D70\u3063\u3066\u3044\u308B\u3088\u3046\u306B\u805E\u3053\u3048\u308B",
      dev: ["done"],
      role: "arp",
      note: "Root, fifth, octave at two frames per step. The jumps are wide enough and slow enough that it sounds like three lines running at once.",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 0, 7, 7, 12, 12],
      loop: { arp: 0 }
    },
    "tnArpSlow(wideM)": {
      noteJa: "tnArpSlow(wide) \u306E\u77ED\u8ABF\u7248",
      dev: ["done"],
      role: "arp",
      note: "Minor version of tnArpSlow(wide).",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 0, 3, 3, 12, 12],
      loop: { arp: 0 }
    },
    // 落ちる音。高さが下がりきって終わる。効果音にも使える
    seFall: {
      noteJa: "\u9AD8\u3055\u304C 1 \u30AA\u30AF\u30BF\u30FC\u30D6\u4E0B\u304C\u308A\u304D\u3063\u3066\u7D42\u308F\u308B\u3002\u65CB\u5F8B\u3067\u306F\u306A\u304F\u3001\u5F53\u305F\u3063\u305F\u97F3\u3084\u52B9\u679C\u97F3\u306B\u4F7F\u3046",
      role: "se",
      note: "Pitch drops one octave and stops. Good for hits and sound effects, not for melody.",
      wave: "pulse(50)",
      env: "flat",
      pitch: [0, -80, -180, -320, -520, -800, -1200]
    },
    // 遅れて出るビブラート。押した瞬間は真っ直ぐで、伸ばすと揺れ出す。
    // チップチューンのリードの顔
    tnLead: {
      noteJa: "\u62BC\u3057\u3066\u304B\u3089 18 \u30D5\u30EC\u30FC\u30E0\u5F85\u3063\u3066\u63FA\u308C\u51FA\u3059\u30D3\u30D6\u30E9\u30FC\u30C8\u3002\u771F\u3063\u76F4\u3050\u5165\u3063\u3066\u9014\u4E2D\u304B\u3089\u63FA\u308C\u308B\u306E\u304C\u3001\u30C1\u30C3\u30D7\u30C1\u30E5\u30FC\u30F3\u306E\u30EA\u30FC\u30C9\u306E\u9854",
      role: "lead",
      note: "Vibrato that only starts after you hold the note (18 frames). The straight attack followed by a wobble is the signature chiptune lead.",
      wave: "pulse(25)",
      env: "flat",
      vib: { depth: 5, speed: 6, delay: 18 }
    },
    // 刻んで減る音量。割合ではなく表なので、短い音では途中までしか鳴らない
    tnPluck: {
      noteJa: "\u97F3\u91CF\u3092 1 \u30D5\u30EC\u30FC\u30E0\u305A\u3064\u843D\u3068\u3059\u3002\u5272\u5408\u3067\u306F\u306A\u304F\u8868\u306A\u306E\u3067\u3001\u77ED\u3044\u97F3\u3067\u306F\u9014\u4E2D\u307E\u3067\u3057\u304B\u9CF4\u3089\u306A\u3044 \u2014 \u305D\u3053\u304C\u72D9\u3044",
      role: "chord",
      note: "Volume steps down a frame at a time. Because it is a table and not a ratio, short notes only get part of it \u2014 that is the point.",
      wave: "pulse(12)",
      env: "flat",
      vol: [15, 15, 13, 11, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    },
    // 幅の表。矩形波の幅を 1 フレームずつ動かす。高さも音量も変わらないので、
    // 音色だけが動く — 他の表では出せない動き(sound/duty.js)
    //
    // 幅は 0〜1。0.5 が矩形波で、そこから離れるほど細く尖る。
    // 0.25 と 0.75 は同じ音(上下が逆なだけ)なので、下半分だけ使えば足りる
    tnDutyOpen: {
      noteJa: "\u5E45\u304C\u7D30\u3044\u3068\u3053\u308D\u304B\u3089\u59CB\u307E\u3063\u3066\u30019 \u30D5\u30EC\u30FC\u30E0\u3067\u77E9\u5F62\u6CE2\u307E\u3067\u5E83\u304C\u3063\u3066\u6B62\u307E\u308B\u3002\u9AD8\u3055\u3082\u97F3\u91CF\u3082\u52D5\u304B\u3055\u305A\u306B\u3001\u982D\u3060\u3051\u53E3\u3092\u958B\u3051\u305F\u3088\u3046\u306B\u805E\u3053\u3048\u308B",
      role: "lead",
      note: "The pulse starts thin and widens to a square over nine frames, then stays. Gives the attack a vowel-like opening without touching pitch or volume.",
      wave: "pulse(25)",
      env: "flat",
      duty: [0.06, 0.09, 0.125, 0.18, 0.25, 0.31, 0.375, 0.44, 0.5]
    },
    // 行って戻る。ゆっくり回すと、声が 2 本あるように聞こえる(実機の PWM)
    tnDutyPWM: {
      noteJa: "\u5E45\u304C 24 \u30D5\u30EC\u30FC\u30E0(\u7D04 2.5 Hz)\u304B\u3051\u3066\u884C\u3063\u3066\u623B\u308B\u3002\u9045\u3044\u306E\u3067\u97F3\u8272\u306E\u5909\u5316\u3068\u3044\u3046\u3088\u308A\u3001\u58F0\u304C 2 \u672C\u3042\u3063\u3066\u5538\u3063\u3066\u3044\u308B\u3088\u3046\u306B\u805E\u3053\u3048\u308B\u3002\u5B9F\u6A5F\u306E PWM \u306E\u97F3",
      role: "chord",
      note: "The width sweeps out and back over 24 frames (about 2.5 Hz). Slow enough to hear as two voices beating rather than as a timbre \u2014 the pulse-width modulation sound.",
      wave: "pulse(25)",
      env: "flat",
      duty: [
        0.1,
        0.13,
        0.17,
        0.21,
        0.26,
        0.31,
        0.36,
        0.41,
        0.45,
        0.48,
        0.5,
        0.5,
        0.48,
        0.45,
        0.41,
        0.36,
        0.31,
        0.26,
        0.21,
        0.17,
        0.13,
        0.1,
        0.1,
        0.1
      ],
      loop: { duty: 0 }
    },
    // 1 フレームで 1 段。速すぎて幅の変化としては聞こえず、荒れた音になる
    tnDutyBuzz: {
      noteJa: "\u5E45\u3092 1 \u30D5\u30EC\u30FC\u30E0\u306B 1 \u6BB5\u305A\u3064 3 \u901A\u308A\u56DE\u3059(20 Hz)\u3002\u901F\u3059\u304E\u3066\u5E45\u306E\u5909\u5316\u3068\u3057\u3066\u306F\u805E\u3053\u3048\u305A\u3001\u97F3\u306E\u7E01\u304C\u8352\u308C\u3066\u805E\u3053\u3048\u308B",
      role: "lead",
      note: "Three widths spun one frame per step (20 Hz). Too fast to hear as a sweep \u2014 it reads as a rough, reedy edge on the note instead.",
      wave: "pulse(12)",
      env: "flat",
      duty: [0.125, 0.25, 0.5],
      loop: { duty: 0 }
    },
    // ゆっくり 2 つの幅を行き来する。実機の手癖はこちらで、
    // `tnDutyBuzz` の 20 Hz は速すぎた。8 フレームずつなら幅の変化として聞こえる
    tnDutyNes: {
      noteJa: "\u5E45\u3092 2 \u3064\u3060\u3051\u30018 \u30D5\u30EC\u30FC\u30E0\u305A\u3064\u884C\u304D\u6765\u3059\u308B\u3002\u30D5\u30A1\u30DF\u30B3\u30F3\u306E\u99C6\u52D5\u7CFB\u304C\u3088\u304F\u4F7F\u3063\u305F\u624B\u3067\u3001\u901F\u304F\u56DE\u3059\u3088\u308A\u5E45\u304C\u52D5\u3044\u3066\u3044\u308B\u306E\u304C\u5206\u304B\u308B",
      role: "lead",
      note: "Two widths, eight frames each. What NES drivers actually did \u2014 slow enough that you hear the width move, unlike a fast spin.",
      wave: "pulse(12)",
      env: "flat",
      duty: [
        0.125,
        0.125,
        0.125,
        0.125,
        0.125,
        0.125,
        0.125,
        0.125,
        0.5,
        0.5,
        0.5,
        0.5,
        0.5,
        0.5,
        0.5,
        0.5
      ],
      loop: { duty: 0 }
    },
    // 幅で「頭」を作る。戻る位置を書かないので、最後の値で止まる。
    //
    // 表を回すのとはまったく別の使い方で、こちらはエンベロープと同じ仕事を
    // 音量ではなく幅でやっている。音量を動かさずに「叩いた感じ」が出せるので、
    // 三角波に音量つまみが無い機械でも効く、というのが本来の値打ち
    tnDutyAtk: {
      noteJa: "\u982D\u306E 2 \u30D5\u30EC\u30FC\u30E0\u3060\u3051\u5E45 50%\u3001\u305D\u306E\u3042\u3068\u306F 25%\u3002\u97F3\u91CF\u306F\u307E\u3063\u305F\u304F\u52D5\u304B\u3055\u305A\u306B\u3001\u982D\u304C\u786C\u304F\u306A\u308B\u3002\u901F\u3044\u8B5C\u9762\u307B\u3069\u52B9\u304F",
      role: "lead",
      note: "Fifty per cent for the first two frames, then twenty-five. The volume never moves, yet every note arrives with a hard edge. The faster the line, the more it does.",
      wave: "pulse(25)",
      env: "flat",
      duty: [0.5, 0.5, 0.25]
    },
    tnDutyAtkAlt: {
      noteJa: "\u982D\u3067 2 \u30D5\u30EC\u30FC\u30E0\u305A\u3064 50% \u3068 25% \u3092 2 \u5F80\u5FA9\u3057\u3066\u304B\u3089 25% \u306B\u843D\u3061\u7740\u304F\u3002\u786C\u3044\u3060\u3051\u3067\u306A\u304F\u300C\u30B8\u30E3\u30C3\u300D\u3068\u3044\u3046\u7C92\u304C\u4ED8\u304F",
      role: "lead",
      note: "Two frames of fifty, two of twenty-five, twice over, then it settles. Harder than a plain attack and grainier with it.",
      wave: "pulse(25)",
      env: "flat",
      duty: [0.5, 0.5, 0.25, 0.25, 0.5, 0.5, 0.25]
    },
    // 滑り込む入り。下から定位置へ 4 フレームで上がる。
    // 音符ごとに掛かるので、速い譜面ほど効く
    tnSlideIn: {
      noteJa: "2 \u534A\u97F3\u4E0B\u304B\u3089 4 \u30D5\u30EC\u30FC\u30E0\u3067\u5B9A\u4F4D\u7F6E\u3078\u4E0A\u304C\u308B\u3002\u62BC\u3057\u305F\u97F3\u304C\u4E00\u6BB5\u4E0B\u304B\u3089\u6ED1\u308A\u8FBC\u3093\u3067\u304F\u308B\u306E\u3067\u3001\u901F\u3044\u8B5C\u9762\u307B\u3069\u751F\u304D\u308B",
      role: "lead",
      note: "Every note slides up into place from two semitones below over four frames. The faster the line, the more it does.",
      wave: "pulse(25)",
      env: "flat",
      pitch: [-200, -140, -80, -30, 0]
    },
    // 3 つ重ね。滑り込んで、幅が開いて、遅れて揺れる。
    // どれも 1 つずつは地味だが、順に起きると 1 本の音として聞こえる
    tnPsgLead: {
      noteJa: "\u6ED1\u308A\u8FBC\u307F\u3068\u5E45\u958B\u304D\u3068\u9045\u308C\u305F\u30D3\u30D6\u30E9\u30FC\u30C8\u3092\u91CD\u306D\u305F\u3082\u306E\u3002\u62BC\u3057\u305F\u77AC\u9593\u306F\u7D30\u304F\u3066\u4F4E\u304F\u3001\u4F38\u3070\u3059\u3046\u3061\u306B\u592A\u304F\u771F\u3063\u76F4\u3050\u306B\u306A\u308A\u3001\u6700\u5F8C\u306B\u63FA\u308C\u51FA\u3059\u3002PSG \u306E\u30EA\u30FC\u30C9\u3067\u3044\u3061\u3070\u3093\u6C17\u6301\u3061\u306E\u3088\u3044\u5F62",
      role: "lead",
      note: "A slide-in, a widening pulse and a delayed vibrato stacked. It arrives thin and flat, fills out as you hold it, then starts to wobble \u2014 the most satisfying shape a PSG lead takes.",
      wave: "pulse(25)",
      env: "flat",
      pitch: [-150, -90, -40, 0],
      duty: [0.09, 0.125, 0.17, 0.21, 0.25],
      vib: { depth: 4, speed: 6, delay: 20 }
    },
    // 息づく和音。幅がゆっくり往復するので、伸ばすほど中で動く
    tnBreathPad: {
      noteJa: "\u5E45\u304C 18 \u30D5\u30EC\u30FC\u30E0\u304B\u3051\u3066\u958B\u3044\u3066\u9589\u3058\u308B\u3002\u4F38\u3070\u3057\u305F\u548C\u97F3\u306E\u4E2D\u3067\u3086\u3063\u304F\u308A\u52D5\u304F\u306E\u3067\u3001\u540C\u3058\u97F3\u3092\u9577\u304F\u7F6E\u3044\u3066\u3082\u98FD\u304D\u306A\u3044",
      role: "chord",
      note: "The width opens and closes over eighteen frames. A held chord keeps moving inside itself, so it does not go stale.",
      wave: "pulse(25)",
      env: "soft",
      duty: [
        0.14,
        0.17,
        0.21,
        0.26,
        0.31,
        0.36,
        0.41,
        0.45,
        0.48,
        0.5,
        0.48,
        0.45,
        0.41,
        0.36,
        0.31,
        0.26,
        0.21,
        0.17
      ],
      loop: { duty: 0 },
      vib: { depth: 3, speed: 4, delay: 30 }
    },
    // タム。`seFall` の落ち幅を小さくして、落ちながら消す
    tnTom: {
      noteJa: "\u9AD8\u3055\u304C\u5C11\u3057\u3060\u3051\u843D\u3061\u306A\u304C\u3089\u6D88\u3048\u308B\u3002\u843D\u3061\u5E45\u304C\u5C0F\u3055\u3044\u306E\u304C\u304D\u3082\u3067\u30011 \u30AA\u30AF\u30BF\u30FC\u30D6\u843D\u3068\u3059\u3068\u592A\u9F13\u3067\u306F\u306A\u304F\u52B9\u679C\u97F3\u306B\u306A\u308B",
      role: "perc",
      note: "The pitch drops a little and fades. The small drop is the whole point \u2014 take it down an octave and it stops being a drum.",
      wave: "triangle",
      env: "percussive",
      pitch: [0, -60, -140, -220, -280, -320],
      vol: [15, 13, 10, 7, 4, 2, 1]
    },
    // 金属。1 フレームで大きく跳ぶので、音程として聞こえなくなる
    tnClang: {
      noteJa: "\u9AD8\u3055\u304C 1 \u30D5\u30EC\u30FC\u30E0\u3054\u3068\u306B\u5927\u304D\u304F\u8DF3\u3076\u3002\u8DF3\u3076\u5E45\u304C\u548C\u97F3\u3092\u8D8A\u3048\u3066\u3044\u308B\u306E\u3067\u3001\u97F3\u7A0B\u3067\u306F\u306A\u304F\u91D1\u5C5E\u3092\u53E9\u3044\u305F\u97F3\u306B\u805E\u3053\u3048\u308B",
      role: "perc",
      note: "The pitch leaps by more than a chord every frame, so the ear stops hearing a note and starts hearing struck metal.",
      wave: "pulse(25)",
      env: "percussive",
      arp: [0, 19, 7, 26, 12, 31],
      loop: { arp: 0 },
      vol: [15, 12, 9, 7, 5, 4, 3, 2, 1]
    },
    // サイレン。上って下りて回りつづける。曲の部品ではない
    seSiren: {
      noteJa: "\u9AD8\u3055\u304C\u4E0A\u3063\u3066\u4E0B\u308A\u3066\u3001\u56DE\u308A\u3064\u3065\u3051\u308B\u3002\u6B62\u307E\u3089\u306A\u3044\u306E\u3067\u3001\u9CF4\u3089\u3059\u9577\u3055\u3067\u5207\u308B",
      role: "se",
      note: "The pitch runs up and back down and keeps going. It never settles, so the note length is what stops it.",
      wave: "pulse(50)",
      env: "flat",
      pitch: [0, 200, 400, 600, 700, 600, 400, 200],
      loop: { pitch: 0 }
    },
    // 電源が落ちる。幅と高さと音量が同時に落ちる
    sePowerDown: {
      noteJa: "\u5E45\u304C\u7D30\u304F\u306A\u308A\u306A\u304C\u3089\u3001\u9AD8\u3055\u3082\u97F3\u91CF\u3082\u843D\u3061\u308B\u30023 \u3064\u540C\u6642\u306B\u843D\u3068\u3059\u3068\u300C\u5207\u308C\u305F\u300D\u3068\u805E\u3053\u3048\u308B \u2014 1 \u3064\u3060\u3051\u3067\u306F\u8DB3\u308A\u306A\u3044",
      role: "se",
      note: 'The width narrows while the pitch and the volume fall. All three together read as "cut off"; any one of them alone does not.',
      wave: "pulse(50)",
      env: "flat",
      duty: [0.5, 0.42, 0.34, 0.27, 0.21, 0.16, 0.12, 0.09, 0.06],
      pitch: [0, -100, -240, -420, -650, -900, -1200, -1600, -2e3],
      vol: [15, 14, 13, 11, 9, 7, 5, 3, 1]
    },
    // ---- 和音を敷くための 2 つ ----
    //
    // 全音符くらい置く前提なら、ゆっくり入ってよい。
    // 短い音符で使うと立ち上がりきる前に終わるが、それは使いどころが違うだけ。
    tnPadSwell: {
      noteJa: "24 \u30D5\u30EC\u30FC\u30E0(0.4 \u79D2)\u304B\u3051\u3066\u97F3\u91CF\u304C\u4E0A\u304C\u308A\u304D\u308B\u3002\u8868\u3067\u4E0A\u3052\u3066\u3044\u308B\u306E\u3067\u3001@e \u3092\u66F8\u3044\u3066\u3082\u5F62\u306F\u5909\u308F\u3089\u306A\u3044 \u2014 \u548C\u97F3\u3068\u3057\u3066\u7F6E\u3044\u305F\u3068\u304D\u306B\u3001\u65CB\u5F8B\u3088\u308A\u9045\u308C\u3066\u5165\u3063\u3066\u304F\u308B\u306E\u304C\u5024\u6253\u3061",
      role: "chord",
      note: "The volume climbs over twenty-four frames (0.4s). It is the table doing it, so writing @e does not change the shape \u2014 the point is that it arrives behind the melody when you lay it under one.",
      wave: "pulse(50)",
      env: "flat",
      vol: [0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
      loop: { vol: 23 }
    },
    tnPadStrings: {
      noteJa: "30 \u30D5\u30EC\u30FC\u30E0\u5F85\u3063\u3066\u304B\u3089\u3001\u6D45\u304F\u9577\u304F\u63FA\u308C\u306F\u3058\u3081\u308B\u3002\u5F26\u3092\u4F55\u672C\u3082\u91CD\u306D\u305F\u3068\u304D\u306E\u3046\u306D\u308A\u306B\u5BC4\u305B\u305F\u3082\u306E\u3067\u3001\u4F38\u3070\u3059\u307B\u3069\u52B9\u304F",
      role: "chord",
      note: "Waits thirty frames, then a shallow slow waver \u2014 the beating of several string players not quite together. The longer you hold it the more it does.",
      wave: "pulse(25)",
      env: "strings",
      vib: { depth: 3, speed: 4.2, delay: 30 }
    },
    // ---- 効果音の材料。名前は `se` で始める ----
    //
    // ここは仕組み(1 フレームごとに表を読む)で並んだファイルだが、
    // 効果音だけは用途で名乗る。曲を作るときには目に入らないほうがよく、
    // 効果音を作るときにはまとめて出したいので、名前で分かれているほうが早い。
    //
    // 1 つ書けば 1 つ鳴る、を目指す。効果音は音符を並べて作ることもできるが、
    // 定番のもの(取った・撃った・当たった)は音色の側に入れておくほうが早い
    // (docs/SOUND_TOOL.md の「演出と作曲を分ける」)。
    //
    // どれも回さない。表を回すと鳴り止まないので、`loop` を書いていない
    // ものは最後の値で止まる。長さは音符の長さで決める。
    //
    // 役は全部 `se`。曲の部品ではないので、声が足りないときは
    // まっさきに譲る側に回る(sound/chipset.js の ROLE_RANK)。
    seCoin: {
      noteJa: "\u4F4E\u3044\u97F3\u304C 4 \u30D5\u30EC\u30FC\u30E0\u3060\u3051\u9CF4\u3063\u3066\u30015 \u5EA6\u4E0A\u3078\u8DF3\u306D\u3066\u6B8B\u308B\u3002\u53D6\u3063\u305F\u97F3\u306E\u5B9A\u756A\u3067\u3001\u8DF3\u306D\u308B\u524D\u306E\u77ED\u3044\u97F3\u304C\u3042\u308B\u3053\u3068\u304C\u52B9\u3044\u3066\u3044\u308B \u2014 \u4E0A\u306E\u97F3\u3060\u3051\u3067\u306F\u8EFD\u3044",
      role: "se",
      note: "Four frames low, then a jump up a fifth that holds. The classic pickup; the short note before the jump is what sells it \u2014 the upper note alone sounds thin.",
      wave: "pulse(25)",
      env: "flat",
      arp: [0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7],
      vol: [15, 15, 15, 15, 15, 15, 14, 13, 11, 9, 6, 3]
    },
    seZap: {
      noteJa: "6 \u30D5\u30EC\u30FC\u30E0\u3067 2 \u30AA\u30AF\u30BF\u30FC\u30D6\u843D\u3061\u306A\u304C\u3089\u3001\u5E45\u304C\u7D30\u304F\u306A\u308B\u3002\u6483\u3063\u305F\u97F3\u3002\u901F\u304F\u843D\u3061\u304D\u308B\u306E\u3067\u3001\u77ED\u3044\u97F3\u7B26\u3067\u7F6E\u3044\u3066\u3082\u6700\u5F8C\u307E\u3067\u9CF4\u308B",
      role: "se",
      note: "Two octaves down in six frames while the width narrows \u2014 a shot. It lands fast enough that a short note still hears all of it.",
      wave: "pulse(50)",
      env: "flat",
      pitch: [0, -400, -900, -1500, -2e3, -2400],
      duty: [0.5, 0.4, 0.3, 0.22, 0.16, 0.12],
      vol: [15, 14, 12, 9, 6, 2]
    },
    seRise: {
      noteJa: "10 \u30D5\u30EC\u30FC\u30E0\u304B\u3051\u3066 1 \u30AA\u30AF\u30BF\u30FC\u30D6\u4E0A\u304C\u308A\u304D\u308B\u3002\u4E0A\u304C\u3063\u305F\u3068\u3053\u308D\u3067\u6B62\u307E\u308B\u306E\u3067\u3001\u6249\u304C\u958B\u304F\u30FB\u529B\u304C\u6E80\u3061\u308B\u3001\u306E\u3088\u3046\u306A\u6E9C\u3081\u306E\u3042\u308B\u3068\u3053\u308D\u306B\u7F6E\u304F",
      role: "se",
      note: "Climbs an octave over ten frames and stops at the top. For things that build \u2014 a door opening, a charge filling.",
      wave: "pulse(25)",
      env: "flat",
      pitch: [0, 120, 260, 420, 600, 780, 940, 1080, 1160, 1200]
    },
    seHit: {
      noteJa: "\u30CE\u30A4\u30BA\u304C 5 \u30D5\u30EC\u30FC\u30E0\u3067\u843D\u3061\u304D\u308B\u3002\u5F53\u305F\u3063\u305F\u97F3\u3002\u30CE\u30A4\u30BA\u306E\u97F3\u8272\u3092\u66FF\u3048\u308C\u3070\u8CEA\u304C\u5909\u308F\u308B \u2014 \u91D1\u5C5E\u306A\u3089 noise(metal) \u3092\u91CD\u306D\u308B",
      role: "se",
      note: "Noise gone in five frames \u2014 a hit. Swap the noise underneath and the material changes; layer noise(metal) for something metallic.",
      wave: "noise",
      env: "flat",
      vol: [15, 12, 8, 4, 1]
    },
    seExplode: {
      noteJa: "\u30CE\u30A4\u30BA\u304C\u4F4E\u304F\u306A\u308A\u306A\u304C\u3089 20 \u30D5\u30EC\u30FC\u30E0\u304B\u3051\u3066\u6D88\u3048\u308B\u3002\u7206\u767A\u3002\u4E0B\u304C\u308A\u306A\u304C\u3089\u6D88\u3048\u308B\u306E\u304C\u8981\u3067\u3001\u97F3\u91CF\u3060\u3051\u843D\u3068\u3059\u3068\u300C\u5207\u308C\u305F\u300D\u306B\u805E\u3053\u3048\u308B",
      role: "se",
      note: "Noise falling in pitch as it fades over twenty frames. The fall is the point; fading the volume alone just sounds cut off.",
      wave: "noise",
      env: "flat",
      pitch: [
        0,
        -200,
        -400,
        -600,
        -800,
        -1e3,
        -1200,
        -1400,
        -1600,
        -1800,
        -2e3,
        -2200,
        -2400,
        -2600,
        -2800,
        -3e3,
        -3200,
        -3400,
        -3600,
        -3800
      ],
      vol: [15, 15, 14, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 4, 3, 2, 2, 1, 1]
    },
    seBlip: {
      noteJa: "3 \u30D5\u30EC\u30FC\u30E0\u3067\u7D42\u308F\u308B\u7D30\u3044\u97F3\u3002\u30AB\u30FC\u30BD\u30EB\u3092\u52D5\u304B\u3057\u305F\u97F3\u3002\u77ED\u3059\u304E\u308B\u304F\u3089\u3044\u3067\u3061\u3087\u3046\u3069\u3088\u3044 \u2014 \u62BC\u3059\u305F\u3073\u306B\u9CF4\u308B\u3082\u306E\u306A\u306E\u3067",
      role: "se",
      note: "A thin click over in three frames \u2014 a cursor move. Almost too short is right for something that fires on every press.",
      wave: "pulse(12)",
      env: "flat",
      vol: [15, 9, 3]
    },
    seJump: {
      noteJa: "7 \u30D5\u30EC\u30FC\u30E0\u3067 1 \u30AA\u30AF\u30BF\u30FC\u30D6\u4E0A\u304C\u3063\u3066\u3001\u305D\u3053\u3067\u6B62\u307E\u308B\u3002\u8DF3\u3093\u3060\u97F3\u3002\u4E0A\u304C\u308A\u304D\u3063\u3066\u304B\u3089\u4F38\u3070\u3059\u306E\u3067\u3001seRise \u3088\u308A\u901F\u304F\u3001\u77ED\u304F",
      role: "se",
      note: "Up an octave in seven frames, then holds \u2014 a jump. Faster and shorter than seRise.",
      wave: "pulse(50)",
      env: "flat",
      pitch: [0, 300, 600, 850, 1050, 1150, 1200],
      duty: [0.5, 0.5, 0.5, 0.4, 0.3, 0.25, 0.25]
    },
    // 唸る低音。細かく上下させて、うねりを出す
    tnGrowlBass: {
      noteJa: "\u4E09\u89D2\u6CE2\u306B\u7D30\u304B\u3044\u9AD8\u3055\u306E\u8868\u3092\u56DE\u3057\u3066\u3001\u4F4E\u3044\u3068\u3053\u308D\u3067\u5538\u3089\u305B\u308B",
      role: "bass",
      note: "Triangle with a small pitch table looping, so the low end beats against itself.",
      wave: "triangle",
      env: "flat",
      pitch: [0, 10, 0, -10],
      loop: { pitch: 0 }
    }
  };
  function registerDefaultTones() {
    const chords = (head) => Object.entries(TONE_PRESETS).filter(([name]) => name.startsWith(head + "(")).map(([name, p]) => ({ value: name.slice(head.length + 1, -1), note: p.note }));
    registerFamily("tnArp", {
      note: "A chord spun one step per frame, the way a machine with few channels fakes harmony.",
      params: [{
        name: "chord",
        default: "major",
        note: "Which chord shape to spin, and on how narrow a pulse.",
        values: chords("tnArp")
      }]
    });
    registerFamily("tnArpSlow", {
      note: "The same chord spins as tnArp at two frames per step, so each note is heard as grain.",
      params: [{
        name: "chord",
        default: "major",
        note: "Which chord shape to spin, and on how narrow a pulse.",
        values: chords("tnArpSlow")
      }]
    });
    for (const [name, spec] of Object.entries(TONE_PRESETS)) {
      if (waveByName(name) < 0) registerTone(name, spec);
    }
  }

  // ../../../tmp/panther-update/sound/mml.js
  var SEMI = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  var LETTER = { c: 0, d: 1, e: 2, f: 3, g: 4, a: 5, b: 6 };
  var LETTER_OF_SEMI = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
  var TUNINGS = {
    equal: {
      cents: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1e3, 1100],
      note: "Twelve equal steps. The default, and what almost every chiptune uses.",
      noteJa: "12 \u5E73\u5747\u5F8B\u3002\u65E2\u5B9A\u3002\u3075\u3064\u3046\u306E\u66F2\u306F\u3053\u308C\u3067\u3059\u3002"
    },
    pure: {
      // 5 限の純正律。1/1 16/15 9/8 6/5 5/4 4/3 45/32 3/2 8/5 5/3 9/5 15/8
      cents: [
        0,
        111.73,
        203.91,
        315.64,
        386.31,
        498.04,
        590.22,
        701.96,
        813.69,
        884.36,
        1017.6,
        1088.27
      ],
      note: "Five-limit just intonation. Thirds and fifths lock; distant keys do not.",
      noteJa: "\u7D14\u6B63\u5F8B(5 \u9650)\u30023 \u5EA6\u3068 5 \u5EA6\u304C\u3074\u305F\u308A\u3068\u5408\u3044\u307E\u3059\u3002\u9060\u3044\u8ABF\u3078\u56DE\u3059\u3068\u6FC1\u308A\u307E\u3059\u3002"
    },
    pythagorean: {
      // 5 度(3/2)を積んで作る。3 度が広い
      cents: [
        0,
        90.22,
        203.91,
        294.13,
        407.82,
        498.04,
        611.73,
        701.96,
        792.18,
        905.87,
        996.09,
        1109.78
      ],
      note: "Built from stacked perfect fifths. Wide, bright thirds.",
      noteJa: "\u30D4\u30BF\u30B4\u30E9\u30B9\u97F3\u5F8B\u30025 \u5EA6\u3092\u7A4D\u3093\u3067\u4F5C\u308A\u307E\u3059\u30023 \u5EA6\u304C\u5E83\u304F\u3001\u660E\u308B\u304F\u5F35\u308A\u307E\u3059\u3002"
    },
    "meantone:quarter": {
      // 1/4 コンマ中全音。5 度を狭めて 3 度を純正に寄せる
      cents: [
        0,
        76.05,
        193.16,
        310.26,
        386.31,
        503.42,
        579.47,
        696.58,
        772.63,
        889.74,
        1006.84,
        1082.89
      ],
      note: "Quarter-comma meantone. Pure thirds, narrow fifths, a wolf you must avoid.",
      noteJa: "\u4E2D\u5168\u97F3(1/4 \u30B3\u30F3\u30DE)\u30023 \u5EA6\u304C\u7D14\u6B63\u3067\u30015 \u5EA6\u304C\u72ED\u304F\u306A\u308A\u307E\u3059\u3002\u4F7F\u3048\u306A\u3044\u8ABF\u304C\u51FA\u307E\u3059\u3002"
    },
    "meantone:sixth": {
      // 1/6 コンマ。1/4 より 5 度の狭めかたがゆるい
      cents: [
        0,
        88.59,
        196.74,
        305.33,
        393.48,
        501.63,
        590.22,
        698.37,
        786.96,
        895.11,
        1003.26,
        1091.85
      ],
      note: "Sixth-comma meantone. A gentler compromise than quarter-comma.",
      noteJa: "\u4E2D\u5168\u97F3(1/6 \u30B3\u30F3\u30DE)\u30021/4 \u3088\u308A\u7A4F\u3084\u304B\u3067\u3001\u4F7F\u3048\u308B\u8ABF\u304C\u5E83\u304C\u308A\u307E\u3059\u3002"
    },
    slendro: {
      // ジャワ・バリの 5 音。5 等分に近い。楽団ごとの差は小さい
      cents: [0, 240, 480, 720, 960],
      note: "Javanese slendro, five nearly equal steps. Values are a representative set.",
      noteJa: "\u30B9\u30EC\u30F3\u30C9\u30ED\u3002\u307B\u307C 5 \u7B49\u5206\u306E 5 \u97F3\u3067\u3059\u3002\u5024\u306F\u4EE3\u8868\u7684\u306A\u3082\u306E\u3067\u3059\u3002"
    },
    pelog: {
      // ジャワの 7 音。段の幅がばらばらなのがこの音階の顔
      cents: [0, 120, 270, 540, 670, 785, 950],
      note: "Javanese pelog, seven uneven steps. Values are a representative set.",
      noteJa: "\u30DA\u30ED\u30C3\u30B0\u3002\u6BB5\u306E\u5E45\u304C\u4E0D\u63C3\u3044\u306A 7 \u97F3\u3067\u3059\u3002\u5024\u306F\u4EE3\u8868\u7684\u306A\u3082\u306E\u3067\u3059\u3002"
    },
    "pelog:bem": {
      // 7 音のうち 1 2 3 5 6 を使う旋法
      cents: [0, 120, 270, 670, 785],
      note: "Pelog bem: the five degrees a Javanese piece in bem actually uses.",
      noteJa: "\u30DA\u30ED\u30C3\u30B0\u306E\u30D6\u30E0\u30027 \u97F3\u306E\u3046\u3061\u5B9F\u969B\u306B\u4F7F\u3046 5 \u3064\u3060\u3051\u3092\u4E26\u3079\u305F\u3082\u306E\u3067\u3059\u3002"
    },
    "pelog:barang": {
      // 2 3 5 6 7 を使う旋法。ブムと 2 音が入れ替わる
      cents: [0, 150, 550, 665, 830],
      note: "Pelog barang: the other five-degree mode, two tones apart from bem.",
      noteJa: "\u30DA\u30ED\u30C3\u30B0\u306E\u30D0\u30E9\u30F3\u3002\u30D6\u30E0\u3068\u306F 2 \u97F3\u304C\u5165\u308C\u66FF\u308F\u308A\u307E\u3059\u3002"
    }
  };
  function readTuning(text) {
    const words2 = String(text ?? "").trim().split(/[\s,]+/).filter(Boolean);
    if (!words2.length) return null;
    let period = 1200;
    const rest = [];
    for (const w of words2) {
      if (!w.startsWith("/")) {
        rest.push(w);
        continue;
      }
      const n = Number(w.slice(1));
      if (!(n > 0)) bad(`[ChpTnSnd] MML: "#tuning" \u306E 1 \u5468\u306E\u5E45 "${w}" \u306F\u8AAD\u3081\u307E\u305B\u3093`);
      period = n;
    }
    let root = "c";
    const last = rest[rest.length - 1];
    if (rest.length > 1 && last && LETTER[last.toLowerCase()] !== void 0) {
      root = rest.pop().toLowerCase();
    }
    const isNum = (w) => /^-?[\d.]+$/.test(w);
    if (rest.some(isNum) && rest.some((w) => !isNum(w))) {
      bad('[ChpTnSnd] MML: "#tuning" \u306F\u540D\u524D\u304B\u30BB\u30F3\u30C8\u306E\u4E26\u3073\u306E\u3069\u3061\u3089\u304B\u3067\u3059(\u6DF7\u305C\u308B\u3068\u3001\u7F6E\u304D\u63DB\u3048\u306A\u306E\u304B\u8DB3\u3059\u306E\u304B\u8AAD\u3081\u307E\u305B\u3093)');
    }
    if (rest.every(isNum)) {
      const cents = rest.map(Number);
      if (cents.length < 2) bad('[ChpTnSnd] MML: "#tuning" \u306E\u30BB\u30F3\u30C8\u306F 2 \u3064\u4EE5\u4E0A\u66F8\u304D\u307E\u3059');
      return { cents, period, root, name: null };
    }
    const name = rest.join(" ").toLowerCase();
    const set = TUNINGS[name];
    if (!set) {
      bad(`[ChpTnSnd] MML: \u97F3\u5F8B "${name}" \u306F\u77E5\u3089\u306A\u3044\u540D\u524D\u3067\u3059(\u4F7F\u3048\u308B\u306E\u306F ${Object.keys(TUNINGS).join(" / ")})`);
    }
    if (name === "equal" && root !== "c") {
      warn("[ChpTnSnd] MML: 12 \u5E73\u5747\u5F8B\u306B\u6839\u97F3\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u3069\u3053\u304B\u3089\u6570\u3048\u3066\u3082\u540C\u3058\u3067\u3059");
    }
    return { cents: set.cents, period, root, name };
  }
  function beepFreq(n, us) {
    return 1e6 / (2 * Math.max(1, n) * Math.max(1, us));
  }
  var BEEP_MAX_STEPS = 4096;
  var WAVEFORMS = [
    {
      id: 0,
      name: "pulse(12)",
      kind: "pulse",
      duty: 0.125,
      role: "lead",
      dev: ["done"],
      noteJa: "\u5E45 12.5% \u306E\u77E9\u5F62\u6CE2\u3002\u30D7\u30EA\u30BB\u30C3\u30C8\u306E\u77E9\u5F62\u6CE2 3 \u3064\u306E\u3046\u3061\u3044\u3061\u3070\u3093\u7D30\u304F\u3001\u9F3B\u306B\u304B\u304B\u3063\u3066\u524D\u3078\u51FA\u308B\u3002\u30D5\u30A1\u30DF\u30B3\u30F3\u306E\u30EA\u30FC\u30C9\u306E\u97F3",
      note: "Pulse at 12.5% duty. The thinnest of the three built-ins \u2014 nasal and cutting, the classic NES lead."
    },
    // ファミコン風 12.5%
    {
      id: 1,
      name: "pulse(25)",
      kind: "pulse",
      duty: 0.25,
      role: "lead",
      dev: ["done"],
      noteJa: "\u5E45 25%\u300212.5% \u3088\u308A\u592A\u3044\u304C\u3001\u307E\u3060\u306F\u3063\u304D\u308A\u7D30\u3044\u3002\u3044\u3061\u3070\u3093\u4F7F\u3044\u51FA\u306E\u3042\u308B\u97F3",
      note: "Pulse at 25% duty. Fuller than 12.5% but still clearly reedy. The most common all-round chip voice."
    },
    // ファミコン風 25%
    {
      id: 2,
      name: "pulse(50)",
      kind: "pulse",
      duty: 0.5,
      role: "lead",
      // `pulse` だけで呼べば矩形波。幅を書かなければ 50%(仲間の既定)
      dev: ["done"],
      noteJa: "\u305F\u3060\u306E\u77E9\u5F62\u6CE2(\u5E45 50%)\u3002\u4E2D\u304C\u7A7A\u3044\u305F\u3001\u4E0A\u3068\u4E0B\u306E\u540C\u3058\u97F3\u3002MSX \u306E PSG \u306F\u3053\u308C\u3057\u304B\u51FA\u305B\u306A\u3044\u306E\u3067\u3001\u3042\u306E\u6A5F\u68B0\u306E\u97F3\u305D\u306E\u3082\u306E",
      note: "Square wave (50% duty). Hollow and even. The only pulse an AY-3-8910 can make, so this is the MSX/ZX sound."
    },
    // ファミコン/MSX 50%
    // 75% は 25% と上下が逆なだけで同じ音に聞こえるので置かない
    {
      id: 3,
      name: "triangle",
      kind: "triangle",
      role: "bass",
      noteJa: "\u4E09\u89D2\u6CE2\u3002\u4E38\u304F\u3066\u500D\u97F3\u304C\u5C11\u306A\u3044\u3002\u30D5\u30A1\u30DF\u30B3\u30F3\u306E\u5B9F\u6A5F\u3067\u306F\u3001\u3053\u306E\u58F0\u3060\u3051\u97F3\u91CF\u3064\u307E\u307F\u304C\u7121\u304B\u3063\u305F",
      note: "Triangle. Rounded, few harmonics. On real NES hardware this channel has no volume control at all."
    },
    // 三角波
    {
      id: 4,
      name: "saw",
      kind: "saw",
      role: "lead",
      noteJa: "\u306E\u3053\u304E\u308A\u6CE2\u3002\u500D\u97F3\u304C\u5168\u90E8\u305D\u308D\u3063\u3066\u3044\u308B\u306E\u3067\u3001\u3056\u3089\u3064\u3044\u3066\u660E\u308B\u3044",
      note: "Plain sawtooth ramp. Buzzy and bright; every harmonic is present."
    },
    // ノコギリ波
    {
      id: 5,
      name: "sine",
      kind: "sine",
      role: "bass",
      noteJa: "\u30B5\u30A4\u30F3\u6CE2\u3002\u500D\u97F3\u304C\u307E\u3063\u305F\u304F\u7121\u3044\u30021 \u672C\u3060\u3051\u3060\u3068\u7D20\u3063\u6C17\u306A\u3044\u304C\u3001\u4F4E\u3044\u3068\u3053\u308D\u3084\u4ED6\u306E\u97F3\u306E\u4E0B\u306B\u6577\u304F\u3068\u52B9\u304F",
      note: "Sine. No harmonics at all \u2014 plain to the point of being characterless on its own, useful as a sub or under other voices."
    },
    // サイン波
    {
      id: 6,
      name: "noise(white)",
      kind: "noise",
      role: "noise",
      noteJa: "\u30CE\u30A4\u30BA\u3002\u97F3\u7A0B\u306F\u7121\u3044\u304C\u3001\u66F8\u3044\u305F\u9AD8\u3055\u3067\u7C97\u3055\u304C\u5909\u308F\u308B\u3002\u6253\u697D\u5668\u3068\u52B9\u679C\u97F3\u306B\u4F7F\u3046",
      note: "White noise. No pitch as such, though the note still changes how coarse it sounds. Used for drums and effects."
    }
    // ノイズ
  ];
  var NOISE_VARIANTS = {
    "noise(metal)": {
      bits: 7,
      role: "noise",
      noteJa: "\u77ED\u3044\u8F2A\u3092\u56DE\u3059\u30CE\u30A4\u30BA\u3002\u7E70\u308A\u8FD4\u3057\u304C\u97F3\u7A0B\u3068\u3057\u3066\u805E\u3053\u3048\u308B\u306E\u3067\u3001\u7802\u3067\u306F\u306A\u304F\u91D1\u5C5E\u8CEA\u306E\u30D6\u30B6\u30FC\u306B\u306A\u308B\u3002\u30D5\u30A1\u30DF\u30B3\u30F3\u306E\u77ED\u5468\u671F\u30FBSN76489 \u306E\u5468\u671F\u30CE\u30A4\u30BA\u30FB\u30B2\u30FC\u30E0\u30DC\u30FC\u30A4\u306E 7 \u6BB5\u304C\u3053\u308C",
      note: "Noise on a short loop, so the repeat itself is audible as pitch \u2014 a metallic buzz rather than sand. The NES short mode, the SN76489 periodic noise and the Game Boy 7-bit mode are all this."
    },
    "noise(hiss)": {
      rate: 2.5,
      role: "noise",
      noteJa: "\u540C\u3058\u767D\u3044\u30CE\u30A4\u30BA\u3092\u901F\u304F\u56DE\u3057\u305F\u3082\u306E\u3002\u7D30\u304B\u304F\u3066\u660E\u308B\u3044\u3002\u30B7\u30F3\u30D0\u30EB\u3068\u98A8",
      note: "The same white noise run faster: finer and brighter. Cymbals and wind."
    },
    "noise(rumble)": {
      rate: 0.3,
      role: "noise",
      noteJa: "\u540C\u3058\u767D\u3044\u30CE\u30A4\u30BA\u3092\u9045\u304F\u56DE\u3057\u305F\u3082\u306E\u3002\u7C92\u304C\u7C97\u304F\u3001\u4F4E\u3044\u3068\u3053\u308D\u304C\u539A\u3044\u3002\u7206\u767A\u3068\u5730\u97FF\u304D",
      note: "The same white noise run slower: coarse grain with weight underneath. Explosions and rumble."
    }
  };
  function registerCoreFamilies() {
    registerFamily("pulse", {
      note: "Pulse wave with a fixed duty cycle. For a width that moves, use a tone with a duty table.",
      params: [{
        name: "width",
        default: "50",
        note: "Share of each cycle spent high, in percent. 75% sounds the same as 25%, so it is not offered.",
        values: [
          { value: "12", note: "12.5%. The thinnest built-in pulse: nasal and cutting, the classic NES lead." },
          { value: "25", note: "25%. Fuller than 12.5% but still reedy. The most common all-round chip voice." },
          { value: "50", note: "50%, a square wave. Hollow and even; the only width an AY-3-8910 can make." }
        ]
      }]
    });
    registerFamily("noise", {
      note: "Noise from a feedback shift register. Chips differ only in the loop length and how fast it runs.",
      params: [{
        name: "kind",
        default: "white",
        note: "Which loop and speed to use.",
        values: [
          { value: "white", note: "Long loop, plain white noise. Drums and effects." },
          { value: "metal", note: "Short loop, so the repeat is heard as pitch: a metallic buzz (NES short mode, SN76489 periodic noise)." },
          { value: "hiss", note: "White noise run faster: finer and brighter. Cymbals and wind." },
          { value: "rumble", note: "White noise run slower: coarse, with weight underneath. Explosions and rumble." }
        ]
      }]
    });
  }
  function registerNoiseVariants() {
    for (const [name, v] of Object.entries(NOISE_VARIANTS)) {
      if (findWave(name) >= 0) continue;
      WAVEFORMS.push({
        id: WAVEFORMS.length,
        name,
        kind: "noise",
        // 輪の長さと速さ。書かなければ素の白いノイズと同じ
        bits: v.bits || 0,
        rate: v.rate || 1,
        role: roleOf(v.role, name),
        ...metaOf(v)
      });
    }
  }
  var DEFAULT_WAVE = "pulse(50)";
  var DEFAULT_ENV = "flat";
  var ENVELOPES = [
    {
      id: 0,
      name: "flat",
      a: 5e-3,
      d: 0,
      s: 1,
      r: 0.01,
      noteJa: "\u9CF4\u3063\u3066\u3044\u308B\u3042\u3044\u3060\u3001\u305A\u3063\u3068\u540C\u3058\u5927\u304D\u3055\u3002\u4E0A\u304C\u308A\u3082\u4E0B\u304C\u308A\u3082\u3057\u306A\u3044\u3002\u5B9F\u6A5F\u306E\u30C1\u30C3\u30D7\u306F\u3053\u3053\u304B\u3089\u59CB\u307E\u308B\u3002\u5927\u304D\u3055\u3092 v \u3060\u3051\u306B\u6C7A\u3081\u3055\u305B\u305F\u3044\u3068\u304D\u306F\u3053\u308C",
      note: "Holds one level from start to finish \u2014 nothing rises, nothing falls. Where chip hardware starts, and what to pick when v alone should decide how loud a note is."
    },
    {
      id: 1,
      name: "soft",
      a: 0.08,
      d: 0.1,
      s: 0.8,
      r: 0.15,
      noteJa: "\u3075\u308F\u3063\u3068\u5165\u3063\u3066\u3001\u4E0A\u304B\u3089\u5C11\u3057\u3060\u3051\u843D\u3061\u7740\u304F\u3002\u89D2\u304C\u53D6\u308C\u308B\u304C\u3001\u697D\u5668\u3089\u3057\u304F\u306F\u306A\u308A\u3059\u304E\u306A\u3044\u3002\u901F\u3044\u523B\u307F\u306E\u4F34\u594F\u304C\u8033\u306B\u523A\u3055\u308B\u3068\u304D\u306B",
      note: "Eases in, then settles a little below the top. Takes the sting out without turning a part into an instrument \u2014 handy when a fast accompaniment starts to bite."
    },
    {
      id: 2,
      name: "percussive",
      a: 2e-3,
      d: 0.25,
      s: 0,
      r: 0.05,
      noteJa: "\u4E00\u6C17\u306B\u7ACB\u3061\u4E0A\u304C\u3063\u3066\u3001\u305D\u306E\u307E\u307E\u6D88\u3048\u308B\u3002\u4F38\u3070\u3059\u3068\u3053\u308D\u304C\u7121\u3044\u306E\u3067\u3001\u53E9\u3044\u305F\u97F3\u306B\u306A\u308B",
      note: "Straight up and straight back down with nothing held in between. What is left reads as a hit."
    },
    {
      id: 3,
      name: "piano",
      a: 4e-3,
      d: 0.4,
      s: 0.35,
      r: 0.12,
      noteJa: "\u901F\u304F\u7ACB\u3061\u4E0A\u304C\u3063\u3066\u9577\u304F\u6E1B\u308A\u30013 \u5206\u306E 1 \u3042\u305F\u308A\u3067\u843D\u3061\u7740\u3044\u3066\u3001\u305D\u306E\u307E\u307E\u6B8B\u308B\u3002\u53E9\u3044\u3066\u97FF\u304F\u3082\u306E\u306E\u5F62",
      note: "A quick start, a long fall, then it settles about a third of the way up and rings on. The shape of something struck that keeps sounding."
    },
    {
      id: 4,
      name: "pad",
      a: 0.25,
      d: 0.2,
      s: 0.7,
      r: 0.4,
      noteJa: "\u3086\u3063\u304F\u308A\u5165\u3063\u3066\u3001\u3086\u3063\u304F\u308A\u629C\u3051\u308B\u3002\u3042\u3044\u3060\u306F\u305A\u3063\u3068\u9AD8\u3044\u307E\u307E\u3002\u5F8C\u308D\u3067\u9CF4\u3089\u3057\u3066\u5834\u6240\u3092\u57CB\u3081\u308B\u305F\u3081\u306E\u5F62",
      note: "Slow to arrive and slow to leave, high all the way between. Made for sitting behind everything else and filling the room."
    },
    {
      id: 5,
      name: "pluck",
      a: 2e-3,
      d: 0.12,
      s: 0.15,
      r: 0.08,
      noteJa: "\u306F\u3058\u3044\u305F\u77AC\u9593\u3060\u3051\u5927\u304D\u304F\u3001\u3059\u3050\u5C0F\u3055\u304F\u306A\u3063\u3066\u3001\u308F\u305A\u304B\u306B\u6B8B\u308B\u3002\u901F\u304F\u523B\u3093\u3067\u3082 1 \u7C92\u305A\u3064\u7ACB\u3064",
      note: "Loud for an instant, gone almost as fast, with a trace left behind. Even at speed each note keeps its own edge."
    },
    // ---- ここから下は、上の 6 つのあとに足したもの ----
    {
      id: 6,
      name: "snap",
      a: 1e-3,
      d: 0.06,
      s: 0,
      r: 0.02,
      noteJa: "percussive \u3092\u3055\u3089\u306B\u77ED\u304F\u3057\u305F\u3082\u306E\u3002\u307B\u3068\u3093\u3069\u70B9\u306B\u3057\u304B\u805E\u3053\u3048\u306A\u3044\u306E\u3067\u3001\u62CD\u3092\u523B\u3080\u3060\u3051\u306E\u58F0\u306B",
      note: "Percussive cut shorter still \u2014 barely more than a dot. For a voice whose only job is to mark the beat."
    },
    {
      id: 7,
      name: "bell",
      a: 2e-3,
      d: 1.2,
      s: 0,
      r: 0.1,
      noteJa: "\u4E00\u6C17\u306B\u7ACB\u3061\u4E0A\u304C\u3063\u3066\u3001\u9577\u3044\u6642\u9593\u3092\u304B\u3051\u3066\u6D88\u3048\u3066\u3044\u304F\u3002\u4F38\u3070\u3059\u3068\u3053\u308D\u304C\u7121\u3044\u306E\u3067\u3001\u9577\u3044\u97F3\u7B26\u3092\u66F8\u3044\u3066\u3082\u9014\u4E2D\u3067\u6D88\u3048\u308B",
      note: "Struck at once, then a long slow fade. There is nothing to hold, so even a long note dies away inside itself."
    },
    {
      id: 8,
      name: "organ",
      a: 0.01,
      d: 0.05,
      s: 0.9,
      r: 0.03,
      noteJa: "\u7D20\u65E9\u304F\u7ACB\u3061\u4E0A\u304C\u3063\u3066\u3001\u307B\u3093\u306E\u5C11\u3057\u843D\u3061\u3066\u304B\u3089\u4F38\u3073\u308B\u3002flat \u307B\u3069\u786C\u304F\u306A\u304F\u3001\u62BC\u3057\u3066\u3044\u308B\u9593\u306F\u305A\u3063\u3068\u9CF4\u3063\u3066\u3044\u308B",
      note: "Up fast, a small settle, then it stays. Softer than flat at the edges but just as steady while held."
    },
    {
      id: 9,
      name: "strings",
      a: 0.15,
      d: 0.1,
      s: 0.85,
      r: 0.35,
      noteJa: "\u3086\u3063\u304F\u308A\u7ACB\u3061\u4E0A\u304C\u3063\u3066\u9AD8\u3044\u307E\u307E\u4F38\u3073\u3001\u96E2\u3057\u3066\u3082\u5C3E\u3092\u5F15\u304F\u3002pad \u3088\u308A\u5165\u308A\u304C\u901F\u304F\u3001\u5C3E\u304C\u9577\u3044",
      note: "Arrives unhurried, holds high, and trails after the note ends. Quicker in than pad, longer out."
    },
    {
      id: 10,
      name: "swell",
      a: 0.7,
      d: 0,
      s: 1,
      r: 0.2,
      noteJa: "\u5165\u308A\u3060\u3051\u304C\u9577\u3044\u3002\u97F3\u306E\u982D\u304C\u7121\u3044\u306E\u3067\u3001\u3069\u3053\u304B\u3089\u59CB\u307E\u3063\u305F\u304B\u5206\u304B\u3089\u306A\u3044\u307E\u307E\u5927\u304D\u304F\u306A\u308B\u3002\u4E0A\u307E\u3067\u6765\u308B\u306E\u306B 0.7 \u79D2\u304B\u304B\u308B\u306E\u3067\u3001\u77ED\u3044\u97F3\u7B26\u306B\u7740\u305B\u308B\u3068\u307B\u3068\u3093\u3069\u9CF4\u3089\u306A\u3044",
      note: "All attack. With no front edge you cannot tell where it began, only that it grew \u2014 and it takes seven tenths of a second to get there, so a short note barely speaks at all."
    },
    // 叩いて消える。`snap` と `percussive` のあいだが空いていた
    // (s が 0 のものは 0.06 / 0.25 / 1.2 秒しか無く、その中間が無い)。
    // 重ねものの頭に使うとちょうどよい — 8 分音符より短く落ちるので、
    // 音符の途中で消えて、下の音へ引き継いだように聞こえる
    {
      id: 11,
      name: "tap",
      a: 2e-3,
      d: 0.12,
      s: 0,
      r: 0.03,
      noteJa: "\u53E9\u3044\u3066\u3001\u3059\u3050\u6D88\u3048\u308B\u3002snap \u3088\u308A\u5C11\u3057\u6B8B\u308B\u304C\u30018 \u5206\u97F3\u7B26\u3088\u308A\u77ED\u304F\u843D\u3061\u308B\u306E\u3067\u3001\u97F3\u7B26\u304C\u7D42\u308F\u308B\u524D\u306B\u6D88\u3048\u3066\u3044\u308B",
      note: "Struck and gone. It holds longer than snap but falls quicker than an eighth note, so it is already silent before the note ends."
    },
    // ---- 配列式。1 フレーム(60 分の 1 秒)ずつ段で動く ----
    // なめらかな坂では作れない形(段で落ちる・持ち上がる・回りつづける)がこちら
    {
      id: 12,
      name: "step",
      a: 0,
      d: 0,
      s: 0,
      r: 0,
      table: [1, 0.87, 0.75, 0.62, 0.5, 0.37, 0.25, 0.12, 0],
      loop: null,
      noteJa: "\u6BB5\u3067\u843D\u3061\u308B\u3002\u306A\u3081\u3089\u304B\u306B\u6E1B\u308B\u306E\u3067\u306F\u306A\u304F\u30011 \u30D5\u30EC\u30FC\u30E0\u3054\u3068\u306B\u30AB\u30AF\u30C3\u3068\u4E0B\u304C\u308B\u3002\u5B9F\u6A5F\u306E\u99C6\u52D5\u7CFB\u304C\u97F3\u91CF\u3092\u66F8\u304D\u63DB\u3048\u3066\u3044\u305F\u52D5\u304D\u305D\u306E\u3082\u306E",
      note: "Falls in steps rather than sliding \u2014 one notch per frame. The way a real driver rewrote the volume register."
    },
    {
      id: 13,
      name: "tremolo",
      a: 0,
      d: 0,
      s: 0.85,
      r: 0,
      table: [1, 1, 0.85, 0.7, 0.7, 0.85],
      loop: 0,
      noteJa: "\u5927\u304D\u3055\u304C\u63FA\u308C\u3064\u3065\u3051\u308B\u3002\u623B\u308B\u5148\u304C\u5148\u982D\u306A\u306E\u3067\u3001\u97F3\u7B26\u304C\u9577\u3044\u307B\u3069\u4F55\u5EA6\u3082\u63FA\u308C\u308B",
      note: "The level keeps rocking. It returns to the start, so the longer the note the more times it swings."
    },
    {
      id: 14,
      name: "blink",
      a: 0,
      d: 0,
      s: 0.5,
      r: 0,
      table: [1, 1, 0.5, 0.5],
      loop: 0,
      noteJa: "\u9CF4\u308B\u30FB\u6B62\u307E\u308B\u3092\u901F\u304F\u7E70\u308A\u8FD4\u3059\u3002\u6B62\u307E\u308B\u5074\u306F\u5207\u308C\u305A\u306B\u534A\u5206\u306E\u5927\u304D\u3055\u3067\u6B8B\u308B\u306E\u3067\u3001\u9014\u5207\u308C\u305A\u306B\u523B\u3093\u3067\u805E\u3053\u3048\u308B\u3002\u5B9F\u6A5F\u3067\u58F0\u304C\u8DB3\u308A\u306A\u3044\u3068\u304D\u306B\u3084\u3063\u3066\u3044\u305F\u624B",
      note: "On, off, on, off, and quickly \u2014 except the off side is not silence but half, so the note keeps sounding while it beats. What you did on hardware when you had run out of voices."
    },
    {
      id: 15,
      name: "breath",
      a: 0,
      d: 0,
      s: 0.72,
      r: 0,
      table: [
        0.2,
        0.7,
        1,
        1,
        1,
        0.95,
        0.88,
        0.82,
        0.78,
        0.75,
        0.7,
        0.66,
        0.7,
        0.75,
        0.78
      ],
      loop: 9,
      noteJa: "\u7ACB\u3061\u4E0A\u304C\u3063\u3066\u5C11\u3057\u843D\u3061\u7740\u304D\u3001\u305D\u3053\u304B\u3089\u63FA\u308C\u3064\u3065\u3051\u308B\u3002\u623B\u308B\u5148\u304C\u5148\u982D\u3067\u306F\u306A\u304F\u9014\u4E2D\u306A\u306E\u3067\u3001\u7ACB\u3061\u4E0A\u304C\u308A\u306F 1 \u56DE\u304D\u308A\u3067\u3001\u4F38\u3070\u3059\u3068\u3053\u308D\u3060\u3051\u304C\u56DE\u308B",
      note: "Rises, settles a little, and sways from there on. The loop point sits partway in rather than at the start, so the attack happens once and only the held part goes round."
    },
    {
      id: 16,
      name: "bounce",
      a: 0,
      d: 0,
      s: 0.1,
      r: 0,
      table: [1, 0.55, 0.25, 0.5, 0.2, 0.35, 0.14, 0.22, 0.09, 0.14, 0.07, 0.11],
      loop: 8,
      noteJa: "\u843D\u3061\u3066\u306F\u5C11\u3057\u623B\u308B\u3001\u3092\u7E70\u308A\u8FD4\u3057\u3066\u5C0F\u3055\u304F\u306A\u308A\u3001\u305D\u306E\u3042\u3068\u306F\u5C0F\u3055\u3044\u307E\u307E\u8DF3\u306D\u3064\u3065\u3051\u308B\u3002\u623B\u308B\u5148\u304C\u9014\u4E2D\u306A\u306E\u3067\u3001\u5927\u304D\u304F\u8DF3\u306D\u308B\u306E\u306F\u982D\u306E\u4F55\u56DE\u304B\u3060\u3051",
      note: "Falls, springs back a little, falls further \u2014 and once it is quiet it keeps bouncing at that size. The loop point sits partway in, so the big bounces only happen at the top."
    },
    // **ADSR 型だが、番号は後ろに付ける。**曲も部品も名前で持っている
    //(`@e{名前}`、`samples/songs/*.json` の `"env": "piano"`)ので、どこへ
    // 入れても鳴り方は変わらない。それでも後ろに付けるのは、一覧に並ぶ順が
    // 動かないほうが、前に見たものを探しやすいため(2026-09-24)。
    //
    // organ との違いは 3 つで、立ち上がりが 3 倍速く(3ms / 10ms)、
    // 伸びる高さが低く(65% / 90%)、終わりが 2 倍長い(60ms / 30ms)。
    // organ より沈んでいて、切れ際が柔らかい
    {
      id: 17,
      name: "gradual",
      a: 3e-3,
      d: 0.05,
      s: 0.65,
      r: 0.06,
      noteJa: "\u7D20\u65E9\u304F\u7ACB\u3061\u4E0A\u304C\u308A\u3001\u3059\u3050\u5C11\u3057\u6C88\u3093\u3067\u3001\u305D\u3053\u3067\u4F38\u3073\u308B\u3002organ \u3088\u308A\u4F4E\u3044\u3068\u3053\u308D\u3067\u4F38\u3073\u308B\u306E\u3067\u524D\u306B\u51FA\u3059\u304E\u305A\u3001\u97F3\u306E\u7D42\u308F\u308A\u3082\u306A\u3081\u3089\u304B\u306B\u6D88\u3048\u308B",
      note: "Up at once, a quick settle, then it holds \u2014 lower than organ, so it sits back in the mix rather than pushing forward, and it releases softly."
    }
  ];
  function envSec(v, len) {
    if (typeof v === "string") {
      const n = parseFloat(v);
      return Number.isFinite(n) ? Math.max(0, n / 100 * len) : 0;
    }
    return Math.max(0, Number(v) || 0);
  }
  function registerEnvelope(name, spec = {}) {
    const at = ENVELOPES.findIndex((e) => e.name.toLowerCase() === String(name).toLowerCase());
    if (at >= 0 && !spec.overwrite) {
      throw new Error(`[ChpTnSnd] \u30A8\u30F3\u30D9\u30ED\u30FC\u30D7 "${name}" \u306F\u3082\u3046\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059(\u5DEE\u3057\u66FF\u3048\u308B\u306A\u3089 overwrite: true \u3092\u6E21\u3057\u3066\u304F\u3060\u3055\u3044)`);
    }
    const entry = {
      id: at >= 0 ? at : ENVELOPES.length,
      name: String(name),
      note: spec.note == null ? null : String(spec.note),
      noteJa: spec.noteJa == null ? null : String(spec.noteJa)
    };
    if (Array.isArray(spec.table) && spec.table.length) {
      const table = spec.table.map((v) => Math.max(0, Math.min(1, Number(v) || 0)));
      entry.table = table;
      const lp = spec.loop;
      entry.loop = Number.isInteger(lp) && lp >= 0 && lp < table.length ? lp : null;
      if (lp !== void 0 && entry.loop === null) {
        console.warn(`[ChpTnSnd] \u30A8\u30F3\u30D9\u30ED\u30FC\u30D7 "${name}": loop ${lp} \u306F\u8868\u306E\u5916\u3067\u3059(\u8868\u306F ${table.length} \u500B)\u3002\u623B\u3089\u305A\u306B\u6700\u5F8C\u306E\u5024\u3067\u6B62\u307E\u308A\u307E\u3059`);
      }
      entry.a = 0;
      entry.d = 0;
      entry.s = table[table.length - 1];
      entry.r = 0;
    } else {
      const time = (v, dflt, key2) => {
        if (typeof v !== "string") return Math.max(0, Number(v ?? dflt) || 0);
        const m = /^\s*(\d*\.?\d+)\s*%\s*$/.exec(v);
        if (!m) {
          warn(`[ChpTnSnd] \u30A8\u30F3\u30D9\u30ED\u30FC\u30D7 "${name}": ${key2} "${v}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u79D2\u306E\u6570\u304B\u3001"25%" \u306E\u3088\u3046\u306A\u5272\u5408\u3067\u66F8\u304D\u307E\u3059)`);
          return Math.max(0, Number(dflt) || 0);
        }
        const n = Number(m[1]);
        if (n > 100) {
          warn(`[ChpTnSnd] \u30A8\u30F3\u30D9\u30ED\u30FC\u30D7 "${name}": ${key2} ${n}% \u306F\u97F3\u306E\u9577\u3055\u3088\u308A\u9577\u3044\u306E\u3067\u3001\u9CF4\u3063\u3066\u3044\u308B\u3042\u3044\u3060\u306F\u6700\u5F8C\u307E\u3067\u9032\u307F\u307E\u305B\u3093`);
        }
        return `${n}%`;
      };
      entry.a = time(spec.a, 5e-3, "a");
      entry.d = time(spec.d, 0, "d");
      entry.s = Math.max(0, Math.min(1, spec.s ?? 1));
      entry.r = time(spec.r, 0.01, "r");
      entry.table = null;
      entry.loop = null;
    }
    if (at >= 0) ENVELOPES[at] = entry;
    else ENVELOPES.push(entry);
    return entry.id;
  }
  function registerWave(name, samples, bits = 8, opts = {}) {
    requireFreeName(name, opts.overwrite);
    const levels = (1 << bits) - 1;
    const wave = Float32Array.from(samples, (v) => {
      const q = Math.round((Math.max(-1, Math.min(1, v)) + 1) / 2 * levels);
      return q / levels * 2 - 1;
    });
    const at = findWave(name);
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "wave",
      bits,
      samples: wave,
      role: roleOf(opts.role, name),
      ...metaOf(opts)
    };
    if (opts.env !== void 0) entry.defaultEnv = envIndex(opts.env);
    if (opts.gain > 0) entry.gain = Math.max(0.1, Math.min(4, Number(opts.gain)));
    const tone = toneOf(opts, "wave", name);
    if (tone) entry.tone = tone;
    if (opts.modRatio > 0 && opts.modDepth > 0) {
      entry.modRatio = opts.modRatio;
      entry.modDepth = opts.modDepth;
      entry.modTable = Float32Array.from(opts.modTable ?? Array.from({ length: 32 }, (_, i) => 1 - 4 * Math.abs(i / 32 - 0.5)));
    }
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  var WAVE = {
    PULSE12: "pulse(12)",
    PULSE25: "pulse(25)",
    PULSE50: "pulse(50)",
    TRIANGLE: "triangle",
    SAW: "saw",
    SINE: "sine",
    NOISE: "noise"
  };
  var SPECIALS = [
    // 音符では鳴らない。`=` を書いたときだけロード音が組み立てられる
    "tape",
    // 中で計算している。発振器を並べるのではなく、常駐の処理器
    // (AudioWorklet)へ音符を渡す。処理器が読めないと鳴らない唯一の音色
    "worklet"
  ];
  var DEV_MARKS = [
    "done",
    // 確定。これはもう動かさない — 名前も音も、当てにしてよい
    "spec",
    // 要仕様。どういうものにするかがまだ決まっていない
    "wip",
    // 作業中。鳴るが、まだ手を入れる
    "check",
    // 要確認。聞き直したい。ほかと並べて確かめる
    "dup",
    // 重複。似たものがある。まとめるか、違いをはっきりさせるか決める
    "drop"
    // 削除。落とす候補。使われていないか、別のもので足りている
  ];
  var ROLES = [
    "lead",
    // 旋律。いちばん前に出るもの
    "counter",
    // 対旋律
    "chord",
    // 和音・パッド
    "bass",
    // 低音
    "arp",
    // 分散和音
    "perc",
    // 打楽器
    "noise",
    // ノイズを楽器として使うもの(ハイハット・砂・風)
    // 曲の部品ではないもの。テープの読み込み音・当たった音・落ちる音。
    // `noise` と分けたのは、あちらが曲の中で拍を刻むのに対して
    // こちらは曲の外で 1 回鳴るものだから。見本の曲も当てはめも変わる
    "se"
  ];
  function roleOf(role, name) {
    if (role == null) return null;
    const s = String(role).trim().toLowerCase();
    if (!s) return null;
    if (!ROLES.includes(s)) {
      console.warn(`[ChpTnSnd] \u97F3\u8272 "${name}" \u306E\u30ED\u30FC\u30EB "${role}" \u306F\u77E5\u3089\u306A\u3044\u8A00\u8449\u3067\u3059 (\u6C7A\u307E\u3063\u3066\u3044\u308B\u306E\u306F ${ROLES.join(" / ")})\u3002\u305D\u306E\u307E\u307E\u6301\u3061\u307E\u3059\u304C\u3001\u66F8\u304D\u51FA\u3057\u306E\u5F53\u3066\u306F\u3081\u306B\u306F\u5F53\u305F\u308A\u307E\u305B\u3093`);
    }
    return s;
  }
  function waveRole(what) {
    return waveMeta(what)?.role ?? null;
  }
  function waveMeta(what) {
    const w = typeof what === "number" ? WAVEFORMS[what] : WAVEFORMS[findWave(what)];
    if (!w) return null;
    return {
      name: w.name,
      kind: w.kind,
      role: w.role ?? null,
      genre: w.genre ?? [],
      tags: w.tags ?? [],
      special: w.special ?? [],
      dev: w.dev ?? [],
      targets: w.targets ?? [],
      // MIDI に出すならこの音色、という希望(GM の番号)。書いていなければ null
      gm: w.gm ?? null,
      alias: w.alias ?? [],
      note: w.note ?? null,
      noteJa: w.noteJa ?? null
    };
  }
  function sealPresets() {
    for (const w of WAVEFORMS) {
      w.preset = true;
      if (w.vsteps === void 0) w.vsteps = 0;
      if (w.vcurve === void 0) w.vcurve = "curve";
    }
    for (const e of ENVELOPES) e.preset = true;
  }
  function hits(meta, q) {
    if (!q) return true;
    if (q.preset !== void 0 && !!meta.preset !== !!q.preset) return false;
    if (q.kind && meta.kind !== q.kind) return false;
    if (q.role && meta.role !== q.role) return false;
    if (q.tag && !(meta.tags || []).includes(q.tag)) return false;
    if (q.genre && !(meta.genre || []).includes(q.genre)) return false;
    if (q.target && !(meta.targets || []).includes(q.target)) return false;
    if (q.name && !meta.name.toLowerCase().includes(String(q.name).toLowerCase())) return false;
    return true;
  }
  function listVoices(q) {
    return WAVEFORMS.map((w) => ({ ...waveMeta(w.name), preset: !!w.preset })).filter((m) => m && hits(m, q));
  }
  function listEnvelopes(q) {
    return ENVELOPES.map((e) => ({
      name: e.name,
      note: e.note ?? null,
      noteJa: e.noteJa ?? null,
      table: !!e.table,
      preset: !!e.preset
    })).filter((m) => hits(m, q));
  }
  function toneOf(spec = {}, kind = "", name = "") {
    const list = (v) => Array.isArray(v) && v.length ? v.map(Number) : null;
    let duty = list(spec.duty);
    if (duty && kind !== "pulse") {
      console.warn(`[ChpTnSnd] \u97F3\u8272 "${name}": duty \u306E\u8868\u306F\u77E9\u5F62\u6CE2(pulse)\u306B\u3057\u304B\u52B9\u304D\u307E\u305B\u3093(\u3053\u306E\u97F3\u8272\u306F ${kind})\u3002\u8868\u306F\u843D\u3068\u3057\u3066\u767B\u9332\u3057\u307E\u3059`);
      duty = null;
    }
    const arp = list(spec.arp), pitch = list(spec.pitch), vol = list(spec.vol);
    const vib = spec.vib ? { depth: 4, speed: 6, delay: 0, ...spec.vib } : null;
    if (!arp && !pitch && !vol && !duty && !vib) return null;
    return { arp, pitch, vol, duty, loop: { ...spec.loop || {} }, vib };
  }
  var FAMILIES = /* @__PURE__ */ new Map();
  var KEYS = /* @__PURE__ */ new Map();
  function registerFamily(name, spec = {}) {
    const key2 = String(name).trim().toLowerCase();
    if (!/^[a-z][a-z0-9]*$/i.test(String(name).trim())) {
      throw new Error(`[ChpTnSnd] \u4EF2\u9593\u306E\u540D\u524D "${name}" \u306F\u82F1\u6570\u5B57\u3060\u3051\u3067\u66F8\u304D\u307E\u3059`);
    }
    if (FAMILIES.has(key2) && !spec.overwrite) return FAMILIES.get(key2);
    const params = (spec.params || []).map((p) => {
      const values = (p.values || []).map((v) => ({
        value: String(v.value),
        note: v.note == null ? null : String(v.note)
      }));
      if (!p.name || !values.length) {
        throw new Error(`[ChpTnSnd] \u4EF2\u9593 "${name}": \u8EF8\u306B\u306F\u540D\u524D\u3068\u5024\u3092\u66F8\u304D\u307E\u3059`);
      }
      const def = String(p.default ?? values[0].value);
      if (!values.some((v) => v.value.toLowerCase() === def.toLowerCase())) {
        throw new Error(`[ChpTnSnd] \u4EF2\u9593 "${name}": \u8EF8 ${p.name} \u306E\u65E2\u5B9A "${def}" \u304C\u5024\u306E\u4E2D\u306B\u3042\u308A\u307E\u305B\u3093`);
      }
      return { name: String(p.name), note: p.note == null ? null : String(p.note), default: def, values };
    });
    if (!params.length) throw new Error(`[ChpTnSnd] \u4EF2\u9593 "${name}": \u8EF8\u304C 1 \u672C\u3082\u3042\u308A\u307E\u305B\u3093`);
    const axisOf = (n) => {
      const p = params.find((q) => q.name.toLowerCase() === String(n).toLowerCase());
      if (!p) throw new Error(`[ChpTnSnd] \u4EF2\u9593 "${name}": \u8EF8 "${n}" \u306F\u3042\u308A\u307E\u305B\u3093`);
      return p.name;
    };
    const exclusive = (spec.exclusive || []).map((g) => g.map(axisOf));
    const forbid = (spec.forbid || []).map((c) => Object.fromEntries(Object.entries(c).map(([k, v]) => [axisOf(k), String(v)])));
    const fam = {
      name: String(name).trim(),
      note: spec.note == null ? null : String(spec.note),
      params,
      exclusive,
      forbid
    };
    FAMILIES.set(key2, fam);
    KEYS.clear();
    return fam;
  }
  function splitVoiceName(name) {
    const s = String(name).trim();
    const m = /^([^()\s]+)\s*(?:\((.*)\))?$/s.exec(s);
    if (!m) return null;
    if (m[2] === void 0) return { head: m[1], args: null };
    const args = m[2].split(",").map((a) => a.trim()).filter((a) => a !== "").map((a) => {
      const i = a.indexOf(":");
      return i < 0 ? { axis: null, value: a } : { axis: a.slice(0, i).trim(), value: a.slice(i + 1).trim() };
    });
    return { head: m[1], args };
  }
  function resolveVoiceName(name) {
    const sp = splitVoiceName(name);
    if (!sp) return null;
    const fam = FAMILIES.get(sp.head.toLowerCase());
    if (!fam) {
      return sp.args === null ? null : { error: `"${sp.head}" \u306F\u4F5C\u308A\u5206\u3051\u3092\u6301\u3064\u97F3\u8272\u3067\u306F\u3042\u308A\u307E\u305B\u3093` };
    }
    const args = {};
    for (const a of sp.args || []) {
      let axis;
      if (a.axis !== null) {
        axis = fam.params.find((p) => p.name.toLowerCase() === a.axis.toLowerCase());
        if (!axis) {
          return { error: `${fam.name} \u306B\u8EF8 "${a.axis}" \u306F\u3042\u308A\u307E\u305B\u3093(\u3042\u308B\u306E\u306F ${fam.params.map((p) => p.name).join(" / ")})` };
        }
      } else {
        const hits2 = fam.params.filter((p) => p.values.some((v) => v.value.toLowerCase() === a.value.toLowerCase()));
        if (!hits2.length) {
          return { error: `${fam.name} \u306B\u5024 "${a.value}" \u306F\u3042\u308A\u307E\u305B\u3093(${fam.params.map((p) => `${p.name}: ${p.values.map((v) => v.value).join(" | ")}`).join(" / ")})` };
        }
        if (hits2.length > 1) {
          return { error: `${fam.name} \u306E\u5024 "${a.value}" \u306F ${hits2.map((p) => p.name).join(" \u3068 ")} \u306E\u3069\u3061\u3089\u306B\u3082\u3042\u308A\u307E\u3059\u3002\u8EF8\u306E\u540D\u524D\u3092\u4ED8\u3051\u3066\u66F8\u304D\u307E\u3059(${hits2[0].name}: ${a.value})` };
        }
        axis = hits2[0];
      }
      const val = axis.values.find((v) => v.value.toLowerCase() === a.value.toLowerCase());
      if (!val) {
        return { error: `${fam.name} \u306E ${axis.name} \u306B\u5024 "${a.value}" \u306F\u3042\u308A\u307E\u305B\u3093(\u3042\u308B\u306E\u306F ${axis.values.map((v) => v.value).join(" | ")})` };
      }
      if (args[axis.name] !== void 0) {
        return { error: `${fam.name} \u306E ${axis.name} \u3092 2 \u56DE\u66F8\u3044\u3066\u3044\u307E\u3059` };
      }
      args[axis.name] = val.value;
    }
    const moved = (n) => args[n] !== void 0 && args[n].toLowerCase() !== fam.params.find((p) => p.name === n).default.toLowerCase();
    for (const g of fam.exclusive) {
      const said = g.filter(moved);
      if (said.length > 1) {
        return { error: `${fam.name} \u306E ${said.join(" \u3068 ")} \u306F\u4E00\u7DD2\u306B\u66F8\u3051\u307E\u305B\u3093` };
      }
    }
    for (const p of fam.params) if (args[p.name] === void 0) args[p.name] = p.default;
    for (const c of fam.forbid) {
      if (Object.entries(c).every(([k, v]) => args[k].toLowerCase() === v.toLowerCase())) {
        return { error: `${fam.name} \u306E ${Object.entries(c).map(([k, v]) => `${k}: ${v}`).join(" \u3068 ")} \u306F\u7D44\u307F\u5408\u308F\u305B\u3089\u308C\u307E\u305B\u3093` };
      }
    }
    return { fam, args };
  }
  function voiceName(name) {
    const r = resolveVoiceName(name);
    if (!r || r.error) return null;
    const { fam, args } = r;
    const shared = (p) => fam.params.some((q) => q !== p && q.values.some((v) => v.value.toLowerCase() === args[p.name].toLowerCase()));
    return fam.name + "(" + fam.params.map((p) => shared(p) ? `${p.name}: ${args[p.name]}` : args[p.name]).join(", ") + ")";
  }
  function voiceKey(name) {
    const s = String(name);
    if (KEYS.has(s)) return KEYS.get(s);
    const r = resolveVoiceName(s);
    const key2 = !r ? s.trim().toLowerCase() : r.error ? null : r.fam.name.toLowerCase() + "(" + r.fam.params.map((p) => `${p.name}=${r.args[p.name]}`.toLowerCase()).join(",") + ")";
    KEYS.set(s, key2);
    return key2;
  }
  function voiceNameProblem(name) {
    const r = resolveVoiceName(name);
    if (r && r.error) return r.error;
    return null;
  }
  function findWave(name) {
    const key2 = voiceKey(name);
    if (key2 === null) return -1;
    const at = WAVEFORMS.findIndex((w) => voiceKey(w.name) === key2);
    if (at >= 0) return at;
    const low = String(name).trim().toLowerCase();
    return WAVEFORMS.findIndex((w) => (w.alias || []).some((a) => String(a).toLowerCase() === low));
  }
  function describeVoice(name) {
    const r = resolveVoiceName(name);
    if (r && !r.error) {
      const { fam, args } = r;
      const sp = splitVoiceName(name);
      const out = {
        name: fam.name,
        note: fam.note,
        params: fam.params.map((p) => ({
          name: p.name,
          note: p.note,
          default: p.default,
          values: p.values.map((v) => ({ value: v.value, note: v.note }))
        })),
        // 一緒に書けない軸の組と、組み合わせられない値
        exclusive: fam.exclusive.map((g) => [...g]),
        forbid: fam.forbid.map((c) => ({ ...c })),
        // 登録してある作り分け。組み合わせによっては無いものがある
        variants: WAVEFORMS.filter((w2) => {
          const q = resolveVoiceName(w2.name);
          return q && !q.error && q.fam === fam && splitVoiceName(w2.name).args !== null;
        }).map((w2) => w2.name)
      };
      if (sp.args !== null || findWave(name) >= 0) {
        const at2 = findWave(name);
        if (at2 >= 0) {
          out.voice = WAVEFORMS[at2].name;
          out.args = args;
        }
      }
      return out;
    }
    const at = findWave(name);
    if (at < 0) return null;
    const w = WAVEFORMS[at];
    return { name: w.name, note: w.note ?? null, params: [], exclusive: [], forbid: [] };
  }
  function listVoiceFamilies() {
    return [...FAMILIES.values()].map((f) => f.name);
  }
  registerCoreFamilies();
  var words = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]).map((x) => String(x).trim().toLowerCase()).filter(Boolean);
  function gmOf(v) {
    if (v == null || v === "") return null;
    if (typeof v === "number" || /^\d+$/.test(String(v).trim())) {
      const n = Math.round(Number(v));
      if (n >= 0 && n <= 127) return n;
      console.warn(`[ChpTnSnd] gm: ${v} \u306F 0\u301C127 \u306E\u5916\u3067\u3059`);
      return null;
    }
    const at = gmIndex(v);
    if (at >= 0) return at;
    const like = gmLike(v);
    console.warn(`[ChpTnSnd] gm: "${v}" \u306F GM \u306E\u97F3\u8272\u540D\u3067\u306F\u3042\u308A\u307E\u305B\u3093` + (like.length ? `(\u8FD1\u3044\u306E\u306F ${like.join(" / ")})` : "(sound/gm.js \u306B 128 \u500B\u3042\u308A\u307E\u3059)"));
    return null;
  }
  var VCURVES = ["curve", "3db", "linear", "0.75db"];
  function vstepsOf(v) {
    if (v === void 0 || v === null) return 0;
    const n = Math.floor(Number(v));
    if (!Number.isFinite(n) || n < 0) {
      warn(`[ChpTnSnd] vsteps "${v}" \u306F\u8AAD\u3081\u307E\u305B\u3093(0 \u4EE5\u4E0A\u306E\u6574\u6570\u30020 \u306A\u3089\u5BC4\u305B\u306A\u3044)`);
      return 0;
    }
    return n;
  }
  function vcurveOf(v) {
    if (v === void 0 || v === null) return "curve";
    const s = String(v).toLowerCase();
    if (VCURVES.includes(s)) return s;
    warn(`[ChpTnSnd] vcurve "${v}" \u306F\u77E5\u3089\u306A\u3044\u540D\u524D\u3067\u3059(\u4F7F\u3048\u308B\u306E\u306F ${VCURVES.join(" / ")})`);
    return "curve";
  }
  function metaOf(opts = {}) {
    return {
      genre: words(opts.genre),
      tags: words(opts.tags),
      // 鳴らし方が特別なもの。道具はここを見て鳴らし方を変える。
      // ふつうに音符で鳴らすと別のものになってしまう音色だけが持つ
      special: words(opts.special),
      // 作っている最中の覚え書き。鳴りにも書き出しにも効かない。
      // 決まった語を使う(DEV_MARKS)が、知らない語も通す —
      // 途中で増えるものなので、ここで止めると印を付けるのに手が要る
      dev: words(opts.dev),
      // 書き出せる先。言葉の一覧は道具の側が持つ(tool/core/targets.js)。
      // 書かなくてよい — 空なら、道具が音色の作りから割り出す
      targets: words(opts.targets),
      // MIDI に出すならこの音色、という希望(GM の番号 0〜127)。
      //
      // いまは役(lead / bass …)と名前の当てずっぽうで決めている
      // (tool/core/midi-write.js の GM_BY_NAME)。役は粗くて、名前の正規表現は
      // 自分で足した音色には効かない。音色が自分で言えるのがいちばん強い。
      //
      // 書かなくてよい。書いていなければ今までどおり当てる。
      // 番号でも名前でもよい(`56` でも `'Trumpet'` でも同じ)。
      // 書き間違いはここで言う — 黙って捨てると、書き出すまで気づけない
      gm: gmOf(opts.gm),
      // **音量の段数と曲線。**どちらも必ず持つ(書かなければ既定)ので、
      // 読む側に「無かったら」の分岐が要らない。
      //
      // 実機は音量の目盛りが機種ごとに違う。AY は 16 段で 1 段 3dB、
      // ファミコンは 16 段だが値がそのまま振幅、FM の TL は 128 段で 0.75dB。
      // 曲線と段数は対で意味を持つ(1 段あたり何 dB × 段数 = 全体の幅)。
      //
      // MML には命令を足さない。同じ波形の段あり・段なしが欲しければ、
      // `registerTone` で着せ替えた音色を 2 つ登録する(2026-09-25)
      vsteps: vstepsOf(opts.vsteps),
      vcurve: vcurveOf(opts.vcurve),
      // **実機の高さの刻み。**書かなければ音色の作りから決める(`psgDiv`)。
      // 書くのは、ふつうの音程レジスタとは別の道で高さを作る音色だけ ——
      // AY のブザー音がそれで、エンベロープの周期で高さが決まるため
      // 刻みが 16 倍粗い(2026-09-26)
      ...opts.snapDiv > 0 ? { snapDiv: Math.floor(opts.snapDiv) } : {},
      // **直流ぶんの比。**波形は上下対称に均してあるが、実機の DAC は 0 から上
      // しか出さない音色がある。同じチャンネルの矩形波で刻むとき、この差が
      // そのまま「矩形波そのものが聞こえるかどうか」になる。均す前の平均を
      // 山の高さで割った値を持っておいて、鳴らす側が足し戻す(2026-09-26)
      ...opts.dcBias > 0 ? { dcBias: Number(opts.dcBias) } : {},
      // 別名。同じ音を 2 通りの名前で呼べる(findWave)
      alias: Array.isArray(opts.alias) ? opts.alias.map(String) : [],
      // 説明は 2 か国語ぶん持てる。どちらか片方でよい(マニュアルの側で
      // 足りないほうを補って印を付ける。scripts/notes.js)
      note: opts.note == null ? null : String(opts.note),
      noteJa: opts.noteJa == null ? null : String(opts.noteJa)
    };
  }
  function requireFreeName(name, overwrite) {
    if (String(name).includes("(") && voiceName(name) === null) {
      throw new Error(`[ChpTnSnd] \u97F3\u8272 "${name}" \u306F\u767B\u9332\u3067\u304D\u307E\u305B\u3093\u3002` + (voiceNameProblem(name) || "\u4F5C\u308A\u5206\u3051\u306E\u66F8\u304D\u65B9\u304C\u8AAD\u3081\u307E\u305B\u3093"));
    }
    const key2 = voiceKey(name);
    const at = WAVEFORMS.findIndex((w) => voiceKey(w.name) === key2);
    if (at >= 0 && !overwrite) {
      throw new Error(`[ChpTnSnd] \u97F3\u8272 "${name}" \u306F\u3082\u3046\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059(\u5DEE\u3057\u66FF\u3048\u308B\u306A\u3089 overwrite: true \u3092\u6E21\u3057\u3066\u304F\u3060\u3055\u3044)`);
    }
    return at;
  }
  function registerFM(name, params = {}, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const entry = {
      role: roleOf(opts.role, name),
      ...metaOf(opts),
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "fm",
      ratio: params.ratio ?? 1,
      depth: params.depth ?? 3,
      attack: params.attack ?? 2e-3,
      decay: params.decay ?? 0.3,
      sustain: params.sustain ?? 0.15,
      wave: params.wave || WAVE.SINE,
      drop: params.drop ?? 0,
      dropTime: params.dropTime ?? 0.05
    };
    const tone = toneOf({ ...params, ...opts }, "fm", name);
    if (tone) entry.tone = tone;
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerBeep(name, params = {}, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const entry = {
      role: roleOf(opts.role, name),
      ...metaOf(opts),
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "beep",
      carrier: Math.max(0, params.carrier ?? 0),
      jitter: Math.max(0, Math.min(1, params.jitter ?? 0)),
      frame: Math.max(1, params.frame ?? 60),
      display: Math.max(0.01, Math.min(0.99, params.display ?? 0.7)),
      divClock: Math.max(0, params.divClock ?? 0),
      hiss: Math.max(0, Math.min(1, params.hiss ?? 0)),
      wow: Math.max(0, Math.min(0.5, params.wow ?? 0)),
      muffle: Math.max(0, params.muffle ?? 0)
    };
    if (params.env !== void 0) entry.defaultEnv = envIndex(params.env);
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerOPM(name, patch, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const meta = metaOf(opts);
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "opm",
      patch,
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat("worklet"))]
    };
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerOPLLVoice(name, spec, opts = {}) {
    const bytes = opllVoice(spec);
    return registerOPLL(name, 0, { ...opts, voice: bytes });
  }
  function registerOPLL(name, inst, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const meta = metaOf(opts);
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "opll",
      inst: Math.max(0, Math.min(15, Math.floor(inst))),
      // 打楽器は音色番号ではなく、リズムのどれを叩くかで決まる
      ...opts.drum ? { drum: String(opts.drum) } : {},
      // どの音色表か。0 = YM2413、1 = VRC7、2 = YMF281B
      ...opts.set > 0 ? { set: Math.floor(opts.set) } : {},
      // 自分で作った音色なら、レジスタ 0x00〜0x07 に書く 8 バイト
      ...opts.voice ? { voice: opts.voice } : {},
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat("worklet"))]
    };
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerBaked(name, opts = {}, flags = {}) {
    const at = requireFreeName(name, flags.overwrite);
    if (!opts.from) throw new Error("[ChpTnSnd] " + name + ": \u713C\u304F\u5143\u306E\u97F3\u8272(from)\u304C\u3042\u308A\u307E\u305B\u3093");
    const entry = {
      role: roleOf(opts.role, name),
      ...metaOf(opts),
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "baked",
      from: opts.from,
      octaves: opts.octaves || [2, 3, 4, 5, 6],
      step: opts.step || 1,
      sampleRate: opts.sampleRate || 22050,
      minLoop: opts.minLoop,
      baked: null,
      baking: false
    };
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerLayer(name, opts = {}, flags = {}) {
    const at = requireFreeName(name, flags.overwrite);
    const list = Array.isArray(opts.layers) ? opts.layers : [];
    if (list.length < 2) {
      throw new Error(`[ChpTnSnd] ${name}: \u5408\u6210\u97F3\u8272\u306F 2 \u3064\u4EE5\u4E0A\u3092\u91CD\u306D\u307E\u3059(1 \u3064\u3060\u3051\u306A\u3089\u3001\u305D\u306E\u97F3\u8272\u3092\u305D\u306E\u307E\u307E\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044)`);
    }
    const layers = list.map((m, i) => {
      const w = findWave(m.wave);
      if (w < 0) throw new Error(`[ChpTnSnd] ${name}: ${i} \u756A\u76EE\u306E\u97F3\u8272 "${m.wave}" \u306F\u77E5\u3089\u306A\u3044\u540D\u524D\u3067\u3059`);
      if (WAVEFORMS[w].kind === "layer") {
        throw new Error(`[ChpTnSnd] ${name}: \u5408\u6210\u97F3\u8272\u3092\u5408\u6210\u97F3\u8272\u306B\u91CD\u306D\u3089\u308C\u307E\u305B\u3093 ("${m.wave}")`);
      }
      const follow = m.follow == null ? true : !!m.follow;
      return {
        wave: w,
        gain: m.gain == null ? 1 : clamp(Number(m.gain), 0, 1),
        semi: m.semi == null ? 0 : Number(m.semi),
        cents: m.cents == null ? 0 : Number(m.cents),
        // 遅らせる(フレーム。60 分の 1 秒)。こだまを音色として持つときに使う
        delay: m.delay == null ? 0 : Math.max(0, Number(m.delay)),
        follow,
        env: m.env == null ? null : envIndex(m.env)
      };
    });
    const entry = {
      role: roleOf(opts.role, name),
      ...metaOf(opts),
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "layer",
      layers
    };
    const made = layers.map((m) => WAVEFORMS[m.wave].name).join(" + ");
    const n = layers.length;
    entry.noteJa = `\u5408\u6210\u97F3\u8272\u3002${made} \u3092\u91CD\u306D\u305F ${n} \u58F0\u3002` + (entry.noteJa || "");
    entry.note = `A layered voice \u2014 ${made}, ${n} voices.` + (entry.note ? " " + entry.note : "");
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function envIndex(v) {
    if (typeof v === "number") return clamp(v, 0, ENVELOPES.length - 1);
    const at = ENVELOPES.findIndex((e) => e.name.toLowerCase() === String(v).toLowerCase());
    return at >= 0 ? at : 0;
  }
  var clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  var SECTIONS = {
    // BASIC の BEEP で作っていた効果音。BEEP 音色が開く
    beep: {
      byKind: "beep",
      // 中身は待ち時間の並び。`1-60` のように数字で書く
      chars: [],
      digits: true,
      keys: {
        tick: { min: 1, max: 1e6 },
        // 以下 4 つは音色が持っている値の上書き。書かなければ音色のまま
        carrier: { min: 0, max: 2e4 },
        jitter: { min: 0, max: 1 },
        frame: { min: 1, max: 1e3 },
        display: { min: 0.01, max: 0.99 }
      }
    },
    // AY のブザー音。音色が開く(`@{ayBuzzSaw}{ ... }`)。
    //
    // 中の音符はブザーの高さ。`@g{+12}` を置くと、そこから先の音符に
    // 同じチャンネルの矩形波が重なる(数は半音)。実機はこの 2 つを掛け算する
    // ので、2 声にはならず、1 つの声の音色が変わる(docs/MML.md)。
    //
    // 前は `(c,e)4` と 2 つの高さを並べて書いていた。やめた理由は、
    // 平行に動かすのに毎回 2 つ書くことになるのと、絶対の高さで重ねたい
    // 場面が、旋律を別トラックに持つ `#pair` のほうへ移ったため(2026-09-26)。
    buzz: {
      byVoice: "buzz",
      chars: ["^"],
      notes: true,
      // `@g{+12}` で、そこから先の音符に重ねる矩形波の間隔(半音)。
      // 数を直に書かないので、読むところは主ループに置いてある
      keys: { g: { semi: true } }
    },
    // カセットのロード音。音色が開く(`@{tape(clean)}{ ... }`)
    tape: {
      byVoice: "tape",
      chars: ["=", "?"],
      // 音名を書いたら、その高さでデータ(`?`)を 1 つ置く。旋律はこれで書く
      notes: true,
      keys: {
        // 音名でも書ける(`@baud o2a`)。書いた音は `=`(パイロット)の高さになる
        baud: { min: 1, max: 1e6, note: true },
        seed: { min: 0, max: 1e9 },
        // 以下 3 つは音色が持っている値の上書き。書かなければ音色のまま
        hiss: { min: 0, max: 1 },
        wow: { min: 0, max: 1 },
        muffle: { min: 0, max: 2e4 },
        // `?` の中身。16 進の並びか `random`(既定)
        bytes: { hex: true }
      }
    }
  };
  var sectionByVoice = (wf) => {
    const sp = wf && wf.special || [];
    for (const [name, set] of Object.entries(SECTIONS)) {
      if (set.byVoice && sp.includes(set.byVoice)) return name;
    }
    for (const [name, set] of Object.entries(SECTIONS)) {
      if (set.byKind && wf && wf.kind === set.byKind) return name;
    }
    return null;
  };
  var REPORT = null;
  var LooseStop = class extends Error {
  };
  function modeOf(name) {
    const key2 = String(name ?? "normal").toLowerCase();
    return key2 === "strict" || key2 === "loose" ? key2 : "normal";
  }
  function keep(level, text) {
    if (!REPORT) return;
    REPORT.problems.push({ level, text: String(text).replace(/^\[[^\]]+\]\s*/, "") });
  }
  function warn(text) {
    keep("warn", text);
    const mode = REPORT ? REPORT.mode : "normal";
    if (mode === "strict") throw new Error(text);
    if (mode === "loose") return;
    console.warn(text);
  }
  function bad(text) {
    keep("error", text);
    if (REPORT && REPORT.mode === "loose") throw new LooseStop(text);
    throw new Error(text);
  }
  var SECTION_OF = {};
  for (const [name, set] of Object.entries(SECTIONS)) {
    for (const c of set.chars) SECTION_OF[c] = name;
  }
  var SEC_COMMON = ["l", "q", "v", "r", "o", ">", "<", "}"];
  var howOpen = (name) => `@{${SECTIONS[name].byVoice || name}\u2026}{ ... }`;
  function needSection(what, now) {
    const name = SECTION_OF[what];
    if (!name || now === name) return;
    bad(`[ChpTnSnd] MML: "${what}" \u306F ${howOpen(name)} \u306E\u4E2D\u3060\u3051\u3067\u66F8\u3051\u307E\u3059(\u5916\u306B\u66F8\u304F\u3068\u3001\u3069\u3061\u3089\u306E\u66F8\u304D\u65B9\u3067\u8AAD\u3080\u306E\u304B\u5206\u304B\u3089\u306A\u304F\u306A\u308A\u307E\u3059)`);
  }
  var LOOP_MAX_CHARS = 1 << 20;
  var isNameChar = (c) => c >= "a" && c <= "z" || c >= "0" && c <= "9" || c === "_" || c.charCodeAt(0) > 127;
  function expandMacros(src) {
    const table = /* @__PURE__ */ new Map();
    const wide = /* @__PURE__ */ new Set();
    let body = "";
    let i = 0;
    while (i < src.length) {
      if (src[i] !== "$") {
        body += src[i++];
        continue;
      }
      const at = i++;
      let name = "";
      while (i < src.length && isNameChar(src[i])) name += src[i++];
      let j = i;
      while (j < src.length && " \n	\r".includes(src[j])) j++;
      if (!name || src[j] !== "=") {
        body += src.slice(at, i);
        continue;
      }
      j++;
      while (j < src.length && " \n	\r".includes(src[j])) j++;
      if (src[j] !== "{") {
        warn(`[ChpTnSnd] MML: \u30DE\u30AF\u30ED "${name}" \u306E\u4E2D\u8EAB\u304C { } \u3067\u56F2\u307E\u308C\u3066\u3044\u307E\u305B\u3093`);
        body += src.slice(at, i);
        continue;
      }
      let depth = 0, k = j;
      for (; k < src.length; k++) {
        if (src[k] === "{") depth++;
        else if (src[k] === "}" && --depth === 0) break;
      }
      if (k >= src.length) {
        warn(`[ChpTnSnd] MML: \u30DE\u30AF\u30ED "${name}" \u306E } \u304C\u3042\u308A\u307E\u305B\u3093`);
        i = src.length;
        continue;
      }
      if (table.has(name)) warn(`[ChpTnSnd] MML: \u30DE\u30AF\u30ED "${name}" \u304C\u4E8C\u91CD\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059(\u5F8C\u306E\u307B\u3046\u3092\u4F7F\u3044\u307E\u3059)`);
      if (!wide.has(name) && [...name].some((c) => c.codePointAt(0) > 127)) {
        wide.add(name);
        warn(`[ChpTnSnd] MML: \u30DE\u30AF\u30ED "${name}" \u306E\u540D\u524D\u306B\u82F1\u6570\u5B57\u3067\u306A\u3044\u5B57\u304C\u5165\u3063\u3066\u3044\u307E\u3059(\u3044\u307E\u306F\u52D5\u304D\u307E\u3059\u304C\u3001\u3053\u308C\u304B\u3089\u5148\u306F a-z 0-9 _ \u3067\u66F8\u3044\u3066\u304F\u3060\u3055\u3044)`);
      }
      table.set(name, src.slice(j + 1, k).trim());
      i = k + 1;
    }
    const refsOf = (s) => {
      const out = [];
      for (let k = 0; k < s.length; k++) {
        if (s[k] !== "$") continue;
        let name = "";
        while (k + 1 < s.length && isNameChar(s[k + 1])) name += s[++k];
        if (name) out.push(name);
      }
      return out;
    };
    const state = /* @__PURE__ */ new Map();
    const path = [];
    const walk = (name) => {
      const st = state.get(name) || 0;
      if (st === 1) {
        const from = path.indexOf(name);
        const ring = [...path.slice(from < 0 ? 0 : from), name].map((n) => `$${n}`).join(" \u2192 ");
        bad(`[ChpTnSnd] MML: \u30DE\u30AF\u30ED "${name}" \u304C\u5FAA\u74B0\u53C2\u7167\u3057\u3066\u3044\u307E\u3059(${ring})\u3002\u5C55\u958B\u3057\u3066\u3082\u7D42\u308F\u3089\u306A\u3044\u306E\u3067\u3001\u3053\u3053\u3067\u6B62\u3081\u307E\u3059`);
      }
      if (st === 2) return;
      state.set(name, 1);
      path.push(name);
      for (const r of refsOf(table.get(name) || "")) if (table.has(r)) walk(r);
      path.pop();
      state.set(name, 2);
    };
    for (const k of [...table.keys()]) walk(k);
    const missing = /* @__PURE__ */ new Set();
    for (; ; ) {
      const at = body.indexOf("$");
      if (at < 0) break;
      let e = at + 1;
      let name = "";
      while (e < body.length && isNameChar(body[e])) name += body[e++];
      const hit = table.get(name);
      if (hit === void 0) {
        if (name && !missing.has(name)) {
          missing.add(name);
          warn(`[ChpTnSnd] MML: \u30DE\u30AF\u30ED "${name}" \u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093(\u3042\u308B\u306E\u306F ${[...table.keys()].join(" / ")})`);
        }
        body = body.slice(0, at) + body.slice(e);
        continue;
      }
      const next = body.slice(0, at) + hit + body.slice(e);
      if (next.length > LOOP_MAX_CHARS) {
        bad(`[ChpTnSnd] MML: \u30DE\u30AF\u30ED "${name}" \u304C\u5927\u304D\u3059\u304E\u307E\u3059(\u5E83\u3052\u308B\u3068 ${next.length} \u6587\u5B57\u3002\u4E0A\u9650\u306F ${LOOP_MAX_CHARS} \u6587\u5B57)`);
      }
      body = next;
    }
    return body;
  }
  var MARK_AT = "";
  var CUE_AT = "";
  var LOOP_LABEL = "loop";
  function isLoopMark(low) {
    return low === LOOP_LABEL;
  }
  var START_LABEL = "start";
  var OUTRO_LABEL = "outro";
  var OLD_OUTRO_LABEL = "ending";
  var saidOldOutro = false;
  function isOutroMark(low) {
    if (low === OUTRO_LABEL) return true;
    if (low !== OLD_OUTRO_LABEL) return false;
    if (!saidOldOutro) {
      saidOldOutro = true;
      warn('[ChpTnSnd] MML: \u30E9\u30D9\u30EB "ENDING" \u306F\u53E4\u3044\u540D\u524D\u3067\u3059\u3002\u3053\u308C\u304B\u3089\u306F "OUTRO" \u3068\u66F8\u304D\u307E\u3059(intro \u306E\u5BFE\u8A9E)\u3002\u3044\u307E\u306E\u3068\u3053\u308D ENDING \u3082\u305D\u306E\u307E\u307E\u8AAD\u307F\u307E\u3059');
    }
    return true;
  }
  function isSystemMark(name) {
    const low = String(name ?? "").trim().toLowerCase();
    return low === START_LABEL || low === LOOP_LABEL || low === OUTRO_LABEL || low === OLD_OUTRO_LABEL;
  }
  var HEAD_MARK = START_LABEL.toUpperCase();
  var SHOUTING = (name) => /^[A-Z0-9 _-]+$/.test(name) && /[A-Z]/.test(name);
  var CHORD_QUOTE = "'";
  function expandLoops(src) {
    for (; ; ) {
      const open = src.lastIndexOf("[");
      if (open < 0) break;
      const close = src.indexOf("]", open);
      if (close < 0) {
        src = src.slice(0, open) + src.slice(open + 1);
        continue;
      }
      const body = src.slice(open + 1, close);
      if (src[close + 1] === "*") {
        warn('[ChpTnSnd] MML: "]*" \u306F\u4F7F\u3048\u307E\u305B\u3093\u3002\u304F\u308A\u8FD4\u3059\u3068\u304D\u306B\u623B\u308B\u5148\u306F "#label LOOP" \u3067\u66F8\u304D\u307E\u3059(\u3053\u3053\u306F 1 \u56DE\u3060\u3051\u9CF4\u308A\u307E\u3059)');
        src = src.slice(0, open) + body + src.slice(close + 2);
        continue;
      }
      let numEnd = close + 1;
      while (numEnd < src.length && src[numEnd] >= "0" && src[numEnd] <= "9") numEnd++;
      const count = numEnd > close + 1 ? parseInt(src.slice(close + 1, numEnd), 10) : 2;
      if (count === 0) {
        src = src.slice(0, open) + src.slice(numEnd);
        continue;
      }
      const next = src.slice(0, open) + body.repeat(Math.max(0, count)) + src.slice(numEnd);
      if (next.length > LOOP_MAX_CHARS) {
        bad(`[ChpTnSnd] MML: \u304F\u308A\u8FD4\u3057\u304C\u5927\u304D\u3059\u304E\u307E\u3059(\u5E83\u3052\u308B\u3068 ${next.length} \u6587\u5B57\u3002\u4E0A\u9650\u306F ${LOOP_MAX_CHARS} \u6587\u5B57)`);
      }
      src = next;
    }
    return src.replace(/[\[\]]/g, "");
  }
  function readDirectives(mml) {
    const meta = {};
    const sections = [];
    for (const line of commentLines(String(mml ?? ""))) {
      const m = DIRECTIVE.exec(line);
      if (!m) continue;
      const key2 = m[1].toLowerCase();
      const val = m[2].trim();
      if (key2 === "section") {
        const sp = val.search(/\s/);
        const bar = Number(sp < 0 ? val : val.slice(0, sp));
        if (Number.isFinite(bar)) sections.push({ bar, name: sp < 0 ? "" : val.slice(sp).trim() });
      } else if (key2 === "takes" || key2 === "take") {
      } else if (key2 === "bundle" || key2 === "chord" || key2 === "drum" || key2 === "voice") {
      } else if (key2 === "group") {
        const words2 = val.split(/[ \t]+/).filter(Boolean);
        if (!words2.length) {
          warn('[ChpTnSnd] MML: "#group" \u306B\u540D\u524D\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u8AAD\u307F\u98DB\u3070\u3057\u307E\u3059');
          continue;
        }
        if (words2.length > 2) {
          warn(`[ChpTnSnd] MML: "#group ${val}" \u306F 3 \u6BB5\u4EE5\u4E0A\u3067\u3059\u30022 \u6BB5\u76EE\u307E\u3067("${words2[0]} ${words2[1]}")\u3092\u4F7F\u3044\u307E\u3059`);
        }
        for (const w of words2.slice(0, 2)) {
          if (SHOUTING(w)) {
            bad(`[ChpTnSnd] MML: \u30B0\u30EB\u30FC\u30D7\u540D "${w}" \u306F\u5168\u90E8\u5927\u6587\u5B57\u3067\u3059\u3002\u5927\u6587\u5B57\u306E\u540D\u524D\u306F\u4E88\u7D04\u8A9E\u306E\u305F\u3081\u306B\u7A7A\u3051\u3066\u3042\u308A\u307E\u3059(\u3044\u307E\u306E\u4E88\u7D04\u8A9E\u306F ALL)\u3002\u5C0F\u6587\u5B57\u3067\u66F8\u3044\u3066\u304F\u3060\u3055\u3044`);
          }
        }
        meta.group = words2[0];
        if (words2[1] !== void 0) meta.groupSet = words2[1];
      } else if (key2 === "tempo") {
        const n = Number(val);
        if (Number.isFinite(n) && n > 0) meta.tempo = n;
      } else if (key2 === "looptimes") {
        const n = Number(val);
        if (Number.isFinite(n) && n > 0) meta.loopTimes = Math.floor(n);
        else warn(`[ChpTnSnd] MML: #looptimes "${val}" \u306F\u6570\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u8AAD\u307F\u98DB\u3070\u3057\u307E\u3059`);
      } else if (val !== "") {
        if (STACKED.includes(key2) && meta[key2]) meta[key2] += `
${val}`;
        else meta[key2] = val;
      }
    }
    if (sections.length) meta.sections = sections;
    return meta;
  }
  var DIRECTIVE = /^[ \t*]*#[ \t]*([A-Za-z][\w-]*)[ \t]*(.*)$/;
  function readBundles(mml) {
    const out = /* @__PURE__ */ new Map();
    const seenText = /* @__PURE__ */ new Map();
    for (const line of commentLines(String(mml ?? ""))) {
      const m = BUNDLE_LINE.exec(line);
      if (!m) continue;
      const name = m[1].trim().toLowerCase();
      if (findWave(name) >= 0) {
        bad(`[ChpTnSnd] MML: \u30D0\u30F3\u30C9\u30EB\u97F3\u8272 "${name}" \u306F\u97F3\u8272\u306E\u540D\u524D\u3068\u540C\u3058\u3067\u3059(\u5225\u306E\u540D\u524D\u306B\u3057\u3066\u304F\u3060\u3055\u3044)`);
      }
      const raw = m[2].trim();
      if (out.has(name) && seenText.get(name) !== raw) {
        warn(`[ChpTnSnd] MML: \u30D0\u30F3\u30C9\u30EB\u97F3\u8272 "${name}" \u3092 2 \u5EA6\u66F8\u3044\u3066\u3044\u307E\u3059(\u5F8C\u306E\u307B\u3046\u3092\u4F7F\u3044\u307E\u3059)`);
      }
      seenText.set(name, raw);
      const parts = splitParts(m[2]);
      if (!parts.length) {
        bad(`[ChpTnSnd] MML: \u30D0\u30F3\u30C9\u30EB\u97F3\u8272 "${name}" \u306E\u4E2D\u8EAB\u304C\u3042\u308A\u307E\u305B\u3093`);
      }
      out.set(name, parts.map((t) => readBundlePart(name, t, out)));
    }
    return out;
  }
  var BUNDLE_LINE = /^[ \t*]*#[ \t]*bundle[ \t]+([A-Za-z][\w-]*)[ \t]*=[ \t]*(.*)$/i;
  var CHORD_LINE = /^[ \t*]*#[ \t]*chord[ \t]+([A-Za-z][\w-]*)[ \t]*=[ \t]*(.*)$/i;
  function readVoices(mml) {
    const out = /* @__PURE__ */ new Map();
    for (const line of commentLines(String(mml ?? ""))) {
      const m = VOICE_LINE.exec(line);
      if (!m) continue;
      const name = m[1].trim();
      const parts = splitParts(m[2]);
      if (!parts.length) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E\u4E2D\u8EAB\u304C\u3042\u308A\u307E\u305B\u3093`);
      }
      out.set(
        name.toLowerCase(),
        makeVoice(name, parts.map((t) => readVoicePart(name, t)))
      );
    }
    return out;
  }
  var VOICE_LINE = /^[ \t*]*#[ \t]*voice[ \t]+([A-Za-z][\w-]*)[ \t]*=[ \t]*(.*)$/i;
  var MML_VOICES = /* @__PURE__ */ new Set();
  var VOICE_PART = new RegExp([
    "@\\{(?<wave>[^}]*)\\}",
    "@e\\{(?<env>[^}]*)\\}",
    "@adsr\\{(?<adsr>[^}]*)\\}",
    "@arp\\{(?<arp>[^}]*)\\}",
    "@pitch\\{(?<pitch>[^}]*)\\}",
    "@vol\\{(?<vol>[^}]*)\\}",
    "@duty\\{(?<duty>[^}]*)\\}",
    "@loop\\{(?<loop>[^}]*)\\}",
    "@delay\\{(?<delay>[^}]*)\\}",
    "@gain\\{(?<gain>[^}]*)\\}",
    "@o(?<octave>[+-]?\\d+)",
    "@d(?<detune>[+-]?\\d+)",
    "\\s+"
  ].join("|"), "giy");
  function voiceNums(text, name, what) {
    const list = String(text).split(/[\s,]+/).filter(Boolean).map(Number);
    if (!list.length || list.some((v) => !Number.isFinite(v))) {
      bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @${what}{${text}} \u306F\u6570\u306E\u4E26\u3073\u3067\u66F8\u304D\u307E\u3059`);
    }
    return list;
  }
  function readVoicePart(name, text) {
    const part = {
      wave: null,
      env: null,
      adsr: null,
      arp: null,
      pitch: null,
      vol: null,
      duty: null,
      loop: {},
      delay: null,
      gain: null,
      octave: 0,
      detune: 0
    };
    let at = 0;
    while (at < text.length) {
      VOICE_PART.lastIndex = at;
      const m = VOICE_PART.exec(text);
      if (!m) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E "${text.slice(at)}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F @{\u97F3\u8272} @e{\u5F62} @adsr @arp @pitch @vol @duty @loop @delay @gain @o @d \u3060\u3051\u3067\u3059)`);
      }
      at = VOICE_PART.lastIndex;
      const g = m.groups;
      if (g.wave !== void 0) {
        part.wave = g.wave.trim();
        continue;
      }
      if (g.env !== void 0) {
        part.env = g.env.trim();
        continue;
      }
      if (g.adsr !== void 0) {
        const n = voiceNums(g.adsr, name, "adsr");
        if (n.length !== 4) {
          bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @adsr \u306F 4 \u3064\u3067\u3059(\u7ACB\u3061\u4E0A\u304C\u308A, \u6E1B\u308A, \u4F38\u3070\u3059\u9AD8\u3055, \u96E2\u3057\u3002${n.length} \u500B\u3042\u308A\u307E\u3057\u305F)`);
        }
        part.adsr = { a: n[0], d: n[1], s: n[2], r: n[3] };
        continue;
      }
      if (g.arp !== void 0) {
        part.arp = voiceNums(g.arp, name, "arp");
        continue;
      }
      if (g.pitch !== void 0) {
        part.pitch = voiceNums(g.pitch, name, "pitch");
        continue;
      }
      if (g.vol !== void 0) {
        part.vol = voiceNums(g.vol, name, "vol");
        continue;
      }
      if (g.duty !== void 0) {
        part.duty = voiceNums(g.duty, name, "duty");
        continue;
      }
      if (g.loop !== void 0) {
        for (const one of String(g.loop).split(",")) {
          const w = one.trim().split(/\s+/).filter(Boolean);
          if (w.length !== 2 || !TABLE_NAMES.includes(w[0].toLowerCase()) || !Number.isInteger(Number(w[1]))) {
            bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @loop{${g.loop}} \u306F\u300C\u8868\u306E\u540D\u524D \u623B\u308B\u5148\u300D\u3067\u66F8\u304D\u307E\u3059(\u8868\u306F ${TABLE_NAMES.join(" ")})`);
          }
          part.loop[w[0].toLowerCase()] = Number(w[1]);
        }
        continue;
      }
      if (g.delay !== void 0) {
        part.delay = voiceNums(g.delay, name, "delay")[0];
        continue;
      }
      if (g.gain !== void 0) {
        part.gain = voiceNums(g.gain, name, "gain")[0];
        continue;
      }
      if (g.octave !== void 0) {
        part.octave = clamp(Number(g.octave), -4, 4);
        continue;
      }
      if (g.detune !== void 0) {
        part.detune = clamp(Number(g.detune), -2400, 2400);
        continue;
      }
    }
    return part;
  }
  var TABLE_NAMES = ["arp", "pitch", "vol", "duty"];
  function refuse(name, part, keys, why) {
    for (const k of keys) {
      const v = part[k];
      const wrote = k === "loop" ? Object.keys(v).length > 0 : k === "octave" || k === "detune" ? v !== 0 : v !== null;
      if (wrote) bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306B @${k} \u306F\u66F8\u3051\u307E\u305B\u3093(${why})`);
    }
  }
  function tellIfTaken(name, taken, what) {
    const key2 = String(name).toLowerCase();
    if (taken && !MML_VOICES.has(key2)) {
      warn(`[ChpTnSnd] MML: ${what} "${name}" \u306F\u3082\u3046\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u3053\u306E\u66F2\u306E\u3042\u3044\u3060\u306F #voice \u306B\u66F8\u3044\u305F\u307B\u3046\u3067\u9CF4\u308A\u307E\u3059`);
    }
    MML_VOICES.add(key2);
  }
  function makeVoice(name, parts) {
    if (parts.length === 1) {
      const p = parts[0];
      if (p.wave === null) {
        if (!p.adsr) {
          bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306B\u97F3\u8272\u304C\u3042\u308A\u307E\u305B\u3093(@{\u540D\u524D} \u3092\u66F8\u304F\u304B\u3001@adsr{\u2026} \u3060\u3051\u3092\u66F8\u3044\u3066\u304F\u3060\u3055\u3044)`);
        }
        refuse(name, p, [
          "env",
          "arp",
          "pitch",
          "vol",
          "duty",
          "loop",
          "delay",
          "gain",
          "octave",
          "detune"
        ], "\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u306B\u306F @adsr \u3060\u3051\u66F8\u3051\u307E\u3059");
        tellIfTaken(
          name,
          ENVELOPES.some((e) => e.name.toLowerCase() === name.toLowerCase()),
          "\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7"
        );
        registerEnvelope(name, { ...p.adsr, overwrite: true });
        return "env";
      }
      refuse(
        name,
        p,
        ["adsr", "delay", "gain", "octave", "detune"],
        "@adsr \u306F\u5225\u306E #voice \u306B\u3001@delay @gain @o @d \u306F\u91CD\u306D\u305F\u3068\u304D\u3060\u3051\u66F8\u3051\u307E\u3059"
      );
      tellIfTaken(name, findWave(name) >= 0, "\u97F3\u8272");
      registerTone(name, {
        wave: p.wave,
        ...p.env ? { env: p.env } : {},
        arp: p.arp,
        pitch: p.pitch,
        vol: p.vol,
        duty: p.duty,
        loop: p.loop,
        overwrite: true
      });
      return "tone";
    }
    const layers = parts.map((p) => {
      if (p.wave === null) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E\u91CD\u306D\u308B\u4E2D\u8EAB\u306B @{\u540D\u524D} \u304C\u3042\u308A\u307E\u305B\u3093`);
      }
      refuse(
        name,
        p,
        ["adsr", "arp", "pitch", "vol", "duty", "loop"],
        "\u91CD\u306D\u308B\u4E2D\u8EAB\u306B\u8868\u306F\u66F8\u3051\u307E\u305B\u3093\u3002\u8868\u3092\u7740\u305B\u305F\u97F3\u8272\u3092\u5148\u306B #voice \u3067\u4F5C\u3063\u3066\u304F\u3060\u3055\u3044"
      );
      return {
        wave: p.wave,
        ...p.env ? { env: p.env } : {},
        ...p.gain === null ? {} : { gain: p.gain },
        ...p.delay === null ? {} : { delay: p.delay },
        semi: p.octave * 12,
        cents: p.detune
      };
    });
    tellIfTaken(name, findWave(name) >= 0, "\u97F3\u8272");
    registerLayer(name, { layers }, { overwrite: true });
    return "layer";
  }
  function readChordSets(mml, bundles = readBundles(mml)) {
    const out = /* @__PURE__ */ new Map();
    const seenText = /* @__PURE__ */ new Map();
    for (const line of commentLines(String(mml ?? ""))) {
      const m = CHORD_LINE.exec(line);
      if (!m) continue;
      const name = m[1].trim().toLowerCase();
      if (findWave(name) >= 0 || bundles.has(name)) {
        bad(`[ChpTnSnd] MML: \u548C\u97F3\u306E\u697D\u5668 "${name}" \u306F\u97F3\u8272\u306E\u540D\u524D\u3068\u540C\u3058\u3067\u3059(\u5225\u306E\u540D\u524D\u306B\u3057\u3066\u304F\u3060\u3055\u3044)`);
      }
      const raw = m[2].trim();
      if (out.has(name) && seenText.get(name) !== raw) {
        warn(`[ChpTnSnd] MML: \u548C\u97F3\u306E\u697D\u5668 "${name}" \u3092 2 \u5EA6\u66F8\u3044\u3066\u3044\u307E\u3059(\u5F8C\u306E\u307B\u3046\u3092\u4F7F\u3044\u307E\u3059)`);
      }
      seenText.set(name, raw);
      const parts = splitParts(m[2]);
      if (!parts.length) bad(`[ChpTnSnd] MML: \u548C\u97F3\u306E\u697D\u5668 "${name}" \u306E\u4E2D\u8EAB\u304C\u3042\u308A\u307E\u305B\u3093`);
      out.set(name, parts.map((t) => readChordVoice(name, t, bundles)));
    }
    return out;
  }
  function readChordVoice(name, text, bundles) {
    const m = /^@\{([^}]*)\}[ \t]*(.*)$/.exec(text.trim());
    if (!m) {
      bad(`[ChpTnSnd] MML: \u548C\u97F3\u306E\u697D\u5668 "${name}" \u306E "${text.trim()}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F @{\u540D\u524D} \u3068\u547C\u3073\u540D\u3060\u3051\u3067\u3059\u3002\u97F3\u91CF\u3084\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u306F\u3001\u305D\u306E\u97F3\u8272\u306E\u5074\u306B\u6301\u305F\u305B\u307E\u3059)`);
    }
    const key2 = m[1].trim().toLowerCase();
    const lane = m[1].trim();
    const label = looksLikeSetting(m[2].trim()) ? bad(`[ChpTnSnd] MML: \u548C\u97F3\u306E\u697D\u5668 "${name}" \u306E "${m[2].trim()}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u97F3\u91CF\u3084\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u306F\u3001\u305D\u306E\u97F3\u8272\u306E\u5074\u306B\u6301\u305F\u305B\u307E\u3059\u3002\u3046\u3057\u308D\u306B\u66F8\u3051\u308B\u306E\u306F\u547C\u3073\u540D\u3060\u3051\u3067\u3059)`) : m[2].trim() || lane;
    if (bundles.has(key2)) return { parts: bundles.get(key2), lane, label };
    const w = findWave(key2);
    if (w < 0) {
      bad(`[ChpTnSnd] MML: \u548C\u97F3\u306E\u697D\u5668 "${name}" \u306E "${m[1].trim()}" \u306F\u77E5\u3089\u306A\u3044\u540D\u524D\u3067\u3059`);
    }
    return { parts: [{
      wave: w,
      vol: null,
      gate: null,
      env: null,
      octave: 0,
      detune: 0,
      echo: void 0
    }], lane, label };
  }
  function looksLikeSetting(text) {
    return /^@/.test(text) || /^[A-Za-z][+-]?\d/.test(text);
  }
  var DRUM_LINE = /^[ \t*]*#[ \t]*drum[ \t]+([A-Za-z][A-Za-z0-9]*)[ \t]*=[ \t]*(.*)$/i;
  var DRUM_OPEN = /@\{[ \t]*drums\b([^}]*)\}[ \t]*\{/i;
  var DRUM_MIDI = 60;
  function envRunLen(env, fallback) {
    const e = ENVELOPES[env];
    if (!e) return fallback;
    if (Array.isArray(e.table)) {
      return e.loop === null || e.loop === void 0 ? Math.max(fallback, e.table.length / 60) : fallback;
    }
    if (!(e.s === 0)) return fallback;
    const sec = (v) => envSec(v, fallback);
    return Math.max(fallback, sec(e.a) + sec(e.d) + sec(e.r));
  }
  function readDrums(raw, bundles = readBundles(raw)) {
    const mml = normalizeDirectives(raw);
    const outer = /* @__PURE__ */ new Map();
    const scopes = [];
    let depth = 0;
    for (const raw2 of String(mml ?? "").split("\n")) {
      const cut = raw2.indexOf("//");
      const code = cut < 0 ? raw2 : raw2.slice(0, cut);
      const note = cut < 0 ? "" : raw2.slice(cut + 2);
      const m = DRUM_LINE.exec(note);
      if (m) {
        const name = m[1].trim();
        const into = depth > 0 ? scopes[scopes.length - 1] : outer;
        into.set(name, readDrumPart(name, m[2], bundles));
      }
      let i = 0;
      while (i < code.length) {
        if (depth === 0) {
          const om = DRUM_OPEN.exec(code.slice(i));
          if (!om) break;
          i += om.index + om[0].length;
          depth = 1;
          scopes.push(/* @__PURE__ */ new Map());
        } else {
          const c = code[i++];
          if (c === "{") depth++;
          else if (c === "}") depth--;
        }
      }
    }
    return { outer, scopes };
  }
  function readDrumPart(name, text, bundles) {
    const t = String(text).trim();
    const m = /^@\{([^}]*)\}[ \t]*(?:v[ \t]*(\d+)\b)?[ \t]*(?:!([A-Za-z_]\w*)(?:[ \t]+(-?\d+))?)?[ \t]*(.*)$/.exec(t);
    if (!m) {
      bad(`[ChpTnSnd] MML: \u30C9\u30E9\u30E0 "${name}" \u306E "${t}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F @{\u540D\u524D} \u3068 v \u3068\u5408\u56F3\u3068\u547C\u3073\u540D\u3060\u3051\u3067\u3059\u3002\u9577\u3055\u3068\u9AD8\u3055\u306F\u66F8\u304D\u307E\u305B\u3093)`);
    }
    const key2 = m[1].trim().toLowerCase();
    const vol = m[2] === void 0 ? null : clamp(parseInt(m[2], 10), 0, 15);
    const cue = m[3] ? { name: m[3], arg: m[4] === void 0 ? 0 : parseInt(m[4], 10) } : null;
    const label = looksLikeSetting(m[5].trim()) ? bad(`[ChpTnSnd] MML: \u30C9\u30E9\u30E0 "${name}" \u306E "${m[5].trim()}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u9577\u3055\u3068\u9AD8\u3055\u306F\u66F8\u304D\u307E\u305B\u3093\u3002\u3046\u3057\u308D\u306B\u66F8\u3051\u308B\u306E\u306F\u547C\u3073\u540D\u3060\u3051\u3067\u3059)`) : m[5].trim() || m[1].trim();
    if (bundles.has(key2)) return { parts: bundles.get(key2), vol, label, cue };
    const w = findWave(key2);
    if (w < 0) {
      bad(`[ChpTnSnd] MML: \u30C9\u30E9\u30E0 "${name}" \u306E "${m[1].trim()}" \u306F\u77E5\u3089\u306A\u3044\u540D\u524D\u3067\u3059`);
    }
    return { parts: [{
      wave: w,
      vol: null,
      gate: null,
      env: null,
      octave: 0,
      detune: 0,
      echo: void 0
    }], vol, label, cue };
  }
  function spaceDrumRepeats(src) {
    const text = String(src);
    const keep2 = drumRanges(text);
    if (!keep2.length) return text;
    keep2.sort((a, b) => a[0] - b[0]);
    let out = "", at = 0;
    for (const [s, e] of keep2) {
      if (s < at) continue;
      out += text.slice(at, s) + text.slice(s, e).replace(/\[/g, "[ ").replace(/\]/g, " ]");
      at = e;
    }
    return out + text.slice(at);
  }
  function lowerOutsideDrums(src) {
    const text = String(src);
    const keep2 = drumRanges(text);
    if (!keep2.length) return text.toLowerCase();
    keep2.sort((a, b) => a[0] - b[0]);
    let out = "", at = 0;
    for (const [s, e] of keep2) {
      if (s < at) continue;
      out += text.slice(at, s).toLowerCase() + text.slice(s, e);
      at = e;
    }
    return out + text.slice(at).toLowerCase();
  }
  function drumRanges(text) {
    const out = [];
    const macros = macroBodies(text);
    const want = /* @__PURE__ */ new Set();
    const re = new RegExp(DRUM_OPEN.source, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      const from = m.index + m[0].length;
      let depth = 1, i = from;
      for (; i < text.length && depth > 0; i++) {
        if (text[i] === "{") depth++;
        else if (text[i] === "}") depth--;
      }
      out.push([from, i - 1]);
      for (const name of text.slice(from, i - 1).match(/\$[A-Za-z_][\w]*/g) || []) {
        want.add(name.slice(1));
      }
      re.lastIndex = i;
    }
    const seen = /* @__PURE__ */ new Set();
    while (want.size) {
      const name = want.values().next().value;
      want.delete(name);
      if (seen.has(name) || !macros.has(name)) continue;
      seen.add(name);
      const [s, e] = macros.get(name);
      out.push([s, e]);
      for (const n of text.slice(s, e).match(/\$[A-Za-z_][\w]*/g) || []) want.add(n.slice(1));
    }
    return out;
  }
  function outerDrumLines(text) {
    const out = [];
    let depth = 0;
    for (const raw of String(text ?? "").split("\n")) {
      const cut = raw.indexOf("//");
      const code = cut < 0 ? raw : raw.slice(0, cut);
      const note = cut < 0 ? "" : raw.slice(cut + 2);
      if (depth === 0 && DRUM_LINE.test(note)) out.push(note);
      let i = 0;
      while (i < code.length) {
        if (depth === 0) {
          const om = DRUM_OPEN.exec(code.slice(i));
          if (!om) break;
          i += om.index + om[0].length;
          depth = 1;
        } else {
          const c = code[i++];
          if (c === "{") depth++;
          else if (c === "}") depth--;
        }
      }
    }
    return out;
  }
  function macroBodies(text) {
    const out = /* @__PURE__ */ new Map();
    const re = /\$([A-Za-z_][\w]*)[ \t\n\r]*=[ \t\n\r]*\{/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const from = m.index + m[0].length;
      let depth = 1, i = from;
      for (; i < text.length && depth > 0; i++) {
        if (text[i] === "{") depth++;
        else if (text[i] === "}") depth--;
      }
      out.set(m[1], [from, i - 1]);
      re.lastIndex = i;
    }
    return out;
  }
  function shareBundles(raw) {
    const voices = (raw || []).map((v) => normalizeDirectives(v));
    const lines = [];
    for (const v of voices) {
      for (const line of commentLines(String(v ?? ""))) {
        if (BUNDLE_LINE.test(line) || VOICE_LINE.test(line)) lines.push("//" + line);
      }
      for (const line of outerDrumLines(String(v ?? ""))) lines.push("//" + line);
    }
    if (!lines.length) return voices;
    const head = lines.join("\n") + "\n";
    return voices.map((v) => head + String(v ?? ""));
  }
  function splitParts(text) {
    const out = [];
    let buf = "", depth = 0;
    for (const c of String(text)) {
      if (c === "{") depth++;
      else if (c === "}") depth = Math.max(0, depth - 1);
      if (c === "," && depth === 0) {
        out.push(buf);
        buf = "";
        continue;
      }
      buf += c;
    }
    out.push(buf);
    return out.map((t) => t.trim()).filter(Boolean);
  }
  function readBundlePart(name, text, seen) {
    const part = {
      wave: -1,
      vol: null,
      gate: null,
      env: null,
      octave: 0,
      detune: 0,
      echo: void 0,
      vsteps: null,
      vcurve: null
    };
    let at = 0;
    while (at < text.length) {
      BUNDLE_PART.lastIndex = at;
      const m = BUNDLE_PART.exec(text);
      if (!m) {
        bad(`[ChpTnSnd] MML: \u30D0\u30F3\u30C9\u30EB\u97F3\u8272 "${name}" \u306E "${text.slice(at)}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F @{\u97F3\u8272} @e{\u5F62} v q @o @d @s @vsteps @vcurve \u3060\u3051\u3067\u3059)`);
      }
      at = BUNDLE_PART.lastIndex;
      const g = m.groups;
      const echoLen = g.echoLen ?? g.echoLen2;
      if (echoLen !== void 0) {
        const len = Number(echoLen);
        part.echo = len > 0 ? { len, depth: g.echoDepth ? clamp(Number(g.echoDepth), 1, 9) : 5 } : null;
        continue;
      }
      if (g.env !== void 0) {
        part.env = envIndex(g.env.trim());
        continue;
      }
      if (g.wave !== void 0) {
        const key2 = g.wave.trim().toLowerCase();
        if (seen.has(key2)) {
          bad(`[ChpTnSnd] MML: \u30D0\u30F3\u30C9\u30EB\u97F3\u8272 "${name}" \u306B\u30D0\u30F3\u30C9\u30EB\u97F3\u8272 "${key2}" \u306F\u5165\u308C\u3089\u308C\u307E\u305B\u3093`);
        }
        const w = findWave(key2);
        if (w < 0) {
          bad(`[ChpTnSnd] MML: \u30D0\u30F3\u30C9\u30EB\u97F3\u8272 "${name}" \u306E\u97F3\u8272 "${g.wave.trim()}" \u306F\u77E5\u3089\u306A\u3044\u540D\u524D\u3067\u3059`);
        }
        if (WAVEFORMS[w].kind === "layer") {
          bad(`[ChpTnSnd] MML: \u30D0\u30F3\u30C9\u30EB\u97F3\u8272 "${name}" \u306B\u5408\u6210\u97F3\u8272 "${WAVEFORMS[w].name}" \u306F\u5165\u308C\u3089\u308C\u307E\u305B\u3093(\u5408\u6210\u97F3\u8272\u306F\u305D\u306E\u307E\u307E\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044)`);
        }
        part.wave = w;
        continue;
      }
      if (g.octave !== void 0) {
        part.octave = clamp(Number(g.octave), -4, 4);
        continue;
      }
      if (g.detune !== void 0) {
        part.detune = clamp(Number(g.detune), -2400, 2400);
        continue;
      }
      if (g.vsteps !== void 0) {
        part.vsteps = vstepsOf(g.vsteps);
        continue;
      }
      if (g.vcurve !== void 0) {
        part.vcurve = vcurveOf(g.vcurve.trim());
        continue;
      }
      if (g.vol !== void 0) {
        part.vol = clamp(Number(g.vol), 0, 15);
        continue;
      }
      if (g.gate !== void 0) {
        part.gate = clamp(Number(g.gate), 0, 8);
        continue;
      }
    }
    if (part.wave < 0) {
      bad(`[ChpTnSnd] MML: \u30D0\u30F3\u30C9\u30EB\u97F3\u8272 "${name}" \u306E "${text}" \u306B\u97F3\u8272\u304C\u3042\u308A\u307E\u305B\u3093(@{\u540D\u524D} \u3092\u66F8\u3044\u3066\u304F\u3060\u3055\u3044)`);
    }
    return part;
  }
  var BUNDLE_PART = new RegExp([
    "@\\{(?<wave>[^}]*)\\}",
    "@e\\{(?<env>[^}]*)\\}",
    "@s\\{(?<echoLen>\\d+)(?:,(?<echoDepth>\\d+))?\\}",
    "@s(?<echoLen2>\\d+)",
    "@o(?<octave>[+-]?\\d+)",
    "@d(?<detune>[+-]?\\d+)",
    "@vsteps\\{(?<vsteps>\\d+)\\}",
    "@vcurve\\{(?<vcurve>[^}]*)\\}",
    "v(?<vol>\\d+)",
    "q(?<gate>\\d+)",
    "\\s+"
  ].join("|"), "giy");
  var SONG_WIDE = ["title", "tempo", "meter", "about", "loopTimes"];
  var STACKED = ["about"];
  function splitVoices(raw) {
    const text = normalizeDirectives(raw);
    const lines = text.split(/\r?\n/);
    const isMark = (line) => /^\s*\/\/\s*#\s*ch(\s|$)/i.test(line);
    const at = lines.map((l, i) => isMark(l) ? i : -1).filter((i) => i >= 0);
    const whole = text.trim();
    if (at.length === 0) return whole ? [whole] : [];
    const head = lines.slice(0, at[0]).filter((l) => /^\s*\/\//.test(l));
    const out = [];
    for (let i = 0; i < at.length; i++) {
      const body = lines.slice(at[i], at[i + 1] ?? lines.length);
      out.push([...head, ...body].join("\n").trim());
    }
    return out.filter(Boolean);
  }
  var BARE_DIRECTIVE = /^([ \t]*)#/;
  function normalizeDirectives(src) {
    const text = String(src ?? "");
    if (!/^[ \t]*#/m.test(text)) return text;
    const out = [];
    let inBlock = false;
    for (const line of text.split("\n")) {
      out.push(!inBlock && BARE_DIRECTIVE.test(line) ? line.replace(BARE_DIRECTIVE, "$1// #") : line);
      let i = 0;
      while (i < line.length) {
        if (!inBlock && line[i] === "/" && line[i + 1] === "*") {
          inBlock = true;
          i += 2;
          continue;
        }
        if (inBlock && line[i] === "*" && line[i + 1] === "/") {
          inBlock = false;
          i += 2;
          continue;
        }
        i++;
      }
    }
    return out.join("\n");
  }
  function countOldStyle(src) {
    return (String(src ?? "").match(/^[ \t]*\/\/[ \t]*#/gm) || []).length;
  }
  function commentLines(raw) {
    const src = normalizeDirectives(raw);
    const out = [];
    for (let i = 0; i < src.length; i++) {
      if (src[i] === "/" && src[i + 1] === "/") {
        let j = i + 2;
        while (j < src.length && src[j] !== "\n") j++;
        out.push(src.slice(i + 2, j));
        i = j;
      } else if (src[i] === "/" && src[i + 1] === "*") {
        const end = src.indexOf("*/", i + 2);
        i = end < 0 ? src.length : end + 1;
      }
    }
    return out;
  }
  function stripComments(raw, names = [], cues = []) {
    const src = normalizeDirectives(raw);
    const LABEL = /^\s*#\s*label\b[ \t]*(.*)$/i;
    const CUE = /^\s*#\s*cue\b[ \t]*(.*)$/i;
    let out = "";
    let headOfLine = true;
    for (let i = 0; i < src.length; i++) {
      if (src[i] === "/" && src[i + 1] === "/") {
        let j = i + 2;
        while (j < src.length && src[j] !== "\n") j++;
        const body = src.slice(i + 2, j);
        const m = LABEL.exec(body);
        const c = CUE.exec(body);
        if (m && headOfLine) {
          names.push(m[1].trim());
          out += `${MARK_AT}${names.length - 1}${MARK_AT}`;
        } else if (m) {
          warn(`[ChpTnSnd] MML: \u30E9\u30D9\u30EB "${m[1].trim()}" \u306F\u884C\u982D\u306B\u66F8\u304D\u307E\u3059 (\u97F3\u7B26\u306E\u5F8C\u308D\u306B\u66F8\u3044\u305F\u3082\u306E\u306F\u52B9\u304D\u307E\u305B\u3093)`);
        } else if (c && headOfLine) {
          cues.push(c[1].trim());
          out += `${CUE_AT}${cues.length - 1}${CUE_AT}`;
        } else if (c) {
          warn(`[ChpTnSnd] MML: \u5408\u56F3 "${c[1].trim()}" \u306F\u884C\u982D\u306B\u66F8\u304D\u307E\u3059 (\u97F3\u7B26\u306E\u5F8C\u308D\u306B\u66F8\u3044\u305F\u3082\u306E\u306F\u52B9\u304D\u307E\u305B\u3093)`);
        }
        i = j - 1;
        out += "\n";
        headOfLine = true;
      } else if (src[i] === "/" && src[i + 1] === "*") {
        const end = src.indexOf("*/", i + 2);
        const stop = end < 0 ? src.length : end + 2;
        for (let k = i; k < stop; k++) if (src[k] === "\n") out += "\n";
        i = stop - 1;
      } else {
        if (src[i] === "\n") headOfLine = true;
        else if (!" 	\r".includes(src[i])) headOfLine = false;
        out += src[i];
      }
    }
    return out;
  }
  function readCueNames(src) {
    const table = /* @__PURE__ */ new Map();
    let body = "";
    let i = 0;
    while (i < src.length) {
      if (src[i] !== "!") {
        body += src[i++];
        continue;
      }
      const at = i++;
      let name = "";
      while (i < src.length && isNameChar(src[i])) name += src[i++];
      let j = i;
      while (j < src.length && " \n	\r".includes(src[j])) j++;
      if (!name || src[j] !== "=") {
        body += src.slice(at, i);
        continue;
      }
      j++;
      while (j < src.length && " \n	\r".includes(src[j])) j++;
      if (src[j] !== "{") {
        bad(`[ChpTnSnd] MML: \u5408\u56F3 "!${name}" \u306E\u4E2D\u8EAB\u304C { } \u3067\u56F2\u307E\u308C\u3066\u3044\u307E\u305B\u3093`);
      }
      const k = src.indexOf("}", j);
      if (k < 0) bad(`[ChpTnSnd] MML: \u5408\u56F3 "!${name}" \u306E } \u304C\u3042\u308A\u307E\u305B\u3093`);
      const [word, ...rest] = src.slice(j + 1, k).trim().split(/\s+/);
      if (!word) bad(`[ChpTnSnd] MML: \u5408\u56F3 "!${name}" \u306E\u4E2D\u8EAB\u304C\u7A7A\u3067\u3059`);
      if (word === name) {
        bad(`[ChpTnSnd] MML: \u5408\u56F3 "!${name}" \u3092\u540C\u3058\u540D\u524D\u3078\u767B\u9332\u3057\u3066\u3044\u307E\u3059(\u77ED\u3044\u540D\u524D\u3092\u4ED8\u3051\u308B\u305F\u3081\u306E\u66F8\u304D\u65B9\u3067\u3059)`);
      }
      const num = Number(rest[0]);
      table.set(name, { name: word, arg: Number.isFinite(num) ? num : 0 });
      i = k + 1;
    }
    return { body, table };
  }
  function compileOne(mml, again = null) {
    const meta = readDirectives(mml);
    readVoices(mml);
    const bundles = readBundles(mml);
    const chordSets = readChordSets(mml, bundles);
    const drums = readDrums(mml, bundles);
    const markNames = [];
    const cueNames = [];
    const expanded = expandLoops(expandMacros(spaceDrumRepeats(
      lowerOutsideDrums(stripComments(String(mml), markNames, cueNames))
    )));
    const { body: src, table: cueTable } = readCueNames(expanded);
    let pos = 0;
    let octave = 4, defLen = 4, tempo = 120, vol = 10, gate = 7;
    let wave = findWave(DEFAULT_WAVE), env = 0, vibrato = 0;
    let vibSpeed = null, vibDelay = null, vibSaid = false;
    let detune = 0, octShift = 0;
    let echo = null;
    let fade = null;
    if (again && again.head) fade = { t0: 0, t1: 0, from: again.level, to: again.level };
    const volLog = [];
    const volLogAt = /* @__PURE__ */ new Map();
    let saidFixed = false;
    const fadeAt = (f, t) => {
      if (t >= f.t1) return f.to;
      if (t <= f.t0) return f.from;
      return f.from + (f.to - f.from) * (t - f.t0) / (f.t1 - f.t0);
    };
    const bendAt = (e, age, then) => {
      const pts = (e.fade || []).filter((p) => p[0] < age - 1e-9);
      pts.push([age, fadeVolOf(e, age)]);
      if (then) pts.push(then);
      e.fade = pts;
    };
    const fadeVolOf = (e, age) => {
      const pts = e.fade;
      if (!pts || !pts.length || age <= pts[0][0]) return e.vol;
      for (let i = 1; i < pts.length; i++) {
        if (age <= pts[i][0]) {
          const [a0, v0] = pts[i - 1], [a1, v1] = pts[i];
          return a1 > a0 ? v0 + (v1 - v0) * (age - a0) / (a1 - a0) : v1;
        }
      }
      return pts[pts.length - 1][1];
    };
    const lastSounding = () => {
      const out = [];
      const t = events.length ? events[events.length - 1].t : null;
      for (let i = events.length - 1; i >= 0 && events[i].t === t; i--) {
        if (written.has(events[i])) out.push(events[i]);
      }
      return out;
    };
    const written = /* @__PURE__ */ new WeakMap();
    let px = 0, py = 0, pz = 0, muted = 0;
    let bundle = null;
    let chordSet = null;
    let lane = null;
    let bundleSeq = 0;
    let tapeSeq = 0;
    let section = null;
    let sec = {};
    let time = 0;
    const events = [];
    const marks = [];
    const bars = [];
    const cues = [];
    const pushNote = (dur, freq, extra) => {
      if (!bundle) {
        const ev = oneNote(dur, freq, null, extra);
        events.push(ev);
        lastNote = { freq, parts: [{ ev, shift: shiftOf(null) }] };
        return;
      }
      const id = bundleSeq++;
      const parts = [];
      bundle.forEach((m, i) => {
        const ev = oneNote(dur, freq, m, { bundle: id, part: i, ...extra });
        events.push(ev);
        parts.push({ ev, shift: shiftOf(m) });
      });
      lastNote = { freq, parts };
    };
    let lastNote = null;
    const shiftOf = (m) => Math.pow(
      2,
      octShift + (m ? m.octave : 0) + (detune + (m ? m.detune : 0)) / 1200
    );
    const oneNote = (dur, freq, m, extra) => {
      const shift = shiftOf(m);
      const g = m && m.gate !== null ? m.gate : gate;
      const base = m && m.vol !== null ? m.vol : vol;
      let v = base;
      let fd = null;
      if (fade) {
        v = base * fadeAt(fade, time) / 15;
        if (time < fade.t1 - 1e-9) fd = [[0, v], [fade.t1 - time, base * fade.to / 15]];
      }
      const ev = m && m.env !== null ? m.env : env;
      const hold = inDrums ? envRunLen(ev, dur * g / 8) : dur * g / 8;
      const ec = m && m.echo !== void 0 ? m.echo && { delay: 240 / tempo / m.echo.len, depth: m.echo.depth } : echo;
      if (fd && !saidFixed) {
        const w = WAVEFORMS[m ? m.wave : wave] || {};
        if ((m && m.vsteps !== null ? m.vsteps : w.vsteps) === 1) {
          saidFixed = true;
          warn(`[ChpTnSnd] MML: \u97F3\u8272 "${w.name}" \u306F\u97F3\u91CF\u3092\u53D7\u3051\u4ED8\u3051\u307E\u305B\u3093(vsteps: 1)\u3002"@fade" \u306F\u52B9\u304D\u307E\u305B\u3093`);
        }
      }
      const note = {
        t: time,
        dur,
        gate: hold,
        freq: freq * shift,
        vol: muted ? 0 : v,
        wave: m ? m.wave : wave,
        env: ev,
        vibrato,
        echo: ec,
        // 定位。着せるものの 1 つなので、音色と同じく音符ごとに写す
        pos: [px, py, pz],
        // 層の名前。付いていないものは付けない(基準の指紋を動かさないため)
        ...lane ? { lane } : {},
        // 音量の段数と曲線。バンドル音色が着せ替えたときだけ載る。
        // 鳴らす側はこれを音色のものより先に見る
        ...m && m.vsteps !== null ? { vsteps: m.vsteps } : {},
        ...m && m.vcurve !== null ? { vcurve: m.vcurve } : {},
        // `@m` を書いたときだけ載せる。鳴らす側はこれを音色の揺れより先に見る
        ...vibSaid ? { vib: { depth: vibrato, speed: vibSpeed, delay: vibDelay } } : {},
        // 鳴っているあいだの音量の動き。フェードの途中の音にだけ載る
        ...fd && !muted ? { fade: fd } : {},
        ...extra
      };
      if (!muted) written.set(note, base);
      return note;
    };
    const takeVoice = () => {
      let j = pos;
      while (j < src.length && src[j] !== "}") j++;
      const key2 = src.slice(pos, j).trim();
      const set = bundles.get(key2) || chordSets.get(key2);
      if (set) {
        pos = j + 1;
        const isChord = chordSets.has(key2);
        bundle = isChord ? set[0].parts : set;
        chordSet = isChord ? set : null;
        lane = isChord ? set[0].lane : null;
        if (isChord) for (const v of set) laneLabels.set(v.lane, v.label);
        const de = (WAVEFORMS[bundle[0].wave] || {}).defaultEnv;
        env = de !== void 0 ? de : envIndex(DEFAULT_ENV);
        return true;
      }
      bundle = null;
      chordSet = null;
      lane = null;
      wave = readName(WAVEFORMS, "\u6CE2\u5F62", wave);
      return false;
    };
    let tuning = meta.tuning ? readTuning(meta.tuning) : null;
    const a4 = Number(meta.a4) > 0 ? Number(meta.a4) : 440;
    let rootLetter = tuning ? LETTER[tuning.root] : 0;
    let rootSemi = tuning ? SEMI[tuning.root] : 0;
    let anchor = 1;
    let saidHalf = false;
    let saidKey = false;
    let saidTurn = false;
    const freqOf2 = (midi) => {
      const plain = (m) => a4 * Math.pow(2, (m - 69) / 12);
      if (!tuning) return plain(midi);
      const hit = (hz) => hz * anchor;
      const semi = (midi % 12 + 12) % 12;
      if (tuning.cents.length === 12) {
        const step = ((semi - rootSemi) % 12 + 12) % 12;
        return hit(plain(midi - step) * Math.pow(2, tuning.cents[step] / 1200));
      }
      const letter = LETTER_OF_SEMI[semi];
      if (letter === void 0) {
        if (!saidHalf) {
          saidHalf = true;
          warn(`[ChpTnSnd] MML: \u3053\u306E\u97F3\u5F8B\u306B\u534A\u97F3\u306F\u3042\u308A\u307E\u305B\u3093(${tuning.cents.length} \u97F3\u3067 1 \u5468\u3057\u307E\u3059)\u3002\u5E73\u5747\u5F8B\u306E\u9AD8\u3055\u3067\u9CF4\u3089\u3057\u307E\u3059`);
        }
        return plain(midi);
      }
      const n = tuning.cents.length;
      const at = (Math.floor(midi / 12) - 1) * 7 + letter - (4 * 7 + rootLetter);
      const turn = Math.floor(at / n);
      const base = plain((4 + 1) * 12 + rootSemi);
      return hit(base * Math.pow(2, (turn * tuning.period + tuning.cents[at - turn * n]) / 1200));
    };
    let chordSeq = 0;
    let drumSeq = 0;
    let inDrums = false;
    const laneLabels = /* @__PURE__ */ new Map();
    const playDrums = () => {
      const back2 = pos;
      let j = pos;
      while (j < src.length && src[j] !== "}") j++;
      const head = /^[ \t]*drums\b([^}]*)$/.exec(src.slice(pos, j));
      if (!head) return false;
      let k = j + 1;
      while (k < src.length && " \n	\r".includes(src[k])) k++;
      if (src[k] !== "{") {
        pos = back2;
        return false;
      }
      pos = k + 1;
      const len = parseInt(String(head[1]).trim(), 10);
      const step = 240 / tempo / (Number.isFinite(len) && len > 0 ? len : defLen);
      const table = new Map([...drums.outer, ...drums.scopes[drumSeq++] || /* @__PURE__ */ new Map()]);
      const keep2 = { wave, bundle, chordSet, vol, env, octave, lane };
      inDrums = true;
      let base = vol;
      let names = [];
      const hit = () => {
        if (!names.length) return;
        const id = names.length > 1 ? chordSeq++ : null;
        for (const { nm, bang } of names) {
          const d = table.get(nm);
          if (!d) {
            warn(`[ChpTnSnd] MML: \u30C9\u30E9\u30E0 "${nm}" \u306F\u5272\u308A\u5F53\u3066\u304C\u3042\u308A\u307E\u305B\u3093(#drum ` + nm + " = @{\u97F3\u8272} \u3068\u66F8\u304D\u307E\u3059)");
            continue;
          }
          bundle = d.parts;
          lane = nm;
          if (d.label) laneLabels.set(nm, d.label);
          if (bang) {
            if (!d.cue) {
              warn(`[ChpTnSnd] MML: \u30C9\u30E9\u30E0 "${nm}" \u306B\u5408\u56F3\u306E\u540D\u524D\u304C\u3042\u308A\u307E\u305B\u3093(#drum ${nm} = @{\u97F3\u8272} !\u540D\u524D \u3068\u66F8\u304D\u307E\u3059)`);
            } else {
              cues.push({ name: d.cue.name, arg: d.cue.arg, t: time });
            }
          }
          vol = d.vol === null ? base : Math.round(base * d.vol / 15);
          pushNote(step, freqOf2(DRUM_MIDI), id === null ? void 0 : { chord: id });
        }
        time += step;
        names = [];
      };
      const eatBang = () => src[pos] === "!" ? (pos++, true) : false;
      let depth = 1;
      while (pos < src.length) {
        const c = src[pos];
        if (c === "}") {
          depth--;
          pos++;
          if (!depth) break;
          continue;
        }
        if (" \n	\r".includes(c)) {
          hit();
          pos++;
          continue;
        }
        if (c === "|") {
          hit();
          pos++;
          if (!bars.some((b) => Math.abs(b - time) < 1e-9)) bars.push(time);
          continue;
        }
        if (c === ".") {
          hit();
          pos++;
          time += step;
          continue;
        }
        if (c === "v" || c === "V") {
          hit();
          pos++;
          base = clamp(readNumber() ?? base, 0, 15);
          continue;
        }
        if (c === "{") {
          depth++;
          pos++;
          let s = "";
          while (pos < src.length && src[pos] !== "}") s += src[pos++];
          pos++;
          depth--;
          names.push({ nm: s.trim(), bang: eatBang() });
          continue;
        }
        if (/[A-Za-z]/.test(c)) {
          pos++;
          names.push({ nm: c, bang: eatBang() });
          continue;
        }
        if (c >= "0" && c <= "9") {
          bad(`[ChpTnSnd] MML: \u30C9\u30E9\u30E0\u306E\u56F2\u307F\u306E\u4E2D\u306B\u6570\u5B57 "${c}" \u306F\u66F8\u3051\u307E\u305B\u3093(\u9577\u3055\u306F\u56F2\u307F\u304C\u6301\u3061\u307E\u3059\u3002\u97F3\u91CF\u306F v \u306E\u3046\u3057\u308D\u3060\u3051\u3067\u3059)`);
        }
        warn(`[ChpTnSnd] MML: \u30C9\u30E9\u30E0\u306E\u56F2\u307F\u306E\u4E2D\u306B "${c}" \u306F\u66F8\u3051\u307E\u305B\u3093(\u697D\u5668\u306E\u5B57\u3068 . \u3068 v \u3068 ! \u3068 [ ] | \u3060\u3051\u3067\u3059)`);
        pos++;
      }
      hit();
      inDrums = false;
      wave = keep2.wave;
      bundle = keep2.bundle;
      chordSet = keep2.chordSet;
      vol = keep2.vol;
      env = keep2.env;
      octave = keep2.octave;
      lane = keep2.lane;
      return true;
    };
    const peek = () => src[pos];
    const readNumber = () => {
      let n = "";
      while (pos < src.length && src[pos] >= "0" && src[pos] <= "9") n += src[pos++];
      return n === "" ? null : parseInt(n, 10);
    };
    const readVol = () => {
      let n = "";
      while (pos < src.length && src[pos] >= "0" && src[pos] <= "9") n += src[pos++];
      if (src[pos] === "." && src[pos + 1] >= "0" && src[pos + 1] <= "9") {
        n += src[pos++];
        while (pos < src.length && src[pos] >= "0" && src[pos] <= "9") n += src[pos++];
      }
      return n === "" ? null : parseFloat(n);
    };
    const readSigned = () => {
      let sign = 1;
      if (src[pos] === "-") {
        sign = -1;
        pos++;
      } else if (src[pos] === "+") pos++;
      const n = readNumber();
      return n === null ? null : sign * n;
    };
    const readFloat = () => {
      while (pos < src.length && " \n	\r".includes(src[pos])) pos++;
      let n = "";
      if (src[pos] === "-") n += src[pos++];
      while (pos < src.length && (src[pos] >= "0" && src[pos] <= "9" || src[pos] === ".")) {
        n += src[pos++];
      }
      const v = parseFloat(n);
      return Number.isFinite(v) ? v : null;
    };
    const readName = (table, what, now) => {
      let s = "";
      while (pos < src.length && src[pos] !== "}") s += src[pos++];
      pos++;
      const key2 = s.trim().toLowerCase();
      let hit = table === WAVEFORMS ? findWave(s) : table.findIndex((e) => e.name.toLowerCase() === key2);
      if (hit < 0) {
        hit = table.findIndex((e) => (e.alias || []).some((a) => String(a).toLowerCase() === key2));
      }
      if (hit >= 0) return hit;
      const why = table === WAVEFORMS ? voiceNameProblem(s) : null;
      warn(`[ChpTnSnd] MML: ${what} "${s}" \u306F` + (why ? `\u8AAD\u3081\u307E\u305B\u3093\u3002${why}` : `\u77E5\u3089\u306A\u3044\u540D\u524D\u3067\u3059 (\u4F7F\u3048\u308B\u306E\u306F ${table.map((e) => e.name).join(" / ")})`));
      return now;
    };
    const readPlace = () => {
      let s = "";
      while (pos < src.length && src[pos] !== "}") s += src[pos++];
      pos++;
      const n = s.split(",").map((v) => {
        const f = parseFloat(v);
        return Number.isFinite(f) ? Math.round(clamp(f, -8, 8) * 1e4) / 1e4 : 0;
      });
      px = n[0] ?? 0;
      py = n[1] ?? 0;
      pz = n[2] ?? 0;
    };
    const readPitchArg = () => {
      const back2 = pos;
      while (pos < src.length && " 	".includes(src[pos])) pos++;
      let oct = octave;
      if (src[pos] === "o") {
        pos++;
        const n = readNumber();
        if (n === null) {
          pos = back2;
          return null;
        }
        oct = clamp(n, 1, 8);
      }
      const ch = src[pos];
      if (SEMI[ch] === void 0) {
        pos = back2;
        return null;
      }
      pos++;
      let semi = SEMI[ch];
      while (peek() === "+" || peek() === "#") {
        semi++;
        pos++;
      }
      while (peek() === "-") {
        semi--;
        pos++;
      }
      return (oct + 1) * 12 + semi;
    };
    const readTuningAt = () => {
      let body = "";
      while (pos < src.length && src[pos] !== "}") body += src[pos++];
      pos++;
      const parts = body.split(",").map((w) => w.trim()).filter(Boolean);
      const link = parts.some((w) => w.toLowerCase() === "link");
      const text = parts.filter((w) => !["link", "pin"].includes(w.toLowerCase())).join(" ");
      const next = readTuning(text);
      if (!next) bad('[ChpTnSnd] MML: "@tuning" \u306E\u4E2D\u8EAB\u304C\u3042\u308A\u307E\u305B\u3093');
      if (tuning && next.cents.length !== tuning.cents.length && !saidTurn) {
        saidTurn = true;
        warn(`[ChpTnSnd] MML: 1 \u5468\u306E\u97F3\u306E\u6570\u304C ${tuning.cents.length} \u304B\u3089 ${next.cents.length} \u306B\u5909\u308F\u308A\u307E\u3059\u3002\u3053\u3053\u304B\u3089\u97F3\u540D\u306E\u6307\u3059\u97F3\u304C\u305A\u308C\u307E\u3059`);
      }
      const ref = (4 + 1) * 12 + SEMI[next.root];
      const was = tuning ? freqOf2(ref) : null;
      anchor = 1;
      tuning = next;
      rootSemi = SEMI[next.root];
      rootLetter = LETTER[next.root];
      if (link && was) anchor = was / freqOf2(ref);
    };
    const readFade = () => {
      let body = "";
      while (pos < src.length && src[pos] !== "}") body += src[pos++];
      pos++;
      const [a, b] = body.split(",").map((x) => Number(x.trim()));
      if (body.split(",").length !== 2 || !Number.isFinite(a) || !Number.isFinite(b) || b < 0) {
        bad('[ChpTnSnd] MML: "@fade" \u306B\u306F\u884C\u304D\u5148\u306E\u97F3\u91CF\u3068\u62CD\u6570\u3092\u66F8\u304D\u307E\u3059(`@fade{0,8}`)');
      }
      const from = fade ? fadeAt(fade, time) : 15;
      const to = clamp(a, 0, 15);
      fade = { t0: time, t1: time + b * 60 / tempo, from, to };
      volLog.push({ t: time, fade });
      for (const e of lastSounding()) {
        bendAt(e, time - e.t, [fade.t1 - e.t, written.get(e) * to / 15]);
      }
    };
    const readKey = () => {
      let body = "";
      while (pos < src.length && src[pos] !== "}") body += src[pos++];
      pos++;
      let link = false;
      let name = null;
      for (const w of body.split(",").map((x) => x.trim()).filter(Boolean)) {
        if (w.toLowerCase() === "link") link = true;
        else if (w.toLowerCase() === "pin") link = false;
        else name = w;
      }
      if (!name || LETTER[name[0].toLowerCase()] === void 0) {
        bad('[ChpTnSnd] MML: "@key" \u306B\u306F\u97F3\u540D\u3092\u66F8\u304D\u307E\u3059(`@key{a}` `@key{a,link}`)');
      }
      const letter = name[0].toLowerCase();
      let semi = SEMI[letter];
      for (const c of name.slice(1)) {
        if (c === "+" || c === "#") semi++;
        else if (c === "-") semi--;
      }
      if (!tuning || tuning.name === "equal") {
        if (!saidKey) {
          saidKey = true;
          warn('[ChpTnSnd] MML: 12 \u5E73\u5747\u5F8B\u306B\u6839\u97F3\u306F\u3042\u308A\u307E\u305B\u3093\u3002"@key" \u306F\u4F55\u3082\u5909\u3048\u307E\u305B\u3093');
        }
        return;
      }
      const to = () => {
        rootSemi = (semi % 12 + 12) % 12;
        rootLetter = LETTER[letter];
      };
      if (!link) {
        anchor = 1;
        to();
        return;
      }
      const ref = (4 + 1) * 12 + (semi % 12 + 12) % 12;
      const was = freqOf2(ref);
      anchor = 1;
      to();
      anchor = was / freqOf2(ref);
    };
    const readEcho = (now) => {
      let len = null, depth = 5;
      if (src[pos] === "{") {
        pos++;
        let body = "";
        while (pos < src.length && src[pos] !== "}") body += src[pos++];
        pos++;
        const n = body.split(",").map((v) => parseInt(v, 10));
        len = Number.isFinite(n[0]) ? n[0] : null;
        if (Number.isFinite(n[1])) depth = clamp(n[1], 1, 16);
      } else {
        len = readNumber();
      }
      if (len === null) return now;
      if (len <= 0) return null;
      return { delay: 240 / tempo / len, depth };
    };
    const readVib = () => {
      if (src[pos] !== "{") {
        vibrato = clamp(readNumber() ?? vibrato, 0, 9);
        vibSpeed = null;
        vibDelay = null;
        vibSaid = true;
        return;
      }
      pos++;
      let body = "";
      while (pos < src.length && src[pos] !== "}") body += src[pos++];
      pos++;
      const n = body.split(",").map((v) => parseFloat(v));
      vibrato = clamp(Number.isFinite(n[0]) ? n[0] : vibrato, 0, 9);
      vibSpeed = Number.isFinite(n[1]) ? clamp(n[1], 0.1, 30) : null;
      vibDelay = Number.isFinite(n[2]) ? clamp(n[2], 0, 600) : null;
      vibSaid = true;
    };
    let durWritten = false;
    const pushTape = (isData, dur) => {
      const ch = isData ? "?" : "=";
      if ((WAVEFORMS[wave] || {}).kind !== "beep") {
        warn(`[ChpTnSnd] MML: "${ch}" \u306F\u30D3\u30FC\u30D7\u97F3\u6E90\u5C02\u7528\u3067\u3059 (\u3044\u307E\u306E\u97F3\u8272\u306F "${(WAVEFORMS[wave] || {}).name}")`);
        time += dur;
        return;
      }
      const baud = sec.baud ?? 1200;
      pushNote(dur, baud * 2);
      const tape = {
        data: isData,
        bytes: isData ? sec.bytes ?? null : null,
        baud,
        seed: sec.seed ?? 1,
        seq: tapeSeq++
      };
      for (const k of ["hiss", "wow", "muffle"]) if (sec[k] != null) tape[k] = sec[k];
      events[events.length - 1].tape = tape;
      time += dur;
    };
    const readDuration = () => {
      const n = readNumber();
      durWritten = n !== null;
      const len = n ?? defLen;
      let d = 240 / tempo / len;
      let dot = d;
      while (peek() === ".") {
        pos++;
        dot /= 2;
        d += dot;
      }
      return d;
    };
    const skipSpace = () => {
      while (pos < src.length && " \n	\r|".includes(src[pos])) pos++;
    };
    const buzzFlush = () => {
      const b = sec._note;
      if (!b) return;
      sec._note = null;
      const keep2 = time;
      time = b.t;
      const from = events.length;
      pushNote(b.dur, b.freq, { gates: b.gates });
      for (let i = from; i < events.length; i++) sec._ids.push(i);
      time = keep2;
    };
    const setGate = (ev, a, b, hz) => {
      const out = [];
      for (const g of ev.gates) {
        const s0 = g.at, s1 = g.at + g.dur;
        const lo = Math.max(s0, a), hi = Math.min(s1, b);
        if (hi <= lo + 1e-9) {
          out.push(g);
          continue;
        }
        if (lo > s0 + 1e-9) out.push({ at: s0, dur: lo - s0, hz: g.hz });
        out.push({ at: lo, dur: hi - lo, hz: g.hz > 0 ? g.hz : hz });
        if (s1 > hi + 1e-9) out.push({ at: hi, dur: s1 - hi, hz: g.hz });
      }
      ev.gates = out;
    };
    const readToneLane = () => {
      const keepOct = octave, keepLen = defLen, keepTime = time;
      const ids = sec._ids.slice();
      time = sec._from;
      const alone = (a, b, hz) => {
        const keepT = time, keepQ = gate;
        time = a;
        gate = 8;
        pushNote(b - a, hz, { toneOnly: true });
        gate = keepQ;
        time = keepT;
      };
      while (pos < src.length && src[pos] !== "}") {
        const c = src[pos++];
        if (" \n	\r|".includes(c)) continue;
        if (c === ">") {
          octave = Math.min(8, octave + 1);
          continue;
        }
        if (c === "<") {
          octave = Math.max(1, octave - 1);
          continue;
        }
        if (c === "o") {
          octave = clamp(readNumber() ?? octave, 1, 8);
          continue;
        }
        if (c === "l") {
          defLen = readNumber() ?? defLen;
          continue;
        }
        if (c === "q") {
          gate = clamp(readNumber() ?? gate, 0, 8);
          continue;
        }
        if (c === "r") {
          time += readDuration();
          continue;
        }
        if (SEMI[c] === void 0) {
          bad(`[ChpTnSnd] MML: "${c}" \u306F\u77E9\u5F62\u6CE2\u306E\u307B\u3046\u306E { \u2026 } \u3067\u306F\u66F8\u3051\u307E\u305B\u3093(\u97F3\u540D / r / l / q / o / > / < \u3060\u3051\u3067\u3059)`);
        }
        let semi = SEMI[c];
        while (peek() === "+" || peek() === "#") {
          semi++;
          pos++;
        }
        while (peek() === "-") {
          semi--;
          pos++;
        }
        const dur = readDuration();
        const hz = freqOf2((octave + 1) * 12 + semi);
        const t0 = time;
        const t1 = time + Math.max(dur * gate / 8, 5e-3);
        const covered = [];
        for (const i of ids) {
          const ev = events[i];
          const lo = Math.max(t0, ev.t), hi = Math.min(t1, ev.t + ev.dur);
          if (hi <= lo + 1e-9) continue;
          setGate(ev, lo - ev.t, hi - ev.t, hz);
          covered.push([lo, hi]);
        }
        covered.sort((x, y) => x[0] - y[0]);
        let at = t0;
        for (const [lo, hi] of covered) {
          if (lo > at + 1e-9) alone(at, lo, hz);
          at = Math.max(at, hi);
        }
        if (t1 > at + 1e-9) alone(at, t1, hz);
        time += dur;
      }
      pos++;
      events.sort((a, b) => a.t - b.t);
      octave = keepOct;
      defLen = keepLen;
      time = Math.max(time, keepTime);
    };
    const buzzPut = (left, dur) => {
      if (left === "r") {
        buzzFlush();
        time += dur;
        return;
      }
      if (left === "^") {
        if (!sec._note) bad('[ChpTnSnd] MML: "^" \u306E\u524D\u306B\u97F3\u7B26\u304C\u3042\u308A\u307E\u305B\u3093');
      } else {
        buzzFlush();
        sec._note = { t: time, midi: left, freq: freqOf2(left), dur: 0, gates: [] };
      }
      const b = sec._note;
      const hz = sec._g == null ? 0 : freqOf2(b.midi + sec._g);
      b.gates.push({ at: b.dur, dur, hz });
      b.dur += dur;
      time += dur;
    };
    try {
      while (pos < src.length) {
        const ch = src[pos++];
        if (ch === "|") {
          if (!bars.some((b) => Math.abs(b - time) < 1e-9)) bars.push(time);
          continue;
        }
        if (" \n	\r".includes(ch)) continue;
        if (section && ch !== MARK_AT && ch !== CUE_AT && ch !== "@" && !SEC_COMMON.includes(ch) && !SECTIONS[section].chars.includes(ch) && !(SECTIONS[section].digits && ch >= "0" && ch <= "9") && !(SECTIONS[section].notes && SEMI[ch] !== void 0)) {
          const ok = [
            ...SECTIONS[section].chars,
            ...SECTIONS[section].digits ? ["\u6570\u5B57"] : [],
            ...SECTIONS[section].notes ? ["\u97F3\u540D"] : [],
            ...SEC_COMMON.filter((c) => c !== "}")
          ];
          bad(`[ChpTnSnd] MML: "${ch}" \u306F ${howOpen(section)} \u306E\u4E2D\u3067\u306F\u66F8\u3051\u307E\u305B\u3093(\u4E2D\u3067\u66F8\u3051\u308B\u306E\u306F ${ok.join(" ")} \u3068 @\u8A2D\u5B9A)`);
        }
        if (SEMI[ch] !== void 0) {
          let semi = SEMI[ch];
          while (peek() === "+" || peek() === "#") {
            semi++;
            pos++;
          }
          while (peek() === "-") {
            semi--;
            pos++;
          }
          const dur = readDuration();
          if (section === "buzz") {
            buzzPut((octave + 1) * 12 + semi, dur);
          } else if (section === "tape") {
            sec.baud = Math.max(1, Math.min(1e6, Math.round(freqOf2((octave + 1) * 12 + semi) * 12)));
            pushTape(true, dur);
          } else {
            pushNote(dur, freqOf2((octave + 1) * 12 + semi));
            time += dur;
          }
        } else if (ch === CHORD_QUOTE) {
          const keepOctave = octave, keepWave = wave, keepBundle = bundle;
          const keepVol = vol, keepEnv = env, keepSet = chordSet, keepLane = lane;
          const notes = [];
          let mark = null;
          let said = false;
          while (pos < src.length && src[pos] !== CHORD_QUOTE) {
            const c = src[pos++];
            if (" \n	\r".includes(c)) continue;
            if (c === "?" || c === "!") {
              mark = c;
              continue;
            }
            if (c === ">") {
              octave = Math.min(8, octave + 1);
              continue;
            }
            if (c === "<") {
              octave = Math.max(1, octave - 1);
              continue;
            }
            if (c === "o") {
              octave = readNumber() ?? octave;
              continue;
            }
            if (c === "@" && src[pos] === "{") {
              pos++;
              takeVoice();
              said = true;
              continue;
            }
            if (c === "v") {
              vol = clamp(readNumber() ?? vol, 0, 15);
              said = true;
              continue;
            }
            if (SEMI[c] !== void 0) {
              let semi = SEMI[c];
              while (peek() === "+" || peek() === "#") {
                semi++;
                pos++;
              }
              while (peek() === "-") {
                semi--;
                pos++;
              }
              notes.push({
                midi: (octave + 1) * 12 + semi,
                mark,
                wave,
                bundle,
                vol,
                env,
                lane,
                // 自分で楽器を書いたか。書いていなければ `#chord` の並びから着せる
                said
              });
              mark = null;
              continue;
            }
            if (c === CUE_AT) {
              pos++;
              while (pos < src.length && src[pos] !== CUE_AT) pos++;
              pos++;
              continue;
            }
            if (c === MARK_AT) {
              warn("[ChpTnSnd] MML: \u548C\u97F3\u306E\u4E2D\u306B\u30E9\u30D9\u30EB\u306F\u7F6E\u3051\u307E\u305B\u3093(\u548C\u97F3\u306F 1 \u97F3\u3068\u540C\u3058\u6271\u3044\u3067\u3059\u3002\u9589\u3058\u305F\u3042\u3068\u306B\u66F8\u304D\u307E\u3059)");
              while (pos < src.length && src[pos] !== MARK_AT) pos++;
              pos++;
              continue;
            }
            warn(`[ChpTnSnd] MML: \u548C\u97F3\u306E\u4E2D\u306B "${c}" \u306F\u66F8\u3051\u307E\u305B\u3093 (\u97F3\u540D\u3068 + # - \u3068 > < o \u3068 @{} \u3068 v \u3068 ? ! \u3060\u3051\u3002\u9577\u3055\u306F\u9589\u3058\u305F\u3042\u3068\u306B\u66F8\u304D\u307E\u3059)`);
          }
          pos++;
          const dur = readDuration();
          octave = keepOctave;
          wave = keepWave;
          bundle = keepBundle;
          vol = keepVol;
          env = keepEnv;
          chordSet = keepSet;
          lane = keepLane;
          if (notes.length === 0) {
            warn("[ChpTnSnd] MML: \u7A7A\u306E\u548C\u97F3\u304C\u3042\u308A\u307E\u3059(\u4F11\u307F\u305F\u3044\u306A\u3089 r \u3092\u66F8\u304D\u307E\u3059)");
            time += dur;
          } else {
            const id = chordSeq++;
            if (keepSet) {
              const low = notes.map((n, i) => i).sort((x, y) => notes[x].midi - notes[y].midi);
              low.forEach((at, rank) => {
                if (notes[at].said) return;
                const voice = keepSet[Math.min(rank, keepSet.length - 1)];
                notes[at].bundle = voice.parts;
                notes[at].lane = voice.lane;
              });
            }
            for (const n of notes) {
              wave = n.wave;
              bundle = n.bundle;
              vol = n.vol;
              env = n.env;
              lane = n.lane;
              pushNote(dur, freqOf2(n.midi), n.mark ? { chord: id, mark: n.mark } : { chord: id });
            }
            wave = keepWave;
            bundle = keepBundle;
            vol = keepVol;
            env = keepEnv;
            lane = keepLane;
            time += dur;
          }
        } else if (ch === "}" && section) {
          if (section === "buzz") {
            buzzFlush();
            let j = pos;
            while (j < src.length && " \n	\r".includes(src[j])) j++;
            if (src[j] === "{") {
              pos = j + 1;
              readToneLane();
            }
          }
          section = null;
        } else if (ch === MARK_AT) {
          let n = "";
          while (pos < src.length && src[pos] !== MARK_AT) n += src[pos++];
          pos++;
          const name = markNames[Number(n)] ?? "";
          if (name && !marks.some((m) => m.name === name)) {
            marks.push({ name, t: time });
            volLogAt.set(name, volLog.length);
            if (again && isLoopMark(name.trim().toLowerCase())) {
              fade = { t0: time, t1: time, from: again.level, to: again.level };
            }
          }
        } else if (ch === CUE_AT) {
          let n = "";
          while (pos < src.length && src[pos] !== CUE_AT) n += src[pos++];
          pos++;
          const said = cueNames[Number(n)] ?? "";
          const [word, ...rest] = said.split(/\s+/);
          if (word) {
            const num = Number(rest[0]);
            cues.push({ name: word, arg: Number.isFinite(num) ? num : 0, t: time });
          }
        } else if (ch === "!") {
          let word = "";
          while (pos < src.length && isNameChar(src[pos])) word += src[pos++];
          if (!word) bad('[ChpTnSnd] MML: "!" \u306E\u3046\u3057\u308D\u306B\u5408\u56F3\u306E\u540D\u524D\u304C\u3042\u308A\u307E\u305B\u3093');
          const known = cueTable.get(word);
          cues.push({ name: known ? known.name : word, arg: known ? known.arg : 0, t: time });
        } else if (ch === "^" && section === "buzz") {
          buzzPut("^", readDuration());
        } else if (ch === "r") {
          if (section === "buzz") {
            buzzPut("r", readDuration());
            continue;
          }
          time += readDuration();
        } else if (ch === "&") {
          skipSpace();
          for (; ; ) {
            if (peek() === ">") {
              octave = Math.min(8, octave + 1);
              pos++;
              skipSpace();
              continue;
            }
            if (peek() === "<") {
              octave = Math.max(1, octave - 1);
              pos++;
              skipSpace();
              continue;
            }
            if (peek() === "o") {
              pos++;
              octave = readNumber() ?? octave;
              skipSpace();
              continue;
            }
            break;
          }
          if (SEMI[src[pos]] !== void 0 && lastNote) {
            let semi = SEMI[src[pos]];
            pos++;
            while (peek() === "+" || peek() === "#") {
              semi++;
              pos++;
            }
            while (peek() === "-") {
              semi--;
              pos++;
            }
            const dur = readDuration();
            const f = freqOf2((octave + 1) * 12 + semi);
            if (Math.abs(f - lastNote.freq) < 1e-9) {
              for (const { ev } of lastNote.parts) {
                ev.dur += dur;
                ev.gate = ev.dur * gate / 8;
              }
            } else {
              for (const { ev } of lastNote.parts) ev.gate = ev.dur;
              pushNote(dur, f, { legato: 1 });
            }
            time += dur;
          }
        } else if (ch === "*") {
          skipSpace();
          for (; ; ) {
            if (peek() === ">") {
              octave = Math.min(8, octave + 1);
              pos++;
              skipSpace();
              continue;
            }
            if (peek() === "<") {
              octave = Math.max(1, octave - 1);
              pos++;
              skipSpace();
              continue;
            }
            if (peek() === "o") {
              pos++;
              octave = readNumber() ?? octave;
              skipSpace();
              continue;
            }
            break;
          }
          if (SEMI[src[pos]] !== void 0 && lastNote) {
            let semi = SEMI[src[pos]];
            pos++;
            while (peek() === "+" || peek() === "#") {
              semi++;
              pos++;
            }
            while (peek() === "-") {
              semi--;
              pos++;
            }
            const dur = readDuration();
            if (durWritten) {
              time += dur - lastNote.parts[0].ev.dur;
              for (const { ev } of lastNote.parts) {
                ev.dur = dur;
                ev.gate = dur * gate / 8;
              }
            }
            const to = freqOf2((octave + 1) * 12 + semi);
            for (const { ev, shift } of lastNote.parts) ev.glide = to * shift;
          }
        } else if (ch === "o") {
          octave = readNumber() ?? octave;
        } else if (ch === ">") {
          octave = Math.min(8, octave + 1);
        } else if (ch === "<") {
          octave = Math.max(1, octave - 1);
        } else if (ch === "l") {
          defLen = readNumber() ?? defLen;
        } else if (ch === "t") {
          tempo = readNumber() ?? tempo;
        } else if (ch === "v") {
          vol = Math.max(0, Math.min(15, readVol() ?? vol));
        } else if (ch === "q") {
          gate = Math.max(1, Math.min(8, readNumber() ?? gate));
        } else if (ch === "=" || ch === "?") {
          needSection(ch, section);
          pushTape(ch === "?", readDuration());
        } else if (ch === "p") {
          const n = readNumber();
          if (n === 0) muted = 1;
          else if (n === 1) {
            muted = 0;
            px = 1;
            py = 0;
            pz = 0;
          } else if (n === 2) {
            muted = 0;
            px = -1;
            py = 0;
            pz = 0;
          } else if (n === 3) {
            muted = 0;
            px = 0;
            py = 0;
            pz = 0;
          }
        } else if (section === "beep" && ch >= "0" && ch <= "9") {
          pos--;
          const from = readNumber();
          if (from !== null) {
            let to = from, step = 1;
            if (peek() === "-") {
              pos++;
              to = readNumber() ?? from;
            }
            if (peek() === ",") {
              pos++;
              step = Math.max(1, readNumber() ?? 1);
            }
            const dur = readDuration();
            const dir = to >= from ? 1 : -1;
            let guard = 0;
            for (let n = from; dir > 0 ? n <= to : n >= to; n += dir * step) {
              if (guard++ >= BEEP_MAX_STEPS) break;
              pushNote(dur, beepFreq(n, sec.tick ?? 150));
              const over = {};
              for (const k of ["carrier", "jitter", "frame", "display"]) {
                if (sec[k] != null) over[k] = sec[k];
              }
              if (Object.keys(over).length) events[events.length - 1].beepSet = over;
              time += dur;
            }
          }
        } else if (ch === "@") {
          if (section) {
            let name = "";
            let j = pos;
            while (j < src.length && src[j] >= "a" && src[j] <= "z") name += src[j++];
            const keys = SECTIONS[section].keys;
            if (keys[name] && keys[name].semi && src[j] === "{") {
              pos = j + 1;
              let word = "";
              while (pos < src.length && src[pos] !== "}") word += src[pos++];
              pos++;
              const w = word.trim().toLowerCase();
              if (w === "off" || w === "") {
                sec._g = null;
                continue;
              }
              const n = Number(w);
              if (!Number.isFinite(n) || Math.abs(n) > 48) {
                bad(`[ChpTnSnd] MML: "@${name}{${word}}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u534A\u97F3\u306E\u6570\u3092 -48 \u301C 48 \u3067\u66F8\u304F\u304B\u3001off \u3068\u66F8\u304D\u307E\u3059)`);
              }
              sec._g = Math.round(n);
              continue;
            }
            if (!Object.keys(SECTIONS[section].keys).length) {
              bad(`[ChpTnSnd] MML: ${howOpen(section)} \u306E\u4E2D\u306B "@" \u306F\u66F8\u3051\u307E\u305B\u3093(\u8A2D\u5B9A\u3092\u6301\u305F\u306A\u3044\u533A\u9593\u3067\u3059)\u3002\u97F3\u8272\u3084\u52B9\u679C\u306F\u533A\u9593\u306E\u5916\u3067\u66F8\u3044\u3066\u304F\u3060\u3055\u3044`);
            }
            if (!name || src[j] === "{") {
              bad(`[ChpTnSnd] MML: "@" \u306F ${howOpen(section)} \u306E\u4E2D\u3067\u306F\u8A2D\u5B9A\u3060\u3051\u3067\u3059(${Object.keys(keys).map((k) => `@${k}`).join(" / ")})\u3002\u97F3\u8272\u3084\u52B9\u679C\u306F\u533A\u9593\u306E\u5916\u3067\u66F8\u3044\u3066\u304F\u3060\u3055\u3044`);
            }
            {
              if (!keys[name]) {
                bad(`[ChpTnSnd] MML: "@${name}" \u306F ${howOpen(section)} \u306E\u8A2D\u5B9A\u3067\u306F\u3042\u308A\u307E\u305B\u3093(\u3042\u308B\u306E\u306F ${Object.keys(keys).map((k) => `@${k}`).join(" / ")})`);
              }
              pos = j;
              if (keys[name].hex) {
                while (pos < src.length && " \n	\r".includes(src[pos])) pos++;
                let word = "";
                while (pos < src.length && /[0-9a-z]/.test(src[pos])) word += src[pos++];
                if (word === "random" || word === "") {
                  sec[name] = null;
                  continue;
                }
                if (word.length % 2 !== 0 || /[^0-9a-f]/.test(word)) {
                  bad(`[ChpTnSnd] MML: "@${name} ${word}" \u306F\u8AAD\u3081\u307E\u305B\u3093(16 \u9032\u3092 2 \u6841\u305A\u3064\u4E26\u3079\u308B\u304B\u3001random \u3068\u66F8\u304D\u307E\u3059)`);
                }
                sec[name] = word.match(/../g).map((h) => parseInt(h, 16));
                continue;
              }
              const p = keys[name].note ? readPitchArg() : null;
              const v = p === null ? readFloat() : Math.round(freqOf2(p) / 2);
              if (v === null) {
                bad(`[ChpTnSnd] MML: "@${name}" \u306B\u5024\u304C\u3042\u308A\u307E\u305B\u3093`);
              }
              const { min, max } = keys[name];
              sec[name] = Math.max(min, Math.min(max, v));
              continue;
            }
          }
          const kind = peek();
          if (kind === "{") {
            pos++;
            if (playDrums()) continue;
            if (takeVoice()) continue;
            {
              let j = pos;
              while (j < src.length && " \n	\r".includes(src[j])) j++;
              if (src[j] === "{") {
                const opened = sectionByVoice(WAVEFORMS[wave]);
                if (!opened) {
                  bad(`[ChpTnSnd] MML: \u97F3\u8272 "${(WAVEFORMS[wave] || {}).name}" \u306F\u533A\u9593\u3092\u958B\u3051\u307E\u305B\u3093(\u81EA\u5206\u306E\u66F8\u304D\u65B9\u3092\u6301\u3063\u3066\u3044\u307E\u305B\u3093)`);
                }
                if (section) {
                  bad(`[ChpTnSnd] MML: \u533A\u9593\u306E\u4E2D\u3067\u533A\u9593\u306F\u958B\u3051\u307E\u305B\u3093`);
                }
                pos = j + 1;
                section = opened;
                sec = {};
                sec._from = time;
                sec._ids = [];
                continue;
              }
            }
            const de = (WAVEFORMS[wave] || {}).defaultEnv;
            env = de !== void 0 ? de : envIndex(DEFAULT_ENV);
          } else if (src.startsWith("key{", pos)) {
            pos += 4;
            readKey();
          } else if (src.startsWith("tuning{", pos)) {
            pos += 7;
            readTuningAt();
          } else if (src.startsWith("fade{", pos)) {
            pos += 5;
            readFade();
          } else if (kind === "e" && src[pos + 1] === "{") {
            pos += 2;
            env = readName(ENVELOPES, "\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7", env);
          } else if (kind === "e") {
            pos++;
            const n = readNumber();
            bad(`[ChpTnSnd] MML: "@e${n ?? ""}" \u2014 \u756A\u53F7\u3067\u306F\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u3092\u9078\u3079\u307E\u305B\u3093\u3002@e{\u540D\u524D} \u3067\u66F8\u3044\u3066\u304F\u3060\u3055\u3044(\u756A\u53F7\u306F\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u3092\u8DB3\u3059\u3068\u305A\u308C\u308B\u306E\u3067\u901A\u3057\u3066\u3044\u307E\u305B\u3093)`);
          } else if (kind === "d") {
            pos++;
            detune = clamp(readSigned() ?? detune, -2400, 2400);
          } else if (kind === "o") {
            pos++;
            octShift = clamp(readSigned() ?? octShift, -4, 4);
          } else if (kind === "m") {
            pos++;
            readVib();
          } else if (kind === "s") {
            pos++;
            echo = readEcho(echo);
          } else if (kind === "p" && src[pos + 1] === "{") {
            pos += 2;
            readPlace();
          } else if (kind === "n") {
            pos++;
            wave = findWave("noise");
          } else {
            const n = readNumber();
            if (n !== null) {
              bad(`[ChpTnSnd] MML: "@${n}" \u2014 \u756A\u53F7\u3067\u306F\u97F3\u8272\u3092\u9078\u3079\u307E\u305B\u3093\u3002@{\u540D\u524D} \u3067\u66F8\u3044\u3066\u304F\u3060\u3055\u3044(\u756A\u53F7\u306F\u97F3\u8272\u3092\u8DB3\u3059\u3068\u305A\u308C\u308B\u306E\u3067\u901A\u3057\u3066\u3044\u307E\u305B\u3093)`);
            }
          }
        }
      }
      if (section) {
        bad(`[ChpTnSnd] MML: ${howOpen(section)} \u304C\u9589\u3058\u3066\u3044\u307E\u305B\u3093`);
      }
    } catch (e) {
      if (!(e instanceof LooseStop)) throw e;
    }
    for (let i = 0; i < events.length; i++) {
      const e = events[i], next = events[i + 1];
      e.open = !!(next && next.t < e.t + e.gate + 1e-6);
    }
    const back = marks.find((m) => isLoopMark(m.name.trim().toLowerCase()));
    const tail = marks.find((m) => isOutroMark(m.name.trim().toLowerCase()));
    const outro = tail ? tail.t : null;
    const times = meta.loopTimes > 0 ? meta.loopTimes : null;
    const loop = back || tail ? { from: back ? back.t : 0, to: outro ?? time, ...times ? { times } : {} } : null;
    if (loop && !again) {
      const upto = tail ? volLogAt.get(tail.name) : volLog.length;
      const end = volLog[upto - 1];
      if (end) {
        const keepReport = REPORT;
        REPORT = { mode: "loose", problems: [] };
        let two;
        try {
          two = compileOne(mml, { level: fadeAt(end.fade, loop.to), head: !back }).events;
        } finally {
          REPORT = keepReport;
        }
        if (two.length === events.length) {
          events.forEach((e, i) => {
            if (e.t < loop.from - 1e-9 || e.t >= loop.to - 1e-9) return;
            const b = two[i];
            if (b.vol === e.vol && JSON.stringify(b.fade) === JSON.stringify(e.fade)) return;
            e.loopVol = b.vol;
            e.loopFade = b.fade ?? null;
          });
        }
      }
    }
    if (times && !loop) {
      warn("[ChpTnSnd] MML: #looptimes \u3092\u66F8\u3044\u3066\u3044\u307E\u3059\u304C\u3001\u623B\u308B\u5148\u304C\u3042\u308A\u307E\u305B\u3093(`#label LOOP` \u304B `#label OUTRO` \u304C\u8981\u308A\u307E\u3059)");
    }
    try {
      for (const m of marks) {
        const name = m.name.trim();
        const low = name.toLowerCase();
        if (low === START_LABEL) {
          bad(`[ChpTnSnd] MML: \u30E9\u30D9\u30EB "${name}" \u306F\u66F8\u3051\u307E\u305B\u3093\u3002\u66F2\u306E\u982D\u306E\u5370\u306F\u9CF4\u3089\u3059\u5074\u304C\u8DB3\u3057\u307E\u3059(\u8DF3\u3076\u5148\u306E\u4E00\u89A7\u306B\u3044\u3064\u3082\u4E26\u3073\u307E\u3059)`);
        }
        if (isSystemMark(name) || !SHOUTING(name)) continue;
        bad(`[ChpTnSnd] MML: \u30E9\u30D9\u30EB "${name}" \u306F\u5168\u90E8\u5927\u6587\u5B57\u3067\u3059\u3002\u5927\u6587\u5B57\u306E\u540D\u524D\u306F\u4E88\u7D04\u8A9E\u306E\u305F\u3081\u306B\u7A7A\u3051\u3066\u3042\u308A\u307E\u3059(\u3044\u307E\u306E\u4E88\u7D04\u8A9E\u306F LOOP \u3068 OUTRO)\u3002\u5C0F\u6587\u5B57\u3092\u6DF7\u305C\u3066\u304F\u3060\u3055\u3044`);
      }
    } catch (e) {
      if (!(e instanceof LooseStop)) throw e;
    }
    return {
      events,
      total: time,
      loop,
      outro,
      ending: outro,
      meta,
      marks,
      bars,
      cues,
      // 層の呼び名。`lane` は控えめな字なので、画面に出すものは別に持つ
      laneLabels
    };
  }
  function splitTakes(raw) {
    const src = normalizeDirectives(raw);
    const OPEN = /^[ \t]*\/\/[ \t]*#[ \t]*takes\b[ \t]*(.*)$/i;
    const TAKE = /^[ \t]*\/\/[ \t]*#[ \t]*take\b[ \t]*(.*)$/i;
    const out = [{ kind: "common", text: "" }];
    let open = null;
    for (const line of String(src ?? "").split(/\r?\n/)) {
      const o = OPEN.exec(line);
      if (o) {
        const name = o[1].trim();
        if (open) {
          if (name) {
            bad(`[ChpTnSnd] MML: "#takes ${name}" \u306F"#takes ${open.group}" \u306E\u4E2D\u3067\u306F\u66F8\u3051\u307E\u305B\u3093(\u5165\u308C\u5B50\u306B\u306F\u3067\u304D\u307E\u305B\u3093)`);
          }
          if (!open.options.length) {
            bad(`[ChpTnSnd] MML: "#takes ${open.group}" \u306B\u9078\u629E\u80A2\u304C\u3042\u308A\u307E\u305B\u3093(\u4E2D\u3092 "#take <\u540D\u524D>" \u3067\u4ED5\u5207\u308A\u307E\u3059)`);
          }
          out.push(open);
          out.push({ kind: "common", text: "" });
          open = null;
          continue;
        }
        if (!name) {
          bad('[ChpTnSnd] MML: \u958B\u3044\u3066\u3044\u306A\u3044 "#takes" \u3092\u9589\u3058\u3066\u3044\u307E\u3059');
        }
        const KNOWN = ["restart", "now"];
        const [group, ...flags] = name.split(/[ \t]+/);
        const low = flags.map((f) => f.toLowerCase());
        for (const f of low) {
          if (!KNOWN.includes(f)) {
            bad(`[ChpTnSnd] MML: "#takes ${group}" \u306E "${f}" \u306F\u77E5\u3089\u306A\u3044\u6307\u5B9A\u3067\u3059(\u3044\u307E\u3042\u308B\u306E\u306F ${KNOWN.join(" \u3068 ")})`);
          }
        }
        open = {
          kind: "takes",
          group,
          options: [],
          restart: low.includes("restart"),
          now: low.includes("now")
        };
        continue;
      }
      if (open && /^[ \t]*\/\/[ \t]*#[ \t]*switch\b/i.test(line)) {
        bad(`[ChpTnSnd] MML: "#switch" \u306F "#takes ${open.group}" \u306E\u4E2D\u3067\u306F\u66F8\u3051\u307E\u305B\u3093(\u7DB2\u306E\u76EE\u306F\u66F2\u305C\u3093\u3076\u3067 1 \u3064\u3067\u3059)`);
      }
      const t = TAKE.exec(line);
      if (t) {
        if (!open) {
          bad(`[ChpTnSnd] MML: "#take ${t[1].trim()}" \u306F "#takes <\u30B0\u30EB\u30FC\u30D7>" \u306E\u4E2D\u3060\u3051\u3067\u66F8\u3051\u307E\u3059`);
        }
        open.options.push({ name: t[1].trim(), text: "" });
        continue;
      }
      if (!open) {
        out[out.length - 1].text += line + "\n";
        continue;
      }
      if (!open.options.length) {
        open.options.push({ name: "", text: "" });
      }
      open.options[open.options.length - 1].text += line + "\n";
    }
    if (open) {
      bad(`[ChpTnSnd] MML: "#takes ${open.group}" \u304C\u9589\u3058\u3066\u3044\u307E\u305B\u3093(\u540D\u524D\u3092\u66F8\u304B\u306A\u3044 "#takes" \u3067\u9589\u3058\u307E\u3059)`);
    }
    return out;
  }
  function piece(prefix, body) {
    const head = compileOne(prefix);
    const all = compileOne(prefix + body);
    return {
      events: all.events.slice(head.events.length).map((e) => ({ ...e, t: e.t - head.total })),
      marks: all.marks.slice(head.marks.length).map((m) => ({ ...m, t: m.t - head.total })),
      bars: all.bars.slice(head.bars.length).map((b) => b - head.total),
      cues: all.cues.slice(head.cues.length).map((c) => ({ ...c, t: c.t - head.total })),
      total: all.total - head.total
    };
  }
  function compileMML(mml, opts = {}) {
    const own = REPORT === null;
    if (own) REPORT = { mode: modeOf(opts.mode), problems: [] };
    try {
      return compileInto(mml);
    } catch (e) {
      if (own && REPORT.mode === "loose" && e instanceof LooseStop) {
        return {
          events: [],
          total: 0,
          loop: null,
          outro: null,
          ending: null,
          meta: {},
          marks: [],
          takes: [],
          bars: [],
          cues: [],
          problems: REPORT.problems
        };
      }
      throw e;
    } finally {
      if (own) REPORT = null;
    }
  }
  function compileInto(mml) {
    const here = () => REPORT ? REPORT.problems : [];
    const segs = splitTakes(mml);
    if (!segs.some((x) => x.kind === "takes")) {
      return { ...compileOne(mml), takes: [], problems: here() };
    }
    const events = [], marks = [], takes = [], bars = [], cues = [];
    const laneLabels = /* @__PURE__ */ new Map();
    let prefix = "";
    let at = 0;
    for (const s of segs) {
      if (s.kind === "common") {
        if (!s.text.trim()) continue;
        const p = piece(prefix, s.text);
        for (const e of p.events) events.push({ ...e, t: e.t + at });
        for (const m of p.marks) {
          if (!marks.some((x) => x.name === m.name)) marks.push({ name: m.name, t: m.t + at });
        }
        for (const b of p.bars) bars.push(b + at);
        for (const c of p.cues) cues.push({ ...c, t: c.t + at });
        for (const [k, v] of p.laneLabels ?? []) laneLabels.set(k, v);
        at += p.total;
        prefix += s.text;
        continue;
      }
      const opts = s.options.map((o) => ({ name: o.name, ...piece(prefix, o.text) }));
      const dur = Math.max(0, ...opts.map((o) => o.total));
      for (const o of opts) {
        if (Math.abs(o.total - dur) > 1e-6) {
          warn(`[ChpTnSnd] MML: \u9078\u629E\u80A2 "${s.group}/${o.name}" \u306E\u9577\u3055\u304C\u305D\u308D\u3063\u3066\u3044\u307E\u305B\u3093(${o.total.toFixed(3)}s / \u3044\u3061\u3070\u3093\u9577\u3044\u3082\u306E ${dur.toFixed(3)}s)\u3002\u5F8C\u308D\u306F\u4F11\u307F\u3067\u57CB\u3081\u307E\u3059`);
        }
      }
      for (const e of opts[0].events) events.push({ ...e, t: e.t + at });
      for (const m of opts[0].marks) {
        if (!marks.some((x) => x.name === m.name)) marks.push({ name: m.name, t: m.t + at });
      }
      for (const b of opts[0].bars) bars.push(b + at);
      for (const c of opts[0].cues) cues.push({ ...c, t: c.t + at });
      for (const o of opts) for (const [k, v] of o.laneLabels ?? []) laneLabels.set(k, v);
      takes.push({
        group: s.group,
        at,
        dur,
        restart: s.restart === true,
        now: s.now === true,
        options: opts.map((o) => ({
          name: o.name,
          events: o.events,
          cues: o.cues,
          bars: o.bars,
          total: o.total
        }))
      });
      at += dur;
    }
    const back = marks.find((m) => isLoopMark(m.name.trim().toLowerCase()));
    const tail = marks.find((m) => isOutroMark(m.name.trim().toLowerCase()));
    const outro = tail ? tail.t : null;
    const meta2 = readDirectives(mml);
    const times = meta2.loopTimes > 0 ? meta2.loopTimes : null;
    const loop = back || tail ? { from: back ? back.t : 0, to: outro ?? at, ...times ? { times } : {} } : null;
    return {
      events,
      total: at,
      loop,
      outro,
      ending: outro,
      meta: meta2,
      marks,
      takes,
      bars,
      cues,
      laneLabels,
      problems: here()
    };
  }
  function songParts(tracks, opts = {}) {
    const list = Array.isArray(tracks) ? tracks : [tracks];
    const total = Math.max(...list.map((t) => t.total ?? 0), 0.01);
    const back = list.map((t) => t.loop).find(Boolean) ?? null;
    const endAt = list.map((t) => t.outro).find((v) => v != null) ?? null;
    const want = list.map((t) => t.loop && t.loop.times).find((v) => v > 0) ?? 2;
    const laps = back || endAt != null;
    const loops = laps ? Math.max(1, Math.floor(opts.loops ?? want)) : 1;
    const from = back ? back.from : 0;
    const lapEnd = endAt != null ? Math.min(endAt, total) : total;
    const parts = [];
    let at = 0;
    const push = (a, b) => {
      parts.push({ from: a, to: b, at });
      at += b - a;
    };
    if (opts.intro !== false && from > 0) push(0, from);
    const lapAt = parts.length;
    for (let i = 0; i < loops; i++) push(from, lapEnd);
    const wantOutro = opts.outro !== false && lapEnd < total;
    const outroAt = wantOutro ? at : null;
    if (wantOutro) push(lapEnd, total);
    return { parts, span: at, loops, outroAt, total, lapAt };
  }
  function validateMML(text, mode) {
    const errors = [];
    const warnings = [];
    const channels = [];
    const voices = Array.isArray(text) ? text.map((v) => String(v ?? "")).filter((v) => v.trim() !== "") : splitVoices(text);
    if (!voices.length) {
      return {
        ok: false,
        errors: [{ ch: null, text: "\u9CF4\u3089\u3059\u3082\u306E\u304C\u3042\u308A\u307E\u305B\u3093" }],
        warnings,
        channels,
        total: 0
      };
    }
    const said = console.warn;
    let total = 0;
    voices.forEach((src, i) => {
      const heard = [];
      console.warn = (...a) => {
        heard.push(a.join(" "));
      };
      let got = null;
      try {
        got = compileMML(src, { mode });
      } catch (e) {
        errors.push({ ch: i, text: String(e && e.message ? e.message : e) });
      } finally {
        console.warn = said;
      }
      for (const w of heard) {
        warnings.push({ ch: i, text: w.replace(/^\[MMSXX\]\s*/, "") });
      }
      if (!got) return;
      total = Math.max(total, got.total);
      channels.push({
        ch: i,
        meta: got.meta,
        name: got.meta.name ?? got.meta.ch ?? null,
        role: got.meta.role ?? null,
        events: got.events.length,
        total: got.total,
        loop: got.loop,
        marks: got.marks,
        takes: got.takes ?? []
      });
      if (!got.events.length) warnings.push({ ch: i, text: "\u97F3\u7B26\u304C\u3042\u308A\u307E\u305B\u3093" });
    });
    for (const key2 of SONG_WIDE) {
      const said2 = channels.filter((c) => c.meta[key2] !== void 0);
      const first = said2[0];
      for (const c of said2) {
        if (String(c.meta[key2]) !== String(first.meta[key2])) {
          errors.push({
            ch: c.ch,
            text: `#${key2} \u304C\u98DF\u3044\u9055\u3063\u3066\u3044\u307E\u3059 (${first.ch + 1} \u672C\u76EE\u306F "${first.meta[key2]}"\u3001${c.ch + 1} \u672C\u76EE\u306F "${c.meta[key2]}")\u3002\u66F2\u305C\u3093\u3076\u306B\u52B9\u304F\u306E\u3067 1 \u3064\u306B\u6C7A\u3081\u307E\u3059`
          });
        }
      }
    }
    const mark = channels.map((c) => c.loop).find(Boolean) || null;
    if (mark) {
      for (const c of channels) {
        if (c.loop && Math.abs(c.loop.from - mark.from) >= 1e-3) {
          errors.push({
            ch: c.ch,
            text: `LOOP \u304C\u98DF\u3044\u9055\u3063\u3066\u3044\u307E\u3059 (${c.loop.from.toFixed(2)} \u79D2)\u3002${mark.from.toFixed(2)} \u79D2\u306B\u3082\u66F8\u3044\u3066\u3042\u308A\u307E\u3059\u3002\u623B\u308B\u5148\u306F\u66F2\u306B 1 \u3064\u3067\u3059`
          });
        }
      }
    }
    const groups = /* @__PURE__ */ new Map();
    for (const c of channels) {
      for (const box of c.takes || []) {
        if (!groups.has(box.group)) groups.set(box.group, []);
        groups.get(box.group).push({ ch: c.ch, names: box.options.map((o) => o.name) });
      }
    }
    for (const [group, boxes] of groups) {
      const first = boxes[0];
      for (const b of boxes.slice(1)) {
        const same = b.names.length === first.names.length && b.names.every((n, i) => n === first.names[i]);
        if (!same) {
          warnings.push({
            ch: b.ch,
            text: `\u9078\u629E\u80A2 "${group}" \u306E\u9854\u3076\u308C\u304C\u98DF\u3044\u9055\u3063\u3066\u3044\u307E\u3059 (${first.ch + 1} \u672C\u76EE\u306F ${first.names.join(" / ")}\u3001${b.ch + 1} \u672C\u76EE\u306F ${b.names.join(" / ")})\u3002\u540C\u3058\u540D\u524D\u3092\u66F8\u3044\u3066\u304A\u304F\u3068\u3001\u307E\u3068\u3081\u3066\u66FF\u308F\u308A\u307E\u3059`
          });
        }
      }
      for (const b of boxes) {
        if (b.names.some((n) => n === "")) {
          warnings.push({
            ch: b.ch,
            text: `\u9078\u629E\u80A2 "${group}" \u306B\u540D\u524D\u306E\u7121\u3044\u3082\u306E\u304C\u3042\u308A\u307E\u3059("#take <\u540D\u524D>" \u3067\u4ED5\u5207\u308A\u307E\u3059)`
          });
        }
      }
    }
    return { ok: errors.length === 0, errors, warnings, channels, total };
  }

  // ../../../tmp/panther-update/sound/chipset.js
  var ROLE_RANK = {
    lead: 6,
    // 旋律。いちばん前に出るもの
    bass: 5,
    // 低音。抜けると曲の底が消える
    counter: 4,
    // 対旋律
    perc: 3,
    // 打楽器。抜けると走っている感じが消える
    arp: 2,
    // 分散和音。和音の代わりなので、和音と同じあたり
    chord: 2,
    // 和音・パッド。**まず譲る側**
    noise: 1,
    // 楽器としてのノイズ
    se: 0
    // 曲の部品ではないもの
  };
  var ROLES_COVERED = ROLES.every((r) => ROLE_RANK[r] !== void 0);

  // ../../../tmp/panther-update/sound/mask.js
  function groupsOf(tracks) {
    const out = [];
    for (const t of tracks ?? []) {
      if (!t || !t.group) continue;
      let at = out.find((g) => g.name === t.group);
      if (!at) {
        at = { name: t.group, sets: [] };
        out.push(at);
      }
      if (t.groupSet && !at.sets.includes(t.groupSet)) at.sets.push(t.groupSet);
    }
    return out;
  }
  function groupPick(tracks, pick = {}) {
    const list = groupsOf(tracks);
    const want = pick.group == null ? null : String(pick.group);
    const now = want && list.find((g) => g.name === want) || list[0] || null;
    const sets = now ? pick.sets == null ? now.sets.slice() : now.sets.filter((s) => pick.sets.includes(s)) : [];
    const silent = [];
    (tracks ?? []).forEach((t, i) => {
      if (!t || !t.group) return;
      if (!now || t.group !== now.name) {
        silent.push(i);
        return;
      }
      if (t.groupSet && !sets.includes(t.groupSet)) silent.push(i);
    });
    const off = new Set(silent);
    let machine = null;
    (tracks ?? []).forEach((t, i) => {
      if (machine == null && !off.has(i) && t && t.machine) machine = t.machine;
    });
    return { group: now ? now.name : null, sets, silent, machine };
  }

  // ../../../tmp/panther-update/sound/wavetables.js
  var N = 32;
  var build = (f) => Array.from({ length: N }, (_, i) => f(i / N, i));
  var norm = (w) => {
    const top = Math.max(...w.map(Math.abs)) || 1;
    return w.map((v) => v / top);
  };
  var harmonics = (list) => norm(build((p) => {
    let v = 0;
    for (const [n, a] of list) v += a * Math.sin(2 * Math.PI * n * p);
    return v;
  }));
  var WT_SINE = build((p) => Math.sin(2 * Math.PI * p));
  var WT_BELL = harmonics([[1, 1], [3, 0.5], [5, 0.35], [7, 0.2], [11, 0.12]]);
  var WT_ORGAN = harmonics([[1, 1], [2, 0.6], [3, 0.45], [4, 0.3], [6, 0.15]]);
  var WT_RAMP = build((p) => 1 - 2 * p);
  var WT_VOICE = norm(build((p) => {
    const base = Math.sin(2 * Math.PI * p);
    const form = 0.5 * Math.sin(2 * Math.PI * 2 * p) + 0.35 * Math.sin(2 * Math.PI * 3 * p);
    return base + (p < 0.5 ? form : form * 0.25);
  }));
  var WT_PAD_WARM = harmonics([[1, 1], [2, 0.45], [3, 0.22]]);
  var WT_PAD_AIRY = harmonics([[1, 1], [3, 0.3], [5, 0.16]]);
  var WT_SQUARE_SOFT = build((p) => {
    const edge = 0.06;
    const d = Math.min(p, Math.abs(p - 0.5), 1 - p) / edge;
    const s = p < 0.5 ? 1 : -1;
    return s * Math.min(1, d);
  });
  function registerDefaultWaves() {
    registerFamily("wtSine", {
      note: "A sine held in wavetable memory. The only thing that changes is the bit depth, so it is the clearest way to hear what depth does.",
      params: [{
        name: "bits",
        default: "5",
        note: "Bit depth of each sample. Fewer bits, coarser steps, more buzz.",
        values: [
          { value: "8", note: "Eight bits (256 steps), the depth of an SCC. The steps all but disappear." },
          { value: "5", note: "Five bits (32 steps), the depth of a PC Engine. Reads as a chip, not a synth." },
          { value: "3", note: "Three bits (8 steps). Not on any real chip; the corners make the sine buzz." }
        ]
      }]
    });
    registerWave(
      "wtSine(8)",
      WT_SINE,
      8,
      {
        role: "chord",
        noteJa: "\u540C\u3058\u30B5\u30A4\u30F3\u6CE2\u3092 8 \u30D3\u30C3\u30C8(256 \u6BB5)\u3067\u3002SCC \u306B\u8F09\u305B\u305F\u3068\u304D\u306E\u7C97\u3055\u3067\u3001\u3053\u3053\u307E\u3067\u7D30\u304B\u3044\u3068\u307B\u3068\u3093\u3069\u6BB5\u304C\u805E\u3053\u3048\u306A\u3044\u3002\u7C97\u3055\u306E\u7AEF\u3068\u3057\u3066\u3001\u3053\u308C\u304C\u3044\u3061\u3070\u3093\u304D\u308C\u3044\u306A\u307B\u3046",
        note: "The same sine at eight bits (256 steps), the depth of an SCC. Fine enough that the steps all but disappear \u2014 the clean end of the range."
      }
    );
    registerWave(
      "wtSine(5)",
      WT_SINE,
      5,
      {
        role: "chord",
        noteJa: "\u6CE2\u5F62\u30E1\u30E2\u30EA\u306B\u8F09\u305B\u305F\u30B5\u30A4\u30F3\u6CE2\u30025 \u30D3\u30C3\u30C8(32 \u6BB5)\u3002\u968E\u6BB5\u306B\u3057\u3066\u3042\u308B\u306E\u306F\u308F\u3056\u3068\u3067\u3001\u305D\u306E\u7C97\u3055\u304C\u300C\u30B7\u30F3\u30BB\u3067\u306F\u306A\u304F\u30C1\u30C3\u30D7\u306E\u97F3\u300D\u306B\u805E\u3053\u3048\u308B\u6B63\u4F53\u3002PC \u30A8\u30F3\u30B8\u30F3\u306B\u8F09\u305B\u305F\u3068\u304D\u306E\u7C97\u3055",
        note: "Wavetable sine at five bits (32 steps) \u2014 the depth of a PC Engine. The staircase is deliberate: that coarseness is what makes it read as a chip and not a synth."
      }
    );
    registerWave(
      "wtSine(3)",
      WT_SINE,
      3,
      {
        role: "chord",
        noteJa: "\u540C\u3058\u30B5\u30A4\u30F3\u6CE2\u3092 3 \u30D3\u30C3\u30C8(8 \u6BB5)\u307E\u3067\u843D\u3068\u3057\u305F\u3082\u306E\u3002\u6BB5\u306E\u89D2\u304B\u3089\u500D\u97F3\u304C\u751F\u3048\u3066\u3001\u30B5\u30A4\u30F3\u6CE2\u306A\u306E\u306B\u30B8\u30EA\u30B8\u30EA\u9CF4\u308B\u3002\u3053\u3053\u307E\u3067\u6765\u308B\u3068\u3001\u6DF1\u3055\u304C\u4F55\u3092\u3057\u3066\u3044\u308B\u306E\u304B\u304C\u4E00\u5EA6\u3067\u5206\u304B\u308B",
        note: "The same sine crushed to three bits (8 steps). The corners of the staircase grow harmonics, so a sine ends up buzzing \u2014 at this depth you hear what bit depth does in one listen."
      }
    );
    registerWave(
      "wtBell",
      WT_BELL,
      8,
      {
        role: "counter",
        noteJa: "\u4E0A\u306E\u500D\u97F3\u3092\u5F37\u304F\u6301\u305F\u305B\u305F\u6CE2\u5F62\u30E1\u30E2\u30EA\u3002\u7ACB\u3061\u4E0A\u304C\u308A\u304C\u91D1\u5C5E\u7684\u3067\u3001\u9418\u3084\u30C1\u30E3\u30A4\u30E0\u306B\u5411\u304F",
        note: "Wavetable with strong upper partials. Metallic attack, good for bells and chimes."
      }
    );
    registerFamily("wtOrgan", {
      note: "Stacked octaves in one wavetable cycle, like pulling an organ stop. Two bit depths to compare.",
      params: [{
        name: "bits",
        default: "8",
        note: "Bit depth of each sample.",
        values: [
          { value: "8", note: "Eight bits (256 steps), the coarseness of an SCC." },
          { value: "5", note: "Five bits (32 steps), the coarseness of a PC Engine. Grittier." }
        ]
      }]
    });
    registerWave(
      "wtOrgan(8)",
      WT_ORGAN,
      8,
      {
        role: "chord",
        noteJa: "1 \u5468\u671F\u306E\u4E2D\u306B\u30AA\u30AF\u30BF\u30FC\u30D6\u3092\u7A4D\u3093\u3067\u3042\u308B\u30021 \u3064\u306E\u97F3\u3068\u3044\u3046\u3088\u308A\u3001\u30AA\u30EB\u30AC\u30F3\u306E\u97F3\u6813\u3092\u5F15\u3044\u305F\u3088\u3046\u306B\u805E\u3053\u3048\u308B\u30028 \u30D3\u30C3\u30C8(256 \u6BB5)\u306A\u306E\u3067\u3001SCC \u306B\u8F09\u305B\u305F\u3068\u304D\u306E\u7C97\u3055",
        note: "Stacked octaves in one cycle, so it reads as an organ register rather than a single note. Eight bits (256 steps) \u2014 the coarseness you get on an SCC."
      }
    );
    registerWave(
      "wtOrgan(5)",
      WT_ORGAN,
      5,
      {
        role: "chord",
        noteJa: "\u540C\u3058\u5F62\u3092 5 \u30D3\u30C3\u30C8(32 \u6BB5)\u3067\u4E38\u3081\u305F\u3082\u306E\u3002PC \u30A8\u30F3\u30B8\u30F3\u306B\u8F09\u305B\u305F\u3068\u304D\u306E\u7C97\u3055\u3002\u6BB5\u304C\u7C97\u3044\u3076\u3093\u9AD8\u3044\u500D\u97F3\u304C\u5897\u3048\u3066\u3001\u540C\u3058\u5F62\u3067\u3082\u3056\u3089\u3064\u304F",
        note: "The same shape rounded to five bits (32 steps) \u2014 the coarseness you get on a PC Engine. The coarser steps add upper harmonics, so the same shape comes out grittier."
      }
    );
    registerWave(
      "wtRamp",
      WT_RAMP,
      5,
      {
        role: "lead",
        noteJa: "\u306E\u3053\u304E\u308A\u6CE2\u3092\u6CE2\u5F62\u30E1\u30E2\u30EA\u3067\u6301\u3063\u305F\u3082\u306E\u3002\u308F\u3056\u3068\u7C97\u304F(5 \u30D3\u30C3\u30C8)\u3057\u3066\u3042\u308B",
        note: "Sawtooth held in the wavetable, kept coarse (5-bit) on purpose."
      }
    );
    registerWave(
      "wtVoice",
      WT_VOICE,
      5,
      {
        role: "lead",
        noteJa: "\u5171\u9CF4\u306E\u5C71\u3092\u4F5C\u3063\u305F\u5F62\u3002\u7C97\u3044\u3002\u697D\u5668\u3068\u3044\u3046\u3088\u308A\u6BCD\u97F3\u306B\u805E\u3053\u3048\u308B",
        note: "Formant-ish shape, coarse. Reads as a vowel more than an instrument."
      }
    );
    registerWave(
      "wtPadWarm",
      WT_PAD_WARM,
      8,
      {
        role: "chord",
        env: "pad",
        noteJa: "\u548C\u97F3\u3092\u6577\u304F\u305F\u3081\u306E\u5F62\u3002\u500D\u97F3\u3092 3 \u672C\u3060\u3051\u306B\u3057\u3066\u4E0A\u3092\u7A7A\u3051\u3066\u3042\u308B\u3002\u3086\u3063\u304F\u308A\u5165\u308B\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u3092\u9023\u308C\u3066\u304F\u308B\u306E\u3067\u3001\u7F6E\u3044\u305F\u3060\u3051\u3067\u65CB\u5F8B\u306E\u4E0B\u306B\u56DE\u308B",
        note: "A shape for laying chords under things: only three partials, with the top left empty. It brings a slow envelope with it, so it sits under the melody without being told to."
      }
    );
    registerWave(
      "wtPadAiry",
      WT_PAD_AIRY,
      8,
      {
        role: "chord",
        env: "swell",
        noteJa: "\u540C\u3058\u304F\u548C\u97F3\u306E\u305F\u3081\u306E\u5F62\u3060\u304C\u3001\u5947\u6570\u500D\u97F3\u3060\u3051\u3067\u4E2D\u304C\u7A7A\u3044\u3066\u3044\u308B\u3002\u6E29\u304B\u3044\u307B\u3046\u3068\u91CD\u306D\u308B\u3068\u3001\u540C\u3058\u548C\u97F3\u3067\u3082\u5225\u306E\u8272\u306B\u306A\u308B\u3002\u7ACB\u3061\u4E0A\u304C\u308A\u306F\u3055\u3089\u306B\u9045\u3044",
        note: "Also for chords, but odd partials only, hollow in the middle. Layered against the warm one the same chord changes colour. Slower to arrive again."
      }
    );
    registerWave(
      "wtSquareSoft",
      WT_SQUARE_SOFT,
      8,
      {
        role: "lead",
        noteJa: "\u89D2\u3092\u4E38\u3081\u305F\u77E9\u5F62\u6CE2\u3002\u4E2D\u304C\u7A7A\u3044\u305F\u611F\u3058\u306F\u6B8B\u3057\u305F\u307E\u307E\u3001\u304D\u3064\u3055\u3060\u3051\u53D6\u308C\u308B",
        note: "Square with the corners rounded off. Less harsh than a hard pulse while keeping the hollow character."
      }
    );
  }

  // ../../../tmp/panther-update/sound/fmpresets.js
  var FM_PRESETS = {
    // 1 バイオリン。弓のこすれを出すため、比を少しずらして倍音を残す
    // 2 ギター。はじいた瞬間だけ硬く、あとは丸くなる
    // 3 ピアノ。低い比で芯を作り、減りは中くらい
    // 4 フルート。倍音が少なく、息の立ち上がりがゆっくり
    // 5 クラリネット。奇数倍音が立つので比は 3
    // 6 オーボエ。細く鼻にかかった音。比を高めに取る
    // 7 トランペット。吹き込むほど倍音が増える(深さを大きく、残りも多め)
    // 8 オルガン。倍音が動かないので、減らさずそのまま持続させる
    // 9 ホルン。丸く、奥から鳴る。立ち上がりはゆっくり
    // 10 シンセ。作り物らしく、比をずらして濁らせる
    // 11 ハープシコード。はじく音。硬くて減りが速い
    // 12 ビブラフォン。金属らしく、比を半端にする
    // 13 シンセベース。低音でぶ厚く、アタックだけ硬い
    // 14 アコースティックベース。指ではじいた丸い低音
    // 15 エレキギター。歪んだ持続音。深さを保ったままにする
    // ---- このエンジン独自のもの(実機には無い) ----
    // 硬い金属質のリード。比を半端にして倍音を濁らせ、伸ばすほど澄んでいく
    fm2Lead: {
      gm: "Lead 1 (square)",
      pitch: [-180, -110, -50, 0],
      vib: { depth: 12, speed: 6.5, delay: 18 },
      noteJa: "\u305C\u3093\u3076\u306E\u4E0A\u306B\u4E57\u305B\u308B\u305F\u3081\u306E\u3001\u72EC\u594F\u306E\u97F3\u30024 \u30D5\u30EC\u30FC\u30E0\u3067\u6ED1\u308A\u8FBC\u3093\u3067\u304B\u3089\u300118 \u30D5\u30EC\u30FC\u30E0\u5F8C\u306B\u6DF1\u304F\u63FA\u308C\u308B\u30022 \u3064\u63C3\u3063\u3066\u521D\u3081\u3066\u300C\u5F3E\u3044\u3066\u3044\u308B\u300D\u97F3\u306B\u306A\u308B",
      role: "lead",
      note: "Solo voice meant to sit on top of everything else. Slides up into place over four frames, then wobbles deeply from eighteen. Both together are what makes a lead sound played rather than triggered.",
      ratio: 2.5,
      depth: 7,
      attack: 4e-3,
      decay: 0.22,
      sustain: 0.25
    },
    // 唸る低音。出だしだけ深く歪ませて、あとは芯だけ残す
    fm2Growl: {
      gm: "Lead 8 (bass + lead)",
      vib: { depth: 14, speed: 9, delay: 6 },
      noteJa: "\u6DF1\u304F\u63FA\u3089\u3057\u3066\u3001\u6BD4\u3082\u6574\u6570\u304B\u3089\u5927\u304D\u304F\u5916\u3057\u3066\u3042\u308B\u3002\u500D\u97F3\u304C\u305D\u308D\u308F\u306A\u3044\u306E\u3067\u5538\u308B\u3002\u3053\u306E\u4E2D\u3067\u3044\u3061\u3070\u3093\u901F\u304F\u6DF1\u304F\u3001\u307B\u3068\u3093\u3069\u6700\u521D\u304B\u3089\u63FA\u308C\u308B\u3002\u843D\u3061\u7740\u304F\u524D\u306B\u5538\u308B",
      role: "bass",
      note: "Deep modulation with the ratio well off a whole number \u2014 inharmonic, so it snarls. The fastest and deepest wobble here, starting almost at once. It snarls before it settles.",
      ratio: 1.5,
      depth: 9,
      attack: 2e-3,
      decay: 0.14,
      sustain: 0.12
    },
    // 鐘のように響く合いの手。倍音が長く残る
    fm2Chime: {
      gm: "Tubular Bells",
      vol: [15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1],
      noteJa: "\u9418\u306E\u3088\u3046\u306A\u97F3\u3002\u9AD8\u3044\u500D\u97F3\u304C\u9577\u304F\u6B8B\u308B\u300221 \u30D5\u30EC\u30FC\u30E0\u304B\u3051\u3066\u3086\u3063\u304F\u308A\u843D\u3061\u308B\u3002\u9418\u306F\u5C3B\u5C3E\u306E\u307B\u3046\u304C\u672C\u4F53",
      role: "counter",
      note: "Bell-like, high partials, long tail. Falls slowly over twenty-one frames. A bell is mostly its tail.",
      ratio: 4.7,
      depth: 5,
      attack: 2e-3,
      decay: 0.6,
      sustain: 0.1
    }
    // ---- リズム ----
    // 実機のリズム音源も、専用の回路ではなく**濁らせた FM を短く切って**作っていた。
    // 比を整数から外して音程感を消し、深さを大きく、減衰を極端に短くする。
    // ノイズを使わないので、**SE のノイズ枠を食わない**のも利点。
    //
    // 名前は **fmDrum で始める**。一覧に並んだときに打楽器だと分かるうえ、
    // 道具の側も名前だけで見分けられる(音色テストはこれを見て、
    // ドレミではなくリズムの曲を鳴らす)
    // バスドラム。**音程が落ちる**のがこの楽器の正体なので drop を使う。
    // 高いところから一瞬で落ちる「ドッ」があって、はじめて胴の音に聞こえる
    // スネアドラム。**胴の音と、裏に張った響き線のざらつき**が重なった楽器。
    // 2 オペでノイズは作れないので、比を整数から大きく外して深く揺らし、
    // 倍音をびっしり詰めて**ノイズに近い濁り**を作る。
    // そこへ短い落ち(drop)を足すと、皮を張った胴を叩いた感じになる
    // タムも少しだけ落ちる(バスドラムほどではない)
    // 手拍子。**胴が無いので落ちない。**スネアから drop を外して、
    // 比をさらに整数から離し、減衰をもっと短くしたもの。
    // 皮の音が無いぶん、濁りだけが一瞬鳴って消える
  };
  function registerDefaultFM() {
    for (const [name, p] of Object.entries(FM_PRESETS)) {
      registerFM(name, p, { overwrite: true, note: p.note, noteJa: p.noteJa, role: p.role, gm: p.gm });
    }
  }

  // ../../../tmp/panther-update/sound/beeppresets.js
  var BEEP_PRESETS = {
    // ---- 搬送波を刻む型。**音程を変える回路が無い機械** ----
    // 2.4kHz が鳴りっぱなしで、ソフトはそれを On/Off するだけ。
    // 消せない搬送波が乗り、画面の DMA で刻む間隔も揺れる = 濁る
    "beep(noisy)": {
      role: "lead",
      note: "Japanese 8-bit micro beeper. A 2.4kHz carrier runs constantly and software only gates it on and off, so the carrier bleeds through and the video DMA jitters the gaps. The muddiness is the sound, not a defect.",
      carrier: 2400,
      jitter: 0.4,
      frame: 60,
      display: 0.7,
      noteJa: "\u56FD\u7523 8 \u30D3\u30C3\u30C8\u6A5F\u306E\u30D3\u30FC\u30D7\u3002\u6FC1\u308A\u304C\u3053\u306E\u97F3\u306E\u672C\u4F53"
    },
    "beep(calm)": {
      role: "lead",
      note: "The same machine with the jitter halved. Use when the melody matters more than the character.",
      carrier: 2400,
      jitter: 0.15,
      frame: 60,
      display: 0.7,
      noteJa: "\u540C\u3058\u4F5C\u308A\u3067\u63FA\u308C\u3092\u6D45\u304F\u3057\u305F\u3082\u306E\u3002\u65CB\u5F8B\u3092\u805E\u304B\u305B\u305F\u3044\u3068\u304D"
    },
    "beep(flat)": {
      role: "lead",
      note: "Does not exist on real hardware. Same carrier bleed, jitter removed \u2014 the display always fought the CPU, so it always wobbled.",
      carrier: 2400,
      jitter: 0,
      noteJa: "**\u5B9F\u5728\u3057\u306A\u3044\u3002**\u540C\u3058\u6FC1\u308A\u306E\u307E\u307E\u63FA\u308C\u3060\u3051\u6B62\u3081\u305F\u3082\u306E\u3002\u5B9F\u6A5F\u306F\u753B\u9762\u3068\u98DF\u3044\u5408\u3046\u306E\u3067\u5FC5\u305A\u63FA\u308C\u305F"
    },
    // ---- 線を直接叩く型。搬送波が無いので素直な矩形 ----
    // 画面とメモリを取り合う機械は、同じ理由で揺れる。
    // **同じ仲間の作り分けとして持つ** — 鳴らす側から見れば
    // 「ビープの、濁っていないほう」でしかない
    "beep(direct)": {
      role: "lead",
      note: "Speaker driven directly, so no carrier: a clean square. Still jitters because video and memory share the bus.",
      carrier: 0,
      jitter: 0.4,
      frame: 50,
      display: 0.62,
      noteJa: "\u7DDA\u3092\u76F4\u63A5\u53E9\u304F\u578B\u3002\u642C\u9001\u6CE2\u304C\u7121\u3044\u306E\u3067\u7D20\u76F4\u306A\u77E9\u5F62\u3002\u753B\u9762\u3092\u63CF\u304F\u9593\u3060\u3051 CPU \u304C\u5F85\u305F\u3055\u308C\u3066\u63FA\u308C\u308B(50Hz)"
    },
    "beep(clean)": {
      role: "lead",
      note: "Direct-drive beeper on a faster machine. Cleaner and higher.",
      carrier: 0,
      jitter: 0,
      frame: 60,
      display: 0.7,
      noteJa: "\u540C\u3058\u4F5C\u308A\u3067\u3001\u753B\u9762\u3068\u98DF\u3044\u5408\u308F\u306A\u3044\u6A5F\u68B0\u306E\u3082\u306E\u3002\u63FA\u308C\u306A\u3044"
    },
    // ---- エンベロープを連れてくるもの ----
    // **音色とエンベロープの組み合わせで初めて楽器になる**例。
    // 実機のビープは音量すら変えられなかったので、これは完全にこちらの発明。
    // **これも同じ仲間の作り分け** — ビープは 1 種類しかない音なので、
    // 別々の名前で並べるより、1 行の中で押し比べられるほうが早い。
    "beep(pluck)": {
      role: "lead",
      note: "Beeper gated with a short envelope so each note reads as plucked.",
      carrier: 2400,
      jitter: 0.25,
      frame: 60,
      display: 0.7,
      env: "pluck",
      noteJa: "**\u5B9F\u6A5F\u306B\u7121\u3044\u697D\u5668\u3002**\u6FC1\u3063\u305F\u30D3\u30FC\u30D7\u3092\u5F3E\u3044\u305F\u97F3\u306B\u3059\u308B\u3002\u982D\u3060\u3051\u9CF4\u3063\u3066\u843D\u3061\u308B\u306E\u3067\u3001\u901F\u3044\u523B\u307F\u3067\u3082\u7C92\u304C\u7ACB\u3064"
    },
    "beep(chime)": {
      role: "lead",
      note: "Two beeper tones close together, beating against each other.",
      carrier: 3600,
      jitter: 0.1,
      frame: 60,
      display: 0.7,
      env: "piano",
      noteJa: "\u540C\u3058\u4F5C\u308A\u3067\u9AD8\u3044\u642C\u9001\u6CE2 + \u30D4\u30A2\u30CE\u98A8\u306E\u6E1B\u8870\u3002\u786C\u304F\u6F84\u3093\u3060\u7C92"
    },
    // ---- カセット ----
    // 搬送波は持たない(ロード音は 2 つの音の切り替えそのもの)。
    // 揺れをごく浅く遅くすると**テープの回転むら(ワウ)**になる。
    //
    // **`special: ['tape']` を持つ。**下の hiss / wow / muffle は
    // MML に `=` を書いたときにしか通らないので、音符で鳴らすと
    // **ただの矩形波**になる。道具はこの印を見て鳴らし方を変える。
    //
    // 3 つはテープの傷み具合の並び。**素の `tape` は真ん中**にしてある —
    // 何も考えずに選んだときに出るものが、いちばん普通のテープであってほしい。
    // 劣化のほうは味が濃く、**曲に敷くと勝ちすぎる**。
    //
    // **名前は `tape`。**ビープ音源の上に載ってはいるが、これは楽器ではなく
    // ロード音そのもので、`bp` の仲間として並べるものではない。
    //
    // **`dev: ['done']`。**3 つに割ることも名前も、これで確定。
    // 曲の側から名前で呼ばれるので、ここが動くと向こうが動く
    "tape(used)": {
      role: "se",
      special: ["tape"],
      dev: ["done"],
      tags: ["tape", "loading", "cassette"],
      note: "Cassette loading noise off an ordinary tape: the speed holds, a little hiss underneath, the top end softened.",
      carrier: 0,
      jitter: 0.02,
      frame: 7,
      display: 0.5,
      hiss: 0.05,
      wow: 0,
      muffle: 4e3,
      noteJa: "\u30AB\u30BB\u30C3\u30C8\u306E\u30ED\u30FC\u30C9\u97F3\u7528\u3002\u3075\u3064\u3046\u306B\u4F7F\u3063\u3066\u304D\u305F\u30C6\u30FC\u30D7\u3002\u56DE\u8EE2\u3080\u3089\u306F\u7121\u304F\u3001\u5730\u306E\u30CE\u30A4\u30BA\u304C\u5C11\u3057\u4E57\u3063\u3066\u3001\u9AD8\u3044\u3068\u3053\u308D\u304C\u3084\u308F\u3089\u3050"
    },
    "tape(worn)": {
      role: "se",
      special: ["tape"],
      dev: ["done"],
      tags: ["tape", "loading", "cassette"],
      note: "The same loading noise off a worn tape: the speed wobbles, the top end is gone, the hiss is always there.",
      carrier: 0,
      jitter: 0.02,
      frame: 7,
      display: 0.5,
      hiss: 0.16,
      wow: 0.05,
      muffle: 2200,
      noteJa: "\u540C\u3058\u30ED\u30FC\u30C9\u97F3\u3092\u52A3\u5316\u3057\u305F\u30C6\u30FC\u30D7\u3067\u3002\u56DE\u8EE2\u3080\u3089\u3067\u97F3\u7A0B\u304C\u63FA\u308C\u3001\u9AD8\u3044\u3068\u3053\u308D\u304C\u843D\u3061\u3066\u3053\u3082\u308A\u3001\u5730\u306E\u30CE\u30A4\u30BA\u304C\u5E38\u306B\u9CF4\u3063\u3066\u3044\u308B"
    },
    "tape(clean)": {
      role: "se",
      special: ["tape"],
      dev: ["done"],
      tags: ["tape", "loading", "cassette"],
      note: "The same loading noise off a fresh tape: no hiss at all, only the top end rolled off.",
      carrier: 0,
      jitter: 0.02,
      frame: 7,
      display: 0.5,
      hiss: 0,
      wow: 0,
      muffle: 6e3,
      noteJa: "\u540C\u3058\u30ED\u30FC\u30C9\u97F3\u3092\u65B0\u54C1\u306E\u30C6\u30FC\u30D7\u3067\u3002\u5730\u306E\u30CE\u30A4\u30BA\u304C\u307E\u3063\u305F\u304F\u7121\u304F\u3001\u9AD8\u3044\u3068\u3053\u308D\u304C\u5C11\u3057\u843D\u3061\u3066\u3044\u308B\u3060\u3051"
    },
    // ---- 実在しないもの。**これも同じ仲間の作り分け** ----
    "beep(glass)": {
      role: "lead",
      note: "High and thin, on the edge of the machine's range.",
      carrier: 6e3,
      jitter: 0.25,
      frame: 120,
      display: 0.4,
      noteJa: "\u5B9F\u5728\u3057\u306A\u3044\u3002\u642C\u9001\u6CE2\u304C\u9AD8\u304F\u3001\u63FA\u308C\u304C\u901F\u3044\u3002\u786C\u304F\u3066\u843D\u3061\u7740\u304B\u306A\u3044\u97F3"
    },
    // **これだけ音程が出ない。**揺れ 0.55 は書いた高さの 45〜100% まで動くので、
    // しかも 30Hz とゆっくりなので、音符ではなく地響きとして聞こえる。役は se
    "beep(tar)": {
      role: "se",
      note: "Low and coarse. Slow enough that the individual gate steps are audible.",
      carrier: 900,
      jitter: 0.55,
      frame: 30,
      display: 0.8,
      noteJa: "\u5B9F\u5728\u3057\u306A\u3044\u3002\u642C\u9001\u6CE2\u304C\u4F4E\u304F\u3001\u63FA\u308C\u304C\u6DF1\u3044\u3002**\u97F3\u7A0B\u306F\u51FA\u306A\u3044** \u2014 \u66F8\u3044\u305F\u9AD8\u3055\u306E\u534A\u5206\u307E\u3067\u63FA\u308C\u308B\u306E\u3067\u3001\u97F3\u7B26\u3067\u306F\u306A\u304F\u5730\u97FF\u304D\u306B\u805E\u3053\u3048\u308B"
    }
  };
  function familyFrom(head, spec) {
    const values = Object.entries(BEEP_PRESETS).filter(([name]) => name.startsWith(head + "(")).map(([name, p]) => ({ value: name.slice(head.length + 1, -1), note: p.note }));
    registerFamily(head, { note: spec.note, params: [{ ...spec.param, values }] });
  }
  function registerDefaultBeeps() {
    familyFrom("beep", {
      note: "1-bit beeper speakers of 8-bit micros. Opens its own section: @{beep( )}{ \u2026 } takes BASIC-style BEEP sweeps.",
      param: { name: "model", default: "noisy", note: "Which beeper circuit, real or imagined." }
    });
    familyFrom("tape", {
      note: "Cassette loading noise. Opens its own section: @{tape( )}{ \u2026 } takes = for pilot tone and ? for data.",
      param: { name: "wear", default: "used", note: "Condition of the tape." }
    });
    for (const [name, p] of Object.entries(BEEP_PRESETS)) {
      registerBeep(
        name,
        p,
        {
          note: p.note,
          noteJa: p.noteJa,
          role: p.role,
          tags: p.tags,
          special: p.special,
          dev: p.dev,
          vsteps: p.vsteps,
          vcurve: p.vcurve
        }
      );
    }
  }

  // ../../../tmp/panther-update/sound/fdspresets.js
  var FDS_LEN = 64;
  var FDS_BITS = 6;
  var build2 = (fn) => Array.from({ length: FDS_LEN }, (_, i) => fn(i / FDS_LEN));
  var FDS_STEP = build2((p) => {
    const n = 8;
    return Math.round(Math.sin(2 * Math.PI * p) * n) / n;
  });
  var FDS_SPIKE = build2((p) => p < 0.12 ? Math.sin(Math.PI * p / 0.12) : -0.18);
  var FDS_HALF = build2((p) => {
    const v = Math.sin(2 * Math.PI * p);
    return (v > 0 ? v : 0) * 2 - 0.6;
  });
  var FDS_RAMP = build2((p) => Math.round((1 - 2 * p) * 6) / 6);
  var FDS_ODD = build2((p) => p < 0.35 ? Math.sin(Math.PI * p / 0.35) : -0.7 * Math.sin(Math.PI * (p - 0.35) / 0.65));
  var FDS_TWIN = build2((p) => Math.sin(2 * Math.PI * p) * 0.5 + Math.sin(4 * Math.PI * p) * 0.5);
  var FDS_LIKE_ZLD = build2((p) => {
    const h = Math.sin(2 * Math.PI * p) + 0.12 * Math.sin(4 * Math.PI * p) + 0.28 * Math.sin(6 * Math.PI * p) + 0.16 * Math.sin(10 * Math.PI * p) + 0.09 * Math.sin(14 * Math.PI * p);
    return h / 1.65;
  });
  var MOD_TRI = Array.from({ length: 32 }, (_, i) => 1 - 4 * Math.abs(i / 32 - 0.5));
  var MOD_STEP = Array.from({ length: 32 }, (_, i) => [1, 1, 0.5, 0.5, 0, 0, -0.5, -1][i >> 2]);
  var FDS_PRESETS = {
    fdsStep: {
      noteJa: "\u6BB5\u306E\u3042\u308B\u6CE2\u5F62\u30E1\u30E2\u30EA\u3002\u300C\u6CE2\u5F62\u30E1\u30E2\u30EA\u306E\u97F3\u300D\u3068\u3044\u3061\u3070\u3093\u5206\u304B\u308A\u3084\u3059\u304F\u805E\u3053\u3048\u308B\u5F62",
      role: "lead",
      wave: FDS_STEP,
      note: 'Stepped wavetable \u2014 the shape that reads as "wavetable chip" more than any other.'
    },
    fdsSpike: {
      noteJa: "\u6CE2\u5F62\u30E1\u30E2\u30EA\u306B\u7D30\u3044\u5C71\u3092\u7ACB\u3066\u305F\u3082\u306E\u3002\u660E\u308B\u304F\u3066\u7D30\u3044",
      role: "lead",
      note: "Narrow spike in the wavetable: bright and thin.",
      wave: FDS_SPIKE
    },
    fdsHalf: {
      noteJa: "\u534A\u5206\u3060\u3051\u6B8B\u3057\u305F\u6CE2\u3002\u592A\u304F\u3066\u4E38\u3044",
      role: "bass",
      wave: FDS_HALF,
      note: "Half-wave rectified: fat and round."
    },
    fdsRamp: {
      noteJa: "\u6CE2\u5F62\u30E1\u30E2\u30EA\u306B\u5742\u3092\u5165\u308C\u305F\u3082\u306E\u3002\u3056\u3089\u3064\u3044\u3066\u3044\u3066\u3001\u306E\u3053\u304E\u308A\u306B\u8FD1\u3044",
      role: "lead",
      wave: FDS_RAMP,
      note: "Ramp in the wavetable. Buzzy, close to a saw."
    },
    fdsOdd: {
      noteJa: "\u5947\u6570\u306E\u500D\u97F3\u3060\u3051\u306E\u5F62\u3002\u6728\u7BA1\u306E\u3088\u3046\u306B\u9F3B\u306B\u304B\u304B\u3063\u3066\u805E\u3053\u3048\u308B",
      role: "lead",
      wave: FDS_ODD,
      note: "Odd-harmonic shape. Reads as reedy."
    },
    fdsTwin: {
      noteJa: "1 \u5468\u671F\u306B\u5C71\u304C 2 \u3064\u3002\u5B9F\u969B\u306E\u9AD8\u3055\u3088\u308A 1 \u30AA\u30AF\u30BF\u30FC\u30D6\u660E\u308B\u304F\u805E\u3053\u3048\u308B",
      role: "lead",
      wave: FDS_TWIN,
      note: "Two humps per cycle, so it sounds an octave brighter than it is."
    },
    // ---- 変調ユニット入り。**ここからが FDS らしさ** ----
    fdsVibe: {
      role: "lead",
      note: "Slow modulation used as vibrato rather than as timbre.",
      wave: FDS_HALF,
      mod: { ratio: 0.035, depth: 0.03, table: MOD_TRI },
      noteJa: "\u3086\u3063\u304F\u308A\u63FA\u308C\u308B\u3002\u30D3\u30D6\u30E9\u30FC\u30C8"
    },
    fdsBell: {
      role: "counter",
      note: "Fast modulation at a musical ratio, which grows sidebands \u2014 much the same thing FM does.",
      wave: FDS_STEP,
      mod: { ratio: 1, depth: 0.6, table: MOD_TRI },
      noteJa: "**\u540C\u3058\u9AD8\u3055\u3067\u6DF1\u304F\u63FA\u3089\u3059**\u3002\u91D1\u5C5E\u8CEA"
    },
    fdsMetal: {
      role: "perc",
      note: "Modulation deep enough that the result stops being a pitch and becomes a clang.",
      wave: FDS_TWIN,
      mod: { ratio: 2.51, depth: 0.9, table: MOD_STEP },
      noteJa: "\u534A\u7AEF\u306A\u6BD4 + \u6BB5\u306E\u3042\u308B\u8868\u3002\u6FC1\u3063\u305F\u91D1\u5C5E"
    },
    fdsWobble: {
      role: "counter",
      note: "Modulation slow and deep: the pitch audibly swings.",
      wave: FDS_ODD,
      mod: { ratio: 0.25, depth: 0.35, table: MOD_STEP },
      noteJa: "\u97F3\u306E 1/4 \u306E\u901F\u3055\u3067\u6DF1\u304F\u3002\u5927\u304D\u304F\u3046\u306D\u308B"
    },
    fdsGrowl: {
      role: "bass",
      note: "Low, with modulation fast enough to roughen the tone.",
      wave: FDS_RAMP,
      mod: { ratio: 0.5, depth: 0.7, table: MOD_STEP },
      noteJa: "\u534A\u5206\u306E\u901F\u3055\u3067\u6DF1\u304F\u3002\u5538\u308B"
    },
    // **旋律を張るための 1 つ。**上の 5 つはビブラートを音色として使っているが、
    // これは**ビブラートをビブラートとして**使う — 浅くゆっくり掛けて、
    // 形のほうで通りをよくする
    // **前置きのすぐ後ろの `Like`。**あの音を目指した、という印
    // (docs/MML.md の「音色の名前」)。**実機のデータではない**ことを
    // 名前のほうでも言っておく
    fdsLikeZld: {
      role: "lead",
      tags: ["homage"],
      note: "A hollow, slightly asymmetric wavetable with a shallow vibrato \u2014 the overworld-lead sound of the disk system, drawn rather than lifted.",
      wave: FDS_LIKE_ZLD,
      mod: { ratio: 0.015, depth: 0.025, table: MOD_TRI },
      noteJa: "\u4E2D\u304C\u7A7A\u3044\u305F\u5F62\u306B\u3001\u6D45\u3044\u63FA\u308C\u3092\u3086\u3063\u304F\u308A\u639B\u3051\u305F\u3082\u306E\u3002\u65CB\u5F8B\u3092\u5F35\u308B\u305F\u3081\u306E\u97F3\u3067\u3001\u548C\u97F3\u306E\u4E0A\u306B\u4E57\u305B\u3066\u3082\u57CB\u3082\u308C\u306A\u3044"
    }
  };
  function registerDefaultFDS() {
    for (const [name, p] of Object.entries(FDS_PRESETS)) {
      const meta = { note: p.note, noteJa: p.noteJa, role: p.role, tags: p.tags, alias: p.alias };
      registerWave(name, p.wave, FDS_BITS, p.mod ? { ...meta, modRatio: p.mod.ratio, modDepth: p.mod.depth, modTable: p.mod.table } : meta);
    }
  }

  // ../../../tmp/panther-update/sound/ym2151.js
  var OPM_CLOCK = 3579545;
  var OPM_RATE = OPM_CLOCK / 64;
  var OPM_CODE = `
// ---- \u8868 ----

// \u30B5\u30A4\u30F3\u3092\u5BFE\u6570\u306E\u6E1B\u8870\u3068\u3057\u3066\u6301\u3064(4.8 \u56FA\u5B9A\u5C0F\u6570\u30011/4 \u5468\u671F\u3076\u3093)\u3002
// \u539F\u5178\u306E s_sin_table \u3068\u5168\u90E8\u4E00\u81F4\u3059\u308B
const SIN = new Uint16Array(256);
for (let x = 0; x < 256; x++) {
  SIN[x] = Math.round(-Math.log2(Math.sin((x + 0.5) * Math.PI / 512)) * 256);
}

// \u6E1B\u8870\u304B\u3089\u632F\u5E45\u3078\u623B\u3059\u8868\u3002\u539F\u5178\u306E s_power_table \u3068\u4E00\u81F4\u3059\u308B\u3002
// 0x400 \u3092\u5148\u306B\u8DB3\u3057\u3066 2 \u30D3\u30C3\u30C8\u5DE6\u3078\u5BC4\u305B\u3066\u3042\u308B\u306E\u3082\u539F\u5178\u3069\u304A\u308A\u3067\u3001
// \u5F15\u3044\u305F\u3042\u3068\u306B\u53F3\u30B7\u30D5\u30C8\u3059\u308B\u3060\u3051\u3067\u6E08\u3080\u3088\u3046\u306B\u3057\u3066\u3042\u308B
const POW = new Uint16Array(256);
for (let i = 0; i < 256; i++) {
  POW[i] = ((Math.round((Math.pow(2, (255 - i) / 256) - 1) * 1024)) | 0x400) << 2;
}

// 1 \u5468\u671F\u3076\u3093\u306E\u6CE2\u5F62\u3002\u4E0B 15 \u30D3\u30C3\u30C8\u304C\u6E1B\u8870\u3001\u30D3\u30C3\u30C8 15 \u304C\u7B26\u53F7
const WAVE = new Uint16Array(1024);
for (let i = 0; i < 1024; i++) {
  const half = (i & 0x100) ? (~i & 0xff) : (i & 0xff);
  WAVE[i] = SIN[half] | (((i >> 9) & 1) << 15);
}

// **\u97F3\u7A0B\u306E\u8868\u3002** \u5F0F\u3067\u306F\u51FA\u306A\u3044(\u4E0A\u306E\u8AAC\u660E)\u300232 \u3067\u5272\u3063\u3066\u3042\u308B\u306E\u3067\u623B\u3059
const PSTEP = Uint32Array.from([
  1299,1300,1301,1302,1303,1304,1305,1306,1308,1309,1310,1311,1313,1314,1315,1316,1318,1319,1320,1321,1322,1323,1324,1325,
  1327,1328,1329,1330,1332,1333,1334,1335,1337,1338,1339,1340,1341,1342,1343,1344,1346,1347,1348,1349,1351,1352,1353,1354,
  1356,1357,1358,1359,1361,1362,1363,1364,1366,1367,1368,1369,1371,1372,1373,1374,1376,1377,1378,1379,1381,1382,1383,1384,
  1386,1387,1388,1389,1391,1392,1393,1394,1396,1397,1398,1399,1401,1402,1403,1404,1406,1407,1408,1409,1411,1412,1413,1414,
  1416,1417,1418,1419,1421,1422,1423,1424,1426,1427,1429,1430,1431,1432,1434,1435,1437,1438,1439,1440,1442,1443,1444,1445,
  1447,1448,1449,1450,1452,1453,1454,1455,1458,1459,1460,1461,1463,1464,1465,1466,1468,1469,1471,1472,1473,1474,1476,1477,
  1479,1480,1481,1482,1484,1485,1486,1487,1489,1490,1492,1493,1494,1495,1497,1498,1501,1502,1503,1504,1506,1507,1509,1510,
  1512,1513,1514,1515,1517,1518,1520,1521,1523,1524,1525,1526,1528,1529,1531,1532,1534,1535,1536,1537,1539,1540,1542,1543,
  1545,1546,1547,1548,1550,1551,1553,1554,1556,1557,1558,1559,1561,1562,1564,1565,1567,1568,1569,1570,1572,1573,1575,1576,
  1578,1579,1580,1581,1583,1584,1586,1587,1590,1591,1592,1593,1595,1596,1598,1599,1601,1602,1604,1605,1607,1608,1609,1610,
  1613,1614,1615,1616,1618,1619,1621,1622,1624,1625,1627,1628,1630,1631,1632,1633,1637,1638,1639,1640,1642,1643,1645,1646,
  1648,1649,1651,1652,1654,1655,1656,1657,1660,1661,1663,1664,1666,1667,1669,1670,1672,1673,1675,1676,1678,1679,1681,1682,
  1685,1686,1688,1689,1691,1692,1694,1695,1697,1698,1700,1701,1703,1704,1706,1707,1709,1710,1712,1713,1715,1716,1718,1719,
  1721,1722,1724,1725,1727,1728,1730,1731,1734,1735,1737,1738,1740,1741,1743,1744,1746,1748,1749,1751,1752,1754,1755,1757,
  1759,1760,1762,1763,1765,1766,1768,1769,1771,1773,1774,1776,1777,1779,1780,1782,1785,1786,1788,1789,1791,1793,1794,1796,
  1798,1799,1801,1802,1804,1806,1807,1809,1811,1812,1814,1815,1817,1819,1820,1822,1824,1825,1827,1828,1830,1832,1833,1835,
  1837,1838,1840,1841,1843,1845,1846,1848,1850,1851,1853,1854,1856,1858,1859,1861,1864,1865,1867,1868,1870,1872,1873,1875,
  1877,1879,1880,1882,1884,1885,1887,1888,1891,1892,1894,1895,1897,1899,1900,1902,1904,1906,1907,1909,1911,1912,1914,1915,
  1918,1919,1921,1923,1925,1926,1928,1930,1932,1933,1935,1937,1939,1940,1942,1944,1946,1947,1949,1951,1953,1954,1956,1958,
  1960,1961,1963,1965,1967,1968,1970,1972,1975,1976,1978,1980,1982,1983,1985,1987,1989,1990,1992,1994,1996,1997,1999,2001,
  2003,2004,2006,2008,2010,2011,2013,2015,2017,2019,2021,2022,2024,2026,2028,2029,2032,2033,2035,2037,2039,2041,2043,2044,
  2047,2048,2050,2052,2054,2056,2058,2059,2062,2063,2065,2067,2069,2071,2073,2074,2077,2078,2080,2082,2084,2086,2088,2089,
  2092,2093,2095,2097,2099,2101,2103,2104,2107,2108,2110,2112,2114,2116,2118,2119,2122,2123,2125,2127,2129,2131,2133,2134,
  2137,2139,2141,2142,2145,2146,2148,2150,2153,2154,2156,2158,2160,2162,2164,2165,2168,2170,2172,2173,2176,2177,2179,2181,
  2185,2186,2188,2190,2192,2194,2196,2197,2200,2202,2204,2205,2208,2209,2211,2213,2216,2218,2220,2222,2223,2226,2227,2230,
  2232,2234,2236,2238,2239,2242,2243,2246,2249,2251,2253,2255,2256,2259,2260,2263,2265,2267,2269,2271,2272,2275,2276,2279,
  2281,2283,2285,2287,2288,2291,2292,2295,2297,2299,2301,2303,2304,2307,2308,2311,2315,2317,2319,2321,2322,2325,2326,2329,
  2331,2333,2335,2337,2338,2341,2342,2345,2348,2350,2352,2354,2355,2358,2359,2362,2364,2366,2368,2370,2371,2374,2375,2378,
  2382,2384,2386,2388,2389,2392,2393,2396,2398,2400,2402,2404,2407,2410,2411,2414,2417,2419,2421,2423,2424,2427,2428,2431,
  2433,2435,2437,2439,2442,2445,2446,2449,2452,2454,2456,2458,2459,2462,2463,2466,2468,2470,2472,2474,2477,2480,2481,2484,
  2488,2490,2492,2494,2495,2498,2499,2502,2504,2506,2508,2510,2513,2516,2517,2520,2524,2526,2528,2530,2531,2534,2535,2538,
  2540,2542,2544,2546,2549,2552,2553,2556,2561,2563,2565,2567,2568,2571,2572,2575,2577,2579,2581,2583,2586,2589,2590,2593
], (v) => v * 32);

// \u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u306E\u523B\u307F\u3002\u901F\u3055 0..63 \u3054\u3068\u306B\u30018 \u56DE\u3076\u3093\u306E\u5897\u5206\u304C 4 \u30D3\u30C3\u30C8\u305A\u3064
const INC = Uint32Array.from([
  0x00000000,0x00000000,0x10101010,0x10101010,0x10101010,0x10101010,0x11101110,0x11101110,
  0x10101010,0x10111010,0x11101110,0x11111110,0x10101010,0x10111010,0x11101110,0x11111110,
  0x10101010,0x10111010,0x11101110,0x11111110,0x10101010,0x10111010,0x11101110,0x11111110,
  0x10101010,0x10111010,0x11101110,0x11111110,0x10101010,0x10111010,0x11101110,0x11111110,
  0x10101010,0x10111010,0x11101110,0x11111110,0x10101010,0x10111010,0x11101110,0x11111110,
  0x10101010,0x10111010,0x11101110,0x11111110,0x10101010,0x10111010,0x11101110,0x11111110,
  0x11111111,0x21112111,0x21212121,0x22212221,0x22222222,0x42224222,0x42424242,0x44424442,
  0x44444444,0x84448444,0x84848484,0x88848884,0x88888888,0x88888888,0x88888888,0x88888888
]);

// \u30C7\u30C1\u30E5\u30FC\u30F3(DT1)\u3002\u30AD\u30FC\u30B3\u30FC\u30C9 32 \u6BB5 \xD7 \u6DF1\u3055 4
const DET = Uint8Array.from([
  0,0,1,2,0,0,1,2,0,0,1,2,0,0,1,2,0,1,2,2,0,1,2,3,0,1,2,3,0,1,2,3,
  0,1,2,4,0,1,3,4,0,1,3,4,0,1,3,5,0,2,4,5,0,2,4,6,0,2,4,6,0,2,5,7,
  0,2,5,8,0,3,6,8,0,3,6,9,0,3,7,10,0,4,8,11,0,4,8,12,0,4,9,13,0,5,10,14,
  0,5,11,16,0,6,12,17,0,6,13,19,0,7,14,20,0,8,16,22,0,8,16,22,0,8,16,22,0,8,16,22
]);

// LFO \u306E\u6CE2\u5F62\u3002\u4E0B 8 \u30D3\u30C3\u30C8\u304C AM\u3001\u4E0A 8 \u30D3\u30C3\u30C8\u304C PM\u30023 \u756A\u306F\u30CE\u30A4\u30BA\u3067\u3001\u8D70\u3089\u305B\u306A\u304C\u3089\u66F8\u304F
const LFOW = [];
for (let w = 0; w < 4; w++) LFOW.push(new Int16Array(256));
for (let i = 0; i < 256; i++) {
  let am, pm;
  am = i ^ 0xff; pm = i;                                  // 0 \u306E\u3053\u304E\u308A
  LFOW[0][i] = (am | (pm << 8)) << 16 >> 16;
  am = (i & 0x80) ? 0 : 0xff; pm = am ^ 0x80;             // 1 \u77E9\u5F62
  LFOW[1][i] = (am | (pm << 8)) << 16 >> 16;
  am = ((i & 0x80) ? (i << 1) : ((i ^ 0xff) << 1)) & 0xff; // 2 \u4E09\u89D2
  pm = ((i & 0x40) ? am : ~am) & 0xff;
  LFOW[2][i] = (am | (pm << 8)) << 16 >> 16;
}

// DT2\u3002\u5B9F\u6A5F\u306E\u8AAC\u660E\u66F8\u306E\u30BB\u30F3\u30C8\u5024\u3092 1/64 \u5358\u4F4D\u3078\u76F4\u3057\u305F\u3082\u306E
const DT2 = [0, 384, 500, 608];

// \u30A2\u30EB\u30B4\u30EA\u30BA\u30E0 8 \u901A\u308A\u3002opout \u306E\u6DFB\u5B57\u3067\u300C\u4F55\u3092\u5165\u308C\u3066\u4F55\u3092\u51FA\u3059\u304B\u300D\u3092\u8868\u3059\u3002
// 0=\u7121\u3057 1=OP1 2=OP2 3=OP3 5=OP1+OP2 6=OP1+OP3 7=OP2+OP3
const ALG = [
  //  op2 \u306E\u5165\u529B, op3 \u306E\u5165\u529B, op4 \u306E\u5165\u529B, \u51FA\u53E3\u306B OP1 / OP2 / OP3 \u3092\u8DB3\u3059\u304B
  [1, 2, 3, 0, 0, 0],
  [0, 5, 3, 0, 0, 0],
  [0, 2, 6, 0, 0, 0],
  [1, 0, 7, 0, 0, 0],
  [1, 0, 3, 0, 1, 0],
  [1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1, 1],
];

// \u30C1\u30E3\u30F3\u30CD\u30EB\u3054\u3068\u306E\u30AA\u30DA\u30EC\u30FC\u30BF\u756A\u53F7\u3002\u4E26\u3073\u306F\u9396\u306E\u9806(M1 M2 C1 C2 \u3067\u306F\u306A\u3044)
const OPOF = [0, 16, 8, 24];

// **\u51FA\u53E3\u306B\u51FA\u3066\u3044\u308B\u30AA\u30DA\u30EC\u30FC\u30BF\u3002**\u97F3\u91CF(TL)\u3092\u8DB3\u3059\u306E\u306F\u3053\u3053\u3060\u3051\u3002
// \u63FA\u3089\u3059\u5074\u306B\u8DB3\u3059\u3068\u97F3\u91CF\u3067\u306F\u306A\u304F\u97F3\u8272\u304C\u5909\u308F\u308B
const CARRIER = [[3], [3], [3], [3], [1, 3], [1, 2, 3], [1, 2, 3], [0, 1, 2, 3]];

const EG_ATTACK = 1, EG_DECAY = 2, EG_SUSTAIN = 3, EG_RELEASE = 4;
const EG_QUIET = 0x380;

/** \u6E1B\u8870(5.8)\u304B\u3089\u632F\u5E45(13 \u30D3\u30C3\u30C8)\u3078 */
const toLinear = (x) => POW[x & 0xff] >>> (x >> 8);

/** \u30AD\u30FC\u30B3\u30FC\u30C9\u3068\u6DF1\u3055\u304B\u3089\u30C7\u30C1\u30E5\u30FC\u30F3\u306E\u91CF */
function detuneOf(dt, kc) {
  const v = DET[kc * 4 + (dt & 3)];
  return (dt & 4) ? -v : v;
}

/** \u901F\u3055\u306B KSR \u3092\u8DB3\u3059\u30020 \u306E\u3068\u304D\u306F 0 \u306E\u307E\u307E */
const effRate = (raw, ksr) => (raw === 0 ? 0 : Math.min(raw + ksr, 63));

/**
 * \u30D6\u30ED\u30C3\u30AF\u3068\u30AD\u30FC\u30B3\u30FC\u30C9\u3068\u7AEF\u6570\u304B\u3089\u30011 \u30B5\u30F3\u30D7\u30EB\u3076\u3093\u306E\u4F4D\u76F8\u306E\u9032\u307F\u3002
 *
 * \u30AD\u30FC\u30B3\u30FC\u30C9\u306F 1 \u30AA\u30AF\u30BF\u30FC\u30D6\u306B 16 \u306E\u67A0\u3092\u53D6\u3063\u3066 12 \u500B\u3057\u304B\u4F7F\u3063\u3066\u3044\u306A\u3044\u306E\u3067\u3001
 * 4 \u5206\u306E 1 \u3092\u5F15\u3044\u3066\u8A70\u3081\u3066\u304B\u3089\u8868\u3092\u5F15\u304F(\u539F\u5178\u3069\u304A\u308A)\u3002
 */
function stepOf(blockFreq, delta) {
  let block = (blockFreq >> 10) & 7;
  const code = ((blockFreq >> 6) & 15) - ((blockFreq >> 8) & 3);
  let eff = ((code << 6) | (blockFreq & 63)) + delta;
  if (eff >>> 0 >= 768) {
    if (eff < 0) {
      eff += 768;
      if (block-- === 0) return PSTEP[0] >>> 7;
    } else {
      eff -= 768;
      if (eff >= 768) { block++; eff -= 768; }
      if (block++ >= 7) return PSTEP[767];
    }
  }
  return PSTEP[eff] >>> (block ^ 7);
}

/**
 * \u51FA\u53E3\u306E\u4E38\u3081\u3002
 *
 * YM2151 \u306F\u5916\u4ED8\u3051\u306E DAC(YM3012)\u3078\u6D6E\u52D5\u5C0F\u6570\u306E\u5F62\u3067\u6E21\u3057\u3066\u3044\u3066\u3001
 * \u5C0F\u3055\u3044\u97F3\u307B\u3069\u4E0B\u306E\u6841\u304C\u843D\u3061\u308B\u3002\u3053\u3053\u3092\u5165\u308C\u306A\u3044\u3068\u9759\u304B\u306A\u3068\u3053\u308D\u304C\u6F84\u307F\u3059\u304E\u308B\u3002
 */
function roundFp(v) {
  if (v < -32768) return -32768;
  if (v > 32767) return 32767;
  const scan = v ^ (v >> 31);
  let exp = 7 - Math.clz32(scan << 17);
  if (exp < 1) exp = 1;
  exp -= 1;
  return v & ~((1 << exp) - 1);
}

class OPM {
  constructor() {
    this.reg = new Uint8Array(256);
    this.reg.fill(0xc0, 0x20, 0x28);          // \u51FA\u53E3\u306F\u5DE6\u53F3\u3068\u3082\u958B\u3051\u3066\u304A\u304F

    this.phase = new Uint32Array(32);
    this.att = new Uint16Array(32);
    this.state = new Uint8Array(32);
    this.keyState = new Uint8Array(32);
    this.keyLive = new Uint8Array(32);
    this.att.fill(0x3ff);
    this.state.fill(EG_RELEASE);

    // \u5148\u306B\u8A08\u7B97\u3057\u3066\u304A\u304F\u3082\u306E
    this.cStep = new Uint32Array(32);
    this.cDyn = new Uint8Array(32);
    this.cTL = new Uint16Array(32);
    this.cSus = new Uint16Array(32);
    this.cRate = new Uint8Array(32 * 6);
    this.cDet = new Int16Array(32);
    this.cMul = new Uint8Array(32);
    this.cBF = new Uint16Array(32);

    this.fb0 = new Int32Array(8);
    this.fb1 = new Int32Array(8);
    this.fbIn = new Int32Array(8);

    this.envCount = 0;
    this.lfoCount = 0;
    this.lfoAm = 0;
    this.noiseLfsr = 1;
    this.noiseCount = 0;
    this.noiseState = 0;
    this.dirty = true;
    this.prepCount = 0;
  }

  write(addr, data) {
    addr &= 0xff;
    // AM \u3068 PM \u306E\u6DF1\u3055\u304C\u540C\u3058\u30EC\u30B8\u30B9\u30BF\u306B\u6765\u308B\u3002PM \u306F\u7A7A\u3044\u3066\u3044\u308B\u96A3\u3078\u9003\u304C\u3059
    if (addr === 0x19) this.reg[0x19 + (data >> 7)] = data;
    else if (addr !== 0x1a) this.reg[addr] = data;
    if (addr === 0x08) {
      const ch = data & 7, mask = (data >> 3) & 15;
      for (let n = 0; n < 4; n++) this.keyLive[ch + OPOF[n]] = (mask >> n) & 1;
    }
    this.dirty = true;
  }

  /** \u97F3\u8272\u3068\u97F3\u7A0B\u304B\u3089\u3001\u305D\u306E\u30AA\u30DA\u30EC\u30FC\u30BF\u3076\u3093\u306E\u524D\u8A08\u7B97 */
  cacheOp(ch, op) {
    const r = this.reg;
    const bf = ((r[0x28 + ch] & 0x7f) << 6) | ((r[0x30 + ch] >> 2) & 0x3f);
    this.cBF[op] = bf;
    const kc = (bf >> 8) & 0x1f;
    this.cDet[op] = detuneOf((r[0x40 + op] >> 4) & 7, kc);
    let mul = (r[0x40 + op] & 15) * 2;
    if (mul === 0) mul = 1;
    this.cMul[op] = mul;
    this.cTL[op] = (r[0x60 + op] & 0x7f) << 3;
    let sus = (r[0xe0 + op] >> 4) & 15;
    sus |= (sus + 1) & 0x10;                  // 15 \u306F 31 \u306E\u610F\u5473\u306B\u306A\u308B
    this.cSus[op] = sus << 5;
    const ksr = kc >>> (((r[0x80 + op] >> 6) & 3) ^ 3);
    const b = op * 6;
    this.cRate[b + EG_ATTACK] = effRate((r[0x80 + op] & 0x1f) * 2, ksr);
    this.cRate[b + EG_DECAY] = effRate((r[0xa0 + op] & 0x1f) * 2, ksr);
    this.cRate[b + EG_SUSTAIN] = effRate((r[0xc0 + op] & 0x1f) * 2, ksr);
    this.cRate[b + EG_RELEASE] = effRate((r[0xe0 + op] & 15) * 4 + 2, ksr);
    // LFO \u304C\u97F3\u7A0B\u3092\u63FA\u3089\u3057\u3066\u3044\u308B\u3042\u3044\u3060\u306F\u3001\u6BCE\u30B5\u30F3\u30D7\u30EB\u8A08\u7B97\u3057\u76F4\u3059\u3057\u304B\u306A\u3044
    const pmDepth = r[0x1a] & 0x7f, pmSens = (r[0x38 + ch] >> 4) & 7;
    if (pmDepth === 0 || pmSens === 0) {
      this.cDyn[op] = 0;
      this.cStep[op] = this.stepFor(ch, op, 0);
    } else {
      this.cDyn[op] = 1;
    }
  }

  stepFor(ch, op, rawPm) {
    const r = this.reg;
    let delta = DT2[(r[0xc0 + op] >> 6) & 3];
    const sens = (r[0x38 + ch] >> 4) & 7;
    if (sens !== 0) {
      if (sens < 6) delta += rawPm >> (6 - sens);
      else delta += rawPm << (sens - 5);
    }
    let step = stepOf(this.cBF[op], delta);
    step = (step + this.cDet[op]) >>> 0;
    return ((step * this.cMul[op]) >>> 1) >>> 0;
  }

  startAttack(op) {
    if (this.state[op] === EG_ATTACK) return;
    this.state[op] = EG_ATTACK;
    this.phase[op] = 0;
    if (this.cRate[op * 6 + EG_ATTACK] >= 62) this.att[op] = 0;
  }

  prepare() {
    for (let ch = 0; ch < 8; ch++) {
      for (let n = 0; n < 4; n++) {
        const op = ch + OPOF[n];
        this.cacheOp(ch, op);
        const on = this.keyLive[op] ? 1 : 0;
        if (on !== this.keyState[op]) {
          this.keyState[op] = on;
          if (on) this.startAttack(op);
          else if (this.state[op] < EG_RELEASE) this.state[op] = EG_RELEASE;
        }
      }
    }
  }

  /** \u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u3092 1 \u6BB5\u9032\u3081\u308B */
  clockEnv(op, count) {
    if (this.state[op] === EG_ATTACK && this.att[op] === 0) this.state[op] = EG_DECAY;
    if (this.state[op] === EG_DECAY && this.att[op] >= this.cSus[op]) this.state[op] = EG_SUSTAIN;
    const rate = this.cRate[op * 6 + this.state[op]];
    const shift = rate >> 2;
    const c = (count * Math.pow(2, shift)) >>> 0;
    if ((c & 0x7ff) !== 0) return;
    const bits = (c >>> (shift <= 11 ? 11 : shift)) & 7;
    const inc = (INC[rate] >>> (4 * bits)) & 15;
    if (this.state[op] === EG_ATTACK) {
      // \u901F\u3055 62 \u4EE5\u4E0A\u306F\u62BC\u3057\u305F\u77AC\u9593\u306B\u6E08\u307E\u305B\u3066\u3042\u308B\u306E\u3067\u3001\u3053\u3053\u3067\u306F\u52D5\u304B\u3055\u306A\u3044
      if (rate < 62) this.att[op] += (~this.att[op] * inc) >> 4;
    } else {
      let a = this.att[op] + inc;
      if (a >= 0x400) a = 0x3ff;
      this.att[op] = a;
    }
  }

  /** \u30CE\u30A4\u30BA\u3068 LFO\u3002\u8FD4\u3059\u306E\u306F\u97F3\u7A0B\u3092\u63FA\u3089\u3059\u91CF */
  clockNoiseLfo() {
    const r = this.reg;
    const nf = (r[0x0f] & 0x1f) ^ 0x1f;
    for (let rep = 0; rep < 2; rep++) {
      this.noiseLfsr = ((this.noiseLfsr << 1) |
        (((this.noiseLfsr >>> 17) ^ (this.noiseLfsr >>> 14) ^ 1) & 1)) >>> 0;
      if (this.noiseCount++ >= nf) {
        this.noiseCount = 0;
        this.noiseState = (this.noiseLfsr >>> 17) & 1;
      }
    }
    const rate = r[0x18];
    this.lfoCount = (this.lfoCount + ((0x10 | (rate & 15)) * Math.pow(2, rate >> 4))) % 4294967296;
    if (r[0x01] & 2) this.lfoCount = 0;
    const lfo = (Math.floor(this.lfoCount / 4194304)) & 0xff;
    const n8 = (this.noiseLfsr >>> 17) & 0xff;
    LFOW[3][(lfo + 1) & 0xff] = (n8 | (n8 << 8)) << 16 >> 16;
    const ampm = LFOW[r[0x1b] & 3][lfo];
    this.lfoAm = ((ampm & 0xff) * (r[0x19] & 0x7f)) >> 7;
    return ((ampm >> 8) * (r[0x1a] & 0x7f)) >> 7;
  }

  /** \u305D\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u306E AM \u306E\u639B\u304B\u308A\u5177\u5408 */
  amOffset(ch) {
    const sens = this.reg[0x38 + ch] & 3;
    return sens === 0 ? 0 : this.lfoAm << (sens - 1);
  }

  /** \u30AA\u30DA\u30EC\u30FC\u30BF 1 \u672C\u3076\u3093\u306E\u51FA\u529B(14 \u30D3\u30C3\u30C8\u7B26\u53F7\u3064\u304D) */
  opOut(op, ph, am) {
    if (this.att[op] > EG_QUIET) return 0;
    const sa = WAVE[ph & 0x3ff];
    let env = this.att[op] + this.cTL[op];
    if (this.reg[0xa0 + op] & 0x80) env += am;
    if (env > 0x3ff) env = 0x3ff;
    const v = toLinear((sa & 0x7fff) + (env << 2));
    return (sa & 0x8000) ? -v : v;
  }

  /** 1 \u30B5\u30F3\u30D7\u30EB\u9032\u3081\u308B */
  tick() {
    if (this.dirty || this.prepCount++ >= 4096) {
      this.prepare();
      this.dirty = false;
      this.prepCount = 0;
    }
    // \u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u306E\u6570\u3048\u4E0A\u3052\u30023 \u56DE\u306B 1 \u56DE\u3060\u3051\u9032\u3080\u4F5C\u308A\u306B\u306A\u3063\u3066\u3044\u308B
    this.envCount++;
    if ((this.envCount & 3) === 3) this.envCount += 1;
    const rawPm = this.clockNoiseLfo();

    for (let ch = 0; ch < 8; ch++) {
      this.fb0[ch] = this.fb1[ch];
      this.fb1[ch] = this.fbIn[ch];
      for (let n = 0; n < 4; n++) {
        const op = ch + OPOF[n];
        if ((this.envCount & 3) === 0) this.clockEnv(op, this.envCount >> 2);
        const step = this.cDyn[op] ? this.stepFor(ch, op, rawPm) : this.cStep[op];
        this.phase[op] = (this.phase[op] + step) >>> 0;
      }
    }
  }

  /** \u5168\u30C1\u30E3\u30F3\u30CD\u30EB\u3092\u8DB3\u3057\u3066\u51FA\u3059 */
  out() {
    let sum = 0;
    const noiseOn = (this.reg[0x0f] & 0x80) !== 0;
    for (let ch = 0; ch < 8; ch++) {
      const am = this.amOffset(ch);
      const alg = ALG[this.reg[0x20 + ch] & 7];
      const fb = (this.reg[0x20 + ch] >> 3) & 7;
      const o1 = ch + OPOF[0], o2 = ch + OPOF[1], o3 = ch + OPOF[2], o4 = ch + OPOF[3];
      let mod = 0;
      if (fb !== 0) mod = (this.fb0[ch] + this.fb1[ch]) >> (10 - fb);
      const v1 = this.opOut(o1, (this.phase[o1] >>> 10) + mod, am);
      this.fbIn[ch] = v1;
      if (((this.reg[0x20 + ch] >> 6) & 3) === 0) continue;
      const opout = [0, v1, 0, 0, 0, 0, 0, 0];
      opout[2] = this.opOut(o2, (this.phase[o2] >>> 10) + (opout[alg[0]] >> 1), am);
      opout[5] = opout[1] + opout[2];
      opout[3] = this.opOut(o3, (this.phase[o3] >>> 10) + (opout[alg[1]] >> 1), am);
      opout[6] = opout[1] + opout[3];
      opout[7] = opout[2] + opout[3];
      let r;
      if (noiseOn && ch === 7) {
        // \u30CE\u30A4\u30BA\u306F\u30C1\u30E3\u30F3\u30CD\u30EB 8 \u306E\u30AA\u30DA\u30EC\u30FC\u30BF 4 \u3060\u3051\u3002\u5BFE\u6570\u306E\u5909\u63DB\u3092\u901A\u3055\u306A\u3044
        let env = this.att[o4] + this.cTL[o4];
        if (this.reg[0xa0 + o4] & 0x80) env += am;
        if (env > 0x3ff) env = 0x3ff;
        r = (env ^ 0x3ff) << 1;
        if (this.noiseState) r = -r;
      } else {
        r = this.opOut(o4, (this.phase[o4] >>> 10) + (opout[alg[2]] >> 1), am);
      }
      if (alg[3]) r += opout[1];
      if (alg[4]) r += opout[2];
      if (alg[5]) r += opout[3];
      sum += r;
    }
    return roundFp(sum) / 32768;
  }
}

/**
 * \u5E38\u99D0\u3057\u3066\u5168\u90E8\u306E\u58F0\u3092\u56DE\u3059\u3002
 *
 * \u58F0\u306E\u53D6\u308A\u5408\u3044\u306F**\u30C1\u30E3\u30F3\u30CD\u30EB 8 \u672C**\u3067\u3084\u308B\u3002\u5B9F\u6A5F\u304C\u305D\u3046\u306A\u306E\u3067\u3001
 * 9 \u672C\u76EE\u304C\u6765\u305F\u3089\u3044\u3061\u3070\u3093\u53E4\u3044\u3082\u306E\u3092\u8B72\u308B\u3002
 */
class OpmBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.chip = new OPM();
    this.chip.write(0x0f, 0);
    this.busy = [];                 // [{ ch, off }] \u9CF4\u3063\u3066\u3044\u308B\u3082\u306E
    // \u30D5\u30A7\u30FC\u30C9\u306E\u9014\u4E2D\u306E\u97F3\u3002[{ ch, list, at, patch }]\u3002\u9CF4\u3063\u3066\u3044\u308B\u3042\u3044\u3060\u3068\u4F59\u97FB\u306E\u3042\u3044\u3060\u3001
    // \u51FA\u53E3\u5074\u306E\u30AA\u30DA\u30EC\u30FC\u30BF\u306E TL \u3092\u66F8\u304D\u76F4\u3059\u3002\u58F0\u3092\u8B72\u3063\u305F\u3089\u6368\u3066\u308B
    this.fading = [];
    // \u30DD\u30EB\u30BF\u30E1\u30F3\u30C8\u306E\u9014\u4E2D\u306E\u97F3\u3002[{ ch, list, at }]\u3002\u9CF4\u3063\u3066\u3044\u308B\u3042\u3044\u3060\u306B
    // \u97F3\u7A0B\u30EC\u30B8\u30B9\u30BF(KC \u3068 KF)\u3092\u66F8\u304D\u76F4\u3059\u3002\u5B9F\u6A5F\u306E\u30C9\u30E9\u30A4\u30D0\u3082\u540C\u3058\u3053\u3068\u3092\u3057\u3066\u3044\u305F
    this.gliding = [];
    // \u30EC\u30B8\u30B9\u30BF\u306E\u8A18\u9332(log)\u3002OPLL \u3068\u540C\u3058\u3067\u3001\u66F8\u3044\u305F\u6642\u523B\u3068\u4E2D\u8EAB\u3092\u5916\u3078\u6D41\u3059\u3002
    // \u540C\u3058\u66F8\u304D\u8FBC\u307F\u3092\u30A8\u30DF\u30E5\u30EC\u30FC\u30BF\u3078\u6E21\u3057\u3066\u3001\u3053\u3061\u3089\u306E\u7FFB\u8A33\u3092\u8033\u3067\u78BA\u304B\u3081\u308B\u305F\u3081
    if (q.log) {
      const raw = this.chip.write.bind(this.chip);
      this.logNow = 0;
      this.logBuf = [];
      this.chip.write = (r, d) => { this.logBuf.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    this.acc = 0;
    this.base = currentTime;
    this.port.onmessage = (e) => {
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
      this.events.sort((a, b) => a.t - b.t);
    };
  }

  /** \u7A7A\u3044\u3066\u3044\u308B\u30C1\u30E3\u30F3\u30CD\u30EB\u3092\u53D6\u308B\u3002\u7121\u3051\u308C\u3070\u3044\u3061\u3070\u3093\u53E4\u3044\u3082\u306E\u3092\u8B72\u3063\u3066\u3082\u3089\u3046 */
  take(t) {
    for (let ch = 0; ch < 8; ch++) {
      if (!this.busy.some((b) => b.ch === ch)) return ch;
    }
    const old = this.busy.shift();
    this.chip.write(0x08, old.ch);
    // \u8B72\u3063\u305F\u58F0\u306E\u66F8\u304D\u76F4\u3057\u306F\u6368\u3066\u308B\u3002\u524D\u306E\u97F3\u306E\u9AD8\u3055\u3092\u3001\u6B21\u306E\u97F3\u3078\u66F8\u304D\u7D9A\u3051\u3066\u3057\u307E\u3046
    this.gliding = this.gliding.filter((f) => f.ch !== old.ch);
    return old.ch;
  }

  start(ev) {
    const ch = this.take(ev.t);
    const p = ev.patch;
    this.fading = this.fading.filter((f) => f.ch !== ch);
    if (ev.vs && ev.vs.length) this.fading.push({ ch, list: ev.vs, at: 0, patch: p });
    this.gliding = this.gliding.filter((f) => f.ch !== ch);
    if (ev.ps && ev.ps.length) this.gliding.push({ ch, list: ev.ps, at: 0 });
    const c = this.chip;
    c.write(0x20 + ch, 0xc0 | ((p.fb & 7) << 3) | (p.alg & 7));
    c.write(0x38 + ch, ((p.pms & 7) << 4) | (p.ams & 3));
    const car = CARRIER[p.alg & 7];
    for (let n = 0; n < 4; n++) {
      const op = ch + OPOF[n];
      const o = p.ops[n];
      c.write(0x40 + op, ((o.dt1 & 7) << 4) | (o.mul & 15));
      // \u97F3\u91CF\u306F TL \u3078\u8DB3\u3059\u3002\u5B9F\u6A5F\u3067\u306F\u3053\u3053\u3057\u304B\u52B9\u304B\u306A\u3044
      const tl = car.indexOf(n) >= 0 ? Math.min(127, (o.tl & 0x7f) + (ev.att || 0)) : (o.tl & 0x7f);
      c.write(0x60 + op, tl);
      c.write(0x80 + op, ((o.ks & 3) << 6) | (o.ar & 0x1f));
      c.write(0xa0 + op, ((o.ame ? 1 : 0) << 7) | (o.d1r & 0x1f));
      c.write(0xc0 + op, ((o.dt2 & 3) << 6) | (o.d2r & 0x1f));
      c.write(0xe0 + op, ((o.d1l & 15) << 4) | (o.rr & 15));
    }
    c.write(0x28 + ch, ev.kc & 0x7f);
    c.write(0x30 + ch, (ev.kf & 0x3f) << 2);
    c.write(0x08, ch | 0x78);
    this.busy.push({ ch, off: ev.t + ev.dur });
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const sr = sampleRate;
    const steps = ${OPM_RATE} / sr;
    for (let i = 0; i < out.length; i++) {
      const t = this.base + i / sr;
      if (this.logBuf) this.logNow = t;
      while (this.at < this.events.length && this.events[this.at].t <= t) {
        this.start(this.events[this.at++]);
      }
      for (let k = this.fading.length - 1; k >= 0; k--) {
        const f = this.fading[k];
        while (f.at < f.list.length && f.list[f.at][0] <= t) {
          const att = f.list[f.at++][1];
          const car = CARRIER[f.patch.alg & 7];
          for (const n of car) {
            this.chip.write(0x60 + f.ch + OPOF[n], Math.min(127, (f.patch.ops[n].tl & 0x7f) + att));
          }
        }
        if (f.at >= f.list.length) this.fading.splice(k, 1);
      }
      // \u97F3\u7A0B\u306E\u66F8\u304D\u76F4\u3057\u3002\u9CF4\u3089\u3057\u59CB\u3081\u306E\u30D3\u30C3\u30C8\u306F\u5225\u306E\u30EC\u30B8\u30B9\u30BF(0x08)\u306B\u3042\u308B\u306E\u3067\u3001
      // \u3053\u3053\u306F\u97F3\u7A0B\u3060\u3051\u3092\u66F8\u3051\u308B
      for (let k = this.gliding.length - 1; k >= 0; k--) {
        const f = this.gliding[k];
        while (f.at < f.list.length && f.list[f.at][0] <= t) {
          const [, kc, kf] = f.list[f.at++];
          this.chip.write(0x28 + f.ch, kc & 0x7f);
          this.chip.write(0x30 + f.ch, (kf & 0x3f) << 2);
        }
        if (f.at >= f.list.length) this.gliding.splice(k, 1);
      }
      for (let k = this.busy.length - 1; k >= 0; k--) {
        if (this.busy[k].off <= t) {
          this.chip.write(0x08, this.busy[k].ch);
          this.busy.splice(k, 1);
        }
      }
      // \u5B9F\u6A5F\u306E\u523B\u307F\u3068\u51FA\u3059\u523B\u307F\u306F\u9055\u3046\u3002\u8DB3\u308A\u308B\u307E\u3067\u56DE\u3059
      this.acc += steps;
      while (this.acc >= 1) { this.chip.tick(); this.acc -= 1; }
      out[i] = this.chip.out();
    }
    this.base += out.length / sr;
    if (this.logBuf && this.logBuf.length) {
      this.port.postMessage({ regs: this.logBuf });
      this.logBuf = [];
    }
    return true;
  }
}
registerProcessor('mmsxx-opm', OpmBank);
`;
  function freqOf(kc, kf) {
    const bf = (kc & 127) << 6 | kf & 63;
    let block = bf >> 10 & 7;
    const code = (bf >> 6 & 15) - (bf >> 8 & 3);
    let eff = code << 6 | bf & 63;
    if (eff < 0 || eff >= 768) return null;
    return PHASE[eff] * 32 * OPM_RATE / (1 << 20) / (1 << 7 - block);
  }
  var TABLE = null;
  function buildTable() {
    const rows = [];
    for (let kc = 0; kc < 128; kc++) {
      if ((kc & 3) === 3) continue;
      for (let kf = 0; kf < 64; kf++) {
        const f = freqOf(kc, kf);
        if (f) rows.push({ kc, kf, f });
      }
    }
    rows.sort((a, b) => a.f - b.f);
    return rows;
  }
  function opmPitch(freq) {
    if (!TABLE) TABLE = buildTable();
    let lo = 0, hi = TABLE.length - 1;
    while (lo < hi) {
      const mid = lo + hi >> 1;
      if (TABLE[mid].f < freq) lo = mid + 1;
      else hi = mid;
    }
    const a = TABLE[lo], b = TABLE[Math.max(0, lo - 1)];
    const pick = Math.abs(a.f - freq) <= Math.abs(b.f - freq) ? a : b;
    return { kc: pick.kc, kf: pick.kf };
  }
  var PHASE = Uint32Array.from([
    1299,
    1300,
    1301,
    1302,
    1303,
    1304,
    1305,
    1306,
    1308,
    1309,
    1310,
    1311,
    1313,
    1314,
    1315,
    1316,
    1318,
    1319,
    1320,
    1321,
    1322,
    1323,
    1324,
    1325,
    1327,
    1328,
    1329,
    1330,
    1332,
    1333,
    1334,
    1335,
    1337,
    1338,
    1339,
    1340,
    1341,
    1342,
    1343,
    1344,
    1346,
    1347,
    1348,
    1349,
    1351,
    1352,
    1353,
    1354,
    1356,
    1357,
    1358,
    1359,
    1361,
    1362,
    1363,
    1364,
    1366,
    1367,
    1368,
    1369,
    1371,
    1372,
    1373,
    1374,
    1376,
    1377,
    1378,
    1379,
    1381,
    1382,
    1383,
    1384,
    1386,
    1387,
    1388,
    1389,
    1391,
    1392,
    1393,
    1394,
    1396,
    1397,
    1398,
    1399,
    1401,
    1402,
    1403,
    1404,
    1406,
    1407,
    1408,
    1409,
    1411,
    1412,
    1413,
    1414,
    1416,
    1417,
    1418,
    1419,
    1421,
    1422,
    1423,
    1424,
    1426,
    1427,
    1429,
    1430,
    1431,
    1432,
    1434,
    1435,
    1437,
    1438,
    1439,
    1440,
    1442,
    1443,
    1444,
    1445,
    1447,
    1448,
    1449,
    1450,
    1452,
    1453,
    1454,
    1455,
    1458,
    1459,
    1460,
    1461,
    1463,
    1464,
    1465,
    1466,
    1468,
    1469,
    1471,
    1472,
    1473,
    1474,
    1476,
    1477,
    1479,
    1480,
    1481,
    1482,
    1484,
    1485,
    1486,
    1487,
    1489,
    1490,
    1492,
    1493,
    1494,
    1495,
    1497,
    1498,
    1501,
    1502,
    1503,
    1504,
    1506,
    1507,
    1509,
    1510,
    1512,
    1513,
    1514,
    1515,
    1517,
    1518,
    1520,
    1521,
    1523,
    1524,
    1525,
    1526,
    1528,
    1529,
    1531,
    1532,
    1534,
    1535,
    1536,
    1537,
    1539,
    1540,
    1542,
    1543,
    1545,
    1546,
    1547,
    1548,
    1550,
    1551,
    1553,
    1554,
    1556,
    1557,
    1558,
    1559,
    1561,
    1562,
    1564,
    1565,
    1567,
    1568,
    1569,
    1570,
    1572,
    1573,
    1575,
    1576,
    1578,
    1579,
    1580,
    1581,
    1583,
    1584,
    1586,
    1587,
    1590,
    1591,
    1592,
    1593,
    1595,
    1596,
    1598,
    1599,
    1601,
    1602,
    1604,
    1605,
    1607,
    1608,
    1609,
    1610,
    1613,
    1614,
    1615,
    1616,
    1618,
    1619,
    1621,
    1622,
    1624,
    1625,
    1627,
    1628,
    1630,
    1631,
    1632,
    1633,
    1637,
    1638,
    1639,
    1640,
    1642,
    1643,
    1645,
    1646,
    1648,
    1649,
    1651,
    1652,
    1654,
    1655,
    1656,
    1657,
    1660,
    1661,
    1663,
    1664,
    1666,
    1667,
    1669,
    1670,
    1672,
    1673,
    1675,
    1676,
    1678,
    1679,
    1681,
    1682,
    1685,
    1686,
    1688,
    1689,
    1691,
    1692,
    1694,
    1695,
    1697,
    1698,
    1700,
    1701,
    1703,
    1704,
    1706,
    1707,
    1709,
    1710,
    1712,
    1713,
    1715,
    1716,
    1718,
    1719,
    1721,
    1722,
    1724,
    1725,
    1727,
    1728,
    1730,
    1731,
    1734,
    1735,
    1737,
    1738,
    1740,
    1741,
    1743,
    1744,
    1746,
    1748,
    1749,
    1751,
    1752,
    1754,
    1755,
    1757,
    1759,
    1760,
    1762,
    1763,
    1765,
    1766,
    1768,
    1769,
    1771,
    1773,
    1774,
    1776,
    1777,
    1779,
    1780,
    1782,
    1785,
    1786,
    1788,
    1789,
    1791,
    1793,
    1794,
    1796,
    1798,
    1799,
    1801,
    1802,
    1804,
    1806,
    1807,
    1809,
    1811,
    1812,
    1814,
    1815,
    1817,
    1819,
    1820,
    1822,
    1824,
    1825,
    1827,
    1828,
    1830,
    1832,
    1833,
    1835,
    1837,
    1838,
    1840,
    1841,
    1843,
    1845,
    1846,
    1848,
    1850,
    1851,
    1853,
    1854,
    1856,
    1858,
    1859,
    1861,
    1864,
    1865,
    1867,
    1868,
    1870,
    1872,
    1873,
    1875,
    1877,
    1879,
    1880,
    1882,
    1884,
    1885,
    1887,
    1888,
    1891,
    1892,
    1894,
    1895,
    1897,
    1899,
    1900,
    1902,
    1904,
    1906,
    1907,
    1909,
    1911,
    1912,
    1914,
    1915,
    1918,
    1919,
    1921,
    1923,
    1925,
    1926,
    1928,
    1930,
    1932,
    1933,
    1935,
    1937,
    1939,
    1940,
    1942,
    1944,
    1946,
    1947,
    1949,
    1951,
    1953,
    1954,
    1956,
    1958,
    1960,
    1961,
    1963,
    1965,
    1967,
    1968,
    1970,
    1972,
    1975,
    1976,
    1978,
    1980,
    1982,
    1983,
    1985,
    1987,
    1989,
    1990,
    1992,
    1994,
    1996,
    1997,
    1999,
    2001,
    2003,
    2004,
    2006,
    2008,
    2010,
    2011,
    2013,
    2015,
    2017,
    2019,
    2021,
    2022,
    2024,
    2026,
    2028,
    2029,
    2032,
    2033,
    2035,
    2037,
    2039,
    2041,
    2043,
    2044,
    2047,
    2048,
    2050,
    2052,
    2054,
    2056,
    2058,
    2059,
    2062,
    2063,
    2065,
    2067,
    2069,
    2071,
    2073,
    2074,
    2077,
    2078,
    2080,
    2082,
    2084,
    2086,
    2088,
    2089,
    2092,
    2093,
    2095,
    2097,
    2099,
    2101,
    2103,
    2104,
    2107,
    2108,
    2110,
    2112,
    2114,
    2116,
    2118,
    2119,
    2122,
    2123,
    2125,
    2127,
    2129,
    2131,
    2133,
    2134,
    2137,
    2139,
    2141,
    2142,
    2145,
    2146,
    2148,
    2150,
    2153,
    2154,
    2156,
    2158,
    2160,
    2162,
    2164,
    2165,
    2168,
    2170,
    2172,
    2173,
    2176,
    2177,
    2179,
    2181,
    2185,
    2186,
    2188,
    2190,
    2192,
    2194,
    2196,
    2197,
    2200,
    2202,
    2204,
    2205,
    2208,
    2209,
    2211,
    2213,
    2216,
    2218,
    2220,
    2222,
    2223,
    2226,
    2227,
    2230,
    2232,
    2234,
    2236,
    2238,
    2239,
    2242,
    2243,
    2246,
    2249,
    2251,
    2253,
    2255,
    2256,
    2259,
    2260,
    2263,
    2265,
    2267,
    2269,
    2271,
    2272,
    2275,
    2276,
    2279,
    2281,
    2283,
    2285,
    2287,
    2288,
    2291,
    2292,
    2295,
    2297,
    2299,
    2301,
    2303,
    2304,
    2307,
    2308,
    2311,
    2315,
    2317,
    2319,
    2321,
    2322,
    2325,
    2326,
    2329,
    2331,
    2333,
    2335,
    2337,
    2338,
    2341,
    2342,
    2345,
    2348,
    2350,
    2352,
    2354,
    2355,
    2358,
    2359,
    2362,
    2364,
    2366,
    2368,
    2370,
    2371,
    2374,
    2375,
    2378,
    2382,
    2384,
    2386,
    2388,
    2389,
    2392,
    2393,
    2396,
    2398,
    2400,
    2402,
    2404,
    2407,
    2410,
    2411,
    2414,
    2417,
    2419,
    2421,
    2423,
    2424,
    2427,
    2428,
    2431,
    2433,
    2435,
    2437,
    2439,
    2442,
    2445,
    2446,
    2449,
    2452,
    2454,
    2456,
    2458,
    2459,
    2462,
    2463,
    2466,
    2468,
    2470,
    2472,
    2474,
    2477,
    2480,
    2481,
    2484,
    2488,
    2490,
    2492,
    2494,
    2495,
    2498,
    2499,
    2502,
    2504,
    2506,
    2508,
    2510,
    2513,
    2516,
    2517,
    2520,
    2524,
    2526,
    2528,
    2530,
    2531,
    2534,
    2535,
    2538,
    2540,
    2542,
    2544,
    2546,
    2549,
    2552,
    2553,
    2556,
    2561,
    2563,
    2565,
    2567,
    2568,
    2571,
    2572,
    2575,
    2577,
    2579,
    2581,
    2583,
    2586,
    2589,
    2590,
    2593
  ]);
  function opmPatch(p = {}) {
    const op = (o = {}) => ({
      ar: o.ar ?? 31,
      d1r: o.d1r ?? 0,
      d2r: o.d2r ?? 0,
      rr: o.rr ?? 7,
      d1l: o.d1l ?? 0,
      tl: o.tl ?? 0,
      ks: o.ks ?? 0,
      mul: o.mul ?? 1,
      dt1: o.dt1 ?? 0,
      dt2: o.dt2 ?? 0,
      ame: o.ame ?? 0
    });
    return {
      alg: p.alg ?? 0,
      fb: p.fb ?? 0,
      pms: p.pms ?? 0,
      ams: p.ams ?? 0,
      ops: [op(p.ops?.[0]), op(p.ops?.[1]), op(p.ops?.[2]), op(p.ops?.[3])]
    };
  }

  // ../../../tmp/panther-update/sound/fm4presets.js
  var FM4_PRESETS = {
    "fm4Brass": {
      noteJa: "4 \u30AA\u30DA\u306E\u91D1\u7BA1\u3002\u30AA\u30DA\u30EC\u30FC\u30BF\u304C\u5897\u3048\u305F\u3076\u3093\u3001\u4F38\u3070\u3057\u3066\u3044\u308B\u3042\u3044\u3060\u306B\u500D\u97F3\u304C\u80B2\u3064\u3002\u672C\u7269\u306E\u91D1\u7BA1\u3068\u540C\u3058\u52D5\u304D\u3067\u30012 \u30AA\u30DA\u306B\u306F\u3067\u304D\u306A\u3044",
      role: "lead",
      note: "Four-operator brass. The extra operators let the harmonics build over the note the way a real horn does \u2014 the thing two operators cannot do.",
      of: "\u4E3B\u5F79\u306E\u30D6\u30E9\u30B9\u3002\u7D50\u7DDA 2 + \u5E30\u9084\u3002\u3044\u3061\u3070\u3093\u8033\u306B\u6B8B\u308B\u5F79",
      patch: opmPatch({ alg: 2, fb: 5, ops: [
        { ar: 17, d1r: 8, d2r: 0, rr: 10, d1l: 1, tl: 29, ks: 0, mul: 1, dt1: 2, dt2: 0 },
        { ar: 17, d1r: 8, d2r: 0, rr: 10, d1l: 1, tl: 33, ks: 0, mul: 1, dt1: 6, dt2: 0 },
        { ar: 18, d1r: 9, d2r: 0, rr: 10, d1l: 2, tl: 37, ks: 0, mul: 2, dt1: 3, dt2: 0 },
        { ar: 17, d1r: 6, d2r: 0, rr: 9, d1l: 1, tl: 0, ks: 0, mul: 1, dt1: 5, dt2: 0 }
      ] })
    },
    "fm4Lead": {
      noteJa: "4 \u30AA\u30DA\u306E\u30EA\u30FC\u30C9\u3002\u660E\u308B\u304F\u524D\u3078\u51FA\u308B\u3002\u539A\u3044\u7DE8\u6210\u306E\u4E0A\u306B\u4E57\u305B\u308B\u305F\u3081\u306E\u97F3",
      role: "lead",
      note: "Four-operator lead. Bright and cutting, meant to sit above a full arrangement.",
      of: "\u7D30\u3081\u3067\u524D\u306B\u51FA\u308B\u30EA\u30FC\u30C9",
      patch: opmPatch({ alg: 4, fb: 4, ops: [
        { ar: 25, d1r: 12, d2r: 0, rr: 10, d1l: 3, tl: 34, ks: 0, mul: 3, dt1: 2, dt2: 0 },
        { ar: 23, d1r: 7, d2r: 0, rr: 9, d1l: 2, tl: 0, ks: 0, mul: 1, dt1: 6, dt2: 0 },
        { ar: 25, d1r: 14, d2r: 0, rr: 10, d1l: 4, tl: 38, ks: 0, mul: 2, dt1: 3, dt2: 0 },
        { ar: 23, d1r: 6, d2r: 0, rr: 9, d1l: 2, tl: 4, ks: 0, mul: 1, dt1: 5, dt2: 0 }
      ] })
    },
    "fm4Bass": {
      noteJa: "4 \u30AA\u30DA\u306E\u4F4E\u97F3\u3002\u82AF\u304C\u3057\u3063\u304B\u308A\u3057\u3066\u3044\u3066\u4E0A\u306E\u500D\u97F3\u3082\u3042\u308B\u306E\u3067\u3001\u5C0F\u3055\u3044\u30B9\u30D4\u30FC\u30AB\u30FC\u3067\u3082\u805E\u3053\u3048\u308B",
      role: "bass",
      note: "Four-operator bass. Solid fundamental with enough upper harmonics to be heard on small speakers.",
      of: "\u982D\u304C\u7ACB\u3063\u3066\u3059\u3050\u7DE0\u307E\u308B\u30D9\u30FC\u30B9\u3002\u5E30\u9084\u3092\u6DF1\u3081\u306B",
      patch: opmPatch({ alg: 0, fb: 5, ops: [
        { ar: 27, d1r: 16, d2r: 0, rr: 11, d1l: 5, tl: 31, ks: 0, mul: 1, dt1: 1, dt2: 0 },
        { ar: 27, d1r: 15, d2r: 0, rr: 11, d1l: 5, tl: 33, ks: 0, mul: 2, dt1: 6, dt2: 0 },
        { ar: 27, d1r: 14, d2r: 0, rr: 11, d1l: 3, tl: 32, ks: 0, mul: 1, dt1: 1, dt2: 0 },
        { ar: 27, d1r: 11, d2r: 0, rr: 10, d1l: 3, tl: 0, ks: 0, mul: 1, dt1: 5, dt2: 0 }
      ] })
    },
    "fm4EP": {
      noteJa: "\u30A8\u30EC\u30AF\u30C8\u30EA\u30C3\u30AF\u30D4\u30A2\u30CE\u30024 \u30AA\u30DA\u306E FM \u304C\u3044\u3061\u3070\u3093\u6709\u540D\u306B\u306A\u3063\u305F\u97F3",
      role: "chord",
      note: "Electric piano. The sound four-operator FM is most famous for.",
      of: "\u30A8\u30EC\u30D4\u3002\u9AD8\u3044\u6BD4(11)\u3067\u982D\u3060\u3051\u9CF4\u3089\u3057\u3066\u843D\u3068\u3059",
      patch: opmPatch({ alg: 4, fb: 0, ops: [
        { ar: 27, d1r: 22, d2r: 0, rr: 9, d1l: 15, tl: 31, ks: 0, mul: 11, dt1: 2, dt2: 0 },
        { ar: 25, d1r: 8, d2r: 0, rr: 8, d1l: 5, tl: 0, ks: 0, mul: 1, dt1: 6, dt2: 0 },
        { ar: 27, d1r: 13, d2r: 0, rr: 10, d1l: 9, tl: 38, ks: 0, mul: 1, dt1: 2, dt2: 0 },
        { ar: 24, d1r: 7, d2r: 0, rr: 8, d1l: 4, tl: 3, ks: 0, mul: 2, dt1: 5, dt2: 0 }
      ] })
    },
    "fm4Bell": {
      noteJa: "\u9418\u3002\u305D\u308D\u308F\u306A\u3044\u500D\u97F3\u3067\u3001\u9577\u304F\u6E1B\u308B",
      role: "counter",
      note: "Bell. Inharmonic partials, long decay.",
      of: "\u9418\u3002**\u534A\u7AEF\u306A\u6BD4**(3.5 / 7)\u3002\u6574\u6570\u3067\u306A\u3044\u3068\u9418\u306B\u306A\u3089\u306A\u3044",
      patch: opmPatch({ alg: 4, fb: 3, ops: [
        { ar: 27, d1r: 14, d2r: 0, rr: 4, d1l: 15, tl: 32, ks: 0, mul: 2, dt1: 2, dt2: 3 },
        { ar: 27, d1r: 12, d2r: 0, rr: 3, d1l: 15, tl: 0, ks: 0, mul: 1, dt1: 6, dt2: 0 },
        { ar: 27, d1r: 15, d2r: 0, rr: 5, d1l: 15, tl: 40, ks: 0, mul: 7, dt1: 3, dt2: 0 },
        { ar: 27, d1r: 12, d2r: 0, rr: 4, d1l: 15, tl: 4, ks: 0, mul: 2, dt1: 5, dt2: 0 }
      ] })
    },
    "fm4Klang": {
      noteJa: "\u91D1\u5C5E\u3092\u53E9\u3044\u305F\u97F3\u3002\u308F\u3056\u3068\u500D\u97F3\u3092\u305D\u308D\u3048\u3066\u3044\u306A\u3044\u306E\u3067\u3001\u97F3\u3068\u3044\u3046\u3088\u308A\u30CE\u30A4\u30BA\u306B\u8FD1\u3044",
      role: "perc",
      note: "Metallic hit. Deliberately inharmonic \u2014 closer to noise than to a note.",
      of: "\u3044\u304B\u306B\u3082 FM \u306A\u30EA\u30FC\u30C9\u3002\u6BD4 7 \u3092\u982D\u3060\u3051\u6DF1\u304F\u304B\u3051\u3066\u843D\u3068\u3059",
      patch: opmPatch({ alg: 0, fb: 5, ops: [
        { ar: 27, d1r: 23, d2r: 0, rr: 9, d1l: 15, tl: 19, ks: 0, mul: 7, dt1: 3, dt2: 0 },
        { ar: 27, d1r: 16, d2r: 0, rr: 11, d1l: 6, tl: 23, ks: 0, mul: 2, dt1: 6, dt2: 0 },
        { ar: 27, d1r: 12, d2r: 0, rr: 10, d1l: 3, tl: 26, ks: 0, mul: 1, dt1: 2, dt2: 0 },
        { ar: 25, d1r: 9, d2r: 0, rr: 9, d1l: 2, tl: 0, ks: 0, mul: 1, dt1: 5, dt2: 0 }
      ] })
    },
    "fm4Glass": {
      noteJa: "\u30AC\u30E9\u30B9\u306E\u3088\u3046\u306B\u7D30\u304F\u6F84\u3093\u3060\u97F3\u3002\u982D\u306F\u786C\u3044",
      role: "counter",
      note: "Glassy and thin, with a hard attack.",
      of: "\u30AC\u30E9\u30B9\u306E\u9418\u3002\u6BD4 4.7 \u3068 9.1\u3002**\u6574\u6570\u304B\u3089\u5916\u3059**\u307B\u3069\u91D1\u5C5E\u306B\u306A\u308B",
      patch: opmPatch({ alg: 4, fb: 3, ops: [
        { ar: 27, d1r: 17, d2r: 0, rr: 6, d1l: 15, tl: 21, ks: 0, mul: 3, dt1: 2, dt2: 2 },
        { ar: 27, d1r: 13, d2r: 0, rr: 4, d1l: 15, tl: 0, ks: 0, mul: 1, dt1: 6, dt2: 0 },
        { ar: 27, d1r: 19, d2r: 0, rr: 7, d1l: 15, tl: 24, ks: 0, mul: 9, dt1: 3, dt2: 0 },
        { ar: 27, d1r: 13, d2r: 0, rr: 4, d1l: 15, tl: 3, ks: 0, mul: 2, dt1: 6, dt2: 0 }
      ] })
    },
    "fm4Slap": {
      noteJa: "\u30B9\u30E9\u30C3\u30D7\u306E\u30D9\u30FC\u30B9\u3002\u982D\u3067\u307B\u3068\u3093\u3069\u6C7A\u307E\u308B",
      role: "bass",
      note: "Slapped bass. The attack carries most of the character.",
      of: "\u5F3E\u304F\u30D9\u30FC\u30B9\u3002\u982D\u3067\u6BD4 5 \u304C\u5F3E\u3051\u3066\u3001\u3059\u3050\u82AF\u3060\u3051\u6B8B\u308B",
      patch: opmPatch({ alg: 0, fb: 6, ops: [
        { ar: 27, d1r: 24, d2r: 0, rr: 9, d1l: 15, tl: 20, ks: 0, mul: 5, dt1: 2, dt2: 0 },
        { ar: 27, d1r: 19, d2r: 0, rr: 11, d1l: 9, tl: 24, ks: 0, mul: 2, dt1: 6, dt2: 0 },
        { ar: 27, d1r: 14, d2r: 0, rr: 11, d1l: 4, tl: 29, ks: 0, mul: 1, dt1: 1, dt2: 0 },
        { ar: 27, d1r: 11, d2r: 0, rr: 10, d1l: 3, tl: 0, ks: 0, mul: 1, dt1: 5, dt2: 0 }
      ] })
    },
    "fm4Tom": {
      noteJa: "\u97F3\u7A0B\u306E\u843D\u3061\u308B\u30BF\u30E0",
      role: "perc",
      note: "Tom with a pitch drop.",
      of: "\u6253\u697D\u5668\u3002\u5E30\u9084\u3092\u6DF1\u304F\u6F70\u3059",
      patch: opmPatch({ alg: 0, fb: 6, ops: [
        { ar: 27, d1r: 23, d2r: 0, rr: 9, d1l: 15, tl: 28, ks: 0, mul: 1, dt1: 1, dt2: 0 },
        { ar: 27, d1r: 22, d2r: 0, rr: 9, d1l: 15, tl: 29, ks: 0, mul: 1, dt1: 1, dt2: 1 },
        { ar: 27, d1r: 21, d2r: 0, rr: 8, d1l: 15, tl: 31, ks: 0, mul: 1, dt1: 1, dt2: 0 },
        { ar: 27, d1r: 18, d2r: 0, rr: 7, d1l: 15, tl: 0, ks: 0, mul: 1, dt1: 1, dt2: 0 }
      ] })
    }
  };
  function registerDefaultFM4() {
    for (const [name, p] of Object.entries(FM4_PRESETS)) {
      registerOPM(name, p.patch, { note: p.note, noteJa: p.noteJa, role: p.role });
    }
    registerBaked("bkBrass", {
      from: "fm4Brass",
      octaves: [3, 4, 5],
      step: 3,
      role: "lead",
      noteJa: "fm4Brass \u3092 3 \u30AA\u30AF\u30BF\u30FC\u30D6\u3076\u3093\u713C\u3044\u3066\u6CE2\u5F62\u306B\u3057\u305F\u3082\u306E\u3002\u5834\u6240\u306F\u98DF\u3046\u304C\u8A08\u7B97\u306F\u8981\u3089\u306A\u3044 \u2014 \u5B9F\u6A5F\u304C\u3084\u3063\u3066\u3044\u305F\u53D6\u308A\u5F15\u304D\u3068\u540C\u3058",
      note: "The four-operator brass rendered to samples across three octaves. Baking it costs memory but no CPU \u2014 the trade real hardware made."
    });
  }

  // ../../../tmp/panther-update/sound/extrawaves.js
  var EXTRA_LEN = 32;
  var build3 = (fn) => Array.from({ length: EXTRA_LEN }, (_, i) => fn(i / EXTRA_LEN));
  var pulse = (n) => build3((p) => p < n / 16 ? 1 : -1);
  var TUNER = (() => {
    const h = [0.5, 0.35, 0.4, 0.95, 1, 0.25];
    const power = h.reduce((s, a) => s + a * a, 0);
    const phase = h.map((_, k) => {
      let acc = 0;
      for (let j = 0; j <= k; j++) acc += (k + 1 - j) * h[j] * h[j] / power;
      return -Math.PI * acc;
    });
    const raw = build3((p) => h.reduce(
      (sum, a, i) => sum + a * Math.sin(2 * Math.PI * (i + 1) * p + phase[i]),
      0
    ));
    const top = Math.max(...raw.map(Math.abs));
    return raw.map((v) => v / top);
  })();
  var SAW_STEP = build3((p) => {
    const step = Math.floor(p * 8);
    return step >= 7 ? -1 : step / 6 * 2 - 1;
  });
  var AY_VOL_YM = [
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    5,
    6,
    7,
    9,
    11,
    13,
    15,
    18,
    22,
    26,
    31,
    37,
    45,
    53,
    63,
    76,
    90,
    106,
    127,
    151,
    180,
    214,
    255,
    255
  ];
  var AY_VOL_AY = [
    0,
    0,
    3,
    3,
    4,
    4,
    6,
    6,
    9,
    9,
    13,
    13,
    18,
    18,
    29,
    29,
    34,
    34,
    55,
    55,
    77,
    77,
    98,
    98,
    130,
    130,
    166,
    166,
    208,
    208,
    255,
    255
  ];
  var AY_SHAPE = (list) => {
    const mid = list.reduce((s, v) => s + v, 0) / list.length;
    const out = list.map((v) => v - mid);
    const peak = Math.max(...out.map(Math.abs));
    return out.map((v) => v / peak);
  };
  var SAW_OF = (t) => AY_SHAPE(Array.from({ length: 32 }, (_, i) => t[31 - i] / 255));
  var TRI_OF = (t) => AY_SHAPE([
    ...Array.from({ length: 32 }, (_, i) => t[31 - i] / 255),
    ...Array.from({ length: 32 }, (_, i) => t[i] / 255)
  ]);
  var BUZZ_SAW = SAW_OF(AY_VOL_YM);
  var BUZZ_TRI = TRI_OF(AY_VOL_YM);
  var BUZZ_SAW_4 = SAW_OF(AY_VOL_AY);
  var BUZZ_TRI_4 = TRI_OF(AY_VOL_AY);
  var NES_TRI = Array.from({ length: 32 }, (_, i) => {
    const step = i < 16 ? 15 - i : i - 16;
    return step / 15 * 2 - 1;
  });
  var EXTRA_PRESETS = {
    "wtPulse(6)": {
      noteJa: "\u5E45 6.25%(16 \u5206\u306E 1)\u3002\u7D30\u304F\u3066\u9F3B\u306B\u304B\u304B\u308B\u3002\u6DF7\u3093\u3060\u3068\u3053\u308D\u3067\u3082\u4ED6\u3068\u3076\u3064\u304B\u3089\u305A\u306B\u4E0A\u3078\u4E57\u308B",
      role: "lead",
      wave: pulse(1),
      bits: 1,
      note: "1/16 duty (6.25%). Thin and reedy; sits above a busier mix without fighting it."
    },
    "wtPulse(18)": {
      noteJa: "\u5E45 18.75%(16 \u5206\u306E 3)\u3002\u30D7\u30EA\u30BB\u30C3\u30C8\u306E 12.5% \u3068 25% \u306E\u3042\u3044\u3060",
      role: "lead",
      wave: pulse(3),
      bits: 1,
      note: "3/16 duty (18.75%). Between the built-in 12.5% and 25%."
    },
    "wtPulse(31)": {
      noteJa: "\u5E45 31.25%(16 \u5206\u306E 5)",
      role: "lead",
      wave: pulse(5),
      bits: 1,
      note: "5/16 duty (31.25%)."
    },
    "wtPulse(37)": {
      noteJa: "\u5E45 37.5%(16 \u5206\u306E 6)",
      role: "lead",
      wave: pulse(6),
      bits: 1,
      note: "6/16 duty (37.5%)."
    },
    "wtPulse(43)": {
      noteJa: "\u5E45 43.75%(16 \u5206\u306E 7)\u3002\u307B\u3068\u3093\u3069\u77E9\u5F62\u6CE2\u3068\u540C\u3058\u592A\u3055",
      role: "lead",
      wave: pulse(7),
      bits: 1,
      note: "7/16 duty (43.75%). Nearly as full as a square wave."
    },
    // **ファミコンの三角波に寄せたもの。**いまの `triangle` は触らない
    // (あれは音量が効くようにあえてそうしてある。実機に寄せて殺すと、
    // いま使っている曲が全部変わる)。**寄せたものが要るなら別の名前で足す。**
    //
    // **`wt` の一族ではない。**あちらは実機の波形メモリらしさを集めたところで、
    // 書き換えられることが売りになっている。ファミコンの三角波は形が固定で、
    // 書き換えられない。中で `registerWave` を通っているだけ(2026-09-25)。
    //
    // **`vsteps: 1` を持つ。**実機ではこの声にだけ音量つまみが無かったので、
    // 段が 1 つしかない —— 鳴るときは必ず最大で、`v0` だけが消音になる。
    // 音量の目盛りそのものは 0〜15 のままで、**この音色が段を 1 つしか
    // 持たない**だけ。前は `special: ['fixedVolume']` で書いていた。
    //
    // `vcurve: 'linear'` も実機どおり。ファミコンの矩形波と三角波は、
    // 4 ビットの値がそのまま振幅になる(対数の AY とはここが違う)。
    //
    // **音量の下駄 1.65 倍は実機の比。**あちらは声を足すところが直線ではなくて、
    // 三角のチャンネルだけ重みが違う。
    //
    //   パルス 1 本 最大 = 95.88 / (8128/15 + 100)  = 0.149
    //   三角      最大 = 159.79 / (8227/15 + 100) = 0.246
    //
    // ピークで 1.65 倍。三角の形そのものは実効値が振幅の 1/√3(−4.8dB)なので、
    // 掛けてようやくパルス 1 本と並ぶ。下駄を入れないと 4.4dB 小さく、
    // 実機の記憶より引っ込んで聞こえる(2026-09-23)。
    nesTriangle: {
      noteJa: "\u30D5\u30A1\u30DF\u30B3\u30F3\u306E\u4E09\u89D2\u6CE2\u3002\u306A\u3081\u3089\u304B\u3067\u306F\u306A\u304F 32 \u6BB5\u306E\u968E\u6BB5\u3067\u3001\u305D\u3053\u304B\u3089 31 \u500D\u97F3\u3068 33 \u500D\u97F3\u304C\u51FA\u308B\u3002\u3042\u306E\u300C\u30B8\u30FC\u300D\u3068\u3044\u3046\u8CEA\u611F\u306F\u3053\u308C\u3002\u5B9F\u6A5F\u3068\u540C\u3058\u304F\u97F3\u91CF\u3064\u307E\u307F\u304C\u52B9\u304B\u306A\u3044(v0 \u3067\u6D88\u97F3\u3001\u305D\u308C\u4EE5\u5916\u306F\u6700\u5927)\u3002\u5B9F\u6A5F\u306F\u4E09\u89D2\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u3060\u3051\u8DB3\u3059\u3068\u304D\u306E\u91CD\u307F\u304C\u9055\u3046\u306E\u3067\u3001\u305D\u306E\u6BD4\u306E 1.65 \u500D\u3092\u4E0B\u99C4\u306B\u3057\u3066\u3042\u308B\u3002\u3053\u308C\u3067\u30D1\u30EB\u30B9 1 \u672C\u3068\u540C\u3058\u304F\u3089\u3044\u306E\u5927\u304D\u3055\u306B\u306A\u308B",
      role: "bass",
      wave: NES_TRI,
      bits: 4,
      vsteps: 1,
      vcurve: "linear",
      gain: 1.65,
      note: "The NES triangle. A thirty-two step staircase rather than a smooth ramp, which puts the 31st and 33rd harmonics into it \u2014 that is where the buzz comes from. As on the real chip, volume does nothing: v0 silences it, anything else plays full. The real mixer weights the triangle channel more heavily than a pulse, so it carries that ratio as a 1.65x boost \u2014 without it the triangle sits 4.4dB below a pulse at full volume."
    },
    // **音律を確かめるためのもの。**楽器ではない。
    //
    // **`wt` の一族ではない。**あちらは実機の波形メモリらしさを集めたところで、
    // 段が粗いことが売りになっている。これは 8 ビットで、倍音から作っていて、
    // 分周の丸めからも外してある。性格が合わないので `tool` で始める。
    // 素の `tuner` を取らないのは、短い語を 1 つ押さえてしまうため(2026-09-23)。
    //
    // 音律の違いは、倍音どうしがぶつかって出る「うなり」でしか聞こえない。
    // 長 3 度なら下の音の 5 倍音と上の音の 4 倍音、5 度なら 3 倍音と 2 倍音。
    // 矩形波には偶数倍音が無いので、4 倍音も 2 倍音も出ない。ぶつかる相手が
    // いないので、どの音律で鳴らしても同じに聞こえる(2026-09-23)。
    //
    // そこで 2〜5 倍音を持たせて、**4 倍音と 5 倍音を basic より大きくした。**
    // 3 度も 5 度も、ずれていればはっきりうなる。
    toolTuner: {
      noteJa: "\u97F3\u5F8B\u3092\u78BA\u304B\u3081\u308B\u305F\u3081\u306E\u3082\u306E\u3002\u697D\u5668\u3067\u306F\u306A\u3044\u30024 \u500D\u97F3\u3068 5 \u500D\u97F3\u3092\u5F37\u304F\u3057\u3066\u3042\u308B\u306E\u3067\u30013 \u5EA6\u3068 5 \u5EA6\u306E\u305A\u308C\u304C\u3046\u306A\u308A\u306B\u306A\u3063\u3066\u51FA\u308B\u3002\u97F3\u5F8B\u3092\u66FF\u3048\u3066\u9577\u304F\u306E\u3070\u3059\u3068\u3001\u3046\u306A\u308A\u306E\u901F\u3055\u304C\u5909\u308F\u308B\u306E\u304C\u5206\u304B\u308B\u3002\u77E9\u5F62\u6CE2\u3067\u306F\u5076\u6570\u500D\u97F3\u304C\u7121\u3044\u306E\u3067\u3001\u305D\u3082\u305D\u3082\u3046\u306A\u308A\u304C\u51FA\u306A\u3044\u3002\u5B9F\u6A5F\u306E\u5206\u5468\u306B\u306F\u4E57\u305B\u306A\u3044\u3002\u4E38\u3081\u308B\u3068\u7D14\u6B63\u306E 3 \u5EA6\u304C 1.5Hz \u3046\u306A\u3063\u3066\u3001\u5E73\u5747\u5F8B\u306E\u901F\u3044\u3046\u306A\u308A\u3088\u308A\u63FA\u308C\u3066\u805E\u3053\u3048\u3066\u3057\u307E\u3046\u3002\u5C71\u3092 1 \u306B\u5747\u3059\u3076\u3093\u5B9F\u52B9\u5024\u304C\u4E0B\u304C\u308B\u306E\u3067\u3001\u97F3\u91CF\u306E\u4E0B\u99C4\u3092 1.9 \u500D\u306F\u304B\u305B\u3066\u3001\u77E9\u5F62\u6CE2\u3068\u540C\u3058 v \u3067\u540C\u3058\u304F\u3089\u3044\u306E\u5927\u304D\u3055\u306B\u306A\u308B\u3088\u3046\u306B\u3057\u3066\u3042\u308B",
      role: "lead",
      wave: TUNER,
      bits: 8,
      special: ["exact"],
      gain: 1.9,
      note: "A ruler, not an instrument. The fourth and fifth harmonics are pushed up, so a third or a fifth that is out of tune beats audibly. Hold a dyad and switch tunings: the beat rate is the difference. A square wave has no even harmonics, so nothing beats there at all. This one is never rounded onto the real chip dividers: rounding leaves a pure third beating at 1.5Hz, which reads as more wobble than the fast one."
    },
    // ---- AY のエンベロープを発振器として使ったときの音(ブザー音) ----
    //
    // MSX の PSG は、チャンネルの音量をエンベロープに任せられる。周期を
    // 音の速さまで上げると、音量の上下そのものが波形になる。矩形波しか
    // 出せないはずの PSG から、のこぎりと三角が出るのはこれ。
    //
    // **段は 32。DAC は対数で 1 段 1.5dB。**だから下りが直線ではなく、
    // 指数で落ちる形になる。そこがブザー音の質感(2026-09-26)。
    //
    // **音量つまみは効かない。**音量レジスタをエンベロープに明け渡すので、
    // `v` を書いても変わらない。`vsteps: 1` がそれを言う。
    //
    // **大きさは実機に合わせる。**実機の DAC では、ブザーの山は v15 の矩形波と
    // 同じ高さで、波が下まで降りるぶん実効値が低い(YM で 4.6dB、AY で 4.3dB)。
    // こちらの波形は山を 1 に均してあるので、そのままだとさらに下がる。
    //
    // **`gain` は表から計算した値ではなく、鳴らして測った値。**波形を帯域制限して
    // 山で正規化するところで目減りするぶんが、形によって違う。のこぎりは段差が
    // 大きいぶん行き過ぎが出て、そこで 1.5dB 削られていた(2026-09-26)。
    //
    // 下駄を付けないままにしていた(2026-09-26 の午前)。均したあとの値を実機の値だと
    // 思い込んでいた。均す前と後で矩形波との比が変わるのを見落としていた。
    //
    // **高さはエンベロープの周期で決まる。**クロックを 8 で割ったものを数え、
    // `EP` ごとに 1 段進む。のこぎりは 32 段で 1 周(`snapDiv: 256`)、三角は
    // 端で向きが反転して 64 段で 1 周(`snapDiv: 512`)。
    //
    // だから刻みがふつうの音程レジスタの 16 分の 1(三角は 32 分の 1)しかない。
    // 低いところは合うが高いところはずれる。ベースに使われたのはそのため。
    // 三角を 256 で寄せていたときは、実機より音痴が小さかった(2026-09-26)。
    "ayBuzzSaw(5bit)": {
      noteJa: "MSX \u306E PSG \u3067\u3001\u97F3\u91CF\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u3092\u767A\u632F\u5668\u306B\u3057\u305F\u3068\u304D\u306E\u97F3\u3002\u4E0B\u308B\u306E\u3053\u304E\u308A\u3002\u6BB5\u306F 32 \u3067\u3001\u5B9F\u6A5F\u306E DAC \u304C\u5BFE\u6570\u306A\u306E\u3067\u76F4\u7DDA\u3067\u306F\u306A\u304F\u6307\u6570\u3067\u843D\u3061\u308B\u3002\u97F3\u91CF\u3064\u307E\u307F\u306F\u52B9\u304B\u306A\u3044(v0 \u3067\u6D88\u97F3\u3001\u305D\u308C\u4EE5\u5916\u306F\u6700\u5927)\u3002\u5927\u304D\u3055\u306F v13 \u306E\u77E9\u5F62\u6CE2\u3068\u540C\u3058\u304F\u3089\u3044\u3002\u5C71\u306F v15 \u3068\u540C\u3058\u9AD8\u3055\u3060\u304C\u3001\u6CE2\u304C\u4E0B\u307E\u3067\u964D\u308A\u308B\u306E\u3067\u5B9F\u52B9\u5024\u304C 4.6dB \u4F4E\u3044\u3002\u5B9F\u6A5F\u3067\u306F\u9AD8\u3055\u306E\u523B\u307F\u304C\u7C97\u304F\u3001\u9AD8\u3044\u97F3\u307B\u3069\u305A\u308C\u308B\u306E\u3067\u30D9\u30FC\u30B9\u306B\u4F7F\u3046",
      role: "bass",
      wave: BUZZ_SAW,
      bits: 5,
      vsteps: 1,
      snapDiv: 256,
      gain: 1.841,
      special: ["buzz"],
      dcBias: 0.289,
      note: "What an MSX PSG sounds like when its volume envelope is driven at audio rate: a falling sawtooth. Thirty-two steps, and because the real DAC is logarithmic it falls in an exponential curve rather than a straight line. Volume does nothing here. On the real chip the pitch steps are coarse, so it went on the bass where that does not show. It lands about as loud as a square wave at v13."
    },
    "ayBuzzTri(5bit)": {
      noteJa: "MSX \u306E PSG \u3067\u3001\u97F3\u91CF\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u3092\u4E09\u89D2\u306E\u5F62\u3067\u56DE\u3057\u305F\u3068\u304D\u306E\u97F3\u3002\u77E9\u5F62\u6CE2\u3092\u8DB3\u3057\u3066\u306F\u4F5C\u308C\u306A\u3044\u4E09\u89D2\u304C\u3001\u3053\u3061\u3089\u304B\u3089\u306F\u51FA\u308B\u3002\u6BB5\u306F 32 \u3067\u3001\u5B9F\u6A5F\u306E DAC \u304C\u5BFE\u6570\u306A\u306E\u3067\u5742\u304C\u3075\u304F\u3089\u3080\u3002\u97F3\u91CF\u3064\u307E\u307F\u306F\u52B9\u304B\u306A\u3044\u3002\u306E\u3053\u304E\u308A\u3068\u540C\u3058\u304F\u3001v13 \u306E\u77E9\u5F62\u6CE2\u3068\u540C\u3058\u304F\u3089\u3044\u306E\u5927\u304D\u3055\u3002\u5B9F\u6A5F\u3067\u306F\u540C\u3058\u5468\u671F\u306E\u306E\u3053\u304E\u308A\u3088\u308A 1 \u30AA\u30AF\u30BF\u30FC\u30D6\u4F4E\u304F\u9CF4\u308B",
      role: "bass",
      wave: BUZZ_TRI,
      bits: 5,
      vsteps: 1,
      snapDiv: 512,
      gain: 1.581,
      special: ["buzz"],
      dcBias: 0.289,
      note: "The same envelope trick with the alternating shape: a triangle, the one thing you cannot reach by stacking squares. Thirty-two steps each way, bowed by the logarithmic DAC. Volume does nothing, and it lands about as loud as a square at v13. On the real chip it sounds an octave below the sawtooth for the same envelope period."
    },
    "ayBuzzSaw(4bit)": {
      noteJa: "\u4E0B\u308B\u306E\u3053\u304E\u308A\u306E 16 \u6BB5\u3002AY-3-8910 \u306F DAC \u304C 4 \u30D3\u30C3\u30C8\u3057\u304B\u306A\u3044\u306E\u3067\u3001\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u306E 32 \u6BB5\u304C 16 \u6BB5\u306B\u6F70\u308C\u308B\u30021 \u6BB5\u304C 1.8\u301C4.2dB \u3068\u3070\u3089\u3064\u304D\u3001\u968E\u6BB5\u304C\u7C97\u3044\u3002\u4E26\u3073\u65B9\u3082\u5225\u3082\u306E\u306A\u306E\u3067\u3001\u5B9F\u52B9\u5024\u306F 32 \u6BB5\u3088\u308A 0.3dB \u5927\u304D\u3044\u3002MSX1 \u3068 ZX Spectrum \u306F\u3053\u3061\u3089\u3002MSX2 \u4EE5\u964D\u306E YM2149 \u306F 32 \u6BB5\u306E\u307E\u307E",
      role: "bass",
      wave: BUZZ_SAW_4,
      bits: 4,
      vsteps: 1,
      snapDiv: 256,
      gain: 1.828,
      special: ["buzz"],
      dcBias: 0.371,
      note: "The falling ramp in sixteen steps. An AY-3-8910 has only a four-bit DAC, so the envelope's thirty-two steps collapse to sixteen, spaced anywhere from 1.8 to 4.2dB: a coarser stair, laid out differently, and 0.3dB louder overall. This is the MSX1 and the ZX Spectrum; a YM2149 keeps all thirty-two."
    },
    "ayBuzzTri(4bit)": {
      noteJa: "\u4E09\u89D2\u306E 16 \u6BB5\u3002\u306E\u3053\u304E\u308A\u3068\u540C\u3058\u7406\u7531\u3067\u968E\u6BB5\u304C\u7C97\u3044\u3002\u4E09\u89D2\u306F\u3082\u3068\u3082\u3068\u500D\u97F3\u304C\u5C11\u306A\u3044\u306E\u3067\u3001\u6BB5\u306E\u3056\u3089\u3064\u304D\u304C\u305D\u306E\u3076\u3093\u76EE\u7ACB\u3064",
      role: "bass",
      wave: BUZZ_TRI_4,
      bits: 4,
      vsteps: 1,
      snapDiv: 512,
      gain: 1.611,
      special: ["buzz"],
      dcBias: 0.371,
      note: "The triangle in sixteen steps, coarse for the same reason. A triangle carries few partials to begin with, so the grit of the stair shows up more clearly on it."
    },
    wtSawStep: {
      noteJa: "\u6BB5\u306E\u3042\u308B\u306E\u3053\u304E\u308A\u30027 \u6BB5\u306E\u307C\u3063\u3066 1 \u6BB5\u843D\u3061\u308B\u3002\u8DB3\u3057\u7B97\u5668\u3067\u4F5C\u308B\u30C1\u30C3\u30D7\u306F\u3053\u306E\u5F62\u306B\u306A\u308B\u3002\u7D20\u306E\u306A\u3060\u3089\u304B\u306A\u5742\u3088\u308A\u3056\u3089\u3064\u304F\u3002VRC6 \u306E\u306E\u3053\u304E\u308A\u306B\u305D\u306E\u307E\u307E\u5F53\u3066\u306F\u307E\u308B",
      role: "lead",
      wave: SAW_STEP,
      bits: 5,
      note: "Stepped saw: seven rising steps and a drop, the way an adder-based chip builds one. Grittier than a plain ramp. Maps straight onto the VRC6 saw."
    }
  };
  function registerExtraFamilies() {
    registerFamily("wtPulse", {
      note: "One-bit wavetable pulses in sixteenths, for widths the built-in pulse does not have.",
      params: [{
        name: "width",
        default: "6",
        note: "Share of each cycle spent high, in percent (rounded down).",
        values: [
          { value: "6", note: "1/16 (6.25%). Thin and reedy; sits above a busy mix without fighting it." },
          { value: "18", note: "3/16 (18.75%). Between the built-in 12.5% and 25%." },
          { value: "31", note: "5/16 (31.25%)." },
          { value: "37", note: "6/16 (37.5%)." },
          { value: "43", note: "7/16 (43.75%). Nearly as full as a square wave." }
        ]
      }]
    });
    const buzzBits = {
      name: "bits",
      default: "5bit",
      note: "Resolution of the PSG volume DAC the envelope runs through.",
      values: [
        { value: "5bit", note: "Thirty-two steps, as on a YM2149 (MSX2 and later)." },
        { value: "4bit", note: "Sixteen uneven steps, as on an AY-3-8910 (MSX1, ZX Spectrum). Coarser." }
      ]
    };
    registerFamily("ayBuzzSaw", {
      note: "MSX PSG volume envelope run at audio rate as a falling sawtooth. Volume does nothing.",
      params: [buzzBits]
    });
    registerFamily("ayBuzzTri", {
      note: "MSX PSG volume envelope run at audio rate as a triangle. Volume does nothing.",
      params: [buzzBits]
    });
  }
  function registerExtraWaves() {
    registerExtraFamilies();
    const has = (n) => findWave(n) >= 0;
    for (const [name, p] of Object.entries(EXTRA_PRESETS)) {
      if (!has(name)) {
        registerWave(
          name,
          p.wave,
          p.bits,
          {
            role: p.role,
            note: p.note,
            noteJa: p.noteJa,
            special: p.special,
            gain: p.gain,
            vsteps: p.vsteps,
            vcurve: p.vcurve,
            snapDiv: p.snapDiv,
            dcBias: p.dcBias
          }
        );
      }
    }
  }

  // ../../../tmp/panther-update/sound/pcmbake.js
  var MIN_LOOP = 1024;
  function periodMultiple(ratios, maxM = 8) {
    for (let m = 1; m <= maxM; m++) {
      let ok = true;
      for (const r of ratios) {
        const v = r * m;
        if (Math.abs(v - Math.round(v)) > 1e-6) {
          ok = false;
          break;
        }
      }
      if (ok) return m;
    }
    return 0;
  }
  function loopPlan(freq, sampleRate, m = 1, minLoop = MIN_LOOP) {
    const one = sampleRate * m / freq;
    const times = Math.max(1, Math.ceil(minLoop / one));
    const samples = Math.round(one * times);
    return {
      samples,
      // 丸めたあと、この波形が実際に持っている高さ
      bakedFreq: sampleRate * m * times / samples,
      cents: 1200 * Math.log2(sampleRate * m * times / samples / freq)
    };
  }
  var midiToFreq = (n) => 440 * Math.pow(2, (n - 69) / 12);
  function pitchSet(o = {}) {
    const octaves = o.octaves ?? [2, 3, 4, 5, 6];
    const step = Math.max(1, o.step ?? 1);
    const out = [];
    for (const oct of octaves) {
      for (let i = 0; i < 12; i += step) out.push((oct + 1) * 12 + i);
    }
    return out;
  }
  function bakePlan(patch, o = {}) {
    const sampleRate = o.sampleRate ?? 22050;
    const m = periodMultiple(patch.ops.map((x) => x.ratio));
    const sustains = patch.ops.some((x) => x.sl > 0);
    const notes = [];
    const loop = o.loop ?? sustains;
    const clean = m > 0;
    const minLoop = o.minLoop ?? MIN_LOOP;
    if (loop && !clean) {
      notes.push("\u7E70\u308A\u8FD4\u3055\u306A\u3044\u6CE2\u3092\u8F2A\u306B\u3057\u307E\u3059\u3002\u7D99\u304E\u76EE\u306E\u6BB5\u5DEE\u304C " + (sampleRate / minLoop).toFixed(0) + "Hz \u3042\u305F\u308A\u3067\u5538\u308A\u307E\u3059(\u8F2A\u306E\u9577\u3055\u3067\u9AD8\u3055\u304C\u5909\u308F\u308A\u307E\u3059)\u3002\u5ACC\u306A\u3089 sl \u3092 0 \u306B\u3057\u3066\u982D\u306E\u4E2D\u3067\u6E1B\u8870\u3057\u304D\u3063\u3066\u304F\u3060\u3055\u3044");
    }
    if (!loop && sustains) {
      notes.push("\u6BB5\u304C\u6B8B\u3063\u3066\u3044\u308B\u306E\u306B\u8F2A\u306B\u3057\u306A\u3044\u306E\u3067\u3001\u9014\u4E2D\u3067\u5207\u308C\u307E\u3059");
    }
    const attack = patch.ops.reduce((a, x) => Math.max(a, x.ar + x.dr), 0) + 0.02;
    const jobs = pitchSet(o).map((note) => {
      const freq = midiToFreq(note);
      const plan = loop ? loopPlan(freq, sampleRate, clean ? m : 1, minLoop) : null;
      const attackSamples = Math.ceil(attack * sampleRate);
      return {
        note,
        freq,
        bakedFreq: plan ? plan.bakedFreq : freq,
        cents: plan ? plan.cents : 0,
        attackSamples,
        loopSamples: plan ? plan.samples : 0,
        totalSamples: attackSamples + (plan ? plan.samples : 0)
      };
    });
    const total = jobs.reduce((a, j) => a + j.totalSamples, 0);
    return {
      sampleRate,
      loop,
      clean,
      periods: m,
      attack,
      notes,
      seamHz: loop && !clean ? sampleRate / (o.minLoop ?? MIN_LOOP) : 0,
      jobs,
      bytes: total * 2,
      // 16 ビットにしたときの大きさ
      seconds: total / sampleRate
    };
  }

  // ../../../tmp/panther-update/sound/opll.js
  var OPLL_INST = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    // 0: User
    113,
    97,
    30,
    23,
    208,
    120,
    0,
    23,
    // 1: Violin
    19,
    65,
    26,
    13,
    216,
    247,
    35,
    19,
    // 2: Guitar
    19,
    1,
    153,
    0,
    242,
    196,
    33,
    35,
    // 3: Piano
    17,
    97,
    14,
    7,
    141,
    100,
    112,
    39,
    // 4: Flute
    50,
    33,
    30,
    6,
    225,
    118,
    1,
    40,
    // 5: Clarinet
    49,
    34,
    22,
    5,
    224,
    113,
    0,
    24,
    // 6: Oboe
    33,
    97,
    29,
    7,
    130,
    129,
    17,
    7,
    // 7: Trumpet
    51,
    33,
    45,
    19,
    176,
    112,
    0,
    7,
    // 8: Organ
    97,
    97,
    27,
    6,
    100,
    101,
    16,
    23,
    // 9: Horn
    65,
    97,
    11,
    24,
    133,
    240,
    129,
    7,
    // A: Synthesizer
    51,
    1,
    131,
    17,
    234,
    239,
    16,
    4,
    // B: Harpsichord
    23,
    193,
    36,
    7,
    248,
    248,
    34,
    18,
    // C: Vibraphone
    97,
    80,
    12,
    5,
    210,
    245,
    64,
    66,
    // D: Synthesizer Bass
    1,
    1,
    85,
    3,
    233,
    144,
    3,
    2,
    // E: Acoustic Bass
    65,
    65,
    137,
    3,
    241,
    228,
    192,
    19,
    // F: Electric Guitar
    1,
    1,
    24,
    15,
    223,
    248,
    106,
    109,
    // R: Bass Drum
    1,
    1,
    0,
    0,
    200,
    216,
    167,
    104,
    // R: High-Hat / Snare
    5,
    1,
    0,
    0,
    248,
    170,
    89,
    85
    // R: Tom-tom / Top Cymbal
  ];
  var OPLL_INST_VRC7 = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    // 0: User
    3,
    33,
    5,
    6,
    232,
    129,
    66,
    39,
    // 1
    19,
    65,
    20,
    13,
    216,
    246,
    35,
    18,
    // 2
    17,
    17,
    8,
    8,
    250,
    178,
    32,
    18,
    // 3
    49,
    97,
    12,
    7,
    168,
    100,
    97,
    39,
    // 4
    50,
    33,
    30,
    6,
    225,
    118,
    1,
    40,
    // 5
    2,
    1,
    6,
    0,
    163,
    226,
    244,
    244,
    // 6
    33,
    97,
    29,
    7,
    130,
    129,
    17,
    7,
    // 7
    35,
    33,
    34,
    23,
    162,
    114,
    1,
    23,
    // 8
    53,
    17,
    37,
    0,
    64,
    115,
    114,
    1,
    // 9
    181,
    1,
    15,
    15,
    168,
    165,
    81,
    2,
    // 10
    23,
    193,
    36,
    7,
    248,
    248,
    34,
    18,
    // 11
    113,
    35,
    17,
    6,
    101,
    116,
    24,
    22,
    // 12
    1,
    2,
    211,
    5,
    201,
    149,
    3,
    2,
    // 13
    97,
    99,
    12,
    0,
    148,
    192,
    51,
    246,
    // 14
    33,
    114,
    13,
    0,
    193,
    213,
    86,
    6,
    // 15
    1,
    1,
    24,
    15,
    223,
    248,
    106,
    109,
    // R: Bass Drum
    1,
    1,
    0,
    0,
    200,
    216,
    167,
    104,
    // R: Hi-Hat / Snare
    5,
    1,
    0,
    0,
    248,
    170,
    89,
    85
    // R: Tom / Cymbal
  ];
  var OPLL_INST_YMF281 = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    // 0: User
    98,
    33,
    26,
    7,
    240,
    111,
    0,
    22,
    // 1: Electric Strings
    64,
    16,
    69,
    0,
    246,
    131,
    115,
    99,
    // 2: Bow Wow
    19,
    1,
    153,
    0,
    242,
    195,
    33,
    35,
    // 3: Electric Guitar
    1,
    97,
    11,
    15,
    249,
    100,
    112,
    23,
    // 4: Organ
    50,
    33,
    30,
    6,
    225,
    118,
    1,
    40,
    // 5: Clarinet
    96,
    1,
    130,
    14,
    249,
    97,
    32,
    39,
    // 6: Saxophone
    33,
    97,
    28,
    7,
    132,
    129,
    17,
    7,
    // 7: Trumpet
    55,
    50,
    201,
    1,
    102,
    100,
    64,
    40,
    // 8: Street Organ
    1,
    33,
    7,
    3,
    165,
    113,
    81,
    7,
    // 9: Synth Brass
    6,
    1,
    94,
    7,
    243,
    243,
    246,
    19,
    // A: Electric Piano
    0,
    0,
    24,
    6,
    245,
    243,
    32,
    35,
    // B: Bass
    23,
    193,
    36,
    7,
    248,
    248,
    34,
    18,
    // C: Vibraphone
    53,
    100,
    0,
    0,
    255,
    243,
    119,
    245,
    // D: Chimes
    17,
    49,
    0,
    7,
    221,
    243,
    255,
    251,
    // E: Tom Tom II
    58,
    33,
    0,
    7,
    128,
    132,
    15,
    245,
    // F: Noise
    1,
    1,
    24,
    15,
    223,
    248,
    106,
    109,
    // R: Bass Drum
    1,
    1,
    0,
    0,
    200,
    216,
    167,
    104,
    // R: Hi-Hat / Snare
    5,
    1,
    0,
    0,
    248,
    170,
    89,
    85
    // R: Tom / Cymbal
  ];
  var OPLL_CLOCK = 3579545;
  var OPLL_RATE = OPLL_CLOCK / 72;
  var OPLL_CODE = `
const SETS = ${JSON.stringify([OPLL_INST, OPLL_INST_VRC7, OPLL_INST_YMF281])};
const CLK = ${OPLL_CLOCK};
const RATE = CLK / 72;

// ---- \u8868\u3002**\u6570\u5024\u3067\u306F\u6301\u305F\u306A\u3044\u3002\u5F0F\u3067\u4F5C\u308B** ----

// \u5BFE\u6570\u30B5\u30A4\u30F3\u8868\u30024 \u5206\u306E 1 \u5468\u3076\u3093\u3092\u5F0F\u3067\u4F5C\u3063\u3066\u3001\u6B8B\u308A\u306F\u6298\u308A\u8FD4\u3057\u3067\u57CB\u3081\u308B
const SIN = new Uint16Array(1024);
for (let x = 0; x < 256; x++) SIN[x] = Math.round(-Math.log2(Math.sin((x + 0.5) * Math.PI / 512)) * 256);
for (let x = 0; x < 256; x++) SIN[256 + x] = SIN[255 - x];
for (let x = 0; x < 512; x++) SIN[512 + x] = 0x8000 | SIN[x];
// \u534A\u6CE2\u6574\u6D41(WS=1)\u3002\u5F8C\u308D\u534A\u5206\u306F\u6700\u5C0F\u306B\u5F35\u308A\u4ED8\u304F
const HALF = new Uint16Array(1024);
for (let x = 0; x < 512; x++) HALF[x] = SIN[x];
for (let x = 512; x < 1024; x++) HALF[x] = 0xfff;
const WAVE = [SIN, HALF];

const EXP = new Uint16Array(256);
for (let x = 0; x < 256; x++) EXP[x] = Math.round((Math.pow(2, x / 256) - 1) * 1024);

// \u97F3\u91CF LFO\u30028 \u500B\u305A\u3064 0\u301C13 \u3092\u4E0A\u3063\u3066\u4E0B\u308B\u3002\u3066\u3063\u307A\u3093\u3060\u3051 3 \u500B
const AM = [];
for (let v = 0; v <= 12; v++) for (let i = 0; i < 8; i++) AM.push(v);
AM.push(13, 13, 13);
for (let v = 12; v >= 0; v--) for (let i = 0; i < 8; i++) AM.push(v);
AM.length = 210;

// \u9AD8\u3055 LFO\u300214 \u30BB\u30F3\u30C8\u307B\u3069\u306E\u6DF1\u3055
const PM = [
  [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, -1, 0],
  [0, 1, 2, 1, 0, -1, -2, -1], [0, 1, 3, 1, 0, -1, -3, -1],
  [0, 2, 4, 2, 0, -2, -4, -2], [0, 2, 5, 2, 0, -2, -5, -2],
  [0, 3, 6, 3, 0, -3, -6, -3], [0, 3, 7, 3, 0, -3, -7, -3],
];

const EG_STEP = [
  [0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 0, 1, 1, 1, 0, 1],
  [0, 1, 1, 1, 0, 1, 1, 1], [0, 1, 1, 1, 1, 1, 1, 1],
];
const ML = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 20, 24, 24, 30, 30];
const KL = [0, 18, 24, 27.75, 30, 32.25, 33.75, 35.25, 36, 37.5, 38.25, 39, 39.75, 40.5, 41.25, 42];

// \u30AD\u30FC\u30B9\u30B1\u30FC\u30EB\u3067\u97F3\u91CF\u304C\u843D\u3061\u308B\u3076\u3093\u3002block \u3068 fnum \u306E\u4E0A 4 \u30D3\u30C3\u30C8\u3067\u5F15\u304F
const TLL = new Uint16Array(128 * 64 * 4);
for (let fnum = 0; fnum < 16; fnum++) {
  for (let blk = 0; blk < 8; blk++) {
    for (let tl = 0; tl < 64; tl++) {
      for (let kl = 0; kl < 4; kl++) {
        const at = (((blk << 4) | fnum) * 64 + tl) * 4 + kl;
        if (kl === 0) { TLL[at] = tl << 1; continue; }
        const tmp = Math.floor(KL[fnum] - 6 * (7 - blk));
        TLL[at] = tmp <= 0 ? (tl << 1) : (Math.floor((tmp >> (3 - kl)) / 0.375) + (tl << 1));
      }
    }
  }
}
// \u30AD\u30FC\u30B9\u30B1\u30FC\u30EB\u3067\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u304C\u901F\u304F\u306A\u308B\u3076\u3093
const RKS = new Int32Array(16 * 2);
for (let f8 = 0; f8 < 2; f8++) {
  for (let blk = 0; blk < 8; blk++) {
    RKS[((blk << 1) | f8) * 2 + 1] = (blk << 1) + f8;
    RKS[((blk << 1) | f8) * 2 + 0] = blk >> 1;
  }
}

const EG_MUTE = 127;
const EG_MAX = EG_MUTE - 4;
const ATTACK = 0, DECAY = 1, SUSTAIN = 2, RELEASE = 3, DAMP = 4;
const DAMPER_RATE = 12;

/** 8 \u30D0\u30A4\u30C8\u306E\u97F3\u8272\u3092\u30012 \u3064\u306E\u30AA\u30DA\u30EC\u30FC\u30BF\u3076\u3093\u306B\u958B\u304F */
function toPatch(d, at) {
  const m = {}, c = {};
  m.AM = (d[at] >> 7) & 1; c.AM = (d[at + 1] >> 7) & 1;
  m.PM = (d[at] >> 6) & 1; c.PM = (d[at + 1] >> 6) & 1;
  m.EG = (d[at] >> 5) & 1; c.EG = (d[at + 1] >> 5) & 1;
  m.KR = (d[at] >> 4) & 1; c.KR = (d[at + 1] >> 4) & 1;
  m.ML = d[at] & 15;       c.ML = d[at + 1] & 15;
  m.KL = (d[at + 2] >> 6) & 3; c.KL = (d[at + 3] >> 6) & 3;
  m.TL = d[at + 2] & 63;   c.TL = 0;
  m.FB = d[at + 3] & 7;    c.FB = 0;
  m.WS = (d[at + 3] >> 3) & 1; c.WS = (d[at + 3] >> 4) & 1;
  m.AR = (d[at + 4] >> 4) & 15; c.AR = (d[at + 5] >> 4) & 15;
  m.DR = d[at + 4] & 15;   c.DR = d[at + 5] & 15;
  m.SL = (d[at + 6] >> 4) & 15; c.SL = (d[at + 7] >> 4) & 15;
  m.RR = d[at + 6] & 15;   c.RR = d[at + 7] & 15;
  return [m, c];
}
// 3 \u7D44\u3076\u3093\u306E\u97F3\u8272\u3002\u6F14\u7B97\u5668\u306F\u540C\u3058\u3067\u3001\u8868\u3060\u3051\u304C\u9055\u3046
const PATCHES = SETS.map((t) => {
  const out = [];
  for (let i = 0; i < 19; i++) out.push(...toPatch(t, i * 8));
  return out;
});
const DEFAULT_PATCH = PATCHES[0];

function newSlot(n) {
  return {
    number: n, type: n % 2, pgKeep: 0, wave: WAVE[0],
    pgPhase: 0, pgOut: 0, out0: 0, out1: 0,
    egState: RELEASE, egOut: EG_MUTE, egRateH: 0, egRateL: 0, egShift: 0,
    patch: DEFAULT_PATCH[0], fnum: 0, blk: 0, blkFnum: 0,
    volume: 0, tll: 0, rks: 0, keyFlag: 0, susFlag: 0, req: 0,
  };
}

class OPLL {
  constructor() {
    this.reg = new Uint8Array(0x40);
    this.slot = [];
    for (let i = 0; i < 18; i++) this.slot.push(newSlot(i));
    this.patch = [Object.assign({}, DEFAULT_PATCH[0]), Object.assign({}, DEFAULT_PATCH[1])];
    this.patchNumber = new Int32Array(9);
    // \u30C1\u30E3\u30F3\u30CD\u30EB\u3054\u3068\u306B\u3001\u3069\u306E\u8868\u306E\u97F3\u8272\u3092\u7740\u308B\u304B\u30020 = YM2413
    this.patchSet = new Int32Array(9);
    this.slotKey = 0;
    this.pmPhase = 0; this.amPhase = 0; this.lfoAm = 0;
    this.egCounter = 0;
    this.noise = 1; this.shortNoise = 0; this.rhythm = 0;
    this.chOut = new Int16Array(9);
    for (let ch = 0; ch < 9; ch++) this.setPatch(ch, 0);
  }
  mod(ch) { return this.slot[ch << 1]; }
  car(ch) { return this.slot[(ch << 1) | 1]; }

  /** \u305D\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u304C\u4F7F\u3046\u97F3\u8272\u8868\u3092\u9078\u3076\u3002\u6F14\u7B97\u5668\u306F\u540C\u3058\u3067\u3001\u8868\u3060\u3051\u304C\u5909\u308F\u308B */
  useSet(ch, set) {
    const n = Math.max(0, Math.min(PATCHES.length - 1, set | 0));
    if (this.patchSet[ch] === n) return;
    this.patchSet[ch] = n;
    this.setPatch(ch, this.patchNumber[ch]);
  }
  setPatch(ch, num) {
    const tbl = PATCHES[this.patchSet[ch]];
    this.patchNumber[ch] = num;
    this.mod(ch).patch = num === 0 ? this.patch[0] : tbl[num * 2];
    this.car(ch).patch = num === 0 ? this.patch[1] : tbl[num * 2 + 1];
    this.mod(ch).req = 255;
    this.car(ch).req = 255;
  }
  setFnumber(ch, fnum) {
    for (const s of [this.car(ch), this.mod(ch)]) {
      s.fnum = fnum;
      s.blkFnum = (s.blkFnum & 0xe00) | (fnum & 0x1ff);
      s.req |= 2 | 4 | 8;
    }
  }
  setBlock(ch, blk) {
    for (const s of [this.car(ch), this.mod(ch)]) {
      s.blk = blk;
      s.blkFnum = ((blk & 7) << 9) | (s.blkFnum & 0x1ff);
      s.req |= 2 | 4 | 8;
    }
  }
  setVolume(ch, v) { this.car(ch).volume = v; this.car(ch).req |= 2; }
  setSlotVolume(s, v) { s.volume = v; s.req |= 2; }
  setSus(ch, f) {
    this.car(ch).susFlag = f; this.car(ch).req |= 8;
  }

  writeReg(reg, data) {
    if (reg >= 0x40) return;
    if ((0x19 <= reg && reg <= 0x1f) || (0x29 <= reg && reg <= 0x2f)
        || (0x39 <= reg && reg <= 0x3f)) reg -= 9;
    this.reg[reg] = data & 0xff;
    const p = this.patch;
    if (reg === 0x00 || reg === 0x01) {
      const t = p[reg];
      t.AM = (data >> 7) & 1; t.PM = (data >> 6) & 1;
      t.EG = (data >> 5) & 1; t.KR = (data >> 4) & 1; t.ML = data & 15;
      for (let i = 0; i < 9; i++) if (this.patchNumber[i] === 0) {
        (reg === 0 ? this.mod(i) : this.car(i)).req |= 4 | 8;
      }
    } else if (reg === 0x02) {
      p[0].KL = (data >> 6) & 3; p[0].TL = data & 63;
      for (let i = 0; i < 9; i++) if (this.patchNumber[i] === 0) this.mod(i).req |= 2;
    } else if (reg === 0x03) {
      p[1].KL = (data >> 6) & 3; p[1].WS = (data >> 4) & 1;
      p[0].WS = (data >> 3) & 1; p[0].FB = data & 7;
      for (let i = 0; i < 9; i++) if (this.patchNumber[i] === 0) {
        this.mod(i).req |= 1; this.car(i).req |= 1 | 2;
      }
    } else if (reg === 0x04 || reg === 0x05) {
      const t = p[reg - 4];
      t.AR = (data >> 4) & 15; t.DR = data & 15;
      for (let i = 0; i < 9; i++) if (this.patchNumber[i] === 0) {
        (reg === 4 ? this.mod(i) : this.car(i)).req |= 8;
      }
    } else if (reg === 0x06 || reg === 0x07) {
      const t = p[reg - 6];
      t.SL = (data >> 4) & 15; t.RR = data & 15;
      for (let i = 0; i < 9; i++) if (this.patchNumber[i] === 0) {
        const s = reg === 6 ? this.mod(i) : this.car(i);
        s.req |= 2 | 8;
      }
    } else if (0x10 <= reg && reg <= 0x18) {
      this.setFnumber(reg - 0x10, ((this.reg[0x20 + reg - 0x10] & 1) << 8) | data);
      this.updateKey();
    } else if (0x20 <= reg && reg <= 0x28) {
      const ch = reg - 0x20;
      this.setFnumber(ch, ((data & 1) << 8) | this.reg[0x10 + ch]);
      this.setBlock(ch, (data >> 1) & 7);
      this.setSus(ch, (data >> 5) & 1);
      this.updateKey();
    } else if (reg === 0x0e) {
      this.updateRhythm();
      this.updateKey();
    } else if (0x30 <= reg && reg <= 0x38) {
      const ch = reg - 0x30;
      if ((this.reg[0x0e] & 32) && reg >= 0x36) {
        // \u30EA\u30BA\u30E0\u306E\u3068\u304D\u306F\u3001\u4E0A\u306E 4 \u30D3\u30C3\u30C8\u304C\u5909\u8ABF\u5074\u306E\u97F3\u91CF\u306B\u306A\u308B
        if (reg === 0x37) this.setSlotVolume(this.mod(7), ((data >> 4) & 15) << 2);
        if (reg === 0x38) this.setSlotVolume(this.mod(8), ((data >> 4) & 15) << 2);
      } else {
        this.setPatch(ch, (data >> 4) & 15);
      }
      this.setVolume(ch, (data & 15) << 2);
    }
  }

  /**
   * \u30EA\u30BA\u30E0\u306B\u5165\u308B\u3068\u3001\u4E0B 3 \u30C1\u30E3\u30F3\u30CD\u30EB\u304C\u6253\u697D\u5668\u306B\u306A\u308B\u3002
   *
   * \u30CF\u30A4\u30CF\u30C3\u30C8\u3068\u30B7\u30F3\u30D0\u30EB\u306F\u4F4D\u76F8\u3092\u6B62\u3081\u306A\u3044(pgKeep)\u3002\u30CE\u30A4\u30BA\u3068\u7D44\u307F\u5408\u308F\u305B\u3066
   * \u91D1\u7269\u306E\u97F3\u3092\u4F5C\u308B\u306E\u3067\u3001\u30AD\u30FC\u30AA\u30F3\u306E\u305F\u3073\u306B\u4F4D\u76F8\u304C\u623B\u308B\u3068\u8CEA\u611F\u304C\u5909\u308F\u308B
   */
  updateRhythm() {
    const on = (this.reg[0x0e] >> 5) & 1;
    if (this.rhythm !== on) {
      if (on) {
        this.slot[14].type = 3; this.slot[14].pgKeep = 1;
        this.slot[15].type = 3;
        this.slot[16].type = 3;
        this.slot[17].type = 3; this.slot[17].pgKeep = 1;
        this.setPatch(6, 16); this.setPatch(7, 17); this.setPatch(8, 18);
        this.setSlotVolume(this.slot[14], ((this.reg[0x37] >> 4) & 15) << 2);
        this.setSlotVolume(this.slot[16], ((this.reg[0x38] >> 4) & 15) << 2);
      } else {
        this.slot[14].type = 0; this.slot[14].pgKeep = 0;
        this.slot[15].type = 1;
        this.slot[16].type = 0;
        this.slot[17].type = 1; this.slot[17].pgKeep = 0;
        this.setPatch(6, this.reg[0x36] >> 4);
        this.setPatch(7, this.reg[0x37] >> 4);
        this.setPatch(8, this.reg[0x38] >> 4);
      }
    }
    this.rhythm = on;
  }

  updateKey() {
    let want = 0;
    for (let ch = 0; ch < 9; ch++) if (this.reg[0x20 + ch] & 0x10) want |= 3 << (ch * 2);
    if ((this.reg[0x0e] >> 5) & 1) {
      const r14 = this.reg[0x0e];
      if (r14 & 0x10) want |= 3 << 12;   // \u30D0\u30B9\u30C9\u30E9\u306F 2 \u30B9\u30ED\u30C3\u30C8
      if (r14 & 0x01) want |= 1 << 14;   // \u30CF\u30A4\u30CF\u30C3\u30C8
      if (r14 & 0x08) want |= 1 << 15;   // \u30B9\u30CD\u30A2
      if (r14 & 0x04) want |= 1 << 16;   // \u30BF\u30E0
      if (r14 & 0x02) want |= 1 << 17;   // \u30B7\u30F3\u30D0\u30EB
    }
    const diff = this.slotKey ^ want;
    if (diff) {
      for (let i = 0; i < 18; i++) {
        if (!((diff >> i) & 1)) continue;
        const s = this.slot[i];
        if ((want >> i) & 1) { s.keyFlag = 1; s.egState = DAMP; s.req |= 8; }
        else { s.keyFlag = 0; if (s.type & 1) { s.egState = RELEASE; s.req |= 8; } }
      }
    }
    this.slotKey = want;
  }

  rateOf(s) {
    if ((s.type & 1) === 0 && s.keyFlag === 0) return 0;
    switch (s.egState) {
      case ATTACK: return s.patch.AR;
      case DECAY: return s.patch.DR;
      case SUSTAIN: return s.patch.EG ? 0 : s.patch.RR;
      case RELEASE: return s.susFlag ? 5 : (s.patch.EG ? s.patch.RR : 7);
      case DAMP: return DAMPER_RATE;
      default: return 0;
    }
  }
  commit(s) {
    if (s.req & 1) s.wave = WAVE[s.patch.WS];
    if (s.req & 2) {
      const lvl = (s.type & 1) === 0 ? s.patch.TL : s.volume;
      s.tll = TLL[((s.blkFnum >> 5) * 64 + lvl) * 4 + s.patch.KL];
    }
    if (s.req & 4) s.rks = RKS[(s.blkFnum >> 8) * 2 + s.patch.KR];
    if (s.req & (4 | 8)) {
      const r = this.rateOf(s);
      if (r === 0) { s.egShift = 0; s.egRateH = 0; s.egRateL = 0; s.req = 0; return; }
      s.egRateH = Math.min(15, r + (s.rks >> 2));
      s.egRateL = s.rks & 3;
      s.egShift = s.egState === ATTACK
        ? ((0 < s.egRateH && s.egRateH < 12) ? (13 - s.egRateH) : 0)
        : (s.egRateH < 13 ? (13 - s.egRateH) : 0);
    }
    s.req = 0;
  }

  attackStep(s, c) {
    const i2 = (c & 0xc) >> 1;
    switch (s.egRateH) {
      case 12: return 4 - EG_STEP[s.egRateL][i2];
      case 13: return 3 - EG_STEP[s.egRateL][i2];
      case 14: return 2 - EG_STEP[s.egRateL][i2];
      case 0: case 15: return 0;
      default: return EG_STEP[s.egRateL][(c >> s.egShift) & 7] ? 4 : 0;
    }
  }
  decayStep(s, c) {
    switch (s.egRateH) {
      case 0: return 0;
      case 13: return EG_STEP[s.egRateL][((c & 0xc) >> 1) | (c & 1)];
      case 14: return EG_STEP[s.egRateL][(c & 0xc) >> 1] + 1;
      case 15: return 2;
      default: return EG_STEP[s.egRateL][(c >> s.egShift) & 7];
    }
  }
  startEnv(s) {
    if (Math.min(15, s.patch.AR + (s.rks >> 2)) === 15) { s.egState = DECAY; s.egOut = 0; }
    else s.egState = ATTACK;
    s.req |= 8;
  }
  calcEnv(s, buddy, c) {
    const mask = (1 << s.egShift) - 1;
    if (s.egState === ATTACK) {
      if (0 < s.egOut && 0 < s.egRateH && (c & mask & ~3) === 0) {
        const step = this.attackStep(s, c);
        if (step > 0) s.egOut = Math.max(0, s.egOut - (s.egOut >> step) - 1);
      }
    } else if (s.egRateH > 0 && (c & mask) === 0) {
      s.egOut = Math.min(EG_MUTE, s.egOut + this.decayStep(s, c));
    }
    if (s.egState === DAMP) {
      if (s.egOut >= EG_MAX && (c & mask) === 0) {
        this.startEnv(s);
        if (s.type & 1) {
          if (!s.pgKeep) s.pgPhase = 0;
          if (buddy && !buddy.pgKeep) buddy.pgPhase = 0;
        }
      }
    } else if (s.egState === ATTACK) {
      if (s.egOut === 0) { s.egState = DECAY; s.req |= 8; }
    } else if (s.egState === DECAY) {
      if ((s.egOut >> 3) === s.patch.SL) { s.egState = SUSTAIN; s.req |= 8; }
    }
  }
  calcPhase(s, pmPhase) {
    const pm = s.patch.PM ? PM[(s.fnum >> 6) & 7][(pmPhase >> 10) & 7] : 0;
    s.pgPhase += ((((s.fnum & 0x1ff) * 2 + pm) * ML[s.patch.ML]) << s.blk) >> 2;
    s.pgPhase &= (1 << 19) - 1;
    s.pgOut = s.pgPhase >> 9;
  }

  toLinear(h, s, am) {
    if (s.egOut > EG_MAX) return 0;
    const att = Math.min(EG_MUTE, s.egOut + s.tll + am) << 4;
    const i = h + att;
    const t = EXP[(i & 0xff) ^ 0xff] + 1024;
    const res = t >> ((i & 0x7f00) >> 8);
    return ((i & 0x8000) ? ~res : res) << 1;
  }
  calcMod(ch) {
    const s = this.mod(ch);
    const fb = s.patch.FB > 0 ? (s.out1 + s.out0) >> (9 - s.patch.FB) : 0;
    const am = s.patch.AM ? this.lfoAm : 0;
    s.out1 = s.out0;
    s.out0 = this.toLinear(s.wave[(s.pgOut + fb) & 1023], s, am);
    return s.out0;
  }
  calcCar(ch, fm) {
    const s = this.car(ch);
    const am = s.patch.AM ? this.lfoAm : 0;
    s.out1 = s.out0;
    s.out0 = this.toLinear(s.wave[(s.pgOut + 2 * (fm >> 1)) & 1023], s, am);
    return s.out0;
  }

  /** \u30CE\u30A4\u30BA\u300218 \u30D3\u30C3\u30C8\u306E\u30B7\u30D5\u30C8\u30EC\u30B8\u30B9\u30BF */
  stepNoise(n) {
    for (let i = 0; i < n; i++) {
      if (this.noise & 1) this.noise ^= 0x800200;
      this.noise >>>= 1;
    }
  }
  /** \u91D1\u7269\u306E\u77ED\u3044\u30CE\u30A4\u30BA\u3002\u30CF\u30A4\u30CF\u30C3\u30C8\u3068\u30B7\u30F3\u30D0\u30EB\u306E\u4F4D\u76F8\u304B\u3089\u4F5C\u308B */
  updateShortNoise() {
    const hh = this.slot[14].pgOut, cym = this.slot[17].pgOut;
    const h2 = (hh >> 2) & 1, h7 = (hh >> 7) & 1, h3 = (hh >> 3) & 1;
    const c3 = (cym >> 3) & 1, c5 = (cym >> 5) & 1;
    this.shortNoise = (h2 ^ h7) | (h3 ^ c5) | (c3 ^ c5);
  }
  calcTom() { const s = this.mod(8); return this.toLinear(s.wave[s.pgOut], s, 0); }
  calcSnare() {
    const s = this.car(7);
    const ph = ((s.pgOut >> 8) & 1)
      ? ((this.noise & 1) ? 0x300 : 0x200)
      : ((this.noise & 1) ? 0x000 : 0x100);
    return this.toLinear(s.wave[ph], s, 0);
  }
  calcCym() {
    const s = this.car(8);
    return this.toLinear(s.wave[this.shortNoise ? 0x300 : 0x100], s, 0);
  }
  calcHat() {
    const s = this.mod(7);
    const ph = this.shortNoise
      ? ((this.noise & 1) ? 0x2d0 : 0x234)
      : ((this.noise & 1) ? 0x034 : 0x0d0);
    return this.toLinear(s.wave[ph], s, 0);
  }

  /**
   * 1 \u30B5\u30F3\u30D7\u30EB(49716Hz)\u3076\u3093\u9032\u3081\u3066\u3001\u548C\u3092\u8FD4\u3059\u3002
   *
   * **\u30CE\u30A4\u30BA\u3092\u9032\u3081\u308B\u4F4D\u7F6E\u304C\u6C7A\u307E\u3063\u3066\u3044\u308B\u3002**\u30C1\u30E3\u30F3\u30CD\u30EB 7 \u3092\u51FA\u3057\u305F\u3042\u3068 14 \u56DE\u3001
   * 8 \u3068 9 \u306E\u3042\u3068\u306B 2 \u56DE\u305A\u3064\u3002\u5B9F\u6A5F\u306E 1 \u30B5\u30F3\u30D7\u30EB\u304C 18 \u30B9\u30ED\u30C3\u30C8\u3076\u3093\u306E\u6642\u9593\u3092
   * \u304B\u3051\u3066\u56DE\u308B\u306E\u3067\u3001\u305D\u306E\u3042\u3044\u3060\u30CE\u30A4\u30BA\u3082\u9032\u3080\u3002\u3053\u3053\u3092 1 \u304B\u6240\u306B\u307E\u3068\u3081\u308B\u3068\u3001
   * \u30B9\u30CD\u30A2\u3068\u30CF\u30A4\u30CF\u30C3\u30C8\u306E\u7C92\u7ACB\u3061\u304C\u5909\u308F\u308B
   */
  tick() {
    this.pmPhase++;
    this.amPhase++;
    this.lfoAm = AM[(this.amPhase >> 6) % 210];
    this.updateShortNoise();
    this.egCounter++;
    for (let i = 0; i < 18; i++) {
      const s = this.slot[i];
      const buddy = s.type === 0 ? this.slot[i + 1] : this.slot[i - 1];
      if (s.req) this.commit(s);
      this.calcEnv(s, buddy, this.egCounter);
      this.calcPhase(s, this.pmPhase);
    }
    let sum = 0;
    for (let ch = 0; ch < 6; ch++) sum += -(this.calcCar(ch, this.calcMod(ch)) >> 1);
    if (!this.rhythm) sum += -(this.calcCar(6, this.calcMod(6)) >> 1);
    else sum += this.calcCar(6, this.calcMod(6));          // \u30D0\u30B9\u30C9\u30E9
    this.stepNoise(14);
    if (!this.rhythm) sum += -(this.calcCar(7, this.calcMod(7)) >> 1);
    else { sum += this.calcHat(); sum += this.calcSnare(); }
    this.stepNoise(2);
    if (!this.rhythm) sum += -(this.calcCar(8, this.calcMod(8)) >> 1);
    else { sum += this.calcTom(); sum += this.calcCym(); }
    this.stepNoise(2);
    return sum;
  }
}

// ---- \u97F3\u7B26\u3092\u53D7\u3051\u3066\u3001\u30EC\u30B8\u30B9\u30BF\u3078\u5909\u63DB\u3059\u308B ----
//
// engine \u306E\u5074\u306F\u97F3\u7B26\u3092\u6E21\u3059\u4F5C\u308A\u306A\u306E\u3067\u3001\u3053\u3053\u3067 9 \u58F0\u3078\u5272\u308A\u5F53\u3066\u3066\u3001
// fnum \u3068 block \u3068\u30AD\u30FC\u30AA\u30F3\u306B\u76F4\u3059\u3002**\u30EC\u30B8\u30B9\u30BF\u3092\u76F4\u306B\u66F8\u304F\u9053\u306F\u307E\u3060\u7121\u3044\u3002**

/** \u9AD8\u3055\u304B\u3089 block \u3068 fnum \u3092\u51FA\u3059\u3002fnum \u306F 256 \u4EE5\u4E0A\u306B\u5BC4\u305B\u3066\u523B\u307F\u3092\u7A3C\u3050 */
function pitchOf(freq) {
  for (let blk = 0; blk < 8; blk++) {
    const fnum = Math.round(freq * 72 * 524288 / (CLK * (1 << blk)));
    if (fnum < 512) return { blk, fnum: Math.max(1, fnum) };
  }
  return { blk: 7, fnum: 511 };
}

/**
 * \u30EA\u30BA\u30E0\u306E 5 \u3064\u3002R14 \u306E\u3069\u306E\u30D3\u30C3\u30C8\u3067\u53E9\u304F\u304B\u3001\u97F3\u91CF\u3092\u3069\u3053\u3078\u66F8\u304F\u304B\u3002
 *
 * **\u9AD8\u3055\u306F\u6C7A\u3081\u6253\u3061\u3002**\u5B9F\u6A5F\u306E\u30C9\u30E9\u30A4\u30D0\u3082\u3053\u306E\u5024\u3067\u4F7F\u3063\u3066\u3044\u305F\u3002\u30B9\u30CD\u30A2\u3068\u30CF\u30A4\u30CF\u30C3\u30C8\u304C
 * \u540C\u3058\u30C1\u30E3\u30F3\u30CD\u30EB\u3001\u30BF\u30E0\u3068\u30B7\u30F3\u30D0\u30EB\u3082\u540C\u3058\u30C1\u30E3\u30F3\u30CD\u30EB\u306A\u306E\u3067\u3001\u97F3\u7B26\u3054\u3068\u306B\u9AD8\u3055\u3092
 * \u5909\u3048\u308B\u3068\u7247\u65B9\u304C\u3082\u3046\u7247\u65B9\u3092\u62BC\u3057\u306E\u3051\u308B
 */
const DRUM = {
  bd:  { bit: 0x10, reg: 0x36, hi: 0 },
  sd:  { bit: 0x08, reg: 0x37, hi: 0 },
  hh:  { bit: 0x01, reg: 0x37, hi: 1 },
  tom: { bit: 0x04, reg: 0x38, hi: 1 },
  cym: { bit: 0x02, reg: 0x38, hi: 0 },
};

class OpllBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.chip = new OPLL();
    // \u30EC\u30B8\u30B9\u30BF\u306E\u8A18\u9332(log)\u3002\u66F8\u3044\u305F\u6642\u523B\u3068\u4E2D\u8EAB\u3092\u305D\u306E\u307E\u307E\u5916\u3078\u6D41\u3059\u3002
    // \u540C\u3058\u66F8\u304D\u8FBC\u307F\u3092\u30A8\u30DF\u30E5\u30EC\u30FC\u30BF\u3078\u6E21\u3057\u3066\u3001\u3053\u3061\u3089\u306E\u7FFB\u8A33\u304C\u6B63\u3057\u3044\u304B\u3092
    // \u8033\u3067\u78BA\u304B\u3081\u308B\u305F\u3081\u306E\u3082\u306E(VGM \u306B\u76F4\u3059)\u3002\u8A18\u9332\u3057\u306A\u3044\u3068\u304D\u306F\u4F55\u3082\u5909\u308F\u3089\u306A\u3044
    if (q.log) {
      const raw = this.chip.writeReg.bind(this.chip);
      this.logNow = 0;
      this.logBuf = [];
      this.chip.writeReg = (r, d) => { this.logBuf.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    // \u30C1\u30E3\u30F3\u30CD\u30EB\u3092 0 \u756A\u306B\u56FA\u5B9A\u3059\u308B(fixed)\u3002\u5B9F\u6A5F\u306E\u30C9\u30E9\u30A4\u30D0\u306F 1 \u30D1\u30FC\u30C8\u3092
    // 1 \u30C1\u30E3\u30F3\u30CD\u30EB\u306B\u56FA\u5B9A\u3059\u308B\u306E\u3067\u3001\u524D\u306E\u97F3\u306E\u4F59\u97FB\u306F\u6B21\u306E\u97F3\u3067\u5207\u308C\u308B\u3002
    // \u7A7A\u3044\u305F\u30C1\u30E3\u30F3\u30CD\u30EB\u3078\u56DE\u3059\u3044\u307E\u306E\u9CF4\u3089\u3057\u65B9\u3068\u805E\u304D\u6BD4\u3079\u308B\u305F\u3081\u306E\u8A66\u9A13\u7528\u3067\u3001
    // 1 \u30D1\u30FC\u30C8\u3060\u3051\u306E\u66F2\u306B\u3057\u304B\u4F7F\u3048\u306A\u3044(2026-09-27)
    this.fixed = !!q.fixed;
    this.step = RATE / sampleRate;   // \u51FA\u53E3 1 \u30B5\u30F3\u30D7\u30EB\u3042\u305F\u308A\u4F55\u56DE\u307E\u308F\u3059\u304B
    this.frac = 0;
    this.prev = 0;
    this.cur = 0;
    // 9 \u58F0\u3002\u3044\u3064\u307E\u3067\u9CF4\u3063\u3066\u3044\u308B\u304B\u3068\u3001\u3069\u306E\u97F3\u7B26\u304C\u4E57\u3063\u3066\u3044\u308B\u304B
    this.busy = new Float64Array(9);
    this.off = new Float64Array(9);
    // \u30EA\u30BA\u30E0\u3002\u5165\u308B\u3068\u4E0B 3 \u30C1\u30E3\u30F3\u30CD\u30EB\u304C\u6253\u697D\u5668\u306B\u306A\u308B\u306E\u3067\u3001\u97F3\u306E\u307B\u3046\u306F 6 \u672C\u306B\u306A\u308B
    this.rhythmOn = false;
    this.rbits = 0;
    this.rOff = { bd: 0, sd: 0, hh: 0, tom: 0, cym: 0 };
    // \u30D5\u30A7\u30FC\u30C9\u306E\u9014\u4E2D\u306E\u97F3\u3002\u9CF4\u3063\u3066\u3044\u308B\u3042\u3044\u3060\u306B\u97F3\u91CF\u30EC\u30B8\u30B9\u30BF\u3092\u66F8\u304D\u76F4\u3059\u4E26\u3073
    // ([[\u6642\u523B, v], \u2026])\u3068\u3001\u3069\u3053\u307E\u3067\u66F8\u3044\u305F\u304B\u3002\u58F0\u3092\u8B72\u3063\u305F\u3089\u6368\u3066\u308B
    this.vs = new Array(9).fill(null);
    this.rVs = {};
    this.fading = 0;
    // \u30DD\u30EB\u30BF\u30E1\u30F3\u30C8\u306E\u9014\u4E2D\u306E\u97F3\u3002\u9CF4\u3063\u3066\u3044\u308B\u3042\u3044\u3060\u306B\u97F3\u7A0B\u30EC\u30B8\u30B9\u30BF\u3092\u66F8\u304D\u76F4\u3059\u4E26\u3073
    // ([[\u6642\u523B, Hz], \u2026])\u3068\u3001\u3069\u3053\u307E\u3067\u66F8\u3044\u305F\u304B\u3002\u58F0\u3092\u8B72\u3063\u305F\u3089\u6368\u3066\u308B\u3002
    // \u5B9F\u6A5F\u306E\u30C9\u30E9\u30A4\u30D0\u3082\u540C\u3058\u3053\u3068\u3092\u3057\u3066\u3044\u305F(block \u3068 fnum \u3092\u66F8\u304D\u63DB\u3048\u308B)
    this.ps = new Array(9).fill(null);
    this.gliding = 0;
    this.port.onmessage = (e) => {
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  /** \u30EA\u30BA\u30E0\u306B\u5165\u308B\u3002\u4E0B 3 \u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u9AD8\u3055\u3092\u3001\u5B9F\u6A5F\u306E\u30C9\u30E9\u30A4\u30D0\u3068\u540C\u3058\u5024\u306B\u3059\u308B */
  startRhythm() {
    if (this.rhythmOn) return;
    this.rhythmOn = true;
    this.chip.writeReg(0x0e, 0x20);
    this.chip.writeReg(0x16, 0x20); this.chip.writeReg(0x26, 0x05);
    this.chip.writeReg(0x17, 0x50); this.chip.writeReg(0x27, 0x05);
    this.chip.writeReg(0x18, 0xc0); this.chip.writeReg(0x28, 0x01);
  }

  /** \u305D\u306E\u58F0\u306B\u3001\u97F3\u7A0B\u306E\u66F8\u304D\u76F4\u3057\u3092\u6301\u305F\u305B\u308B\u3002\u524D\u306E\u97F3\u306E\u3076\u3093\u306F\u6368\u3066\u308B */
  bend(ch, ps) {
    const had = this.ps[ch];
    const has = ps && ps.length ? { list: ps, at: 0 } : null;
    this.ps[ch] = has;
    this.gliding += (has ? 1 : 0) - (had ? 1 : 0);
  }

  /**
   * \u6642\u523B\u304C\u6765\u305F\u97F3\u7A0B\u306E\u66F8\u304D\u76F4\u3057\u3092\u3001\u30C1\u30C3\u30D7\u3078\u66F8\u304F\u3002
   *
   * **\u30AD\u30FC\u30AA\u30F3\u306E\u30D3\u30C3\u30C8\u306F\u89E6\u3089\u306A\u3044\u3002**\u97F3\u7A0B\u30EC\u30B8\u30B9\u30BF(0x20 \u53F0)\u306B\u306F\u9CF4\u3089\u3057\u59CB\u3081\u306E
   * \u30D3\u30C3\u30C8\u304C\u540C\u5C45\u3057\u3066\u3044\u308B\u306E\u3067\u3001\u3044\u307E\u7ACB\u3063\u3066\u3044\u308B\u3082\u306E\u3092\u305D\u306E\u307E\u307E\u6301\u3061\u8D8A\u3059\u3002
   * \u66F8\u304D\u76F4\u3059\u305F\u3073\u306B\u7ACB\u3066\u76F4\u3059\u3068\u3001\u97F3\u7B26\u306E\u9014\u4E2D\u3067\u9CF4\u3089\u3057\u76F4\u3057\u306B\u306A\u308B
   */
  glide(now) {
    for (let ch = 0; ch < 9; ch++) {
      const f = this.ps[ch];
      if (!f) continue;
      while (f.at < f.list.length && f.list[f.at][0] <= now) {
        const { blk, fnum } = pitchOf(f.list[f.at][1]);
        f.at++;
        // \u540C\u3058\u5024\u306A\u3089\u66F8\u304B\u306A\u3044\u3002\u6E21\u3063\u3066\u304F\u308B\u306E\u306F 1 \u30D5\u30EC\u30FC\u30E0\u305A\u3064\u306E\u9AD8\u3055\u3067\u3001
        // \u30EC\u30B8\u30B9\u30BF\u306E\u523B\u307F\u3088\u308A\u7D30\u304B\u3044\u3002\u6ED1\u308A\u304C\u9045\u3044\u3068\u3053\u308D\u306F\u540C\u3058\u5024\u304C\u7D9A\u304F
        const lo = fnum & 0xff;
        const hi = (this.chip.reg[0x20 + ch] & 0x30) | (blk << 1) | ((fnum >> 8) & 1);
        if (this.chip.reg[0x10 + ch] === lo && this.chip.reg[0x20 + ch] === hi) continue;
        this.chip.writeReg(0x10 + ch, lo);
        this.chip.writeReg(0x20 + ch, hi);
      }
      if (f.at >= f.list.length) { this.ps[ch] = null; this.gliding--; }
    }
  }

  /** \u305D\u306E\u58F0(\u6253\u697D\u5668\u306A\u3089\u540D\u524D)\u306B\u3001\u97F3\u91CF\u306E\u66F8\u304D\u76F4\u3057\u3092\u6301\u305F\u305B\u308B\u3002\u524D\u306E\u97F3\u306E\u3076\u3093\u306F\u6368\u3066\u308B */
  follow(key, vs) {
    const drum = typeof key === 'string';
    const had = drum ? this.rVs[key] : this.vs[key];
    const has = vs && vs.length ? { list: vs, at: 0 } : null;
    if (drum) this.rVs[key] = has; else this.vs[key] = has;
    this.fading += (has ? 1 : 0) - (had ? 1 : 0);
  }

  /** \u6642\u523B\u304C\u6765\u305F\u97F3\u91CF\u306E\u66F8\u304D\u76F4\u3057\u3092\u3001\u30C1\u30C3\u30D7\u3078\u66F8\u304F */
  fade(now) {
    const put = (f, write) => {
      while (f.at < f.list.length && f.list[f.at][0] <= now) {
        write(Math.max(0, Math.min(15, 15 - Math.round(f.list[f.at][1]))));
        f.at++;
      }
      return f.at >= f.list.length;
    };
    for (let ch = 0; ch < 9; ch++) {
      const f = this.vs[ch];
      if (!f) continue;
      const done = put(f, (att) => {
        this.chip.writeReg(0x30 + ch, (this.chip.reg[0x30 + ch] & 0xf0) | att);
      });
      if (done) { this.vs[ch] = null; this.fading--; }
    }
    for (const k in this.rVs) {
      const f = this.rVs[k];
      if (!f) continue;
      const d = DRUM[k];
      const done = put(f, (att) => {
        const cur = this.chip.reg[d.reg];
        this.chip.writeReg(d.reg, d.hi ? ((att << 4) | (cur & 15)) : ((cur & 0xf0) | att));
      });
      if (done) { this.rVs[k] = null; this.fading--; }
    }
  }

  /** \u3044\u3061\u3070\u3093\u53E4\u304F\u7A7A\u3044\u305F\u58F0\u3092\u9078\u3076\u3002\u5168\u90E8\u57CB\u307E\u3063\u3066\u3044\u308C\u3070\u3001\u3044\u3061\u3070\u3093\u65E9\u304F\u7D42\u308F\u308B\u3082\u306E */
  pick(now) {
    if (this.fixed) return 0;
    let best = -1, bestAt = Infinity;
    const top = this.rhythmOn ? 6 : 9;
    for (let ch = 0; ch < top; ch++) {
      if (this.busy[ch] <= now) return ch;
      if (this.busy[ch] < bestAt) { bestAt = this.busy[ch]; best = ch; }
    }
    return best;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    // **\u6642\u523B\u306F currentTime \u3067\u898B\u308B\u3002**\u97F3\u7B26\u306B\u8F09\u3063\u3066\u3044\u308B\u306E\u306F context \u306E\u7D76\u5BFE\u6642\u523B\u3067\u3001
    // \u81EA\u524D\u3067 0 \u304B\u3089\u6570\u3048\u308B\u3068\u3001\u9CF4\u308A\u306F\u3058\u3081\u304C context \u306E\u7D4C\u904E\u3076\u3093\u3060\u3051\u5148\u3078\u305A\u308C\u308B
    const base = currentTime;
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.logBuf) this.logNow = now;
      // **\u7D42\u308F\u308B\u97F3\u7B26\u3092\u3001\u59CB\u307E\u308B\u97F3\u7B26\u3088\u308A\u5148\u306B\u3002**\u540C\u3058\u6642\u523B\u306B\u524D\u306E\u97F3\u306E\u7D42\u308F\u308A\u3068
      // \u6B21\u306E\u97F3\u306E\u982D\u304C\u91CD\u306A\u308B\u3068(q8 \u3067\u7D9A\u3051\u3066\u9CF4\u3089\u3059\u3068\u304D)\u3001\u5148\u306B\u6B21\u306E\u97F3\u3092\u4E57\u305B\u305F
      // \u30C1\u30E3\u30F3\u30CD\u30EB\u306E off \u3092\u4E0A\u66F8\u304D\u3057\u3066\u3057\u307E\u3044\u3001\u30AD\u30FC\u30AA\u30D5\u304C\u4E00\u5EA6\u3082\u66F8\u304B\u308C\u306A\u304B\u3063\u305F\u3002
      // \u30AD\u30FC\u30AA\u30F3\u304C\u7ACB\u3063\u305F\u307E\u307E\u3060\u3068\u30C1\u30C3\u30D7\u306F\u7ACB\u3061\u4E0A\u3052\u76F4\u3055\u306A\u3044\u306E\u3067\u30012 \u97F3\u76EE\u304B\u3089\u306F
      // 1 \u97F3\u76EE\u306E\u4F59\u97FB\u306B\u306A\u308B\u3002\u6E1B\u8870\u306E\u901F\u3044\u97F3\u8272(\u30C1\u30A7\u30F3\u30D0\u30ED\u3001\u30B7\u30F3\u30BB\u30D9\u30FC\u30B9)\u304C
      // \u300C\u660E\u3089\u304B\u306B\u5C0F\u3055\u3044\u300D\u3068\u8A00\u308F\u308C\u3066\u3044\u305F\u306E\u306F\u3053\u308C(2026-09-27)
      // \u7D42\u308F\u308B\u6253\u697D\u5668
      if (this.rbits) {
        for (const k in DRUM) {
          if (this.rOff[k] > 0 && this.rOff[k] <= now) {
            this.rbits &= ~DRUM[k].bit;
            this.chip.writeReg(0x0e, 0x20 | this.rbits);
            this.rOff[k] = 0;
          }
        }
      }
      // \u30D5\u30A7\u30FC\u30C9\u306E\u9014\u4E2D\u306E\u97F3\u3002\u97F3\u91CF\u3060\u3051\u66F8\u304D\u76F4\u3059(\u30AD\u30FC\u30AA\u30F3\u306F\u3057\u76F4\u3055\u306A\u3044)
      if (this.fading) this.fade(now);
      if (this.gliding) this.glide(now);
      // \u7D42\u308F\u308B\u97F3\u7B26(\u30AD\u30FC\u30AA\u30D5)
      for (let ch = 0; ch < 9; ch++) {
        if (this.off[ch] > 0 && this.off[ch] <= now) {
          this.chip.writeReg(0x20 + ch, this.chip.reg[0x20 + ch] & ~0x10);
          this.off[ch] = 0;
        }
      }
      // \u59CB\u307E\u308B\u97F3\u7B26
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        const ev = this.events[this.at++];
        if (ev.drum) {
          const d = DRUM[ev.drum];
          this.startRhythm();
          const att = Math.max(0, Math.min(15, 15 - Math.round(ev.v)));
          const cur = this.chip.reg[d.reg];
          this.chip.writeReg(d.reg, d.hi ? ((att << 4) | (cur & 15)) : ((cur & 0xf0) | att));
          this.rbits |= d.bit;
          this.chip.writeReg(0x0e, 0x20 | this.rbits);
          this.rOff[ev.drum] = now + ev.dur;
          this.follow(ev.drum, ev.vs);
          continue;
        }
        // \u81EA\u5206\u3067\u4F5C\u3063\u305F\u97F3\u8272(0 \u756A)\u30028 \u30D0\u30A4\u30C8\u3092\u5148\u306B\u66F8\u304F\u3002\u5B9F\u6A5F\u306E\u30EC\u30B8\u30B9\u30BF\u306F 1 \u7D44\u3057\u304B
        // \u306A\u3044\u306E\u3067\u3001\u5225\u306E\u97F3\u8272\u304C\u6765\u308B\u305F\u3073\u306B\u66F8\u304D\u76F4\u3059(\u5B9F\u6A5F\u306E\u30C9\u30E9\u30A4\u30D0\u3068\u540C\u3058)\u3002
        // \u66F8\u304D\u76F4\u3059\u3068\u3001\u305D\u306E\u3068\u304D\u9CF4\u3063\u3066\u3044\u308B\u30E6\u30FC\u30B6\u30FC\u97F3\u8272\u306E\u97F3\u3082\u5909\u308F\u308B
        if (ev.voice) {
          for (let r = 0; r < 8; r++) {
            if (this.chip.reg[r] !== ev.voice[r]) this.chip.writeReg(r, ev.voice[r]);
          }
        }
        const ch = this.pick(now);
        // \u5168\u90E8\u57CB\u307E\u3063\u3066\u3044\u3066\u9CF4\u3063\u3066\u3044\u308B\u58F0\u3092\u53D6\u308B\u3068\u304D\u306F\u3001\u5148\u306B\u30AD\u30FC\u30AA\u30D5\u3092\u66F8\u304F\u3002
        // \u66F8\u304B\u306A\u3044\u3068\u30AD\u30FC\u30AA\u30F3\u304C\u7ACB\u3063\u305F\u307E\u307E\u3067\u3001\u7ACB\u3061\u4E0A\u3052\u76F4\u3057\u306B\u306A\u3089\u306A\u3044
        if (this.chip.reg[0x20 + ch] & 0x10) {
          this.chip.writeReg(0x20 + ch, this.chip.reg[0x20 + ch] & ~0x10);
        }
        const { blk, fnum } = pitchOf(ev.freq);
        this.chip.useSet(ch, ev.set | 0);
        const inst = Math.max(0, Math.min(15, ev.inst | 0));
        // \u97F3\u91CF\u30EC\u30B8\u30B9\u30BF\u306F\u6E1B\u8870\u306A\u306E\u3067\u3001v \u304C\u5927\u304D\u3044\u307B\u3069 0 \u306B\u8FD1\u3044
        const att = Math.max(0, Math.min(15, 15 - Math.round(ev.v)));
        this.chip.writeReg(0x30 + ch, (inst << 4) | att);
        this.chip.writeReg(0x10 + ch, fnum & 0xff);
        this.chip.writeReg(0x20 + ch, 0x10 | (blk << 1) | ((fnum >> 8) & 1));
        this.busy[ch] = now + ev.dur;
        this.off[ch] = now + ev.dur;
        this.follow(ch, ev.vs);
        this.bend(ch, ev.ps);
      }
      // \u30C1\u30C3\u30D7\u3092\u9032\u3081\u3066\u3001\u51FA\u53E3\u306E\u523B\u307F\u3078\u843D\u3068\u3059
      this.frac += this.step;
      while (this.frac >= 1) {
        this.prev = this.cur;
        this.cur = this.chip.tick();
        this.frac -= 1;
      }
      // **\u51FA\u53E3\u306E\u5272\u308A\u7B97\u3002**\u30C1\u30C3\u30D7\u306E\u751F\u306E\u5024\u306F int16 \u306E\u5E45\u3067\u51FA\u3066\u304F\u308B\u3002
      // \u97F3 6 \u672C + \u6253\u697D\u5668 5 \u3064\u3092\u5168\u90E8\u3044\u3061\u3070\u3093\u5927\u304D\u3044\u97F3\u91CF\u3067\u9CF4\u3089\u3059\u3068 16401 \u307E\u3067
      // \u884C\u304F\u306E\u3067\u3001\u305D\u3053\u304C\u3061\u3087\u3046\u3069 1.0 \u306B\u306A\u308B\u6570\u3092\u9078\u3093\u3060\u3002\u305D\u308C\u4EE5\u4E0A\u306F\u51FA\u53E3\u3067\u6F70\u308C\u308B
      out[i] = (this.prev + (this.cur - this.prev) * this.frac) / 16384;
    }
    if (this.logBuf && this.logBuf.length) {
      this.port.postMessage({ regs: this.logBuf });
      this.logBuf = [];
    }
    return true;
  }
}
registerProcessor('mmsxx-opll', OpllBank);
`;

  // ../../../tmp/panther-update/sound/opllpresets.js
  var OPLL_PRESETS = [
    [
      1,
      "opllViolin",
      "lead",
      "\u30D0\u30A4\u30AA\u30EA\u30F3\u3002\u7D30\u304F\u3066\u5F35\u308A\u304C\u3042\u308B",
      "Violin. Thin and taut."
    ],
    [
      2,
      "opllGuitar",
      "lead",
      "\u30AE\u30BF\u30FC\u3002\u306F\u3058\u3044\u305F\u3042\u3068\u901F\u304F\u843D\u3061\u308B",
      "Guitar. Plucked, and it drops away fast."
    ],
    [
      3,
      "opllPiano",
      "lead",
      "\u30D4\u30A2\u30CE\u3002MSX \u306E FM \u3067\u3044\u3061\u3070\u3093\u4F7F\u308F\u308C\u305F\u97F3",
      "Piano, and the one voice an MSX game was most likely to reach for."
    ],
    [
      4,
      "opllFlute",
      "lead",
      "\u30D5\u30EB\u30FC\u30C8\u3002\u67D4\u3089\u304B\u304F\u7ACB\u3061\u4E0A\u304C\u308B",
      "Flute. A soft start."
    ],
    [
      5,
      "opllClarinet",
      "lead",
      "\u30AF\u30E9\u30EA\u30CD\u30C3\u30C8\u3002\u6728\u7BA1\u3089\u3057\u3044\u5947\u6570\u500D\u97F3",
      "Clarinet, with the odd harmonics of a reed."
    ],
    [
      6,
      "opllOboe",
      "lead",
      "\u30AA\u30FC\u30DC\u30A8\u3002\u9F3B\u306B\u304B\u304B\u308B",
      "Oboe. Nasal and narrow."
    ],
    [
      7,
      "opllTrumpet",
      "lead",
      "\u30C8\u30E9\u30F3\u30DA\u30C3\u30C8\u3002\u524D\u306B\u51FA\u308B",
      "Trumpet. It cuts through."
    ],
    [
      8,
      "opllOrgan",
      "chord",
      "\u30AA\u30EB\u30AC\u30F3\u3002\u5207\u308B\u307E\u3067\u4F38\u3073\u308B",
      "Organ. It holds until you stop it."
    ],
    [
      9,
      "opllHorn",
      "chord",
      "\u30DB\u30EB\u30F3\u3002\u4E38\u304F\u3066\u5965\u306B\u3044\u308B",
      "Horn. Round, and it sits back."
    ],
    [
      10,
      "opllSynth",
      "lead",
      "\u30B7\u30F3\u30BB\u3002\u3053\u306E\u6642\u4EE3\u3089\u3057\u3044\u4F5C\u308A\u7269\u306E\u97F3",
      "Synthesizer, artificial in the way the era liked."
    ],
    [
      11,
      "opllHarpsichord",
      "lead",
      "\u30C1\u30A7\u30F3\u30D0\u30ED\u3002\u786C\u304F\u3066\u77ED\u3044",
      "Harpsichord. Hard and short."
    ],
    [
      12,
      "opllVibraphone",
      "lead",
      "\u30D3\u30D6\u30E9\u30D5\u30A9\u30F3\u3002\u63FA\u308C\u306A\u304C\u3089\u4F38\u3073\u308B",
      "Vibraphone, wavering as it rings on."
    ],
    [
      13,
      "opllSynthBass",
      "bass",
      "\u30B7\u30F3\u30BB\u30D9\u30FC\u30B9\u3002\u4F4E\u97F3\u306E\u5B9A\u756A",
      "Synth bass, the usual choice down low."
    ],
    [
      14,
      "opllAcousticBass",
      "bass",
      "\u30A2\u30B3\u30FC\u30B9\u30C6\u30A3\u30C3\u30AF\u30D9\u30FC\u30B9\u3002\u6307\u3067\u5F3E\u3044\u305F\u4F4E\u97F3",
      "Acoustic bass, plucked."
    ],
    [
      15,
      "opllElectricGuitar",
      "lead",
      "\u30A8\u30EC\u30AD\u30AE\u30BF\u30FC\u3002\u786C\u3081\u306E\u30A2\u30BF\u30C3\u30AF",
      "Electric guitar, with a harder attack."
    ]
  ];
  var OPLLP_PRESETS = [
    [1, "opllpStrings", "lead", "\u30A8\u30EC\u30AD\u30B9\u30C8\u30EA\u30F3\u30B0\u30B9", "Electric strings."],
    [2, "opllpBowWow", "lead", "\u30D0\u30A6\u30EF\u30A6\u3002\u3046\u306A\u308B", "Bow wow, and it growls."],
    [3, "opllpGuitar", "lead", "\u30A8\u30EC\u30AD\u30AE\u30BF\u30FC", "Electric guitar."],
    [4, "opllpOrgan", "chord", "\u30AA\u30EB\u30AC\u30F3", "Organ."],
    [6, "opllpSax", "lead", "\u30B5\u30C3\u30AF\u30B9", "Saxophone."],
    [7, "opllpTrumpet", "lead", "\u30C8\u30E9\u30F3\u30DA\u30C3\u30C8", "Trumpet."],
    [8, "opllpStreetOrgan", "chord", "\u30B9\u30C8\u30EA\u30FC\u30C8\u30AA\u30EB\u30AC\u30F3", "Street organ."],
    [9, "opllpSynthBrass", "lead", "\u30B7\u30F3\u30BB\u30D6\u30E9\u30B9", "Synth brass."],
    [10, "opllpEPiano", "lead", "\u30A8\u30EC\u30D4", "Electric piano."],
    [11, "opllpBass", "bass", "\u30D9\u30FC\u30B9", "Bass."],
    [13, "opllpChimes", "lead", "\u30C1\u30E3\u30A4\u30E0", "Chimes."],
    [14, "opllpTomTom", "perc", "\u30BF\u30E0\u30BF\u30E0 2", "Tom tom II."],
    [15, "opllpNoise", "noise", "\u30CE\u30A4\u30BA", "Noise."]
  ];
  var VRC7_PRESETS = [
    [1, "vrc7BuzzyBell", "lead", "\u30D0\u30B8\u30FC\u30D9\u30EB\u3002\u6FC1\u3063\u305F\u9418", "Buzzy bell, a bell with grit in it."],
    [2, "vrc7Guitar", "lead", "\u30AE\u30BF\u30FC", "Guitar."],
    [3, "vrc7Wurly", "lead", "\u30A6\u30FC\u30EA\u30C3\u30C4\u30A1\u30FC\u3002\u96FB\u6C17\u30D4\u30A2\u30CE", "Wurlitzer electric piano."],
    [4, "vrc7Flute", "lead", "\u30D5\u30EB\u30FC\u30C8", "Flute."],
    [6, "vrc7Synth", "lead", "\u30B7\u30F3\u30BB", "Synth."],
    [8, "vrc7Organ", "chord", "\u30AA\u30EB\u30AC\u30F3", "Organ."],
    [9, "vrc7Bells", "lead", "\u30D9\u30EB", "Bells."],
    [10, "vrc7Vibes", "lead", "\u30D0\u30A4\u30D6\u30B9", "Vibes."],
    [11, "vrc7Vibraphone", "lead", "\u30D3\u30D6\u30E9\u30D5\u30A9\u30F3", "Vibraphone."],
    [12, "vrc7Tutti", "chord", "\u30C8\u30A5\u30C3\u30C6\u30A3\u3002\u5408\u594F", "Tutti, the whole band at once."],
    [13, "vrc7Fretless", "bass", "\u30D5\u30EC\u30C3\u30C8\u30EC\u30B9\u30D9\u30FC\u30B9", "Fretless bass."],
    [14, "vrc7SynthBass", "bass", "\u30B7\u30F3\u30BB\u30D9\u30FC\u30B9", "Synth bass."],
    [15, "vrc7Sweep", "lead", "\u30B9\u30A4\u30FC\u30D7", "Sweep."]
  ];
  var OPLL_ALIASES = {
    opllClarinet: ["opllpClarinet", "vrc7Clarinet"],
    // 3 組とも同じ
    opllTrumpet: ["vrc7Trumpet"],
    // YM2413 と VRC7 が同じ
    opllVibraphone: ["opllpVibraphone"]
    // YM2413 と YMF281B が同じ
  };
  var OPLL_DRUMS = [
    [
      "bd",
      "opllKick",
      "\u30D0\u30B9\u30C9\u30E9\u30022 \u30AA\u30DA\u3092\u4E21\u65B9\u4F7F\u3046\u3001\u3044\u3061\u3070\u3093\u539A\u3044\u6253\u697D\u5668",
      "Bass drum, the only one that gets both operators."
    ],
    [
      "sd",
      "opllSnare",
      "\u30B9\u30CD\u30A2\u3002\u30CE\u30A4\u30BA\u3068\u77E9\u5F62\u306E\u7D44\u307F\u5408\u308F\u305B",
      "Snare, noise crossed with a square."
    ],
    [
      "hh",
      "opllHat",
      "\u30CF\u30A4\u30CF\u30C3\u30C8\u3002\u91D1\u7269\u306E\u77ED\u3044\u30CE\u30A4\u30BA",
      "Hi-hat, built from the short metallic noise."
    ],
    [
      "tom",
      "opllTom",
      "\u30BF\u30E0\u3002\u7D20\u306E\u30B5\u30A4\u30F3\u6CE2\u306B\u8FD1\u3044",
      "Tom, close to a plain sine."
    ],
    [
      "cym",
      "opllCymbal",
      "\u30B7\u30F3\u30D0\u30EB\u3002\u30CF\u30A4\u30CF\u30C3\u30C8\u3068\u4F4D\u76F8\u3092\u5206\u3051\u5408\u3046",
      "Cymbal, sharing its phase with the hi-hat."
    ]
  ];
  function registerOPLLPresets() {
    for (const [inst, name, role, noteJa, note] of OPLL_PRESETS) {
      try {
        registerOPLL(name, inst, {
          role,
          noteJa: `${noteJa}\u3002YM2413 \u306E ${inst} \u756A`,
          note,
          alias: OPLL_ALIASES[name]
        });
      } catch (e) {
      }
    }
    for (const [set, list] of [[2, OPLLP_PRESETS], [1, VRC7_PRESETS]]) {
      for (const [inst, name, role, noteJa, note] of list) {
        try {
          registerOPLL(name, inst, { role, set, noteJa, note });
        } catch (e) {
        }
      }
    }
    for (const [drum, name, noteJa, note] of OPLL_DRUMS) {
      try {
        registerOPLL(name, 16, {
          role: "perc",
          drum,
          noteJa: `${noteJa}\u3002\u4F7F\u3046\u3068\u97F3\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u304C 9 \u672C\u304B\u3089 6 \u672C\u306B\u6E1B\u308B`,
          note
        });
      } catch (e) {
      }
    }
  }

  // ../../../tmp/panther-update/sound/duty.js
  var DUTY_CODE = `
const FRAME = ${TONE_FRAME};

// **\u6BB5\u5DEE\u3092\u4E38\u3081\u308B(PolyBLEP)\u3002** \u77E9\u5F62\u6CE2\u3092\u305D\u306E\u307E\u307E\u66F8\u304F\u3068\u3001\u4E0A\u304C\u308A\u4E0B\u304C\u308A\u306E
// \u6BB5\u304C 1 \u30B5\u30F3\u30D7\u30EB\u3067\u8D77\u304D\u308B\u306E\u3067\u3001\u5B9F\u969B\u306B\u306F\u51FA\u3066\u3044\u306A\u3044\u9AD8\u3044\u97F3\u307E\u3067\u9CF4\u308B(\u6298\u308A\u8FD4\u3057\u96D1\u97F3)\u3002
// \u6BB5\u306E\u524D\u5F8C 1 \u30B5\u30F3\u30D7\u30EB\u3076\u3093\u3060\u3051\u591A\u9805\u5F0F\u3067\u5BC4\u305B\u308B\u3068\u3001\u805E\u3053\u3048\u308B\u7BC4\u56F2\u306F\u307B\u307C\u6D88\u3048\u308B\u3002
// \u4F5C\u308A\u3064\u3051\u306E\u767A\u632F\u5668\u306F\u500D\u97F3\u3092 64 \u672C\u4E26\u3079\u3066\u540C\u3058\u3053\u3068\u3092\u3057\u3066\u3044\u308B
const poly = (t, dt) => {
  if (t < dt) { const x = t / dt; return x + x - x * x - 1; }
  if (t > 1 - dt) { const x = (t - 1) / dt; return x * x + x + x + 1; }
  return 0;
};

class DutyBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.max = q.voices || 16;
    this.voices = [];
    // **\u3042\u3068\u304B\u3089\u8DB3\u305B\u308B\u3088\u3046\u306B\u3059\u308B\u3002**\u5B9F\u6642\u9593\u306E\u518D\u751F\u306F\u5148\u8AAD\u307F\u3067\u5C11\u3057\u305A\u3064\u7A4D\u3080\u306E\u3067\u3001
    // \u4F5C\u308B\u3068\u304D\u306B\u5168\u90E8\u306F\u6E21\u305B\u306A\u3044\u3002\u7A4D\u3080\u7BC4\u56F2\u306F\u5FC5\u305A\u524D\u3078\u9032\u3080\u306E\u3067\u3001
    // **\u4E26\u3079\u66FF\u3048\u6E08\u307F\u306E\u675F\u3092\u5F8C\u308D\u3078\u8DB3\u3059\u3060\u3051**\u3067\u5168\u4F53\u306E\u9806\u756A\u306F\u4FDD\u305F\u308C\u308B
    this.port.onmessage = (e) => {
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  start(ev) {
    if (this.voices.length >= this.max) this.voices.shift();   // \u3044\u3061\u3070\u3093\u53E4\u3044\u306E\u3092\u8B72\u308B
    this.voices.push({
      fr: ev.fr, du: ev.du, gv: ev.gv || null, env: ev.env || null,
      // \u30D5\u30A7\u30FC\u30C9\u306E\u9014\u4E2D\u306E\u97F3\u30021 \u30D5\u30EC\u30FC\u30E0\u305A\u3064\u306E\u639B\u3051\u7387(\u9CF4\u3089\u3059\u5074\u304C\u6570\u306B\u3057\u3066\u6E21\u3059)
      fv: ev.fv || null,
      t0: ev.t, len: ev.dur, vol: ev.vol,
      // \u97F3\u91CF\u306E\u8868\u304C\u3042\u308B\u3068\u304D\u3001**\u6700\u5F8C\u306E\u6BB5\u304B\u3089 0 \u3078\u843D\u3068\u3059**\u3002
      // \u4F5C\u308A\u3064\u3051\u306E\u9053(_applyTone)\u304C linearRampToValueAtTime \u3067\u3084\u3063\u3066\u3044\u308B\u306E\u3068\u540C\u3058
      last: ev.gv ? (ev.gv.length - 1) * FRAME : 0,
      ph: 0, done: false,
    });
  }

  render(v, t, sr) {
    const x = t - v.t0;
    if (x >= v.len) { v.done = true; return 0; }
    let i = Math.floor(x / FRAME);
    if (i < 0) i = 0;
    const end = v.fr.length - 1;
    if (i > end) i = end;

    const f = v.fr[i];
    const d = v.du[i];
    const dt = f / sr;             // 1 \u30B5\u30F3\u30D7\u30EB\u3067\u4F55\u56DE\u8EE2\u3076\u3093\u9032\u3080\u304B
    const ph = v.ph;

    // **\u5E45 d \u306E\u77E9\u5F62\u6CE2\u3002**\u4E0A\u304C\u308A(\u4F4D\u76F8 0)\u3068\u4E0B\u304C\u308A(\u4F4D\u76F8 d)\u306E 2 \u304B\u6240\u306B\u6BB5\u304C\u3042\u308B
    let s = ph < d ? 1 : -1;
    s += poly(ph, dt);
    let q = ph + 1 - d;
    if (q >= 1) q -= 1;
    s -= poly(q, dt);
    // **\u76F4\u6D41\u3092\u629C\u304F\u3002**\u5E45\u304C 0.5 \u3067\u306A\u3044\u3068\u5E73\u5747\u304C 0 \u304B\u3089\u305A\u308C\u3001
    // \u5E45\u3092\u52D5\u304B\u3059\u305F\u3073\u306B\u6CE2\u5168\u4F53\u304C\u4E0A\u4E0B\u3057\u3066**\u30DC\u30B3\u30C3\u3068\u9CF4\u308B**
    s -= 2 * d - 1;
    // \u3053\u3053\u3067\u5272\u3063\u3066\u5C71\u3092\u5747\u3055\u306A\u3044\u3002**\u5B9F\u6A5F(2A03)\u306B\u5408\u308F\u305B\u308B\u3002**
    // \u30D5\u30A1\u30DF\u30B3\u30F3\u306E\u77E9\u5F62\u6CE2\u306F\u5E45\u304C\u5909\u308F\u3063\u3066\u3082 0 \u3068\u97F3\u91CF\u5024\u306E\u9593\u3092\u884C\u304D\u6765\u3059\u308B\u3060\u3051\u306A\u306E\u3067\u3001
    // **\u4E0A\u4E0B\u306E\u632F\u308C\u5E45\u306F\u5909\u308F\u3089\u306A\u3044**\u3002\u5909\u308F\u308B\u306E\u306F\u5E73\u5747\u306E\u529B\u3067\u3001\u7D30\u3044\u307B\u3069\u9759\u304B\u306B\u306A\u308B
    // (50% \u3092 0 \u3068\u3059\u308B\u3068 25% \u3067 \u22121.2 dB\u300112.5% \u3067 \u22123.6 dB)\u3002
    // \u5E45 0.5 \u306E\u3068\u304D\u306F\u4F5C\u308A\u3064\u3051\u306E\u77E9\u5F62\u6CE2\u3068\u3074\u3063\u305F\u308A\u540C\u3058\u632F\u308C\u5E45\u306B\u306A\u308B\u3002
    //
    // \u5747\u3059\u3068\u5C71\u306F\u305D\u308D\u3046\u304C\u3001**\u7D30\u3044\u3068\u304D\u306E\u843D\u3061\u65B9\u304C\u5B9F\u6A5F\u306E\u500D\u4EE5\u4E0A**\u306B\u306A\u308B
    // (12.5% \u3067 \u22128.5 dB)\u3002\u5E45\u3092\u52D5\u304B\u3057\u305F\u3068\u304D\u306B\u97F3\u91CF\u304C\u52D5\u304D\u3059\u304E\u3066\u3001
    // \u5E45\u306E\u5909\u5316\u3067\u306F\u306A\u304F\u97F3\u91CF\u306E\u5909\u5316\u306B\u805E\u3053\u3048\u3066\u3057\u307E\u3046

    let nph = ph + dt;
    if (nph >= 1) nph -= 1;
    v.ph = nph;

    // \u97F3\u91CF\u3002\u8868\u304C\u3042\u308C\u3070\u305D\u3061\u3089\u3001\u7121\u3051\u308C\u3070\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7(\u5F62\u306F\u9CF4\u3089\u3059\u5074\u304C\u79D2\u3067\u6E21\u3057\u3066\u3044\u308B)
    let g;
    if (v.gv) {
      g = v.gv[i];
      if (x > v.last) g *= (v.len - x) / Math.max(1e-6, v.len - v.last);
    } else {
      const e = v.env;
      if (!e) g = 1;
      else if (x < e.a) g = e.a > 0 ? x / e.a : 1;
      else if (x < e.a + e.d) g = 1 + (e.s - 1) * (x - e.a) / e.d;
      else if (x < e.hold) g = e.d > 0 ? e.s : 1;
      else {
        const top = e.d > 0 ? e.s : 1;
        g = top * (v.len - x) / Math.max(1e-6, v.len - e.hold);
      }
      if (g < 0) g = 0;
    }
    if (v.fv) g *= v.fv[Math.min(i, v.fv.length - 1)];
    return s * g * v.vol;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const base = currentTime;
    const sr = sampleRate;
    const vs = this.voices;
    let dead = false;
    for (let i = 0; i < out.length; i++) {
      const t = base + i / sr;
      while (this.at < this.events.length && this.events[this.at].t <= t) {
        this.start(this.events[this.at++]);
      }
      let s = 0;
      for (let k = 0; k < vs.length; k++) {
        const v = vs[k];
        s += this.render(v, t, sr);
        if (v.done) dead = true;
      }
      out[i] = s;
    }
    // **\u7247\u3065\u3051\u306F\u8981\u308B\u3068\u304D\u3060\u3051\u3002** \u6BCE\u30D6\u30ED\u30C3\u30AF filter \u3059\u308B\u3068\u914D\u5217\u3092\u4F5C\u308A\u7D9A\u3051\u308B
    if (dead) this.voices = vs.filter((v) => !v.done);
    return true;
  }
}
registerProcessor('mmsxx-duty', DutyBank);
`;
  var clampDuty = (d) => {
    const x = Number(d);
    if (!Number.isFinite(x)) return 0.5;
    return Math.min(0.98, Math.max(0.02, x));
  };

  // ../../../tmp/panther-update/sound/demotunes.js
  var SE_SYS_PAUSE = "sys.pause";
  var SYSTEM_SE = {
    [SE_SYS_PAUSE]: [
      "@{pulse(50)} @e{piano} @s{8,6} q6 t200 v12 o5 l16 e4.",
      "@{pulse(50)} @e{piano} @s{8,6} q6 t200 v10 o5 l16 r g4.",
      "@{pulse(50)} @e{piano} @s{8,7} q6 t200 v8  o5 l16 r r > c4."
    ]
  };
  var wrap = (bars, per = 2) => {
    const out = [];
    for (let i = 0; i < bars.length; i += per) out.push(bars.slice(i, i + per).join(" "));
    return out.join("\n");
  };
  var BEAT_BUNDLES = [
    "#bundle beatBass1  = @{wtRamp} @e{piano} @s{8,2}",
    "#bundle beatBass2  = @{triangle} @e{flat}",
    "#bundle beatKick   = @{opllKick} @e{percussive},   @{noise} v11 @e{snap}",
    "#bundle beatSnare  = @{opllSnare} @e{percussive},  @{noise} v8 @o+1 @e{snap}",
    "#bundle beatHat    = @{opllCymbal} @e{percussive}",
    "#bundle beatHatAir = @{opllCymbal} @e{percussive}, @{noise} v3 @e{percussive}",
    "#bundle beatTom    = @{opllTom} @e{percussive}",
    "#bundle beatPulse  = @{pulse(12)} @e{percussive}",
    "#bundle beatBrass  = @{opllTrumpet} @e{soft}",
    "#bundle beatHorn   = @{opllHorn} @e{soft}"
  ].join("\n");
  var BEAT_BASS = wrap([
    "o2 d a o3 d o2 a f a d o3 c",
    "o2 d a o3 d o2 a f a d o3 c",
    "o2 b- f o3 b- o2 f d f b- a",
    "o2 c g o3 c o2 g e g c b-",
    "o2 d a o3 d o2 a f a d o3 c",
    "o2 d a o3 d o2 a f a d o3 c",
    "o2 g d g d b- d g f",
    "o2 a e a e o3 c o2 e a g"
  ]);
  var BEAT_ROOT = wrap([
    "o2 d1",
    "o2 d1",
    "o2 b-1",
    "o2 c1",
    "o2 d1",
    "o2 d1",
    "o2 g1",
    "o2 a1"
  ], 4);
  var BEAT_KICK_A = "c8 r8 r8 c16 r16 c8 r8 r4";
  var BEAT_KICK_B = "c8 r8 c16 r16 r8 c8 r8 c8 r8";
  var BEAT_KICK = wrap([
    BEAT_KICK_A,
    BEAT_KICK_A,
    BEAT_KICK_A,
    BEAT_KICK_B,
    BEAT_KICK_A,
    BEAT_KICK_A,
    BEAT_KICK_A,
    BEAT_KICK_B
  ]);
  var BEAT_SNARE_A = "r4 c8 r8 r4 c8 r8";
  var BEAT_SNARE_B = "r4 c8 r8 r4 c16 c16 c16 c16";
  var BEAT_SNARE = wrap([
    BEAT_SNARE_A,
    BEAT_SNARE_A,
    BEAT_SNARE_A,
    BEAT_SNARE_A,
    BEAT_SNARE_A,
    BEAT_SNARE_A,
    BEAT_SNARE_A,
    BEAT_SNARE_B
  ]);
  var BEAT_HAT_MACROS = [
    "$h = { @{beatHat} c8 }",
    "$a = { @{beatHatAir} c8 }"
  ].join("\n");
  var BEAT_HAT_A = "$h $a $h $h $h $a $h $a";
  var BEAT_HAT = wrap(new Array(8).fill(BEAT_HAT_A));
  var BEAT_TOM_FILL = "r2 c16 c16 o3 c16 c16 o4 c8 o3 c8";
  var BEAT_TOM = wrap([
    "r1",
    "r1",
    "r1",
    BEAT_TOM_FILL,
    "r1",
    "r1",
    "r1",
    BEAT_TOM_FILL
  ]);

  // ../../../tmp/panther-update/sound/se.js
  var SE_FRAME = 1 / 60;
  var SE_WHOLE = 64;
  var SE_TEMPO = Math.round(240 / (SE_WHOLE * SE_FRAME));
  var SEMI2 = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  function parseSENotes(spec, base = 0) {
    const src = String(spec || "").toLowerCase();
    const out = [];
    let oct = 4;
    for (let i = 0; i < src.length; ) {
      const ch = src[i];
      if (" 	\n\r|,".includes(ch)) {
        i++;
        continue;
      }
      if (ch === ">") {
        oct++;
        i++;
        continue;
      }
      if (ch === "<") {
        oct--;
        i++;
        continue;
      }
      if (ch === "o") {
        i++;
        let n2 = "";
        while (i < src.length && src[i] >= "0" && src[i] <= "9") n2 += src[i++];
        if (n2 !== "") oct = parseInt(n2, 10);
        continue;
      }
      const rest = ch === "r";
      if (!rest && SEMI2[ch] === void 0) {
        console.warn(`[ChpTnSnd] SE: \u97F3\u540D\u3068\u3057\u3066\u8AAD\u3081\u306A\u3044\u5B57 "${ch}" \u306F\u8AAD\u307F\u98DB\u3070\u3057\u307E\u3059 (${spec})`);
        i++;
        continue;
      }
      i++;
      let semi = rest ? 0 : SEMI2[ch] + (oct - 4) * 12 - base;
      while (i < src.length && "+#-".includes(src[i])) semi += src[i++] === "-" ? -1 : 1;
      let n = "";
      while (i < src.length && src[i] >= "0" && src[i] <= "9") n += src[i++];
      const len = n === "" ? 1 : Math.max(1, parseInt(n, 10));
      let frames = SE_WHOLE / len;
      let dot = frames;
      while (src[i] === ".") {
        i++;
        dot /= 2;
        frames += dot;
      }
      out.push({ semi, sec: frames * SE_FRAME, rest });
    }
    return out;
  }
  function parseSEBase(spec) {
    const s = spec === true ? "c1" : String(spec || "c1").toLowerCase().trim();
    const got = /^([a-g])([+#-]*)(\d*)/.exec(s);
    if (!got) {
      console.warn(`[ChpTnSnd] SE: \u672C\u4F53\u306E\u9AD8\u3055 "${spec}" \u304C\u8AAD\u3081\u306A\u3044\u306E\u3067 c1 \u3068\u307F\u306A\u3057\u307E\u3059`);
      return { semi: 0, len: 1 };
    }
    let semi = SEMI2[got[1]];
    for (const c of got[2]) semi += c === "-" ? -1 : 1;
    return { semi, len: got[3] === "" ? 1 : parseInt(got[3], 10) };
  }
  var scaleVol = (v, mul) => Math.max(0, Math.min(15, Math.round(v * mul)));
  function sliceSE(tracks, notes, vol) {
    const mul = vol == null ? null : Math.max(0, Math.min(15, vol)) / 15;
    return tracks.map((t) => {
      const events = [];
      let at = 0;
      for (const n of notes) {
        if (!n.rest) {
          const ratio = Math.pow(2, n.semi / 12);
          for (const ev of t.events) {
            if (ev.t >= n.sec - 1e-9) break;
            const room = n.sec - ev.t;
            events.push({
              ...ev,
              t: at + ev.t,
              dur: Math.min(ev.dur, room),
              gate: Math.min(ev.gate, room),
              freq: ev.freq * ratio,
              vol: mul == null ? ev.vol : scaleVol(ev.vol, mul)
            });
          }
        }
        at += n.sec;
      }
      return {
        events,
        total: at,
        noise: events.some((e) => (WAVEFORMS[e.wave] || {}).kind === "noise"),
        ch: t.ch
      };
    });
  }
  var SE_PRESETS = {
    // いちばん素直な点。切る長さがそのまま音の長さになる
    seBeep: {
      noteJa: "\u4F55\u3082\u7D30\u5DE5\u3057\u3066\u3044\u306A\u3044\u97F3\u3002\u66F8\u3044\u305F\u9577\u3055\u306E\u3076\u3093\u3060\u3051\u9CF4\u308B\u3002\u307E\u305A\u624B\u306B\u53D6\u308B\u3082\u306E",
      note: "A plain tone with no shaping. Whatever length you ask for is what you get \u2014 the simplest thing to reach for.",
      mml: "@{pulse(50)} @e{flat} v12 o5 c1"
    },
    // 落ちる。tones.js の高さの表がフレームで刻むので、切っても途中まで落ちている
    seShot: {
      noteJa: "7 \u30D5\u30EC\u30FC\u30E0\u3067 1 \u30AA\u30AF\u30BF\u30FC\u30D6\u843D\u3061\u308B\u3002\u6483\u3063\u305F\u97F3\u3084\u8EFD\u304F\u5F53\u305F\u3063\u305F\u97F3\u306B\u805E\u3053\u3048\u308B\u3002\u77ED\u304F\u5207\u3063\u3066\u3082\u5206\u304B\u308B",
      note: "Pitch falls one octave over seven frames. Reads as a shot or a small hit; still recognisable when cut short.",
      mml: "@{seFall} v13 o5 c1"
    },
    // 当たり。ノイズなので高さは効きにくいが、**低いほど重く**は聞こえる
    seHit: {
      noteJa: "\u30CE\u30A4\u30BA\u3092\u6253\u697D\u5668\u306E\u5F62\u3067\u9CF4\u3089\u3059\u3002\u4F4E\u3044\u97F3\u307B\u3069\u91CD\u304F\u5F53\u305F\u3063\u305F\u3088\u3046\u306B\u805E\u3053\u3048\u308B",
      note: "Noise with a percussive envelope. Lower notes read as heavier impacts.",
      mml: "@{noise} @e{percussive} v14 o4 c1"
    },
    // 取った。頭に短い下の音を置いて、上の音へ跳ねる
    seCoin: {
      noteJa: "\u4F4E\u304F\u77ED\u3044\u97F3\u304B\u3089\u3001\u9AD8\u3044\u97F3\u3078\u8DF3\u3093\u3067\u4F38\u3070\u3059\u3002\u7269\u3092\u62FE\u3046\u97F3",
      note: "A short low blip jumping to a held higher note. The pick-up sound.",
      mml: "@{pulse(25)} @e{flat} v13 o5 l16 g l1 > c"
    },
    // 跳ぶ。1 フレームずつ駆け上がる
    seJump: {
      noteJa: "1 \u30D5\u30EC\u30FC\u30E0\u306B 1 \u97F3\u305A\u3064\u97F3\u968E\u3092\u99C6\u3051\u4E0A\u304C\u3063\u3066\u3001\u305D\u3053\u3067\u6B62\u307E\u308B\u3002\u8DF3\u3093\u3060\u97F3\u3084\u3001\u4E0A\u304C\u3063\u3066\u3044\u304F\u77E5\u3089\u305B",
      note: "Runs up the scale one frame per note, then holds. Reads as a jump or a rising alert.",
      mml: "@{pulse(12)} @e{flat} v12 o4 l64 cdefgab>cdefgab>cdefgab> l1 c"
    },
    // 力。`cde>` の繰り返し。8 ビット機の効果音でよく聞いた形
    sePower: {
      noteJa: "cde> \u3092 1 \u30D5\u30EC\u30FC\u30E0\u306B 1 \u97F3\u305A\u3064\u7E70\u308A\u8FD4\u3057\u3066\u3001\u3053\u3060\u307E\u3092\u4ED8\u3051\u305F\u3082\u306E\u30028 \u30D3\u30C3\u30C8\u306E\u30A2\u30AF\u30B7\u30E7\u30F3\u3067\u3069\u3053\u3067\u3082\u805E\u3044\u305F\u99C6\u3051\u4E0A\u304C\u308A",
      note: "cde> repeated one frame per note, with echo. The ladder heard all over 8-bit action games.",
      mml: "@{pulse(12)} @e{flat} @s3 v12 o3 l64 [cde>]16"
    },
    // 駄目。低いところで濁らせる
    seError: {
      noteJa: "\u4F4E\u3044\u77E9\u5F62\u6CE2\u3092\u5F37\u304F\u305A\u3089\u3057\u3066\u91CD\u306D\u3066\u3042\u308B\u306E\u3067\u3001\u81EA\u5206\u3068\u5538\u308B\u3002\u65AD\u3089\u308C\u305F\u611F\u3058",
      note: "Low pulse with heavy detune, so it beats against itself. Reads as a refusal.",
      mml: "@{pulse(50)} @e{flat} @d24 v13 o3 c1"
    },
    // 出る / 消える。細かく震えながら上がる
    seWarp: {
      noteJa: "1 \u30D5\u30EC\u30FC\u30E0\u3054\u3068\u306B\u534A\u97F3\u3092\u884C\u304D\u6765\u3059\u308B\u3002\u97F3\u7A0B\u3068\u3057\u3066\u3067\u306F\u306A\u304F\u3001\u63FA\u3089\u3081\u304D\u3068\u3057\u3066\u805E\u3053\u3048\u308B\u3002\u73FE\u308C\u308B\u30FB\u6D88\u3048\u308B",
      note: "Alternates between two semitones every frame, which shimmers rather than plays a pitch. Appearing and disappearing.",
      mml: "@{pulse(12)} @e{flat} @s4 v11 o3 l64 [c+c]32"
    }
  };

  // ../../../tmp/panther-update/sound/layerpresets.js
  var DETUNE_STEPS = [
    { key: "", value: "none", c: 0, en: "no detune" },
    {
      key: "Soft",
      value: "soft",
      c: 8,
      alone: "8 \u30BB\u30F3\u30C8\u305A\u3089\u3057\u3066\u91CD\u306D\u305F\u3082\u306E",
      lead: "8 \u30BB\u30F3\u30C8\u305A\u3089\u3057\u305F\u3046\u3048\u3067",
      tail: "\u3046\u306D\u308A\u304C\u3086\u3063\u304F\u308A\u3067\u3001\u539A\u307F\u3060\u3051\u304C\u4ED8\u304F",
      en: "eight cents apart, slow enough that the beating reads as body and nothing else"
    },
    {
      key: "Wide",
      value: "wide",
      c: 20,
      alone: "20 \u30BB\u30F3\u30C8\u305A\u3089\u3057\u3066\u91CD\u306D\u305F\u3082\u306E",
      lead: "20 \u30BB\u30F3\u30C8\u305A\u3089\u3057\u305F\u3046\u3048\u3067",
      tail: "\u3046\u306D\u308A\u304C\u805E\u304D\u53D6\u308C\u3066\u30012 \u672C\u9CF4\u3063\u3066\u3044\u308B\u3068\u5206\u304B\u308B",
      en: "twenty cents apart, close enough to hear the beating and tell there are two of them"
    }
  ];
  var ECHO_STEPS = [
    { key: "", value: "none", f: 0, en: "no delayed copy" },
    {
      key: "Near",
      value: "near",
      f: 7,
      alone: "7 \u30D5\u30EC\u30FC\u30E0(0.12 \u79D2)\u9045\u3089\u305B\u3066\u5C0F\u3055\u304F\u91CD\u306D\u305F\u3082\u306E",
      mid: "7 \u30D5\u30EC\u30FC\u30E0(0.12 \u79D2)\u9045\u3089\u305B\u305F\u3082\u306E",
      tail: "\u58F0\u304C 1 \u672C\u3057\u304B\u306A\u3044\u3068\u3053\u308D\u306B\u7F6E\u304F\u3068\u3001\u305D\u308C\u3060\u3051\u3067\u5E83\u304F\u805E\u3053\u3048\u308B",
      en: "a quieter copy seven frames (0.12s) behind \u2014 on a part with nobody beside it, this alone opens up the space"
    },
    {
      key: "Far",
      value: "far",
      f: 12,
      alone: "12 \u30D5\u30EC\u30FC\u30E0(0.2 \u79D2)\u9045\u3089\u305B\u3066\u5C0F\u3055\u304F\u91CD\u306D\u305F\u3082\u306E",
      mid: "12 \u30D5\u30EC\u30FC\u30E0(0.2 \u79D2)\u9045\u3089\u305B\u305F\u3082\u306E",
      tail: "\u306F\u3063\u304D\u308A\u8FD4\u308A\u3068\u3057\u3066\u805E\u3053\u3048\u308B\u306E\u3067\u3001\u901F\u3044\u523B\u307F\u3067\u306F\u524D\u306E\u97F3\u3068\u5F53\u305F\u308B",
      en: "a quieter copy twelve frames (0.2s) behind \u2014 clearly a return, so in fast passages it collides with the note before"
    }
  ];
  var DUTY_STEPS = [
    { key: "50", wave: "pulse(50)", ja: "\u77E9\u5F62\u6CE2", en: "squares" },
    { key: "25", wave: "pulse(25)", ja: "\u5E45 25% \u306E\u77E9\u5F62\u6CE2", en: "quarter-width pulses" },
    { key: "12", wave: "pulse(12)", ja: "\u5E45 12.5% \u306E\u77E9\u5F62\u6CE2", en: "eighth-width pulses" }
  ];
  function detuneEchoPresets() {
    const out = {};
    for (const w of DUTY_STEPS) {
      for (const d of [...DETUNE_STEPS].reverse()) {
        for (const e of [...ECHO_STEPS].reverse()) {
          if (!d.c && !e.f) continue;
          const name = `lyPair(${w.key}, ${d.c ? d.value : "detune: none"}, ${e.f ? e.value : "echo: none"})`;
          const both = d.c && e.f;
          const what = both ? "@d \u3068 @s" : d.c ? "@d" : "@s";
          out[name] = {
            layers: [
              { wave: w.wave },
              { wave: w.wave, gain: e.f ? 0.3 : 0.6, cents: d.c, delay: e.f }
            ],
            role: "lead",
            tags: ["psg", "layer"].concat(d.c ? ["detune"] : []).concat(e.f ? ["echo"] : []),
            noteJa: w.ja + "\u3092 " + (both ? `${d.lead}\u3001${e.mid}\u3002${d.tail}\u3002${e.tail}` : `${d.alone || e.alone}\u3002${d.tail || e.tail}`) + `\u3002\u30A8\u30D5\u30A7\u30AF\u30C8\u306E ${what} \u3068\u540C\u3058\u3053\u3068\u3092\u3001\u67A0\u3092\u98DF\u3046\u5074\u3067\u3084\u308B`,
            note: "Two " + w.en + ", " + (both ? d.en + ", and " + e.en : d.en || e.en) + ". The same thing " + (both ? "@d and @s do together" : d.c ? "@d does" : "@s does") + ", on the side that costs voices."
          };
        }
      }
    }
    return out;
  }
  function lyPairFamily() {
    return {
      note: "Two pulses of the same width, the second detuned and/or delayed. The same thing @d and @s do, but as a voice that costs two channels.",
      params: [
        {
          name: "width",
          default: "50",
          note: "Pulse width of both layers, in percent.",
          values: DUTY_STEPS.map((w) => ({ value: w.key, note: `Two ${w.en}.` }))
        },
        {
          name: "detune",
          default: "wide",
          note: "How far apart the second layer is tuned.",
          values: [...DETUNE_STEPS].reverse().map((d) => ({ value: d.value, note: d.en }))
        },
        {
          name: "echo",
          default: "far",
          note: "How far behind the second layer comes in, quieter.",
          values: [...ECHO_STEPS].reverse().map((e) => ({ value: e.value, note: e.en }))
        }
      ],
      // 両方なしは、ただの矩形波(`pulse( )`)なので作らない
      forbid: [{ detune: "none", echo: "none" }]
    };
  }
  var LAYER_PRESETS = {
    // **バスドラムに空気を足す。**FM の 2 オペで作った胴の音は線が細く、
    // 単体だと「コッ」で終わってしまう。高いところへノイズを薄く重ねると、
    // 皮が鳴ったあとの空気が付いて「ドッ」になる。
    //
    // **ノイズは小さく。**それだけ聞くと意味が無いくらいの量でよく、
    // 大きくすると胴ではなくシンバルに聞こえ始める。
    //
    // **`@e{snap}` で早く消す。**打楽器に添えるものは伸ばす意味が無いうえ、
    // **鳴り終われば枠を返せる**。声が足りないところでは、
    // 添え物が席を握ったままでいるのがいちばん困る
    lyKickAir: {
      layers: [
        { wave: "opllKick" },
        { wave: "noise", gain: 0.34, semi: 24, follow: false, env: "snap" }
      ],
      role: "perc",
      tags: ["drum", "kick", "layer"],
      noteJa: "\u30D0\u30B9\u30C9\u30E9\u30E0\u306B\u3001\u9AD8\u3044\u30CE\u30A4\u30BA\u3092\u8584\u304F\u91CD\u306D\u305F\u3082\u306E\u3002FM \u3060\u3051\u306E\u80F4\u306F\u7DDA\u304C\u7D30\u304F\u3066\u300C\u30B3\u30C3\u300D\u3067\u7D42\u308F\u308B\u304C\u3001\u7A7A\u6C17\u304C\u4ED8\u304F\u3068\u300C\u30C9\u30C3\u300D\u306B\u306A\u308B",
      note: "A kick with a thin layer of high noise over it. The FM body alone stops at a click; the air on top turns it into a thud."
    },
    // ---- PSG どうしを重ねたものは、下で作って混ぜる ----
    // **FM の頭に PSG を短く足す。**FM の 2 オペは立ち上がりが丸く、
    // 前へ出したいときに音量を上げると、伸びているところまで一緒に大きくなる。
    //
    // **頭だけ矩形波を重ねると、輪郭が立って音量は変わらない。**
    // `@e{tap}` を着せてあるので、**強く立ち上がって、少し残ってから消える**。
    //
    // **0.12 秒で落ちきる。**`pluck` のように伸ばしっぱなしにすると、
    // 音符が長いあいだずっと 2 声めが乗ったままになり、
    // **頭が立つのではなく全体が大きくなる**。少し残ってから消えるほうが、
    // FM へ引き継いだように聞こえるし、**枠も早く返せる**
    //
    // **1 オクターブ上に重ねる。**同じ高さで重ねると FM とほとんど同じ音になり、
    // 「厚くなった」ではなく「大きくなった」に聞こえる。上へ置くと倍音の並びが
    // 別になるので、頭が立ったことが音の高さの側で分かる
    //
    // **幅は 50%。**AY-3-8910 は幅を持たないので、細い矩形波にすると
    // **SCC が挿さっている MSX でしか鳴らなくなる**。50% なら
    // MSX + MSX-MUSIC で鳴る — FM は拡張、PSG は本体にあるので、
    // **足すぶんに元手が要らない**という、実機でよくやっていた形になる
    lyBrassBite: {
      layers: [
        { wave: "opllTrumpet" },
        { wave: "pulse(50)", gain: 0.6, semi: 12, follow: false, env: "tap" }
      ],
      role: "lead",
      tags: ["brass", "attack", "layer"],
      noteJa: "FM \u306E\u30D6\u30E9\u30B9\u306E\u982D\u306B\u30011 \u30AA\u30AF\u30BF\u30FC\u30D6\u4E0A\u306E\u77E9\u5F62\u6CE2\u3092\u5F37\u304F\u91CD\u306D\u305F\u3082\u306E\u3002\u306F\u3058\u3044\u305F\u3088\u3046\u306B\u7ACB\u3061\u4E0A\u304C\u3063\u3066\u3059\u3050\u843D\u3061\u3001\u308F\u305A\u304B\u306B\u6B8B\u3063\u3066\u304B\u3089 FM \u306B\u5F15\u304D\u7D99\u3050",
      note: "FM brass with a square wave an octave above struck hard over the attack. It snaps up, drops away and leaves a trace behind before the FM takes over."
    }
  };
  function registerDefaultLayers() {
    registerFamily("lyPair", lyPairFamily());
    const has = (n) => findWave(n) >= 0;
    const all = { ...LAYER_PRESETS, ...detuneEchoPresets() };
    for (const [name, spec] of Object.entries(all)) {
      if (has(name)) continue;
      registerLayer(name, spec);
    }
  }

  // ../../../tmp/panther-update/sound/version.js
  var SOUND_VERSION = "0.22.0";

  // ../../../tmp/panther-update/sound/audio.js
  registerDefaultWaves();
  registerDefaultFM();
  registerDefaultBeeps();
  registerDefaultFDS();
  registerDefaultFM4();
  registerOPLLPresets();
  registerExtraWaves();
  registerNoiseVariants();
  registerDefaultTones();
  registerDefaultLayers();
  sealPresets();
  var MASTER_VOL = 0.14;
  var BEEP_CURVE = (() => {
    const c = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) c[i] = i < 512 ? -1 : 1;
    return c;
  })();
  var saidOld = /* @__PURE__ */ new Set();
  function oldWay(what, instead) {
    if (saidOld.has(what)) return;
    saidOld.add(what);
    console.warn(`[ChpTnSnd] ${what} \u306F\u53E4\u3044\u547C\u3073\u65B9\u3067\u3059\u3002${instead}(\u3044\u307E\u306F\u52D5\u304D\u307E\u3059\u304C\u3001\u3044\u305A\u308C\u7121\u304F\u306A\u308A\u307E\u3059)`);
  }
  function sayErrors(what, got) {
    for (const e of got.errors) {
      const ch = e.ch === null ? "" : `${e.ch + 1} \u672C\u76EE: `;
      console.warn(`[ChpTnSnd] ${what}: ${ch}${e.text}`);
    }
    return got;
  }
  function seededRandom(seed) {
    let x = seed >>> 0 || 1;
    return () => {
      x ^= x << 13;
      x >>>= 0;
      x ^= x >>> 17;
      x ^= x << 5;
      x >>>= 0;
      return x / 4294967296;
    };
  }
  var PSG_CLOCK = 3579545 / 2;
  function psgDiv(wave) {
    const wf = WAVEFORMS[wave] || WAVEFORMS[2];
    if (wf.kind === "layer") return null;
    if ((wf.special || []).includes("exact")) return 0;
    if (wf.snapDiv > 0) return wf.snapDiv;
    if (["fm", "opm", "opll", "noise", "baked", "beep"].includes(wf.kind)) return 0;
    return wf.kind === "triangle" ? 32 : 16;
  }
  function psgSnap(freq, wave) {
    if (!(freq > 0)) return freq;
    const div = psgDiv(wave);
    if (!div) return freq;
    const max = (WAVEFORMS[wave] || {}).snapDiv > 0 ? 65535 : 4095;
    const tp = Math.max(1, Math.min(max, Math.round(PSG_CLOCK / (div * freq))));
    return PSG_CLOCK / (div * tp);
  }
  function toneSnap(freq) {
    if (!(freq > 0)) return freq;
    const tp = Math.max(1, Math.min(4095, Math.round(PSG_CLOCK / (16 * freq))));
    return PSG_CLOCK / (16 * tp);
  }
  var WORKLETS = {
    opm: { node: "mmsxx-opm", code: OPM_CODE },
    opll: { node: "mmsxx-opll", code: OPLL_CODE },
    duty: { node: "mmsxx-duty", code: DUTY_CODE }
  };
  function workletOf(wf) {
    if (!wf) return null;
    if (wf.kind === "opm") return "opm";
    if (wf.kind === "opll") return "opll";
    if (wf.tone && wf.tone.duty) return "duty";
    return null;
  }
  function envOf(ev) {
    const e = ENVELOPES[ev.env] || ENVELOPES[0];
    const base = ev.tail && !e.table ? { ...e, a: typeof e.a === "string" ? 4e-3 : Math.min(e.a, 4e-3), d: 99, s: 0 } : e;
    return ev.legato && !base.table ? { ...base, a: 0 } : base;
  }
  function tailOf(ev, len) {
    if (ev.open || !(ev.room > 0)) return 0;
    const w = WAVEFORMS[ev.wave];
    if (!w || w.kind === "opll" || w.kind === "opm") return 0;
    if (w.tone && w.tone.vol) return 0;
    const one = (e) => !e || e.table || !(e.s > 0) ? 0 : envSec(e.r, len);
    let r = one(envOf(ev));
    if (w.kind === "layer") {
      for (const m of w.layers) {
        const at = m.env != null ? m.env : (WAVEFORMS[m.wave] || {}).defaultEnv;
        if (at != null) r = Math.max(r, one(envOf({ ...ev, env: at })));
      }
    }
    return Math.max(0, Math.min(r, ev.room));
  }
  function envShape(e, len) {
    const a = Math.min(envSec(e.a, len), len * 0.5);
    const d = Math.min(envSec(e.d, len), Math.max(0, len - a));
    const rel = Math.min(envSec(e.r, len), len * 0.5);
    return { a, d, s: e.s, rel, hold: Math.max(a + d, len - rel) };
  }
  function envGains(e, len) {
    if (!e.table) return null;
    const n = Math.max(1, Math.ceil(len / TONE_FRAME));
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) out[i] = envTableAt(e, i);
    return out;
  }
  function envTableAt(e, i) {
    const t = e.table;
    if (i < t.length) return t[i];
    if (e.loop === null || e.loop === void 0) return t[t.length - 1];
    const span = t.length - e.loop;
    return t[e.loop + (i - e.loop) % span];
  }
  function snapVol(v, steps) {
    if (!(steps > 0) || !(v > 0)) return v;
    const step = 15 / steps;
    return Math.min(15, Math.max(step, Math.round(v / step) * step));
  }
  function volGainOf(v, curve, steps) {
    if (!(v > 0)) return 0;
    const n = steps > 0 ? steps : 15;
    const down = Math.max(0, n - v / 15 * n);
    switch (curve) {
      case "3db":
        return Math.pow(10, -3 * down / 20);
      case "0.75db":
        return Math.pow(10, -0.75 * down / 20);
      case "linear":
        return v / 15;
      default:
        return Math.pow(v / 15, 1.8);
    }
  }
  function levelAt(ev, age) {
    const e = envOf(ev);
    const len = Math.max(0.01, ev.gate);
    const vol = ampAt(ev, 1, age) / MASTER_VOL;
    if (e.table) return Math.max(0, Math.min(1, envTableAt(e, Math.floor(age / TONE_FRAME)) * vol));
    const sh = envShape(e, len);
    let g;
    if (age < sh.a) g = sh.a > 0 ? age / sh.a : 1;
    else if (age < sh.a + sh.d) g = 1 - (1 - sh.s) * ((age - sh.a) / Math.max(1e-6, sh.d));
    else if (age < sh.hold) g = sh.s;
    else g = sh.s * (1 - (age - sh.hold) / Math.max(1e-6, len - sh.hold));
    return Math.max(0, Math.min(1, g * vol));
  }
  function freqAt(ev, age) {
    if (!(ev.glide > 0)) return ev.freq;
    const len = Math.max(0.01, ev.gate);
    const k = Math.max(0, Math.min(1, age / len));
    return ev.freq * Math.pow(ev.glide / ev.freq, k);
  }
  function ampFor(ev) {
    return ampAt({ ...ev, fade: null, vol: peakVol(ev) }, 1);
  }
  function volAt(ev, age) {
    const pts = ev.fade;
    if (!pts || !pts.length || age <= pts[0][0]) return ev.vol;
    for (let i = 1; i < pts.length; i++) {
      if (age <= pts[i][0]) {
        const [a0, v0] = pts[i - 1], [a1, v1] = pts[i];
        return a1 > a0 ? v0 + (v1 - v0) * (age - a0) / (a1 - a0) : v1;
      }
    }
    return pts[pts.length - 1][1];
  }
  function peakVol(ev) {
    if (!ev.fade) return ev.vol;
    return Math.max(ev.vol, ...ev.fade.map((p) => p[1]));
  }
  function fadeGain(ev, age) {
    const top = ampFor(ev);
    return top > 0 ? ampAt(ev, 1, age) / top : 0;
  }
  function ampAt(ev, f, age = 0) {
    const w = WAVEFORMS[ev.wave];
    const boost = w && w.gain > 0 ? w.gain : 1;
    const steps = ev.vsteps ?? (w ? w.vsteps : 0);
    const curve = ev.vcurve ?? (w ? w.vcurve : "curve");
    const v = snapVol(volAt(ev, age) * Math.max(0, f), steps);
    return volGainOf(v, curve, steps) * MASTER_VOL * boost;
  }
  function songMeta(tracks) {
    const skip = /* @__PURE__ */ new Set(["name", "role", "ch", "group", "groupSet", "machine"]);
    const out = {};
    for (const t of tracks) {
      for (const [k, v] of Object.entries(t.meta ?? {})) {
        if (skip.has(k) || out[k] !== void 0) continue;
        out[k] = v;
      }
    }
    return out;
  }
  function voicesOfTrack(events) {
    const pts = [];
    for (const e of events) {
      if (!(e.vol > 0)) continue;
      pts.push([e.t, 1], [e.t + Math.max(e.gate, 1e-3), -1]);
    }
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let now = 0, most = 0;
    for (const [, d] of pts) {
      now += d;
      if (now > most) most = now;
    }
    return most;
  }
  function lanesOfTrack(events, labels) {
    const used = /* @__PURE__ */ new Set();
    for (const e of events) if (e.lane) used.add(e.lane);
    if (!used.size) return [];
    const out = [];
    for (const [name, label] of labels ?? []) {
      if (used.has(name)) {
        out.push({ name, label: label || name });
        used.delete(name);
      }
    }
    for (const name of used) out.push({ name, label: name });
    return out;
  }
  function compileTrack(mml, mode) {
    const {
      events,
      total,
      loop,
      outro,
      meta,
      marks,
      takes,
      bars,
      cues,
      problems,
      laneLabels
    } = compileMML(mml.trim(), { mode });
    const noise = events.some((e) => (WAVEFORMS[e.wave] || {}).kind === "noise");
    const played = addEchoes(events, total);
    markRooms(played, loop ? loop.to : Infinity);
    return {
      events: played,
      base: events,
      // 同時に何声使うか。和音とバンドル音色とエコーで 1 本から何本も鳴る
      voices: voicesOfTrack(played),
      // 和音を鳴らすチャンネルか。重ねは 1 つの音を厚くするだけだが、
      // 和音は別の音を並べるので、実機では本当に何本か要る
      chords: events.some((e) => e.chord !== void 0),
      // 中の層。`#drum` の字と `#chord` の声に付く。1 本を開いて
      // 「ハイハットだけ止める」ができるようにするため(2026-09-18)
      lanes: lanesOfTrack(played, laneLabels),
      total,
      noise,
      loop,
      outro,
      marks,
      meta,
      takes,
      bars,
      // 読めなかったところ。読み方(mode)にかかわらず控えてある
      problems: problems ?? [],
      // 合図と切れ目も選択肢で入れ替わるので、素の並びを取っておく
      cues: cues ?? [],
      baseCues: cues ?? [],
      baseBars: bars ?? [],
      name: meta.name ?? meta.ch ?? null,
      role: meta.role ?? null,
      // 版と組(`#group`)。どちらも書かなければ null で、どの版にも属さない。
      // 機械(`#machine`)は覚えるだけで、いまは音を変えない
      group: meta.group ?? null,
      groupSet: meta.groupSet ?? null,
      machine: meta.machine ?? null
    };
  }
  function markRooms(events, turn) {
    let j = 0;
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (j <= i) j = i + 1;
      while (j < events.length && events[j].t <= e.t + 1e-6) j++;
      let at = j < events.length ? events[j].t : Infinity;
      if (e.t < turn - 1e-6) at = Math.min(at, turn);
      e.room = Math.max(0, at - (e.t + e.gate));
    }
  }
  function addEchoes(events, total) {
    if (!events.some((e) => e.echo)) return events;
    const out = [...events];
    const busy = events.filter((e) => e.gate > 0).map((e) => [e.t, e.t + e.gate]);
    const nextAt = (t) => {
      let at = Number.isFinite(total) ? total : Infinity;
      for (const [s] of busy) if (s > t + 1e-9 && s < at) at = s;
      return at;
    };
    const freeFrom = (t) => {
      let at = t;
      for (const [s, e] of busy) if (at > s - 1e-9 && at < e - 1e-9) at = Math.max(at, e);
      return at;
    };
    const copies = [];
    for (const e of events) {
      if (!e.echo || !(e.echo.delay > 0) || !(e.vol > 0)) continue;
      const k = 0.12 + e.echo.depth * 0.05;
      let vol = e.vol;
      for (let r = 1; r <= 32; r++) {
        vol *= k;
        if (vol < 0.7) break;
        const at = e.t + e.echo.delay * r;
        if (at >= total - 1e-9) break;
        const t = freeFrom(at);
        const stop = Math.min(at + e.gate, nextAt(t), total);
        const gate = stop - t;
        if (gate <= 0.01) continue;
        const c = { ...e, t, dur: gate, gate, vol: Math.round(vol), echo: null, tail: true };
        const k2 = c.vol / e.vol;
        if (e.fade) c.fade = e.fade.map(([a, v]) => [a - (t - e.t), v * k2]);
        if (e.loopVol !== void 0) {
          c.loopVol = e.loopVol * k2;
          c.loopFade = e.loopFade && e.loopFade.map(([a, v]) => [a - (t - e.t), v * k2]);
        }
        copies.push(c);
      }
    }
    copies.sort((a, b) => a.t - b.t || b.vol - a.vol);
    let last = null;
    for (const c of copies) {
      if (last) {
        if (c.t < last.t + 1e-9) continue;
        if (c.t < last.t + last.gate - 1e-9) {
          last.gate = c.t - last.t;
          last.dur = last.gate;
        }
      }
      out.push(c);
      last = c;
    }
    out.sort((a, b) => a.t - b.t);
    return out;
  }
  function markBeep(track) {
    for (const ev of track.events) ev.beep = true;
    return track;
  }
  function noiseCount(tracks) {
    return tracks.reduce((n, t) => n + (t.noise ? 1 : 0), 0);
  }
  function switchPoints(tracks) {
    const { grid, bars } = switchParts(tracks);
    return tidy([...grid, ...bars]);
  }
  function tidy(list) {
    return [...new Set(list.map((t) => Math.round(t * 1e6) / 1e6))].sort((a, b) => a - b);
  }
  function switchParts(tracks) {
    if (!tracks.length) return { grid: [], bars: [] };
    const span = Math.max(...tracks.map((t) => t.total), 0);
    const mark = tracks.map((t) => t.loop).find(Boolean) || null;
    const from = mark ? mark.from : 0;
    const grid = [];
    const every = Number(tracks.map((t) => t.meta && t.meta.switch).find((v) => v != null));
    const tempo = Number(tracks.map((t) => t.meta && t.meta.tempo).find((v) => v != null)) || 120;
    if (Number.isFinite(every) && every > 0) {
      const step = every * (240 / tempo);
      for (let t = from; t <= span + 1e-9; t += step) grid.push(t);
    }
    const out = tracks.flatMap((t) => t.bars || []);
    return { grid: tidy(grid), bars: tidy(out) };
  }
  function takesInfo(def) {
    const picks = def.picks || {};
    const out = /* @__PURE__ */ new Map();
    for (const track of def) {
      for (const box of track.takes || []) {
        if (!out.has(box.group)) {
          out.set(box.group, {
            group: box.group,
            now: "",
            options: [],
            boxes: [],
            restart: false,
            noWait: false
          });
        }
        const g = out.get(box.group);
        for (const o of box.options) if (!g.options.includes(o.name)) g.options.push(o.name);
        g.boxes.push({ ch: track.ch, at: box.at, dur: box.dur });
        if (box.restart) g.restart = true;
        if (box.now) g.noWait = true;
        if (!g.now) g.now = picks[box.group] ?? box.options[0].name;
      }
    }
    return [...out.values()];
  }
  function gatherMarks(tracks, hideSystem) {
    const seen = /* @__PURE__ */ new Set();
    const all = [];
    for (const t of tracks ?? []) {
      for (const m of t.marks ?? []) {
        if (seen.has(m.name)) continue;
        seen.add(m.name);
        all.push({ name: m.name, t: m.t });
      }
    }
    all.push({ name: HEAD_MARK, t: 0 });
    const mine = all.filter((m) => !isSystemMark(m.name));
    const dup = (m) => isSystemMark(m.name) && mine.some((x) => Math.abs(x.t - m.t) < 1e-6);
    const out = all.filter((m) => !dup(m) && !(hideSystem && isSystemMark(m.name)));
    return out.sort((a, b) => a.t - b.t);
  }
  var ChipTuneSound = class _ChipTuneSound {
    /**
     * @param {AudioContext} [ctx] 外で作った AudioContext(`SimpleAudio` と同じ)。
     *   1 枚の画面に音を出すものが 2 つ以上乗るときは、同じものを渡して使い回す。
     *   こちらは省いてもよい — 渡さなければ `unlock()` が自分で作る。
     *   ゲームが `new ChipTuneSound()` だけで鳴らしてきた口なので、そこは変えない
     * @param {{maxVoices?:number, maxNoise?:number}} [opts]
     *   maxVoices = 同時に鳴らせる音の数。実機に寄せたいときに絞る。
     *   エンジン側に上限はないので、いくつでも指定できる(既定 8)。
     *   maxNoise = 同時に鳴らせるノイズの数(既定 1)。実機の PSG は 1 つしか
     *   持っていないが、爆発など SE がノイズを取り合って消えがちなので
     *   「間違った方向に進化したマシン」として本数を宣言できるようにしてある。
     *   BGM のドラムぶんは別枠で、ここで数えるのは SE のノイズだけ。
     */
    constructor(ctx, opts = {}) {
      this.ctx = ctx || null;
      this.seVoices = [];
      this.maxVoices = opts.maxVoices ?? 8;
      this.bgmVoices = 0;
      this._seSeq = 0;
      this._sePausedAll = false;
      this.bgmDefs = /* @__PURE__ */ new Map();
      this.seDefs = /* @__PURE__ */ new Map();
      for (const [name, mml] of Object.entries(SYSTEM_SE)) this.defineSE(name, mml);
      for (const [name, def] of Object.entries(SE_PRESETS)) {
        this.defineSE(name, def.mml, { base: def.base || "c1" });
      }
      this.bgmState = null;
      this.jingleState = null;
      this.noiseBuffer = null;
      this.maxNoise = opts.maxNoise ?? 1;
      this.psgTune = opts.psgTune ?? true;
      this.spatial = opts.spatial ?? "auto";
      this.ignoreSongLoop = !!opts.ignoreSongLoop;
      this.playOutro = opts.playOutro !== false;
      this.loopTimes = 2;
      this._loopTimesFromSong = 2;
      this._range = null;
      this._chMute = /* @__PURE__ */ new Set();
      this._chLevel = /* @__PURE__ */ new Map();
      this._laneMute = /* @__PURE__ */ new Set();
      this._muteFor = null;
      this._group = null;
      this._cues = [];
      this.onCue = null;
      this._cueMute = /* @__PURE__ */ new Set();
      this._cueSeq = 0;
      this.dynamic_effects = {};
    }
    /**
     * ユーザー操作を起点に AudioContext を有効化する(エンジンがキー入力時に呼ぶ)。
     *
     * 渡されていなければ、ここで作る。土台のほうは作らない決まりだが、
     * こちらはゲームが `new ChipTuneSound()` だけで鳴らしてきた口なので、
     * そこは変えない。分け合うときは `{ ctx }` を渡す。
     * そのあと、音源が要るものを足す(ノイズの元と、常駐の処理器)
     */
    unlock() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      if (!this.noiseBuffer) {
        const len = this.ctx.sampleRate;
        this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      for (const kind of Object.keys(WORKLETS)) {
        this._wkLoad(kind).catch(() => {
        });
      }
    }
    /** いま SE が使っているノイズの数 */
    _usedNoise() {
      return this.seVoices.reduce((n, v) => n + v.noise, 0);
    }
    /**
     * SE の席をカテゴリごとに取っておく。
     *
     * 優先度だけで譲り合わせると、先に鳴っていた音が場所を握ったままになり、
     * 撃つ音が鳴りつづけているあいだ、当たった音や爆発が聞こえなくなる。
     * 種類ごとに席を分けておけば、その心配が無くなる。
     *
     * ```js
     * mmsxx.audio.reserveSE({
     *   shot: { voices: 2, noise: 1, names: ['shot'] },
     *   hit:  { voices: 4, noise: 2, names: ['hit', 'clink', 'boom', 'bigboom'] },
     * });
     * ```
     *
     * `names` に書いておけば、鳴らす側は今までどおりでよい
     * (`playSE('boom', SE_HIT)` だけで hit の席に座る)。
     * その場で決めたいときは `playSE('boom', SE_HIT, { ch: 'hit' })` と書く。
     *
     * 取っておいた席は、そのカテゴリの中だけで取り合う。ほかの音には渡さない。
     * カテゴリを指定しない SE は残りの席を使い、そこは今までどおり
     * 優先度で取り合う。
     *
     * @param {Object<string,{voices?:number, noise?:number, names?:string[]}|number>} map
     *   数だけ渡すと声の数の指定になる(ノイズは 0)。
     *   names = その席に座らせる SE の名前
     */
    reserveSE(map) {
      this._chans = /* @__PURE__ */ new Map();
      this._chanOf = /* @__PURE__ */ new Map();
      for (const [name, v] of Object.entries(map || {})) {
        const q = typeof v === "number" ? { voices: v } : v || {};
        this._chans.set(name, {
          voices: Math.max(0, q.voices || 0),
          noise: Math.max(0, q.noise || 0)
        });
        for (const se of q.names || []) this._chanOf.set(se, name);
      }
    }
    /** 取ってある席の合計(声 / ノイズ) */
    _reserved() {
      let voices = 0, noise = 0;
      for (const q of (this._chans || /* @__PURE__ */ new Map()).values()) {
        voices += q.voices;
        noise += q.noise;
      }
      return { voices, noise };
    }
    /**
     * その SE が使う席の上限と、いまの使用数を返す。
     * 取ってあるカテゴリならその席、そうでなければ残りの席。
     */
    _scope(ch) {
      const q = ch && this._chans && this._chans.get(ch);
      const mine = (v) => q ? v.ch === ch : !(v.ch && this._chans && this._chans.has(v.ch));
      const list = this.seVoices.filter(mine);
      const used = list.reduce((n, v) => n + v.voices, 0);
      const usedNoise = list.reduce((n, v) => n + v.noise, 0);
      if (q) return { max: q.voices, maxNoise: q.noise, used, usedNoise, list };
      const r = this._reserved();
      return {
        // 残りの席。BGM のぶんはここから引く(取ってある席は SE 専用)
        max: this.maxVoices - r.voices - this.bgmVoices,
        maxNoise: this.maxNoise - r.noise,
        used,
        usedNoise,
        list
      };
    }
    /** いま実際に使う定位の出し方('auto' をその場の出口で決める) */
    _spatialMode() {
      const m = this.spatial;
      if (m === "mono" || m === "stereo" || m === "hrtf") return m;
      const ch = this.ctx ? this.ctx.destination.channelCount : 1;
      return ch >= 2 ? "stereo" : "mono";
    }
    /**
     * その位置へ振るための入り口を返す。
     *
     * 節は位置ごとに 1 個で、`dest` にぶら下げて持つ。着せるものは
     * トラック単位なので、実際にはトラックにつき 1 個に落ち着く。
     * 音符ごとには作らない(節の作り捨てがいちばん高い)。
     * `dest` に持たせておけば、曲が終われば `dest` ごと捨てられる。
     *
     * モノラルのときだけ素通しにする。ステレオでは中央も節を通す。
     * 素通しにすると 1 本の音がそのまま左右へ配られて、
     * 振った音より中央の音だけ 3 dB 大きくなってしまう
     */
    _panFor(dest, pos) {
      if (!dest || !pos) return dest;
      const mode = this._spatialMode();
      if (mode === "mono") return dest;
      let bank = dest.__pan;
      if (!bank) {
        bank = /* @__PURE__ */ new Map();
        dest.__pan = bank;
      }
      const key2 = `${mode}:${pos[0]},${pos[1]},${pos[2]}`;
      const hit = bank.get(key2);
      if (hit) return hit;
      const inp = mode === "hrtf" ? this._panHRTF(dest, pos) : this._panStereo(dest, pos);
      bank.set(key2, inp);
      return inp;
    }
    /**
     * 自前の左右振り(等パワー)。音量差だけを作る。
     *
     * 上下(y)は音量差では作れないので効かない。前後(z)は向きにだけ効き、
     * 真横が ±1、真正面と真後ろが 0 になる(音量差では前と後ろを区別できない)。
     * 距離では音量を変えない。音量は `v` が持つ決まりなので、そこへ寄せる
     */
    _panStereo(dest, pos) {
      const ctx = this.ctx;
      const h = Math.hypot(pos[0], pos[2]);
      const pan = h > 0 ? pos[0] / h : 0;
      const a = (pan + 1) * Math.PI / 4;
      const r = (v) => Math.round(v * 1e6) / 1e6;
      const inp = ctx.createGain();
      const gl = ctx.createGain();
      const gr = ctx.createGain();
      const merge = ctx.createChannelMerger(2);
      gl.gain.value = r(Math.cos(a));
      gr.gain.value = r(Math.sin(a));
      inp.connect(gl);
      inp.connect(gr);
      gl.connect(merge, 0, 0);
      gr.connect(merge, 0, 1);
      merge.connect(dest);
      return inp;
    }
    /**
     * ブラウザ任せの定位。耳の形まで真似るので上下と前後も出るが、
     * 持っているデータがブラウザごとに違うので出力が揃わない。
     * 鳴らして聴くときだけのもの
     */
    _panHRTF(dest, pos) {
      const p = this.ctx.createPanner();
      p.panningModel = "HRTF";
      p.rolloffFactor = 0;
      if (p.positionX) {
        p.positionX.value = pos[0];
        p.positionY.value = pos[1];
        p.positionZ.value = -pos[2];
      } else {
        p.setPosition(pos[0], pos[1], -pos[2]);
      }
      p.connect(dest);
      return p;
    }
    // ---- 直前の音を溜める(あとで聞き直す・動画に付ける) ----
    //
    // 出口の手前に聞き耳の節をつないで、流れた波形を輪っかに溜める。
    // 生の波形なので符号化は要らず、3 秒でも 0.6MB ほど(48kHz・モノラル)。
    // 輪っかは AudioWorklet の中に置く。毎回やりとりせず、欲しいときだけもらう。
    /** 聞き耳の節の中身(文字列から作るので、ファイルは増えない) */
    static get _tapCode() {
      return `
class MmsxxTap extends AudioWorkletProcessor {
  constructor(opts) {
    super();
    this.size = opts.processorOptions.size | 0;
    this.buf = new Float32Array(this.size);
    this.at = 0; this.len = 0;
    this.port.onmessage = (e) => {
      if (e.data === 'grab') {
        // \u53E4\u3044\u9806\u306B\u4E26\u3079\u76F4\u3057\u3066\u6E21\u3059
        const out = new Float32Array(this.len);
        const start = (this.at - this.len + this.size) % this.size;
        for (let i = 0; i < this.len; i++) out[i] = this.buf[(start + i) % this.size];
        this.port.postMessage(out, [out.buffer]);
      } else if (e.data === 'clear') { this.at = 0; this.len = 0; }
      else if (e.data === 'hold') { this.hold = true; }
      else if (e.data === 'go') { this.hold = false; }
    };
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch && !this.hold) {
      for (let i = 0; i < ch.length; i++) {
        this.buf[this.at] = ch[i];
        this.at = (this.at + 1) % this.size;
        if (this.len < this.size) this.len++;
      }
    }
    return true;   // \u97F3\u304C\u6B62\u307E\u3063\u3066\u3082\u56DE\u3057\u3064\u3065\u3051\u308B
  }
}
registerProcessor('mmsxx-tap', MmsxxTap);
`;
    }
    /**
     * 直前の音を溜めはじめる(0 でやめて捨てる)。
     * まだ音が解禁されていなければ覚えておいて、解禁されたときに始める。
     * @param {number} seconds 何秒ぶん持つか
     */
    keepSound(seconds) {
      this._keepSec = Math.max(0, seconds);
      this.holdSound(false);
      if (!this.ctx) return;
      if (this._keepSec <= 0) {
        this._stopTap();
        return;
      }
      this._out();
      this._startTap(this._keepSec);
    }
    /** 聞き耳をつなぐ */
    _startTap(seconds) {
      if (this._tap || this._tapBusy || !this.ctx || !this._bus) return;
      if (!this.ctx.audioWorklet) return;
      this._tapBusy = true;
      const size = Math.round(seconds * this.ctx.sampleRate);
      const url = URL.createObjectURL(new Blob([_ChipTuneSound._tapCode], { type: "application/javascript" }));
      this.ctx.audioWorklet.addModule(url).then(() => {
        URL.revokeObjectURL(url);
        if (this._keepSec <= 0 || !this._bus) {
          this._tapBusy = false;
          return;
        }
        const node = new AudioWorkletNode(this.ctx, "mmsxx-tap", { processorOptions: { size } });
        const sink = this.ctx.createGain();
        sink.gain.value = 0;
        node.connect(sink);
        sink.connect(this.ctx.destination);
        this._bus.connect(node);
        this._tap = node;
        this._tapSink = sink;
        this._tapBusy = false;
      }).catch(() => {
        this._tapBusy = false;
      });
    }
    /** 聞き耳を外して捨てる */
    _stopTap() {
      if (this._tap) {
        try {
          this._tap.disconnect();
        } catch (e) {
        }
      }
      if (this._tapSink) {
        try {
          this._tapSink.disconnect();
        } catch (e) {
        }
      }
      this._tap = null;
      this._tapSink = null;
    }
    /**
     * 録画へ音を分ける。出口の手前(bus)からつなぐので、
     * ミュート中でも動画には音が入る。null で外す。
     * @param {MediaStreamAudioDestinationNode|null} dest
     */
    recordTo(dest) {
      const bus = this._out();
      if (!bus) return false;
      if (this._recDest) {
        try {
          bus.disconnect(this._recDest);
        } catch (e) {
        }
      }
      this._recDest = dest || null;
      if (dest) bus.connect(dest);
      return true;
    }
    /** 溜めたぶんを捨てて、いまから溜め直す */
    clearSound() {
      if (this._tap) this._tap.port.postMessage("clear");
    }
    /**
     * 溜めるのをいったん止める / 再開する(溜めたものは捨てない)。
     * ポーズ中は音が出ていないので、止めておかないと
     * 輪っかが無音で埋まってしまう
     */
    /**
     * @param {boolean} on true で溜めるのを止める / false で再開する
     */
    holdSound(on) {
      if (this._tap) this._tap.port.postMessage(on ? "hold" : "go");
    }
    /**
     * 溜まっている音を受け取る。
     * @returns {Promise<AudioBuffer|null>} 鳴らせる形。溜めていなければ null
     */
    soundBack() {
      const node = this._tap;
      if (!node || !this.ctx) return Promise.resolve(null);
      return new Promise((done) => {
        const t = setTimeout(() => done(null), 500);
        node.port.onmessage = (e) => {
          clearTimeout(t);
          const data = e.data;
          if (!data || !data.length) {
            done(null);
            return;
          }
          const buf = this.ctx.createBuffer(1, data.length, this.ctx.sampleRate);
          buf.getChannelData(0).set(data);
          done(buf);
        };
        node.port.postMessage("grab");
      });
    }
    /** 溜まっている音をそのまま鳴らす(リプレイ用) */
    async playSound() {
      const buf = await this.soundBack();
      if (!buf) return null;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.connect(this._out());
      src.start();
      return src;
    }
    /**
     * BGM を登録する。MML でも音声ファイル(mp3 など)でも同じように扱える。
     *
     * 確かめた結果を返す(`validateMML()` と同じ形)。読めないところがあっても
     * 登録は止めない — 鳴らせるところは鳴らす。ただし黙ってはいない。
     * `errors` に入ったものは `console.warn` にも出す(2026-09-15)。
     *
     * @param {string} name 呼び出すときの名前。同じ名前で登録し直すと上書きする
     * @param {string|string[]|{url:string,gain?:number}} src
     *   MML 文字列 / チャンネルごとの MML 配列 / {url} を渡すと音声ファイル再生になる
     * @param {{beep?:boolean, mode?:string}} [opts] beep = 音色を無視して単純なビープで鳴らす。
     *   mode = 読み方(`strict` / `normal` / `loose`。既定は `normal`)
     * @returns {object} `validateMML()` の返り値
     */
    defineBGM(name, src, opts = {}) {
      this._mutesOf(name);
      if (src && typeof src === "object" && !Array.isArray(src) && src.url) {
        this.bgmDefs.set(name, { kind: "audio", url: src.url, gain: src.gain ?? 1 });
        return { ok: true, errors: [], warnings: [], channels: [], total: 0 };
      }
      const voices = shareBundles(Array.isArray(src) ? src : [src]);
      const tracks = voices.map((t, i) => {
        const track = compileTrack(t, opts.mode);
        track.ch = i;
        if (opts.beep) markBeep(track);
        return track;
      });
      tracks.check = sayErrors(`BGM "${name}"`, validateMML(voices, opts.mode));
      tracks.problems = tracks.flatMap((t, i) => (t.problems || []).map((x) => ({ ...x, ch: i })));
      this.bgmDefs.set(name, tracks);
      return tracks.check;
    }
    /**
     * いまの場所から見て、次に切り替えてよいのは何秒のところか。
     *
     * 曲を替えるときの待ちに使う内側のもの。切れ目を書いていない曲では
     * `0` を返す。待たずに替えてよい、の意味。
     *
     * @param {string} name いま鳴っている曲の名前
     * @param {number} pos いまの場所(秒)
     * @returns {number} 何秒待つか。0 なら待たない
     */
    _waitFor(name, pos) {
      const pts = this.bgmSwitchPoints(name);
      if (!pts.length) return 0;
      const def = this.bgmDefs.get(name);
      const span = Math.max(...def.map((t) => t.total), 0);
      const end = def.map((t) => t.outro).find((v) => v != null) ?? span;
      const next = pts.find((t) => t > pos + 1e-3 && t <= end + 1e-9);
      return Math.max(0, (next != null ? next : end) - pos);
    }
    /**
     * 切り替えてよい場所を返す(秒)。
     *
     * `#switch <小節数>` の網の目と、全部のチャンネルが引いた `|` の場所。
     * 何も書いていない曲では空で、そのときはどこでも切り替えてよい。
     *
     * @param {string} name `defineBGM()` で登録した名前
     * @returns {number[]} 秒の早い順
     */
    bgmSwitchPoints(name) {
      const def = this.bgmDefs.get(name);
      return Array.isArray(def) ? switchPoints(def) : [];
    }
    /**
     * 選択肢(`#takes`)を選び替える。
     *
     * 同じところに何通りかの演奏を書いておいて、鳴らしながら差し替える
     * (docs/DYNAMIC.md)。囲みの長さはいちばん長い選択肢に合わせてあるので、
     * 選び替えても曲の長さは動かない。鳴っている最中でも呼べる。
     *
     * 選ぶのは曲ぜんぶで 1 つ。別のチャンネルに同じグループを書いておけば、
     * まとめて替わる。そのグループを持っていない囲みは動かない。
     *
     * 替わるのは、鳴らす先を積むときです。囲みの途中で押して間に合わなければ、
     * 次の切れ目(`#switch` と `|`)まで滑らせる。切れ目を書いていない曲は、
     * そのまま次に積むところから替わる。
     *
     * 待っている最中に跳んだり止めたりしたら、待たずに差し替える。
     *
     * 囲みの頭から鳴らし直すかどうかは、曲のほうが決める。
     * `#takes mood restart` と書いた囲みは、押されると頭へ戻って鳴らし直す。
     * 場面が変わったことを音でも言いたいときに要る(別の曲にする手もあるが、
     * 共通のパートが多い曲では持ちにくいし、つなぎ目で隙間が出る)(2026-09-17)。
     *
     * 切れ目(`#switch` と `|`)を書いた曲では、そこまで待ってから替える。
     * 頭へ戻すときも同じで、耳が切れ目に着いたところで跳ぶ。待たせたくないときは
     * `now` を書く(`#takes mood restart now`)。切れ目を書いていない曲は
     * 待ちようが無いので、その場で替わる(2026-09-17)。
     *
     * その 1 回だけ変えたいときは引数で上書きする。渡さなければ曲の指定どおり。
     *
     * ```js
     * mmsxx.audio.selectTake('曲', 'mood', 'tense');                    // 曲の指定どおり
     * mmsxx.audio.selectTake('曲', 'mood', 'tense', { restart: true }); // 頭へ戻す
     * mmsxx.audio.selectTake('曲', 'mood', 'tense', { now: true });     // 待たない
     * ```
     *
     * @param {string} name `defineBGM()` で登録した名前
     * @param {string} group グループの名前(`#takes mood` の mood)
     * @param {string} take 選択肢の名前(`#take tense` の tense)
     * @param {{restart?:boolean, now?:boolean}} [opts]
     *   restart = 囲みの頭へ戻して鳴らし直すか / now = 切れ目を待たないか
     *   (どちらも省くと曲の指定どおり)
     * @returns {boolean} 動いた囲みがあれば true
     */
    selectTake(name, group, take, opts = {}) {
      const def = this.bgmDefs.get(name);
      if (!Array.isArray(def)) return false;
      const picks = def.picks || (def.picks = {});
      let moved = false;
      for (const track of def) {
        for (const box of track.takes || []) {
          if (box.group !== group) continue;
          if (!box.options.some((o) => o.name === take)) continue;
          moved = true;
        }
      }
      if (!moved) return false;
      picks[group] = take;
      const apply = () => {
        this._takeWait = null;
        for (const track of def) this._rebuildTrack(track, picks);
      };
      if (this._takeWait) {
        clearTimeout(this._takeWait.timer);
        this._takeWait = null;
      }
      const flag = (key2) => def.some((track) => (track.takes || []).some((box) => box.group === group && box[key2]));
      const restart = opts.restart === void 0 ? flag("restart") : opts.restart === true;
      const now = opts.now === void 0 ? flag("now") : opts.now === true;
      const st = this.bgmState;
      const live = st && st.name === name && !st.paused && st.cursor != null;
      if (!live) {
        apply();
        return true;
      }
      const headFor = (at) => {
        let head = null;
        for (const track of def) {
          for (const box of track.takes || []) {
            if (box.group !== group) continue;
            if (at < box.at - 1e-9 || at >= box.at + box.dur - 1e-9) continue;
            if (head == null || box.at > head) head = box.at;
          }
        }
        return head;
      };
      const again = () => {
        const head = headFor(this.bgmPosition());
        apply();
        if (head != null) this.seekBGM(head);
      };
      const pts = now ? [] : this.bgmSwitchPoints(name);
      if (restart) {
        const at = this.bgmPosition();
        const pt2 = pts.find((t) => t > at + 1e-3);
        if (pt2 == null) {
          again();
          return true;
        }
        const ms2 = Math.max(0, (st.base + pt2 - this.ctx.currentTime) * 1e3);
        this._takeWait = { at: st.base + pt2, timer: setTimeout(again, ms2), run: apply };
        return true;
      }
      const inside = def.some((track) => (track.takes || []).some(
        (box) => box.group === group && st.cursor > box.at + 1e-9 && st.cursor < box.at + box.dur - 1e-9
      ));
      const pt = inside ? pts.find((t) => t > st.cursor + 1e-9) : null;
      if (pt == null) {
        apply();
        return true;
      }
      const ms = Math.max(0, (st.base + pt - 0.5 - this.ctx.currentTime) * 1e3);
      this._takeWait = { at: st.base + pt, timer: setTimeout(apply, ms), run: apply };
      return true;
    }
    /**
     * いま選んである選択肢を返す。`{ グループ: 選択肢 }`
     *
     * @param {string} name `defineBGM()` で登録した名前
     * @returns {Object<string,string>}
     */
    takesOf(name) {
      const def = this.bgmDefs.get(name);
      if (!Array.isArray(def)) return {};
      const out = {};
      for (const track of def) {
        for (const box of track.takes || []) {
          if (out[box.group] === void 0) {
            out[box.group] = (def.picks || {})[box.group] ?? box.options[0].name;
          }
        }
      }
      return out;
    }
    /**
     * 合図(`#cue`)を予約する。
     *
     * 音符と同じ範囲([from, to))を見て、そこにある合図を耳に届く時刻へ予約する。
     * 音は Web Audio の時計で 0.5 秒先まで積んであるので、合図だけ別に
     * 待たせないと、聞こえる前に届いてしまう(docs/DYNAMIC.md)。
     *
     * @param {object} track トラック
     * @param {number} ch 何本目か
     * @param {object} state 鳴らしている状態
     * @param {number} from 積む範囲の始まり(曲の中の秒)
     * @param {number} to 積む範囲の終わり
     */
    _scheduleCues(track, ch, state, from, to) {
      const list = track.cues;
      if (!list || !list.length) return;
      if (this._cueMute.has(ch)) return;
      for (const c of list) {
        if (c.t < from || c.t >= to) continue;
        const at = state.base + c.t;
        const wait = Math.max(0, (at - this.ctx.currentTime) * 1e3);
        const cue = { id: ++this._cueSeq, name: c.name, arg: c.arg, t: c.t, ch };
        const timer = setTimeout(() => {
          if (this.bgmState !== state) return;
          this._cues.push(cue);
          if (this._cues.length > 256) this._cues.splice(0, this._cues.length - 256);
          if (typeof this.onCue === "function") {
            try {
              this.onCue(cue);
            } catch (e) {
              console.warn("[ChpTnSnd] onCue:", e);
            }
          }
        }, wait);
        state.cueTimers.push(timer);
      }
    }
    /**
     * 溜まった合図を取り出して空にする。
     *
     * 毎フレーム呼ぶ使い方を想定している。実機の鳴らし手も同じ形になるので、
     * こちらを本筋にしてある。1 本で受けたいときは `onCue` を入れる。
     *
     * ```js
     * for (const cue of audio.takeCues()) {
     *   if (cue.name === 'flash') game.flash(cue.arg);
     * }
     * ```
     *
     * @returns {{id:number,name:string,arg:number,t:number,ch:number}[]} 出た順
     */
    takeCues() {
      const out = this._cues;
      this._cues = [];
      return out;
    }
    /**
     * そのチャンネルの合図を止める / 戻す。音は鳴ったままです。
     *
     * ミュートは出口の音量なので、黙らせても合図は出る。受け取った側が
     * `isMuted(ch)` を見て決める。合図だけ止めたいときはこちら。
     *
     * @param {number} ch 何本目か
     * @param {boolean} [on] true で止める。省くと入れ替える
     * @returns {boolean} 止まっているか
     */
    muteCues(ch, on) {
      const want = on === void 0 ? !this._cueMute.has(ch) : on === true;
      if (want) this._cueMute.add(ch);
      else this._cueMute.delete(ch);
      return want;
    }
    /** そのチャンネルの合図が止まっているか */
    cuesMuted(ch) {
      return this._cueMute.has(ch);
    }
    /** 予約してある合図を捨てる。止めたあとに演出だけ起きないようにする */
    _dropCues(state) {
      const s = state || this.bgmState;
      if (!s || !s.cueTimers) return;
      for (const t of s.cueTimers) clearTimeout(t);
      s.cueTimers = [];
    }
    /** 選んである選択肢のとおりに、トラックの並びを作り直す */
    _rebuildTrack(track, picks) {
      if (!track.takes || !track.takes.length) return;
      const inBox = (t) => track.takes.some((b) => t >= b.at - 1e-9 && t < b.at + b.dur - 1e-9);
      const out = track.base.filter((e) => !inBox(e.t));
      const cues = (track.baseCues || []).filter((c) => !inBox(c.t));
      const bars = (track.baseBars || []).filter((b) => !inBox(b));
      for (const box of track.takes) {
        const want = picks[box.group];
        const opt = box.options.find((o) => o.name === want) || box.options[0];
        for (const e of opt.events) out.push({ ...e, t: e.t + box.at });
        for (const c of opt.cues || []) cues.push({ ...c, t: c.t + box.at });
        for (const b of opt.bars || []) bars.push(b + box.at);
      }
      out.sort((a, b) => a.t - b.t);
      cues.sort((a, b) => a.t - b.t);
      bars.sort((a, b) => a - b);
      track.events = addEchoes(out, track.total);
      markRooms(track.events, track.loop ? track.loop.to : Infinity);
      track.cues = cues;
      track.bars = bars;
    }
    /**
     * 登録してある曲について、鳴らす前に分かることを返す。
     *
     * チャンネルの名前も、ラベルも、長さも、`defineBGM()` を通した時点で
     * 決まっている。鳴らしてからでないと読めないのは「いまどこか」だけ。
     *
     * ラベルの扱いは `bgmMarks()` と同じ。予約語(`START` `LOOP` `OUTRO`)も
     * 並ぶ。落としたいときだけ `{ hideSystem: true }` を渡す。
     *
     * @param {string} name `defineBGM()` で登録した名前
     * 選択肢(`#takes`)を書いた曲は `takes` に出る。グループごとに、選べる名前と
     * いま選んであるものが入る。画面はこれを見て押すところを並べられる。
     *
     * @param {{hideSystem?:boolean}} [opts] hideSystem = 予約語を落とすか(既定 false)
     * @returns {{ok:boolean, active:boolean, errors:object[], warnings:object[],
     *            tracks:{ch:number,name:string|null,role:string|null,
     *                    total:number,muted:boolean,
     *                    lanes:{name:string,label:string,muted:boolean}[]}[],
     *            marks:{name:string,t:number}[], meta:object,
     *            takes:{group:string,now:string,options:string[],
     *                   boxes:{ch:number,at:number,dur:number}[]}[],
     *            switches:{grid:number[],bars:number[]},
     *            cues:{name:string,arg:number,t:number,ch:number}[],
     *            loop:{from:number,to:number}|null,
     *            outro:number|null, ending:number|null, total:number}|null}
     *   登録が無ければ null
     */
    bgmInfo(name, opts = {}) {
      const def = this.bgmDefs.get(name);
      if (!def) return null;
      if (!Array.isArray(def)) {
        return {
          ok: true,
          active: true,
          errors: [],
          warnings: [],
          audio: true,
          tracks: [],
          marks: [],
          meta: {},
          takes: [],
          problems: [],
          loop: null,
          outro: null,
          ending: null,
          total: 0
        };
      }
      const check = def.check || { ok: true, errors: [], warnings: [] };
      const marks = gatherMarks(def, opts.hideSystem === true);
      return {
        ok: check.ok,
        active: this.bgmActive(name),
        errors: check.errors,
        warnings: check.warnings,
        tracks: def.map((t, i) => ({
          ch: i,
          name: t.name ?? null,
          role: t.role ?? null,
          // 同時に何声使うか。1 なら書いたとおりの 1 本
          voices: t.voices ?? 1,
          // 和音を鳴らすか。画面はこれを見て、声の数を出すかどうかを決められる
          chords: t.chords === true,
          // 中の層。開いて 1 つずつ止められる(`muteLane`)。
          // `name` は MML に書いた字、`label` は画面に出す呼び名
          lanes: (t.lanes ?? []).map((lane) => ({
            name: lane.name,
            label: lane.label,
            muted: this.isLaneMuted(i, lane.name)
          })),
          // 版と組(`#group`)と機械(`#machine`)。書いていなければ null。
          // いまどれが黙っているかは `bgmGroups()` が答える
          group: t.group ?? null,
          groupSet: t.groupSet ?? null,
          machine: t.machine ?? null,
          total: t.total,
          muted: this._chMute.has(i)
        })),
        marks,
        takes: takesInfo(def),
        // 切れ目。出どころで分けてある。画面はこれを見て濃さを変えられる
        switches: switchParts(def),
        // 読めなかったところ。`{ level, text, ch }` の並び。
        // 読み方(mode)にかかわらず控えてあるので、画面から出せる
        problems: def.problems || [],
        // 曲に置いた合図。選んである選択肢のぶんだけ並ぶ
        cues: def.flatMap((t, i) => (t.cues || []).map((c) => ({ ...c, ch: i }))).sort((a, b) => a.t - b.t),
        // 曲ぜんぶの覚え書き。チャンネルごとの `name` と `role` は外してある
        // (あちらは tracks に入っている)。版と組の一覧はここへ入れる —
        // 曲ぜんぶの持ち物で、出てきた順に並ぶ
        meta: { ...songMeta(def), ...groupsOf(def).length ? { groups: groupsOf(def) } : {} },
        loop: def.map((t) => t.loop).find(Boolean) ?? null,
        // 後奏の始まる秒。`#label OUTRO` を書いた曲だけが持つ。
        // 押すところを出すかどうかを、画面がこれで決められる(2026-09-15)。
        // `ending` は前の名前。読む側が直るまで、同じ値を両方の名前で返す
        outro: def.map((t) => t.outro).find((v) => v != null) ?? null,
        ending: def.map((t) => t.outro).find((v) => v != null) ?? null,
        total: Math.max(...def.map((t) => t.total), 0)
      };
    }
    /**
     * その曲の版と組(`#group`)。いま何を選んでいて、どこが黙るか。
     *
     * 何も選んでいなければ曲の既定で答える(先に出てきた版で、組は全部 on)。
     * `machine` は、いま鳴っているチャンネルのうち先に出てきたものの `#machine`。
     * 覚えて言うだけで、音は変えない(釣り合いの表はこれから)。
     *
     * @param {string} name `defineBGM()` で登録した名前
     * @returns {{groups:{name:string,sets:string[]}[], group:string|null,
     *            sets:string[], silent:number[], machine:string|null}|null}
     *   MML の曲でなければ null
     */
    bgmGroups(name) {
      const def = this.bgmDefs.get(name);
      if (!Array.isArray(def)) return null;
      return { groups: groupsOf(def), ...groupPick(def, this._groupOf(name)) };
    }
    /** 選んである版と組。別の曲のぶんなら忘れる(既定で答える) */
    _groupOf(name) {
      return this._group && this._group.song === name ? this._group : {};
    }
    /**
     * 版を選び、その中の組を on / off する。
     *
     * **鳴らしたまま差し替える。**止めて鳴らし直すと聞き比べられない。
     * 黙らせ方は音量 0 なので、後ろが詰まらない。
     *
     * 版を替えると、その版の組は全部 on に戻る。前の版の組の名前は、
     * 新しい版では別のものを指すため。
     *
     * @param {string} name `defineBGM()` で登録した名前
     * @param {{group?:string|null, sets?:string[]|null}} [pick]
     *   group = 選ぶ版。sets = on にする組。渡さなかったほうは今のまま
     * @returns {object|null} `bgmGroups()` と同じ形
     */
    selectGroups(name, pick = {}) {
      const def = this.bgmDefs.get(name);
      if (!Array.isArray(def)) return null;
      const now = this._groupOf(name);
      const group = pick.group !== void 0 ? pick.group : now.group ?? null;
      const same = String(group) === String(now.group ?? "");
      const sets = pick.sets !== void 0 ? pick.sets : same ? now.sets ?? null : null;
      const got = groupPick(def, { group, sets });
      this._group = { song: name, group: got.group, sets: got.sets };
      const st = this.bgmState;
      if (st && st.name === name && st.chGains) {
        st.groupOff = new Set(got.silent);
        for (let i = 0; i < st.chGains.length; i++) {
          st.chGains[i].gain.value = this._chVol(st, i);
        }
      }
      return { groups: groupsOf(def), ...got };
    }
    /**
     * そのチャンネルの音量つまみ。黙っていれば 0、そうでなければ音量の倍率
     * (`setTrackVolume()`。決めていなければ 1)。
     *
     * 自分で黙らせたものと、版と組で黙るものの両方を見る。どちらも音量 0 で、
     * 音符は消さない。押した内容と版の選び方は別に持つので、版を切り替えて
     * 戻れば、押していたものは押したまま。
     */
    _chVol(state, ch) {
      if (this._chMute.has(ch)) return 0;
      if (state && state.groupOff && state.groupOff.has(ch)) return 0;
      return this.trackVolume(ch);
    }
    /**
     * その名前が鳴らせるか。
     *
     * 登録してあって、読めないところが無ければ鳴らせる。読めない MML を
     * 渡した曲は登録は残るが鳴らせない。画面の側は、これを見て押せるかどうかを
     * 決められる(2026-09-15)。
     *
     * @param {string} name `defineBGM()` で登録した名前
     * @returns {boolean} 登録してあって、鳴らせるなら true
     */
    bgmActive(name) {
      const def = this.bgmDefs.get(name);
      if (!def) return false;
      if (!Array.isArray(def)) return true;
      return !def.check || def.check.ok;
    }
    /** 音声ファイルを読み込んでデコードする(結果はキャッシュ) */
    async _loadAudio(def) {
      if (def.buffer) return def.buffer;
      if (!def._loading) {
        def._loading = fetch(def.url).then((r) => r.arrayBuffer()).then((b) => new Promise((res, rej) => this.ctx.decodeAudioData(b, res, rej))).then((buf) => {
          def.buffer = buf;
          return buf;
        });
      }
      return def._loading;
    }
    /** 音声ファイルの BGM を鳴らす */
    _playAudioBGM(def, loop, state) {
      this._loadAudio(def).then((buffer) => {
        if (this.bgmState !== state) return;
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = loop;
        src.connect(state.gain);
        src.start(this.ctx.currentTime + 0.02);
        state.nodes.push(src);
      }).catch(() => {
      });
    }
    /**
     * SE を登録する。書式は BGM と同じで、鳴らすのは `playSE()`。
     *
     * `base` を付けると鳴らし分けられる SEになる。本体を 1 つ書いておいて、
     * 鳴らすときに音名と長さを渡すと、その高さへ移して頭からそのぶんだけ鳴らす
     * (詳しくは se.js)。
     *
     *   audio.defineSE('zap', '@{pulse(12)} v13 o5 c1', { base: 'c1' });
     *   audio.playSE('zap', 0, { note: 'c4b4e4', vol: 12 });
     *
     * @param {string} name 鳴らすときに使う名前。同じ名前で呼べば上書きになる
     * @param {string|string[]} mml MML。配列にすると 1 本が 1 チャンネル
     *   (和音や重ねはこれで書く)。書き方は docs/MML.md
     * @param {{beep?:boolean, base?:string|boolean}} [opts]
     *   beep = 1 ビットへ潰して鳴らす(8 ビット機のスピーカー)。
     *   `~` の掃引や `=` のロード音は、これを付けたときだけ効く。
     *   base = 本体を書いた高さと長さ。`'c1'`(= `true`)なら c の高さの全音符ぶん。
     *   付けると全音符が 64 フレームに固定されるので、`l64` が 1 フレームになる。
     *   このとき MML の `t` は書かない(書いても効くが、フレームとの対応が崩れる)
     */
    defineSE(name, mml, opts = {}) {
      const base = opts.base == null ? null : parseSEBase(opts.base);
      const head = base ? `t${SE_TEMPO} ` : "";
      const tracks = (Array.isArray(mml) ? mml : [mml]).map((t, i) => {
        const track = compileTrack(head + t);
        track.ch = i;
        if (opts.beep) markBeep(track);
        return track;
      });
      tracks.base = base;
      this.seDefs.set(name, tracks);
      return sayErrors(
        `SE "${name}"`,
        validateMML((Array.isArray(mml) ? mml : [mml]).map((t) => head + t))
      );
    }
    /**
     * BGM を再生する(別の曲が鳴っていれば止まる)。
     * 同じ曲がすでに鳴っている場合は何もしない(頭出しし直さない)。
     *
     * @param {string} name `defineBGM()` で登録した名前
     * @param {{loop?:boolean, restart?:boolean}} [opts]
     *   loop = 曲ぜんぶを鳴らし終えたあと、また頭から鳴らすか(既定 true)。
     *   restart = 同じ曲でも頭から鳴らし直すか(既定 false)
     * @returns {boolean} 鳴らしたか。`false` はその名前が登録されていないとき
     *   (`playSE()` が `0` を返すのと同じ位置づけ)
     */
    startBGM(name, opts = {}) {
      const loop = opts.loop !== false;
      const restart = opts.restart === true;
      this._mutesOf(name);
      const tracks = this.bgmDefs.get(name);
      if (!tracks || !this.ctx) return false;
      if (!this.bgmActive(name)) {
        console.warn(`[ChpTnSnd] BGM "${name}": \u76F4\u3059\u3068\u3053\u308D\u304C\u3042\u308B\u306E\u3067\u9CF4\u3089\u3057\u307E\u305B\u3093`);
        return false;
      }
      if (!restart && this.bgmState && this.bgmState.name === name && !this.bgmState.fading) {
        return true;
      }
      this._waitSwitch = null;
      if (this._switchTimer) {
        clearTimeout(this._switchTimer);
        this._switchTimer = 0;
      }
      const cur = this.bgmState;
      if (opts.now !== true && cur && cur.name && cur.name !== name && !cur.paused) {
        const wait = this._waitFor(cur.name, this.bgmPosition());
        if (wait > 0.01) {
          this._waitSwitch = { name, at: this.ctx.currentTime + wait };
          this._switchTimer = setTimeout(() => {
            this._switchTimer = 0;
            this._waitSwitch = null;
            this.startBGM(name, { ...opts, now: true });
          }, wait * 1e3);
          return true;
        }
      }
      this.stopBGM();
      const gain = this.ctx.createGain();
      gain.gain.value = 1;
      gain.connect(this._out());
      const state = { gain, timer: 0, nodes: [], name, baseGain: 1 };
      this.bgmState = state;
      const hushForJingle = () => {
        if (this.jingleState) gain.gain.value = 1e-4;
      };
      if (!Array.isArray(tracks)) {
        gain.gain.value = tracks.gain ?? 1;
        state.baseGain = gain.gain.value;
        hushForJingle();
        this.bgmVoices = 1;
        this._playAudioBGM(tracks, loop, state);
        return true;
      }
      hushForJingle();
      this.bgmVoices = tracks.length;
      state.groupOff = new Set(this.bgmGroups(name)?.silent ?? []);
      this._pump(tracks, loop, state, gain, () => this.bgmState === state);
      return true;
    }
    /**
     * MML の音符を「少し先の分だけ」こまめに積んでいく(先読みスケジューリング)。
     * 1 ループぶんをまとめて予約すると、その瞬間に何百個もノードを作ることになり、
     * 非力な端末ではひとコマぶんの引っかかりになるため。
     * BGM とジングルの両方から使う。alive() が false を返したら積むのをやめる。
     */
    _pump(tracks, loop, state, gain, alive) {
      const loopLen = Math.max(...tracks.map((t) => t.total), 0.01);
      const mark = tracks.map((t) => t.loop).find(Boolean) || null;
      const endAt = tracks.map((t) => t.outro).find((v) => v != null) ?? null;
      const loopTo = endAt != null ? Math.min(endAt, loopLen) : loopLen;
      const loopBack = mark ? mark.from : 0;
      if (mark) {
        tracks.forEach((t, i) => {
          if (t.loop && Math.abs(t.loop.from - mark.from) >= 1e-3) {
            console.warn(`[ChpTnSnd] MML: ${i + 1} \u672C\u76EE\u306E REPEAT \u306F\u307B\u304B\u3068\u9055\u3046\u3068\u3053\u308D\u306B\u3042\u308A\u307E\u3059 (${t.loop.from.toFixed(2)} \u79D2)\u3002\u6700\u521D\u306B\u898B\u3064\u3051\u305F ${mark.from.toFixed(2)} \u79D2\u306B\u5408\u308F\u305B\u307E\u3059`);
          }
        });
      }
      const want = tracks.map((t) => t.loop && t.loop.times).find((v) => v > 0) ?? null;
      if (want && this.loopTimes === this._loopTimesFromSong) this.loopTimes = want;
      if (want) this._loopTimesFromSong = want;
      const wants = loop || !!mark;
      state.chGains = tracks.map((t, i) => {
        const g = this.ctx.createGain();
        g.gain.value = this._chVol(state, i);
        g.connect(gain);
        return g;
      });
      state.muted = tracks.map((t, i) => this._chMute.has(i));
      state.tracks = tracks;
      const LOOKAHEAD = 0.5;
      const TICK_MS = 120;
      state.base = this.ctx.currentTime + 0.05;
      state.cursor = 0;
      state.length = loopLen;
      state.lapEnd = loopTo;
      state.endAt = endAt;
      state.inEnding = false;
      state.laps = 0;
      state.range = this._range;
      state.showBase = state.base;
      state.wraps = [];
      state.cueTimers = [];
      const wrapAt = (at, delta) => {
        state.base += delta;
        state.wraps.push({ at, base: state.base });
      };
      const pump = () => {
        if (!alive()) return;
        const now = this.ctx.currentTime;
        state.nodes = state.nodes.filter((n) => n.__endTime > now);
        let guard = 0;
        while (state.base + state.cursor < now + LOOKAHEAD && guard++ < 8) {
          const ab = state.range && state.cursor < state.range.to ? state.range : null;
          const limit = ab ? ab.to : state.inEnding ? loopLen : loopTo;
          const to = Math.min(limit, state.cursor + LOOKAHEAD);
          for (let i = 0; i < tracks.length; i++) {
            this._scheduleTrack(
              tracks[i],
              state.base,
              state.chGains[i],
              state.nodes,
              state.cursor,
              to,
              state.laps > 0 && !state.inEnding
            );
            this._scheduleCues(tracks[i], i, state, state.cursor, to);
          }
          this._wkFlushAll(state.nodes);
          state.cursor = to;
          if (state.cursor < limit) continue;
          if (ab) {
            wrapAt(state.base + ab.to, ab.to - ab.from);
            state.cursor = ab.from;
            continue;
          }
          const quit = () => {
            const end = state.base + state.cursor;
            state.timer = setTimeout(() => {
              if (alive()) this.stopBGM();
            }, Math.max(0, (end - this.ctx.currentTime) * 1e3) + 60);
          };
          const replay = wants && !this.ignoreSongLoop;
          if (state.inEnding) {
            if (!replay) {
              quit();
              return;
            }
            wrapAt(state.base + loopLen, loopLen);
            state.cursor = 0;
            state.laps = 0;
            state.inEnding = false;
            continue;
          }
          state.laps++;
          const laps = !!mark || endAt != null;
          const more = laps && !state.leaving && state.laps < this.loopTimes;
          if (!more) {
            if (state.endAt != null && this.playOutro) {
              state.inEnding = true;
              state.leaving = false;
              continue;
            }
            if (!replay) {
              quit();
              return;
            }
            wrapAt(state.base + loopTo, loopTo);
            state.cursor = 0;
            state.laps = 0;
            continue;
          }
          wrapAt(state.base + loopTo, loopTo - loopBack);
          state.cursor = loopBack;
        }
        state.timer = setTimeout(pump, TICK_MS);
      };
      state.pump = pump;
      pump();
    }
    /**
     * BGM を止めずに、その場で凍らせる(ゲームのポーズ用)。
     *
     * `stopBGM()` との違いは、続きから鳴らし直せること。
     * 止めてしまうと `playBGM()` で頭出しし直すことになり、
     * ポーズを抜けるたびにイントロから鳴ってしまう。
     *
     * 音声ファイルの BGM は途中の位置を持てないので、黙らせるだけにする
     * (裏で進み続けるので、戻したときに少し先へ飛ぶ)。
     */
    pauseBGM() {
      const s = this.bgmState;
      if (!s || !this.ctx || s.paused) return;
      s.paused = true;
      if (!s.pump) {
        this._muteBGM(true);
        return;
      }
      if (s.timer) {
        clearTimeout(s.timer);
        s.timer = 0;
      }
      const off = this.ctx.currentTime - s.base;
      s.offset = Math.max(0, Math.min(Math.max(0, s.length - 0.02), off));
      for (const n of s.nodes) {
        try {
          n.stop(0);
        } catch (e) {
        }
      }
      s.nodes = [];
    }
    /** 凍らせた BGM を続きから鳴らし直す */
    resumeBGM() {
      const s = this.bgmState;
      if (!s || !this.ctx || !s.paused) return;
      s.paused = false;
      if (!s.pump) {
        this._muteBGM(false);
        return;
      }
      const off = s.offset || 0;
      s.base = this.ctx.currentTime + 0.05 - off;
      s.cursor = off;
      s.offset = 0;
      s.pump();
    }
    /**
     * ジングル(ファンファーレなど)を鳴らす。
     * BGM は止めずに、鳴っているあいだだけ黙らせる。
     * 鳴り終わると BGM が続きから聞こえてくるので、
     * イントロの長い曲でも頭から鳴り直さない。
     * @param {string} name BGM として登録してある短い曲
     * @returns {number} 鳴っている長さ(秒)。0 なら鳴らせなかった
     */
    playJingle(name) {
      const tracks = this.bgmDefs.get(name);
      if (!tracks || !this.ctx) return 0;
      this.stopJingle();
      const gain = this.ctx.createGain();
      gain.gain.value = 1;
      gain.connect(this._out());
      const state = { gain, timer: 0, nodes: [], name };
      this.jingleState = state;
      this._muteBGM(true);
      let sec = 0;
      if (!Array.isArray(tracks)) {
        gain.gain.value = tracks.gain ?? 1;
        this._playAudioBGM(tracks, false, state);
        sec = tracks.duration || 3;
      } else {
        this._pump(tracks, false, state, gain, () => this.jingleState === state);
        sec = state.length;
      }
      state.endTimer = setTimeout(() => {
        if (this.jingleState === state) this.stopJingle();
      }, sec * 1e3 + 120);
      return sec;
    }
    /** ジングルを止めて、BGM の音を戻す */
    stopJingle() {
      const s = this.jingleState;
      if (!s) return;
      this.jingleState = null;
      clearTimeout(s.timer);
      clearTimeout(s.endTimer);
      for (const n of s.nodes) {
        try {
          n.stop(0);
        } catch (e) {
        }
      }
      try {
        s.gain.disconnect();
      } catch (e) {
      }
      this._muteBGM(false);
    }
    /** ジングルが鳴っているか */
    get jingling() {
      return !!this.jingleState;
    }
    /** BGM を黙らせる / 戻す(止めないので、曲は裏で進み続ける) */
    _muteBGM(on) {
      const s = this.bgmState;
      if (!s || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        s.gain.gain.cancelScheduledValues(t);
        s.gain.gain.setValueAtTime(s.gain.gain.value, t);
        s.gain.gain.linearRampToValueAtTime(on ? 1e-4 : s.baseGain ?? 1, t + 0.05);
      } catch (e) {
      }
    }
    /**
     * BGM を少しずつ小さくして止める。
     * @param {number} [sec=1.5] フェードにかける秒数
     */
    fadeOutBGM(sec = 1.5) {
      const s = this.bgmState;
      if (!s || !this.ctx) return;
      const t = this.ctx.currentTime;
      s.fading = true;
      try {
        s.gain.gain.cancelScheduledValues(t);
        s.gain.gain.setValueAtTime(s.gain.gain.value, t);
        s.gain.gain.linearRampToValueAtTime(1e-4, t + sec);
      } catch (e) {
      }
      setTimeout(() => {
        if (this.bgmState === s) this.stopBGM();
      }, sec * 1e3 + 50);
    }
    /**
     * BGM を再生する。古い呼び方。新しくは `startBGM(name, { … })` を使う。
     *
     * 引数が増えるたびに真偽値が並ぶ形になっていたので、名前を分けて
     * options を取るほうへ寄せた。こちらは当分そのまま動くが、呼ぶと 1 度だけ
     * 知らせが出る(2026-09-15)。
     *
     * @param {string} name `defineBGM()` で登録した名前
     * @param {boolean} [loop=true] 曲ぜんぶを鳴らし終えたあと、また頭から鳴らすか
     * @param {boolean} [restart=false] 同じ曲が鳴っていても、頭から鳴らし直すか
     * @returns {boolean} 鳴らしはじめたら true
     */
    playBGM(name, loop = true, restart = false) {
      oldWay("playBGM()", "startBGM(name, { loop, restart }) \u3092\u4F7F\u3044\u307E\u3059\u3002");
      return this.startBGM(name, { loop, restart });
    }
    /**
     * BGM を鳴らさずに、書き出し用の音として計算する(WAV や動画の素材用)。
     *
     * `OfflineAudioContext` は音の出口を使わないので、
     * 画面を持たないブラウザ(ヘッドレス)でもそのまま動く。
     *
     * きもは、鳴らすときと同じ `_scheduleTrack` を通すこと。
     * 書き出し用のレンダラーをもう 1 つ書くと、エンベロープの端やエコーの重なりで
     * 少しずつずれていき、しかも「書き出したときだけ変」という
     * 一番気づきにくい形で出る。以前 game/wavexport.js がそれで消えている。
     *
     * 先読み(`_pump`)は通さない。あれは非力な端末で引っかからないための刻みで、
     * 計算するだけの書き出しには要らない。まるごと一度に積む。
     *
     * @param {string} name `defineBGM()` で登録した名前(音声ファイルの BGM は不可)
     * @param {{loops?:number, intro?:boolean, outro?:boolean, mute?:number[],
     *          tail?:number, sampleRate?:number, channels?:number}} [opts]
     *   loops = 本編を何周ぶん並べるか。書かなければ曲の `#looptimes`、
     *   それも無ければ 2(鳴らすときの `loopTimes` と揃えてある)。
     *   intro = 前奏(`REPEAT` より手前)を入れるか(既定 true)。
     *   outro = 後奏(`OUTRO` より後ろ)を入れるか(既定 true。前の名前 `ending` も効く)。
     *   鳴らすときの `loopTimes` は見ない。あちらは `Infinity` を取れるので、
     *   何周ぶん焼くかは書き出す側が決める。
     *   group = 焼く版(`#group` の 1 つめの語)。省くと、選んである版か曲の既定。
     *   `'ALL'` を渡すと版ごとに 1 本ずつ焼いて、順につなげる(下記)。
     *   組(2 つめの語)は受け取らない。焼くときはいつも全部 on —
     *   組は鳴らして耳で比べるためのもので、一部だけ抜いて焼く用事が無い。
     *   gap = `'ALL'` のときに版のあいだへ入れる無音(秒。既定 0.5)。
     *   mute = 黙らせるチャンネルの番号。省くと、いま黙らせてあるものに従う。
     *   `[]` を渡せば全部鳴る。画面で作った音がそのまま落ちるようにするため
     *   (2026-09-15)。
     *   tail = 最後の音の余韻とエコーを入れる後ろの余白(秒。既定 0.5)。
     *   sampleRate = 既定 44100。channels = 既定 1。
     *   定位は channels に合わせる — 1 なら位置を無視(いままでと同じ出力)、
     *   2 なら左右に振る。`spatial` で明かに指定してもよいが、
     *   `'hrtf'` はブラウザごとに出力が変わるので焼くのには向かない。
     *   seed = ノイズの種(既定 1)。同じ種なら何度焼いても同じファイルになる。
     *   別のノイズが欲しいときだけ変える。
     *   onProgress = 進み具合(0〜1)を受け取る。長い曲で待たせるときに使う。
     *   stop = やめるかどうかを返すもの。`true` を返した時点で計算を止める
     * @returns {Promise<AudioBuffer|null>} 途中でやめたときは null
     */
    async renderBGM(name, opts = {}) {
      const def = this.bgmDefs.get(name);
      if (!def) throw new Error(`[ChpTnSnd] BGM "${name}" \u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093`);
      if (!Array.isArray(def)) {
        throw new Error(`[ChpTnSnd] BGM "${name}" \u306F\u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u306A\u306E\u3067\u66F8\u304D\u51FA\u305B\u307E\u305B\u3093(MML \u306E\u66F2\u3060\u3051\u304C\u5BFE\u8C61\u3067\u3059)`);
      }
      const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
      if (!OAC) {
        throw new Error("[ChpTnSnd] OfflineAudioContext \u304C\u3042\u308A\u307E\u305B\u3093(\u66F8\u304D\u51FA\u3057\u306B\u306F\u30D6\u30E9\u30A6\u30B6\u304C\u8981\u308A\u307E\u3059\u3002\u753B\u9762\u306F\u7121\u304F\u3066\u304B\u307E\u3044\u307E\u305B\u3093)");
      }
      if (String(opts.group ?? "") === "ALL") return this._renderChain(name, opts);
      const tail = Math.max(0, opts.tail ?? 0.5);
      const rate = opts.sampleRate ?? 44100;
      const channels = opts.channels ?? 1;
      const cut = songParts(def, {
        loops: opts.loops,
        intro: opts.intro,
        // `ending` は前の名前。どちらで書いても効く
        outro: opts.outro ?? opts.ending
      });
      const parts = cut.parts.map((p) => [p.from, p.to]);
      const frames = Math.ceil((cut.span + tail) * rate);
      const off = new Set(opts.mute ?? this.mutedTracks());
      for (const i of groupPick(def, {
        group: opts.group !== void 0 ? opts.group : this._groupOf(name).group ?? null
      }).silent) off.add(i);
      const ctx = new OAC(channels, frames, rate);
      const saved = {
        ctx: this.ctx,
        bus: this._bus,
        master: this._master,
        noise: this.noiseBuffer,
        waveCache: this._waveCache,
        pulseCache: this._pulseCache,
        modCache: this._modCache,
        wk: this._wk,
        wkReady: this._wkReady,
        keepSec: this._keepSec,
        muted: this._muted,
        spatial: this.spatial,
        regLog: this._regLog,
        opllFixed: this._opllFixed
      };
      try {
        this.ctx = ctx;
        this._bus = null;
        this._master = null;
        this._waveCache = null;
        this._pulseCache = null;
        this._modCache = null;
        this._wk = null;
        this._wkReady = null;
        this.spatial = opts.spatial ?? (channels >= 2 ? "stereo" : "mono");
        this._keepSec = 0;
        this._muted = false;
        this._regLog = typeof opts.regs === "function";
        this._opllFixed = !!opts.opllFixed;
        const rand = seededRandom(opts.seed ?? 1);
        this.noiseBuffer = ctx.createBuffer(1, rate, rate);
        const d = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < rate; i++) d[i] = rand() * 2 - 1;
        for (const kind of this._wkKinds(def)) await this._wkLoad(kind);
        const dest = this._out();
        const nodes = [];
        let at = 0;
        const outs = def.map((t, i) => {
          const v = this.trackVolume(i);
          if (v === 1) return dest;
          const g = ctx.createGain();
          g.gain.value = v;
          g.connect(dest);
          return g;
        });
        parts.forEach(([a, b], k) => {
          const again = k > cut.lapAt && k < cut.lapAt + cut.loops;
          def.forEach((t, i) => {
            if (off.has(i)) return;
            this._scheduleTrack(t, at - a, outs[i], nodes, a, b, again);
          });
          at += b - a;
        });
        this._wkFlushAll(nodes);
        const secs = frames / rate;
        let quit = false;
        const stopped = new Promise((done) => {
          if (!opts.onProgress && !opts.stop) return;
          const span = Math.max(0.25, secs / 60);
          const tick = (v) => Math.round(v * rate / 128) * 128 / rate;
          const next = (at2) => {
            const t = tick(at2);
            if (t <= 0 || t >= secs) return;
            ctx.suspend(t).then(() => {
              if (opts.stop && opts.stop()) {
                quit = true;
                done(null);
                return;
              }
              if (opts.onProgress) opts.onProgress(t / secs);
              next(t + span);
              ctx.resume();
            }).catch(() => {
            });
          };
          next(span);
        });
        const buf = await Promise.race([ctx.startRendering(), stopped]);
        if (quit) return null;
        if (opts.onProgress) opts.onProgress(1);
        if (this._regLog) opts.regs(await this._collectRegs());
        return buf;
      } finally {
        this.ctx = saved.ctx;
        this._bus = saved.bus;
        this._master = saved.master;
        this.noiseBuffer = saved.noise;
        this._waveCache = saved.waveCache;
        this._pulseCache = saved.pulseCache;
        this._modCache = saved.modCache;
        this._wk = saved.wk;
        this._wkReady = saved.wkReady;
        this._keepSec = saved.keepSec;
        this._muted = saved.muted;
        this.spatial = saved.spatial;
        this._regLog = saved.regLog;
        this._opllFixed = saved.opllFixed;
      }
    }
    /**
     * 焼き終わったあとで、処理器が流してきたレジスタの記録を集める。
     *
     * 記録は処理器から `port` に積まれていて、受け口を開いた時点で順に届く。
     * 1 通ずつ別のタスクで届くので、増えなくなるまでタイマーを挟んで待つ。
     * 返すのは処理器の種類ごとの平らな並び `[時刻, レジスタ, 値, …]`
     * (チャンネルごとではなく、チップに書いた順そのまま)
     */
    async _collectRegs() {
      const out = {};
      if (this._wk) {
        for (const [kind, bank] of this._wk) {
          for (const node of bank.node.values()) {
            if (!node.port) continue;
            const list = out[kind] || (out[kind] = []);
            node.port.onmessage = (e) => {
              const r = e.data && e.data.regs;
              if (r) for (let i = 0; i < r.length; i++) list.push(r[i]);
            };
          }
        }
      }
      let seen = -1;
      for (; ; ) {
        await new Promise((done) => setTimeout(done, 5));
        const n = Object.values(out).reduce((a, l) => a + l.length, 0);
        if (n === seen) break;
        seen = n;
      }
      return out;
    }
    /**
     * 版を全部つなげて焼く(`renderBGM(name, { group: 'ALL' })`)。
     *
     * 曲の頭から終わりまでを版ごとに焼いて、出てきた順に並べる。
     * 聞き比べるのにいちばん速い形で、押し替えるより続けて聞けるほうが分かる。
     * あいだに無音を挟むのは、版の切れ目が耳で分かるようにするため。
     * 組はその版の既定(全部 on)。
     *
     * @param {string} name `defineBGM()` で登録した名前
     * @param {object} opts `renderBGM()` と同じもの。`gap` は版のあいだの無音(秒)
     * @returns {Promise<AudioBuffer|null>} 途中でやめたときは null
     */
    async _renderChain(name, opts = {}) {
      const def = this.bgmDefs.get(name);
      const list = groupsOf(def).map((g) => g.name);
      const gap = Math.max(0, opts.gap ?? 0.5);
      if (list.length < 2) {
        return this.renderBGM(name, { ...opts, group: list[0] ?? null });
      }
      const bufs = [];
      for (let i = 0; i < list.length; i++) {
        const buf = await this.renderBGM(name, {
          ...opts,
          group: list[i],
          onProgress: opts.onProgress ? (v) => opts.onProgress((i + v) / list.length) : void 0
        });
        if (!buf) return null;
        bufs.push(buf);
      }
      const rate = bufs[0].sampleRate;
      const chs = bufs[0].numberOfChannels;
      const pad = Math.round(gap * rate);
      const frames = bufs.reduce((n, b) => n + b.length, 0) + pad * (bufs.length - 1);
      const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
      const out = new OAC(chs, frames, rate).createBuffer(chs, frames, rate);
      let at = 0;
      for (const b of bufs) {
        for (let c = 0; c < chs; c++) out.getChannelData(c).set(b.getChannelData(c), at);
        at += b.length + pad;
      }
      return out;
    }
    /**
     * いま曲のどこを鳴らしているか(秒)。
     *
     * 止めているあいだは止めた位置を返す。くり返しの中の位置なので、
     * 2 周目でも 0 から `bgmLength()` のあいだに収まる。
     * 音声ファイルの BGM は途中の位置を持てないので 0 を返す。
     * @returns {number}
     */
    bgmPosition() {
      const s = this.bgmState;
      if (!s || !this.ctx || !s.pump) return 0;
      if (s.paused) return s.offset || 0;
      const now = this.ctx.currentTime;
      while (s.wraps && s.wraps.length && now >= s.wraps[0].at) s.showBase = s.wraps.shift().base;
      return Math.max(0, Math.min(s.length || 0, now - (s.showBase ?? s.base)));
    }
    /** くり返し 1 周ぶんの長さ(秒)。鳴っていなければ 0 */
    bgmLength() {
      const s = this.bgmState;
      return s && s.pump ? s.length || 0 : 0;
    }
    /**
     * 鳴らす範囲を決める(AB リピート)。
     *
     * A から B までを回りつづける。曲に書いたくり返しや後奏より強い —
     * 曲の作りではなく、聴いている人がいま選んだものなので。
     *
     * 範囲の外へ跳んでもよい。止めずにそのまま鳴らし、B をまたぐところで
     * A へ戻す。B より後ろへ跳んだときは、そのまま曲を進む(2026-09-15)。
     *
     * @param {number} from A(秒)
     * @param {number} to B(秒)。前後は入れ替えてよい
     * @returns {{from:number,to:number}|null} 短すぎるときは null
     */
    setRange(from, to) {
      const a = Math.max(0, Math.min(from, to));
      const b = Math.max(from, to);
      this._range = b - a > 0.05 ? { from: a, to: b } : null;
      if (this.bgmState) this.bgmState.range = this._range;
      return this._range;
    }
    /** 範囲を外す。曲の作りどおりに戻る */
    clearRange() {
      this._range = null;
      if (this.bgmState) this.bgmState.range = null;
    }
    /**
     * いまの範囲。無ければ null。
     * @returns {{from:number,to:number}|null}
     */
    bgmRange() {
      return this._range;
    }
    /**
     * 曲の途中へ跳ぶ。
     *
     * 鳴っているものを止めてから、その位置で積み直す。止めている最中に呼べば、
     * 戻したときにそこから始まる。
     *
     * 常駐の処理器で鳴らしているもの(4 オペ・幅の表)は、跳んだあとも
     * 積んだぶんが鳴り切る。ポーズと同じ弱点(docs/TODO.md)。
     *
     * @param {number} sec 頭から何秒のところか。曲より長いと終わりへ寄せる
     */
    seekBGM(sec) {
      const s = this.bgmState;
      if (!s || !this.ctx || !s.pump) return;
      if (this._takeWait) {
        clearTimeout(this._takeWait.timer);
        this._takeWait.run();
      }
      this._dropCues(s);
      let to = Math.max(0, Math.min(Math.max(0, (s.length || 0) - 0.02), sec));
      if (Array.isArray(s.tracks)) {
        const SNAP = 5e-3;
        let head = null;
        for (const track of s.tracks) {
          for (const ev of track.events) {
            if (ev.t > to + 1e-9 || ev.t < to - SNAP) continue;
            if (head == null || ev.t < head) head = ev.t;
          }
        }
        if (head != null) to = head;
      }
      if (s.timer) {
        clearTimeout(s.timer);
        s.timer = 0;
      }
      for (const n of s.nodes) {
        try {
          n.stop(0);
        } catch (e) {
        }
      }
      s.nodes = [];
      s.inEnding = s.endAt != null && to >= s.lapEnd;
      if (s.paused) {
        s.offset = to;
        return;
      }
      s.base = this.ctx.currentTime + 0.05 - to;
      s.showBase = s.base;
      s.wraps = [];
      s.cursor = to;
      s.pump();
    }
    /**
     * 音色について、何を渡せて、それぞれ何を意味するか(`sound/mml.js` の `describeVoice`)。
     * 作り分けを持つ音色なら軸と値と既定を、名前に作り分けを書けば選ばれた値も返す。
     * AI が名前から見当をつけずに済むように置いてある
     *
     * @param {string} name `lyPair` `pulse(25)` など
     */
    describeVoice(name) {
      return describeVoice(name);
    }
    /** 作り分けを持つ音色の仲間の名前(`describeVoice` に渡せる) */
    voiceFamilies() {
      return listVoiceFamilies();
    }
    /**
     * いま鳴っている曲のチャンネル一覧。
     *
     * 名前と役割は MML の注釈に書いたもの(`#name 主旋律`)。
     * 書いていなければ null なので、出す側が `ch1` のような札を当てる。
     * @returns {{ch:number, name:string|null, role:string|null, muted:boolean}[]}
     */
    bgmTracks() {
      const s = this.bgmState;
      if (!s || !s.tracks) return [];
      return s.tracks.map((t, i) => ({
        ch: i,
        name: t.name ?? null,
        role: t.role ?? null,
        muted: !!s.muted[i]
      }));
    }
    /**
     * いま鳴っている曲のラベル。跳ぶ先として使う。
     *
     * MML の注釈に `#label サビ` と書いたところ。どのチャンネルに書いても
     * 並ぶので、旋律のチャンネルにだけ書けば足りる。
     * 同じ名前は 1 つにまとめる(全部のチャンネルに書いても増えない)。
     *
     * 曲の頭のラベル(`START`)はこちらで足す。書く人に毎回書かせるものでは
     * ないし、頭出しの押しどころはどの曲にも要る(2026-09-16)。
     *
     * 予約語(`START` `LOOP` `OUTRO`)も並べる。`LOOP` も `OUTRO` も
     * 聞く人が跳びたい場所そのものなので、隠す理由が無かった。
     * 落としたいときだけ `{ hideSystem: true }` を渡す。
     *
     * @param {{hideSystem?:boolean}} [opts] hideSystem = 予約語を落とすか(既定 false)
     * @returns {{name:string, t:number}[]} 秒の早い順
     */
    bgmMarks(opts = {}) {
      const s = this.bgmState;
      if (!s || !s.tracks) return [];
      return gatherMarks(s.tracks, opts.hideSystem === true);
    }
    /**
     * ラベルの名前から、頭から何秒のところかを返す。
     *
     * 一覧を引いて探すのは毎回同じ書き方になるので、1 行で済むようにした。
     * 名前で呼んだときは予約語も返す。書いた人が `REPEAT` と名指ししたなら、
     * それが欲しいということなので隠さない(2026-09-15)。
     *
     * 曲の名前を渡せば、鳴らす前のものも読める。省くと、いま鳴っている曲を見る。
     *
     * @param {string} name ラベルの名前。大文字小文字と前後の空白は見ない
     * @param {string} [song] `defineBGM()` で登録した曲の名前
     * @returns {number|null} 秒。その名前が無ければ null
     */
    bgmMarkAt(name, song) {
      const want = String(name ?? "").trim().toLowerCase();
      if (!want) return null;
      const list = song === void 0 ? this.bgmMarks({ system: true }) : this.bgmInfo(song, { system: true })?.marks ?? [];
      const hit = list.find((m) => m.name.trim().toLowerCase() === want);
      return hit ? hit.t : null;
    }
    /**
     * 戻る先。`#label REPEAT` を書いた曲だけ持つ。
     *
     * ラベルと同じで「曲のこの位置」を指すものなので、跳ぶ先としても使える。
     * 違うのは、ここが終わりに来たときの動きまで決めるところ。
     * @returns {{from:number, to:number}|null}
     */
    bgmLoop() {
      const s = this.bgmState;
      if (!s || !s.tracks) return null;
      return s.tracks.map((t) => t.loop).find(Boolean) ?? null;
    }
    /**
     * いま鳴っている音を、チャンネルごとに返す。
     *
     * 出た音を測るのではなく、音符とエンベロープから計算する。
     * `AnalyserNode` も FFT も要らないので、外部依存ゼロのまま。
     * 実機の鳴らし手もチャンネルごとに「いまの音符と音量」を持っているので、
     * あちらでも同じものが読める(2026-09-15)。
     *
     * 絵を音に合わせて動かすのに使う。知らせを配る形にすると、速い曲で
     * 毎秒 20〜30 回になり、しかも JS では音符 1 つずつタイマーを仕掛ける
     * ことになる。絵は毎コマ描くので、そのときに聞きに来るほうが安い。
     *
     * 和音は同じチャンネルに重なるので、1 本から何個も返ることがある。
     *
     * 層(`#drum` の字と `#chord` の声)を持つ音符は、その名前も返す。
     * 画面が中を開いたときに、どの層が鳴っているかを言えるようにするため。
     *
     * @param {number} [sec] 曲の中の秒。省くと、いま鳴らしているところ
     * @returns {{ch:number, freq:number, vol:number, level:number, t:number,
     *            age:number, muted:boolean, lane:string|undefined}[]}
     */
    notesAt(sec) {
      const s = this.bgmState;
      if (!s || !s.tracks) return [];
      const pos = sec ?? this.bgmPosition();
      const out = [];
      s.tracks.forEach((track, ch) => {
        const evs = track.events;
        let lo = 0, hi = evs.length - 1, at = -1;
        while (lo <= hi) {
          const mid = lo + hi >> 1;
          if (evs[mid].t <= pos) {
            at = mid;
            lo = mid + 1;
          } else hi = mid - 1;
        }
        for (let i = at; i >= 0 && i > at - 24; i--) {
          const ev = evs[i];
          const age = pos - ev.t;
          if (age < 0 || age >= ev.gate) continue;
          const off = this._chMute.has(ch) || ev.lane !== void 0 && this._laneMute.has(`${ch}/${ev.lane}`);
          out.push({
            ch,
            freq: freqAt(ev, age),
            vol: ev.vol,
            level: off ? 0 : levelAt(ev, age),
            t: ev.t,
            age,
            muted: this._chMute.has(ch),
            lane: ev.lane
          });
        }
      });
      return out;
    }
    /**
     * チャンネルごとの、いまの音量(0〜1)。
     *
     * 鳴っていないチャンネルは 0。黙らせてあるチャンネルも 0。
     * 和音が重なっているところは、いちばん大きいものを返す。
     * @param {number} [sec] 曲の中の秒。省くと、いま鳴らしているところ
     * @returns {number[]}
     */
    levels(sec) {
      const s = this.bgmState;
      if (!s || !s.tracks) return [];
      const out = s.tracks.map(() => 0);
      for (const n of this.notesAt(sec)) out[n.ch] = Math.max(out[n.ch], n.level);
      return out;
    }
    /**
     * チャンネルを 1 本だけ黙らせる / 戻す。
     *
     * 黙らせても曲は進む。戻せば、その時点から続きが聞こえる。
     * @param {number} ch 0 から数える
     * @param {boolean} [on] 省略すると切り替え
     * @returns {boolean} 黙っているか
     */
    muteTrack(ch, on) {
      const to = on === void 0 ? !this._chMute.has(ch) : !!on;
      if (to) this._chMute.add(ch);
      else this._chMute.delete(ch);
      const s = this.bgmState;
      if (s && s.chGains && s.chGains[ch]) {
        s.muted[ch] = to;
        s.chGains[ch].gain.value = this._chVol(s, ch);
      }
      return to;
    }
    /**
     * 黙らせてある番号を、この曲のものに合わせる。別の曲なら忘れる。
     *
     * 同じ曲を積み直すだけなら残す。聞き比べの途中で押し直しても、
     * 黙らせたところはそのままになる
     */
    _mutesOf(name) {
      if (this._muteFor === name) return;
      this._muteFor = name;
      this._chMute.clear();
      this._chLevel.clear();
      this._laneMute.clear();
      this._group = null;
    }
    /**
     * チャンネルの音量の倍率を決める。MML の `v` とは関係なく、鳴らす側で掛ける。
     *
     * 1 がそのまま。1 より大きくもできる(曲のバランスを探るため)。0〜4 に収める。
     * 鳴っていなければ覚えるだけで、次に鳴らすときに効く。書き出しにも乗る。
     * @param {number} ch 0 から数える
     * @param {number} v 倍率
     * @returns {number} 収めたあとの倍率
     */
    setTrackVolume(ch, v) {
      const to = Math.max(0, Math.min(4, Number(v) || 0));
      if (to === 1) this._chLevel.delete(ch);
      else this._chLevel.set(ch, to);
      const s = this.bgmState;
      if (s && s.chGains && s.chGains[ch]) s.chGains[ch].gain.value = this._chVol(s, ch);
      return to;
    }
    /**
     * チャンネルの音量の倍率。決めていなければ 1。
     * @param {number} ch 0 から数える
     * @returns {number}
     */
    trackVolume(ch) {
      return this._chLevel.get(ch) ?? 1;
    }
    /** チャンネルの音量の倍率を、全部 1 に戻す */
    resetTrackVolumes() {
      this._chLevel.clear();
      const s = this.bgmState;
      if (!s || !s.chGains) return;
      for (let i = 0; i < s.chGains.length; i++) s.chGains[i].gain.value = this._chVol(s, i);
    }
    /**
     * いま黙らせてあるチャンネルの番号。小さい順。
     *
     * 鳴っていなくても答える。押した内容はエンジンが持っているので、
     * 画面の側で控えなくてよい(2026-09-15)。
     * 別の曲を登録するか鳴らすかしたところで空になる。
     * @returns {number[]}
     */
    mutedTracks() {
      return [...this._chMute].sort((a, b) => a - b);
    }
    /**
     * いま黙っているか。`muteTrack()` で入れた番号かどうかを見る。
     * @param {number} ch 0 から数える
     * @returns {boolean}
     */
    isMuted(ch) {
      return this._chMute.has(ch);
    }
    /**
     * チャンネルの中の層を 1 つだけ黙らせる / 戻す。
     *
     * 層は `#drum` の字と `#chord` の声(`bgmInfo().tracks[].lanes`)。
     * チャンネルをまとめて止めるのとは別に持つので、まとめて止めてから
     * 開いても、中の押し具合は残る。
     *
     * チャンネルの音量つまみと違って、こちらは積むときに外す。すでに積んだぶんは
     * 鳴り切るので、押してから効くまでに先読みのぶん(1 秒ほど)かかる。
     *
     * @param {number} ch 0 から数える
     * @param {string} lane 層の名前
     * @param {boolean} [on] 省略すると切り替え
     * @returns {boolean} 黙っているか
     */
    muteLane(ch, lane, on) {
      const key2 = `${ch}/${lane}`;
      const to = on === void 0 ? !this._laneMute.has(key2) : !!on;
      if (to) this._laneMute.add(key2);
      else this._laneMute.delete(key2);
      return to;
    }
    /**
     * その層が黙っているか。
     * @param {number} ch 0 から数える
     * @param {string} lane 層の名前
     * @returns {boolean}
     */
    isLaneMuted(ch, lane) {
      return this._laneMute.has(`${ch}/${lane}`);
    }
    /**
     * いま黙らせてある層。`{ch, lane}` の並び。
     * @returns {{ch:number, lane:string}[]}
     */
    mutedLanes() {
      return [...this._laneMute].map((k) => {
        const at = k.indexOf("/");
        return { ch: Number(k.slice(0, at)), lane: k.slice(at + 1) };
      });
    }
    /**
     * 黙らせるチャンネルを、まとめて決める。
     *
     * 書いた番号だけが黙り、ほかは鳴る。1 本ずつ呼ぶのと違って、
     * 切り替わりが同じ瞬間に起きる。
     * 「1 と 2 を消して 3 と 4 を出す」のような聞き比べに要る。
     * @param {number[]} chs 黙らせるチャンネルの番号
     */
    muteTracks(chs) {
      this._chMute = new Set(chs || []);
      const s = this.bgmState;
      if (!s || !s.chGains) return;
      for (let i = 0; i < s.chGains.length; i++) {
        s.muted[i] = this._chMute.has(i);
        s.chGains[i].gain.value = this._chVol(s, i);
      }
    }
    /** BGM を停止する */
    stopBGM() {
      if (this._switchTimer) {
        clearTimeout(this._switchTimer);
        this._switchTimer = 0;
      }
      this._waitSwitch = null;
      if (this._takeWait) {
        clearTimeout(this._takeWait.timer);
        this._takeWait.run();
      }
      this._dropCues();
      const s = this.bgmState;
      if (!s) return;
      this.bgmState = null;
      this.bgmVoices = 0;
      clearTimeout(s.timer);
      for (const n of s.nodes) {
        try {
          n.stop(0);
        } catch (e) {
        }
      }
      try {
        s.gain.disconnect();
      } catch (e) {
      }
    }
    /**
     * SE を再生する。
     * 空いている音があればそこで鳴らすので、ショットと爆発が同時に鳴ることもある。
     * 空きが足りないときは、いま鳴っている SE のうち優先度の低いものを止めて場所を作る。
     * どれも自分より優先度が高ければ、その SE は鳴らさない(高い音を消さない)。
     * @param {string} name
     * @param {number} [priority=0] 大きいほど優先
     * @param {{exclusive?:boolean, loop?:number, resume?:'head'|'continue'}} [opts]
     *   exclusive = ほかの SE を全部止めて独り占めする(ファンファーレなど)。
     *   鳴っているあいだ、優先度の低い SE は鳴らない。
     *
     *   loop = くり返す回数(既定 1)。現実的な回数を入れること。
     *   -1 で無限にくり返せるが、止め忘れると鳴りっぱなしになる。
     *   どうしても無限が要るときは、止める場所を先に決めてから使うこと
     *   (面が変わる・ボスが消える・ポーズに入る、など)。
     *
     *   ch = 席のカテゴリ(reserveSE で取っておいたもの)。
     *   指定するとその席の中だけで取り合うので、ほかの音に消されない。
     *
     *   resume = ポーズを解いたときの鳴らしかた。
     *   'head'(既定) = くり返しの頭から / 'continue' = 止めたところの続きから。
     *   1 回だけの SE は、どちらにしても鳴り直さない
     * @returns {number} 管理番号。stopSE(番号) でこれだけ止められる。
     *   鳴らせなかったときは 0
     */
    /**
     * 場所を空けるために止める SE を 1 つ選ぶ。
     *
     * まず自分より低い優先度のうち、いちばん低いものを探す。
     * 見つからなければ同じ優先度でいちばん古いものを止める。
     *
     * 同じ優先度で譲り合うと、先に鳴っていた音が場所を握ったままになり、
     * あとから起きた出来事の音が鳴らなくなる。
     * ショットを撃ちつづけていると当たった音や爆発が聞こえない、というのがこれ。
     * 実機の音源もあとから鳴らしたほうが勝つので、それに合わせる。
     * @param {number} priority 鳴らそうとしている音の優先度
     * @param {boolean} noiseOnly ノイズを使っているものだけから選ぶか
     */
    _victim(priority, noiseOnly, list) {
      let low = null, old = null;
      for (const v of list || this.seVoices) {
        if (noiseOnly && !v.noise) continue;
        if (v.priority < priority) {
          if (!low || v.priority < low.priority) low = v;
        } else if (v.priority === priority) {
          if (!old || v.id < old.id) old = v;
        }
      }
      return low || old;
    }
    /**
     * 鳴らす直前に、音名と音量で作り直す。
     *
     * 本体はそのまま取っておく。ここで返すのはその場かぎりの写しなので、
     * 同じ SE を続けて別の高さで鳴らしても混ざらない。
     *
     * 指定が無ければ登録したものをそのまま返す(写しも作らない)。
     *
     * @returns {object[]} 鳴らすトラック
     */
    _seShape(name, tracks, opts) {
      const wantNote = opts.note != null && opts.note !== "";
      const wantVol = opts.vol != null;
      if (!wantNote && !wantVol) return tracks;
      if (wantNote && !tracks.base) {
        console.warn(`[ChpTnSnd] SE "${name}" \u306F\u97F3\u540D\u3067\u9CF4\u3089\u3057\u5206\u3051\u3089\u308C\u307E\u305B\u3093(defineSE \u306E base \u3092\u4ED8\u3051\u3066\u767B\u9332\u3057\u3066\u304F\u3060\u3055\u3044)`);
      }
      const notes = wantNote && tracks.base ? parseSENotes(opts.note, tracks.base.semi) : [{ semi: 0, sec: Math.max(...tracks.map((t) => t.total), 0), rest: false }];
      if (!notes.length) return tracks;
      return sliceSE(tracks, notes, opts.vol);
    }
    /**
     * 登録した SE を鳴らす。
     *
     * 声の数が足りなければ、優先度の低いものを止めて場所を空ける。
     * 空けられなければ鳴らさない(`0` が返る)。
     * 同じ優先度どうしなら古いほうを止める — 譲り合うと、先に鳴っていた音が
     * 場所を握ったまま、あとから起きた出来事の音が鳴らなくなるため。
     *
     * @param {string} name `defineSE()` で登録した名前
     * @param {number} [priority=0] 大きいほど強い。場所の取り合いで勝つ
     * `defineSE()` に `base` を付けて登録した SE なら、音名と長さで鳴らし分けられる。
     *
     *   audio.playSE('seShot', 0, { note: 'c4' });       頭の 1/4 を c の高さで
     *   audio.playSE('seShot', 0, { note: 'c4b4e4' });   高さを変えて 3 回
     *   audio.playSE('seShot', 0, { vol: 8 });           音量だけ下げる
     *
     * @param {{system?:boolean, ch?:number|null, exclusive?:boolean,
     *          loop?:number, resume?:('head'|'continue'),
     *          note?:string, vol?:number}} [opts]
     *   system = 全体のポーズに巻き込まれない(ポーズの音そのものなど)。
     *   ch = 鳴らすチャンネルを指名する(既定は空いているところ)。
     *   exclusive = 鳴っているあいだ、同じか下の優先度を鳴らさせない。
     *   loop = くり返す回数。-1 で止めるまで(既定 1)。
     *   resume = ポーズを解いたときの鳴らしかた。
     *   `head` = くり返しの頭から(既定) / `continue` = 続きから。
     *   note = 音名と長さ。`'c4b4e4'` のように続けて書くとその数だけ鳴る。
     *   長さを書かなければ本体まるごと。`base` 付きで登録した SE にだけ効く。
     *   vol = 音量 0..15。本体に書いた音量に掛かる(`base` が無くても効く)
     * @returns {number} 鳴らした音の id。`0` なら鳴らなかった
     *   (場所が空けられなかった / その名前が無い)。
     *   id は `stopSE()` `pauseSE()` に渡せる
     */
    playSE(name, priority = 0, opts = {}) {
      let tracks = this.seDefs.get(name);
      if (!tracks || !this.ctx) return 0;
      tracks = this._seShape(name, tracks, opts);
      const now = this.ctx.currentTime;
      this._cleanupSE(now);
      const system = !!opts.system;
      const need = tracks.length;
      const needNoise = noiseCount(tracks);
      const ch = opts.ch || this._chanOf && this._chanOf.get(name) || null;
      if (!system) {
        if (this.seVoices.some((v) => v.exclusive && v.priority > priority)) return 0;
        if (opts.exclusive) {
          for (const v of [...this.seVoices]) this._stopVoice(v);
        }
        let sc = this._scope(ch);
        while (sc.used + need > sc.max) {
          const low = this._victim(priority, false, sc.list);
          if (!low) return 0;
          this._stopVoice(low);
          sc = this._scope(ch);
        }
        while (needNoise > 0 && needNoise <= sc.maxNoise && sc.usedNoise + needNoise > sc.maxNoise) {
          const low = this._victim(priority, true, sc.list);
          if (!low) return 0;
          this._stopVoice(low);
          sc = this._scope(ch);
        }
      }
      const gain = this.ctx.createGain();
      gain.gain.value = 1;
      gain.connect(this._out());
      const len = Math.max(...tracks.map((t) => t.total), 0);
      const loop = opts.loop == null ? 1 : opts.loop | 0;
      const id = ++this._seSeq;
      const when = now + 0.02;
      const state = {
        id,
        gain,
        nodes: [],
        priority,
        voices: need,
        noise: needNoise,
        ch,
        endTime: when + len,
        exclusive: !system && !!opts.exclusive,
        // 全体のポーズに巻き込まれない音(ポーズの音そのものなど)
        system,
        left: loop,
        timer: 0,
        nextAt: when + len,
        paused: false,
        tracks,
        len,
        // ポーズを解いたときの鳴らしかた。'head' = くり返しの頭から / 'continue' = 続きから
        resume: opts.resume === "continue" ? "continue" : "head",
        startAt: when,
        // いまのくり返しが始まった時刻(続きから鳴らすのに使う)
        offset: 0
        // 止めたときの、曲の中の位置(秒)
      };
      this.seVoices.push(state);
      for (const t of tracks) this._scheduleTrack(t, when, gain, state.nodes);
      this._wkFlushAll(state.nodes);
      if (loop === 1 || len <= 0) return id;
      const again = () => {
        if (this.seVoices.indexOf(state) < 0) return;
        if (state.paused || this._sePausedAll) {
          state.timer = 0;
          return;
        }
        if (state.left > 0) state.left--;
        if (state.left === 0) return;
        const t0 = state.nextAt;
        const now2 = this.ctx.currentTime;
        state.nodes = state.nodes.filter((n) => (n.__endTime || 0) > now2);
        for (const t of tracks) this._scheduleTrack(t, t0, gain, state.nodes);
        this._wkFlushAll(state.nodes);
        state.nextAt = t0 + len;
        state.startAt = t0;
        state.endTime = t0 + len + 0.05;
        state.timer = setTimeout(again, Math.max(20, (t0 + len - this.ctx.currentTime) * 1e3 - 60));
      };
      state.loopAgain = again;
      state.timer = setTimeout(again, Math.max(20, len * 1e3 - 60));
      return id;
    }
    /**
     * ポーズの出入りの音を鳴らす。エンジンが持っている音なので、
     * ゲーム側で SE を用意しなくても鳴る。
     *
     * 全体のポーズ(`pauseSE()`)に巻き込まれないのがふつうの `playSE()` との違い。
     * ここを分けていないと、
     *
     *   playSE('pause'); pauseSE();   // 鳴らした直後に自分で黙らせている
     *
     * となって、ポーズへ入る音が出ない。抜けるときも `resumeSE()` が
     * 「1 回きりの SE は鳴らし直さない」の決まりで鳴りかけの音を片づけてしまう。
     * 出入りのどちらでも同じように鳴らしたいので、ポーズの仕組みの外に置いてある。
     *
     * @returns {number} 管理番号
     */
    playPauseSE() {
      return this.playSE(SE_SYS_PAUSE, 0, { system: true });
    }
    /**
     * SE を一時停止する。
     *
     * ポーズには 2 段ある。
     * - `pauseSE(番号)` = その SE だけ止めておく(個別)
     * - `pauseSE()` = 鳴っているもの全部を止めておく(全体。ゲームのポーズ用)
     *
     * 全体を解除しても、個別に止めてあるものは鳴り出さない。
     * どちらも解けているときだけ鳴る。
     * @param {number} [id] 省略で全体
     */
    pauseSE(id) {
      if (id) {
        const v = this.seVoices.find((x) => x.id === id);
        if (v) {
          v.paused = true;
          this._silence(v);
        }
        return;
      }
      this._sePausedAll = true;
      for (const v of this.seVoices) if (!v.system) this._silence(v);
    }
    /**
     * SE の一時停止を解く。
     * くり返しの残りがあるものだけ鳴り直す。
     * 頭からか続きからかは、playSE の resume で決まる。
     * 1 回だけの SE は鳴り直さない(途中から鳴らしても不自然なので)
     * @param {number} [id] 省略で全体
     */
    resumeSE(id) {
      if (id) {
        const v = this.seVoices.find((x) => x.id === id);
        if (v) {
          v.paused = false;
          this._restart(v);
        }
        return;
      }
      this._sePausedAll = false;
      for (const v of [...this.seVoices]) if (!v.system) this._restart(v);
    }
    /** 鳴っている音を黙らせる(予約も止める。残り回数と位置は覚えておく) */
    _silence(v) {
      if (v.timer) {
        clearTimeout(v.timer);
        v.timer = 0;
      }
      if (v.resume === "continue" && v.len > 0) {
        const off = this.ctx.currentTime - v.startAt;
        v.offset = Math.max(0, Math.min(v.len - 0.02, off));
      }
      for (const n of v.nodes) {
        try {
          n.stop(0);
        } catch (e) {
        }
      }
      v.nodes = [];
    }
    /** 止めてあった SE を鳴らし直す(頭から / 続きから は playSE の resume で決まる) */
    _restart(v) {
      if (v.paused || this._sePausedAll || v.timer) return;
      if (v.left === 1 || v.left === 0 || !v.tracks) {
        this._stopVoice(v);
        return;
      }
      const now = this.ctx.currentTime + 0.02;
      if (v.resume === "continue" && v.offset > 0) {
        const rest = v.len - v.offset;
        for (const t of v.tracks) this._scheduleTrackFrom(t, now, v.gain, v.nodes, v.offset);
        v.startAt = now - v.offset;
        v.nextAt = now + rest;
        v.endTime = now + rest + 0.05;
        v.offset = 0;
        v.timer = setTimeout(v.loopAgain, Math.max(20, rest * 1e3 - 60));
        return;
      }
      v.nextAt = now;
      v.loopAgain();
    }
    /**
     * SE を止める。
     * @param {number} [id] playSE() が返した管理番号。これだけ止める。
     *   省略すると鳴っている SE を全部止める。
     *   くり返し中のものも、ここで終わる
     */
    stopSE(id) {
      if (id) {
        const v = this.seVoices.find((x) => x.id === id);
        if (v) this._stopVoice(v);
        return;
      }
      for (const v of [...this.seVoices]) this._stopVoice(v);
      this.seVoices = [];
    }
    /** 波形に応じた音源ノードを作る(ノイズだけはバッファ再生) */
    /**
     * 短い輪のノイズ。帰還を掛けた並びを 1 サンプルずつ回して ±1 を吐く。
     *
     * 段数が少ないほど輪が短く、繰り返しそのものが音程として聞こえる。
     * 7 段なら 127 サンプルで一周するので、44.1kHz なら 347Hz のブザーになる。
     * 実機(ファミコンの短周期・SN76489 の周期ノイズ)もこの鳴り方。
     *
     * 音色ごとに 1 本だけ作って取っておく。音符ごとに作ると、
     * 速い刻みでそのぶんだけ配列を埋めることになる
     */
    _lfsrBuffer(bits) {
      this._lfsr = this._lfsr || /* @__PURE__ */ new Map();
      const key2 = bits + "@" + (this.ctx ? this.ctx.sampleRate : 0);
      const got = this._lfsr.get(key2);
      if (got && got.ctx === this.ctx) return got.buf;
      const n = (1 << bits) - 1;
      const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      let reg = 1;
      for (let i = 0; i < n; i++) {
        const out = reg & 1;
        reg >>= 1;
        if (out) reg ^= 1 << bits - 2;
        d[i] = out ? 1 : -1;
      }
      this._lfsr.set(key2, { ctx: this.ctx, buf });
      return buf;
    }
    _makeOscillator(ev, freq) {
      const ctx = this.ctx;
      const wf = WAVEFORMS[ev.wave] || WAVEFORMS[2];
      if (wf.kind === "wave" && wf.modRatio) return this._makeModWave(wf, freq);
      if (wf.kind === "wave") {
        const osc2 = ctx.createOscillator();
        osc2.setPeriodicWave(this._periodicWave(wf));
        osc2.frequency.value = freq;
        return osc2;
      }
      if (wf.kind === "fm") {
        const car = ctx.createOscillator();
        car.type = "sine";
        car.frequency.value = freq;
        const mod = ctx.createOscillator();
        const mw = WAVEFORMS[findWave(wf.wave)];
        if (mw && mw.kind === "pulse") mod.setPeriodicWave(this._pulseWave(mw.duty));
        else if (mw && mw.kind === "wave") mod.setPeriodicWave(this._periodicWave(mw));
        else mod.type = mw && { triangle: "triangle", saw: "sawtooth" }[mw.name] || "sine";
        mod.frequency.value = freq * wf.ratio;
        const depth = ctx.createGain();
        mod.connect(depth).connect(car.frequency);
        car.__fm = { mod, depth, wf, freq };
        return car;
      }
      if (wf.kind === "beep") return ev.tape ? this._makeTape(wf, ev) : this._makeBeep(wf, freq, ev);
      if (wf.kind === "noise") {
        const src = ctx.createBufferSource();
        src.buffer = wf.bits ? this._lfsrBuffer(wf.bits) : this.noiseBuffer;
        src.loop = true;
        src.playbackRate.value = Math.min(4, Math.max(0.05, freq / 440 * (wf.rate || 1)));
        return src;
      }
      const osc = ctx.createOscillator();
      if (wf.kind === "pulse") {
        osc.setPeriodicWave(this._pulseWave(wf.duty));
      } else if (wf.kind === "triangle") {
        osc.type = "triangle";
      } else if (wf.kind === "saw") {
        osc.type = "sawtooth";
      } else {
        osc.type = "sine";
      }
      osc.frequency.value = freq;
      return osc;
    }
    /**
     * 波形メモリを足す。1 周期ぶんの数字の並び(-1..1)を渡すと、
     * `@{名前}` で鳴らせるようになる。名前は wt で始める約束。
     * @param {string} name @param {number[]|Float32Array} samples
     * @param {5|8} [bits=8] 段階の細かさ(5 = PC エンジン風 / 8 = SCC 風)
     */
    /** 使える音色の名前(`@{名前}` で呼べるもの)。波形メモリも含む */
    get waveNames() {
      return WAVEFORMS.map((w) => w.name);
    }
    /**
     * 波形メモリの音色を足す。`@{名前}` で鳴らせるようになる。
     * 実機の SCC / PC エンジンにあたるもので、1 周期ぶんの形をそのまま置く。
     * 名前は wt で始める約束(波形メモリだと見て分かるように)。
     *
     * @param {string} name 名前。同じものがあるとエラー(差し替えは { overwrite: true })
     * @param {number[]} samples 1 周期ぶん。32 個が実機と同じ長さ。値は -1〜1
     * @param {number} [bits=8] 段階の細かさ。5 = 32 段(PC エンジン風) /
     *   8 = 256 段(SCC 風)。粗いほど倍音が増えて古い音になる
     * @param {{overwrite?:boolean, env?:string}} [opts]
     *   env = 既定のエンベロープ(`@e{...}` を書かなかったときに付くもの)
     * @returns {number} 音色の番号(`@<n>` で呼ぶときの数字)
     */
    addWave(name, samples, bits = 8, opts = {}) {
      const id = registerWave(name, samples, bits, opts);
      if (this._waveCache) this._waveCache.delete(name);
      return id;
    }
    /**
     * 2 オペの FM 音色を足す。`@{名前}` で鳴らせるようになる。
     * 名前は fm で始める約束。同じ名前があるとエラー
     * (差し替えるなら `{ overwrite: true }`)。
     * @param {string} name
     * @param {{ratio?:number, depth?:number, attack?:number, decay?:number,
     *          sustain?:number, wave?:string}} params
     * @param {{overwrite?:boolean}} [opts]
     */
    addFM(name, params, opts = {}) {
      return registerFM(name, params, opts);
    }
    /** 波形メモリを PeriodicWave に直す(キャッシュ付き) */
    _periodicWave(wf) {
      if (!this._waveCache) this._waveCache = /* @__PURE__ */ new Map();
      const hit = this._waveCache.get(wf.name);
      if (hit) return hit;
      const s = wf.samples, N2 = s.length;
      const half = N2 >> 1;
      const real = new Float32Array(half), imag = new Float32Array(half);
      for (let k = 1; k < half; k++) {
        let re = 0, im = 0;
        for (let n = 0; n < N2; n++) {
          const a = 2 * Math.PI * k * n / N2;
          re += s[n] * Math.cos(a);
          im += s[n] * Math.sin(a);
        }
        real[k] = re * 2 / N2;
        imag[k] = im * 2 / N2;
      }
      const pw = this.ctx.createPeriodicWave(real, imag);
      this._waveCache.set(wf.name, pw);
      return pw;
    }
    /**
     * デューティ比 duty のパルス波を PeriodicWave として作る(キャッシュ付き)。
     *
     * 倍音 1 本を決めるには、大きさと位相の 2 つが要る。
     * `createPeriodicWave(real, imag)` はその 2 つ組で、real が余弦・imag が正弦。
     *
     * 以前はここに大きさだけを入れていた(`imag[n] = 2/(nπ)·sin(nπd)`)。
     * 大きさの並びは合っているので耳では正しく聞こえていたが、
     * 位相が全部そろってしまい、波形が矩形になっていなかった —
     * 測ると幅 12.5% でも 25% でも「0 より上にいる時間」が 49.7% だった。
     *
     * @param {number} duty 0〜1
     * @param {boolean} [normalize=false] 山が 1 になるよう均すか。
     *   音には均さない。実機の矩形波は幅が変わっても 0 と音量値の間を
     *   行き来するだけで、上下の振れ幅は変わらない(細いほど静かになるのは
     *   平均の力が減るからで、山が低くなるからではない)。均すと細い幅ほど
     *   余計に縮められて、12.5% が実機より 7.7 dB 静かになる。
     *   ビブラートの信号として使うときだけ均す — あちらは ±1 で振れてほしい
     */
    _pulseWave(duty, normalize = false) {
      if (!this._pulseCache) this._pulseCache = /* @__PURE__ */ new Map();
      const key2 = duty + (normalize ? "#n" : "");
      const hit = this._pulseCache.get(key2);
      if (hit) return hit;
      const N2 = 64;
      const real = new Float32Array(N2), imag = new Float32Array(N2);
      for (let n = 1; n < N2; n++) {
        real[n] = 2 / (n * Math.PI) * Math.sin(2 * Math.PI * n * duty);
        imag[n] = 2 / (n * Math.PI) * (1 - Math.cos(2 * Math.PI * n * duty));
      }
      const w = this.ctx.createPeriodicWave(real, imag, { disableNormalization: !normalize });
      this._pulseCache.set(key2, w);
      return w;
    }
    /**
     * 音色を焼いて波形にする(プロシージャルな PCM 音源)。
     *
     * 元の音色を切らずに伸ばしっぱなしで鳴らし、頭と輪を切り出す。
     * 切るのは鳴らす側の仕事なので、焼くほうはエンベロープを持たない。
     *
     * 継ぎ目は基本周期の整数倍で切れば消える(pcmbake.js)。
     *
     * @param {string} name registerBaked で登録した名前
     * @returns {Promise<number>} 焼いた数
     */
    async bakeVoice(name) {
      const wf = WAVEFORMS[findWave(name)];
      if (!wf || wf.kind !== "baked") throw new Error("[ChpTnSnd] " + name + " \u306F\u713C\u3051\u308B\u97F3\u8272\u3067\u306F\u3042\u308A\u307E\u305B\u3093");
      if (wf.baked) return wf.baked.length;
      if (wf.baking) return 0;
      const srcIndex = findWave(wf.from);
      if (srcIndex < 0) throw new Error("[ChpTnSnd] " + name + ": \u5143\u306E\u97F3\u8272\u304C\u3042\u308A\u307E\u305B\u3093");
      wf.baking = true;
      try {
        const src = WAVEFORMS[srcIndex];
        const patch = src.patch || (src.kind === "fm" ? { ops: [
          { ratio: src.ratio, sl: src.sustain, ar: src.attack, dr: src.decay },
          // 搬送側。焼くときはエンベロープを持たせないので、鳴りっぱなしとして数える
          { ratio: 1, sl: 1, ar: 0, dr: 0 }
        ] } : { ops: [{ ratio: 1, sl: 1, ar: 5e-3, dr: 0.05 }] });
        const plan = bakePlan(patch, {
          sampleRate: wf.sampleRate,
          octaves: wf.octaves,
          step: wf.step,
          minLoop: wf.minLoop
        });
        const baked = [];
        for (const job of plan.jobs) {
          const need = job.attackSamples + job.loopSamples;
          const tail = Math.ceil(wf.sampleRate * 0.2);
          const data = await this._renderTone(srcIndex, job.bakedFreq, need + tail, wf.sampleRate);
          baked.push({
            note: job.note,
            bakedFreq: job.bakedFreq,
            attack: job.attackSamples,
            loop: job.loopSamples,
            data: data.slice(0, need)
          });
        }
        wf.baked = baked;
        wf.plan = plan;
        return baked.length;
      } finally {
        wf.baking = false;
      }
    }
    /**
     * 音色 1 つを、指定の高さで伸ばしっぱなしのまま波形にする。
     *
     * 使い捨ての player を作ってそちらで焼く。自分の ctx を差し替えると、
     * 焼いている間に鳴っている曲まで巻き込む(実際、裏で焼き始めたら
     * 積んでいる最中の曲が無音になった)。音色の表は共有なので、
     * 別の player でも同じ音が出る。
     */
    async _renderTone(waveIndex, freq, samples, sampleRate) {
      const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
      if (!OAC) throw new Error("[ChpTnSnd] \u713C\u304F\u306B\u306F\u30D6\u30E9\u30A6\u30B6\u304C\u8981\u308A\u307E\u3059");
      const ctx = new OAC(1, samples, sampleRate);
      const tmp = new _ChipTuneSound({ maxVoices: this.maxVoices });
      tmp.ctx = ctx;
      const rand = seededRandom(1);
      tmp.noiseBuffer = ctx.createBuffer(1, sampleRate, sampleRate);
      const d = tmp.noiseBuffer.getChannelData(0);
      for (let i = 0; i < sampleRate; i++) d[i] = rand() * 2 - 1;
      const kind = tmp._wkKindOf(waveIndex);
      if (kind) await tmp._wkLoad(kind);
      const dest = tmp._out();
      const nodes = [];
      const sec = samples / sampleRate;
      const ev = {
        t: 0,
        dur: sec,
        gate: sec,
        freq,
        vol: 15,
        wave: waveIndex,
        env: 0,
        vibrato: 0,
        echo: null
      };
      tmp._playVoice(ev, freq, 1, 0, sec, dest, nodes, false);
      tmp._wkFlushAll(nodes);
      const buf = await ctx.startRendering();
      return buf.getChannelData(0);
    }
    /** 焼いた波形を、いまの context の AudioBuffer に直す(使い回す) */
    _pcmBuffer(wf, k) {
      if (!this._pcmCache) this._pcmCache = /* @__PURE__ */ new Map();
      const key2 = wf.name + "#" + k.note;
      const hit = this._pcmCache.get(key2);
      if (hit && hit.ctx === this.ctx) return hit.buf;
      const buf = this.ctx.createBuffer(1, k.data.length, wf.sampleRate);
      buf.getChannelData(0).set(k.data);
      this._pcmCache.set(key2, { ctx: this.ctx, buf });
      return buf;
    }
    /**
     * 焼いた波形で鳴らす。
     *
     * いちばん近い高さを選んで、足りないぶんは再生速度で寄せる。
     * 焼いたときの丸めのずれも同じ仕組みで戻る。
     */
    _playBaked(wf, ev, freq, amp, t0, t1, dest, nodes) {
      const ctx = this.ctx;
      let best = wf.baked[0];
      const want = 69 + 12 * Math.log2(freq / 440);
      for (const k of wf.baked) {
        if (Math.abs(k.note - want) < Math.abs(best.note - want)) best = k;
      }
      const g = ctx.createGain();
      g.gain.value = 0;
      g.connect(dest);
      this._applyEnvelope(g, ev, amp, t0, t1);
      const src = ctx.createBufferSource();
      src.buffer = this._pcmBuffer(wf, best);
      if (best.loop > 0) {
        src.loop = true;
        src.loopStart = best.attack / wf.sampleRate;
        src.loopEnd = (best.attack + best.loop) / wf.sampleRate;
      }
      const rate = (f) => f / best.bakedFreq;
      src.playbackRate.value = rate(freq);
      if (ev.glide > 0) {
        const off = t1 - Math.max(0, Math.min(ev.relTail || 0, t1 - t0 - 0.01));
        src.playbackRate.setValueAtTime(rate(freq), t0);
        src.playbackRate.exponentialRampToValueAtTime(
          Math.max(1e-4, rate(freq * (ev.glide / ev.freq))),
          off
        );
      }
      src.connect(g);
      src.start(t0);
      src.stop(t1 + 0.02);
      src.__endTime = t1 + 0.02;
      src.onended = () => {
        try {
          g.disconnect();
        } catch (e) {
        }
      };
      nodes.push(src);
    }
    /** 処理器 1 種類ぶんの置き場(積んでいる音符と、出口ごとの節) */
    _wkBank(kind) {
      if (!this._wk) this._wk = /* @__PURE__ */ new Map();
      let bank = this._wk.get(kind);
      if (!bank) {
        bank = { pend: /* @__PURE__ */ new Map(), node: /* @__PURE__ */ new Map() };
        this._wk.set(kind, bank);
      }
      return bank;
    }
    /** 音符を溜める(処理器ごと・出口ごと)。まとめて渡すのは書き出しが待たないため */
    _wkPush(kind, dest, ev) {
      const pend = this._wkBank(kind).pend;
      let list = pend.get(dest);
      if (!list) {
        list = [];
        pend.set(dest, list);
      }
      list.push(ev);
    }
    /** 処理器を読み込む(context ごとに 1 回) */
    async _wkLoad(kind) {
      if (!this._wkReady) this._wkReady = /* @__PURE__ */ new Map();
      if (this._wkReady.get(kind) === this.ctx) return;
      const url = URL.createObjectURL(new Blob([WORKLETS[kind].code], { type: "application/javascript" }));
      await this.ctx.audioWorklet.addModule(url);
      this._wkReady.set(kind, this.ctx);
    }
    /**
     * 溜めた音符を常駐の処理器へ渡す。
     *
     * 音ごとに節を作ると、作り捨ての手間だけで実時間の 2.65 倍かかって
     * 鳴らせない(実測)。常駐 1 個なら 8 声で 3.3%。
     *
     * 渡すのは作るときにする。港へ流す手もあるが、書き出しは待ってくれないので
     * 届く前に計算が終わってしまう。
     */
    /**
     * 積んだぶんを全部の行き先へ渡す。
     *
     * `_wkFlush` は行き先ごとに処理器を使い回すが、定位を入れると
     * 行き先が位置ごとに分かれるので、曲の出口 1 つを渡しても取りこぼす
     * (見落とすとその音だけ無音になる)。呼ぶ側は「積み終わった」ことだけ
     * 知っていればよい形にしてある。
     *
     * 処理器が位置の数だけ増えるが、鳴っている声の総数は変わらないので
     * 計算の本体は増えない。増えるのは呼び出しの手間だけ(docs/STEREO.md)
     */
    _wkFlushAll(nodes) {
      if (!this._wk) return;
      for (const [kind, bank] of this._wk) {
        for (const dest of [...bank.pend.keys()]) this._wkFlush(kind, dest, nodes);
      }
    }
    _wkFlush(kind, dest, nodes) {
      const bank = this._wkBank(kind);
      const list = bank.pend.get(dest);
      if (!list || !list.length) return null;
      if (!this._wkReady || this._wkReady.get(kind) !== this.ctx) return null;
      bank.pend.delete(dest);
      list.sort((a, b) => a.t - b.t);
      let node = bank.node.get(dest);
      if (node) {
        node.port.postMessage({ add: list });
        return node;
      }
      node = new AudioWorkletNode(this.ctx, WORKLETS[kind].node, {
        processorOptions: {
          events: list,
          voices: this.maxVoices * 4,
          ...this._regLog ? { log: true } : {},
          ...this._opllFixed && kind === "opll" ? { fixed: true } : {}
        }
      });
      node.connect(dest);
      node.__endTime = Infinity;
      bank.node.set(dest, node);
      if (nodes) nodes.push(node);
      return node;
    }
    /**
     * その音色が要る処理器の名前。
     *
     * 焼いて使う音色(pcm)の元もたどる。焼き上がるまでは元の音色で鳴らすので、
     * そこが 4 オペなら処理器が要る(見落として無音になった)。
     */
    _wkKindOf(waveIndex) {
      const w = WAVEFORMS[waveIndex];
      if (!w) return null;
      if (w.kind === "baked") return this._wkKindOf(findWave(w.from));
      return workletOf(w);
    }
    /**
     * その音色が要る処理器を、重ねた中身まで見て集める。
     *
     * 重ねた音色(`layer`)は、中に OPLL や 4 オペを混ぜられる。中を見ないと
     * その処理器を読み込まないので、混ざっている層だけが黙る(2026-09-28)。
     * 焼いた音色の元をたどるのと同じ話で、あちらは `_wkKindOf` が見ている
     */
    _wkKindsOf(waveIndex, need = /* @__PURE__ */ new Set(), seen = /* @__PURE__ */ new Set()) {
      if (seen.has(waveIndex)) return need;
      seen.add(waveIndex);
      const w = WAVEFORMS[waveIndex];
      if (!w) return need;
      if (w.kind === "layer") {
        for (const m of w.layers) this._wkKindsOf(m.wave, need, seen);
        return need;
      }
      const k = this._wkKindOf(waveIndex);
      if (k) need.add(k);
      return need;
    }
    /** そのトラックに混ざっている処理器を全部集める */
    _wkKinds(tracks) {
      const need = /* @__PURE__ */ new Set();
      for (const t of tracks) {
        for (const e of t.events) this._wkKindsOf(e.wave, need);
      }
      return need;
    }
    /**
     * 波形メモリ + 変調ユニット(ファミコンディスクにあたるもの)。
     *
     * 実機は波形メモリの音程を別の表で揺らす。ゆっくり揺らせばビブラート、
     * 音の高さで揺らすと金属質になる(側帯波が生えて FM に近いことが起きる)。
     * これが FDS の音の半分で、波形メモリだけでは出ない。
     */
    _makeModWave(wf, freq) {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      osc.setPeriodicWave(this._periodicWave(wf));
      osc.frequency.value = freq;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = freq * wf.modRatio;
      lfo.setPeriodicWave(this._modWave(wf));
      const depth = ctx.createGain();
      depth.gain.value = freq * wf.modDepth;
      lfo.connect(depth).connect(osc.frequency);
      osc.__beep = { out: osc, extras: [lfo] };
      return osc;
    }
    /** ビブラートの形の表を PeriodicWave に直す(キャッシュ付き) */
    _modWave(wf) {
      if (!this._modCache) this._modCache = /* @__PURE__ */ new Map();
      const hit = this._modCache.get(wf.name);
      if (hit) return hit;
      const s = wf.modTable, N2 = s.length, half = N2 >> 1;
      const real = new Float32Array(half), imag = new Float32Array(half);
      for (let k = 1; k < half; k++) {
        let re = 0, im = 0;
        for (let n = 0; n < N2; n++) {
          const a = 2 * Math.PI * k * n / N2;
          re += s[n] * Math.cos(a);
          im += s[n] * Math.sin(a);
        }
        real[k] = re * 2 / N2;
        imag[k] = im * 2 / N2;
      }
      const pw = this.ctx.createPeriodicWave(real, imag);
      this._modCache.set(wf.name, pw);
      return pw;
    }
    /**
     * カセットのロード音を波形として作る。
     *
     * ビット 1 個は 1/1200 秒しかないので、音符に割るとエンジンの最短の長さに
     * 伸ばされて重なり、団子になる。まるごと 1 つの音として組むことで
     * 重なりが起きず、音の数も 1000 分の 1 で済む。
     *
     * 実機の作り: データ 0 = スペース音 1 波 / 1 = マーク音 2 波(どちらも 1/baud 秒)。
     * 1 バイトは スタート(0) + 8 ビット + ストップ(1)x3 = 12 ビット枠に収まるので、
     * でたらめなデータの下に 1 秒 100 回の地ができる。ここがロード音のらしさ。
     * パイロットがマーク音だけなのは、枠に挟まれない連続音はデータになりえないから。
     *
     * 4 倍で作ってから均している。素で作ると折り返しの雑音が乗り、
     * テープではなく壊れた音に聞こえる。
     */
    _makeTape(wf, ev) {
      const ctx = this.ctx;
      const rate = ctx.sampleRate, OS = 4;
      const t = ev.tape;
      const len = Math.max(1, Math.round(ev.dur * rate));
      const buf = ctx.createBuffer(1, len, rate);
      const out = buf.getChannelData(0);
      const rnd = seededRandom(t.seed * 2654435761 + t.seq * 40503 >>> 0);
      const mark = t.baud * 2, space = t.baud;
      const bitSamples = Math.round(OS * rate / t.baud);
      const hi = new Float32Array(len * OS);
      let i = 0, phase = 0;
      const wow = (t.wow ?? wf.wow) > 0 ? t.wow ?? wf.wow : 0;
      const speedAt = (at) => {
        if (!wow) return 1;
        const s = at / (rate * OS);
        return 1 + wow * (Math.sin(2 * Math.PI * 1.7 * s) * 0.7 + Math.sin(2 * Math.PI * 11 * s) * 0.3);
      };
      const putBit = (bit) => {
        const f = bit ? mark : space;
        const sp = speedAt(i);
        const end = Math.min(hi.length, i + Math.round(bitSamples / sp));
        for (; i < end; i++) {
          phase += f * sp / (rate * OS);
          hi[i] = phase % 1 < 0.5 ? 1 : -1;
        }
      };
      if (!t.data) {
        while (i < hi.length) putBit(1);
      } else {
        const bytes = t.bytes;
        let at = 0;
        while (i < hi.length) {
          const v = bytes ? bytes[at++ % bytes.length] : null;
          putBit(0);
          for (let b = 0; b < 8; b++) {
            putBit(v === null ? rnd() < 0.5 ? 1 : 0 : v >> b & 1);
          }
          putBit(1);
          putBit(1);
          putBit(1);
        }
      }
      const fc = (t.muffle ?? wf.muffle) > 0 ? t.muffle ?? wf.muffle : 0;
      const a = fc > 0 ? Math.exp(-2 * Math.PI * fc / (rate * OS)) : 0;
      let lp = 0;
      for (let k = 0; k < len; k++) {
        let sum = 0;
        for (let j = 0; j < OS; j++) {
          const x = hi[k * OS + j];
          if (fc > 0) {
            lp = x * (1 - a) + lp * a;
            sum += lp;
          } else sum += x;
        }
        out[k] = sum / OS;
      }
      const hiss = t.hiss ?? wf.hiss;
      if (hiss > 0) {
        const mix = hiss;
        for (let k = 0; k < len; k++) out[k] = out[k] * (1 - mix) + (rnd() * 2 - 1) * mix;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      return src;
    }
    /**
     * ビープ音源を組む([docs/BEEP.md](../docs/BEEP.md))。
     *
     * 3 通りの作りを 1 つの形で扱う。
     * - `carrier` があると、その固定音をゲートで刻む(PC-8001 系)。
     *   音程はゲートの速さで作られ、搬送波は消えない = 濁る
     * - `carrier` が 0 なら、音程そのままの矩形(線を直接叩く型 / カウンタ型)
     * - `divClock` があると、出せる高さが分周比の階段に丸まる(8253 の型)
     * - `jitter` は画面と CPU がメモリを取り合う揺れ。
     *   表示期間だけ遅くなるので、`frame` Hz・`display` の割合の脈になる
     *
     * 返すのは搬送波(またはゲート)の発振器。`__beep.out` が本当の出口で、
     * `__beep.extras` は一緒に start/stop すべき節。FM が `__fm` でやっているのと同じ形。
     */
    _makeBeep(wf, freq, ev) {
      const ctx = this.ctx;
      const w = ev && ev.beepSet ? Object.assign(Object.create(wf), ev.beepSet) : wf;
      let f = freq;
      if (w.divClock > 0) f = w.divClock / Math.max(1, Math.round(w.divClock / f));
      const extras = [];
      const addJitter = (param, base) => {
        if (!(w.jitter > 0)) return;
        const dev = base * w.jitter / 2;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = w.frame;
        lfo.setPeriodicWave(this._pulseWave(w.display, true));
        const depth = ctx.createGain();
        depth.gain.value = -dev;
        const bias2 = ctx.createConstantSource();
        bias2.offset.value = -dev;
        lfo.connect(depth).connect(param);
        bias2.connect(param);
        extras.push(lfo, bias2);
      };
      if (!(w.carrier > 0)) {
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.value = f;
        addJitter(osc.frequency, f);
        if (extras.length) osc.__beep = { out: osc, extras };
        return osc;
      }
      const car = ctx.createOscillator();
      car.type = "square";
      car.frequency.value = w.carrier;
      const gate = ctx.createOscillator();
      gate.type = "square";
      gate.frequency.value = f;
      addJitter(gate.frequency, f);
      const half = ctx.createGain();
      half.gain.value = 0.5;
      const bias = ctx.createConstantSource();
      bias.offset.value = 0.5;
      const mul = ctx.createGain();
      mul.gain.value = 0;
      gate.connect(half).connect(mul.gain);
      bias.connect(mul.gain);
      car.connect(mul);
      extras.push(gate, bias);
      car.__beep = { out: mul, extras };
      return car;
    }
    /** エンベロープを gain に書き込む */
    /**
     * 音色の表を鳴らす。高さと音量を 1 フレームずつ書き換える。
     *
     * エンベロープ（`@e`）は音の長さで割るが、表は割らない — どの音でも同じ速さで
     * 進むので、短い音では途中までしか鳴らない。そこがチップチューンの手触り
     * （docs/MML.md「音色は何を持つか」）。
     *
     * @returns {boolean} 音量を表で書いたか（書いたらエンベロープは掛けない）
     */
    _applyTone(gain, src, ev, freq, amp, t0, t1, tune) {
      const wf = WAVEFORMS[ev.wave];
      const tone = wf && wf.tone;
      if (!tone) return false;
      const n = Math.max(1, Math.ceil((t1 - t0) / TONE_FRAME));
      const canBend = !!(src && src.frequency);
      if (canBend && (tone.arp || tone.pitch)) {
        for (let i = 0; i < n; i++) {
          const semi = readTable(tone.arp, i, tone.loop.arp);
          const cent = readTable(tone.pitch, i, tone.loop.pitch);
          let f = freq * Math.pow(2, semi / 12 + cent / 1200);
          if (tune) f = psgSnap(f, ev.wave);
          src.frequency.setValueAtTime(f, t0 + i * TONE_FRAME);
        }
      }
      if (tone.vol) {
        gain.gain.setValueAtTime(0, t0);
        for (let i = 0; i < n; i++) {
          const v = Math.max(0, Math.min(15, readTable(tone.vol, i, tone.loop.vol)));
          gain.gain.setValueAtTime(Math.max(1e-4, amp * v / 15), t0 + i * TONE_FRAME);
        }
        gain.gain.linearRampToValueAtTime(0, t1);
        return true;
      }
      return false;
    }
    /**
     * 幅の表を持つ音色ぶんの、フレームごとの並びを作る。
     *
     * `_applyTone` と同じ表を同じ順に読むが、書き込む先が AudioParam ではなく
     * 数字の並びになる。処理器の側には節が無いので automation を書けない。
     *
     * ビブラートもここで少しずつ動かす。作りつけの道は発振器を 1 本
     * 足して滑らかに揺らすが、実機は 1 フレームに 1 回しか書き換えられないので、
     * 段にしたほうがむしろ本物に近い。
     *
     * @returns {{fr:Float32Array, du:Float32Array, gv:Float32Array|null}}
     *   fr = 高さ(Hz) / du = 幅(0〜1) / gv = 音量(0〜1。表が無ければ null)
     */
    _dutyFrames(tone, ev, freq, len, tune) {
      const n = Math.max(1, Math.ceil(len / TONE_FRAME));
      const fr = new Float32Array(n);
      const du = new Float32Array(n);
      const gv = tone.vol ? new Float32Array(n) : null;
      const vib = ev.vib || tone.vib;
      const depth = vib ? vib.depth : ev.vibrato;
      const speed = vib && vib.speed != null ? vib.speed : 5 + depth * 0.6;
      const wait = vib && vib.delay != null ? vib.delay : 0;
      for (let i = 0; i < n; i++) {
        const semi = readTable(tone.arp, i, tone.loop.arp);
        const cent = readTable(tone.pitch, i, tone.loop.pitch);
        const base = ev.glide > 0 ? freqAt(ev, i * TONE_FRAME) : freq;
        let f = base * Math.pow(2, semi / 12 + cent / 1200);
        if (depth > 0 && i >= wait) {
          f += base * 4e-3 * depth * Math.sin(2 * Math.PI * speed * (i - wait) * TONE_FRAME);
        }
        fr[i] = tune ? psgSnap(f, ev.wave) : f;
        du[i] = clampDuty(readTable(tone.duty, i, tone.loop.duty));
        if (gv) gv[i] = Math.max(0, Math.min(15, readTable(tone.vol, i, tone.loop.vol))) / 15;
      }
      return { fr, du, gv };
    }
    _applyEnvelope(gain, ev, amp, t0, t1) {
      const e = envOf(ev);
      const tail = Math.max(0, Math.min(ev.relTail || 0, t1 - t0 - 0.01));
      const off = t1 - tail;
      const len = Math.max(0.02, off - t0);
      const r2 = tail > 0 && !e.table && e.s > 0 ? Math.min(envSec(e.r, len), tail) : 0;
      if (e.table) {
        gain.gain.setValueAtTime(0, t0);
        const n = Math.max(1, Math.ceil(len / TONE_FRAME));
        for (let i = 0; i < n; i++) {
          const v = envTableAt(e, i);
          gain.gain.setValueAtTime(Math.max(1e-4, amp * v), t0 + i * TONE_FRAME);
        }
        gain.gain.linearRampToValueAtTime(0, off);
        return;
      }
      const { a, d, rel } = envShape(e, len);
      const w = WAVEFORMS[ev.wave];
      if ((ev.vsteps ?? (w ? w.vsteps : 0)) > 0) {
        const room2 = tail > 0 ? 0 : ev.open ? 2e-3 : rel;
        const hold = Math.max(a + d, len - room2);
        const end = len + r2;
        const n = Math.max(1, Math.ceil(end / TONE_FRAME));
        gain.gain.setValueAtTime(ev.legato ? ampAt(ev, 1) : 0, t0);
        for (let i = 0; i < n; i++) {
          const age = i * TONE_FRAME;
          let f;
          if (age < a) f = ev.legato ? 1 : a > 0 ? age / a : 1;
          else if (age < a + d) f = 1 - (1 - e.s) * ((age - a) / Math.max(1e-6, d));
          else if (age < hold) f = e.s;
          else f = e.s * (1 - (age - hold) / Math.max(1e-6, end - hold));
          gain.gain.setValueAtTime(Math.max(1e-4, ampAt(ev, f, age)), t0 + age);
        }
        gain.gain.setValueAtTime(1e-4, t0 + end);
        return;
      }
      const sustain = amp * e.s;
      gain.gain.setValueAtTime(ev.legato ? amp : 0, t0);
      if (!ev.legato) gain.gain.linearRampToValueAtTime(amp, t0 + a);
      if (d > 0) gain.gain.linearRampToValueAtTime(Math.max(1e-4, sustain), t0 + a + d);
      else gain.gain.setValueAtTime(amp, t0 + a);
      if (r2 > 0) {
        gain.gain.setValueAtTime(Math.max(1e-4, sustain), Math.max(t0 + a + d, off));
        gain.gain.linearRampToValueAtTime(0, off + r2);
        return;
      }
      const room = ev.open ? 2e-3 : rel;
      gain.gain.setValueAtTime(
        Math.max(1e-4, e.s > 0 ? sustain : 1e-4),
        Math.max(t0 + a + d, off - room)
      );
      gain.gain.linearRampToValueAtTime(0, off);
    }
    /**
     * 鳴らすときに掛けるエフェクトのぶんを重ねる(`dynamic_effects`)。
     *
     * 元の音と同じ場所から鳴らす。厚くするためのものなので、別のところから
     * 聞こえては困る。書いてあるチャンネルにだけ掛かる。
     */
    _extraVoices(ev, ch, amp, t0, t1, dest, nodes, tune = false) {
      const fx = this.dynamic_effects && this.dynamic_effects[ch];
      if (!fx) return;
      const oct = Math.max(0, Math.min(2, fx.octave | 0));
      if (oct >= 1) this._playVoice(ev, ev.freq / 2, amp * 0.5, t0, t1, dest, nodes, tune);
      if (oct >= 2) this._playVoice(ev, ev.freq / 4, amp * 0.28, t0, t1, dest, nodes, tune);
      if (fx.detune) {
        const f2 = ev.freq * Math.pow(2, Number(fx.detune) / 1200);
        this._playVoice(ev, f2, amp * 0.6, t0, t1, dest, nodes, tune);
      }
      if (fx.echo) {
        const delay = Number(fx.echo.delay) || 0.12;
        const depth = Math.max(1, Math.min(9, Number(fx.echo.depth) || 5));
        const eAmp = amp * (0.12 + depth * 0.035);
        this._playVoice(ev, ev.freq, eAmp, t0 + delay, t1 + delay, dest, nodes, tune);
      }
    }
    /**
     * そのチャンネルを丸めるか。配列を入れておけばチャンネルごとに決まる
     * (並びに無いチャンネルは丸める側にする)
     */
    _tuneOn(ch) {
      const t = this.psgTune;
      if (Array.isArray(t)) return t[ch | 0] !== false;
      return !!t;
    }
    /**
     * チップへ渡す、音量の書き直しの並び(`[[時刻, 値], …]`)。
     *
     * 実機の駆動系と同じく 1 フレームに 1 回見て、値が変わったときだけ書く。
     * 値は `valueAt(鳴りはじめからの秒)` が決める(OPLL は `v`、OPM は TL の段)。
     * 処理器が丸める OPLL も、変わり目はここで丸めて見る
     */
    _fadeSteps(ev, t0, t1, valueAt, keyOf = (x) => Math.round(x)) {
      const out = [];
      let last = keyOf(valueAt(0));
      for (let age = TONE_FRAME; t0 + age < t1; age += TONE_FRAME) {
        const v = valueAt(age);
        const k = keyOf(v);
        if (k === last) continue;
        last = k;
        out.push([t0 + age, v]);
      }
      return out;
    }
    /**
     * ポルタメント(`*`)の途中の高さを、OPM のレジスタの並びにする。
     *
     * `[[時刻, KC, KF], …]`。同じ値が続くところは書かない。
     * OPLL は高さのまま渡して処理器の側で直すが、あちらは変換が処理器の中に
     * あるため。OPM の逆引きは表を持つので、外に 1 つだけ置いてある
     */
    _pitchSteps(ev, t0, t1) {
      const out = [];
      let last = -1;
      for (let age = TONE_FRAME; t0 + age < t1; age += TONE_FRAME) {
        const { kc, kf } = opmPitch(freqAt(ev, age));
        const key2 = kc << 8 | kf;
        if (key2 === last) continue;
        last = key2;
        out.push([t0 + age, kc, kf]);
      }
      return out;
    }
    /**
     * フェード(`@fade`)の途中の音を、掛け率の節に通す。
     *
     * 返す音符は `fade` を外して、その音の中でいちばん大きい音量にしてある。
     * そこから下げるぶんを節が掛けるので、先の道はフェードを知らなくてよい。
     *
     * 掛け率は 1 フレームずつ点を打ってつなぐ。段に寄せる音色はここを通らず、
     * エンベロープが 1 フレームずつ書くところで一緒に動かす(`_applyEnvelope`)。
     * 通すと寄せる前の値で掛かってしまい、段にならない
     */
    _fadeDest(ev, t0, t1, dest) {
      const len = Math.max(0, t1 - t0);
      const pts = ev.fade;
      const a = Math.max(0, Math.min(len, pts[0][0]));
      const b = Math.max(a, Math.min(len, pts[pts.length - 1][0]));
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(fadeGain(ev, 0), t0);
      g.gain.setValueAtTime(fadeGain(ev, a), t0 + a);
      for (let age = a + TONE_FRAME; age < b; age += TONE_FRAME) {
        g.gain.linearRampToValueAtTime(fadeGain(ev, age), t0 + age);
      }
      g.gain.linearRampToValueAtTime(fadeGain(ev, b), t0 + b);
      g.connect(dest);
      return { dest: g, ev: { ...ev, fade: null, vol: peakVol(ev) } };
    }
    /** 1 音ぶんの音源 + エンベロープを組み立てて鳴らす */
    _playVoice(ev, freq, amp, t0, t1, dest, nodes, tune = false) {
      const ctx = this.ctx;
      if (ev.fade) {
        const w = WAVEFORMS[ev.wave] || {};
        const pass = w.kind === "layer" || w.kind === "opll" || w.kind === "opm" || w.kind === "baked" && !w.baked || w.tone && w.tone.duty || (ev.vsteps ?? w.vsteps) > 0 && !envOf(ev).table && !(w.tone && w.tone.vol);
        if (!pass) ({ dest, ev } = this._fadeDest(ev, t0, t1, dest));
      }
      if (ev.toneOnly) {
        const b = (WAVEFORMS[ev.wave] || {}).dcBias || 0;
        if (!(b > 0)) return;
        const box = ctx.createGain();
        this._applyEnvelope(box, ev, amp, t0, t1);
        box.connect(dest);
        const osc = ctx.createOscillator();
        osc.type = "square";
        const lvl = ctx.createGain();
        lvl.gain.value = 0.5 * b;
        osc.frequency.setValueAtTime(toneSnap(freq), t0);
        osc.connect(lvl).connect(box);
        osc.start(t0);
        osc.stop(t1 + 0.02);
        osc.__endTime = t1 + 0.02;
        if (nodes) nodes.push(osc);
        return;
      }
      if (ev.gates && ev.gates.some((g2) => g2.hz > 0)) {
        const gate = ctx.createGain();
        gate.connect(dest);
        gate.gain.setValueAtTime(1, t0);
        const sq = ctx.createOscillator();
        sq.type = "square";
        const sqAmp = ctx.createGain();
        sqAmp.gain.setValueAtTime(0, t0);
        sq.connect(sqAmp).connect(gate.gain);
        const bias = (WAVEFORMS[ev.wave] || {}).dcBias || 0;
        let car = null, carAmp = null;
        if (bias > 0) {
          const box = ctx.createGain();
          this._applyEnvelope(box, ev, amp, t0, t1);
          box.connect(dest);
          car = ctx.createOscillator();
          car.type = "square";
          carAmp = ctx.createGain();
          carAmp.gain.setValueAtTime(0, t0);
          car.connect(carAmp).connect(box);
        }
        for (const g2 of ev.gates) {
          const at = t0 + g2.at;
          if (at >= t1) break;
          if (g2.hz > 0) {
            const hz = toneSnap(g2.hz);
            sq.frequency.setValueAtTime(hz, at);
            sqAmp.gain.setValueAtTime(0.5, at);
            gate.gain.setValueAtTime(0.5, at);
            if (car) {
              car.frequency.setValueAtTime(hz, at);
              carAmp.gain.setValueAtTime(0.5 * bias, at);
            }
          } else {
            sqAmp.gain.setValueAtTime(0, at);
            gate.gain.setValueAtTime(1, at);
            if (car) carAmp.gain.setValueAtTime(0, at);
          }
        }
        sq.start(t0);
        sq.stop(t1 + 0.02);
        sq.__endTime = t1 + 0.02;
        if (nodes) nodes.push(sq);
        if (car) {
          car.start(t0);
          car.stop(t1 + 0.02);
          car.__endTime = t1 + 0.02;
          if (nodes) nodes.push(car);
        }
        return this._playVoice({ ...ev, gates: null }, freq, amp, t0, t1, gate, nodes, tune);
      }
      const wfl = WAVEFORMS[ev.wave];
      if (wfl && wfl.kind === "layer") {
        const own = wfl.defaultEnv ?? ENVELOPES.findIndex((x) => x.name === DEFAULT_ENV);
        const said = ev.env !== own;
        for (const m of wfl.layers) {
          const f = freq * Math.pow(2, (m.semi + m.cents / 100) / 12);
          const mine = m.env != null ? m.env : (WAVEFORMS[m.wave] || {}).defaultEnv ?? own;
          const e = m.follow && said ? ev.env : mine;
          const d = (m.delay || 0) * TONE_FRAME;
          this._playVoice(
            { ...ev, wave: m.wave, env: e },
            f,
            amp * m.gain,
            t0 + d,
            t1 + d,
            dest,
            nodes,
            tune
          );
        }
        return;
      }
      const wfp = WAVEFORMS[ev.wave];
      if (wfp && wfp.kind === "baked") {
        if (wfp.baked) return this._playBaked(wfp, ev, freq, amp, t0, t1, dest, nodes);
        if (!wfp.baking) this.bakeVoice(wfp.name).catch(() => {
        });
        const at = findWave(wfp.from);
        if (at >= 0) {
          return this._playVoice({ ...ev, wave: at }, freq, amp, t0, t1, dest, nodes, tune);
        }
        return;
      }
      const wfo = WAVEFORMS[ev.wave];
      if (wfo && wfo.kind === "opll") {
        this._wkPush("opll", dest, {
          // 余韻はチップが持つ。延ばす前の長さでキーオフする
          t: t0,
          dur: Math.max(0.01, t1 - t0 - (ev.relTail || 0)),
          freq,
          v: ev.vol,
          inst: wfo.inst,
          // フェードの途中なら、鳴っているあいだに音量レジスタを書き直す。
          // 余韻(キーオフのあと)も書き直す
          ...ev.fade ? { vs: this._fadeSteps(ev, t0, t1, (a) => volAt(ev, a)) } : {},
          // ポルタメント。鳴っているあいだに音程レジスタを書き直す。
          // 実機のドライバも同じことをしていた。重ねた音色の片方が Web Audio の
          // 発振器で滑るのに、こちらだけ音符の頭のまま鳴っていた(2026-09-28)。
          // 高さで並べておいて、block と fnum へ直すのは処理器の側
          // 高さは間引かずに毎フレーム渡す。レジスタの値が同じかどうかは
          // 処理器の側でしか分からない(block と fnum に直すのがあちら)ので、
          // ここで薄めると音程の刻みと食い違う
          ...ev.glide > 0 ? { ps: this._fadeSteps(
            ev,
            t0,
            t1 - (ev.relTail || 0),
            (a) => freqAt(ev, a),
            (x) => x
          ) } : {},
          ...wfo.drum ? { drum: wfo.drum } : {},
          ...wfo.set ? { set: wfo.set } : {},
          // 自分で作った音色。8 バイトをレジスタ 0x00〜0x07 へ書いてから鳴らす
          ...wfo.voice ? { voice: wfo.voice } : {}
        });
        return;
      }
      const wf4 = WAVEFORMS[ev.wave];
      if (wf4 && wf4.kind === "opm") {
        const { kc, kf } = opmPitch(freq);
        const attOf = (a) => Math.max(0, Math.round(
          -20 * Math.log10(Math.max(1e-4, amp * (ev.fade ? fadeGain(ev, a) : 1))) / 0.75
        ));
        this._wkPush("opm", dest, {
          t: t0,
          dur: Math.max(0.01, t1 - t0 - (ev.relTail || 0)),
          kc,
          kf,
          patch: wf4.patch,
          att: attOf(0),
          // フェードの途中なら、鳴っているあいだに TL を書き直す(余韻も)
          ...ev.fade ? { vs: this._fadeSteps(ev, t0, t1, attOf) } : {},
          // ポルタメント。鳴っているあいだに音程レジスタ(KC と KF)を書き直す。
          // OPLL と違って、高さから直すのはこちら側 — 逆引きの表が
          // `opmPitch` にあり、処理器の中にも同じ表を持たせると 2 か所になる
          ...ev.glide > 0 ? { ps: this._pitchSteps(ev, t0, t1 - (ev.relTail || 0)) } : {}
        });
        return;
      }
      if (wf4 && wf4.tone && wf4.tone.duty) {
        const len = Math.max(0.02, t1 - t0);
        const f = this._dutyFrames(wf4.tone, ev, freq, len, tune);
        const tail2 = Math.min(ev.relTail || 0, len - 0.01);
        const e = envOf(ev);
        let shape = f.gv || e.table ? null : envShape(e, len - tail2);
        if (shape && tail2 > 0) shape = { ...shape, hold: len - tail2 };
        this._wkPush("duty", dest, {
          t: t0,
          dur: len,
          vol: amp,
          fr: f.fr,
          du: f.du,
          // 配列式のエンベロープは、そのまま 1 フレームずつの並びとして渡す
          // (処理器の側は `gv` をそう扱うので、道を増やさずに済む)
          gv: f.gv || envGains(e, len),
          // フェードの途中なら、1 フレームずつの掛け率を添える
          ...ev.fade ? { fv: Float32Array.from(f.fr, (x, i) => fadeGain(ev, i * TONE_FRAME)) } : {},
          env: shape
        });
        return;
      }
      if (tune) freq = psgSnap(freq, ev.wave);
      const g = ctx.createGain();
      g.gain.value = 0;
      g.connect(dest);
      const src = this._makeOscillator(ev, freq);
      const byTone = this._applyTone(g, src, ev, freq, amp, t0, t1, tune);
      if (!byTone) this._applyEnvelope(g, ev, amp, t0, t1);
      if (ev.glide > 0 && !byTone && src.frequency) {
        const to0 = freq * (ev.glide / ev.freq);
        const to = tune ? psgSnap(to0, ev.wave) : to0;
        src.frequency.setValueAtTime(freq, t0);
        src.frequency.exponentialRampToValueAtTime(Math.max(1, to), t1);
        if (src.__fm) {
          const fm = src.__fm;
          fm.mod.frequency.setValueAtTime(freq * fm.wf.ratio, t0);
          fm.mod.frequency.exponentialRampToValueAtTime(Math.max(1, to * fm.wf.ratio), t1);
        }
      }
      const tvib = ev.vib || (WAVEFORMS[ev.wave] || {}).tone?.vib;
      const vibDepth = tvib ? tvib.depth : ev.vibrato;
      if (vibDepth > 0 && src.frequency) {
        const lfo = ctx.createOscillator();
        const depth = ctx.createGain();
        lfo.frequency.value = tvib && tvib.speed != null ? tvib.speed : 5 + vibDepth * 0.6;
        const peak = freq * 4e-3 * vibDepth;
        if (tvib && tvib.delay > 0) {
          const at = t0 + tvib.delay * TONE_FRAME;
          depth.gain.setValueAtTime(0, t0);
          depth.gain.setValueAtTime(0, Math.min(at, t1));
          depth.gain.linearRampToValueAtTime(peak, Math.min(at + 0.08, t1));
        } else {
          depth.gain.value = peak;
        }
        lfo.connect(depth).connect(src.frequency);
        lfo.start(t0);
        lfo.stop(t1 + 0.02);
        lfo.__endTime = t1 + 0.02;
        nodes.push(lfo);
      }
      if (src.__fm) {
        const { mod, depth, wf, freq: freq2 } = src.__fm;
        const peak = freq2 * wf.ratio * wf.depth;
        const keep2 = peak * wf.sustain;
        depth.gain.setValueAtTime(0, t0);
        depth.gain.linearRampToValueAtTime(peak, t0 + Math.min(wf.attack, (t1 - t0) * 0.5));
        depth.gain.exponentialRampToValueAtTime(
          Math.max(1, keep2),
          Math.min(t1, t0 + wf.attack + wf.decay)
        );
        if (wf.drop > 0 && !ev.glide) {
          const top = freq2 * (1 + wf.drop);
          const land = Math.min(t1, t0 + wf.dropTime);
          src.frequency.setValueAtTime(top, t0);
          src.frequency.exponentialRampToValueAtTime(freq2, land);
          mod.frequency.setValueAtTime(top * wf.ratio, t0);
          mod.frequency.exponentialRampToValueAtTime(freq2 * wf.ratio, land);
        }
        mod.start(t0);
        mod.stop(t1 + 0.02);
        mod.__endTime = t1 + 0.02;
        nodes.push(mod);
      }
      let tail = src;
      if (src.__beep) {
        tail = src.__beep.out;
        for (const n of src.__beep.extras) {
          n.start(t0);
          n.stop(t1 + 0.02);
          n.__endTime = t1 + 0.02;
          nodes.push(n);
        }
      }
      if (ev.beep) {
        const ws = ctx.createWaveShaper();
        ws.curve = BEEP_CURVE;
        ws.oversample = "none";
        tail.connect(ws);
        ws.connect(g);
      } else {
        tail.connect(g);
      }
      src.start(t0);
      src.stop(t1 + 0.02);
      src.__endTime = t1 + 0.02;
      src.onended = () => {
        try {
          g.disconnect();
        } catch (e) {
        }
      };
      nodes.push(src);
    }
    /**
     * 1チャンネルぶんを、曲の途中(off 秒)から鳴らす。
     * off をまたいでいる音は、残りの長さだけ鳴らす(ポーズからの再開に使う)。
     * @param {number} off 曲の中の再開位置(秒)
     */
    _scheduleTrackFrom(track, when, dest, nodes, off) {
      const tune = this._tuneOn(track.ch);
      for (const ev of track.events) {
        const end = ev.t + Math.max(0.01, ev.gate);
        if (end <= off) continue;
        const start = Math.max(ev.t, off);
        const t0 = when + (start - off);
        const tail = tailOf(ev, end - start);
        const t1 = when + (end - off) + tail;
        const amp = ampFor(ev);
        const e2 = tail > 0 ? { ...ev, relTail: tail } : ev;
        this._playVoice(e2, ev.freq, amp, t0, t1, dest, nodes, tune);
        this._extraVoices(e2, track.ch, amp, t0, t1, dest, nodes, tune);
      }
    }
    /** 1チャンネルぶんのイベントを Web Audio ノードとしてスケジュールする */
    _scheduleTrack(track, when, dest, nodes, from = -Infinity, to = Infinity, again = false) {
      const tune = this._tuneOn(track.ch);
      for (let ev of track.events) {
        if (ev.t < from || ev.t >= to) continue;
        if (again && ev.loopVol !== void 0) ev = { ...ev, vol: ev.loopVol, fade: ev.loopFade };
        if (ev.lane && this._laneMute.has(`${track.ch}/${ev.lane}`)) continue;
        const t0 = when + ev.t;
        const tail = tailOf(ev, Math.max(0.01, ev.gate));
        const t1 = t0 + Math.max(0.01, ev.gate) + tail;
        const amp = ampFor(ev);
        if (tail > 0) ev = { ...ev, relTail: tail };
        const d = this._panFor(dest, ev.pos);
        this._playVoice(ev, ev.freq, amp, t0, t1, d, nodes, tune);
        this._extraVoices(ev, track.ch, amp, t0, t1, d, nodes, tune);
      }
    }
    /** 終わった SE を片づける */
    _cleanupSE(now) {
      this.seVoices = this.seVoices.filter((v) => {
        if (now < v.endTime) return true;
        if (v.left !== 0 && v.timer) return true;
        if (!v.system && (v.paused || this._sePausedAll)) return true;
        if (v.timer) {
          clearTimeout(v.timer);
          v.timer = 0;
        }
        try {
          v.gain.disconnect();
        } catch (e) {
        }
        return false;
      });
    }
    /** いま使っている音の数 */
    _usedVoices() {
      return this.bgmVoices + this.seVoices.reduce((n, v) => n + v.voices, 0);
    }
    /** 1 つの SE を止める */
    _stopVoice(v) {
      if (v.timer) {
        clearTimeout(v.timer);
        v.timer = 0;
      }
      v.left = 0;
      for (const n of v.nodes) {
        try {
          n.stop(0);
        } catch (e) {
        }
      }
      try {
        v.gain.disconnect();
      } catch (e) {
      }
      this.seVoices = this.seVoices.filter((x) => x !== v);
    }
    /**
     * 音の出口。すべての音はここを通すので、
     * ここ 1 つで全体を消したり戻したりできる
     */
    _out() {
      if (!this.ctx) return null;
      if (!this._bus) {
        this._master = this.ctx.createGain();
        this._master.gain.value = this._muted ? 0 : this.volume;
        this._master.connect(this.ctx.destination);
        this._bus = this.ctx.createGain();
        this._bus.gain.value = 1;
        this._bus.connect(this._master);
        if (this._keepSec > 0) this._startTap(this._keepSec);
      }
      return this._bus;
    }
    /**
     * 音を消す / 戻す。曲は止めずに出口を閉じるだけなので、
     * 戻したときは曲の続きがそのまま聞こえてくる。
     * @param {boolean} [on] 省略すると切り替え
     * @returns {boolean} いま消えているか
     */
    mute(on) {
      this._muted = on === void 0 ? !this._muted : !!on;
      this._out();
      const out = this._master;
      if (out) {
        const t = this.ctx.currentTime;
        out.gain.cancelScheduledValues(t);
        out.gain.setValueAtTime(out.gain.value, t);
        out.gain.linearRampToValueAtTime(this._muted ? 0 : this.volume, t + 0.05);
      }
      return this._muted;
    }
    /**
     * 音の大きさ(0〜8、既定 1)。曲も効果音もまとめて動く。
     * 1 を越えると持ち上がる — 声の少ない曲は既定では小さい。
     * 上げすぎると歪むので、耳で決める。
     * 消すのは `mute()` の役目で、こちらは大きさだけを決める。
     * 溜めるほうは絞らないので、残した音は鳴っていたとおりに残る
     */
    /**
     * いま回っている周を最後にして、終わりへ向かわせる。
     *
     * 周回数を決め直すのではない。長さを変えずに、次の周へ入らないようにする
     * だけ。いまの周は鳴らし終えるので、いきなり切れることはない。
     * `#label OUTRO` を書いた曲なら、抜ける道として後奏を通る。
     *
     * 鳴っていなければ何もしない。
     *
     * @returns {boolean} 向かわせたら true
     */
    goToEnding() {
      if (!this.bgmState) return false;
      this.bgmState.leaving = true;
      return true;
    }
    get volume() {
      return this._vol == null ? 1 : this._vol;
    }
    set volume(v) {
      this._vol = Math.max(0, Math.min(8, Number(v) || 0));
      if (this._master && !this._muted) {
        const t = this.ctx.currentTime;
        this._master.gain.cancelScheduledValues(t);
        this._master.gain.setValueAtTime(this._master.gain.value, t);
        this._master.gain.linearRampToValueAtTime(this._vol, t + 0.05);
      }
    }
    /** いま音を消しているか */
    get muted() {
      return !!this._muted;
    }
  };
  function encodeWAV(buffer) {
    const ch = buffer.numberOfChannels;
    const frames = buffer.length;
    const rate = buffer.sampleRate;
    const bytes = 2;
    const dataSize = frames * ch * bytes;
    const out = new Uint8Array(44 + dataSize);
    const view = new DataView(out.buffer);
    let p = 0;
    const str = (t) => {
      for (const c of t) out[p++] = c.charCodeAt(0);
    };
    const u32 = (v) => {
      view.setUint32(p, v, true);
      p += 4;
    };
    const u16 = (v) => {
      view.setUint16(p, v, true);
      p += 2;
    };
    str("RIFF");
    u32(36 + dataSize);
    str("WAVE");
    str("fmt ");
    u32(16);
    u16(1);
    u16(ch);
    u32(rate);
    u32(rate * ch * bytes);
    u16(ch * bytes);
    u16(8 * bytes);
    str("data");
    u32(dataSize);
    const src = [];
    for (let c = 0; c < ch; c++) src.push(buffer.getChannelData(c));
    for (let i = 0; i < frames; i++) {
      for (let c = 0; c < ch; c++) {
        const v = Math.max(-1, Math.min(1, src[c][i]));
        view.setInt16(p, Math.round(v < 0 ? v * 32768 : v * 32767), true);
        p += 2;
      }
    }
    return out;
  }

  // ../../../tmp/panther-update/tool/ui/version.js
  var PLAYER_VERSION = "1.0.0";

  // ../../../tmp/panther-update/tool/core/tomml.js
  var NAMES = ["c", "c+", "d", "d+", "e", "f", "f+", "g", "g+", "a", "a+", "b"];
  var LENS = [
    [16, "1"],
    [12, "2."],
    [8, "2"],
    [6, "4."],
    [4, "4"],
    [3, "8."],
    [2, "8"],
    [1, "16"]
  ];
  var midiOf = (freq) => Math.round(69 + 12 * Math.log2(freq / 440));
  function spell(head, cells) {
    const out = [];
    let left = cells;
    while (left > 0) {
      const hit = LENS.find(([n]) => n <= left);
      if (!hit) break;
      out.push(head + hit[1]);
      left -= hit[0];
    }
    return out.join("&");
  }
  function eventsToMML(tracks, opts = {}) {
    const tempo = opts.tempo || 120;
    const from = opts.from ?? 0;
    const to = opts.to ?? Infinity;
    const unit = 60 / tempo / 4;
    const cell = (sec) => Math.round(sec / unit);
    const wave = opts.waveName || ((n) => String(n));
    const env = opts.envName || ((n) => String(n));
    const out = [];
    let head = true;
    for (const t of tracks) {
      const notes = (t.events || []).filter((e) => e.t >= from - 1e-6 && e.t < to - 1e-6).sort((a, b) => a.t - b.t);
      if (!notes.length) continue;
      const L = [];
      if (t.name) L.push(`#ch ${t.name}`);
      if (t.role) L.push(`#role ${t.role}`);
      const body = [];
      if (head) {
        body.push(`t${tempo}`);
        head = false;
      }
      let at = cell(from);
      let oct = null, vol = null, wv = null, ev = null;
      for (const e of notes) {
        const start = cell(e.t);
        if (start > at) body.push(spell("r", start - at));
        if (start < at) continue;
        if (e.wave !== wv) {
          body.push(`@{${wave(e.wave)}}`);
          wv = e.wave;
        }
        if (e.env !== ev) {
          body.push(`@e{${env(e.env)}}`);
          ev = e.env;
        }
        if (e.vol !== vol) {
          body.push(`v${e.vol}`);
          vol = e.vol;
        }
        const midi = midiOf(e.freq);
        const o = Math.floor(midi / 12) - 1;
        if (o !== oct) {
          body.push(`o${o}`);
          oct = o;
        }
        const cells = Math.max(1, cell(e.t + e.dur) - start);
        body.push(spell(NAMES[(midi % 12 + 12) % 12], cells));
        at = start + cells;
      }
      if (Number.isFinite(to) && cell(to) > at) body.push(spell("r", cell(to) - at));
      L.push(body.join(" "));
      out.push(L.join("\n"));
    }
    return out.join("\n\n");
  }

  // ../../../tmp/panther-update/tool/core/wav.js
  function writeWAV(samples, rate = 44100) {
    const n = samples.length;
    const out = new Uint8Array(44 + n * 2);
    const dv = new DataView(out.buffer);
    const put = (at, s) => {
      for (let i = 0; i < s.length; i++) out[at + i] = s.charCodeAt(i);
    };
    put(0, "RIFF");
    dv.setUint32(4, 36 + n * 2, true);
    put(8, "WAVE");
    put(12, "fmt ");
    dv.setUint32(16, 16, true);
    dv.setUint16(20, 1, true);
    dv.setUint16(22, 1, true);
    dv.setUint32(24, rate, true);
    dv.setUint32(28, rate * 2, true);
    dv.setUint16(32, 2, true);
    dv.setUint16(34, 16, true);
    put(36, "data");
    dv.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) {
      const v = Math.max(-1, Math.min(1, samples[i]));
      dv.setInt16(44 + i * 2, Math.round(v * 32767), true);
    }
    return out;
  }

  // ../../../tmp/panther-update/tool/ui/player.js
  var COPYRIGHT = "2026 harayoki";
  var PLAYER_CSS = `
.mmsxx-player{ font-family:var(--mono); font-size:13px; line-height:1.55; color:var(--ink); }
.mmsxx-player [hidden]{ display:none !important; }
/* \u64CD\u4F5C\u306E\u5E2F\u3002\u62BC\u3059\u3082\u306E\u304C 1 \u304B\u6240\u306B\u307E\u3068\u307E\u3063\u3066\u3044\u306A\u3044\u3068\u3001\u62BC\u3057\u306B\u884C\u304F\u306E\u306B\u76EE\u304C\u6CF3\u3050 */
.mmsxx-player .deck{
  background:var(--panel); border:1px solid var(--line); padding:13px 14px;
}
.mmsxx-player .row{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.mmsxx-player .row + .row{ margin-top:11px; }
/* \u6B8B\u308A\u3092\u958B\u304F\u62BC\u3057\u3069\u3053\u308D\u3002\u3075\u3064\u3046\u306E\u30DC\u30BF\u30F3\u306E\u5F62\u306B\u3059\u308B\u3068\u3001\u4F55\u304B\u304C\u8D77\u304D\u308B\u3082\u306E\u306B
   \u898B\u3048\u3066\u3057\u307E\u3046\u3002\u67A0\u3092\u5916\u3057\u3066\u3001\u62BC\u3059\u3068\u5730\u304C\u53CD\u8EE2\u3059\u308B\u3060\u3051\u306B\u3059\u308B(2026-09-15) */
.mmsxx-player button.dots{
  margin-left:auto; border:0; padding:2px 8px 6px; line-height:1;
  font-size:16px; letter-spacing:.12em; color:var(--dim); border-radius:2px;
}
.mmsxx-player button.dots:hover{ color:var(--amber); border:0; }
.mmsxx-player button.dots[aria-pressed="true"]{ background:var(--sunk); color:var(--ink); }
/* \u7248\u3068\u6A29\u5229\u3092\u51FA\u3059\u3068\u3053\u308D\u3002\u3075\u3060\u3093\u306F\u8981\u3089\u306A\u3044\u306E\u3067\u3001\u5C0F\u3055\u304F\u7F6E\u3044\u3066\u7573\u3093\u3067\u304A\u304F */
.mmsxx-player button.help{
  border:0; padding:3px 6px; line-height:1;
  font-size:12px; color:var(--dim); border-radius:2px;
}
.mmsxx-player button.help:hover{ color:var(--amber); border:0; }
.mmsxx-player button.help[aria-pressed="true"]{ background:var(--sunk); color:var(--ink); }
/* ? \u306E\u5439\u304D\u51FA\u3057\u3002\u62BC\u3057\u3069\u3053\u308D\u306E\u3059\u3050\u6A2A\u306B\u51FA\u3059\u3002\u884C\u3068\u3057\u3066\u4E26\u3079\u308B\u3068\u3001
   \u3075\u3060\u3093\u8981\u3089\u306A\u3044\u3082\u306E\u304C\u5834\u6240\u3092\u53D6\u308A\u3064\u3065\u3051\u308B(2026-09-16) */
.mmsxx-player .ver-wrap{ position:relative; display:inline-flex; }
.mmsxx-player .about-ver{
  position:absolute; right:0; bottom:calc(100% + 7px); z-index:3;
  margin:0; padding:7px 10px; white-space:pre; text-align:right;
  font-size:11px; color:var(--ink); line-height:1.6;
  background:var(--panel); border:1px solid var(--line-hi); border-radius:3px;
  box-shadow:0 2px 8px rgba(0,0,0,.18);
}
/* \u5439\u304D\u51FA\u3057\u306E\u5C3B\u5C3E\u3002\u67A0\u306E\u3076\u3093\u3068\u4E2D\u8EAB\u306E\u3076\u3093\u3092 2 \u679A\u91CD\u306D\u308B */
.mmsxx-player .about-ver::before,
.mmsxx-player .about-ver::after{
  content:''; position:absolute; right:9px; top:100%;
  border:5px solid transparent; border-bottom:0;
}
.mmsxx-player .about-ver::before{ border-top-color:var(--line-hi); }
.mmsxx-player .about-ver::after{ margin-top:-1px; border-top-color:var(--panel); }
/* \u7573\u3080\u3068\u3053\u308D\u3002\u4E2D\u306E\u884C\u306E\u9593\u306F\u3001\u7573\u307E\u306A\u3044\u3068\u304D\u3068\u540C\u3058\u7A7A\u3051\u65B9\u306B\u3059\u308B */
.mmsxx-player .fold .row{ margin-top:11px; }
.mmsxx-player .time{ font-size:12px; color:var(--dim); white-space:nowrap; }
.mmsxx-player .time b{ color:var(--ink); font-weight:600; }
.mmsxx-player input[type=range]{
  width:100%; height:22px; margin:0; display:block;
  accent-color:var(--amber); background:transparent; cursor:pointer;
}
/* \u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u4E0A\u306B A \u3068 B \u306E\u7DDA\u3092\u91CD\u306D\u308B\u3002\u7DDA\u306F\u7D30\u3044\u304C\u3001\u3064\u307E\u3080\u3068\u3053\u308D\u306F\u5E83\u304F\u3068\u308B
   (\u6307\u3067\u3082\u62BC\u305B\u308B\u3088\u3046\u306B)\u3002\u7DDA\u305D\u306E\u3082\u306E\u306B\u5F53\u305F\u308A\u5224\u5B9A\u3092\u6301\u305F\u305B\u308B\u3068\u7D30\u3059\u304E\u3066\u63B4\u3081\u306A\u3044 */
.mmsxx-player .track{ position:relative; flex:1; min-width:140px; }
.mmsxx-player .ab{
  position:absolute; top:0; bottom:0; width:13px; margin-left:-6px;
  cursor:ew-resize; touch-action:none; z-index:2;
}
.mmsxx-player .ab::before{
  content:""; position:absolute; left:6px; top:1px; bottom:1px; width:1px;
  background:var(--teal);
}
.mmsxx-player .ab::after{
  content:attr(data-n); position:absolute; left:8px; top:0;
  font-size:8.5px; line-height:1; color:var(--teal);
}
.mmsxx-player .ab.off{ display:none; }
/* \u5207\u308C\u76EE\u306E\u7DDA\u3002\u62BC\u305B\u306A\u3044\u3088\u3046\u306B\u3057\u3066\u3001\u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u90AA\u9B54\u3092\u3057\u306A\u3044\u3002
   \u7B49\u9593\u9694\u3067\u5165\u308B\u7DB2\u306E\u76EE(#switch)\u306F\u8584\u304F\u3001\u624B\u3067\u5F15\u3044\u305F | \u306F\u6FC3\u304F\u3002
   \u66F2\u306E\u4F5C\u308A\u3068\u3057\u3066\u66F8\u3044\u305F\u3082\u306E\u3068\u3001\u305D\u306E\u5834\u3067\u5F15\u3044\u305F\u3082\u306E\u3092\u898B\u5206\u3051\u308B\u305F\u3081 */
.mmsxx-player .cuts{
  position:absolute; left:0; right:0; top:3px; bottom:3px;
  pointer-events:none; z-index:1;
}
.mmsxx-player .cuts i{
  position:absolute; top:0; bottom:0; width:1px; margin-left:-1px;
  background:var(--ink);
}
.mmsxx-player .cuts i.grid{ opacity:.14; }
.mmsxx-player .cuts i.bar{ opacity:.42; }
/* \u66F2\u306E\u4F5C\u308A\u306E\u7DDA\u3002\u623B\u308B\u5148(LOOP)\u3068\u5F8C\u594F\u306E\u59CB\u307E\u308A(OUTRO)\u3002\u5207\u308C\u76EE\u3068\u306F\u5225\u306E\u8272\u306B\u3057\u3066\u3001
   \u540C\u3058\u3068\u3053\u308D\u306B\u91CD\u306A\u3063\u3066\u3082\u898B\u5206\u3051\u3089\u308C\u308B\u3088\u3046\u306B\u3059\u308B */
.mmsxx-player .cuts i.loop, .mmsxx-player .cuts i.outro{
  background:var(--teal); opacity:.6; width:1px;
}
.mmsxx-player .cuts i.outro{ opacity:.45; }
/* A \u304B\u3089 B \u307E\u3067\u306E\u5E2F\u3002\u62BC\u305B\u306A\u3044\u3088\u3046\u306B\u3057\u3066\u3001\u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u90AA\u9B54\u3092\u3057\u306A\u3044 */
.mmsxx-player .abspan{
  position:absolute; top:2px; bottom:2px; background:var(--teal);
  opacity:.12; pointer-events:none; z-index:1;
}
/* \u97F3\u91CF\u3002\u30DF\u30E5\u30FC\u30C8\u3068 2 \u3064\u51FA\u3059\u3068\u304D\u306F\u67A0\u3092\u5206\u3051\u5408\u3063\u3066\u3001\u3072\u3068\u3064\u306A\u304C\u308A\u306B\u898B\u305B\u308B\u3002
   \u30B9\u30E9\u30A4\u30C0\u30FC\u306F\u77ED\u304F\u3066\u3088\u3044\u3002\u4F4D\u7F6E\u306E\u30B9\u30E9\u30A4\u30C0\u30FC\u3068\u540C\u3058\u5E45\u306B\u3059\u308B\u3068\u3001
   \u3069\u3061\u3089\u304C\u66F2\u306E\u4F4D\u7F6E\u306A\u306E\u304B\u5206\u304B\u3089\u306A\u304F\u306A\u308B */
.mmsxx-player .vol{ display:inline-flex; align-items:center; gap:7px; }
.mmsxx-player .vol input[type=range]{ width:82px; }
.mmsxx-player .vol.joined{
  gap:0; border:1px solid var(--line-hi); border-radius:2px; overflow:hidden;
}
.mmsxx-player .vol.joined button{
  border:0; border-right:1px solid var(--line-hi); border-radius:0; padding:5px 9px;
}
.mmsxx-player .vol.joined input[type=range]{ margin:0 8px 0 7px; }
.mmsxx-player .vol button[aria-pressed="true"]{
  background:var(--ink); color:var(--panel);
}
.mmsxx-player input[type=text]{
  font:inherit; font-size:11px; width:72px; text-align:center;
  color:var(--ink); background:var(--sunk);
  border:1px solid var(--line); border-radius:2px; padding:3px 4px;
}
.mmsxx-player input[type=text]:focus{ outline:none; border-color:var(--amber); }
.mmsxx-player label.sw{ display:inline-flex; align-items:center; gap:5px; font-size:11px; }
.mmsxx-player .lbl{
  font-size:10px; letter-spacing:.09em; text-transform:uppercase;
  color:var(--dim); margin-right:2px;
}
/* \u9078\u3076\u3068\u3053\u308D\u3002\u4E26\u3093\u3060\u30DC\u30BF\u30F3\u3060\u3068\u3001\u3069\u308C\u3068\u3069\u308C\u304C 1 \u3064\u306E\u7D44\u306A\u306E\u304B\u8AAD\u3081\u306A\u3044\u3002
   \u9078\u3076\u3082\u306E\u306F\u9078\u3076\u5F62\u306B\u3059\u308B(2026-09-15) */
.mmsxx-player .pick{
  display:inline-flex; align-items:center; gap:6px;
  font-size:10px; letter-spacing:.09em; text-transform:uppercase; color:var(--dim);
}
.mmsxx-player .pick select{
  font:inherit; font-size:11px; text-transform:none; letter-spacing:0;
  color:var(--ink); background:var(--sunk);
  border:1px solid var(--line-hi); border-radius:2px; padding:4px 6px;
}
.mmsxx-player .pick select:disabled{ opacity:.45; }
.mmsxx-player .chs, .mmsxx-player .marks{ display:flex; flex-wrap:wrap; gap:6px; }
/* \u9078\u629E\u80A2\u3002\u30B0\u30EB\u30FC\u30D7\u3054\u3068\u306B\u3001\u540D\u524D\u3068\u9078\u3079\u308B\u3082\u306E\u3092 1 \u304B\u305F\u307E\u308A\u306B\u3059\u308B */
.mmsxx-player .takes{ display:flex; flex-wrap:wrap; gap:6px 14px; align-items:center; }
.mmsxx-player .take{ display:inline-flex; align-items:center; gap:6px; }
.mmsxx-player .take .grp{ font-size:11px; color:var(--dim); }
/* From top \u306F\u9078\u629E\u80A2\u305C\u3093\u3076\u306B\u52B9\u304F\u3002\u30B0\u30EB\u30FC\u30D7\u306E\u4E26\u3073\u306E\u7D9A\u304D\u306B\u7F6E\u304F\u3068\u3001\u3044\u3061\u3070\u3093\u53F3\u306E
   \u30B0\u30EB\u30FC\u30D7\u3060\u3051\u306B\u639B\u304B\u308B\u3088\u3046\u306B\u898B\u3048\u308B\u306E\u3067\u3001\u884C\u306E\u7AEF\u307E\u3067\u96E2\u3059(2026-09-18) */
.mmsxx-player .row .wide{ margin-left:auto; }
.mmsxx-player .ch{ display:inline-flex; align-items:center; gap:7px; }
/* \u97F3\u91CF\u306B\u5207\u308A\u66FF\u3048\u305F\u3068\u304D\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u3002\u540D\u524D\u30FB\u30B9\u30E9\u30A4\u30C0\u30FC\u30FB\u5272\u5408\u3092 1 \u304B\u305F\u307E\u308A\u306B\u3059\u308B\u3002
   \u9CF4\u3063\u3066\u3044\u308B\u3042\u3044\u3060\u306F\u540D\u524D\u304C\u7425\u73C0\u306B\u70B9\u304F\u3002\u30DC\u30BF\u30F3\u304C\u7121\u3044\u306E\u3067\u67A0\u3092\u5149\u3089\u305B\u3089\u308C\u306A\u3044\u304C\u3001
   \u70B9\u304F\u306E\u306F\u4E00\u77AC\u30FB\u6D88\u3048\u308B\u306E\u306F\u5C11\u3057\u5F15\u304D\u305A\u308B\u3001\u3068\u3044\u3046\u70B9\u3051\u65B9\u306F\u30DC\u30BF\u30F3\u3068\u540C\u3058\u306B\u3059\u308B */
.mmsxx-player .chvol .name{ font-size:11px; transition:color .18s ease-out; }
.mmsxx-player .chvol.hot .name{ color:var(--amber); transition:none; }
.mmsxx-player .chvol input[type=range]{ width:82px; }
.mmsxx-player .chvol .pct{ min-width:3.2em; margin-right:8px; font-size:11px; color:var(--dim);
  font-variant-numeric:tabular-nums; }
.mmsxx-player .chmode{ display:inline-flex; gap:6px; margin-left:auto; }
/* \u30DF\u30E5\u30FC\u30C8\u306E\u30DC\u30BF\u30F3\u306E\u5074\u306B\u6DFB\u3048\u308B\u97F3\u91CF\u3002\u62BC\u305B\u308B\u3082\u306E\u3067\u306F\u306A\u3044\u306E\u3067\u67A0\u306F\u4ED8\u3051\u306A\u3044\u3002
   0% \u307E\u3067\u4E0B\u3052\u305F\u884C\u3060\u3051\u7425\u73C0\u306B\u3059\u308B\u3002\u9ED9\u3063\u3066\u3044\u308B\u306E\u306B\u62BC\u3057\u3066\u3042\u308B\u3088\u3046\u306B\u898B\u3048\u308B\u306E\u3092
   \u9632\u3050\u306E\u304C\u3053\u3053\u306E\u5F79\u76EE\u306A\u306E\u3067\u3001\u305D\u306E 1 \u3064\u3060\u3051\u76EE\u7ACB\u3066\u3070\u3088\u3044 */
.mmsxx-player .ch .lvl{ font-size:9.5px; color:var(--dim); letter-spacing:.04em; }
.mmsxx-player .ch .lvl.off{ color:var(--amber); }
.mmsxx-player .ch .role{ font-size:9.5px; color:var(--dim); letter-spacing:.06em; }
/* 1 \u672C\u3067\u4F55\u58F0\u4F7F\u3046\u304B\u3002\u548C\u97F3\u3092\u9CF4\u3089\u3059\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u30DC\u30BF\u30F3\u306E\u4E2D\u306B\u51FA\u3059\u3002
   \u67A0\u306F\u4ED8\u3051\u306A\u3044\u3002\u30DC\u30BF\u30F3\u306E\u4E2D\u306B\u3082\u3046 1 \u3064\u67A0\u304C\u3042\u308B\u3068\u3001\u62BC\u3057\u3069\u3053\u308D\u304C 2 \u3064\u306B\u898B\u3048\u308B */
.mmsxx-player .ch .voices{
  margin-left:5px; font-size:9.5px; color:var(--teal); letter-spacing:.04em;
}
/* \u62BC\u3057\u3066\u3042\u308B\u3042\u3044\u3060\u306F\u5730\u304C\u53CD\u8EE2\u3059\u308B\u3002\u9752\u7DD1\u306E\u307E\u307E\u3060\u3068\u3001\u660E\u308B\u3044\u5730\u306B\u660E\u308B\u3044\u5B57\u304C
   \u8F09\u3063\u3066\u8AAD\u3081\u306A\u304F\u306A\u308B(\u6697\u3044\u914D\u8272\u3067\u3068\u304F\u306B)\u3002\u5730\u3068\u9006\u306E\u8272\u3092\u7D99\u3044\u3067\u8584\u304F\u3059\u308B */
.mmsxx-player .ch button.sw[aria-pressed="true"] .voices{
  color:inherit; opacity:.75;
}
/* \u3044\u307E\u9CF4\u3063\u3066\u3044\u308B\u30C1\u30E3\u30F3\u30CD\u30EB\u3068\u5C64\u3002\u62BC\u3057\u3066\u3042\u308B\u30DC\u30BF\u30F3\u3060\u3051\u304C\u5149\u308B(\u9ED9\u3089\u305B\u305F\u3082\u306E\u306F
   \u97F3\u91CF\u304C 0 \u306A\u306E\u3067\u5149\u3089\u306A\u3044)\u3002\u7425\u73C0\u306F\u300C\u3044\u307E\u9CF4\u3063\u3066\u3044\u308B\u300D\u306E\u8272(docs/UI.md)\u3002
   \u5730\u306E\u53CD\u8EE2\u306F\u5165 / \u5207\u306B\u4F7F\u3063\u3066\u3044\u308B\u306E\u3067\u3001\u3053\u3061\u3089\u306F\u67A0\u3067\u8A00\u3046\u3002
   \u70B9\u304F\u306E\u306F\u4E00\u77AC\u306A\u306E\u3067\u3001\u6D88\u3048\u308B\u307B\u3046\u3060\u3051\u5C11\u3057\u5F15\u304D\u305A\u308B(2026-09-19) */
.mmsxx-player .ch button.sw,
.mmsxx-player .lanes button.sw{ transition:box-shadow .18s ease-out; }
.mmsxx-player .ch button.sw.hot,
.mmsxx-player .lanes button.sw.hot{
  box-shadow:0 0 0 1px var(--amber), 0 0 6px -1px var(--amber);
  transition:none;
}
/* \u4E2D\u306E\u5C64\u3092\u958B\u304F\u5370\u3002\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u30DC\u30BF\u30F3\u3068\u306F\u5225\u306B\u62BC\u305B\u308B\u5FC5\u8981\u304C\u3042\u308B\u306E\u3067\u3001
   \u30DC\u30BF\u30F3\u306E\u4E2D\u306B\u306F\u5165\u308C\u306A\u3044\u3002\u62BC\u3057\u3069\u3053\u308D\u304C 2 \u3064\u3042\u308B\u3053\u3068\u3092\u5F62\u3067\u8A00\u3046 */
.mmsxx-player .ch button.open{
  border:0; padding:4px 4px; line-height:1; font-size:9px; color:var(--dim);
  border-radius:2px; margin-left:-4px;
}
.mmsxx-player .ch button.open:hover{ color:var(--amber); border:0; }
.mmsxx-player .ch button.open[aria-pressed="true"]{ color:var(--ink); }
/* \u958B\u3044\u305F\u4E2D\u8EAB\u3002\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u4E0B\u306B\u3076\u3089\u4E0B\u3052\u308B\u3002\u884C\u3092\u5206\u3051\u306A\u3044\u3068\u3001
   \u3069\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u3092\u958B\u3044\u305F\u306E\u304B\u5206\u304B\u3089\u306A\u304F\u306A\u308B */
.mmsxx-player .lanes{
  display:flex; flex-wrap:wrap; gap:5px; align-items:center;
  width:100%; margin:-2px 0 2px; padding:0 0 0 14px;
}
.mmsxx-player .lanes .of{ font-size:9.5px; color:var(--dim); letter-spacing:.06em; }
.mmsxx-player .lanes button{ font-size:10px; padding:3px 8px; border-radius:999px; }
/* \u62BC\u3059\u3082\u306E\u306E\u5F62\u3002\u56DB\u89D2\u306F\u4F55\u304B\u304C\u8D77\u304D\u308B\u3082\u306E\u3001\u89D2\u4E38\u306F\u5165 / \u5207(docs/UI.md) */
.mmsxx-player button{
  font:inherit; font-size:11px; color:var(--ink); background:transparent;
  border:1px solid var(--dim); border-radius:2px; padding:5px 9px; cursor:pointer;
}
.mmsxx-player button:hover{ border-color:var(--amber); color:var(--amber); }
.mmsxx-player button:disabled{ opacity:.4; cursor:default; }
.mmsxx-player button:disabled:hover{ border-color:var(--dim); color:var(--ink); }
.mmsxx-player button:focus-visible{ outline:2px solid var(--amber); outline-offset:1px; }
.mmsxx-player button.sw{ border-radius:999px; padding:5px 11px; border-color:var(--line-hi); }
/* \u5408\u56F3\u306E\u30E9\u30F3\u30D7\u3002\u66F2\u306B\u7F6E\u3044\u305F\u5408\u56F3\u3092\u901A\u308B\u3068\u5149\u308B\u3002\u62BC\u3059\u3082\u306E\u3067\u306F\u306A\u3044\u306E\u3067\u3001
   \u30DC\u30BF\u30F3\u306E\u5F62\u306B\u3057\u306A\u3044\u3002\u70B9\u304F\u306E\u3082\u6D88\u3048\u308B\u306E\u3082\u4E00\u77AC\u306B\u3059\u308B\u3002\u3058\u308F\u3063\u3068\u6D88\u3059\u3068\u3001
   \u3044\u3064\u5C4A\u3044\u305F\u306E\u304B\u304C\u8AAD\u3081\u306A\u3044(2026-09-18) */
.mmsxx-player .leds{ display:flex; flex-wrap:wrap; gap:9px; align-items:center; }
.mmsxx-player .led{
  display:inline-flex; align-items:center; gap:5px;
  font-size:10.5px; color:var(--dim); white-space:nowrap;
}
.mmsxx-player .led::before{
  content:""; width:7px; height:7px; border-radius:50%;
  border:1px solid var(--line-hi); background:var(--panel);
}
/* \u5C4A\u3044\u305F\u3082\u306E\u306E\u63A7\u3048\u3002\u7573\u3093\u3067\u304A\u304F\u3002\u756A\u53F7\u306F\u3053\u3053\u3067\u3060\u3051\u51FA\u3059(\u30E9\u30F3\u30D7\u306F\u540D\u524D\u3060\u3051) */
.mmsxx-player .cuelog{
  width:100%; max-height:92px; overflow:auto; margin-top:2px;
  background:var(--sunk); border:1px solid var(--line);
  padding:5px 8px; font-size:10.5px; color:var(--dim); line-height:1.5;
}
.mmsxx-player .cuelog div{ white-space:pre; }
.mmsxx-player .led.on::before{
  background:var(--amber); border-color:var(--amber);
}
/* \u3044\u307E\u9CF4\u3063\u3066\u3044\u308B\u3068\u3053\u308D\u306E\u672D(\u8DF3\u3076\u5148\u306E\u4E00\u89A7)\u3002\u62BC\u3057\u3066\u3042\u308B\u304B\u3069\u3046\u304B\u3068\u306F\u5225\u306E\u8A71\u306A\u306E\u3067\u3001
   \u5730\u3092\u53CD\u8EE2\u3055\u305B\u305A\u3001\u8272\u3068\u67A0\u3060\u3051\u3067\u8A00\u3046 */
.mmsxx-player .marks button.now{ border-color:var(--amber); color:var(--amber); }
.mmsxx-player button.sw[aria-pressed="true"]{
  background:var(--ink); color:var(--panel); border-color:var(--ink);
}
/* \u984C\u3068\u89E3\u8AAC\u3002\u66F2\u304C\u540D\u4E57\u308B\u3082\u306E\u306A\u306E\u3067\u3001\u62BC\u3059\u3068\u3053\u308D\u306E\u5916\u306B\u7F6E\u304F */
.mmsxx-player .about{ margin:0 0 9px; }
.mmsxx-player .about b{ font-size:12px; font-weight:600; color:var(--ink); }
/* \u984C\u3068\u30D0\u30FC\u30B8\u30E7\u30F3\u306E\u884C\u3002\u984C\u306F\u5DE6\u3001\u30D0\u30FC\u30B8\u30E7\u30F3\u306F\u53F3\u7AEF\u3002\u540C\u3058\u66F2\u3092\u4F55\u5EA6\u3082\u76F4\u3059\u306E\u3067\u3001
   \u3044\u307E\u9CF4\u3063\u3066\u3044\u308B\u306E\u304C\u3069\u308C\u306A\u306E\u304B\u304C\u5206\u304B\u308B\u3088\u3046\u306B\u3059\u308B(#version)\u3002
   1 \u884C\u306B\u4E26\u3079\u308B\u306E\u306B\u56F2\u307F\u304C\u8981\u308B\u3002b \u3068 span \u3092\u4E26\u3079\u305F\u3060\u3051\u3060\u3068\u3001
   \u984C\u304C\u9577\u3044\u3068\u304D\u306B\u30D0\u30FC\u30B8\u30E7\u30F3\u304C\u4E0B\u3078\u6298\u308A\u8FD4\u3059(2026-09-19) */
.mmsxx-player .about .head{
  display:flex; align-items:baseline; gap:10px;
}
.mmsxx-player .about .ver{
  margin-left:auto; font-size:10px; font-weight:400; color:var(--dim);
  white-space:nowrap;
}
/* \u3044\u307E\u52B9\u3044\u3066\u3044\u308B\u6A5F\u68B0(#machine)\u3002\u984C\u306E\u96A3\u306B\u7F6E\u304F\u3002\u7248\u3092\u5207\u308A\u66FF\u3048\u308B\u3068\u5909\u308F\u308B\u306E\u3067\u3001
   \u91E3\u308A\u5408\u3044\u304C\u5909\u308F\u3063\u305F\u3053\u3068\u304C\u898B\u3048\u308B\u3088\u3046\u306B\u3059\u308B\u3002\u5730\u3092\u53CD\u8EE2\u3055\u305B\u306A\u3044\u306E\u306F\u3001
   \u62BC\u305B\u308B\u3082\u306E\u3067\u306F\u306A\u3044\u305F\u3081 */
.mmsxx-player .about .mach{
  font-size:10px; color:var(--teal); letter-spacing:.04em; white-space:nowrap;
}
/* \u7248\u3068\u7D44\u306E\u62BC\u3057\u3069\u3053\u308D\u3002\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u4E26\u3073\u3068\u540C\u3058\u5F62\u306B\u3059\u308B\u3002
   \u7248\u306F\u30E9\u30B8\u30AA(1 \u3064\u3060\u3051)\u3001\u7D44\u306F\u30C1\u30A7\u30C3\u30AF\u30DC\u30C3\u30AF\u30B9(\u91CD\u306A\u308B) */
.mmsxx-player .grp{ display:flex; flex-wrap:wrap; gap:6px 12px; align-items:center; }
.mmsxx-player .grp label{
  display:inline-flex; align-items:center; gap:5px; font-size:11px; cursor:pointer;
}
/* \u7248\u3067\u9ED9\u3063\u3066\u3044\u308B\u30C1\u30E3\u30F3\u30CD\u30EB\u3002\u884C\u306F\u6D88\u3055\u305A\u306B\u8584\u304F\u3059\u308B\u3002\u4E26\u3073\u304C\u52D5\u304F\u3068\u8AAD\u307F\u306B\u304F\u3044\u3002
   \u62BC\u305B\u308B\u307E\u307E\u306B\u3059\u308B\u3068\u3001\u81EA\u5206\u3067\u6D88\u3057\u305F\u306E\u304B\u3069\u3061\u3089\u304B\u5206\u304B\u3089\u306A\u304F\u306A\u308B */
.mmsxx-player .ch.gone{ opacity:.4; }
.mmsxx-player .ch.gone button{ cursor:default; }
.mmsxx-player .about p{
  margin:4px 0 0; font-size:11px; line-height:1.7; color:var(--dim);
  white-space:pre-line;
}
/* \u66F8\u304D\u51FA\u3057\u3066\u3044\u308B\u3042\u3044\u3060\u306E\u8986\u3044\u3002\u62BC\u3059\u3068\u3053\u308D\u3092\u6697\u304F\u3057\u3066\u3001\u9032\u307F\u5177\u5408\u3060\u3051\u898B\u305B\u308B\u3002
   \u6642\u9593\u304C\u304B\u304B\u308B\u306E\u3067\u3001\u6B62\u307E\u3063\u305F\u3088\u3046\u306B\u898B\u3048\u306A\u3044\u3088\u3046\u306B\u3059\u308B(2026-09-16) */
.mmsxx-player{ position:relative; }
.mmsxx-player.busy .deck{ opacity:.35; pointer-events:none; }
/* \u5E2F\u306F\u307B\u304B\u306E\u62BC\u3059\u3068\u3053\u308D\u3068\u4F3C\u305B\u306A\u3044\u3002\u592A\u304F\u3057\u3066\u3001\u8272\u3082\u5206\u3051\u308B \u2014
   \u7425\u73C0\u306F\u62BC\u305B\u308B\u3082\u306E\u3001\u5730\u306E\u53CD\u8EE2\u306F\u5165 / \u5207\u306B\u4F7F\u3063\u3066\u3044\u308B\u306E\u3067\u3001\u9032\u307F\u5177\u5408\u306F\u9752\u7DD1\u306B\u3059\u308B\u3002
   \u6570\u306F\u305D\u306E\u96A3\u306B\u5927\u304D\u304F\u51FA\u3059(2026-09-16) */
.mmsxx-player .veil{
  position:absolute; left:8px; right:8px; top:50%; transform:translateY(-50%);
  display:flex; align-items:center; gap:12px; z-index:3;
  padding:12px 14px; background:var(--panel); border:1px solid var(--line-hi);
  border-radius:3px; box-shadow:0 2px 10px rgba(0,0,0,.18);
}
.mmsxx-player .veil .bar{
  flex:1; height:16px; background:var(--sunk);
  border:1px solid var(--line-hi); border-radius:8px; overflow:hidden;
}
.mmsxx-player .veil .bar span{
  display:block; height:100%; width:0; background:var(--teal);
  transition:width .2s linear;
}
.mmsxx-player .veil .pct{
  font-size:15px; font-weight:600; color:var(--ink);
  min-width:52px; text-align:right; font-variant-numeric:tabular-nums;
}
/* \u713C\u3044\u305F\u3082\u306E\u3092\u7F6E\u304F\u3068\u3053\u308D\u3002\u67A0\u306E\u4E2D\u3067\u306F\u843D\u3068\u3059\u306E\u3092\u65AD\u3089\u308C\u308B\u3053\u3068\u304C\u3042\u308B\u306E\u3067\u3001
   \u97F3\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306B\u633F\u3057\u3066\u3001\u305D\u3061\u3089\u306E menu \u304B\u3089\u4FDD\u5B58\u3057\u3066\u3082\u3089\u3046(2026-09-16) */
.mmsxx-player .wavnote{ margin:9px 0 0; }
.mmsxx-player .got{ display:flex; align-items:center; gap:10px; margin:9px 0 0; }
.mmsxx-player .got audio{ flex:1; min-width:180px; height:32px; }
.mmsxx-player .got a{
  font-size:11px; color:var(--amber); text-decoration:none;
  border:1px solid var(--line-hi); border-radius:2px; padding:5px 9px; white-space:nowrap;
}
.mmsxx-player .got a:hover{ border-color:var(--amber); }
/* \u6E21\u3055\u308C\u305F MML \u3092\u8AAD\u307E\u305B\u308B\u3068\u3053\u308D\u3002\u30DA\u30FC\u30B8\u306B\u91CD\u306D\u3066\u51FA\u3059\u3002
   \u8AAD\u3080\u305F\u3081\u306E\u3082\u306E\u306A\u306E\u3067\u3001\u62BC\u3057\u3069\u3053\u308D\u3068\u540C\u3058\u5927\u304D\u3055\u3060\u3068\u5B57\u304C\u5C0F\u3055\u3059\u304E\u308B\u3002
   \u4E0B\u304C\u898B\u3048\u3066\u3044\u308B\u3068\u3001\u9CF4\u3089\u3057\u306A\u304C\u3089\u8AAD\u3081\u308B\u3088\u3046\u306B\u898B\u3048\u3066\u3001\u5B9F\u969B\u306F\u62BC\u305B\u306A\u3044 */
.mmsxx-player .srcwrap{
  position:fixed; inset:0; z-index:20; display:flex;
  align-items:center; justify-content:center; padding:20px;
  background:rgba(0,0,0,.45);
}
.mmsxx-player .srcbox{
  display:flex; flex-direction:column; gap:9px;
  width:min(900px, 100%); max-height:86vh; padding:12px 13px;
  background:var(--panel); border:1px solid var(--line-hi); border-radius:3px;
  box-shadow:0 4px 18px rgba(0,0,0,.3);
}
.mmsxx-player .srchead{ display:flex; align-items:center; gap:10px; }
.mmsxx-player .srchead button{ margin-left:auto; }
.mmsxx-player .src{
  flex:1; min-height:min(55vh, 420px); width:100%; padding:10px 11px;
  font-family:var(--mono); font-size:13px; line-height:1.7; color:var(--ink);
  background:var(--sunk); border:1px solid var(--line); border-radius:2px;
  resize:none; white-space:pre; overflow:auto;
}
/* \u5199\u3057\u305F\u5B57\u3092\u51FA\u3059\u3068\u3053\u308D\u3002\u5199\u305B\u306A\u3044\u7F6E\u304D\u65B9\u304C\u3042\u308B\u306E\u3067\u3001\u5FC5\u305A\u898B\u3048\u308B\u3088\u3046\u306B\u3059\u308B */
.mmsxx-player .out{
  display:block; width:100%; margin:9px 0 0; padding:8px 9px;
  font:inherit; font-size:11px; line-height:1.6; color:var(--ink);
  background:var(--sunk); border:1px solid var(--line); border-radius:2px;
  resize:vertical; white-space:pre; overflow:auto;
}
.mmsxx-player .note{ font-size:11px; color:var(--dim); margin:7px 0 0; }
/* \u6C17\u3092\u3064\u3051\u3066\u307B\u3057\u3044\u3053\u3068\u3002\u7425\u73C0\u3002\u9CF4\u3089\u305B\u3066\u306F\u3044\u308B */
.mmsxx-player .note.bad{ color:var(--amber); }
/* \u76F4\u3059\u3068\u3053\u308D\u304C\u3042\u3063\u3066\u3001\u9CF4\u3089\u305B\u306A\u3044\u3068\u304D\u3002\u65E2\u5B9A\u306F\u8D64\u3002
   \u7425\u73C0\u306F\u300C\u62BC\u305B\u308B\u30FB\u9CF4\u3063\u3066\u3044\u308B\u300D\u306B\u4F7F\u3063\u3066\u3044\u308B\u306E\u3067\u3001\u6B62\u307E\u3063\u3066\u3044\u308B\u3053\u3068\u3092\u540C\u3058\u8272\u3067
   \u8A00\u3046\u3068\u8AAD\u307F\u5206\u3051\u3089\u308C\u306A\u3044\u3002\u30DA\u30FC\u30B8\u304C --err \u3092\u7F6E\u3051\u3070\u3001\u305D\u3061\u3089\u304C\u52DD\u3064 */
.mmsxx-player .note.err{ color:var(--err, #c62f26); }
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]) .mmsxx-player .note.err{ color:var(--err, #ff7a6e); }
}
:root[data-theme="dark"] .mmsxx-player .note.err{ color:var(--err, #ff7a6e); }
`;
  var clock = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  function mountPlayer(root, opts = {}) {
    const audio = opts.audio || new ChipTuneSound();
    const cutGap = Number.isFinite(Number(opts.cutGap)) ? Number(opts.cutGap) : 1;
    const NAME = "__player__";
    root.classList.add("mmsxx-player");
    root.textContent = "";
    root.innerHTML = `
    <div class="srcwrap" data-p="srcwrap" hidden>
      <div class="srcbox">
        <div class="srchead">
          <span class="lbl">MML</span>
          <span class="lbl" data-p="srcsize"></span>
          <button type="button" data-p="srcclose">Close</button>
        </div>
        <textarea class="src" data-p="src" readonly
                  aria-label="The MML this player was given"></textarea>
      </div>
    </div>
    <div class="about" data-p="about" hidden>
      <div class="head"><b data-p="title"></b><span class="mach" data-p="mach" hidden></span><span class="ver" data-p="songver" hidden></span></div>
      <p data-p="abouttext"></p>
    </div>
    <div class="deck">
      <div class="row">
        <button type="button" data-p="play">Play</button>
        <button type="button" data-p="stop">Stop</button>
        <span class="track" data-p="track">
          <input type="range" data-p="seek" min="0" max="1000" value="0" step="1"
                 aria-label="Position">
          <span class="cuts" data-p="cuts"></span>
          <span class="abspan" data-p="abspan" hidden></span>
          <span class="ab off" data-p="abA" data-n="A" role="slider"
                aria-label="Repeat from"></span>
          <span class="ab off" data-p="abB" data-n="B" role="slider"
                aria-label="Repeat to"></span>
        </span>
        <span class="time"><b data-p="now">0:00</b> / <span data-p="len">0:00</span></span>
        <span class="lbl" data-p="vollbl">Volume</span>
        <span class="vol" data-p="volwrap">
          <button type="button" data-p="mute" aria-pressed="false" hidden>Mute</button>
          <input type="range" data-p="vol" min="0" max="100" value="100" step="1"
                 aria-label="Volume">
        </span>
      </div>
      <div class="row" data-p="deck2">
        <button type="button" class="sw" data-p="rept" aria-pressed="true">Repeat all</button>
        <label class="pick" data-p="looplbl">Main loops
          <select data-p="loops"></select>
        </label>
        <button type="button" data-p="wav" title="Export WAV">&darr; WAV</button>
        <button type="button" data-p="mml" title="Export MML">&darr; MML</button>
        <button type="button" class="sw" data-p="showmml" aria-pressed="false"
                aria-expanded="false" title="Show the MML this player was given"
                >Show MML</button>
        <button type="button" class="dots" data-p="open" aria-pressed="false"
                aria-expanded="false" aria-label="More" title="More">&hellip;</button>
        <span class="ver-wrap">
          <button type="button" class="help" data-p="help" aria-pressed="false"
                  aria-expanded="false" aria-label="About" title="About">?</button>
          <span class="about-ver" role="status" data-p="ver" hidden></span>
        </span>
      </div>
      <p class="note bad wavnote" data-p="wavnote" hidden></p>
      <div class="got" data-p="got" hidden>
        <audio controls data-p="audio"></audio>
        <a data-p="save" download>Save</a>
      </div>
      <div class="fold" data-p="fold" hidden>
      <div class="row" data-p="markrow" hidden>
        <span class="lbl">Jump to</span>
        <span class="marks" data-p="marks"></span>
      </div>
      <div class="row" data-p="takerow" hidden>
        <span class="lbl">Takes</span>
        <span class="takes" data-p="takes"></span>
        <button type="button" class="sw wide" data-p="rew" aria-pressed="false"
                title="Always restart the block, whatever the tune says. Applies to every group"
                >From top</button>
      </div>
      <div class="row" data-p="fxrow" hidden>
        <span class="lbl">Effects</span>
        <span class="marks" data-p="fx"></span>
      </div>
      <div class="row" data-p="edrow" hidden>
        <span class="lbl">Edition</span>
        <span class="grp" data-p="eds"></span>
      </div>
      <div class="row" data-p="setrow" hidden>
        <span class="lbl">Sets</span>
        <span class="grp" data-p="sets"></span>
      </div>
      <div class="row" data-p="chsrow">
        <span class="lbl" data-p="chslbl">Channels</span>
        <span class="chs" data-p="chs"></span>
        <span class="chmode">
          <button type="button" class="sw" data-p="volsw" aria-pressed="false"
                  title="Set each channel's volume. It also goes into the WAV.">Volume</button>
          <button type="button" data-p="volreset" hidden
                  title="Put every channel back to 100%.">Reset</button>
        </span>
      </div>
      <div class="row" data-p="cuerow" hidden>
        <span class="lbl">Cues</span>
        <span class="leds" data-p="leds"></span>
        <button type="button" class="sw" data-p="logsw" aria-pressed="false"
                aria-expanded="false">Log</button>
      </div>
      <div class="row" data-p="logrow" hidden>
        <span class="lbl"></span>
        <div class="cuelog" data-p="cuelog"></div>
      </div>
      <div class="row" data-p="looserow">
        <label class="sw"><input type="checkbox" data-p="loose"> Ignore errors</label>
        <span class="lbl" data-p="loosenote"></span>
      </div>
      <div class="row" data-p="abrow">
        <label class="sw"><input type="checkbox" data-p="abOn"> A &ndash; B</label>
        <input type="number" data-p="abFrom" aria-label="Repeat from"
               min="0" step="0.1" placeholder="0">
        <span class="lbl">&ndash;</span>
        <input type="number" data-p="abTo" aria-label="Repeat to"
               min="0" step="0.1" placeholder="0">
        <span class="lbl">sec</span>
        <button type="button" data-p="copy">Copy selection as MML</button>
      </div>
      </div>
    </div>
    <div class="veil" data-p="veil" hidden>
      <div class="bar"><span data-p="barfill"></span></div>
      <span class="pct" data-p="pct">0%</span>
      <button type="button" data-p="cancel">Cancel</button>
    </div>
    <textarea class="out" data-p="out" rows="6" readonly hidden
              aria-label="MML of the selection"></textarea>
    <p class="note" data-p="note"></p>
  `;
    const $ = (k) => root.querySelector(`[data-p="${k}"]`);
    const el = {
      play: $("play"),
      stop: $("stop"),
      seek: $("seek"),
      now: $("now"),
      len: $("len"),
      rept: $("rept"),
      chs: $("chs"),
      marks: $("marks"),
      markrow: $("markrow"),
      takes: $("takes"),
      takerow: $("takerow"),
      note: $("note"),
      deck2: $("deck2"),
      chslbl: $("chslbl"),
      volsw: $("volsw"),
      volreset: $("volreset"),
      open: $("open"),
      fold: $("fold"),
      chsrow: $("chsrow"),
      cuts: $("cuts"),
      fx: $("fx"),
      fxrow: $("fxrow"),
      rew: $("rew"),
      loose: $("loose"),
      loosenote: $("loosenote"),
      looserow: $("looserow"),
      leds: $("leds"),
      cuerow: $("cuerow"),
      logsw: $("logsw"),
      logrow: $("logrow"),
      cuelog: $("cuelog"),
      help: $("help"),
      ver: $("ver"),
      loops: $("loops"),
      looplbl: $("looplbl"),
      abrow: $("abrow"),
      abOn: $("abOn"),
      abFrom: $("abFrom"),
      abTo: $("abTo"),
      copy: $("copy"),
      out: $("out"),
      wav: $("wav"),
      mml: $("mml"),
      showmml: $("showmml"),
      src: $("src"),
      srcwrap: $("srcwrap"),
      srcclose: $("srcclose"),
      srcsize: $("srcsize"),
      veil: $("veil"),
      barfill: $("barfill"),
      pct: $("pct"),
      cancel: $("cancel"),
      got: $("got"),
      audio: $("audio"),
      save: $("save"),
      wavnote: $("wavnote"),
      track: $("track"),
      abA: $("abA"),
      abB: $("abB"),
      abspan: $("abspan"),
      volwrap: $("volwrap"),
      vol: $("vol"),
      mute: $("mute"),
      vollbl: $("vollbl"),
      about: $("about"),
      title: $("title"),
      abouttext: $("abouttext"),
      songver: $("songver"),
      mach: $("mach"),
      edrow: $("edrow"),
      eds: $("eds"),
      setrow: $("setrow"),
      sets: $("sets")
    };
    const showChs = opts.channels !== false;
    const showRept = opts.repeat !== false;
    const showAbout = opts.about !== false;
    const copyMode = opts.copy === void 0 ? true : opts.copy;
    el.showmml.hidden = opts.showMml === false;
    el.looserow.hidden = opts.ignoreErrors !== true;
    const showVol = opts.volume !== false;
    const showMute = opts.mute === true;
    el.vol.hidden = !showVol;
    el.mute.hidden = !showMute;
    el.copy.hidden = copyMode === false;
    if (copyMode === "show") el.copy.textContent = "Show selection as MML";
    el.vollbl.hidden = !showVol && !showMute;
    el.volwrap.hidden = !showVol && !showMute;
    el.volwrap.classList.toggle("joined", showVol && showMute);
    el.rept.hidden = !showRept;
    el.looplbl.hidden = !showRept;
    el.chsrow.hidden = !showChs;
    el.deck2.hidden = !showRept;
    let busy = false;
    let quit = false;
    let wavURL = null;
    const inFrame = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();
    const fxOff = {};
    let restart = false;
    let loose = false;
    let open = opts.open === true;
    const fold = () => {
      el.fold.hidden = !open;
      if (open) drawFx();
      clearNote();
      if (!open) {
        el.out.hidden = true;
        dropWAV();
      }
      el.open.setAttribute("aria-pressed", String(open));
      el.open.setAttribute("aria-expanded", String(open));
    };
    if (opts.loops > 0) audio.loopTimes = opts.loops;
    audio.ignoreSongLoop = opts.repeatAll !== true;
    let marks = [];
    let cuts = { grid: [], bars: [] };
    let loopAt = null, outroAt = null;
    let cues = [];
    const leds = /* @__PURE__ */ new Map();
    let lastPos = 0;
    let takes = [];
    let dragging = false;
    let from = 0;
    let mml = opts.mml ?? "";
    let voices = [];
    const openLanes = /* @__PURE__ */ new Set();
    let chans = [];
    let volMode = false;
    let groups = { groups: [], group: null, sets: [], silent: [], machine: null };
    let total = 0;
    let abFrom = 0;
    let abTo = 0;
    const say = (text, kind) => {
      el.note.textContent = text || "";
      el.note.className = kind ? `note ${kind}` : "note";
    };
    const clearNote = () => {
      if (el.note.classList.contains("bad") || el.note.classList.contains("err")) return;
      say("");
    };
    function read() {
      voices = Array.isArray(mml) ? mml.map((v) => String(v ?? "")).filter((v) => v.trim() !== "") : splitVoices(mml);
      chans = [];
      marks = [];
      total = 0;
      if (!voices.length) {
        say("Nothing to play.", "err");
        return false;
      }
      let got = null;
      try {
        audio.defineBGM(NAME, voices, loose ? { mode: "loose" } : {});
        got = audio.bgmInfo(NAME);
      } catch (e) {
        say(String(e && e.message ? e.message : e), "err");
        return false;
      }
      chans = got.tracks;
      marks = got.marks;
      cuts = got.switches || { grid: [], bars: [] };
      loopAt = got.loop ? got.loop.from : null;
      outroAt = got.outro ?? null;
      cues = got.cues ?? [];
      takes = got.takes ?? [];
      total = got.total;
      if (!got.active) {
        say(got.errors.map((e) => e.text).join(" / "), "err");
        return false;
      }
      groups = audio.bgmGroups(NAME) || { groups: [], group: null, sets: [], silent: [], machine: null };
      const meta = got.meta || {};
      el.title.textContent = meta.title || "";
      el.songver.textContent = meta.version ? `ver ${meta.version}` : "";
      el.songver.hidden = !meta.version;
      el.abouttext.textContent = meta.about || "";
      el.abouttext.hidden = !meta.about;
      el.about.hidden = !showAbout || !(meta.title || meta.about || meta.version || machineText());
      const old = voices.reduce((n, v) => n + countOldStyle(v), 0);
      if (old) {
        console.warn(`[ChpTnSnd] MML: \u6307\u793A\u884C\u306E "// #" \u304C ${old} \u884C\u3042\u308A\u307E\u3059\u3002"#" \u3060\u3051\u3067\u66F8\u3051\u307E\u3059("// #" \u306F\u3044\u305A\u308C\u8AAD\u307E\u306A\u304F\u306A\u308A\u307E\u3059)`);
      }
      say("");
      drawLoose(got.problems || []);
      return true;
    }
    function drawLoose(list) {
      const bad2 = list.filter((x) => x.level === "error").length;
      const soft = list.length - bad2;
      if (!list.length) {
        el.loosenote.textContent = "";
        return;
      }
      const part = [];
      if (bad2) part.push(`${bad2} dropped`);
      if (soft) part.push(`${soft} warned`);
      el.loosenote.textContent = part.join(", ");
    }
    function machineText() {
      const m = groups.machine;
      return !m || m === "default" ? "" : m;
    }
    const goneCh = (ch) => (groups.silent || []).includes(ch);
    function drawGroups() {
      const list = groups.groups || [];
      const eds = list.map((g) => g.name);
      const here = list.find((g) => g.name === groups.group);
      const sets = here ? here.sets : [];
      el.edrow.hidden = eds.length < 2;
      el.setrow.hidden = sets.length < 2;
      el.eds.textContent = "";
      el.sets.textContent = "";
      for (const name of eds) {
        const lab = document.createElement("label");
        const i = document.createElement("input");
        i.type = "radio";
        i.name = "mmsxx-edition";
        i.value = name;
        i.checked = name === groups.group;
        i.addEventListener("change", () => {
          pickGroups({ group: name });
        });
        lab.append(i, document.createTextNode(name));
        el.eds.appendChild(lab);
      }
      for (const name of sets) {
        const lab = document.createElement("label");
        const i = document.createElement("input");
        i.type = "checkbox";
        i.value = name;
        i.checked = (groups.sets || []).includes(name);
        i.addEventListener("change", () => {
          const on = [...el.sets.querySelectorAll("input")].filter((x) => x.checked).map((x) => x.value);
          pickGroups({ sets: on });
        });
        lab.append(i, document.createTextNode(name));
        el.sets.appendChild(lab);
      }
    }
    function pickGroups(pick) {
      groups = audio.selectGroups(NAME, pick) || groups;
      drawGroups();
      drawChannels();
      draw();
    }
    function drawChannels() {
      el.chs.textContent = "";
      el.volsw.setAttribute("aria-pressed", String(volMode));
      el.volreset.hidden = !volMode;
      if (volMode) {
        drawVolumes();
        return;
      }
      for (const t of chans) {
        const wrap2 = document.createElement("span");
        wrap2.className = "ch";
        if (goneCh(t.ch)) wrap2.classList.add("gone");
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sw";
        b.dataset.ch = String(t.ch);
        b.setAttribute("aria-pressed", String(!audio.isMuted(t.ch)));
        b.textContent = t.name || `ch${t.ch + 1}`;
        b.disabled = goneCh(t.ch);
        b.addEventListener("click", () => {
          audio.muteTrack(t.ch);
          draw();
        });
        if (t.chords && t.voices > 1) {
          wrap2.classList.add("multi");
          const n = document.createElement("span");
          n.className = "voices";
          n.textContent = `\xD7${t.voices}`;
          b.title = `${t.voices} voices at once`;
          b.appendChild(n);
        }
        wrap2.appendChild(b);
        if ((t.lanes || []).length > 1) {
          const o = document.createElement("button");
          o.type = "button";
          o.className = "open";
          o.setAttribute("aria-pressed", String(openLanes.has(t.ch)));
          o.textContent = openLanes.has(t.ch) ? "\u25BE" : "\u25B8";
          o.title = openLanes.has(t.ch) ? "Hide the parts inside" : "Show the parts inside";
          o.addEventListener("click", () => {
            if (openLanes.has(t.ch)) openLanes.delete(t.ch);
            else openLanes.add(t.ch);
            drawChannels();
            draw();
          });
          wrap2.appendChild(o);
        }
        const v = audio.trackVolume(t.ch);
        if (v !== 1) {
          const n = document.createElement("span");
          n.className = "lvl" + (v > 0 ? "" : " off");
          n.textContent = `${Math.round(v * 100)}%`;
          n.title = "Set on the Volume side";
          wrap2.appendChild(n);
        }
        if (t.role) {
          const r = document.createElement("span");
          r.className = "role";
          r.textContent = t.role;
          wrap2.appendChild(r);
        }
        el.chs.appendChild(wrap2);
        if (openLanes.has(t.ch)) el.chs.appendChild(laneRow(t));
      }
    }
    function drawVolumes() {
      for (const t of chans) {
        const wrap2 = document.createElement("label");
        wrap2.className = "ch chvol";
        wrap2.dataset.ch = String(t.ch);
        const off = audio.isMuted(t.ch) || goneCh(t.ch);
        if (off) wrap2.classList.add("gone");
        const name = document.createElement("span");
        name.className = "name";
        name.textContent = t.name || `ch${t.ch + 1}`;
        const r = document.createElement("input");
        r.type = "range";
        r.min = "0";
        r.max = "200";
        r.step = "5";
        r.dataset.chvol = String(t.ch);
        r.value = String(Math.round(audio.trackVolume(t.ch) * 100));
        r.disabled = goneCh(t.ch);
        const pct = document.createElement("span");
        pct.className = "pct";
        const say2 = () => {
          pct.textContent = audio.isMuted(t.ch) ? "muted" : `${r.value}%`;
        };
        say2();
        r.addEventListener("input", () => {
          audio.setTrackVolume(t.ch, Number(r.value) / 100);
          say2();
        });
        wrap2.append(name, r, pct);
        el.chs.appendChild(wrap2);
      }
    }
    el.volsw.addEventListener("click", () => {
      volMode = !volMode;
      drawChannels();
      draw();
    });
    el.volreset.addEventListener("click", () => {
      audio.resetTrackVolumes();
      drawChannels();
    });
    function laneRow(t) {
      const row = document.createElement("span");
      row.className = "lanes";
      const of = document.createElement("span");
      of.className = "of";
      of.textContent = t.name || `ch${t.ch + 1}`;
      row.appendChild(of);
      for (const lane of t.lanes) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sw";
        b.dataset.lane = `${t.ch}/${lane.name}`;
        b.setAttribute("aria-pressed", String(!lane.muted));
        b.textContent = lane.label || lane.name;
        if (lane.label && lane.label !== lane.name) b.title = lane.name;
        b.addEventListener("click", () => {
          audio.muteLane(t.ch, lane.name);
          draw();
        });
        row.appendChild(b);
      }
      return row;
    }
    const LOOPS = [["1", 1], ["2", 2], ["3", 3], ["4", 4], ["8", 8], ["Endless", Infinity]];
    function drawLoops() {
      el.loops.textContent = "";
      for (const [label, n] of LOOPS) {
        const o = document.createElement("option");
        o.value = String(n);
        o.textContent = label;
        el.loops.appendChild(o);
      }
      el.loops.value = String(audio.loopTimes);
    }
    function drawCuts() {
      el.cuts.textContent = "";
      const span = audio.bgmLength() || total;
      if (span <= 0) return;
      const wide = el.track ? el.track.clientWidth : 0;
      const line = (t, cls) => {
        const i = document.createElement("i");
        i.className = cls;
        i.style.left = `${Math.max(0, Math.min(100, t / span * 100))}%`;
        el.cuts.appendChild(i);
      };
      const step = cuts.grid.length > 1 ? cuts.grid[1] - cuts.grid[0] : span;
      if (wide > 0 && step / span * wide >= cutGap) {
        for (const t of cuts.grid) line(t, "grid");
      }
      for (const t of cuts.bars) line(t, "bar");
      if (loopAt != null && loopAt > 0) line(loopAt, "loop");
      if (outroAt != null) line(outroAt, "outro");
    }
    function drawFx() {
      const live = audio.dynamic_effects || {};
      const chs = [.../* @__PURE__ */ new Set([...Object.keys(live), ...Object.keys(fxOff)])].map((n) => Number(n)).filter((n) => Number.isInteger(n)).sort((a, b) => a - b);
      el.fx.textContent = "";
      el.fxrow.hidden = chs.length === 0;
      for (const ch of chs) {
        const on = !!live[ch];
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sw";
        b.setAttribute("aria-pressed", String(on));
        const t = chans[ch];
        const kinds = Object.entries(live[ch] || fxOff[ch] || {}).filter(([, v]) => v).map(([k]) => k).join(" ");
        b.textContent = `${t && t.name ? t.name : `ch${ch + 1}`}${kinds ? ` ${kinds}` : ""}`;
        b.addEventListener("click", () => {
          if (live[ch]) {
            fxOff[ch] = live[ch];
            delete live[ch];
          } else if (fxOff[ch]) {
            live[ch] = fxOff[ch];
            delete fxOff[ch];
          }
          if (audio.bgmActive(NAME)) audio.seekBGM(audio.bgmPosition());
          drawFx();
        });
        el.fx.appendChild(b);
      }
    }
    function drawLeds() {
      el.leds.textContent = "";
      el.cuelog.textContent = "";
      leds.clear();
      const names = [...new Set(cues.map((c) => c.name))];
      el.cuerow.hidden = names.length === 0;
      for (const name of names) {
        const led = document.createElement("span");
        led.className = "led";
        led.dataset.name = name;
        led.textContent = name;
        el.leds.appendChild(led);
        leds.set(name, led);
      }
    }
    function logCue(c) {
      const line = document.createElement("div");
      line.textContent = `${c.t.toFixed(2)}s  ch${c.ch + 1}  ${c.name}` + (c.arg ? ` ${c.arg}` : "");
      el.cuelog.prepend(line);
      while (el.cuelog.children.length > 16) el.cuelog.lastChild.remove();
    }
    function blink(name) {
      const led = leds.get(name);
      if (!led) return;
      led.classList.add("on");
      clearTimeout(led._off);
      led._off = setTimeout(() => led.classList.remove("on"), 120);
    }
    function passedCues(at) {
      if (!cues.length) return;
      const len = audio.bgmLength() || total;
      const hit = (from2, to) => {
        for (const c of cues) {
          if (c.t <= from2 || c.t > to) continue;
          if (audio.cuesMuted(c.ch)) continue;
          blink(c.name);
          logCue(c);
        }
      };
      if (at >= lastPos) hit(lastPos, at);
      else {
        hit(lastPos, len);
        hit(-1, at);
      }
      lastPos = at;
    }
    function drawMarks() {
      el.marks.textContent = "";
      el.markrow.hidden = marks.length === 0;
      for (const m of marks) {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = m.name;
        b.dataset.t = String(m.t);
        b.addEventListener("click", () => {
          goTo(m.t);
        });
        el.marks.appendChild(b);
      }
    }
    function drawTakes() {
      el.takes.textContent = "";
      el.takerow.hidden = takes.length === 0;
      for (const g of takes) {
        const wrap2 = document.createElement("span");
        wrap2.className = "take";
        const lbl = document.createElement("span");
        lbl.className = "grp";
        lbl.textContent = g.group;
        wrap2.appendChild(lbl);
        for (const name of g.options) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "sw";
          b.dataset.group = g.group;
          b.dataset.take = name;
          b.textContent = name;
          b.addEventListener("click", () => {
            audio.selectTake(NAME, g.group, name, restart ? { restart: true } : {});
            draw();
          });
          wrap2.appendChild(b);
        }
        el.takes.appendChild(wrap2);
      }
    }
    function draw() {
      const s = audio.bgmState;
      const on = !!(s && s.name === NAME);
      el.play.textContent = on && !s.paused ? "Pause" : "Play";
      el.play.disabled = !audio.bgmActive(NAME);
      el.rept.setAttribute("aria-pressed", String(!audio.ignoreSongLoop));
      if (document.activeElement !== el.vol) {
        el.vol.value = String(Math.round(audio.volume * 100));
      }
      el.mute.setAttribute("aria-pressed", String(audio.muted));
      el.mute.textContent = audio.muted ? "Muted" : "Mute";
      const ab = audio.bgmRange();
      el.abOn.checked = !!ab;
      const span = audio.bgmLength() || total;
      const pct = (sec) => `${span > 0 ? Math.max(0, Math.min(100, sec / span * 100)) : 0}%`;
      el.abA.classList.toggle("off", !ab);
      el.abB.classList.toggle("off", !ab);
      el.abspan.hidden = !ab;
      if (ab) {
        el.abA.style.left = pct(ab.from);
        el.abB.style.left = pct(ab.to);
        el.abspan.style.left = pct(ab.from);
        el.abspan.style.width = `${Math.max(0, parseFloat(pct(ab.to)) - parseFloat(pct(ab.from)))}%`;
      }
      if (document.activeElement !== el.abFrom) el.abFrom.value = abFrom.toFixed(3);
      if (document.activeElement !== el.abTo) el.abTo.value = abTo.toFixed(3);
      if (document.activeElement !== el.loops) el.loops.value = String(audio.loopTimes);
      el.wav.disabled = busy || !Number.isFinite(audio.loopTimes) || total <= 0;
      if (takes.length) {
        const now = audio.takesOf(NAME);
        for (const b of el.takes.querySelectorAll("button")) {
          b.setAttribute("aria-pressed", String(now[b.dataset.group] === b.dataset.take));
        }
      }
      for (const b of el.chs.querySelectorAll("button.sw")) {
        if (b.dataset.lane) {
          const at = b.dataset.lane.indexOf("/");
          const ch2 = Number(b.dataset.lane.slice(0, at));
          b.setAttribute(
            "aria-pressed",
            String(!audio.isLaneMuted(ch2, b.dataset.lane.slice(at + 1)))
          );
          continue;
        }
        const ch = Number(b.dataset.ch);
        b.setAttribute("aria-pressed", String(!audio.isMuted(ch)));
        b.disabled = goneCh(ch);
      }
      const mach = machineText();
      el.mach.textContent = mach;
      el.mach.hidden = !mach;
      const len = audio.bgmLength() || total;
      el.len.textContent = clock(len);
      if (!dragging) {
        const at = on ? audio.bgmPosition() : from;
        if (on && !s.paused) passedCues(at);
        else lastPos = at;
        el.now.textContent = clock(at);
        el.seek.value = String(len > 0 ? Math.round(at / len * 1e3) : 0);
        const here = marks.reduce(
          (best, m) => m.t <= at + 1e-6 && (!best || m.t >= best.t) ? m : best,
          null
        );
        for (const b of el.marks.querySelectorAll("button")) {
          const mine = here && Math.abs(Number(b.dataset.t) - here.t) < 1e-6;
          b.classList.toggle("now", !!mine);
          if (mine) b.setAttribute("aria-current", "true");
          else b.removeAttribute("aria-current");
        }
      }
    }
    async function play() {
      dropWAV();
      await audio.unlock();
      const s = audio.bgmState;
      if (s && s.name === NAME && s.paused) {
        audio.resumeBGM();
        draw();
        return;
      }
      if (!audio.bgmActive(NAME) && !read()) return;
      audio.startBGM(NAME, { restart: true });
      if (from > 0) audio.seekBGM(from);
      draw();
    }
    function mmlOf(opts2 = {}) {
      const span = audio.bgmLength() || total;
      const ab = audio.bgmRange();
      const from2 = opts2.from ?? (ab ? ab.from : 0);
      const to = opts2.to ?? (ab ? ab.to : span);
      const text = voices.join(" ");
      const hit = /(?:^|[\s])t(\d+)/.exec(text);
      const meta = audio.bgmInfo(NAME)?.meta ?? {};
      const tempo = Number(hit ? hit[1] : meta.tempo) || 120;
      const tracks = voices.map((v, i) => ({ v, i })).filter(({ i }) => !audio.isMuted(i) && !goneCh(i)).map(({ v, i }) => ({
        name: chans[i]?.name ?? null,
        role: chans[i]?.role ?? null,
        events: compileMML(String(v).trim()).events
      }));
      return eventsToMML(tracks, {
        tempo,
        from: from2,
        to,
        waveName: (n) => WAVEFORMS[n]?.name ?? String(n),
        envName: (n) => ENVELOPES[n]?.name ?? String(n)
      });
    }
    function dropWAV() {
      if (!wavURL) return;
      el.audio.pause();
      el.audio.removeAttribute("src");
      el.audio.load();
      el.got.hidden = true;
      el.wavnote.hidden = true;
      URL.revokeObjectURL(wavURL);
      wavURL = null;
    }
    async function toWAV() {
      if (busy || !Number.isFinite(audio.loopTimes)) return;
      dropWAV();
      busy = true;
      quit = false;
      root.classList.add("busy");
      el.veil.hidden = false;
      el.barfill.style.width = "0%";
      el.pct.textContent = "0%";
      say("Rendering\u2026");
      audio.stopBGM();
      const ab = audio.bgmRange();
      try {
        const buf = await audio.renderBGM(NAME, {
          loops: ab ? 1 : audio.loopTimes,
          onProgress: (v) => {
            const pct = Math.round(v * 100);
            el.barfill.style.width = `${pct}%`;
            el.pct.textContent = `${pct}%`;
          },
          stop: () => quit
        });
        if (!buf) {
          say("Export cancelled.");
          return;
        }
        const rate = buf.sampleRate;
        let data = buf.getChannelData(0);
        if (ab) {
          const a0 = Math.max(0, Math.floor(ab.from * rate));
          const a1 = Math.min(data.length, Math.ceil(ab.to * rate));
          data = data.slice(a0, a1);
        }
        const meta = audio.bgmInfo(NAME)?.meta ?? {};
        const name = String(meta.title || "mmsxx").replace(/[\\/:*?"<>|]/g, "_");
        const blob = new Blob([writeWAV(data, rate)], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const secs = (data.length / rate).toFixed(1);
        if (!inFrame) {
          const a = document.createElement("a");
          a.href = url;
          a.download = `${name}.wav`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1e4);
          say(`Exported ${secs}s of WAV.`);
          return;
        }
        wavURL = url;
        el.got.hidden = false;
        el.audio.src = url;
        el.save.href = url;
        el.save.download = `${name}.wav`;
        el.wavnote.textContent = `Could not save ${secs}s of WAV. Save it from the player below.`;
        el.wavnote.hidden = false;
        say("");
      } catch (e) {
        say(String(e && e.message ? e.message : e), "err");
      } finally {
        busy = false;
        root.classList.remove("busy");
        el.veil.hidden = true;
        draw();
      }
    }
    function goTo(sec) {
      const len = audio.bgmLength() || total;
      from = Math.max(0, Math.min(sec, len));
      const s = audio.bgmState;
      if (s && s.name === NAME) audio.seekBGM(from);
      draw();
    }
    el.play.addEventListener("click", () => {
      const s = audio.bgmState;
      if (s && s.name === NAME && !s.paused) {
        audio.pauseBGM();
        draw();
        return;
      }
      play();
    });
    el.stop.addEventListener("click", () => {
      audio.stopBGM();
      from = 0;
      draw();
    });
    const secOf = (text) => {
      const t = String(text ?? "").trim();
      if (!t) return null;
      const m = /^(\d+):(\d+(?:\.\d+)?)$/.exec(t);
      const n = m ? Number(m[1]) * 60 + Number(m[2]) : Number(t);
      return Number.isFinite(n) ? Math.max(0, n) : null;
    };
    function applyRange(on, toA) {
      const span = audio.bgmLength() || total;
      if (!on) {
        audio.clearRange();
        draw();
        return;
      }
      if (!(abTo > abFrom)) {
        abFrom = 0;
        abTo = span;
      }
      audio.setRange(abFrom, abTo);
      if (toA) audio.seekBGM(abFrom);
      draw();
    }
    function fixHead() {
      const ab = audio.bgmRange();
      if (!ab) return;
      const at = audio.bgmPosition();
      if (at < ab.from || at > ab.to) {
        audio.seekBGM(ab.from);
        draw();
      }
    }
    el.copy.addEventListener("click", async () => {
      const text = mmlOf();
      if (!text) {
        say("Nothing to copy.", "bad");
        return;
      }
      const show = () => {
        el.out.hidden = false;
        el.out.value = text;
        el.out.focus();
        el.out.select();
      };
      if (copyMode === "show") {
        show();
        say("Here is the MML. It is selected.");
        return;
      }
      let done = false;
      try {
        await navigator.clipboard.writeText(text);
        done = true;
      } catch {
      }
      if (!done) {
        show();
        try {
          done = document.execCommand("copy");
        } catch {
          done = false;
        }
      }
      if (done) {
        el.out.hidden = true;
        say("Copied as MML.");
        return;
      }
      say("Could not copy. Here is the MML, selected, to copy by hand.", "bad");
    });
    el.mml.addEventListener("click", () => {
      const text = srcText();
      if (!text) {
        say("Nothing to export.", "bad");
        return;
      }
      const meta = audio.bgmInfo(NAME)?.meta ?? {};
      const name = (meta.title || "song").replace(/[\\/:*?"<>|]/g, "_");
      if (!inFrame) {
        const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.mml`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1e4);
        say(`Exported ${name}.mml`);
        return;
      }
      el.out.hidden = false;
      el.out.value = text;
      el.out.focus();
      el.out.select();
      say("Could not save the file. Here is the MML, selected, to copy by hand.", "bad");
    });
    const showSrc = (on) => {
      el.srcwrap.hidden = !on;
      el.showmml.setAttribute("aria-pressed", String(on));
      el.showmml.setAttribute("aria-expanded", String(on));
    };
    const srcText = () => {
      if (!Array.isArray(mml)) return String(mml ?? "").trim();
      const has = (v) => /^[ \t]*\/\/[ \t]*#[ \t]*ch([ \t]|$)/im.test(v);
      return voices.map((v) => has(v) ? v : `#ch
${v}`).join("\n\n").trim();
    };
    el.showmml.addEventListener("click", () => {
      if (el.showmml.getAttribute("aria-pressed") === "true") {
        showSrc(false);
        return;
      }
      const text = srcText();
      if (!text) {
        say("Nothing to show.", "bad");
        return;
      }
      el.src.value = text;
      el.srcsize.textContent = `${text.split("\n").length} lines, ${text.length} chars`;
      showSrc(true);
      el.srcclose.focus();
    });
    el.srcclose.addEventListener("click", () => {
      showSrc(false);
      el.showmml.focus();
    });
    el.srcwrap.addEventListener("click", (e) => {
      if (e.target === el.srcwrap) {
        showSrc(false);
        el.showmml.focus();
      }
    });
    el.srcwrap.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        showSrc(false);
        el.showmml.focus();
      }
    });
    el.abOn.addEventListener("change", () => applyRange(el.abOn.checked, true));
    for (const [box, which] of [[el.abFrom, "from"], [el.abTo, "to"]]) {
      box.addEventListener("input", () => {
        const v = secOf(box.value);
        if (v === null) {
          draw();
          return;
        }
        if (which === "from") abFrom = v;
        else abTo = v;
        if (abTo > abFrom) applyRange(true, which === "from");
        if (which === "to") fixHead();
      });
    }
    for (const [handle, which] of [[el.abA, "from"], [el.abB, "to"]]) {
      handle.addEventListener("pointerdown", (e) => {
        handle.setPointerCapture(e.pointerId);
        e.preventDefault();
        const move = (ev) => {
          const box = el.track.getBoundingClientRect();
          const span = audio.bgmLength() || total;
          const sec = Math.max(0, Math.min(span, (ev.clientX - box.left) / box.width * span));
          if (which === "from") abFrom = sec;
          else abTo = sec;
          if (abTo > abFrom) audio.setRange(abFrom, abTo);
          draw();
        };
        const up = () => {
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", up);
          if (which === "from" && audio.bgmRange()) {
            audio.seekBGM(abFrom);
            draw();
          }
          if (which === "to") fixHead();
        };
        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", up);
      });
    }
    el.rept.addEventListener("click", () => {
      audio.ignoreSongLoop = !audio.ignoreSongLoop;
      draw();
    });
    el.logsw.addEventListener("click", () => {
      const on = el.logrow.hidden;
      el.logrow.hidden = !on;
      el.logsw.setAttribute("aria-pressed", String(on));
      el.logsw.setAttribute("aria-expanded", String(on));
    });
    el.loose.addEventListener("change", () => {
      loose = el.loose.checked;
      audio.stopBGM();
      from = 0;
      if (read()) draw();
    });
    el.rew.addEventListener("click", () => {
      restart = !restart;
      el.rew.setAttribute("aria-pressed", String(restart));
    });
    el.vol.addEventListener("input", () => {
      audio.volume = Number(el.vol.value) / 100;
      draw();
    });
    el.mute.addEventListener("click", () => {
      audio.mute();
      draw();
    });
    el.wav.addEventListener("click", () => {
      toWAV();
    });
    el.cancel.addEventListener("click", () => {
      quit = true;
      say("Cancelling\u2026");
    });
    el.open.addEventListener("click", () => {
      open = !open;
      fold();
    });
    el.ver.textContent = `Pico (MML Player) ${PLAYER_VERSION}
ChipTuneSound ${SOUND_VERSION}
\xA9 ${COPYRIGHT}`;
    const showVer = (on) => {
      el.ver.hidden = !on;
      el.help.setAttribute("aria-pressed", String(on));
      el.help.setAttribute("aria-expanded", String(on));
    };
    el.help.addEventListener("click", () => {
      showVer(el.ver.hidden);
    });
    const shut = (e) => {
      if (el.ver.hidden || el.help.contains(e.target) || el.ver.contains(e.target)) return;
      showVer(false);
    };
    const shutKey = (e) => {
      if (e.key === "Escape") showVer(false);
    };
    document.addEventListener("pointerdown", shut);
    document.addEventListener("keydown", shutKey);
    el.loops.addEventListener("change", () => {
      audio.loopTimes = Number(el.loops.value);
      draw();
    });
    el.seek.addEventListener("pointerdown", () => {
      dragging = true;
    });
    el.seek.addEventListener("change", () => {
      dragging = false;
      const len = audio.bgmLength() || total;
      if (len <= 0) return;
      const at = len * (Number(el.seek.value) / 1e3);
      goTo(at < len / 1e3 ? 0 : at);
    });
    el.seek.addEventListener("input", () => {
      const len = audio.bgmLength() || total;
      if (len > 0) el.now.textContent = clock(len * (Number(el.seek.value) / 1e3));
    });
    function beat() {
      const s = audio.bgmState;
      const on = !!(s && s.name === NAME && !s.paused);
      const hot = /* @__PURE__ */ new Set();
      if (on) {
        for (const n of audio.notesAt()) {
          if (!(n.level > 0)) continue;
          if (!(audio.trackVolume(n.ch) > 0)) continue;
          hot.add(String(n.ch));
          if (n.lane !== void 0) hot.add(`${n.ch}/${n.lane}`);
        }
      }
      for (const b of el.chs.querySelectorAll("button.sw, .chvol")) {
        b.classList.toggle("hot", hot.has(b.dataset.lane ?? b.dataset.ch));
      }
      frame = requestAnimationFrame(beat);
    }
    const timer = setInterval(draw, 100);
    let frame = requestAnimationFrame(beat);
    read();
    drawLoops();
    drawGroups();
    drawChannels();
    drawMarks();
    drawTakes();
    fold();
    drawFx();
    drawLeds();
    drawCuts();
    draw();
    const onSize = () => drawCuts();
    window.addEventListener("resize", onSize);
    return {
      /**
       * 下で鳴らしているエンジン(`ChipTuneSound`)。
       *
       * 鳴り方はすべてこちらにある。黙らせるのも、くり返すかどうかも、
       * ここへ言う。押すところは 0.1 秒で追いつく。
       * 押すところを消してあっても、鳴っていなくても効く
       */
      audio,
      /** 鳴らしはじめる。止めてあるだけなら続きから */
      play,
      /** その場で凍らせる。`play()` で続きから鳴る */
      pause: () => {
        audio.pauseBGM();
        draw();
      },
      /** 止めて、位置を忘れる。次は頭から */
      stop: () => {
        audio.stopBGM();
        draw();
      },
      /**
       * 曲の途中へ跳ぶ。
       *
       * @param {number} sec 頭から何秒のところか
       */
      seek: (sec) => {
        goTo(sec);
      },
      /**
       * AB リピートの範囲。
       *
       * 省いて呼ぶと、いまの範囲が返る(`{ from, to }`。無ければ null)。
       * `range(null)` で外す。読むのも書くのも同じ名前でする。
       *
       * @param {number|null} [from] 始まりの秒。`null` で範囲を外す。省くと読むだけ
       * @param {number} [to] 終わりの秒。`from` と入れ替わっていても直す
       * @returns {{from:number, to:number}|null} そのあとの範囲
       */
      range(from2, to) {
        if (from2 === void 0) return audio.bgmRange();
        if (from2 === null) {
          audio.clearRange();
        } else {
          abFrom = Math.min(from2, to);
          abTo = Math.max(from2, to);
          audio.setRange(abFrom, abTo);
        }
        draw();
        return audio.bgmRange();
      },
      /**
       * ラベルの名前で跳ぶ。見つからなければ何もしない。
       *
       * @param {string} name `#label` に書いた名前。大文字小文字は見る
       */
      jump(name) {
        const m = marks.find((x) => x.name === name);
        if (m) goTo(m.t);
      },
      /**
       * 跳ぶ先の一覧。鳴らす前から読める。
       *
       * @returns {{name:string, t:number}[]} 名前と、頭から何秒のところか
       */
      marks: () => marks.slice(),
      /**
       * 鳴らす前から読めるチャンネルの一覧。名前と役割は MML の注釈から。
       * 黙っているかどうかはエンジンに聞く。
       *
       * @returns {{ch:number, name:string|null, role:string|null,
       *            total:number, muted:boolean}[]}
       */
      tracks: () => chans.map((t) => ({ ...t, muted: audio.isMuted(t.ch) })),
      /**
       * 外から MML を差し替える。テキストボックスは持たないので、入り口はここ。
       *
       * 差し替えると鳴っているものは止まる。チャンネルもラベルも読み直す。
       *
       * @param {string|string[]} text 1 本のテキストでも、チャンネルごとの並びでもよい
       */
      setMML(text) {
        mml = Array.isArray(text) ? text : String(text ?? "");
        audio.stopBGM();
        audio.muteTracks([]);
        for (const { ch, lane } of audio.mutedLanes()) audio.muteLane(ch, lane, false);
        for (const t of chans) audio.muteCues(t.ch, false);
        openLanes.clear();
        from = 0;
        el.out.hidden = true;
        dropWAV();
        read();
        drawGroups();
        drawChannels();
        drawMarks();
        drawTakes();
        drawFx();
        drawLeds();
        drawCuts();
        draw();
      },
      /**
       * いまの範囲を MML の字にして返す。黙らせたチャンネルは入らない。
       *
       * 範囲を決めていなければ曲ぜんぶ。書き直したものなので、注釈も
       * マクロも残らない。`Copy as MML` が呼んでいるのもこれ
       *
       * @param {{from?:number, to?:number}} [opts] 秒で切る範囲。省くと AB リピートの範囲
       * @returns {string} チャンネルを `#ch` で分けた 1 本のテキスト
       */
      mml: (opts2) => mmlOf(opts2),
      /** 時計を止める。ページから外すときに呼ぶ */
      destroy() {
        clearInterval(timer);
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", onSize);
        document.removeEventListener("pointerdown", shut);
        document.removeEventListener("keydown", shutKey);
        audio.stopBGM();
        dropWAV();
      }
    };
  }

  // ../../../tmp/panther-update/samples-entry.js
  var sound = { ...audio_exports, ...mml_exports, ...tones_exports, mountPlayer, PLAYER_CSS, PLAYER_VERSION, player: { mount: mountPlayer, CSS: PLAYER_CSS, version: PLAYER_VERSION } };
  window.MMSXX = window.MMSXX || {};
  window.MMSXX.sound = sound;
})();
