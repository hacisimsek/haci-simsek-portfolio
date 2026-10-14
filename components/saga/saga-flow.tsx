'use client';

import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react';
import { Button } from '@/components/ui/button';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import {
  completed,
  STEPS,
  tick,
  withFailure,
  type SagaState,
} from '@/lib/saga';
import { cn } from '@/lib/utils';

export const TICK_MS = 900;

const FLAGSHIP = 'https://github.com/hacisimsek/ecommerce-microservices';

// runId changes on every button press, which restarts the interval so the
// visitor's run gets full ticks from its first step.
type Run = { saga: SagaState; byVisitor: boolean; runId: number };

const STATUS_COLOUR = {
  idle: 'text-muted-foreground',
  running: 'text-foreground',
  done: 'text-accent',
  failed: 'text-destructive',
  compensating: 'text-primary',
  compensated: 'text-primary',
} as const;

function isRestart(previous: SagaState, next: SagaState) {
  return previous.phase !== 'forward' && next.phase === 'forward';
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

// Ticks only while the figure is on screen and the tab is visible, including
// a tab that was already in the background when the page loaded.
function useActive<T extends Element>() {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState(true);
  const tabVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState !== 'hidden',
    () => true
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting)
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, onScreen && tabVisible] as const;
}

// The hero's signature piece: an order saga that runs by itself and, on
// request, fails at inventory and compensates the earlier steps in reverse.
export default function SagaFlow({ className }: { className?: string }) {
  const msg = useTranslations('Saga');
  const reduceMotion = usePrefersReducedMotion();
  const [figure, active] = useActive<HTMLElement>();
  const [run, setRun] = useState<Run>({
    saga: completed(),
    byVisitor: false,
    runId: 0,
  });
  // Without motion the saga only moves when the visitor starts it.
  const playing = active && (!reduceMotion || run.byVisitor);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setRun((current) => {
        const next = tick(current.saga);
        if (!isRestart(current.saga, next)) return { ...current, saga: next };
        // A finished visitor run stays on screen when motion is reduced.
        if (reduceMotion) return { ...current, byVisitor: false };
        return { ...current, saga: next, byVisitor: false };
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playing, reduceMotion, run.runId]);

  const { saga } = run;
  // Only a visitor run can fail, so a rolled-back saga is always theirs; the
  // sentence stays as long as the result does.
  const outcome =
    saga.failAt !== null && saga.phase === 'rolledBack' ? msg('outcome') : '';
  const backwards =
    saga.phase === 'compensating' || saga.phase === 'rolledBack';

  return (
    <figure
      ref={figure}
      aria-label={msg('label')}
      className={cn('w-full max-w-md', className)}
    >
      <ol
        className="saga relative"
        style={{ '--step': saga.index } as CSSProperties}
      >
        <span
          aria-hidden
          className="absolute top-4 bottom-4 left-[11.5px] w-px bg-border"
        />
        <span
          aria-hidden
          data-backwards={backwards || undefined}
          className="saga-pulse"
        />
        {STEPS.map((id, index) => {
          const status = saga.statuses[index];
          const undoing = status === 'compensating' || status === 'compensated';
          return (
            <li
              key={id}
              data-status={status}
              className="saga-row relative flex items-start gap-4"
            >
              <span
                aria-hidden
                className={cn(
                  'relative mt-1 h-6 w-6 shrink-0 rounded-full border-2 border-border bg-background transition-colors',
                  status === 'done' && 'border-accent',
                  status === 'running' && 'border-foreground',
                  status === 'failed' && 'border-destructive',
                  undoing && 'border-primary'
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold">
                  {msg(`steps.${id}.name`)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {undoing
                    ? msg(`steps.${id}.undo`)
                    : msg(`steps.${id}.action`)}
                </p>
              </div>
              <p
                className={cn(
                  'shrink-0 pt-0.5 text-sm transition-colors',
                  STATUS_COLOUR[status]
                )}
              >
                {msg(`status.${status}`)}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full px-5"
          onClick={() =>
            setRun((current) => ({
              saga: withFailure(),
              byVisitor: true,
              runId: current.runId + 1,
            }))
          }
        >
          {msg('run')}
        </Button>
        <a
          href={FLAGSHIP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {msg('code')}
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </a>
      </div>
      <p role="status" className="mt-2 min-h-5 text-sm text-foreground">
        {outcome}
      </p>
      <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
        {msg('caption')}
      </figcaption>
    </figure>
  );
}
