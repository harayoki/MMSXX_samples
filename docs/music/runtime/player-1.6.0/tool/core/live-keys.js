// ライブで弾く口。押したら鳴り、離したら止まる。
//
// ---- なぜここに居るか ----
//
// 押す口が 2 つある。画面の鍵盤(`tool/ui/keyboard.js`)と、MIDI キーボード
// (`tool/ui/midi-in.js`)。どちらも押すたびに MML を組んで `defineSE` し、
// `playSE` の番号を覚えておいて、離したら `stopSE` する。この 3 行を
// 両方に書くと、片方だけ直したときに食い違う。
//
// ここは DOM も Web MIDI も知らない。`audio`(`ChipTuneSound`)だけ受ける。
// 組み立てた MML と、押した数の勘定はここだけでテストする
// (`test/tool/live-keys.test.js`)。
//
// `sound/` には入れない。ツールの側の話なので、エンジンへは持ち込まない
// (使い方は docs/MIDI_IN.md)。
//
// ---- 止めるまで鳴り続ける ----
//
// 長さは MML のテンポで伸ばす。全音符は 240 / テンポ 秒なので、テンポを
// 逆に決めると `hold` 秒の音符になる。`t4` なら 60 秒。
//
// `defineSE` に `base` は付けない。付けるとテンポが 225 に固定されて、
// 全音符が 1.07 秒になる(`sound/se.js` の `SE_WHOLE` が 64 フレーム)。
// だから `base` と `note:` ではなく、押すたびに MML を組み直して登録する。
// 1 音の組み直しなので、押すたびでも間に合う。
//
// ---- 上限 ----
//
// 押したままでも `hold` 秒で消える。離し忘れても鳴り続けない。
//
// 同時に鳴らせる数は `max`。越えたら、いちばん古いものをこちらから離す。
// エンジンも席が足りなければ古い SE を止めるが(`maxVoices` の取り合い)、
// 向こうが止めると、こちらは鳴っているつもりのままになり、画面の鍵盤が
// 押されたまま残る。だから自分の数で先に離す。

/** 1 オクターブぶんの音名。MML の字で持つ(`+` が半音上げ) */
export const LIVE_NAMES = ['c', 'c+', 'd', 'd+', 'e', 'f', 'f+', 'g', 'g+', 'a', 'a+', 'b'];

/** 押したままにできる長さの既定(秒) */
export const LIVE_HOLD = 8;
/** 離してから消えるまでの既定(秒)。いきなり切るとプツッと鳴る */
export const LIVE_RELEASE = 0.03;
/** 強さの既定(0..15) */
export const LIVE_VOL = 12;
/** 左端のオクターブの既定 */
export const LIVE_OCTAVE = 4;

/**
 * MIDI の番号を、その並びでの半音へ。
 *
 * MIDI は絶対の高さで来る(60 が o4 の c、69 が o4 の a = 440Hz)。
 * 覚えているオクターブを足し引きして戻すので、オクターブを動かしても
 * 鳴る高さは変わらない。
 *
 * @param {number} note MIDI の番号 0..127
 * @param {number} octave 左端のオクターブ
 * @returns {number} 半音(0 = そのオクターブの c)
 */
export const semiOfMidi = (note, octave) => Math.round(note) - (octave + 1) * 12;

/**
 * 打鍵の強さを音量へ移すときの曲線。
 *
 * そのまま比で移すと弾きにくい。弱く押したぶんが聞こえなくなり、強く押した
 * ぶんだけが前に出る。弾く人と機器によって当たりが違うので、選べるようにする。
 *
 * 入るのも出るのも 0..1。
 *
 * | | |
 * | --- | --- |
 * | `linear` | そのまま |
 * | `soft` | 弱く押しても出る。軽い鍵盤で、強く押しにくいとき |
 * | `hard` | 強く押したときだけ出る。差を大きく取りたいとき |
 * | `narrow` | 上半分に寄せる。弱い音も必ず聞こえる |
 * | `fixed` | 強さを見ない。覚えている音量で鳴る |
 */
export const VEL_CURVES = {
  linear: (x) => x,
  soft: (x) => Math.pow(x, 0.5),
  hard: (x) => Math.pow(x, 2),
  narrow: (x) => 0.5 + 0.5 * x,
  fixed: () => 1,
};

/** 押したのに鳴らないのを避けるための下限。目盛りは 0..15 */
export const VEL_FLOOR = 0.5;

