#!/usr/bin/env node
// Normalize the LIVE sample pages' master gain, never individual voices.
// Uses the official site bundle and each page's actual player.js settings.
// Call the official PLAYER's Level / player.measure() to get gainWrite.
// No WAV file export or duplicate loudness calculation.
// Usage: npm install --no-save playwright
//        node scripts/normalize-music-gain.mjs

import http from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');
const music = join(docs, 'music');
const TARGET = { lufs: -16, peak: -1 };
const manifest = [
  ['Volcano Parade', '01_Volcano-parade', 'volcano-parade.mml'],
  ['Pocket Tunnel / Original', '02_Pocket-Tunnel', 'original.mml', 'original'],
  ['Pocket Tunnel / Jazz', '02_Pocket-Tunnel', 'jazz.mml', 'jazz'],
  ['Pocket Tunnel / Fusion', '02_Pocket-Tunnel', 'fusion-v1.mml', 'fusion-v1'],
  ['Windward Crossing', '03_Windward-Crossing', 'windward-crossing.mml'],
  ['Windward Crossing / CH1', '03_Windward-Crossing/ch1-field', 'ch1-field.mml'],
  ['Grassland Trinity', '04_Grassland-Trinity', 'grassland-trinity.mml'],
  ['Windward Battle', '05_Windward-Battle-Interactive', 'windward-battle-interactive.mml'],
  ['BEAT V2', '06_BEAT_V2', 'beat_v2.mml'],
  ['Dark Corridor', '07_Dark-Corridor', 'dark-corridor.mml'],
  ['STARFABLE Boss', '08_STARFABLE-Boss', 'starfable-boss.mml'],
  ['Shiawase no Ashioto', '09_Shiawase-no-Ashioto', 'shiawase-no-ashioto.mml'],
  ['Shiawase no Ashioto NES', '10_Shiawase-no-Ashioto-NES', 'shiawase-nes.mml'],
  ['MARBLE HOUSE', '11_Marble-House', 'marble-house.mml'],
  ['Sky Dominant', '12_Sky-Dominant', 'sky-dominant.mml'],
];
const gainPattern = /^[ \t]*#gain[ \t]+([0-9]+(?:\.[0-9]+)?)(?:[ \t]+[^\r\n]*)?$/m;
const saved = new Map();
const sample = (number) => Number.isFinite(number) ? number.toFixed(2) : 'N/A';
const dbToRatio = (db) => 10 ** (db / 20);
const ratioToDb = (ratio) => 20 * Math.log10(ratio);

