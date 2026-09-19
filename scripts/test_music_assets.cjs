// Requires Playwright and Chromium. Runs without external network requests.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const root = path.resolve(__dirname, '../docs/music');
const songs = [
  ['01_Volcano-parade', 'vp-src', 'vol_par_crt_256.png', 'Volcano Parade'],
  ['02_Pocket-Tunnel', 'pt-src', 'pocket-tunnel.png', 'Pocket Tunnel'],
  ['03_Windward-Crossing', 'wc-src', 'windward-crossing.png', 'Windward Crossing'],
  ['04_Grassland-Trinity', 'gt-src', 'grassland-trinity.png', '草原のトリニティ'],
  ['05_Windward-Battle-Interactive', 'wbi-src',
    '../03_Windward-Crossing/windward-crossing.png',
    '風渡りの境界 戦闘曲(インタラクティブ)', true],
  ['06_BEAT', 'beat-src', 'beat.png', 'BEAT'],
];

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.MUSIC_TEST_CHROMIUM || undefined,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });
  try {
    for (const published of [false, true]) for (const song of songs) {
      const [folder, editorId, image, title, initiallyOpen = false] = song;
      const page = await browser.newPage({ acceptDownloads: true });
      const errors = [];
      const requests = [];
      const prefix = published
        ? 'https://harayoki.github.io/MMSXX_samples/music/'
        : 'http://localhost:8080/dev/music/';
      const media =
        'https://media.githubusercontent.com/media/harayoki/MMSXX_samples/refs/heads/main/docs/music/';
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', async route => {
        const url = route.request().url();
        requests.push(url);
        const base = url.startsWith(prefix) ? prefix : url.startsWith(media) ? media : null;
        if (!base) return route.abort();
        let file = decodeURIComponent(url.slice(base.length).split('?')[0]);
        if (file.endsWith('/')) file += 'index.html';
        const target = path.join(root, file);
        if (!fs.existsSync(target)) return route.fulfill({ status: 404, body: 'missing' });
        const type = file.endsWith('.js') ? 'application/javascript'
          : file.endsWith('.css') ? 'text/css'
          : file.endsWith('.html') ? 'text/html'
          : file.endsWith('.png') ? 'image/png'
          : file.endsWith('.jpg') ? 'image/jpeg' : 'text/plain';
        await route.fulfill({ body: fs.readFileSync(target), contentType: type });
      });
      await page.goto(prefix + folder + '/');
      const player = page.locator('.mmsxx-player');
      await player.locator('[data-p="play"]').waitFor();
      assert.equal(await player.locator('[data-p="open"]').getAttribute('aria-expanded'),
        String(initiallyOpen));
      assert.equal(await player.locator('[data-p="fold"]').isVisible(), initiallyOpen);
      if (!initiallyOpen) await player.locator('[data-p="open"]').click();
      assert.equal(await player.locator('[data-p="open"]').getAttribute('aria-expanded'), 'true');
      assert(await player.locator('[data-p="fold"]').isVisible());
      if (!initiallyOpen) assert.equal(await page.evaluate(() =>
        localStorage.getItem('mmsxx.samples.player.open')), 'true');
      assert((await player.locator('[data-p="title"]').textContent()).includes(title));
      assert.equal(await page.locator('#' + editorId).isEnabled(), true);
      assert.equal(
        await page.locator('[data-music-image]').getAttribute('href'),
        new URL(folder + '/' + image, published ? media : prefix).href,
      );
      assert(requests.includes(prefix + 'player-engine.js'));
      assert(requests.includes(prefix + 'music-page.css'));
      assert(requests.includes(prefix + folder + '/player.js'));
      assert(requests.some(url => url.startsWith(prefix + folder + '/') && url.endsWith('.mml')));

      await player.locator('[data-p="play"]').click();
      await page.waitForTimeout(250);
      await player.locator('[data-p="stop"]').click();

      const shortMML =
        '// #title Test\n// #about Short\n// #ch Test\n// #role lead\n' +
        't120 @{pulse:50} @e{flat} o4 l4 c4';
      await page.locator('#' + editorId).fill(shortMML);
      await page.locator('#' + editorId).press('Tab');
      await page.waitForFunction(() =>
        document.querySelector('.mmsxx-player [data-p="note"]')?.textContent === '1 channels');
      const pending = page.waitForEvent('download', { timeout: 120000 });
      await player.locator('[data-p="wav"]').click();
      const download = await pending;
      assert.equal(download.suggestedFilename(), 'Test.wav');
      const data = fs.readFileSync(await download.path());
      assert.equal(data.toString('ascii', 0, 4), 'RIFF');
      assert.deepEqual(errors, []);
      console.log('PASS', published ? 'published' : 'local', folder);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
