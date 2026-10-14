'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePathname, useRouter } from '@/i18n/navigation';
import { focusMainAfterNavigation } from '@/lib/focus-main';
import { down, emptyHistory, push, up } from '@/lib/terminal/history';
import {
  complete,
  run,
  type Effect,
  type Line,
} from '@/lib/terminal/interpreter';
import { cn } from '@/lib/utils';

const PROMPT = 'haci@istanbul:~$';
// Long enough to read the last lines ("Permission granted…") before the
// terminal closes or the page changes.
const EXIT_DELAY = 700;

export default function TerminalDialog({
  open,
  onOpenChange,
  returnFocusTo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusTo?: RefObject<HTMLElement | null>;
}) {
  const msg = useTranslations('Terminal');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [lines, setLines] = useState<Line[]>(() => [
    { kind: 'output', text: msg('welcome') },
  ]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState(emptyHistory);
  const log = useRef<HTMLDivElement>(null);
  const exitTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

  useEffect(() => {
    const node = log.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines]);

  // A half-typed command does not survive closing; history and log do.
  function changeOpen(next: boolean) {
    if (!next) setValue('');
    onOpenChange(next);
  }

  function later(action: () => void) {
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(action, EXIT_DELAY);
  }

  function apply(effect: Effect) {
    switch (effect.type) {
      case 'clear':
        setLines([]);
        break;
      case 'close':
        later(() => changeOpen(false));
        break;
      case 'theme':
        setTheme(effect.theme);
        break;
      case 'locale':
        later(() => {
          changeOpen(false);
          focusMainAfterNavigation(window.location.pathname);
          router.replace(pathname, { locale: effect.locale });
        });
        break;
      case 'navigate':
        later(() => {
          changeOpen(false);
          focusMainAfterNavigation(window.location.pathname);
          router.push(effect.href);
        });
        break;
    }
  }

  function submit() {
    const result = run(value, {
      locale,
      t: (key, values) => msg(key as Parameters<typeof msg>[0], values),
    });
    setLines((current) => [
      ...current,
      { kind: 'input', text: value },
      ...result.lines,
    ]);
    setHistory((current) => push(current, value));
    setValue('');
    if (result.effect) apply(result.effect);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const step = event.key === 'ArrowUp' ? up(history) : down(history);
      setHistory(step.history);
      setValue(step.value);
    } else if (event.key === 'Tab' && !event.shiftKey) {
      // Completion owns Tab here; Shift+Tab still moves focus. Stop the event
      // too, or the dialog focus trap moves focus to a link in the log.
      event.preventDefault();
      event.stopPropagation();
      const matches = complete(value);
      if (matches.length === 1) setValue(`${matches[0]} `);
      else if (matches.length > 1) {
        setLines((current) => [
          ...current,
          {
            kind: 'output',
            text: msg('matches', { matches: matches.join('  ') }),
          },
        ]);
      }
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent
        className="max-w-2xl border-white/10 bg-terminal font-mono text-terminal-foreground"
        onCloseAutoFocus={(event) => {
          if (!returnFocusTo?.current) return;
          event.preventDefault();
          returnFocusTo.current.focus();
        }}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span
            aria-hidden
            className="h-3 w-3 rounded-full bg-terminal-close"
          />
          <span
            aria-hidden
            className="h-3 w-3 rounded-full bg-terminal-minimize"
          />
          <span aria-hidden className="h-3 w-3 rounded-full bg-terminal-zoom" />
          <DialogTitle className="ml-2 text-xs tracking-wide text-terminal-dim">
            {msg('title')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {msg('description')}
          </DialogDescription>
        </div>
        <div
          ref={log}
          role="log"
          data-lenis-prevent
          className="max-h-[min(55vh,440px)] min-h-48 overflow-y-auto px-4 pt-4 text-sm leading-6 break-words whitespace-pre-wrap"
        >
          {lines.map((line, index) => (
            <div
              key={index}
              className={cn(
                line.kind === 'error' && 'text-terminal-error',
                line.kind === 'output' && 'text-terminal-text'
              )}
            >
              {line.kind === 'input' ? (
                <>
                  <span className="text-terminal-prompt">{PROMPT}</span>{' '}
                  {line.text}
                </>
              ) : line.href ? (
                <a
                  href={line.href}
                  target={line.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    line.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="text-terminal-prompt underline underline-offset-4"
                >
                  {line.text}
                </a>
              ) : (
                line.text
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-4 pt-2 pb-4 text-sm">
          <label htmlFor="terminal-input" className="text-terminal-prompt">
            <span aria-hidden>{PROMPT}</span>
            <span className="sr-only">{msg('inputLabel')}</span>
          </label>
          <input
            id="terminal-input"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-base text-terminal-foreground caret-terminal-prompt outline-none sm:text-sm"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