function rewriteGain(source, newGain) {
  const line = '#gain ' + newGain.toFixed(6) + ' measured';
  if (gainPattern.test(source)) return source.replace(gainPattern, line);
  const firstChannel = source.search(/^[ \t]*#ch\b/m);
  if (firstChannel < 0) return line + '\n' + source;
  return source.slice(0, firstChannel) + line + '\n' + source.slice(firstChannel);
}

async function serve() {
  const server = http.createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const full = resolve(docs, '.' + path);
      if (full !== docs && !full.startsWith(docs + sep)) {
        res.writeHead(403).end(); return;
      }
      const file = path.endsWith('/') ? join(full, 'index.html') : full;
      const bytes = await readFile(file);
      const contentType = { '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8', '.mml': 'text/plain; charset=utf-8',
        '.css': 'text/css; charset=utf-8', '.png': 'image/png',
        '.jpg': 'image/jpeg', '.webp': 'image/webp' }[extname(file)] ?? 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' }).end(bytes);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  return { server, origin: 'http://127.0.0.1:' + server.address().port };
}

// Capture the REAL player via an in-memory Playwright response patch.
// Neither the published page nor its mixer needs a diagnostic hook.
const bootstrap = await readFile(join(music, 'music-page.js'), 'utf8');
const marker = 'const toggle = root.querySelector(\'[data-p="open"]\');';
if (!bootstrap.includes(marker)) throw Error('PLAYER mount hook changed; review before measuring');
const patchedBootstrap = bootstrap.replace(marker,
  'window.__SAMPLES_LOUDNESS_PLAYER__ = player;\n      ' + marker);

const { server, origin } = await serve();
const browser = await chromium.launch({
  headless: true, ...(process.env.MUSIC_TEST_CHROMIUM
    ? { executablePath: process.env.MUSIC_TEST_CHROMIUM } : {}),
});
let success = false;
const rows = [];

try {
  const page = await browser.newPage();
  page.setDefaultTimeout(180000);
  await page.route('**/music-page.js', async (route) =>
    route.fulfill({ status: 200, contentType: 'text/javascript; charset=utf-8',
      body: patchedBootstrap }));
  let pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  async function measure(entry) {
    pageErrors = [];
    const [, folder, , mix] = entry;
    const query = mix ? '?mix=' + encodeURIComponent(mix) : '';
    await page.goto(origin + '/music/' + folder + '/index.html' + query);
    try {
      await page.waitForFunction(() => Boolean(window.__SAMPLES_LOUDNESS_PLAYER__));
    } catch (error) {
      const status = await page.locator('[data-music-status]').first().textContent().catch(() => '');
      throw Error('PLAYER not mounted: ' + entry[0] + ' ' + status + ' ' + pageErrors.join('; '));
    }
    // Use the exact same API as the PLAYER's Level button.
    return page.evaluate(async (target) => {
      const p = window.__SAMPLES_LOUDNESS_PLAYER__;
      if (typeof p.measure !== 'function') {
        throw Error('Outdated PLAYER: player.measure() unavailable. Update bundle first.');
      }
      const oldLoops = p.audio.loopTimes;
      if (!Number.isFinite(oldLoops)) p.audio.loopTimes = 1;
      try {
        const level = await p.measure(target);
        if (!level) throw Error('PLAYER Level returned no result');
        return level;
      } finally {
        p.audio.loopTimes = oldLoops;
      }
    }, TARGET);
  }

  for (let index = 0; index < manifest.length; index++) {
    const entry = manifest[index];
    const [name, folder, filename] = entry;
    const file = join(music, folder, filename);
    const original = await readFile(file, 'utf8');
    if (!saved.has(file)) saved.set(file, original);
    const before = await measure(entry);
    if (!Number.isFinite(before.lufs) || !Number.isFinite(before.truePeakDb)) {
      throw Error('PLAYER Level gave non-finite values: ' + name);
    }
    // Let PLAYER calculate gainWrite, including any existing #gain.
    const existing = Number(gainPattern.exec(original)?.[1] ?? 1);
    const by = before.by === 'lufs' ? '目標' : '天井';
    let next = Math.min(8, Number(before.gainWrite));
    if (!Number.isFinite(next) || next <= 0) {
      throw Error('Invalid PLAYER gainWrite for ' + name + ': ' + before.gainWrite);
    }
    let after;
    // PLAYER rounds gainWrite to 0.01. Recheck the non-negotiable TP ceiling.
    for (let pass = 0; pass < 30; pass++) {
      await writeFile(file, rewriteGain(original, next));
      after = await measure(entry);
      if (!Number.isFinite(after.lufs) || !Number.isFinite(after.truePeakDb)) {
        throw Error('PLAYER Level failed after change: ' + name);
      }
      if (after.truePeakDb <= TARGET.peak) break;
      next *= dbToRatio(-0.1);
      if (pass === 29) throw Error('Unable to meet peak ceiling: ' + name);
    }
    const applied = ratioToDb(next / existing);
    rows.push({ name, before, after, applied, by, existing, next,
      cap: Number(before.gainWrite) > 8 });
    console.log(name + ': ' + sample(before.lufs) + ' LUFS / '
      + sample(before.truePeakDb) + ' dBTP -> '
      + sample(after.lufs) + ' / ' + sample(after.truePeakDb)
      + ', ' + sample(applied) + ' dB (' + by + ')');
  }

  const header = [
    '# MMSXX サンプル曲 ラウドネス実測',
    '',
    '- 目標: Integrated -16 LUFS、true peak -1 dBTP 以下',
    '- 測定: 公式PLAYERのLevel（player.measure）。WAVファイル生成なし',
    '- ミキサー・音色・音符・強弱・エフェクトは変更しない。変更はMMLの #gain のみ',
    '- PLAYER推奨GAINを適用し、適用後もLevelで再測定',
    '- 測定日時(UTC): ' + new Date().toISOString(),
    '- エンジン: ' + (await readFile(join(music, 'player-engine.js'), 'utf8')).split('\n')[0],
    '',
    '| 曲名 | 前 I (LUFS) | 前 TP (dBTP) | 掛けた dB | 後 I (LUFS) | 後 TP (dBTP) | 決定 |',
    '|---|---:|---:|---:|---:|---:|---|',
  ];
  for (const x of rows) header.push('| ' + x.name + ' | ' + sample(x.before.lufs)
    + ' | ' + sample(x.before.truePeakDb) + ' | ' + sample(x.applied)
    + ' | ' + sample(x.after.lufs) + ' | ' + sample(x.after.truePeakDb)
    + ' | ' + x.by + (x.cap ? ' (gain上限8)' : '') + ' |');
  header.push('', '値は最後に再測定した結果。true peakが-1 dBTPを超える場合は処理を中断する。', '');
  await writeFile(join(music, 'LOUDNESS_REPORT.md'), header.join('\n'));
  success = true;
} finally {
  if (!success) {
    for (const [file, content] of saved) await writeFile(file, content);
  }
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
if (!success) process.exitCode = 1;
