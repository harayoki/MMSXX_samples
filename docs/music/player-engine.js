// MMS/XX player and audio engine, source commit df32dbb160cf08cd34ee53d5fbad4b885120c1a6
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // engine/sound/audio.js
  var audio_exports = {};
  __export(audio_exports, {
    ChipTuneSound: () => ChipTuneSound,
    SE_SYS_PAUSE: () => SE_SYS_PAUSE,
    SOUND_VERSION: () => SOUND_VERSION,
    encodeWAV: () => encodeWAV,
    psgDiv: () => psgDiv,
    snapVol: () => snapVol
  });

  // engine/sound/mml.js
  var mml_exports = {};
  __export(mml_exports, {
    AY_ENV_SHAPES: () => AY_ENV_SHAPES,
    AY_MODES: () => AY_MODES,
    DEFAULT_ENV: () => DEFAULT_ENV,
    DEFAULT_WAVE: () => DEFAULT_WAVE,
    DEV_MARKS: () => DEV_MARKS,
    DRUM_FREQ: () => DRUM_FREQ,
    ENVELOPES: () => ENVELOPES,
    HEAD_MARK: () => HEAD_MARK,
    NES_MODES: () => NES_MODES,
    NOISE_VARIANTS: () => NOISE_VARIANTS,
    ROLES: () => ROLES,
    SPECIALS: () => SPECIALS,
    STEALS: () => STEALS,
    TUNINGS: () => TUNINGS,
    VCURVES: () => VCURVES,
    WAVE: () => WAVE,
    WAVEFORMS: () => WAVEFORMS,
    compileMML: () => compileMML,
    countOldStyle: () => countOldStyle,
    describeVoice: () => describeVoice,
    envRunLen: () => envRunLen,
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
    readWaves: () => readWaves,
    registerAY: () => registerAY,
    registerBaked: () => registerBaked,
    registerBeep: () => registerBeep,
    registerBrass: () => registerBrass,
    registerCoreFamilies: () => registerCoreFamilies,
    registerEnvelope: () => registerEnvelope,
    registerFDS: () => registerFDS,
    registerFM: () => registerFM,
    registerFamily: () => registerFamily,
    registerLayer: () => registerLayer,
    registerModal: () => registerModal,
    registerNES: () => registerNES,
    registerNoiseVariants: () => registerNoiseVariants,
    registerOPLL: () => registerOPLL,
    registerOPLLVoice: () => registerOPLLVoice,
    registerOPM: () => registerOPM,
    registerOPNARhythm: () => registerOPNARhythm,
    registerPCE: () => registerPCE,
    registerSCC: () => registerSCC,
    registerWave: () => registerWave,
    roleOf: () => roleOf,
    sealPresets: () => sealPresets,
    shareBundles: () => shareBundles,
    songParts: () => songParts,
    splitVoices: () => splitVoices,
    stealOf: () => stealOf,
    toneOf: () => toneOf,
    validateMML: () => validateMML,
    voiceName: () => voiceName,
    voiceNameProblem: () => voiceNameProblem,
    volFromGain: () => volFromGain,
    volGainOf: () => volGainOf,
    waveMeta: () => waveMeta,
    waveRole: () => waveRole,
    waveSteal: () => waveSteal
  });

  // engine/sound/gm.js
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

  // engine/sound/opllvoice.js
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
  var STEAL_ATTACK_MS = 20;
  function opllAttackMs(ar) {
    return ar > 0 ? 1067 / 2 ** (ar - 1) : Infinity;
  }
  function opllSteal(bytes) {
    const hold = (bytes[1] >> 5 & 1) === 1;
    const ar = bytes[5] >> 4 & 15;
    return hold && opllAttackMs(ar) < STEAL_ATTACK_MS ? "ok" : "avoid";
  }

  // engine/sound/opll.js
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
  var OPLL_SETS = [OPLL_INST, OPLL_INST_VRC7, OPLL_INST_YMF281];
  var OPLL_CLOCK = 3579545;
  var OPLL_RATE = OPLL_CLOCK / 72;
  var OPLL_DRUM_TABLE = {
    bd: { bit: 16, reg: 54, hi: 0, ch: 6, fnum: 288, blk: 2 },
    sd: { bit: 8, reg: 55, hi: 0, ch: 7, fnum: 336, blk: 2 },
    hh: { bit: 1, reg: 55, hi: 1, ch: 7, fnum: 336, blk: 2 },
    tom: { bit: 4, reg: 56, hi: 1, ch: 8, fnum: 448, blk: 0 },
    cym: { bit: 2, reg: 56, hi: 0, ch: 8, fnum: 448, blk: 0 }
  };
  var OPLL_CODE = `
const SETS = ${JSON.stringify([OPLL_INST, OPLL_INST_VRC7, OPLL_INST_YMF281])};
// \u30EA\u30BA\u30E0\u306E 5 \u3064\u3002\u8868\u306F\u5916(OPLL_DRUM_TABLE)\u3067\u3001\u8B66\u544A\u3092\u51FA\u3059\u5074\u3082\u540C\u3058\u3082\u306E\u3092\u898B\u308B
const DRUM = ${JSON.stringify(OPLL_DRUM_TABLE)};
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
    // \u3064\u306A\u304C\u308A\u306E\u901A\u3057\u756A\u53F7 \u2192 \u305D\u306E\u58F0\u3002\u30BF\u30A4\u3067\u3064\u306A\u304C\u3063\u305F\u97F3\u3092\u540C\u3058\u58F0\u3067\u7D9A\u3051\u308B\u305F\u3081\u306B\u6301\u3064\u3002
    // \u58F0\u306E\u5272\u308A\u5F53\u3066\u306F\u3053\u3061\u3089\u304C\u3059\u308B\u306E\u3067\u3001\u756A\u53F7\u3067\u7A81\u304D\u5408\u308F\u305B\u306A\u3044\u3068\u524D\u306E\u97F3\u3068\u540C\u3058\u58F0\u306B
    // \u5165\u3089\u306A\u3044\u3002\u305D\u3046\u306A\u308B\u3068\u3001\u7D9A\u304F\u97F3\u3067\u30AD\u30FC\u30AA\u30F3\u3092\u7ACB\u3066\u76F4\u3059\u3053\u3068\u306B\u306A\u308B
    this.tieCh = Object.create(null);
    this.gliding = 0;
    // \u6B62\u3081\u3066\u3044\u308B\u6700\u4E2D\u3002\u51FA\u53E3\u3092\u843D\u3068\u3057\u3066\u3044\u308B\u3042\u3044\u3060\u306E\u30B5\u30F3\u30D7\u30EB\u6570\u3002-1 \u306A\u3089\u6B62\u3081\u3066\u3044\u306A\u3044\u3002
    // \u3077\u3064\u3063\u3068\u9CF4\u3089\u306A\u3044\u3088\u3046 10 \u30DF\u30EA\u79D2\u307B\u3069\u304B\u3051\u3066\u843D\u3068\u3059
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(RATE * 0.01));
    this.port.onmessage = (e) => {
      // \u6B62\u3081\u3066\u3002\u30B7\u30FC\u30AF\u3068\u505C\u6B62\u3068\u30DD\u30FC\u30BA\u3067\u6765\u308B\u3002\u6E9C\u3081\u305F\u3076\u3093\u3092\u6368\u3066\u3066\u3001\u9CF4\u3063\u3066\u3044\u308B
      // \u58F0\u3092\u9ED9\u3089\u305B\u308B\u3002\u30AD\u30FC\u30AA\u30D5\u3060\u3051\u3067\u306F RR \u306E\u3076\u3093\u9CF4\u308A\u7D9A\u3051\u308B\u306E\u3067\u3001\u51FA\u53E3\u3067\u843D\u3068\u3059
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      // \u6B21\u306E\u97F3\u304C\u6765\u305F\u3089\u51FA\u53E3\u3092\u623B\u3059\u3002\u623B\u3055\u306A\u3044\u3068\u3001\u6B62\u3081\u305F\u3042\u3068\u306F\u4F55\u3092\u7A4D\u3093\u3067\u3082
      // \u9ED9\u3063\u305F\u307E\u307E\u306B\u306A\u308B
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  /**
   * \u6B62\u3081\u308B\u3002\u6E9C\u3081\u305F\u30A4\u30D9\u30F3\u30C8\u3092\u6368\u3066\u3066\u3001\u9CF4\u3063\u3066\u3044\u308B\u58F0\u3092\u9ED9\u3089\u305B\u308B\u3002
   *
   * \u30AD\u30FC\u30AA\u30D5\u3092\u66F8\u304F\u3060\u3051\u3067\u306F\u3001\u30C1\u30C3\u30D7\u306E RR \u306E\u3076\u3093\u9CF4\u308A\u7D9A\u3051\u308B\u3002\u5B9F\u6A5F\u3067\u306F\u305D\u308C\u304C
   * \u6B63\u3057\u3044\u304C\u3001\u30B7\u30FC\u30AF\u3082\u505C\u6B62\u3082\u30DD\u30FC\u30BA\u3082\u5B9F\u6A5F\u306B\u7121\u3044\u64CD\u4F5C\u306A\u306E\u3067\u3001\u3053\u3053\u3067\u306F\u6D88\u3059
   * (docs/BUGS.md \u306E\u7DDA\u5F15\u304D)\u3002\u51FA\u53E3\u3092 10 \u30DF\u30EA\u79D2\u3067\u843D\u3068\u3057\u3066\u304B\u3089\u3001
   * \u30EC\u30B8\u30B9\u30BF\u3092\u9759\u304B\u306B\u3059\u308B\u3002
   */
  cut() {
    this.events.length = 0;
    this.at = 0;
    for (let ch = 0; ch < 9; ch++) {
      // \u30AD\u30FC\u30AA\u30F3\u3092\u843D\u3068\u3057\u3066\u3001\u97F3\u91CF\u3092\u6700\u5C0F(\u6E1B\u8870\u304C\u6700\u5927)\u306B\u3059\u308B
      this.chip.writeReg(0x20 + ch, this.chip.reg[0x20 + ch] & ~0x10);
      this.chip.writeReg(0x30 + ch, this.chip.reg[0x30 + ch] | 0x0f);
      this.busy[ch] = 0;
      this.off[ch] = 0;
      this.ps[ch] = null;
      this.vs[ch] = null;
    }
    this.gliding = 0;
    this.fading = 0;
    this.tieCh = Object.create(null);
    // \u30EA\u30BA\u30E0\u3082\u5207\u308B
    this.rbits = 0;
    this.chip.writeReg(0x0e, 0);
    for (const k in this.rOff) this.rOff[k] = 0;
    for (const k in this.rVs) this.rVs[k] = null;
    // \u51FA\u53E3\u3092\u843D\u3068\u3057\u306F\u3058\u3081\u308B
    if (this.cutAt < 0) this.cutAt = 0;
  }

  /** \u30EA\u30BA\u30E0\u306B\u5165\u308B\u3002\u4E0B 3 \u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u9AD8\u3055\u3092\u3001\u5B9F\u6A5F\u306E\u30C9\u30E9\u30A4\u30D0\u3068\u540C\u3058\u5024\u306B\u3059\u308B */
  startRhythm() {
    if (this.rhythmOn) return;
    this.rhythmOn = true;
    this.chip.writeReg(0x0e, 0x20);
    for (const k of ['bd', 'sd', 'tom']) this.drumPitch(DRUM[k], DRUM[k]);
  }

  /**
   * \u6253\u697D\u5668\u306E\u9AD8\u3055\u3092\u66F8\u304F\u3002
   *
   * **\u30AD\u30FC\u30AA\u30F3\u306E\u30D3\u30C3\u30C8\u306F\u7ACB\u3066\u306A\u3044\u3002**\u30EA\u30BA\u30E0\u97F3\u6E90\u306E\u53E9\u304D\u306F\u3058\u3081\u306F R14 \u304C\u6301\u3064\u306E\u3067\u3001
   * 0x20 \u53F0\u306E bit4 \u306F 0 \u306E\u307E\u307E\u7F6E\u304F\u3002
   *
   * **\u540C\u3058\u5024\u306A\u3089\u66F8\u304B\u306A\u3044\u3002**\u53E9\u304F\u305F\u3073\u306B\u547C\u3070\u308C\u308B\u306E\u3067\u3001\u9AD8\u3055\u3092\u52D5\u304B\u3057\u3066\u3044\u306A\u3044\u66F2\u3067
   * \u66F8\u304D\u8FBC\u307F\u304C\u5897\u3048\u306A\u3044\u3088\u3046\u306B\u3057\u3066\u304A\u304F\u3002
   *
   * @param {object} d DRUM \u306E 1 \u3064
   * @param {{fnum:number, blk:number}} at \u66F8\u304F\u9AD8\u3055
   */
  drumPitch(d, at) {
    const lo = at.fnum & 0xff;
    const hi = (at.blk << 1) | ((at.fnum >> 8) & 1);
    if (this.chip.reg[0x10 + d.ch] !== lo) this.chip.writeReg(0x10 + d.ch, lo);
    if (this.chip.reg[0x20 + d.ch] !== hi) this.chip.writeReg(0x20 + d.ch, hi);
  }

  /**
   * \u66F8\u3044\u305F\u9AD8\u3055\u306E\u6BD4\u304B\u3089\u3001\u305D\u306E\u6253\u697D\u5668\u306E fnum \u3068 blk \u3092\u51FA\u3059\u3002
   *
   * \u5B9F\u6A5F\u306E\u30C9\u30E9\u30A4\u30D0\u306E\u5024\u3092\u7269\u5DEE\u3057\u306B\u3057\u3066\u3001\u6BD4\u3067\u52D5\u304B\u3059\u3002**\u6BD4\u304C 1 \u306A\u3089\u547C\u3070\u308C\u306A\u3044**
   * (\u97F3\u7B26\u304C o4c \u306E\u307E\u307E\u306A\u3089\u3001startRhythm() \u304C\u66F8\u3044\u305F\u5024\u304C\u305D\u306E\u307E\u307E\u6B8B\u308B)\u306E\u3067\u3001
   * \u524D\u304B\u3089\u3042\u308B\u66F2\u306E\u97F3\u306F\u5909\u308F\u3089\u306A\u3044\u3002
   *
   * @param {object} d DRUM \u306E 1 \u3064
   * @param {number} ratio \u66F8\u3044\u305F\u9AD8\u3055 \xF7 o4c
   * @returns {{fnum:number, blk:number}}
   */
  drumBend(d, ratio) {
    let fnum = d.fnum * ratio, blk = d.blk;
    while (fnum > 511 && blk < 7) { fnum /= 2; blk++; }
    while (fnum < 256 && blk > 0) { fnum *= 2; blk--; }
    return { fnum: Math.max(1, Math.min(511, Math.round(fnum))), blk };
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
          // **\u53E9\u304F\u305F\u3073\u306B\u3001\u305D\u306E\u6253\u697D\u5668\u306E\u9AD8\u3055\u3092\u66F8\u304D\u76F4\u3059\u3002**\u30B9\u30CD\u30A2\u3068\u30CF\u30A4\u30CF\u30C3\u30C8\u306F
          // \u30C1\u30E3\u30F3\u30CD\u30EB 7 \u3092\u3001\u30BF\u30E0\u3068\u30B7\u30F3\u30D0\u30EB\u306F 8 \u3092\u5206\u3051\u5408\u3046\u306E\u3067\u3001\u66F8\u304D\u76F4\u3055\u306A\u3044\u3068
          // \u7247\u65B9\u304C\u7F6E\u3044\u3066\u3044\u3063\u305F\u9AD8\u3055\u3067\u9CF4\u308B\u3002\u5B9F\u6A5F\u306E\u30C9\u30E9\u30A4\u30D0\u3082\u53E9\u304F\u305F\u3073\u306B\u66F8\u3044\u3066\u3044\u305F\u3002
          // \u5024\u304C\u540C\u3058\u306A\u3089\u66F8\u304B\u306A\u3044\u306E\u3067\u3001\u9AD8\u3055\u3092\u52D5\u304B\u3057\u3066\u3044\u306A\u3044\u66F2\u3067\u306F\u66F8\u304D\u8FBC\u307F\u304C\u5897\u3048\u306A\u3044
          this.drumPitch(d, ev.rp ? this.drumBend(d, ev.rp) : d);
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
        // ---- \u30BF\u30A4\u3067\u3064\u306A\u304C\u3063\u305F\u97F3\u306F\u3001\u540C\u3058\u58F0\u3067\u7D9A\u3051\u308B ----
        //
        // **\u30AD\u30FC\u30AA\u30F3\u3092\u7ACB\u3066\u76F4\u3055\u306A\u3044\u3002**\u7ACB\u3066\u76F4\u3059\u3068\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u304C\u982D\u304B\u3089\u59CB\u307E\u308B\u306E\u3067\u3001
        // \u6ED1\u3063\u305F\u3042\u3068\u306B\u30A2\u30BF\u30C3\u30AF\u304C\u3084\u308A\u76F4\u3055\u308C\u308B\u3002\u5B9F\u6E2C\u3067\u306F 85ms \u3067 0.0004 \u307E\u3067\u843D\u3061\u3066\u3001
        // 125ms \u304B\u3051\u3066\u4E0A\u304C\u3063\u3066\u3044\u305F \u2014 \u300C\u6ED1\u308A\u5148\u304C\u9CF4\u308A\u76F4\u3057\u3066\u805E\u3053\u3048\u308B\u300D\u306E\u6B63\u4F53
        //(2026-09-30)\u3002
        //
        // \u7D9A\u3051\u308B\u58F0\u306F tie(\u3064\u306A\u304C\u308A\u306E\u901A\u3057\u756A\u53F7)\u3067\u5F15\u304F\u3002\u58F0\u306E\u5272\u308A\u5F53\u3066\u306F\u3053\u3061\u3089\u304C
        // \u3059\u308B\u306E\u3067\u3001\u756A\u53F7\u3067\u7A81\u304D\u5408\u308F\u305B\u306A\u3044\u3068\u524D\u306E\u97F3\u3068\u540C\u3058\u58F0\u306B\u5165\u3089\u306A\u3044\u3002
        // \u97F3\u7A0B\u3060\u3051\u66F8\u304D\u63DB\u3048\u308B\u306E\u306F glide() \u3068\u540C\u3058\u3084\u308A\u65B9
        const keep = ev.legato && ev.tie ? this.tieCh[ev.tie] : undefined;
        if (keep !== undefined && (this.chip.reg[0x20 + keep] & 0x10)) {
          const { blk: b2, fnum: f2 } = pitchOf(ev.freq);
          // \u30AD\u30FC\u30AA\u30F3\u306E\u30D3\u30C3\u30C8(0x10)\u3068\u3001\u3044\u307E\u7ACB\u3063\u3066\u3044\u308B\u3082\u306E\u3092\u305D\u306E\u307E\u307E\u6301\u3061\u8D8A\u3059
          this.chip.writeReg(0x10 + keep, f2 & 0xff);
          this.chip.writeReg(0x20 + keep,
            (this.chip.reg[0x20 + keep] & 0x30) | (b2 << 1) | ((f2 >> 8) & 1));
          // \u4F38\u3070\u3057\u305F\u3076\u3093\u3060\u3051\u3001\u96E2\u3059\u6642\u523B\u3092\u5F8C\u308D\u3078\u3002\u3064\u306A\u304C\u308A\u306E\u6B8B\u308A\u307E\u3067\u6301\u305F\u305B\u308B
          const hold2 = Math.max(ev.dur, ev.left || 0);
          this.busy[keep] = now + hold2;
          this.off[keep] = now + hold2;
          this.follow(keep, ev.vs);
          this.bend(keep, ev.ps);
          continue;
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
        // \u3064\u306A\u304C\u3063\u3066\u3044\u308B\u97F3\u306F\u3001\u96E2\u3059\u6642\u523B\u3092\u3064\u306A\u304C\u308A\u306E\u7D42\u308F\u308A\u307E\u3067\u5EF6\u3070\u3059\u3002
        // \u3053\u306E\u97F3\u306E\u9577\u3055\u3067\u5207\u308B\u3068\u3001\u7D9A\u304F\u97F3\u304C\u6765\u308B\u524D\u306B\u30AD\u30FC\u30AA\u30D5\u304C\u8D70\u3063\u3066\u7ACB\u3066\u76F4\u3057\u306B\u306A\u308B
        const hold = Math.max(ev.dur, ev.left || 0);
        this.busy[ch] = now + hold;
        this.off[ch] = now + hold;
        // \u3064\u306A\u304C\u308A\u306E\u5148\u982D\u3002\u7D9A\u304F\u97F3\u304C\u3053\u306E\u58F0\u3092\u5F15\u3051\u308B\u3088\u3046\u306B\u899A\u3048\u3066\u304A\u304F
        if (ev.tie) this.tieCh[ev.tie] = ch;
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
      let v = (this.prev + (this.cur - this.prev) * this.frac) / 16384;
      // \u6B62\u3081\u3066\u3044\u308B\u6700\u4E2D\u306A\u3089\u3001\u51FA\u53E3\u3092\u843D\u3068\u3059\u3002\u843D\u3061\u304D\u3063\u305F\u3089 0 \u306E\u307E\u307E
      if (this.cutAt >= 0) {
        v *= Math.max(0, 1 - this.cutAt / this.cutLen);
        this.cutAt++;
        if (this.cutAt > this.cutLen) { this.cutAt = this.cutLen; v = 0; }
      }
      out[i] = v;
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

  // engine/sound/ym2151.js
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
 * \u4E2D\u306B\u30C1\u30C3\u30D7\u3092\u4F55\u500B\u3067\u3082\u6301\u3064(sound/ay.js \u3068\u540C\u3058\u8003\u3048\u65B9)\u3002\u524D\u306F 1 \u500B\u306E 8 \u58F0\u3092\u53D6\u308A\u5408\u3044\u3001
 * 9 \u97F3\u76EE\u3067\u3044\u3061\u3070\u3093\u53E4\u3044\u97F3\u3092\u6B62\u3081\u3066\u3044\u305F\u304C\u3001\u307B\u304B\u306E\u30C1\u30C3\u30D7\u3068\u540C\u3058\u304F\u6570\u306F\u7E1B\u3089\u306A\u3044(2026-10-05)\u3002
 *
 * LFO \u306F\u30C1\u30C3\u30D7\u306B 1 \u3064\u3067\u30018 \u58F0\u304C\u5206\u3051\u5408\u3046\u3002\u97F3\u8272\u3054\u3068\u306B\u8A2D\u5B9A\u304C\u9055\u3048\u3070\u3001\u5225\u306E\u30C1\u30C3\u30D7\u306B\u8F09\u305B\u308B\u3002
 * \u30CE\u30A4\u30BA\u306F\u30C1\u30E3\u30F3\u30CD\u30EB 8 \u3060\u3051\u304C\u51FA\u305B\u308B\u3002\u5B9F\u6A5F\u306E\u5236\u7D04\u306F\u3001\u66F8\u304D\u51FA\u3059\u3068\u304D\u306B\u898B\u308B\u3002
 */
class OpmBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.pool = [];
    // \u30EC\u30B8\u30B9\u30BF\u306E\u8A18\u9332(log)\u3002OPLL \u3068\u540C\u3058\u3067\u3001\u66F8\u3044\u305F\u6642\u523B\u3068\u4E2D\u8EAB\u3092\u5916\u3078\u6D41\u3059\u3002
    // \u540C\u3058\u66F8\u304D\u8FBC\u307F\u3092\u30A8\u30DF\u30E5\u30EC\u30FC\u30BF\u3078\u6E21\u3057\u3066\u3001\u3053\u3061\u3089\u306E\u7FFB\u8A33\u3092\u8033\u3067\u78BA\u304B\u3081\u308B\u305F\u3081
    this.log = !!q.log;
    this.logNow = 0;
    this.acc = 0;
    this.base = currentTime;
    // \u6B62\u3081\u3066\u3044\u308B\u6700\u4E2D\u3002\u51FA\u53E3\u3092\u843D\u3068\u3057\u3066\u3044\u308B\u3042\u3044\u3060\u306E\u30B5\u30F3\u30D7\u30EB\u6570\u3002-1 \u306A\u3089\u6B62\u3081\u3066\u3044\u306A\u3044
    this.cutAt = -1;
    this.port.onmessage = (e) => {
      // \u6B62\u3081\u3066\u3002\u30B7\u30FC\u30AF\u3068\u505C\u6B62\u3068\u30DD\u30FC\u30BA\u3067\u6765\u308B(docs/BUGS.md)
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      // \u6B21\u306E\u97F3\u304C\u6765\u305F\u3089\u51FA\u53E3\u3092\u623B\u3059\u3002\u623B\u3055\u306A\u3044\u3068\u3001\u6B62\u3081\u305F\u3042\u3068\u306F\u4F55\u3092\u7A4D\u3093\u3067\u3082
      // \u9ED9\u3063\u305F\u307E\u307E\u306B\u306A\u308B
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
      this.events.sort((a, b) => a.t - b.t);
    };
  }

  /** LFO \u306E\u8A2D\u5B9A\u3092\u6587\u5B57\u306B\u3059\u308B\u3002\u540C\u3058\u306A\u3089\u540C\u3058\u30C1\u30C3\u30D7\u306B\u8F09\u305B\u3089\u308C\u308B */
  lfoKey(p) {
    const l = p.lfo;
    return l ? (l.rate | 0) + '.' + (l.amd | 0) + '.' + (l.pmd | 0) + '.' + (l.wf | 0) : '';
  }

  grow() {
    const c = new OPM();
    // busy: \u9CF4\u3063\u3066\u3044\u308B\u3082\u306E [{ ch, off }]\u3002
    // fading: \u30D5\u30A7\u30FC\u30C9\u306E\u9014\u4E2D\u306E\u97F3 [{ ch, list, at, patch }]\u3002\u51FA\u53E3\u5074\u306E\u30AA\u30DA\u306E TL \u3092\u66F8\u304D\u76F4\u3059\u3002
    // gliding: \u30DD\u30EB\u30BF\u30E1\u30F3\u30C8\u306E\u9014\u4E2D\u306E\u97F3 [{ ch, list, at }]\u3002\u97F3\u7A0B\u30EC\u30B8\u30B9\u30BF\u3092\u66F8\u304D\u76F4\u3059
    const chip = { c, key: null, busy: [], fading: [], gliding: [], log: null, quiet: true, noise: false };
    if (this.log) {
      const raw = c.write.bind(c);
      chip.log = [];
      c.write = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    c.write(0x0f, 0);
    this.pool.push(chip);
    return chip;
  }

  /** LFO \u3092\u66F8\u304F(\u901F\u3055\u30FB\u97F3\u91CF\u306E\u6DF1\u3055\u30FB\u97F3\u7A0B\u306E\u6DF1\u3055\u30FB\u6CE2\u5F62) */
  setLfo(chip, key, p) {
    const l = p.lfo || { rate: 0, amd: 0, pmd: 0, wf: 0 };
    const c = chip.c;
    c.write(0x18, l.rate & 0xff);
    c.write(0x19, l.amd & 0x7f);
    c.write(0x19, 0x80 | (l.pmd & 0x7f));
    c.write(0x1b, l.wf & 3);
    chip.key = key;
  }

  /**
   * \u6B62\u3081\u308B\u3002\u6E9C\u3081\u305F\u30A4\u30D9\u30F3\u30C8\u3092\u6368\u3066\u3066\u3001\u9CF4\u3063\u3066\u3044\u308B\u58F0\u3092\u9ED9\u3089\u305B\u308B\u3002
   *
   * \u30AD\u30FC\u30AA\u30D5\u3092\u66F8\u304F\u3060\u3051\u3067\u306F\u3001\u30C1\u30C3\u30D7\u306E RR \u306E\u3076\u3093\u9CF4\u308A\u7D9A\u3051\u308B\u3002\u5B9F\u6A5F\u3067\u306F\u305D\u308C\u304C
   * \u6B63\u3057\u3044\u304C\u3001\u30B7\u30FC\u30AF\u3082\u505C\u6B62\u3082\u30DD\u30FC\u30BA\u3082\u5B9F\u6A5F\u306B\u7121\u3044\u64CD\u4F5C\u306A\u306E\u3067\u6D88\u3059
   * (docs/BUGS.md \u306E\u7DDA\u5F15\u304D)\u3002\u51FA\u53E3\u3092 10 \u30DF\u30EA\u79D2\u3067\u843D\u3068\u3059\u3002
   */
  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) {
      // \u9CF4\u3063\u3066\u3044\u308B\u58F0\u3092\u5168\u90E8\u30AD\u30FC\u30AA\u30D5(0x08 \u306E\u4E0B 3 \u30D3\u30C3\u30C8\u304C\u30C1\u30E3\u30F3\u30CD\u30EB)
      for (const b of chip.busy) chip.c.write(0x08, b.ch);
      chip.busy.length = 0;
      chip.fading.length = 0;
      chip.gliding.length = 0;
    }
    if (this.cutAt < 0) this.cutAt = 0;
  }

  /**
   * \u9CF4\u308A\u304D\u3063\u305F\u304B\u3002\u30AD\u30FC\u30AA\u30D5\u306E\u3042\u3068\u306E\u4F59\u97FB\u3082\u542B\u3081\u3066\u3001\u5168\u90E8\u306E\u30AA\u30DA\u304C\u9ED9\u3063\u3066\u3044\u308C\u3070 true\u3002
   * TL \u3092\u8DB3\u3057\u305F\u6E1B\u8870\u3067\u898B\u308B(TL 127 \u306E\u30AA\u30DA\u306F\u3001\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u304C\u6B8B\u3063\u3066\u3044\u3066\u3082\u805E\u3053\u3048\u306A\u3044)
   */
  silent(chip) {
    if (chip.busy.length) return false;
    const { att, cTL } = chip.c;
    for (let i = 0; i < 32; i++) if (att[i] + cTL[i] < 0x3f0) return false;
    return true;
  }

  /** \u305D\u306E\u30C1\u30C3\u30D7\u306E\u7A7A\u3044\u3066\u3044\u308B\u30C1\u30E3\u30F3\u30CD\u30EB\u3002\u30CE\u30A4\u30BA\u306F 8 \u672C\u76EE\u3060\u3051\u3002\u307B\u304B\u306F 8 \u672C\u76EE\u3092\u5F8C\u56DE\u3057\u306B\u3059\u308B */
  freeCh(chip, noise) {
    const used = (ch) => chip.busy.some((b) => b.ch === ch);
    if (noise) return used(7) ? -1 : 7;
    for (let ch = 0; ch < 8; ch++) if (!used(ch)) return ch;
    return -1;
  }

  /**
   * \u8F09\u305B\u308B\u30C1\u30C3\u30D7\u3068\u30C1\u30E3\u30F3\u30CD\u30EB\u3092\u9078\u3076\u3002LFO \u306E\u8A2D\u5B9A\u304C\u540C\u3058\u30C1\u30C3\u30D7\u3092\u5148\u306B\u898B\u308B\u3002
   * \u9ED9\u3063\u3066\u3044\u308B\u30C1\u30C3\u30D7\u306F\u3001LFO \u3092\u66F8\u304D\u76F4\u3057\u3066\u4F7F\u3044\u56DE\u3059\u3002\u3069\u308C\u3082\u99C4\u76EE\u306A\u3089\u30C1\u30C3\u30D7\u3092\u8DB3\u3059
   */
  pick(p) {
    const key = this.lfoKey(p);
    const noise = p.noise != null;
    for (const chip of this.pool) {
      if (chip.key !== key) continue;
      const ch = this.freeCh(chip, noise);
      if (ch >= 0) return { chip, ch };
    }
    for (const chip of this.pool) {
      if (!this.silent(chip)) continue;
      this.setLfo(chip, key, p);
      return { chip, ch: this.freeCh(chip, noise) };
    }
    const chip = this.grow();
    this.setLfo(chip, key, p);
    return { chip, ch: this.freeCh(chip, noise) };
  }

  start(ev) {
    const p = ev.patch;
    const { chip, ch } = this.pick(p);
    chip.quiet = false;
    chip.fading = chip.fading.filter((f) => f.ch !== ch);
    if (ev.vs && ev.vs.length) chip.fading.push({ ch, list: ev.vs, at: 0, patch: p });
    chip.gliding = chip.gliding.filter((f) => f.ch !== ch);
    if (ev.ps && ev.ps.length) chip.gliding.push({ ch, list: ev.ps, at: 0 });
    const c = chip.c;
    // \u30CE\u30A4\u30BA\u3002\u30C1\u30E3\u30F3\u30CD\u30EB 8 \u306E\u30AA\u30DA 4 \u304C\u30CE\u30A4\u30BA\u306B\u306A\u308B\u3002\u30CE\u30A4\u30BA\u3067\u306A\u3044\u97F3\u304C 8 \u672C\u76EE\u306B\u6765\u305F\u3089\u623B\u3059
    if (ch === 7) {
      const want = p.noise != null;
      if (want) c.write(0x0f, 0x80 | (p.noise & 31));
      else if (chip.noise) c.write(0x0f, 0);
      chip.noise = want;
    }
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
    chip.busy.push({ ch, off: ev.t + ev.dur });
  }

  /** 1 \u30C1\u30C3\u30D7\u3076\u3093\u3001\u6642\u523B t \u307E\u3067\u306B\u6765\u305F\u66F8\u304D\u76F4\u3057\u3068\u30AD\u30FC\u30AA\u30D5\u3092\u7247\u4ED8\u3051\u308B */
  step(chip, t) {
    for (let k = chip.fading.length - 1; k >= 0; k--) {
      const f = chip.fading[k];
      while (f.at < f.list.length && f.list[f.at][0] <= t) {
        const att = f.list[f.at++][1];
        const car = CARRIER[f.patch.alg & 7];
        for (const n of car) {
          chip.c.write(0x60 + f.ch + OPOF[n], Math.min(127, (f.patch.ops[n].tl & 0x7f) + att));
        }
      }
      if (f.at >= f.list.length) chip.fading.splice(k, 1);
    }
    // \u97F3\u7A0B\u306E\u66F8\u304D\u76F4\u3057\u3002\u9CF4\u3089\u3057\u59CB\u3081\u306E\u30D3\u30C3\u30C8\u306F\u5225\u306E\u30EC\u30B8\u30B9\u30BF(0x08)\u306B\u3042\u308B\u306E\u3067\u3001
    // \u3053\u3053\u306F\u97F3\u7A0B\u3060\u3051\u3092\u66F8\u3051\u308B
    for (let k = chip.gliding.length - 1; k >= 0; k--) {
      const f = chip.gliding[k];
      while (f.at < f.list.length && f.list[f.at][0] <= t) {
        const [, kc, kf] = f.list[f.at++];
        chip.c.write(0x28 + f.ch, kc & 0x7f);
        chip.c.write(0x30 + f.ch, (kf & 0x3f) << 2);
      }
      if (f.at >= f.list.length) chip.gliding.splice(k, 1);
    }
    for (let k = chip.busy.length - 1; k >= 0; k--) {
      if (chip.busy[k].off <= t) {
        chip.c.write(0x08, chip.busy[k].ch);
        chip.busy.splice(k, 1);
      }
    }
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const sr = sampleRate;
    const steps = ${OPM_RATE} / sr;
    // \u9CF4\u308A\u304D\u3063\u305F\u30C1\u30C3\u30D7\u306F\u8A08\u7B97\u3057\u306A\u3044\u3002\u4F59\u97FB\u304C\u3042\u308B\u306E\u3067\u3001128 \u30B5\u30F3\u30D7\u30EB\u3054\u3068\u306B\u898B\u76F4\u3059
    for (const chip of this.pool) if (!chip.quiet && this.silent(chip)) chip.quiet = true;
    for (let i = 0; i < out.length; i++) {
      const t = this.base + i / sr;
      if (this.log) this.logNow = t;
      while (this.at < this.events.length && this.events[this.at].t <= t) {
        this.start(this.events[this.at++]);
      }
      for (const chip of this.pool) if (!chip.quiet) this.step(chip, t);
      // \u5B9F\u6A5F\u306E\u523B\u307F\u3068\u51FA\u3059\u523B\u307F\u306F\u9055\u3046\u3002\u8DB3\u308A\u308B\u307E\u3067\u56DE\u3059
      this.acc += steps;
      let n = 0;
      while (this.acc >= 1) { n++; this.acc -= 1; }
      let v = 0;
      for (const chip of this.pool) {
        if (chip.quiet) continue;
        for (let k = 0; k < n; k++) chip.c.tick();
        v += chip.c.out();
      }
      // \u6B62\u3081\u3066\u3044\u308B\u6700\u4E2D\u306A\u3089\u3001\u3077\u3064\u3063\u3068\u9CF4\u3089\u306A\u3044\u3088\u3046 10 \u30DF\u30EA\u79D2\u3067\u843D\u3068\u3059
      if (this.cutAt >= 0) {
        const len = Math.max(1, Math.round(sampleRate * 0.01));
        v *= Math.max(0, 1 - this.cutAt / len);
        this.cutAt++;
        if (this.cutAt > len) { this.cutAt = len; v = 0; }
      }
      out[i] = v;
    }
    this.base += out.length / sr;
    if (this.log) {
      for (let k = 0; k < this.pool.length; k++) {
        const chip = this.pool[k];
        if (!chip.log.length) continue;
        this.port.postMessage({ regs: chip.log, chip: k, type: 0 });
        chip.log = [];
      }
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
    const l = p.lfo;
    return {
      alg: p.alg ?? 0,
      fb: p.fb ?? 0,
      pms: p.pms ?? 0,
      ams: p.ams ?? 0,
      ops: [op(p.ops?.[0]), op(p.ops?.[1]), op(p.ops?.[2]), op(p.ops?.[3])],
      ...l ? { lfo: {
        rate: (l.rate ?? 0) & 255,
        amd: (l.amd ?? 0) & 127,
        pmd: (l.pmd ?? 0) & 127,
        wf: (l.wf ?? 0) & 3
      } } : {},
      ...p.noise != null ? { noise: p.noise & 31 } : {}
    };
  }
  var OUT_OPS = [[3], [3], [3], [3], [1, 3], [1, 2, 3], [1, 2, 3], [0, 1, 2, 3]];
  function opmArToOpll(ar) {
    return ar / 2;
  }
  function opmSteal(patch, attackMs = 20) {
    const car = OUT_OPS[(patch?.alg ?? 0) & 7].map((i) => patch.ops[i]);
    const hold = car.every((o) => o.d2r === 0 && o.d1l <= 10);
    const slowest = Math.min(...car.map((o) => o.ar));
    const ms = slowest > 0 ? 1067 / 2 ** (opmArToOpll(slowest) - 1) : Infinity;
    return hold && ms < attackMs ? "ok" : "avoid";
  }

  // engine/sound/tones.js
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
    const {
      id: _id,
      name: _name,
      tone: _tone,
      role: _role,
      preset: _preset,
      note: _note,
      noteJa: _noteJa,
      tags: _tags,
      genre: _genre,
      dev: _dev,
      ...inherited
    } = base;
    const entry = {
      ...inherited,
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      // ロール。書いていなければ元の形のものを継ぐ
      role: roleOf(spec.role, name) ?? base.role ?? null,
      ...metaOf(spec),
      // 声の取り合いの目安も継ぐ。`metaOf` は書いていなければ null を返すので、
      // ここで継がないと、土台の音色を包んだとたんに「決めていない」へ戻る
      // (`special` と同じ漏れ方。2026-10-03)
      steal: stealOf(spec.steal, name) ?? base.steal ?? null,
      tone
    };
    if (!entry.special.length && base.special && base.special.length) {
      entry.special = [...base.special];
    }
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
    "toneArp(major)": {
      noteJa: "\u9577\u4E09\u548C\u97F3\u3092 1 \u30D5\u30EC\u30FC\u30E0\u305A\u3064\u56DE\u3059\u3002\u77E9\u5F62\u6CE2\u304C 2 \u672C\u3057\u304B\u7121\u3044\u6A5F\u68B0\u3067\u548C\u97F3\u3092\u51FA\u3059\u624B",
      dev: ["done"],
      role: "arp",
      note: "Major triad spun one frame per step. The classic way to fake a chord on a machine with only two pulse channels.",
      wave: "pulse(25)",
      env: "flat",
      arp: [0, 4, 7],
      loop: { arp: 0 }
    },
    "toneArp(minor)": {
      noteJa: "\u77ED\u4E09\u548C\u97F3\u3067\u540C\u3058\u3053\u3068\u3092\u3059\u308B\u3002toneArp(major) \u3068\u7D44\u306B\u3059\u308B\u3068\u9032\u884C\u304C\u56DE\u305B\u308B",
      dev: ["done"],
      role: "arp",
      note: "Minor triad, same spin. Pairs with toneArp(major) for a whole progression.",
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
    "toneArp(hard)": {
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
    "toneArp(wide)": {
      noteJa: "\u4E3B\u97F3\u30FB5 \u5EA6\u30FB\u30AA\u30AF\u30BF\u30FC\u30D6\u3002\u8DF3\u3076\u5E45\u304C\u5E83\u3044\u306E\u3067\u3001\u548C\u97F3\u3067\u306F\u306A\u304F\u9707\u3048\u306B\u805E\u3053\u3048\u308B\u3002\u30D5\u30A1\u30DF\u30B3\u30F3\u306E\u30EA\u30FC\u30C9\u3067\u3044\u3061\u3070\u3093\u591A\u3044\u5F62",
      dev: ["done"],
      role: "arp",
      note: "Root, fifth, octave. The wide jump stops sounding like a chord and starts sounding like a warble. The most common shape in NES-era leads.",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 7, 12],
      loop: { arp: 0 }
    },
    "toneArp(wideM)": {
      noteJa: "toneArp(wide) \u306E\u77ED\u8ABF\u7248",
      dev: ["done"],
      role: "arp",
      note: "Minor version of toneArp(wide).",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 3, 12],
      loop: { arp: 0 }
    },
    // 1 段を 2 フレーム持つ組。toneArp と同じ和音の作り分けを、遅い側にも置く。
    //
    // 速さは和音の種類と同じくらい効く。速い側は和音に、遅い側は
    // 1 つ 1 つの音に聞こえるので、同じ [0,4,7] でも別の音として使う。
    // 別のまとまりにしてあるのは、選ぶときにまず速さで選ぶから
    "toneArpSlow(major)": {
      noteJa: "\u9577\u4E09\u548C\u97F3\u3092\u30011 \u6BB5 2 \u30D5\u30EC\u30FC\u30E0\u3067\u56DE\u3059\u3002\u9045\u3044\u3076\u3093\u548C\u97F3\u306E 1 \u3064 1 \u3064\u304C\u805E\u3053\u3048\u3066\u3001\u7C92\u304C\u7ACB\u3064",
      dev: ["done"],
      role: "arp",
      note: "A major triad at two frames per step. Slow enough that you hear each note of it, so it comes out grainy rather than as a chord.",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 0, 4, 4, 7, 7],
      loop: { arp: 0 }
    },
    "toneArpSlow(minor)": {
      noteJa: "\u77ED\u4E09\u548C\u97F3\u3092\u30011 \u6BB5 2 \u30D5\u30EC\u30FC\u30E0\u3067\u56DE\u3059",
      dev: ["done"],
      role: "arp",
      note: "Minor triad at two frames per step.",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 0, 3, 3, 7, 7],
      loop: { arp: 0 }
    },
    "toneArpSlow(hard)": {
      noteJa: "\u540C\u3058\u9577\u4E09\u548C\u97F3\u3092\u3001\u3044\u3061\u3070\u3093\u7D30\u3044\u77E9\u5F62\u6CE2\u3067\u3002\u9045\u3044\u306E\u3067\u5538\u308A\u306B\u306F\u306A\u3089\u305A\u3001\u7C92\u304C\u786C\u304F\u306A\u308B",
      dev: ["done"],
      role: "arp",
      note: "The same major triad on the narrowest pulse. Too slow to buzz, so it reads as hard-edged grain instead.",
      wave: "wavePulse(6)",
      env: "flat",
      arp: [0, 0, 4, 4, 7, 7],
      loop: { arp: 0 }
    },
    "toneArpSlow(wide)": {
      noteJa: "\u4E3B\u97F3\u30FB5 \u5EA6\u30FB\u30AA\u30AF\u30BF\u30FC\u30D6\u3092\u30011 \u6BB5 2 \u30D5\u30EC\u30FC\u30E0\u3067\u56DE\u3059\u3002\u8DF3\u3076\u5E45\u304C\u5E83\u3044\u306E\u3067\u3001\u65CB\u5F8B\u304C 3 \u672C\u8D70\u3063\u3066\u3044\u308B\u3088\u3046\u306B\u805E\u3053\u3048\u308B",
      dev: ["done"],
      role: "arp",
      note: "Root, fifth, octave at two frames per step. The jumps are wide enough and slow enough that it sounds like three lines running at once.",
      wave: "pulse(12)",
      env: "flat",
      arp: [0, 0, 7, 7, 12, 12],
      loop: { arp: 0 }
    },
    "toneArpSlow(wideM)": {
      noteJa: "toneArpSlow(wide) \u306E\u77ED\u8ABF\u7248",
      dev: ["done"],
      role: "arp",
      note: "Minor version of toneArpSlow(wide).",
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
    toneLead: {
      noteJa: "\u62BC\u3057\u3066\u304B\u3089 18 \u30D5\u30EC\u30FC\u30E0\u5F85\u3063\u3066\u63FA\u308C\u51FA\u3059\u30D3\u30D6\u30E9\u30FC\u30C8\u3002\u771F\u3063\u76F4\u3050\u5165\u3063\u3066\u9014\u4E2D\u304B\u3089\u63FA\u308C\u308B\u306E\u304C\u3001\u30C1\u30C3\u30D7\u30C1\u30E5\u30FC\u30F3\u306E\u30EA\u30FC\u30C9\u306E\u9854",
      role: "lead",
      note: "Vibrato that only starts after you hold the note (18 frames). The straight attack followed by a wobble is the signature chiptune lead.",
      wave: "pulse(25)",
      env: "flat",
      vib: { depth: 5, speed: 6, delay: 18 }
    },
    // 刻んで減る音量。割合ではなく表なので、短い音では途中までしか鳴らない
    tonePluck: {
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
    toneDutyOpen: {
      noteJa: "\u5E45\u304C\u7D30\u3044\u3068\u3053\u308D\u304B\u3089\u59CB\u307E\u3063\u3066\u30019 \u30D5\u30EC\u30FC\u30E0\u3067\u77E9\u5F62\u6CE2\u307E\u3067\u5E83\u304C\u3063\u3066\u6B62\u307E\u308B\u3002\u9AD8\u3055\u3082\u97F3\u91CF\u3082\u52D5\u304B\u3055\u305A\u306B\u3001\u982D\u3060\u3051\u53E3\u3092\u958B\u3051\u305F\u3088\u3046\u306B\u805E\u3053\u3048\u308B",
      role: "lead",
      note: "The pulse starts thin and widens to a square over nine frames, then stays. Gives the attack a vowel-like opening without touching pitch or volume.",
      wave: "pulse(25)",
      env: "flat",
      duty: [0.06, 0.09, 0.125, 0.18, 0.25, 0.31, 0.375, 0.44, 0.5]
    },
    // 行って戻る。ゆっくり回すと、声が 2 本あるように聞こえる(実機の PWM)
    toneDutyPWM: {
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
    toneDutyBuzz: {
      noteJa: "\u5E45\u3092 1 \u30D5\u30EC\u30FC\u30E0\u306B 1 \u6BB5\u305A\u3064 3 \u901A\u308A\u56DE\u3059(20 Hz)\u3002\u901F\u3059\u304E\u3066\u5E45\u306E\u5909\u5316\u3068\u3057\u3066\u306F\u805E\u3053\u3048\u305A\u3001\u97F3\u306E\u7E01\u304C\u8352\u308C\u3066\u805E\u3053\u3048\u308B",
      role: "lead",
      note: "Three widths spun one frame per step (20 Hz). Too fast to hear as a sweep \u2014 it reads as a rough, reedy edge on the note instead.",
      wave: "pulse(12)",
      env: "flat",
      duty: [0.125, 0.25, 0.5],
      loop: { duty: 0 }
    },
    // ゆっくり 2 つの幅を行き来する。実機の手癖はこちらで、
    // `toneDutyBuzz` の 20 Hz は速すぎた。8 フレームずつなら幅の変化として聞こえる
    toneDutyNes: {
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
    toneDutyAtk: {
      noteJa: "\u982D\u306E 2 \u30D5\u30EC\u30FC\u30E0\u3060\u3051\u5E45 50%\u3001\u305D\u306E\u3042\u3068\u306F 25%\u3002\u97F3\u91CF\u306F\u307E\u3063\u305F\u304F\u52D5\u304B\u3055\u305A\u306B\u3001\u982D\u304C\u786C\u304F\u306A\u308B\u3002\u901F\u3044\u8B5C\u9762\u307B\u3069\u52B9\u304F",
      role: "lead",
      note: "Fifty per cent for the first two frames, then twenty-five. The volume never moves, yet every note arrives with a hard edge. The faster the line, the more it does.",
      wave: "pulse(25)",
      env: "flat",
      duty: [0.5, 0.5, 0.25]
    },
    toneDutyAtkAlt: {
      noteJa: "\u982D\u3067 2 \u30D5\u30EC\u30FC\u30E0\u305A\u3064 50% \u3068 25% \u3092 2 \u5F80\u5FA9\u3057\u3066\u304B\u3089 25% \u306B\u843D\u3061\u7740\u304F\u3002\u786C\u3044\u3060\u3051\u3067\u306A\u304F\u300C\u30B8\u30E3\u30C3\u300D\u3068\u3044\u3046\u7C92\u304C\u4ED8\u304F",
      role: "lead",
      note: "Two frames of fifty, two of twenty-five, twice over, then it settles. Harder than a plain attack and grainier with it.",
      wave: "pulse(25)",
      env: "flat",
      duty: [0.5, 0.5, 0.25, 0.25, 0.5, 0.5, 0.25]
    },
    // 滑り込む入り。下から定位置へ 4 フレームで上がる。
    // 音符ごとに掛かるので、速い譜面ほど効く
    toneSlideIn: {
      noteJa: "2 \u534A\u97F3\u4E0B\u304B\u3089 4 \u30D5\u30EC\u30FC\u30E0\u3067\u5B9A\u4F4D\u7F6E\u3078\u4E0A\u304C\u308B\u3002\u62BC\u3057\u305F\u97F3\u304C\u4E00\u6BB5\u4E0B\u304B\u3089\u6ED1\u308A\u8FBC\u3093\u3067\u304F\u308B\u306E\u3067\u3001\u901F\u3044\u8B5C\u9762\u307B\u3069\u751F\u304D\u308B",
      role: "lead",
      note: "Every note slides up into place from two semitones below over four frames. The faster the line, the more it does.",
      wave: "pulse(25)",
      env: "flat",
      pitch: [-200, -140, -80, -30, 0]
    },
    // 3 つ重ね。滑り込んで、幅が開いて、遅れて揺れる。
    // どれも 1 つずつは地味だが、順に起きると 1 本の音として聞こえる
    tonePsgLead: {
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
    toneBreathPad: {
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
    toneTom: {
      noteJa: "\u9AD8\u3055\u304C\u5C11\u3057\u3060\u3051\u843D\u3061\u306A\u304C\u3089\u6D88\u3048\u308B\u3002\u843D\u3061\u5E45\u304C\u5C0F\u3055\u3044\u306E\u304C\u304D\u3082\u3067\u30011 \u30AA\u30AF\u30BF\u30FC\u30D6\u843D\u3068\u3059\u3068\u592A\u9F13\u3067\u306F\u306A\u304F\u52B9\u679C\u97F3\u306B\u306A\u308B",
      role: "perc",
      note: "The pitch drops a little and fades. The small drop is the whole point \u2014 take it down an octave and it stops being a drum.",
      wave: "triangle",
      env: "percussive",
      pitch: [0, -60, -140, -220, -280, -320],
      vol: [15, 13, 10, 7, 4, 2, 1]
    },
    // 金属。1 フレームで大きく跳ぶので、音程として聞こえなくなる
    toneClang: {
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
    tonePadSwell: {
      noteJa: "24 \u30D5\u30EC\u30FC\u30E0(0.4 \u79D2)\u304B\u3051\u3066\u97F3\u91CF\u304C\u4E0A\u304C\u308A\u304D\u308B\u3002\u8868\u3067\u4E0A\u3052\u3066\u3044\u308B\u306E\u3067\u3001@e \u3092\u66F8\u3044\u3066\u3082\u5F62\u306F\u5909\u308F\u3089\u306A\u3044 \u2014 \u548C\u97F3\u3068\u3057\u3066\u7F6E\u3044\u305F\u3068\u304D\u306B\u3001\u65CB\u5F8B\u3088\u308A\u9045\u308C\u3066\u5165\u3063\u3066\u304F\u308B\u306E\u304C\u5024\u6253\u3061",
      role: "chord",
      note: "The volume climbs over twenty-four frames (0.4s). It is the table doing it, so writing @e does not change the shape \u2014 the point is that it arrives behind the melody when you lay it under one.",
      wave: "pulse(50)",
      env: "flat",
      vol: [0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
      loop: { vol: 23 }
    },
    tonePadStrings: {
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
    toneGrowlBass: {
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
    registerFamily("toneArp", {
      note: "A chord spun one step per frame, the way a machine with few channels fakes harmony.",
      params: [{
        name: "chord",
        default: "major",
        note: "Which chord shape to spin, and on how narrow a pulse.",
        values: chords("toneArp")
      }]
    });
    registerFamily("toneArpSlow", {
      note: "The same chord spins as toneArp at two frames per step, so each note is heard as grain.",
      params: [{
        name: "chord",
        default: "major",
        note: "Which chord shape to spin, and on how narrow a pulse.",
        values: chords("toneArpSlow")
      }]
    });
    for (const [name, spec] of Object.entries(TONE_PRESETS)) {
      if (waveByName(name) < 0) registerTone(name, spec);
    }
  }

  // engine/sound/mml.js
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
      r: 0.2,
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
      r: 0.175,
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
    // ADSR 型だが、番号は後ろに付ける。曲も部品も名前で持っている
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
  var STEALS = [
    "ok",
    // 取ってよい。割り込まれても、戻ったときに聞いて分からない
    "avoid",
    // できれば取らない。戻ったときに頭が聞こえる
    "unknown"
    // まだ測っていない。どちらか分からない
  ];
  function stealOf(steal, name = "?") {
    if (steal == null) return null;
    const t = String(steal).trim().toLowerCase();
    if (!t) return null;
    if (!STEALS.includes(t)) {
      console.warn(`[ChpTnSnd] \u97F3\u8272 "${name}" \u306E steal "${steal}" \u306F\u77E5\u3089\u306A\u3044\u8A00\u8449\u3067\u3059 (\u6C7A\u307E\u3063\u3066\u3044\u308B\u306E\u306F ${STEALS.join(" / ")})\u3002\u305D\u306E\u307E\u307E\u6301\u3061\u307E\u3059\u304C\u3001\u58F0\u306E\u53D6\u308A\u5408\u3044\u306E\u76EE\u5B89\u306B\u306F\u4F7F\u308F\u308C\u307E\u305B\u3093`);
    }
    return t;
  }
  function waveSteal(what) {
    return waveMeta(what)?.steal ?? null;
  }
  function waveMeta(what) {
    const w = typeof what === "number" ? WAVEFORMS[what] : WAVEFORMS[findWave(what)];
    if (!w) return null;
    return {
      name: w.name,
      kind: w.kind,
      role: w.role ?? null,
      steal: w.steal ?? null,
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
  var VCURVES = ["curve", "3db", "2db", "1.5db", "linear", "0.75db"];
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
      // 声の取り合いの目安。チャンネルが足りないときに、この音色を
      // 割り込んでよいか。書かなければ null(決めていない)。
      // 禁止ではなく目安で、読む側(圧縮)はまだ無い
      steal: stealOf(opts.steal, opts.name),
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
      // 音量の段数と曲線。どちらも必ず持つ(書かなければ既定)ので、
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
      // 実機の高さの刻み。書かなければ音色の作りから決める(`psgDiv`)。
      // 書くのは、ふつうの音程レジスタとは別の道で高さを作る音色だけ ——
      // AY のブザー音がそれで、エンベロープの周期で高さが決まるため
      // 刻みが 16 倍粗い(2026-09-26)
      ...opts.snapDiv > 0 ? { snapDiv: Math.floor(opts.snapDiv) } : {},
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
  function volGainOf(v, curve, steps) {
    if (!(v > 0)) return 0;
    const n = steps > 0 ? steps : 16;
    const down = Math.max(0, (n - 1) * (1 - v / 15));
    switch (curve) {
      case "3db":
        return Math.pow(10, -3 * down / 20);
      // SN76489(セガ)。16 段で 1 段 2dB。こちらでは測っていない
      case "2db":
        return Math.pow(10, -2 * down / 20);
      // PCE(HuC6280)。5 ビット(32 段)で 1 段 1.5dB。こちらでは測っていない
      case "1.5db":
        return Math.pow(10, -1.5 * down / 20);
      case "0.75db":
        return Math.pow(10, -0.75 * down / 20);
      case "linear":
        return v / 15;
      default:
        return Math.pow(v / 15, 1.8);
    }
  }
  function volFromGain(g, curve, steps) {
    if (!(g > 0)) return 0;
    const n = steps > 0 ? steps : 15;
    const back = (perStep) => {
      const down = -20 * Math.log10(g) / perStep;
      return clamp(15 * (n - down) / n, 0, 15);
    };
    switch (curve) {
      case "3db":
        return back(3);
      case "2db":
        return back(2);
      case "1.5db":
        return back(1.5);
      case "0.75db":
        return back(0.75);
      case "linear":
        return clamp(g * 15, 0, 15);
      default:
        return clamp(15 * Math.pow(g, 1 / 1.8), 0, 15);
    }
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
    if (entry.steal == null) entry.steal = opmSteal(patch);
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
      // 書いた高さからずらす半音。作り分けで高さ違いを並べるために持つ
      // (`opllKick(low)` など)。曲の側で `#bundle` に `@o` を書くのと同じこと
      ...opts.semi ? { semi: Math.round(opts.semi) } : {},
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat("worklet"))]
    };
    if (entry.steal == null) {
      if (entry.drum) entry.steal = "avoid";
      else {
        const bytes = entry.voice ?? OPLL_SETS[entry.set ?? 0]?.slice(entry.inst * 8, entry.inst * 8 + 8);
        if (bytes && bytes.length === 8) entry.steal = opllSteal(bytes);
      }
    }
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  var AY_MODES = ["tone", "noise", "env"];
  var AY_ENV_SHAPES = {
    saw: { r13: 8, div: 256 },
    tri: { r13: 10, div: 512 }
  };
  function registerAY(name, params = {}, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const mode = AY_MODES.includes(params.mode) ? params.mode : "tone";
    if (params.mode !== void 0 && params.mode !== mode) {
      warn(`[ChpTnSnd] AY \u306E mode "${params.mode}" \u306F\u77E5\u3089\u306A\u3044\u540D\u524D\u3067\u3059(\u4F7F\u3048\u308B\u306E\u306F ${AY_MODES.join(" / ")})`);
    }
    const env = mode === "env";
    const shape = AY_ENV_SHAPES[params.shape] ? params.shape : "saw";
    if (env && params.shape !== void 0 && params.shape !== shape) {
      warn(`[ChpTnSnd] AY \u306E shape "${params.shape}" \u306F\u77E5\u3089\u306A\u3044\u540D\u524D\u3067\u3059(\u4F7F\u3048\u308B\u306E\u306F ${Object.keys(AY_ENV_SHAPES).join(" / ")})`);
    }
    const meta = metaOf(env ? { vsteps: 1, vcurve: "3db", snapDiv: AY_ENV_SHAPES[shape].div, ...opts } : { vsteps: 16, vcurve: "3db", ...opts });
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "ay",
      mode,
      ...env ? { shape } : {},
      ...params.ay ? { ay: true } : {},
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat(env ? ["buzz", "worklet"] : ["worklet"]))]
    };
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  var NES_MODES = ["pulse", "triangle", "noise"];
  function registerNES(name, params = {}, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const mode = NES_MODES.includes(params.mode) ? params.mode : "pulse";
    if (params.mode !== void 0 && params.mode !== mode) {
      warn(`[ChpTnSnd] NES \u306E mode "${params.mode}" \u306F\u77E5\u3089\u306A\u3044\u540D\u524D\u3067\u3059(\u4F7F\u3048\u308B\u306E\u306F ${NES_MODES.join(" / ")})`);
    }
    const tri = mode === "triangle";
    const meta = metaOf({ vsteps: tri ? 1 : 16, vcurve: "linear", ...opts });
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "nes",
      mode,
      ...mode === "pulse" ? { duty: [0.125, 0.25, 0.5, 0.75].includes(params.duty) ? params.duty : 0.5 } : {},
      ...mode === "noise" && params.short ? { short: true } : {},
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat("worklet"))]
    };
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerFDS(name, params = {}, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const src = Array.isArray(params.wave) ? params.wave : [];
    if (src.length !== 64) warn(`[ChpTnSnd] FDS \u306E\u6CE2\u5F62\u306F 64 \u500B\u3067\u3059(${name} \u306F ${src.length} \u500B)`);
    const wave = Array.from({ length: 64 }, (_, i) => Math.max(0, Math.min(63, Math.round(src[i] ?? 32))));
    const m = params.mod;
    const meta = metaOf({ vsteps: 32, vcurve: "linear", ...opts });
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "fds",
      wave,
      ...m && m.ratio > 0 && m.depth > 0 ? { mod: { ratio: Number(m.ratio), depth: Number(m.depth), table: m.table === "step" ? "step" : "tri" } } : {},
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat("worklet"))]
    };
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerSCC(name, params = {}, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const src = Array.isArray(params.wave) ? params.wave : [];
    if (src.length !== 32) warn(`[ChpTnSnd] SCC \u306E\u6CE2\u5F62\u306F 32 \u500B\u3067\u3059(${name} \u306F ${src.length} \u500B)`);
    const wave = Array.from({ length: 32 }, (_, i) => Math.max(-128, Math.min(127, Math.round(src[i] ?? 0))));
    const meta = metaOf({ vsteps: 16, vcurve: "linear", ...opts });
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "scc",
      wave,
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat("worklet"))]
    };
    if (opts.env !== void 0) entry.defaultEnv = envIndex(opts.env);
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerModal(name, params = {}, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const meta = metaOf(opts);
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "modal",
      patch: String(params.patch || ""),
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat("worklet"))]
    };
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerBrass(name, params = {}, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const meta = metaOf(opts);
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "brass",
      patch: String(params.patch || ""),
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat("worklet"))]
    };
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerOPNARhythm(name, params = {}, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const keys = ["bd", "sd", "top", "hh", "tom", "rim"];
    const key2 = keys.includes(params.key) ? params.key : "bd";
    if (!keys.includes(params.key)) warn(`[ChpTnSnd] OPNA \u306E\u30EA\u30BA\u30E0\u306F ${keys.join(" / ")} \u306E\u3069\u308C\u304B\u3067\u3059(${name} \u306F ${params.key})`);
    const meta = metaOf({ vsteps: 32, vcurve: "0.75db", ...opts });
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "opnaRhythm",
      key: key2,
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat("worklet"))]
    };
    if (opts.env !== void 0) entry.defaultEnv = envIndex(opts.env);
    if (at >= 0) WAVEFORMS[at] = entry;
    else WAVEFORMS.push(entry);
    return entry.id;
  }
  function registerPCE(name, params = {}, opts = {}) {
    const at = requireFreeName(name, opts.overwrite);
    const noise = !!params.noise;
    const src = Array.isArray(params.wave) ? params.wave : [];
    if (!noise && src.length !== 32) warn(`[ChpTnSnd] PC \u30A8\u30F3\u30B8\u30F3\u306E\u6CE2\u5F62\u306F 32 \u500B\u3067\u3059(${name} \u306F ${src.length} \u500B)`);
    const meta = metaOf({ vsteps: 32, vcurve: "1.5db", ...opts });
    const entry = {
      id: at >= 0 ? at : WAVEFORMS.length,
      name,
      kind: "pce",
      ...noise ? { noise: true } : { wave: Array.from({ length: 32 }, (_, i) => Math.max(0, Math.min(31, Math.round(src[i] ?? 16)))) },
      role: roleOf(opts.role, name),
      ...meta,
      special: [...new Set(meta.special.concat("worklet"))]
    };
    if (opts.env !== void 0) entry.defaultEnv = envIndex(opts.env);
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
    // AY のブザー音。音色が開く(`@{ayEnvSaw}{ ... }`)。
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
  var TEXT_AT = "";
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
      } else if (key2 === "bundle" || key2 === "chord" || key2 === "drum" || key2 === "voice" || key2 === "wave") {
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
      } else if (key2 === "gain") {
        const words2 = val.split(/[ \t]+/).filter(Boolean);
        const n = Number(words2[0]);
        if (!Number.isFinite(n) || n < 0) {
          warn(`[ChpTnSnd] MML: #gain "${val}" \u306F 0 \u4EE5\u4E0A\u306E\u6570\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u8AAD\u307F\u98DB\u3070\u3057\u307E\u3059`);
          continue;
        }
        if (n > 8) {
          warn(`[ChpTnSnd] MML: #gain ${n} \u306F\u4E0A\u9650\u306E 8 \u3092\u8D8A\u3048\u3066\u3044\u307E\u3059\u30028 \u3067\u9CF4\u3089\u3057\u307E\u3059`);
        }
        meta.gain = Math.min(8, n);
        if (words2[1]) meta.gainBy = words2[1].toLowerCase();
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
  function readWaves(mml) {
    const out = /* @__PURE__ */ new Map();
    for (const line of commentLines(String(mml ?? ""))) {
      const m = WAVE_LINE.exec(line);
      if (!m) continue;
      const name = m[1].trim();
      let rest = m[2].trim();
      let bits = 8;
      let role;
      for (let o = WAVE_OPT.exec(rest); o; o = WAVE_OPT.exec(rest)) {
        const word = o[2].trim();
        if (o[1].toLowerCase() === "bits") {
          bits = Number(word);
          if (!Number.isInteger(bits) || bits < 1 || bits > 16) {
            bad(`[ChpTnSnd] MML: \u6CE2\u5F62 "${name}" \u306E @bits "${word}" \u306F 1\u301C16 \u306E\u6574\u6570\u3067\u3059`);
          }
        } else {
          role = word;
        }
        rest = rest.slice(o[0].length);
      }
      const words2 = rest.split(/[\s,]+/).filter(Boolean);
      if (words2.length < 2 || words2.length > 1024) {
        bad(`[ChpTnSnd] MML: \u6CE2\u5F62 "${name}" \u306F 2\u301C1024 \u500B\u306E\u6570\u3067\u3059(${words2.length} \u500B\u3042\u308A\u307E\u3057\u305F)`);
      }
      const samples = words2.map((w) => {
        const v = waveNum(w);
        if (!Number.isFinite(v)) {
          bad(`[ChpTnSnd] MML: \u6CE2\u5F62 "${name}" \u306E "${w}" \u306F\u8AAD\u3081\u307E\u305B\u3093(-1\u301C1 \u306E\u6570\u304B\u30013/4 \u306E\u3088\u3046\u306A\u5206\u6570\u3067\u3059)`);
        }
        return v;
      });
      tellIfTaken(name, findWave(name) >= 0, "\u6CE2\u5F62");
      registerWave(name, samples, bits, { overwrite: true, role });
      out.set(name.toLowerCase(), samples.length);
    }
    return out;
  }
  var WAVE_LINE = /^[ \t*]*#[ \t]*wave[ \t]+([A-Za-z][\w-]*)[ \t]*=[ \t]*(.*)$/i;
  var WAVE_OPT = /^@[ \t]*(bits|role)[ \t]*\{([^}]*)\}[ \t]*/i;
  function waveNum(word) {
    const at = word.indexOf("/");
    if (at < 0) return Number(word);
    const a = Number(word.slice(0, at));
    const b = Number(word.slice(at + 1));
    if (b === 0) return NaN;
    return a / b;
  }
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
    "@role\\{(?<role>[^}]*)\\}",
    "@adsr\\{(?<adsr>[^}]*)\\}",
    "@opll\\{(?<opll>(?:[^{}]|\\{[^{}]*\\})*)\\}",
    "@opm\\{(?<opm>(?:[^{}]|\\{[^{}]*\\})*)\\}",
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
  function readAdsr(text, name) {
    const words2 = String(text).split(/[\s,]+/).filter(Boolean);
    if (words2.length !== 4) {
      bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @adsr \u306F 4 \u3064\u3067\u3059(\u7ACB\u3061\u4E0A\u304C\u308A, \u6E1B\u308A, \u4F38\u3070\u3059\u9AD8\u3055, \u96E2\u3057\u3002${words2.length} \u500B\u3042\u308A\u307E\u3057\u305F)`);
    }
    const time = (w, key2) => {
      if (/^\d*\.?\d+\s*%$/.test(w)) return w.replace(/\s+/g, "");
      const n = Number(w);
      if (!Number.isFinite(n) || n < 0) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @adsr \u306E ${key2} "${w}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u79D2\u306E\u6570\u304B\u3001"25%" \u306E\u3088\u3046\u306A\u5272\u5408\u3067\u66F8\u304D\u307E\u3059)`);
      }
      return n;
    };
    const level = Number(words2[2]);
    if (!Number.isFinite(level)) {
      bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @adsr \u306E\u4F38\u3070\u3059\u9AD8\u3055 "${words2[2]}" \u306F0\u301C1 \u306E\u6570\u3067\u3059(\u5272\u5408\u3067\u306F\u66F8\u3051\u307E\u305B\u3093)`);
    }
    return {
      a: time(words2[0], "\u7ACB\u3061\u4E0A\u304C\u308A"),
      d: time(words2[1], "\u6E1B\u308A"),
      s: level,
      r: time(words2[3], "\u96E2\u3057")
    };
  }
  function readOpmSpec(text, name) {
    const spec = { ops: [{}, {}, {}, {}] };
    const said = /* @__PURE__ */ new Set();
    for (const one of splitParts(text)) {
      const m = /^([A-Za-z]+[1-4]?)\s*(?:\{([^}]*)\})?\s*(-?\d+)?$/.exec(one.trim());
      if (!m || m[2] === void 0 && m[3] === void 0) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opm \u306E "${one.trim()}" \u306F\u8AAD\u3081\u307E\u305B\u3093(op1{\u2026} lfo{\u2026} \u304B\u3001alg 4 \u306E\u3088\u3046\u306B\u66F8\u304D\u307E\u3059)`);
      }
      const key2 = m[1].toLowerCase();
      said.add(key2);
      const op = /^op([1-4])$/.exec(key2);
      if (op) {
        if (m[2] === void 0) bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opm \u306E ${key2} \u306F ${key2}{\u2026} \u3067\u66F8\u304D\u307E\u3059`);
        spec.ops[Number(op[1]) - 1] = opmFields(m[2], name, key2, OPM_OP_NAMES);
      } else if (key2 === "lfo") {
        if (m[2] === void 0) bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opm \u306E lfo \u306F lfo{\u2026} \u3067\u66F8\u304D\u307E\u3059`);
        spec.lfo = opmFields(m[2], name, key2, OPM_LFO_NAMES);
      } else if (["alg", "fb", "pms", "ams", "noise"].includes(key2)) {
        if (m[3] === void 0) bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opm \u306E ${key2} \u306F\u6570\u3067\u66F8\u304D\u307E\u3059`);
        spec[key2] = Number(m[3]);
      } else {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opm \u306B "${m[1]}" \u306F\u66F8\u3051\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F alg fb pms ams noise op1\u301Cop4 lfo \u3067\u3059)`);
      }
    }
    if (![1, 2, 3, 4].some((n) => said.has("op" + n))) {
      bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opm \u306B\u30AA\u30DA\u304C\u3042\u308A\u307E\u305B\u3093(op1{\u2026}\u301Cop4{\u2026} \u3092\u66F8\u3044\u3066\u304F\u3060\u3055\u3044)`);
    }
    return opmPatch(spec);
  }
  var OPM_OP_NAMES = {
    ar: "ar",
    d1r: "d1r",
    dr: "d1r",
    d2r: "d2r",
    sr: "d2r",
    rr: "rr",
    d1l: "d1l",
    sl: "d1l",
    tl: "tl",
    ks: "ks",
    mul: "mul",
    ml: "mul",
    dt1: "dt1",
    dt: "dt1",
    dt2: "dt2",
    ame: "ame",
    am: "ame"
  };
  var OPM_LFO_NAMES = { rate: "rate", amd: "amd", pmd: "pmd", wf: "wf" };
  function opmFields(text, name, where, names) {
    const out = {};
    for (const one of String(text).split(",")) {
      const w = one.trim().split(/\s+/).filter(Boolean);
      if (!w.length) continue;
      if (w.length !== 2 || !Number.isFinite(Number(w[1]))) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opm \u306E ${where}{${text}} \u306F\u300C\u540D\u524D \u6570\u300D\u3092 \`,\` \u3067\u533A\u5207\u3063\u3066\u66F8\u304D\u307E\u3059`);
      }
      const k = names[w[0].toLowerCase()];
      if (!k) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opm \u306E ${where} \u306B "${w[0]}" \u306F\u66F8\u3051\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F ${Object.keys(names).join(" ")} \u3067\u3059)`);
      }
      out[k] = Number(w[1]);
    }
    return out;
  }
  function readOpllSpec(text, name) {
    const spec = {};
    for (const one of splitParts(text)) {
      const m = /^([A-Za-z]+)\s*(?:\{([^}]*)\}|(-?\d+))$/.exec(one.trim());
      if (!m) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opll \u306E "${one.trim()}" \u306F\u8AAD\u3081\u307E\u305B\u3093(mod{\u2026} car{\u2026} bytes{\u2026} \u304B\u3001feedback 5 \u306E\u3088\u3046\u306B\u66F8\u304D\u307E\u3059)`);
      }
      const key2 = m[1].toLowerCase();
      if (key2 === "mod" || key2 === "car") {
        if (m[2] === void 0) {
          bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opll \u306E ${key2} \u306F ${key2}{\u2026} \u3067\u66F8\u304D\u307E\u3059`);
        }
        spec[key2] = opllFields(m[2], name, key2);
      } else if (key2 === "bytes") {
        if (m[2] === void 0) {
          bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opll \u306E bytes \u306F bytes{\u2026} \u3067\u66F8\u304D\u307E\u3059`);
        }
        spec.bytes = voiceNums(m[2], name, "opll \u306E bytes");
      } else if (key2 === "feedback") {
        if (m[3] === void 0) {
          bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opll \u306E feedback \u306F\u6570\u3067\u66F8\u304D\u307E\u3059`);
        }
        spec.feedback = Number(m[3]);
      } else {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opll \u306B "${m[1]}" \u306F\u66F8\u3051\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F mod car feedback bytes \u3067\u3059)`);
      }
    }
    if (!spec.mod && !spec.car && !spec.bytes) {
      bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opll \u306B\u4E2D\u8EAB\u304C\u3042\u308A\u307E\u305B\u3093(mod{\u2026} \u3068 car{\u2026} \u3092\u66F8\u304F\u304B\u3001bytes{\u2026} \u306B 8 \u500B\u306E\u6570\u3092\u66F8\u3044\u3066\u304F\u3060\u3055\u3044)`);
    }
    return spec;
  }
  function opllFields(text, name, where) {
    const out = {};
    for (const one of String(text).split(",")) {
      const w = one.trim().split(/\s+/).filter(Boolean);
      if (w.length !== 2 || !Number.isFinite(Number(w[1]))) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E @opll \u306E ${where}{${text}} \u306F\u300C\u540D\u524D \u6570\u300D\u3092 \`,\` \u3067\u533A\u5207\u3063\u3066\u66F8\u304D\u307E\u3059`);
      }
      out[w[0]] = Number(w[1]);
    }
    return out;
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
      detune: 0,
      role: null,
      opll: null,
      opm: null
    };
    let at = 0;
    while (at < text.length) {
      VOICE_PART.lastIndex = at;
      const m = VOICE_PART.exec(text);
      if (!m) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E "${text.slice(at)}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F @{\u97F3\u8272} @e{\u5F62} @role @adsr @opll @opm @arp @pitch @vol @duty @loop @delay @gain @o @d \u3060\u3051\u3067\u3059)`);
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
      if (g.role !== void 0) {
        part.role = g.role.trim();
        continue;
      }
      if (g.adsr !== void 0) {
        part.adsr = readAdsr(g.adsr, name);
        continue;
      }
      if (g.opll !== void 0) {
        part.opll = readOpllSpec(g.opll, name);
        continue;
      }
      if (g.opm !== void 0) {
        part.opm = readOpmSpec(g.opm, name);
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
      if (p.opm) {
        if (p.wave !== null) {
          bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306B @{${p.wave}} \u306F\u66F8\u3051\u307E\u305B\u3093(@opm \u304C\u97F3\u8272\u305D\u306E\u3082\u306E\u3067\u3059)`);
        }
        refuse(
          name,
          p,
          [
            "env",
            "adsr",
            "arp",
            "pitch",
            "vol",
            "duty",
            "loop",
            "delay",
            "gain",
            "octave",
            "detune"
          ],
          "@opm \u306F\u97F3\u8272\u305D\u306E\u3082\u306E\u3067\u3059\u3002\u8868\u3092\u7740\u305B\u308B\u3068\u304D\u306F\u5225\u306E #voice \u3067\u3053\u306E\u540D\u524D\u3092\u547C\u3093\u3067\u304F\u3060\u3055\u3044"
        );
        tellIfTaken(name, findWave(name) >= 0, "\u97F3\u8272");
        registerOPM(name, p.opm, { ...p.role === null ? {} : { role: p.role }, overwrite: true });
        return "opm";
      }
      if (p.opll) {
        if (p.wave !== null) {
          bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306B @{${p.wave}} \u306F\u66F8\u3051\u307E\u305B\u3093(@opll \u304C\u97F3\u8272\u305D\u306E\u3082\u306E\u3067\u3059)`);
        }
        refuse(
          name,
          p,
          [
            "env",
            "adsr",
            "arp",
            "pitch",
            "vol",
            "duty",
            "loop",
            "delay",
            "gain",
            "octave",
            "detune"
          ],
          "@opll \u306F\u97F3\u8272\u305D\u306E\u3082\u306E\u3067\u3059\u3002\u8868\u3092\u7740\u305B\u308B\u3068\u304D\u306F\u5225\u306E #voice \u3067\u3053\u306E\u540D\u524D\u3092\u547C\u3093\u3067\u304F\u3060\u3055\u3044"
        );
        tellIfTaken(name, findWave(name) >= 0, "\u97F3\u8272");
        registerOPLLVoice(
          name,
          p.opll,
          { ...p.role === null ? {} : { role: p.role }, overwrite: true }
        );
        return "opll";
      }
      if (p.wave === null) {
        if (!p.adsr) {
          bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306B\u97F3\u8272\u304C\u3042\u308A\u307E\u305B\u3093(@{\u540D\u524D} \u3092\u66F8\u304F\u304B\u3001@adsr{\u2026} \u3060\u3051\u3092\u66F8\u3044\u3066\u304F\u3060\u3055\u3044)`);
        }
        refuse(name, p, [
          "env",
          "role",
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
        ...p.role === null ? {} : { role: p.role },
        overwrite: true
      });
      return "tone";
    }
    const layers = parts.map((p, i) => {
      if (p.wave === null) {
        bad(`[ChpTnSnd] MML: \u97F3\u8272 "${name}" \u306E\u91CD\u306D\u308B\u4E2D\u8EAB\u306B @{\u540D\u524D} \u304C\u3042\u308A\u307E\u305B\u3093`);
      }
      if (i > 0) {
        refuse(
          name,
          p,
          ["role"],
          "@role \u306F\u97F3\u8272\u305C\u3093\u3076\u306B\u639B\u304B\u308B\u306E\u3067\u3001\u3044\u3061\u3070\u3093\u521D\u3081\u306E\u4E2D\u8EAB\u306B\u3060\u3051\u66F8\u3051\u307E\u3059"
        );
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
    registerLayer(
      name,
      { layers, ...parts[0].role === null ? {} : { role: parts[0].role } },
      { overwrite: true }
    );
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
  var DRUM_FREQ = 440 * Math.pow(2, (DRUM_MIDI - 69) / 12);
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
  function tellIfDrumPitchClash(names, table, said) {
    if (names.length < 2) return;
    const at = /* @__PURE__ */ new Map();
    for (const { nm } of names) {
      for (const part of (table.get(nm) || {}).parts || []) {
        const w = WAVEFORMS[part.wave];
        if (!w || w.kind !== "opll" || !w.drum) continue;
        const slot = OPLL_DRUM_TABLE[w.drum];
        if (!slot || slot.ch === 6) continue;
        const semi = (part.octave || 0) * 12 + (part.detune || 0) / 100;
        const got = at.get(slot.ch) || /* @__PURE__ */ new Map();
        if (!got.has(semi)) got.set(semi, `${nm}(${w.name})`);
        at.set(slot.ch, got);
      }
    }
    for (const [ch, got] of at) {
      if (got.size < 2) continue;
      const who = [...got.values()];
      const key2 = `${ch}:${who.join(",")}`;
      if (said.has(key2)) continue;
      said.add(key2);
      warn(`[ChpTnSnd] MML: \u540C\u3058\u62CD\u306B\u9AD8\u3055\u9055\u3044\u306E\u6253\u697D\u5668\u304C\u91CD\u306A\u3063\u3066\u3044\u307E\u3059(${who.join(" / ")})\u3002OPLL \u306E\u30EA\u30BA\u30E0\u97F3\u6E90\u306F\u30C1\u30E3\u30F3\u30CD\u30EB ${ch} \u306E\u9AD8\u3055\u3092 1 \u7D44\u3057\u304B\u6301\u305F\u306A\u3044\u306E\u3067\u3001\u3042\u3068\u306B\u66F8\u3044\u305F\u307B\u3046\u306E\u9AD8\u3055\u3067\u4E21\u65B9\u304C\u9CF4\u308A\u307E\u3059\u3002\u9806\u306B\u9CF4\u3089\u3059\u3076\u3093\u306F\u66F8\u3044\u305F\u3068\u304A\u308A\u3067\u3059`);
    }
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
    const m = /^@\{([^}]*)\}[ \t]*(?:v[ \t]*(\d+(?:\.\d+)?)\b)?[ \t]*(?:!([A-Za-z_]\w*)(?:[ \t]+(-?\d+))?)?[ \t]*(.*)$/.exec(t);
    if (!m) {
      bad(`[ChpTnSnd] MML: \u30C9\u30E9\u30E0 "${name}" \u306E "${t}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F @{\u540D\u524D} \u3068 v \u3068\u5408\u56F3\u3068\u547C\u3073\u540D\u3060\u3051\u3067\u3059\u3002\u9577\u3055\u3068\u9AD8\u3055\u306F\u66F8\u304D\u307E\u305B\u3093)`);
    }
    const key2 = m[1].trim().toLowerCase();
    const vol = m[2] === void 0 ? null : clamp(parseFloat(m[2]), 0, 15);
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
  function stripComments(raw, names = [], cues = [], texts = []) {
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
      } else if (src[i] === '"') {
        const triple = src[i + 1] === '"' && src[i + 2] === '"';
        const close = triple ? '"""' : '"';
        let j = i + close.length, body = "";
        while (j < src.length && src[j] !== "\n" && !src.startsWith(close, j)) {
          body += src[j++];
        }
        const shut = src.startsWith(close, j);
        if (!shut) {
          warn(`[ChpTnSnd] MML: \u5B57 "${body}" \u306E\u9589\u3058\u308B ${close} \u304C\u3042\u308A\u307E\u305B\u3093(\u5B57\u306F 1 \u884C\u306E\u4E2D\u3067\u9589\u3058\u307E\u3059)`);
        }
        texts.push(body);
        out += `${TEXT_AT}${texts.length - 1}${TEXT_AT}`;
        i = (shut ? j + close.length : j) - 1;
        headOfLine = false;
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
  var AT_WORDS = ["key", "tuning", "fade"];
  var AT_BRACED = [...AT_WORDS, "p"];
  var AT_BUNDLE_ONLY = ["vsteps", "vcurve"];
  var AT_LIST = "@{\u97F3\u8272} @e{\u5F62} @key{\u2026} @tuning{\u2026} @fade{\u2026} @p{\u2026} @d @o @v @m @s";
  function compileOne(mml, again = null) {
    const meta = readDirectives(mml);
    readWaves(mml);
    readVoices(mml);
    const bundles = readBundles(mml);
    const chordSets = readChordSets(mml, bundles);
    const drums = readDrums(mml, bundles);
    const markNames = [];
    const cueNames = [];
    const textList = [];
    const expanded = expandLoops(expandMacros(spaceDrumRepeats(
      lowerOutsideDrums(stripComments(String(mml), markNames, cueNames, textList))
    )));
    const { body: src, table: cueTable } = readCueNames(expanded);
    let pos = 0;
    let octave = 4, defLen = 4, tempo = 120, vol = 10, gate = 7;
    let wave = findWave(DEFAULT_WAVE), env = 0, vibrato = 0;
    let vibSpeed = null, vibDelay = null, vibSaid = false;
    let detune = 0, octShift = 0;
    let volShift = 0;
    let echo = null;
    let fade = null;
    if (again && again.head) {
      fade = {
        t0: 0,
        t1: 0,
        from: again.level,
        to: again.level,
        raw: !!again.raw,
        gamma: 1
      };
    }
    const volLog = [];
    const volLogAt = /* @__PURE__ */ new Map();
    let saidFixed = false;
    const fadeAt = (f, t) => {
      if (t >= f.t1) return f.to;
      if (t <= f.t0) return f.from;
      const u = (t - f.t0) / (f.t1 - f.t0);
      return f.from + (f.to - f.from) * (f.gamma === 1 ? u : Math.pow(u, f.gamma));
    };
    const bendAt = (e, age, then) => {
      const pts = (e.fade || []).filter((p) => p[0] < age - 1e-9);
      pts.push([age, fadeVolOf(e, age)]);
      if (then) pts.push(then);
      e.fade = pts;
    };
    const fadeScaler = (at, m, raw) => {
      if (raw) return (b, r) => b * r;
      const w = WAVEFORMS[at] || {};
      const steps = (m && m.vsteps !== null ? m.vsteps : w.vsteps) || 0;
      const curve = (m && m.vcurve !== null ? m.vcurve : w.vcurve) || "curve";
      return (b, r) => volFromGain(volGainOf(b, curve, steps) * r, curve, steps);
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
    const texts = [];
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
      const base = clamp((m && m.vol !== null ? m.vol : vol) + volShift, 0, 15);
      let v = base;
      let fd = null;
      if (fade) {
        const scale = fadeScaler(m ? m.wave : wave, m, fade.raw);
        v = scale(base, fadeAt(fade, time) / 15);
        if (time < fade.t1 - 1e-9) {
          const span = fade.t1 - time;
          const n = fade.raw ? 1 : Math.max(1, Math.min(24, Math.ceil(span / 0.1)));
          fd = [];
          for (let i = 0; i <= n; i++) {
            const at = span * i / n;
            fd.push([at, scale(base, fadeAt(fade, time + at) / 15)]);
          }
        }
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
      const saidClash = /* @__PURE__ */ new Set();
      const keep2 = { wave, bundle, chordSet, vol, env, octave, lane };
      inDrums = true;
      let base = vol;
      let names = [];
      const hit = () => {
        if (!names.length) return;
        tellIfDrumPitchClash(names, table, saidClash);
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
          vol = d.vol === null ? base : base * d.vol / 15;
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
    const readSignedVol = () => {
      let sign = 1;
      if (src[pos] === "-") {
        sign = -1;
        pos++;
      } else if (src[pos] === "+") pos++;
      const n = readVol();
      return n === null ? null : sign * n;
    };
    const needValue = (name, starts) => {
      const c = src[pos];
      if (c !== void 0 && (starts.includes(c) || c >= "0" && c <= "9")) return;
      bad(`[ChpTnSnd] MML: "@${name}" \u306B\u5024\u304C\u3042\u308A\u307E\u305B\u3093`);
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
      const parts = body.split(",").map((x) => x.trim());
      const [a, b] = parts.map(Number);
      let raw = false;
      let gamma = 1;
      let sayBad = parts.length < 2 || !Number.isFinite(a) || !Number.isFinite(b) || b < 0;
      for (const w of parts.slice(2)) {
        const t = w.toLowerCase();
        if (t === "amp") {
          raw = false;
          continue;
        }
        if (t === "raw") {
          raw = true;
          continue;
        }
        if (t.startsWith("g")) {
          const n = Number(t.slice(1));
          if (Number.isFinite(n) && n > 0) {
            gamma = n;
            continue;
          }
        }
        sayBad = true;
      }
      if (sayBad) {
        bad('[ChpTnSnd] MML: "@fade" \u306B\u306F\u884C\u304D\u5148\u306E\u97F3\u91CF\u3068\u62CD\u6570\u3092\u66F8\u304D\u307E\u3059(`@fade{0,8}`)\u30023 \u3064\u3081\u304B\u3089\u5148\u306F\u66F8\u304B\u306A\u304F\u3066\u3088\u304F\u3001\u66F8\u304F\u306A\u3089 amp(\u65E2\u5B9A\u3002\u97F3\u8272\u304C\u9055\u3063\u3066\u3082\u540C\u3058\u4E0B\u304C\u308A\u65B9)\u30FBraw(v \u3078\u76F4\u306B\u639B\u3051\u308B)\u30FBg<\u6570>(\u6642\u9593\u306E\u66F2\u304C\u308A\u5177\u5408\u30021 \u3067\u771F\u3063\u76F4\u3050\u30012\u301C3 \u3067\u7ACB\u3061\u4E0A\u304C\u308A\u3092\u6291\u3048\u308B)\u3067\u3059\u3002\u9806\u756A\u306F\u554F\u3044\u307E\u305B\u3093');
      }
      const from = fade ? fadeAt(fade, time) : 15;
      const to = clamp(a, 0, 15);
      fade = { t0: time, t1: time + b * 60 / tempo, from, to, raw, gamma };
      volLog.push({ t: time, fade });
      for (const e of lastSounding()) {
        const scale = fadeScaler(e.wave, null, fade.raw);
        const span = fade.t1 - time;
        const n = fade.raw && fade.gamma === 1 ? 1 : Math.max(1, Math.min(24, Math.ceil(span / 0.1)));
        for (let i = 1; i <= n; i++) {
          const at = span * i / n;
          bendAt(
            e,
            time - e.t + (i > 1 ? at - span / n : 0),
            [time - e.t + at, scale(written.get(e), fadeAt(fade, time + at) / 15)]
          );
        }
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
              fade = {
                t0: time,
                t1: time,
                from: again.level,
                to: again.level,
                raw: !!again.raw,
                gamma: 1
              };
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
        } else if (ch === TEXT_AT) {
          let n = "";
          while (pos < src.length && src[pos] !== TEXT_AT) n += src[pos++];
          pos++;
          const said = textList[Number(n)];
          if (said !== void 0) texts.push({ text: said, t: time });
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
          if (src[pos] === "+" || src[pos] === "-") {
            const sign = src[pos++] === "-" ? -1 : 1;
            const d = readVol() ?? 1;
            vol = Math.max(0, Math.min(15, vol + sign * d));
          } else {
            vol = Math.max(0, Math.min(15, readVol() ?? vol));
          }
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
              let word2 = "";
              while (pos < src.length && src[pos] !== "}") word2 += src[pos++];
              pos++;
              const w = word2.trim().toLowerCase();
              if (w === "off" || w === "") {
                sec._g = null;
                continue;
              }
              const n = Number(w);
              if (!Number.isFinite(n) || Math.abs(n) > 48) {
                bad(`[ChpTnSnd] MML: "@${name}{${word2}}" \u306F\u8AAD\u3081\u307E\u305B\u3093(\u534A\u97F3\u306E\u6570\u3092 -48 \u301C 48 \u3067\u66F8\u304F\u304B\u3001off \u3068\u66F8\u304D\u307E\u3059)`);
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
                let word2 = "";
                while (pos < src.length && /[0-9a-z]/.test(src[pos])) word2 += src[pos++];
                if (word2 === "random" || word2 === "") {
                  sec[name] = null;
                  continue;
                }
                if (word2.length % 2 !== 0 || /[^0-9a-f]/.test(word2)) {
                  bad(`[ChpTnSnd] MML: "@${name} ${word2}" \u306F\u8AAD\u3081\u307E\u305B\u3093(16 \u9032\u3092 2 \u6841\u305A\u3064\u4E26\u3079\u308B\u304B\u3001random \u3068\u66F8\u304D\u307E\u3059)`);
                }
                sec[name] = word2.match(/../g).map((h) => parseInt(h, 16));
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
          let word = "";
          for (let j = pos; j < src.length && src[j] >= "a" && src[j] <= "z"; j++) word += src[j];
          if (AT_BRACED.includes(word) && src[pos + word.length] !== "{") {
            bad(`[ChpTnSnd] MML: "@${word}" \u306F "@${word}{\u2026}" \u3068\u56F2\u3093\u3067\u66F8\u304D\u307E\u3059`);
          }
          if (word.length > 1 && !AT_WORDS.includes(word)) {
            bad(AT_BUNDLE_ONLY.includes(word) ? `[ChpTnSnd] MML: "@${word}" \u306F\u30D0\u30F3\u30C9\u30EB\u97F3\u8272(#bundle)\u306E\u4E2D\u3060\u3051\u3067\u66F8\u3051\u307E\u3059` : `[ChpTnSnd] MML: "@${word}" \u3068\u3044\u3046\u547D\u4EE4\u306F\u3042\u308A\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F ${AT_LIST})`);
          }
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
            needValue("d", "+-");
            detune = clamp(readSigned(), -2400, 2400);
          } else if (kind === "o") {
            pos++;
            needValue("o", "+-");
            octShift = clamp(readSigned(), -4, 4);
          } else if (kind === "v") {
            pos++;
            needValue("v", "+-");
            volShift = clamp(readSignedVol(), -15, 15);
          } else if (kind === "m") {
            pos++;
            needValue("m", "{");
            readVib();
          } else if (kind === "s") {
            pos++;
            needValue("s", "{");
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
            bad(`[ChpTnSnd] MML: "@${word || src[pos] || ""}" \u3068\u3044\u3046\u547D\u4EE4\u306F\u3042\u308A\u307E\u305B\u3093(\u66F8\u3051\u308B\u306E\u306F ${AT_LIST})`);
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
    let tieSeq = 0;
    for (let i = 0; i < events.length; i++) {
      if (events[i].legato) continue;
      let j = i;
      while (events[j + 1] && events[j + 1].legato) j++;
      if (j === i) continue;
      const head = events[i];
      const span = events[j].t + events[j].gate - head.t;
      const id = ++tieSeq;
      for (let k = i; k <= j; k++) {
        events[k].tieSpan = span;
        events[k].tieAt = events[k].t - head.t;
        events[k].tieId = id;
      }
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
          two = compileOne(
            mml,
            { level: fadeAt(end.fade, loop.to), head: !back, raw: end.fade.raw }
          ).events;
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
      texts,
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
      texts: all.texts.slice(head.texts.length),
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
          texts: [],
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
    const events = [], marks = [], takes = [], bars = [], cues = [], texts = [];
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
        for (const x of p.texts || []) texts.push({ ...x, t: x.t + at });
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
      for (const x of opts[0].texts || []) texts.push({ ...x, t: x.t + at });
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
          texts: o.texts,
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
      texts,
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

  // engine/sound/chipset.js
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
    // 和音・パッド。まず譲る側
    noise: 1,
    // 楽器としてのノイズ
    se: 0
    // 曲の部品ではないもの
  };
  var ROLES_COVERED = ROLES.every((r) => ROLE_RANK[r] !== void 0);

  // engine/sound/mask.js
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

  // engine/sound/wavetables.js
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
    registerFamily("waveSine", {
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
      "waveSine(8)",
      WT_SINE,
      8,
      {
        role: "chord",
        noteJa: "\u540C\u3058\u30B5\u30A4\u30F3\u6CE2\u3092 8 \u30D3\u30C3\u30C8(256 \u6BB5)\u3067\u3002SCC \u306B\u8F09\u305B\u305F\u3068\u304D\u306E\u7C97\u3055\u3067\u3001\u3053\u3053\u307E\u3067\u7D30\u304B\u3044\u3068\u307B\u3068\u3093\u3069\u6BB5\u304C\u805E\u3053\u3048\u306A\u3044\u3002\u7C97\u3055\u306E\u7AEF\u3068\u3057\u3066\u3001\u3053\u308C\u304C\u3044\u3061\u3070\u3093\u304D\u308C\u3044\u306A\u307B\u3046",
        note: "The same sine at eight bits (256 steps), the depth of an SCC. Fine enough that the steps all but disappear \u2014 the clean end of the range."
      }
    );
    registerWave(
      "waveSine(5)",
      WT_SINE,
      5,
      {
        role: "chord",
        noteJa: "\u6CE2\u5F62\u30E1\u30E2\u30EA\u306B\u8F09\u305B\u305F\u30B5\u30A4\u30F3\u6CE2\u30025 \u30D3\u30C3\u30C8(32 \u6BB5)\u3002\u968E\u6BB5\u306B\u3057\u3066\u3042\u308B\u306E\u306F\u308F\u3056\u3068\u3067\u3001\u305D\u306E\u7C97\u3055\u304C\u300C\u30B7\u30F3\u30BB\u3067\u306F\u306A\u304F\u30C1\u30C3\u30D7\u306E\u97F3\u300D\u306B\u805E\u3053\u3048\u308B\u6B63\u4F53\u3002PC \u30A8\u30F3\u30B8\u30F3\u306B\u8F09\u305B\u305F\u3068\u304D\u306E\u7C97\u3055",
        note: "Wavetable sine at five bits (32 steps) \u2014 the depth of a PC Engine. The staircase is deliberate: that coarseness is what makes it read as a chip and not a synth."
      }
    );
    registerWave(
      "waveSine(3)",
      WT_SINE,
      3,
      {
        role: "chord",
        noteJa: "\u540C\u3058\u30B5\u30A4\u30F3\u6CE2\u3092 3 \u30D3\u30C3\u30C8(8 \u6BB5)\u307E\u3067\u843D\u3068\u3057\u305F\u3082\u306E\u3002\u6BB5\u306E\u89D2\u304B\u3089\u500D\u97F3\u304C\u751F\u3048\u3066\u3001\u30B5\u30A4\u30F3\u6CE2\u306A\u306E\u306B\u30B8\u30EA\u30B8\u30EA\u9CF4\u308B\u3002\u3053\u3053\u307E\u3067\u6765\u308B\u3068\u3001\u6DF1\u3055\u304C\u4F55\u3092\u3057\u3066\u3044\u308B\u306E\u304B\u304C\u4E00\u5EA6\u3067\u5206\u304B\u308B",
        note: "The same sine crushed to three bits (8 steps). The corners of the staircase grow harmonics, so a sine ends up buzzing \u2014 at this depth you hear what bit depth does in one listen."
      }
    );
    registerWave(
      "waveBell",
      WT_BELL,
      8,
      {
        role: "counter",
        noteJa: "\u4E0A\u306E\u500D\u97F3\u3092\u5F37\u304F\u6301\u305F\u305B\u305F\u6CE2\u5F62\u30E1\u30E2\u30EA\u3002\u7ACB\u3061\u4E0A\u304C\u308A\u304C\u91D1\u5C5E\u7684\u3067\u3001\u9418\u3084\u30C1\u30E3\u30A4\u30E0\u306B\u5411\u304F",
        note: "Wavetable with strong upper partials. Metallic attack, good for bells and chimes."
      }
    );
    registerFamily("waveOrgan", {
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
      "waveOrgan(8)",
      WT_ORGAN,
      8,
      {
        role: "chord",
        noteJa: "1 \u5468\u671F\u306E\u4E2D\u306B\u30AA\u30AF\u30BF\u30FC\u30D6\u3092\u7A4D\u3093\u3067\u3042\u308B\u30021 \u3064\u306E\u97F3\u3068\u3044\u3046\u3088\u308A\u3001\u30AA\u30EB\u30AC\u30F3\u306E\u97F3\u6813\u3092\u5F15\u3044\u305F\u3088\u3046\u306B\u805E\u3053\u3048\u308B\u30028 \u30D3\u30C3\u30C8(256 \u6BB5)\u306A\u306E\u3067\u3001SCC \u306B\u8F09\u305B\u305F\u3068\u304D\u306E\u7C97\u3055",
        note: "Stacked octaves in one cycle, so it reads as an organ register rather than a single note. Eight bits (256 steps) \u2014 the coarseness you get on an SCC."
      }
    );
    registerWave(
      "waveOrgan(5)",
      WT_ORGAN,
      5,
      {
        role: "chord",
        noteJa: "\u540C\u3058\u5F62\u3092 5 \u30D3\u30C3\u30C8(32 \u6BB5)\u3067\u4E38\u3081\u305F\u3082\u306E\u3002PC \u30A8\u30F3\u30B8\u30F3\u306B\u8F09\u305B\u305F\u3068\u304D\u306E\u7C97\u3055\u3002\u6BB5\u304C\u7C97\u3044\u3076\u3093\u9AD8\u3044\u500D\u97F3\u304C\u5897\u3048\u3066\u3001\u540C\u3058\u5F62\u3067\u3082\u3056\u3089\u3064\u304F",
        note: "The same shape rounded to five bits (32 steps) \u2014 the coarseness you get on a PC Engine. The coarser steps add upper harmonics, so the same shape comes out grittier."
      }
    );
    registerWave(
      "waveRamp",
      WT_RAMP,
      5,
      {
        role: "lead",
        noteJa: "\u306E\u3053\u304E\u308A\u6CE2\u3092\u6CE2\u5F62\u30E1\u30E2\u30EA\u3067\u6301\u3063\u305F\u3082\u306E\u3002\u308F\u3056\u3068\u7C97\u304F(5 \u30D3\u30C3\u30C8)\u3057\u3066\u3042\u308B",
        note: "Sawtooth held in the wavetable, kept coarse (5-bit) on purpose."
      }
    );
    registerWave(
      "waveVoice",
      WT_VOICE,
      5,
      {
        role: "lead",
        noteJa: "\u5171\u9CF4\u306E\u5C71\u3092\u4F5C\u3063\u305F\u5F62\u3002\u7C97\u3044\u3002\u697D\u5668\u3068\u3044\u3046\u3088\u308A\u6BCD\u97F3\u306B\u805E\u3053\u3048\u308B",
        note: "Formant-ish shape, coarse. Reads as a vowel more than an instrument."
      }
    );
    registerWave(
      "wavePadWarm",
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
      "wavePadAiry",
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
      "waveSquareSoft",
      WT_SQUARE_SOFT,
      8,
      {
        role: "lead",
        noteJa: "\u89D2\u3092\u4E38\u3081\u305F\u77E9\u5F62\u6CE2\u3002\u4E2D\u304C\u7A7A\u3044\u305F\u611F\u3058\u306F\u6B8B\u3057\u305F\u307E\u307E\u3001\u304D\u3064\u3055\u3060\u3051\u53D6\u308C\u308B",
        note: "Square with the corners rounded off. Less harsh than a hard pulse while keeping the hollow character."
      }
    );
  }

  // engine/sound/fmpresets.js
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

  // engine/sound/beeppresets.js
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

  // engine/sound/opmpresets.js
  var OPM_PRESETS = {
    "opnBrass": {
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
    "opnLead": {
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
    "opnBass": {
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
    "opnEP": {
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
    "opmBell": {
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
    "opnKlang": {
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
    "opmGlass": {
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
    "opnSlap": {
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
    "opmTom": {
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
  function registerOPMPresets() {
    for (const [name, p] of Object.entries(OPM_PRESETS)) {
      registerOPM(name, p.patch, { note: p.note, noteJa: p.noteJa, role: p.role });
    }
    registerBaked("bakedBrass", {
      from: "opnBrass",
      octaves: [3, 4, 5],
      step: 3,
      role: "lead",
      noteJa: "opnBrass \u3092 3 \u30AA\u30AF\u30BF\u30FC\u30D6\u3076\u3093\u713C\u3044\u3066\u6CE2\u5F62\u306B\u3057\u305F\u3082\u306E\u3002\u5834\u6240\u306F\u98DF\u3046\u304C\u8A08\u7B97\u306F\u8981\u3089\u306A\u3044 \u2014 \u5B9F\u6A5F\u304C\u3084\u3063\u3066\u3044\u305F\u53D6\u308A\u5F15\u304D\u3068\u540C\u3058",
      note: "The four-operator brass rendered to samples across three octaves. Baking it costs memory but no CPU \u2014 the trade real hardware made."
    });
  }

  // engine/sound/extrawaves.js
  var EXTRA_LEN = 32;
  var build2 = (fn) => Array.from({ length: EXTRA_LEN }, (_, i) => fn(i / EXTRA_LEN));
  var pulse = (n) => build2((p) => p < n / 16 ? 1 : -1);
  var TUNER = (() => {
    const h = [0.5, 0.35, 0.4, 0.95, 1, 0.25];
    const power = h.reduce((s, a) => s + a * a, 0);
    const phase = h.map((_, k) => {
      let acc = 0;
      for (let j = 0; j <= k; j++) acc += (k + 1 - j) * h[j] * h[j] / power;
      return -Math.PI * acc;
    });
    const raw = build2((p) => h.reduce(
      (sum, a, i) => sum + a * Math.sin(2 * Math.PI * (i + 1) * p + phase[i]),
      0
    ));
    const top = Math.max(...raw.map(Math.abs));
    return raw.map((v) => v / top);
  })();
  var SAW_STEP = build2((p) => {
    const step = Math.floor(p * 8);
    return step >= 7 ? -1 : step / 6 * 2 - 1;
  });
  var EXTRA_PRESETS = {
    "wavePulse(6)": {
      noteJa: "\u5E45 6.25%(16 \u5206\u306E 1)\u3002\u7D30\u304F\u3066\u9F3B\u306B\u304B\u304B\u308B\u3002\u6DF7\u3093\u3060\u3068\u3053\u308D\u3067\u3082\u4ED6\u3068\u3076\u3064\u304B\u3089\u305A\u306B\u4E0A\u3078\u4E57\u308B",
      role: "lead",
      wave: pulse(1),
      bits: 1,
      note: "1/16 duty (6.25%). Thin and reedy; sits above a busier mix without fighting it."
    },
    "wavePulse(18)": {
      noteJa: "\u5E45 18.75%(16 \u5206\u306E 3)\u3002\u30D7\u30EA\u30BB\u30C3\u30C8\u306E 12.5% \u3068 25% \u306E\u3042\u3044\u3060",
      role: "lead",
      wave: pulse(3),
      bits: 1,
      note: "3/16 duty (18.75%). Between the built-in 12.5% and 25%."
    },
    "wavePulse(31)": {
      noteJa: "\u5E45 31.25%(16 \u5206\u306E 5)",
      role: "lead",
      wave: pulse(5),
      bits: 1,
      note: "5/16 duty (31.25%)."
    },
    "wavePulse(37)": {
      noteJa: "\u5E45 37.5%(16 \u5206\u306E 6)",
      role: "lead",
      wave: pulse(6),
      bits: 1,
      note: "6/16 duty (37.5%)."
    },
    "wavePulse(43)": {
      noteJa: "\u5E45 43.75%(16 \u5206\u306E 7)\u3002\u307B\u3068\u3093\u3069\u77E9\u5F62\u6CE2\u3068\u540C\u3058\u592A\u3055",
      role: "lead",
      wave: pulse(7),
      bits: 1,
      note: "7/16 duty (43.75%). Nearly as full as a square wave."
    },
    // 音律を確かめるためのもの。楽器ではない。
    //
    // `wave` の一族ではない。あちらは実機の波形メモリらしさを集めたところで、
    // 段が粗いことが売りになっている。これは 8 ビットで、倍音から作っていて、
    // 分周の丸めからも外してある。性格が合わないので `tool` で始める。
    // 素の `tuner` を取らないのは、短い語を 1 つ押さえてしまうため(2026-09-23)。
    //
    // 音律の違いは、倍音どうしがぶつかって出る「うなり」でしか聞こえない。
    // 長 3 度なら下の音の 5 倍音と上の音の 4 倍音、5 度なら 3 倍音と 2 倍音。
    // 矩形波には偶数倍音が無いので、4 倍音も 2 倍音も出ない。ぶつかる相手が
    // いないので、どの音律で鳴らしても同じに聞こえる(2026-09-23)。
    //
    // そこで 2〜5 倍音を持たせて、4 倍音と 5 倍音を basic より大きくした。
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
    waveSawStep: {
      noteJa: "\u6BB5\u306E\u3042\u308B\u306E\u3053\u304E\u308A\u30027 \u6BB5\u306E\u307C\u3063\u3066 1 \u6BB5\u843D\u3061\u308B\u3002\u8DB3\u3057\u7B97\u5668\u3067\u4F5C\u308B\u30C1\u30C3\u30D7\u306F\u3053\u306E\u5F62\u306B\u306A\u308B\u3002\u7D20\u306E\u306A\u3060\u3089\u304B\u306A\u5742\u3088\u308A\u3056\u3089\u3064\u304F\u3002VRC6 \u306E\u306E\u3053\u304E\u308A\u306B\u305D\u306E\u307E\u307E\u5F53\u3066\u306F\u307E\u308B",
      role: "lead",
      wave: SAW_STEP,
      bits: 5,
      note: "Stepped saw: seven rising steps and a drop, the way an adder-based chip builds one. Grittier than a plain ramp. Maps straight onto the VRC6 saw."
    }
  };
  function registerExtraFamilies() {
    registerFamily("wavePulse", {
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
            dev: p.dev
          }
        );
      }
    }
  }

  // engine/sound/pcmbake.js
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

  // engine/sound/opllpresets.js
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
  var STEAL_OK = /* @__PURE__ */ new Set([
    1,
    // Violin      持続音、11.5ms
    5,
    // Clarinet    持続音、13.4ms
    6,
    // Oboe        持続音、14.8ms
    8,
    // Organ       持続音、16.0ms
    10
    // Synthesizer 持続音、2.3ms 以下
  ]);
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
  var OPLL_USER_DRUMS = [
    ["opllUserKick", {
      mod: {
        ratio: 1,
        depth: 22,
        feedback: 4,
        attack: 15,
        decay: 15,
        sustain: 12,
        release: 15
      },
      car: { ratio: 0, attack: 15, decay: 7, sustain: 0, release: 7 }
    }, "Bass drum. The carrier runs an octave below what you write, so the body lands low while the modulator only clicks at the front. The click is kept small on purpose: with noise layered over it, this voice is the body. Play it at o2."],
    ["opllUserSnare", {
      mod: {
        ratio: 4,
        depth: 18,
        feedback: 6,
        attack: 15,
        decay: 13,
        sustain: 2,
        release: 10,
        half: true
      },
      car: { ratio: 1, attack: 15, decay: 10, sustain: 0, release: 8 }
    }, "Snare. The shell, not the wires: body around 250Hz and a woody crack above it. Lay PSG noise over the top for the snares. Play it at o3."],
    ["opllUserHatClosed", {
      mod: {
        ratio: 15,
        depth: 6,
        feedback: 7,
        attack: 15,
        decay: 10,
        sustain: 0,
        release: 6,
        half: true
      },
      car: { ratio: 13, attack: 15, decay: 15, sustain: 0, release: 15, half: true }
    }, "Closed hi-hat. Ratios of 15 against 13 give the metal its beating, and the carrier is cut off at once. Play it at o5."],
    ["opllUserHatOpen", {
      mod: {
        ratio: 15,
        depth: 6,
        feedback: 7,
        attack: 15,
        decay: 10,
        sustain: 0,
        release: 6,
        half: true
      },
      car: { ratio: 13, attack: 15, decay: 8, sustain: 0, release: 5, half: true }
    }, "Open hi-hat. The same metal as the closed one, held on instead of cut. Striking the closed hat chokes it, the way a foot on the pedal does. Play it at o5."],
    ["opllUserTom", {
      mod: {
        ratio: 2,
        depth: 22,
        feedback: 5,
        attack: 15,
        decay: 14,
        sustain: 8,
        release: 12,
        half: true
      },
      car: { ratio: 1, attack: 15, decay: 8, sustain: 0, release: 7 }
    }, "Tom. Pitched, so the note is the drum \u2014 write o3 for a floor tom and o4 for a rack tom."],
    ["opllUserKickHat", {
      mod: {
        ratio: 15,
        depth: 4,
        feedback: 7,
        attack: 15,
        decay: 15,
        sustain: 10,
        release: 12,
        half: true,
        scaleRate: 1
      },
      car: { ratio: 1, attack: 15, decay: 9, sustain: 0, release: 8, scaleRate: 1 }
    }, "Kick and hi-hat in one voice, for when they fall on the same beat. Write o2 for the kick and o8 for the hat."],
    ["opllUserKickSnare", {
      mod: {
        ratio: 3,
        depth: 16,
        feedback: 7,
        attack: 15,
        decay: 14,
        sustain: 4,
        release: 11,
        half: true,
        scaleRate: 1
      },
      car: { ratio: 1, attack: 15, decay: 9, sustain: 0, release: 8, scaleRate: 1 }
    }, "Kick and snare in one voice. Write o2 for the kick and o4 for the snare."],
    ["opllUserSnareHat", {
      mod: {
        ratio: 11,
        depth: 10,
        feedback: 7,
        attack: 15,
        decay: 13,
        sustain: 0,
        release: 9,
        half: true,
        scaleRate: 1
      },
      car: {
        ratio: 3,
        attack: 15,
        decay: 10,
        sustain: 0,
        release: 8,
        half: true,
        scaleRate: 1
      }
    }, "Snare and hi-hat in one voice. Write o4 for the snare and o6 for the hat."]
  ];
  var OPLL_KICK_VARIANTS = [
    ["low", -12, "An octave down, 54.6Hz. Heavy and slack; it sits under everything."],
    ["mid", 0, "The pitch the real driver used, 109.2Hz. Tight and light."],
    ["high", 12, "An octave up, 218.5Hz. Hard and small. Lay noise over it and it reads as a snare."]
  ];
  function registerOPLLPresets() {
    for (const [inst, name, role, noteJa, note] of OPLL_PRESETS) {
      try {
        registerOPLL(name, inst, {
          role,
          noteJa: `${noteJa}\u3002YM2413 \u306E ${inst} \u756A`,
          note,
          steal: STEAL_OK.has(inst) ? "ok" : "avoid",
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
      if (drum === "bd") {
        try {
          registerFamily(name, {
            note: "The OPLL rhythm bass drum, at three pitches. The chip holds one pitch per channel, but the bass drum has channel 6 to itself, so moving it leaves the other drums alone.",
            params: [{
              name: "pitch",
              default: "mid",
              note: "How far from the pitch the real driver used.",
              values: OPLL_KICK_VARIANTS.map(([value, , vn]) => ({ value, note: vn }))
            }]
          });
        } catch (e) {
        }
        for (const [value, semi, vn] of OPLL_KICK_VARIANTS) {
          try {
            registerOPLL(`${name}(${value})`, 16, {
              role: "perc",
              drum,
              semi,
              noteJa: `${noteJa}\u3002\u4F7F\u3046\u3068\u97F3\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u304C 9 \u672C\u304B\u3089 6 \u672C\u306B\u6E1B\u308B`,
              note: `${note} ${vn}`
            });
          } catch (e) {
          }
        }
        continue;
      }
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
    for (const [name, spec, note] of OPLL_USER_DRUMS) {
      try {
        registerOPLLVoice(name, spec, { role: "perc", note, dev: ["check"] });
      } catch (e) {
      }
    }
  }

  // engine/sound/ay.js
  var AY_CLOCK = 1789772;
  var AY_VOLTBL = [
    [
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
    ],
    [
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
    ]
  ];
  var AY_OUT_DIV = 14568;
  function ayTonePeriod(freq) {
    if (!(freq > 0)) return 4095;
    return Math.max(1, Math.min(4095, Math.round(AY_CLOCK / (16 * freq))));
  }
  function ayNoisePeriod(freq) {
    if (!(freq > 0)) return 31;
    return Math.max(1, Math.min(31, Math.round(AY_CLOCK / (256 * freq))));
  }
  function ayEnvPeriod(freq, div) {
    if (!(freq > 0)) return 65535;
    return Math.max(1, Math.min(65535, Math.round(AY_CLOCK / (div * freq))));
  }
  var AY_PRESETS = [
    [
      "ayTone",
      { mode: "tone" },
      "lead",
      "Square wave from the AY-3-8910 / YM2149 itself: the register-level MSX PSG rather than an oscillator imitating it. Volume follows the chip table, 16 steps of about 3dB."
    ],
    [
      "ayNoise",
      { mode: "noise" },
      "noise",
      "Noise from the AY-3-8910 / YM2149 itself: the 17-bit shift register of the real chip. The note picks the noise period (R6); o4a lands mid-range, lower notes are coarser. The chip has one noise generator, so two noise notes in the same part share its period."
    ],
    [
      "ayEnvSaw(5bit)",
      { mode: "env", shape: "saw" },
      "bass",
      "The volume envelope of the YM2149 itself, cycled at audio rate as a falling sawtooth. Volume does nothing; the note sets the envelope period, whose steps are 16 times coarser than a tone, so high notes drift. One envelope serves all three channels of the chip."
    ],
    [
      "ayEnvSaw(4bit)",
      { mode: "env", shape: "saw", ay: true },
      "bass",
      "The same falling sawtooth through the AY-3-8910 volume table: sixteen uneven steps instead of thirty-two. The MSX1 and the ZX Spectrum sound."
    ],
    [
      "ayEnvTri(5bit)",
      { mode: "env", shape: "tri" },
      "bass",
      "The volume envelope of the YM2149 itself, alternating, so it comes out as a triangle an octave below the sawtooth for the same period. Volume does nothing."
    ],
    [
      "ayEnvTri(4bit)",
      { mode: "env", shape: "tri", ay: true },
      "bass",
      "The alternating envelope through the AY-3-8910 volume table: a coarser triangle."
    ]
  ];
  var ENV_BITS = {
    name: "bits",
    default: "5bit",
    note: "Which volume table the envelope runs through.",
    values: [
      { value: "5bit", note: "Thirty-two steps, as on a YM2149 (MSX2 and later)." },
      { value: "4bit", note: "Sixteen uneven steps, as on an AY-3-8910 (MSX1, ZX Spectrum). Coarser." }
    ]
  };
  function registerAYPresets() {
    try {
      registerFamily("ayEnvSaw", {
        note: "The AY / YM2149 volume envelope cycled at audio rate as a falling sawtooth, from the chip itself.",
        params: [ENV_BITS]
      });
      registerFamily("ayEnvTri", {
        note: "The AY / YM2149 volume envelope cycled at audio rate as a triangle, from the chip itself.",
        params: [ENV_BITS]
      });
    } catch (e) {
    }
    for (const [name, params, role, note] of AY_PRESETS) {
      try {
        registerAY(name, params, { role, note });
      } catch (e) {
      }
    }
  }
  var AY_CODE = `
const CLK = ${AY_CLOCK};
const VOLTBL = ${JSON.stringify(AY_VOLTBL)};
const OUT_DIV = ${AY_OUT_DIV};
const REGMSK = [0xff, 0x0f, 0xff, 0x0f, 0xff, 0x0f, 0x1f, 0x3f,
  0x1f, 0x1f, 0x1f, 0xff, 0xff, 0x0f, 0xff, 0xff];

/**
 * \u30C1\u30C3\u30D7 1 \u500B\u3002emu2149 \u306E\u9AD8\u54C1\u8CEA\u306E\u9053(\u5185\u90E8\u3092 CLK / 8 \u3067\u56DE\u3057\u3066\u3001\u51FA\u53E3\u3067\u5E73\u5747\u3059\u308B)\u3002
 *
 * \u51FA\u53E3\u306F 0 \u304B\u3089\u4E0A\u3060\u3051(\u5B9F\u6A5F\u306E DAC \u3068\u540C\u3058)\u3002\u76F4\u6D41\u306F\u5916\u3067\u629C\u304F\u3002
 */
class PSG {
  constructor(rate, type = 0) {
    this.voltbl = VOLTBL[type] || VOLTBL[0];
    this.realstep = CLK;
    this.psgstep = rate * 8;
    this.psgtime = 0;
    // \u30CA\u30A4\u30AD\u30B9\u30C8\u3088\u308A\u9AD8\u3044\u30C8\u30FC\u30F3\u306F\u9ED9\u3089\u305B\u308B(emu2149 \u3068\u540C\u3058\u3002\u5B9F\u6A5F\u306F\u5F8C\u308D\u306E\u56DE\u8DEF\u304C\u843D\u3068\u3059)
    this.freqLimit = Math.floor(CLK / 16 / (rate / 2));
    this.reg = new Uint8Array(16);
    this.count = new Uint16Array(3);
    this.freq = new Uint16Array(3);
    this.edge = new Uint8Array(3);
    this.volume = new Uint8Array(3);
    this.tmask = new Uint8Array(3);
    this.nmask = new Uint8Array(3);
    this.chOut = new Int32Array(3);
    this.noiseSeed = 0xffff;
    this.noiseScaler = 0;
    this.noiseCount = 0;
    this.noiseFreq = 0;
    this.envPtr = 0;
    this.envFace = 0;
    this.envContinue = 0;
    this.envAttack = 0;
    this.envAlternate = 0;
    this.envHold = 0;
    this.envPause = 1;
    this.envFreq = 0;
    this.envCount = 0;
    this.out = 0;
  }

  writeReg(reg, val) {
    if (reg > 15) return;
    val &= REGMSK[reg];
    this.reg[reg] = val;
    switch (reg) {
      case 0: case 1: case 2: case 3: case 4: case 5: {
        const c = reg >> 1;
        this.freq[c] = ((this.reg[c * 2 + 1] & 15) << 8) + this.reg[c * 2];
        break;
      }
      case 6:
        this.noiseFreq = val & 31;
        break;
      case 7:
        this.tmask[0] = val & 1; this.tmask[1] = val & 2; this.tmask[2] = val & 4;
        this.nmask[0] = val & 8; this.nmask[1] = val & 16; this.nmask[2] = val & 32;
        break;
      case 8: case 9: case 10:
        this.volume[reg - 8] = val << 1;
        break;
      case 11: case 12:
        this.envFreq = (this.reg[12] << 8) + this.reg[11];
        break;
      case 13:
        this.envContinue = (val >> 3) & 1;
        this.envAttack = (val >> 2) & 1;
        this.envAlternate = (val >> 1) & 1;
        this.envHold = val & 1;
        this.envFace = this.envAttack;
        this.envPause = 0;
        this.envPtr = this.envFace ? 0 : 0x1f;
        break;
    }
  }

  /** \u5185\u90E8\u306E 1 \u523B\u307F(CLK / 8 \u306B 1 \u56DE) */
  update() {
    // \u30A8\u30F3\u30D9\u30ED\u30FC\u30D7
    this.envCount++;
    if (this.envCount >= this.envFreq) {
      if (!this.envPause) {
        this.envPtr = this.envFace ? (this.envPtr + 1) & 0x3f : (this.envPtr + 0x3f) & 0x3f;
      }
      if (this.envPtr & 0x20) {
        if (this.envContinue) {
          if (this.envAlternate ^ this.envHold) this.envFace ^= 1;
          if (this.envHold) this.envPause = 1;
          this.envPtr = this.envFace ? 0 : 0x1f;
        } else {
          this.envPause = 1;
          this.envPtr = 0;
        }
      }
      if (this.envFreq >= 1) this.envCount -= this.envFreq;
      else this.envCount = 0;
    }
    // \u30CE\u30A4\u30BA\u300217 \u30D3\u30C3\u30C8\u306E\u4E26\u3073\u3092\u30012 \u56DE\u306B 1 \u56DE\u9032\u3081\u308B
    this.noiseCount++;
    if (this.noiseCount >= this.noiseFreq) {
      this.noiseScaler ^= 1;
      if (this.noiseScaler) {
        if (this.noiseSeed & 1) this.noiseSeed ^= 0x24000;
        this.noiseSeed >>= 1;
      }
      if (this.noiseFreq >= 1) this.noiseCount -= this.noiseFreq;
      else this.noiseCount = 0;
    }
    const noise = this.noiseSeed & 1;
    // \u30C8\u30FC\u30F3
    for (let i = 0; i < 3; i++) {
      this.count[i]++;
      if (this.count[i] >= this.freq[i]) {
        this.edge[i] ^= 1;
        if (this.freq[i] >= 1) this.count[i] -= this.freq[i];
        else this.count[i] = 0;
      }
      // \u30CA\u30A4\u30AD\u30B9\u30C8\u3088\u308A\u9AD8\u3044\u30C8\u30FC\u30F3\u3092\u9ED9\u3089\u305B\u308B\u306E\u306F\u3001\u30C8\u30FC\u30F3\u3092\u958B\u3051\u3066\u3044\u308B\u3068\u304D\u3060\u3051\u3002
      // emu2149 \u306F\u9589\u3058\u3066\u3044\u3066\u3082\u898B\u308B\u306E\u3067\u3001\u5468\u671F\u3092\u66F8\u304B\u305A\u306B\u9CF4\u3089\u3059\u30D6\u30B6\u30FC(R7 \u3067
      // \u30C8\u30FC\u30F3\u3092\u9589\u3058\u3066\u3001\u97F3\u91CF\u3092\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u306B\u4EFB\u305B\u308B)\u304C\u9ED9\u3063\u3066\u3044\u305F
      if (this.freqLimit > 0 && !this.tmask[i] && this.freq[i] <= this.freqLimit && this.nmask[i]) continue;
      if ((this.tmask[i] || this.edge[i]) && (this.nmask[i] || noise)) {
        const v = this.volume[i];
        this.chOut[i] = (v & 32 ? this.voltbl[this.envPtr] : this.voltbl[v & 31]) << 4;
      } else {
        this.chOut[i] = 0;
      }
    }
  }

  /** \u51FA\u53E3\u306E 1 \u30B5\u30F3\u30D7\u30EB */
  calc() {
    while (this.realstep > this.psgtime) {
      this.psgtime += this.psgstep;
      this.update();
      this.out = (this.out + this.chOut[0] + this.chOut[1] + this.chOut[2]) >> 1;
    }
    this.psgtime -= this.realstep;
    return this.out;
  }
}

/**
 * \u884C\u304D\u5148 1 \u3064\u3076\u3093\u306E\u51E6\u7406\u5668\u3002\u4E2D\u306B\u30C1\u30C3\u30D7\u3092\u4F55\u500B\u3067\u3082\u6301\u3064\u3002
 *
 * \u5B9F\u6A5F\u306E 1 \u500B\u306E\u30C1\u30C3\u30D7\u306F\u30013 \u58F0\u3067\u30CE\u30A4\u30BA 1 \u3064\u3068\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7 1 \u3064\u3092\u5206\u3051\u5408\u3046\u3002
 * \u3053\u3061\u3089\u306F\u6B62\u3081\u306A\u3044\u3002\u30D6\u30B6\u30FC\u3084\u30CE\u30A4\u30BA\u3092\u540C\u6642\u306B\u9CF4\u3089\u3057\u305F\u3044\u3068\u304D\u306F\u3001\u7A7A\u3044\u3066\u3044\u308B
 * \u30C1\u30C3\u30D7\u304C\u7121\u3051\u308C\u3070 1 \u500B\u8DB3\u3059\u3002\u5B9F\u6A5F\u3067\u4E00\u7DD2\u306B\u4F7F\u3048\u308B\u304B\u306F\u3001\u66F8\u304D\u51FA\u3057\u306E\u3068\u304D\u306B\u898B\u308B
 * (\u9CF4\u3089\u3059\u5074\u306F\u7E1B\u3089\u306A\u3044)\u3002
 *
 * \u9ED9\u3063\u3066\u3044\u308B\u30C1\u30C3\u30D7\u306F\u56DE\u3055\u306A\u3044\u306E\u3067\u3001\u91CD\u3055\u306F\u9CF4\u3063\u3066\u3044\u308B\u97F3\u306E\u6570\u306B\u6BD4\u4F8B\u3059\u308B\u3002
 */
class AyBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    // \u30C1\u30C3\u30D7\u306E\u4E26\u3073\u30021 \u3064\u304C { c: PSG, type, v: [3 \u58F0] }
    this.pool = [];
    this.log = !!q.log;
    this.logNow = 0;
    // \u76F4\u6D41\u3092\u629C\u304F(\u5B9F\u6A5F\u306E\u51FA\u53E3\u306E\u30B3\u30F3\u30C7\u30F3\u30B5\u306B\u3042\u305F\u308B)\u3002\u524D\u306E\u5165\u529B\u3068\u524D\u306E\u51FA\u529B
    this.dcX = 0;
    this.dcY = 0;
    this.dcR = 1 - 2 * Math.PI * 20 / sampleRate;   // 20Hz
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(sampleRate * 0.01));
    this.port.onmessage = (e) => {
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  /** \u30C1\u30C3\u30D7\u3092 1 \u500B\u8DB3\u3059\u3002type \u306F\u97F3\u91CF\u306E\u8868(0 = YM2149\u30011 = AY-3-8910) */
  grow(type) {
    const c = new PSG(sampleRate, type);
    const chip = { c, type, log: null, v: [0, 1, 2].map(() => ({ end: 0, vs: null, ps: null, gs: null })) };
    // \u8A18\u9332\u3059\u308B\u3068\u304D\u306F\u3001\u66F8\u3044\u305F\u6642\u523B\u3068\u4E2D\u8EAB\u3092\u30C1\u30C3\u30D7\u3054\u3068\u306B\u6E9C\u3081\u3066\u5916\u3078\u6D41\u3059\u3002
    // \u30C1\u30C3\u30D7\u304C\u4F55\u500B\u3042\u3063\u3066\u3082\u3001\u3069\u308C\u3078\u306E\u66F8\u304D\u8FBC\u307F\u304B\u304C\u5206\u304B\u308B\u3088\u3046\u306B\u5206\u3051\u3066\u304A\u304F
    // (VGM \u3078\u51FA\u3059\u3068\u304D\u306F\u3001\u30C1\u30C3\u30D7\u3054\u3068\u306B 1 \u500B\u306E\u30C1\u30C3\u30D7\u3068\u3057\u3066\u66F8\u304F)
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    // \u30CE\u30A4\u30BA\u3082\u30C8\u30FC\u30F3\u3082\u5207\u3063\u3066\u304A\u304F(R7 \u306F 1 \u3067\u6B62\u307E\u308B)
    c.writeReg(7, 0x3f);
    this.pool.push(chip);
    return chip;
  }

  /** \u6B62\u3081\u308B\u3002\u6E9C\u3081\u305F\u30A4\u30D9\u30F3\u30C8\u3092\u6368\u3066\u3066\u3001\u9CF4\u3063\u3066\u3044\u308B\u58F0\u3092\u9ED9\u3089\u305B\u308B */
  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) for (let ch = 0; ch < 3; ch++) this.silence(chip, ch);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  /** \u305D\u306E\u58F0\u3092\u9ED9\u3089\u305B\u308B\u3002\u97F3\u91CF\u3092 0 \u306B\u3057\u3066\u3001\u30C8\u30FC\u30F3\u3082\u30CE\u30A4\u30BA\u3082\u5916\u3059 */
  silence(chip, ch) {
    const c = chip.c;
    const v = chip.v[ch];
    v.end = 0; v.vs = null; v.ps = null; v.gs = null;
    v.noise = false; v.env = false;
    if (c.reg[8 + ch] !== 0) c.writeReg(8 + ch, 0);
    const mix = c.reg[7] | (9 << ch);
    if (c.reg[7] !== mix) c.writeReg(7, mix);
  }

  /**
   * \u97F3\u7B26\u3092\u7F6E\u304F\u5834\u6240\u3092\u9078\u3076\u3002\u7A7A\u3044\u305F\u58F0\u304C\u3042\u308A\u3001\u30CE\u30A4\u30BA\u3084\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u3092\u4F7F\u3046\u97F3\u7B26\u306A\u3089
   * \u305D\u308C\u3092\u4F7F\u3063\u3066\u3044\u308B\u58F0\u304C\u307B\u304B\u306B\u7121\u3044\u30C1\u30C3\u30D7\u3002\u7121\u3051\u308C\u3070\u30C1\u30C3\u30D7\u3092\u8DB3\u3059\u3002
   */
  pick(ev, now) {
    const type = ev.ay ? 1 : 0;
    for (const chip of this.pool) {
      if (chip.type !== type) continue;
      let free = -1, busyNoise = false, busyEnv = false;
      for (let ch = 0; ch < 3; ch++) {
        const v = chip.v[ch];
        if (v.end <= now) { if (free < 0) free = ch; continue; }
        if (v.noise) busyNoise = true;
        if (v.env) busyEnv = true;
      }
      if (free < 0) continue;
      if (ev.noise && busyNoise) continue;
      if (ev.env && busyEnv) continue;
      return { chip, ch: free };
    }
    return { chip: this.grow(type), ch: 0 };
  }

  /** \u30C8\u30FC\u30F3\u306E\u5468\u671F\u3092\u66F8\u3044\u3066\u3001\u305D\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u30C8\u30FC\u30F3\u3092\u958B\u3051\u308B(0 \u306A\u3089\u9589\u3058\u308B) */
  gate(c, ch, tp) {
    if (tp > 0) {
      if (c.reg[ch * 2] !== (tp & 0xff)) c.writeReg(ch * 2, tp & 0xff);
      if (c.reg[ch * 2 + 1] !== ((tp >> 8) & 15)) c.writeReg(ch * 2 + 1, (tp >> 8) & 15);
    }
    const mix = tp > 0 ? c.reg[7] & ~(1 << ch) : c.reg[7] | (1 << ch);
    if (c.reg[7] !== mix) c.writeReg(7, mix);
  }

  /** \u97F3\u7B26\u3092 1 \u3064\u4E57\u305B\u308B */
  start(ev, now) {
    const { chip, ch } = this.pick(ev, now);
    const c = chip.c;
    // \u524D\u306E\u97F3\u304C\u6B8B\u3063\u3066\u3044\u308C\u3070\u5148\u306B\u9ED9\u3089\u305B\u308B(\u66F8\u304D\u76F4\u3057\u306E\u4E26\u3073\u3092\u6368\u3066\u308B)
    if (chip.v[ch].end > 0) this.silence(chip, ch);
    const noise = !!ev.noise;
    const env = ev.env || null;
    // R7 \u306F 1 \u3067\u6B62\u307E\u308B\u3002\u307E\u305A\u30C8\u30FC\u30F3\u3082\u30CE\u30A4\u30BA\u3082\u9589\u3058\u3066\u304B\u3089\u3001\u8981\u308B\u307B\u3046\u3092\u958B\u3051\u308B
    let mix = c.reg[7] | (9 << ch);
    if (noise) {
      if (c.reg[6] !== ev.np) c.writeReg(6, ev.np);
      mix &= ~(8 << ch);
    } else if (!env) {
      c.writeReg(ch * 2, ev.tp & 0xff);
      c.writeReg(ch * 2 + 1, (ev.tp >> 8) & 15);
      mix &= ~(1 << ch);
    }
    if (c.reg[7] !== mix) c.writeReg(7, mix);
    if (env) {
      // \u30D6\u30B6\u30FC\u3002\u5468\u671F\u3092\u66F8\u3044\u3066\u304B\u3089 R13 \u3092\u66F8\u304F\u3002R13 \u3092\u66F8\u304F\u3068\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u304C\u982D\u304B\u3089\u56DE\u308B\u3002
      // \u30C8\u30FC\u30F3\u306F\u533A\u5207\u308A(gs)\u306E\u6700\u521D\u306E\u5024\u3067\u958B\u3051\u9589\u3081\u3059\u308B(@g \u3067\u639B\u3051\u308B\u77E9\u5F62\u6CE2)
      c.writeReg(11, env.ep & 0xff);
      c.writeReg(12, (env.ep >> 8) & 0xff);
      c.writeReg(13, env.shape);
      this.gate(c, ch, ev.g0 || 0);
    }
    // \u97F3\u91CF\u306F 0\u301C15\u300216 \u3092\u8DB3\u3059\u3068\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u306B\u5F93\u3046(\u30D6\u30B6\u30FC)
    c.writeReg(8 + ch, ev.v & 31);
    const v = chip.v[ch];
    v.end = ev.t + ev.dur;
    v.noise = noise;
    v.env = !!env;
    v.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
    v.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
    v.gs = ev.gs && ev.gs.length ? { list: ev.gs, at: 0 } : null;
  }

  /** \u6642\u523B\u304C\u6765\u305F\u66F8\u304D\u76F4\u3057\u3092\u66F8\u304F\u3002\u7D42\u308F\u3063\u305F\u58F0\u3092\u9ED9\u3089\u305B\u308B */
  step(now) {
    for (const chip of this.pool) {
      const c = chip.c;
      for (let ch = 0; ch < 3; ch++) {
        const v = chip.v[ch];
        if (v.end <= 0) continue;
        if (v.end <= now) { this.silence(chip, ch); continue; }
        if (v.vs) {
          const f = v.vs;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const val = f.list[f.at++][1] & 31;
            if (c.reg[8 + ch] !== val) c.writeReg(8 + ch, val);
          }
          if (f.at >= f.list.length) v.vs = null;
        }
        if (v.ps) {
          const f = v.ps;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const p = f.list[f.at++][1];
            if (v.noise) {
              if (c.reg[6] !== p) c.writeReg(6, p);
            } else if (v.env) {
              // \u30D6\u30B6\u30FC\u306E\u9AD8\u3055\u306F\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u306E\u5468\u671F\u3002R13 \u306F\u66F8\u304B\u306A\u3044(\u66F8\u304F\u3068\u982D\u304B\u3089\u56DE\u308A\u76F4\u3059)
              if (c.reg[11] !== (p & 0xff)) c.writeReg(11, p & 0xff);
              if (c.reg[12] !== ((p >> 8) & 0xff)) c.writeReg(12, (p >> 8) & 0xff);
            } else {
              if (c.reg[ch * 2] !== (p & 0xff)) c.writeReg(ch * 2, p & 0xff);
              if (c.reg[ch * 2 + 1] !== ((p >> 8) & 15)) c.writeReg(ch * 2 + 1, (p >> 8) & 15);
            }
          }
          if (f.at >= f.list.length) v.ps = null;
        }
        if (v.gs) {
          const f = v.gs;
          while (f.at < f.list.length && f.list[f.at][0] <= now) this.gate(c, ch, f.list[f.at++][1]);
          if (f.at >= f.list.length) v.gs = null;
        }
      }
    }
  }

  /** \u305D\u306E\u30C1\u30C3\u30D7\u306B\u9CF4\u3063\u3066\u3044\u308B\u58F0\u304C\u3042\u308B\u304B */
  live(chip) {
    return chip.v[0].end > 0 || chip.v[1].end > 0 || chip.v[2].end > 0;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    // \u4F55\u3082\u9CF4\u3063\u3066\u304A\u3089\u305A\u3001\u6B21\u306E\u97F3\u7B26\u3082\u3053\u306E\u7BC4\u56F2\u306B\u6765\u306A\u3044\u306A\u3089\u3001\u8A08\u7B97\u3092\u98DB\u3070\u3059\u3002
    // \u76F4\u6D41\u3092\u629C\u3044\u305F\u3042\u3068\u306E\u5C3E\u304C\u6B8B\u3063\u3066\u3044\u308B\u3042\u3044\u3060\u306F\u56DE\u3059
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    if (!this.pool.some((c) => this.live(c)) && next >= base + n / sampleRate
      && Math.abs(this.dcY) < 1e-6) {
      out.fill(0);
      this.dcX = 0; this.dcY = 0;
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.log) this.logNow = now;
      // \u7D42\u308F\u308B\u97F3\u7B26\u3092\u3001\u59CB\u307E\u308B\u97F3\u7B26\u3088\u308A\u5148\u306B(sound/opll.js \u3068\u540C\u3058\u7406\u7531)
      this.step(now);
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        this.start(this.events[this.at++], now);
      }
      // \u9ED9\u3063\u3066\u3044\u308B\u30C1\u30C3\u30D7\u306F\u56DE\u3055\u306A\u3044\u3002\u51FA\u53E3\u306F 0 \u306E\u307E\u307E
      let raw = 0;
      for (const chip of this.pool) {
        if (this.live(chip)) raw += chip.c.calc();
        else chip.c.out = 0;
      }
      const x = raw / OUT_DIV;
      const y = x - this.dcX + this.dcR * this.dcY;
      this.dcX = x;
      this.dcY = y;
      let v = y;
      if (this.cutAt >= 0) {
        v *= Math.max(0, 1 - this.cutAt / this.cutLen);
        this.cutAt++;
        if (this.cutAt > this.cutLen) { this.cutAt = this.cutLen; v = 0; }
      }
      out[i] = v;
    }
    if (this.log) {
      for (let k = 0; k < this.pool.length; k++) {
        const chip = this.pool[k];
        if (!chip.log.length) continue;
        // type \u306F\u97F3\u91CF\u306E\u8868(0 = YM2149\u30011 = AY-3-8910)\u3002VGM \u306E\u982D\u306B\u66F8\u304F\u306E\u306B\u8981\u308B
        this.port.postMessage({ regs: chip.log, chip: k, type: chip.type });
        chip.log = [];
      }
    }
    return true;
  }
}
registerProcessor('mmsxx-ay', AyBank);
`;

  // engine/sound/nes.js
  var NES_CLOCK = 1789773;
  var NES_NOISE_PERIODS = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
  var NES_DUTIES = [0.125, 0.25, 0.5, 0.75];
  var NES_OUT_GAIN = 1.876;
  function nesPulseTimer(freq) {
    if (!(freq > 0)) return 2047;
    return Math.max(8, Math.min(2047, Math.round(NES_CLOCK / (16 * freq) - 1)));
  }
  function nesTriangleTimer(freq) {
    if (!(freq > 0)) return 2047;
    return Math.max(2, Math.min(2047, Math.round(NES_CLOCK / (32 * freq) - 1)));
  }
  function nesNoisePeriod(freq, short) {
    if (!(freq > 0)) return 15;
    const want = short ? NES_CLOCK / (93 * freq) : NES_CLOCK / (16 * freq);
    let best = 0;
    for (let i = 1; i < 16; i++) {
      if (Math.abs(Math.log(NES_NOISE_PERIODS[i] / want)) < Math.abs(Math.log(NES_NOISE_PERIODS[best] / want))) best = i;
    }
    return best;
  }
  function nesDutyIndex(duty) {
    let best = 0;
    for (let i = 1; i < 4; i++) if (Math.abs(NES_DUTIES[i] - duty) < Math.abs(NES_DUTIES[best] - duty)) best = i;
    return best;
  }
  var NES_PRESETS = [
    [
      "nesPulse(12)",
      { mode: "pulse", duty: 0.125 },
      "lead",
      "NES APU pulse at 12.5% duty, from the chip itself. Thin and nasal. Volume is the 4-bit value as amplitude, and the two pulses share one nonlinear mixer."
    ],
    [
      "nesPulse(25)",
      { mode: "pulse", duty: 0.25 },
      "lead",
      "NES APU pulse at 25% duty, from the chip itself. The classic NES lead."
    ],
    [
      "nesPulse(50)",
      { mode: "pulse", duty: 0.5 },
      "lead",
      "NES APU pulse at 50% duty, from the chip itself. A plain square."
    ],
    [
      "nesTriangle",
      { mode: "triangle" },
      "bass",
      "NES APU triangle, from the chip itself: a 32-step staircase, an octave below a pulse with the same timer. It has no volume control; v0 silences it and anything else plays full."
    ],
    [
      "nesNoise(long)",
      { mode: "noise" },
      "noise",
      "NES APU noise in its long mode: the 15-bit shift register, heard as white noise. The note picks one of the sixteen periods; o4a lands mid-range, lower notes are coarser."
    ],
    [
      "nesNoise(short)",
      { mode: "noise", short: true },
      "noise",
      "NES APU noise in its short mode: the register loops every 93 steps, so it comes out as a metallic buzz with a pitch. The note picks the nearest of the sixteen periods."
    ]
  ];
  function registerNESPresets() {
    try {
      registerFamily("nesPulse", {
        note: "The NES APU pulse channel, from the chip itself.",
        params: [{
          name: "duty",
          default: "50",
          note: "Share of each cycle spent high, in percent (rounded down).",
          values: [
            { value: "12", note: "12.5%. Thin and nasal." },
            { value: "25", note: "25%. The classic NES lead." },
            { value: "50", note: "50%. A plain square." }
          ]
        }]
      });
      registerFamily("nesNoise", {
        note: "The NES APU noise channel, from the chip itself.",
        params: [{
          name: "mode",
          default: "long",
          note: "Which loop the shift register runs.",
          values: [
            { value: "long", note: "The full 32767-step loop: white noise. Drums and effects." },
            { value: "short", note: "A 93-step loop, heard as a metallic buzz with a pitch." }
          ]
        }]
      });
    } catch (e) {
    }
    for (const [name, params, role, note] of NES_PRESETS) {
      try {
        registerNES(name, params, { role, note });
      } catch (e) {
      }
    }
  }
  var NES_CODE = `
const CLK = ${NES_CLOCK};
const NOISE = ${JSON.stringify(NES_NOISE_PERIODS)};
const OUT_GAIN = ${NES_OUT_GAIN};
const DUTY = [
  [0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 1, 1],
];
const TRI = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const LENGTH = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14,
  12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
/** \u30D5\u30EC\u30FC\u30E0\u30AB\u30A6\u30F3\u30BF\u306E 1/4 \u30D5\u30EC\u30FC\u30E0(4 \u6BB5\u306E\u30E2\u30FC\u30C9)\u3002CPU \u306E\u30AF\u30ED\u30C3\u30AF\u3067\u6570\u3048\u308B */
const QUARTER = CLK / 240;

/** \u97F3\u91CF\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7(\u77E9\u5F62\u6CE2\u3068\u30CE\u30A4\u30BA)\u3002\u4E00\u5B9A\u306E\u97F3\u91CF\u306B\u3057\u3066\u3044\u308C\u3070\u5024\u3092\u305D\u306E\u307E\u307E\u51FA\u3059 */
function newEnv() {
  return { start: false, div: 0, decay: 0, loop: false, constant: true, vol: 0 };
}
function clockEnv(e) {
  if (e.start) { e.start = false; e.decay = 15; e.div = e.vol; return; }
  if (e.div > 0) { e.div--; return; }
  e.div = e.vol;
  if (e.decay > 0) e.decay--;
  else if (e.loop) e.decay = 15;
}
const envOut = (e) => (e.constant ? e.vol : e.decay);

/**
 * \u30C1\u30C3\u30D7 1 \u500B\u3002\u77E9\u5F62\u6CE2 2 \u672C\u30FB\u4E09\u89D2\u6CE2\u30FB\u30CE\u30A4\u30BA\u3002
 *
 * \u51FA\u53E3\u306E\u30B5\u30F3\u30D7\u30EB\u3054\u3068\u306B CPU \u306E\u30AF\u30ED\u30C3\u30AF\u3092\u6570\u3048\u3066\u9032\u3081\u3001\u305D\u306E\u3042\u3044\u3060\u306E\u5404\u58F0\u306E\u5024\u3092
 * \u6642\u9593\u3067\u5E73\u5747\u3057\u3066\u304B\u3089\u6DF7\u305C\u308B(\u70B9\u3067\u62FE\u3046\u3068\u9AD8\u3044\u97F3\u3067\u6298\u308A\u8FD4\u3057\u304C\u51FA\u308B\u305F\u3081)\u3002
 * \u6DF7\u305C\u65B9\u306F NESdev \u306E\u5F0F(\u58F0\u3092\u8DB3\u3059\u3068\u3053\u308D\u304C\u76F4\u7DDA\u3067\u306A\u3044)\u3002
 */
class APU {
  constructor(rate) {
    this.step = CLK / rate;    // \u51FA\u53E3 1 \u30B5\u30F3\u30D7\u30EB\u3042\u305F\u308A\u306E CPU \u306E\u30AF\u30ED\u30C3\u30AF
    this.frac = 0;
    this.quarter = 0;
    this.half = false;
    this.reg = new Uint8Array(0x18);
    this.pulse = [0, 1].map(() => ({ duty: 0, seq: 0, timer: 0, count: 2, len: 0, halt: false,
      env: newEnv(), sweepNeg: false, sweepShift: 0, on: false }));
    this.tri = { seq: 0, timer: 0, count: 1, len: 0, halt: false, lin: 0, linLoad: 0, linReload: false, on: false };
    this.noise = { shift: 1, short: false, period: 4, count: 4, len: 0, halt: false, env: newEnv(), on: false };
  }

  writeReg(r, v) {
    if (r > 0x17) return;
    this.reg[r] = v;
    if (r < 8) {
      const p = this.pulse[r >> 2];
      switch (r & 3) {
        case 0:
          p.duty = v >> 6; p.halt = !!(v & 0x20); p.env.loop = p.halt;
          p.env.constant = !!(v & 0x10); p.env.vol = v & 15;
          break;
        case 1:
          p.sweepNeg = !!(v & 8); p.sweepShift = v & 7;
          break;
        case 2:
          p.timer = (p.timer & 0x700) | v;
          break;
        case 3:
          p.timer = (p.timer & 0xff) | ((v & 7) << 8);
          if (p.on) p.len = LENGTH[v >> 3];
          // \u4E0A\u306E\u6841\u3092\u66F8\u304F\u3068\u3001\u6CE2\u306E\u982D\u304B\u3089\u3084\u308A\u76F4\u3059(\u5B9F\u6A5F\u3068\u540C\u3058\u3002\u3060\u304B\u3089\u9AD8\u3055\u3092\u6ED1\u3089\u305B\u308B
          // \u3068\u304D\u306F\u3001\u5909\u308F\u3089\u306A\u3051\u308C\u3070\u66F8\u304B\u306A\u3044)
          p.seq = 0; p.env.start = true;
          break;
      }
      return;
    }
    const t = this.tri, n = this.noise;
    switch (r) {
      case 0x08: t.halt = !!(v & 0x80); t.linLoad = v & 0x7f; break;
      case 0x0a: t.timer = (t.timer & 0x700) | v; break;
      case 0x0b:
        t.timer = (t.timer & 0xff) | ((v & 7) << 8);
        if (t.on) t.len = LENGTH[v >> 3];
        t.linReload = true;
        break;
      case 0x0c:
        n.halt = !!(v & 0x20); n.env.loop = n.halt; n.env.constant = !!(v & 0x10); n.env.vol = v & 15;
        break;
      case 0x0e: n.short = !!(v & 0x80); n.period = NOISE[v & 15]; break;
      case 0x0f: if (n.on) n.len = LENGTH[v >> 3]; n.env.start = true; break;
      case 0x15:
        this.pulse[0].on = !!(v & 1); this.pulse[1].on = !!(v & 2);
        t.on = !!(v & 4); n.on = !!(v & 8);
        if (!this.pulse[0].on) this.pulse[0].len = 0;
        if (!this.pulse[1].on) this.pulse[1].len = 0;
        if (!t.on) t.len = 0;
        if (!n.on) n.len = 0;
        break;
    }
  }

  /** 1/4 \u30D5\u30EC\u30FC\u30E0\u3002\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u3068\u4E09\u89D2\u6CE2\u306E\u7DDA\u5F62\u30AB\u30A6\u30F3\u30BF\u3002\u534A\u5206\u3054\u3068\u306B\u9577\u3055\u30AB\u30A6\u30F3\u30BF */
  clockQuarter() {
    clockEnv(this.pulse[0].env); clockEnv(this.pulse[1].env); clockEnv(this.noise.env);
    const t = this.tri;
    if (t.linReload) t.lin = t.linLoad;
    else if (t.lin > 0) t.lin--;
    if (!t.halt) t.linReload = false;
    this.half = !this.half;
    if (this.half) {
      for (const p of this.pulse) if (!p.halt && p.len > 0) p.len--;
      if (!t.halt && t.len > 0) t.len--;
      if (!this.noise.halt && this.noise.len > 0) this.noise.len--;
    }
  }

  /** \u77E9\u5F62\u6CE2\u3092 n \u30AF\u30ED\u30C3\u30AF\u9032\u3081\u3066\u3001\u305D\u306E\u3042\u3044\u3060\u306E\u5024\u306E\u5408\u8A08\u3092\u8FD4\u3059 */
  runPulse(p, n) {
    // \u9ED9\u3089\u305B\u308B\u6761\u4EF6(\u5B9F\u6A5F\u3068\u540C\u3058)\u30028 \u3088\u308A\u5C0F\u3055\u3044\u30BF\u30A4\u30DE\u30FC\u3068\u3001\u30B9\u30A4\u30FC\u30D7\u306E\u5148\u304C\u6841\u3042\u3075\u308C\u3059\u308B\u3068\u304D
    const target = p.sweepNeg ? 0 : p.timer + (p.timer >> p.sweepShift);
    const muted = p.timer < 8 || target > 0x7ff || p.len === 0;
    const vol = muted ? 0 : envOut(p.env);
    const per = 2 * (p.timer + 1);
    let sum = 0;
    while (n >= p.count) {
      sum += (DUTY[p.duty][p.seq] ? vol : 0) * p.count;
      n -= p.count;
      p.seq = (p.seq + 1) & 7;
      p.count = per;
    }
    sum += (DUTY[p.duty][p.seq] ? vol : 0) * n;
    p.count -= n;
    return sum;
  }

  /** \u4E09\u89D2\u6CE2\u3002\u30AB\u30A6\u30F3\u30BF\u304C 0 \u306A\u3089\u6BB5\u306F\u9032\u307E\u305A\u3001\u3044\u307E\u306E\u5024\u3092\u51FA\u3057\u3064\u3065\u3051\u308B(\u5B9F\u6A5F\u3068\u540C\u3058) */
  runTri(n) {
    const t = this.tri;
    const go = t.lin > 0 && t.len > 0;
    const per = t.timer + 1;
    let sum = 0;
    if (!go) return TRI[t.seq] * n;
    while (n >= t.count) {
      sum += TRI[t.seq] * t.count;
      n -= t.count;
      t.seq = (t.seq + 1) & 31;
      t.count = per;
    }
    sum += TRI[t.seq] * n;
    t.count -= n;
    return sum;
  }

  /** \u30CE\u30A4\u30BA\u300215 \u30D3\u30C3\u30C8\u306E\u4E26\u3073\u3002\u77ED\u3044\u4E26\u3073\u306F 6 \u756A\u76EE\u306E\u30D3\u30C3\u30C8\u3067\u5E30\u3059 */
  runNoise(n) {
    const z = this.noise;
    const vol = z.len === 0 ? 0 : envOut(z.env);
    let sum = 0;
    while (n >= z.count) {
      sum += (z.shift & 1 ? 0 : vol) * z.count;
      n -= z.count;
      const fb = (z.shift & 1) ^ ((z.shift >> (z.short ? 6 : 1)) & 1);
      z.shift = (z.shift >> 1) | (fb << 14);
      z.count = z.period;
    }
    sum += (z.shift & 1 ? 0 : vol) * n;
    z.count -= n;
    return sum;
  }

  /** \u51FA\u53E3\u306E 1 \u30B5\u30F3\u30D7\u30EB\u30020 \u304B\u3089\u4E0A(\u5B9F\u6A5F\u306E DAC \u3068\u540C\u3058)\u3002\u76F4\u6D41\u306F\u5916\u3067\u629C\u304F */
  calc() {
    this.frac += this.step;
    const n = Math.floor(this.frac);
    this.frac -= n;
    this.quarter += n;
    if (this.quarter >= QUARTER) { this.quarter -= QUARTER; this.clockQuarter(); }
    if (n <= 0) return this.out || 0;
    const p1 = this.runPulse(this.pulse[0], n) / n;
    const p2 = this.runPulse(this.pulse[1], n) / n;
    const tr = this.runTri(n) / n;
    const no = this.runNoise(n) / n;
    // NESdev \u306E\u6DF7\u305C\u65B9\u30020 \u3067\u5272\u3089\u306A\u3044\u3088\u3046\u306B\u5206\u3051\u3066\u66F8\u304F
    const ps = p1 + p2;
    const pulseOut = ps > 0 ? 95.88 / (8128 / ps + 100) : 0;
    const tnd = tr / 8227 + no / 12241;
    const tndOut = tnd > 0 ? 159.79 / (1 / tnd + 100) : 0;
    this.out = pulseOut + tndOut;
    return this.out;
  }
}

/** \u58F0\u306E\u7A2E\u985E\u3068\u3001\u30C1\u30C3\u30D7\u306E\u4E2D\u306E\u756A\u53F7\u3002\u77E9\u5F62\u6CE2 2 \u672C\u30FB\u4E09\u89D2\u6CE2 1 \u672C\u30FB\u30CE\u30A4\u30BA 1 \u672C */
const SLOTS = { pulse: [0, 1], triangle: [2], noise: [3] };

/**
 * \u884C\u304D\u5148 1 \u3064\u3076\u3093\u306E\u51E6\u7406\u5668\u3002\u4E2D\u306B\u30C1\u30C3\u30D7\u3092\u4F55\u500B\u3067\u3082\u6301\u3064(sound/ay.js \u3068\u540C\u3058\u8003\u3048\u65B9)\u3002
 * \u58F0\u304C\u8DB3\u308A\u306A\u3051\u308C\u3070\u30C1\u30C3\u30D7\u3092\u8DB3\u3059\u3002\u5B9F\u6A5F\u3067\u4F55\u53F0\u8981\u308B\u304B\u306F\u3001\u66F8\u304D\u51FA\u3057\u306E\u3068\u304D\u306B\u898B\u308B\u3002
 */
class NesBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.pool = [];
    this.log = !!q.log;
    this.logNow = 0;
    this.dcX = 0;
    this.dcY = 0;
    this.dcR = 1 - 2 * Math.PI * 20 / sampleRate;   // 20Hz
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(sampleRate * 0.01));
    this.port.onmessage = (e) => {
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  grow() {
    const c = new APU(sampleRate);
    const chip = { c, log: null, v: [0, 1, 2, 3].map(() => ({ end: 0, vs: null, ps: null, ds: null })) };
    // \u8A18\u9332\u306F\u30C1\u30C3\u30D7\u3054\u3068\u306B\u5206\u3051\u308B(sound/ay.js \u3068\u540C\u3058)\u3002\u756A\u53F7\u306F $4000 \u304B\u3089\u306E\u5DEE
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    // 4 \u58F0\u3068\u3082\u4F7F\u3048\u308B\u3088\u3046\u306B\u3057\u3066\u3001\u30B9\u30A4\u30FC\u30D7\u306F\u6B62\u3081\u3066\u304A\u304F(\u8CA0\u306E\u5411\u304D\u306B\u3059\u308B\u3068\u6841\u3042\u3075\u308C\u3067\u9ED9\u3089\u306A\u3044)
    c.writeReg(0x15, 0x0f);
    c.writeReg(0x01, 0x08);
    c.writeReg(0x05, 0x08);
    c.writeReg(0x00, 0x30);
    c.writeReg(0x04, 0x30);
    c.writeReg(0x08, 0x80);
    c.writeReg(0x0c, 0x30);
    this.pool.push(chip);
    return chip;
  }

  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) for (let s = 0; s < 4; s++) this.silence(chip, s);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  /** \u305D\u306E\u58F0\u3092\u9ED9\u3089\u305B\u308B */
  silence(chip, s) {
    const c = chip.c;
    const v = chip.v[s];
    v.end = 0; v.vs = null; v.ps = null; v.ds = null;
    if (s < 2) c.writeReg(s * 4, (c.reg[s * 4] & 0xc0) | 0x30);
    else if (s === 2) { c.writeReg(0x08, 0x80); c.writeReg(0x0b, c.reg[0x0b]); }
    else c.writeReg(0x0c, 0x30);
  }

  pick(kind, now) {
    const want = SLOTS[kind];
    for (const chip of this.pool) {
      for (const s of want) if (chip.v[s].end <= now) return { chip, s };
    }
    return { chip: this.grow(), s: want[0] };
  }

  /** \u77E9\u5F62\u6CE2\u306E\u30BF\u30A4\u30DE\u30FC\u3092\u66F8\u304F\u3002\u4E0A\u306E\u6841\u306F\u5909\u308F\u3063\u305F\u3068\u304D\u3060\u3051(\u66F8\u304F\u3068\u6CE2\u306E\u982D\u306B\u623B\u308B\u305F\u3081) */
  pulseTimer(c, s, t, force) {
    const lo = t & 0xff, hi = (t >> 8) & 7;
    if (force || c.reg[s * 4 + 2] !== lo) c.writeReg(s * 4 + 2, lo);
    if (force || (c.reg[s * 4 + 3] & 7) !== hi) c.writeReg(s * 4 + 3, 0xf8 | hi);
  }

  /** \u4E09\u89D2\u6CE2\u306E\u30BF\u30A4\u30DE\u30FC\u3092\u66F8\u304F */
  triTimer(c, t) {
    const lo = t & 0xff, hi = (t >> 8) & 7;
    if (c.reg[0x0a] !== lo) c.writeReg(0x0a, lo);
    if ((c.reg[0x0b] & 7) !== hi) c.writeReg(0x0b, 0xf8 | hi);
  }

  /** \u97F3\u91CF(\u3068\u5E45)\u3092\u66F8\u304F\u3002\u4E09\u89D2\u6CE2\u306F\u9CF4\u3089\u3059\u304B\u6B62\u3081\u308B\u304B\u3060\u3051 */
  level(c, s, vol, duty) {
    if (s < 2) {
      const val = ((duty & 3) << 6) | 0x30 | (vol & 15);
      if (c.reg[s * 4] !== val) c.writeReg(s * 4, val);
    } else if (s === 2) {
      // \u7DDA\u5F62\u30AB\u30A6\u30F3\u30BF\u3067\u6B62\u3081\u308B\u30020 \u3092\u8AAD\u307F\u8FBC\u307E\u305B\u308B\u3068\u3001\u6B21\u306E 1/4 \u30D5\u30EC\u30FC\u30E0\u3067\u6BB5\u304C\u6B62\u307E\u308B
      const val = vol > 0 ? 0xff : 0x80;
      if (c.reg[0x08] !== val) { c.writeReg(0x08, val); c.writeReg(0x0b, c.reg[0x0b]); }
    } else {
      const val = 0x30 | (vol & 15);
      if (c.reg[0x0c] !== val) c.writeReg(0x0c, val);
    }
  }

  start(ev, now) {
    const { chip, s } = this.pick(ev.ch, now);
    const c = chip.c;
    if (chip.v[s].end > 0) this.silence(chip, s);
    const v = chip.v[s];
    if (s < 2) {
      this.level(c, s, ev.v, ev.duty);
      c.writeReg(s * 4 + 1, 0x08);
      this.pulseTimer(c, s, ev.p, true);
    } else if (s === 2) {
      c.writeReg(0x0a, ev.p & 0xff);
      c.writeReg(0x08, ev.v > 0 ? 0xff : 0x80);
      c.writeReg(0x0b, 0xf8 | ((ev.p >> 8) & 7));
    } else {
      this.level(c, s, ev.v, 0);
      c.writeReg(0x0e, (ev.short ? 0x80 : 0) | (ev.p & 15));
      c.writeReg(0x0f, 0xf8);
    }
    v.end = ev.t + ev.dur;
    v.duty = ev.duty | 0;
    v.short = !!ev.short;
    v.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
    v.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
    v.ds = ev.ds && ev.ds.length ? { list: ev.ds, at: 0 } : null;
    v.vol = ev.v;
  }

  step(now) {
    for (const chip of this.pool) {
      const c = chip.c;
      for (let s = 0; s < 4; s++) {
        const v = chip.v[s];
        if (v.end <= 0) continue;
        if (v.end <= now) { this.silence(chip, s); continue; }
        let lv = false;
        if (v.ds) {
          const f = v.ds;
          while (f.at < f.list.length && f.list[f.at][0] <= now) { v.duty = f.list[f.at++][1]; lv = true; }
          if (f.at >= f.list.length) v.ds = null;
        }
        if (v.vs) {
          const f = v.vs;
          while (f.at < f.list.length && f.list[f.at][0] <= now) { v.vol = f.list[f.at++][1]; lv = true; }
          if (f.at >= f.list.length) v.vs = null;
        }
        if (lv) this.level(c, s, v.vol, v.duty);
        if (v.ps) {
          const f = v.ps;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const p = f.list[f.at++][1];
            if (s < 2) this.pulseTimer(c, s, p, false);
            else if (s === 2) this.triTimer(c, p);
            else c.writeReg(0x0e, (v.short ? 0x80 : 0) | (p & 15));
          }
          if (f.at >= f.list.length) v.ps = null;
        }
      }
    }
  }

  live(chip) {
    return chip.v[0].end > 0 || chip.v[1].end > 0 || chip.v[2].end > 0 || chip.v[3].end > 0;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    if (!this.pool.some((c) => this.live(c)) && next >= base + n / sampleRate
      && Math.abs(this.dcY) < 1e-6) {
      out.fill(0);
      // dcX \u306F\u6B8B\u3059\u3002\u6B62\u3081\u305F\u4E09\u89D2\u6CE2\u304C\u4FDD\u3063\u3066\u3044\u308B\u5024\u3067\u3001\u9CF4\u3089\u3057\u76F4\u3057\u305F\u3068\u304D\u306E\u51FA\u767A\u70B9\u306B\u306A\u308B
      this.dcY = 0;
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.log) this.logNow = now;
      this.step(now);
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        this.start(this.events[this.at++], now);
      }
      // \u9ED9\u3063\u3066\u3044\u308B\u30C1\u30C3\u30D7\u3082\u56DE\u3059\u3002\u4E09\u89D2\u6CE2\u306F\u6B62\u3081\u305F\u4F4D\u7F6E\u306E\u5024\u3092\u51FA\u3057\u3064\u3065\u3051\u308B(\u5B9F\u6A5F\u3068\u540C\u3058)\u3002
      // \u56DE\u3055\u305A\u306B 0 \u306B\u3059\u308B\u3068\u3001\u6B62\u3081\u305F\u77AC\u9593\u3068\u9CF4\u3089\u3057\u76F4\u3057\u305F\u77AC\u9593\u306B\u51FA\u53E3\u304C\u8DF3\u3093\u3067\u30D7\u30C1\u30C3\u3068\u9CF4\u308B\u3002
      // \u524D\u306F\u305D\u3046\u3057\u3066\u3044\u3066\u3001q7 \u3067\u523B\u3080\u4E09\u89D2\u6CE2\u306E\u30D9\u30FC\u30B9\u304C\u62CD\u3054\u3068\u306B\u9CF4\u3063\u3066\u3044\u305F(2026-10-07)\u3002
      // \u91CD\u3055\u306F\u3001\u4E0A\u306E\u300C\u4F55\u3082\u9CF4\u3063\u3066\u3044\u306A\u3044\u533A\u5207\u308A\u306F\u56DE\u3055\u306A\u3044\u300D\u3067\u6291\u3048\u3066\u3044\u308B
      let raw = 0;
      for (const chip of this.pool) raw += chip.c.calc();
      const x = raw * OUT_GAIN;
      const y = x - this.dcX + this.dcR * this.dcY;
      this.dcX = x;
      this.dcY = y;
      let v = y;
      if (this.cutAt >= 0) {
        v *= Math.max(0, 1 - this.cutAt / this.cutLen);
        this.cutAt++;
        if (this.cutAt > this.cutLen) { this.cutAt = this.cutLen; v = 0; }
      }
      out[i] = v;
    }
    if (this.log) {
      for (let k = 0; k < this.pool.length; k++) {
        const chip = this.pool[k];
        if (!chip.log.length) continue;
        this.port.postMessage({ regs: chip.log, chip: k, type: 0 });
        chip.log = [];
      }
    }
    return true;
  }
}
registerProcessor('mmsxx-nes', NesBank);
`;

  // engine/sound/fds.js
  var FDS_CLOCK = 1789773;
  var FDS_LEN = 64;
  var FDS_OUT_PEAK = 2.4 * (95.88 / (8128 / 15 + 100)) * 1.876;
  function fdsPitch(freq) {
    if (!(freq > 0)) return 0;
    return Math.max(1, Math.min(4095, Math.round(freq * 16 * 64 * 4096 / FDS_CLOCK)));
  }
  var fdsWave = (list) => Array.from(list, (v) => Math.round((Math.max(-1, Math.min(1, v)) + 1) / 2 * 63));
  var build3 = (fn) => fdsWave(Array.from({ length: FDS_LEN }, (_, i) => fn(i / FDS_LEN)));
  var FDS_MOD_TABLES = {
    // 0 から上がって +16、下がって −16、戻って 0
    tri: [...Array(8).fill(2), ...Array(16).fill(6), ...Array(8).fill(2)],
    // +16 と −16 を行き来する段
    step: [4, 3, 3, 3, 3, ...Array(11).fill(0), 4, 5, 5, 5, 5, ...Array(11).fill(0)]
  };
  var MOD_PEAK = 16;
  var fdsModGain = (depth) => Math.max(0, Math.min(63, Math.round(depth * 1024 / MOD_PEAK)));
  var STEP = build3((p) => Math.round(Math.sin(2 * Math.PI * p) * 8) / 8);
  var SPIKE = build3((p) => p < 0.12 ? Math.sin(Math.PI * p / 0.12) : -0.18);
  var HALF = build3((p) => {
    const v = Math.sin(2 * Math.PI * p);
    return (v > 0 ? v : 0) * 2 - 0.6;
  });
  var RAMP = build3((p) => Math.round((1 - 2 * p) * 6) / 6);
  var ODD = build3((p) => p < 0.35 ? Math.sin(Math.PI * p / 0.35) : -0.7 * Math.sin(Math.PI * (p - 0.35) / 0.65));
  var TWIN = build3((p) => Math.sin(2 * Math.PI * p) * 0.5 + Math.sin(4 * Math.PI * p) * 0.5);
  var LIKE_ZLD = build3((p) => (Math.sin(2 * Math.PI * p) + 0.12 * Math.sin(4 * Math.PI * p) + 0.28 * Math.sin(6 * Math.PI * p) + 0.16 * Math.sin(10 * Math.PI * p) + 0.09 * Math.sin(14 * Math.PI * p)) / 1.65);
  var FDS_PRESETS = [
    ["fdsStep", { wave: STEP }, "lead", 'Stepped wavetable on the disk system chip: the shape that reads as "wavetable chip" more than any other.'],
    ["fdsSpike", { wave: SPIKE }, "lead", "Narrow spike in the disk system wavetable: bright and thin."],
    ["fdsHalf", { wave: HALF }, "bass", "Half-wave rectified shape on the disk system chip: fat and round."],
    ["fdsRamp", { wave: RAMP }, "lead", "Stepped ramp on the disk system chip. Buzzy, close to a saw."],
    ["fdsOdd", { wave: ODD }, "lead", "Lopsided shape on the disk system chip. Reads as reedy."],
    ["fdsTwin", { wave: TWIN }, "lead", "Two humps per cycle on the disk system chip, so it sounds an octave brighter than it is."],
    [
      "fdsVibe",
      { wave: HALF, mod: { ratio: 0.035, depth: 0.03, table: "tri" } },
      "lead",
      "The disk system modulator run slowly, used as vibrato rather than as timbre."
    ],
    [
      "fdsBell",
      { wave: STEP, mod: { ratio: 1, depth: 0.6, table: "tri" } },
      "counter",
      "The disk system modulator at the note\u2019s own rate and deep: sidebands grow and it turns metallic."
    ],
    [
      "fdsMetal",
      { wave: TWIN, mod: { ratio: 2.51, depth: 0.9, table: "step" } },
      "perc",
      "An awkward modulator ratio with a stepped table, deep enough that the pitch turns into a clang."
    ],
    [
      "fdsWobble",
      { wave: ODD, mod: { ratio: 0.25, depth: 0.35, table: "step" } },
      "counter",
      "The modulator at a quarter of the note\u2019s rate, deep: the pitch audibly swings."
    ],
    [
      "fdsGrowl",
      { wave: RAMP, mod: { ratio: 0.5, depth: 0.7, table: "step" } },
      "bass",
      "The modulator at half the note\u2019s rate, deep enough to roughen the tone into a growl."
    ],
    [
      "fdsLikeZld",
      { wave: LIKE_ZLD, mod: { ratio: 0.015, depth: 0.025, table: "tri" } },
      "lead",
      "A hollow, slightly asymmetric wavetable with a shallow vibrato: the overworld-lead sound of the disk system, drawn rather than lifted.",
      ["homage"]
    ]
  ];
  function registerFDSPresets() {
    for (const [name, params, role, note, tags] of FDS_PRESETS) {
      try {
        registerFDS(name, params, { role, note, tags });
      } catch (e) {
      }
    }
  }
  var FDS_CODE = `
const CLK = ${FDS_CLOCK};
const OUT_PEAK = ${FDS_OUT_PEAK};
const MOD_STEP = [0, 1, 2, 4, 0, -4, -2, -1];

/**
 * \u30C1\u30C3\u30D7 1 \u500B\u300216 \u30AF\u30ED\u30C3\u30AF\u3054\u3068\u306B\u6CE2\u5F62\u3068\u5909\u8ABF\u306E\u8F2A\u3092\u9032\u3081\u308B\u3002
 * \u51FA\u53E3\u306E\u30B5\u30F3\u30D7\u30EB\u306E\u3042\u3044\u3060\u306B\u6765\u305F\u523B\u307F\u306E\u5024\u3092\u5E73\u5747\u3057\u30012kHz \u306E\u4F4E\u57DF\u901A\u904E\u3092\u901A\u3059
 * (\u30A2\u30C0\u30D7\u30BF\u306E\u51FA\u53E3\u306B\u3042\u308B\u3002\u8CC7\u6599\u306E\u300C\u304A\u3088\u305D 1 \u6B21\u306E 2kHz\u300D)\u3002
 */
class FDS {
  constructor(rate) {
    this.step = CLK / 16 / rate;   // \u51FA\u53E3 1 \u30B5\u30F3\u30D7\u30EB\u3042\u305F\u308A\u306E\u523B\u307F\u306E\u6570
    this.frac = 0;
    this.reg = new Uint8Array(0x80);
    this.wave = new Uint8Array(64);
    this.mod = new Int8Array(32);
    this.waveAcc = 0;        // 24 \u30D3\u30C3\u30C8\u3002\u4E0A\u306E 6 \u30D3\u30C3\u30C8\u304C\u6CE2\u5F62\u306E\u4F4D\u7F6E
    this.modAcc = 0;         // 12 \u30D3\u30C3\u30C8\u3002\u6841\u304C\u3042\u3075\u308C\u305F\u3089\u8868\u3092 1 \u3064\u9032\u3081\u308B
    this.modPos = 0;         // 64 \u306E\u4F4D\u7F6E(\u8868\u306F 2 \u3064\u305A\u3064\u540C\u3058\u5024\u3092\u4F7F\u3046)
    this.counter = 0;        // 7 \u30D3\u30C3\u30C8\u306E\u7B26\u53F7\u3064\u304D
    this.pitch = 0;
    this.modFreq = 0;
    this.gain = 0;           // \u3044\u307E\u51FA\u3057\u3066\u3044\u308B\u97F3\u91CF(0\u301C32 \u3067\u982D\u6253\u3061)
    this.pend = -1;          // \u6CE2\u5F62\u306E\u4F4D\u7F6E\u304C 0 \u306B\u623B\u3063\u305F\u3068\u304D\u306B\u5165\u308C\u308B\u97F3\u91CF
    this.modGain = 0;
    this.halt = true;        // $4083 bit7\u3002\u6CE2\u5F62\u3092\u6B62\u3081\u3066\u982D\u306B\u623B\u3059
    this.modHalt = true;     // $4087 bit7\u3002\u5909\u8ABF\u3092\u6B62\u3081\u3066\u3001\u8868\u3092\u66F8\u3051\u308B\u3088\u3046\u306B\u3059\u308B
    this.write = false;      // $4089 bit7\u3002\u6CE2\u5F62\u30E1\u30E2\u30EA\u3092\u66F8\u3051\u308B(\u51FA\u53E3\u306F\u6B62\u307E\u308B)
    this.master = 1;
    this.held = 0;
    const cut = 2000;
    this.lpA = 1 - Math.exp(-2 * Math.PI * cut / rate);
    this.lp = 0;
  }

  writeReg(r, v) {
    if (r >= 0x40) {
      if (this.write) this.wave[r - 0x40] = v & 63;
      return;
    }
    this.reg[r] = v;
    switch (r) {
      case 0x20: {   // $4080 \u97F3\u91CF\u3002\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u3092\u5207\u3063\u3066\u3001\u5024\u3092\u305D\u306E\u307E\u307E\u4F7F\u3046
        const g = v & 63;
        if (g === 0) { this.gain = 0; this.pend = -1; } else this.pend = g;
        break;
      }
      case 0x22: this.pitch = (this.pitch & 0xf00) | v; break;
      case 0x23:
        this.pitch = (this.pitch & 0xff) | ((v & 15) << 8);
        this.halt = !!(v & 0x80);
        if (this.halt) this.waveAcc = 0;
        break;
      case 0x24: this.modGain = v & 63; break;
      case 0x25: this.counter = ((v & 0x7f) ^ 0x40) - 0x40; break;
      case 0x26: this.modFreq = (this.modFreq & 0xf00) | v; break;
      case 0x27:
        this.modFreq = (this.modFreq & 0xff) | ((v & 15) << 8);
        this.modHalt = !!(v & 0x80);
        if (this.modHalt) this.modAcc = 0;
        break;
      case 0x28:
        // \u6B62\u3081\u3066\u3044\u308B\u3042\u3044\u3060\u3060\u3051\u66F8\u3051\u308B\u3002\u3044\u307E\u306E\u4F4D\u7F6E\u306B\u5165\u308C\u3066\u3001\u6B21\u3078\u9032\u3081\u308B
        if (this.modHalt) {
          this.mod[(this.modPos >> 1) & 31] = v & 7;
          this.modPos = (this.modPos + 2) & 63;
        }
        break;
      case 0x29:
        this.write = !!(v & 0x80);
        if (this.write) this.held = this.wave[(this.waveAcc >>> 18) & 63];
        this.master = [1, 2 / 3, 2 / 4, 2 / 5][v & 3];
        break;
    }
  }

  /** 16 \u30AF\u30ED\u30C3\u30AF\u3076\u3093\u9032\u3081\u308B\u3002\u305D\u306E\u3068\u304D\u306E\u51FA\u53E3\u306E\u5024(0\u301C1)\u3092\u8FD4\u3059 */
  tick() {
    // \u5909\u8ABF\u3002\u6841\u304C\u3042\u3075\u308C\u305F\u3089\u3001\u8868\u306E\u5024\u3067\u30AB\u30A6\u30F3\u30BF\u3092\u52D5\u304B\u3059
    if (!this.modHalt && this.modFreq > 0) {
      this.modAcc += this.modFreq;
      while (this.modAcc >= 4096) {
        this.modAcc -= 4096;
        const m = this.mod[(this.modPos >> 1) & 31];
        if (m === 4) this.counter = 0;
        else this.counter = (((this.counter + MOD_STEP[m]) & 0x7f) ^ 0x40) - 0x40;
        this.modPos = (this.modPos + 1) & 63;
      }
    }
    if (!this.halt && !this.write && this.pitch > 0) {
      // \u8CC7\u6599\u306E\u5F0F\u305D\u306E\u307E\u307E\u3002\u6B63\u306E\u5074\u3060\u3051 6 \u30D3\u30C3\u30C8\u3078\u5207\u308A\u4E0A\u3052\u308B
      let temp = this.counter * this.modGain;
      if ((temp & 0x0f) && !(temp & 0x800)) temp += 0x20;
      temp += 0x400;
      temp = (temp >> 4) & 0xff;
      const wp = (this.pitch * temp) & 0xfffff;
      const before = this.waveAcc >>> 18;
      this.waveAcc = (this.waveAcc + wp) % 0x1000000;
      // \u97F3\u91CF\u306E\u66F8\u304D\u63DB\u3048\u306F\u3001\u6CE2\u5F62\u306E\u4F4D\u7F6E\u304C 0 \u306B\u623B\u3063\u305F\u3068\u3053\u308D\u3067\u52B9\u304F
      if (this.pend >= 0 && (this.waveAcc >>> 18) < before) { this.gain = this.pend; this.pend = -1; }
    } else if (this.pend >= 0) {
      this.gain = this.pend; this.pend = -1;
    }
    const w = this.write ? this.held : this.wave[(this.waveAcc >>> 18) & 63];
    return w / 63 * Math.min(32, this.gain) / 32 * this.master;
  }

  /** \u51FA\u53E3\u306E 1 \u30B5\u30F3\u30D7\u30EB\u30020 \u304B\u3089\u4E0A\u3002\u76F4\u6D41\u306F\u5916\u3067\u629C\u304F */
  calc() {
    this.frac += this.step;
    const n = Math.floor(this.frac);
    this.frac -= n;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += this.tick();
    const x = n > 0 ? sum / n * OUT_PEAK : this.lp;
    this.lp += this.lpA * (x - this.lp);
    return this.lp;
  }
}

/**
 * \u884C\u304D\u5148 1 \u3064\u3076\u3093\u306E\u51E6\u7406\u5668\u3002FDS \u306F 1 \u58F0\u306A\u306E\u3067\u3001\u91CD\u306A\u3063\u305F\u97F3\u7B26\u3054\u3068\u306B\u30C1\u30C3\u30D7\u3092\u8DB3\u3059\u3002
 */
class FdsBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.pool = [];
    this.log = !!q.log;
    this.logNow = 0;
    this.dcX = 0;
    this.dcY = 0;
    this.dcR = 1 - 2 * Math.PI * 20 / sampleRate;   // 20Hz
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(sampleRate * 0.01));
    this.port.onmessage = (e) => {
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  grow() {
    const c = new FDS(sampleRate);
    const chip = { c, log: null, end: 0, wave: null, mod: null, ratio: 0, vs: null, ps: null };
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    c.writeReg(0x29, 0x00);
    c.writeReg(0x20, 0x80);
    c.writeReg(0x24, 0x80);
    c.writeReg(0x27, 0x80);
    this.pool.push(chip);
    return chip;
  }

  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) this.silence(chip);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  silence(chip) {
    chip.end = 0; chip.vs = null; chip.ps = null;
    chip.c.writeReg(0x20, 0x80);
  }

  pick(now) {
    for (const chip of this.pool) if (chip.end <= now) return chip;
    return this.grow();
  }

  /** \u5468\u671F\u3068\u3001\u305D\u308C\u306B\u4ED8\u3044\u3066\u304F\u308B\u5909\u8ABF\u306E\u901F\u3055\u3092\u66F8\u304F */
  pitch(chip, p, force) {
    const c = chip.c;
    if (force || c.reg[0x22] !== (p & 0xff)) c.writeReg(0x22, p & 0xff);
    if (force || (c.reg[0x23] & 15) !== ((p >> 8) & 15)) c.writeReg(0x23, (p >> 8) & 15);
    if (chip.mod) {
      const m = Math.max(0, Math.min(4095, Math.round(chip.ratio * p)));
      if (force || c.reg[0x26] !== (m & 0xff)) c.writeReg(0x26, m & 0xff);
      if (force || (c.reg[0x27] & 15) !== ((m >> 8) & 15)) c.writeReg(0x27, (m >> 8) & 15);
    }
  }

  start(ev, now) {
    const chip = this.pick(now);
    const c = chip.c;
    if (chip.end > 0) this.silence(chip);
    // \u6CE2\u5F62\u30E1\u30E2\u30EA\u3002\u524D\u3068\u540C\u3058\u306A\u3089\u66F8\u304D\u76F4\u3055\u306A\u3044
    if (chip.wave !== ev.wkey) {
      c.writeReg(0x29, 0x80);
      for (let i = 0; i < 64; i++) c.writeReg(0x40 + i, ev.wave[i]);
      c.writeReg(0x29, 0x00);
      chip.wave = ev.wkey;
    }
    // \u5909\u8ABF\u3002\u6B62\u3081\u3066\u8868\u3092\u66F8\u304D\u3001\u30AB\u30A6\u30F3\u30BF\u3092 0 \u306B\u3057\u3066\u304B\u3089\u56DE\u3059
    chip.mod = ev.mod || null;
    chip.ratio = ev.mod ? ev.mod.ratio : 0;
    c.writeReg(0x27, 0x80);
    if (ev.mod) {
      for (let i = 0; i < 32; i++) c.writeReg(0x28, ev.mod.table[i]);
      c.writeReg(0x25, 0);
      c.writeReg(0x24, 0x80 | ev.mod.gain);
    } else {
      c.writeReg(0x24, 0x80);
    }
    c.writeReg(0x20, 0x80 | (ev.v & 63));
    // \u9CF4\u3089\u3057\u306F\u3058\u3081\u306F\u6CE2\u5F62\u306E\u982D\u304B\u3089(bit7 \u3092\u7ACB\u3066\u3066\u623B\u3057\u3001\u3059\u3050\u4E0B\u308D\u3059)
    c.writeReg(0x23, 0x80 | ((ev.p >> 8) & 15));
    this.pitch(chip, ev.p, true);
    chip.end = ev.t + ev.dur;
    chip.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
    chip.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
  }

  step(now) {
    for (const chip of this.pool) {
      if (chip.end <= 0) continue;
      if (chip.end <= now) { this.silence(chip); continue; }
      const c = chip.c;
      if (chip.vs) {
        const f = chip.vs;
        while (f.at < f.list.length && f.list[f.at][0] <= now) c.writeReg(0x20, 0x80 | (f.list[f.at++][1] & 63));
        if (f.at >= f.list.length) chip.vs = null;
      }
      if (chip.ps) {
        const f = chip.ps;
        while (f.at < f.list.length && f.list[f.at][0] <= now) this.pitch(chip, f.list[f.at++][1], false);
        if (f.at >= f.list.length) chip.ps = null;
      }
    }
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    if (!this.pool.some((c) => c.end > 0) && next >= base + n / sampleRate
      && Math.abs(this.dcY) < 1e-6) {
      out.fill(0);
      this.dcX = 0; this.dcY = 0;
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.log) this.logNow = now;
      this.step(now);
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        this.start(this.events[this.at++], now);
      }
      let raw = 0;
      for (const chip of this.pool) if (chip.end > 0) raw += chip.c.calc();
      const y = raw - this.dcX + this.dcR * this.dcY;
      this.dcX = raw;
      this.dcY = y;
      let v = y;
      if (this.cutAt >= 0) {
        v *= Math.max(0, 1 - this.cutAt / this.cutLen);
        this.cutAt++;
        if (this.cutAt > this.cutLen) { this.cutAt = this.cutLen; v = 0; }
      }
      out[i] = v;
    }
    if (this.log) {
      for (let k = 0; k < this.pool.length; k++) {
        const chip = this.pool[k];
        if (!chip.log.length) continue;
        this.port.postMessage({ regs: chip.log, chip: k, type: 0 });
        chip.log = [];
      }
    }
    return true;
  }
}
registerProcessor('mmsxx-fds', FdsBank);
`;

  // engine/sound/scc.js
  var SCC_CLOCK = 3579545;
  var SCC_OUT_GAIN = 0.1404;
  function sccPeriod(freq) {
    if (!(freq > 0)) return 4095;
    return Math.max(9, Math.min(4095, Math.round(SCC_CLOCK / (32 * freq) - 1)));
  }
  var sccWave = (list) => Array.from(list, (v) => Math.max(-128, Math.min(127, Math.round(v * 127))));
  var SCC_PRESETS = [
    [
      "sccSquare",
      Array.from({ length: 32 }, (_, i) => i < 16 ? 1 : -1),
      "lead",
      "A 50% square on the SCC chip itself. The basic shape for porting a pulse part from another chip."
    ],
    [
      "sccTriangle",
      Array.from({ length: 32 }, (_, i) => i < 16 ? -1 + i / 7.5 : 1 - (i - 16) / 7.5),
      "bass",
      "A triangle on the SCC chip. The basic shape for porting a bass from another chip."
    ],
    [
      "sccSaw",
      WT_RAMP,
      "lead",
      "A sawtooth on the SCC chip. Bright and buzzy."
    ],
    [
      "sccSine",
      WT_SINE,
      "chord",
      "A sine on the SCC chip: thirty-two eight-bit samples, so the steps all but disappear."
    ]
  ];
  function registerSCCPresets() {
    for (const [name, wave, role, note] of SCC_PRESETS) {
      try {
        registerSCC(name, { wave: sccWave(wave) }, { role, note });
      } catch (e) {
      }
    }
  }
  var SCC_CODE = `
const CLK = ${SCC_CLOCK};
const OUT_GAIN = ${SCC_OUT_GAIN};

/**
 * \u30C1\u30C3\u30D7 1 \u500B\u3002\u51FA\u53E3\u306E\u30B5\u30F3\u30D7\u30EB\u3054\u3068\u306B\u30AF\u30ED\u30C3\u30AF\u3092\u6570\u3048\u3066\u9032\u3081\u3001\u305D\u306E\u3042\u3044\u3060\u306E\u5024\u3092\u5E73\u5747\u3057\u3066\u304B\u3089
 * \u6DF7\u305C\u308B(\u70B9\u3067\u62FE\u3046\u3068\u9AD8\u3044\u97F3\u3067\u6298\u308A\u8FD4\u3057\u304C\u51FA\u308B\u305F\u3081)\u3002
 */
class SCC {
  constructor(rate) {
    this.step = CLK / rate;
    this.frac = 0;
    this.reg = new Uint8Array(0xb0);
    this.ram = new Int8Array(160);
    this.period = new Uint16Array(5);
    this.count = new Float64Array(5).fill(1);
    this.pos = new Uint8Array(5);
    this.vol = new Uint8Array(5);
    this.on = 0;
  }

  writeReg(r, v) {
    if (r >= 0xb0) return;
    this.reg[r] = v;
    if (r < 0xa0) { this.ram[r] = (v << 24) >> 24; return; }
    if (r < 0xaa) {
      const c = (r - 0xa0) >> 1;
      this.period[c] = ((this.reg[0xa1 + c * 2] & 15) << 8) | this.reg[0xa0 + c * 2];
      return;
    }
    if (r < 0xaf) { this.vol[r - 0xaa] = v & 15; return; }
    this.on = v & 31;
  }

  /** \u51FA\u53E3\u306E 1 \u30B5\u30F3\u30D7\u30EB(\u304A\u3088\u305D -1..1) */
  calc() {
    this.frac += this.step;
    const n = Math.floor(this.frac);
    this.frac -= n;
    if (n <= 0) return this.out || 0;
    let mix = 0;
    for (let c = 0; c < 5; c++) {
      if (!(this.on & (1 << c)) || this.vol[c] === 0) continue;
      const base = c * 32;
      const per = this.period[c] + 1;
      let left = n, sum = 0;
      while (left >= this.count[c]) {
        sum += this.ram[base + this.pos[c]] * this.count[c];
        left -= this.count[c];
        this.pos[c] = (this.pos[c] + 1) & 31;
        this.count[c] = per;
      }
      sum += this.ram[base + this.pos[c]] * left;
      this.count[c] -= left;
      mix += sum / n * this.vol[c];
    }
    this.out = mix / (128 * 15) * OUT_GAIN;
    return this.out;
  }
}

/**
 * \u884C\u304D\u5148 1 \u3064\u3076\u3093\u306E\u51E6\u7406\u5668\u3002\u4E2D\u306B\u30C1\u30C3\u30D7\u3092\u4F55\u500B\u3067\u3082\u6301\u3064(sound/ay.js \u3068\u540C\u3058\u8003\u3048\u65B9)\u3002
 */
class SccBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.pool = [];
    this.log = !!q.log;
    this.logNow = 0;
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(sampleRate * 0.01));
    this.port.onmessage = (e) => {
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  grow() {
    const c = new SCC(sampleRate);
    const chip = { c, log: null, v: [0, 1, 2, 3, 4].map(() => ({ end: 0, vs: null, ps: null })),
      wave: [null, null, null, null, null] };
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    c.writeReg(0xaf, 0);
    this.pool.push(chip);
    return chip;
  }

  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) for (let s = 0; s < 5; s++) this.silence(chip, s);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  silence(chip, s) {
    const v = chip.v[s];
    v.end = 0; v.vs = null; v.ps = null;
    if (chip.c.reg[0xaa + s] !== 0) chip.c.writeReg(0xaa + s, 0);
    const on = chip.c.reg[0xaf] & ~(1 << s);
    if (chip.c.reg[0xaf] !== on) chip.c.writeReg(0xaf, on);
  }

  pick(wkey, now) {
    for (const chip of this.pool) {
      // \u540C\u3058\u6CE2\u5F62\u304C\u3059\u3067\u306B\u8F09\u3063\u3066\u3044\u308B\u58F0\u3092\u5148\u306B\u9078\u3076(\u66F8\u304D\u76F4\u3055\u305A\u306B\u6E08\u3080)
      for (let s = 0; s < 5; s++) if (chip.wave[s] === wkey && chip.v[s].end <= now) return { chip, s };
      for (let s = 0; s < 5; s++) if (chip.v[s].end <= now) return { chip, s };
    }
    return { chip: this.grow(), s: 0 };
  }

  start(ev, now) {
    const { chip, s } = this.pick(ev.wkey, now);
    const c = chip.c;
    if (chip.v[s].end > 0) this.silence(chip, s);
    if (chip.wave[s] !== ev.wkey) {
      for (let i = 0; i < 32; i++) c.writeReg(s * 32 + i, ev.wave[i] & 0xff);
      chip.wave[s] = ev.wkey;
    }
    c.writeReg(0xa0 + s * 2, ev.p & 0xff);
    c.writeReg(0xa1 + s * 2, (ev.p >> 8) & 15);
    c.writeReg(0xaa + s, ev.v & 15);
    c.writeReg(0xaf, c.reg[0xaf] | (1 << s));
    const v = chip.v[s];
    v.end = ev.t + ev.dur;
    v.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
    v.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
  }

  step(now) {
    for (const chip of this.pool) {
      const c = chip.c;
      for (let s = 0; s < 5; s++) {
        const v = chip.v[s];
        if (v.end <= 0) continue;
        if (v.end <= now) { this.silence(chip, s); continue; }
        if (v.vs) {
          const f = v.vs;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const val = f.list[f.at++][1] & 15;
            if (c.reg[0xaa + s] !== val) c.writeReg(0xaa + s, val);
          }
          if (f.at >= f.list.length) v.vs = null;
        }
        if (v.ps) {
          const f = v.ps;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const p = f.list[f.at++][1];
            if (c.reg[0xa0 + s * 2] !== (p & 0xff)) c.writeReg(0xa0 + s * 2, p & 0xff);
            if (c.reg[0xa1 + s * 2] !== ((p >> 8) & 15)) c.writeReg(0xa1 + s * 2, (p >> 8) & 15);
          }
          if (f.at >= f.list.length) v.ps = null;
        }
      }
    }
  }

  live(chip) {
    for (let s = 0; s < 5; s++) if (chip.v[s].end > 0) return true;
    return false;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    // \u6CE2\u5F62\u306F\u7B26\u53F7\u3064\u304D\u306A\u306E\u3067\u76F4\u6D41\u306F\u4E57\u3089\u306A\u3044\u3002\u9ED9\u3063\u3066\u3044\u308C\u3070\u56DE\u3055\u306A\u3044
    if (!this.pool.some((c) => this.live(c)) && next >= base + n / sampleRate) {
      out.fill(0);
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.log) this.logNow = now;
      this.step(now);
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        this.start(this.events[this.at++], now);
      }
      let v = 0;
      for (const chip of this.pool) if (this.live(chip)) v += chip.c.calc();
      if (this.cutAt >= 0) {
        v *= Math.max(0, 1 - this.cutAt / this.cutLen);
        this.cutAt++;
        if (this.cutAt > this.cutLen) { this.cutAt = this.cutLen; v = 0; }
      }
      out[i] = v;
    }
    if (this.log) {
      for (let k = 0; k < this.pool.length; k++) {
        const chip = this.pool[k];
        if (!chip.log.length) continue;
        this.port.postMessage({ regs: chip.log, chip: k, type: 0 });
        chip.log = [];
      }
    }
    return true;
  }
}
registerProcessor('mmsxx-scc', SccBank);
`;

  // engine/sound/pce.js
  var PCE_CLOCK = 3579545;
  var PCE_OUT_GAIN = 0.1393;
  function pcePeriod(freq) {
    if (!(freq > 0)) return 4095;
    return Math.max(1, Math.min(4095, Math.round(PCE_CLOCK / (32 * freq))));
  }
  function pceNoise(freq) {
    if (!(freq > 0)) return 0;
    const nf = Math.max(1, Math.min(31, Math.round(PCE_CLOCK / (64 * freq * 16))));
    return 31 - nf;
  }
  var pceWave = (list) => Array.from(list, (v) => Math.max(0, Math.min(31, Math.round((v + 1) / 2 * 31))));
  var PCE_PRESETS = [
    [
      "pceSquare",
      Array.from({ length: 32 }, (_, i) => i < 16 ? 1 : -1),
      "lead",
      "A 50% square on the PC Engine chip itself. The basic shape for porting a pulse part from another chip."
    ],
    [
      "pceTriangle",
      Array.from({ length: 32 }, (_, i) => i < 16 ? -1 + i / 7.5 : 1 - (i - 16) / 7.5),
      "bass",
      "A triangle on the PC Engine chip. Five bits leave a visible staircase; the basic shape for porting a bass."
    ],
    [
      "pceSaw",
      WT_RAMP,
      "lead",
      "A sawtooth on the PC Engine chip. The five-bit steps make it buzz."
    ],
    [
      "pceSine",
      WT_SINE,
      "chord",
      "A sine on the PC Engine chip: thirty-two five-bit samples, so the staircase is audible."
    ]
  ];
  function registerPCEPresets() {
    for (const [name, wave, role, note] of PCE_PRESETS) {
      try {
        registerPCE(name, { wave: pceWave(wave) }, { role, note });
      } catch (e) {
      }
    }
    try {
      registerPCE("pceNoise", { noise: true }, {
        role: "noise",
        note: "Noise from the PC Engine chip itself (voices 5 and 6 only). The note picks the noise clock; o4a lands mid-range, lower notes are coarser."
      });
    } catch (e) {
    }
  }
  var PCE_CODE = `
const CLK = ${PCE_CLOCK};
const OUT_GAIN = ${PCE_OUT_GAIN};

/** \u6E1B\u8870\u306E\u6BB5(1 \u6BB5 2^(-1/4))\u304B\u3089\u639B\u3051\u7387\u3078\u300231 \u6BB5\u4EE5\u4E0A\u306F\u7121\u97F3 */
const ATT = Array.from({ length: 32 }, (_, i) => (i >= 31 ? 0 : Math.pow(2, -i / 4)));

/**
 * \u30C1\u30C3\u30D7 1 \u500B\u3002\u51FA\u53E3\u306E\u30B5\u30F3\u30D7\u30EB\u3054\u3068\u306B\u30AF\u30ED\u30C3\u30AF\u3092\u6570\u3048\u3066\u9032\u3081\u3001\u305D\u306E\u3042\u3044\u3060\u306E\u5024\u3092\u5E73\u5747\u3057\u3066\u304B\u3089
 * \u6DF7\u305C\u308B(\u70B9\u3067\u62FE\u3046\u3068\u9AD8\u3044\u97F3\u3067\u6298\u308A\u8FD4\u3057\u304C\u51FA\u308B\u305F\u3081)\u3002
 */
class PSG {
  constructor(rate) {
    this.step = CLK / rate;
    this.frac = 0;
    this.sel = 0;
    this.master = 0xff;
    this.ch = Array.from({ length: 6 }, () => ({
      period: 0, ctrl: 0, bal: 0xff, wave: new Uint8Array(32), wpos: 0, pos: 0, count: 1,
      noise: 0, lfsr: 1, ncount: 1, nbit: 0,
    }));
    this.reg = new Uint8Array(16);
  }

  writeReg(r, v) {
    this.reg[r] = v;
    const c = this.ch[this.sel];
    switch (r) {
      case 0: this.sel = v & 7; if (this.sel > 5) this.sel = 5; break;
      case 1: this.master = v; break;
      case 2: c.period = (c.period & 0xf00) | v; break;
      case 3: c.period = (c.period & 0xff) | ((v & 15) << 8); break;
      case 4: {
        // \u9CF4\u3089\u3055\u305A DDA \u3060\u3051\u7ACB\u3066\u308B\u3068\u3001\u66F8\u304D\u8FBC\u307F\u306E\u4F4D\u7F6E\u304C 0 \u306B\u623B\u308B
        if ((v & 0xc0) === 0x40) c.wpos = 0;
        c.ctrl = v;
        break;
      }
      case 5: c.bal = v; break;
      case 6:
        // \u9CF4\u3089\u3057\u3066\u3044\u306A\u3044\u3068\u304D\u3060\u3051\u3001\u6CE2\u5F62\u30E1\u30E2\u30EA\u3078\u9806\u306B\u66F8\u304F
        if (!(c.ctrl & 0x80)) { c.wave[c.wpos] = v & 31; c.wpos = (c.wpos + 1) & 31; }
        break;
      case 7: if (this.sel >= 4) c.noise = v; break;
    }
  }

  /** \u305D\u306E\u58F0\u306E\u639B\u3051\u7387\u3002\u58F0\u306E\u97F3\u91CF\u30FB\u5DE6\u53F3\u30FB\u5168\u4F53\u306E\u6E1B\u8870\u3092\u5408\u308F\u305B\u308B(\u5DE6\u5074) */
  gain(c) {
    const al = c.ctrl & 31, lal = c.bal >> 4, lmal = this.master >> 4;
    if (!(c.ctrl & 0x80) || al === 0 || lal === 0 || lmal === 0) return 0;
    const att = (31 - al) + (15 - lal) * 2 + (15 - lmal) * 2;
    return ATT[Math.min(31, att)];
  }

  /** \u51FA\u53E3\u306E 1 \u30B5\u30F3\u30D7\u30EB(\u304A\u3088\u305D -1..1) */
  calc() {
    this.frac += this.step;
    const n = Math.floor(this.frac);
    this.frac -= n;
    if (n <= 0) return this.out || 0;
    let mix = 0;
    for (let i = 0; i < 6; i++) {
      const c = this.ch[i];
      const g = this.gain(c);
      if (g === 0) continue;
      let left = n, sum = 0;
      if (i >= 4 && (c.noise & 0x80)) {
        // \u30CE\u30A4\u30BA\u300231 \u306F\u6C7A\u307E\u3063\u3066\u3044\u306A\u3044\u306E\u3067\u300130 \u3068\u540C\u3058\u901F\u3055\u306B\u3059\u308B
        const nf = 31 - Math.min(30, c.noise & 31);
        const per = 64 * nf;
        while (left >= c.ncount) {
          sum += (c.nbit ? 31 : 0) * c.ncount;
          left -= c.ncount;
          // 18 \u30D3\u30C3\u30C8\u306E\u4E26\u3073\u3002\u30BF\u30C3\u30D7 0\u30FB1\u30FB11\u30FB12\u30FB17
          const b = c.lfsr;
          const fb = (b ^ (b >> 1) ^ (b >> 11) ^ (b >> 12) ^ (b >> 17)) & 1;
          c.lfsr = (b >> 1) | (fb << 17);
          c.nbit = c.lfsr & 1;
          c.ncount = per;
        }
        sum += (c.nbit ? 31 : 0) * left;
        c.ncount -= left;
      } else {
        const per = c.period === 0 ? 4096 : c.period;
        while (left >= c.count) {
          sum += c.wave[c.pos] * c.count;
          left -= c.count;
          c.pos = (c.pos + 1) & 31;
          c.count = per;
        }
        sum += c.wave[c.pos] * left;
        c.count -= left;
      }
      // \u4E2D\u5FC3\u3092 15.5 \u306B\u53D6\u308B(HuC6280A)\u3002\u521D\u671F\u306E\u30C1\u30C3\u30D7\u306E\u30DD\u30C3\u30D7\u30CE\u30A4\u30BA\u306F\u5199\u3055\u306A\u3044
      mix += (sum / n - 15.5) / 15.5 * g;
    }
    this.out = mix * OUT_GAIN;
    return this.out;
  }
}

/** \u58F0\u306E\u7A2E\u985E\u3002\u30CE\u30A4\u30BA\u306F 5 \u3068 6(\u756A\u53F7\u306F 4 \u3068 5)\u3060\u3051 */
const ANY = [0, 1, 2, 3, 4, 5];
const NOISE = [4, 5];

/**
 * \u884C\u304D\u5148 1 \u3064\u3076\u3093\u306E\u51E6\u7406\u5668\u3002\u4E2D\u306B\u30C1\u30C3\u30D7\u3092\u4F55\u500B\u3067\u3082\u6301\u3064(sound/ay.js \u3068\u540C\u3058\u8003\u3048\u65B9)\u3002
 */
class PceBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.pool = [];
    this.log = !!q.log;
    this.logNow = 0;
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(sampleRate * 0.01));
    this.port.onmessage = (e) => {
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  grow() {
    const c = new PSG(sampleRate);
    const chip = { c, log: null, v: ANY.map(() => ({ end: 0, vs: null, ps: null, noise: false })),
      wave: Array(6).fill(null) };
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    c.writeReg(1, 0xff);
    for (let s = 0; s < 6; s++) { c.writeReg(0, s); c.writeReg(4, 0); c.writeReg(5, 0xff); }
    this.pool.push(chip);
    return chip;
  }

  /** \u305D\u306E\u58F0\u3092\u9078\u3076(\u540C\u3058\u306A\u3089\u66F8\u304B\u306A\u3044) */
  sel(c, s) { if (c.sel !== s) c.writeReg(0, s); }

  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) for (let s = 0; s < 6; s++) this.silence(chip, s);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  silence(chip, s) {
    const v = chip.v[s];
    v.end = 0; v.vs = null; v.ps = null;
    this.sel(chip.c, s);
    chip.c.writeReg(4, 0);
    if (v.noise) { chip.c.writeReg(7, 0); v.noise = false; }
  }

  pick(ev, now) {
    const want = ev.noise ? NOISE : ANY;
    for (const chip of this.pool) {
      // \u540C\u3058\u6CE2\u5F62\u304C\u3059\u3067\u306B\u8F09\u3063\u3066\u3044\u308B\u58F0\u3092\u5148\u306B\u9078\u3076(\u66F8\u304D\u76F4\u3055\u305A\u306B\u6E08\u3080)
      if (!ev.noise) for (const s of want) if (chip.v[s].end <= now && chip.wave[s] === ev.wkey) return { chip, s };
      for (const s of want) if (chip.v[s].end <= now) return { chip, s };
    }
    return { chip: this.grow(), s: want[0] };
  }

  start(ev, now) {
    const { chip, s } = this.pick(ev, now);
    const c = chip.c;
    if (chip.v[s].end > 0) this.silence(chip, s);
    this.sel(c, s);
    const v = chip.v[s];
    if (ev.noise) {
      c.writeReg(7, 0x80 | (ev.p & 31));
      v.noise = true;
    } else {
      if (chip.wave[s] !== ev.wkey) {
        // \u66F8\u304D\u8FBC\u307F\u306E\u4F4D\u7F6E\u3092 0 \u306B\u623B\u3057\u3066\u300132 \u500B\u3092\u9806\u306B\u66F8\u304F
        c.writeReg(4, 0x40);
        c.writeReg(4, 0x00);
        for (let i = 0; i < 32; i++) c.writeReg(6, ev.wave[i]);
        chip.wave[s] = ev.wkey;
      }
      c.writeReg(2, ev.p & 0xff);
      c.writeReg(3, (ev.p >> 8) & 15);
    }
    c.writeReg(4, 0x80 | (ev.v & 31));
    v.end = ev.t + ev.dur;
    v.vs = ev.vs && ev.vs.length ? { list: ev.vs, at: 0 } : null;
    v.ps = ev.ps && ev.ps.length ? { list: ev.ps, at: 0 } : null;
  }

  step(now) {
    for (const chip of this.pool) {
      const c = chip.c;
      for (let s = 0; s < 6; s++) {
        const v = chip.v[s];
        if (v.end <= 0) continue;
        if (v.end <= now) { this.silence(chip, s); continue; }
        if (v.vs) {
          const f = v.vs;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            this.sel(c, s);
            c.writeReg(4, 0x80 | (f.list[f.at++][1] & 31));
          }
          if (f.at >= f.list.length) v.vs = null;
        }
        if (v.ps) {
          const f = v.ps;
          while (f.at < f.list.length && f.list[f.at][0] <= now) {
            const p = f.list[f.at++][1];
            this.sel(c, s);
            if (v.noise) c.writeReg(7, 0x80 | (p & 31));
            else { c.writeReg(2, p & 0xff); c.writeReg(3, (p >> 8) & 15); }
          }
          if (f.at >= f.list.length) v.ps = null;
        }
      }
    }
  }

  live(chip) {
    for (let s = 0; s < 6; s++) if (chip.v[s].end > 0) return true;
    return false;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    if (!this.pool.some((c) => this.live(c)) && next >= base + n / sampleRate) {
      out.fill(0);
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.log) this.logNow = now;
      this.step(now);
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        this.start(this.events[this.at++], now);
      }
      let v = 0;
      for (const chip of this.pool) if (this.live(chip)) v += chip.c.calc();
      if (this.cutAt >= 0) {
        v *= Math.max(0, 1 - this.cutAt / this.cutLen);
        this.cutAt++;
        if (this.cutAt > this.cutLen) { this.cutAt = this.cutLen; v = 0; }
      }
      out[i] = v;
    }
    if (this.log) {
      for (let k = 0; k < this.pool.length; k++) {
        const chip = this.pool[k];
        if (!chip.log.length) continue;
        this.port.postMessage({ regs: chip.log, chip: k, type: 0 });
        chip.log = [];
      }
    }
    return true;
  }
}
registerProcessor('mmsxx-pce', PceBank);
`;

  // engine/sound/opnarhythm.js
  var OPNA_CLOCK = 7987200;
  var OPNA_RHYTHM_OUT_GAIN = 0.36;
  var OPNA_RHYTHM_KEYS = ["bd", "sd", "top", "hh", "tom", "rim"];
  var OPNA_RHYTHM_PRESETS = [
    ["opnaKick", "bd", "The OPNA rhythm bass drum. A short thump that drops from about 125Hz to 50Hz."],
    ["opnaSnare", "sd", "The OPNA rhythm snare. A drum body at 200 and 306Hz, then noise takes over."],
    ["opnaCymbal", "top", "The OPNA rhythm top cymbal. The longest of the six, with a ring that stays to the end."],
    ["opnaHat", "hh", "The OPNA rhythm hi-hat. Short bright noise with a metallic ring."],
    ["opnaTom", "tom", "The OPNA rhythm tom. Falls from about 206Hz to 135Hz, with a little noise on the hit."],
    ["opnaRim", "rim", "The OPNA rhythm rim shot. A dry click under 30ms."]
  ];
  var REDRAWN = " Redrawn to sound like the YM2608 rhythm ROM, not the ROM data itself; played as 4-bit ADPCM-A at the chip's own rate. o4c plays it as recorded. The recording may be redrawn closer to the real chip later, so the sound can change.";
  function registerOPNARhythmPresets() {
    for (const [name, key2, note] of OPNA_RHYTHM_PRESETS) {
      try {
        registerOPNARhythm(name, { key: key2 }, { role: "perc", note: note + REDRAWN });
      } catch (e) {
      }
    }
  }
  var OPNA_RHYTHM_DATA = {
    bd: { rate: 18488.889, gain: 0.761, data: "777c72a13912a95189921078f820928c028a9921c81b92ca20d9089989e829c0091ad12ca31a99042bd130a84181822a070942a34aa35080328830873d85199209218029838a42900904a949d0209d911bb0889eb8889ca8be00bd819d80a918ca9908c929e90a81aa08c09b80a919b8ac11ca70c830920a34a0789339238268142841033144113154013105202314211422322327200320341122320242023419030911020aa88019c909b988cc88cb88cbabcaaccb9adc90bd99ab9ada9abbcbaadaabbcbbacbbdaaacaaacbbabda9bbbbcabbbbbbbabbaab99aaa99899a8880890880000001101111112112221222223232232234232422423423342342343233432342343234224234233332332333223322323222222322122212122111121111011010100010800080808808898888998989999999a999aa9aa9aaaaaaaaaaabaaaabaababaababaababaababaabaaabaaabaaaaaaaaaaa9aaa9aa9aa99a9a999a99999999989998998989889889888888888808808808080080008000000010001010101011011111111111111211211212121212122122122122212212222121112110110101000000080808888888888989899899998990" },
    sd: { rate: 18488.889, gain: 0.796, data: "777770880889009b988889bb00cb038cc91429b9141ad271a919a151911fa030901ab89a268a019929f051801bd151809b271a921b8339049f91288018bd921a921cb89b260da118810ba32bf1519808b8729a131ba802628c9229b831b078ca03189a910a819e158c821a11bd15199099238a139d8328da031002afb020128d932cc902538cb108022022da11a271da368a991429d818823be821899800189a933dd140ba23089da2729aa01220ab8339841dc0418a88122abeb1629a01bc139c0428b989c8730d9138ca340ab120912cd141ab022ab268da248a129a89c053099ab1288449c038a81ac372bb049b060c9339aaa052be030981ac130b832ab149fa440aa018810121db1318139fa02320cc039c070ca349a81aa2689809921b9348a09d8358a9120ba141cc161ab020a80440dd83289809810812ac82419c820a171ca229932ba10919f278b920a13eb458d828a030900bb148820c821a82ad378b8309828c8428908cb2729a9801209998019d061bb128830fc23289bc812340db01111bf8418918cb231922bc03af924189b835be8428a820ab8340b9539d9100129c8328aaba2719901ad80189240bc81cb373bc01090128ba23aa749d8118118b019851ca248909809a272cb130ca252ad912109a9139b140a899129950fb459b831bc0338cb120912afa2428a9a982620a9899450a980073ae8219920a030d9109248ca019922ac168cb248a80111cc018072bc0209008140cb1220ad0529b9021ad1619b880218909b558e821a840c932ab8330da150aa118908821998ae8209378da229a138b912109ba13350b860b961d9240900ab03090538ab9fb0720a88aa821130ba9ca440b92289a8119139e0429c801029a8218980080" },
    top: { rate: 18488.889, gain: 0.871, data: "77ff08f71aaaf1b1926c0a0c1cd18aa7749b288d481f3b34b9021dea0888019910882a19100b2188ac789a4b021a9481900c084a92b27e3b209a5880a28b219d39208b14b2f13b802d599008004c1b59810e281900a3b21b0088a7880d3a3a905c281c21c0119a40b4a094b0b79801901a812d129c2b799829859903ba5a3ab31a109881a1237e00082b90a1329c4f4a11b096b2809991970a90580a82b3c1298f4891a29108094bb480c80079a1118a839e20181fa42a0d2181a10b813d4b9395b0903c2811d003aa1f30098814d00801b0590a8020d19590910b11c048e2191c100090a780980880b408a2803bbc27a04a8b592bc4a2188818c490a2b592b1a28d878a5a0080a2809903a38f01923d805c10898a33a1a0b71c119b69008a0011d2810a5d3988a1108c122d8111c9692b1a830c2a3091c5099b7909108991820c8688828b8a17a89021c491c2958a1b130ab5d2019a3a820a91a017c09285b82a4b86a0a030ab3097c110b281a2c82000e38a40ba481d8599930a0a5928a6b2993d20b285c083990a42d1a21c009388a50c4c3a0939c309188a25d392a80080c4f102990810a111f8490999396b9384b2b100b813e2939a85d139a87a0809a38b418ab7080d01180a18a15a891034bb0813d0d3808499d21800b1a682d90831a8d40090a2a9178899050c88319a2819c8030f1011a888a7a8100b6a29b2196c2928a1b308d878890108a82a13e0193f003b93810b2b5b088690b23c2b1849a03989ab079923c97909089021d812a9c79008110b941f1893a03d028983d118a39b09491ad1791993980a2a6d020a1a02189886c208c299590b0580aa221d081985b8100949a3081c096d289288a2921ba07a18089a4b3b13f21a1c7999488808a6990029b580900a08298894a821e82a0680d01000ac41983a93f12909987a1984c00001a93b0102fa401c20d11881991201c0b7a3c2902a95b1b318b95008d289011a809868a1b4b2499b4982a185f113c8882a69a82895b091a408d3910b038b88709991158f0289290a82830f08210c883a21f108b35c80011d292a1913bb287a3e0100a83d2928b2a0384e89482c09102b3e109391b828010c00212f1a16a8983908b849092e3d28599a4b40b0882108c108a61b9a6199a113e1a58a18081a933f811a2b80025b18b241ac96c22a0a1b418b82a22a22fc5880a2a4a180a00b788a49098398811884f23f1a208901b83e58a91380b9184a28a3f0408aa03001cb304e4a89104b3e82009880d400c082819b854ba18218d280a3089b18079a8843bc020f3881b192109c182b70d00012c883918190b22997be48a3a1b2922f108a490b5a3c3b1101e01921ba39185aa1a252f81802c3a909590b112f1191b007a81a218a0181b97a2aa493f182a1a1000999699101c28a6a0a3091b841d8014b0813d2a83d8285bb284a89868b318d85b2891a50b00081908029b4c20a80494ab493af398a31f3a093a92186aa2913c9a693c11a1d32b8a0692bc2298a34d29820c91208f3880a183a9216d2b48a8192b6992a9319d8492c3a93a00924b915a91f39000a488c05b100a380c30ad287a929082c02b0025ac112a0d22a3c11d3d2098028a5c2a11b2b59921ac391028aa238d0b05a042d92a79981191b04b9195a1a3939f110c85981a096a1a129092a9291ac3825a8d23a2c1d4808a913c9385d0200bb5199b7890921a098419a191c12a2d907888a12913f088201f19021b839b339c08a46aa8101a13d02c50a99834bc21c68a93880388f282b09a50808983c489a3d239bc49288904b128d00b681c011a839d38192a0b5a192da6198a013c083b95b38ae221aa0211ad2099041ba1978ba790081901d0288b0359b8086b029884a199989700a8294d298a1142f90128bb682d3981a09498a132c9b54d81009080190e2280c2b7a2a9108010a0a0302f00119a190a4b4a4b0814af21b841c01b3b5b2a48982a2e0028a28091a1c7b14b8869a1a30c480c1101c88381b022f9130ba8700a0b03b34d90050b90113e000911b903d69911aa59090820989820904ab8521af02c699813d2b20a1181c0830b982058c979901091f380992889210a2f0409c81283e0189a4189f2280c19288812b9a610bd868888109a31a9939409c849a308903f49a3e13a92a58c00003e0100b12999907a18088914ab017a3e1809018093aa78b0298208b5aa22b9a7093b029c08294c21c28a07b849001e11a1d22909923ba080887a091a040bc37a018a92a15a99349d1929298209929f29a42d1191a3c0019e788a8282aa20293c2ba2a70d1082c292c28119a21e019a58b4a49a100a22e12c1880808830805ad14d198399090391d30a4a280f933c88c788092c101199a015ac4a2a3920d9493aa884a1909d6901a108895b0810a4b11a3bb360b3d10a3d3a0a2599009a5098893829f83a21a00a419c9860918e112c098223d1f118808a11292ae1a609880010a0ad2380ac50892b108a52aa8c68a00a70a8003ba834d00189a0211f102b2a28d1811a2c22f2099038920ac7b8101a9222e2b03b0201b8a27c9823b4d5b02a810b21b68a913a902086c2989b34a991325f9218a0219d1019aa40290e40b0839d220d18018c1201c1812f080019a40a914a2f2920ab690900009987899004d119089020b4e209003e01b33d081891b7a81a509a0290081ab117a0a812b408b94028bbb5498b4e1290080a13b5f181a18805b008948898a5b5a1d02081a181b33acc1350d8884a11a089278c902019c38199288b5a6a88291e012a008012f2a0802b58c0010982b8709891c31a1a941a3c99691893b3f2988a6901989482f01800a2a813ac1b619092d02a3b29b3799984a28a189480f1081891092b28d392189c051bf30b3896c1886b8002a2b8121f838b05980a02088d033c81c139803f804988b1041d1a18128ba88708991b7891a3b112e839913e1918290b120d1a3a7c2098813ba1f48090b5890180b027a9a211a8002ac2590d0113bc2b33bb003997900f2080b845c080802c1198139c8b2792f010080c398292c0001a882a97088983a988044db339a3f28932d08a1280f119499099383e010a2a011f0490883d1919081912ad318c9495989895b811b39307c8938088b12085d81b608892b28888ab270b2a295b0003d13f00092a80581b2d0118a929590a91828390d14ba2f292099598902903b849f14ab082314f818190a8a51898b9609082c2498e1800819895089a1040b887a89109a2593ca394d0093a028a8b054e1802980d38a823a0f2188b021a07b84b0b598811a20c4c3a9308883c1a2b14f3092b3e2982a1809029b0e34b8858b4d101b9222c9202e0038c1183e8000091a5a2a1a83b9297b3f289191011c13a8d2818a8509a5c12a8823ca381d19933cc68a1808081a13c85c19209104f11a83c12b915a80a21a912b79a87aa2083ba131d0822f1820bb60981b40a94918c038b3a8098214fb217a81a200b3a808068ae2039a08840c96a89409aa429a2a1801a7ac05908a122aa8249d149b01018f8380a9688b32abb7190c0308aa3290914ae0048d1821a1c28931a9b4b588d81110c1968a18a2a13b59d204d081190802d8831d8028190a01a06b3d8381c8915a21c821909e3a4a4a0981089a4a40989c5b290083a288be6981920c3a1d2905b110983d00c302d1019d388a21a030d800b123c58a958b28b0152a9e2002d1a2111d0a1096a9003a2bd12880191a878b99504c921982a9a24e59980011c8941880b1a111c82a582ad1a2380b21c4980bc2252da4981a3f2920a2bc5809a493c3890b12809a69190988048810aa68cb50a183b398f3891882c139f39a87918b32a80bc709098209a399006a2b8917ba3a2012e04b923bd4a0389d2802b2c488915bd3928b18488c13ab222d1a048ab01588904c0120f92840ba0112b8d12100a9aa370bb0528a098a5938c120bb149a3f409818aa1114e084a29d00100c3108e0209a31a5c209aa6a3a0001b281cd4a33d099480b8833b7b0b228b084a3a79a8196b118902bb4b2a698805b10d1011b82a48a99010798928803f893292f181929b395b3a8c3b31c08142d1c11189808a1799b04868c9132c8a2c500a88970a098283ba80022b9aa7292ae0212acc411a900b332cb90070bb41a0110c0a7098c31a4d2b31c195a801a208b3918e5a009103d91180b942c2920b1887c4c208990289b79829080a280091c41cb60b182939c3a2e8488a12082bd4a3b2a29928abb171d213e10a84a9291c50b2b3c699181900b2a1c52b0838a1d13c82929c2000aa1173d894a1b2090b72bb290599094a2990c139040d3a818aa1588c25b8892003f4a80108e29025d009289882c481999284a989412af029881a1102b2f88339f18059a09184a03e1913bc9303a09886919b4d3912e00819884c30c39a2a5a809400d01092a193aa38e00097a1a22b2b22f828918081b9055d0019190d3a20992003b1af200a02c968994ab378a9282a0a9398259b1e2599a112890e291010bb3313df8488a30bb60098b3200b00b2a7b2b8153db40902d2982880c113c894a2890b9580a10b682a980138e20c131f09023d0002f2b49809208a959088001aa210af498012b007c10a2a101990d5981b4909281f29198195992c389883b3e383e810819a3094e3ab24b82b2020d1b86908818010bb403c4c887991a1a31981e4a3d29800810b2a859902c395a8904f288190811980aa5198b859a48a949838b6c18002e18950ba580a102a9a78909010a2a3a3e288a19178d0118a0019118b5a9111aac27a2a01b3a40f3b1109a083903d3ab043d9b49790a9131b0c3011b2d1a3089a11b7d2809100900a8798908842f08101c193b3808aa680b4b06a803b8b258ab105b10b3b21a7b0048b4d002a9493f2880a3c59891189808818201f011aaa792a801a4c83180d30a11c8088284f291911c82a491ab49a079a13c228bc308a6988294b0a032ad5890a1c5a8183ac690a1094a08a492b28d4a208992921bda7810b1828e282ab349aa9279a822a83ba12a963e94910c3c1288b30c193a29f338d9210c1a38aa62b0b2140f0839a39888283e180018ab102ab232f0b278ad5098092909039bb7800b5a209882c12b5a99408b11c220f01a489b060a03e182b209a041a1f013a90a20008a98c620d829108b28b5958c804a2b81128c859c229898481c0895b1a4b11914f8038b2928a3998d397908921b3f2090a41abb78880000908938e829394d0189195a003c11f101b02912c1092e039a83090d1a4a1190194b00f926a1a0129a85b1a259b08292c9971a1b31be2180c2039c8129b2078a9140ca83598a12aa049d29140cc3008a1a509291e8858a00022d0911b2809192098f1021c849a1a81ab073ab26c190194d391c19490b2499a33baf391098838a1f5a088498a1008a0827a0819094b00a314f808194b3c2001f2b2912d83b4a1909104b9293ab3d2c790930a819a22f38a28a913f21a810013fa10209e0300c101b2a789a105aa831c2a218bc331dc310ab688a2b608a0823bb20c8583bc0212b0f2118c00b400a0d036aa88211a9a20582f88204b8904892c9a404b98a332d980284b2d1b32a0d18688908083a1d111a2b2f202e2a13a8ac5a3a82a1c402f01818098829009d16a1892c5a189082099c592a0901839c093982ac017880c02834bbc7893ba04a282e932a8a8318994bb415cd20209c03881c18190599b060a5c0108882c810808c032a93c30c393bc38a7b49901a268ad2029a9a79181c028829a8022d910c599281a223e09942be210c10911b9519b069b499192d409983a2a94b69b219d3090209a798801c11989398a94d48008c159980b233af0398198920a78b810a22c927a181c08916a9002b892905c249b85a18b2129c220e938198049aa4c1d38182c2a4b8188b411ab0c50b0078911098d05b2092b2b808b484895a0c4d181a3a18219f100812b802f02c1002f5980919019082a9180e20b50881991a021d0200a87ab32a48c195a908a115a812c00b5a1b339c0a8105d1048b1109f2189198490f181884b28b292c881026c83a0932f930928f1928a488094a29b184b81d308aa38c179198950b8b483980d381983da5081c88200b86a1180d2a101a912b198993887a3c7a080903d281a011b0a488b26aaaa72b895809018ba9708a194a2b807a80219b2b4b2881d482b5ca3080b293c2b6b2b21499b030c1b34e013bc4997a802889910b6b021c218d190001a81103c92b79b70a882a29a9340d3b3b00a7a80003bb9250a904b5c3c1a04899028589a02a249e080094d08491991b383bc09511cb24810c923c18b2a14d5a8814999880409bc2853e901194aa1a2020f002800b186aa599002c00a106b082893c84c1829a9955b098480c28a18294ac0402c81a30d10a92896a8a402a919938a97bc250b1a311aa26b8a12b0195099c708a18a490d00a1392c6b3929a80012aa902187e108490c1a3899b482095c08203f9110a9083a1025a932999f933d00911c39099117a8a04b0904c32c12a9b8709901091ba5a1213c3e3b1a85a2e13c0939c49181a00088d301f3088994899103bb150ac0879882991928d29185c2a2b02ba71b11880a13f39948c930929c300881a8e8592ba581b83c4a8121ad122e00082ab53e1880080b590a85a099338cb7908819190825d9112b09058b005b8922b29a287c8110a9392c9122f8138a8a2798c58981912c90409983b12b1a1f14990b303bc102904b3f1094bb692a1893a3d03c2a21b1e1109928909600e93188c0139c4919b6818a8a6892b812981a83c1195c0811c1b0493b12b7a0189d32b8c5819a1840c5b000888a10a792a91a79a10820c03a88b709821ab1111e896880a12d18288a18118f80288293da311f000288a02c02181ac0709b013bc6888a23a9e00699081088920d1048b8181898010114f80100c2a940b10c850891a408b811f2289c285989082923c98e283a0f13a38c0c691a08019182b8c5188982a0028b9187a18c409902a0d6a0198803c3c2a209a1299a134e008194d20a5c2800c28093b95a1a20b6c2a128a939a790a3a1821d93d300c003b01994ab700c00193e813ba409b5a1190b2799a38008b5898138f191109c01129bb78a122d0a2291f0029920b39a359f1118a089308e4a0080090a215e082099094b1012d8282abc5028e2091b590994a5a9810881c392b07b0082b6b0001a8183c8318d8112d1b23a8e409994099c6880a102c01a498a210ac41880b061f10091881b29823f818019b41c0209b294a19805c8281b3d22a9848d29294c08119b49909031bc13949ab519a0290d32b5c280881a80959a91041c1a8382a99b708b09418a9149a04b999531ea11291c298023c9f1281ba2508b82808b381a1a20ac17880a30990e21a112f000190a93108b985b0308b20b7980a011d4991a220c82a408b3e0838b3f391880891b3a49c389810829b59499a00931bc23018a8893109c048a88001b23990b50a89103ac0508a810804a89a8030c08032a98838882b0a013bc0301a82109a281c028808940aa9580a0292c8101d8214c90309b38908003b9003b9182a10a4a0b28949188a00920b0a328a01b18129901811bc4a1110d4b2089a2b0301c298001aa4a590a18a0913b1a79090080902b281a09a2210d193918f108182a8083b2981b6a20d810910a3004d188a13c109108a10b184199a22a9d218820892a181a8128990908b1382b4880a0a3a9490a288881a011829a82b09200801080a81090082b8801c288698080919800081908a0100890128a88081800a02008aa218080909101c09213aa828891092b4090c1838c2912a80099113a9a1490ca3108080992029ba4288b0828810a8005a988010b289182a1891010b00000b940a19180984a8884a8098000828b10180990008818892091808089288a00009181888029891189880090018800088809800009080000b308880088929090119880009881080800a0011c18288890009820988028981800a1080890008000888000a8003a880080910808081998100a182980008919188080808929000881900908082980901088800800898000090080009088008080910888000880818888008080880000980000890088008091818888188800809000090008808009081880808009188080088800090080800808808080800918808080080808808800808080088080800880800880800880090800808008088008808080088080080880808080808008808008808080808080808080800880808080808080088080808080808080808080808080808080808080808080808" },
    hh: { rate: 18488.889, gain: 1, data: "27f7f032f727a802df8911eda80367c96d0536b2b49bc1c9a20b4a192a010f7192b4c5135406d9b65f92c39af512cf8af612ecc12dea000a4a956f982b4a8465b000a49a5b12d38b56f900902ed611b292c5701a04649929829818a39a48e6ce7fbfb3b3c3a18800a4d4a01a11b14fd5280b6611b3982b4c39a66f9009180893b05e3a00808081982b21e5c3981a180801c5b20b4b4d3b20a11c4a01a3d4b11b3993b101d39920f5a01c4a10a3c20b4a008818a5a84d28918092996c3a1a4b28a399290091a4b04d11b4b3e5b20b3993a803f3a018b6a01a02b280b6b20a2a2a10b59928a23f5b85c28808094c28a39929939801b15f4b2a3c3a1a3b20b4a2c5b13f28a4b28894b10a3a193e3b3a03f3a00894b10a291911e5b291a39c7b20a11b20b38c4994a82a10a2b5a83d39883e20c4993b2a4d3993a94b03d11b21c39920c5b288093c3c4b12e4b10882c3a192a84c289290a5b13f4b1091901c5b291a4b29093b05f3a10908081a2a2a2a290800918a7b2982b398080080" },
    tom: { rate: 9244.444, gain: 0.486, data: "f777781b4b3c2008b81d2c2d809000a983e82a21a148410832824a9085a39b0a3e3d890e91899930c89014b0691110313b322a33991183f39aacbf9ca89891a8b380a01a5197221403171082800088099abd8bdabc0bbaa2ab4990d9b40304611432036818800a00901b8a8f8ad8c8bb8b9a80a0124b6101216842211430218308a88ab8afacbcada9c9a990982921a41922843724252232220188bd8aaaa9a1f08a8abdc9bb9c90001226211380100124a721323322193c9ea98bb88c1a10b8b0f9ca0ac009a09880c980d82805397121314111312414511410000b8dbbbdbca9aaab9dabaeaab9b8a1144534343233313222151134131199eadbccbcabbba9a989990999a99135637234423332321090a9baaaaac9bdadcbdbbcbbbbb99012336223122101234633623342211099bdacaaaa888012808accdbd9baaa88113342308add9bbba9a14543443413121008181136233422109cebdbbccabab9b9a98a9999cab88137444443343233221108999a9b9bacdbbfbcbcbdaabaa9a881122433324232425335343343312109aadbcac9aaa8909099abdcacbca9a90113522411089bcbdaa98114535233421200088001324524221289bdcdbbccaabaa9a99999abacbba992364444343342321218088998a9989abbebdbccbcbbbaba99002334342312121334534434334211189abccbbbaa9800201098abcbdbbbb9991113221188acbdbbaba9002542433342221110212343443333108acdbdbbcbbbbbbbaaabaabababa980135363352334222211010889889899abacccbdabcbabbaaa9801121221201111112133343343222100888899888081011001008889998a99a9a9aaaaabbacaaa9890000222232223121100080" },
    rim: { rate: 9244.444, gain: 0.596, data: "77977f38b32f80892619dfa892001f19a51828b812e288a80c51181c800828ae28101893c0a132f891a321989b5b211d90215b88108a287c1c110882910e108289b2b411c813b00a830fa236c802b499390a92092c22b002f082b4d5a0091808291c01d389381e11800a1aa9581009823f00a100880918092928b01080" }
  };
  var OPNA_RHYTHM_CODE = `
const CLK = ${OPNA_CLOCK};
const OUT_GAIN = ${OPNA_RHYTHM_OUT_GAIN};
const KEYS = ${JSON.stringify(OPNA_RHYTHM_KEYS)};
const DATA = ${JSON.stringify(Object.fromEntries(OPNA_RHYTHM_KEYS.map((k) => [k, OPNA_RHYTHM_DATA[k] || null])))};
const STEPS = Array.from({ length: 49 }, (_, i) => Math.floor(16 * Math.pow(1.1, i)));
const ADJ = [-1, -1, -1, -1, 2, 5, 7, 9];

/** 16 \u9032\u306E\u6587\u5B57\u5217\u3092\u30014 \u30D3\u30C3\u30C8\u305A\u3064\u306E\u4E26\u3073\u3078(\u4E0A\u4F4D\u304C\u5148) */
function nibbles(hex) {
  const out = new Uint8Array(hex.length);
  for (let i = 0; i < hex.length; i++) out[i] = parseInt(hex[i], 16);
  return out;
}
const SRC = KEYS.map((k) => DATA[k] ? { nib: nibbles(DATA[k].data), rate: DATA[k].rate, gain: DATA[k].gain } : null);

/**
 * \u30C1\u30C3\u30D7 1 \u500B\u3002\u6253\u697D\u5668\u3054\u3068\u306B 1 \u672C\u305A\u3064\u30016 \u672C\u306E\u8AAD\u307F\u624B\u3092\u6301\u3064\u3002
 * 1 \u3064\u524D\u3068\u4ECA\u306E\u5024\u306E\u3042\u3044\u3060\u3092\u3064\u306A\u3044\u3067\u51FA\u3059(\u6298\u308A\u8FD4\u3057\u306E\u4F59\u8A08\u306A\u97F3\u3092\u6291\u3048\u308B)\u3002
 */
class Rhythm {
  constructor(rate) {
    this.out = 1 / rate;
    this.reg = new Uint8Array(0x20);
    this.tl = 63;
    this.s = KEYS.map(() => ({ on: false, pos: 0, acc: 0, idx: 0, prev: 0, cur: 0, frac: 0, il: 31, ratio: 1 }));
  }

  writeReg(r, v) {
    if (r >= 0x20) return;
    this.reg[r] = v;
    if (r === 0x10) {
      for (let i = 0; i < 6; i++) {
        if (!(v & (1 << i))) continue;
        const s = this.s[i];
        if (v & 0x80) { s.on = false; continue; }   // \u6B62\u3081\u308B(\u30C0\u30F3\u30D7)
        s.on = !!SRC[i]; s.pos = 0; s.acc = 0; s.idx = 0; s.prev = 0; s.cur = 0; s.frac = 0;
      }
      return;
    }
    if (r === 0x11) { this.tl = v & 63; return; }
    if (r >= 0x18 && r <= 0x1d) this.s[r - 0x18].il = v & 31;
  }

  /** \u5B9F\u6A5F\u306B\u7121\u3044\u3082\u306E\u3002\u8AAD\u3080\u901F\u3055\u3092\u6BD4\u3067\u5909\u3048\u308B(\u97F3\u7B26\u306E\u9AD8\u3055\u304B\u3089) */
  setRatio(i, ratio) { this.s[i].ratio = ratio > 0 ? ratio : 1; }

  /** 1 \u3064\u8AAD\u307F\u9032\u3081\u308B\u3002\u7D42\u308F\u308A\u307E\u3067\u6765\u305F\u3089\u6B62\u3081\u308B */
  next(s, src) {
    if (s.pos >= src.nib.length) { s.on = false; return; }
    const n = src.nib[s.pos++];
    const st = STEPS[s.idx];
    let d = ((2 * (n & 7) + 1) * st) >> 3;
    if (n & 8) d = -d;
    let a = (s.acc + d) & 0xfff;
    if (a & 0x800) a -= 0x1000;
    s.acc = a;
    s.idx = Math.min(48, Math.max(0, s.idx + ADJ[n & 7]));
    s.prev = s.cur;
    s.cur = a / 2048;
  }

  live() {
    for (const s of this.s) if (s.on) return true;
    return false;
  }

  /** \u51FA\u53E3\u306E 1 \u30B5\u30F3\u30D7\u30EB(\u304A\u3088\u305D -1..1) */
  calc() {
    let mix = 0;
    const tl = (63 - this.tl) * 0.75;
    for (let i = 0; i < 6; i++) {
      const s = this.s[i];
      if (!s.on) continue;
      const src = SRC[i];
      s.frac += src.rate * s.ratio * this.out;
      while (s.frac >= 1 && s.on) { s.frac -= 1; this.next(s, src); }
      if (!s.on) continue;
      const v = s.prev + (s.cur - s.prev) * s.frac;
      mix += v * src.gain * Math.pow(10, -(tl + (31 - s.il) * 0.75) / 20);
    }
    return mix * OUT_GAIN;
  }
}

/**
 * \u884C\u304D\u5148 1 \u3064\u3076\u3093\u306E\u51E6\u7406\u5668\u3002\u4E2D\u306B\u30C1\u30C3\u30D7\u3092\u4F55\u500B\u3067\u3082\u6301\u3064(sound/ay.js \u3068\u540C\u3058\u8003\u3048\u65B9)\u3002
 */
class OpnaRhythmBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const q = o.processorOptions || {};
    this.events = (q.events || []).slice().sort((a, b) => a.t - b.t);
    this.at = 0;
    this.pool = [];
    this.log = !!q.log;
    this.logNow = 0;
    this.cutAt = -1;
    this.cutLen = Math.max(1, Math.round(sampleRate * 0.01));
    this.port.onmessage = (e) => {
      if (e.data && e.data.cut) { this.cut(); return; }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      this.cutAt = -1;
      for (let i = 0; i < add.length; i++) this.events.push(add[i]);
    };
  }

  grow() {
    const c = new Rhythm(sampleRate);
    const chip = { c, log: null };
    if (this.log) {
      const raw = c.writeReg.bind(c);
      chip.log = [];
      c.writeReg = (r, d) => { chip.log.push(this.logNow, r & 0xff, d & 0xff); raw(r, d); };
    }
    c.writeReg(0x11, 63);
    this.pool.push(chip);
    return chip;
  }

  cut() {
    this.events.length = 0;
    this.at = 0;
    for (const chip of this.pool) if (chip.c.live()) chip.c.writeReg(0x10, 0x80 | 0x3f);
    if (this.cutAt < 0) this.cutAt = 0;
  }

  start(ev) {
    const i = KEYS.indexOf(ev.key);
    // \u97F3\u91CF 0 \u306F\u9CF4\u3089\u3055\u306A\u3044\u3002\u5B9F\u6A5F\u306E 0 \u306F\u6D88\u97F3\u3067\u306F\u306A\u304F -23dB \u306A\u306E\u3067\u3001\u66F8\u304B\u305A\u306B\u98DB\u3070\u3059
    if (i < 0 || !(ev.v > 0)) return;
    let chip = this.pool.find((p) => !p.c.s[i].on);
    if (!chip) chip = this.grow();
    const c = chip.c;
    c.writeReg(0x18 + i, 0xc0 | (ev.v & 31));
    c.setRatio(i, ev.rp || 1);
    c.writeReg(0x10, 1 << i);
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    const n = out.length;
    const base = currentTime;
    const next = this.at < this.events.length ? this.events[this.at].t : Infinity;
    if (!this.pool.some((p) => p.c.live()) && next >= base + n / sampleRate) {
      out.fill(0);
      return true;
    }
    for (let i = 0; i < n; i++) {
      const now = base + i / sampleRate;
      if (this.log) this.logNow = now;
      while (this.at < this.events.length && this.events[this.at].t <= now) {
        this.start(this.events[this.at++]);
      }
      let v = 0;
      for (const chip of this.pool) if (chip.c.live()) v += chip.c.calc();
      if (this.cutAt >= 0) {
        v *= Math.max(0, 1 - this.cutAt / this.cutLen);
        this.cutAt++;
        if (this.cutAt > this.cutLen) { this.cutAt = this.cutLen; v = 0; }
      }
      out[i] = v;
    }
    if (this.log) {
      for (let k = 0; k < this.pool.length; k++) {
        const chip = this.pool[k];
        if (!chip.log.length) continue;
        this.port.postMessage({ regs: chip.log, chip: k, type: 0 });
        chip.log = [];
      }
    }
    return true;
  }
}
registerProcessor('mmsxx-opna-rhythm', OpnaRhythmBank);
`;

  // engine/sound/duty.js
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
    // \u6B62\u3081\u3066\u3044\u308B\u6700\u4E2D\u3002\u51FA\u53E3\u3092\u843D\u3068\u3057\u3066\u3044\u308B\u3042\u3044\u3060\u306E\u30B5\u30F3\u30D7\u30EB\u6570\u3002-1 \u306A\u3089\u6B62\u3081\u3066\u3044\u306A\u3044
    this.cutAt = -1;
    this.port.onmessage = (e) => {
      // \u6B62\u3081\u3066\u3002\u30B7\u30FC\u30AF\u3068\u505C\u6B62\u3068\u30DD\u30FC\u30BA\u3067\u6765\u308B(docs/BUGS.md)
      if (e.data && e.data.cut) {
        this.events.length = 0;
        this.at = 0;
        this.voices.length = 0;
        if (this.cutAt < 0) this.cutAt = 0;
        return;
      }
      const add = e.data && e.data.add;
      if (!add || !add.length) return;
      // \u6B21\u306E\u97F3\u304C\u6765\u305F\u3089\u51FA\u53E3\u3092\u623B\u3059
      this.cutAt = -1;
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
      // \u6B62\u3081\u3066\u3044\u308B\u6700\u4E2D\u306A\u3089\u3001\u3077\u3064\u3063\u3068\u9CF4\u3089\u306A\u3044\u3088\u3046 10 \u30DF\u30EA\u79D2\u3067\u843D\u3068\u3059
      if (this.cutAt >= 0) {
        const len = Math.max(1, Math.round(sr * 0.01));
        s *= Math.max(0, 1 - this.cutAt / len);
        this.cutAt++;
        if (this.cutAt > len) { this.cutAt = len; s = 0; }
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

  // engine/sound/modal.js
  var MODAL_NODE = "mmsxx-modal";
  var MODAL_VOICES = 24;
  var MODAL_MODES = 1024;
  var MODAL_STRINGS = 3;
  function sourOf(def, f0) {
    if (!def.sour) return f0;
    let hh = (Math.round(f0 * 100) | 0) ^ Math.imul(def.sourSeed | 0, 2654435761);
    hh = Math.imul(hh ^ hh >>> 15, 2246822507);
    hh = Math.imul(hh ^ hh >>> 13, 3266489909);
    hh ^= hh >>> 16;
    return f0 * Math.pow(2, def.sour * ((hh >>> 0) / 4294967296 * 2 - 1) / 1200);
  }
  function modalFlaws(def, ev, vel, cnt, last) {
    const out = { amp: 1, t60k: 1, fcK: 1, spot: 0, buzz: 0, head: null, extra: [] };
    const fz = ev.f || def.base;
    let hs = Math.imul(cnt, 2654435761) ^ Math.imul(Math.round(fz * 10) | 0, 2246822507) ^ Math.imul(ev.k == null ? Math.round(last * 10) | 0 : 0, 3266489909) ^ Math.imul((def.flawSeed | 0) + 1, 668265263);
    const u = () => {
      hs = Math.imul(hs ^ hs >>> 15, 2246822507);
      hs = Math.imul(hs ^ hs >>> 13, 3266489909);
      hs ^= hs >>> 16;
      return (hs >>> 0) / 4294967296;
    };
    const roll = (c) => {
      const a = u(), b = u(), d = u();
      return [c > 0 && a < c, b, d];
    };
    const head = ev.h ? Object.assign({}, def.head, ev.h) : def.head || {};
    const [nb, nb1, nb2] = roll(def.neighbor || 0);
    if (nb && ev.f) out.extra.push({ t: ev.t + 6e-3 + 0.02 * nb1, p: ev.p, f: ev.f * Math.pow(2, (nb2 < 0.5 ? -1 : 1) / 12), v: vel * (0.45 + 0.25 * nb2), d: ev.d, k: ev.k, nf: 1 });
    const [db, db1, db2] = roll(def.double || 0);
    if (db) out.extra.push({ t: ev.t + 0.012 + 0.025 * db1, p: ev.p, f: ev.f, v: vel * (0.4 + 0.2 * db2), d: ev.d == null ? void 0 : Math.max(0.02, ev.d - 0.03), k: ev.k, nf: 1 });
    const [bz, bz1] = roll((def.buzz || 0) * (0.5 + vel));
    if (bz) out.buzz = (def.buzzLevel ?? 0.4) * (0.6 + 0.4 * bz1);
    const [sl] = roll(def.slip || 0);
    if (sl) {
      out.amp *= 0.5;
      out.head = { noise: Math.max(head.noise || 0, 0.85), bright: (head.bright ?? 0.6) - 0.1 };
    }
    const [gh] = roll((def.ghost || 0) * (1.3 - vel));
    if (gh) {
      out.t60k *= 0.05;
      out.amp *= 0.7;
      out.head = Object.assign({}, out.head, { noise: Math.max(head.noise || 0, 0.6) });
    }
    const [sp] = roll(def.splay || 0);
    if (sp && head.grains > 0) {
      out.head = Object.assign({}, out.head, { scatter: (head.scatter || 0) * 3.5 + 6 });
      out.amp *= 1.5;
    }
    const [st, st1] = roll((def.spot || 0) * (0.5 + vel));
    if (st) {
      if (st1 < 0.6) {
        out.spot = 1;
        out.t60k *= 1.3;
        out.fcK = 0.6;
        out.amp *= 1.15;
      } else out.spot = 2;
    }
    return out;
  }
  function modalModes(def, f0, t60k, spot, sr, max, maxStrings, onString, onMode) {
    const kr = def.pitched ? f0 / 261.63 : 1;
    const t60 = def.t60 * Math.pow(kr, -(def.decayKey || 0)) * t60k;
    const bb = (def.stretch || 0) * Math.pow(kr, def.stretchKey || 0);
    const damp = def.damp;
    const guide = def.guide > 0 && f0 < def.guide;
    let ns = 0;
    if (guide) {
      ns = Math.max(1, Math.min(maxStrings, def.strings | 0 || 1));
      for (let s = 0; s < ns; s++) {
        const c = ns === 1 ? 0 : (def.detune || 0) * (s / (ns - 1) - 0.5) * 2;
        onString(s, f0 * Math.pow(2, c / 1200), t60 * (s === 0 ? 1 : def.after || 1), damp, bb);
      }
    }
    const tb = def.table;
    let n = 0;
    for (let i = 0; i < tb.length && n < max; i += 4) {
      const h = tb[i + 3];
      if (guide && h >= 0) continue;
      let f, tt;
      if (h < 0) {
        f = tb[i];
        tt = tb[i + 2];
      } else {
        f = tb[i] * f0 * (h > 0 && bb > 0 ? Math.sqrt(1 + bb * h * h) : 1);
        tt = t60 * tb[i + 2] / (1 + damp * (f / 1e3) * (f / 1e3));
      }
      if (f <= 20 || f >= sr * 0.45) continue;
      let ga = 1;
      if (spot === 1 && n < tb.length / 12) ga = 1.3;
      else if (spot === 2) {
        if (n < 8) {
          ga = 3;
          tt *= 2;
        } else ga = 0.4;
      }
      onMode(n, f, tt, tb[i + 1] * ga);
      n++;
    }
    return ns;
  }
  var MODAL_CODE = `
const V = ${MODAL_VOICES};
const M = ${MODAL_MODES};
const B = 128;
// \u5171\u632F\u5668 1 \u672C\u306E\u6301\u3061\u7269: a1 a2 b y1 y2 cos sin t60
const S = 8;
// \u58F0\u306E\u6301\u3061\u7269(\u5E73\u3089\u306A\u914D\u5217\u306E\u4E2D\u306E\u4F4D\u7F6E)
const ON = 0, POS = 1, LEN = 2, LP1 = 3, LP2 = 4, COMB = 5, AMP = 6, LPC = 7,
  NOISE = 8, DIRECT = 9, RATTLE = 10, RENV = 11, NM = 12, REL = 13, RELT = 14,
  LEVEL = 15, OFF = 16, BORN = 17, NORM = 18, VARY = 19, HPOS = 20, RHP = 21,
  WG = 22, WGAIN = 23, FELT = 24, TL1 = 25, TL2 = 26, TC = 27, TA1 = 28, TA2 = 29,
  GN = 30, GL = 31, BZ = 32, BP = 33, PK = 34, PO = 35, PV = 36, PD = 37,
  WD = 38, TD = 39, TR = 40;
const K = 41;
// \u982D\u306E\u7C92\u30021 \u58F0\u306B 32 \u7C92\u307E\u3067\u3002\u7C92\u3054\u3068\u306B \u59CB\u307E\u308A(\u30B5\u30F3\u30D7\u30EB)\u3068\u5927\u304D\u3055
const G = 32;
// \u5C0E\u6CE2\u7BA1(\u4F4E\u3044\u5F26)\u30021 \u58F0\u306B\u5F26 3 \u672C\u307E\u3067\u3002\u9045\u5EF6\u7DDA\u306E\u307B\u304B\u306B\u30011 \u672C\u305A\u3064\u6301\u3064\u3082\u306E:
// N(\u9045\u5EF6\u306E\u6574\u6570\u3076\u3093) \u03B7(\u7AEF\u6570\u306E\u30AA\u30FC\u30EB\u30D1\u30B9) c(\u786C\u3055\u306E\u30AA\u30FC\u30EB\u30D1\u30B9) g a(\u640D\u5931) lp
// t1 t2(\u7AEF\u6570\u306E\u30AA\u30FC\u30EB\u30D1\u30B9\u306E\u72B6\u614B) wp(\u66F8\u304F\u4F4D\u7F6E) t60 L(1 \u5468\u306E\u9577\u3055) \u3068\u3001\u786C\u3055\u306E\u30AA\u30FC\u30EB\u30D1\u30B9 6 \u6BB5\u306E\u72B6\u614B
const WS = ${MODAL_STRINGS}, AP = 6, WK = 25;
const WN = 0, WETA = 1, WC = 2, WGG = 3, WA = 4, WLP = 5, WT1 = 6, WT2 = 7, WP = 8,
  WT60 = 9, WL = 10, WAPS = 11, WQ = 23, WLV = 24;
// \u9045\u5EF6\u7DDA\u306E\u9577\u3055\u300220Hz \u306E 1 \u5468\u3088\u308A\u9577\u304F\u3059\u308B
const WR = Math.ceil(sampleRate / 20) + 8;
// \u5C0E\u6CE2\u7BA1\u306E\u51FA\u53E3\u306E\u5927\u304D\u3055\u3092\u3001\u5171\u632F\u5668\u306E\u675F\u3068\u63C3\u3048\u308B\u6570\u3002C5 \u306E\u3042\u305F\u308A\u3067\u6BB5\u5DEE\u304C\u51FA\u306A\u3044\u3088\u3046\u306B
// \u6E2C\u3063\u3066\u6C7A\u3081\u305F\u3002\u5C0E\u6CE2\u7BA1\u306F\u4F4E\u3044\u307B\u3069\u5C0F\u3055\u304F\u51FA\u308B(\u982D\u304C 1 \u5468\u306B\u5360\u3081\u308B\u5272\u5408\u304C\u6E1B\u308B)\u306E\u3067\u3001
// \u5468\u671F\u306E 0.73 \u4E57\u3067\u6301\u3061\u4E0A\u3052\u308B\u3002\u5C0E\u6CE2\u7BA1\u306B\u3082 tilt \u3092\u52B9\u304B\u305B\u3066\u4F4E\u97F3\u304C\u6697\u304F\u306A\u3063\u305F\u306E\u3067\u3001
// \u9332\u97F3\u306E C2\u301CC4 \u306E\u5927\u304D\u3055\u306E\u5DEE\u306B\u5408\u308F\u305B\u3066\u6C7A\u3081\u305F(2026-10-05\u3002\u524D\u306F 0.35)
// \u982D\u306E\u9577\u3055\u306E\u88DC\u6B63(NORM)\u3082\u5171\u632F\u5668\u306E\u675F\u3068\u540C\u3058\u306B\u639B\u3051\u308B\u3002\u639B\u3051\u306A\u3044\u3068\u3001\u30CF\u30F3\u30DE\u30FC\u3092
// \u92ED\u304F\u3057\u305F\u3068\u304D\u306B\u5C0E\u6CE2\u7BA1\u3060\u3051\u5C0F\u3055\u304F\u306A\u3063\u3066\u3001\u5883\u76EE\u3067\u6BB5\u5DEE\u304C\u51FA\u308B
const GUIDE_GAIN = 45, GUIDE_REF = 523;
// \u982D\u306E\u6ADB\u306B\u4F7F\u3046\u9045\u5EF6\u3002\u3044\u3061\u3070\u3093\u4F4E\u3044\u97F3(\u304A\u3088\u305D 30Hz)\u306E\u534A\u5468\u671F\u3088\u308A\u9577\u304F\u3059\u308B
const R = 1024;
const TAU = Math.PI * 2;
// 6.9078 = ln(1000)\u300260dB \u843D\u3061\u308B\u307E\u3067\u306E\u6642\u9593\u304B\u3089 1 \u30B5\u30F3\u30D7\u30EB\u3042\u305F\u308A\u306E\u6E1B\u308A\u65B9\u3092\u51FA\u3059
const LN1000 = 6.907755278982137;
// \u3053\u308C\u3092\u5272\u3063\u305F\u5171\u632F\u5668\u306F\u5916\u3059\u3002-100dB
const QUIET = 1e-5;

// \u540D\u524D\u3092\u66F8\u3044\u3066\u53D7\u3051\u53D6\u308B\u3002\u7E2E\u3081\u305F JS(esbuild --minify)\u3067\u306F\u95A2\u6570\u306E\u540D\u524D\u304C\u5909\u308F\u308B\u306E\u3067\u3001
// \u4E2D\u8EAB\u3060\u3051\u57CB\u3081\u308B\u3068\u3001\u6587\u5B57\u5217\u306E\u4E2D\u306E\u547C\u3073\u51FA\u3057(sourOf(\u2026))\u3068\u540D\u524D\u304C\u98DF\u3044\u9055\u3063\u3066\u7121\u97F3\u306B\u306A\u308B
const sourOf = ${sourOf};
const modalFlaws = ${modalFlaws};
const modalModes = ${modalModes};

// \u30D4\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u5165\u53E3\u306E\u5927\u304D\u3055\u3002pickup 1\u3001ff \u306E\u771F\u3093\u4E2D\u306E\u97F3\u3067\u3001\u632F\u308C\u304C\u78C1\u77F3\u307E\u3067\u306E\u8DDD\u96E2\u306E 7 \u5272\u307B\u3069\u306B\u5C4A\u304F
const PICKUP_SCALE = 1.2;

/**
 * \u78C1\u77F3\u304B\u3089\u306E\u8DDD\u96E2 1 \u2212 u \u3067\u898B\u305F\u78C1\u675F(1 / \u8DDD\u96E2\xB2 \u304B\u3089\u3001\u6B62\u307E\u3063\u3066\u3044\u308B\u3068\u304D\u306E\u3076\u3093\u3092\u5F15\u3044\u305F\u3082\u306E)\u3002
 * \u78C1\u77F3\u306B\u5F53\u305F\u3089\u306A\u3044\u3088\u3046\u3001u \u306F 0.9 \u306E\u624B\u524D\u3067\u306A\u3081\u3089\u304B\u306B\u982D\u6253\u3061\u306B\u3059\u308B
 */
function pickup(u) {
  const c = 0.9 * Math.tanh(u / 0.9);
  const d = 1 - c;
  return (1 / (d * d) - 1) / 2;
}
function pickupSlope(u) {
  const c = 0.9 * Math.tanh(u / 0.9);
  const d = 1 - c;
  return 1 / (d * d * d);
}

class ModalBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.modes = new Float64Array(V * M * S);
    this.voice = new Float64Array(V * K);
    this.ring = new Float64Array(V * R);
    this.wg = new Float64Array(V * WS * WK);
    this.grain = new Float64Array(V * G * 2);
    this.wring = new Float64Array(V * WS * WR);
    this.seed = new Uint32Array(V);       // \u7A2E\u3092\u56FA\u5B9A\u3057\u305F\u96D1\u97F3
    this.free = 0x9e3779b9;               // \u6BCE\u56DE\u9055\u3046\u96D1\u97F3(\u5168\u90E8\u306E\u58F0\u3067 1 \u672C)
    this.hb = new Float64Array(B);        // \u982D\u306E\u584A
    this.vb = new Float64Array(B);        // \u58F0\u306E\u584A
    this.tb = new Float64Array(B);        // \u5C0E\u6CE2\u7BA1\u3078\u5165\u308C\u308B\u982D(tilt \u3092\u639B\u3051\u305F\u3082\u306E)
    this.ob = new Float32Array(B);        // \u51FA\u53E3\u304C 1 \u672C\u306E\u3068\u304D\u3001\u53F3\u3078\u884C\u304F\u675F\u3092\u7F6E\u304F
    this.patch = p.patches || {};
    this.events = [];
    this.at = 0;
    this.born = 0;
    this.cutAt = -1;
    // \u5931\u6557\u30FB\u5D29\u308C\u306E\u7A2E\u306B\u4F7F\u3046\u3001\u30D1\u30C3\u30C1\u3054\u3068\u306E\u97F3\u306E\u6570\u3068\u524D\u306E\u97F3\u306E\u9AD8\u3055
    this.count = {};
    this.lastF = {};
    this.add(p.events || []);
    this.port.onmessage = (e) => {
      const d = e.data || {};
      if (d.patch) this.patch[d.patch] = d.def;
      if (d.add) this.add(d.add);
      if (d.cut) { this.events = []; this.at = 0; this.cutAt = 0; }
    };
  }

  /** \u97F3\u7B26\u3092\u8DB3\u3059\u3002\u6642\u523B\u9806\u306B\u4E26\u3079\u76F4\u3057\u3066\u3001\u6E08\u3093\u3060\u3076\u3093\u306F\u6368\u3066\u308B */
  add(list) {
    if (!list.length) return;
    // \u9CF4\u308A\u306F\u3058\u3081\u308B\u6642\u523B(s0)\u3092\u5148\u306B\u6C7A\u3081\u3066\u304A\u304F\u3002align \u306E\u3042\u308B\u97F3\u8272\u306F\u3001\u982D\u306E\u3044\u3061\u3070\u3093\u5927\u304D\u3044
    // \u3068\u3053\u308D\u304C\u97F3\u7B26\u306E\u6642\u523B\u306B\u6765\u308B\u3088\u3046\u306B\u3001\u305D\u306E\u3076\u3093\u65E9\u304F\u9CF4\u308A\u306F\u3058\u3081\u308B
    for (const ev of list) ev.s0 = ev.t - this.lead(ev);
    const rest = this.events.slice(this.at).concat(list);
    rest.sort((a, b) => a.s0 - b.s0);
    this.events = rest;
    this.at = 0;
  }

  /** \u5C71 1 \u3064(\u7C92\u304C\u3042\u308B\u3068\u304D\u306F\u7C92 1 \u3064)\u306E\u9577\u3055(\u30B5\u30F3\u30D7\u30EB)\u3002\u5F37\u3055\u3067\u77ED\u304F\u3001\u9AD8\u3044\u97F3\u307B\u3069\u30CF\u30F3\u30DE\u30FC\u304C\u786C\u3044\u3076\u3093\u77ED\u304F\u306A\u308B */
  bumpLen(def, h, vel, f0) {
    const hk = def.pitched ? Math.pow(Math.max(1, f0 / (h.hardFrom || 261.63)), h.hardKey || 0) : 1;
    return Math.max(2, Math.round(h.sharp * 0.001 * sampleRate * (1.4 - 0.6 * vel) / hk));
  }

  /** \u982D\u306E\u9577\u3055(\u30B5\u30F3\u30D7\u30EB)\u3002\u7C92\u304C\u3042\u308B\u3068\u304D\u306F\u3001\u6563\u3089\u3070\u308B\u5E45\u306E\u3076\u3093\u9577\u304F\u306A\u308B */
  headLen(def, h, vel, f0) {
    const b = this.bumpLen(def, h, vel, f0);
    return h.grains > 0 ? b + Math.round((h.scatter || 0) * 0.001 * sampleRate) : b;
  }

  /**
   * \u97F3\u7B26\u306E\u6642\u523B\u3088\u308A\u4F55\u79D2\u65E9\u304F\u9CF4\u308A\u306F\u3058\u3081\u308B\u304B\u3002\u982D\u306E\u5C71\u306F\u9577\u3055\u306E\u534A\u5206\u306E\u3068\u3053\u308D\u306B\u3042\u308B\u3002
   * \u9045\u3089\u305B\u308B\u5074\u306F\u6301\u305F\u306A\u3044\u3002\u5F8C\u308D\u306B\u7F6E\u304F\u30CE\u30EA\u306F\u3001\u62CD\u3092\u57FA\u6E96\u306B\u3059\u3079\u3066\u306E\u30D1\u30FC\u30C8\u3078\u52B9\u304F\u6F14\u594F\u306E\u5C64\u306E
   * \u8A71\u3067\u3001\u97F3\u8272\u306E\u88DC\u6B63\u3068\u306F\u5F79\u76EE\u304C\u9055\u3046(2026-10-05)
   */
  lead(ev) {
    const def = this.patch[ev.p];
    if (!def) return 0;
    const h = ev.h ? Object.assign({}, def.head, ev.h) : def.head;
    if (!(h.align > 0)) return 0;
    const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
    return h.align * this.headLen(def, h, vel, ev.f || def.base) / 2 / sampleRate;
  }

  /** \u7A7A\u3044\u3066\u3044\u308B\u58F0\u3002\u7121\u3051\u308C\u3070\u3044\u3061\u3070\u3093\u53E4\u3044\u58F0\u3092\u53D6\u308B */
  pick() {
    const vo = this.voice;
    let best = 0, oldest = Infinity;
    for (let v = 0; v < V; v++) {
      const o = v * K;
      if (!vo[o + ON]) return v;
      if (vo[o + BORN] < oldest) { oldest = vo[o + BORN]; best = v; }
    }
    return best;
  }

  start(ev, off) {
    const def = this.patch[ev.p];
    if (!def) return;
    const sr = sampleRate;
    const v = this.pick();
    const o = v * K;
    const vo = this.voice;
    let h = ev.h ? Object.assign({}, def.head, ev.h) : def.head;
    const vel = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
    // \u5931\u6557\u30FB\u5D29\u308C\u3002\u8D77\u304D\u308B\u304B\u3069\u3046\u304B\u306F\u3001\u97F3\u7B26\u306E\u756A\u53F7\u30FB\u97F3\u306E\u9AD8\u3055\u30FB\u524D\u306E\u97F3\u306E\u9AD8\u3055\u30FB\u7A2E\u304B\u3089\u6C7A\u3081\u308B\u3002
    // \u756A\u53F7\u306F\u3001\u9CF4\u3089\u3059\u5074\u304C\u4ED8\u3051\u308B k(\u66F8\u3044\u305F\u97F3\u7B26\u306E\u756A\u53F7\u3002\u7E70\u308A\u8FD4\u3057\u3092\u6570\u3048\u306A\u3044)\u3002#looptimes \u306E 2 \u5468\u76EE\u3082\u3001
    // \u30A8\u30B3\u30FC\u306E\u5199\u3057\u3084\u548C\u97F3\u306E\u3088\u3046\u306B 1 \u3064\u306E\u97F3\u7B26\u304B\u3089\u4F5C\u3063\u305F\u30A4\u30D9\u30F3\u30C8\u3082\u3001\u540C\u3058\u3068\u3053\u308D\u3067\u8D77\u304D\u308B
    // (\u713C\u3044\u305F WAV \u304C\u6BCE\u56DE\u540C\u3058\u306B\u306A\u308A\u3001\u6C17\u306B\u5165\u3063\u305F\u5931\u6557\u3092\u63B4\u3093\u3067\u6B8B\u305B\u308B\u30022026-10-07)\u3002
    // k \u304C\u7121\u3044\u3068\u304D(\u805E\u304F\u30DA\u30FC\u30B8\u3001\u30C6\u30B9\u30C8)\u306F\u3001\u30D1\u30C3\u30C1\u3054\u3068\u306B\u9CF4\u3089\u3057\u305F\u9806\u306E\u6570\u3067\u4EE3\u308F\u308A\u306B\u3059\u308B\u3002
    // \u5931\u6557\u3067\u8DB3\u3057\u305F\u97F3(nf)\u304B\u3089\u306F\u8D77\u3053\u3055\u306A\u3044
    let amp = Math.pow(vel, 1.5), t60k = 1, fcK = 1, spot = 0, buzz = 0;
    if (!ev.nf) {
      this.count[ev.p] = (this.count[ev.p] || 0) + 1;
      const last = this.lastF[ev.p] || 0;
      this.lastF[ev.p] = ev.f || def.base;
      const fl = modalFlaws(def, ev, vel, ev.k ?? this.count[ev.p], last);
      amp *= fl.amp; t60k = fl.t60k; fcK = fl.fcK; spot = fl.spot; buzz = fl.buzz;
      if (fl.head) h = Object.assign({}, h, fl.head);
      if (fl.extra.length) this.add(fl.extra);
    }
    const f0 = sourOf(def, ev.f || def.base);
    // \u5F37\u3055\u3067\u982D\u304C\u77ED\u304F\u3001\u660E\u308B\u304F\u306A\u308B\u3002\u6CE2\u5F62\u306F\u5DEE\u3057\u66FF\u3048\u306A\u3044
    // \u97F3\u57DF\u3067\u5909\u308F\u308B\u3082\u306E\u3002\u771F\u3093\u4E2D\u306E C \u3092\u57FA\u6E96\u306B\u3059\u308B
    const kr = def.pitched ? f0 / 261.63 : 1;
    // \u9AD8\u3044\u97F3\u307B\u3069\u30CF\u30F3\u30DE\u30FC\u304C\u786C\u3044\u3002\u982D\u304C\u77ED\u304F\u3001\u660E\u308B\u304F\u306A\u308B\u3002
    // hardFrom \u3088\u308A\u4F4E\u3044\u5074\u306B\u306F\u52B9\u304B\u305B\u306A\u3044\u3002\u52B9\u304B\u305B\u308B\u3068\u4F4E\u97F3\u306E\u30CF\u30F3\u30DE\u30FC\u304C\u67D4\u3089\u304B\u304F\u306A\u308A\u3059\u304E\u3066\u3001\u4E38\u304F\u306A\u308B\u3002
    // \u65E2\u5B9A\u306F\u771F\u3093\u4E2D\u306E C\u3002\u30D9\u30FC\u30B9\u306E\u3088\u3046\u306B\u4F4E\u3044\u697D\u5668\u306F\u3001\u3082\u3063\u3068\u4E0B\u304B\u3089\u52B9\u304B\u305B\u308B
    const hk = def.pitched ? Math.pow(Math.max(1, f0 / (h.hardFrom || 261.63)), h.hardKey || 0) : 1;
    const len = this.headLen(def, h, vel, f0);
    // \u5F37\u3055\u3067\u982D\u304C\u660E\u308B\u304F\u306A\u308B\u3002velo \u306F\u5F37\u3055 0\u301C1 \u3067\u4F55\u30AA\u30AF\u30BF\u30FC\u30D6\u52D5\u304F\u304B
    const fc = Math.min(sr * 0.45, 100 * Math.pow(2, h.bright * 8 + (h.velo ?? 1.5) * (vel - 1)) * hk * fcK);
    vo[o + ON] = 1;
    vo[o + POS] = 0;
    vo[o + LEN] = len;
    vo[o + LP1] = 0;
    vo[o + LP2] = 0;
    vo[o + LPC] = 1 - Math.exp(-TAU * fc / sr);
    // \u7AEF\u6570\u307E\u3067\u6301\u3064\u3002\u6574\u6570\u306B\u4E38\u3081\u308B\u3068\u3001\u5468\u671F\u306E\u77ED\u3044\u9AD8\u3044\u97F3\u307B\u3069\u53E9\u304F\u4F4D\u7F6E\u304C\u305A\u308C\u3066\u3001
    // \u6ADB\u306E\u5C71\u304C\u51FA\u308B\u306F\u305A\u306E\u306A\u3044\u500D\u97F3\u306B\u6765\u308B(C6 \u3067 12 \u756A\u76EE\u304C\u7ACB\u3063\u3066\u3044\u305F)
    vo[o + COMB] = Math.min(R - 2, h.comb * sr / f0);
    vo[o + AMP] = amp;
    vo[o + NOISE] = h.noise;
    vo[o + VARY] = h.vary;
    // \u30D5\u30A7\u30EB\u30C8\u306F\u5F37\u304F\u53E9\u304F\u307B\u3069\u786C\u304F\u306A\u308A\u3001\u529B\u306E\u5F62\u304C\u5C16\u308B\u3002\u5C71\u3092\u4F55\u4E57\u3059\u308B\u304B\u3067\u6301\u3064
    vo[o + FELT] = 1 + (h.felt || 0) * vel * vel;
    vo[o + DIRECT] = def.direct || 0;
    vo[o + RATTLE] = def.rattle || 0;
    vo[o + RENV] = 0;
    vo[o + RHP] = 0;
    vo[o + BZ] = buzz;
    vo[o + BP] = 0;
    vo[o + PK] = def.pickup || 0;
    vo[o + PO] = def.pickupOffset || 0;
    vo[o + PV] = 0;
    // \u632F\u308C\u306E\u901F\u3055\u3092\u51FA\u3059(\u30C6\u30A3\u30F3)\u3002\u30B3\u30A4\u30EB\u304C\u62FE\u3046\u306E\u306F\u78C1\u675F\u306E\u5909\u5316\u306E\u901F\u3055\u3067\u3001\u751F\u97F3\u3067\u7A7A\u6C17\u3078\u51FA\u308B\u306E\u3082
    // \u632F\u308C\u306E\u901F\u3055\u306A\u306E\u3067\u3001\u30D4\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6709\u308B\u7121\u3057\u306B\u3088\u3089\u306A\u3044\u30021 \u30B5\u30F3\u30D7\u30EB\u306E\u5DEE\u3092\u3068\u308A\u3001\u57FA\u97F3\u3067
    // 2 sin(\u03C0f/sr) \u500D\u306B\u306A\u308B\u3076\u3093\u3092\u5272\u3063\u3066\u57FA\u97F3\u306E\u5927\u304D\u3055\u3092\u63C3\u3048\u308B\u3002\u4E0A\u306E\u500D\u97F3\u306F\u3001\u9AD8\u3055\u306B\u6BD4\u4F8B\u3057\u3066\u5F37\u304F\u306A\u308B\u3002
    // \u30D4\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u91CF\u3067\u5207\u308A\u66FF\u3048\u308B\u3068\u3001Smart \u3092 0 \u304B\u3089\u5C11\u3057\u4E0A\u3052\u305F\u3068\u3053\u308D\u3067\u30AD\u30F3\u304C 16dB \u8DF3\u306D\u308B
    vo[o + PD] = def.speed ? 1 / (2 * Math.sin(Math.PI * Math.min(f0, sr * 0.45) / sr)) : 0;
    vo[o + WD] = def.width || 0;
    vo[o + TD] = def.tremolo || 0;
    vo[o + TR] = def.tremoloRate || 0;
    // \u9AD8\u3044\u97F3\u3092\u6301\u3061\u4E0A\u3052\u308B\u3002\u4E2D\u592E\u306E C \u304B\u3089\u4E0A\u3078 1 \u30AA\u30AF\u30BF\u30FC\u30D6\u3054\u3068\u306B trebleGain dB\u3002
    // \u672C\u7269\u306E\u30D4\u30A2\u30CE\u306F\u9AD8\u97F3\u3067\u3082\u51FA\u3060\u3057\u306E\u5927\u304D\u3055\u304C\u3042\u307E\u308A\u843D\u3061\u306A\u3044(\u9332\u97F3\u3067\u6E2C\u3063\u305F)
    const tg = def.trebleGain ? Math.pow(10, def.trebleGain * Math.max(0, Math.log2(kr)) / 20) : 1;
    vo[o + LEVEL] = (def.level == null ? 0.5 : def.level) * tg;
    vo[o + OFF] = off;
    vo[o + BORN] = ++this.born;
    vo[o + REL] = ev.d == null ? -1 : ev.t + ev.d;
    vo[o + RELT] = def.release || 0.15;
    vo[o + HPOS] = 0;
    // \u982D\u304C\u9577\u3044\u307B\u3069\u4F4E\u3044\u5171\u632F\u5668\u3078\u591A\u304F\u5165\u308B\u306E\u3067\u3001\u305D\u306E\u3076\u3093\u5272\u308B\u3002
    // \u92ED\u3055\u306F\u660E\u308B\u3055\u3060\u3051\u3092\u5909\u3048\u3001\u5927\u304D\u3055\u306F\u5909\u3048\u306A\u3044
    // \u30D5\u30A7\u30EB\u30C8\u3067\u5C71\u304C\u5C16\u308B\u3068\u9762\u7A4D\u304C\u6E1B\u308B\u306E\u3067\u3001\u305D\u306E\u9762\u7A4D\u3067\u5272\u308B\u3002\u5272\u3089\u306A\u3044\u3068\u3001\u30D5\u30A7\u30EB\u30C8\u3092
    // \u786C\u304F\u3057\u305F\u3060\u3051\u3067\u97F3\u304C\u5C0F\u3055\u304F\u306A\u308B(\u660E\u308B\u3055\u3060\u3051\u3092\u5909\u3048\u305F\u3044\u30D1\u30E9\u30E1\u30FC\u30BF)
    let area = 0;
    for (let i = 0; i < 32; i++) area += Math.pow(Math.sin(Math.PI * (i + 0.5) / 32), vo[o + FELT]);
    area /= 32;
    // \u7C92\u3002\u982D\u3092 1 \u3064\u306E\u5C71\u3067\u306F\u306A\u304F\u3001\u5C11\u3057\u305A\u3064\u305A\u308C\u3066\u5F53\u305F\u308B\u7D30\u304B\u3044\u5C71\u306E\u96C6\u307E\u308A\u306B\u3059\u308B
    // (\u30D6\u30E9\u30B7\u306E\u7DDA\u304C\u4F55\u5341\u672C\u3082\u305A\u308C\u3066\u5F53\u305F\u308B\u300C\u30D1\u30B7\u30E3\u300D)\u3002\u6642\u523B\u3068\u5927\u304D\u3055\u306F\u7A2E\u3067\u6C7A\u3081\u3001
    // vary \u306E\u3076\u3093\u3060\u3051\u6BCE\u56DE\u305A\u3089\u3059\u3002\u9762\u7A4D\u306F\u7C92\u306E\u5927\u304D\u3055\u306E\u5408\u8A08\u3067\u6570\u3048\u308B
    const gn = Math.max(0, Math.min(G, h.grains | 0));
    vo[o + GN] = gn;
    if (gn > 0) {
      const gl = this.bumpLen(def, h, vel, f0);
      const span = Math.max(0, len - gl);
      vo[o + GL] = gl;
      let gs = ((h.seed | 0) * 747796405 + 2891336453) >>> 0 || 1;
      const u = () => { gs ^= gs << 13; gs >>>= 0; gs ^= gs >>> 17; gs ^= gs << 5; gs >>>= 0; return gs / 4294967296; };
      let sum = 0;
      for (let k = 0; k < gn; k++) {
        const t = (1 - h.vary) * u() + h.vary * Math.random();
        const a = 0.4 + 0.6 * ((1 - h.vary) * u() + h.vary * Math.random());
        this.grain[(v * G + k) * 2] = Math.round(t * span);
        this.grain[(v * G + k) * 2 + 1] = a / Math.sqrt(gn);
        sum += a / Math.sqrt(gn);
      }
      vo[o + NORM] = 1 / Math.max(1, area * gl * sum);
    } else {
      vo[o + NORM] = 1 / Math.max(1, area * len);
    }
    this.ring.fill(0, v * R, v * R + R);
    this.seed[v] = (h.seed | 0) * 2654435761 + 1 >>> 0 || 1;
    // \u4FC2\u6570\u3092\u4F5C\u308B\u3002\u30CA\u30A4\u30AD\u30B9\u30C8\u306B\u8FD1\u3044\u3082\u306E\u306F\u8F09\u305B\u306A\u3044
    const tb = def.table;
    const md = this.modes;
    // \u5171\u632F\u5668\u3068\u5C0E\u6CE2\u7BA1\u306E\u5F26\u306E\u4E26\u3073\u3068\u6E1B\u308A\u65B9\u306F modalModes \u3067\u6C7A\u3081\u308B(\u4F59\u97FB\u306E\u9577\u3055 modalTail \u3068\u540C\u3058\u9053)
    vo[o + WG] = 0;
    vo[o + NM] = 0;
    const ns = modalModes(def, f0, t60k, spot, sr, M, WS, (s, f, t60s, damp, bb) => {
      this.string(v, s, f, t60s, damp, bb);
      this.wg[(v * WS + s) * WK + WLV] = s === 0 ? 1 : (def.afterLevel ?? 1);
    }, (n, f, tt, a) => {
      const w = TAU * f / sr;
      const r = Math.exp(-LN1000 / (Math.max(0.005, tt) * sr));
      const c = Math.cos(w), s = Math.sin(w);
      const m = (v * M + n) * S;
      md[m] = 2 * r * c;
      md[m + 1] = r * r;
      md[m + 2] = a * s;
      md[m + 3] = 0;
      md[m + 4] = 0;
      md[m + 5] = c;
      md[m + 6] = s;
      md[m + 7] = tt;
      vo[o + NM] = n + 1;
    });
    vo[o + WG] = ns;
    if (ns) {
      // \u4E0A\u306E\u500D\u97F3\u3092\u5F31\u3081\u308B\u91CF(tilt)\u3092\u3001\u5C0E\u6CE2\u7BA1\u306B\u3082\u540C\u3058\u610F\u5473\u3067\u52B9\u304B\u305B\u308B\u3002\u5171\u632F\u5668\u306E\u675F\u306F\u8868\u306E\u632F\u5E45\u3067
      // 1/n^tilt \u306B\u3057\u3066\u3044\u308B\u304C\u3001\u5C0E\u6CE2\u7BA1\u306B\u306F\u8868\u304C\u7121\u3044\u3002\u57FA\u97F3\u306E\u3068\u3053\u308D\u3067\u5207\u308C\u308B 1 \u6B21\u306E\u30ED\u30FC\u30D1\u30B9\u3092
      // \u982D\u306B\u639B\u3051\u3066\u8FD1\u3065\u3051\u308B(1 \u6BB5\u3067 1/n\u30012 \u6BB5\u76EE\u3092\u6DF7\u305C\u3066 2 \u307E\u3067)\u3002\u52B9\u304B\u305B\u306A\u3044\u3068\u3001\u982D\u3092
      // \u660E\u308B\u304F\u3057\u305F\u3068\u304D\u306B\u5C0E\u6CE2\u7BA1\u3060\u3051\u4E0A\u306E\u500D\u97F3\u304C\u5897\u3048\u3001\u5883\u76EE(B4 \u3068 C5)\u3067\u6BB5\u5DEE\u304C\u51FA\u308B
      const tl = def.tilt == null ? 1 : def.tilt;
      vo[o + TC] = 1 - Math.exp(-TAU * f0 / sr);
      vo[o + TA1] = Math.min(1, Math.max(0, tl));
      vo[o + TA2] = Math.min(1, Math.max(0, tl - 1));
      vo[o + TL1] = 0;
      vo[o + TL2] = 0;
      // 2 \u672C\u76EE\u304B\u3089\u4E0B\u3052\u305F\u3076\u3093(afterLevel)\u3092\u8DB3\u3057\u623B\u3059\u3002\u5F26\u306E\u6570\u3068\u6B8B\u308B\u5F26\u306E\u5927\u304D\u3055\u3067\u3001\u5168\u4F53\u306E\u5927\u304D\u3055\u306F\u5909\u3048\u306A\u3044
      const share = 1 + (ns - 1) * (def.afterLevel ?? 1);
      vo[o + WGAIN] = GUIDE_GAIN / share * Math.pow(GUIDE_REF / f0, 0.73) * vo[o + NORM];
    }
  }

  /**
   * \u5C0E\u6CE2\u7BA1\u306E\u5F26\u3092 1 \u672C\u5F35\u308B\u3002
   *
   * \u30EB\u30FC\u30D7\u306F \u9045\u5EF6\u7DDA \u2192 \u640D\u5931(1 \u6B21\u306E\u30ED\u30FC\u30D1\u30B9)\u2192 \u786C\u3055(1 \u6B21\u306E\u30AA\u30FC\u30EB\u30D1\u30B9 6 \u6BB5)\u2192
   * \u7AEF\u6570(1 \u6B21\u306E\u30AA\u30FC\u30EB\u30D1\u30B9)\u2192 \u9045\u5EF6\u7DDA\u30021 \u5468\u306E\u9577\u3055\u304C\u57FA\u97F3\u306E\u5468\u671F\u306B\u306A\u308B\u3088\u3046\u306B\u3001
   * \u640D\u5931\u3068\u786C\u3055\u304C\u98DF\u3046\u9045\u308C\u3092\u5DEE\u3057\u5F15\u3044\u3066\u9045\u5EF6\u306E\u9577\u3055\u3092\u6C7A\u3081\u308B\u3002
   *
   * \u786C\u3055\u306F\u3001\u4E0A\u306E\u500D\u97F3\u307B\u3069 1 \u5468\u3092\u77ED\u304F\u3057\u3066\u9AD8\u304F\u305A\u3089\u3059\u3002\u4F55\u756A\u76EE\u304B\u306E\u500D\u97F3\u304C
   * \u5171\u632F\u5668\u306E\u675F\u3068\u540C\u3058\u9AD8\u3055(n f sqrt(1 + B n^2))\u306B\u6765\u308B\u307E\u3067\u3001\u30AA\u30FC\u30EB\u30D1\u30B9\u306E\u4FC2\u6570\u3092\u4E8C\u5206\u6CD5\u3067\u63A2\u3059
   */
  string(v, s, f, t60, damp, bb) {
    const sr = sampleRate, wg = this.wg;
    const wi = (v * WS + s) * WK;
    const L0 = sr / f;
    const w0 = TAU * f / sr;
    // \u640D\u5931\u3002\u57FA\u97F3\u3067 t60\u30012kHz \u3067\u5171\u632F\u5668\u306E\u675F\u3068\u540C\u3058\u6E1B\u308A\u65B9\u306B\u306A\u308B\u3088\u3046\u306B
    const g = Math.pow(10, -3 * L0 / (sr * t60));
    let a = 0;
    const f1 = Math.min(2000, 0.35 * sr);
    if (f1 > 1.5 * f && damp > 0) {
      const t1 = t60 / (1 + damp * (f1 / 1000) * (f1 / 1000));
      const r = Math.pow(10, -3 * L0 / sr * (1 / t1 - 1 / t60));
      const q = r * r, c1 = Math.cos(TAU * f1 / sr);
      if (q < 1) a = ((1 - q * c1) - Math.sqrt(Math.max(0, (1 - q * c1) ** 2 - (1 - q) ** 2))) / (1 - q);
    }
    const ap = (c, w) => -(Math.atan2(-Math.sin(w), c + Math.cos(w))
      - Math.atan2(-c * Math.sin(w), 1 + c * Math.cos(w))) / w;
    const lossD = (w) => a === 0 ? 0 : Math.atan2(a * Math.sin(w), 1 - a * Math.cos(w)) / w;
    // \u4FC2\u6570 c \u306E\u3068\u304D\u306E\u9045\u5EF6\u306E\u9577\u3055\u3068\u7AEF\u6570\u3002\u77ED\u3059\u304E\u3066\u7D44\u3081\u306A\u3051\u308C\u3070 null
    const fit = (c) => {
      const rest = L0 - lossD(w0) - AP * ap(c, w0);
      const N = Math.floor(rest - 0.5);
      if (N < 2 || N >= WR - 1) return null;
      const d = rest - N;
      return { N, eta: (1 - d) / (1 + d) };
    };
    let c = 0;
    const nt = Math.max(2, Math.min(12, Math.floor(0.3 * sr / f)));
    if (bb > 0) {
      const ft = nt * f * Math.sqrt(1 + bb * nt * nt);
      const wt = TAU * ft / sr;
      const err = (c) => {
        const z = fit(c);
        if (!z) return -1;
        return z.N + lossD(wt) + AP * ap(c, wt) + ap(z.eta, wt) - nt * sr / ft;
      };
      if (err(0) > 0) {
        let lo = -0.95, hi = 0;
        for (let k = 0; k < 28; k++) {
          const mid = (lo + hi) / 2;
          if (err(mid) > 0) hi = mid; else lo = mid;
        }
        c = hi;
      }
    }
    const z = fit(c) || fit(0);
    wg.fill(0, wi, wi + WK);
    wg[wi + WN] = z.N;
    wg[wi + WETA] = z.eta;
    wg[wi + WC] = c;
    wg[wi + WGG] = g;
    wg[wi + WA] = a;
    wg[wi + WT60] = t60;
    wg[wi + WL] = L0;
    this.wring.fill(0, (v * WS + s) * WR, (v * WS + s + 1) * WR);
  }

  /** \u5C0E\u6CE2\u7BA1\u306E\u5F26\u3092\u56DE\u3057\u3066 vb \u3078\u8DB3\u3059\u3002\u307E\u3060\u9CF4\u3063\u3066\u3044\u308B\u5F26\u306E\u6570\u3092\u8FD4\u3059 */
  strings(v, live) {
    const vo = this.voice, wg = this.wg, ring = this.wring, vb = this.vb;
    const o = v * K;
    // \u982D\u306B tilt \u306E\u30ED\u30FC\u30D1\u30B9\u3092\u639B\u3051\u305F\u3082\u306E\u3002\u57FA\u97F3\u3067\u306E\u5927\u304D\u3055\u306F\u5909\u3048\u306A\u3044(\u221A2 \u3092\u639B\u3051\u623B\u3059)
    const hb = this.tb;
    if (live) {
      const c = vo[o + TC], a1 = vo[o + TA1], a2 = vo[o + TA2];
      let l1 = vo[o + TL1], l2 = vo[o + TL2];
      for (let i = 0; i < B; i++) {
        const x = this.hb[i];
        l1 += c * (x - l1);
        const y1 = (1 - a1) * x + a1 * 1.4142 * l1;
        l2 += c * (y1 - l2);
        hb[i] = (1 - a2) * y1 + a2 * 1.4142 * l2;
      }
      vo[o + TL1] = l1; vo[o + TL2] = l2;
    }
    const ns = vo[o + WG];
    const gin = vo[o + WGAIN];
    let alive = 0;
    for (let s = 0; s < ns; s++) {
      const wi = (v * WS + s) * WK;
      const N = wg[wi + WN];
      if (!N) continue;
      const rb = (v * WS + s) * WR;
      const eta = wg[wi + WETA], c = wg[wi + WC], a = wg[wi + WA];
      const gg = wg[wi + WGG] * (1 - a);
      const gl = gin * wg[wi + WLV];
      let lp = wg[wi + WLP], t1 = wg[wi + WT1], t2 = wg[wi + WT2], wp = wg[wi + WP];
      let e = 0;
      for (let i = 0; i < B; i++) {
        let rd = wp - N;
        if (rd < 0) rd += WR;
        const x = ring[rb + rd];
        lp = gg * x + a * lp;
        let u = lp;
        for (let k = 0; k < AP; k++) {
          const j = wi + WAPS + 2 * k;
          const y = c * u + wg[j] - c * wg[j + 1];
          wg[j] = u; wg[j + 1] = y; u = y;
        }
        const yt = eta * u + t1 - eta * t2;
        t1 = u; t2 = yt;
        ring[rb + wp] = live ? yt + hb[i] : yt;
        if (++wp >= WR) wp = 0;
        vb[i] += x * gl;
        e += x * x;
      }
      wg[wi + WLP] = lp; wg[wi + WT1] = t1; wg[wi + WT2] = t2; wg[wi + WP] = wp;
      // \u6E1B\u308A\u304D\u3063\u305F\u5F26\u306F\u6B62\u3081\u308B\u3002\u8AAD\u3080\u4F4D\u7F6E\u306F\u66F8\u304F\u4F4D\u7F6E\u306E N \u30B5\u30F3\u30D7\u30EB\u5F8C\u308D\u306A\u306E\u3067\u3001
      // 1 \u5468\u3076\u3093\u9759\u304B\u306A\u306E\u3092\u898B\u3066\u304B\u3089\u306B\u3059\u308B\u3002\u3067\u306A\u3044\u3068\u982D\u304C\u56DE\u3063\u3066\u304F\u308B\u524D\u306B\u6B62\u3081\u3066\u3057\u307E\u3046
      if (!live && e < B * QUIET * QUIET) wg[wi + WQ] += B;
      else wg[wi + WQ] = 0;
      if (wg[wi + WQ] > N + B) wg[wi + WN] = 0;
      else alive++;
    }
    return alive;
  }

  /** \u96E2\u3059\u3002\u6E1B\u8870\u3092\u7E2E\u3081\u308B\u3060\u3051\u3067\u3001\u9CF4\u3063\u3066\u3044\u308B\u5F62\u306F\u5D29\u3055\u306A\u3044 */
  release(v) {
    const vo = this.voice, md = this.modes, sr = sampleRate;
    const o = v * K;
    const rt = vo[o + RELT];
    vo[o + REL] = -1;
    for (let s = 0; s < vo[o + WG]; s++) {
      const wi = (v * WS + s) * WK;
      if (this.wg[wi + WT60] <= rt) continue;
      this.wg[wi + WGG] = Math.pow(10, -3 * this.wg[wi + WL] / (sr * rt));
      this.wg[wi + WT60] = rt;
    }
    for (let k = 0; k < vo[o + NM]; k++) {
      const m = (v * M + k) * S;
      if (md[m + 7] <= rt) continue;
      const r = Math.exp(-LN1000 / (rt * sr));
      md[m] = 2 * r * md[m + 5];
      md[m + 1] = r * r;
      md[m + 7] = rt;
    }
  }

  /** \u982D\u306E\u584A\u3092\u4F5C\u308B\u3002\u7D42\u308F\u3063\u3066\u3044\u305F\u3089 false */
  head(v) {
    const vo = this.voice, hb = this.hb, ring = this.ring;
    const o = v * K;
    hb.fill(0);
    let pos = vo[o + POS];
    const len = vo[o + LEN];
    const comb = vo[o + COMB];
    const ci = Math.floor(comb), cf = comb - ci;
    const lpc = vo[o + LPC];
    const nz = vo[o + NOISE], vary = vo[o + VARY], amp = vo[o + AMP], felt = vo[o + FELT];
    const gn = vo[o + GN], gl = vo[o + GL], gb = v * G * 2, gr = this.grain;
    let lp1 = vo[o + LP1], lp2 = vo[o + LP2];
    let hp = vo[o + HPOS];
    let sd = this.seed[v], fr = this.free;
    const base = v * R;
    const off = vo[o + OFF];
    vo[o + OFF] = 0;
    // \u982D\u304C\u5C3D\u304D\u3066\u3082\u3001\u30ED\u30FC\u30D1\u30B9\u3068\u6ADB\u306E\u5C3E\u304C R \u30B5\u30F3\u30D7\u30EB\u6B8B\u308B
    if (pos >= len + R) return false;
    for (let i = off; i < B; i++) {
      let x = 0;
      if (pos < len) {
        let env;
        if (gn > 0) {
          // \u7C92\u306E\u5C71\u3092\u8DB3\u3057\u5408\u308F\u305B\u308B
          env = 0;
          for (let k = 0; k < gn; k++) {
            const q = pos - gr[gb + k * 2];
            if (q >= 0 && q < gl) env += gr[gb + k * 2 + 1] * Math.pow(Math.sin(Math.PI * q / gl), felt);
          }
        } else {
          env = Math.pow(Math.sin(Math.PI * pos / len), felt);
        }
        sd ^= sd << 13; sd >>>= 0; sd ^= sd >>> 17; sd ^= sd << 5; sd >>>= 0;
        fr ^= fr << 13; fr >>>= 0; fr ^= fr >>> 17; fr ^= fr << 5; fr >>>= 0;
        const a = sd / 2147483648 - 1, b = fr / 2147483648 - 1;
        // \u885D\u6483(\u6ED1\u3089\u304B\u306A\u5C71)\u3068\u96D1\u97F3\u3092\u6DF7\u305C\u308B\u3002\u64E6\u308B \u2194 \u53E9\u304F
        x = env * amp * ((1 - nz) + nz * 1.7 * ((1 - vary) * a + vary * b));
      }
      // 2 \u6BB5\u306E\u30ED\u30FC\u30D1\u30B9\u3002\u6728 \u2194 \u91D1\u5C5E
      lp1 += lpc * (x - lp1);
      lp2 += lpc * (lp1 - lp2);
      // \u6ADB\u3002\u53E9\u304F\u4F4D\u7F6E\u3067\u3001\u305D\u306E\u4F4D\u7F6E\u306B\u7BC0\u304C\u3042\u308B\u5171\u632F\u5668\u304C\u9CF4\u3089\u306A\u304F\u306A\u308B
      // \u7AEF\u6570\u306F\u524D\u5F8C 2 \u3064\u306E\u3042\u3044\u3060\u3092\u76F4\u7DDA\u3067\u57CB\u3081\u308B
      const y = comb > 0
        ? lp2 - ((1 - cf) * ring[base + ((hp - ci + R) % R)] + cf * ring[base + ((hp - ci - 1 + R) % R)])
        : lp2;
      ring[base + hp] = lp2;
      hp = (hp + 1) % R;
      hb[i] = y;
      pos++;
    }
    vo[o + POS] = pos; vo[o + LP1] = lp1; vo[o + LP2] = lp2; vo[o + HPOS] = hp;
    this.seed[v] = sd; this.free = fr;
    return true;
  }

  /**
   * 1 \u58F0\u3076\u3093\u3092 2 \u672C\u306E\u51FA\u53E3(a \u3068 b)\u3078\u8DB3\u3059\u3002\u9CF4\u308A\u7D42\u308F\u3063\u3066\u3044\u305F\u3089\u58F0\u3092\u7A7A\u3051\u308B\u3002
   * a \u306F\u5DE6\u3078\u884C\u304F\u675F\u3001b \u306F\u53F3\u3078\u884C\u304F\u675F\u3002\u3069\u3053\u306B\u7F6E\u304F\u304B\u306F\u30A8\u30F3\u30B8\u30F3\u304C\u6C7A\u3081\u308B(@p{\u2026} \u306E\u4E21\u5074)\u3002
   * \u7573\u3080\u3068\u304D\u306F\u8DB3\u3057\u7B97\u306A\u306E\u3067\u3001a + b \u304C\u3044\u3064\u3082\u58F0\u305D\u306E\u3082\u306E\u306B\u306A\u308B\u3088\u3046\u306B\u5206\u3051\u308B
   */
  render(v, a, b, t0) {
    const vo = this.voice, md = this.modes, hb = this.hb, vb = this.vb;
    const o = v * K;
    const live = this.head(v);
    const norm = vo[o + NORM];
    vb.fill(0);
    let n = vo[o + NM];
    for (let k = 0; k < n; k++) {
      const m = (v * M + k) * S;
      const a1 = md[m], a2 = md[m + 1], b = md[m + 2] * norm;
      let y1 = md[m + 3], y2 = md[m + 4];
      if (live) {
        for (let i = 0; i < B; i++) {
          const y = a1 * y1 - a2 * y2 + b * hb[i];
          y2 = y1; y1 = y; vb[i] += y;
        }
      } else {
        for (let i = 0; i < B; i++) {
          const y = a1 * y1 - a2 * y2;
          y2 = y1; y1 = y; vb[i] += y;
        }
        // \u632F\u5E45\u306E 2 \u4E57 \xD7 sin^2 \u306F y1^2 + y2^2 - 2cos y1 y2 \u3067\u3001\u4F4D\u76F8\u306B\u3088\u3089\u306A\u3044
        const s = md[m + 6];
        const e = y1 * y1 + y2 * y2 - 2 * md[m + 5] * y1 * y2;
        if (e < QUIET * QUIET * s * s) {
          // \u5916\u3059\u3002\u6700\u5F8C\u306E\u5171\u632F\u5668\u3092\u3053\u3053\u3078\u6301\u3063\u3066\u304D\u3066\u3001\u6570\u3092 1 \u3064\u6E1B\u3089\u3059
          n--;
          const last = (v * M + n) * S;
          for (let j = 0; j < S; j++) md[m + j] = md[last + j];
          k--;
          continue;
        }
      }
      md[m + 3] = y1; md[m + 4] = y2;
    }
    vo[o + NM] = n;
    const wgAlive = vo[o + WG] ? this.strings(v, live) : 0;
    // \u30D4\u30C3\u30AF\u30A2\u30C3\u30D7(\u30A8\u30EC\u30D4)\u3002\u78C1\u77F3\u306B\u8FD1\u3065\u304F\u307B\u3069\u78C1\u675F\u304C\u6025\u306B\u5897\u3048\u308B(1/\u8DDD\u96E2\xB2)\u306E\u3067\u3001\u632F\u308C\u5E45\u304C\u5927\u304D\u3044\u307B\u3069
    // \u6B6A\u307F\u3001\u5076\u6570\u500D\u97F3\u304C\u5897\u3048\u308B(\u30D0\u30FC\u30AF)\u3002\u5C0F\u3055\u3044\u632F\u308C\u3067\u306F\u7D20\u901A\u308A\u306B\u306A\u308B\u3088\u3046\u3001\u50BE\u304D\u3067\u5272\u3063\u3066\u3042\u308B\u3002
    // \u6B6A\u307F\u306E\u91CF\u306F\u632F\u308C\u5E45\u3060\u3051\u3067\u6C7A\u307E\u308B\u306E\u3067\u3001\u5F37\u304F\u5F3E\u3051\u3070\u6B6A\u307F\u3001\u6E1B\u308B\u306B\u3064\u308C\u3066\u4E38\u304F\u306A\u308B\u3002
    // \u51FA\u3059\u306E\u306F\u78C1\u675F\u3067\u306F\u306A\u304F\u3001\u305D\u306E\u5909\u5316\u306E\u901F\u3055(\u30B3\u30A4\u30EB\u306B\u8D77\u304D\u308B\u96FB\u5727)\u3002\u78C1\u675F\u306F\u7247\u5074\u3078\u5927\u304D\u304F\u632F\u308C\u308B\u306E\u3067\u3001
    // \u305D\u306E\u307E\u307E\u51FA\u3059\u3068\u76F4\u6D41\u304C\u4E57\u308A\u3001\u548C\u97F3\u3067\u540C\u3058\u5411\u304D\u306B\u7A4D\u307F\u4E0A\u304C\u3063\u3066\u3044\u305F(ff \u306E C4 \u3067\u5B9F\u52B9\u5024\u306E 0.38 \u500D)
    const pk = vo[o + PK], pd = vo[o + PD];
    if (pk > 0) {
      const off = vo[o + PO], g = PICKUP_SCALE * pk;
      const p0 = pickup(off), d0 = pickupSlope(off);
      for (let i = 0; i < B; i++) vb[i] = (pickup(off + g * vb[i]) - p0) / (d0 * g);
    }
    if (pd > 0) {
      let pv = vo[o + PV];
      for (let i = 0; i < B; i++) {
        const q = vb[i];
        vb[i] = (q - pv) * pd;
        pv = q;
      }
      vo[o + PV] = pv;
    }
    // \u97FF\u304D\u7DDA(\u30B9\u30CD\u30A2\u306E\u88CF\u306E\u7DDA)\u3002\u80F4\u306E\u63FA\u308C\u306E\u5927\u304D\u3055\u3067\u96D1\u97F3\u3092\u958B\u304F\u3002
    // \u3073\u3073\u308A(\u5931\u6557)\u3082\u540C\u3058\u5305\u7D61\u3092\u4F7F\u3046\u3002\u63FA\u308C\u304C\u5927\u304D\u3044\u3046\u3061\u3060\u3051\u3001\u5F26\u304C\u4F55\u304B\u306B\u5F53\u305F\u3063\u3066\u96D1\u97F3\u304C\u4E57\u308B\u3002
    // \u63FA\u308C\u306E\u5C71\u306E 35% \u3092\u5207\u308B\u3068\u6B62\u307E\u308A\u3001\u63FA\u308C\u306E\u5C71\u306E\u5411\u304D\u306B\u5408\u308F\u305B\u3066\u958B\u304F\u306E\u3067\u3001\u97F3\u7A0B\u306E\u5468\u671F\u3067\u8108\u6253\u3064
    const rt = vo[o + RATTLE], bzl = vo[o + BZ];
    let renv = vo[o + RENV];
    if (rt || bzl) {
      let fr = this.free, hp = vo[o + RHP], bp = vo[o + BP];
      for (let i = 0; i < B; i++) {
        const a = vb[i] < 0 ? -vb[i] : vb[i];
        renv += (a > renv ? 0.2 : 0.0015) * (a - renv);
        if (renv > bp) bp = renv;
        fr ^= fr << 13; fr >>>= 0; fr ^= fr >>> 17; fr ^= fr << 5; fr >>>= 0;
        const z = fr / 2147483648 - 1;
        // 1 \u3064\u524D\u3068\u306E\u5DEE\u3067\u4F4E\u3044\u307B\u3046\u3092\u629C\u304F\u3002\u7DDA\u306E\u97F3\u306F\u9AD8\u3044
        let add = rt * renv;
        if (bzl && renv > 0.35 * bp && a > 0.5 * renv) add += bzl * 3 * (renv - 0.35 * bp);
        vb[i] += add * (z - hp);
        hp = z;
      }
      this.free = fr; vo[o + RHP] = hp; vo[o + BP] = bp;
      if (renv < 1e-6) renv = 0;
      vo[o + RENV] = renv;
    }
    // \u982D\u3092\u305D\u306E\u307E\u307E\u805E\u304B\u305B\u308B\u3076\u3093\u3002\u97FF\u304D\u7DDA\u3088\u308A\u5F8C\u306B\u8DB3\u3059\u306E\u3067\u3001\u7DDA\u306F\u3053\u308C\u306B\u53CD\u5FDC\u3057\u306A\u3044
    if (live) {
      const dr = vo[o + DIRECT];
      if (dr) for (let i = 0; i < B; i++) vb[i] += dr * hb[i];
    }
    const lv = vo[o + LEVEL];
    // 2 \u672C\u3078\u5206\u3051\u308B\u3002\u63FA\u308C\u304C\u7121\u3051\u308C\u3070\u534A\u5206\u305A\u3064\u3002
    // \u30C8\u30EC\u30E2\u30ED\u306F\u3001\u30B9\u30FC\u30C4\u30B1\u30FC\u30B9\u306E\u30A2\u30F3\u30D7\u304C\u540C\u3058\u97F3\u3092 2 \u30C1\u30E3\u30F3\u30CD\u30EB\u3078\u914D\u3063\u3066\u3001\u7247\u65B9\u3092\u5927\u304D\u304F\u3001\u3082\u3046\u7247\u65B9\u3092
    // \u5C0F\u3055\u304F\u3059\u308B\u5F62\u3002\u4F4D\u76F8\u306F\u9006\u306B\u3057\u306A\u3044\u306E\u3067\u3001\u8DB3\u305B\u3070\u63FA\u308C\u306F\u6D88\u3048\u3066\u5143\u306E\u97F3\u306B\u623B\u308B\u3002
    // \u63FA\u308C\u306E\u4F4D\u76F8\u306F\u6587\u8108\u306E\u6642\u8A08(currentTime)\u304B\u3089\u51FA\u3059\u3002\u30CE\u30FC\u30C9\u3092\u4F5C\u3063\u305F\u6642\u523B\u3092\u8D77\u70B9\u306B\u3059\u308B\u3068\u3001
    // \u540C\u3058\u66F2\u3067\u3082\u9CF4\u3089\u3057\u65B9\u3067\u63FA\u308C\u65B9\u304C\u5909\u308F\u308B\u3002\u6642\u8A08\u304B\u3089\u51FA\u305B\u3070\u3001\u540C\u3058\u30CE\u30FC\u30C9\u306E\u58F0\u306F 1 \u53F0\u306E\u30A2\u30F3\u30D7\u306E\u3088\u3046\u306B\u63C3\u3046
    const sw = vo[o + WD] * vo[o + TD], rate = vo[o + TR];
    if (sw > 0 && rate > 0) {
      const ph = TAU * ((rate * t0) % 1), step = TAU * rate / sampleRate;
      for (let i = 0; i < B; i++) {
        const y = vb[i] * lv * 0.5, m = sw * Math.sin(ph + step * i);
        a[i] += y * (1 + m);
        b[i] += y * (1 - m);
      }
    } else {
      for (let i = 0; i < B; i++) {
        const y = vb[i] * lv * 0.5;
        a[i] += y;
        b[i] += y;
      }
    }
    if (!live && n === 0 && renv === 0 && wgAlive === 0) vo[o + ON] = 0;
  }

  process(inputs, outputs) {
    const chs = outputs[0];
    // \u51FA\u53E3\u306F 2 \u672C(\u5DE6\u3078\u884C\u304F\u675F\u3068\u53F3\u3078\u884C\u304F\u675F)\u30021 \u672C\u3057\u304B\u7121\u3051\u308C\u3070\u3001\u53F3\u306E\u675F\u306F\u8107\u3078\u7F6E\u3044\u3066\u6700\u5F8C\u306B\u8DB3\u3059
    const out = chs[0], rb = chs.length > 1 ? chs[1] : this.ob;
    out.fill(0);
    rb.fill(0);
    const sr = sampleRate;
    const t0 = currentTime;
    const tEnd = t0 + B / sr;
    const vo = this.voice;
    // \u96E2\u3059\u306E\u306F\u584A\u306E\u5883\u76EE\u3067\u3002\u305A\u308C\u306F 2.9 \u30DF\u30EA\u79D2\u307E\u3067
    for (let v = 0; v < V; v++) {
      const o = v * K;
      if (vo[o + ON] && vo[o + REL] >= 0 && vo[o + REL] < tEnd) this.release(v);
    }
    while (this.at < this.events.length && this.events[this.at].s0 < tEnd) {
      const ev = this.events[this.at++];
      this.start(ev, Math.max(0, Math.min(B - 1, Math.round((ev.s0 - t0) * sr))));
    }
    for (let v = 0; v < V; v++) if (vo[v * K + ON]) this.render(v, out, rb, t0);
    // \u6B62\u3081\u3066\u3044\u308B\u6700\u4E2D\u306A\u3089\u3001\u3077\u3064\u3063\u3068\u9CF4\u3089\u306A\u3044\u3088\u3046 10 \u30DF\u30EA\u79D2\u3067\u843D\u3068\u3059
    if (this.cutAt >= 0) {
      const len = Math.max(1, Math.round(sr * 0.01));
      for (let i = 0; i < out.length; i++) {
        const k = Math.max(0, 1 - this.cutAt / len);
        out[i] *= k;
        rb[i] *= k;
        this.cutAt++;
      }
      if (this.cutAt >= len) { vo.fill(0); this.cutAt = -1; }
    }
    if (chs.length === 1) for (let i = 0; i < out.length; i++) out[i] += rb[i];
    // 3 \u672C\u76EE\u304B\u3089\u5148\u306F\u4F7F\u308F\u306A\u3044
    for (let c = 2; c < chs.length; c++) chs[c].fill(0);
    return true;
  }
}
registerProcessor('${MODAL_NODE}', ModalBank);
`;
  function rng(seed) {
    let a = seed | 0 || 1;
    return () => {
      a = a + 1831565813 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var MEMBRANE = [
    1,
    1.594,
    2.136,
    2.296,
    2.653,
    2.918,
    3.156,
    3.501,
    3.6,
    3.652,
    4.06,
    4.154,
    4.23,
    4.601,
    4.651,
    4.832,
    5.061,
    5.131,
    5.412,
    5.473
  ];
  var MODAL_PATCHES = {
    brush: {
      note: "Wire brush on a snare. Mostly the sweep heard straight through, a short drum body and wires underneath.",
      series: "membrane",
      pitched: false,
      base: 190,
      // 頭は 16 粒を 6ms に散らす。線が何十本もずれて当たる「パシャ」。前は 9ms の山 1 つで、
      // 大きさと帯域は同じまま、粒立ちだけが加わる(2026-10-05)。sharp は粒 1 つの長さ
      head: { sharp: 2, bright: 0.86, comb: 0.18, noise: 0.95, vary: 0.8, seed: 7, grains: 16, scatter: 6 },
      count: 20,
      tilt: 0.6,
      warp: 1,
      spread: 0.02,
      seed: 3,
      t60: 0.22,
      damp: 0.6,
      release: 0.1,
      direct: 0.32,
      rattle: 1.6,
      level: 0.9,
      // 失敗: ときどきワイヤーがばらけて当たる
      splay: 0.1,
      flawSeed: 1,
      range: {
        "head.sharp": [0.8, 4],
        "head.bright": [0.7, 0.95],
        "head.comb": [0, 0.4],
        "head.noise": [0.7, 1],
        "head.vary": [0.3, 1],
        "head.seed": [1, 9999],
        "head.grains": [4, 32],
        "head.scatter": [1, 14],
        count: [8, 60],
        tilt: [0.2, 1.2],
        warp: [0.85, 1.15],
        spread: [0, 0.08],
        seed: [1, 9999],
        t60: [0.08, 0.6],
        damp: [0, 3],
        release: [0.05, 0.3],
        direct: [0.1, 0.6],
        rattle: [0.5, 3],
        level: [0.3, 2],
        splay: [0, 0.4],
        flawSeed: [1, 9999]
      },
      macros: {
        fan: {
          note: "How wide the wires of the brush are fanned out. 0 is a narrow, gathered fan with a tight, focused tap. 2 is a wide fan whose wires land spread out, softer and splashier.",
          min: 0,
          max: 2,
          neutral: {
            "head.grains": 6,
            "head.scatter": 2,
            "head.sharp": 1.2,
            "head.bright": 0.9
          },
          levelDb: [-6.4, 2.6]
        }
      }
    },
    brushSweep: {
      note: "Wire brush swept in circles on a snare. A long, slightly muffled scrape heard straight through, centred near 3 kHz; the drum body and wires barely sound.",
      // ブラシの擦る音。叩く音(brush)と同じ作りで、頭だけが違う。前は聞くページの側で
      // 頭を上書きしていたので、頭のパラメータが効かず、MML からも呼べなかった(2026-10-05)。
      // 小さな櫛で低いところを削り、3kHz 前後を持ち上げている。削らないと 1kHz より下の
      // 「ゴー」が強く、曲の中で浮いた。前は 6kHz 前後に寄せていたが、きれいすぎて
      // こもった感じが無かった。櫛を少し長くし、明るさも下げた(2026-10-05)。
      // 大きさは測った値(RMS)では前より 3dB 小さい。耳は 3kHz あたりがいちばん敏感なので、
      // 下げた帯域へ寄せると同じ RMS でも大きく聞こえる。セッションの中で大きかった
      series: "membrane",
      pitched: false,
      base: 190,
      // align 1: 頭が 260ms かけてふくらむので、そのままだと 0.1 秒以上遅れて聞こえる。
      // ドラマーは手を拍より前から動かして、いちばん鳴るところを拍に合わせる
      head: { sharp: 260, bright: 0.72, comb: 0.03, noise: 1, vary: 0.8, seed: 7, align: 1 },
      count: 20,
      tilt: 0.6,
      warp: 1,
      spread: 0.02,
      seed: 3,
      t60: 0.22,
      damp: 0.6,
      release: 0.1,
      direct: 0.32,
      rattle: 1.6,
      level: 0.9,
      range: {
        "head.sharp": [120, 300],
        "head.bright": [0.6, 0.9],
        "head.comb": [5e-3, 0.04],
        "head.noise": [0.85, 1],
        "head.vary": [0.3, 1],
        "head.seed": [1, 9999],
        "head.align": [0, 1],
        count: [8, 60],
        tilt: [0.2, 1.2],
        warp: [0.85, 1.15],
        spread: [0, 0.08],
        seed: [1, 9999],
        t60: [0.08, 0.6],
        damp: [0, 3],
        release: [0.05, 0.3],
        direct: [0.15, 0.6],
        rattle: [0.5, 3],
        level: [0.3, 2]
      }
    },
    bass: {
      note: "Upright bass, plucked. A finger strike with plenty of finger noise, heavy loss in the highs, a long ring, muted when let go. Fitted to recordings of a plucked double bass.",
      // 録音(アイオワ大学のコントラバスのピチカート、E1〜C4 を 3 つの強さ)に寄せた(2026-10-05)。
      // 前は 1 秒で 25dB 落ちていたが、録音は 10〜20dB。弱く弾いた C4 が録音より 17dB 小さかった。
      // 頭の山が長く(約 5ms)、その形が 300Hz あたりを打ち消していたため。
      // hardKey を 60Hz から効かせて、高い音ほど頭を短くしている。
      // 雑音が多いのは、録音に指の擦れが入っているぶん
      series: "string",
      pitched: true,
      head: { sharp: 4, bright: 0.875, comb: 0.226, noise: 0.6, vary: 0.3, seed: 11, velo: 0, felt: 1.13, hardKey: 0.5, hardFrom: 60 },
      count: 35,
      stretch: 6e-4,
      strings: 1,
      detune: 0,
      tilt: 0.635,
      warp: 1,
      spread: 0,
      t60: 5.07,
      decayKey: 0.175,
      damp: 20,
      release: 0.09,
      direct: 0,
      rattle: 0,
      level: 0.37,
      // 失敗: 強く弾くとときどきびびり、ときどき指がすべり、弱いときにときどき鳴らしそこねる
      buzz: 0.08,
      buzzLevel: 0.3,
      slip: 0.04,
      ghost: 0.03,
      flawSeed: 1,
      range: {
        "head.sharp": [2, 8],
        "head.bright": [0.6, 0.95],
        "head.comb": [0.1, 0.35],
        "head.noise": [0.2, 0.8],
        "head.vary": [0, 0.6],
        "head.seed": [1, 9999],
        "head.velo": [0, 1.5],
        "head.felt": [0, 3],
        "head.hardKey": [0, 1],
        "head.hardFrom": [40, 120],
        count: [12, 60],
        stretch: [0, 1e-3],
        strings: [1, 2],
        detune: [0, 3],
        tilt: [0.4, 1.2],
        warp: [0.95, 1.05],
        spread: [0, 0.02],
        t60: [2.5, 8],
        decayKey: [0, 0.5],
        damp: [8, 20],
        release: [0.05, 0.2],
        direct: [0, 0.1],
        rattle: [0, 0],
        level: [0.2, 0.7],
        buzz: [0, 0.4],
        buzzLevel: [0.2, 1.2],
        slip: [0, 0.2],
        ghost: [0, 0.2],
        flawSeed: [1, 9999]
      },
      macros: {
        // 0 は録音に寄せる前の値。丸く短い音で、曲の中で邪魔をしない
        upright: {
          note: "How much it sounds like a plucked upright bass. 1 is the default, fitted to recordings. 0 is a soft, round, short thump with little finger noise, closer to a muted electric bass. Above 1 the finger noise, the brightness and the ring grow.",
          min: 0,
          max: 2,
          neutral: {
            "head.bright": 0.42,
            "head.comb": 0.18,
            "head.noise": 0.08,
            "head.felt": 0,
            "head.hardKey": 0,
            stretch: 8e-5,
            tilt: 0.7,
            t60: 2.6,
            decayKey: 0,
            damp: 9
          },
          // 2 では雑音が増えて基音が細り、7dB 小さく聞こえる
          levelDb: [-0.9, 7.2]
        }
      }
    },
    piano: {
      note: "Piano-like. Stiff strings in pairs that beat and fall in two stages, a felt hammer whose brightness follows the velocity, and a wooden knock. Fitted to recordings of a grand piano.",
      series: "string",
      pitched: true,
      head: { sharp: 0.74, bright: 0.68, comb: 0.125, noise: 0.05, vary: 0.2, seed: 5, velo: 4.1, hardKey: 0.22, felt: 3.1 },
      count: 100,
      stretch: 7e-4,
      stretchKey: 1.25,
      strings: 2,
      detune: 1.2,
      tilt: 0.63,
      warp: 1,
      spread: 0,
      guide: 523,
      knock: 0.25,
      sour: 0,
      sourSeed: 1,
      t60: 4.1,
      decayKey: 0.36,
      after: 4.8,
      afterLevel: 0.42,
      damp: 0.63,
      release: 0.25,
      direct: 0,
      rattle: 0,
      trebleGain: 3.5,
      level: 0.16,
      // 失敗: ときどきとなりの鍵盤も押し、ときどきハンマーが二度当たり、まれに弦がびびる
      neighbor: 0.03,
      double: 0.02,
      buzz: 0.02,
      buzzLevel: 0.3,
      flawSeed: 1,
      range: {
        "head.sharp": [0.5, 2.5],
        "head.bright": [0.55, 0.8],
        "head.comb": [0.1, 0.15],
        "head.noise": [0, 0.12],
        "head.vary": [0, 0.5],
        "head.seed": [1, 9999],
        "head.velo": [2.5, 6],
        "head.hardKey": [0.2, 1.2],
        "head.felt": [1, 5],
        count: [40, 160],
        stretch: [2e-4, 15e-4],
        stretchKey: [0.8, 2],
        strings: [2, 3],
        detune: [0.3, 3],
        tilt: [0.5, 1.6],
        warp: [0.98, 1.02],
        spread: [0, 5e-3],
        guide: [300, 900],
        knock: [0.1, 0.5],
        sour: [0, 15],
        sourSeed: [1, 9999],
        t60: [2, 8],
        decayKey: [0.2, 0.8],
        after: [2, 8],
        afterLevel: [0.2, 0.8],
        damp: [0.2, 0.8],
        release: [0.12, 0.5],
        direct: [0, 0.05],
        rattle: [0, 0],
        trebleGain: [0, 8],
        level: [0.12, 0.8],
        neighbor: [0, 0.2],
        double: [0, 0.15],
        buzz: [0, 0.2],
        buzzLevel: [0.1, 1],
        flawSeed: [1, 9999]
      },
      macros: {
        // ちゃんとしたピアノの中での違いを 3 本。どちらの端もピアノのまま、
        // 性格だけが変わる。ソロで聞いて分かる違いのうち、声の中で作れるもの(2026-10-05)。
        // 響板、ペダルの共鳴、部屋、マイクの距離は声の外なので入れない
        voicing: {
          note: "Voicing of the hammers, as a piano technician does it. 0 is soft and round, 2 is hard and bright.",
          min: 0,
          max: 2,
          neutral: {
            "head.felt": 0.5,
            "head.bright": 0.55,
            "head.hardKey": 0,
            knock: 0.15
          },
          // 大きさの補正(dB)。0 のときと max のとき。1 では 0。測って決めた(C3・C4・C5 の平均)
          levelDb: [2.6, -1.2]
        },
        size: {
          note: "Size of the instrument. 0 is an upright with short, stiff strings and a shorter ring. 2 leans to a concert grand with long strings.",
          min: 0,
          max: 2,
          neutral: {
            stretch: 16e-4,
            t60: 2.2,
            after: 3
          },
          levelDb: [1.7, -0.8]
        },
        unison: {
          note: "How the strings of one key agree. 0 is a single dry, pure string. 2 is a fuller sound from strings slightly apart.",
          min: 0,
          max: 2,
          neutral: {
            afterLevel: 0,
            detune: 0
          },
          levelDb: [-0.3, 0.5]
        }
      }
    },
    rhodes: {
      note: "Electric piano with tines, like a Rhodes. A neoprene hammer strikes a thin tine; the metallic ping dies fast and the round tone of the tone bar stays. Played hard, the pickup barks.",
      // まだ録音に寄せていない。値は見当(2026-10-06)。
      // 頭はネオプレンのハンマー。強いほど短く明るくなり、ティンの上の倍音(キン)が出る。
      // 高い音ほど短く当てる(hardKey を C3 から効かせる)。前は C3 でしか「キン」が聞こえなかった。
      // 頭の山の形が 900Hz あたりを打ち消していて、C4 から上では 6.27 倍の倍音がそこへ入っていた
      // (C4 で基音より 37dB 下。いまは C3 から C5 まで 6〜13dB 下)
      series: "tine",
      pitched: true,
      head: { sharp: 1.2, bright: 0.66, comb: 0.06, noise: 0.03, vary: 0.2, seed: 9, velo: 3.2, hardKey: 0.9, hardFrom: 130, felt: 2 },
      // tilt はティンの振れ(変位)の傾き。ピックアップが変化の速さを拾うので、上の倍音は高さの倍率ぶん
      // 強く出る。その 1 ぶんを足して、磁束のまま出していたとき(0.5)と同じ釣り合いにしてある
      count: 6,
      tilt: 1.5,
      warp: 1,
      spread: 0,
      seed: 1,
      // ティンとトーンバーで、1 音に 2 本鳴る。detune・after・afterLevel は strings が 2 以上で効く決まりなので 2 にする
      // (tine の並びは strings の数を読まない)
      strings: 2,
      detune: 0.8,
      after: 1.8,
      afterLevel: 0.6,
      t60: 5,
      decayKey: 0.5,
      damp: 0.15,
      release: 0.22,
      direct: 0,
      rattle: 0,
      pickup: 0.7,
      pickupOffset: 0.1,
      level: 0.23,
      // スーツケースのアンプのトレモロ。2 チャンネルへ配って交互に大きくする。値は見当(2026-10-07)
      width: 1,
      tremolo: 0.5,
      tremoloRate: 4.5,
      range: {
        "head.sharp": [0.8, 3],
        "head.bright": [0.5, 0.8],
        "head.comb": [0, 0.15],
        "head.noise": [0, 0.1],
        "head.vary": [0, 0.5],
        "head.seed": [1, 9999],
        "head.velo": [2, 5],
        "head.hardKey": [0.5, 1.3],
        "head.hardFrom": [100, 200],
        "head.felt": [0.5, 4],
        count: [3, 6],
        tilt: [1.2, 2],
        warp: [0.97, 1.03],
        spread: [0, 0.01],
        seed: [1, 9999],
        strings: [2, 2],
        detune: [0, 3],
        after: [1, 3],
        afterLevel: [0.15, 1],
        t60: [3, 9],
        decayKey: [0.2, 0.8],
        damp: [0, 0.5],
        release: [0.12, 0.4],
        direct: [0, 0.05],
        rattle: [0, 0],
        pickup: [0, 1.2],
        pickupOffset: [-0.2, 0.3],
        level: [0.1, 0.6],
        width: [0.5, 1],
        tremolo: [0, 1],
        tremoloRate: [2, 8]
      },
      macros: {
        // 0 はピックアップとトーンバーを抜いた音。金属の棒をハンマーで叩いて生音で聞く楽器で、
        // チェレスタ(鍵盤で鳴らす鉄琴)に近い。本物から取れる端なので、ここを 0 にした
        rhodes: {
          note: "How much it sounds like a Rhodes. 1 is the default. 0 takes away the pickup and most of the tone bar and hardens the hammer: a struck metal bar heard acoustically, close to a celesta. Above 1 the bark, the metallic ping and the ring of the tone bar all grow.",
          min: 0,
          max: 2,
          neutral: {
            pickup: 0,
            pickupOffset: 0,
            afterLevel: 0.15,
            after: 1,
            t60: 2.5,
            "head.sharp": 0.8,
            "head.velo": 1.5,
            "head.felt": 0.5,
            "head.bright": 0.75
          },
          // 0 はピックアップもトーンバーも抜けて 8dB 小さく、2 は 11dB 大きく出る。
          // C3・C4・C5 を強さ 0.4・0.7・1 で 1 秒ずつ鳴らした実効値を、1 と比べた(2026-10-07)
          levelDb: [7.9, -11.1]
        }
      }
    },
    ride: {
      note: "Ride cymbal. A dense cloud of long, inharmonic modes struck by a stick tip.",
      series: "cymbal",
      pitched: false,
      base: 300,
      head: { sharp: 0.5, bright: 0.84, comb: 0, noise: 0.25, vary: 0.4, seed: 19 },
      count: 140,
      lo: 1.1,
      hi: 38,
      tilt: 0.25,
      warp: 1,
      spread: 0,
      seed: 23,
      t60: 3.5,
      damp: 4e-3,
      release: 0.6,
      direct: 0.04,
      rattle: 0,
      level: 0.06,
      // 失敗: ときどき縁寄りかカップ寄りに当たる
      spot: 0.1,
      flawSeed: 1,
      range: {
        "head.sharp": [0.3, 1.5],
        "head.bright": [0.75, 0.95],
        "head.comb": [0, 0.1],
        "head.noise": [0.1, 0.5],
        "head.vary": [0.1, 0.8],
        "head.seed": [1, 9999],
        count: [60, 200],
        lo: [1, 2],
        hi: [20, 45],
        tilt: [0.1, 0.5],
        warp: [0.9, 1.1],
        spread: [0, 0.05],
        seed: [1, 9999],
        t60: [2, 6],
        damp: [0, 0.02],
        release: [0.3, 1],
        direct: [0, 0.1],
        rattle: [0, 0],
        level: [0.03, 0.12],
        spot: [0, 0.4],
        flawSeed: [1, 9999]
      },
      macros: {
        ride: {
          note: "How much it sounds like a ride cymbal. 1 is the default ride. 0 leaves a short, dark, narrow cluster, closer to a small bell or a cowbell. Above 1 the wash grows longer and brighter. The number of resonators is set apart, by the steps.",
          min: 0,
          max: 2,
          neutral: {
            t60: 0.4,
            tilt: 1.5,
            hi: 6,
            lo: 1,
            damp: 0.1,
            "head.bright": 0.5,
            "head.noise": 0
          }
        }
      }
    }
  };
  var TINE = [1, 6.267, 17.547, 34.386, 56.843, 84.913];
  var TINE_DECAY = [1, 0.12, 0.05, 0.03, 0.02, 0.015];
  var KNOCK = [[110, 1, 0.06], [290, 0.7, 0.04], [620, 0.5, 0.03], [1400, 0.35, 0.02]];
  function modalTable(def) {
    const out = [];
    const r = rng(def.seed || 1);
    const warp = def.warp == null ? 1 : def.warp;
    const spread = def.spread || 0;
    const tilt = def.tilt == null ? 1 : def.tilt;
    const count = Math.max(1, Math.min(MODAL_MODES, def.count | 0 || 1));
    const push = (ratio, amp, dec, h = 0) => {
      let x = Math.pow(ratio, warp);
      if (spread) x *= 1 + spread * (r() * 2 - 1);
      out.push(x, amp, dec, h);
    };
    if (def.series === "string") {
      const strings = Math.max(1, def.strings | 0 || 1);
      const per = Math.max(1, Math.floor(count / strings));
      for (let s = 0; s < strings; s++) {
        const c = strings === 1 ? 0 : (def.detune || 0) * (s / (strings - 1) - 0.5) * 2;
        const k = Math.pow(2, c / 1200);
        const dec = s === 0 ? 1 : def.after || 1;
        const lv = s === 0 ? 1 : def.afterLevel ?? 1;
        const share = 1 + (strings - 1) * (def.afterLevel ?? 1);
        for (let n = 1; n <= per; n++) {
          push(n * k, lv / (Math.pow(n, tilt) * share), dec, n);
        }
      }
    } else if (def.series === "membrane") {
      for (let n = 0; n < count; n++) {
        const ratio = n < MEMBRANE.length ? MEMBRANE[n] : MEMBRANE[MEMBRANE.length - 1] * (1 + 0.08 * (n - MEMBRANE.length + 1));
        push(ratio, (0.5 + 0.5 * r()) / Math.pow(n + 1, tilt), 1 / (1 + 0.15 * n));
      }
    } else if (def.series === "tine") {
      for (let n = 0; n < Math.min(count, TINE.length); n++) push(TINE[n], 1 / Math.pow(TINE[n], def.tilt ?? 1), TINE_DECAY[n]);
      if ((def.afterLevel ?? 0) > 0) push(Math.pow(2, (def.detune || 0) / 1200), def.afterLevel, def.after || 1);
    } else {
      const lo = def.lo || 1, hi = Math.max(lo * 1.01, def.hi || 40);
      for (let n = 0; n < count; n++) {
        const u = Math.pow(r(), 0.6);
        const ratio = Math.exp(Math.log(lo) + (Math.log(hi) - Math.log(lo)) * u);
        push(ratio, (0.3 + 0.7 * r()) / Math.pow(ratio / lo, tilt), 0.5 + r());
      }
    }
    if (def.knock) for (const [f, a, t] of KNOCK) out.push(f, a * def.knock, t, -1);
    return out;
  }
  function compileModal(def) {
    const h = def.head || {};
    return {
      table: modalTable(def),
      base: def.base || 220,
      head: {
        sharp: h.sharp ?? 2,
        bright: h.bright ?? 0.6,
        comb: h.comb ?? 0,
        noise: h.noise ?? 0,
        vary: h.vary ?? 0,
        seed: h.seed ?? 1,
        velo: h.velo ?? 1.5,
        hardKey: h.hardKey ?? 0,
        hardFrom: h.hardFrom ?? 261.63,
        felt: h.felt ?? 0,
        align: h.align ?? 0,
        grains: h.grains ?? 0,
        scatter: h.scatter ?? 0
      },
      pitched: !!def.pitched,
      trebleGain: def.trebleGain ?? 0,
      tilt: def.tilt ?? 1,
      sour: def.sour ?? 0,
      sourSeed: def.sourSeed ?? 1,
      guide: def.series === "string" ? def.guide ?? 0 : 0,
      strings: def.strings ?? 1,
      detune: def.detune ?? 0,
      after: def.after ?? 1,
      afterLevel: def.afterLevel ?? 1,
      stretch: def.stretch ?? 0,
      stretchKey: def.stretchKey ?? 0,
      decayKey: def.decayKey ?? 0,
      t60: def.t60 ?? 2,
      damp: def.damp ?? 0,
      release: def.release ?? 0.15,
      direct: def.direct ?? 0,
      rattle: def.rattle ?? 0,
      pickup: def.pickup ?? 0,
      pickupOffset: def.pickupOffset ?? 0,
      // 振れではなく振れの速さを出す(ティン)。並びで決まるのでパラメータにはしない
      speed: def.series === "tine",
      width: def.width ?? 0,
      tremolo: def.tremolo ?? 0,
      tremoloRate: def.tremoloRate ?? 0,
      neighbor: def.neighbor ?? 0,
      double: def.double ?? 0,
      buzz: def.buzz ?? 0,
      buzzLevel: def.buzzLevel ?? 0.4,
      slip: def.slip ?? 0,
      ghost: def.ghost ?? 0,
      splay: def.splay ?? 0,
      spot: def.spot ?? 0,
      flawSeed: def.flawSeed ?? 1,
      level: (def.level ?? 0.5) * Object.values(def.macroLevel || {}).reduce((a, b) => a * b, 1)
    };
  }

  // engine/sound/brass.js
  var BRASS_NODE = "mmsxx-brass";
  var BRASS_VOICES = 16;
  var BRASS_HOLD = 1;
  var BRASS_CODE = `
const V = ${BRASS_VOICES};
const B = 128;
// \u660E\u308B\u3055\u3068\u97F3\u7A0B\u3092\u4F5C\u308A\u76F4\u3059\u9593\u9694
const SUB = 16;
const TAU = Math.PI * 2;
// \u58F0\u306E\u6301\u3061\u7269(\u5E73\u3089\u306A\u914D\u5217\u306E\u4E2D\u306E\u4F4D\u7F6E)
const ON = 0, PH = 1, P = 2, TGT = 3, AGE = 4, REL = 5, F0 = 6, VEL = 7,
  K = 8, DC = 9, NRM = 10, INC = 11, LP = 12, BORN = 13, GONE = 14, OFF = 15, SC = 16, ST = 17,
  CR = 18, CD = 19, PG = 20, KG = 21, WR = 22, FR = 23, FS = 24, FE = 25, SG = 26;
const W = 27;

/** e^-x I0(x)\u3002\u6307\u6570\u3067\u5272\u3063\u305F\u5F62\u3067\u6301\u3064\u3068\u3001\u5927\u304D\u306A x \u3067\u3082\u6841\u304C\u3042\u3075\u308C\u306A\u3044 */
function i0e(x) {
  if (x < 15) {
    let s = 1, t = 1;
    const q = x * x / 4;
    for (let m = 1; m < 60; m++) {
      t *= q / (m * m);
      s += t;
      if (t < s * 1e-12) break;
    }
    return s * Math.exp(-x);
  }
  return (1 + 1 / (8 * x) + 9 / (128 * x * x)) / Math.sqrt(TAU * x);
}

/**
 * \u9CF4\u3089\u3059\u97F3\u304C\u3001\u7BA1\u306E\u4F55\u756A\u76EE\u306E\u500D\u97F3\u304B\u3002\u30B9\u30E9\u30A4\u30C9\u3084\u30D0\u30EB\u30D6\u3067\u7BA1\u304C\u4F38\u3073\u308B\u3068\u3001\u500D\u97F3\u306E\u4E26\u3073\u306E\u57FA\u97F3\u306F
 * pedal \u304B\u3089\u6700\u5927 6 \u534A\u97F3\u4E0B\u304C\u308B\u3002\u57FA\u97F3\u304C pedal \u4EE5\u4E0B\u306B\u53CE\u307E\u308B\u3001\u3044\u3061\u3070\u3093\u5C0F\u3055\u3044\u756A\u53F7\u306B\u3059\u308B
 * (\u4E38\u3081\u308B\u3068\u3001\u4F4E\u3044\u97F3\u3067\u756A\u53F7\u304C 1 \u3064\u5C0F\u3055\u304F\u51FA\u3066\u3001\u88CF\u8FD4\u308A\u306E\u8DF3\u3073\u5E45\u304C\u5927\u304D\u3059\u304E\u305F)
 */
function partialOf(f0, pedal) { return Math.max(1, Math.ceil(f0 / pedal - 1e-6)); }

/**
 * \u500D\u97F3\u306E\u756A\u53F7\u306B\u3088\u308B\u5916\u308C\u3084\u3059\u3055\u3002\u756A\u53F7\u304C\u5927\u304D\u3044\u307B\u3069\u3068\u306A\u308A\u306E\u500D\u97F3\u304C\u8FD1\u304F\u3001\u5507\u304C\u5C11\u3057\u305A\u308C\u308B\u3060\u3051\u3067
 * \u96A3\u306B\u4E57\u308B\u3002\u4F4E\u3044\u97F3\u306F\u3068\u306A\u308A\u304C\u9060\u304F(\u30AA\u30AF\u30BF\u30FC\u30D6\u30015 \u5EA6)\u3001\u3081\u3063\u305F\u306B\u5916\u3055\u306A\u3044\u30026 \u756A\u76EE\u3067 1
 */
function slip(n) { return Math.min(2, Math.pow(n / 6, 1.5)); }

class BrassBank extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    this.voice = new Float64Array(V * W);
    this.patch = p.patches || {};
    this.def = new Array(V).fill(null);
    this.events = [];
    this.at = 0;
    this.born = 0;
    this.noise = 0x2545f491;
    this.cutAt = -1;
    // \u30D1\u30C3\u30C1\u3054\u3068\u306E\u3001\u524D\u306E\u97F3\u306E\u9AD8\u3055(\u88CF\u8FD4\u308A\u306E\u8DF3\u8E8D\u3068\u7A2E\u306B\u4F7F\u3046)
    this.last = {};
    this.add(p.events || []);
    this.port.onmessage = (e) => {
      const d = e.data || {};
      if (d.patch) this.patch[d.patch] = d.def;
      if (d.add) this.add(d.add);
      if (d.cut) { this.events = []; this.at = 0; this.cutAt = 0; }
    };
  }

  add(list) {
    if (!list.length) return;
    const rest = this.events.slice(this.at).concat(list);
    rest.sort((a, b) => a.t - b.t);
    this.events = rest;
    this.at = 0;
  }

  pick() {
    const vo = this.voice;
    let best = 0, oldest = Infinity;
    for (let v = 0; v < V; v++) {
      const o = v * W;
      if (!vo[o + ON]) return v;
      if (vo[o + BORN] < oldest) { oldest = vo[o + BORN]; best = v; }
    }
    return best;
  }

  start(ev, off) {
    const def = this.patch[ev.p];
    if (!def) return;
    const v = this.pick();
    const o = v * W;
    const vo = this.voice;
    vo.fill(0, o, o + W);
    vo[o + ON] = 1;
    vo[o + F0] = ev.f || 440;
    vo[o + VEL] = ev.v == null ? 0.8 : Math.max(0, Math.min(1, ev.v));
    vo[o + TGT] = vo[o + VEL];
    // \u9577\u3055\u3092\u66F8\u304B\u306A\u3044\u97F3\u306F BRASS_HOLD \u79D2\u3067\u96E2\u3059\u3002\u5439\u304D\u3063\u3071\u306A\u3057\u306B\u306F\u3057\u306A\u3044
    vo[o + REL] = ev.t + (ev.d == null ? ${BRASS_HOLD} : ev.d);
    vo[o + BORN] = ++this.born;
    vo[o + OFF] = off;
    // \u97F3\u3054\u3068\u306B\u3001\u3069\u3053\u304B\u3089\u5165\u308B\u304B\u3092\u4E0A\u66F8\u304D\u3067\u304D\u308B\u3002\u524D\u306E\u97F3\u306E\u9AD8\u3055\u304B\u3089\u5165\u308C\u308C\u3070\u30B9\u30E9\u30A4\u30C9\u306B\u306A\u308B
    vo[o + SC] = ev.s == null ? def.scoop : ev.s;
    vo[o + ST] = ev.st == null ? def.scoopTime : ev.st;
    vo[o + NRM] = 1;
    vo[o + SG] = 1;
    // \u9AD8\u3044\u97F3\u307B\u3069\u62BC\u3057\u304C\u5F37\u3044\u3002A4 \u3067 1\u3001\u534A\u5206\u304B\u3089 2 \u500D\u307E\u3067\u306B\u53CE\u3081\u308B
    const f0 = vo[o + F0], vel = vo[o + VEL];
    const reg = Math.min(2, Math.max(0.5, Math.sqrt(f0 / 440)));
    vo[o + PG] = (def.push || 0) * vel * reg;
    // \u97F3\u306E\u9AD8\u3055\u306B\u3088\u308B\u5927\u304D\u3055\u306E\u5DEE\u3002A4 \u3092\u57FA\u6E96\u306B\u30011 \u30AA\u30AF\u30BF\u30FC\u30D6\u306B\u3064\u304D keyGain dB
    vo[o + KG] = def.keyGain ? Math.pow(10, def.keyGain * Math.log2(f0 / 440) / 20) : 1;
    vo[o + CR] = 1;
    vo[o + CD] = 0;
    const last = this.last[ev.p];
    if (def.crack > 0 && def.pedal > 0) {
      const n = partialOf(f0, def.pedal);
      // \u8DF3\u8E8D(\u30AA\u30AF\u30BF\u30FC\u30D6\u3067 1 \u307E\u3067)\u3002\u524D\u306E\u97F3\u304C\u7121\u3051\u308C\u3070\u4E2D\u304F\u3089\u3044\u3068\u898B\u308B
      const leap = last ? Math.min(1, Math.abs(Math.log2(f0 / last))) : 0.5;
      const chance = Math.min(1, def.crack * vel * slip(n) * (0.5 + 1.5 * leap));
      let h = (Math.round(f0 * 10) | 0) ^ Math.imul(ev.k == null ? Math.round((last || 0) * 10) | 0 : 0, 0x85ebca6b) ^ Math.imul(def.crackSeed | 0, 0x9e3779b1) ^ Math.imul((ev.k ?? -1) + 1, 0x27d4eb2f);
      const u = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
      if (u() < chance) {
        // \u591A\u304F\u306F\u4E0A\u306E\u500D\u97F3\u3078\u3002\u3044\u3061\u3070\u3093\u4E0B\u306E\u500D\u97F3\u304B\u3089\u306F\u4E0A\u306B\u3057\u304B\u884C\u3051\u306A\u3044
        const up = n < 2 || u() < 0.7;
        vo[o + CR] = (n + (up ? 1 : -1)) / n;
        vo[o + CD] = def.crackTime * (0.6 + 0.8 * u());
      }
    }
    // \u30AD\u30FC\u30AF\u3002\u30EA\u30FC\u30C9\u304C\u9CF4\u308A\u305D\u3053\u306D\u3066\u3001\u72D9\u3063\u305F\u97F3\u306E\u500D\u97F3\u306E\u3046\u3061 2.8kHz \u306B\u8FD1\u3044\u3082\u306E\u3067\u300C\u30AD\u30C3\u300D\u3068\u9CF4\u308B\u3002
    // \u51FA\u3060\u3057\u306E\u88CF\u8FD4\u308A\u304C\u8D77\u304D\u306A\u304B\u3063\u305F\u97F3\u3060\u3051\u3002\u8DF3\u8E8D\u306E\u3042\u3068\u3068\u3001\u5F37\u3044\u97F3\u3067\u8D77\u304D\u3084\u3059\u3044
    if (def.squeak > 0 && vo[o + CD] === 0) {
      const leap = last ? Math.min(1, Math.abs(Math.log2(f0 / last))) : 0.5;
      const chance = Math.min(1, def.squeak * vel * (0.5 + 1.5 * leap));
      let q = (Math.round(f0 * 10) | 0) ^ Math.imul(ev.k == null ? Math.round((last || 0) * 10) | 0 : 0, 0x2c1b3c6d) ^ Math.imul(def.crackSeed | 0, 0x297a2d39) ^ Math.imul((ev.k ?? -1) + 1, 0x165667b1);
      const u = () => { q = Math.imul(q ^ (q >>> 15), 2246822507); q = Math.imul(q ^ (q >>> 13), 3266489909); q ^= q >>> 16; return (q >>> 0) / 4294967296; };
      if (u() < chance) {
        vo[o + CR] = Math.max(2, Math.round(2800 / f0));
        vo[o + CD] = def.crackTime * (0.5 + 0.5 * u());
        // \u9CF4\u308A\u305D\u3053\u306D\u305F\u4E00\u77AC\u306E\u97F3\u306A\u306E\u3067\u3001\u5143\u306E\u97F3\u307B\u3069\u5927\u304D\u304F\u306A\u3044\u3002\u5143\u306E\u5927\u304D\u3055\u306E\u307E\u307E\u3060\u3068\u3001\u8033\u304C\u3044\u3061\u3070\u3093\u654F\u611F\u306A
        // 2.8kHz \u3042\u305F\u308A\u306B\u80F4\u306E\u9AD8\u3044\u5C71\u3082\u91CD\u306A\u3063\u3066\u3001\u672C\u7269\u3088\u308A\u305A\u3063\u3068\u3046\u308B\u3055\u304F\u805E\u3053\u3048\u305F(2026-10-07)
        vo[o + SG] = 0.3;
      }
    }
    this.last[ev.p] = f0;
    // \u9014\u4E2D\u306E\u88CF\u8FD4\u308A\u306E\u7A2E\u3068\u3001\u8DF3\u306D\u3066\u3044\u308B\u3042\u3044\u3060\u306E\u500D\u97F3\u306E\u6BD4\u30FB\u59CB\u307E\u308A\u30FB\u7D42\u308F\u308A(\u30B5\u30F3\u30D7\u30EB)
    let w = (Math.round(f0 * 10) | 0) ^ Math.imul(def.crackSeed | 0, 0x51ed270b) ^ Math.imul((ev.k ?? -1) + 1, 0x7feb352d);
    w = Math.imul(w ^ (w >>> 16), 0x45d9f3b); w ^= w >>> 16;
    vo[o + WR] = (w >>> 0) || 1;
    vo[o + FR] = 1;
    vo[o + FS] = -1;
    vo[o + FE] = -1;
    this.def[v] = def;
  }

  /** \u660E\u308B\u3055\u30FB\u97F3\u7A0B\u30FB\u6B63\u898F\u5316\u3092\u4F5C\u308A\u76F4\u3059\u300216 \u30B5\u30F3\u30D7\u30EB\u306B 1 \u56DE */
  control(v, sr) {
    const vo = this.voice, d = this.def[v];
    const o = v * W;
    const f0 = vo[o + F0];
    const age = vo[o + AGE] / sr;
    // \u9CF4\u308A\u306F\u3058\u3081\u306F\u5C11\u3057\u4E0B\u304B\u3089\u5165\u3063\u3066\u3001\u305B\u308A\u4E0A\u304C\u308B
    let cents = vo[o + SC] * Math.exp(-age / Math.max(1e-3, vo[o + ST]));
    // \u51FA\u3060\u3057\u306E\u62BC\u3057\u3002\u5C11\u3057\u4E0A\u305A\u3063\u3066\u3001\u660E\u308B\u304F\u306A\u308B
    const push = vo[o + PG] > 0 ? vo[o + PG] * Math.exp(-age / Math.max(1e-3, d.pushTime)) : 0;
    cents += 25 * push;
    // \u30D3\u30D6\u30E9\u30FC\u30C8\u306F\u9045\u308C\u3066\u5165\u308B
    let vibUp = 0;
    if (d.vib > 0) {
      const fade = Math.min(1, Math.max(0, (age - d.vibDelay) / 0.4));
      const sv = Math.sin(TAU * d.vibRate * age);
      cents += d.vib * fade * sv;
      vibUp = fade * Math.max(0, sv);
    }
    // \u9014\u4E2D\u306E\u88CF\u8FD4\u308A\u3002\u8DF3\u306D\u3066\u3044\u308B\u3042\u3044\u3060\u306F\u3068\u306A\u308A\u306E\u500D\u97F3\u3067\u9CF4\u308B\u3002\u51FA\u3060\u3057\u306E\u88CF\u8FD4\u308A\u3068\u62BC\u3057\u304C
    // \u6E08\u3093\u3067\u3001\u4F38\u3070\u3057\u3066\u3044\u308B\u3068\u3053\u308D\u3060\u3051\u3067\u8D77\u304D\u308B
    let flip = 1;
    if (d.wobble > 0 && d.pedal > 0) {
      const a = vo[o + AGE];
      if (a < vo[o + FE]) flip = vo[o + FR];
      else if (age > Math.max(0.15, vo[o + CD]) && !vo[o + GONE]) {
        const vel = vo[o + VEL];
        const n = partialOf(f0, d.pedal);
        const chance = d.wobble * vel * slip(n) * (1 + 2 * vibUp) * SUB / sr;
        let r = vo[o + WR];
        const u = () => { r ^= r << 13; r >>>= 0; r ^= r >>> 17; r ^= r << 5; r >>>= 0; return r / 4294967296; };
        if (u() < chance) {
          const up = n < 2 || u() < 0.7;
          vo[o + FR] = (n + (up ? 1 : -1)) / n;
          vo[o + FS] = a;
          vo[o + FE] = a + d.crackTime * (0.6 + 0.8 * u()) * sr;
          flip = vo[o + FR];
        }
        vo[o + WR] = r;
      }
    }
    // \u88CF\u8FD4\u3063\u3066\u3044\u308B\u3042\u3044\u3060\u306F\u3001\u3068\u306A\u308A\u306E\u500D\u97F3\u3067\u9CF4\u308B
    const f = f0 * (age < vo[o + CD] ? vo[o + CR] : 1) * flip * Math.pow(2, cents / 1200);
    vo[o + INC] = f / sr;
    // \u660E\u308B\u3055\u306F\u606F\u306E\u5727\u304B\u3089\u3002\u30CA\u30A4\u30AD\u30B9\u30C8\u3092\u8D8A\u3048\u308B\u500D\u97F3\u304C\u51FA\u306A\u3044 k \u3067\u6B62\u3081\u308B\u3002
    // brassKey \u306F\u97F3\u306E\u9AD8\u3055\u3067\u660E\u308B\u3055\u3092\u5909\u3048\u308B\u3002\u672C\u7269\u306E\u91D1\u7BA1\u306F\u3001\u660E\u308B\u3055\u304C\u500D\u97F3\u306E\u756A\u53F7\u3067\u306F\u306A\u304F
    // \u5468\u6CE2\u6570(Hz)\u3067\u6C7A\u307E\u308B(\u9332\u97F3\u3067\u6E2C\u3063\u305F)\u3002\u500D\u97F3\u306E\u5E83\u304C\u308A\u306F\u304A\u3088\u305D sqrt(k) \u672C\u306A\u306E\u3067\u3001
    // 2 \u3067\u3001\u3069\u306E\u9AD8\u3055\u3067\u3082\u540C\u3058 Hz \u307E\u3067\u500D\u97F3\u304C\u5C4A\u304F\u3002A4 \u3092\u57FA\u6E96\u306B\u3059\u308B
    const h = 0.45 * sr / f;
    const cap = Math.max(0.05, h - 3 * Math.sqrt(h));
    const p = vo[o + P];
    const kk = d.brassKey ? Math.pow(440 / f0, d.brassKey) : 1;
    const k = Math.min(cap, Math.max(1e-4, d.brass * kk * Math.pow(p, d.curve) * (1 + 3 * push)));
    const dc = i0e(k);
    const ac = Math.sqrt(Math.max(1e-12, i0e(2 * k) - dc * dc));
    vo[o + K] = k;
    vo[o + DC] = dc;
    vo[o + NRM] = 1 / ac;
  }

  render(v, out, sr, tEnd) {
    const vo = this.voice, d = this.def[v];
    const o = v * W;
    if (vo[o + REL] < tEnd && !vo[o + GONE]) { vo[o + GONE] = 1; vo[o + TGT] = 0; }
    const vel = vo[o + VEL];
    // \u606F\u306E\u5727\u306E\u8FFD\u3044\u304B\u3051\u65B9\u3002\u5F37\u304F\u5439\u304F\u307B\u3069\u901F\u304F\u7ACB\u3061\u4E0A\u304C\u308B
    const ta = d.attack * (1.5 - vel);
    const ka = 1 - Math.exp(-1 / (Math.max(1e-3, ta) * sr));
    const kr = 1 - Math.exp(-1 / (Math.max(1e-3, d.release) * sr));
    const lv = d.level * vo[o + KG];
    let ph = vo[o + PH], p = vo[o + P], age = vo[o + AGE], lp = vo[o + LP];
    let nz = this.noise;
    // \u88CF\u8FD4\u308A\u304B\u3089\u843D\u3061\u305F\u3068\u3053\u308D(\u30B5\u30F3\u30D7\u30EB)\u3002\u305D\u3053\u3067\u4E00\u5EA6\u3060\u3051\u5927\u304D\u3055\u304C\u629C\u3051\u308B
    const cdS = vo[o + CD] * sr;
    const off = vo[o + OFF];
    vo[o + OFF] = 0;
    for (let i = off; i < B; i++) {
      if ((i - off) % SUB === 0) {
        vo[o + P] = p; vo[o + AGE] = age;
        this.control(v, sr);
      }
      // \u5F37\u304F\u5439\u304F\u3068\u3001\u51FA\u3060\u3057\u3067\u4E00\u5EA6\u884C\u304D\u904E\u304E\u3066\u304B\u3089\u843D\u3061\u7740\u304F
      let tgt = vo[o + TGT];
      if (tgt > 0) tgt *= 1 + d.blat * vel * Math.exp(-age / (0.06 * sr));
      p += (tgt > p ? ka : kr) * (tgt - p);
      const cs = Math.cos(TAU * ph);
      const y = (Math.exp(vo[o + K] * (cs - 1)) - vo[o + DC]) * vo[o + NRM];
      ph += vo[o + INC];
      if (ph >= 1) ph -= 1;
      // \u30BF\u30F3\u30AE\u30F3\u30B0\u306E\u96D1\u97F3\u3068\u3001\u606F\u306E\u96D1\u97F3\u3002\u606F\u306F airCurve \u304C\u5C0F\u3055\u3044\u307B\u3069\u3001\u5F31\u304F\u5439\u3044\u305F\u3068\u304D\u306B
      // \u76F8\u5BFE\u7684\u306B\u5927\u304D\u304F\u6B8B\u308B(\u30B5\u30C3\u30AF\u30B9\u306E\u304B\u3059\u308C\u305F\u5F31\u97F3)\u3002airPulse \u306F\u30EA\u30FC\u30C9\u304C\u958B\u3044\u3066\u3044\u308B
      // \u3042\u3044\u3060\u3060\u3051\u96D1\u97F3\u304C\u901A\u308B\u5272\u5408\u3067\u3001\u96D1\u97F3\u304C\u97F3\u7A0B\u306E\u5468\u671F\u3067\u8108\u6253\u3064
      nz ^= nz << 13; nz >>>= 0; nz ^= nz >>> 17; nz ^= nz << 5; nz >>>= 0;
      const n = nz / 2147483648 - 1;
      const gate = 1 - d.airPulse + d.airPulse * (1 + cs);
      const air = n * (d.tongue * vel * Math.exp(-age / (0.012 * sr))
        + d.breath * Math.pow(p, d.airCurve) * gate);
      lp += 0.35 * (air - lp);
      let dip = cdS > 0 && age >= cdS && age - cdS < 0.05 * sr ? 1 - 0.6 * Math.exp(-(age - cdS) / (0.006 * sr)) : 1;
      // \u9014\u4E2D\u306E\u88CF\u8FD4\u308A\u3002\u8DF3\u306D\u305F\u77AC\u9593\u3068\u623B\u3063\u305F\u77AC\u9593\u306B\u629C\u3051\u308B
      const fs = vo[o + FS];
      if (fs >= 0 && age >= fs && age - fs < 0.2 * sr) {
        const fe = vo[o + FE];
        dip *= 1 - 0.5 * Math.exp(-(age - fs) / (0.004 * sr));
        if (age >= fe) dip *= 1 - 0.5 * Math.exp(-(age - fe) / (0.004 * sr));
      }
      // \u30AD\u30FC\u30AF\u306E\u3042\u3044\u3060\u3060\u3051\u5C0F\u3055\u304F\u3059\u308B(\u51FA\u3060\u3057\u306E\u88CF\u8FD4\u308A\u306F\u5143\u306E\u5927\u304D\u3055\u306E\u307E\u307E)
      const sq = age < cdS ? vo[o + SG] : 1;
      out[i] += lv * (p * y * dip * sq + lp);
      age++;
    }
    vo[o + PH] = ph; vo[o + P] = p; vo[o + AGE] = age; vo[o + LP] = lp;
    this.noise = nz;
    if (vo[o + GONE] && p < 1e-4) vo[o + ON] = 0;
  }

  process(inputs, outputs) {
    const chs = outputs[0];
    const out = chs[0];
    out.fill(0);
    const sr = sampleRate;
    const t0 = currentTime;
    const tEnd = t0 + B / sr;
    const vo = this.voice;
    while (this.at < this.events.length && this.events[this.at].t < tEnd) {
      const ev = this.events[this.at++];
      this.start(ev, Math.max(0, Math.min(B - 1, Math.round((ev.t - t0) * sr))));
    }
    for (let v = 0; v < V; v++) if (vo[v * W + ON]) this.render(v, out, sr, tEnd);
    if (this.cutAt >= 0) {
      const len = Math.max(1, Math.round(sr * 0.01));
      for (let i = 0; i < out.length; i++) {
        out[i] *= Math.max(0, 1 - this.cutAt / len);
        this.cutAt++;
      }
      if (this.cutAt >= len) { vo.fill(0); this.cutAt = -1; }
    }
    for (let c = 1; c < chs.length; c++) chs[c].set(out);
    return true;
  }
}
registerProcessor('${BRASS_NODE}', BrassBank);
`;
  var BRASS_PARAMS = {
    brass: {
      live: false,
      min: 0,
      max: 40,
      note: "How bright it gets at full breath, at A4. 0 is a pure sine at any loudness."
    },
    brassKey: {
      live: false,
      min: 0,
      max: 3,
      when: [{ key: "brass", gt: 0 }],
      note: "How much brighter low notes get, as a power of the pitch below A4. 0 gives every note the same number of harmonics; 2 makes the harmonics reach the same frequency at every pitch, as on a real horn."
    },
    curve: {
      live: false,
      min: 0.3,
      max: 4,
      when: [{ key: "brass", gt: 0 }],
      note: "How fast brightness follows loudness. High values stay dark until played hard."
    },
    attack: {
      live: false,
      min: 3e-3,
      max: 0.5,
      unit: "s",
      note: "How fast the breath pressure builds. Harder notes build faster."
    },
    blat: {
      live: false,
      min: 0,
      max: 1,
      note: "Overshoot of the breath on hard attacks, settling within about 60 ms."
    },
    release: {
      live: false,
      min: 0.01,
      max: 1,
      unit: "s",
      note: "How fast the breath falls when the note is let go. The tone darkens as it falls."
    },
    scoop: {
      live: false,
      min: -300,
      max: 300,
      unit: "cent",
      note: "Where the pitch starts, before it settles on the note. Negative comes up from below."
    },
    scoopTime: {
      live: false,
      min: 5e-3,
      max: 0.3,
      unit: "s",
      when: [{ key: "scoop", ne: 0 }],
      note: "How long the pitch takes to settle."
    },
    vib: {
      live: false,
      min: 0,
      max: 100,
      unit: "cent",
      note: "Vibrato depth."
    },
    vibRate: {
      live: false,
      min: 2,
      max: 9,
      unit: "Hz",
      when: [{ key: "vib", gt: 0 }],
      note: "Vibrato speed."
    },
    vibDelay: {
      live: false,
      min: 0,
      max: 2,
      unit: "s",
      when: [{ key: "vib", gt: 0 }],
      note: "How long a note is held before the vibrato fades in."
    },
    tongue: {
      live: false,
      min: 0,
      max: 1,
      note: "Noise burst of the tongue at the start of a note."
    },
    breath: {
      live: false,
      min: 0,
      max: 0.3,
      note: "Air noise that follows the breath pressure."
    },
    airCurve: {
      live: false,
      min: 0.1,
      max: 2,
      when: [{ key: "breath", gt: 0 }],
      note: "How the air noise follows the breath. Below 1, soft notes keep more air, as in a breathy saxophone."
    },
    airPulse: {
      live: false,
      min: 0,
      max: 1,
      when: [{ key: "breath", gt: 0 }],
      note: "How much the air noise pulses with each cycle of the reed. 0 is steady hiss."
    },
    push: {
      live: false,
      group: "flaw",
      min: 0,
      max: 1,
      note: "How hard the start of a note is pushed: brighter and a little sharp, then it settles. Grows with velocity and pitch."
    },
    pushTime: {
      live: false,
      group: "flaw",
      min: 0.01,
      max: 0.4,
      unit: "s",
      when: [{ key: "push", gt: 0 }],
      note: "How long the push takes to settle."
    },
    crack: {
      live: false,
      group: "flaw",
      min: 0,
      max: 1,
      note: "How likely the lips catch the neighbouring harmonic for a moment before landing on the note. More likely on loud notes, high in the harmonic series where the harmonics sit close together, and after a leap. Low notes rarely crack, but jump far when they do."
    },
    crackTime: {
      live: false,
      group: "flaw",
      min: 0.01,
      max: 0.15,
      unit: "s",
      note: "How long the note stays on the wrong harmonic, for crack and wobble."
    },
    pedal: {
      live: false,
      group: "flaw",
      min: 20,
      max: 400,
      unit: "Hz",
      note: "Lowest harmonic of the tube. Sets which harmonic a note is, and so how far a crack or a wobble jumps."
    },
    crackSeed: {
      live: false,
      group: "flaw",
      min: 1,
      max: 9999,
      step: 1,
      note: "Seed for which leaps crack and where held notes wobble. The same leap always cracks the same way."
    },
    squeak: {
      live: false,
      group: "flaw",
      min: 0,
      max: 1,
      note: "How likely the reed squeaks at the start of a note, jumping to a harmonic near 2.8 kHz for a moment. More likely on loud notes and after a leap."
    },
    wobble: {
      live: false,
      group: "flaw",
      min: 0,
      max: 5,
      unit: "/s",
      note: "How often a held note flips to the neighbouring harmonic for a moment and comes back, per second. More likely on loud notes high in the harmonic series and at the top of the vibrato."
    },
    keyGain: {
      live: false,
      min: -12,
      max: 12,
      unit: "dB",
      note: "Level change per octave above A4. Positive makes low notes quieter, as on a real trumpet, whose low register speaks softly at every dynamic."
    },
    level: {
      live: false,
      min: 0.01,
      max: 4,
      note: "Output level of this patch."
    }
  };
  var BRASS_PATCHES = {
    trumpet: {
      note: "Trumpet, open. Bright when pushed, a short scoop into each note and a late vibrato. Fitted to recordings of a B-flat trumpet.",
      // 録音(アイオワ大学の B♭ トランペット、ビブラートなし、E3〜C6 を 3 つの強さ)に寄せた(2026-10-05)。
      // 前は低い音ほど暗かった(E3 mf で重心 4.2、録音は 9.1)。本物は明るさが倍音の番号ではなく
      // Hz で決まり、1.1kHz あたりに山がある。brassKey と、山の立ったベルで合わせた。
      // 明るくなったぶん大きく出るので、セッションの大きさが前と同じになるよう level を下げている
      brass: 37.5,
      brassKey: 1.38,
      curve: 1.41,
      attack: 0.0222,
      blat: 0.33,
      release: 0.06,
      scoop: -40,
      scoopTime: 0.035,
      vib: 18,
      vibRate: 5.6,
      vibDelay: 0.35,
      tongue: 0.25,
      breath: 0.03,
      airCurve: 1,
      airPulse: 0,
      level: 0.09,
      // 管のいちばん低い倍音は B♭2
      // 裏返りは短いほうが本物らしい(40ms では長く聞こえた。2026-10-05)
      push: 0.4,
      pushTime: 0.08,
      crack: 0.15,
      crackTime: 0.025,
      pedal: 116.5,
      crackSeed: 1,
      wobble: 0.2,
      squeak: 0,
      // 録音は pp・mf・ff のどれでも、低い音ほど 1 オクターブにつき約 5dB 小さい。
      // 強さによらないので楽器の特徴と見た。4 で mf の並びが録音に合う。
      // セッションは低いところで吹かせていて 5dB 小さくなるので、level で前の大きさに戻した
      keyGain: 4,
      bell: { freq: 1100, resonance: 0.72 },
      range: {
        brass: [25, 40],
        brassKey: [1, 2],
        curve: [1.1, 2.2],
        attack: [0.012, 0.05],
        blat: [0.1, 0.45],
        release: [0.03, 0.12],
        scoop: [-80, 0],
        scoopTime: [0.015, 0.07],
        vib: [0, 35],
        vibRate: [4.5, 6.5],
        vibDelay: [0.15, 0.7],
        tongue: [0.1, 0.4],
        breath: [0.01, 0.06],
        airCurve: [0.8, 1.2],
        airPulse: [0, 0.3],
        level: [0.02, 0.12],
        push: [0, 0.8],
        pushTime: [0.04, 0.15],
        crack: [0, 0.4],
        crackTime: [0.012, 0.05],
        pedal: [110, 120],
        crackSeed: [1, 9999],
        wobble: [0, 1],
        squeak: [0, 0],
        keyGain: [2, 7],
        "bell.freq": [800, 1800],
        "bell.resonance": [0.5, 0.85]
      }
    },
    trombone: {
      note: "Trombone. Darker and slower to speak than the trumpet. Fitted to recordings of a tenor trombone.",
      // 録音(アイオワ大学のテナートロンボーン、E2〜C5 を 3 つの強さ)に寄せた(2026-10-05)。
      // トランペットと同じく低い音ほど暗かったので、brassKey とベルの山で合わせた。
      // 低い音ほど小さいのも同じで、keyGain 3.6。誤差は 3.75 → 3.14。残りの多くは E2 の録音で、
      // mf が pp より暗く出ている(録音の癖と見て追わなかった)。
      // 明るくなったぶん大きく出るので、セッションの大きさが前と同じになるよう level を下げている
      brass: 20,
      brassKey: 1.38,
      curve: 1.8,
      attack: 0.0712,
      blat: 0.15,
      release: 0.09,
      scoop: -25,
      scoopTime: 0.05,
      vib: 10,
      vibRate: 5,
      vibDelay: 0.5,
      tongue: 0.18,
      breath: 0.025,
      airCurve: 1,
      airPulse: 0,
      level: 0.21,
      // 管のいちばん低い倍音は B♭1
      push: 0.3,
      pushTime: 0.1,
      crack: 0.1,
      crackTime: 0.05,
      pedal: 58.3,
      crackSeed: 1,
      wobble: 0.15,
      squeak: 0,
      keyGain: 3.6,
      bell: { freq: 565, resonance: 0.472 },
      range: {
        brass: [12, 30],
        brassKey: [1, 2],
        curve: [1.2, 2.4],
        attack: [0.03, 0.1],
        blat: [0.05, 0.3],
        release: [0.05, 0.15],
        scoop: [-60, 0],
        scoopTime: [0.02, 0.09],
        vib: [0, 20],
        vibRate: [4, 6],
        vibDelay: [0.3, 0.9],
        tongue: [0.08, 0.3],
        breath: [0.01, 0.05],
        airCurve: [0.8, 1.2],
        airPulse: [0, 0.3],
        level: [0.1, 0.35],
        push: [0, 0.7],
        pushTime: [0.05, 0.2],
        crack: [0, 0.3],
        crackTime: [0.03, 0.08],
        pedal: [55, 62],
        crackSeed: [1, 9999],
        wobble: [0, 0.8],
        squeak: [0, 0],
        keyGain: [2, 6],
        "bell.freq": [300, 800],
        "bell.resonance": [0.3, 0.7]
      }
    },
    tenor: {
      note: "Tenor saxophone. Breathy when soft, edgy when pushed, a wide scoop and a jaw vibrato. The honk and the edge come from two body peaks. Fitted to recordings of an alto saxophone, scaled down a fifth.",
      // テナーの録音は無いので、アルトサックス(アイオワ大学、D♭3・C4・C5 を 3 つの強さ)を
      // 物差しにした(2026-10-05)。テナーはアルトをおよそ 1.5 倍にした相似形なので、アルトの音を
      // 5 度下で鳴らし、倍音の番号ごとの並びで比べる。胴の山もその比で縮むので、テナーの値のまま比べられる。
      // ホンクの山は 450Hz から 700Hz に上がって鋭くなった。誤差は 5.89 → 4.41。
      // 残りの多くは弱く吹いたときの立ち上がりで、録音は D♭3 pp で 0.26 秒かけてふくらむ。
      // いまの attack は強さに比例して縮むだけなので、そこまで遅くできない
      brass: 13.1,
      brassKey: 0.7,
      curve: 1.62,
      attack: 0.048,
      blat: 0.05,
      release: 0.08,
      scoop: -60,
      scoopTime: 0.05,
      vib: 22,
      vibRate: 5.2,
      vibDelay: 0.3,
      // 大きさは、声の外の bell と body まで通して、トランペットに揃えている。
      // bell が低い(120Hz)ので低いほうが削れず、body で 2 か所持ち上がるぶん、
      // 同じ level だと 7dB 大きかった。セッションの中で目立ちすぎた(2026-10-05)。
      // 録音に寄せたあとも、セッションでの大きさは前と同じに揃えてある
      tongue: 0.12,
      breath: 0.12,
      airCurve: 0.4,
      airPulse: 0.8,
      level: 0.1,
      // サックスの裏返りは、リードがひっくり返って上の倍音へ跳ぶもの。管のいちばん下は A♭2
      push: 0.25,
      pushTime: 0.08,
      crack: 0.05,
      crackTime: 0.05,
      pedal: 103.8,
      crackSeed: 1,
      wobble: 0.1,
      squeak: 0.04,
      // サックスは低い音ほど大きい。録音の C4 が D♭3 と C5 の両方より小さく、1 本の傾きでは
      // 合わない。合わせると −8 まで行くが、それだと C5 が 9dB 小さくなるので、間を取った
      keyGain: -2,
      bell: { freq: 120, resonance: 0 },
      body: [{ freq: 700, gain: 7.34, resonance: 0.84 }, { freq: 1900, gain: 9, resonance: 0.549 }],
      range: {
        brass: [9, 20],
        brassKey: [0.3, 1.2],
        curve: [1.2, 2],
        attack: [0.025, 0.08],
        blat: [0, 0.15],
        release: [0.05, 0.15],
        scoop: [-120, -10],
        scoopTime: [0.03, 0.1],
        vib: [8, 40],
        vibRate: [4.5, 6],
        vibDelay: [0.15, 0.5],
        tongue: [0.05, 0.2],
        breath: [0.05, 0.2],
        airCurve: [0.25, 0.7],
        airPulse: [0.5, 1],
        level: [0.05, 0.18],
        push: [0, 0.6],
        pushTime: [0.04, 0.15],
        crack: [0, 0.2],
        crackTime: [0.03, 0.08],
        pedal: [100, 108],
        crackSeed: [1, 9999],
        wobble: [0, 0.6],
        squeak: [0, 0.2],
        keyGain: [-8, 2],
        "bell.freq": [100, 250],
        "bell.resonance": [0, 0.3],
        "body.0.freq": [450, 850],
        "body.0.gain": [3, 10],
        "body.0.resonance": [0.5, 0.9],
        "body.1.freq": [1400, 2400],
        "body.1.gain": [4, 12],
        "body.1.resonance": [0.35, 0.75]
      }
    }
  };
  function compileBrass(def) {
    const out = {};
    for (const k of Object.keys(BRASS_PARAMS)) out[k] = def[k] ?? 0;
    if (def.level == null) out.level = 0.5;
    out.level *= Object.values(def.macroLevel || {}).reduce((a, b) => a * b, 1);
    if (def.airCurve == null) out.airCurve = 1;
    return out;
  }

  // engine/sound/demotunes.js
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
    "#bundle beatBass1  = @{waveRamp} @e{piano} @s{8,2}",
    "#bundle beatBass2  = @{triangle} @e{flat}",
    // **キックに @o+2 を足す。**トラックが書く o2 はノイズのため(低い胴)で、
    // リズム音源のキックはそれに付き合うと 2 オクターブ下がって底を打つ。
    // ここで戻しておくと、キックは実機のドライバの高さで鳴る
    "#bundle beatKick   = @{opllKick} @e{percussive} @o+2,   @{noise} v11 @e{snap}",
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

  // engine/sound/se.js
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

  // engine/sound/layerpresets.js
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
          const name = `layerPair(${w.key}, ${d.c ? d.value : "detune: none"}, ${e.f ? e.value : "echo: none"})`;
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
  function layerPairFamily() {
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
    layerKickAir: {
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
    layerBrassBite: {
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
    registerFamily("layerPair", layerPairFamily());
    const has = (n) => findWave(n) >= 0;
    const all = { ...LAYER_PRESETS, ...detuneEchoPresets() };
    for (const [name, spec] of Object.entries(all)) {
      if (has(name)) continue;
      registerLayer(name, spec);
    }
  }

  // engine/sound/version.js
  var SOUND_VERSION = "0.30.1";

  // engine/sound/audio.js
  registerDefaultWaves();
  registerDefaultFM();
  registerDefaultBeeps();
  registerOPMPresets();
  registerOPLLPresets();
  registerAYPresets();
  registerNESPresets();
  registerFDSPresets();
  registerSCCPresets();
  registerPCEPresets();
  registerOPNARhythmPresets();
  registerExtraWaves();
  registerNoiseVariants();
  registerModalVoices();
  registerDefaultTones();
  registerDefaultLayers();
  sealPresets();
  function registerModalVoices() {
    registerFamily("model", {
      note: "Instruments computed from scratch for every note, with no stored waveform. The timbre moves with how hard, how high and how long you play, which a wavetable cannot do. Not for real chips.",
      params: [{
        name: "instrument",
        default: "piano",
        note: "Which instrument to build.",
        values: [...Object.entries(MODAL_PATCHES), ...Object.entries(BRASS_PATCHES)].map(([value, d]) => ({ value, note: d.note }))
      }]
    });
    const ROLE = {
      brush: "perc",
      brushSweep: "perc",
      ride: "perc",
      bass: "bass",
      piano: "lead",
      rhodes: "lead",
      trumpet: "lead",
      trombone: "counter",
      tenor: "lead"
    };
    for (const [name, def] of Object.entries(MODAL_PATCHES)) {
      registerModal(`model(${name})`, { patch: name }, { role: ROLE[name], note: def.note });
    }
    for (const [name, def] of Object.entries(BRASS_PATCHES)) {
      registerBrass(`model(${name})`, { patch: name }, { role: ROLE[name], note: def.note });
    }
  }
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
  function checkOfTracks(tracks) {
    const errors = [];
    const warnings = [];
    let total = 0;
    const channels = tracks.map((t, i) => {
      total = Math.max(total, t.total || 0);
      for (const p of t.problems || []) {
        (p.level === "error" ? errors : warnings).push({ ch: i, text: p.text });
      }
      if (!t.events.length) warnings.push({ ch: i, text: "\u97F3\u7B26\u304C\u3042\u308A\u307E\u305B\u3093" });
      return {
        ch: i,
        meta: t.meta ?? {},
        name: t.name ?? null,
        role: t.role ?? null,
        events: t.events.length,
        total: t.total,
        loop: t.loop,
        marks: t.marks,
        takes: t.takes ?? []
      };
    });
    if (!tracks.length) errors.push({ ch: null, text: "\u9CF4\u3089\u3059\u3082\u306E\u304C\u3042\u308A\u307E\u305B\u3093" });
    return { ok: !errors.length, errors, warnings, channels, total };
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
    if (["fm", "opm", "opll", "noise", "baked", "beep", "opnaRhythm"].includes(wf.kind)) return 0;
    if (wf.kind === "ay" && wf.mode === "noise") return 0;
    if (wf.kind === "nes") return wf.mode === "noise" ? 0 : wf.mode === "triangle" ? 32 : 16;
    if (wf.kind === "fds") return 0;
    if (wf.kind === "pce") return wf.noise ? 0 : 16;
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
  var WORKLETS = {
    opm: { node: "mmsxx-opm", code: OPM_CODE },
    opll: { node: "mmsxx-opll", code: OPLL_CODE },
    ay: { node: "mmsxx-ay", code: AY_CODE },
    nes: { node: "mmsxx-nes", code: NES_CODE },
    fds: { node: "mmsxx-fds", code: FDS_CODE },
    scc: { node: "mmsxx-scc", code: SCC_CODE },
    pce: { node: "mmsxx-pce", code: PCE_CODE },
    opnaRhythm: { node: "mmsxx-opna-rhythm", code: OPNA_RHYTHM_CODE },
    duty: { node: "mmsxx-duty", code: DUTY_CODE },
    // 波形を持たない音源。音符のほかにパッチ(鳴らし方の定義)を渡すので、
    // 作るときの引数を自分で組む `options` を持つ。
    // 止める合図(`{ cut: true }`)は chip と同じ名前
    // modal は出口を 2 本持つ(`buses`)。1 本目が左へ行く束、2 本目が右へ行く束で、
    // 足せばいつも声そのものに戻る。どこに置くかはエンジンが決める(`_panPair`)
    modal: {
      node: MODAL_NODE,
      code: MODAL_CODE,
      voices: MODAL_VOICES,
      buses: 2,
      options: (list) => ({
        numberOfInputs: 0,
        outputChannelCount: [2],
        processorOptions: { events: list, patches: patchesOf(MODAL_PATCHES, compileModal) }
      })
    },
    brass: {
      node: BRASS_NODE,
      code: BRASS_CODE,
      voices: BRASS_VOICES,
      options: (list) => ({
        numberOfInputs: 0,
        outputChannelCount: [1],
        processorOptions: { events: list, patches: patchesOf(BRASS_PATCHES, compileBrass) }
      })
    }
  };
  function patchesOf(table, compile) {
    const out = {};
    for (const [k, d] of Object.entries(table)) out[k] = compile(d);
    return out;
  }
  function workletOf(wf) {
    if (!wf) return null;
    if (wf.kind === "opm") return "opm";
    if (wf.kind === "opll") return "opll";
    if (wf.kind === "ay") return "ay";
    if (wf.kind === "nes") return "nes";
    if (wf.kind === "fds") return "fds";
    if (wf.kind === "scc") return "scc";
    if (wf.kind === "pce") return "pce";
    if (wf.kind === "opnaRhythm") return "opnaRhythm";
    if (wf.kind === "modal") return "modal";
    if (wf.kind === "brass") return "brass";
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
    if (steps === 1) return 15;
    const step = 15 / (steps - 1);
    return Math.min(15, Math.max(step, Math.round(v / step) * step));
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
    return trackFrom(compileMML(mml.trim(), { mode }));
  }
  function trackFrom(data) {
    const {
      events,
      total,
      loop,
      outro,
      meta = {},
      marks,
      takes,
      bars,
      cues,
      texts,
      problems,
      laneLabels
    } = data;
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
      // 字(`"…"`)も同じ扱い。選択肢で入れ替わるので素の並びを取っておく
      texts: texts ?? [],
      baseTexts: texts ?? [],
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
  function songGain(tracks) {
    if (!Array.isArray(tracks)) return 1;
    const v = tracks.map((t) => t && t.meta && t.meta.gain).find((x) => x != null);
    if (v == null) return 1;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.min(8, n) : 1;
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
      this._songGain = 1;
      this._range = null;
      this._chMute = /* @__PURE__ */ new Set();
      this._chLevel = /* @__PURE__ */ new Map();
      this._laneMute = /* @__PURE__ */ new Set();
      this._muteFor = null;
      this._group = null;
      this._cues = [];
      this._texts = [];
      this.onText = null;
      this._textSeq = 0;
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
      inp.__spot = { dest, pos, mode };
      bank.set(key2, inp);
      return inp;
    }
    /**
     * 出口を 2 本持つ音源の行き先。1 本目が左へ行く束、2 本目が右へ行く束。
     *
     * モノラルでは足して 1 本に戻す。ステレオでは `@p{…}` の両側へ置き、
     * 横へ寄るほど狭めて、端では 2 本が重なる。位置は曲が持ち、広さは音色が持つ。
     *
     * 広げていない音色(2 本に半分ずつ)が、モノラルの音源と同じ大きさで鳴るように
     * 持ち上げる。等パワーの振り方では、両側へ置いた 2 本の和が
     * `cos(s·π/4)` 倍になる(s は広さ)。その逆を掛けると、ちょうど一致する。
     * 広げたぶんは片側が大きくなるが、それは広げたことの結果なのでそのままにする
     */
    _panPair(d) {
      if (!d || !this.ctx) return d;
      if (d.__pair) return d.__pair;
      const ctx = this.ctx;
      const split = ctx.createChannelSplitter(2);
      const spot = d.__spot;
      if (!spot) {
        const sum = ctx.createGain();
        split.connect(sum, 0);
        split.connect(sum, 1);
        sum.connect(d);
        d.__pair = split;
        return split;
      }
      const { dest, pos, mode } = spot;
      const h = Math.hypot(pos[0], pos[2]);
      const pan = h > 0 ? pos[0] / h : 0;
      const s = 1 - Math.abs(pan);
      const lift = ctx.createGain();
      lift.gain.value = Math.round(1e6 / Math.cos(s * Math.PI / 4)) / 1e6;
      lift.connect(split);
      const put = (ch, x) => {
        const q = Math.max(-1, Math.min(1, pan + x));
        const at = mode === "hrtf" ? [q, pos[1], pos[2]] : [q, 0, Math.sqrt(Math.max(0, 1 - q * q))];
        const inp = mode === "hrtf" ? this._panHRTF(dest, at) : this._panStereo(dest, at);
        split.connect(inp, ch);
      };
      put(0, -s);
      put(1, s);
      d.__pair = lift;
      return lift;
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
    /**
     * 読み終えた中間データから曲を登録する。MML の字を通さない。
     *
     * Stave はプレイヤーが読むデータを直に作ると決めてある
     * (docs/SCORE_LANG.md「Stave を直に鳴らす。MML は書き出しとして残す」)。
     * `defineBGM()` は字を受けてコンパイルするので、字を持たない側から鳴らす道が
     * 無かった。ここがその受け口。
     *
     * 渡すのは `compileMML()` が返す形の並びで、チャンネル 1 本につき 1 つ。
     * 中の組み立て(エコーの写し、余韻の空き、声の数、層)はこちらでやる。
     * 呼ぶ側がそこまで作ると、同じ処理が 2 か所に増える。
     *
     * @param {string} name 名前。`startBGM()` で引く
     * @param {object[]} tracks `compileMML()` が返す形の並び
     */
    defineBGMData(name, tracks, opts = {}) {
      this._mutesOf(name);
      const list = Array.isArray(tracks) ? tracks : [tracks];
      const built = list.map((d, i) => {
        const tr = trackFrom(d);
        tr.ch = i;
        if (opts.beep) markBeep(tr);
        return tr;
      });
      built.problems = built.flatMap((t, i) => (t.problems || []).map((x) => ({ ...x, ch: i })));
      built.check = sayErrors(`BGM "${name}"`, checkOfTracks(built));
      this.bgmDefs.set(name, built);
      return built.check;
    }
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
        if (head != null) this.seekBGM(head, { cut: false });
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
     * 字(`"…"`)を、聞こえる時刻に合わせて予約する。
     *
     * 合図(`_scheduleCues`)と同じ作り。**いつ消すかは予約しない。**
     * 出すところだけを渡して、消し方は受けた側に委ねる —
     * 時間で消すのか、次の字で入れ替えるのかは画面の都合だからです
     * (docs/DYNAMIC.md)。
     *
     * @param {object} track トラック
     * @param {number} ch 何本目か
     * @param {object} state 鳴らしている状態
     * @param {number} from 積む範囲の始まり(曲の中の秒)
     * @param {number} to 積む範囲の終わり
     */
    _scheduleTexts(track, ch, state, from, to) {
      const list = track.texts;
      if (!list || !list.length) return;
      for (const x of list) {
        if (x.t < from || x.t >= to) continue;
        const at = state.base + x.t;
        const wait = Math.max(0, (at - this.ctx.currentTime) * 1e3);
        const said = { id: ++this._textSeq, text: x.text, t: x.t, ch };
        const timer = setTimeout(() => {
          if (this.bgmState !== state) return;
          this._texts.push(said);
          if (this._texts.length > 256) this._texts.splice(0, this._texts.length - 256);
          if (typeof this.onText === "function") {
            try {
              this.onText(said);
            } catch (e) {
              console.warn("[ChpTnSnd] onText:", e);
            }
          }
        }, wait);
        state.cueTimers.push(timer);
      }
    }
    /**
     * 溜まった字を取り出して空にする。
     *
     * 合図(`takeCues()`)と同じ使い方。**いつ消すかはこちらが決めない。**
     * 一定時間で消すのか、次の字が来たら入れ替えるのかは、受けた側が選びます。
     *
     * ```js
     * for (const said of audio.takeTexts()) {
     *   screen.show(said.ch, said.text);     // ch で分けても、1 か所にまとめてもよい
     * }
     * ```
     *
     * @returns {{id:number,text:string,t:number,ch:number}[]} 出た順
     */
    takeTexts() {
      const out = this._texts;
      this._texts = [];
      return out;
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
      const texts = (track.baseTexts || []).filter((x) => !inBox(x.t));
      const bars = (track.baseBars || []).filter((b) => !inBox(b));
      for (const box of track.takes) {
        const want = picks[box.group];
        const opt = box.options.find((o) => o.name === want) || box.options[0];
        for (const e of opt.events) out.push({ ...e, t: e.t + box.at });
        for (const c of opt.cues || []) cues.push({ ...c, t: c.t + box.at });
        for (const x of opt.texts || []) texts.push({ ...x, t: x.t + box.at });
        for (const b of opt.bars || []) bars.push(b + box.at);
      }
      out.sort((a, b) => a.t - b.t);
      cues.sort((a, b) => a.t - b.t);
      texts.sort((a, b) => a.t - b.t);
      bars.sort((a, b) => a - b);
      track.events = addEchoes(out, track.total);
      markRooms(track.events, track.loop ? track.loop.to : Infinity);
      track.cues = cues;
      track.texts = texts;
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
        // 曲に置いた字。どのチャンネルに書いても並ぶ。分けて出すか 1 か所に
        // まとめるかは、受けた側が決める
        texts: def.flatMap((t, i) => (t.texts || []).map((x) => ({ ...x, ch: i }))).sort((a, b) => a.t - b.t),
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
     * 鳴らしたまま差し替える。止めて鳴らし直すと聞き比べられない。
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
      this._songGain = songGain(tracks);
      if (this._master) {
        const t0 = this.ctx.currentTime;
        this._master.gain.cancelScheduledValues(t0);
        this._master.gain.setValueAtTime(this._master.gain.value, t0);
        this._master.gain.linearRampToValueAtTime(this._outGain(), t0 + 0.05);
      }
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
            this._scheduleTexts(tracks[i], i, state, state.cursor, to);
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
      this._wkCut();
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
      s.showBase = s.base;
      s.wraps = [];
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
        songGain: this._songGain,
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
        this._songGain = songGain(def);
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
        this._songGain = saved.songGain;
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
     *
     * 返すのは処理器の種類ごとの、チップの並び
     * `{ opll: [{ id, type, regs: [時刻, レジスタ, 値, …] }, …], … }`。
     * チップは行き先(トラック)ごとに立ち、AY は 1 つの行き先が何個でも持つので、
     * チップごとに分けて返す。混ぜると、どのチップへの書き込みかが分からなくなる
     * (VGM へ出すときは、1 個ずつ別のチップとして書く)。
     * `id` は `行き先の番号.その中のチップの番号`、`type` は AY の音量の表
     * (0 = YM2149、1 = AY-3-8910。ほかのチップは 0)
     */
    async _collectRegs() {
      const out = {};
      if (this._wk) {
        for (const [kind, bank] of this._wk) {
          let n = 0;
          for (const node of bank.node.values()) {
            if (!node.port) continue;
            const at = n++;
            const list = out[kind] || (out[kind] = []);
            const chips = /* @__PURE__ */ new Map();
            node.port.onmessage = (e) => {
              const r = e.data && e.data.regs;
              if (!r) return;
              const k = e.data.chip | 0;
              let c = chips.get(k);
              if (!c) {
                c = { id: `${at}.${k}`, type: e.data.type | 0, regs: [] };
                chips.set(k, c);
                list.push(c);
              }
              for (let i = 0; i < r.length; i++) c.regs.push(r[i]);
            };
          }
        }
      }
      let seen = -1;
      for (; ; ) {
        await new Promise((done) => setTimeout(done, 5));
        const n = Object.values(out).reduce((a, l) => a + l.reduce((b, c) => b + c.regs.length, 0), 0);
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
     * 常駐の処理器(OPLL / 4 オペ / 幅の表)は `stop()` を持たないので、
     * 別に黙らせる(`_wkCut`)。2026-10-03 まで、ここも停止もポーズも
     * 届いていなかった(docs/BUGS.md)。
     *
     * @param {number} sec 頭から何秒のところか。曲より長いと終わりへ寄せる
     * @param {{cut?:boolean}} [opts] cut = 常駐の処理器を黙らせるか(既定 true)。
     *   `false` にすると前の音の余韻が残る。テイクの切り替えがそちら
     */
    seekBGM(sec, opts = {}) {
      const cut = opts.cut;
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
      if (cut !== false) this._wkCut();
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
     * @param {string} name `layerPair` `pulse(25)` など
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
      this._wkCut();
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
    /**
     * 常駐の処理器を黙らせる。
     *
     * ---- なぜ要るか ----
     *
     * 止めるところは `n.stop(0)` で済ませているが、`AudioWorkletNode` は
     * `stop()` を持たない(あれは `AudioScheduledSourceNode` のメソッド)。
     * 例外になって catch で飲まれるので、処理器へは何も届かない。発音ノードだけが
     * 止まり、OPLL / 4 オペ / 幅の表はそのまま鳴り続けていた(docs/BUGS.md)。
     *
     * ---- 消すところと残すところ ----
     *
     * 消すのは人が操作したとき(シーク・停止・ポーズ)。残すのは曲が進んだとき
     * (ループの戻り・テイクの切り替え・曲の終わり)。
     * シークも停止もポーズも実機に無い操作なので、実機らしさを守る理由がない。
     *
     * 処理器の側は、溜めたイベントを捨てて、鳴っている声をキーオフしてから、
     * 出口を 10 ミリ秒で落とす。キーオフだけではチップの RR のぶん鳴り続ける。
     */
    _wkCut() {
      if (!this._wk) return;
      for (const [, bank] of this._wk) {
        bank.pend.clear();
        for (const node of bank.node.values()) {
          try {
            node.port.postMessage({ cut: true });
          } catch (e) {
          }
        }
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
      const spec = WORKLETS[kind];
      node = new AudioWorkletNode(this.ctx, spec.node, spec.options ? spec.options(list) : {
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
    /**
     * 段で下ろす音の形。1 フレームずつ読む。
     *
     * 実機の駆動系は 1 フレームに 1 回しか音量レジスタを書き換えられなかった。
     * Web Audio の道(`_applyEnvelope`)と、チップで鳴らす道(`_ayEvent`)が
     * 同じものを使う。2 か所に書くと、片方だけ直したときに音が食い違う。
     *
     * @returns {{n:number, end:number, shapeAt:(age:number)=>number}}
     *   n = フレームの数 / end = 余韻まで含めた長さ(秒)/ shapeAt = その時刻の高さ(0〜1)
     */
    _stepShape(ev, t0, t1) {
      const e = envOf(ev);
      const tail = Math.max(0, Math.min(ev.relTail || 0, t1 - t0 - 0.01));
      const len = Math.max(0.02, t1 - tail - t0);
      const span = ev.tieSpan > 0 ? Math.max(0.02, ev.tieSpan - tail) : len;
      const since = ev.tieAt > 0 ? ev.tieAt : 0;
      const r2 = tail > 0 && !e.table && e.s > 0 ? Math.min(envSec(e.r, len), tail) : 0;
      const { a, d, rel } = envShape(e, span);
      const room = tail > 0 ? 0 : ev.open ? 2e-3 : rel;
      const hold = Math.max(a + d, span - room);
      const end = len + r2;
      const n = Math.max(1, Math.ceil(end / TONE_FRAME));
      const shapeAt = (age) => {
        const at = since + age;
        if (at < a) return a > 0 ? at / a : 1;
        if (at < a + d) return 1 - (1 - e.s) * ((at - a) / Math.max(1e-6, d));
        if (at < hold) return e.s;
        return Math.max(0, e.s * (1 - (at - hold) / Math.max(1e-6, span + r2 - hold)));
      };
      return { n, end, shapeAt };
    }
    /**
     * チップで鳴らす音符の、音量の形。AY・ファミコン・ディスクシステムが同じものを読む。
     *
     * 音量の表 > 配列式のエンベロープ > ADSR の順に勝つ。ADSR は段で下ろす音と
     * 同じもの(`_stepShape`)。
     *
     * @returns {{n:number, shapeAt:(age:number)=>number}} n = フレームの数 / shapeAt = 0〜1
     */
    _chipShape(ev, tone, t0, t1) {
      const e = envOf(ev);
      if (tone.vol) {
        return {
          n: Math.max(1, Math.ceil((t1 - t0) / TONE_FRAME)),
          shapeAt: (age) => Math.max(0, Math.min(
            15,
            readTable(tone.vol, Math.floor(age / TONE_FRAME), tone.loop.vol)
          )) / 15
        };
      }
      if (e.table) {
        return {
          n: Math.max(1, Math.ceil((t1 - t0) / TONE_FRAME)),
          shapeAt: (age) => envTableAt(e, Math.floor(age / TONE_FRAME))
        };
      }
      const { n, shapeAt } = this._stepShape(ev, t0, t1);
      return { n, shapeAt };
    }
    /**
     * チップ(PC エンジン)で鳴らす音符を、常駐の処理器へ渡す形にする。
     *
     * 音量は 5 ビット(0〜31)で 1 段およそ 1.5dB。v15 が 31 になるよう比で直す。
     * 重ねる音で下げた比は、1.5dB の段で引く(対数なので)。
     */
    _pceEvent(ev, wf, freq, amp, t0, t1) {
      const tone = wf.tone || { loop: {} };
      const steps = ev.vsteps ?? wf.vsteps;
      const { n, shapeAt } = this._chipShape(ev, tone, t0, t1);
      const top = ampFor(ev);
      const down = top > 0 && amp < top * 0.999 ? Math.round(-20 * Math.log10(Math.max(1e-6, amp / top)) / 1.5) : 0;
      const volOf = (age) => {
        const al = Math.round(snapVol(volAt(ev, age) * shapeAt(age), steps) * 31 / 15);
        return al > 0 ? Math.max(0, Math.min(31, al - down)) : 0;
      };
      const { fr } = this._dutyFrames(tone, ev, freq, n * TONE_FRAME, false);
      const per = (i) => (wf.noise ? pceNoise : pcePeriod)(fr[Math.min(i, fr.length - 1)]);
      const v0 = volOf(0), p0 = per(0);
      const vs = [], ps = [];
      let lv = v0, lp = p0;
      for (let i = 1; i < n; i++) {
        const t = t0 + i * TONE_FRAME;
        if (t >= t1) break;
        const v = volOf(i * TONE_FRAME), p = per(i);
        if (v !== lv) {
          vs.push([t, v]);
          lv = v;
        }
        if (p !== lp) {
          ps.push([t, p]);
          lp = p;
        }
      }
      return {
        t: t0,
        dur: Math.max(0.01, t1 - t0),
        v: v0,
        p: p0,
        ...wf.noise ? { noise: 1 } : { wave: wf.wave, wkey: wf.name },
        ...vs.length ? { vs } : {},
        ...ps.length ? { ps } : {}
      };
    }
    /**
     * OPNA のリズム音源で鳴らす音符を、常駐の処理器へ渡す形にする。
     *
     * 録音は終わりまで鳴りきるので、渡すのは鳴らしはじめの音量と速さだけ。
     * 音量は打楽器ごとの 5 ビット(0〜31)で 1 段 0.75dB。v15 が 31 になるよう比で直し、
     * 重ねる音で下げた比は 0.75dB の段で引く。
     * 速さは OPLL の打楽器と同じく、書いた高さ ÷ o4c(`DRUM_FREQ`)。o4c なら渡さない
     */
    _opnaRhythmEvent(ev, wf, freq, amp, t0, t1) {
      const steps = ev.vsteps ?? wf.vsteps;
      const top = ampFor(ev);
      const down = top > 0 && amp < top * 0.999 ? Math.round(-20 * Math.log10(Math.max(1e-6, amp / top)) / 0.75) : 0;
      const il = Math.round(snapVol(volAt(ev, 0), steps) * 31 / 15);
      const v = il > 0 ? Math.max(0, Math.min(31, il - down)) : 0;
      return {
        t: t0,
        dur: Math.max(0.01, t1 - t0),
        key: wf.key,
        v,
        ...Math.abs(freq / DRUM_FREQ - 1) > 1e-6 ? { rp: freq / DRUM_FREQ } : {}
      };
    }
    /**
     * チップ(SCC)で鳴らす音符を、常駐の処理器へ渡す形にする。
     *
     * 音量は 4 ビットで値がそのまま振幅。重ねる音で下げた比は、値を比のとおりに引く。
     * 波形は音色の名前で見分ける。同じ波形なら処理器は書き直さない。
     */
    _sccEvent(ev, wf, freq, amp, t0, t1) {
      const tone = wf.tone || { loop: {} };
      const steps = ev.vsteps ?? wf.vsteps;
      const { n, shapeAt } = this._chipShape(ev, tone, t0, t1);
      const top = ampFor(ev);
      const ratio = top > 0 ? Math.min(1, amp / top) : 1;
      const volOf = (age) => Math.max(0, Math.min(
        15,
        Math.round(snapVol(volAt(ev, age) * shapeAt(age), steps) * ratio)
      ));
      const { fr } = this._dutyFrames(tone, ev, freq, n * TONE_FRAME, false);
      const per = (i) => sccPeriod(fr[Math.min(i, fr.length - 1)]);
      const v0 = volOf(0), p0 = per(0);
      const vs = [], ps = [];
      let lv = v0, lp = p0;
      for (let i = 1; i < n; i++) {
        const t = t0 + i * TONE_FRAME;
        if (t >= t1) break;
        const v = volOf(i * TONE_FRAME), p = per(i);
        if (v !== lv) {
          vs.push([t, v]);
          lv = v;
        }
        if (p !== lp) {
          ps.push([t, p]);
          lp = p;
        }
      }
      return {
        t: t0,
        dur: Math.max(0.01, t1 - t0),
        v: v0,
        p: p0,
        wave: wf.wave,
        wkey: wf.name,
        ...vs.length ? { vs } : {},
        ...ps.length ? { ps } : {}
      };
    }
    /**
     * チップ(ディスクシステム)で鳴らす音符を、常駐の処理器へ渡す形にする。
     *
     * 音量は 0〜32(値がそのまま振幅)。v15 が 32 になるよう比で直す。
     * 変調の速さは周期に付いてくるので、ここでは比と深さだけ渡す
     * (処理器が周期を書くたびに、比を掛けて変調の周期も書く)。
     */
    _fdsEvent(ev, wf, freq, amp, t0, t1) {
      const tone = wf.tone || { loop: {} };
      const steps = ev.vsteps ?? wf.vsteps;
      const { n, shapeAt } = this._chipShape(ev, tone, t0, t1);
      const top = ampFor(ev);
      const ratio = top > 0 ? Math.min(1, amp / top) : 1;
      const volOf = (age) => Math.max(0, Math.min(
        32,
        Math.round(snapVol(volAt(ev, age) * shapeAt(age), steps) * ratio * 32 / 15)
      ));
      const { fr } = this._dutyFrames(tone, ev, freq, n * TONE_FRAME, false);
      const per = (i) => fdsPitch(fr[Math.min(i, fr.length - 1)]);
      const v0 = volOf(0), p0 = per(0);
      const vs = [], ps = [];
      let lv = v0, lp = p0;
      for (let i = 1; i < n; i++) {
        const t = t0 + i * TONE_FRAME;
        if (t >= t1) break;
        const v = volOf(i * TONE_FRAME), p = per(i);
        if (v !== lv) {
          vs.push([t, v]);
          lv = v;
        }
        if (p !== lp) {
          ps.push([t, p]);
          lp = p;
        }
      }
      const m = wf.mod;
      return {
        t: t0,
        dur: Math.max(0.01, t1 - t0),
        v: v0,
        p: p0,
        // 波形は音色の名前で見分ける。同じなら処理器は書き直さない
        wave: wf.wave,
        wkey: wf.name,
        ...m ? { mod: {
          ratio: m.ratio,
          gain: fdsModGain(m.depth),
          table: FDS_MOD_TABLES[m.table] || FDS_MOD_TABLES.tri
        } } : {},
        ...vs.length ? { vs } : {},
        ...ps.length ? { ps } : {}
      };
    }
    /**
     * チップ(AY)で鳴らす音符を、常駐の処理器へ渡す形にする。
     *
     * 高さと音量はフレームごとにレジスタの値まで直して渡す。処理器の側は
     * 時刻が来たら書くだけ。高さの表・ポルタメント・ビブラートは幅の表と
     * 同じもの(`_dutyFrames`)、音量の形は段で下ろす音と同じもの(`_stepShape`)を読む。
     *
     * 重ねる音(エコーやオクターブ重ね)は `amp` を下げて渡ってくる。
     * 外から音量を掛けられないので、下げた比を音量レジスタの段で引く。
     *
     * ブザー(`env`)は、高さをエンベロープの周期にして、音量レジスタは
     * エンベロープに従わせる(16)。`@g` で掛けた矩形波は区切り(`gates`)ごとに
     * トーンを開け閉めする。ブザーが休んでいる拍の矩形波(`toneOnly`)は、
     * 同じチャンネルのふつうのトーンとして鳴らす。
     */
    _ayEvent(ev, wf, freq, amp, t0, t1) {
      const tone = wf.tone || { loop: {} };
      const noise = wf.mode === "noise";
      const env = wf.mode === "env" && !ev.toneOnly;
      const lane = wf.mode === "env" && ev.toneOnly;
      const steps = lane ? 16 : ev.vsteps ?? wf.vsteps;
      const { n, shapeAt } = this._chipShape(ev, tone, t0, t1);
      const top = ampFor(ev);
      const down = top > 0 && amp < top * 0.999 ? Math.round(-20 * Math.log10(Math.max(1e-6, amp / top)) / 3) : 0;
      const LANE_VOL = 13;
      const volOf = (age) => {
        if (lane) return Math.max(0, Math.min(15, Math.round(LANE_VOL * shapeAt(age)) - down));
        const v = Math.round(snapVol(volAt(ev, age) * shapeAt(age), steps));
        if (env) return v > 0 ? 16 : 0;
        return Math.max(0, Math.min(15, v - down));
      };
      const { fr } = this._dutyFrames(tone, ev, freq, n * TONE_FRAME, false);
      const div = env ? (AY_ENV_SHAPES[wf.shape] || AY_ENV_SHAPES.saw).div : 0;
      const per = (i) => {
        const f = fr[Math.min(i, fr.length - 1)];
        return env ? ayEnvPeriod(f, div) : noise ? ayNoisePeriod(f) : ayTonePeriod(f);
      };
      const v0 = volOf(0), p0 = per(0);
      const vs = [], ps = [];
      let lv = v0, lp = p0;
      for (let i = 1; i < n; i++) {
        const at = t0 + i * TONE_FRAME;
        if (at >= t1) break;
        const v = volOf(i * TONE_FRAME), p = per(i);
        if (v !== lv) {
          vs.push([at, v]);
          lv = v;
        }
        if (p !== lp) {
          ps.push([at, p]);
          lp = p;
        }
      }
      let g0 = 0;
      const gs = [];
      if (env && ev.gates) {
        for (const g of ev.gates) {
          const tp = g.hz > 0 ? ayTonePeriod(g.hz) : 0;
          if (g.at <= 1e-9) g0 = tp;
          else if (t0 + g.at < t1) gs.push([t0 + g.at, tp]);
        }
      }
      return {
        t: t0,
        dur: Math.max(0.01, t1 - t0),
        v: v0,
        ...noise ? { noise: 1, np: p0 } : env ? { env: { shape: (AY_ENV_SHAPES[wf.shape] || AY_ENV_SHAPES.saw).r13, ep: p0 }, g0 } : { tp: p0 },
        ...wf.ay ? { ay: 1 } : {},
        ...vs.length ? { vs } : {},
        ...ps.length ? { ps } : {},
        ...gs.length ? { gs } : {}
      };
    }
    /**
     * チップ(ファミコン)で鳴らす音符を、常駐の処理器へ渡す形にする。
     *
     * AY と同じく、フレームごとのタイマーと音量をレジスタの値まで直す
     * (高さと音量の形の読み方は `_ayEvent` と同じ)。矩形波は幅の表も読んで、
     * いちばん近い幅(4 通り)に寄せる。三角波は鳴らすか止めるかだけ。
     * 重ねる音で下げた比は、音量の値を比のとおりに引く(値がそのまま振幅なので)。
     */
    _nesEvent(ev, wf, freq, amp, t0, t1) {
      const tone = wf.tone || { loop: {} };
      const mode = wf.mode;
      const steps = ev.vsteps ?? wf.vsteps;
      const { n, shapeAt } = this._chipShape(ev, tone, t0, t1);
      const top = ampFor(ev);
      const ratio = top > 0 ? Math.min(1, amp / top) : 1;
      const volOf = (age) => {
        const v = Math.round(snapVol(volAt(ev, age) * shapeAt(age), steps) * ratio);
        if (mode === "triangle") return v > 0 ? 1 : 0;
        return Math.max(0, Math.min(15, v));
      };
      const { fr, du } = this._dutyFrames(tone, ev, freq, n * TONE_FRAME, false);
      const at = (i) => fr[Math.min(i, fr.length - 1)];
      const per = (i) => mode === "noise" ? nesNoisePeriod(at(i), !!wf.short) : mode === "triangle" ? nesTriangleTimer(at(i)) : nesPulseTimer(at(i));
      const dutyOf = (i) => nesDutyIndex(tone.duty ? du[Math.min(i, du.length - 1)] : wf.duty ?? 0.5);
      const v0 = volOf(0), p0 = per(0), d0 = dutyOf(0);
      const vs = [], ps = [], ds = [];
      let lv = v0, lp = p0, ld = d0;
      for (let i = 1; i < n; i++) {
        const t = t0 + i * TONE_FRAME;
        if (t >= t1) break;
        const v = volOf(i * TONE_FRAME), p = per(i), d = dutyOf(i);
        if (v !== lv) {
          vs.push([t, v]);
          lv = v;
        }
        if (p !== lp) {
          ps.push([t, p]);
          lp = p;
        }
        if (mode === "pulse" && d !== ld) {
          ds.push([t, d]);
          ld = d;
        }
      }
      return {
        t: t0,
        dur: Math.max(0.01, t1 - t0),
        ch: mode,
        v: v0,
        p: p0,
        ...mode === "pulse" ? { duty: d0 } : {},
        ...mode === "noise" && wf.short ? { short: 1 } : {},
        ...vs.length ? { vs } : {},
        ...ps.length ? { ps } : {},
        ...ds.length ? { ds } : {}
      };
    }
    _applyEnvelope(gain, ev, amp, t0, t1) {
      const e = envOf(ev);
      const tail = Math.max(0, Math.min(ev.relTail || 0, t1 - t0 - 0.01));
      const off = t1 - tail;
      const len = Math.max(0.02, off - t0);
      const span = ev.tieSpan > 0 ? Math.max(0.02, ev.tieSpan - tail) : len;
      const since = ev.tieAt > 0 ? ev.tieAt : 0;
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
      const { a, d, rel } = envShape(e, span);
      const w = WAVEFORMS[ev.wave];
      if ((ev.vsteps ?? (w ? w.vsteps : 0)) > 0) {
        const { n, end, shapeAt } = this._stepShape(ev, t0, t1);
        gain.gain.setValueAtTime(ev.legato ? ampAt(ev, shapeAt(0)) : 0, t0);
        for (let i = 0; i < n; i++) {
          const age = i * TONE_FRAME;
          gain.gain.setValueAtTime(Math.max(1e-4, ampAt(ev, shapeAt(age), age)), t0 + age);
        }
        gain.gain.setValueAtTime(1e-4, t0 + end);
        return;
      }
      const sustain = amp * e.s;
      const hAt = (at) => at < a ? a > 0 ? at / a : 1 : at < a + d ? 1 - (1 - e.s) * ((at - a) / Math.max(1e-6, d)) : e.s;
      if (ev.legato) {
        gain.gain.setValueAtTime(Math.max(1e-4, amp * hAt(since)), t0);
        if (since < a + d) {
          gain.gain.linearRampToValueAtTime(Math.max(1e-4, sustain), t0 + (a + d - since));
        }
      } else {
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(amp, t0 + a);
        if (d > 0) gain.gain.linearRampToValueAtTime(Math.max(1e-4, sustain), t0 + a + d);
        else gain.gain.setValueAtTime(amp, t0 + a);
      }
      if (r2 > 0) {
        gain.gain.setValueAtTime(Math.max(1e-4, sustain), Math.max(t0 + a + d - since, off));
        gain.gain.linearRampToValueAtTime(0, off + r2);
        return;
      }
      const room = ev.open ? 2e-3 : rel;
      const relAt = Math.max(t0, off - room);
      gain.gain.linearRampToValueAtTime(
        Math.max(1e-4, amp * hAt(since + (relAt - t0))),
        relAt
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
        const pass = w.kind === "layer" || w.kind === "opll" || w.kind === "opm" || w.kind === "ay" || w.kind === "nes" || w.kind === "fds" || w.kind === "scc" || w.kind === "pce" || w.kind === "opnaRhythm" || w.kind === "baked" && !w.baked || w.tone && w.tone.duty || (ev.vsteps ?? w.vsteps) > 0 && !envOf(ev).table && !(w.tone && w.tone.vol);
        if (!pass) ({ dest, ev } = this._fadeDest(ev, t0, t1, dest));
      }
      const wfa = WAVEFORMS[ev.wave];
      if (wfa && (wfa.kind === "modal" || wfa.kind === "brass")) {
        if (ev.legato) return;
        const to = WORKLETS[wfa.kind].buses === 2 ? this._panPair(dest) : dest;
        this._wkPush(wfa.kind, to, {
          t: t0,
          p: wfa.patch,
          f: freq,
          v: Math.max(0, Math.min(1, (ev.vol ?? 0) / 15)),
          d: Math.max(1e-3, ev.tieSpan ?? t1 - t0)
        });
        return;
      }
      if (wfa && wfa.kind === "ay") {
        this._wkPush("ay", dest, this._ayEvent(ev, wfa, freq, amp, t0, t1));
        return;
      }
      if (wfa && wfa.kind === "nes") {
        this._wkPush("nes", dest, this._nesEvent(ev, wfa, freq, amp, t0, t1));
        return;
      }
      if (wfa && wfa.kind === "fds") {
        this._wkPush("fds", dest, this._fdsEvent(ev, wfa, freq, amp, t0, t1));
        return;
      }
      if (wfa && wfa.kind === "scc") {
        this._wkPush("scc", dest, this._sccEvent(ev, wfa, freq, amp, t0, t1));
        return;
      }
      if (wfa && wfa.kind === "pce") {
        this._wkPush("pce", dest, this._pceEvent(ev, wfa, freq, amp, t0, t1));
        return;
      }
      if (wfa && wfa.kind === "opnaRhythm") {
        this._wkPush("opnaRhythm", dest, this._opnaRhythmEvent(ev, wfa, freq, amp, t0, t1));
        return;
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
        if (wfo.semi) freq *= Math.pow(2, wfo.semi / 12);
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
          // 打楽器。書いた高さを比で渡す。o4c(`DRUM_FREQ`)のままなら
          // 何も渡さないので、実機のドライバが決めた高さのまま鳴る。
          // ずらすのは `#bundle` の `@o` `@d` か、ふつうの音符として鳴らしたとき
          // (→ `sound/opll.js` の `drumBend`、2026-10-04)
          ...wfo.drum ? {
            drum: wfo.drum,
            ...Math.abs(freq / DRUM_FREQ - 1) > 1e-6 ? { rp: freq / DRUM_FREQ } : {}
          } : {},
          ...wfo.set ? { set: wfo.set } : {},
          // タイでつながった音。同じ声で続けて、キーオンを立て直さない。
          // 立て直すとエンベロープが頭から始まるので、滑ったあとにアタックが
          // やり直される(実測で 40ms かけて上がっていた。2026-09-30)
          // `left` はつながりの残りの長さ。キーオフをここまで延ばすために要る。
          // 処理器は「終わる音符」を先に見るので、この音の長さでキーオフを
          // 書くと、同じ時刻に来る続く音がキーオンを立て直すことになる
          ...ev.tieId ? {
            tie: ev.tieId,
            legato: ev.legato ? 1 : 0,
            left: Math.max(0, ev.tieSpan - ev.tieAt)
          } : {},
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
        this._master.gain.value = this._outGain();
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
        out.gain.linearRampToValueAtTime(this._outGain(), t + 0.05);
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
    /**
     * 出口に入れる数。掛け算を 1 か所にまとめてある。
     *
     * 聴く人のつまみ(`volume`)と、曲が名乗る大きさ(`#gain`)は別のもので、
     * 出口ではどちらも掛かる。3 か所(出口を作る・消す・つまみを回す)で
     * 別々に書くと、片方だけ直したときに音が食い違う。
     * @returns {number}
     * @private
     */
    _outGain() {
      return this._muted ? 0 : this.volume * this._songGain;
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
        this._master.gain.linearRampToValueAtTime(this._outGain(), t + 0.05);
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

  // engine/tool/ui/version.js
  var PLAYER_VERSION = "1.0.0";

  // engine/tool/core/tomml.js
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

  // engine/tool/core/wav.js
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

  // engine/tool/ui/player.js
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
/* \u66F2\u306B\u7F6E\u3044\u305F\u5B57\u3002\u30C1\u30E3\u30F3\u30CD\u30EB\u3054\u3068\u306B 1 \u3064\u51FA\u3057\u3066\u3001\u6765\u305F\u9806\u306B\u4E26\u3079\u308B\u3002

   **\u9AD8\u3055\u306F\u5B57\u304C\u51FA\u3066\u3044\u306A\u304F\u3066\u3082\u53D6\u3063\u3066\u304A\u304F\u3002**\u51FA\u5165\u308A\u306E\u305F\u3073\u306B\u4E0B\u306E\u884C\u304C\u52D5\u304F\u3068\u3001
   \u62BC\u3057\u306B\u884C\u3063\u305F\u3082\u306E\u304C\u305A\u308C\u308B\u3002\u67A0 1 \u3064\u3076\u3093(24px)\u3092\u5148\u306B\u78BA\u4FDD\u3057\u3066\u3001
   \u5B57\u306E\u6709\u7121\u3067\u884C\u306E\u9AD8\u3055\u304C\u5909\u308F\u3089\u306A\u3044\u3088\u3046\u306B\u3059\u308B(2026-10-05)\u3002

   **\u6A2A\u306B\u3082\u52D5\u304B\u3055\u306A\u3044\u3002**\u884C\u3092 1 \u5217\u306B\u8A70\u3081\u308B\u30DA\u30FC\u30B8(.row \u3092 display:contents \u306B
   \u3059\u308B\u3082\u306E)\u3067\u306F\u884C\u306E\u7BB1\u304C\u6D88\u3048\u308B\u306E\u3067\u3001\u5B57\u304C\u62BC\u3057\u3069\u3053\u308D\u3068\u540C\u3058\u5217\u306B\u5165\u308A\u3001
   \u5E45\u304C\u5909\u308F\u308B\u305F\u3073\u306B\u300C\u2026\u300D\u304C\u5DE6\u53F3\u306B\u52D5\u3044\u3066\u3044\u305F\u30021 \u3064\u306E\u7BB1(.saidwrap)\u306B\u307E\u3068\u3081\u3066\u3001
   flex-basis:100% \u3067\u5FC5\u305A\u81EA\u5206\u306E\u884C\u3092\u53D6\u3089\u305B\u308B\u3002\u7BB1\u304C 1 \u3064\u306A\u3089\u3001
   \u884C\u3092\u7573\u307E\u308C\u3066\u3082\u5217\u306E\u4E2D\u3067\u6298\u308A\u8FD4\u3059(2026-10-05) */
.mmsxx-player .saidwrap{
  display:flex; align-items:center; gap:10px; flex:0 0 100%; min-width:0;
}
.mmsxx-player .said{
  display:flex; flex-wrap:wrap; gap:7px; align-items:center; min-height:24px;
}
.mmsxx-player .said span{
  padding:2px 7px; border:1px solid var(--line); border-radius:3px;
  line-height:18px; background:var(--panel); color:var(--ink); white-space:pre;
}
.mmsxx-player .said span b{
  font-weight:400; font-size:10.5px; color:var(--dim); margin-right:5px;
}
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
      <div class="row" data-p="textrow" hidden>
        <span class="saidwrap">
          <span class="lbl">Text</span>
          <span class="said" data-p="said"></span>
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
      said: $("said"),
      textrow: $("textrow"),
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
    const srcButtons = () => {
      el.showmml.hidden = opts.showMml === false || data !== null;
      el.mml.hidden = data !== null;
      el.copy.hidden = copyMode === false || data !== null;
    };
    el.looserow.hidden = opts.ignoreErrors !== true;
    const showVol = opts.volume !== false;
    const showMute = opts.mute === true;
    el.vol.hidden = !showVol;
    el.mute.hidden = !showMute;
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
    const TEXT_HOLD = 4;
    let played = 0;
    let cues = [];
    let texts = [];
    const said = /* @__PURE__ */ new Map();
    const leds = /* @__PURE__ */ new Map();
    let lastPos = 0;
    let takes = [];
    let dragging = false;
    let from = 0;
    let mml = opts.mml ?? "";
    let data = opts.data ?? null;
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
    function reload() {
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
      clearTexts();
      drawCuts();
      draw();
      srcButtons();
    }
    function read() {
      voices = data ? [] : Array.isArray(mml) ? mml.map((v) => String(v ?? "")).filter((v) => v.trim() !== "") : splitVoices(mml);
      chans = [];
      marks = [];
      total = 0;
      if (data ? !data.length : !voices.length) {
        say("Nothing to play.", "err");
        return false;
      }
      let got = null;
      try {
        if (data) audio.defineBGMData(NAME, data);
        else audio.defineBGM(NAME, voices, loose ? { mode: "loose" } : {});
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
      texts = got.texts ?? [];
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
      const old = Array.isArray(mml) ? mml.reduce((n, v) => n + countOldStyle(v), 0) : countOldStyle(mml);
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
          if (audio.bgmActive(NAME)) audio.seekBGM(audio.bgmPosition(), { cut: false });
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
    function showText(x) {
      if (x.text === "") {
        said.delete(x.ch);
        drawTexts();
        return;
      }
      said.set(x.ch, { text: x.text, until: played + TEXT_HOLD });
      drawTexts();
    }
    function sweepTexts() {
      let went = false;
      for (const [ch, v] of said) {
        if (played >= v.until) {
          said.delete(ch);
          went = true;
        }
      }
      if (went) drawTexts();
    }
    function drawTexts() {
      el.textrow.hidden = texts.length === 0;
      el.said.textContent = "";
      for (const ch of [...said.keys()].sort((a, b) => a - b)) {
        const span = document.createElement("span");
        const who = document.createElement("b");
        who.textContent = `ch${ch + 1}`;
        span.appendChild(who);
        span.appendChild(document.createTextNode(said.get(ch).text));
        el.said.appendChild(span);
      }
    }
    function clearTexts() {
      said.clear();
      drawTexts();
    }
    function passedTexts(from2, to, len) {
      if (!texts.length) return;
      const hit = (a, b) => {
        for (const x of texts) if (x.t > a && x.t <= b) showText(x);
      };
      if (to >= from2) hit(from2 <= 0 ? -1 : from2, to);
      else if (wrapped(from2, to, len)) {
        hit(from2, len);
        hit(-1, to);
      }
    }
    function wrapped(from2, to, len) {
      return len > 0 && from2 - to > len / 2;
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
        if (on && !s.paused) {
          played += at >= lastPos ? at - lastPos : wrapped(lastPos, at, len) ? Math.max(0, len - lastPos) + at : 0;
          passedTexts(lastPos, at, len);
          sweepTexts();
          passedCues(at);
          lastPos = at;
        } else lastPos = at;
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
        let data2 = buf.getChannelData(0);
        if (ab) {
          const a0 = Math.max(0, Math.floor(ab.from * rate));
          const a1 = Math.min(data2.length, Math.ceil(ab.to * rate));
          data2 = data2.slice(a0, a1);
        }
        const meta = audio.bgmInfo(NAME)?.meta ?? {};
        const name = String(meta.title || "mmsxx").replace(/[\\/:*?"<>|]/g, "_");
        const blob = new Blob([writeWAV(data2, rate)], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const secs = (data2.length / rate).toFixed(1);
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
      clearTexts();
      lastPos = from;
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
      clearTexts();
      lastPos = 0;
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
    srcButtons();
    read();
    drawLoops();
    drawGroups();
    drawChannels();
    drawMarks();
    drawTakes();
    fold();
    drawFx();
    drawLeds();
    clearTexts();
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
        data = null;
        reload();
      },
      /**
       * 外から、読み終えた中間データを差し替える。`setMML()` の字を通さない版。
       *
       * @param {object[]} tracks `compileMML()` が返す形の並び。チャンネル 1 本につき 1 つ
       */
      setData(tracks) {
        data = tracks;
        mml = "";
        reload();
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

  // engine/samples-entry.js
  var sound = { ...audio_exports, ...mml_exports, ...tones_exports, mountPlayer, PLAYER_CSS, PLAYER_VERSION, player: { mount: mountPlayer, CSS: PLAYER_CSS, version: PLAYER_VERSION } };
  window.MMSXX = window.MMSXX || {};
  window.MMSXX.sound = sound;
})();
