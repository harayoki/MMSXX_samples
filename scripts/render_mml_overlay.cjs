const assert = require('assert');
const fs = require('fs');

function hash(value) {
  let result = 2166136261;
  for (const char of value) {
    result ^= char.codePointAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function render(inputPath, leftPath, rightPath) {
  assert(inputPath && leftPath && rightPath,
    'usage: render_mml_overlay.cjs INPUT.mml LEFT.txt RIGHT.txt');
  const source = fs.readFileSync(inputPath, 'utf8')
    .replace(/^#(?:title|about)\b.*$/gm, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, ' ').trim();
  assert(source, 'MML source is empty: ' + inputPath);

  const width = 12;
  const rows = 14;
  const fragments = [];
  for (let at = 0; fragments.length < rows * 2; at += width) {
    if (at >= source.length) at = 0;
    fragments.push(source.slice(at, at + width));
  }

  const decorate = (fragment, index) => {
    const marker = hash(fragment + index) % 9 === 0 ? '> ' : '  ';
    return marker + fragment;
  };
  fs.writeFileSync(leftPath,
    fragments.slice(0, rows).map(decorate).join('\n') + '\n');
  fs.writeFileSync(rightPath,
    fragments.slice(rows).map((line, index) => decorate(line, index + rows)).join('\n') + '\n');
}

try {
  render(process.argv[2], process.argv[3], process.argv[4]);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
