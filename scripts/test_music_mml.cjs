// Compiles every sample with the bundled current engine. No browser required.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

global.window = global;
require('../docs/music/player-engine.js');

const E = MMSXX.sound;
assert.equal(E.SOUND_VERSION, '0.20.0', 'bundled sound engine version');
const nesTriangle = E.WAVEFORMS[E.findWave('wtNesTriangle')];
assert(nesTriangle?.special?.includes('fixedvolume'),
  'wtNesTriangle must ignore every nonzero MML volume');
const audioProto = E.ChipTuneSound.prototype;
assert(audioProto.renderBGM.toString().includes('this._scheduleTrack'),
  'WAV export must use the shared track scheduler');
assert(audioProto._scheduleTrack.toString().includes('this._extraVoices'),
  'the shared scheduler must include dynamic effects');
assert(audioProto._extraVoices.toString().includes('this.dynamic_effects'),
  'dynamic effects must be read by playback and WAV export');

const root = path.resolve(__dirname, '../docs/music');
const songs = [
  ['01_Volcano-parade/volcano-parade.mml', 7,
    ['イントロ', 'Aメロ', 'Bメロ', 'Cメロ', '静かな区間', 'イントロ2', 'エンディング']],
  ['02_Pocket-Tunnel/original.mml', 12, ['イントロ', '本編', 'エンディング']],
  ['02_Pocket-Tunnel/jazz.mml', 13, ['イントロ', '本編', 'エンディング']],
  ['02_Pocket-Tunnel/fusion-v1.mml', 10, ['イントロ', '本編', 'エンディング']],
  ['03_Windward-Crossing/windward-crossing.mml', 3, [
    'イントロ', 'フィールド', 'エンカウント', '戦闘 A', '戦闘 B', '戦闘 C',
    '勝利', 'フィールド（後半）', 'エンカウント（後半）',
    '戦闘 B（後半）', '戦闘 C（後半）', '敗北',
  ]],
  ['04_Grassland-Trinity/grassland-trinity.mml', 4],
];

function splitMML(text) {
  const lines = text.split(/\r?\n/);
  const marks = lines.map((line, index) =>
    /^\s*\/\/\s*#\s*ch(?:\s|$)/i.test(line) ? index : -1
  ).filter(index => index >= 0);
  if (!marks.length) return text.trim() ? [text] : [];
  const head = lines.slice(0, marks[0]);
  return marks.map((at, index) =>
    [...head, ...lines.slice(at, marks[index + 1] ?? lines.length)].join('\n')
  );
}

const sources = songs.map(([file, channels, marks]) => ({
  file, channels, marks, source: fs.readFileSync(path.join(root, file), 'utf8'),
}));

for (const file of [
  '03_Windward-Crossing/player.js',
  '04_Grassland-Trinity/player.js',
]) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  assert(source.includes("wave: 'wtNesTriangle'"), file + ': NES triangle');
  assert(!/wave:\s*['"]triangle['"]/.test(source), file + ': no volume-sensitive triangle');
}

// Page-specific timbres are registered by each player.js. Placeholder voices
// are enough here because this test validates notation and arrangement shape.
for (const { source } of sources) {
  for (const match of source.matchAll(/@\{([^}]+)\}/g)) {
    if (E.findWave(match[1]) < 0) E.registerTone(match[1], { wave: 'pulse:50' });
  }
  for (const match of source.matchAll(/@e\{([^}]+)\}/g)) {
    if (!E.ENVELOPES.some(env =>
      env.name.toLowerCase() === match[1].toLowerCase())) {
      E.registerEnvelope(match[1], { a: .001, d: 0, s: 1, r: .001 });
    }
  }
}

for (const { file, channels, marks, source } of sources) {
  const audio = new E.ChipTuneSound();
  const result = audio.defineBGM('test', splitMML(source));
  assert(result.ok, file + ': ' + result.errors.map(error => error.text).join(' | '));
  const info = audio.bgmInfo('test');
  assert.equal(info.tracks.length, channels, file + ': channel count');
  assert(info.total > 0, file + ': duration');
  if (marks) assert.deepEqual(info.marks.map(mark => mark.name), marks,
    file + ': jump labels');
  if (marks) assert(info.marks.every((mark, index) =>
    index === 0 || mark.t > info.marks[index - 1].t), file + ': jump label order');
  console.log('PASS', file, channels + 'ch', info.total.toFixed(3) + 's');
}
