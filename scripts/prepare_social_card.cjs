const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const musicRoot = 'docs/music';

function cleanPath(value) {
  return String(value || '').trim().replaceAll('\\', '/').replace(/^\/+/, '');
}

function safeRepoPath(value) {
  const cleaned = cleanPath(value);
  assert(cleaned && path.posix.normalize(cleaned) === cleaned,
    'unsafe path: ' + value);
  assert(!cleaned.startsWith('../') && cleaned !== '..' && !cleaned.startsWith('.git/'),
    'unsafe path: ' + value);
  return cleaned;
}

function resolveFolder(value) {
  const cleaned = cleanPath(value).replace(/\/$/, '');
  return safeRepoPath(cleaned.startsWith(musicRoot + '/')
    ? cleaned : musicRoot + '/' + cleaned);
}

function resolveImage(folder, value) {
  const cleaned = cleanPath(value);
  if (cleaned.startsWith(musicRoot + '/')) return safeRepoPath(cleaned);
  return safeRepoPath(path.posix.normalize(path.posix.join(folder, cleaned)));
}

function escapeHTML(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function publicPath(folder) {
  return folder.slice((musicRoot + '/').length).split('/')
    .map(encodeURIComponent).join('/');
}

function prepare(folderInput, imageInput, options = {}) {
  const folder = resolveFolder(folderInput);
  const htmlPath = folder + '/index.html';
  const absoluteHTML = path.join(root, htmlPath);
  assert(fs.existsSync(absoluteHTML), 'index.html not found: ' + htmlPath);

  let html = fs.readFileSync(absoluteHTML, 'utf8');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  assert(titleMatch, 'title not found: ' + htmlPath);
  const title = titleMatch[1].trim();

  let source;
  if (imageInput) {
    source = resolveImage(folder, imageInput);
  } else {
    const imageMatch = html.match(/data-music-image="([^"]+)"/i);
    assert(imageMatch, 'data-music-image not found; specify image_path');
    source = resolveImage(folder, imageMatch[1]);
  }
  assert(fs.existsSync(path.join(root, source)), 'source image not found: ' + source);

  const output = folder + '/social-card.png';
  const pagePath = publicPath(folder);
  const canonical = 'https://harayoki.github.io/MMSXX_samples/music/' + pagePath + '/';
  const imageURL = 'https://media.githubusercontent.com/media/harayoki/'
    + 'MMSXX_samples/refs/heads/main/' + output.split('/').map(encodeURIComponent).join('/');
  const description = 'MMSXXで制作したMML楽曲「' + title + '」の試聴・ソースページ。';
  const meta = [
    '  <!-- social-card:start -->',
    '  <meta name="description" content="' + escapeHTML(description) + '">',
    '  <link rel="canonical" href="' + canonical + '">',
    '  <meta property="og:type" content="website">',
    '  <meta property="og:site_name" content="MMSXX Samples">',
    '  <meta property="og:title" content="' + escapeHTML(title) + '">',
    '  <meta property="og:description" content="' + escapeHTML(description) + '">',
    '  <meta property="og:url" content="' + canonical + '">',
    '  <meta property="og:image" content="' + imageURL + '">',
    '  <meta property="og:image:type" content="image/png">',
    '  <meta property="og:image:width" content="1200">',
    '  <meta property="og:image:height" content="630">',
    '  <meta property="og:image:alt" content="' + escapeHTML(title + ' cover art') + '">',
    '  <meta name="twitter:card" content="summary_large_image">',
    '  <meta name="twitter:title" content="' + escapeHTML(title) + '">',
    '  <meta name="twitter:description" content="' + escapeHTML(description) + '">',
    '  <meta name="twitter:image" content="' + imageURL + '">',
    '  <!-- social-card:end -->',
  ].join('\n');

  const marked = /  <!-- social-card:start -->[\s\S]*?  <!-- social-card:end -->/;
  if (marked.test(html)) html = html.replace(marked, meta);
  else html = html.replace(titleMatch[0], titleMatch[0] + '\n' + meta);
  assert(html.includes(meta), 'failed to update social metadata');
  if (!options.check) fs.writeFileSync(absoluteHTML, html);

  return { folder, html: htmlPath, source, output, title, canonical, image_url: imageURL };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const checkAt = args.indexOf('--check');
  const check = checkAt >= 0;
  if (check) args.splice(checkAt, 1);
  try {
    console.log(JSON.stringify(prepare(args[0], args[1] || '', { check })));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = prepare;
