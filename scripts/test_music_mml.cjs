// Compiles every sample with the bundled current engine. No browser required.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

global.window = global;
require('../docs/music/player-engine.js');

const E = MMSXX.sound;
const root = path.resolve(__dirname, '../docs/music');
const songs = [
  ['01_Volcano-parade/volcano-parade.mml', 7],
  ['02_Pocket-Tunnel/original.mml', 12],
  ['02_Pocket-Tunnel/jazz.mml', 13],
  ['02_Pocket-Tunnel/fusion-v1.mml', 10],
  ['03_Windward-Crossing/windward-crossing.mml', 3],
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

const sources = songs.map(([file, channels]) => ({
  file, channels, source: fs.readFileSync(path.join(root, file), 'utf8'),
}));

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

for (const { file, channels, source } of sources) {
  const audio = new E.ChipTuneSound();
  const result = audio.defineBGM('test', splitMML(source));
  assert(result.ok, file + ': ' + result.errors.map(error => error.text).join(' | '));
  const info = audio.bgmInfo('test');
  assert.equal(info.tracks.length, channels, file + ': channel count');
  assert(info.total > 0, file + ': duration');
  console.log('PASS', file, channels + 'ch', info.total.toFixed(3) + 's');
}
