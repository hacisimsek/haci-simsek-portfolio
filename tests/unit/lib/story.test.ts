import { describe, expect, it } from 'vitest';
import {
  LINES,
  MODULES,
  TOTAL_LINES,
  progress,
  storyAt,
  toVars,
  track,
} from '@/lib/story';

describe('progress', () => {
  it('runs from 0 when the track top meets the viewport top to 1 when its bottom does', () => {
    expect(progress(0, 4000, 1000)).toBe(0);
    expect(progress(-1500, 4000, 1000)).toBe(0.5);
    expect(progress(-3000, 4000, 1000)).toBe(1);
  });

  it('clamps before and after the track', () => {
    expect(progress(400, 4000, 1000)).toBe(0);
    expect(progress(-9000, 4000, 1000)).toBe(1);
    expect(progress(0, 800, 1000)).toBe(0);
  });
});

describe('track', () => {
  const keys = [
    [0.2, 0],
    [0.4, 10],
  ] as const;

  it('holds the first and last values outside the keys', () => {
    expect(track(0, keys)).toBe(0);
    expect(track(1, keys)).toBe(10);
  });

  it('eases between keys and passes through the midpoint', () => {
    expect(track(0.3, keys)).toBeCloseTo(5);
    expect(track(0.25, keys)).toBeLessThan(2.5);
  });
});

describe('terminal content', () => {
  it('boots on Java 21, fails at payment and compensates in reverse', () => {
    const text = LINES.map((line) => line.text).join('\n');
    expect(text).toMatch(/Java 21/);
    expect(LINES.find((line) => line.tone === 'fail')?.text).toMatch(
      /PaymentFailed/
    );
    expect(
      LINES.filter((line) => line.tone === 'undo').map((line) => line.text)
    ).toEqual([
      expect.stringMatching(/StockReleased/),
      expect.stringMatching(/OrderCancelled/),
    ]);
  });

  it('never shows undo before the failure', () => {
    const fail = LINES.findIndex((line) => line.tone === 'fail');
    LINES.forEach((line, index) => {
      if (line.tone === 'undo') expect(index).toBeGreaterThan(fail);
    });
  });

  it('migrates the 31 modules from the CV', () => {
    expect(MODULES).toBe(31);
  });
});

describe('storyAt', () => {
  it('starts with the headline over a window lying back', () => {
    const first = storyAt(0);
    expect(first.act).toBe(0);
    expect(first.headline).toBe(1);
    expect(first.rx).toBeGreaterThan(45);
    expect(first.lines).toBe(0);
    expect(first.outro).toBe(0);
  });

  it('faces the visitor, then moves in while the terminal types', () => {
    expect(storyAt(0.3).rx).toBe(0);
    expect(storyAt(0.5).scale).toBeGreaterThan(1.1);
    expect(storyAt(0.5).lines).toBeGreaterThan(0);
    expect(storyAt(0.5).lines).toBeLessThan(TOTAL_LINES);
    expect(storyAt(0.5).act).toBe(1);
  });

  it('ends on the numbers with every line typed and the bar full', () => {
    const last = storyAt(1);
    expect(last.act).toBe(2);
    expect(last.outro).toBe(1);
    expect(last.headline).toBe(0);
    expect(last.lines).toBe(TOTAL_LINES);
    expect(last.migrated).toBe(MODULES);
    expect(last.scale).toBeLessThan(1);
  });

  it('fills the migration bar only after the command is typed', () => {
    for (let p = 0; p <= 1; p += 0.005) {
      const frame = storyAt(p);
      if (frame.migrated > 0) expect(frame.lines).toBe(TOTAL_LINES);
    }
  });

  it('moves continuously: a small scroll never jumps the window', () => {
    let previous = storyAt(0);
    for (let p = 0.001; p <= 1; p += 0.001) {
      const frame = storyAt(p);
      expect(Math.abs(frame.rx - previous.rx)).toBeLessThan(1);
      expect(Math.abs(frame.scale - previous.scale)).toBeLessThan(0.02);
      expect(Math.abs(frame.lift - previous.lift)).toBeLessThan(3);
      previous = frame;
    }
  });
});

describe('storyAt, still (reduced motion)', () => {
  it('keeps the window facing the visitor at every scroll position', () => {
    for (let p = 0; p <= 1; p += 0.01) {
      expect(storyAt(p, true)).toMatchObject({
        rx: 0,
        ry: 0,
        rz: 0,
        lift: 0,
        scale: 1,
      });
    }
  });

  it('fills the terminal in whole lines and whole modules', () => {
    for (let p = 0; p <= 1; p += 0.003) {
      const frame = storyAt(p, true);
      expect(Number.isInteger(frame.lines)).toBe(true);
      expect(Number.isInteger(frame.migrated)).toBe(true);
      expect([0, 1]).toContain(frame.headline);
      expect([0, 1]).toContain(frame.outro);
    }
    expect(storyAt(1, true).lines).toBe(TOTAL_LINES);
  });
});

describe('toVars', () => {
  it('writes the frame as CSS custom properties with units', () => {
    const vars = toVars(storyAt(0.1));
    expect(vars['--rx']).toMatch(/deg$/);
    expect(vars['--lift']).toMatch(/px$/);
    expect(vars['--scale']).toMatch(/^\d+(\.\d+)?$/);
    expect(vars['--migrated']).toBe('0');
  });

  it('rounds so the style string stays short', () => {
    for (const value of Object.values(toVars(storyAt(0.4321)))) {
      expect(value.replace(/[a-z]+$/, '')).toMatch(/^-?\d+(\.\d{1,3})?$/);
    }
  });
});
