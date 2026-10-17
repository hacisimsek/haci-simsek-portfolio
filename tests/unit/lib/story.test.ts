import { describe, expect, it } from 'vitest';
import { experience } from '@/content';
import {
  LINES,
  BAR_LINE,
  MODULES,
  counterText,
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
  it('runs the proof of concept, then moves every module to Java 21', () => {
    const text = LINES.map((line) => line.text).join('\n');
    expect(text).toMatch(/Spring Boot 2\.x → 3\.x\s+Java 11 → 21/);
    expect(text).toMatch(/proof of concept/);
    expect(text).toMatch(/migrate --all --to java21/);
  });

  it('only names module domains the Career entry already mentions', () => {
    const career = JSON.stringify(experience[0].highlights.en);
    const modules = LINES.filter((line) => line.text.includes('✓ Java 21'));
    expect(modules.length).toBeGreaterThan(0);
    for (const line of modules) {
      const name = line.text.trim().split(/\s+/)[0];
      expect(career).toContain(name === 'auth' ? 'authentication' : name);
    }
  });

  it('counts the same modules as the Career entry and the outro', () => {
    expect(experience[0].highlights.en[0]).toContain(`${MODULES}+ modules`);
  });

  it('tells no saga: purple and red belong to the hero', () => {
    expect(LINES.map((line) => line.tone)).not.toContain('fail');
    expect(LINES.map((line) => line.tone)).not.toContain('undo');
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
    expect(storyAt(0.26).rx).toBe(0);
    expect(storyAt(0.5).scale).toBeGreaterThan(1.05);
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

  it('fills the migration bar while the module lines type, not after', () => {
    for (let p = 0; p <= 1; p += 0.005) {
      const frame = storyAt(p);
      if (frame.migrated > 0) expect(frame.lines).toBeGreaterThan(BAR_LINE);
      if (frame.lines < TOTAL_LINES - 0.5)
        expect(frame.migrated).toBeLessThan(MODULES);
    }
    const halfway = storyAt(0.5);
    expect(halfway.migrated).toBeGreaterThan(0);
    expect(halfway.lines).toBeLessThan(TOTAL_LINES);
  });

  it('has no dead middle: typing starts while the window is still turning', () => {
    expect(storyAt(0.1).lines).toBeGreaterThan(0);
    expect(storyAt(0.1).rx).toBeGreaterThan(0);
  });

  it('holds the headline until the first command has been typed', () => {
    let firstLine = 0;
    while (storyAt(firstLine).lines < 1) firstLine += 0.001;
    expect(storyAt(firstLine).headline).toBeGreaterThan(0.3);
  });

  it('counts modules, then settles on the honest 30+', () => {
    expect(counterText(0)).toBe('0');
    expect(counterText(14.6)).toBe('14');
    expect(counterText(MODULES)).toBe(`${MODULES}+`);
  });

  it('clears the headline early and dims the window for the numbers', () => {
    expect(storyAt(0.2).headline).toBe(0);
    expect(storyAt(0.5).window).toBe(1);
    expect(storyAt(1).window).toBeLessThan(0.5);
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

describe('toVars', () => {
  it('writes the frame as CSS custom properties with units', () => {
    const vars = toVars(storyAt(0.1));
    expect(vars['--rx']).toMatch(/deg$/);
    expect(vars['--lift']).toMatch(/svh$/);
    expect(vars['--scale']).toMatch(/^\d+(\.\d+)?$/);
    expect(vars['--migrated']).toBe('0');
  });

  it('rounds so the style string stays short', () => {
    for (const value of Object.values(toVars(storyAt(0.4321)))) {
      expect(value.replace(/[a-z]+$/, '')).toMatch(/^-?\d+(\.\d{1,3})?$/);
    }
  });
});
