// Shared entry point. All paths are relative to this script, not the host page.
// Copyright 2026 harayoki. All rights reserved.
(() => {
  const entry = document.currentScript;
  const root = new URL('./', entry.src);
  const songRoot = new URL(entry.dataset.song.replace(/\/$/, '') + '/', root);
  const published = root.origin === 'https://harayoki.github.io' &&
    root.pathname === '/MMSXX_samples/music/';
  const mediaRoot = new URL('https://media.githubusercontent.com/media/harayoki/MMSXX_samples/refs/heads/main/docs/music/');
  const song = path => new URL(path, songRoot).href;
  const image = path => published
    ? new URL(entry.dataset.song.replace(/\/$/, '') + '/' + path, mediaRoot).href
    : song(path);
  window.MusicAssets = Object.freeze({
    song, image, shared: path => new URL(path, root).href
  });
  /**
   * 現行の `// #ch` でチャンネルを分ける。
   * サンプル曲は先頭に共通マクロを置くため、エンジン標準の splitVoices と違い、
   * 最初の #ch より前を各チャンネルへそのまま渡す。
   */
  function splitMML(text) {
    const lines = String(text ?? '').split(/\r?\n/);
    const marks = lines.map((line, index) =>
      /^\s*\/\/\s*#\s*ch(?:\s|$)/i.test(line) ? index : -1
    ).filter(index => index >= 0);
    if (!marks.length) return String(text ?? '').trim() ? [String(text)] : [];
    const head = lines.slice(0, marks[0]);
    return marks.map((at, index) =>
      [...head, ...lines.slice(at, marks[index + 1] ?? lines.length)]
        .join('\n').trim()
    ).filter(Boolean);
  }
  window.MusicPage = Object.freeze({ splitMML });
  for (const element of document.querySelectorAll('[data-music-image]')) {
    element.setAttribute(element.tagName === 'A' ? 'href' : 'src', image(element.dataset.musicImage));
  }
  for (const element of document.querySelectorAll('[data-music-background]')) {
    element.style.backgroundImage = `url("${image(element.dataset.musicBackground)}")`;
  }
  // Native modal keeps focus inside and blocks the page beneath the artwork.
  const coverDialog = document.createElement('dialog');
  coverDialog.className = 'music-cover-dialog';
  coverDialog.setAttribute('aria-label', 'Cover art');
  coverDialog.innerHTML = '<button type="button" aria-label="Close cover art" autofocus>×</button><img alt="Cover art"><p role="status" hidden>画像を読み込めませんでした。</p>';
  const coverStyle = document.createElement('style');
  coverStyle.textContent = `
    .music-cover-dialog { padding: 44px 12px 12px; border: 0; border-radius: 8px;
      background: #171717; color: white; max-width: calc(100vw - 32px);
      max-height: calc(100dvh - 32px); box-sizing: border-box; }
    .music-cover-dialog::backdrop { background: rgba(0,0,0,.78); }
    .music-cover-dialog img { display: block; max-width: 100%;
      max-height: calc(100dvh - 100px); width: auto; height: auto; object-fit: contain; }
    .music-cover-dialog button { position: absolute; top: 4px; right: 6px;
      width: 36px; height: 36px; border: 0; border-radius: 4px;
      background: #333; color: white; font-size: 26px; cursor: pointer; }
  `;
  document.head.append(coverStyle);
  document.body.append(coverDialog);
  const coverImage = coverDialog.querySelector('img');
  const coverError = coverDialog.querySelector('p');
  let coverTrigger, previousOverflow;
  coverImage.onerror = () => { coverError.hidden = false; };
  coverImage.onload = () => { coverError.hidden = true; };
  coverDialog.querySelector('button').onclick = () => coverDialog.close();
  coverDialog.addEventListener('click', event => {
    const rect = coverDialog.getBoundingClientRect();
    if (event.target === coverDialog && (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom)) coverDialog.close();
  });
  coverDialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    coverTrigger?.focus();
  });
  for (const link of document.querySelectorAll('a[data-music-image]')) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      coverTrigger = link;
      coverError.hidden = true;
      coverImage.src = link.href;
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      coverDialog.showModal();
    });
  }
  function load(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = () => reject(new Error('読み込みに失敗しました：' + url));
      document.head.append(script);
    });
  }
  (async () => {
    try {
      // Preserve script execution order without depending on download timing.
      await load(MusicAssets.shared('player-engine.js'));
      const style = document.createElement('style');
      style.textContent = MMSXX.sound.player.CSS;
      // Keep the shared page stylesheet later in cascade order so each sample
      // can retain the established blue rounded-button appearance.
      document.head.prepend(style);
      // Share the details-panel state across every music page. With no saved
      // preference the player starts closed.
      const playerOpenKey = 'mmsxx.samples.player.open';
      const originalMount = MMSXX.sound.player.mount;
      const readPlayerOpen = () => {
        try { return localStorage.getItem(playerOpenKey) === 'true'; }
        catch { return false; }
      };
      const mountWithStoredOpen = (root, options = {}) => {
        const { forceOpen = false, ...playerOptions } = options;
        const player = originalMount(root, {
          ...playerOptions,
          open: forceOpen || readPlayerOpen(),
        });
        const toggle = root.querySelector('[data-p="open"]');
        if (!forceOpen) toggle?.addEventListener('click', () => {
          try { localStorage.setItem(playerOpenKey, toggle.getAttribute('aria-expanded')); }
          catch { /* Storage may be unavailable in a restricted frame. */ }
        });
        return player;
      };
      MMSXX.sound.player.mount = mountWithStoredOpen;
      MMSXX.sound.mountPlayer = mountWithStoredOpen;
      await load(song('player.js'));
      // The player title is created after each page fetches its MML. Dock the
      // MUSIC TOP icon beside it as soon as that title appears.
      const dockMusicTop = () => {
        const nav = document.querySelector('.music-top-nav');
        const title = document.querySelector('.music-player .about [data-p="title"]');
        if (!nav || !title) return false;
        title.after(nav);
        return true;
      };
      if (!dockMusicTop()) {
        const observer = new MutationObserver(() => {
          if (dockMusicTop()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    } catch (error) {
      const status = document.querySelector('[data-music-status]');
      if (status) status.textContent = error.message;
    }
  })();
})();
