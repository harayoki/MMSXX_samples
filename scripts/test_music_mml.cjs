// Compiles every sample with the bundled current engine. No browser required.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

global.window = global;
require('../docs/music/player-engine.js');

const E = MMSXX.sound;
assert.equal(E.SOUND_VERSION, '0.21.0', 'bundled sound engine version');
const vibratoProbe = E.compileMML('t120 @m{5,7,18} o4 c4').events[0];
assert.deepEqual(vibratoProbe.vib, { depth: 5, speed: 7, delay: 18 },
  'extended @m must keep depth, speed and delay');
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
assert(/at < len \/ 1e3 \? 0 : at/.test(E.mountPlayer.toString()),
  'the seek slider left edge must resolve to exactly 0 seconds');

// A seek a few milliseconds past a note head must snap back to that head.
// Otherwise the scheduler drops the complete opening note.
const seekProbe = Object.create(audioProto);
seekProbe.ctx = { currentTime: 10 };
seekProbe._takeWait = null;
seekProbe._dropCues = () => {};
const seekState = {
  pump() { this.pumped = true; },
  tracks: [{ events: [{ t: 0 }, { t: 1 }] }],
  length: 2,
  timer: 0,
  nodes: [],
  endAt: null,
  lapEnd: 2,
  paused: false,
  base: 0,
  showBase: 0,
  wraps: [],
};
seekProbe.bgmState = seekState;
seekProbe.seekBGM(0.004);
assert.equal(seekState.cursor, 0, 'seek must snap back to a note head within 5 ms');

