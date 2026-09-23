// Compiles every sample with the bundled current engine. No browser required.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

global.window = global;
require('../docs/music/player-engine.js');

const E = MMSXX.sound;
assert.equal(E.SOUND_VERSION, '0.21.0', 'bundled sound engine version');
assert(E.compileMML('@{tape:worn}{ o2 a1 f1 c1 g1 }').events.every(event => event.tape?.data),
  'tape sections must accept note names as data bursts');
const echoProbeAudio = new E.ChipTuneSound();
assert(echoProbeAudio.defineBGM('echo-probe', ['t120 @s8 c8 r2']).ok,
  'echo probe must compile');
assert(echoProbeAudio.bgmDefs.get('echo-probe')[0].events.some(event =>
  event.tail && event.echo === null && Math.abs(event.gate - .21875) < 1e-9),
  'echo copies must keep the source gate length and use the fading tail envelope');
const hiddenEchoAudio = new E.ChipTuneSound();
assert(hiddenEchoAudio.defineBGM('hidden-echo', ['t120 @s8 l4 q5 c c r c r c r2']).ok,
  'hidden echo probe must compile');
const hiddenEchoEvents = hiddenEchoAudio.bgmDefs.get('hidden-echo')[0].events;
const hiddenEchoCopies = hiddenEchoEvents.filter(event => event.tail);
for (const note of hiddenEchoEvents.filter(event => !event.tail)) {
  assert(hiddenEchoCopies.some(copy => copy.t > note.t && copy.t < note.t + .5),
    `echo hidden by note at ${note.t.toFixed(3)} must emerge in the following gap`);
}
assert.equal(Math.max(...hiddenEchoCopies.map(event => event.vol)), 4,
  'the loudest hidden echo copy must not be discarded');
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
  ['03_Windward-Crossing/ch1-field/ch1-field.mml', 1, ['フィールド']],
  ['04_Grassland-Trinity/grassland-trinity.mml', 4],
  ['05_Windward-Battle-Interactive/windward-battle-interactive.mml', 4],
  ['06_BEAT_V2/beat_v2.mml', 4],
  ['07_Dark-Corridor/dark-corridor.mml', 6,
    ['A_start', 'B_start', 'A_return', 'B_final']],
  ['DUMMY/tape-load-melancholy.mml', 7],
];

function splitMML(text) {
  const lines = text.split(/\r?\n/);
  const marks = lines.map((line, index) =>
    /^\s*#\s*ch(?:\s|$)/i.test(line) ? index : -1
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

for (const { file, source } of sources) {
  assert.equal(E.countOldStyle(source), 0, file + ': no legacy // # directives');
  assert(!/@s[1-9]\d*/.test(source), file + ': active echo must specify depth');
}

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
    [...source.matchAll(/^\s*#(?:bundle|chord)\s+([\w-]+)/gim)]
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

const expectedBundleCounts = new Map([
  ['01_Volcano-parade/volcano-parade.mml', 8],
  ['02_Pocket-Tunnel/original.mml', 9],
  ['02_Pocket-Tunnel/jazz.mml', 10],
  ['02_Pocket-Tunnel/fusion-v1.mml', 2],
]);
for (const { file, source } of sources) {
  if (expectedBundleCounts.has(file)) {
    assert.equal(E.readBundles(source).size, expectedBundleCounts.get(file),
      file + ': bundled voice count');
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
    assert.equal(info.meta.version, '1.8', file + ': song version');
    assert(!info.meta.about.includes('CH3とCH4は発音が重ならないため統合可能。'),
      file + ': echoed counter melody is no longer mergeable with drums');
    assert(!info.meta.about.includes('ファミコン準拠'),
      file + ': must not claim Famicom compliance');
    assert.deepEqual(info.tracks.map(track => track.name),
      ['主旋律', 'ベース', '副旋律', 'ドラム'], file + ': channel names');
    assert.equal(info.tracks[0].voices, 1,
      file + ': channel 1 self echo must stay within one voice');
    const compiled = audio.bgmDefs.get('test');
    const counter = compiled[2].events;
    const fieldStart = info.marks.find(mark => mark.name === 'フィールド').t;
    const fieldEnd = info.marks.find(mark => mark.name === 'エンカウント').t;
    assert(compiled[0].events.some(event =>
      event.t >= fieldStart && event.t < fieldEnd && event.echo !== null),
    file + ': channel 1 field lead self echo');
    assert(counter.some(event => event.t >= fieldStart && event.t < fieldEnd),
      file + ': channel 3 must complement the field melody');
    assert(counter.some(event => event.echo !== null),
      file + ': channel 3 counter melody self echo');
  }
  if (file === '03_Windward-Crossing/ch1-field/ch1-field.mml') {
    assert.deepEqual(info.tracks.map(track => track.name), ['主旋律'],
      file + ': only channel 1');
    assert.equal(info.tracks[0].voices, 1,
      file + ': field lead self echo must stay within one voice');
    const compiled = audio.bgmDefs.get('test');
    assert(compiled[0].events.some(event => event.echo !== null),
      file + ': field lead self echo');
    const suiteSource = sources.find(song =>
      song.file === '03_Windward-Crossing/windward-crossing.mml').source;
    const suiteAudio = new E.ChipTuneSound();
    assert(suiteAudio.defineBGM('suite', splitMML(suiteSource)).ok,
      file + ': source suite compiles for comparison');
    const suiteInfo = suiteAudio.bgmInfo('suite');
    const fieldStart = suiteInfo.marks.find(mark => mark.name === 'フィールド').t;
    const fieldDuration = 8 * 4 * 60 / 112;
    const suiteField = suiteAudio.bgmDefs.get('suite')[0].events.filter(event =>
      event.t >= fieldStart - 1e-9 && event.t < fieldStart + fieldDuration - 1e-9);
    const comparable = (event, offset) => ({
      t: +(event.t - offset).toFixed(9),
      dur: +event.dur.toFixed(9),
      gate: +event.gate.toFixed(9),
      freq: +event.freq.toFixed(9),
      vol: event.vol,
      wave: event.wave,
      env: event.env,
      vibrato: event.vibrato,
      echo: event.echo && {
        delay: +event.echo.delay.toFixed(9), depth: event.echo.depth,
      },
      vib: event.vib,
      open: event.open,
    });
    assert.deepEqual(compiled[0].events.filter(event => !event.tail)
      .map(event => comparable(event, 0)),
      suiteField.filter(event => !event.tail)
        .map(event => comparable(event, fieldStart)),
      file + ': notes and sound settings match the suite CH1 field');
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
    assert.equal((source.match(/#switch 0\s*\n\s*#takes 結末/g) || []).length,
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
  if (file === 'DUMMY/tape-load-melancholy.mml') {
    assert.deepEqual(info.tracks.map(track => track.name),
      ['テープ', '旋律', '対旋律', 'アルペジオ', 'ベース', 'ドラム', 'ビープ'],
      file + ': channel names');
    assert.equal(E.readBundles(source).size, 9, file + ': bundled voice count');
  }
  console.log('PASS', file, channels + 'ch', info.total.toFixed(3) + 's');
}
