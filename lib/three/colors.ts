type Rgb = [number, number, number];

let context: CanvasRenderingContext2D | null | undefined;

function parse(value: string): Rgb | null {
  const hex = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const rgb = value.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (rgb) return [+rgb[1] / 255, +rgb[2] / 255, +rgb[3] / 255];
  return null;
}

// Any CSS colour (the theme tokens are oklch) → sRGB channels in 0–1, by
// letting a 1×1 canvas do the conversion.
export function cssColorToRgb(value: string): Rgb {
  if (context === undefined) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    try {
      context = canvas.getContext('2d', { willReadFrequently: true });
    } catch {
      context = null;
    }
  }
  if (context) {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = '#fff';
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return [r / 255, g / 255, b / 255];
  }
  return parse(value) ?? [1, 1, 1];
}