/**
 * MIDI の強さを、エンジンの音量へ。
 *
 * 0 は打鍵ではなく離鍵なので、ここへは来ない(`readKey` が弾く)。
 * `fixed` を選んだときは、ここを呼ばずに覚えている音量で鳴らす。
 *
 * 整数に丸めない。`v` は小数を受けるので、丸めると 127 段を 15 段に
 * 潰すことになる。実機の段が欲しいときは、音色の `vsteps` が寄せる
 * (2026-11-13 に直した)。小数 2 桁で足りる(15 を 1500 段に割る)。
 *
 * @param {number} vel 1..127
 * @param {string} [curve='linear'] `VEL_CURVES` の名前
 * @returns {number} 0.5..15。0 にはしない
 */
export const volOfVel = (vel, curve = 'linear') => {
  const f = VEL_CURVES[curve] || VEL_CURVES.linear;
  const x = Math.max(0, Math.min(1, vel / 127));
  return Math.max(VEL_FLOOR, Math.min(15, Math.round(f(x) * 1500) / 100));
};

/**
 * 1 音ぶんの MML を組む。押した時点の設定で組む。
 *
 * `o` は音ごとに書く(飛んでも狂わない)。
 *
 * @param {{semi:number, voice:string, fx?:string, vol?:number, hold?:number,
 *          octave?:number}} at
 * @returns {string}
 */
export function liveMML(at) {
  const semi = Math.round(at.semi);
  const octave = Number.isFinite(at.octave) ? at.octave : LIVE_OCTAVE;
  const hold = Number(at.hold) > 0 ? Number(at.hold) : LIVE_HOLD;
  const vol = Number.isFinite(Number(at.vol)) ? Number(at.vol) : LIVE_VOL;
  const oct = octave + Math.floor(semi / 12);
  const name = LIVE_NAMES[((semi % 12) + 12) % 12];
  const tempo = 240 / hold;
  const fx = at.fx ? String(at.fx).trim() : '';
  // 並びは `@fxchain{…}` が決める。種類の名前をそのまま書けば宣言は要らない
  const kind = fx ? fx.split(/\s+/)[0] : '';
  return `t${tempo.toFixed(3)} @{${at.voice}}`
    + (fx ? ` @fxchain{${kind}} @fx{${fx}}` : '')
    + ` v${vol} l1 o${oct} ${name}`;
}

/**
 * 押して離せる口。
 *
 * ```js
 * const live = new LiveKeys(audio, { voice: 'opll::organ' });
 * const id = live.noteOn(0);        // 覚えているオクターブの c
 * live.noteOff(id);
 * ```
 *
 * 高さは半音で渡す。0 が、覚えているオクターブの c。MIDI の番号から
 * 鳴らすなら `noteOnMidi()`。
 */
export class LiveKeys {
  /**
   * @param {object} audio `ChipTuneSound`。要る
   * @param {{voice?:string, fx?:string, vol?:number, octave?:number, hold?:number,
   *          release?:number, max?:number, priority?:number}} [opts]
   *   voice = 音色の名前(既定 `pulse(50)`)。
   *   fx = チャンネルに掛けるエフェクト。`@fx{…}` の中身だけ書く(`reverb 2.5 @mix 0.3`)。
   *   vol = 強さ 0..15(既定 12)。octave = 左端のオクターブ(既定 4)。
   *   hold = 押したままにできる長さの上限(秒。既定 8)。
   *   release = 離してから消えるまで(秒。既定 0.03)。
   *   max = 同時に鳴らせる数(既定はエンジンの `maxVoices`)。
   *   priority = 席の取り合いでの強さ(既定 0)
   */
  constructor(audio, opts = {}) {
    if (!audio) throw new Error('[ChpTnSnd] LiveKeys: audio(ChipTuneSound)が要ります');
    this.audio = audio;
    this.voice = opts.voice || 'pulse(50)';
    this.fx = opts.fx ? String(opts.fx) : '';
    this.vol = Number.isFinite(Number(opts.vol)) ? Number(opts.vol) : LIVE_VOL;
    this.octave = Number.isFinite(Number(opts.octave)) ? Number(opts.octave) : LIVE_OCTAVE;
    this.hold = Number(opts.hold) > 0 ? Number(opts.hold) : LIVE_HOLD;
    this.release = Number(opts.release) >= 0 ? Number(opts.release) : LIVE_RELEASE;
    // 既定はエンジンの席の数。BGM が鳴っていればそのぶん取られるので、
    // ここを越える前にエンジンが古いものを止めることもある
    this.max = Math.max(1, Math.round(Number(opts.max) || audio.maxVoices || 8));
    this.priority = Number(opts.priority) || 0;
    /** 鳴っているもの。押した順(古いものが先頭)。`{id, semi}` */
    this._on = [];
    /** 鳴らすときに使う名前。使い回す。押すたびに作ると名前が増えていく */
    this._se = opts.name || '__live__';
  }

