// Current player WAV smoke test. Requires Playwright and Chromium.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert');
const base = path.resolve(__dirname, '../docs');

const server = http.createServer((request, response) => {
  let file = decodeURIComponent(request.url.split('?')[0]);
  if (file.endsWith('/')) file += 'index.html';
  const target = path.join(base, file);
  try {
    response.setHeader('Content-Type',
      target.endsWith('.js') ? 'application/javascript'
        : target.endsWith('.css') ? 'text/css'
        : target.endsWith('.html') ? 'text/html' : 'text/plain');
    response.end(fs.readFileSync(target));
  } catch {
    response.writeHead(404);
    response.end();
  }
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({
    executablePath: process.env.MUSIC_TEST_CHROMIUM || undefined,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage({ acceptDownloads: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const host = 'http://127.0.0.1:' + server.address().port;
    await page.goto(host + '/music/04_Grassland-Trinity/');
    const player = page.locator('.mmsxx-player');
    await player.locator('[data-p="wav"]:not([disabled])').waitFor();
    assert.equal(await player.locator('[data-p="open"]').getAttribute('aria-expanded'), 'false');

    const shortMML =
      '// #title WAV Test\n// #ch Tone\nt120 @{pulse:25} @e{flat} o4 c8 r8';
    await page.locator('#gt-src').fill(shortMML);
    await page.locator('#gt-src').press('Tab');
    const pending = page.waitForEvent('download', { timeout: 120000 });
    await player.locator('[data-p="wav"]').click();
    await player.locator('[data-p="veil"]').waitFor({ state: 'visible' });
    const download = await pending;
    await player.locator('[data-p="veil"]').waitFor({ state: 'hidden' });
    const data = fs.readFileSync(await download.path());
    assert.equal(data.toString('ascii', 0, 4), 'RIFF');
    assert.equal(data.readUInt16LE(22), 1);
    assert.equal(data.readUInt16LE(34), 16);
    assert.deepEqual(errors, []);
    console.log('PASS current player WAV export');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => {
  console.error(error);
  server.close();
  process.exit(1);
});
