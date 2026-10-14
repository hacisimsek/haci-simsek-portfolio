import { describe, expect, it } from 'vitest';
import {
  FAILING_STEP,
  HOLD_TICKS,
  STEPS,
  start,
  tick,
  withFailure,
  type SagaState,
} from '@/lib/saga';

function run(state: SagaState, ticks: number) {
  let next = state;
  for (let i = 0; i < ticks; i += 1) next = tick(next);
  return next;
}

describe('saga', () => {
  it('starts by running the first step', () => {
    const state = start();
    expect(state.phase).toBe('forward');
    expect(state.statuses).toEqual(['running', 'idle', 'idle', 'idle']);
  });

  it('completes a happy run step by step', () => {
    const state = run(start(), STEPS.length);
    expect(state.phase).toBe('completed');
    expect(state.statuses).toEqual(['done', 'done', 'done', 'done']);
  });

  it('fails inventory and compensates the earlier steps in reverse', () => {
    let state = run(start(FAILING_STEP), 2);
    expect(state.statuses).toEqual(['done', 'done', 'running', 'idle']);
    state = tick(state);
    expect(state.phase).toBe('compensating');
    expect(state.statuses).toEqual(['done', 'compensating', 'failed', 'idle']);
    state = run(state, 2);
    expect(state.phase).toBe('rolledBack');
    expect(state.statuses).toEqual([
      'compensated',
      'compensated',
      'failed',
      'idle',
    ]);
  });

  it('holds a finished saga, then starts a happy run again', () => {
    const finished = run(start(), STEPS.length);
    expect(run(finished, HOLD_TICKS - 1).phase).toBe('completed');
    const restarted = run(finished, HOLD_TICKS);
    expect(restarted.phase).toBe('forward');
    expect(restarted.failAt).toBeNull();
    expect(restarted.statuses[0]).toBe('running');
  });

  it('runs the failure scenario from the inventory step', () => {
    expect(STEPS[FAILING_STEP]).toBe('inventory');
    expect(withFailure()).toEqual(start(FAILING_STEP));
  });
});
