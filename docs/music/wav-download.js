// Shared page UI and PCM WAV encoding. Audio rendering uses the bundled engine.
(() => {
  async function wavBlob(buffer, job) {
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
    for (let i = 0; i < frames; i++) {
      if (i % 65536 === 0) {
        job?.signal.throwIfAborted();
        job?.progress(95 + 5 * i / frames, 'WAVへ変換中');
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      for (let ch = 0; ch < channels; ch++) {
      const sample = Math.max(-1, Math.min(1, data[ch][i]));
      if (!Number.isFinite(sample)) throw new Error('音声データに不正な値があります');
      view.setInt16(offset, Math.round(sample * (sample < 0 ? 32768 : 32767)), true); offset += 2;
    }
    }
    job?.signal.throwIfAborted();
    return new Blob([bytes], { type: 'audio/wav' });
  }
  function loopMacro(source) {
    const match = source.replace(/\/\/[^\n]*/g, '').match(/\$LOOP_END\s*=\s*\{\s*\](\d+)\s*\}/i);
    if (!match) return '';
    if (Number(match[1]) < 1) throw new Error('LOOP_END の回数は1以上にしてください');
    return match[0] + '\n';
  }

  // Use the unmodified engine's offline context to report rendered audio time.
  async function render(renderer, name, options, job) {
    job.signal.throwIfAborted();
    const pending = renderer.renderBGM(name, options);
    const context = renderer.ctx;
    let timer, onAbort;
    const cancelled = new Promise((_, reject) => {
      onAbort = () => {
        // OfflineAudioContext has no close(); suspend halts audio processing.
        if (context.state !== 'closed')
          context.suspend(context.currentTime + 128 / context.sampleRate).catch(() => {});
        reject(job.signal.reason);
      };
      job.signal.addEventListener('abort', onAbort, {once:true});
      timer = setInterval(() => job.progress(
        Math.min(94, 95 * context.currentTime / (context.length / context.sampleRate)),
        '音声を生成中'
      ), 80);
    });
    try { return await Promise.race([pending, cancelled]); }
    finally { clearInterval(timer); job.signal.removeEventListener('abort', onAbort); }
  }
  function attach({ source, button, status, key, basename, render }) {
    const edited = new Set(); let busy = false;
    const name = () => basename() + (edited.has(key()) ? '_arranged' : '') + '.wav';
    const style = document.createElement('style');
    style.textContent = `
      .wav-dialog {position:fixed;inset:0;margin:auto;width:min(360px,calc(100% - 32px));
        border:1px solid #888;border-radius:12px;padding:24px;background:Canvas;color:CanvasText;
        text-align:center;box-shadow:0 12px 48px #0006;}
      .wav-dialog::backdrop {background:rgba(0,0,0,.68);}
      .wav-dialog progress {display:block;width:100%;height:18px;margin:16px 0;}
      .wav-dialog button {margin-top:16px;}
      .wav-dialog strong {display:block;font-size:1.6rem;margin:12px 0;}
    `;
    document.head.append(style);
    const dialog = document.createElement('dialog');
    dialog.className = 'wav-dialog';
    dialog.setAttribute('aria-label','WAVを書き出しています');
    dialog.innerHTML = '<div>WAVを書き出しています</div><strong>0%</strong><progress max="100" value="0" aria-label="書き出し進捗"></progress><div class="wav-phase" role="status">準備中</div><button type="button" class="btn">キャンセル</button>';
    document.body.append(dialog);
    const percent = dialog.querySelector('strong'), bar = dialog.querySelector('progress');
    const phase = dialog.querySelector('.wav-phase');
    let controller;
    const cancel = () => controller?.abort(new DOMException('Cancelled','AbortError'));
    dialog.querySelector('button').addEventListener('click', cancel);
    dialog.addEventListener('cancel', event => {event.preventDefault();cancel();});
    function update() { button.disabled = busy || source.disabled; }
    source.addEventListener('input', () => { edited.add(key()); update(); });
    button.addEventListener('click', async () => {
      if (busy || source.disabled) return;
      const snapshot = { source: source.value, key: key(), filename: name() };
      controller = new AbortController();
      const job = {signal:controller.signal, progress(value,label) {
        bar.value = value; percent.textContent = Math.floor(value) + '%'; phase.textContent = label;
      }};
      busy = true; update(); status.textContent = '';
      job.progress(0,'準備中');dialog.showModal();
      const overflow = document.body.style.overflow;document.body.style.overflow = 'hidden';
      try {
        // Paint the blocking dialog before compiling the MML.
        await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
        job.signal.throwIfAborted();
        const buffer = await render(snapshot, job);
        job.signal.throwIfAborted();
        const blob = await wavBlob(buffer, job);
        job.signal.throwIfAborted();job.progress(100,'完了');
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = snapshot.filename;
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } catch (error) {
        if (error.name !== 'AbortError') status.textContent = 'WAV書き出しエラー：' + error.message;
      } finally {
        dialog.close();document.body.style.overflow = overflow;
        controller = null;busy = false;update();button.focus();
      }
    });
    new MutationObserver(update).observe(source, { attributes: true, attributeFilter: ['disabled'] });
    update(); return { update };
  }
  window.MusicWav = { attach, wavBlob, loopMacro, render };
})();
