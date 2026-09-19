// Fails when a Git-tracked file marked filter=lfs is stored as a regular blob.
const assert = require('assert');
const { spawnSync } = require('child_process');
const path = require('path');

const repository = path.resolve(__dirname, '..');
const maxBuffer = 64 * 1024 * 1024;

function git(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: repository,
    encoding: options.encoding ?? 'utf8',
    input: options.input,
    maxBuffer,
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed:\n${result.stderr}`);
  }
  return result.stdout;
}

function checkLFSPointers() {
  const tracked = git(['ls-files', '-z'], { encoding: 'buffer' });
  const attributes = git(
    ['check-attr', '--cached', '-z', 'filter', '--stdin'],
    { input: tracked, encoding: 'buffer' },
  ).toString('utf8').split('\0');

  const lfsFiles = [];
  for (let index = 0; index + 2 < attributes.length; index += 3) {
    const [file, attribute, value] = attributes.slice(index, index + 3);
    if (attribute === 'filter' && value === 'lfs') lfsFiles.push(file);
  }

  const invalid = [];
  for (const file of lfsFiles) {
    const entry = git(['ls-files', '-s', '--', file]).match(/^\d+ ([0-9a-f]+) \d+\t/);
    assert(entry, `${file}: index entry not found`);
    const oid = entry[1];
    const size = Number(git(['cat-file', '-s', oid]).trim());
    if (size > 1024) {
      invalid.push(`${file} (${size} bytes)`);
      continue;
    }
    const pointer = git(['cat-file', 'blob', oid]);
    const valid = pointer.startsWith('version https://git-lfs.github.com/spec/v1\n')
      && /^oid sha256:[0-9a-f]{64}$/m.test(pointer)
      && /^size [0-9]+$/m.test(pointer);
    if (!valid) invalid.push(`${file} (${size} bytes)`);
  }

  assert.equal(
    invalid.length,
    0,
    `LFS対象ファイルが通常blobです:\n${invalid.map(file => `- ${file}`).join('\n')}`,
  );
  console.log(`PASS Git LFS pointers ${lfsFiles.length} files`);
}

if (require.main === module) checkLFSPointers();
module.exports = checkLFSPointers;
