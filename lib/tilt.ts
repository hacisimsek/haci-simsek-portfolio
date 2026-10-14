type Rect = { left: number; top: number; width: number; height: number };

const clamp = (value: number, max: number) =>
  Math.min(max, Math.max(-max, value));

const round = (value: number) => Math.round(value * 100) / 100 || 0;

// Pointer position → card rotation in degrees, at most `max` either way.
// Top-right tilts towards the viewer on both axes.
export function tiltFromPointer(
  x: number,
  y: number,
  rect: Rect,
  max = 8
): { rotateX: number; rotateY: number } {
  const rotateY = ((x - rect.left) / rect.width - 0.5) * 2 * max;
  const rotateX = (0.5 - (y - rect.top) / rect.height) * 2 * max;
  return {
    rotateX: round(clamp(rotateX, max)),
    rotateY: round(clamp(rotateY, max)),
  };
}
