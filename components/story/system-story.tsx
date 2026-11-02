'use client';

import { useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import ScrubHeadline from '@/components/story/scrub-headline';
import { useStoryEnabled } from '@/hooks/use-story-enabled';
import { cn, SEPARATOR } from '@/lib/utils';

// The second beat after the hero: inside the Kafka topic the hero's request
// lands on. On wide screens with a fine pointer, scrolling walks four ideas
// (an append-only log, idempotent consumers, a failure handled by a circuit
// breaker and a saga, one trace for the whole path). Elsewhere, and for
// reduced motion, the finished state is shown as is. Accent is the forward
// flow, red the failure, purple the undo.
const STEPS = ['log', 'idempotent', 'failure', 'trace'] as const;

const PARTITIONS = 3;
const SLOTS = 7;
const EVENTS = Array.from({ length: PARTITIONS * SLOTS }, (_, i) => ({
  partition: i % PARTITIONS,
  id: 1040 + i,
}));
const DUPLICATE = 1045;
const FAILED = 1049;

// The trace of the failed order: payment gives up (red) and inventory runs
// the compensation (purple), so the trace tells step 3's story too.
const SPANS = [
  { name: 'gateway', from: 0, to: 100, tone: 'bg-accent/70' },
  { name: 'order-svc', from: 8, to: 40, tone: 'bg-accent/70' },
  { name: 'kafka publish', from: 20, to: 30, tone: 'bg-accent/70' },
  { name: 'payment-svc', from: 34, to: 58, tone: 'bg-destructive/80' },
  { name: 'inventory-svc', from: 62, to: 88, tone: 'bg-primary/80' },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function SystemStory() {
  const msg = useTranslations('SystemStory');
  const ref = useRef<HTMLElement>(null);
  const wide = useStoryEnabled();
  const reduce = useReducedMotion();
  const scrolling = wide && !reduce;
  // Scroll progress through the track, 0 when it pins and 1 when it lets
  // go. A plain rAF-throttled listener, not motion's useScroll: that one
  // drives scroll-timeline animations that never finish, which would keep
  // document.getAnimations() busy for anything waiting on motion to settle.
  const [scrolled, setScrolled] = useState(0);
  useEffect(() => {
    if (!scrolling) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const track = ref.current;
      if (!track) return;
      const range = track.offsetHeight - window.innerHeight;
      setScrolled(
        range > 0 ? clamp(-track.getBoundingClientRect().top / range) : 0
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [scrolling]);
  const p = scrolling ? scrolled : 1;

  const step = Math.max(-1, Math.min(3, Math.floor((p - 0.24) / 0.16)));
  const written = Math.round(clamp((p - 0.22) / 0.3) * EVENTS.length);
  // The working parts arrive once the headline is lit, not as an empty frame.
  const body = clamp((p - 0.14) / 0.08);
  const consumed = Math.max(0, written - 4);
  const traced = clamp((p - 0.72) / 0.16);

  return (
    <section
      ref={ref}
      id="story"
      aria-labelledby="story-title"
      className="system-story"
      data-step={scrolling ? step : 'still'}
    >
      <div className="system-story-stage flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <ScrubHeadline
            id="story-title"
            text={msg('title')}
            progress={p}
            range={[0, 0.18]}
            className="max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl lg:text-[clamp(2.75rem,6.5svh,3.75rem)]"
          />
          <p
            className="max-w-xl text-lg text-muted-foreground"
            style={{ opacity: clamp((p - 0.18) / 0.05) }}
          >
            {msg('copy')}
          </p>
        </div>

        <div
          className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]"
          style={{ opacity: body }}
        >
          <ol className="space-y-1">
            {STEPS.map((key, index) => (
              <li
                key={key}
                className={cn(
                  // Inactive steps stay readable; the active one is lit, not
                  // the others dimmed.
                  'border-l-2 px-4 py-3 transition-colors duration-300',
                  !scrolling
                    ? 'border-border/70'
                    : index === step
                      ? 'border-accent'
                      : 'border-border/50'
                )}
              >
                <h3
                  className={cn(
                    'font-semibold transition-colors duration-300',
                    scrolling && index !== step && 'text-muted-foreground'
                  )}
                >
                  <span
                    aria-hidden
                    className="mr-2 font-mono text-xs text-muted-foreground"
                  >
                    0{index + 1}
                  </span>
                  {msg(`steps.${key}.title`)}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {msg(`steps.${key}.body`)}
                </p>
              </li>
            ))}
          </ol>

          {/* The steps carry the meaning; the panel is their picture. */}
          <div
            aria-hidden
            className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 font-mono text-xs"
          >
            <div className="flex flex-col gap-1 text-muted-foreground sm:flex-row sm:justify-between sm:gap-4">
              <span>
                {msg('topic')} <span className="text-foreground">orders</span>
              </span>
              <span>
                {msg('group')}
                {SEPARATOR}payment-svc
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {Array.from({ length: PARTITIONS }, (_, partition) => (
                <div key={partition} className="flex items-center gap-3">
                  <span className="w-6 text-muted-foreground">
                    P{partition}
                  </span>
                  <div className="grid flex-1 grid-cols-7 gap-1 sm:gap-1.5">
                    {EVENTS.filter((e) => e.partition === partition).map(
                      (event) => {
                        const index = event.id - 1040;
                        const failed = step >= 2 && event.id === FAILED;
                        const repeated = step >= 1 && event.id === DUPLICATE;
                        return (
                          <span
                            key={event.id}
                            data-event={event.id}
                            className={cn(
                              'rounded-md border px-0.5 py-2 text-center text-[10px] transition-[opacity,background-color,border-color] duration-300 sm:px-1 sm:text-xs',
                              index < written ? 'opacity-100' : 'opacity-0',
                              failed
                                ? 'border-destructive bg-destructive/15 text-foreground'
                                : repeated
                                  ? 'border-dashed border-accent bg-accent/10 text-foreground'
                                  : index < consumed
                                    ? 'border-accent/40 bg-accent/10 text-foreground'
                                    : 'border-border/70 text-muted-foreground'
                            )}
                          >
                            <span className="hidden sm:inline">#</span>
                            {event.id}
                          </span>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div
                className={cn(
                  'rounded-lg border border-border/70 px-3 py-2 transition-[opacity,visibility] duration-300',
                  step >= 1 ? 'opacity-100' : 'invisible opacity-0'
                )}
              >
                <span className="text-muted-foreground">
                  {msg('redelivered')}{' '}
                </span>
                <span className="line-through">#{DUPLICATE}</span>
                <span className="text-accent">
                  {SEPARATOR}
                  {msg('skipped')}
                </span>
              </div>
              <div
                className={cn(
                  'rounded-lg border px-3 py-2 transition-[opacity,visibility,border-color] duration-300',
                  step >= 2
                    ? 'border-destructive/60 opacity-100'
                    : 'invisible border-border/70 opacity-0'
                )}
              >
                <span className="text-destructive">
                  payment #{FAILED}
                  {SEPARATOR}
                  {msg('circuit')}
                </span>
                <br />
                <span className="text-primary">← {msg('compensation')}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-border/70 pt-3">
              <p className="mb-2 text-muted-foreground">
                {msg('trace')} #{FAILED}
                {SEPARATOR}
                {Math.round(traced * 184)} ms
              </p>
              <div className="space-y-1">
                {SPANS.map((span) => (
                  <div key={span.name} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-muted-foreground">
                      {span.name}
                    </span>
                    <div className="relative h-2 flex-1 rounded-full bg-foreground/5">
                      <div
                        className={`absolute inset-y-0 rounded-full ${span.tone}`}
                        style={{
                          left: `${span.from}%`,
                          width: `${Math.max(0, Math.min(span.to, span.from + traced * 100) - span.from)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
