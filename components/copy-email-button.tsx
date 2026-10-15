'use client';

import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { copyEmail } from '@/lib/copy-email';

type Result = 'copied' | 'mailto' | null;

export default function CopyEmailButton({ email }: { email: string }) {
  const msg = useTranslations('Footer');
  const [result, setResult] = useState<Result>(null);

  // Clear the message so the next copy is announced again.
  useEffect(() => {
    if (!result) return;
    const timer = window.setTimeout(() => setResult(null), 2000);
    return () => window.clearTimeout(timer);
  }, [result]);

  return (
    <>
      <Button
        type="button"
        size="lg"
        variant="outline"
        className="rounded-full px-6"
        onClick={async () => setResult(await copyEmail(email))}
      >
        {result === 'copied' ? (
          <Check aria-hidden className="mr-2 h-4 w-4 text-accent" />
        ) : (
          <Copy aria-hidden className="mr-2 h-4 w-4" />
        )}
        {msg('copyEmail')}
      </Button>
      <p role="status" className="text-sm text-muted-foreground">
        {result === 'copied' ? msg('copied') : null}
        {result === 'mailto' ? msg('openingMail') : null}
      </p>
    </>
  );
}
