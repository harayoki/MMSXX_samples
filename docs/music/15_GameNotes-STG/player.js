// GameNotes STG: 5巡 + 旧F案 Fsus4 → F → A♭。
// 公式Sound 0.46.0とPico PLAYER 1.4.0をDEV共通ランタイムから使用。
(async () => {
  const E = MMSXX.sound;
  const root = document.getElementById('gamenotes-player');
  const status = document.querySelector('[data-music-status]');
  const report = error => {
    status.textContent = 'PLAYER エラー：' + (error?.stack || error?.message || String(error));
    console.error('[GameNotes]', error);
  };
  window.addEventListener('error', e => report(e.error || e.message));
  window.addEventListener('unhandledrejection', e => report(e.reason));
  try {
    await import('./addons.js');
    const response = await fetch(MusicAssets.song('gamenotes.mml.txt'));
    if (!response.ok) throw Error('MML HTTP ' + response.status);
    const source = await response.text();
    MusicPage.mountMMLPreview(document.getElementById('gamenotes-src'), source);
    const audio = new E.ChipTuneSound(null, { spatial: 'stereo' });
    E.player.mount(root, {
      audio, mml: MusicPage.splitMML(source), loops: 1,
      copy: false, showMml: false, saveMml: false,
    });
    // 13 + 14 + 13 + 1(フィル) + 13 + 1(フィル) + 14 + 6 = 75小節
    const barSec = 240 / 134;
    const phase = t => t < 13 * barSec ? 0
      : t < 27 * barSec ? 1
      : t < 41 * barSec ? 2
      : t < 54 * barSec ? 3 : 4; // 4巡目は41〜54小節、5巡目前の1小節フィルではTapeを解除
    // 4巡目専用の固定Tapeパラメータ。5巡目以降は適用しない。
    const tape = Object.freeze({ drive: 0.20, speed: 13.0, wow: 0.22, flutter: 0.62, hiss: 0.56 });
    const chain = n => [
      { kind: 'highpass', cutoff: n === 3 ? 500 : 20 },
      { kind: 'echo', time: n === 2 ? 0.56 : 0.24, feedback: n === 2 ? 0.62 : 0.28,
        mix: n === 2 ? 0.33 : 0, tone: n === 2 ? 4800 : 4000, cross: 0 },
      { kind: 'reverb', time: 1, mix: n === 2 || n === 3 ? 0 : 0.50, width: 1 },
      ...(n === 3 ? [{ kind: 'tape', ...tape }] : []),
    ];
    let active = -1, pending = Promise.resolve();
    const syncFx = () => {
      if (!audio.ctx || !audio.bgmState) return;
      const n = phase(audio.bgmPosition());
      if (n === active) return;
      active = n;
      pending = pending.catch(() => {}).then(async () => {
        if (phase(audio.bgmPosition()) !== n) return;
        await audio.setMasterEffects(chain(n));
      }).catch(report);
    };
    window.setInterval(syncFx, 100);
    root.addEventListener('click', () => window.setTimeout(syncFx, 50));
    status.textContent = '';
  } catch (error) { report(error); }
})();
