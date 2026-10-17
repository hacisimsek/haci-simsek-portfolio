// The scroll story under the hero: a terminal window that turns to face the
// visitor and pulls them in while the Java 21 migration runs, module by
// module, then steps back to the numbers. Everything on screen is a pure
// function of scroll progress p, so the scene can be tested without a browser
// and never moves on its own. With reduced motion the CSS lays the same
// content out statically instead.

/** Where the story plays: wide and tall enough screens with a fine pointer.
    Everywhere else the CSS shows the same content as a still section. */
export const STORY_MEDIA =
  '(min-width: 64rem) and (min-height: 40rem) and (pointer: fine)';

export type Tone = 'prompt' | 'dim' | 'text' | 'ok';

/** What the terminal prints, top to bottom: the proof of concept, then the
    migration. Kept in English, as a terminal would be. The module domains are
    the ones named in the Career entry; the bar after the last line is drawn
    by the scene. */
export const LINES: readonly { text: string; tone: Tone }[] = [
  { text: '$ git switch -c poc/spring-boot-3', tone: 'prompt' },
  { text: '  Spring Boot 2.x → 3.x      Java 11 → 21', tone: 'dim' },
  { text: '  javax.* → jakarta.*        done', tone: 'ok' },
  { text: '  build ok\u00a0· tests green     proof of concept ✓', tone: 'ok' },
  { text: '$ ./migrate --all --to java21', tone: 'prompt' },
  { text: '  auth                       ✓ Java 21', tone: 'ok' },
  { text: '  registration               ✓ Java 21', tone: 'ok' },
  { text: '  account                    ✓ Java 21', tone: 'ok' },
  { text: '  session                    ✓ Java 21', tone: 'ok' },
  { text: '  profile                    ✓ Java 21', tone: 'ok' },
  { text: '  content                    ✓ Java 21', tone: 'ok' },
];

/** Lines the terminal types, one after another. */
export const TOTAL_LINES = LINES.length;

/** The migration bar shows up with the first module line and fills as the
    module lines are typed. */
export const BAR_LINE = LINES.findIndex((line) =>
  line.text.includes('✓ Java 21')
);

/** Modules moved to Java 21: the bar fills to this count, and the copy
    says "MODULES+" because the exact number is not given. */
export const MODULES = 30;

type Key = readonly [p: number, value: number];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** 0 when the track's top meets the viewport's top, 1 when its bottom does. */
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
  [0, 62],
  [0.26, 0],
];
const TURN: Key[] = [
  [0, -16],
  [0.26, 0],
];
const ROLL: Key[] = [
  [0, 7],
  [0.26, 0],
];
// In svh, so the window clears the outro on any screen height.
const LIFT: Key[] = [
  [0, 18],
  [0.26, 0],
  [0.8, 0],
  [0.92, -14],
];
// ... the camera moves in, then out again for the numbers.
const SCALE: Key[] = [
  [0, 0.8],
  [0.26, 1],
  [0.38, 1.12],
  [0.8, 1.12],
  [0.92, 0.62],
];
const GLOW: Key[] = [
  [0, 0.45],
  [0.38, 1],
  [0.8, 1],
  [1, 0.45],
];
// Gone before the window, still turning, reaches the header.
const HEADLINE: Key[] = [
  [0.02, 1],
  [0.12, 0],
];
// The terminal steps back and dims, so the numbers lead at the end.
const WINDOW: Key[] = [
  [0.82, 1],
  [0.94, 0.35],
];
const OUTRO: Key[] = [
  [0.84, 0],
  [0.95, 1],
];

// Lines type out while the window turns and the camera is in; the bar fills
// alongside the module lines.
const TYPING = { from: 0.12, to: 0.66 };
const MIGRATION = {
  from: TYPING.from + (BAR_LINE / TOTAL_LINES) * (TYPING.to - TYPING.from),
  to: TYPING.to,
};

export interface StoryFrame {
  /** 0 arrive, 1 inside, 2 numbers. */
  act: number;
  rx: number;
  ry: number;
  rz: number;
  /** Vertical offset in svh. */
  lift: number;
  scale: number;
  glow: number;
  headline: number;
  /** The window's opacity. */
  window: number;
  outro: number;
  /** Lines typed so far; the fraction is the line being typed. */
  lines: number;
  /** Modules migrated, 0 … MODULES. */
  migrated: number;
}

const linear = (p: number, { from, to }: { from: number; to: number }) =>
  clamp((p - from) / (to - from));

/** The scene at scroll progress p. */
export function storyAt(p: number): StoryFrame {
  return {
    act: p < 0.26 ? 0 : p < 0.84 ? 1 : 2,
    rx: track(p, TILT),
    ry: track(p, TURN),
    rz: track(p, ROLL),
    lift: track(p, LIFT),
    scale: track(p, SCALE),
    glow: track(p, GLOW),
    headline: track(p, HEADLINE),
    window: track(p, WINDOW),
    outro: track(p, OUTRO),
    lines: linear(p, TYPING) * TOTAL_LINES,
    migrated: linear(p, MIGRATION) * MODULES,
  };
}

const round = (value: number) => Math.round(value * 1000) / 1000 || 0;

/** The frame as the custom properties the scene's CSS reads. */
export function toVars(frame: StoryFrame): Record<string, string> {
  return {
    '--rx': `${round(frame.rx)}deg`,
    '--ry': `${round(frame.ry)}deg`,
    '--rz': `${round(frame.rz)}deg`,
    '--lift': `${round(frame.lift)}svh`,
    '--scale': `${round(frame.scale)}`,
    '--glow': `${round(frame.glow)}`,
    '--headline': `${round(frame.headline)}`,
    '--window': `${round(frame.window)}`,
    '--outro': `${round(frame.outro)}`,
    '--lines': `${round(frame.lines)}`,
    '--migrated': `${round(frame.migrated / MODULES)}`,
  };
}
