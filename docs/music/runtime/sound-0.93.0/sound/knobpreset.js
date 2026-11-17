// 音色の中に、名前を付けた値の組(プリセット)を持つ。生音でもアナログでも同じ形(2026-11-05)。
//
//   presets: {
//     hot: { desc: 'A little past the recordings.', set: { twang: 1.5, bite: 0.9 } },
//   }
//
// 呼ぶときに `@{electric::twang(hot)}` と書くと、組の値が当たる。音色の数は増えない。
// 組と一緒に軸も書ける(`@{electric::twang(hot, twang: 1.2)}`)。書いた軸が組の値に勝つ。
//
// `set` の名前は 2 種類。
// - 呼ぶときに渡せる軸(smart の軸、つまみ)。その軸の値になる
// - パッチの中の場所(`t60` `head.sharp` `filter.cutoff`)。軸を当てたあとに、その値で上書きする
//
// 明らかに違う音になるものは、組ではなく別の音色(作り分け)にする(docs/SOUND_TOOL.md の「お勧めと誇張」)。
//
// 呼ぶときの書き方は、数を受け取る軸 `preset` に、組の名前を語として持たせて通す
// (`registerFamily` の words)。0 が組を当てない(`none`)、1 から順に組の番号。

/** 点で区切った場所を引く */
export function getPath(o, path) {
  return String(path).split('.').reduce((a, k) => (a == null ? a : a[k]), o);
}

/** 点で区切った場所に入れる。途中が無ければ止める(書き間違いを黙って通さない) */
export function setPath(o, path, v) {
  const ks = String(path).split('.');
  let a = o;
  for (let i = 0; i < ks.length - 1; i++) {
    if (a[ks[i]] == null || typeof a[ks[i]] !== 'object') return false;
    a = a[ks[i]];
  }
  a[ks[ks.length - 1]] = v;
  return true;
}

/**
 * 組の書き方を確かめ、呼ぶときの軸 `preset` を作る。組が無ければ null。
 * @param {string} voice 音色の名前(知らせる文に使う)
 * @param {Object<string,{desc?:string, set:Object<string,number>}>} presets
 * @param {Object<string,object>} axes ほかの軸(名前 → `{min, max}`)
 * @param {object} patch 元のパッチ(場所があるかを確かめる)
 */
export function presetKnob(voice, presets, axes, patch) {
  const names = Object.keys(presets || {});
  if (!names.length) return null;
  const words = { none: 0 };
  const list = [];
  names.forEach((n, i) => {
    if (!/^[a-z][A-Za-z0-9]*$/.test(n) || n === 'none') {
      throw new Error(`[ChpTnSnd] ${voice}: 組の名前 "${n}" は英字で始まる英数字で、none 以外にします`);
    }
    const pr = presets[n];
    if (!pr || typeof pr.set !== 'object') throw new Error(`[ChpTnSnd] ${voice}: 組 "${n}" に set がありません`);
    for (const [k, v] of Object.entries(pr.set)) {
      if (!Number.isFinite(v)) throw new Error(`[ChpTnSnd] ${voice}: 組 "${n}" の ${k} は数で書きます`);
      if (axes[k]) {
        if (v < axes[k].min || v > axes[k].max) throw new Error(`[ChpTnSnd] ${voice}: 組 "${n}" の ${k} は ${axes[k].min}〜${axes[k].max} です`);
      } else if (typeof getPath(patch, k) !== 'number') {
        throw new Error(`[ChpTnSnd] ${voice}: 組 "${n}" の "${k}" は、軸にもパッチの中の場所にもありません`);
      }
    }
    words[n.toLowerCase()] = i + 1;
    list.push(n);
  });
  return {
    min: 0, max: list.length, default: 0, same: 0, words, presets: list.map((n) => presets[n]), names: list,
    desc: 'Named settings of this instrument: ' + list.map((n) => `${n}${presets[n].desc ? ` (${presets[n].desc})` : ''}`).join('; ')
      + '. none, the default, plays it as it is. Axes written next to it win over the values in the setting.',
  };
}

/**
 * 呼ぶときの値から、当てる値を決める。
 * 組を選んでいれば、書かなかった軸は組の値にする。組の中の、軸でない場所は後で上書きする。
 * @returns {{vals:[string,number][], set:Object<string,number>|null, same:boolean}}
 *   vals は軸ごとの値(preset は除く)、set は上書きする場所、same はどれも元のままか
 */
export function resolveKnobs(kn, vargs) {
  const pk = kn.preset;
  let pi = 0;
  if (pk) {
    const v = vargs && vargs.preset != null ? Number(vargs.preset) : pk.default;
    pi = Math.round(Math.min(pk.max, Math.max(0, Number.isFinite(v) ? v : 0)));
  }
  const pr = pi > 0 ? pk.presets[pi - 1] : null;
  const vals = [];
  for (const [k, s] of Object.entries(kn)) {
    if (k === 'preset') continue;
    let v = vargs && vargs[k] != null ? Number(vargs[k]) : pr && pr.set[k] != null ? pr.set[k] : s.default;
    if (!Number.isFinite(v)) v = s.default;
    vals.push([k, Math.min(s.max, Math.max(s.min, v))]);
  }
  let set = null;
  if (pr) {
    for (const [k, v] of Object.entries(pr.set)) if (!kn[k]) (set ??= {})[k] = v;
  }
  const same = !set && vals.every(([k, v]) => kn[k].same != null && Math.abs(v - kn[k].same) < 1e-9);
  return { vals, set, same, key: pk ? pi : null };
}
