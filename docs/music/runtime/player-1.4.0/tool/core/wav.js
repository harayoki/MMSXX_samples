// WAV を読む・書く。書き出しの口が音を扱うときの下ごしらえ。
//
// `sound/audio.js` の `encodeWAV()` は AudioBuffer を受け取るので、
// ブラウザが要る。こちらは数の並びだけを扱うので、どこでも動く。
//
// 読めるのは PCM だけ。圧縮されたものは読まない(まず出てこない)。

/** 中身をほどく。チャンネルごとに分けたまま返す */
function decode(data) {
  const b = data instanceof Uint8Array ? data : new Uint8Array(data);
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const tag = (at) => String.fromCharCode(b[at], b[at + 1], b[at + 2], b[at + 3]);
  if (tag(0) !== 'RIFF' || tag(8) !== 'WAVE') throw new Error('[ChpTnSnd] WAV ではありません');

  let at = 12, fmt = null, raw = null;
  while (at + 8 <= b.length) {
    const id = tag(at);
    const size = dv.getUint32(at + 4, true);
    const body = at + 8;
    if (id === 'fmt ') {
      fmt = {
        format: dv.getUint16(body, true),
        channels: dv.getUint16(body + 2, true),
        rate: dv.getUint32(body + 4, true),
        bits: dv.getUint16(body + 14, true),
      };
    } else if (id === 'data') {
      raw = { at: body, size: Math.min(size, b.length - body) };
    }
    at = body + size + (size & 1);          // かたまりは偶数で並ぶ
  }
  if (!fmt || !raw) throw new Error('[ChpTnSnd] WAV の中身が読めません');
  if (fmt.format !== 1 && fmt.format !== 3) {
    throw new Error(`[ChpTnSnd] 圧縮された WAV は読めません(format ${fmt.format})`);
  }

  const ch = Math.max(1, fmt.channels);
  const step = fmt.bits / 8;
  const frames = Math.floor(raw.size / (step * ch));
  const each = [];
  for (let c = 0; c < ch; c++) each.push(new Float32Array(frames));
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < ch; c++) {
      const o = raw.at + (i * ch + c) * step;
      let v = 0;
      if (fmt.format === 3) v = dv.getFloat32(o, true);
      else if (fmt.bits === 8) v = (b[o] - 128) / 128;
      else if (fmt.bits === 16) v = dv.getInt16(o, true) / 32768;
      else if (fmt.bits === 24) {
        v = ((b[o] | (b[o + 1] << 8) | (b[o + 2] << 16)) << 8) >> 8;
        v /= 8388608;
      } else if (fmt.bits === 32) v = dv.getInt32(o, true) / 2147483648;
      each[c][i] = v;
    }
  }
  return { rate: fmt.rate, channels: ch, each };
}

/**
 * WAV を読んで、チャンネルごとの標本を返す。
 *
 * 混ぜない。大きさを測るとき(`tool/core/check/loudness.js`)は左右を別に扱う —
 * 混ぜると、左右へ振り分けたぶんだけ山が低く出る。
 *
 * @param {Uint8Array|ArrayBuffer} data
 * @returns {{rate:number, each:Float32Array[]}}
 */
export function readWAVChannels(data) {
  const { rate, each } = decode(data);
  return { rate, each };
}

/**
 * WAV を読む。
 * @param {Uint8Array|ArrayBuffer} data
 * @returns {{rate:number, channels:number, data:Float32Array}}
 *   data は混ぜて 1 本にしたもの(左右あるなら足して割る)
 */
export function readWAV(data) {
  const { rate, each } = decode(data);
  const frames = each[0]?.length ?? 0;
  const out = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    let sum = 0;
    for (const c of each) sum += c[i];
    out[i] = sum / each.length;
  }
  return { rate, channels: each.length, data: out };
}

/**
 * WAV を書く。16 ビット。
 * 並びを 1 つ渡せばモノラル、並びの並び(左右なら 2 つ)を渡せばその本数で書く。
 * 本数ぶんを 1 サンプルずつ交互に並べる(WAV の決まり)
 * @param {Float32Array|number[]|Float32Array[]} samples -1〜1
 * @param {number} rate
 * @returns {Uint8Array}
 */
export function writeWAV(samples, rate = 44100) {
  const each = samples.length && typeof samples[0] === 'object' ? samples : [samples];
  const ch = each.length;
  const n = each[0].length;
  const size = n * ch * 2;
  const out = new Uint8Array(44 + size);
  const dv = new DataView(out.buffer);
  const put = (at, s) => { for (let i = 0; i < s.length; i++) out[at + i] = s.charCodeAt(i); };
  put(0, 'RIFF'); dv.setUint32(4, 36 + size, true); put(8, 'WAVE');
  put(12, 'fmt '); dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true); dv.setUint16(22, ch, true);
  dv.setUint32(24, rate, true); dv.setUint32(28, rate * ch * 2, true);
  dv.setUint16(32, ch * 2, true); dv.setUint16(34, 16, true);
  put(36, 'data'); dv.setUint32(40, size, true);
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < ch; c++) {
      const v = Math.max(-1, Math.min(1, each[c][i]));
      dv.setInt16(44 + (i * ch + c) * 2, Math.round(v * 32767), true);
    }
  }
  return out;
}