const root = path.resolve(__dirname, '../docs/music');
const songs = [
  ['01_Volcano-parade/volcano-parade.mml', 7,
    ['イントロ', 'Aメロ', 'Bメロ', 'Cメロ', '静かな区間', 'イントロ2', 'エンディング']],
  ['02_Pocket-Tunnel/original.mml', 12, ['イントロ', '本編', 'エンディング']],
  ['02_Pocket-Tunnel/jazz.mml', 13, ['イントロ', '本編', 'エンディング']],
  ['02_Pocket-Tunnel/fusion-v1.mml', 10, ['イントロ', '本編', 'エンディング']],
  ['03_Windward-Crossing/windward-crossing.mml', 4, [
    'イントロ', 'フィールド', 'エンカウント', '戦闘 A', '戦闘 B', '戦闘 C',
    '勝利', 'フィールド（後半）', 'エンカウント（後半）',
    '戦闘 B（後半）', '戦闘 C（後半）', '敗北',
  ]],
  ['04_Grassland-Trinity/grassland-trinity.mml', 4],
  ['05_Windward-Battle-Interactive/windward-battle-interactive.mml', 4],
  ['06_BEAT/beat.mml', 4, ['開始']],
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
  const declaredTones = new Set(
    [...source.matchAll(/^\s*\/\/\s*#(?:bundle|chord)\s+([\w-]+)/gim)]
      .map(match => match[1].toLowerCase()),
  );
  for (const match of source.matchAll(/@\{([^}]+)\}/g)) {
    const name = match[1].trim();
    if (declaredTones.has(name.toLowerCase()) || /^drums(?:\s|$)/i.test(name)) continue;
    if (E.findWave(name) < 0) E.registerTone(name, { wave: 'pulse:50' });
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
  if (file === '03_Windward-Crossing/windward-crossing.mml') {
    assert.equal(info.meta.version, '1.7', file + ': song version');
    assert(info.meta.about.includes('CH3とCH4は発音が重ならないため統合可能。'),
      file + ': mergeable channel note');
    assert(!info.meta.about.includes('ファミコン準拠'),
      file + ': must not claim Famicom compliance');
    assert.deepEqual(info.tracks.map(track => track.name),
      ['主旋律', 'ベース', '副旋律', 'ドラム'], file + ': channel names');
    assert.equal(info.tracks[0].voices, 1,
      file + ': channel 1 self echo must stay within one voice');
    const compiled = audio.bgmDefs.get('test');
    const counter = compiled[2].events;
    const drums = compiled[3].events;
    const fieldStart = info.marks.find(mark => mark.name === 'フィールド').t;
    const fieldEnd = info.marks.find(mark => mark.name === 'エンカウント').t;
    assert(compiled[0].events.some(event =>
      event.t >= fieldStart && event.t < fieldEnd && event.echo !== null),
    file + ': channel 1 field lead self echo');
    assert(counter.some(event => event.t >= fieldStart && event.t < fieldEnd),
      file + ': channel 3 must complement the field melody');
    assert(!counter.some(a => drums.some(b =>
      a.t < b.t + b.gate - 1e-9 && b.t < a.t + a.gate - 1e-9)),
    file + ': counter melody and drums must not overlap');
  }
  if (file === '06_BEAT/beat.mml') {
    assert.deepEqual(info.tracks.map(track => track.name),
      ['ベース1', 'ベース2', 'ドラム', 'ブラス'], file + ': channel names');
    assert.deepEqual(info.tracks[2].lanes.map(lane => lane.label),
      ['バスドラ', 'ハイハットC', 'ハイハットO', 'スネア', 'タム', 'タムLow'],
      file + ': drum lanes');
    assert.deepEqual(info.tracks[3].lanes.map(lane => lane.label),
      ['ブラス1', 'ブラス2', 'ブラス3'], file + ': chord lanes');
  }
  if (file.startsWith('05_Windward-Battle-Interactive/')) {
    assert.equal(info.meta.version, '1.7', file + ': song version');
    assert.deepEqual(info.tracks.map(track => track.name),
      ['主旋律', 'ベース', '副旋律', 'ドラム'], file + ': channel names');
    assert.deepEqual(info.marks.map(mark => mark.name), ['エンカウント', 'LOOP', 'OUTRO'],
      file + ': encounter / loop / outro labels');
    assert.deepEqual(info.takes.map(take => ({
      group: take.group, now: take.now, options: take.options,
      restart: take.restart, noWait: take.noWait,
    })), [
      {
        group: '戦闘曲', now: '戦闘 A', options: ['戦闘 A', '戦闘 B', '戦闘 C'],
        restart: true, noWait: false,
      },
      {
        group: '結末', now: '勝利', options: ['勝利', '敗北'],
        restart: false, noWait: false,
      },
    ], file + ': interactive takes');
    assert(info.takes.every(take => take.boxes.every(box =>
      Math.abs(box.dur - take.boxes[0].dur) < 1e-6)), file + ': aligned take lengths');
    assert.equal((source.match(/\/\/\s*#switch 0\s*\n\/\/\s*#takes 結末/g) || []).length,
      channels, file + ': #switch 0 immediately before every outcome takes block');
    assert.equal(info.switches.grid.length, 0, file + ': #switch 0 disables the grid');
    const compiled = audio.bgmDefs.get('test');
    const counter = compiled[2].events;
    const drums = compiled[3].events;
    assert(!counter.some(a => drums.some(b =>
      a.t < b.t + b.gate - 1e-9 && b.t < a.t + a.gate - 1e-9)),
    file + ': counter melody and drums must not overlap');
    const switchSeconds = 2 * 240 / 152;
    const battleCuts = info.switches.bars.filter(point => point <= info.outro + 1e-6);
    assert(battleCuts.slice(1).every((point, index) =>
      Math.abs(point - battleCuts[index] - switchSeconds) < 1e-6),
    file + ': manual two-bar battle cuts');
    for (const battle of ['戦闘 A', '戦闘 B', '戦闘 C']) {
      audio.selectTake('test', '戦闘曲', battle);
      for (const outcome of ['勝利', '敗北']) {
        audio.selectTake('test', '結末', outcome);
        const current = audio.bgmInfo('test');
        const outcomeCuts = current.switches.bars.filter(point => point > current.outro + 1e-6);
        assert.equal(outcomeCuts.length, 1, file + `: ${outcome} has only its end cut`);
        assert(Math.abs(outcomeCuts[0] - current.total) < 1e-6,
          file + `: ${outcome} cannot switch before its end`);
      }
    }
  }
  console.log('PASS', file, channels + 'ch', info.total.toFixed(3) + 's');
}
