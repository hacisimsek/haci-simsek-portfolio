// The scroll story under the hero: a terminal window that turns to face the
// visitor, pulls them in while a service boots and an order saga runs, then
// steps back to the numbers. Everything on screen is a pure function of scroll
// progress p, so the scene can be tested without a browser and never moves on
// its own.

/** Where the story is drawn: wide screens with a fine pointer. With reduced
    motion it plays still (see storyAt). Elsewhere the hero saga carries the
    same idea. */
export const STORY_MEDIA = '(min-width: 64rem) and (pointer: fine)';

export type Tone = 'prompt' | 'dim' | 'text' | 'ok' | 'fail' | 'undo';

/** What the terminal prints, top to bottom. Kept in English, as a terminal
    would be. The migration bar after the last line is drawn by the scene. */
export const LINES: readonly { text: string; tone: Tone }[] = [
  { text: '$ ./mvnw spring-boot:run', tone: 'prompt' },
  { text: '  :: Spring Boot ::  (v3.3)        Java 21', tone: 'dim' },
  { text: 'INFO  Started OrderApplication in 2.4 s', tone: 'text' },
  { text: 'INFO  Joined consumer group order-events', tone: 'text' },
  { text: '→ OrderCreated     inventory   ok     11 ms', tone: 'ok' },
  { text: '→ StockReserved    payment     ok      9 ms', tone: 'ok' },
  { text: '✕ PaymentFailed    payment     declined', tone: 'fail' },
  { text: '↺ StockReleased    inventory   compensated', tone: 'undo' },
  { text: '↺ OrderCancelled   order       compensated', tone: 'undo' },
  { text: 'INFO  Saga rolled back. State is consistent.', tone: 'text' },
  { text: '$ ./migrate --to java21', tone: 'prompt' },
];

/** Every printed line plus the migration bar. */
export const TOTAL_LINES = LINES.length + 1;

/** Modules moved to Java 21: the count the migration bar fills to. */
export const MODULES = 31;

type Key = readonly [p: number, value: number];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** 0 when the section's top meets the viewport's top, 1 when its bottom does. */
export function progress(top: number, height: number, viewport: number) {
  const range = height - viewport;
  return range > 0 ? clamp(-top / range) : 0;
}

/** Eased piecewise interpolation through [p, value] keys. */
export function track(p: number, keys: readonly Key[]) {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [p1, v1] = keys[i];
    if (p <= p1) {
      const [p0, v0] = keys[i - 1];
      return v0 + (v1 - v0) * smooth((p - p0) / (p1 - p0));
    }
  }
  return keys[keys.length - 1][1];
}

// Lying back, it rises and turns to face the visitor ...
const TILT: Key[] = [
  [0, 64],
  [0.3, 0],
];
const TURN: Key[] = [
  [0, -18],
  [0.3, 0],
];
const ROLL: Key[] = [
  [0, 8],
  [0.3, 0],
];
const LIFT: Key[] = [
  [0, 160],
  [0.3, 0],
  [0.8, 0],
  [0.92, -80],
];
// ... then the camera moves in, and out again for the numbers.
const SCALE: Key[] = [
  [0, 0.78],
  [0.3, 1],
  [0.42, 1.22],
  [0.8, 1.22],
  [0.92, 0.66],
];
const GLOW: Key[] = [
  [0, 0.45],
  [0.42, 1],
  [0.8, 1],
  [1, 0.45],
];
const HEADLINE: Key[] = [
  [0.04, 1],
  [0.2, 0],
];
const OUTRO: Key[] = [
  [0.84, 0],
  [0.95, 1],
];

// Lines type out one after another while the camera is in, then the
// migration bar fills.
const TYPING = { from: 0.2, to: 0.7 };
const MIGRATION = { from: 0.7, to: 0.78 };

export interface StoryFrame {
  /** 0 arrive, 1 inside, 2 numbers. */
  act: number;
  rx: number;
  ry: number;
  rz: number;
  lift: number;
  scale: number;
  glow: number;
  headline: number;
  outro: number;
  /** Lines typed so far; the fraction is the line being typed. */
  lines: number;
  /** Modules migrated, 0 … MODULES. */
  migrated: number;
}

const linear = (p: number, { from, to }: { from: number; to: number }) =>
  clamp((p - from) / (to - from));

/** The scene at scroll progress p. `still` (reduced motion) keeps the window
    facing the visitor and fills the terminal in whole steps. */
export function storyAt(p: number, still = false): StoryFrame {
  const act = p < 0.3 ? 0 : p < 0.84 ? 1 : 2;
  const lines = linear(p, TYPING) * TOTAL_LINES;
  const migrated = linear(p, MIGRATION) * MODULES;

  if (still) {
    return {
      act,
      rx: 0,
      ry: 0,
      rz: 0,
      lift: 0,
      scale: 1,
      glow: 0.6,
      headline: p < 0.12 ? 1 : 0,
      outro: p >= 0.9 ? 1 : 0,
      lines: Math.floor(lines),
      migrated: Math.floor(migrated),
    };
  }

  return {
    act,
    rx: track(p, TILT),
    ry: track(p, TURN),
    rz: track(p, ROLL),
    lift: track(p, LIFT),
    scale: track(p, SCALE),
    glow: track(p, GLOW),
    headline: track(p, HEADLINE),
    outro: track(p, OUTRO),
    lines,
    migrated,
  };
}

const round = (value: number) => Math.round(value * 1000) / 1000 || 0;

/** The frame as the custom properties the scene's CSS reads. */
export function toVars(frame: StoryFrame): Record<string, string> {
  return {
    '--rx': `${round(frame.rx)}deg`,
    '--ry': `${round(frame.ry)}deg`,
    '--rz': `${round(frame.rz)}deg`,
    '--lift': `${round(frame.lift)}px`,
    '--scale': `${round(frame.scale)}`,
    '--glow': `${round(frame.glow)}`,
    '--headline': `${round(frame.headline)}`,
    '--outro': `${round(frame.outro)}`,
    '--lines': `${round(frame.lines)}`,
    '--migrated': `${round(frame.migrated / MODULES)}`,
  };
}
