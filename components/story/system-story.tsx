import { useTranslations } from 'next-intl';
import SystemDiagram from '@/components/sections/system-diagram';

// The second beat after the hero: four ideas about event-driven services (an
// append-only log, idempotent consumers, a failure handled by a circuit
// breaker and a saga, one trace for the whole path). Where the story scrolls,
// HeroStory keeps the hero's diagram in place and each step lights its layer
// of it; everywhere else the finished diagram sits with the steps. Accent is
// the forward flow, red the failure, purple the undo.
const STEPS = ['log', 'idempotent', 'failure', 'trace'] as const;

export default function SystemStory() {
  const msg = useTranslations('SystemStory');

  return (
    <section id="story" aria-labelledby="story-title" className="system-story">
      <div className="flex flex-col gap-4">
        <h2
          id="story-title"
          className="max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl lg:text-[clamp(2.75rem,6.5svh,3.75rem)]"
        >
          {msg('title')}
        </h2>
        <p className="max-w-xl text-lg text-muted-foreground">{msg('copy')}</p>
      </div>

      <div className="system-story-body mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:items-center">
        <ol className="space-y-1">
          {STEPS.map((key, index) => (
            <li
              key={key}
              data-story-step={index}
              className="border-l-2 border-border/70 px-4 py-3 transition-colors duration-300"
            >
              <h3 className="font-semibold">
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

        {/* The steps carry the meaning; the drawing is their picture. */}
        <div className="system-story-picture hidden sm:block">
          <SystemDiagram finished className="w-full" />
        </div>
      </div>
    </section>
  );
}
