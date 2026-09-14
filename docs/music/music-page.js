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
  for (const element of document.querySelectorAll('[data-music-image]')) {
    element.setAttribute(element.tagName === 'A' ? 'href' : 'src', image(element.dataset.musicImage));
  }
  for (const element of document.querySelectorAll('[data-music-background]')) {
    element.style.backgroundImage = `url("${image(element.dataset.musicBackground)}")`;
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
      await load(MusicAssets.shared('sound-engine.js'));
      await load(MusicAssets.shared('wav-download.js'));
      await load(song('player.js'));
    } catch (error) {
      const status = document.querySelector('#mmsxx-status, #pt-status');
      if (status) status.textContent = error.message;
    }
  })();
})();
