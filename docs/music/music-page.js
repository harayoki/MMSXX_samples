// Shared entry point. All paths are relative to this script, not the host page.
// Copyright 2026 harayoki. All rights reserved.
(() => {
  const entry = document.currentScript;
  const root = new URL('./', entry.src);
  const songRoot = new URL(entry.dataset.song.replace(/\/$/, '') + '/', root);
  const published = root.origin === 'https://harayoki.github.io' &&
    root.pathname === '/MMSXX_samples/music/';
  const mediaRoot = new URL('https://media.githubusercontent.com/media/harayoki/MMSXX_samples/refs/heads/main/docs/music/');
  const song = path => {
    const url = new URL(path, songRoot);
    // A page may opt into cache-busting its own PLAYER script and MML.
    // Other songs keep their existing paths and cache behavior.
    if (entry.dataset.assetVersion &&
        (path === 'player.js' || /\.mml(?:\.txt)?$/i.test(path))) {
      url.searchParams.set('v', entry.dataset.assetVersion);
    }
    return url.href;
  };
  const image = path => published
    ? new URL(entry.dataset.song.replace(/\/$/, '') + '/' + path, mediaRoot).href
    : song(path);
  window.MusicAssets = Object.freeze({
    song, image, shared: path => new URL(path, root).href
  });
  // Pico PLAYER 1.4.0 expects an MML array, while SOUND 0.55.0
  // defines a BGM from one *complete* MML document. Do not copy global
  // #about / #title / #fx directives to every channel again.
  function splitMML(text) {
    const source = String(text ?? '');
    return source.trim() ? [source] : [];
  }
  /**
   * Read-only excerpt for songs that do not expose a public MML editor.
   * Only the first N lines are inserted into the page, not the full source.
   * This is a display limit, not a file-access security boundary.
   */
  function mountMMLPreview(host, source, options = {}) {
    const sourceLines = String(source ?? '').split(/\r?\n/);
    // "fill" displays only the lines needed to cover the artwork panel.
    // Numeric limits remain available for other songs.
    const requested = options.lines ?? host.dataset.previewLines ?? 'fill';
    const asNumber = Number(requested);
    const maxLines = requested !== 'fill' && Number.isSafeInteger(asNumber) && asNumber >= 0
      ? Math.min(asNumber, 200) : 200;
    const code = document.createElement('code');
    host.classList.add('music-mml-preview');
    host.replaceChildren(code);
    let visibleLines = -1;
    const render = () => {
      const lineHeight = parseFloat(getComputedStyle(code).lineHeight);
      const height = code.clientHeight;
      if (!(lineHeight > 0 && height > 0)) return;
      const count = Math.min(sourceLines.length, maxLines, Math.ceil(height / lineHeight));
      if (count === visibleLines) return;
      visibleLines = count;
      const fragment = document.createDocumentFragment();
      for (const line of sourceLines.slice(0, count)) {
        const row = document.createElement('span');
        if (/^\s*#/.test(line)) row.className = 'mml-preview-directive';
        else if (/^\s*\/\//.test(line)) row.className = 'mml-preview-comment';
        row.textContent = line || '\u00a0';
        fragment.append(row);
      }
      code.replaceChildren(fragment);
      host.setAttribute('aria-label', 'MML冒頭' + count + '行（閲覧専用）');
    };
    render();
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(render);
      resizeObserver.observe(host);
    } else {
      window.addEventListener('resize', render);
    }
    host.addEventListener('selectstart', event => event.preventDefault());
    host.addEventListener('dragstart', event => event.preventDefault());
    host.addEventListener('copy', event => event.preventDefault());
    return { get visibleLines() { return Math.max(0, visibleLines); } };
  }
  window.MusicPage = Object.freeze({ splitMML, mountMMLPreview });
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
      // Official 0.55.0 sound modules + official Pico PLAYER 1.4.0.
      // The source release uses native ES modules; the attached min-split ZIP
      // is the matching browser-script build of the same sound version.
      const map = document.createElement('script');
      map.type = 'importmap';
      map.textContent = JSON.stringify({
        imports: { '#sound/': MusicAssets.shared('runtime/sound-0.55.0/sound/') }
      });
      document.head.appendChild(map);
      const [soundModule, mmlModule, tonesModule, uiModule] = await Promise.all([
        import(MusicAssets.shared('runtime/sound-0.55.0/sound/all.js')),
        import(MusicAssets.shared('runtime/sound-0.55.0/sound/mml.js')),
        import(MusicAssets.shared('runtime/sound-0.55.0/sound/tones.js')),
        import(MusicAssets.shared('runtime/player-1.4.0/tool/ui/player.js')),
      ]);
      // Existing song player.js scripts use the legacy namespace API.
      // Bridge only the public API; do not modify the official engine/UI.
      const engine = {
        ...soundModule, ...mmlModule, ...tonesModule,
        player: { CSS: uiModule.PLAYER_CSS, mount: uiModule.mountPlayer },
        mountPlayer: uiModule.mountPlayer
      };
      window.MMSXX = { ...(window.MMSXX || {}), sound: engine };
      const style = document.createElement('style');
      style.textContent = uiModule.PLAYER_CSS;
      document.head.prepend(style);
      const playerOpenKey = 'mmsxx.samples.player.open';
      const originalMount = uiModule.mountPlayer;
      const readPlayerOpen = () => {
        try { return localStorage.getItem(playerOpenKey) === 'true'; }
        catch { return false; }
      };
      // Player 1.4.0 passes an array to defineBGM; SOUND 0.55.0
      // requires a single MML document. Adapt at the page boundary only.
      const asPlayerMML = value => {
        if (Array.isArray(value)) {
          if (!value.length) return [];
          return [mmlModule.joinVoices(value)];
        }
        const source = String(value ?? '');
        return source.trim() ? [source] : [];
      };
      const mountWithStoredOpen = (root, options = {}) => {
        const { forceOpen = false, ...playerOptions } = options;
        const audio = playerOptions.audio || new soundModule.ChipTuneSound();
        const defineBGM = audio.defineBGM.bind(audio);
        audio.defineBGM = (name, mml, config) =>
          defineBGM(name, Array.isArray(mml) ? mmlModule.joinVoices(mml) : mml, config);
        const player = originalMount(root, {
          ...playerOptions,
          audio,
          mml: asPlayerMML(playerOptions.mml),
          open: forceOpen || readPlayerOpen(),
          // The site has its own MML editor. Display and download are
          // independent PLAYER options (showMml / saveMml).
          showMml: false,
        });
        const originalSetMML = player.setMML.bind(player);
        player.setMML = value => originalSetMML(asPlayerMML(value));
        const toggle = root.querySelector('[data-p="open"]');
        if (!forceOpen) toggle?.addEventListener('click', () => {
          try { localStorage.setItem(playerOpenKey, toggle.getAttribute('aria-expanded')); }
          catch { /* Restricted frame may block storage. */ }
        });
        return player;
      };
      engine.player.mount = mountWithStoredOpen;
      engine.mountPlayer = mountWithStoredOpen;
      const editorModule = await import(MusicAssets.shared('mml-editor.js'));
      window.MusicPage = Object.freeze({
        splitMML,
        mountMMLPreview,
        mountMMLEditor: editorModule.mountMMLEditor,
        mountMMLTextarea: editorModule.mountMMLTextarea,
      });
      await load(song('player.js'));
      // The player title is created after each page fetches its MML. Dock the
      // MUSIC TOP icon after the title/version group as soon as it appears.
      const dockMusicTop = () => {
        const nav = document.querySelector('.music-top-nav');
        const title = document.querySelector('.music-player .about [data-p="title"]');
        if (!nav || !title) return false;
        (title.closest('.head') || title).after(nav);
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
