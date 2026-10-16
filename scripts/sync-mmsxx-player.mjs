#!/usr/bin/env node
// Bundle the official MMS/XX engine + PLAYER from the adjacent Studio checkout.
// No alternate synthesizer. Do not edit the engine or PLAYER implementations here.
// Usage: node scripts/sync-mmsxx-player.mjs ../mmsxx-mml-studio

import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const samples = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const studio = resolve(process.argv[2] ?? '../mmsxx-mml-studio');
const run = (...args) => execFileSync('git', ['-C', studio, ...args], { encoding: 'utf8' }).trim();
const sha = run('rev-parse', 'HEAD');
if (run('status', '--porcelain')) throw Error('Studio has uncommitted changes; bundle a clean commit');
const requireStudio = createRequire(join(studio, 'package.json'));
const esbuild = requireStudio('esbuild');
const versionSource = await readFile(join(studio, 'sound/version.js'), 'utf8');
const version = versionSource.match(/export const SOUND_VERSION = ['"]([^'"]+)/)?.[1];
if (!version) throw Error('Cannot identify engine version');
const stage = join(studio, '.work', 'samples-player-entry.mjs');
await mkdir(dirname(stage), { recursive: true });
const entry = [
  "import * as audio from '../sound/audio.js';",
  "import * as mml from '../sound/mml.js';",
  "import * as tones from '../sound/tones.js';",
  "import { mountPlayer, PLAYER_CSS } from '../tool/ui/player.js';",
  "import { PLAYER_VERSION } from '../tool/ui/version.js';",
  'window.MMSXX = window.MMSXX || {};',
  'window.MMSXX.sound = { ...audio, ...mml, ...tones, mountPlayer, PLAYER_CSS, PLAYER_VERSION, player: { mount: mountPlayer, CSS: PLAYER_CSS, version: PLAYER_VERSION } };',
].join('\n');
try {
  await writeFile(stage, entry);
  const build = await esbuild.build({
    entryPoints: [stage], bundle: true, platform: 'browser', format: 'iife',
    target: ['es2022'], minify: false, write: false, logLevel: 'warning',
  });
  if (build.outputFiles.length !== 1) throw Error('Unexpected bundle outputs');
  const out = '// MMS/XX official engine + PLAYER, source commit ' + sha + '\n'
    + build.outputFiles[0].text;
  if (!out.includes('window.MMSXX.sound') || !out.includes('mountPlayer')) {
    throw Error('The official PLAYER is missing from the bundle');
  }
  const dest = join(samples, 'docs/music/player-engine.js');
  await writeFile(dest, out);
  console.log('Built ' + dest + ' (engine ' + version + ', Studio ' + sha + ')');
} finally {
  await rm(stage, { force: true });
}
