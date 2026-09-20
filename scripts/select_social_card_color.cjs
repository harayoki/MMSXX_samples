const assert = require('assert');

function rgbToHsl(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { hue: 0, saturation: 0, lightness };

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue;
  if (max === r) hue = 60 * (((g - b) / delta) % 6);
  else if (max === g) hue = 60 * (((b - r) / delta) + 2);
  else hue = 60 * (((r - g) / delta) + 4);
  if (hue < 0) hue += 360;
  return { hue, saturation, lightness };
}

function hslToRgb(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const section = hue / 60;
  const secondary = chroma * (1 - Math.abs((section % 2) - 1));
  const values = section < 1 ? [chroma, secondary, 0]
    : section < 2 ? [secondary, chroma, 0]
      : section < 3 ? [0, chroma, secondary]
        : section < 4 ? [0, secondary, chroma]
          : section < 5 ? [secondary, 0, chroma]
            : [chroma, 0, secondary];
  const offset = lightness - chroma / 2;
  return values.map(value => Math.round((value + offset) * 255));
}

function selectColor(hexInput) {
  const hex = String(hexInput || '').trim().replace(/^#/, '').slice(0, 6);
  assert(/^[0-9a-f]{6}$/i.test(hex), 'average image color must be six hex digits');
  const source = [0, 2, 4].map(index => Number.parseInt(hex.slice(index, index + 2), 16));
  const hsl = rgbToHsl(...source);
  // Use the cover's complementary hue, then keep it bright enough for the dark card backdrop.
  const hue = (hsl.saturation < 0.08 ? 42 : hsl.hue + 180) % 360;
  const saturation = hsl.saturation < 0.08 ? 0.82 : Math.max(0.68, Math.min(0.86, hsl.saturation));
  const rgb = hslToRgb(hue, saturation, 0.72);
  return `rgba(${rgb.join(',')},0.72)`;
}

if (require.main === module) {
  try {
    process.stdout.write(selectColor(process.argv[2]) + '\n');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = selectColor;
