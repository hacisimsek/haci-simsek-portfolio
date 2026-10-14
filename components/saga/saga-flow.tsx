'use client';

import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
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

type Run = { saga: SagaState; byVisitor: boolean };

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

// Ticks only while the figure is on screen and the tab is visible.
function useActive<T extends Element>() {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    const onVisibility = () =>
      setTabVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onVisibility);
    let observer: IntersectionObserver | undefined;
    if (node && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) =>
        setOnScreen(entry.isIntersecting)
      );
      observer.observe(node);
    }
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      observer?.disconnect();
    };
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
        return { saga: next, byVisitor: false };
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playing, reduceMotion]);

  const { saga } = run;
  const outcome =
    run.byVisitor && (saga.phase === 'completed' || saga.phase === 'rolledBack')
      ? msg(`outcome.${saga.phase}`)
      : '';
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
              className="relative flex h-18 items-start gap-4"
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
                  'pt-0.5 text-sm transition-colors',
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
          onClick={() => setRun({ saga: withFailure(), byVisitor: true })}
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