  /** 音色を替える。これから押すものに効く */
  setVoice(v) { this.voice = String(v); return this; }
  /** エフェクトを替える。これから押すものに効く */
  setFx(s) { this.fx = s ? String(s) : ''; return this; }
  /** 強さ 0..15 */
  setVol(n) { if (Number.isFinite(Number(n))) this.vol = Number(n); return this; }
  /** 左端のオクターブ */
  setOctave(n) { if (Number.isFinite(Number(n))) this.octave = Math.round(Number(n)); return this; }
  /** 押したままにできる長さの上限(秒) */
  setHold(n) { if (Number(n) > 0) this.hold = Number(n); return this; }
  /** 同時に鳴らせる数 */
  setMax(n) { if (Number(n) > 0) this.max = Math.max(1, Math.round(Number(n))); return this; }

  /** いま鳴っている数 */
  held() { return this._on.length; }
  /** いま鳴っている音の番号。押した順 */
  ids() { return this._on.map((v) => v.id); }

  /**
   * 組む MML を見る。鳴らさない。
   *
   * @param {number} semi 半音
   * @param {{voice?:string, vol?:number}} [opts]
   */
  mmlOf(semi, opts = {}) {
    return liveMML({
      semi,
      voice: opts.voice || this.voice,
      fx: this.fx,
      vol: opts.vol == null ? this.vol : opts.vol,
      hold: this.hold,
      octave: this.octave,
    });
  }

  /**
   * 押す。
   *
   * 音が出るのは、ブラウザが音を解禁したあと。手で触る前に押されたぶんは、
   * 解禁を待ってから鳴る。待っているあいだに離していたら鳴らさない。
   *
   * @param {number} semi 半音。0 = 覚えているオクターブの c
   * @param {{voice?:string, vol?:number}} [opts] この音だけ替えるとき
   * @returns {number} 離すときに渡す番号。0 なら鳴らなかった
   *   (席が空けられなかった)。解禁を待ってから鳴らすときは、
   *   待っているあいだは番号を返す(離せるように)
   */
  noteOn(semi, opts = {}) {
    // MML は押した時点のもので組む。解禁を待つあいだにオクターブを動かしても、
    // 押したときの高さで鳴る
    const mml = this.mmlOf(semi, opts);
    // 自分の数で先に離す。エンジンに止められると、鳴っているつもりのまま残る
    while (this._on.length >= this.max) this.noteOff(this._on[0].id);
    // 解禁待ちのあいだに離せるように、先に席を取っておく。
    // 鳴ったら本当の番号に書き換える
    const slot = { id: ++LiveKeys._seq, semi, playing: 0, off: false };
    this._on.push(slot);
    const go = () => {
      if (slot.off) return;               // 待っているあいだに離した
      this.audio.defineSE(this._se, mml);
      slot.playing = this.audio.playSE(this._se, this.priority);
      // 席が空けられなければ鳴らない。押したままにしておかない
      if (!slot.playing) this._drop(slot);
    };
    const r = this.audio.unlock && this.audio.unlock();
    if (r && typeof r.then === 'function') r.then(go); else go();
    // 待たずに鳴らしたときは、鳴らなかったかどうかがここで分かる。
    // 0 を返しておけば、呼ぶ側は押されたことにしない(鍵盤に色が残らない)
    return slot.off ? 0 : slot.id;
  }

  /**
   * MIDI の番号で押す。強さも渡せる。
   *
   * @param {number} note MIDI の番号 0..127
   * @param {number} [vel] MIDI の強さ 1..127。省くと覚えている強さ
   * @param {{voice?:string}} [opts]
   * @returns {number} 離すときに渡す番号。0 なら鳴らなかった
   */
  noteOnMidi(note, vel, opts = {}) {
    return this.noteOn(semiOfMidi(note, this.octave), {
      voice: opts.voice,
      vol: vel == null ? null : volOfVel(vel),
    });
  }

  /**
   * 離す。いきなり切るとプツッと鳴るので、少し落としてから止める。
   *
   * @param {number} id `noteOn()` が返した番号
   */
  noteOff(id) {
    const slot = this._on.find((v) => v.id === id);
    if (!slot) return;
    this._drop(slot);
  }

  /** 全部離す。画面から目が離れたときと、MIDI をつなぎ直したとき */
  allOff() { for (const v of [...this._on]) this._drop(v); }

  /** 席から外して止める */
  _drop(slot) {
    slot.off = true;
    this._on = this._on.filter((v) => v !== slot);
    if (slot.playing) this.audio.stopSE(slot.playing, { fade: this.release });
  }
}

/** 番号の種。鳴る前に離せるように、エンジンの番号とは別に持つ */
LiveKeys._seq = 0;
