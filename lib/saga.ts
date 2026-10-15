// A four-step order saga. Each tick moves it one step: forward through the
// services, or, after a failure, backwards through their compensations.
// Same order as the flagship repo (ecommerce-microservices).
export const STEPS = ['order', 'inventory', 'payment', 'shipping'] as const;
export type StepId = (typeof STEPS)[number];

export type StepStatus =
  | 'idle'
  | 'running'
  | 'done'
  | 'failed'
  | 'compensating'
  | 'compensated'
  /** Never ran because the saga rolled back before reaching it. */
  | 'skipped';

export type SagaPhase = 'forward' | 'compensating' | 'completed' | 'rolledBack';

export interface SagaState {
  phase: SagaPhase;
  /** The step being run or compensated. */
  index: number;
  /** The step that will fail, or null for a happy run. */
  failAt: number | null;
  statuses: StepStatus[];
  /** Ticks spent on a finished saga before it starts again. */
  held: number;
}

/** The payment is declined, so stock is released and the order cancelled. */
export const FAILING_STEP = STEPS.indexOf('payment');

/** How long a finished saga stays on screen, in ticks. */
export const HOLD_TICKS = 3;

/** A failed run (only visitors start one) stays long enough to read. */
export const FAILED_HOLD_TICKS = 8;

export function start(failAt: number | null = null): SagaState {
  return {
    phase: 'forward',
    index: 0,
    failAt,
    statuses: STEPS.map((_, i) => (i === 0 ? 'running' : 'idle')),
    held: 0,
  };
}

/** A happy run that has already finished: the still picture of the saga. */
export function completed(): SagaState {
  return {
    phase: 'completed',
    index: STEPS.length - 1,
    failAt: null,
    statuses: STEPS.map(() => 'done'),
    held: 0,
  };
}

/** A fresh run in which the payment fails, whatever was on screen before. */
export function withFailure(): SagaState {
  return start(FAILING_STEP);
}

function compensateFrom(
  statuses: StepStatus[],
  index: number
): Pick<SagaState, 'phase' | 'index' | 'statuses'> {
  if (index < 0) {
    return {
      phase: 'rolledBack',
      index: 0,
      statuses: statuses.map((status) =>
        status === 'idle' ? 'skipped' : status
      ),
    };
  }
  statuses[index] = 'compensating';
  return { phase: 'compensating', index, statuses };
}

export function tick(state: SagaState): SagaState {
  const statuses = [...state.statuses];
  const { index } = state;

  switch (state.phase) {
    case 'forward': {
      if (state.failAt === index) {
        statuses[index] = 'failed';
        return { ...state, ...compensateFrom(statuses, index - 1) };
      }
      statuses[index] = 'done';
      if (index + 1 >= STEPS.length) {
        return { ...state, phase: 'completed', statuses };
      }
      statuses[index + 1] = 'running';
      return { ...state, index: index + 1, statuses };
    }
    case 'compensating': {
      statuses[index] = 'compensated';
      return { ...state, ...compensateFrom(statuses, index - 1) };
    }
    default:
      return state.held + 1 >=
        (state.failAt === null ? HOLD_TICKS : FAILED_HOLD_TICKS)
        ? start()
        : { ...state, held: state.held + 1 };
  }
}
