// Shared page UI and PCM WAV encoding. Audio rendering uses the bundled engine.
(() => {
  function wavBlob(buffer) {
    const channels = buffer.numberOfChannels, frames = buffer.length;
    const bytes = new ArrayBuffer(44 + frames * channels * 2), view = new DataView(bytes);
    const text = (offset, value) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
    text(0, 'RIFF'); view.setUint32(4, bytes.byteLength - 8, true); text(8, 'WAVE');
    text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, channels, true); view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true); view.setUint16(34, 16, true);
    text(36, 'data'); view.setUint32(40, frames * channels * 2, true);
    const data = Array.from({ length: channels }, (_, i) => buffer.getChannelData(i));
    let offset = 44;
    for (let i = 0; i < frames; i++) for (let ch = 0; ch < channels; ch++) {
      const sample = Math.max(-1, Math.min(1, data[ch][i]));
      if (!Number.isFinite(sample)) throw new Error('音声データに不正な値があります');
      view.setInt16(offset, Math.round(sample * (sample < 0 ? 32768 : 32767)), true); offset += 2;
    }
    return new Blob([bytes], { type: 'audio/wav' });
  }
  function loopMacro(source) {
    const match = source.replace(/\/\/[^\n]*/g, '').match(/\$LOOP_END\s*=\s*\{\s*\](\d+)\s*\}/i);
    if (!match) return '';
    if (Number(match[1]) < 1) throw new Error('LOOP_END の回数は1以上にしてください');
    return match[0] + '\n';
  }
  function attach({ source, button, filename, status, key, basename, render }) {
    const edited = new Set(); let busy = false;
    const name = () => basename() + (edited.has(key()) ? '_arranged' : '') + '.wav';
    function update() { filename.textContent = name(); button.disabled = busy || source.disabled; }
    source.addEventListener('input', () => { edited.add(key()); update(); });
    button.addEventListener('click', async () => {
      if (busy || source.disabled) return;
      const snapshot = { source: source.value, key: key(), filename: name() };
      busy = true; update(); status.textContent = 'WAVを書き出しています…';
      try {
        const buffer = await render(snapshot);
        const blob = wavBlob(buffer), url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = snapshot.filename;
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        status.textContent = snapshot.filename + ' をダウンロードしました';
      } catch (error) { status.textContent = 'WAV書き出しエラー：' + error.message; }
      finally { busy = false; update(); }
    });
    new MutationObserver(update).observe(source, { attributes: true, attributeFilter: ['disabled'] });
    update(); return { update };
  }
  window.MusicWav = { attach, wavBlob, loopMacro };
})();
