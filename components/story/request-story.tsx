import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';
import {
  BAR_LINE,
  counterText,
  LINES,
  MODULES,
  storyAt,
  toVars,
} from '@/lib/story';
import StoryScroller from './story-scroller';

// A terminal window that turns to face the visitor as the page scrolls and
// pulls them in while the Java 21 migration runs, then steps back to the
// numbers. It plays where STORY_MEDIA matches and motion is allowed;
// everywhere else (phones, tablets, touch screens, short windows, reduced
// motion) the CSS lays it out as a still headline, terminal and numbers.
export default function RequestStory() {
  const msg = useTranslations('Story');

  return (
    <section
      id="story"
      aria-labelledby="story-title"
      // Read by tests to follow the scroll; no style depends on it.
      data-act="0"
    >
      <StoryScroller>
        {/* Short enough that the story starts in the first screen. */}
        <div className="story-track">
          <div
            data-story-scene
            className="story-stage"
            style={toVars(storyAt(0)) as CSSProperties}
          >
            <span aria-hidden className="story-glow" />

            <div className="story-headline">
              <h2
                id="story-title"
                className="mx-auto max-w-[18ch] font-display text-[clamp(2.75rem,5.2vw,5rem)] leading-[1.02] font-semibold tracking-tight text-balance"
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
                  <span className="min-w-0 flex-1 truncate pr-14 text-center font-mono text-xs text-terminal-dim">
                    account-platform — zsh
                  </span>
                </div>
                <div className="story-body font-mono">
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
                    // Appears with the first module line, fills as they type.
                    style={{ '--i': BAR_LINE } as CSSProperties}
                  >
                    <span className="text-terminal-dim">modules</span>
                    <span className="story-bar">
                      <span className="story-bar-fill" />
                    </span>
                    <span>
                      {/* Full by default: the static (reduced-motion) layout
                          shows the finished run; the scroller counts up. */}
                      <span data-story-migrated>{counterText(MODULES)}</span>
                    </span>
                    <span className="story-done">✓ Java 21</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="story-outro">
              <p className="font-display text-[clamp(2rem,3.4vw,3rem)] leading-tight font-semibold tracking-tight">
                {msg('outro')}
              </p>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-16 gap-y-6">
                <li className="flex flex-col items-center">
                  <span className="font-display text-6xl font-semibold text-accent">
                    {MODULES}+
                  </span>
                  <span className="mt-2 text-muted-foreground">
                    {msg('modules')}
                  </span>
                </li>
                <li className="flex flex-col items-center">
                  <span className="font-display text-6xl font-semibold text-accent">
                    11 → 21
                  </span>
                  <span className="mt-2 text-muted-foreground">
                    {msg('java')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </StoryScroller>
    </section>
  );
}
