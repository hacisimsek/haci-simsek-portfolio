// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { down, emptyHistory, push, up } from '@/lib/terminal/history';

describe('history', () => {
  const filled = push(push(emptyHistory, 'help'), 'whoami');

  it('walks back through previous commands and stops at the oldest', () => {
    const first = up(filled);
    expect(first.value).toBe('whoami');
    const second = up(first.history);
    expect(second.value).toBe('help');
    expect(up(second.history).value).toBe('help');
  });

  it('returns to an empty line past the newest entry', () => {
    const back = up(up(filled).history);
    const forward = down(back.history);
    expect(forward.value).toBe('whoami');
    expect(down(forward.history).value).toBe('');
    expect(down(down(forward.history).history).value).toBe('');
  });

  it('ignores blank lines and repeats of the last command', () => {
    expect(push(filled, '   ').entries).toEqual(['help', 'whoami']);
    expect(push(filled, 'whoami').entries).toEqual(['help', 'whoami']);
  });

  it('does nothing on an empty history', () => {
    expect(up(emptyHistory).value).toBe('');
  });
});
