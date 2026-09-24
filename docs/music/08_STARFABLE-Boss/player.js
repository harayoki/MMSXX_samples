// STARFABLE ボス曲。音色とフェードはこの曲のインスタンスだけに適用する。
(() => {
  const E = MMSXX.sound;
  E.registerEnvelope('sfFlat', { a: '0.5%', d: '0%', s: 1, r: '1%' });
  E.registerEnvelope('sfSoft', { a: '8%', d: '10%', s: 0.8, r: '15%' });
  E.registerEnvelope('sfPerc', { a: '0.2%', d: '25%', s: 0, r: '5%' });

  const editor = document.getElementById('starfable-boss-src');
  const status = document.querySelector('[data-music-status]');
  const audio = new E.ChipTuneSound(null, { spatial: 'mono' });
  audio.volume = 0.5;
  audio.dynamic_effects = {};
  let rendering = false;
  let fade = null;

  function fadeProfile(info) {
    const introEnd = info.marks?.find(mark => mark.name === 'Main')?.t;
    const outroStart = info.marks?.find(mark => mark.name === 'Finale')?.t;
    return introEnd > 0 && outroStart > introEnd && info.total > outroStart
      ? { introEnd, outroStart, end: info.total } : null;
  }
  function fadeGain(position, profile) {
    if (!profile) return 1;
    return Math.max(0, Math.min(1, position / profile.introEnd,
      (profile.end - position) / (profile.end - profile.outroStart)));
  }
  function updateFade(source) {
    const tracks = MusicPage.splitMML(source).map(part => E.compileMML(part));
    fade = fadeProfile({ marks: tracks[0]?.marks, total: Math.max(0, ...tracks.map(t => t.total)) });
  }

  // 同じ曲のWAVにも全体フェードを適用。エンジン本体は変更しない。
  const renderBGM = audio.renderBGM.bind(audio);
  audio.renderBGM = async (name, options) => {
    const profile = fadeProfile(audio.bgmInfo(name));
    rendering = true;
    try {
      const buffer = await renderBGM(name, options);
      if (buffer && profile) {
        for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
          const samples = buffer.getChannelData(ch);
          for (let i = 0; i < samples.length; i++) {
            samples[i] *= fadeGain(i / buffer.sampleRate, profile);
          }
        }
      }
      return buffer;
    } finally { rendering = false; }
  };

  fetch(MusicAssets.song('starfable-boss.mml'))
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(source => {
      updateFade(source);
      const player = E.player.mount(document.getElementById('starfable-boss-player'), {
        audio, mml: MusicPage.splitMML(source), loops: 1, channels: true, volume: true,
      });
      MusicPage.mountMMLTextarea(editor, source, {
        onCommit: value => {
          player.setMML(MusicPage.splitMML(value));
          updateFade(value);
        },
      });
      const timer = setInterval(() => {
        if (rendering) return;
        const state = audio.bgmState;
        if (!state || !audio.ctx || !state.gain) return;
        state.gain.gain.setTargetAtTime(
          fadeGain(audio.bgmPosition(), fade), audio.ctx.currentTime, 0.012);
      }, 16);
      window.addEventListener('pagehide', event => {
        if (!event.persisted) clearInterval(timer);
      });
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'MML読み込みエラー：' + error.message; });
})();
