// Exercise the bundled scheduler with a virtual clock; no audio device required.
const assert = require('node:assert/strict');
global.window = global;
require('../docs/music/player-engine.js');
const originalTimeout = global.setTimeout;
function run(loops, repeat, structured = true) {
  let alive = true, time = 0;
  const pending = [], spans = [];
  const audio = {
    ctx: { get currentTime() { return time; }, createGain() { return { gain: {}, connect() {} }; } },
    _chMute: new Set(), _range: null, loopTimes: loops,
    ignoreSongLoop: !repeat, playOutro: true,
    _scheduleTrack(track, base, gain, nodes, from, to) { spans.push({ base, from, to }); },
    _scheduleCues() {}, _wkFlushAll() {}, stopBGM() { alive = false; },
  };
  global.setTimeout = (fn, ms) => { pending.push({ fn, at: time + ms / 1000 }); return pending.length; };
  try {
    MMSXX.sound.ChipTuneSound.prototype._pump.call(audio,
      [{ total: .8, loop: structured ? { from: .2 } : null, outro: structured ? .6 : null }],
      true, { nodes: [] }, {}, () => alive);
    for (let i = 0; alive && pending.length && i < 100; i++) {
      pending.sort((a, b) => a.at - b.at);
      const next = pending.shift(); time = next.at; next.fn();
    }
  } finally { global.setTimeout = originalTimeout; }
  return { alive, duration: Math.max(...spans.map(s => s.base + s.to)) - .05,
    starts: spans.filter(s => s.from === 0).length };
}
for (const loops of [1, 2, 3]) {
  const r = run(loops, false);
  assert.equal(r.alive, false);
  assert.equal(r.starts, 1);
  assert(Math.abs(r.duration - (.4 + .4 * loops)) < 1e-8);
}
assert.equal(run(2, true).alive, true);
assert(run(2, true).starts > 1);
assert.equal(run(Infinity, false).alive, true);
assert(Math.abs(run(3, false, false).duration - .8) < 1e-8);
console.log('PASS loop counts 1/2/3, Repeat all, Endless, and unstructured song');
