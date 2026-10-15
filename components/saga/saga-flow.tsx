'use client';

import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  useEffect,
  useRef,
  useState,
  useEffectEvent,
  useId,
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
  skipped: 'text-muted-foreground',
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
// request, fails at payment and compensates the earlier steps in reverse.
export default function SagaFlow({ className }: { className?: string }) {
  const msg = useTranslations('Saga');
  const titleId = useId();
  const reduceMotion = usePrefersReducedMotion();
  const [figure, active] = useActive<HTMLElement>();
  const [run, setRun] = useState<Run>({
    saga: completed(),
    byVisitor: false,
    runId: 0,
  });
  // Auto-play can be paused (WCAG 2.2.2) and is off without motion; a run
  // the visitor starts always plays.
  const [paused, setPaused] = useState(false);
  const autoPlay = !reduceMotion && !paused;
  const playing = active && (run.byVisitor || autoPlay);

  // Reads the latest autoPlay without restarting the interval, so pressing
  // Pause during a visitor run keeps the beat.
  const advance = useEffectEvent(() => {
    setRun((current) => {
      const next = tick(current.saga);
      if (!isRestart(current.saga, next)) return { ...current, saga: next };
      // Without auto-play a finished visitor run stays on screen.
      if (!autoPlay) return { ...current, byVisitor: false };
      return { ...current, saga: next, byVisitor: false };
    });
  });

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(advance, TICK_MS);
    return () => clearInterval(id);
  }, [playing, run.runId]);

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
      aria-labelledby={titleId}
      className={cn('w-full max-w-md', className)}
    >
      {/* Title and explanation come first, so the steps and controls are
          read with their meaning. */}
      <figcaption className="mb-6">
        <p id={titleId} className="font-display font-semibold">
          {msg('label')}
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {msg('caption')}
        </p>
      </figcaption>
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
                {status === 'failed'
                  ? msg(`steps.${id}.failed`)
                  : msg(`status.${status}`)}
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
        {reduceMotion ? null : (
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-full px-4 text-muted-foreground"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? (
              <Play aria-hidden className="mr-2 h-4 w-4" />
            ) : (
              <Pause aria-hidden className="mr-2 h-4 w-4" />
            )}
            {msg(paused ? 'resume' : 'pause')}
          </Button>
        )}
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
    </figure>
  );
}
