import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';
import { profile } from '@/content';
import { careerYears } from '@/lib/dates';
import { LINES, MODULES, storyAt, toVars } from '@/lib/story';
import StoryScroller from './story-scroller';

// A terminal window that turns to face the visitor as the page scrolls, pulls
// them in while a service boots and a saga runs, then steps back to the
// numbers. Shown on wide screens with a fine pointer (the `story` variant),
// still with reduced motion; on phones the hero saga tells the same story.
export default function RequestStory() {
  const msg = useTranslations('Story');

  return (
    <section
      id="story"
      aria-labelledby="story-title"
      data-act="0"
      className="hidden story:block"
    >
      <StoryScroller>
        <div className="relative h-[320svh]">
          <div
            data-story-scene
            className="story-stage sticky top-0 h-svh"
            style={toVars(storyAt(0)) as CSSProperties}
          >
            <span aria-hidden className="story-glow" />

            <div className="story-headline">
              <h2
                id="story-title"
                className="font-display text-[clamp(2.75rem,5.6vw,5.25rem)] leading-[1.02] font-semibold tracking-tight text-balance"
              >
                {msg('title')}
              </h2>
              <p className="mt-4 text-xl text-muted-foreground lg:text-2xl">
                {msg('lead')}
              </p>
            </div>

            <p className="sr-only">{msg('summary')}</p>

            <div aria-hidden className="story-camera">
              <div className="story-window bg-terminal text-terminal-text">
                <div className="flex h-10 items-center gap-2 border-b border-terminal-dim/15 px-4">
                  <span className="h-3 w-3 rounded-full bg-terminal-close" />
                  <span className="h-3 w-3 rounded-full bg-terminal-minimize" />
                  <span className="h-3 w-3 rounded-full bg-terminal-zoom" />
                  <span className="flex-1 pr-14 text-center font-mono text-xs text-terminal-dim">
                    order-platform — zsh
                  </span>
                </div>
                <div className="story-body font-mono">
                  <div className="story-lines">
                    <div className="story-line-static text-terminal-dim">
                      Last login: Mon 09:41 on ttys001
                    </div>
                    {LINES.map((line, index) => (
                      <div
                        key={line.text}
                        className="story-line"
                        data-tone={line.tone}
                        style={{ '--i': index } as CSSProperties}
                      >
                        {line.text}
                      </div>
                    ))}
                    <div
                      className="story-line story-migration"
                      style={{ '--i': LINES.length } as CSSProperties}
                    >
                      <span className="text-terminal-dim">modules</span>
                      <span className="story-bar">
                        <span className="story-bar-fill" />
                      </span>
                      <span>
                        <span data-story-migrated>0</span>/{MODULES}
                      </span>
                      <span className="story-done">✓ Java 21</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="story-outro">
              <p className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-tight font-semibold tracking-tight">
                {msg('outro')}
              </p>
              <dl className="mt-8 flex justify-center gap-16">
                <div>
                  <dt className="sr-only">{msg('years')}</dt>
                  <dd className="font-display text-6xl font-semibold text-accent">
                    {careerYears(profile.careerStart)}+
                  </dd>
                  <dd aria-hidden className="mt-2 text-muted-foreground">
                    {msg('years')}
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">{msg('modules')}</dt>
                  <dd className="font-display text-6xl font-semibold text-accent">
                    {MODULES}
                  </dd>
                  <dd aria-hidden className="mt-2 text-muted-foreground">
                    {msg('modules')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </StoryScroller>
    </section>
  );
}
