'use client';

import { SquareTerminal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { openTerminal } from '@/lib/terminal/open';

// The 404 as a shell session: the visitor "cd"-ed somewhere that isn't there.
export default function NotFoundTerminal() {
  const msg = useTranslations('NotFound');
  const pathname = usePathname();

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-terminal p-5 font-mono text-sm leading-7 text-terminal-text">
      <p>
        <span className="text-terminal-prompt">haci@istanbul:~$</span> cd{' '}
        {pathname}
      </p>
      <p className="text-terminal-error">
        cd: {pathname}: {msg('noSuchFile')}
      </p>
      <p className="text-terminal-dim">exit status 404</p>
      <Button
        type="button"
        variant="outline"
        className="mt-4 rounded-full border-white/20 bg-transparent font-sans text-terminal-foreground hover:bg-white/10"
        onClick={openTerminal}
      >
        <SquareTerminal aria-hidden className="mr-2 h-4 w-4" />
        {msg('openTerminal')}
      </Button>
    </div>
  );
}
