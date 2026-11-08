// **GM(General MIDI)の音色名。**128 個の並びは決まりで、番号がそのまま音色。
//
// ---- なぜ engine の側に置くか ----
//
// 音色が「MIDI に出すならこれ」を持てるようにしたので(`registerWave` などの
// `gm`)、**書いた場所で名前を確かめたい。**道具の側に置くと、
// 書き間違いは書き出すまで分からず、**黙って別の音色で出る。**
//
// 表そのものは 128 行の文字列で、外から何も持ってこない
// (`sound/` は外部依存ゼロ)。
//
// ---- 番号で書いてもよい ----
//
// `gm: 56` でも `gm: 'Trumpet'` でも同じ。**数字は表を見ないと読めない**ので、
// 名前で書けるほうを足した。

/** GM の 128 音色。**並びが番号**(0 = Acoustic Grand Piano) */
export const GM_NAMES = [
  'Acoustic Grand Piano', 'Bright Acoustic Piano', 'Electric Grand Piano', 'Honky-tonk Piano',
  'Electric Piano 1', 'Electric Piano 2', 'Harpsichord', 'Clavi',
  'Celesta', 'Glockenspiel', 'Music Box', 'Vibraphone',
  'Marimba', 'Xylophone', 'Tubular Bells', 'Dulcimer',
  'Drawbar Organ', 'Percussive Organ', 'Rock Organ', 'Church Organ',
  'Reed Organ', 'Accordion', 'Harmonica', 'Tango Accordion',
  'Acoustic Guitar (nylon)', 'Acoustic Guitar (steel)', 'Electric Guitar (jazz)', 'Electric Guitar (clean)',
  'Electric Guitar (muted)', 'Overdriven Guitar', 'Distortion Guitar', 'Guitar Harmonics',
  'Acoustic Bass', 'Electric Bass (finger)', 'Electric Bass (pick)', 'Fretless Bass',
  'Slap Bass 1', 'Slap Bass 2', 'Synth Bass 1', 'Synth Bass 2',
  'Violin', 'Viola', 'Cello', 'Contrabass',
  'Tremolo Strings', 'Pizzicato Strings', 'Orchestral Harp', 'Timpani',
  'String Ensemble 1', 'String Ensemble 2', 'Synth Strings 1', 'Synth Strings 2',
  'Choir Aahs', 'Voice Oohs', 'Synth Voice', 'Orchestra Hit',
  'Trumpet', 'Trombone', 'Tuba', 'Muted Trumpet',
  'French Horn', 'Brass Section', 'Synth Brass 1', 'Synth Brass 2',
  'Soprano Sax', 'Alto Sax', 'Tenor Sax', 'Baritone Sax',
  'Oboe', 'English Horn', 'Bassoon', 'Clarinet',
  'Piccolo', 'Flute', 'Recorder', 'Pan Flute',
  'Blown Bottle', 'Shakuhachi', 'Whistle', 'Ocarina',
  'Lead 1 (square)', 'Lead 2 (sawtooth)', 'Lead 3 (calliope)', 'Lead 4 (chiff)',
  'Lead 5 (charang)', 'Lead 6 (voice)', 'Lead 7 (fifths)', 'Lead 8 (bass + lead)',
  'Pad 1 (new age)', 'Pad 2 (warm)', 'Pad 3 (polysynth)', 'Pad 4 (choir)',
  'Pad 5 (bowed)', 'Pad 6 (metallic)', 'Pad 7 (halo)', 'Pad 8 (sweep)',
  'FX 1 (rain)', 'FX 2 (soundtrack)', 'FX 3 (crystal)', 'FX 4 (atmosphere)',
  'FX 5 (brightness)', 'FX 6 (goblins)', 'FX 7 (echoes)', 'FX 8 (sci-fi)',
  'Sitar', 'Banjo', 'Shamisen', 'Koto',
  'Kalimba', 'Bag pipe', 'Fiddle', 'Shanai',
  'Tinkle Bell', 'Agogo', 'Steel Drums', 'Woodblock',
  'Taiko Drum', 'Melodic Tom', 'Synth Drum', 'Reverse Cymbal',
  'Guitar Fret Noise', 'Breath Noise', 'Seashore', 'Bird Tweet',
  'Telephone Ring', 'Helicopter', 'Applause', 'Gunshot',
];

/** 引くときの形にそろえる。**大文字小文字・空白・括弧の中の記号を無視する** */
const key = (s) => String(s).toLowerCase().replace(/[^a-z0-9+]/g, '');

const BY_KEY = new Map(GM_NAMES.map((n, i) => [key(n), i]));

/**
 * 名前から番号を引く。**知らない名前は -1。**
 *
 * `'Trumpet'` `'trumpet'` `'Lead 1 (square)'` `'lead1square'` はどれも同じ。
 */
export function gmIndex(name) {
  const at = BY_KEY.get(key(name));
  return at === undefined ? -1 : at;
}

/**
 * 書き間違いのときに出す**近そうな名前**。
 *
 * **並べるだけで直せることが多い。**`'Trumpt'` と書いた人に
 * 128 個ぜんぶを見せても探せないので、**含んでいるもの**から数個。
 */
export function gmLike(name, limit = 5) {
  const k = key(name);
  if (!k) return [];
  const hit = GM_NAMES.filter((n) => key(n).includes(k) || k.includes(key(n)));
  if (hit.length) return hit.slice(0, limit);
  // 含んでいるものが無ければ、**頭 3 文字が同じもの**
  const head = k.slice(0, 3);
  return GM_NAMES.filter((n) => key(n).startsWith(head)).slice(0, limit);
}
